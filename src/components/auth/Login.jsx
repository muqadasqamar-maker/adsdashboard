import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient.js";
import AuthShell from "./AuthShell.jsx";

/* ============================================================
   Login — email + password (Supabase). On success, the auth state
   listener in AuthGate takes over and loads the portal.
   ============================================================ */

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setBusy(false);
      setErr("That email and password didn't match. Please try again.");
    }
    // On success, AuthGate's onAuthStateChange handles the rest.
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to see your Google Ad Grant and the work we're doing for you."
      footer={
        <p className="auth__note">
          Have an invite link from ActivatUs? Open it to create your account.
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
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {err ? <p className="auth__error" role="alert">{err}</p> : null}
        <button className="as-btn as-btn-primary auth__submit" type="submit" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
