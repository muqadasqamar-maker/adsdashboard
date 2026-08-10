import React, { useEffect, useState, useCallback, useRef } from "react";
import { supabase, supabaseConfigured } from "./lib/supabaseClient.js";
import { apiGet } from "./lib/api.js";
import App from "./App.jsx";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import AuthShell from "./components/auth/AuthShell.jsx";
import AdminInvites from "./components/admin/AdminInvites.jsx";

/* ============================================================
   AuthGate — the top of the app.
     no session   -> Login (or Signup when opened via ?invite=token)
     signed in    -> fetch /api/session + /api/projects -> <App/>
   Session comes from Supabase; all data is scoped server-side to the
   signed-in client.
   ============================================================ */

function inviteToken() {
  return new URLSearchParams(window.location.search).get("invite");
}

function Message({ title, children }) {
  return (
    <AuthShell title={title}>
      <p className="auth__subtitle">{children}</p>
    </AuthShell>
  );
}

export default function AuthGate() {
  const [session, setSession] = useState(undefined); // undefined=checking, null=signed out
  const [data, setData] = useState(null);
  const [phase, setPhase] = useState("loading"); // loading | ready | error
  const [loadError, setLoadError] = useState(null);
  const [forceLogin, setForceLogin] = useState(false);
  // The user id we've already loaded data for, so background token
  // refreshes (which fire when the tab regains focus) don't reload the app.
  const loadedFor = useRef(null);

  // Subscribe to auth state.
  useEffect(() => {
    if (!supabaseConfigured) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session || null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s || null);
      if (!s) {
        loadedFor.current = null;
        setData(null);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Load portal data once per signed-in user (not on every token refresh).
  useEffect(() => {
    const uid = session && session.user && session.user.id;
    if (!uid) return;
    if (loadedFor.current === uid) return; // already loaded; ignore refreshes
    loadedFor.current = uid;

    let live = true;
    setPhase("loading");
    setLoadError(null);
    Promise.all([apiGet("/api/session"), apiGet("/api/projects")])
      .then(([s, projects]) => {
        if (!live) return;
        setData({ adGrant: s.adGrant, clientName: s.client?.name, projects });
        setPhase("ready");
      })
      .catch((e) => {
        if (!live) return;
        loadedFor.current = null; // allow a retry on the next change
        setLoadError(e.message || "Something went wrong.");
        setPhase("error");
      });
    return () => {
      live = false;
    };
  }, [session]);

  const signOut = useCallback(() => {
    if (supabase) supabase.auth.signOut();
  }, []);

  // ActivatUs-only invite manager. Independent of client sign-in.
  if (new URLSearchParams(window.location.search).get("admin") === "1") {
    return <AdminInvites />;
  }

  if (!supabaseConfigured) {
    return (
      <Message title="Almost there">
        This portal needs its Supabase settings before it can sign anyone in. Add
        the environment variables and reload.
      </Message>
    );
  }

  if (session === undefined) {
    return <Message title="Loading…">One moment.</Message>;
  }

  if (!session) {
    const token = inviteToken();
    if (token && !forceLogin) {
      return <Signup token={token} onNeedLogin={() => setForceLogin(true)} />;
    }
    return <Login />;
  }

  if (phase === "loading") {
    return <Message title="Loading your account…">Getting your latest information.</Message>;
  }

  if (phase === "error") {
    return (
      <AuthShell title="We couldn't load your account">
        <p className="auth__subtitle">{loadError}</p>
        <button className="as-btn as-btn-outline auth__submit" onClick={signOut}>
          Sign out
        </button>
      </AuthShell>
    );
  }

  return (
    <App
      adGrant={data.adGrant}
      projects={data.projects}
      clientName={data.clientName}
      onSignOut={signOut}
    />
  );
}
