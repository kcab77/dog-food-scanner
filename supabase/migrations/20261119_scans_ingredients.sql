-- Store WHAT was scanned, not just how many ingredients (Kyle, 2026-11-19).
-- Before this, a scan row had product_name + score + ingredient_count only, so
-- there was no way to see which ingredients a real user's food contained.
--
-- RUN ONCE: Supabase dashboard → SQL Editor → paste this → Run.
-- Safe to run twice (IF NOT EXISTS). Additive only — no existing data changes.
-- The app works whether or not this has run: lib/supabase.js retries the
-- insert without these columns if they're missing, so no scan row is lost.

alter table public.scans add column if not exists ingredients text[];
alter table public.scans add column if not exists flagged_ingredients text[];

-- Keep the anon insert path bounded (same spirit as 20260722_rls_hardening.sql).
alter table public.scans drop constraint if exists scans_ingredients_size;
alter table public.scans add constraint scans_ingredients_size
  check (coalesce(array_length(ingredients, 1), 0) <= 200
     and coalesce(array_length(flagged_ingredients, 1), 0) <= 100);
