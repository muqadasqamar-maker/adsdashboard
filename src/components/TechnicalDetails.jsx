import React, { useState } from "react";
import { ChevronIcon } from "/src/components/Icons.jsx";
import { group, percent, longDate } from "/src/lib/format.js";
import { overallStatus } from "/src/lib/status.js";

/* ============================================================
   TechnicalDetails — the Google Ads vocabulary behind the summary,
   collapsed by default. For the curious or technical reader only.
   Never exposes UUIDs, billing IDs, internal paths, or raw
   backend metadata (they add nothing for the client).
   ============================================================ */

export default function TechnicalDetails({ data }) {
  const [open, setOpen] = useState(false);
  const s = data.structure;
  const p = data.performance;
  const overall = overallStatus(data.checks);

  const rows = [
    ["Account status", data.account.status],
    ["Currency", data.account.currency],
    ["Campaigns", group(s.campaigns)],
    ["Ad groups", group(s.adGroups)],
    ["Enabled ads", group(s.enabledAds)],
    ["Responsive search ads", group(s.responsiveSearchAds)],
    ["Click-through rate", percent(p.ctr)],
    ["Clicks", group(p.clicks)],
    ["Impressions", group(p.impressions)],
    ["Conversions", p.conversions],
    ["Conversion actions", group(s.conversionActions)],
    ["Keywords", group(s.keywords)],
    ["Sitelinks", group(s.sitelinks)],
    [
      "Monitoring checks",
      `${data.checks.length} total · ${overall.good} pass · ${overall.attention} attention`,
    ],
    ["Latest sweep date", longDate(data.latestSweepDate)],
  ];

  return (
    <section className="section technical" aria-labelledby="tech-heading">
      <button
        type="button"
        className="technical__toggle"
        aria-expanded={open}
        aria-controls="tech-panel"
        onClick={() => setOpen((o) => !o)}
      >
        <span>
          <span className="technical__title" id="tech-heading">
            Want the technical details?
          </span>
          <span className="technical__sub">
            This section shows the Google Ads terminology behind the summary
            above.
          </span>
        </span>
        <ChevronIcon open={open} size={22} />
      </button>

      <div className="technical__panel" id="tech-panel" hidden={!open}>
        <table className="tech-table">
          <caption className="visually-hidden">
            Google Ads metrics for this account
          </caption>
          <tbody>
            {rows.map(([term, value]) => (
              <tr key={term}>
                <th scope="row">{term}</th>
                <td>{String(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
