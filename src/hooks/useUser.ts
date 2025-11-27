import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUser() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let cleanupFn: (() => void) | undefined;

    async function load() {
      try {
        // Modern Supabase API returns { data } with user in data.user
        const resp = await supabase.auth.getUser();
        if (!mounted) return;
        setUser((resp as any)?.data?.user ?? null);
      } catch {
        if (!mounted) return;
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();

    // Guarded usage of onAuthStateChange to avoid runtime errors for clients that don't expose it
    try {
      if (supabase?.auth && typeof supabase.auth.onAuthStateChange === "function") {
        const listener = supabase.auth.onAuthStateChange((_event: any, session: any) => {
          if (!mounted) return;
          setUser(session?.user ?? null);
        });

        // Support different return shapes across supabase versions:
        // - { data: { subscription } }
        // - { subscription }
        // - a function or other cleanup
        cleanupFn = () => {
          try {
            const respLike: any = (listener as any)?.data ?? listener;
            // unsubscribe if subscription shape
            respLike?.subscription?.unsubscribe?.();
            // call unsubscribe if provided directly
            respLike?.unsubscribe?.();
            // some versions return a function to call
            if (typeof listener === "function") {
              (listener as any)();
            }
          } catch {
            // swallow cleanup errors to avoid breaking the app on unmount
          }
        };
      }
    } catch {
      // swallow errors from attempting to attach listener
    }

    return () => {
      mounted = false;
      try {
        cleanupFn?.();
      } catch {
        // ignore
      }
    };
  }, []);

  return { user, loading };
}
