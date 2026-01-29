
-- 1. CLEANUP (Run this to reset everything)
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists public.profiles;
drop type if exists user_role;

-- 2. CREATE TABLE (Using TEXT for role to avoid Enum issues)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  role text default 'user',
  department text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. ENABLE SECURITY
alter table profiles enable row level security;

-- 4. POLICIES (Simple and permissive for now)
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- 5. TRIGGER FUNCTION (Robust version)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, department)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    -- Default to 'user' if missing
    coalesce(new.raw_user_meta_data->>'role', 'user'),
    new.raw_user_meta_data->>'department'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 6. TRIGGER ASSIGNMENT
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. PERMISSIONS
grant usage on schema public to anon, authenticated;
grant all on public.profiles to anon, authenticated;
