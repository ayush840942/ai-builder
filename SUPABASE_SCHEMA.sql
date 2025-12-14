-- =============================================
-- AI Builder Database Schema for Supabase
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- =============================================
-- PROJECTS TABLE
-- =============================================
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  framework text default 'react',
  template text,
  code text,
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on projects
alter table public.projects enable row level security;

-- Drop existing policies if they exist (to avoid conflicts)
drop policy if exists "Users can view their own projects" on public.projects;
drop policy if exists "Users can insert their own projects" on public.projects;
drop policy if exists "Users can update their own projects" on public.projects;
drop policy if exists "Users can delete their own projects" on public.projects;

-- Create policies for projects
create policy "Users can view their own projects" on public.projects
  for select using (auth.uid() = user_id);

create policy "Users can insert their own projects" on public.projects
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own projects" on public.projects
  for update using (auth.uid() = user_id);

create policy "Users can delete their own projects" on public.projects
  for delete using (auth.uid() = user_id);

-- =============================================
-- PROFILES TABLE (if not exists)
-- =============================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  name text,
  plan text default 'free',
  credits integer default 10,
  credits_used integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;

-- Create policies for profiles
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- =============================================
-- TRIGGER: Auto-create profile on user signup
-- =============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, plan, credits, credits_used)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'free', 
    10, 
    0
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
-- If you see this, the schema was applied successfully!
