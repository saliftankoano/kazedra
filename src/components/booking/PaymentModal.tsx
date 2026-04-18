"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Loader2, Lock, Phone, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFCFA, type Slot } from "@/lib/time-slots";
import type { BookingInput, PaymentProvider } from "@/lib/booking-schema";

type Step =
  | "provider"
  | "phone"
  | "otp"
  | "processing"
  | "success"
  | "error";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSlotTaken: () => void;
  booking: BookingInput;
  amount: number;
  date: string;
  slot: Slot;
};

const POLL_INTERVAL_MS = 3000;
const MAX_ATTEMPTS = 20;

export function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  onSlotTaken,
  booking,
  amount,
  date,
  slot,
}: Props) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState<Step>("provider");
  const [provider, setProvider] = useState<PaymentProvider | null>(null);
  const [paymentPhone, setPaymentPhone] = useState(booking.phone);
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const attemptsRef = useRef(0);

  useEffect(() => {
    if (!isOpen) {
      resetState();
    } else {
      setPaymentPhone(booking.phone);
    }
  }, [isOpen, booking.phone]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  function resetState() {
    setStep("provider");
    setProvider(null);
    setOtp("");
    setErrorMsg("");
    attemptsRef.current = 0;
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  async function initiatePayment() {
    if (!provider) return;
    setStep("processing");
    setErrorMsg("");
    attemptsRef.current = 0;

    try {
      const res = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...booking,
          payment_provider: provider,
          payment_phone: paymentPhone,
          pre_authorisation_code: provider === "ORANGE_BFA" ? otp : undefined,
        }),
      });

      if (res.status === 409) {
        onSlotTaken();
        onClose();
        return;
      }

      const body = (await res.json()) as {
        depositId?: string;
        status?: string;
        error?: string;
      };

      if (!res.ok) {
        setErrorMsg(body.error ?? "Paiement impossible. Réessayez.");
        setStep("error");
        return;
      }

      if (body.status === "COMPLETED") {
        setStep("success");
        setTimeout(() => onSuccess(), 900);
        return;
      }

      if (body.depositId) {
        pollStatus(body.depositId);
      } else {
        setErrorMsg("Réponse inattendue du service de paiement.");
        setStep("error");
      }
    } catch {
      setErrorMsg("Connexion impossible. Vérifiez votre réseau.");
      setStep("error");
    }
  }

  function pollStatus(depositId: string) {
    pollRef.current = setInterval(async () => {
      attemptsRef.current += 1;

      if (attemptsRef.current > MAX_ATTEMPTS) {
        stopPolling();
        setErrorMsg(
          "Délai d'attente dépassé. Vérifiez votre téléphone puis réessayez."
        );
        setStep("error");
        return;
      }

      try {
        const res = await fetch("/api/payments/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ depositId }),
        });
        const data = (await res.json()) as { status?: string };
        if (data.status === "COMPLETED") {
          stopPolling();
          setStep("success");
          setTimeout(() => onSuccess(), 900);
        } else if (data.status === "FAILED") {
          stopPolling();
          setErrorMsg("Paiement refusé. Vérifiez votre solde puis réessayez.");
          setStep("error");
        }
      } catch {
        // transient — keep polling
      }
    }, POLL_INTERVAL_MS);
  }

  if (!isOpen) return null;

  const canCloseBackdrop = step !== "processing";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={canCloseBackdrop ? onClose : undefined}
        />

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.97 }}
          transition={
            reduce
              ? { duration: 0.12 }
              : { type: "spring", damping: 25, stiffness: 300 }
          }
          className="relative bg-white rounded-t-[28px] md:rounded-[28px] w-full md:max-w-md shadow-2xl overflow-hidden"
        >
          <div className="flex items-start justify-between p-6 pb-4">
            <div>
              <p className="text-xs font-semibold tracking-wider text-[#FF6B35] uppercase">
                Paiement Mobile Money
              </p>
              <h3 className="mt-1 text-xl font-bold">
                {formatFCFA(amount)}
              </h3>
              <p className="text-xs text-black/50 mt-1">
                Visite le {date} de {slot}
              </p>
            </div>
            {step !== "processing" && (
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="h-9 w-9 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="px-6 pb-6">
            <AnimatePresence mode="wait" initial={false}>
              {step === "provider" && (
                <motion.div
                  key="provider"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: -12 }}
                  transition={{ duration: 0.22 }}
                  className="flex flex-col gap-3"
                >
                  <p className="text-sm text-black/65 mb-1">
                    Choisissez votre opérateur Mobile Money.
                  </p>
                  <ProviderTile
                    label="Orange Money"
                    code="OM"
                    colorBg="bg-orange-100"
                    colorText="text-orange-600"
                    onClick={() => {
                      setProvider("ORANGE_BFA");
                      setStep("phone");
                    }}
                  />
                  <ProviderTile
                    label="Moov Money"
                    code="MM"
                    colorBg="bg-blue-100"
                    colorText="text-blue-600"
                    onClick={() => {
                      setProvider("MOOV_BFA");
                      setStep("phone");
                    }}
                  />
                </motion.div>
              )}

              {step === "phone" && (
                <motion.div
                  key="phone"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: -12 }}
                  transition={{ duration: 0.22 }}
                  className="flex flex-col gap-4"
                >
                  <button
                    onClick={() => setStep("provider")}
                    className="text-xs font-medium text-black/50 hover:text-black transition-colors self-start"
                  >
                    ← Changer d&apos;opérateur
                  </button>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-black/80">
                      Numéro Mobile Money
                    </span>
                    <div className="flex items-center gap-2 border border-black/15 rounded-xl px-3 h-11 focus-within:border-[#FF6B35] focus-within:ring-2 focus-within:ring-[#FF6B35]/30 transition-colors">
                      <Phone className="h-4 w-4 text-black/40" />
                      <input
                        type="tel"
                        inputMode="tel"
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        placeholder="+226 70 12 34 56"
                        className="flex-1 bg-transparent outline-none text-[15px]"
                        autoFocus
                      />
                    </div>
                    <span className="text-xs text-black/50">
                      Le numéro qui recevra la demande de paiement.
                    </span>
                  </label>
                  <button
                    onClick={() =>
                      provider === "ORANGE_BFA"
                        ? setStep("otp")
                        : initiatePayment()
                    }
                    disabled={paymentPhone.trim().length < 8}
                    className="w-full bg-black text-white py-3.5 rounded-xl font-medium hover:bg-black/85 transition-colors disabled:opacity-50"
                  >
                    Continuer
                  </button>
                </motion.div>
              )}

              {step === "otp" && (
                <motion.div
                  key="otp"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: -12 }}
                  transition={{ duration: 0.22 }}
                  className="flex flex-col gap-4"
                >
                  <button
                    onClick={() => setStep("phone")}
                    className="text-xs font-medium text-black/50 hover:text-black transition-colors self-start"
                  >
                    ← Retour
                  </button>
                  <div className="rounded-xl bg-orange-50 border border-orange-100 p-4">
                    <p className="text-xs font-semibold text-orange-700 mb-1">
                      Code de pré-autorisation Orange
                    </p>
                    <p className="text-xs text-orange-700/80 leading-relaxed">
                      Composez{" "}
                      <span className="font-bold">*144*4*6#</span> sur votre
                      téléphone Orange pour obtenir le code, puis entrez-le
                      ci-dessous.
                    </p>
                  </div>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-black/80">
                      Code reçu
                    </span>
                    <div className="flex items-center gap-2 border border-black/15 rounded-xl px-3 h-11 focus-within:border-[#FF6B35] focus-within:ring-2 focus-within:ring-[#FF6B35]/30 transition-colors">
                      <Lock className="h-4 w-4 text-black/40" />
                      <input
                        type="text"
                        inputMode="numeric"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Code à 4 chiffres"
                        className="flex-1 bg-transparent outline-none tracking-widest text-[15px]"
                        autoFocus
                      />
                    </div>
                  </label>
                  <button
                    onClick={initiatePayment}
                    disabled={otp.trim().length < 4}
                    className="w-full bg-[#FF6B35] text-white py-3.5 rounded-xl font-medium hover:bg-[#FF6B35]/90 transition-colors disabled:opacity-50"
                  >
                    Payer {formatFCFA(amount)}
                  </button>
                </motion.div>
              )}

              {step === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center text-center py-4 gap-4"
                >
                  <div className="h-14 w-14 rounded-full bg-[#FF6B35]/10 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-[#FF6B35] animate-spin" />
                  </div>
                  <div>
                    <p className="font-bold">Confirmez sur votre téléphone…</p>
                    <p className="text-sm text-black/55 mt-1">
                      Code envoyé au {paymentPhone}. Cela peut prendre jusqu&apos;à
                      60 secondes.
                    </p>
                  </div>
                </motion.div>
              )}

              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center text-center py-4 gap-4"
                >
                  <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-7 w-7 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold">Réservation confirmée</p>
                    <p className="text-sm text-black/55 mt-1">
                      Vous recevrez un SMS de confirmation dans un instant.
                    </p>
                  </div>
                </motion.div>
              )}

              {step === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center text-center py-2 gap-4"
                >
                  <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center">
                    <AlertCircle className="h-7 w-7 text-red-500" />
                  </div>
                  <div>
                    <p className="font-bold">Paiement non confirmé</p>
                    <p className="text-sm text-black/60 mt-1">{errorMsg}</p>
                  </div>
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={resetState}
                      className="flex-1 bg-[#FF6B35] text-white py-3 rounded-xl font-medium hover:bg-[#FF6B35]/90 transition-colors"
                    >
                      Réessayer
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 bg-black/5 text-black py-3 rounded-xl font-medium hover:bg-black/10 transition-colors"
                    >
                      Fermer
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-[11px] text-black/40 text-center pb-4 px-6">
            Le créneau est bloqué 8 minutes le temps du paiement.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function ProviderTile({
  label,
  code,
  colorBg,
  colorText,
  onClick,
}: {
  label: string;
  code: string;
  colorBg: string;
  colorText: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 p-4 rounded-2xl border-2 border-black/10",
        "hover:border-[#FF6B35] hover:bg-[#FF6B35]/5 transition-all text-left",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
      )}
    >
      <div
        className={cn(
          "h-12 w-12 rounded-xl flex items-center justify-center font-bold",
          colorBg,
          colorText
        )}
      >
        {code}
      </div>
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-xs text-black/50">Burkina Faso</p>
      </div>
    </button>
  );
}
