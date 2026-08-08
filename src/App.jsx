import React, { useState } from "react";
import DashboardHeader from "/src/components/DashboardHeader.jsx";
import HealthHero from "/src/components/HealthHero.jsx";
import MetricSummary from "/src/components/MetricSummary.jsx";
import WeeklyVisibilityChart from "/src/components/WeeklyVisibilityChart.jsx";
import HealthChecks from "/src/components/HealthChecks.jsx";
import AttentionSection from "/src/components/AttentionSection.jsx";
import ManagementActivity from "/src/components/ManagementActivity.jsx";
import MonthComparison from "/src/components/MonthComparison.jsx";
import TechnicalDetails from "/src/components/TechnicalDetails.jsx";
import { overallStatus } from "/src/lib/status.js";
import { lastCheckedPhrase } from "/src/lib/format.js";

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
