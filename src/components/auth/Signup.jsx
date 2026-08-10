import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient.js";
import { apiPost } from "../../lib/api.js";
import AuthShell from "./AuthShell.jsx";

/* ============================================================
   Signup — reached via an invite link (?invite=<token>). Creates the
   account server-side (invite-gated), then signs in. One account per
   email; an existing email is told to log in instead.
   ============================================================ */

export default function Signup({ token, onNeedLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await apiPost("/api/signup", { token, email, password });
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setBusy(false);
        setErr("Your account was created. Please sign in with your new password.");
      }
      // On success, AuthGate takes over.
    } catch (e2) {
      setBusy(false);
      setErr(e2.message || "We couldn't create your account. Please try again.");
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="You've been invited by ActivatUs. Set a password to get started."
      footer={
        <p className="auth__note">
          Already have an account?{" "}
          <button type="button" className="auth__link" onClick={onNeedLogin}>
            Sign in instead
          </button>
        </p>
      }
    >
      <form className="auth__form" onSubmit={submit}>
        <label className="auth__label">
          Email
          <input
            className="auth__input"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="auth__label">
          Password
          <input
            className="auth__input"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="auth__hint">At least 8 characters.</span>
        </label>
        {err ? <p className="auth__error" role="alert">{err}</p> : null}
        <button className="as-btn as-btn-primary auth__submit" type="submit" disabled={busy}>
          {busy ? "Creating your account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
