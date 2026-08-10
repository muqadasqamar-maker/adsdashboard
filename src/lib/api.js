import { supabase } from "./supabaseClient.js";

/* ============================================================
   Authenticated calls to our serverless API. Attaches the Supabase
   access token so the server can resolve the caller's client.
   ============================================================ */

async function authHeader() {
  if (!supabase) return {};
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet(path) {
  const headers = await authHeader();
  const res = await fetch(path, { headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(
      (body.error || `Request failed (${res.status})`) +
        (body.detail ? ` — ${body.detail}` : "")
    );
  return body;
}

export async function apiPost(path, payload) {
  const headers = { "Content-Type": "application/json", ...(await authHeader()) };
  const res = await fetch(path, {
    method: "POST",
    headers,
    body: JSON.stringify(payload || {}),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(
      (body.error || `Request failed (${res.status})`) +
        (body.detail ? ` — ${body.detail}` : "")
    );
  return body;
}
