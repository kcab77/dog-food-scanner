-- Accounts + dog profile + AI memory, Phase 1: RLS hardening.
-- Adding sensitive new tables (dog_profiles, chat_messages) to this project
-- is a good moment to fix real gaps found in the existing policies while
-- touching RLS anyway. Safe/idempotent. Anonymous scanning/feedback MUST
-- keep working -- nothing here removes the ability to use the app without
-- an account, it only tightens what's accepted.

-- barcode_quota: drop the two policies that are provably dead code -- the
-- only writer is increment_barcode_quota(), which is SECURITY DEFINER and
-- bypasses RLS entirely. Verified via full-repo grep: no client code calls
-- .insert()/.update() on this table directly. Leaving these in place lets
-- anyone with the public anon key reset their own quota via a raw REST call.
drop policy if exists "anon insert barcode_quota" on public.barcode_quota;
drop policy if exists "anon update barcode_quota" on public.barcode_quota;
-- "anon read barcode_quota" stays -- used by getBarcodeQuota(), a global
-- monthly counter with no user data, fine to read.

-- feedback: anon INSERT must stay (anonymous feedback is a hard
-- requirement). Harden with a WITH CHECK instead of removing access.
drop policy if exists "app can insert feedback" on public.feedback;
do $$ begin
  create policy "validated feedback insert" on public.feedback
    for insert to anon, authenticated
    with check (char_length(btrim(message)) between 1 and 4000);
exception when duplicate_object then null; end $$;

-- scans: same treatment -- anonymous scanning must keep working.
drop policy if exists "app can insert scans" on public.scans;
do $$ begin
  create policy "validated scan insert" on public.scans
    for insert to anon, authenticated
    with check (
      char_length(coalesce(product_name, '')) <= 300
      and (score is null or score between 0 and 100)
    );
exception when duplicate_object then null; end $$;
-- Deliberately still no SELECT policy on feedback or scans -- stays
-- unreadable via the API (service_role only), which is already the status
-- quo and correct: no per-user read path is being built for scan/feedback
-- history in this feature.

-- products / ingredients: anon INSERT is a live, in-use crowdsourced-cache
-- write path (lib/ingredientLookup.js, lib/productLookup.js) -- cannot be
-- removed without breaking real scans. Add content validation only.
drop policy if exists "Allow public insert" on public.products;
do $$ begin
  create policy "validated product insert" on public.products
    for insert to anon, authenticated
    with check (btrim(barcode) <> '' and char_length(product_name) <= 300);
exception when duplicate_object then null; end $$;

drop policy if exists "Allow public insert" on public.ingredients;
do $$ begin
  create policy "validated ingredient insert" on public.ingredients
    for insert to anon, authenticated
    with check (char_length(name) <= 200);
exception when duplicate_object then null; end $$;
-- SELECT (true) stays on both -- required for anonymous scanning to work.
