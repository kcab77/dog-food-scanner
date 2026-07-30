-- Accounts + dog profile + AI memory, Phase 1: schema.
-- Memory = a structured dog_profiles row fetched server-side and injected
-- into the AI system prompt fresh on every request -- NOT raw transcript
-- replay. chat_messages is a secondary "show past conversation" feature,
-- not the memory mechanism itself. Safe/idempotent.

-- Shared updated_at trigger (none exists in this project yet)
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------
-- dog_profiles: one row per account (v1 = single dog per account,
-- matches the website's existing upsert-by-user_id design)
-- ---------------------------------------------------------------
create table if not exists public.dog_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  dog_name text not null check (char_length(btrim(dog_name)) between 1 and 60),
  breed text check (char_length(breed) <= 100),
  age text check (char_length(age) <= 60),             -- free text: "7 years", "puppy, 8 months"
  weight text check (char_length(weight) <= 40),        -- free text: "65 lbs" -- avoids unit-conversion scope
  diet text check (char_length(diet) <= 2000),
  supplements text check (char_length(supplements) <= 2000),
  conditions text check (char_length(conditions) <= 2000),
  goals text check (char_length(goals) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.dog_profiles enable row level security;

do $$ begin
  create policy "select own dog profile" on public.dog_profiles
    for select to authenticated using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "insert own dog profile" on public.dog_profiles
    for insert to authenticated with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "update own dog profile" on public.dog_profiles
    for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "delete own dog profile" on public.dog_profiles
    for delete to authenticated using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

drop trigger if exists dog_profiles_set_updated_at on public.dog_profiles;
create trigger dog_profiles_set_updated_at
  before update on public.dog_profiles
  for each row execute function public.set_updated_at();

-- No anon policy at all -- default-deny for unauthenticated access, by design.

-- ---------------------------------------------------------------
-- chat_messages: secondary history/continuity feature, NOT the
-- memory mechanism. v1 = single continuous thread per user per
-- surface (website vs app), keyed by a fixed session_id so
-- "load history on mount" is a trivial query.
-- ---------------------------------------------------------------
create table if not exists public.chat_messages (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id text not null default 'default',
  source text not null default 'website' check (source in ('website', 'app')),
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(content) <= 8000),
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_user_session_idx
  on public.chat_messages (user_id, session_id, created_at);

alter table public.chat_messages enable row level security;

do $$ begin
  create policy "select own chat messages" on public.chat_messages
    for select to authenticated using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "insert own chat messages" on public.chat_messages
    for insert to authenticated with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- No update/delete policy for v1 (immutable history). No anon policy.
