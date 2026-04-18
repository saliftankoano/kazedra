-- Kazedra — 3D tour bookings payment extension (PawaPay Mobile Money)
-- Run this migration on top of 0001_bookings.sql.
--
-- Changes:
--   1. Add payment tracking columns on `bookings`.
--   2. Extend status check constraint to include 'pending_payment'.
--   3. Update the availability view so unexpired pending_payment rows still
--      block the slot (avoids double-booking while payment is in flight).

-- ── 1. Columns ──────────────────────────────────────────────────────────
alter table public.bookings
  add column if not exists payment_deposit_id text,
  add column if not exists payment_status text not null default 'pending'
    check (payment_status in (
      'pending', 'submitted', 'completed', 'failed', 'cancelled', 'refunded'
    )),
  add column if not exists payment_provider text
    check (payment_provider in ('ORANGE_BFA', 'MOOV_BFA')),
  add column if not exists held_until timestamptz;

-- PawaPay depositId is a UUID — enforce uniqueness so a callback cannot match
-- multiple rows. Nullable is fine (legacy rows inserted before this migration
-- will have NULL here).
create unique index if not exists bookings_payment_deposit_id_uniq
  on public.bookings (payment_deposit_id)
  where payment_deposit_id is not null;

-- ── 2. Status check constraint ──────────────────────────────────────────
-- Drop the old check, re-create with 'pending_payment' added.
alter table public.bookings
  drop constraint if exists bookings_status_check;

alter table public.bookings
  add constraint bookings_status_check
  check (status in ('pending_payment', 'confirmed', 'cancelled', 'completed'));

-- ── 3. Availability view ────────────────────────────────────────────────
-- A slot is "taken" if:
--   (a) it's confirmed, OR
--   (b) it's pending_payment AND the 8-minute hold hasn't expired.
-- Expired holds are still physically in the table until the self-heal update
-- inside /api/payments/initiate flips them to 'cancelled' — but they're
-- correctly excluded here, so the calendar shows them as available.
create or replace view public.booking_slots_view as
  select date, slot
  from public.bookings
  where status = 'confirmed'
     or (status = 'pending_payment' and held_until > now());

alter view public.booking_slots_view set (security_invoker = true);

grant select on public.booking_slots_view to anon;
grant select on public.booking_slots_view to authenticated;
