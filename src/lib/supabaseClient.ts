import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = (import.meta as any).env?.https://yahfbycizpucwtxcsvrb.supabase.co || process.env.https://yahfbycizpucwtxcsvrb.supabase.co;
const SUPABASE_ANON_KEY =
  (import.meta as any).env?.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaGZieWNpenB1Y3d0eGNzdnJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NDc5MDcsImV4cCI6MjA3OTAyMzkwN30.bWWqQvALVIEXpVdBWmhtU_yXvRPj_5qyn4p1rwSOcLs ||
  (import.meta as any).env?.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaGZieWNpenB1Y3d0eGNzdnJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NDc5MDcsImV4cCI6MjA3OTAyMzkwN30.bWWqQvALVIEXpVdBWmhtU_yXvRPj_5qyn4p1rwSOcLs ||
  process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaGZieWNpenB1Y3d0eGNzdnJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NDc5MDcsImV4cCI6MjA3OTAyMzkwN30.bWWqQvALVIEXpVdBWmhtU_yXvRPj_5qyn4p1rwSOcLs ||
  process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaGZieWNpenB1Y3d0eGNzdnJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NDc5MDcsImV4cCI6MjA3OTAyMzkwN30.bWWqQvALVIEXpVdBWmhtU_yXvRPj_5qyn4p1rwSOcLs;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Supabase environment variables are not set. Please check https://yahfbycizpucwtxcsvrb.supabase.co and eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhaGZieWNpenB1Y3d0eGNzdnJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NDc5MDcsImV4cCI6MjA3OTAyMzkwN30.bWWqQvALVIEXpVdBWmhtU_yXvRPj_5qyn4p1rwSOcLs.");
}

export const supabase = createClient(SUPABASE_URL ?? "", SUPABASE_ANON_KEY ?? "");
