-- Supabase SQL Schema for Citizen Grievance Management System
-- Run this in the Supabase SQL Editor to set up your database

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text not null unique,
  role text not null default 'Citizen' check (role in ('Citizen', 'Official', 'Admin')),
  department text,
  phone text,
  status text not null default 'Active' check (status in ('Active', 'Inactive', 'Suspended')),
  created_at timestamptz not null default now()
);

-- Departments table
create table if not exists public.departments (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  code text not null unique,
  head text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);

-- Complaints table
create table if not exists public.complaints (
  id uuid default uuid_generate_v4() primary key,
  complaint_id text not null unique,
  title text not null,
  category text not null check (category in ('Road', 'Water', 'Electricity', 'Sanitation', 'Other')),
  department text not null,
  priority text not null default 'Medium' check (priority in ('Low', 'Medium', 'High', 'Urgent')),
  status text not null default 'Pending' check (status in ('Pending', 'In Progress', 'Resolved', 'Closed', 'Needs Info', 'Verified')),
  description text not null,
  location text not null,
  citizen_id uuid references public.profiles(id) on delete set null,
  citizen_name text not null,
  assigned_to text,
  created_at timestamptz not null default now()
);

-- Comments table
create table if not exists public.comments (
  id uuid default uuid_generate_v4() primary key,
  complaint_id uuid references public.complaints(id) on delete cascade not null,
  author text not null,
  role text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Notifications table
create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null default 'info' check (type in ('complaint', 'system', 'info')),
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_complaints_citizen_id on public.complaints(citizen_id);
create index if not exists idx_complaints_status on public.complaints(status);
create index if not exists idx_complaints_complaint_id on public.complaints(complaint_id);
create index if not exists idx_comments_complaint_id on public.comments(complaint_id);
create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_notifications_read on public.notifications(read);

-- Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.complaints enable row level security;
alter table public.comments enable row level security;
alter table public.departments enable row level security;
alter table public.notifications enable row level security;

-- Profiles policies
create policy "Users can view all profiles" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admins can manage all profiles" on public.profiles for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'Admin')
);

-- Complaints policies
create policy "Anyone can view complaints" on public.complaints for select using (true);
create policy "Citizens can insert complaints" on public.complaints for insert with check (auth.uid() = citizen_id);
create policy "Officials and admins can update complaints" on public.complaints for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('Official', 'Admin'))
  or auth.uid() = citizen_id
);

-- Comments policies
create policy "Anyone can view comments" on public.comments for select using (true);
create policy "Authenticated users can add comments" on public.comments for insert with check (auth.uid() is not null);

-- Departments policies
create policy "Anyone can view departments" on public.departments for select using (true);
create policy "Admins can manage departments" on public.departments for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'Admin')
);

-- Notifications policies
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);
create policy "System can insert notifications" on public.notifications for insert with check (true);

-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'Citizen')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for auto profile creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Function to generate complaint ID
create or replace function public.generate_complaint_id()
returns trigger as $$
declare
  next_num integer;
begin
  select coalesce(max(cast(substring(complaint_id from 10) as integer)), 0) + 1
  into next_num
  from public.complaints;
  new.complaint_id := 'CMP-' || to_char(now(), 'YYYY') || '-' || lpad(next_num::text, 5, '0');
  return new;
end;
$$ language plpgsql;

-- Trigger for auto complaint ID generation
drop trigger if exists set_complaint_id on public.complaints;
create trigger set_complaint_id
  before insert on public.complaints
  for each row
  when (new.complaint_id is null or new.complaint_id = '')
  execute function public.generate_complaint_id();
