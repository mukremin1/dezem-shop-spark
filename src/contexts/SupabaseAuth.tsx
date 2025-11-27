import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type SupabaseSession = any;
type SupabaseUser = any;

type SupabaseAuthContextType = {
  user: SupabaseUser | null;
  session: SupabaseSession | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const persist = (s: SupabaseSession | null) => {
    try {
      if (s) {
        localStorage.setItem("supabase_session", JSON.stringify(s));
      } else {
        localStorage.removeItem("supabase_session");
      }
    } catch {
      // ignore storage errors
    }
  };

  const restoreFromStorage = () => {
    try {
      const raw = localStorage.getItem("supabase_session");
      if (raw) {
        const parsed = JSON.parse(raw);
        setSession(parsed);
        setUser(parsed?.user ?? null);
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  const refreshSession = async () => {
    try {
      setLoading(true);
      const getter = (supabase as any)?.auth?.getSession ?? (supabase as any).getSession;
      if (typeof getter === "function") {
        const res = await getter.call((supabase as any).auth ?? supabase);
        const data = res?.data ?? res;
        const s = data?.session ?? data;
        if (s) {
          setSession(s);
          setUser(s.user ?? null);
          persist(s);
        } else {
          setSession(null);
          setUser(null);
          persist(null);
        }
      } else {
        const maybeSession = (supabase as any)?.auth?.session?.() ?? null;
        if (maybeSession) {
          setSession(maybeSession);
          setUser(maybeSession.user ?? null);
          persist(maybeSession);
        } else {
          setSession(null);
          setUser(null);
          persist(null);
        }
      }
    } catch {
      setSession(null);
      setUser(null);
      persist(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const restored = restoreFromStorage();
    if (restored) {
      setLoading(false);
    } else {
      (async () => {
        await refreshSession();
      })();
    }

    let unsubscribe: (() => void) | undefined;

    try {
      const onAuth = (supabase as any)?.auth?.onAuthStateChange ?? (supabase as any).onAuthStateChange;
      if (typeof onAuth === "function") {
        const ret = onAuth.call((supabase as any).auth ?? supabase, (_event: any, payload: any) => {
          const s = payload?.session ?? payload;
          if (s) {
            setSession(s);
            setUser(s.user ?? null);
            persist(s);
          } else {
            setSession(null);
            setUser(null);
            persist(null);
          }
        });

        if (ret) {
          const sub = ret.data?.subscription ?? ret.subscription ?? ret;
          if (sub && typeof sub.unsubscribe === "function") {
            unsubscribe = () => sub.unsubscribe();
          } else if (typeof (ret as any).unsubscribe === "function") {
            unsubscribe = () => (ret as any).unsubscribe();
          } else if (typeof ret === "function") {
            unsubscribe = ret as () => void;
          }
        }
      } else {
        Write-Output "[SupabaseAuth] onAuthStateChange not available on supabase client; skipping subscription."
      }
    } catch {
      Write-Output "[SupabaseAuth] subscription setup failed"
    }

    return () => {
      try {
        if (unsubscribe) unsubscribe();
      } catch {
        # ignore
      }
    };
  }, []);

  const signOut = async () => {
    try {
      const signOutFn = (supabase as any)?.auth?.signOut ?? (supabase as any).signOut;
      if (typeof signOutFn === "function") {
        await signOutFn.call((supabase as any).auth ?? supabase);
      }
    } catch {
      // ignore
    } finally {
      setSession(null);
      setUser(null);
      persist(null);
    }
  };

  return (
    <SupabaseAuthContext.Provider value={{ user, session, loading, signOut, refreshSession }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = (): SupabaseAuthContextType => {
  const ctx = useContext(SupabaseAuthContext);
  if (!ctx) throw new Error("useSupabaseAuth must be used within SupabaseAuthProvider");
  return ctx;
};
