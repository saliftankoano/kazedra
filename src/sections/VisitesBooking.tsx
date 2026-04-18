"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { addMonths, endOfMonth, format, startOfMonth } from "date-fns";
import { Calendar } from "@/components/booking/Calendar";
import { SlotList } from "@/components/booking/SlotList";
import { BookingForm } from "@/components/booking/BookingForm";
import { SuccessState } from "@/components/booking/SuccessState";
import { PaymentModal } from "@/components/booking/PaymentModal";
import {
  PRICE_SCAN_ONLY,
  PRICE_SCAN_WITH_ROOGO,
  SLOTS,
  type Slot,
} from "@/lib/time-slots";
import type { BookingInput } from "@/lib/booking-schema";

type BookedMap = Record<string, string[]>;

export function VisitesBooking() {
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [booked, setBooked] = useState<BookedMap>({});
  const [success, setSuccess] = useState<{ date: string; slot: Slot } | null>(
    null
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [defaultWithRoogo, setDefaultWithRoogo] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<BookingInput | null>(
    null
  );

  useEffect(() => {
    function onFormule(e: Event) {
      const detail = (e as CustomEvent<{ withRoogo?: boolean }>).detail;
      if (typeof detail?.withRoogo === "boolean") {
        setDefaultWithRoogo(detail.withRoogo);
      }
    }
    window.addEventListener("kazedra:select-formule", onFormule);
    return () =>
      window.removeEventListener("kazedra:select-formule", onFormule);
  }, []);

  const range = useMemo(() => {
    const today = new Date();
    return {
      from: format(startOfMonth(today), "yyyy-MM-dd"),
      to: format(endOfMonth(addMonths(today, 2)), "yyyy-MM-dd"),
    };
  }, []);

  const refreshAvailability = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/bookings/availability?from=${range.from}&to=${range.to}`,
        { cache: "no-store" }
      );
      if (!res.ok) return;
      const body = (await res.json()) as { booked: BookedMap };
      setBooked(body.booked ?? {});
    } catch {
      // offline / transient — silent fail, user can still submit (server validates)
    }
  }, [range.from, range.to]);

  useEffect(() => {
    refreshAvailability();
  }, [refreshAvailability]);

  const fullyBooked = useMemo(() => {
    const set = new Set<string>();
    for (const [d, slots] of Object.entries(booked)) {
      if (slots.length >= SLOTS.length) set.add(d);
    }
    return set;
  }, [booked]);

  const bookedSlotsForDate = useMemo(
    () => new Set(date ? booked[date] ?? [] : []),
    [booked, date]
  );

  return (
    <section id="booking" className="py-24 bg-white overflow-x-clip">
      <div className="container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag border-[#FF6B35] text-black">Réservation</div>
          </div>
          <h2 className="section-title mt-5">Choisissez votre créneau</h2>
          <p className="section-description mt-5">
            Blocs de 2 heures, tous les jours entre 7h et 17h. Paiement Mobile
            Money au moment de la réservation.
          </p>
        </div>

        <div className="mt-14 max-w-5xl mx-auto">
          <AnimatePresence mode="wait" initial={false}>
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SuccessState date={success.date} slot={success.slot} />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6"
              >
                {notice && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2"
                  >
                    {notice}
                  </motion.p>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Calendar
                    selected={date}
                    onSelect={(iso) => {
                      setDate(iso);
                      setSlot(null);
                      setNotice(null);
                    }}
                    fullyBooked={fullyBooked}
                  />
                  <SlotList
                    date={date}
                    bookedSlots={bookedSlotsForDate}
                    selected={slot}
                    onSelect={(s) => {
                      setSlot(s);
                      setNotice(null);
                    }}
                  />
                </div>

                <AnimatePresence initial={false}>
                  {date && slot && (
                    <motion.div
                      key={`${date}-${slot}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.25 }}
                    >
                      <BookingForm
                        date={date}
                        slot={slot}
                        initialWithRoogo={defaultWithRoogo}
                        onRequestPayment={(booking) =>
                          setPendingBooking(booking)
                        }
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {pendingBooking && date && slot && (
        <PaymentModal
          isOpen={!!pendingBooking}
          onClose={() => setPendingBooking(null)}
          booking={pendingBooking}
          amount={
            pendingBooking.with_roogo
              ? PRICE_SCAN_WITH_ROOGO
              : PRICE_SCAN_ONLY
          }
          date={date}
          slot={slot}
          onSuccess={() => {
            setPendingBooking(null);
            setSuccess({ date, slot });
          }}
          onSlotTaken={async () => {
            setNotice(
              "Ce créneau vient d'être pris. Choisissez-en un autre."
            );
            setSlot(null);
            setPendingBooking(null);
            await refreshAvailability();
          }}
        />
      )}
    </section>
  );
}
