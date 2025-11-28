import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type SupabaseUser = any;

type UserContextType = {
  user: SupabaseUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const getSessionFn = (supabase as any)?.auth?.getSession ?? (supabase as any).getSession;
      if (typeof getSessionFn === "function") {
        const res = await getSessionFn.call((supabase as any).auth ?? supabase);
        const data = res?.data ?? res;
        const s = data?.session ?? data;
        setUser(s?.user ?? null);
      } else {
        const maybeSession = (supabase as any)?.auth?.session?.() ?? null;
        setUser(maybeSession?.user ?? null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      await refresh();
      if (!mounted) return;
    })();

    let unsubscribeFn: (() => void) | undefined;

    try {
      const onAuth =
        (supabase as any)?.auth?.onAuthStateChange ??
        (supabase as any).onAuthStateChange;

      if (typeof onAuth === "function") {
        const ret = onAuth.call((supabase as any).auth ?? supabase, (event: any, payload: any) => {
          try {
            const s = payload?.session ?? payload;
            setUser(s?.user ?? null);
          } catch (err) {
            // ignore handler errors
            // eslint-disable-next-line no-console
            console.warn("[useUser] auth handler error:", err);
          }
        });

        if (ret) {
          const sub = (ret as any).data?.subscription ?? (ret as any).subscription ?? ret;
          if (sub && typeof (sub as any).unsubscribe === "function") {
            unsubscribeFn = () => (sub as any).unsubscribe();
          } else if (typeof (ret as any).unsubscribe === "function") {
            unsubscribeFn = () => (ret as any).unsubscribe();
          } else if (typeof ret === "function") {
            unsubscribeFn = ret as () => void;
          } else {
            unsubscribeFn = undefined;
          }
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn("[useUser] onAuthStateChange not available on supabase client; skipping subscription.");
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("useUser: Failed to subscribe to auth changes or unsupported API shape:", err);
    }

    return () => {
      mounted = false;
      try {
        if (unsubscribeFn) unsubscribeFn();
      } catch {
        // ignore unsubscribe errors
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <UserContext.Provider value={{ user, loading, refresh }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
