import crypto from "node:crypto";
import { admin } from "./_supabase.js";

/* ============================================================
   /api/admin  (ActivatUs-only invite management)

   Guarded by a shared password: the caller must send
   `x-admin-token: <ADMIN_TOKEN>`. Compared in constant time.

   GET                          -> { clients, invites }
   POST { action: "create", client_id }  -> { token, url }
   POST { action: "revoke", token, active } -> { ok }

   Scope: invites only. New clients are still added in Supabase.
   ============================================================ */

function tokenOk(req) {
  const provided = req.headers["x-admin-token"];
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || !provided) return false;
  const a = Buffer.from(String(provided));
  const b = Buffer.from(String(expected));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export default async function handler(req, res) {
  if (!process.env.ADMIN_TOKEN) {
    res.status(500).json({ error: "ADMIN_TOKEN is not set on the server." });
    return;
  }
  if (!tokenOk(req)) {
    res.status(401).json({ error: "Incorrect admin password." });
    return;
  }

  let sb;
  try {
    sb = admin();
  } catch {
    res.status(500).json({ error: "Server auth is not configured." });
    return;
  }

  // ---- list ------------------------------------------------
  if (req.method === "GET") {
    const clientsRes = await sb.from("clients").select("id, name").order("name");
    const invitesRes = await sb
      .from("invites")
      .select("token, client_id, active, created_at")
      .order("created_at", { ascending: false });
    const dbError =
      (clientsRes.error && clientsRes.error.message) ||
      (invitesRes.error && invitesRes.error.message) ||
      null;
    res.status(200).json({
      clients: clientsRes.data || [],
      invites: invitesRes.data || [],
      dbError,
    });
    return;
  }

  if (req.method === "POST") {
    const body = typeof req.body === "string" ? safeParse(req.body) : req.body || {};
    const action = body.action;

    // ---- create --------------------------------------------
    if (action === "create") {
      if (!body.client_id) {
        res.status(400).json({ error: "Please choose a client." });
        return;
      }
      const { data: client } = await sb
        .from("clients")
        .select("id")
        .eq("id", body.client_id)
        .single();
      if (!client) {
        res.status(400).json({ error: "That client doesn't exist." });
        return;
      }
      const token = crypto.randomBytes(24).toString("base64url");
      const { error } = await sb
        .from("invites")
        .insert({ token, client_id: body.client_id, active: true });
      if (error) {
        res.status(500).json({ error: "Couldn't create the invite." });
        return;
      }
      const origin = originFrom(req);
      res.status(200).json({ token, url: `${origin}/?invite=${token}` });
      return;
    }

    // ---- set active state (revoke / reactivate) ------------
    if (action === "revoke") {
      if (!body.token) {
        res.status(400).json({ error: "Missing invite token." });
        return;
      }
      const nextActive = body.active === true; // default: revoke (false)
      const { error } = await sb
        .from("invites")
        .update({ active: nextActive })
        .eq("token", body.token);
      if (error) {
        res.status(500).json({ error: "Couldn't update the invite." });
        return;
      }
      res.status(200).json({ ok: true });
      return;
    }

    res.status(400).json({ error: "Unknown action." });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}

function originFrom(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  return `${proto}://${host}`;
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
