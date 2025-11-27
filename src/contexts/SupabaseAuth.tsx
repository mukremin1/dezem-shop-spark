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
    } catch (e) {
      // ignore
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
      const { data, error } = await supabase.auth.getSession();
      if (!error && data?.session) {
        setSession(data.session);
        setUser(data.session.user ?? null);
        persist(data.session);
      } else {
        setSession(null);
        setUser(null);
        persist(null);
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
        try {
          const { data, error } = await supabase.auth.getSession();
          if (!error && data?.session) {
            setSession(data.session);
            setUser(data.session.user ?? null);
            persist(data.session);
          } else {
            setSession(null);
            setUser(null);
            persist(null);
          }
        } catch {
          setSession(null);
          setUser(null);
          persist(null);
        } finally {
          setLoading(false);
        }
      })();
    }

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      try {
        const s = (newSession && newSession.session) ? newSession.session : newSession;
        if (s) {
          setSession(s);
          setUser(s.user ?? null);
          persist(s);
        } else {
          setSession(null);
          setUser(null);
          persist(null);
        }
      } catch {
        setSession(null);
        setUser(null);
        persist(null);
      }
    }) ?? {};

    return () => {
      try {
        if (listener && typeof listener.subscription?.unsubscribe === "function") {
          listener.subscription.unsubscribe();
        } else if (listener && typeof (listener as any).unsubscribe === "function") {
          (listener as any).unsubscribe();
        }
      } catch {
        // ignore
      }
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
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
