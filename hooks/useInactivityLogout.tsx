"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";

const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export function useInactivityLogout() {
  const router = useRouter();
  const timer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logout = useCallback(async () => {
    await signOut(getAuth());
    router.replace("/auth?reason=inactivity");
  }, [router]);

  const resetTimer = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(logout, TIMEOUT_MS);
  }, [logout]);

  useEffect(() => {
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];

    resetTimer();
    events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));

    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [resetTimer]);
}