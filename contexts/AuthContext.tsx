"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UserLocation {
  state: string;
  city:  string;
  area:  string;
}

export interface UserData {
  uid:                         string;
  email:                       string;
  name:                        string;
  role:                        "buyer" | "seller" | "service" | "admin" | "support_agent" | "state_manager_1" | "state_manager_2";
  phone?:                      string;
  gender?:                     "male" | "female" | "other";
  location?:                   UserLocation;
  imageUrl?:                   string;
  businessName?:               string;
  businessAddress?:            string;
  businessPhone?:              string;
  sellerCategories?:           string[];
  serviceCategory?:            string;
  serviceSubcategory?:         string;
  serviceDescription?:         string;
  hasCompletedBusinessProfile?: boolean;
  isSuspended?:                boolean;
  suspensionReason?:           string | null;
  createdAt?:                  number;
  myReferralCode?:             string;
  subscriptionExpiresAt?:      number;
  isAvailable?:                boolean;
  rcNumber?:                   string;
}

export interface SignUpPayload {
  email:            string;
  password:         string;
  role:             "buyer" | "seller" | "service";
  name:             string;
  phone?:           string;
  gender?:          "male" | "female" | "other";
  referralCode?:    string;
  location?:        UserLocation;
  sellerCategories?: string[];
  serviceCategory?: string;
  interests?:       string[];
}

interface AuthContextType {
  user:            UserData | null;
  firebaseUser:    FirebaseUser | null;
  isLoading:       boolean;
  isAuthenticated: boolean;
  error:           string | null;
  signIn:          (email: string, password: string) => Promise<boolean>;
  signUp:          (payload: SignUpPayload) => Promise<boolean>;
  signOut:         () => Promise<void>;
  refreshUser:     () => Promise<void>;
  clearError:      () => void;
  getToken:        () => Promise<string | null>;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://elitehub-backend.onrender.com/api/v1";

async function apiFetch<T = any>(
  path:    string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...rest } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(rest.headers as Record<string, string> | undefined),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...rest, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,         setUser]         = useState<UserData | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading,    setIsLoading]    = useState(true);
  const [error,        setError]        = useState<string | null>(null);

  // Prevent concurrent profile fetches
  const fetchingRef = useRef(false);

  // ── Helper: fetch profile from backend ─────────────────────────────────────
  const fetchProfile = useCallback(async (fbUser: FirebaseUser): Promise<UserData | null> => {
    if (fetchingRef.current) return null;
    fetchingRef.current = true;
    try {
      const token = await fbUser.getIdToken();
      const data  = await apiFetch<{ success: boolean; user: UserData }>("/auth/me", {
        token,
      });
      return data.success ? data.user : null;
    } catch {
      return null;
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  // ── Firebase auth state listener ────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (!fbUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const profile = await fetchProfile(fbUser);
      setUser(profile);
      setIsLoading(false);
    });
    return () => unsub();
  }, [fetchProfile]);

  // ── getToken ────────────────────────────────────────────────────────────────
  const getToken = useCallback(async (): Promise<string | null> => {
    if (!auth.currentUser) return null;
    try { return await auth.currentUser.getIdToken(); }
    catch { return null; }
  }, []);

  // ── Sign In ─────────────────────────────────────────────────────────────────
  const signIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    try {
      // 1. Validate user exists on backend
      await apiFetch("/auth/signin", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      // 2. Firebase email/password sign-in
      const cred  = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();

      // 3. Fetch full profile
      const data = await apiFetch<{ success: boolean; user: UserData }>("/auth/me", { token });
      if (data.success) {
        setUser(data.user);
        setFirebaseUser(cred.user);
      }
      return true;
    } catch (err: any) {
      const msg =
        err?.message?.includes("wrong-password") || err?.message?.includes("invalid-credential")
          ? "Incorrect email or password."
          : err?.message?.includes("user-not-found")
          ? "No account found with this email."
          : err?.message || "Sign in failed. Please try again.";
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Sign Up ─────────────────────────────────────────────────────────────────
  const signUp = useCallback(async (payload: SignUpPayload): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    try {
      // Backend creates Firebase user and returns custom token
      const data = await apiFetch<{
        success:     boolean;
        customToken: string;
        user:        UserData;
      }>("/auth/signup", {
        method: "POST",
        body:   JSON.stringify(payload),
      });

      if (!data.success || !data.customToken) {
        throw new Error(data.user ? "Signup incomplete." : "Signup failed.");
      }

      // Sign in with the custom token Firebase returned
      const cred  = await signInWithCustomToken(auth, data.customToken);
      const token = await cred.user.getIdToken();

      // Refresh user profile
      const me = await apiFetch<{ success: boolean; user: UserData }>("/auth/me", { token });
      if (me.success) {
        setUser(me.user);
        setFirebaseUser(cred.user);
      }
      return true;
    } catch (err: any) {
      setError(err?.message || "Sign up failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Sign Out ────────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    try {
      const token = await getToken();
      if (token) {
        await apiFetch("/auth/signout", { method: "POST", token }).catch(() => {});
      }
      await firebaseSignOut(auth);
      setUser(null);
      setFirebaseUser(null);
    } catch (err) {
      console.error("Sign out error:", err);
      // Force clear even on error
      setUser(null);
      setFirebaseUser(null);
    }
  }, [getToken]);

  // ── Refresh User ────────────────────────────────────────────────────────────
  const refreshUser = useCallback(async () => {
    if (!auth.currentUser) return;
    const profile = await fetchProfile(auth.currentUser);
    if (profile) setUser(profile);
  }, [fetchProfile]);

  // ── Clear Error ─────────────────────────────────────────────────────────────
  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        isAuthenticated: !!user,
        error,
        signIn,
        signUp,
        signOut,
        refreshUser,
        clearError,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}