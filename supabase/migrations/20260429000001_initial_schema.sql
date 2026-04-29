-- ============================================================
-- Migration: Initial Schema
-- Created: 2026-04-29
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- Profiles
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text not null default '',
  role       text not null default 'user' check (role in ('user', 'admin')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products
create table if not exists public.products (
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

-- Orders
create table if not exists public.orders (
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

-- Wishlists
create table if not exists public.wishlists (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  product_id integer not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

-- Newsletter
create table if not exists public.newsletter_subscribers (
  id         uuid primary key default uuid_generate_v4(),
  email      text not null unique,
  subscribed boolean not null default true,
  created_at timestamptz not null default now()
);

-- Contact Messages
create table if not exists public.contact_messages (
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

-- Settings
create table if not exists public.settings (
  key        text primary key,
  value      text not null default '',
  updated_at timestamptz not null default now()
);

-- Default settings
insert into public.settings (key, value) values
  ('store_name',               'Fashion Foresight'),
  ('store_email',              'hello@fashionforesight.com'),
  ('support_phone',            '+1 (555) 000-0000'),
  ('store_address',            'Via Montenapoleone 12, Milan'),
  ('free_shipping_threshold',  '200'),
  ('default_currency',         'USD'),
  ('return_window',            '30'),
  ('copyright_year',           '2026'),
  ('business_hours',           'Mon–Sat: 10:00–19:00 CET')
on conflict (key) do nothing;
