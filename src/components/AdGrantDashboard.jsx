import React from "react";
import HealthHero from "./HealthHero.jsx";
import MetricSummary from "./MetricSummary.jsx";
import WeeklyVisibilityChart from "./WeeklyVisibilityChart.jsx";
import HealthChecks from "./HealthChecks.jsx";
import AttentionSection from "./AttentionSection.jsx";
import ManagementActivity from "./ManagementActivity.jsx";
import MonthComparison from "./MonthComparison.jsx";
import TechnicalDetails from "./TechnicalDetails.jsx";
import { overallStatus } from "../lib/status.js";
import { lastCheckedPhrase } from "../lib/format.js";

/* ============================================================
   AdGrantDashboard — "How things are performing".
   The Google Ad Grant report, composed from the mock/API data.
   ============================================================ */

export default function AdGrantDashboard({ data }) {
  const overall = overallStatus(data.checks);
  const lastChecked = lastCheckedPhrase(data.latestSweepDate);

  return (
    <>
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
    </>
  );
}
