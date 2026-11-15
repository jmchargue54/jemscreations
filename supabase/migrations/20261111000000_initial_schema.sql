-- JemsCreations initial database schema.
-- Run this in Supabase SQL Editor or deploy it with the Supabase CLI.

create type public.user_role as enum ('customer', 'admin');
create type public.order_status as enum ('submitted', 'pending', 'processing', 'shipped', 'complete', 'canceled');
create type public.discount_type as enum ('percentage', 'fixed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now()
);

create table public.categories (
  id bigint generated always as identity primary key,
  name text not null unique,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.products (
  id bigint generated always as identity primary key,
  name text not null,
  description text not null default '',
  price numeric(10,2) not null check (price >= 0),
  category_id bigint references public.categories(id) on delete set null,
  image_url text,
  status text not null default 'active' check (status in ('active', 'sold', 'inactive')),
  inventory_tracking boolean not null default false,
  inventory_quantity integer check (inventory_quantity is null or inventory_quantity >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  display_order integer not null default 0
);

create table public.discounts (
  id bigint generated always as identity primary key,
  code text not null unique,
  type public.discount_type not null,
  value numeric(10,2) not null check (value >= 0),
  active boolean not null default true,
  expires_at timestamptz,
  usage_limit integer,
  created_at timestamptz not null default now()
);

create table public.orders (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  guest_name text,
  guest_email text,
  status public.order_status not null default 'submitted',
  subtotal numeric(10,2) not null default 0,
  discount_amount numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  venmo_paid boolean not null default false,
  shipping_name text not null,
  shipping_address text not null,
  shipping_city text,
  shipping_state text,
  shipping_postal_code text,
  shipping_country text default 'United States',
  customer_notes text,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  product_id bigint references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0)
);

create table public.wishlist_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id bigint not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table public.messages (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  sender_name text not null,
  sender_email text not null,
  subject text not null,
  content text not null,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

insert into public.categories (name, description)
values
  ('earrings', 'Handmade earrings'),
  ('necklace', 'Handmade necklaces'),
  ('bracelet', 'Handmade bracelets'),
  ('ring', 'Handmade rings'),
  ('other', 'Other handmade pieces'),
  ('home goods', 'Handmade goods for your space')
on conflict (name) do nothing;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.discounts enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.messages enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;

create policy "Public can view active categories" on public.categories for select using (active = true);
create policy "Public can view active products" on public.products for select using (status = 'active');
create policy "Public can view product images" on public.product_images for select using (true);
create policy "Public can view active discounts" on public.discounts for select using (active = true);
create policy "Admins manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage product images" on public.product_images for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage discounts" on public.discounts for all using (public.is_admin()) with check (public.is_admin());
create policy "Users view their orders" on public.orders for select using (user_id = auth.uid() or public.is_admin());
create policy "Users create orders" on public.orders for insert with check (user_id = auth.uid() or user_id is null);
create policy "Admins manage orders" on public.orders for update using (public.is_admin()) with check (public.is_admin());
create policy "Users view their order items" on public.order_items for select using (exists (select 1 from public.orders where orders.id = order_items.order_id and (orders.user_id = auth.uid() or public.is_admin())));
create policy "Users manage their wishlist" on public.wishlist_items for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users create messages" on public.messages for insert with check (user_id = auth.uid() or user_id is null);
create policy "Admins manage messages" on public.messages for all using (public.is_admin()) with check (public.is_admin());
create policy "Users view own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$ begin insert into public.profiles (id, display_name) values (new.id, new.raw_user_meta_data ->> 'display_name'); return new; end; $$;

create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
