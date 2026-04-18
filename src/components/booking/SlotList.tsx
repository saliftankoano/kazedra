"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SLOTS, type Slot } from "@/lib/time-slots";

type Props = {
  date: string | null;
  bookedSlots: Set<string>;
  selected: Slot | null;
  onSelect: (slot: Slot) => void;
};

export function SlotList({ date, bookedSlots, selected, onSelect }: Props) {
  const reduce = useReducedMotion();

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_7px_14px_#EAEAEA]">
      <h3 className="font-bold text-lg mb-1">Créneaux disponibles</h3>
      <p className="text-sm text-black/50 mb-4">
        {date
          ? "Blocs de 2 heures. Sélectionnez celui qui vous convient."
          : "Choisissez d'abord une date dans le calendrier."}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={date ?? "empty"}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="flex flex-col gap-2"
        >
          {date ? (
            SLOTS.map((slot) => {
              const isBooked = bookedSlots.has(slot);
              const isSelected = selected === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isBooked}
                  onClick={() => onSelect(slot)}
                  aria-pressed={isSelected}
                  className={cn(
                    "group flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all",
                    !isBooked &&
                      !isSelected &&
                      "border-[#FF6B35]/40 text-black hover:bg-[#FF6B35] hover:text-white hover:border-[#FF6B35]",
                    isSelected &&
                      "bg-[#FF6B35] text-white border-[#FF6B35] shadow-md",
                    isBooked &&
                      "border-black/10 text-black/30 line-through cursor-not-allowed bg-black/[0.02]"
                  )}
                >
                  <span className="font-medium">{slot.replace("-", " – ")}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs opacity-80">
                    {isSelected && (
                      <motion.span
                        initial={reduce ? false : { scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex"
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </motion.span>
                    )}
                    {isBooked ? "Complet" : isSelected ? "Sélectionné" : "2 h"}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="text-black/30 text-sm py-6 text-center">
              Aucune date sélectionnée
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
