-- ============================================================================
-- Expert Knowledge Platform — Step 1: schema + pgvector + RLS
-- ============================================================================
-- A two-sided, multi-tenant platform. Each "expert" owns an isolated knowledge
-- base. STUDIO (private) is used by the authenticated expert; ASSISTANT (public)
-- is used by their logged-out audience.
--
-- RLS model (important):
--   * Authenticated expert  -> can read/write ONLY their own rows (owner-scoped).
--   * Anonymous audience     -> NO direct table access at all. The public
--     Assistant reads/writes through server routes that use the Supabase
--     SERVICE ROLE key (which bypasses RLS) and are hard-scoped to one expert_id.
--   This keeps "an expert can only ever read/write their own rows" literally true
--   for every client-side/authenticated path, while the trusted server mediates
--   public traffic.
--
-- Embedding provider: Voyage `voyage-3` (1024-dim) — chosen because it's already
-- in use elsewhere in this org and the key exists. Swap the dimension below if you
-- change providers (OpenAI text-embedding-3-small = 1536, etc.).
-- ============================================================================

create extension if not exists vector;      -- pgvector
create extension if not exists pgcrypto;    -- gen_random_uuid()

-- Shared updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ---------------------------------------------------------------------------
-- experts — one knowledge base per row, owned by a Supabase auth user
-- ---------------------------------------------------------------------------
create table public.experts (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid not null references auth.users(id) on delete cascade,
  name           text not null check (char_length(name) between 1 and 200),
  slug           text not null unique check (slug ~ '^[a-z0-9-]{2,60}$'),
  persona_prompt text not null default '',      -- system voice for the Assistant
  store_base_url text,                          -- product links resolve against this
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index experts_owner_idx on public.experts(owner_id);

drop trigger if exists experts_set_updated_at on public.experts;
create trigger experts_set_updated_at before update on public.experts
  for each row execute function public.set_updated_at();

-- Ownership helper. SECURITY DEFINER so it can read `experts` regardless of the
-- caller's own RLS, but it only ever answers "does the CURRENT auth user own e?".
create or replace function public.owns_expert(e uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.experts x where x.id = e and x.owner_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- sources — a book, video, blog post, or a Studio capture
-- ---------------------------------------------------------------------------
create type public.source_type as enum ('book', 'video', 'post', 'studio');

create table public.sources (
  id          uuid primary key default gen_random_uuid(),
  expert_id   uuid not null references public.experts(id) on delete cascade,
  type        public.source_type not null,
  title       text not null,
  url         text,
  metadata    jsonb not null default '{}',   -- e.g. { "youtube_id", "duration", "author" }
  ingested_at timestamptz not null default now()
);
create index sources_expert_idx on public.sources(expert_id);
-- Idempotent re-ingest: one row per (expert, url) when a url exists.
create unique index sources_expert_url_uidx
  on public.sources(expert_id, url) where url is not null;

-- ---------------------------------------------------------------------------
-- chunks — embedded ~500-token slices, the retrieval unit
-- ---------------------------------------------------------------------------
create table public.chunks (
  id          uuid primary key default gen_random_uuid(),
  source_id   uuid not null references public.sources(id) on delete cascade,
  expert_id   uuid not null references public.experts(id) on delete cascade,
  content     text not null,
  embedding   vector(1024),
  token_count int,
  chunk_index int not null default 0,
  created_at  timestamptz not null default now()
);
create index chunks_expert_idx on public.chunks(expert_id);
-- ANN index for cosine similarity. HNSW = better recall/latency than ivfflat.
create index chunks_embedding_hnsw
  on public.chunks using hnsw (embedding vector_cosine_ops);

-- ---------------------------------------------------------------------------
-- products — surfaced by the Assistant when relevant
-- ---------------------------------------------------------------------------
create table public.products (
  id         uuid primary key default gen_random_uuid(),
  expert_id  uuid not null references public.experts(id) on delete cascade,
  name       text not null,
  slug       text not null,
  url        text,                            -- absolute, or resolved vs store_base_url
  keywords   text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (expert_id, slug)
);
create index products_expert_idx on public.products(expert_id);

-- ---------------------------------------------------------------------------
-- conversations / messages — public Assistant transcripts
-- ---------------------------------------------------------------------------
create table public.conversations (
  id         uuid primary key default gen_random_uuid(),
  expert_id  uuid not null references public.experts(id) on delete cascade,
  visitor_id text,                            -- anon cookie id, NOT an auth user
  started_at timestamptz not null default now()
);
create index conversations_expert_idx on public.conversations(expert_id);

create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  expert_id       uuid not null references public.experts(id) on delete cascade,
  role            text not null check (role in ('user', 'assistant')),
  content         text not null,
  citations       jsonb not null default '[]', -- [{ source_id, title, url, type }]
  refused         boolean not null default false, -- true = refusal-path answer
  created_at      timestamptz not null default now()
);
create index messages_conversation_idx on public.messages(conversation_id, created_at);
create index messages_expert_idx on public.messages(expert_id);

-- ---------------------------------------------------------------------------
-- unanswered — every question the KB couldn't answer (feeds the gap report)
-- ---------------------------------------------------------------------------
create table public.unanswered (
  id         uuid primary key default gen_random_uuid(),
  expert_id  uuid not null references public.experts(id) on delete cascade,
  question   text not null,
  embedding  vector(1024),                    -- for clustering in the gap report
  cluster_id uuid,
  asked_at   timestamptz not null default now()
);
create index unanswered_expert_idx on public.unanswered(expert_id, asked_at);

-- ---------------------------------------------------------------------------
-- usage_events — per-expert metering (inference cost scales with audience)
-- ---------------------------------------------------------------------------
create table public.usage_events (
  id            bigint generated always as identity primary key,
  expert_id     uuid not null references public.experts(id) on delete cascade,
  kind          text not null check (kind in ('chat', 'embed', 'studio')),
  input_tokens  int not null default 0,
  output_tokens int not null default 0,
  embed_tokens  int not null default 0,
  created_at    timestamptz not null default now()
);
create index usage_expert_time_idx on public.usage_events(expert_id, created_at);

-- ---------------------------------------------------------------------------
-- Retrieval with a relevance floor (Step 3 uses this). SECURITY DEFINER +
-- execute granted to service_role ONLY, so it's callable from the trusted
-- server route (scoped to one expert) but never directly by anon/authenticated.
-- Returns nothing when nothing clears the threshold -> caller takes refusal path.
-- ---------------------------------------------------------------------------
create or replace function public.match_chunks(
  p_expert uuid,
  query_embedding vector(1024),
  match_count int default 8,
  similarity_threshold float default 0.0
)
returns table (id uuid, source_id uuid, content text, similarity float, token_count int)
language sql stable security definer set search_path = public as $$
  select c.id, c.source_id, c.content,
         1 - (c.embedding <=> query_embedding) as similarity,
         c.token_count
  from public.chunks c
  where c.expert_id = p_expert
    and c.embedding is not null
    and 1 - (c.embedding <=> query_embedding) >= similarity_threshold
  order by c.embedding <=> query_embedding
  limit match_count;
$$;

revoke all on function public.match_chunks(uuid, vector, int, float) from public, anon, authenticated;
grant execute on function public.match_chunks(uuid, vector, int, float) to service_role;

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.experts       enable row level security;
alter table public.sources       enable row level security;
alter table public.chunks        enable row level security;
alter table public.products      enable row level security;
alter table public.conversations enable row level security;
alter table public.messages      enable row level security;
alter table public.unanswered    enable row level security;
alter table public.usage_events  enable row level security;

-- experts: owner-scoped full CRUD for the authenticated owner. No anon.
create policy "experts_select_own" on public.experts
  for select to authenticated using (owner_id = auth.uid());
create policy "experts_insert_own" on public.experts
  for insert to authenticated with check (owner_id = auth.uid());
create policy "experts_update_own" on public.experts
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "experts_delete_own" on public.experts
  for delete to authenticated using (owner_id = auth.uid());

-- All child tables: authenticated access only where the row's expert is owned by
-- the caller. Anon has NO policy on any table => denied. The public Assistant
-- path runs server-side under service_role, which bypasses RLS entirely.
-- (Pattern applied per-table below; read/write both gated on owns_expert().)

-- sources
create policy "sources_rw_own" on public.sources
  for all to authenticated using (public.owns_expert(expert_id)) with check (public.owns_expert(expert_id));
-- chunks
create policy "chunks_rw_own" on public.chunks
  for all to authenticated using (public.owns_expert(expert_id)) with check (public.owns_expert(expert_id));
-- products
create policy "products_rw_own" on public.products
  for all to authenticated using (public.owns_expert(expert_id)) with check (public.owns_expert(expert_id));
-- conversations (expert reads their audience's threads; writes happen server-side)
create policy "conversations_rw_own" on public.conversations
  for all to authenticated using (public.owns_expert(expert_id)) with check (public.owns_expert(expert_id));
-- messages
create policy "messages_rw_own" on public.messages
  for all to authenticated using (public.owns_expert(expert_id)) with check (public.owns_expert(expert_id));
-- unanswered
create policy "unanswered_rw_own" on public.unanswered
  for all to authenticated using (public.owns_expert(expert_id)) with check (public.owns_expert(expert_id));
-- usage_events (read-only for the expert; only the server writes these)
create policy "usage_select_own" on public.usage_events
  for select to authenticated using (public.owns_expert(expert_id));

-- Note: no INSERT/UPDATE/DELETE policy for anon anywhere, and no policy at all
-- for the anon role => the anon key cannot touch these tables. Verified intent:
-- the ONLY public write path (audience messages, unanswered, usage) is the
-- server route holding the service_role key.
