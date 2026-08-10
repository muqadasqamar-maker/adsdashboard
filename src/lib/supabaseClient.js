import { createClient } from "@supabase/supabase-js";

/* ============================================================
   Browser Supabase client (anon key only — safe to ship).
   Reads Vite env vars; if they're missing the app shows a clear
   "not configured" screen instead of crashing.
   ============================================================ */

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anon);

export const supabase = supabaseConfigured
  ? createClient(url, anon, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
