-- ============================================================
-- 2coreStudio — database RESET
-- Drops every app object so 2corestudio_schema.sql + seed.sql
-- (this repo's canonical schema) can be re-applied cleanly.
--
-- Run in the Supabase SQL Editor, IN THIS ORDER:
--   1. reset.sql
--   2. 2corestudio_schema.sql
--   3. seed.sql
--
-- NOTE: wipes your profiles row + role. Re-register at /profile,
-- then re-run the admin promote snippet at the bottom of seed.sql.
-- ============================================================

begin;

-- Auth-level trigger on auth.users that auto-creates profiles
drop trigger if exists on_auth_user_created on auth.users;

-- App tables (policies drop with their tables)
drop table if exists public.posts cascade;
drop table if exists public.app_events cascade;
drop table if exists public.app_platforms cascade;
drop table if exists public.apps cascade;
drop table if exists public.profiles cascade;

-- Helper functions used by the schema below
drop function if exists public.is_admin() cascade;
drop function if exists public.set_updated_at() cascade;
drop function if exists public.handle_new_user() cascade;

commit;
