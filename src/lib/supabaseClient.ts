import { createClient } from "@supabase/supabase-js";

// Ortam değişkenleri: VITE_ prefix'i Vite projeleri için yaygındır.
// Eğer projenizde farklı isim kullanıyorsanız bunları değiştirin.
const SUPABASE_URL =
  (import.meta as any).env?.VITE_SUPABASE_URL ??
  process.env.VITE_SUPABASE_URL;

const SUPABASE_ANON_KEY =
  (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY ??
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ??
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "Supabase environment variables are not set. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY)."
  );
}

export const supabase = createClient(SUPABASE_URL ?? "", SUPABASE_ANON_KEY ?? "");
