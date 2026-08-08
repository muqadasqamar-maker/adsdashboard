import React, { useState } from "react";
import DashboardHeader from "./components/DashboardHeader.jsx";
import PrimaryNav from "./components/PrimaryNav.jsx";
import AdGrantDashboard from "./components/AdGrantDashboard.jsx";
import ProjectsDashboard from "./components/ProjectsDashboard.jsx";

/* ============================================================
   App — the shell shared by both client experiences.
   The header, navigation, spacing, status language, colours and
   buttons are identical across the two views, so moving between
   "Ad Grant" (results) and "Projects" (work) feels like one product.
   ============================================================ */

export default function App({ adGrant, projects }) {
  const [view, setView] = useState("adgrant");
  const [account] = useState(adGrant.account.name);

  const footerText =
    view === "adgrant"
      ? "Your Google Ad Grant, managed by ActivatUs. This report reflects our most recent check of your account."
      : "Your projects with ActivatUs. We keep this page updated as work moves forward.";

  return (
    <div className="app">
      <div className="topbar">
        <DashboardHeader accounts={[account]} selected={account} />
        <PrimaryNav view={view} onChange={setView} />
      </div>

      <main className="page">
        {view === "adgrant" ? (
          <AdGrantDashboard data={adGrant} />
        ) : (
          <ProjectsDashboard data={projects} />
        )}
      </main>

      <footer className="site-footer">
        <p>{footerText}</p>
      </footer>
    </div>
  );
}
