"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateISO } from "@/lib/time-slots";

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

type Props = {
  selected: string | null;
  onSelect: (iso: string) => void;
  fullyBooked: Set<string>; // ISO dates where all slots are taken
  minDate?: Date;
  maxDate?: Date;
};

export function Calendar({
  selected,
  onSelect,
  fullyBooked,
  minDate,
  maxDate,
}: Props) {
  const reduce = useReducedMotion();
  const today = startOfDay(new Date());
  const [cursor, setCursor] = useState<Date>(startOfMonth(today));

  const days = useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const gridEnd = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    const out: Date[] = [];
    let d = gridStart;
    while (!isAfter(d, gridEnd)) {
      out.push(d);
      d = new Date(d.getTime() + 24 * 60 * 60 * 1000);
    }
    return out;
  }, [cursor]);

  const floor = minDate ?? today;
  const ceil = maxDate ?? addMonths(today, 3);

  const canGoBack = !isSameMonth(cursor, floor) && isAfter(cursor, floor);
  const canGoForward = isBefore(cursor, startOfMonth(ceil));

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_7px_14px_#EAEAEA]">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          aria-label="Mois précédent"
          onClick={() => canGoBack && setCursor(subMonths(cursor, 1))}
          disabled={!canGoBack}
          className="p-2 rounded-lg hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={format(cursor, "yyyy-MM")}
            initial={reduce ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
            className="font-bold text-lg capitalize"
          >
            {format(cursor, "LLLL yyyy", { locale: fr })}
          </motion.div>
        </AnimatePresence>
        <button
          type="button"
          aria-label="Mois suivant"
          onClick={() => canGoForward && setCursor(addMonths(cursor, 1))}
          disabled={!canGoForward}
          className="p-2 rounded-lg hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-xs text-black/40 font-medium mb-2">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="text-center py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const iso = formatDateISO(d);
          const isOtherMonth = !isSameMonth(d, cursor);
          const isPast = isBefore(d, today);
          const isTooFar = isAfter(d, ceil);
          const isDisabled = isPast || isTooFar;
          const isToday = isSameDay(d, today);
          const isSelected = selected === iso;
          const isFull = fullyBooked.has(iso);

          return (
            <button
              key={iso}
              type="button"
              disabled={isDisabled || isFull}
              onClick={() => onSelect(iso)}
              aria-pressed={isSelected}
              aria-label={format(d, "EEEE d MMMM yyyy", { locale: fr })}
              className={cn(
                "relative aspect-square rounded-lg text-sm font-medium transition-all",
                "flex items-center justify-center",
                isOtherMonth && "text-black/20",
                !isOtherMonth && !isDisabled && !isFull && "hover:bg-[#FF6B35]/10 text-black",
                isDisabled && "text-black/20 cursor-not-allowed",
                isFull && !isDisabled &&
                  "text-black/30 line-through cursor-not-allowed",
                isToday && !isSelected && "ring-1 ring-[#FF6B35]/40",
                isSelected &&
                  "bg-[#FF6B35] text-white shadow-md hover:bg-[#FF6B35]"
              )}
            >
              {isSelected && !reduce && (
                <motion.span
                  layoutId="calendar-active"
                  className="absolute inset-0 rounded-lg bg-[#FF6B35] -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                />
              )}
              <span className="relative">{format(d, "d")}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-black/50">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
          Sélectionné
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#FF6B35]/30 ring-1 ring-[#FF6B35]/40" />
          Aujourd&apos;hui
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-black/20" />
          Complet
        </span>
      </div>
    </div>
  );
}
