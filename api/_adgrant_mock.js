/* ============================================================
   Mock Ad Grant data (server-side), standing in for the
   platform.activatus.com API until it exists. Same shape as the UI's
   src/data/mockData.js. Parameterized by client so each client sees
   their own name; the metrics are sample data for now.

   When the platform API is ready, replace buildAdGrant() with a fetch
   to platform.activatus.com using client.ad_grant_account_id, mapping
   the response onto this shape.
   ============================================================ */

export function buildAdGrant(client) {
  const name = (client && client.name) || "Your organization";
  return {
    account: { name, label: "Google Ad Grant", status: "ENABLED", currency: "USD" },
    latestSweepDate: "2026-08-08",
    performance: {
      period: "month_to_date",
      dayOfMonth: 7,
      impressions: 10320,
      clicks: 1080,
      conversions: 66.46,
      ctr: 10.47,
    },
    lastMonth: { conversions: 392, ctr: 11.18, impressions: null, clicks: null },
    impressionHistory: [
      { date: "2026-07-31", label: "Jul 31", impressions: 1724 },
      { date: "2026-08-01", label: "Aug 1", impressions: 1249 },
      { date: "2026-08-02", label: "Aug 2", impressions: 1604 },
      { date: "2026-08-03", label: "Aug 3", impressions: 1326 },
      { date: "2026-08-04", label: "Aug 4", impressions: 1880 },
      { date: "2026-08-05", label: "Aug 5", impressions: 1905 },
      { date: "2026-08-06", label: "Aug 6", impressions: 2245 },
    ],
    management: { recentChanges: 23, lastChangeDaysAgo: 9 },
    structure: {
      campaigns: 7,
      adGroups: 18,
      enabledAds: 40,
      responsiveSearchAds: 35,
      conversionActions: 6,
      keywords: 229,
      lowQualityScoreKeywords: 0,
      disapprovedAds: 0,
      sitelinks: 6,
      sitelinkText: [
        "Sign Up Free",
        "Free Reading App",
        "Who We Are",
        "Partner With Us",
        "Help & Learning",
        "Explore the Library",
      ],
    },
    checks: [
      { key: "account_status", state: "good", group: "health" },
      { key: "account_structure", state: "good", group: "health" },
      { key: "ad_disapprovals", state: "good", group: "health" },
      { key: "conversion_tracking", state: "good", group: "health" },
      { key: "geo_targeting", state: "good", group: "health" },
      { key: "keyword_hygiene", state: "good", group: "health" },
      { key: "keyword_quality_score", state: "good", group: "health" },
      { key: "serving_collapse", state: "good", group: "health" },
      { key: "sitelinks", state: "good", group: "health" },
      { key: "smart_bidding", state: "good", group: "health" },
      { key: "conversions_monthly", state: "good", group: "metric" },
      { key: "ctr_monthly", state: "good", group: "metric" },
      { key: "active_management", state: "good", group: "management" },
      {
        key: "campaign_serving",
        state: "watch",
        group: "attention",
        detail: {
          campaign: "RSO - Bookshare",
          googleStatus: "LIMITED",
          reportedReason: "HAS_ADS_DISAPPROVED",
        },
      },
    ],
  };
}
