import React, { useState } from "react";
import DashboardHeader from "./components/DashboardHeader.jsx";
import HealthHero from "./components/HealthHero.jsx";
import MetricSummary from "./components/MetricSummary.jsx";
import WeeklyVisibilityChart from "./components/WeeklyVisibilityChart.jsx";
import HealthChecks from "./components/HealthChecks.jsx";
import AttentionSection from "./components/AttentionSection.jsx";
import ManagementActivity from "./components/ManagementActivity.jsx";
import MonthComparison from "./components/MonthComparison.jsx";
import TechnicalDetails from "./components/TechnicalDetails.jsx";
import { overallStatus } from "./lib/status.js";
import { lastCheckedPhrase } from "./lib/format.js";

/* ============================================================
   App — composes the client report.
   All wording comes from the translation layer; all numbers come
   from `data` (the mock today, a real API response tomorrow).
   ============================================================ */

export default function App({ data }) {
  // In a multi-account build this would switch the fetched dataset.
  const [account] = useState(data.account.name);

  const overall = overallStatus(data.checks);
  const lastChecked = lastCheckedPhrase(data.latestSweepDate);

  return (
    <div className="app">
      <DashboardHeader accounts={[account]} selected={account} />

      <main className="page">
        <HealthHero
          overall={overall}
          lastChecked={lastChecked}
          orgName={data.account.name}
        />

        <MetricSummary performance={data.performance} />

        <WeeklyVisibilityChart history={data.impressionHistory} />

        <HealthChecks data={data} />

        <AttentionSection data={data} />

        <ManagementActivity management={data.management} />

        <MonthComparison
          performance={data.performance}
          lastMonth={data.lastMonth}
        />

        <TechnicalDetails data={data} />
      </main>

      <footer className="site-footer">
        <p>
          Your Google Ad Grant, managed by ActivatUs. This report reflects our
          most recent check of your account.
        </p>
      </footer>
    </div>
  );
}
