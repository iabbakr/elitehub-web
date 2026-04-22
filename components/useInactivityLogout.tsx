"use client";

import { useInactivityLogout } from "@/hooks/useInactivityLogout";
import { useAuth } from "@/contexts/AuthContext";

// Inner component — hook is always called unconditionally here
function ActiveGuard() {
  useInactivityLogout();
  return null;
}

// Outer component — only mounts ActiveGuard when a user is signed in.
// When isAuthenticated is false the hook never runs, so unauthenticated
// visitors and the auth page itself are completely unaffected.
export default function InactivityGuard() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return <ActiveGuard />;
}