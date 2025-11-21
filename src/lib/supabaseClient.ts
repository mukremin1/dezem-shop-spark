// src/lib/supabaseClient.ts import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.https://yahfbycizpucwtxcsvrb.supabase.co as string) || process.env.https://yahfbycizpucwtxcsvrb.supabase.co; const supabaseAnonKey = (import.meta.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaGZieWNpenB1Y3d0eGNzdnJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NDc5MDcsImV4cCI6MjA3OTAyMzkwN30.bWWqQvALVIEXpVdBWmhtU_yXvRPj_5qyn4p1rwSOcLs as string) || process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaGZieWNpenB1Y3d0eGNzdnJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NDc5MDcsImV4cCI6MjA3OTAyMzkwN30.bWWqQvALVIEXpVdBWmhtU_yXvRPj_5qyn4p1rwSOcLs;

if (!supabaseUrl || !supabaseAnonKey) { // Geliştirme sürecinde eksik env'leri daha hızlı fark etmek için konsola yazdırabilirsiniz // production ortamında bunu kaldırın console.warn("Supabase env variables are not set. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY"); }

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
