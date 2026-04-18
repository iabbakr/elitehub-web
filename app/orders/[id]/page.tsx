"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Package, Truck, CheckCircle, XCircle, Clock, 
  MapPin, Phone, User, Shield, MessageSquare, 
  Info, Printer, ExternalLink, ChevronLeft 
} from "lucide-react";
import { formatCurrency } from "@/lib/products";

// --- Types (Extended from your mobile store) ---
type OrderTrackingStatus = "acknowledged" | "enroute" | "ready_for_pickup";
type OrderStatus = "running" | "delivered" | "cancelled";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://elitehub-backend.onrender.com/api/v1";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, getToken } = useAuth();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const isBuyer = user?.uid === order?.buyerId;
  const isSeller = user?.uid === order?.sellerId;
  const isPickupOrder = order?.deliveryMethod === "pickup";

  // --- Fetching Logic ---
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch(`${API_BASE}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setOrder(data.order);
    } catch (err) {
      console.error("Failed to load order", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && id) fetchOrderDetails();
  }, [id, user]);

  // --- Actions (Mirroring Mobile Logic) ---
  const handleUpdateStatus = async (status: string, endpoint: string) => {
    if (!confirm(`Are you sure you want to update this order to ${status}?`)) return;
    try {
      setActionLoading(true);
      const token = await getToken();
      const res = await fetch(`${API_BASE}/orders/${id}/${endpoint}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchOrderDetails();
    } catch (err) {
      alert("Action failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // --- UI Components ---
  const TrackingTimeline = () => {
    const steps = isPickupOrder 
      ? [
          { key: "acknowledged", label: "Confirmed", icon: CheckCircle },
          { key: "ready_for_pickup", label: "Ready", icon: Package },
          { key: "delivered", label: "Picked Up", icon: CheckCircle },
        ]
      : [
          { key: "acknowledged", label: "Confirmed", icon: CheckCircle },
          { key: "enroute", label: "Shipped", icon: Truck },
          { key: "ready_for_pickup", label: "Delivered", icon: Package },
          { key: "delivered", label: "Completed", icon: CheckCircle },
        ];

    const currentIdx = steps.findIndex(s => s.key === order.trackingStatus);
    const isCompleted = order.status === "delivered";

    return (
      <div className="flex justify-between items-start mt-6 mb-8 relative">
        {/* Connector Line */}
        <div className="absolute top-4 left-0 w-full h-[2px] bg-[rgba(11,46,51,0.08)] -z-0" />
        
        {steps.map((step, i) => {
          const done = isCompleted || i <= currentIdx;
          const Icon = step.icon;
          return (
            <div key={step.key} className="flex flex-col items-center flex-1 z-10">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                done ? "bg-gold-DEFAULT border-gold-DEFAULT text-navy-DEFAULT shadow-gold" : "bg-white border-[rgba(11,46,51,0.1)] text-navy-DEFAULT/30"
              }`}>
                <Icon size={16} />
              </div>
              <span className={`text-[10px] uppercase font-bold mt-2 tracking-wider ${done ? "text-navy-DEFAULT" : "text-navy-DEFAULT/40"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading || !order) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4]">
      <div className="w-10 h-10 border-2 border-gold-DEFAULT border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F7F4] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-[rgba(11,46,51,0.08)] sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-1 text-navy-DEFAULT/60 hover:text-gold-DEFAULT transition-colors">
            <ChevronLeft size={20} /> <span className="text-sm font-bold">Back</span>
          </button>
          <div className="text-center">
            <h1 className="font-display font-bold text-navy-DEFAULT">Order Detail</h1>
            <p className="text-[10px] text-navy-DEFAULT/40 font-bold uppercase tracking-widest">#{order.id.slice(-6).toUpperCase()}</p>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-5 mt-6 space-y-4">
        
        {/* Status Card */}
        <div className="bg-white rounded-2xl p-6 border border-[rgba(11,46,51,0.06)] shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-gold-DEFAULT rounded-full" />
              <h2 className="font-display font-bold text-navy-DEFAULT">Order Journey</h2>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight border ${
              order.status === 'delivered' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-gold-faint border-gold-muted text-gold-DEFAULT'
            }`}>
              {order.status}
            </span>
          </div>
          
          {order.status === 'running' && <TrackingTimeline />}
          
          {/* Seller Tools (WhatsApp/Waybill) */}
          {isSeller && order.status === 'running' && (
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[rgba(11,46,51,0.06)]">
              <button 
                onClick={() => window.open(`https://wa.me/${order.phoneNumber}`, '_blank')}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gold-faint border border-gold-muted text-gold-DEFAULT text-xs font-bold hover:bg-gold-muted/10 transition-all"
              >
                <MessageSquare size={16} /> WhatsApp Buyer
              </button>
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gold-faint border border-gold-muted text-gold-DEFAULT text-xs font-bold hover:bg-gold-muted/10 transition-all">
                <Printer size={16} /> Print Waybill
              </button>
            </div>
          )}
        </div>

        {/* Items Card */}
        <div className="bg-white rounded-2xl p-6 border border-[rgba(11,46,51,0.06)] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-gold-DEFAULT rounded-full" />
            <h2 className="font-display font-bold text-navy-DEFAULT">Purchased Items</h2>
          </div>
          <div className="divide-y divide-[rgba(11,46,51,0.04)]">
            {order.products.map((item: any, idx: number) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0 flex justify-between">
                <div>
                  <p className="font-bold text-navy-DEFAULT text-sm">{item.productName}</p>
                  <p className="text-xs text-navy-DEFAULT/40 mt-1">Qty: {item.quantity} {item.selectedColor && `• ${item.selectedColor}`}</p>
                  {item.warranty && (
                    <div className="flex items-center gap-1 mt-2 text-emerald-600">
                      <Shield size={12} /> <span className="text-[10px] font-bold uppercase">{item.warranty} Warranty</span>
                    </div>
                  )}
                </div>
                <p className="font-display font-bold text-gold-DEFAULT">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Logistics */}
        <div className="bg-white rounded-2xl p-6 border border-[rgba(11,46,51,0.06)] shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gold-faint border border-gold-muted flex items-center justify-center text-gold-DEFAULT shrink-0">
              <User size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-navy-DEFAULT/40 uppercase tracking-widest mb-1">{isSeller ? 'Customer' : 'Seller'}</p>
              <p className="font-bold text-navy-DEFAULT">{isSeller ? order.buyerDetails?.name : (order.sellerDetails?.businessName || order.sellerDetails?.name)}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gold-faint border border-gold-muted flex items-center justify-center text-gold-DEFAULT shrink-0">
              <MapPin size={18} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-navy-DEFAULT/40 uppercase tracking-widest mb-1">{isPickupOrder ? 'Pickup Location' : 'Delivery Address'}</p>
              <p className="text-sm text-navy-DEFAULT/70 leading-relaxed">
                {isPickupOrder ? (order.sellerDetails?.businessAddress || "Store address not available") : order.deliveryAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-[rgba(11,46,51,0.06)] shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <Info size={80} className="text-navy-DEFAULT" />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-gold-DEFAULT rounded-full" />
            <h2 className="font-display font-bold text-navy-DEFAULT">Payment Breakdown</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-navy-DEFAULT/60">
              <span>Subtotal</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex justify-between text-sm text-navy-DEFAULT/60">
                <span>Delivery Fee</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-[rgba(11,46,51,0.08)] flex justify-between items-center">
              <span className="font-bold text-navy-DEFAULT">Total Paid</span>
              <span className="font-display text-xl font-bold text-gold-DEFAULT">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* Seller Payout Box */}
          {isSeller && (
            <div className="mt-4 p-4 rounded-xl bg-gold-faint border border-gold-muted border-dashed">
              <div className="flex justify-between text-xs font-medium text-navy-DEFAULT/60 mb-2">
                <span>Commission (5%)</span>
                <span className="text-red-500">-{formatCurrency(order.commission)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-navy-DEFAULT">Your Payout</span>
                <span className="text-sm font-bold text-emerald-600">{formatCurrency(order.totalAmount - order.commission)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {order.status === 'running' && (
          <div className="pt-4 space-y-3">
            {isBuyer && order.trackingStatus === 'ready_for_pickup' && (
              <button 
                onClick={() => handleUpdateStatus('delivered', 'confirm-delivery')}
                disabled={actionLoading}
                className="w-full py-4 rounded-2xl bg-navy-DEFAULT text-white font-bold shadow-lg hover:bg-navy-DEFAULT/90 transition-all border border-gold-muted flex items-center justify-center gap-2"
              >
                {actionLoading ? "Processing..." : "Confirm Delivery / Receipt"}
              </button>
            )}

            {isSeller && (
              <div className="space-y-3">
                {!order.trackingStatus && (
                   <button onClick={() => handleUpdateStatus('acknowledged', 'tracking')} className="btn-gold w-full py-4 rounded-2xl font-bold">Acknowledge Order</button>
                )}
                {order.trackingStatus === 'acknowledged' && !isPickupOrder && (
                  <button onClick={() => handleUpdateStatus('enroute', 'tracking')} className="btn-gold w-full py-4 rounded-2xl font-bold">Mark as Shipped</button>
                )}
                {((order.trackingStatus === 'acknowledged' && isPickupOrder) || order.trackingStatus === 'enroute') && (
                  <button onClick={() => handleUpdateStatus('ready_for_pickup', 'tracking')} className="btn-gold w-full py-4 rounded-2xl font-bold">
                    {isPickupOrder ? "Ready for Pickup" : "Mark as Delivered"}
                  </button>
                )}
              </div>
            )}

            <button className="w-full py-4 rounded-2xl bg-white border border-[rgba(11,46,51,0.1)] text-navy-DEFAULT font-bold text-sm">
              Open Dispute / Get Help
            </button>
          </div>
        )}
      </main>
    </div>
  );
}