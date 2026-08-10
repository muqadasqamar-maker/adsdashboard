import React, { useState } from "react";
import { BrandLockup } from "../Brand.jsx";
import AuthShell from "../auth/AuthShell.jsx";

/* ============================================================
   AdminInvites — ActivatUs-only invite manager (reached at ?admin=1).
   Unlocked with the shared admin password (sent as x-admin-token to
   /api/admin). Create, copy, and revoke per-client invite links.
   ============================================================ */

export default function AdminInvites() {
  const [pw, setPw] = useState(
    () => sessionStorage.getItem("au_admin_pw") || ""
  );
  const [unlocked, setUnlocked] = useState(false);
  const [clients, setClients] = useState([]);
  const [invites, setInvites] = useState([]);
  const [sel, setSel] = useState("");
  const [newLink, setNewLink] = useState(null);
  const [copied, setCopied] = useState("");
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  const origin = window.location.origin;
  const clientName = (id) =>
    (clients.find((c) => c.id === id) || {}).name || id;
  const inviteUrl = (token) => `${origin}/?invite=${token}`;

  async function adminFetch(method, body) {
    const res = await fetch("/api/admin", {
      method,
      headers: {
        "x-admin-token": pw,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  }

  async function load() {
    const d = await adminFetch("GET");
    setClients(d.clients);
    setInvites(d.invites);
    if (d.clients[0] && !sel) setSel(d.clients[0].id);
    if (d.dbError) {
      setErr("Database read failed: " + d.dbError);
    } else if (!d.clients || d.clients.length === 0) {
      setErr(
        "Connected, but no clients found. Check that the app's SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY point to this same project (and that the service_role key isn't the anon key)."
      );
    } else {
      setErr(null);
    }
  }

  async function unlock(e) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await load();
      sessionStorage.setItem("au_admin_pw", pw);
      setUnlocked(true);
    } catch (e2) {
      setErr(e2.message);
    }
    setBusy(false);
  }

  async function create() {
    setErr(null);
    setBusy(true);
    setNewLink(null);
    try {
      const d = await adminFetch("POST", { action: "create", client_id: sel });
      setNewLink(d.url);
      await load();
    } catch (e2) {
      setErr(e2.message);
    }
    setBusy(false);
  }

  async function setActive(token, active) {
    setErr(null);
    setBusy(true);
    try {
      await adminFetch("POST", { action: "revoke", token, active });
      await load();
    } catch (e2) {
      setErr(e2.message);
    }
    setBusy(false);
  }

  function copy(text, key) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(""), 1500);
    });
  }

  if (!unlocked) {
    return (
      <AuthShell
        title="ActivatUs admin"
        subtitle="Enter the admin password to manage invite links."
      >
        <form className="auth__form" onSubmit={unlock}>
          <label className="auth__label">
            Admin password
            <input
              className="auth__input"
              type="password"
              autoComplete="off"
              required
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </label>
          {err ? <p className="auth__error" role="alert">{err}</p> : null}
          <button className="as-btn as-btn-primary auth__submit" type="submit" disabled={busy}>
            {busy ? "Checking…" : "Unlock"}
          </button>
        </form>
      </AuthShell>
    );
  }

  return (
    <div className="admin">
      <div className="admin__bar">
        <BrandLockup markHeight={26} wordHeight={17} />
        <span className="admin__tag">Admin · invites</span>
      </div>

      <div className="admin__body">
        <section className="admin__panel">
          <h2 className="admin__h">Create an invite link</h2>
          <p className="admin__sub">
            Pick a client, then share the link. Anyone who opens it signs up as
            that client (one account per email).
          </p>
          <div className="admin__create">
            <select
              className="auth__input admin__select"
              value={sel}
              onChange={(e) => setSel(e.target.value)}
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              className="as-btn as-btn-primary"
              onClick={create}
              disabled={busy || !sel}
            >
              Create invite
            </button>
          </div>

          {newLink ? (
            <div className="admin__newlink">
              <code className="admin__code">{newLink}</code>
              <button
                className="as-btn as-btn-outline"
                onClick={() => copy(newLink, "new")}
              >
                {copied === "new" ? "Copied" : "Copy link"}
              </button>
            </div>
          ) : null}

          {err ? <p className="auth__error" role="alert">{err}</p> : null}
        </section>

        <section className="admin__panel">
          <h2 className="admin__h">Invite links</h2>
          {invites.length === 0 ? (
            <p className="admin__sub">No invites yet.</p>
          ) : (
            <ul className="admin__list">
              {invites.map((inv) => (
                <li
                  key={inv.token}
                  className={`admin__row ${inv.active ? "" : "is-off"}`}
                >
                  <div className="admin__row-main">
                    <span className="admin__client">{clientName(inv.client_id)}</span>
                    <code className="admin__token">…{inv.token.slice(-8)}</code>
                    <span className={`admin__state ${inv.active ? "on" : "off"}`}>
                      {inv.active ? "Active" : "Revoked"}
                    </span>
                  </div>
                  <div className="admin__row-actions">
                    <button
                      className="admin__linkbtn"
                      onClick={() => copy(inviteUrl(inv.token), inv.token)}
                    >
                      {copied === inv.token ? "Copied" : "Copy link"}
                    </button>
                    {inv.active ? (
                      <button
                        className="admin__linkbtn admin__linkbtn--danger"
                        onClick={() => setActive(inv.token, false)}
                        disabled={busy}
                      >
                        Revoke
                      </button>
                    ) : (
                      <button
                        className="admin__linkbtn"
                        onClick={() => setActive(inv.token, true)}
                        disabled={busy}
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
