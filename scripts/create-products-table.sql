-- create-products-table.sql
-- Run this in Supabase SQL Editor

create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  description text,
  price numeric,
  stock integer,
  category text,
  image_url text,
  created_at timestamptz default now()
);

create index if not exists idx_products_user_id on public.products(user_id);
