"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, ArrowRight, ArrowLeft, Check, Loader2, Mail } from "lucide-react";
import { useAuth, SignUpPayload } from "@/contexts/AuthContext";
import { SELLER_CATEGORIES, SERVICE_CATEGORIES } from "@/lib/categories";
import { NIGERIAN_STATES, NIGERIAN_STATE_NAMES } from "@/lib/nigeria-locations";
import { cn } from "@/lib/utils";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://elitehub-backend.onrender.com/api/v1";

// ── OTP Input ─────────────────────────────────────────────────────────────────
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array(6).fill("").map((_, i) => value[i] || "");

  const handle = (index: number, key: string, text: string) => {
    if (key === "Backspace") {
      if (!value[index] && index > 0) refs.current[index - 1]?.focus();
      onChange(value.slice(0, index) + value.slice(index + 1));
      return;
    }
    const d = text.replace(/\D/g, "").slice(-1);
    if (!d) return;
    onChange(value.slice(0, index) + d + value.slice(index + 1));
    if (index < 5) refs.current[index + 1]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center my-5">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(r) => { refs.current[i] = r; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handle(i, "", e.target.value)}
          onKeyDown={(e) => { if (e.key === "Backspace") handle(i, "Backspace", ""); }}
          className={cn(
            "w-11 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all bg-white/5 text-white",
            d ? "border-gold-DEFAULT bg-gold-faint" : "border-white/20 focus:border-gold-DEFAULT"
          )}
        />
      ))}
    </div>
  );
}

// ── Password strength ─────────────────────────────────────────────────────────
function passwordStrength(pw: string) {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length > 6)            score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  const map = ["", "Weak", "Fair", "Good", "Strong"];
  const col = ["", "#ef4444", "#FFD700", "#90EE90", "#C9A84C"];
  return { score, label: map[score] || "", color: col[score] || "" };
}

// ── Step indicator ────────────────────────────────────────────────────────────
function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5 justify-center mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-full transition-all duration-300",
            i < current
              ? "bg-gold-DEFAULT"
              : "bg-white/20",
            i === current - 1 ? "w-6 h-2" : "w-2 h-2"
          )}
        />
      ))}
    </div>
  );
}

