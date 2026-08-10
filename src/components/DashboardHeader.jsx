import React from "react";
import { Mark, Wordmark } from "./Brand.jsx";

/* ============================================================
   DashboardHeader — quiet, branded, report-like (not SaaS chrome).
   Left: the real ActivatUs mark + wordmark. Right: the client name,
   the "Google Ad Grant" label, and (when signed in) a sign-out.
   ============================================================ */

export default function DashboardHeader({ selected, onSignOut }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand-lockup" href="#top" aria-label="ActivatUs home">
          <Mark height={30} />
          <Wordmark height={20} />
        </a>

        <div className="site-header__right">
          <span className="site-header__product">Google Ad Grant</span>
          {selected ? (
            <span className="site-header__account">{selected}</span>
          ) : null}
          {onSignOut ? (
            <button type="button" className="site-header__signout" onClick={onSignOut}>
              Sign out
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
