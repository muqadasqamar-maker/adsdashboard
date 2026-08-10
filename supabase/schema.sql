-- ============================================================
-- ActivatUs client portal — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard -> SQL -> New query).
--
-- Three tables back the portal:
--   clients   the interim client registry (later served by platform.activatus.com)
--   invites   per-client invite tokens that gate sign-up
--   profiles  the account -> client binding (one row per auth user)
--
-- All reads/writes happen server-side with the service_role key, which
-- bypasses RLS. We enable RLS with NO permissive policies so the anon key
-- (the browser) can never read these tables directly. Auth itself is handled
-- by Supabase Auth (auth.users), not these tables.
-- ============================================================

-- ---- clients (registry) ------------------------------------
create table if not exists public.clients (
  id                  text primary key,           -- slug, e.g. 'benetech'
  name                text not null,              -- display name, e.g. 'Bookshare'
  clickup_customer    text,                       -- ClickUp "Customer" field value
  clickup_list_ids    text[] not null default '{}',
  ad_grant_account_id text,                        -- platform account id (mock for now)
  created_at          timestamptz not null default now()
);

-- ---- invites (gate sign-up) --------------------------------
create table if not exists public.invites (
  token       text primary key,                    -- long unguessable string
  client_id   text not null references public.clients(id) on delete cascade,
  active      boolean not null default true,
  expires_at  timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists invites_client_idx on public.invites(client_id);

-- ---- profiles (account -> client) --------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  client_id  text not null references public.clients(id) on delete restrict,
  created_at timestamptz not null default now()
);
create index if not exists profiles_client_idx on public.profiles(client_id);

-- ---- lock everything down (service role bypasses RLS) ------
alter table public.clients  enable row level security;
alter table public.invites  enable row level security;
alter table public.profiles enable row level security;
-- No policies added on purpose: the browser (anon key) gets nothing;
-- the serverless functions use the service_role key.

-- ---- seed: one client + one demo invite --------------------
-- Benetech / Bookshare, wired to the real Back-to-School 2026 list.
insert into public.clients (id, name, clickup_customer, clickup_list_ids, ad_grant_account_id)
values ('benetech', 'Bookshare', 'Benetech', array['901820231824'], null)
on conflict (id) do update
  set name = excluded.name,
      clickup_customer = excluded.clickup_customer,
      clickup_list_ids = excluded.clickup_list_ids;

-- Demo invite. REPLACE the token with a long random string for real use,
-- and mint one per client. (This one is just to test the flow.)
insert into public.invites (token, client_id, active)
values ('benetech-demo-invite-REPLACE-ME', 'benetech', true)
on conflict (token) do nothing;
