create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text,
  created_at timestamp default now()
);

create table if not exists public.trips (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  destination text not null,
  date_from date not null,
  date_to date not null,
  num_travelers integer not null default 1,
  travel_style text[] default '{}'::text[],
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists public.itineraries (
  id uuid primary key default uuid_generate_v4(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  day_number integer not null,
  activity_order integer not null,
  activity_name text not null,
  location text,
  time_start text,
  time_end text,
  description text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists public.share_links (
  id uuid primary key default uuid_generate_v4(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  token text unique not null,
  created_at timestamp default now()
);

create index if not exists idx_trips_user_id on public.trips(user_id);
create index if not exists idx_itineraries_trip_id on public.itineraries(trip_id);
create index if not exists idx_share_links_token on public.share_links(token);

alter table public.users enable row level security;
alter table public.trips enable row level security;
alter table public.itineraries enable row level security;
alter table public.share_links enable row level security;

create policy "users_view_own_profile"
  on public.users for select
  using (auth.uid() = id);

create policy "users_view_own_trips"
  on public.trips for select
  using (auth.uid() = user_id);

create policy "users_insert_own_trips"
  on public.trips for insert
  with check (auth.uid() = user_id);

create policy "users_update_own_trips"
  on public.trips for update
  using (auth.uid() = user_id);

create policy "users_view_own_itineraries"
  on public.itineraries for select
  using (
    trip_id in (
      select id from public.trips where user_id = auth.uid()
    )
  );

create policy "public_share_links_read"
  on public.share_links for select
  using (true);
