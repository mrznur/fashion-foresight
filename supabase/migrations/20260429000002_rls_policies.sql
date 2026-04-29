-- ============================================================
-- Migration: RLS Policies & Triggers
-- Created: 2026-04-29
-- ============================================================

-- Updated_at trigger function
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
drop trigger if exists set_products_updated_at on public.products;
drop trigger if exists set_orders_updated_at   on public.orders;
drop trigger if exists on_auth_user_created    on auth.users;

create trigger set_profiles_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger set_products_updated_at before update on public.products for each row execute procedure public.set_updated_at();
create trigger set_orders_updated_at    before update on public.orders    for each row execute procedure public.set_updated_at();

-- Auto-create profile on signup
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

-- Enable RLS
alter table public.profiles             enable row level security;
alter table public.products             enable row level security;
alter table public.orders               enable row level security;
alter table public.wishlists            enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.contact_messages     enable row level security;
alter table public.settings             enable row level security;

-- Indexes
create index if not exists idx_products_gender   on public.products(gender);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_orders_user_id    on public.orders(user_id);
create index if not exists idx_orders_status     on public.orders(status);
create index if not exists idx_wishlists_user_id on public.wishlists(user_id);

-- Policies: Products
create policy "Public read products"          on public.products for select using (true);
create policy "Authenticated insert products" on public.products for insert to authenticated with check (true);
create policy "Authenticated update products" on public.products for update to authenticated using (true);
create policy "Authenticated delete products" on public.products for delete to authenticated using (true);

-- Policies: Profiles
create policy "Users manage own profile" on public.profiles for all using (auth.uid() = id);

-- Policies: Orders
create policy "Users manage own orders" on public.orders for all using (auth.uid() = user_id);

-- Policies: Wishlists
create policy "Users manage own wishlist" on public.wishlists for all using (auth.uid() = user_id);

-- Policies: Newsletter
create policy "Anyone can subscribe"          on public.newsletter_subscribers for insert with check (true);
create policy "Authenticated read subscribers" on public.newsletter_subscribers for select to authenticated using (true);

-- Policies: Contact
create policy "Anyone can submit contact"    on public.contact_messages for insert with check (true);
create policy "Authenticated read contact"   on public.contact_messages for select to authenticated using (true);

-- Policies: Settings
create policy "Public read settings"         on public.settings for select using (true);
create policy "Authenticated manage settings" on public.settings for all to authenticated using (true);
