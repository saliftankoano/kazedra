-- Kazedra — per-room pricing for 3D tour bookings.
-- Replaces the legacy `area_band` selector (informational m² band) with a
-- price-driving `room_count`, and stores the computed `total_amount` charged
-- via PawaPay so the team SMS and any future audit can reflect the exact
-- amount captured.

-- ── 1. New columns ──────────────────────────────────────────────────────
alter table public.bookings
  add column if not exists room_count integer not null default 1
    check (room_count >= 1),
  add column if not exists total_amount bigint;

-- ── 2. Backfill total_amount from with_roogo ────────────────────────────
-- Existing rows were charged the legacy flat-per-property rate (50k or 30k).
-- Their room_count defaults to 1 — a record-keeping artifact, not a real
-- count, since this column didn't exist when those bookings were captured.
update public.bookings
  set total_amount = case when with_roogo then 30000 else 50000 end
  where total_amount is null;

alter table public.bookings
  alter column total_amount set not null;

-- ── 3. Drop area_band ──────────────────────────────────────────────────
-- The check constraint from migration 0001 drops automatically with the
-- column.
alter table public.bookings
  drop column if exists area_band;
