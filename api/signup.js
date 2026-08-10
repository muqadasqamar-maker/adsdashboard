import { admin } from "./_supabase.js";

/* ============================================================
   POST /api/signup  { token, email, password }

   Invite-gated account creation. Open/self sign-up must be disabled in
   Supabase; accounts are only ever created here, server-side, after the
   invite token is validated. The new account is stamped with the invite's
   client. One account per email (Supabase rejects duplicates).
   ============================================================ */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body || {};
  const { token, email, password } = body;
  if (!token || !email || !password) {
    res.status(400).json({ error: "Please provide the invite, an email, and a password." });
    return;
  }
  if (String(password).length < 8) {
    res.status(400).json({ error: "Please choose a password of at least 8 characters." });
    return;
  }

  let sb;
  try {
    sb = admin();
  } catch {
    res.status(500).json({ error: "Server auth is not configured." });
    return;
  }

  // 1) Validate the invite.
  const { data: invite } = await sb
    .from("invites")
    .select("token, client_id, active, expires_at")
    .eq("token", token)
    .eq("active", true)
    .single();
  if (!invite) {
    res.status(400).json({ error: "This invite link is invalid or has been turned off." });
    return;
  }
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    res.status(400).json({ error: "This invite link has expired. Please ask ActivatUs for a new one." });
    return;
  }

  // 2) Create the account (unique email enforced by Supabase).
  const { data: created, error: createErr } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createErr) {
    const exists = /already|registered|exists/i.test(createErr.message || "");
    res.status(exists ? 409 : 400).json({
      error: exists
        ? "You already have an account. Please log in instead."
        : "We couldn't create your account. Please check your email and try again.",
    });
    return;
  }

  // 3) Bind the account to the invite's client.
  const { error: profileErr } = await sb
    .from("profiles")
    .insert({ id: created.user.id, client_id: invite.client_id });
  if (profileErr) {
    // Roll back the orphaned auth user so they can retry cleanly.
    await sb.auth.admin.deleteUser(created.user.id).catch(() => {});
    res.status(500).json({ error: "We couldn't finish setting up your account. Please try again." });
    return;
  }

  res.status(200).json({ ok: true });
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
