-- PawGrade revamp: source-tagged owned product DB + Go-UPC monthly quota
-- Safe/idempotent. Total-score math untouched (this is data plumbing only).

-- 1) products.source — which pipeline the row came from
alter table public.products add column if not exists source text;
alter table public.products add column if not exists updated_at timestamptz default now();

-- Backfill existing untagged rows as legacy_unknown so owned-only lookups exclude them.
-- Kyle then re-tags: the ~20 Go-UPC rows -> 'go-upc'; the European set -> its confirmed origin.
update public.products set source = 'legacy_unknown' where source is null;

-- 2) barcode_quota — monthly Go-UPC lookup counter (150/mo free plan)
create table if not exists public.barcode_quota (
  month text primary key,            -- 'YYYY-MM'
  used int not null default 0,
  updated_at timestamptz default now()
);
alter table public.barcode_quota enable row level security;
do $$ begin
  create policy "anon read barcode_quota"   on public.barcode_quota for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "anon insert barcode_quota" on public.barcode_quota for insert with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "anon update barcode_quota" on public.barcode_quota for update using (true);
exception when duplicate_object then null; end $$;

-- 3) atomic increment (avoids read-then-write races)
create or replace function public.increment_barcode_quota(p_month text)
returns int language plpgsql security definer as $$
declare v_used int;
begin
  insert into public.barcode_quota(month, used, updated_at)
  values (p_month, 1, now())
  on conflict (month) do update set used = public.barcode_quota.used + 1, updated_at = now()
  returning used into v_used;
  return v_used;
end $$;
grant execute on function public.increment_barcode_quota(text) to anon;
