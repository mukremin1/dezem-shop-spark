import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Robust useUser hook
 * - Compatible with @supabase/supabase-js v2 and older shapes.
 * - Uses feature-detection for getUser/getSession and onAuthStateChange.
 * - Cleans up unsubscribe correctly for multiple return shapes.
 */
export function useUser() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        // Prefer v2: auth.getUser() -> { data: { user } }
        const getUserFn = (supabase as any)?.auth?.getUser ?? (supabase as any).getUser;
        if (typeof getUserFn === "function") {
          const res = await getUserFn.call((supabase as any).auth ?? supabase);
          const data = res?.data ?? res;
          const u = data?.user ?? data ?? null;
          if (!mounted) return;
          setUser(u ?? null);
          return;
        }

        // Fallback: getSession() -> { data: { session } }
        const getSessionFn = (supabase as any)?.auth?.getSession ?? (supabase as any).getSession;
        if (typeof getSessionFn === "function") {
          const res = await getSessionFn.call((supabase as any).auth ?? supabase);
          const data = res?.data ?? res;
          const session = data?.session ?? data ?? null;
          if (!mounted) return;
          setUser(session?.user ?? null);
          return;
        }

        // Older SDKs: supabase.auth.user() or supabase.auth.session()
        const maybeUser =
          (supabase as any)?.auth?.user?.() ??
          (supabase as any)?.auth?.session?.()?.user ??
          null;
        if (!mounted) return;
        setUser(maybeUser ?? null);
      } catch (err) {
        if (!mounted) return;
        // eslint-disable-next-line no-console
        console.warn("useUser: initial load error", err);
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    // Subscribe to auth changes defensively
    let unsubscribe: (() => void) | undefined;

    try {
      const onAuth =
        (supabase as any)?.auth?.onAuthStateChange ??
        (supabase as any).onAuthStateChange;

      if (typeof onAuth === "function") {
        const receiver = (supabase as any).auth ?? supabase;
        const ret = onAuth.call(receiver, (_event: any, payloadOrSession: any) => {
          try {
            const s = payloadOrSession?.session ?? payloadOrSession;
            const u = s?.user ?? null;
            setUser(u);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn("useUser: subscription handler error", e);
          }
        });

        if (ret) {
          const sub = (ret as any).data?.subscription ?? (ret as any).subscription ?? ret;
          if (sub && typeof (sub as any).unsubscribe === "function") {
            unsubscribe = () => (sub as any).unsubscribe();
          } else if (typeof (ret as any).unsubscribe === "function") {
            unsubscribe = () => (ret as any).unsubscribe();
          } else if (typeof ret === "function") {
            unsubscribe = ret as () => void;
          } else {
            unsubscribe = undefined;
          }
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn("useUser: onAuthStateChange not available on supabase client; skipping subscription.");
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("useUser: Failed to subscribe to auth changes or unsupported API shape:", err);
    }

    return () => {
      mounted = false;
      try {
        if (unsubscribe) unsubscribe();
      } catch {
        // ignore unsubscribe errors
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, loading };
}
