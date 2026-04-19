"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye, Star, Users, TrendingUp, CreditCard, ArrowRight,
  RefreshCw, AlertTriangle, CheckCircle, Clock, Shield,
  Briefcase, MapPin, Share2, Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/products";
import AppGateModal from "@/components/ui/AppGateModal";
import { cn } from "@/lib/utils";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://elitehub-backend.onrender.com/api/v1";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SubscriptionStatus {
  isSubscribed: boolean;
  expiresAt: number;
  remainingDays: number;
  subscriptionType?: string;
  profileCompletionPercentage: number;
  subscriptionPrice?: number;
  isFirstYear?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  Home_Repair_Maintenance:   "Home Repair & Maintenance",
  Cleaning_Services:         "Cleaning Services",
  Logistics_Transport:       "Logistics & Transport",
  Events_Entertainment:      "Events & Entertainment",
  Tech_Gadgets_Repair:       "Tech & Gadget Repair",
  Automotive_Services:       "Automotive Services",
  Education_Lessons:         "Tutors & Lessons",
  Health_Wellness:           "Health & Wellness",
  Business_Professional:     "Business & Professional",
  Personal_Services:         "Beauty & Personal Services",
  Real_Estate_Services:      "Real Estate Services",
  Construction_Fabrication:  "Construction & Fabrication",
};

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[rgba(11,46,51,0.07)] shadow-sm">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${color}18` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <p className="font-display font-bold text-2xl text-navy-DEFAULT">{value}</p>
      <p className="text-navy-DEFAULT/50 text-xs font-body mt-0.5">{label}</p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ServiceDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, getToken } = useAuth();

  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [balance, setBalance]           = useState<number | null>(null);
  const [profile, setProfile]           = useState<any>(null);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [gatedFeature, setGated]        = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user && user.role !== "service"))) {
      router.replace("/profile");
    }
  }, [isLoading, isAuthenticated, user, router]);

  const fetchData = useCallback(async () => {
    if (!user?.uid) return;
    setRefreshing(true);
    try {
      const token   = await getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [profileRes, balanceRes, subRes] = await Promise.all([
        fetch(`${API_BASE}/users/profile/${user.uid}`, { headers }),
        fetch(`${API_BASE}/wallet/balance/${user.uid}`, { headers }),
        fetch(`${API_BASE}/service-providers/subscription/status`, { headers }),
      ]);

      const [profileData, balanceData, subData] = await Promise.all([
        profileRes.json(),
        balanceRes.json(),
        subRes.json(),
      ]);

      if (profileData.user) setProfile(profileData.user);
      if (balanceData.success) setBalance(balanceData.balance ?? 0);
      if (subData.success)    setSubscription(subData.subscription);
    } catch { /* silent */ }
    finally { setLoading(false); setRefreshing(false); }
  }, [user?.uid, getToken]);

  useEffect(() => {
    if (user?.uid) fetchData();
  }, [user?.uid, fetchData]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <div className="w-9 h-9 border-2 border-gold-DEFAULT border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const profileCompletion = subscription?.profileCompletionPercentage ?? 0;
  const isSubscribed      = subscription?.isSubscribed ?? false;
  const remainingDays     = subscription?.remainingDays ?? 0;
  const isAvailable       = profile?.isAvailable !== false;
  const canSubscribe      = profileCompletion >= 70;

  return (
    <div className="min-h-screen bg-[#F8F7F4]">

      {/* Header */}
      <div className="bg-[#0B2E33]">
        <div className="section py-10">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-6 font-body">
            <Link href="/" className="hover:text-gold-DEFAULT transition-colors">Home</Link>
            <span>/</span>
            <Link href="/profile" className="hover:text-gold-DEFAULT transition-colors">Profile</Link>
            <span>/</span>
            <span className="text-white/70">Service Dashboard</span>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest font-body mb-1">Professional Hub</p>
              <h1 className="font-display text-2xl font-bold text-white">{user.businessName || user.name}</h1>
              {user.serviceCategory && (
                <p className="text-white/50 text-sm font-body mt-0.5">
                  {CATEGORY_LABELS[user.serviceCategory] ?? user.serviceCategory}
                </p>
              )}
            </div>
            <button
              onClick={() => { setRefreshing(true); fetchData(); }}
              className="p-2.5 rounded-xl bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Availability + Wallet strip */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <Link href="/wallet" className="bg-white/[0.07] border border-[rgba(201,168,76,0.25)] rounded-2xl p-4 hover:bg-white/10 transition-all">
              <p className="text-white/45 text-[11px] font-body uppercase tracking-widest mb-1">Wallet Balance</p>
              <p className="font-display font-bold text-gold-DEFAULT text-xl">
                {loading ? "—" : balance !== null ? formatCurrency(balance) : "—"}
              </p>
            </Link>

            <div className={cn(
              "rounded-2xl p-4 border",
              isAvailable && isSubscribed
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-white/[0.07] border-white/15"
            )}>
              <p className="text-white/45 text-[11px] font-body uppercase tracking-widest mb-1">Visibility</p>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isAvailable && isSubscribed ? "#10b981" : "#9ca3af" }}
                />
                <p className={cn(
                  "font-bold text-sm font-body",
                  isAvailable && isSubscribed ? "text-emerald-400" : "text-white/60"
                )}>
                  {isAvailable && isSubscribed ? "Online" : "Offline"}
                </p>
              </div>
              <p className="text-white/35 text-[11px] font-body mt-0.5">
                {isSubscribed ? "Visible to customers" : "Subscribe to go online"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="section py-8 space-y-6 pb-16">

        {/* Profile completion */}
        <div className={cn(
          "rounded-2xl p-5 border",
          profileCompletion >= 70
            ? "bg-white border-emerald-200"
            : "bg-white border-amber-200"
        )}>
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              profileCompletion >= 70 ? "bg-emerald-50" : "bg-amber-50"
            )}>
              {profileCompletion >= 70
                ? <CheckCircle size={18} className="text-emerald-500" />
                : <AlertTriangle size={18} className="text-amber-500" />}
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-navy-DEFAULT font-body">Profile Health</p>
              <p className="text-navy-DEFAULT/50 text-xs font-body">
                {profileCompletion >= 70
                  ? "Your profile is ready for visibility"
                  : `Complete to ${70 - profileCompletion}% more to subscribe`}
              </p>
            </div>
            <span className={cn(
              "font-display font-bold text-lg",
              profileCompletion >= 70 ? "text-emerald-500" : "text-amber-500"
            )}>
              {loading ? "—" : `${profileCompletion}%`}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 rounded-full bg-[rgba(11,46,51,0.08)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, profileCompletion)}%`,
                backgroundColor: profileCompletion >= 70 ? "#10b981" : "#f59e0b",
              }}
            />
          </div>

          {profileCompletion < 70 && (
            <button
              onClick={() => setGated("seller_dashboard")}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-xs font-bold font-body hover:bg-amber-100 transition-all"
            >
              Complete Profile in App <ArrowRight size={12} />
            </button>
          )}
        </div>

        {/* Subscription status */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-0.5 h-4 rounded-full bg-gold-DEFAULT" />
            <h2 className="font-display font-bold text-navy-DEFAULT text-base">Subscription</h2>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl h-32 animate-pulse border border-[rgba(11,46,51,0.07)]" />
          ) : isSubscribed ? (
            <div className="bg-white rounded-2xl p-5 border border-emerald-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <Shield size={18} className="text-emerald-500" />
                </div>
                <div>
                  <p className="font-bold text-sm text-navy-DEFAULT font-body">
                    Active · {subscription?.subscriptionType?.toUpperCase()}
                  </p>
                  <p className="text-navy-DEFAULT/50 text-xs font-body mt-0.5">
                    {remainingDays} days remaining · Expires{" "}
                    {new Date(subscription!.expiresAt).toLocaleDateString("en-NG", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {remainingDays <= 7 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 mb-3">
                  <p className="text-amber-700 text-xs font-body">
                    ⚠️ Your subscription expires in {remainingDays} days. Renew via the app.
                  </p>
                </div>
              )}

              <button
                onClick={() => setGated("seller_dashboard")}
                className="w-full text-center py-2.5 rounded-xl border border-[rgba(11,46,51,0.12)] text-navy-DEFAULT/60 text-xs font-bold font-body hover:border-gold-muted transition-all"
              >
                Manage Subscription in App
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-5 border border-red-200">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <AlertTriangle size={18} className="text-red-500" />
                </div>
                <div>
                  <p className="font-bold text-sm text-navy-DEFAULT font-body">No Active Subscription</p>
                  <p className="text-navy-DEFAULT/50 text-xs font-body mt-0.5">
                    Subscribe to appear in search results and get customer bookings.
                  </p>
                </div>
              </div>

              {/* Plans */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "First Year",
                    price: 10000,
                    duration: "365 days",
                    badge: "Best Value",
                    color: "#C9A84C",
                  },
                  {
                    label: "Monthly",
                    price: 5000,
                    duration: "30 days",
                    badge: null,
                    color: "#0B2E33",
                  },
                ].map(plan => (
                  <button
                    key={plan.label}
                    onClick={() => setGated("seller_dashboard")}
                    disabled={!canSubscribe}
                    className={cn(
                      "rounded-xl p-4 border-2 text-left relative transition-all",
                      canSubscribe
                        ? "hover:border-gold-DEFAULT hover:shadow-gold cursor-pointer"
                        : "opacity-50 cursor-not-allowed",
                      "border-[rgba(11,46,51,0.12)]"
                    )}
                  >
                    {plan.badge && (
                      <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gold-faint text-gold-DEFAULT border border-gold-muted">
                        {plan.badge}
                      </span>
                    )}
                    <p className="font-bold text-xs text-navy-DEFAULT/60 font-body mb-1">{plan.label}</p>
                    <p className="font-display font-bold text-navy-DEFAULT text-lg">
                      ₦{plan.price.toLocaleString()}
                    </p>
                    <p className="text-navy-DEFAULT/40 text-[11px] font-body">{plan.duration}</p>
                  </button>
                ))}
              </div>

              {!canSubscribe && (
                <p className="text-amber-600 text-xs font-body text-center mt-3">
                  Complete your profile to at least 70% to subscribe.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        {profile && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-0.5 h-4 rounded-full bg-gold-DEFAULT" />
              <h2 className="font-display font-bold text-navy-DEFAULT text-base">Analytics</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatCard icon={Eye}    label="Profile Views" value={profile.profileViews  ?? 0} color="#8b5cf6" />
              <StatCard icon={Star}   label="Rating"        value={profile.rating?.toFixed(1) ?? "—"} color="#f59e0b" />
              <StatCard icon={Users}  label="Followers"     value={profile.followerCount ?? 0} color="#C9A84C" />
            </div>
          </div>
        )}

        {/* Profile details */}
        {profile && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-0.5 h-4 rounded-full bg-gold-DEFAULT" />
              <h2 className="font-display font-bold text-navy-DEFAULT text-base">Your Profile</h2>
            </div>
            <div className="bg-white rounded-2xl border border-[rgba(11,46,51,0.07)] overflow-hidden divide-y divide-[rgba(11,46,51,0.05)]">
              {[
                { icon: Briefcase, label: "Business Name",  value: profile.businessName },
                { icon: MapPin,    label: "Location",       value: profile.location ? `${profile.location.city}, ${profile.location.state}` : undefined },
                { icon: Star,      label: "Subcategory",    value: profile.serviceSubcategory },
                { icon: Clock,     label: "Experience",     value: profile.yearsOfExperience ? `${profile.yearsOfExperience} years` : undefined },
                { icon: Shield,    label: "RC Number",      value: profile.rcNumber ? "Verified Business" : undefined },
              ].filter(r => r.value).map(row => (
                <div key={row.label} className="flex items-center gap-3.5 px-4 py-3.5">
                  <div className="w-8 h-8 rounded-xl bg-gold-faint border border-gold-muted flex items-center justify-center shrink-0">
                    <row.icon size={14} className="text-gold-DEFAULT" />
                  </div>
                  <div>
                    <p className="text-[11px] text-navy-DEFAULT/40 font-body uppercase tracking-wide">{row.label}</p>
                    <p className="text-sm text-navy-DEFAULT font-semibold font-body">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-0.5 h-4 rounded-full bg-gold-DEFAULT" />
            <h2 className="font-display font-bold text-navy-DEFAULT text-base">Quick Actions</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                icon: Briefcase,
                label: "Edit Profile",
                desc: "Update your services, photos, description",
                onClick: () => setGated("seller_dashboard"),
              },
              {
                icon: Share2,
                label: "Share Profile",
                desc: "Share your profile on WhatsApp & social",
                onClick: () => setGated("seller_dashboard"),
              },
              {
                icon: CreditCard,
                label: "Wallet & Payments",
                desc: "Deposit, withdraw, view transactions",
                href: "/wallet",
              },
              {
                icon: Star,
                label: "Reviews & Ratings",
                desc: "See what customers say about you",
                onClick: () => setGated("seller_dashboard"),
              },
            ].map(action => (
              action.href ? (
                <Link
                  key={action.label}
                  href={action.href}
                  className="bg-white rounded-2xl p-4 border border-[rgba(11,46,51,0.07)] flex items-center gap-3 hover:border-gold-muted hover:shadow-gold transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-gold-faint border border-gold-muted flex items-center justify-center shrink-0 group-hover:bg-gold-DEFAULT group-hover:border-gold-DEFAULT transition-all">
                    <action.icon size={16} className="text-gold-DEFAULT group-hover:text-navy-DEFAULT transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-navy-DEFAULT font-body">{action.label}</p>
                    <p className="text-xs text-navy-DEFAULT/45 font-body truncate">{action.desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-navy-DEFAULT/30 group-hover:text-gold-DEFAULT transition-colors shrink-0" />
                </Link>
              ) : (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="bg-white rounded-2xl p-4 border border-[rgba(11,46,51,0.07)] flex items-center gap-3 hover:border-gold-muted hover:shadow-gold transition-all group text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-gold-faint border border-gold-muted flex items-center justify-center shrink-0 group-hover:bg-gold-DEFAULT group-hover:border-gold-DEFAULT transition-all">
                    <action.icon size={16} className="text-gold-DEFAULT group-hover:text-navy-DEFAULT transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-navy-DEFAULT font-body">{action.label}</p>
                    <p className="text-xs text-navy-DEFAULT/45 font-body truncate">{action.desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-navy-DEFAULT/30 group-hover:text-gold-DEFAULT transition-colors shrink-0" />
                </button>
              )
            ))}
          </div>
        </div>

        {/* App CTA */}
        <div className="bg-[#0B2E33] rounded-2xl p-6 border border-[rgba(201,168,76,0.2)] text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[rgba(201,168,76,0.08)] pointer-events-none" />
          <div className="relative">
            <p className="text-gold-DEFAULT text-[11px] font-bold uppercase tracking-widest font-body mb-2">Full Control</p>
            <h3 className="font-display font-bold text-white text-lg mb-2">Manage Your Services on Mobile</h3>
            <p className="text-white/55 text-xs font-body max-w-sm mx-auto mb-5">
              Toggle availability, update your profile photos, share your profile link, and receive booking enquiries — all from the app.
            </p>
            <button
              onClick={() => setGated("seller_dashboard")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-DEFAULT text-navy-DEFAULT font-bold text-sm font-body hover:bg-gold-light transition-all"
            >
              Open Provider App <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {gatedFeature && (
        <AppGateModal feature={gatedFeature as any} onClose={() => setGated(null)} />
      )}
    </div>
  );
}