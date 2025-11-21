// This file is a safe, improved supabase client wrapper.
// It reads env vars from import.meta.env (Vite) or process.env (server/CI).
// If env vars are missing, it logs a clear warning and exports a small stub
// to avoid crashing the whole app during development.
//
// NOT: Gerçek anahtarları .env'e koyun ve asla repoya commit etmeyin.

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/** import.meta.env veya process.env içinden bir değişken okur */
function getEnv(name: string): string | undefined {
  try {
    const v = (import.meta as any)?.env?.[name];
    if (typeof v === "string" && v.length > 0) return v;
  } catch {
    // import.meta erişimi başarısız olursa yoksay
  }
  const p = (process as any)?.env?.[name];
  if (typeof p === "string" && p.length > 0) return p;
  return undefined;
}

const SUPABASE_URL = getEnv("VITE_SUPABASE_URL") ?? "";
const SUPABASE_PUBLISHABLE_KEY =
  getEnv("VITE_SUPABASE_PUBLISHABLE_KEY") ?? getEnv("VITE_SUPABASE_ANON_KEY") ?? "";

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.warn(
    "[supabase/client] VITE_SUPABASE_URL veya VITE_SUPABASE_PUBLISHABLE_KEY tanımlı değil. " +
      "Lütfen proje kökünde .env dosyasına bu değişkenleri ekleyip dev server'ı yeniden başlatın. " +
      "(Anahtarları repoya commit etmeyin.)"
  );

  // Basit stub: uygulamanın tümünün çökmesini engeller.
  // Gerçek bir DB operasyonu yapıldığında açık bir hata verir.
  const stub = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: null, error: new Error("Supabase yapılandırılmadı") }),
      signOut: async () => ({ error: new Error("Supabase yapılandırılmadı") }),
    },
    from: (table: string) => ({
      select: async (..._args: any[]) => {
        throw new Error(`Supabase yapılandırılmadı. Denenen tablo: ${table}`);
      },
      insert: async (..._args: any[]) => {
        throw new Error(`Supabase yapılandırılmadı. Denenen tablo: ${table}`);
      },
      update: async (..._args: any[]) => {
        throw new Error(`Supabase yapılandırılmadı. Denenen tablo: ${table}`);
      },
      delete: async (..._args: any[]) => {
        throw new Error(`Supabase yapılandırılmadı. Denenen tablo: ${table}`);
      },
    }),
  } as unknown;

  export const supabase: any = stub;
} else {
  // Tarayıcı ortamında localStorage varsa auth.storage olarak ver.
  const authOptions: Record<string, any> = {
    persistSession: true,
    autoRefreshToken: true,
  };
  if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
    authOptions.storage = window.localStorage;
  }

  export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: authOptions,
  });
}
