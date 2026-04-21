"use client";

import { useState, useEffect, useRef } from "react";
import { X, ArrowRight, Loader2, CheckCircle, ArrowDownLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://elitehub-backend.onrender.com/api/v1";

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000];

interface DepositModalProps {
  onClose: () => void;
  onSuccess: (reference: string) => void;
}

type Step = "amount" | "processing" | "verifying" | "success";

export default function DepositModal({ onClose, onSuccess }: DepositModalProps) {
  const { getToken } = useAuth();

  const [amount, setAmount]   = useState("");
  const [step, setStep]       = useState<Step>("amount");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const popupRef   = useRef<Window | null>(null);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (popupRef.current && !popupRef.current.closed) popupRef.current.close();
    };
  }, [onClose]);

  // Listen for the callback page broadcasting success via postMessage or storage
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === "PAYSTACK_SUCCESS" && e.data?.reference) {
        if (pollingRef.current) clearInterval(pollingRef.current);
        popupRef.current?.close();
        setStep("success");
        setTimeout(() => onSuccess(e.data.reference), 1800);
      }
    };
    window.addEventListener("message", onMessage);

    // Also listen via localStorage for browsers that block cross-origin postMessage
    const onStorage = (e: StorageEvent) => {
      if (e.key === "paystack_success" && e.newValue) {
        const { reference } = JSON.parse(e.newValue);
        localStorage.removeItem("paystack_success");
        if (pollingRef.current) clearInterval(pollingRef.current);
        popupRef.current?.close();
        setStep("success");
        setTimeout(() => onSuccess(reference), 1800);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("storage", onStorage);
    };
  }, [onSuccess]);

  const amountNum = parseFloat(amount.replace(/,/g, "")) || 0;
  const isValid   = amountNum >= 100;

  const handleDeposit = async () => {
    if (!isValid || loading) return;
    setError("");
    setLoading(true);
    try {
      const token = await getToken();

      // callback_url → our frontend page that catches the Paystack redirect
      // This MUST be sent to the backend so it forwards it to Paystack during initialization
      const callbackUrl = `${window.location.origin}/wallet/payment-callback`;

      const res = await fetch(`${API_BASE}/wallet/initialize-deposit`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ amount: amountNum, callback_url: callbackUrl }),
      });
      const data = await res.json();
      if (!data.success || !data.authorization_url) {
        throw new Error(data.message || "Failed to initialize payment");
      }

      const reference = data.reference as string;

      // Try to open in popup (desktop). On mobile this usually opens as a new tab.
      const popup = window.open(
        data.authorization_url,
        "paystack",
        "width=520,height=700,left=200,top=100"
      );
      popupRef.current = popup;
      setStep("processing");

      // Poll backend every 5 s to catch payment even if postMessage fails
      let attempts = 0;
      pollingRef.current = setInterval(async () => {
        attempts++;
        const popupClosed = !popup || popup.closed;
        try {
          const token2  = await getToken();
          const verRes  = await fetch(`${API_BASE}/wallet/verify-deposit`, {
            method:  "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token2}` },
            body:    JSON.stringify({ reference }),
          });
          const verData = await verRes.json();
          if (verData.success) {
            clearInterval(pollingRef.current!);
            popup?.close();
            setStep("success");
            setTimeout(() => onSuccess(reference), 1800);
            return;
          }
        } catch { /* keep polling */ }

        // Stop after 3 min, or after popup closed + a few extra checks
        if (attempts >= 36 || (popupClosed && attempts > 4)) {
          clearInterval(pollingRef.current!);
          setStep("amount");
          setError("Payment not confirmed yet. If you paid, your balance will update shortly.");
          setLoading(false);
        }
      }, 5000);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deposit-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#071E22]/80 backdrop-blur-sm"
        onClick={step === "amount" ? onClose : undefined}
      />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-md sm:mx-4 bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-[0_-8px_40px_rgba(11,46,51,0.3)] sm:shadow-[0_32px_80px_rgba(11,46,51,0.4)] max-h-[92dvh] sm:max-h-[90dvh] flex flex-col">

        {/* Header */}
        <div className="bg-[#0B2E33] px-6 pt-6 pb-8 sm:px-8 relative overflow-hidden shrink-0">
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-[rgba(201,168,76,0.1)] pointer-events-none" />
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20 sm:hidden" />

          {step === "amount" && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all"
              aria-label="Close"
            >
              <X size={17} />
            </button>
          )}

          <div className="flex items-center gap-3 mt-2">
            <div className="w-12 h-12 rounded-2xl bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.35)] flex items-center justify-center">
              <ArrowDownLeft size={20} className="text-gold-DEFAULT" />
            </div>
            <div>
              <h2 id="deposit-title" className="font-display text-xl font-bold text-white">Add Money</h2>
              <p className="text-white/55 text-sm font-body">Powered by Paystack · Secure</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6 sm:px-8 -mt-4">

          {/* ── Amount step ── */}
          {step === "amount" && (
            <div className="space-y-5">
              {/* Quick amounts */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-navy-DEFAULT/50 mb-3 font-body">Quick Select</p>
                <div className="grid grid-cols-3 gap-2">
                  {QUICK_AMOUNTS.map(q => (
                    <button
                      key={q}
                      onClick={() => setAmount(q.toString())}
                      className={cn(
                        "py-2.5 rounded-xl text-sm font-bold font-body border transition-all",
                        amountNum === q
                          ? "bg-gold-faint border-gold-muted text-gold-DEFAULT"
                          : "bg-white border-[rgba(11,46,51,0.12)] text-navy-DEFAULT/70 hover:border-gold-muted"
                      )}
                    >
                      ₦{q.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-navy-DEFAULT/50 mb-2 font-body">Or Enter Amount</p>
                <div className={cn(
                  "flex items-center gap-2 border-2 rounded-xl px-4 py-3 transition-all",
                  amountNum > 0 ? "border-gold-muted bg-gold-faint/30" : "border-[rgba(11,46,51,0.15)] bg-white"
                )}>
                  <span className="text-xl font-bold text-navy-DEFAULT font-body">₦</span>
                  <input
                    type="number"
                    min={100}
                    value={amount}
                    onChange={e => { setAmount(e.target.value); setError(""); }}
                    placeholder="0.00"
                    className="flex-1 text-2xl font-bold text-navy-DEFAULT bg-transparent outline-none font-body"
                  />
                </div>
                <p className="text-xs text-navy-DEFAULT/40 font-body mt-1.5">Minimum deposit: ₦100</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-body">
                  {error}
                </div>
              )}

              <button
                onClick={handleDeposit}
                disabled={!isValid || loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#0B2E33] text-white font-bold text-sm font-body border border-[rgba(201,168,76,0.3)] hover:bg-[#144D54] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : (
                  <>Continue to Payment <ArrowRight size={16} className="text-gold-DEFAULT" /></>
                )}
              </button>

              <div className="flex items-center gap-2 text-center justify-center">
                <span className="text-[11px] text-navy-DEFAULT/40 font-body">🔒 Secured by Paystack · All cards accepted</span>
              </div>
            </div>
          )}

          {/* ── Processing step ── */}
          {(step === "processing" || step === "verifying") && (
            <div className="flex flex-col items-center justify-center py-10 gap-5">
              <div className="w-20 h-20 rounded-full bg-gold-faint border-2 border-gold-muted flex items-center justify-center">
                <Loader2 size={32} className="text-gold-DEFAULT animate-spin" />
              </div>
              <div className="text-center">
                <h3 className="font-display font-bold text-navy-DEFAULT text-lg mb-2">Waiting for Payment</h3>
                <p className="text-navy-DEFAULT/55 text-sm font-body max-w-xs leading-relaxed">
                  Complete your payment in the Paystack window. This page will update automatically.
                </p>
              </div>
              <div className="bg-[rgba(11,46,51,0.04)] rounded-xl px-4 py-3 border border-[rgba(11,46,51,0.06)] w-full text-center">
                <p className="text-navy-DEFAULT/60 text-xs font-body">
                  Amount: <strong className="text-navy-DEFAULT">₦{amountNum.toLocaleString()}</strong>
                </p>
              </div>
              <button
                onClick={() => {
                  setStep("amount");
                  setLoading(false);
                  if (pollingRef.current) clearInterval(pollingRef.current);
                }}
                className="text-navy-DEFAULT/40 text-sm font-body hover:text-navy-DEFAULT transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {/* ── Success step ── */}
          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-10 gap-5">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                <CheckCircle size={36} className="text-emerald-500" />
              </div>
              <div className="text-center">
                <h3 className="font-display font-bold text-navy-DEFAULT text-xl mb-2">Payment Successful!</h3>
                <p className="text-navy-DEFAULT/55 text-sm font-body">
                  ₦{amountNum.toLocaleString()} has been added to your wallet.
                </p>
              </div>
              {/* Explicit button in case auto-close doesn't fire */}
              <button
                onClick={onClose}
                className="mt-2 px-8 py-3 rounded-2xl bg-[#0B2E33] text-white font-bold text-sm font-body border border-[rgba(201,168,76,0.3)] hover:bg-[#144D54] transition-all"
              >
                Back to Wallet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}