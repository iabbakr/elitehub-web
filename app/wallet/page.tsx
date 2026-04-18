"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard, ArrowUpRight, ArrowDownLeft, RefreshCw,
  Eye, EyeOff, Clock, ShoppingBag, Zap, Gift,
  RotateCcw, Send, CheckCircle, Package,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/products";
import AppGateModal from "@/components/ui/AppGateModal";
import DepositModal from "@/components/modals/DepositModal"; // Ensure path is correct
import WithdrawModal from "@/components/modals/WithdrawModal"; // Ensure path is correct
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/utils";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://elitehub-backend.onrender.com/api/v1";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Transaction {
  id: string;
  type: "credit" | "debit";
  category: string;
  amount: number;
  description: string;
  status: "pending" | "completed" | "failed" | "cancelled" | "refunded";
  timestamp: number;
  metadata?: Record<string, unknown>;
}

type FilterTab = "all" | "credit" | "debit" | "pending";

// ── Category styling ──────────────────────────────────────────────────────────

const CATEGORY: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  deposit:        { icon: ArrowDownLeft, color: "#10b981", label: "Top Up" },
  withdrawal:     { icon: ArrowUpRight,  color: "#ef4444", label: "Withdrawal" },
  order_payment:  { icon: ShoppingBag,   color: "#3b82f6", label: "Order Payment" },
  order_release:  { icon: CheckCircle,   color: "#10b981", label: "Payment Released" },
  order_refund:   { icon: RotateCcw,     color: "#10b981", label: "Refund" },
  order:          { icon: ShoppingBag,   color: "#3b82f6", label: "Order" },
  bill:           { icon: Zap,           color: "#f59e0b", label: "Bills" },
  bill_payment:   { icon: Zap,           color: "#f59e0b", label: "Bill Payment" },
  bill_refund:    { icon: RotateCcw,     color: "#10b981", label: "Bill Refund" },
  commission:     { icon: Package,       color: "#6366f1", label: "Commission" },
  referral:       { icon: Gift,          color: "#ec4899", label: "Referral Bonus" },
  referral_bonus: { icon: Gift,          color: "#ec4899", label: "Referral" },
  subscription:   { icon: CreditCard,    color: "#8b5cf6", label: "Subscription" },
  refund:         { icon: RotateCcw,     color: "#10b981", label: "Refund" },
  transfer:       { icon: Send,          color: "#6366f1", label: "Transfer" },
};

