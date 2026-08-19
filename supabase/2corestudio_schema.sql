-- ============================================================
-- 2coreStudio — database schema (tables, RLS, helpers)
-- Run this FIRST in the Supabase SQL Editor, then seed.sql.
-- ============================================================

-- ------------------------------------------------------------
-- EXTENSIONS
-- ------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- updated_at TRIGGER HELPER
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------
-- PROFILES
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  account_tier text not null default 'standard'
    check (account_tier in ('standard', 'premium')),
  role text not null default 'user'
    check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile row when a user signs up.
-- Username is derived from the email local-part (e.g. bob@x.com -> "bob"),
-- with a numeric suffix if the base is already taken.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base      text := split_part(new.email, '@', 1);
  candidate text := base;
  suffix    int  := 1;
begin
  while exists (select 1 from public.profiles where username = candidate) loop
    candidate := base || suffix::text;
    suffix := suffix + 1;
  end loop;

  insert into public.profiles (id, username, full_name)
  values (new.id, candidate, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- APPS
-- ------------------------------------------------------------
create table if not exists public.apps (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  detailed_body text,
  category text not null default 'Utility'
    check (category in ('Gaming', 'Utility', 'SaaS')),
  access_tier text not null default 'instant'
    check (access_tier in ('instant', 'account', 'premium')),
  requires_auth boolean not null default false,
  is_published boolean not null default false,
  thumbnail_url text,
  banner_url text,
  youtube_embed_id text,
  is_premium boolean not null default false,
  product_sku text,
  is_featured boolean not null default false,
  featured_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger apps_updated_at
  before update on public.apps
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- APP_PLATFORMS
-- ------------------------------------------------------------
create table if not exists public.app_platforms (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references public.apps (id) on delete cascade,
  platform text not null
    check (platform in ('web', 'windows', 'mac', 'android', 'ios', 'linux')),
  url text not null,
  version text,
  changelog text,
  released_at timestamptz,
  created_at timestamptz not null default now(),
  unique (app_id, platform)
);

-- ------------------------------------------------------------
-- APP_EVENTS (view/download analytics)
-- ------------------------------------------------------------
create table if not exists public.app_events (
  id uuid primary key default gen_random_uuid(),
  app_id uuid references public.apps (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  event text not null check (event in ('view', 'download')),
  platform text,
  created_at timestamptz not null default now()
);

create index if not exists app_events_app_id_idx
  on public.app_events (app_id);

create index if not exists app_events_created_at_idx
  on public.app_events (created_at desc);

-- ------------------------------------------------------------
-- POSTS (news / blog)
-- ------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text,
  cover_url text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- is_admin() HELPER
-- ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.apps enable row level security;
alter table public.app_platforms enable row level security;
alter table public.app_events enable row level security;
alter table public.posts enable row level security;

-- PROFILES
-- anyone can read their own, admins can read all
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

-- users can update their own profile (not role / not id)
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from public.profiles where id = auth.uid())
  );

-- admins can do everything
create policy "profiles_admin_all"
  on public.profiles for all
  using (public.is_admin());

-- APPS
-- only published apps are readable by everyone
create policy "apps_select_published"
  on public.apps for select
  using (is_published = true);

-- admins can do everything
create policy "apps_admin_all"
  on public.apps for all
  using (public.is_admin());

-- APP_PLATFORMS
-- everyone (including anon) can read platforms of published apps
create policy "app_platforms_select_published"
  on public.app_platforms for select
  using (
    exists (
      select 1 from public.apps
      where apps.id = app_platforms.app_id and apps.is_published = true
    )
  );

-- admins can do everything
create policy "app_platforms_admin_all"
  on public.app_platforms for all
  using (public.is_admin());

-- APP_EVENTS
-- anyone can insert analytics events
create policy "app_events_insert_anon"
  on public.app_events for insert
  with check (true);

-- users can read their own events, admins can read all
create policy "app_events_select_own"
  on public.app_events for select
  using (user_id = auth.uid() or public.is_admin());

-- admins can delete
create policy "app_events_admin_delete"
  on public.app_events for delete
  using (public.is_admin());

-- POSTS
-- only published posts are readable by everyone
create policy "posts_select_published"
  on public.posts for select
  using (is_published = true);

-- admins can do everything
create policy "posts_admin_all"
  on public.posts for all
  using (public.is_admin());

-- ------------------------------------------------------------
-- PRIVILEGES
-- Required for the anon/authenticated keys to read/write through
-- the API. Without these, queries fail with "permission denied
-- for table apps".
-- ------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;

grant all on table public.profiles     to anon, authenticated, service_role;
grant all on table public.apps         to anon, authenticated, service_role;
grant all on table public.app_platforms to anon, authenticated, service_role;
grant all on table public.app_events   to anon, authenticated, service_role;
grant all on table public.posts        to anon, authenticated, service_role;

grant execute on function public.is_admin()       to anon, authenticated, service_role;
grant execute on function public.handle_new_user() to anon, authenticated, service_role;
grant execute on function public.set_updated_at()  to anon, authenticated, service_role;