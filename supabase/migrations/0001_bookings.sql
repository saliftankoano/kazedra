-- Kazedra — 3D virtual tours bookings
-- Run this migration on a fresh Supabase project (SQL Editor or CLI).

create extension if not exists "pgcrypto";

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  slot text not null check (slot in (
    '07:00-09:00',
    '09:00-11:00',
    '11:00-13:00',
    '13:00-15:00',
    '15:00-17:00'
  )),
  name text not null,
  company text,
  phone text not null,
  email text,
  address text not null,
  area_band text not null check (area_band in ('<100','100-200','200-500','>500')),
  with_roogo boolean not null default false,
  notes text,
  status text not null default 'confirmed' check (status in ('confirmed','cancelled','completed')),
  created_at timestamptz not null default now()
);

-- One active booking per (date, slot); cancelled rows don't block re-booking.
create unique index if not exists bookings_active_slot_uniq
  on public.bookings (date, slot)
  where status <> 'cancelled';

-- Anonymous availability: a PII-free view exposing only (date, slot) for confirmed rows.
create or replace view public.booking_slots_view as
  select date, slot
  from public.bookings
  where status = 'confirmed';

alter view public.booking_slots_view set (security_invoker = true);

-- RLS
alter table public.bookings enable row level security;

-- No public select/insert/update/delete on the raw table — the API uses the service role.
drop policy if exists "no public access" on public.bookings;
create policy "no public access" on public.bookings for all using (false) with check (false);

-- Expose the view to the anon role for read-only availability queries.
grant select on public.booking_slots_view to anon;
grant select on public.booking_slots_view to authenticated;