const STATUS_COLOR: Record<string, string> = {
  completed: "#10b981",
  pending:   "#f59e0b",
  failed:    "#ef4444",
  cancelled: "#9ca3af",
  refunded:  "#10b981",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function TransactionRow({ txn }: { txn: Transaction }) {
  const cfg = CATEGORY[txn.category] ?? { icon: CreditCard, color: "#9ca3af", label: "Transaction" };
  const Icon = cfg.icon;
  const sign = txn.type === "credit" ? "+" : "−";
  const amountColor =
    txn.status === "pending"   ? "#f59e0b" :
    txn.status === "cancelled" ? "#9ca3af" :
    txn.status === "failed"    ? "#ef4444" :
    txn.type === "credit"      ? "#10b981" : "#ef4444";

  return (
    <div className="flex items-center gap-3.5 py-4 border-b border-[rgba(11,46,51,0.06)] last:border-0">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${cfg.color}18` }}
      >
        <Icon size={17} style={{ color: cfg.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-navy-DEFAULT font-body truncate">
          {txn.description || cfg.label}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-[11px] text-navy-DEFAULT/50 font-body">
            {new Date(txn.timestamp).toLocaleDateString("en-NG", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span
            className="text-[10px] font-bold font-body px-1.5 py-0.5 rounded-full capitalize"
            style={{
              color: STATUS_COLOR[txn.status] ?? "#9ca3af",
              backgroundColor: `${STATUS_COLOR[txn.status] ?? "#9ca3af"}18`,
            }}
          >
            {txn.status}
          </span>
          <span
            className="text-[10px] font-body px-1.5 py-0.5 rounded-full"
            style={{ color: cfg.color, backgroundColor: `${cfg.color}12` }}
          >
            {cfg.label}
          </span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-bold font-body" style={{ color: amountColor }}>
          {sign}₦{txn.amount.toLocaleString("en-NG")}
        </p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function WalletPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, getToken } = useAuth();

  const [balance, setBalance]           = useState(0);
  const [pending, setPending]           = useState(0);
  const [txns, setTxns]                 = useState<Transaction[]>([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [showBal, setShowBal]           = useState(true);
  const [filter, setFilter]             = useState<FilterTab>("all");
  const [gate, setGate]                 = useState(false);
  const [error, setError]               = useState("");

  // New Modal States
  const [showDeposit, setShowDeposit]   = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth?next=/wallet");
    }
  }, [isLoading, isAuthenticated, router]);

  const fetchData = useCallback(async () => {
    if (!user?.uid) return;
    setError("");
    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [balRes, txnRes] = await Promise.all([
        fetch(`${API_BASE}/wallet/balance/${user.uid}`, { headers }),
        fetch(`${API_BASE}/wallet/transactions/${user.uid}?limit=50`, { headers }),
      ]);
      const [balData, txnData] = await Promise.all([balRes.json(), txnRes.json()]);

      if (balData.success) {
        setBalance(balData.balance ?? 0);
        setPending(balData.pendingBalance ?? 0);
      }
      if (txnData.success) {
        const seen = new Map<string, Transaction>();
        for (const t of (txnData.transactions ?? []) as Transaction[]) {
          const existing = seen.get(t.id);
          if (!existing || t.timestamp > existing.timestamp) seen.set(t.id, t);
        }
        setTxns([...seen.values()].sort((a, b) => b.timestamp - a.timestamp));
      }
    } catch {
      setError("Could not load wallet data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.uid, getToken]);

  useEffect(() => {
    if (user?.uid) fetchData();
  }, [user?.uid, fetchData]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-DEFAULT border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const completed = txns.filter(t => t.status === "completed");
  const totalIn   = completed.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalOut  = completed.filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0);

  const filtered = txns.filter(t => {
    if (filter === "credit")  return t.type === "credit";
    if (filter === "debit")   return t.type === "debit";
    if (filter === "pending") return t.status === "pending";
    return true;
  });

  const TABS: { key: FilterTab; label: string }[] = [
    { key: "all",     label: "All" },
    { key: "credit",  label: "Money In" },
    { key: "debit",   label: "Money Out" },
    { key: "pending", label: "Pending" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4]">

      {/* ── Page header / balance card ────────────────────────────────── */}
      <div className="bg-[#0B2E33]">
        <div className="section py-10">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-7 font-body">
            <Link href="/" className="hover:text-gold-DEFAULT transition-colors">Home</Link>
            <span>/</span>
            <Link href="/profile" className="hover:text-gold-DEFAULT transition-colors">Profile</Link>
            <span>/</span>
            <span className="text-white/70">Wallet</span>
          </nav>

          <div className="relative rounded-2xl overflow-hidden bg-white/[0.07] border border-[rgba(201,168,76,0.28)] p-6 sm:p-8">
            <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[rgba(201,168,76,0.08)] blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/[0.04] blur-2xl pointer-events-none" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border border-[rgba(201,168,76,0.4)] bg-[rgba(201,168,76,0.14)] flex items-center justify-center">
                    <CreditCard size={14} className="text-gold-DEFAULT" />
                  </div>
                  <span className="text-white/55 text-[11px] font-semibold font-body uppercase tracking-widest">
                    Available Balance
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowBal(p => !p)}
                    className="p-2 rounded-full bg-white/10 text-white/55 hover:text-white hover:bg-white/20 transition-all"
                  >
                    {showBal ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    onClick={() => { setRefreshing(true); fetchData(); }}
                    className="p-2 rounded-full bg-white/10 text-white/55 hover:text-white hover:bg-white/20 transition-all"
                  >
                    <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                  </button>
                </div>
              </div>

              <p className="text-white font-display font-bold text-3xl sm:text-4xl mt-4 mb-1 tracking-tight">
                {loading ? "—" : showBal ? formatCurrency(balance) : "• • • • • •"}
              </p>

              {pending > 0 && (
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Clock size={11} className="text-white/40" />
                  <span className="text-white/40 text-xs font-body">
                    {formatCurrency(pending)} held in escrow
                  </span>
                </div>
              )}

              {/* Action buttons — Updated to trigger web modals */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDeposit(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/90 text-navy-DEFAULT text-sm font-bold font-body hover:bg-white active:scale-[0.98] transition-all"
                >
                  <ArrowDownLeft size={16} />
                  Deposit
                </button>
                <button
                  onClick={() => setShowWithdraw(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[rgba(201,168,76,0.4)] text-white text-sm font-bold font-body hover:bg-white/10 active:scale-[0.98] transition-all"
                >
                  <ArrowUpRight size={16} className="text-gold-DEFAULT" />
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Analytics summary ─────────────────────────────────────────── */}
      <div className="section -mt-4 grid grid-cols-2 gap-3 sm:gap-4">
        {[
          { label: "Total In",  amount: totalIn,  color: "#10b981", bg: "#10b98112" },
          { label: "Total Out", amount: totalOut, color: "#ef4444", bg: "#ef444412" },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-4 border border-[rgba(11,46,51,0.06)] shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: card.bg }}>
                {card.label === "Total In" ? <ArrowDownLeft size={13} style={{ color: card.color }} /> : <ArrowUpRight  size={13} style={{ color: card.color }} />}
              </div>
              <span className="text-xs text-navy-DEFAULT/50 font-body">{card.label}</span>
            </div>
            <p className="font-display font-bold text-navy-DEFAULT text-base sm:text-lg">
              {loading ? "—" : formatCurrency(card.amount)}
            </p>
          </div>
        ))}
      </div>

      {/* ── Transactions ──────────────────────────────────────────────── */}
      <div className="section py-6 pb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-5 rounded-full bg-gold-DEFAULT" />
            <h2 className="font-display font-bold text-navy-DEFAULT text-lg">Transaction History</h2>
          </div>
          {filtered.length > 0 && (
            <span className="text-xs text-navy-DEFAULT/40 font-body">{filtered.length} records</span>
          )}
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-none pb-1">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold font-body border transition-all ${
                filter === tab.key
                  ? "bg-gold-faint border-gold-muted text-gold-DEFAULT"
                  : "bg-white border-[rgba(11,46,51,0.1)] text-navy-DEFAULT/60 hover:border-gold-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[rgba(11,46,51,0.06)] px-4 shadow-sm">
          {loading ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-gold-DEFAULT border-t-transparent rounded-full animate-spin" />
              <p className="text-navy-DEFAULT/50 text-sm font-body">Loading transactions…</p>
            </div>
          ) : error ? (
            <div className="py-12 flex flex-col items-center gap-3 text-center">
              <span className="text-3xl">⚠️</span>
              <p className="text-navy-DEFAULT/60 text-sm font-body">{error}</p>
              <button onClick={() => { setLoading(true); fetchData(); }} className="btn-gold px-6 py-2.5 rounded-xl text-sm">Try Again</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-gold-faint border border-gold-muted flex items-center justify-center text-3xl">💳</div>
              <h3 className="font-display font-semibold text-navy-DEFAULT">
                {filter === "all" ? "No transactions yet" : `No ${filter === "credit" ? "incoming" : filter === "debit" ? "outgoing" : "pending"} transactions`}
              </h3>
              <p className="text-navy-DEFAULT/50 text-sm font-body max-w-xs">
                Your transaction history appears here once you start using your wallet.
              </p>
            </div>
          ) : (
            filtered.map(txn => <TransactionRow key={txn.id} txn={txn} />)
          )}
        </div>

        <div className="mt-6 bg-[#0B2E33] rounded-2xl p-5 sm:p-6 border border-[rgba(201,168,76,0.2)]">
          <p className="text-gold-DEFAULT text-[11px] font-bold uppercase tracking-widest font-body mb-1.5">Full Wallet Experience</p>
          <h3 className="text-white font-display font-bold text-base sm:text-lg mb-2">Deposit &amp; Withdraw via the App</h3>
          <p className="text-white/55 text-sm font-body mb-5 leading-relaxed">
            Fund your wallet with Paystack, withdraw to your bank account, and get real-time transaction alerts — all free on EliteHub NG.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-3 rounded-xl bg-gold-DEFAULT text-navy-DEFAULT text-sm font-bold font-body hover:bg-gold-light transition-all">🤖 Download for Android</a>
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-3 rounded-xl border border-white/20 text-white text-sm font-bold font-body hover:bg-white/10 transition-all">🍎 Download for iOS</a>
          </div>
        </div>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────── */}
      
      {showDeposit && (
        <DepositModal 
          onClose={() => setShowDeposit(false)} 
          onSuccess={(ref) => {
            setShowDeposit(false);
            fetchData();
          }} 
        />
      )}
      
      {showWithdraw && (
        <WithdrawModal 
          balance={balance}
          onClose={() => setShowWithdraw(false)} 
        />
      )}

      {/* App redirect for other gated features */}
      {gate && (
        <AppGateModal
          feature="wallet"
          onClose={() => setGate(false)}
        />
      )}
    </div>
  );
}