// ── Main Auth Page ────────────────────────────────────────────────────────────
export default function AuthPage() {
  const router      = useRouter();
  const params      = useSearchParams();
  const { signIn, signUp, isLoading, error, clearError, isAuthenticated } = useAuth();

  const [mode, setMode]   = useState<"signin" | "signup">(
    params.get("mode") === "signup" ? "signup" : "signin"
  );
  const [step, setStep]   = useState(1);

  // Sign-in fields
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);

  // Sign-up fields
  const [role,    setRole]    = useState<"buyer" | "seller" | "service">("buyer");
  const [name,    setName]    = useState("");
  const [phone,   setPhone]   = useState("");
  const [gender,  setGender]  = useState<"male" | "female" | "other">("male");
  const [refCode, setRefCode] = useState("");

  const [sellerCats,   setSellerCats]   = useState<string[]>([]);
  const [serviceCat,   setServiceCat]   = useState("");

  const [stateVal, setStateVal] = useState("");
  const [cityVal,  setCityVal]  = useState("");

  const [suEmail,        setSuEmail]        = useState("");
  const [otpCode,        setOtpCode]        = useState("");
  const [emailVerified,  setEmailVerified]  = useState(false);
  const [otpSent,        setOtpSent]        = useState(false);
  const [sendingOtp,     setSendingOtp]     = useState(false);
  const [verifyingOtp,   setVerifyingOtp]   = useState(false);
  const [resendTimer,    setResendTimer]    = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [suPassword,  setSuPassword]  = useState("");
  const [suConfirm,   setSuConfirm]   = useState("");
  const [showSuPw,    setShowSuPw]    = useState(false);
  const [showSuConf,  setShowSuConf]  = useState(false);
  const [termsOk,     setTermsOk]     = useState(false);

  const [localError, setLocalError] = useState("");

  const TOTAL_STEPS = 6;

  // Redirect if already signed in
  useEffect(() => {
    if (isAuthenticated) {
      const next = params.get("next") || "/profile";
      router.replace(next);
    }
  }, [isAuthenticated, router, params]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const cities = stateVal ? (NIGERIAN_STATES[stateVal] || []) : [];

  const startTimer = (s = 60) => {
    setResendTimer(s);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer((t) => { if (t <= 1) { clearInterval(timerRef.current!); return 0; } return t - 1; });
    }, 1000);
  };

  const sendOtp = async () => {
    const clean = suEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) { setLocalError("Enter a valid email address."); return; }
    setSendingOtp(true); setLocalError("");
    try {
      const res = await fetch(`${API_BASE}/otp/send-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clean }),
      });
      const data = await res.json();
      if (data.success) { setOtpSent(true); startTimer(60); }
      else setLocalError(data.message || "Failed to send code.");
    } catch { setLocalError("Network error. Please try again."); }
    finally { setSendingOtp(false); }
  };

  const verifyOtp = async () => {
    if (otpCode.length !== 6) { setLocalError("Enter the full 6-digit code."); return; }
    setVerifyingOtp(true); setLocalError("");
    try {
      const res = await fetch(`${API_BASE}/otp/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: suEmail.trim().toLowerCase(), code: otpCode }),
      });
      const data = await res.json();
      if (data.success) setEmailVerified(true);
      else { setLocalError("Incorrect or expired code."); setOtpCode(""); }
    } catch { setLocalError("Verification failed. Try again."); }
    finally { setVerifyingOtp(false); }
  };

  // ── Step validation ──────────────────────────────────────────────────────
  const validate = (): string => {
    if (mode === "signin") return "";
    switch (step) {
      case 2: return name.trim() ? "" : "Full name is required.";
      case 3:
        if (role === "seller"  && sellerCats.length === 0) return "Select at least one category.";
        if (role === "service" && !serviceCat)             return "Select your service type.";
        return "";
      case 4: return stateVal ? "" : "Select your state.";
      case 5: return emailVerified ? "" : "Please verify your email first.";
      case 6:
        if (!suPassword)                         return "Enter a password.";
        if (suPassword !== suConfirm)            return "Passwords do not match.";
        if (passwordStrength(suPassword).score < 2) return "Password is too weak.";
        if (!termsOk)                            return "Accept terms to continue.";
        return "";
      default: return "";
    }
  };

  const next = () => {
    const err = validate();
    if (err) { setLocalError(err); return; }
    setLocalError("");
    if (step === 3 && role === "service") { setStep(s => s + 1); return; }
    setStep(s => s + 1);
  };

  const back = () => { setLocalError(""); setStep(s => s - 1); };

  const toggleMode = (m: "signin" | "signup") => {
    setMode(m); setStep(1);
    clearError(); setLocalError("");
  };

  // ── Final submit ─────────────────────────────────────────────────────────
  const handleSignIn = async () => {
    clearError(); setLocalError("");
    if (!email || !password) { setLocalError("Email and password are required."); return; }
    await signIn(email, password);
  };

  const handleSignUp = async () => {
    const err = validate();
    if (err) { setLocalError(err); return; }
    const payload: SignUpPayload = {
      email:    suEmail.trim().toLowerCase(),
      password: suPassword,
      role,
      name:     name.trim(),
      phone:    phone.trim() || undefined,
      gender,
      referralCode: refCode.trim() || undefined,
      location: stateVal ? { state: stateVal, city: cityVal || cities[0] || stateVal, area: cityVal || stateVal } : undefined,
      sellerCategories: role === "seller"  ? sellerCats : undefined,
      serviceCategory:  role === "service" ? serviceCat : undefined,
      interests:        role === "buyer"   ? sellerCats : undefined,
    };
    await signUp(payload);
  };

  const displayError = error || localError;
  const strength     = passwordStrength(suPassword);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#071E22] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold-faint blur-3xl translate-x-1/2 -translate-y-1/4 opacity-60" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#144D54]/40 blur-2xl -translate-x-1/3 translate-y-1/3" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #C9A84C 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white border border-gold-muted flex items-center justify-center mb-3 shadow-[0_0_24px_rgba(201,168,76,0.2)]">
            <Image src="/logo.png" alt="EliteHub NG" width={44} height={44} className="object-contain rounded-lg" />
          </div>
          <p className="font-display font-bold text-white text-xl tracking-tight">
            EliteHub<span className="text-gold-DEFAULT"> NG</span>
          </p>
          <p className="text-white/40 text-xs tracking-widest uppercase mt-0.5 font-body">Nigeria's Trusted Marketplace</p>
        </div>

        {/* Step dots — signup only */}
        {mode === "signup" && <StepDots total={TOTAL_STEPS} current={step} />}

        {/* Card */}
        <div className="bg-[#0B2E33]/80 backdrop-blur-md rounded-3xl border border-white/10 p-7 shadow-[0_24px_60px_rgba(0,0,0,0.4)]">

          {/* Mode toggle */}
          <div className="flex bg-white/5 rounded-full p-1 mb-6">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => toggleMode(m)}
                className={cn(
                  "flex-1 py-2.5 rounded-full text-sm font-semibold transition-all font-body",
                  mode === m
                    ? "bg-white/10 border border-gold-muted text-gold-DEFAULT"
                    : "text-white/40"
                )}
              >
                {m === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* ─ SIGN IN ──────────────────────────────────────────────────── */}
          {mode === "signin" && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5 font-body">Email</p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/30 text-sm outline-none focus:border-gold-DEFAULT transition-all font-body"
                />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5 font-body">Password</p>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
                    placeholder="Your password"
                    autoComplete="current-password"
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/30 text-sm outline-none focus:border-gold-DEFAULT transition-all font-body"
                  />
                  <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <a href="/forgot-password" className="text-gold-DEFAULT text-xs hover:underline font-body">
                  Forgot Password?
                </a>
              </div>
              {displayError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5 text-red-400 text-sm font-body">
                  {displayError}
                </div>
              )}
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#144D54] border border-gold-muted text-white font-bold text-sm hover:bg-[#1a5f68] transition-all disabled:opacity-50 font-body"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Sign In <ArrowRight size={15} className="text-gold-DEFAULT" /></>}
              </button>
            </div>
          )}

          {/* ─ SIGN UP ──────────────────────────────────────────────────── */}
          {mode === "signup" && (
            <div>
              {/* Step label */}
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gold-DEFAULT mb-1 font-body">STEP {step} / {TOTAL_STEPS}</p>
                <p className="font-display font-bold text-white text-xl">
                  {[
                    "Who are you?",
                    "About you",
                    role === "buyer" ? "Your interests" : role === "seller" ? "Your categories" : "Your service type",
                    "Your location",
                    "Verify your email",
                    "Create your password",
                  ][step - 1]}
                </p>
              </div>

              {/* STEP 1 — Role */}
              {step === 1 && (
                <div className="space-y-3">
                  {[
                    { r: "buyer",   label: "Buyer",           desc: "Browse & purchase from verified sellers",     emoji: "🛍️" },
                    { r: "seller",  label: "Seller",          desc: "List products & reach buyers nationwide",     emoji: "🏪" },
                    { r: "service", label: "Service Provider",desc: "Offer professional services near you",        emoji: "🔧" },
                  ].map((item) => (
                    <button
                      key={item.r}
                      onClick={() => {
                        setRole(item.r as any);
                        setSellerCats([]);
                        setServiceCat("");
                        next();
                      }}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all",
                        role === item.r
                          ? "border-gold-DEFAULT bg-gold-faint"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      )}
                    >
                      <span className="text-3xl">{item.emoji}</span>
                      <div>
                        <p className={cn("font-bold text-sm font-body", role === item.r ? "text-gold-DEFAULT" : "text-white")}>
                          {item.label}
                        </p>
                        <p className="text-white/45 text-xs font-body">{item.desc}</p>
                      </div>
                      {role === item.r && <div className="ml-auto w-2 h-2 rounded-full bg-gold-DEFAULT" />}
                    </button>
                  ))}
                </div>
              )}

              {/* STEP 2 — Personal info */}
              {step === 2 && (
                <div className="space-y-4">
                  {[
                    { label: "Full Name *", ph: "e.g. Amina Yusuf", val: name, set: setName, type: "text", auto: "name" },
                    { label: "Phone (Optional)", ph: "0801 234 5678", val: phone, set: setPhone, type: "tel", auto: "tel" },
                    { label: "Referral Code", ph: "Optional", val: refCode, set: setRefCode, type: "text", auto: "off" },
                  ].map((f) => (
                    <div key={f.label}>
                      <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5 font-body">{f.label}</p>
                      <input
                        type={f.type}
                        autoComplete={f.auto}
                        value={f.val}
                        onChange={(e) => f.set(e.target.value)}
                        placeholder={f.ph}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/30 text-sm outline-none focus:border-gold-DEFAULT transition-all font-body"
                      />
                    </div>
                  ))}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2 font-body">Gender</p>
                    <div className="flex gap-2">
                      {(["male", "female", "other"] as const).map((g) => (
                        <button
                          key={g}
                          onClick={() => setGender(g)}
                          className={cn(
                            "flex-1 py-2.5 rounded-xl border-2 text-sm capitalize font-semibold transition-all font-body",
                            gender === g
                              ? "border-gold-DEFAULT bg-gold-faint text-gold-DEFAULT"
                              : "border-white/15 bg-white/5 text-white/60"
                          )}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 — Categories / Interests */}
              {step === 3 && (
                <div>
                  <p className="text-white/50 text-xs mb-3 font-body">
                    {role === "buyer" ? "Optional — helps us personalise your feed" :
                     role === "seller" ? `Select up to 5 (${sellerCats.length}/5)` :
                     "Tap your primary service type"}
                  </p>
                  <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-1">
                    {(role === "service" ? SERVICE_CATEGORIES : SELLER_CATEGORIES).map((cat) => {
                      const isSelected =
                        role === "service"
                          ? serviceCat === cat.name
                          : sellerCats.includes(cat.name);
                      const isDisabled =
                        role === "seller" && sellerCats.length >= 5 && !isSelected;

                      return (
                        <button
                          key={cat.name}
                          disabled={isDisabled}
                          onClick={() => {
                            if (role === "service") {
                              setServiceCat(cat.name);
                              setTimeout(next, 150);
                            } else if (isSelected) {
                              setSellerCats((c) => c.filter((x) => x !== cat.name));
                            } else if (!isDisabled) {
                              setSellerCats((c) => [...c, cat.name]);
                            }
                          }}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-semibold transition-all font-body",
                            isSelected
                              ? "border-gold-DEFAULT bg-gold-faint text-gold-DEFAULT"
                              : "border-white/15 bg-white/5 text-white/65 hover:border-white/30",
                            isDisabled && "opacity-30 cursor-not-allowed"
                          )}
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4 — Location */}
              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5 font-body">State *</p>
                    <select
                      value={stateVal}
                      onChange={(e) => { setStateVal(e.target.value); setCityVal(""); }}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm outline-none focus:border-gold-DEFAULT transition-all font-body"
                    >
                      <option value="" className="bg-[#0B2E33]">Select your state…</option>
                      {NIGERIAN_STATE_NAMES.map((s) => (
                        <option key={s} value={s} className="bg-[#0B2E33]">{s}</option>
                      ))}
                    </select>
                  </div>
                  {stateVal && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5 font-body">City / Area</p>
                      <select
                        value={cityVal}
                        onChange={(e) => setCityVal(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm outline-none focus:border-gold-DEFAULT transition-all font-body"
                      >
                        <option value="" className="bg-[#0B2E33]">Select city…</option>
                        {cities.map((c) => (
                          <option key={c} value={c} className="bg-[#0B2E33]">{c}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {stateVal && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gold-faint border border-gold-muted">
                      <Check size={14} className="text-gold-DEFAULT" />
                      <p className="text-gold-DEFAULT text-xs font-semibold font-body">
                        Location: {cityVal || cities[0] || stateVal}, {stateVal}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5 — Email OTP */}
              {step === 5 && (
                <div className="space-y-4">
                  {!emailVerified && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5 font-body">Email Address *</p>
                      <div className={cn(
                        "flex items-center gap-2 rounded-xl border-2 px-3 bg-white/5 transition-all",
                        emailVerified ? "border-emerald-400" : otpSent ? "border-gold-DEFAULT" : "border-white/15"
                      )}>
                        <Mail size={15} className="text-white/40 shrink-0" />
                        <input
                          type="email"
                          value={suEmail}
                          onChange={(e) => {
                            setSuEmail(e.target.value);
                            if (otpSent) { setOtpSent(false); setOtpCode(""); setResendTimer(0); }
                          }}
                          placeholder="name@example.com"
                          disabled={emailVerified}
                          className="flex-1 py-3 bg-transparent text-white placeholder:text-white/30 text-sm outline-none font-body"
                        />
                        {!emailVerified && (
                          <button
                            onClick={sendOtp}
                            disabled={sendingOtp || resendTimer > 0}
                            className="shrink-0 px-3 py-1.5 rounded-full border border-gold-muted bg-gold-faint text-gold-DEFAULT text-xs font-bold disabled:opacity-50 font-body"
                          >
                            {sendingOtp ? <Loader2 size={12} className="animate-spin" /> : resendTimer > 0 ? `${resendTimer}s` : otpSent ? "Resend" : "Send Code"}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {!otpSent && !emailVerified && (
                    <p className="text-white/35 text-xs text-center font-body">
                      Enter your email above and tap "Send Code" to verify.
                    </p>
                  )}

                  {otpSent && !emailVerified && (
                    <div className="p-4 rounded-2xl border border-gold-muted bg-gold-faint/30">
                      <p className="text-white/60 text-xs text-center mb-1 font-body">
                        Enter the 6-digit code sent to
                      </p>
                      <p className="text-gold-DEFAULT font-bold text-xs text-center mb-1 font-body">{suEmail}</p>
                      <OtpInput value={otpCode} onChange={setOtpCode} />
                      <button
                        onClick={verifyOtp}
                        disabled={otpCode.length < 6 || verifyingOtp}
                        className="w-full py-3 rounded-xl bg-[#144D54] border border-gold-muted text-white font-bold text-sm disabled:opacity-40 flex items-center justify-center gap-2 font-body"
                      >
                        {verifyingOtp ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} /> Confirm Code</>}
                      </button>
                    </div>
                  )}

                  {emailVerified && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-emerald-400/40 bg-emerald-400/10">
                      <Check size={16} className="text-emerald-400 shrink-0" />
                      <p className="text-emerald-400 font-bold text-sm font-body">Email verified — tap Continue!</p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 6 — Password */}
              {step === 6 && (
                <div className="space-y-4">
                  {/* Email (locked) */}
                  <div className="px-4 py-3 rounded-xl bg-white/5 border border-emerald-400/40 flex items-center gap-2">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    <span className="text-white/70 text-sm font-body">{suEmail}</span>
                  </div>
                  {/* Password */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5 font-body">Password *</p>
                    <div className="relative">
                      <input
                        type={showSuPw ? "text" : "password"}
                        value={suPassword}
                        onChange={(e) => setSuPassword(e.target.value)}
                        placeholder="Strong password"
                        autoComplete="new-password"
                        className="w-full px-4 py-3 pr-11 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/30 text-sm outline-none focus:border-gold-DEFAULT transition-all font-body"
                      />
                      <button onClick={() => setShowSuPw(!showSuPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                        {showSuPw ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                    {suPassword && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1">
                          {[1,2,3,4].map((i) => (
                            <div
                              key={i}
                              className="flex-1 h-1.5 rounded-full transition-all"
                              style={{ backgroundColor: i <= strength.score ? strength.color : "rgba(255,255,255,0.1)" }}
                            />
                          ))}
                        </div>
                        {strength.label && <p style={{ color: strength.color }} className="text-xs font-bold font-body">{strength.label}</p>}
                      </div>
                    )}
                  </div>
                  {/* Confirm */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5 font-body">Confirm Password *</p>
                    <div className="relative">
                      <input
                        type={showSuConf ? "text" : "password"}
                        value={suConfirm}
                        onChange={(e) => setSuConfirm(e.target.value)}
                        placeholder="Repeat password"
                        autoComplete="new-password"
                        className="w-full px-4 py-3 pr-11 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/30 text-sm outline-none focus:border-gold-DEFAULT transition-all font-body"
                      />
                      <button onClick={() => setShowSuConf(!showSuConf)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                        {showSuConf ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>
                  {/* Terms */}
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => setTermsOk(!termsOk)}
                      className={cn(
                        "shrink-0 mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                        termsOk ? "border-gold-DEFAULT bg-gold-faint" : "border-white/25"
                      )}
                    >
                      {termsOk && <Check size={11} className="text-gold-DEFAULT" />}
                    </button>
                    <p className="text-white/50 text-xs font-body leading-relaxed">
                      I accept the{" "}
                      <a href="/terms" target="_blank" className="text-gold-DEFAULT hover:underline font-bold">Terms of Service</a>
                      {" "}and{" "}
                      <a href="/privacy" target="_blank" className="text-gold-DEFAULT hover:underline font-bold">Privacy Policy</a>
                    </p>
                  </div>
                </div>
              )}

              {/* Error */}
              {displayError && (
                <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5 text-red-400 text-sm font-body">
                  {displayError}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="mt-6 space-y-3">
                {/* Continue / Create */}
                {step > 1 && (
                  <>
                    {step < TOTAL_STEPS ? (
                      <button
                        onClick={next}
                        className="w-full flex items-center justify-between px-6 py-4 rounded-2xl border-2 border-gold-muted text-gold-DEFAULT font-bold text-sm transition-all hover:bg-gold-faint font-body"
                      >
                        Continue
                        <div className="w-8 h-8 rounded-full bg-gold-DEFAULT flex items-center justify-center">
                          <ArrowRight size={14} className="text-navy-DEFAULT" />
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={handleSignUp}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#144D54] border border-gold-muted text-white font-bold text-sm hover:bg-[#1a5f68] transition-all disabled:opacity-50 font-body"
                      >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Create Account <ArrowRight size={15} className="text-gold-DEFAULT" /></>}
                      </button>
                    )}

                    {/* Back */}
                    <button
                      onClick={back}
                      className="w-full flex items-center justify-center gap-2 py-2.5 text-white/40 text-sm hover:text-white/70 transition-colors font-body"
                    >
                      <ArrowLeft size={15} /> Back
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Toggle link */}
        <p className="text-center text-white/40 text-sm mt-5 font-body">
          {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => toggleMode(mode === "signin" ? "signup" : "signin")}
            className="text-gold-DEFAULT font-bold hover:underline"
          >
            {mode === "signin" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}