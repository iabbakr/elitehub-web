"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

/**
 * /wallet/payment-callback
 *
 * Paystack redirects here after payment.
 * Pass this page's full URL as `callback_url` when initialising a deposit.
 *
 * Behaviour:
 *  - Popup / new-tab opened by the wallet page:
 *      → postMessage + localStorage so the parent page detects success,
 *        then close this window after 1.5 s.
 *  - Same-tab redirect (mobile browsers):
 *      → navigate to /wallet?deposited=1 so the wallet page shows a
 *        success banner and triggers staggered balance re-fetches.
 */

function PaymentCallbackInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const reference    = searchParams.get("reference") || searchParams.get("trxref");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [isPopup, setIsPopup]   = useState(false);

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      return;
    }

    // Detect whether we are running inside a popup opened by the wallet page.
    const popup = !!(window.opener && !window.opener.closed);
    setIsPopup(popup);

    // ── 1. Notify opener via postMessage (popup scenario) ─────────────────
    if (popup) {
      try {
        window.opener.postMessage(
          { type: "PAYSTACK_SUCCESS", reference },
          window.location.origin
        );
      } catch { /* cross-origin – ignore */ }
    }

    // ── 2. Notify opener via localStorage (fallback for strict browsers) ──
    try {
      localStorage.setItem("paystack_success", JSON.stringify({ reference }));
    } catch { /* ignore */ }

    setStatus("success");

    if (popup) {
      // ── 3a. Popup: close self after notifying the parent ─────────────────
      const closeTimer = setTimeout(() => window.close(), 1500);
      return () => clearTimeout(closeTimer);
    } else {
      // ── 3b. Same-tab (mobile redirect): send user back to wallet page.
      //        The ?deposited=1 param tells the wallet page to show a
      //        success banner and fire staggered balance re-fetches.
      const timer = setTimeout(() => {
        router.replace(`/wallet?deposited=1&ref=${reference}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [reference, router]);

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-sm w-full text-center border border-[rgba(11,46,51,0.06)]">
        {status === "loading" && (
          <>
            <div className="w-20 h-20 rounded-full bg-gold-faint border-2 border-gold-muted flex items-center justify-center mx-auto mb-6">
              <Loader2 size={32} className="text-gold-DEFAULT animate-spin" />
            </div>
            <h2 className="font-display font-bold text-navy-DEFAULT text-xl mb-2">Verifying Payment…</h2>
            <p className="text-navy-DEFAULT/55 text-sm font-body">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={36} className="text-emerald-500" />
            </div>
            <h2 className="font-display font-bold text-navy-DEFAULT text-xl mb-2">Payment Confirmed!</h2>
            <p className="text-navy-DEFAULT/55 text-sm font-body">
              {isPopup ? "Returning to app…" : "Redirecting to your wallet…"}
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto mb-6">
              <XCircle size={36} className="text-red-500" />
            </div>
            <h2 className="font-display font-bold text-navy-DEFAULT text-xl mb-2">Something went wrong</h2>
            <p className="text-navy-DEFAULT/55 text-sm font-body mb-6">We couldn&apos;t confirm your payment reference.</p>
            <button
              onClick={() => router.replace("/wallet")}
              className="px-8 py-3 rounded-2xl bg-[#0B2E33] text-white font-bold text-sm font-body border border-[rgba(201,168,76,0.3)] hover:bg-[#144D54] transition-all"
            >
              Go to Wallet
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-DEFAULT border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentCallbackInner />
    </Suspense>
  );
}