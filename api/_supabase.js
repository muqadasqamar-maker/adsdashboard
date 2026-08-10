import { createClient } from "@supabase/supabase-js";

/* ============================================================
   Server-side Supabase helpers (service_role — never in the browser).
   Files prefixed "_" are not exposed as routes by Vercel.
   ============================================================ */

let _admin = null;

export function admin() {
  if (_admin) return _admin;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env not configured");
  _admin = createClient(url, key, { auth: { persistSession: false } });
  return _admin;
}

// Resolve the caller's bearer token -> { user, client }.
// Returns { status, message } on failure so handlers can respond cleanly.
export async function requireClient(req) {
  const header = req.headers.authorization || req.headers.Authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return { error: { status: 401, message: "Please sign in." } };

  let sb;
  try {
    sb = admin();
  } catch {
    return { error: { status: 500, message: "Server auth is not configured." } };
  }

  const { data: userData, error: userErr } = await sb.auth.getUser(token);
  if (userErr || !userData?.user) {
    return { error: { status: 401, message: "Your session has expired. Please sign in again." } };
  }
  const user = userData.user;

  const { data: profile } = await sb
    .from("profiles")
    .select("client_id")
    .eq("id", user.id)
    .single();
  if (!profile) {
    return { error: { status: 403, message: "This account isn't linked to a client yet." } };
  }

  const { data: client } = await sb
    .from("clients")
    .select("*")
    .eq("id", profile.client_id)
    .single();
  if (!client) {
    return { error: { status: 403, message: "We couldn't find your client record." } };
  }

  return { user, client };
}
