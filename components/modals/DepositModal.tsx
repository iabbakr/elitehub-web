"use client";

import { useState } from "react";
import { X, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  onClose: () => void;
  onSuccess: (reference: string) => void;
}

export default function DepositModal({ onClose, onSuccess }: Props) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const handleInitialize = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 100) return alert("Minimum deposit is ₦100");

    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/wallet/initialize-deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: numAmount }),
      });
      const data = await res.json();
      
      if (data.success && data.authorization_url) {
        // Redirect to Paystack Web Checkout
        window.location.href = data.authorization_url;
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      alert(err.message || "Failed to initialize deposit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-DEFAULT/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display text-2xl font-bold text-navy-DEFAULT">Add Money</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-[#F8F7F4] border-2 border-gold-muted/30 rounded-2xl p-6 focus-within:border-gold-DEFAULT transition-all">
            <label className="text-[10px] font-bold text-navy-DEFAULT/40 uppercase tracking-widest block mb-2">Amount (NGN)</label>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gold-DEFAULT">₦</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-transparent text-3xl font-bold text-navy-DEFAULT outline-none w-full placeholder:text-navy-DEFAULT/10"
                autoFocus
              />
            </div>
          </div>

          <button
            onClick={handleInitialize}
            disabled={loading || !amount}
            className="w-full btn-gold py-4 rounded-2xl font-bold flex items-center justify-center gap-3 disabled:opacity-50 group"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Continue to Paystack"}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </div>
      </div>
    </div>
  );
}