-- create-addresses-table.sql
-- Run this in Supabase SQL Editor

create table if not exists public.addresses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  is_corporate boolean default false,
  label text,
  street text,
  city text,
  postal_code text,
  country text,
  phone text,
  tax_office text,
  tax_number text,
  created_at timestamptz default now()
);

create index if not exists idx_addresses_user_id on public.addresses(user_id);

-- Optional: Row Level Security (RLS) policies
-- enable row level security:
-- alter table public.addresses enable row level security;

-- create policy "Allow insert for owner" on public.addresses
--   for insert using (auth.role() = 'authenticated') with check (user_id = auth.uid());

-- create policy "Select for owner" on public.addresses
--   for select using (user_id = auth.uid());

-- create policy "Update for owner" on public.addresses
--   for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- create policy "Delete for owner" on public.addresses
--   for delete using (user_id = auth.uid());
