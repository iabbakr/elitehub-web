"use client";

import { useState, useEffect } from "react";
import { X, Building2, AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/products";

export default function WithdrawModal({ onClose, balance }: { onClose: () => void; balance: number }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [bank, setBank] = useState<any>(null);
  const { user, getToken } = useAuth();

  // Fee Logic mirrored from mobile
  const amountNum = parseFloat(amount) || 0;
  const fee = amountNum < 2000 ? 50 : amountNum < 200000 ? 150 : 500;
  const totalDeduction = amountNum + fee;

  useEffect(() => {
    // In a real app, you'd fetch the saved bank from your user context/doc
    if (user?.bankAccount) setBank(user.bankAccount);
  }, [user]);

  const handleWithdraw = async () => {
    if (totalDeduction > balance) return alert("Insufficient balance to cover amount + fee.");
    if (amountNum < 1000) return alert("Minimum withdrawal is ₦1,000");

    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/wallet/initialize-withdrawal`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          userId: user?.uid,
          amountKobo: amountNum * 100,
          feeKobo: fee * 100,
          accountNumber: bank.accountNumber,
          bankCode: bank.bankCode,
          accountName: bank.accountName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Withdrawal Successful! Funds are on the way.");
        onClose();
        window.location.reload();
      } else throw new Error(data.message);
    } catch (err: any) {
      alert(err.message || "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-DEFAULT/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="bg-[#0B2E33] p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="font-display text-xl font-bold">Withdraw Funds</h2>
            <p className="text-white/50 text-xs mt-1">Available: {formatCurrency(balance)}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Bank Info Chip */}
          {bank ? (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gold-faint border border-gold-muted/30">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gold-DEFAULT shadow-sm">
                <Building2 size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-navy-DEFAULT">{bank.accountName}</p>
                <p className="text-xs text-navy-DEFAULT/50">{bank.bankName} • {bank.accountNumber}</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">VERIFIED</span>
            </div>
          ) : (
            <div className="p-4 rounded-2xl border-2 border-dashed border-gray-200 text-center">
              <p className="text-sm text-gray-500">No bank account linked. Please use the mobile app to link your bank.</p>
            </div>
          )}

          {/* Amount Input */}
          <div className="space-y-4">
            <div className="bg-[#F8F7F4] border-2 border-gold-muted/20 rounded-2xl p-5">
              <label className="text-[10px] font-bold text-navy-DEFAULT/40 uppercase tracking-widest block mb-2">Withdraw Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent text-2xl font-bold text-navy-DEFAULT outline-none w-full"
                placeholder="₦ 0.00"
              />
            </div>

            {/* Breakdown Card */}
            {amountNum > 0 && (
              <div className="rounded-2xl border border-navy-DEFAULT/5 p-4 text-sm space-y-2">
                <div className="flex justify-between text-navy-DEFAULT/60">
                  <span>Processing Fee</span>
                  <span className="text-red-500">-{formatCurrency(fee)}</span>
                </div>
                <div className="flex justify-between font-bold text-navy-DEFAULT pt-2 border-t border-navy-DEFAULT/5">
                  <span>Total to deduct</span>
                  <span>{formatCurrency(totalDeduction)}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-600">
                  <span>You receive</span>
                  <span>{formatCurrency(amountNum)}</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleWithdraw}
            disabled={loading || !bank || totalDeduction > balance || amountNum < 1000}
            className="w-full btn-gold py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Confirm Withdrawal"}
          </button>
        </div>
      </div>
    </div>
  );
}