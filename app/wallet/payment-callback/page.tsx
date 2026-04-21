"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

/**
 * /wallet/payment-callback
 *
 * Paystack redirects here after payment (instead of the webhook URL).
 * Pass this page's full URL as `callback_url` when initialising a deposit.
 *
 * Behaviour:
 *  - If opened as a popup/tab by the wallet page  → postMessage + localStorage
 *    so the parent can detect success, then close this window.
 *  - If the user was redirected in the SAME tab (mobile)  → go to /wallet with
 *    a success query param so the page can show a toast.
 */
export default function PaymentCallbackPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const reference    = searchParams.get("reference") || searchParams.get("trxref");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      return;
    }

    // 1. Notify opener via postMessage (popup scenario)
    if (window.opener && !window.opener.closed) {
      try {
        window.opener.postMessage(
          { type: "PAYSTACK_SUCCESS", reference },
          window.location.origin
        );
      } catch { /* cross-origin – ignore */ }
    }

    // 2. Notify opener via localStorage (fallback for browsers that block postMessage)
    try {
      localStorage.setItem("paystack_success", JSON.stringify({ reference }));
    } catch { /* ignore */ }

    setStatus("success");

    // 3. If this is the SAME tab (mobile redirect flow), navigate back to wallet
    //    after a short delay so the user can see the success screen.
    const isPopup = window.opener && !window.opener.closed;
    if (!isPopup) {
      const timer = setTimeout(() => {
        router.replace(`/wallet?deposited=1&ref=${reference}`);
      }, 2000);
      return () => clearTimeout(timer);
    }

    // 4. If popup — close self after notifying parent
    const closeTimer = setTimeout(() => window.close(), 1500);
    return () => clearTimeout(closeTimer);
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
              {window.opener ? "Returning to app…" : "Redirecting to your wallet…"}
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto mb-6">
              <XCircle size={36} className="text-red-500" />
            </div>
            <h2 className="font-display font-bold text-navy-DEFAULT text-xl mb-2">Something went wrong</h2>
            <p className="text-navy-DEFAULT/55 text-sm font-body mb-6">We couldn't confirm your payment reference.</p>
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