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
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        setUser(data?.user ?? null);
      } catch {
        if (!mounted) return;
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();

    // Guard: onAuthStateChange fonksiyonu mevcutsa kullan, değilse atla
    try {
      if (supabase?.auth && typeof supabase.auth.onAuthStateChange === "function") {
        const resp = supabase.auth.onAuthStateChange((_event: any, session: any) => {
          if (!mounted) return;
          setUser(session?.user ?? null);
        });

        // Supabase farklı sürümlerde farklı dönüş yapabilir:
        // - { data: { subscription } }
        // - { subscription }
        // - veya doğrudan bir unsubscribe fonksiyonu / cleanup fonksiyonu
        const subLike: any = resp?.data ?? resp ?? null;

        cleanupFn = () => {
          try {
            if (!subLike) return;
            // farklı yapıları destekle
            subLike.subscription?.unsubscribe?.();
            subLike.unsubscribe?.();
            if (typeof resp === "function") {
              // bazı implementasyonlar direkt fonksiyon dönebilir
              resp();
            }
          } catch {
            // ignore
          }
        };
      } else {
        // onAuthStateChange yoksa sessiyon yönetimi farklı bir yerde olabilir.
        // Bu durumda getUser çağrısı ile başlangıç durumu belirlendi.
      }
    } catch {
      // herhangi bir hata burada yutulsun, hook kırılmasın
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
