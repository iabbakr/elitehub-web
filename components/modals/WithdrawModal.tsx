"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ArrowRight, Loader2, CheckCircle, AlertTriangle, ArrowUpRight, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/products";
import { cn } from "@/lib/utils";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://elitehub-backend.onrender.com/api/v1";

// Fee tiers — match mobile
function getWithdrawalFee(amount: number): number {
  if (amount < 2000)   return 50;
  if (amount < 200000) return 150;
  return 500;
}

interface Bank { name: string; code: string; }

interface SavedBank {
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  verified: boolean;
}

interface WithdrawModalProps {
  balance: number;
  onClose: () => void;
}

type Step = "amount" | "bank" | "confirm" | "processing" | "success";

export default function WithdrawModal({ balance, onClose }: WithdrawModalProps) {
  const { user, getToken } = useAuth();

  const [step, setStep]           = useState<Step>("amount");
  const [amount, setAmount]       = useState("");
  const [banks, setBanks]         = useState<Bank[]>([]);
  const [savedBank, setSavedBank] = useState<SavedBank | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  // Bank linking fields
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [verifiedName, setVerifiedName]   = useState("");
  const [verifying, setVerifying]         = useState(false);

  // Lock scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Load saved bank + banks list
  useEffect(() => {
    if (!user?.uid) return;
    (async () => {
      try {
        const token = await getToken();
        const [profileRes, banksRes] = await Promise.all([
          fetch(`${API_BASE}/users/profile/${user.uid}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE}/wallet/banks`,              { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const [profileData, banksData] = await Promise.all([profileRes.json(), banksRes.json()]);
        if (profileData.user?.bankAccount?.verified) setSavedBank(profileData.user.bankAccount);
        if (banksData.success) setBanks(banksData.banks ?? []);
      } catch { /* silent */ }
    })();
  }, [user?.uid, getToken]);

  const amountNum   = parseFloat(amount.replace(/,/g, "")) || 0;
  const fee         = amountNum > 0 ? getWithdrawalFee(amountNum) : 0;
  const totalDeduct = amountNum + fee;
  const isValidAmt  = amountNum >= 1000 && totalDeduct <= balance;

  // Verify account number when both are filled
  const verifyAccount = useCallback(async () => {
    if (accountNumber.length !== 10 || !selectedBankCode) return;
    setVerifying(true); setError("");
    try {
      const token = await getToken();
      const res   = await fetch(`${API_BASE}/wallet/verify-account`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ accountNumber, bankCode: selectedBankCode }),
      });
      const data = await res.json();
      if (data.success) setVerifiedName(data.accountName);
      else setError("Could not verify account. Please check details.");
    } catch { setError("Verification failed. Try again."); }
    finally { setVerifying(false); }
  }, [accountNumber, selectedBankCode, getToken]);

  useEffect(() => {
    if (accountNumber.length === 10 && selectedBankCode) verifyAccount();
    else setVerifiedName("");
  }, [accountNumber, selectedBankCode, verifyAccount]);

  const saveBankAndProceed = async () => {
    if (!verifiedName) return;
    setLoading(true); setError("");
    try {
      const token       = await getToken();
      const bankName    = banks.find(b => b.code === selectedBankCode)?.name ?? "";
      const res         = await fetch(`${API_BASE}/wallet/add-bank-details`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ accountNumber, bankCode: selectedBankCode, accountName: verifiedName }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to save bank");
      setSavedBank({ accountName: verifiedName, accountNumber, bankName, bankCode: selectedBankCode, verified: true });
      setStep("confirm");
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const processWithdrawal = async () => {
    if (!savedBank || !user?.uid) return;
    setLoading(true); setError("");
    setStep("processing");
    try {
      const token = await getToken();
      const res   = await fetch(`${API_BASE}/wallet/initialize-withdrawal`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({
          userId: user.uid,
          amountKobo:    Math.round(amountNum * 100),
          feeKobo:       Math.round(fee * 100),
          accountNumber: savedBank.accountNumber,
          bankCode:      savedBank.bankCode,
          accountName:   savedBank.accountName,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Withdrawal failed");
      setStep("success");
    } catch (err: any) {
      setError(err.message || "Withdrawal failed. Please try again.");
      setStep("confirm");
    } finally { setLoading(false); }
  };

  return (
    <div
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="withdraw-title"
    >
      <div className="absolute inset-0 bg-[#071E22]/80 backdrop-blur-sm" onClick={step === "amount" || step === "bank" || step === "confirm" ? onClose : undefined} />

      <div className="relative w-full sm:max-w-md sm:mx-4 bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-[0_-8px_40px_rgba(11,46,51,0.3)] sm:shadow-[0_32px_80px_rgba(11,46,51,0.4)] max-h-[92dvh] sm:max-h-[90dvh] flex flex-col">

        {/* Header */}
        <div className="bg-[#0B2E33] px-6 pt-6 pb-8 sm:px-8 relative overflow-hidden shrink-0">
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-[rgba(201,168,76,0.1)] pointer-events-none" />
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20 sm:hidden" />

          {(step === "amount" || step === "bank" || step === "confirm") && (
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all" aria-label="Close">
              <X size={17} />
            </button>
          )}

          <div className="flex items-center gap-3 mt-2">
            <div className="w-12 h-12 rounded-2xl bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.35)] flex items-center justify-center">
              <ArrowUpRight size={20} className="text-gold-DEFAULT" />
            </div>
            <div>
              <h2 id="withdraw-title" className="font-display text-xl font-bold text-white">Withdraw Funds</h2>
              <p className="text-white/55 text-sm font-body">Balance: {formatCurrency(balance)}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6 sm:px-8 -mt-4 space-y-5">

          {/* ── Step 1: Amount ── */}
          {step === "amount" && (
            <>
              <div className={cn(
                "flex items-center gap-2 border-2 rounded-xl px-4 py-3 transition-all",
                amountNum > 0 ? "border-gold-muted" : "border-[rgba(11,46,51,0.15)]"
              )}>
                <span className="text-xl font-bold text-navy-DEFAULT font-body">₦</span>
                <input
                  type="number"
                  value={amount}
                  onChange={e => { setAmount(e.target.value); setError(""); }}
                  placeholder="Enter amount"
                  className="flex-1 text-2xl font-bold text-navy-DEFAULT bg-transparent outline-none font-body"
                />
              </div>
              <p className="text-xs text-navy-DEFAULT/40 font-body">Minimum: ₦1,000</p>

              {amountNum > 0 && (
                <div className="bg-[rgba(11,46,51,0.04)] rounded-xl border border-[rgba(11,46,51,0.06)] p-4 space-y-2.5">
                  <FeeRow label="Withdrawal Amount" value={`₦${amountNum.toLocaleString()}`} />
                  <FeeRow label={`Service Fee (${amountNum < 2000 ? "< ₦2k" : amountNum < 200000 ? "₦2k–₦200k" : "> ₦200k"})`} value={`-₦${fee}`} color="text-red-500" />
                  <div className="border-t border-[rgba(11,46,51,0.08)] pt-2.5">
                    <FeeRow label="Total Debited" value={`₦${totalDeduct.toLocaleString()}`} bold />
                    <FeeRow label="You Receive" value={`₦${amountNum.toLocaleString()}`} bold color="text-emerald-600" />
                  </div>
                </div>
              )}

              {totalDeduct > balance && amountNum > 0 && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-red-600 text-sm font-body">
                  <AlertTriangle size={14} />
                  Insufficient balance (including ₦{fee} fee)
                </div>
              )}

              {error && <ErrorBox message={error} />}

              <button
                onClick={() => { if (!isValidAmt) return; setStep(savedBank ? "confirm" : "bank"); }}
                disabled={!isValidAmt}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#0B2E33] text-white font-bold text-sm font-body border border-[rgba(201,168,76,0.3)] hover:bg-[#144D54] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight size={16} className="text-gold-DEFAULT" />
              </button>
            </>
          )}

          {/* ── Step 2: Bank details ── */}
          {step === "bank" && (
            <>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-navy-DEFAULT/50 mb-2 font-body">Bank</p>
                <div className="relative">
                  <select
                    value={selectedBankCode}
                    onChange={e => { setSelectedBankCode(e.target.value); setError(""); setVerifiedName(""); }}
                    className="w-full appearance-none border-2 border-[rgba(11,46,51,0.15)] rounded-xl px-4 py-3 text-sm text-navy-DEFAULT font-body outline-none focus:border-gold-muted pr-10 bg-white"
                  >
                    <option value="">Select bank…</option>
                    {banks.map(b => <option key={b.code} value={b.code}>{b.name}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-DEFAULT/40 pointer-events-none" />
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-navy-DEFAULT/50 mb-2 font-body">Account Number</p>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={accountNumber}
                  onChange={e => { setAccountNumber(e.target.value.replace(/\D/g, "")); setError(""); setVerifiedName(""); }}
                  placeholder="10-digit number"
                  className="w-full border-2 border-[rgba(11,46,51,0.15)] rounded-xl px-4 py-3 text-sm text-navy-DEFAULT font-body outline-none focus:border-gold-muted"
                />
              </div>

              {verifying && (
                <div className="flex items-center gap-2 text-navy-DEFAULT/50 text-sm font-body">
                  <Loader2 size={14} className="animate-spin" /> Verifying account…
                </div>
              )}

              {verifiedName && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 font-body">
                  <CheckCircle size={16} />
                  <span className="text-sm"><strong>{verifiedName}</strong> — account verified</span>
                </div>
              )}

              {error && <ErrorBox message={error} />}

              <div className="flex gap-3">
                <button onClick={() => setStep("amount")} className="flex-1 py-3.5 rounded-2xl border border-[rgba(11,46,51,0.15)] text-navy-DEFAULT/60 text-sm font-body hover:border-navy-DEFAULT/30 transition-all">
                  Back
                </button>
                <button
                  onClick={saveBankAndProceed}
                  disabled={!verifiedName || loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#0B2E33] text-white font-bold text-sm font-body border border-[rgba(201,168,76,0.3)] hover:bg-[#144D54] transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <>Use This Account <ArrowRight size={14} className="text-gold-DEFAULT" /></>}
                </button>
              </div>
            </>
          )}

          {/* ── Step 3: Confirm ── */}
          {step === "confirm" && savedBank && (
            <>
              <div className="bg-[#0B2E33] rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[rgba(201,168,76,0.1)]" />
                <p className="text-white/50 text-[11px] uppercase tracking-widest font-body mb-1">You are withdrawing</p>
                <p className="text-white font-display font-bold text-2xl">₦{amountNum.toLocaleString()}</p>
              </div>

              <div className="bg-[rgba(11,46,51,0.04)] rounded-xl border border-[rgba(11,46,51,0.08)] overflow-hidden divide-y divide-[rgba(11,46,51,0.06)]">
                <ConfirmRow label="To Account" value={savedBank.accountName} sub={`${savedBank.bankName} ••••${savedBank.accountNumber.slice(-4)}`} />
                <ConfirmRow label="Withdrawal Amount" value={`₦${amountNum.toLocaleString()}`} />
                <ConfirmRow label="Service Fee" value={`-₦${fee}`} valueColor="text-red-500" />
                <ConfirmRow label="Total Debited" value={`₦${totalDeduct.toLocaleString()}`} bold valueColor="text-gold-DEFAULT" />
                <ConfirmRow label="You Receive" value={`₦${amountNum.toLocaleString()}`} bold valueColor="text-emerald-600" />
              </div>

              {savedBank && (
                <button
                  onClick={() => { setSavedBank(null); setStep("bank"); }}
                  className="text-xs text-navy-DEFAULT/40 hover:text-navy-DEFAULT transition-colors font-body"
                >
                  ✏ Change bank account
                </button>
              )}

              {error && <ErrorBox message={error} />}

              <div className="flex gap-3">
                <button onClick={() => setStep("amount")} className="flex-1 py-3.5 rounded-2xl border border-[rgba(11,46,51,0.15)] text-navy-DEFAULT/60 text-sm font-body hover:border-navy-DEFAULT/30 transition-all">
                  Cancel
                </button>
                <button
                  onClick={processWithdrawal}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#0B2E33] text-white font-bold text-sm font-body border border-[rgba(201,168,76,0.3)] hover:bg-[#144D54] transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : "Confirm & Withdraw"}
                </button>
              </div>
            </>
          )}

          {/* ── Processing ── */}
          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-10 gap-5">
              <div className="w-20 h-20 rounded-full bg-gold-faint border-2 border-gold-muted flex items-center justify-center">
                <Loader2 size={32} className="text-gold-DEFAULT animate-spin" />
              </div>
              <div className="text-center">
                <h3 className="font-display font-bold text-navy-DEFAULT text-lg mb-1">Processing Withdrawal</h3>
                <p className="text-navy-DEFAULT/55 text-sm font-body">Your funds are on their way to {savedBank?.bankName}…</p>
              </div>
            </div>
          )}

          {/* ── Success ── */}
          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-10 gap-5">
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                <CheckCircle size={36} className="text-emerald-500" />
              </div>
              <div className="text-center">
                <h3 className="font-display font-bold text-navy-DEFAULT text-xl mb-2">Withdrawal Initiated!</h3>
                <p className="text-navy-DEFAULT/55 text-sm font-body max-w-xs">
                  ₦{amountNum.toLocaleString()} is being sent to {savedBank?.accountName} ({savedBank?.bankName}).
                </p>
              </div>
              <button onClick={onClose} className="btn-ghost px-8 py-3 rounded-2xl text-sm">Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function FeeRow({ label, value, bold, color }: { label: string; value: string; bold?: boolean; color?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-sm font-body", bold ? "font-bold text-navy-DEFAULT" : "text-navy-DEFAULT/60")}>{label}</span>
      <span className={cn("text-sm font-body", bold ? "font-bold" : "", color ?? "text-navy-DEFAULT")}>{value}</span>
    </div>
  );
}

function ConfirmRow({ label, value, sub, bold, valueColor }: { label: string; value: string; sub?: string; bold?: boolean; valueColor?: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className={cn("text-sm font-body", bold ? "font-semibold text-navy-DEFAULT" : "text-navy-DEFAULT/55")}>{label}</span>
      <div className="text-right">
        <p className={cn("text-sm font-body", bold ? "font-bold" : "font-semibold text-navy-DEFAULT", valueColor)}>{value}</p>
        {sub && <p className="text-[11px] text-navy-DEFAULT/40 font-body">{sub}</p>}
      </div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-body">
      <AlertTriangle size={14} className="mt-0.5 shrink-0" />
      {message}
    </div>
  );
}