import { createClient } from "@supabase/supabase-js";

/**
 * Read env var from either Vite's import.meta.env or Node's process.env.
 * Keeps compatibility for dev (vite) and server-side usage.
 */
function getEnv(name: string): string | undefined {
  try {
    // Vite exposes import.meta.env
    const v = (import.meta as any)?.env?.[name];
    if (typeof v === "string" && v.length > 0) return v;
  } catch {
    // ignore
  }
  // fallback to process.env (useful for server-side / CI)
  const p = (process as any)?.env?.[name];
  if (typeof p === "string" && p.length > 0) return p;
  return undefined;
}

const SUPABASE_URL = getEnv("VITE_SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY =
  getEnv("VITE_SUPABASE_PUBLISHABLE_KEY") ??
  getEnv("VITE_SUPABASE_ANON_KEY") ??
  "";

/**
 * If either url or anon key is missing, export a minimal stub to avoid a hard crash
 * in the app while giving clear runtime errors if someone actually tries to use Supabase.
 *
 * NOTE: This is a developer convenience — you must set the real env vars in .env
 * (or your hosting provider) and restart the dev server to enable Supabase.
 */
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "Supabase environment variables are not set. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY) in your .env and restart the dev server. Falling back to a stubbed client to avoid crashing the app."
  );

  const stub = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({
        data: null,
        error: new Error("Supabase not configured (missing env)"),
      }),
      signOut: async () => ({ error: new Error("Supabase not configured (missing env)") }),
    },
    from: (tableName: string) => {
      return {
        select: async (..._args: any[]) => {
          throw new Error(
            `Supabase client not configured. Attempted to query table "${tableName}". Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY and restart the dev server.`
          );
        },
        insert: async (..._args: any[]) => {
          throw new Error(
            `Supabase client not configured. Attempted to insert into "${tableName}". Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY and restart the dev server.`
          );
        },
        upsert: async (..._args: any[]) => {
          throw new Error(
            `Supabase client not configured. Attempted to upsert into "${tableName}". Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY and restart the dev server.`
          );
        },
        update: async (..._args: any[]) => {
          throw new Error(
            `Supabase client not configured. Attempted to update "${tableName}". Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY and restart the dev server.`
          );
        },
        delete: async (..._args: any[]) => {
          throw new Error(
            `Supabase client not configured. Attempted to delete from "${tableName}". Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY and restart the dev server.`
          );
        },
      };
    },
  } as unknown;

  // export as any to avoid TypeScript complaints in the rest of the app
  export const supabase: any = stub;
} else {
  // Create the real client when env vars are present
  export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
