-- ============================================================
-- SARTORIAL — Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up the database
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── User Profiles ───────────────────────────────────────────
-- Extends Supabase auth.users with app-specific data
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  name        text not null,
  role        text not null default 'user' check (role in ('user', 'admin')),
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'user')
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Products ────────────────────────────────────────────────
create table if not exists public.products (
  id          serial primary key,
  name        text not null,
  price       numeric(10,2) not null check (price >= 0),
  image       text not null,
  images      text[] default '{}',
  category    text not null,
  gender      text not null default 'men' check (gender in ('men', 'women', 'kids')),
  description text,
  details     text[] default '{}',
  sizes       text[] default '{}',
  is_new      boolean default false,
  in_stock    boolean default true,
  stock_count integer default 0 check (stock_count >= 0),
  coming_soon boolean default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── Orders ──────────────────────────────────────────────────
create table if not exists public.orders (
  id              uuid default uuid_generate_v4() primary key,
  user_id         uuid references auth.users(id) on delete set null,
  items           jsonb not null default '[]',
  total           numeric(10,2) not null check (total >= 0),
  status          text not null default 'pending'
                    check (status in ('pending','processing','shipped','delivered','cancelled')),
  shipping_address jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─── Wishlists ────────────────────────────────────────────────
create table if not exists public.wishlists (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  product_id  integer references public.products(id) on delete cascade not null,
  created_at  timestamptz not null default now(),
  unique(user_id, product_id)
);

-- ─── Newsletter Subscribers ───────────────────────────────────
create table if not exists public.newsletter_subscribers (
  id          uuid default uuid_generate_v4() primary key,
  email       text not null unique,
  subscribed  boolean default true,
  created_at  timestamptz not null default now()
);

-- ─── Contact Messages ─────────────────────────────────────────
create table if not exists public.contact_messages (
  id          uuid default uuid_generate_v4() primary key,
  first_name  text not null,
  last_name   text,
  email       text not null,
  phone       text,
  subject     text not null,
  message     text not null,
  read        boolean default false,
  created_at  timestamptz not null default now()
);

-- ─── Row Level Security (RLS) ─────────────────────────────────
-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.wishlists enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.contact_messages enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Products: anyone can read, only admins can write
create policy "Anyone can view products"
  on public.products for select
  using (true);

create policy "Admins can manage products"
  on public.products for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Orders: users can view/create their own orders
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can create orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Admins can manage all orders"
  on public.orders for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Wishlists: users manage their own
create policy "Users can manage own wishlist"
  on public.wishlists for all
  using (auth.uid() = user_id);

-- Newsletter: anyone can subscribe (insert), only admins can read
create policy "Anyone can subscribe to newsletter"
  on public.newsletter_subscribers for insert
  with check (true);

create policy "Admins can view subscribers"
  on public.newsletter_subscribers for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Contact messages: anyone can submit, only admins can read
create policy "Anyone can submit contact message"
  on public.contact_messages for insert
  with check (true);

create policy "Admins can view contact messages"
  on public.contact_messages for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ─── Indexes ──────────────────────────────────────────────────
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_gender on public.products(gender);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_wishlists_user_id on public.wishlists(user_id);

-- ─── Updated At Trigger ───────────────────────────────────────
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
