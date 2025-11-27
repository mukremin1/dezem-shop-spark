import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * useUser - safe hook that works with different @supabase/supabase-js shapes
 * - tries getSession (v2) then falls back to getUser
 * - only subscribes if onAuthStateChange exists
 * - tolerates different subscription return shapes and cleans up safely
 */
export function useUser() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let unsubscribeFn: (() => void) | undefined;

    async function load() {
      try {
        if (typeof supabase?.auth?.getSession === "function") {
          const res = await supabase.auth.getSession();
          if (!mounted) return;
          setUser(res?.data?.session?.user ?? null);
        } else if (typeof supabase?.auth?.getUser === "function") {
          const res = await supabase.auth.getUser();
          if (!mounted) return;
          setUser(res?.data?.user ?? null);
        } else {
          // auth API not available (stub); set null and continue
          console.warn("supabase.auth API not available; running in stub/no-auth mode.");
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to get session/user from supabase:", err);
        if (!mounted) return;
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    // Subscribe to auth changes only if supported
    try {
      const onAuth = (supabase as any)?.auth?.onAuthStateChange;
      if (typeof onAuth === "function") {
        const ret = onAuth((_event: string, session: any) => {
          if (!mounted) return;
          setUser(session?.user ?? null);
        });

        // ret may be: { data: { subscription } } (v2)
        // or { subscription } or { unsubscribe } or simply a function
        const subscription =
          (ret && ret.data && ret.data.subscription) ||
          (ret && (ret.subscription || ret.unsubscribe)) ||
          ret;

        if (subscription) {
          // subscription might be an object with unsubscribe(), or might be a function to call to unsubscribe
          if (typeof subscription.unsubscribe === "function") {
            unsubscribeFn = () => subscription.unsubscribe();
          } else if (typeof subscription === "function") {
            unsubscribeFn = () => subscription();
          } else if (typeof ret === "function") {
            // fallback: ret itself might be unsubscribe function
            unsubscribeFn = () => (ret as Function)();
          } else {
            // unknown shape — no-op
            unsubscribeFn = undefined;
          }
        }
      }
    } catch (err) {
      console.warn("Failed to subscribe to auth changes or unsupported API shape:", err);
    }

    return () => {
      mounted = false;
      try {
        if (unsubscribeFn) unsubscribeFn();
      } catch (e) {
        // ignore cleanup errors
      }
    };
  }, []);

  return { user, loading };
}
