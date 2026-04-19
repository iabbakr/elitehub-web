"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageCircle, CheckCircle, Star, Clock, AlertTriangle,
  RefreshCw, ArrowRight, Users, MessageSquare, Zap,
  ChevronRight, Bell, Activity,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://elitehub-backend.onrender.com/api/v1";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SupportStats {
  activeChats: number;
  resolvedToday: number;
  totalResolved: number;
  averageRating: number;
  averageResponseTime: number;
  totalMessagesHandled: number;
}

interface Chat {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  subject: string;
  status: string;
  lastMessage?: string;
  lastMessageTime?: number;
  adminUnreadCount?: number;
  unreadCount?: number;
  createdAt: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(ts?: number): string {
  if (!ts) return "";
  const diff = Date.now() - ts;
  if (diff < 60000)   return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(ts).toLocaleDateString("en-NG", { month: "short", day: "numeric" });
}

function formatResponseTime(secs: number): string {
  if (secs < 60)   return `${Math.round(secs)}s`;
  if (secs < 3600) return `${Math.round(secs / 60)}m`;
  return `${Math.round(secs / 3600)}h`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  sub,
  pulse,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  sub?: string;
  pulse?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-[rgba(11,46,51,0.07)]">
      <div
        className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", pulse && "animate-pulse")}
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon size={17} style={{ color }} />
      </div>
      <p className="font-display font-bold text-xl text-navy-DEFAULT">{value}</p>
      <p className="text-navy-DEFAULT/50 text-xs font-body mt-0.5">{label}</p>
      {sub && <p className="text-navy-DEFAULT/35 text-[11px] font-body mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SupportDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, getToken } = useAuth();

  const [stats, setStats]       = useState<SupportStats | null>(null);
  const [chats, setChats]       = useState<Chat[]>([]);
  const [waitingCount, setWaiting] = useState(0);
  const [disputeCount, setDisputes] = useState(0);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isSupport = user?.role === "admin" || user?.role === "support_agent";

  // Auth guard
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user && !isSupport))) {
      router.replace("/profile");
    }
  }, [isLoading, isAuthenticated, user, isSupport, router]);

  const fetchAll = useCallback(async () => {
    if (!user?.uid) return;
    setRefreshing(true);
    try {
      const token = await getToken();
      const H = { Authorization: `Bearer ${token}` };

      const results = await Promise.allSettled([
        fetch(`${API_BASE}/support/stats`, { headers: H }),
        fetch(`${API_BASE}/support/chats?status=active&limit=5`, { headers: H }),
        fetch(`${API_BASE}/support/chats?status=waiting`, { headers: H }),
        fetch(`${API_BASE}/disputes?status=open`, { headers: H }),
      ]);

      if (results[0].status === "fulfilled") {
        const d = await results[0].value.json().catch(() => null);
        if (d?.success && d.stats) setStats(d.stats);
      }
      if (results[1].status === "fulfilled") {
        const d = await results[1].value.json().catch(() => null);
        if (d?.success) setChats((d.chats ?? []).slice(0, 5));
      }
      if (results[2].status === "fulfilled") {
        const d = await results[2].value.json().catch(() => null);
        if (d?.success) setWaiting(d.total ?? d.chats?.length ?? 0);
      }
      if (results[3].status === "fulfilled") {
        const d = await results[3].value.json().catch(() => null);
        if (d?.success) setDisputes(d.total ?? d.disputes?.length ?? 0);
      }
    } catch { /* silent */ }
    finally { setLoading(false); setRefreshing(false); }
  }, [user?.uid, getToken]);

  useEffect(() => {
    if (user?.uid) fetchAll();
  }, [user?.uid, fetchAll]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <div className="w-9 h-9 border-2 border-gold-DEFAULT border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
            <span className="text-white/70">Support Dashboard</span>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest font-body">Support Dashboard</p>
                <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/70 text-[10px] font-bold font-body capitalize">
                  {user.role === "admin" ? "ADMIN" : "SUPPORT AGENT"}
                </span>
              </div>
              <h1 className="font-display text-2xl font-bold text-white">{user.name}</h1>
            </div>
            <button
              onClick={() => { setRefreshing(true); fetchAll(); }}
              className="p-2.5 rounded-xl bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      <div className="section py-6 space-y-6 pb-16">

        {/* Waiting queue alert */}
        {waitingCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 animate-pulse">
              <Bell size={18} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-amber-800 font-body">
                {waitingCount} user{waitingCount > 1 ? "s" : ""} waiting for support
              </p>
              <p className="text-amber-600 text-xs font-body mt-0.5">Pick up pending requests from the app</p>
            </div>
            <span className="text-sm font-bold px-3 py-1 rounded-full bg-amber-400 text-amber-900">{waitingCount}</span>
          </div>
        )}

        {/* Stats grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-28 animate-pulse border border-[rgba(11,46,51,0.07)]" />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCard
              icon={MessageCircle}
              label="Active Chats"
              value={stats.activeChats}
              color="#3b82f6"
              pulse={stats.activeChats > 0}
            />
            <StatCard
              icon={CheckCircle}
              label="Resolved Today"
              value={stats.resolvedToday}
              color="#10b981"
            />
            <StatCard
              icon={Activity}
              label="Total Resolved"
              value={stats.totalResolved}
              color="#C9A84C"
            />
            <StatCard
              icon={Star}
              label="Avg Rating"
              value={stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "N/A"}
              color="#f59e0b"
              sub={stats.averageRating > 0 ? "out of 5.0" : "No ratings yet"}
            />
            <StatCard
              icon={Clock}
              label="Avg Response"
              value={formatResponseTime(stats.averageResponseTime)}
              color="#6366f1"
              sub="response time"
            />
            <StatCard
              icon={MessageSquare}
              label="Messages Sent"
              value={stats.totalMessagesHandled}
              color="#8b5cf6"
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-[rgba(11,46,51,0.07)] text-center">
            <p className="text-navy-DEFAULT/50 text-sm font-body">Could not load support statistics</p>
          </div>
        )}

        {/* Performance insight */}
        {stats && stats.averageRating > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-[rgba(11,46,51,0.07)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-4 rounded-full bg-gold-DEFAULT" />
                <h2 className="font-display font-bold text-navy-DEFAULT text-base">Response Quality</h2>
              </div>
              <span className={cn(
                "text-xs font-bold px-2.5 py-1 rounded-full",
                stats.averageRating >= 4.5 ? "bg-emerald-50 text-emerald-700"
                : stats.averageRating >= 3.5 ? "bg-amber-50 text-amber-700"
                : "bg-red-50 text-red-600"
              )}>
                {stats.averageRating >= 4.5 ? "Excellent" : stats.averageRating >= 3.5 ? "Good" : "Needs Improvement"}
              </span>
            </div>
            <div className="h-2 rounded-full bg-[rgba(11,46,51,0.08)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(stats.averageRating / 5) * 100}%`,
                  backgroundColor: stats.averageRating >= 4.5 ? "#10b981" : stats.averageRating >= 3.5 ? "#C9A84C" : "#ef4444",
                }}
              />
            </div>
            <div className="flex justify-between mt-3">
              <div>
                <p className="text-navy-DEFAULT/40 text-[11px] font-body">Response Speed</p>
                <p className="text-navy-DEFAULT font-bold text-sm font-body">{formatResponseTime(stats.averageResponseTime)}</p>
              </div>
              <div className="text-right">
                <p className="text-navy-DEFAULT/40 text-[11px] font-body">Chats Resolved</p>
                <p className="text-navy-DEFAULT font-bold text-sm font-body">{stats.totalResolved}</p>
              </div>
            </div>
          </div>
        )}

        {/* Active chats */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-0.5 h-4 rounded-full bg-gold-DEFAULT" />
            <h2 className="font-display font-bold text-navy-DEFAULT text-base">Your Active Chats</h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-20 animate-pulse border border-[rgba(11,46,51,0.07)]" />
              ))}
            </div>
          ) : chats.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-[rgba(11,46,51,0.07)] text-center">
              <CheckCircle size={28} className="text-emerald-400 mx-auto mb-2" />
              <p className="text-navy-DEFAULT/50 text-sm font-body">No active chats — queue is clear!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {chats.map(chat => {
                const hasUnread = (chat.adminUnreadCount ?? 0) > 0;
                return (
                  <div
                    key={chat.id}
                    className={cn(
                      "bg-white rounded-2xl p-4 border transition-all",
                      hasUnread ? "border-gold-muted border-l-4 border-l-gold-DEFAULT" : "border-[rgba(11,46,51,0.07)]"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-sm text-navy-DEFAULT font-body">{chat.userName}</p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold-faint border border-gold-muted text-gold-DEFAULT font-bold font-body capitalize">
                            {chat.userRole}
                          </span>
                        </div>
                        <p className="text-xs text-gold-DEFAULT font-body mb-1">{chat.subject}</p>
                        {chat.lastMessage && (
                          <p className={cn(
                            "text-xs font-body truncate",
                            hasUnread ? "text-navy-DEFAULT font-semibold" : "text-navy-DEFAULT/50"
                          )}>
                            {chat.lastMessage}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <p className="text-[11px] text-navy-DEFAULT/40 font-body">{formatTime(chat.lastMessageTime)}</p>
                        {hasUnread && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-DEFAULT text-navy-DEFAULT">
                            {chat.adminUnreadCount} new
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Disputes alert */}
        {disputeCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={22} className="text-red-500" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-red-800 font-body">
                {disputeCount} open dispute{disputeCount !== 1 ? "s" : ""} need{disputeCount === 1 ? "s" : ""} attention
              </p>
              <p className="text-red-600/70 text-xs font-body mt-0.5">Resolve disputes via the EliteHub app</p>
            </div>
            <span className="font-display font-bold text-3xl text-red-500">{disputeCount}</span>
          </div>
        )}

        {/* Quick actions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-0.5 h-4 rounded-full bg-gold-DEFAULT" />
            <h2 className="font-display font-bold text-navy-DEFAULT text-base">Quick Actions</h2>
          </div>

          <div className="space-y-3">
            {[
              {
                icon: MessageCircle,
                label: "All Support Chats",
                desc: "View chat history & pending requests",
                color: "#3b82f6",
              },
              {
                icon: AlertTriangle,
                label: "Manage Disputes",
                desc: "Review & resolve order disputes",
                color: "#ef4444",
              },
              {
                icon: Users,
                label: "Support Queue",
                desc: `${waitingCount} user${waitingCount !== 1 ? "s" : ""} waiting`,
                color: "#f59e0b",
              },
            ].map(action => (
              <div
                key={action.label}
                className="bg-white rounded-2xl p-4 border border-[rgba(11,46,51,0.07)] flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${action.color}18` }}>
                  <action.icon size={16} style={{ color: action.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-navy-DEFAULT font-body">{action.label}</p>
                  <p className="text-navy-DEFAULT/50 text-xs font-body truncate">{action.desc}</p>
                </div>
                <ChevronRight size={15} className="text-navy-DEFAULT/30 shrink-0" />
              </div>
            ))}
          </div>
          <p className="text-center text-navy-DEFAULT/40 text-xs font-body mt-3">
            Full support tools available in the EliteHub NG app
          </p>
        </div>
      </div>
    </div>
  );
}