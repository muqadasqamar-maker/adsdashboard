import React from "react";
import { BrandLockup } from "../Brand.jsx";

/* ============================================================
   AuthShell — branded, centered container for sign-in / sign-up.
   ============================================================ */

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__brand">
          <BrandLockup markHeight={34} wordHeight={22} />
        </div>
        <h1 className="auth__title">{title}</h1>
        {subtitle ? <p className="auth__subtitle">{subtitle}</p> : null}
        {children}
        {footer ? <div className="auth__footer">{footer}</div> : null}
      </div>
    </div>
  );
}
