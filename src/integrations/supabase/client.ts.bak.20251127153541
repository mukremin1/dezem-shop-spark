// src/integrations/supabase/client.ts
// ESM-friendly supabase client wrapper — export'lar top-level olacak şekilde yazıldı.

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/** import.meta.env veya process.env içinden bir değişken okur (güvenli: process kontrolü yapar) */
function getEnv(name: string): string | undefined {
  // Öncelikle import.meta.env varsa onu dene (Vite, Snowpack vb. için)
  try {
    const v = (import.meta as any)?.env?.[name];
    if (typeof v === "string" && v.length > 0) return v;
  } catch {
    // import.meta erişimi başarısız olursa yoksay
  }

  // Tarayıcı ortamında `process` olmayabilir; bu yüzden önce typeof kontrolü yapıyoruz.
  if (typeof process !== "undefined") {
    const p = (process as any)?.env?.[name];
    if (typeof p === "string" && p.length > 0) return p;
  }

  return undefined;
}

const SUPABASE_URL = getEnv("VITE_SUPABASE_URL") ?? "";
const SUPABASE_PUBLISHABLE_KEY =
  getEnv("VITE_SUPABASE_PUBLISHABLE_KEY") ?? getEnv("VITE_SUPABASE_ANON_KEY") ?? "";

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.warn(
    "[supabase/client] VITE_SUPABASE_URL veya VITE_SUPABASE_PUBLISHABLE_KEY tanımlı değil. " +
      "Lütfen .env'e ekleyip dev server'ı yeniden başlatın. (Anahtarları repoya commit etmeyin.)"
  );
}

/** Geçici stub (supabase konfigüre edilmemişse hata yerine çalışsın) */
const stub = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async () => ({ data: null, error: new Error("Supabase yapılandırılmadı") }),
    signOut: async () => ({ error: new Error("Supabase yapılandırılmadı") }),
  },
  from: (table: string) => ({
    select: async (..._args: any[]) => { throw new Error(`Supabase yapılandırılmadı. Table: ${table}`); },
    insert: async (..._args: any[]) => { throw new Error(`Supabase yapılandırılmadı. Table: ${table}`); },
    update: async (..._args: any[]) => { throw new Error(`Supabase yapılandırılmadı. Table: ${table}`); },
    delete: async (..._args: any[]) => { throw new Error(`Supabase yapılandırılmadı. Table: ${table}`); },
  }),
} as unknown as ReturnType<typeof createClient>;

let supabase: any;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  supabase = stub;
} else {
  const authOptions: Record<string, any> = { persistSession: true, autoRefreshToken: true };
  if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
    authOptions.storage = window.localStorage;
  }

  supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: authOptions,
  });
}

export { supabase };
export default supabase;
