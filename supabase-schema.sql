-- ============================================================
-- Fashion Foresight — Supabase Schema (v2)
-- Run this FRESH in Supabase SQL Editor:
--   1. Go to SQL Editor → New query
--   2. Paste this entire file
--   3. Click Run
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Drop existing (clean slate) ─────────────────────────────
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists set_profiles_updated_at on public.profiles;
drop trigger if exists set_products_updated_at on public.products;
drop trigger if exists set_orders_updated_at on public.orders;
drop function if exists public.handle_new_user();
drop function if exists public.set_updated_at();
drop table if exists public.settings cascade;
drop table if exists public.contact_messages cascade;
drop table if exists public.newsletter_subscribers cascade;
drop table if exists public.wishlists cascade;
drop table if exists public.orders cascade;
drop table if exists public.products cascade;
drop table if exists public.profiles cascade;

-- ─── Profiles ────────────────────────────────────────────────
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text not null default '',
  role       text not null default 'user' check (role in ('user', 'admin')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Products ────────────────────────────────────────────────
create table public.products (
  id          serial primary key,
  name        text not null,
  price       numeric(10,2) not null check (price >= 0),
  image       text not null default '',
  images      text[] not null default '{}',
  category    text not null default '',
  gender      text not null default 'men' check (gender in ('men','women','kids')),
  description text,
  details     text[] not null default '{}',
  sizes       text[] not null default '{}',
  is_new      boolean not null default false,
  in_stock    boolean not null default true,
  stock_count integer not null default 0 check (stock_count >= 0),
  coming_soon boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── Orders ──────────────────────────────────────────────────
create table public.orders (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  items            jsonb not null default '[]',
  total            numeric(10,2) not null check (total >= 0),
  status           text not null default 'pending'
                     check (status in ('pending','processing','shipped','delivered','cancelled')),
  shipping_address jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ─── Wishlists ───────────────────────────────────────────────
create table public.wishlists (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  product_id integer not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

-- ─── Newsletter ──────────────────────────────────────────────
create table public.newsletter_subscribers (
  id         uuid primary key default uuid_generate_v4(),
  email      text not null unique,
  subscribed boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─── Contact Messages ────────────────────────────────────────
create table public.contact_messages (
  id         uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name  text,
  email      text not null,
  phone      text,
  subject    text not null,
  message    text not null,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─── Settings ────────────────────────────────────────────────
create table public.settings (
  key        text primary key,
  value      text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.settings (key, value) values
  ('store_name',               'Fashion Foresight'),
  ('store_email',              'hello@fashionforesight.com'),
  ('support_phone',            '+1 (555) 000-0000'),
  ('store_address',            'Via Montenapoleone 12, Milan'),
  ('free_shipping_threshold',  '200'),
  ('default_currency',         'USD'),
  ('return_window',            '30');

-- ─── Triggers: updated_at ────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger set_products_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

create trigger set_orders_updated_at
  before update on public.orders
  for each row execute procedure public.set_updated_at();

-- ─── Trigger: auto-create profile on signup ──────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'user')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Indexes ─────────────────────────────────────────────────
create index idx_products_gender   on public.products(gender);
create index idx_products_category on public.products(category);
create index idx_orders_user_id    on public.orders(user_id);
create index idx_orders_status     on public.orders(status);
create index idx_wishlists_user_id on public.wishlists(user_id);

-- ─── Row Level Security ──────────────────────────────────────
alter table public.profiles             enable row level security;
alter table public.products             enable row level security;
alter table public.orders               enable row level security;
alter table public.wishlists            enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.contact_messages     enable row level security;
alter table public.settings             enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Profiles
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select using (public.is_admin());

-- Products
create policy "Anyone can view products"
  on public.products for select using (true);

create policy "Admins can manage products"
  on public.products for all using (public.is_admin());

-- Orders
create policy "Users can view own orders"
  on public.orders for select using (auth.uid() = user_id);

create policy "Users can create own orders"
  on public.orders for insert with check (auth.uid() = user_id);

create policy "Admins can manage all orders"
  on public.orders for all using (public.is_admin());

-- Wishlists
create policy "Users can manage own wishlist"
  on public.wishlists for all using (auth.uid() = user_id);

-- Newsletter
create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert with check (true);

create policy "Admins can view subscribers"
  on public.newsletter_subscribers for select using (public.is_admin());

-- Contact
create policy "Anyone can submit contact"
  on public.contact_messages for insert with check (true);

create policy "Admins can view contact messages"
  on public.contact_messages for select using (public.is_admin());

-- Settings
create policy "Anyone can read settings"
  on public.settings for select using (true);

create policy "Admins can manage settings"
  on public.settings for all using (public.is_admin());

-- ─── View: orders with customer info ─────────────────────────
create or replace view public.orders_with_customer
  with (security_invoker = true)
as
  select
    o.id,
    o.user_id,
    o.items,
    o.total,
    o.status,
    o.shipping_address,
    o.created_at,
    o.updated_at,
    p.name  as customer_name,
    u.email as customer_email
  from public.orders o
  join public.profiles p on p.id = o.user_id
  join auth.users      u on u.id = o.user_id;
