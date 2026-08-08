/* ============================================================
   ActivatUs — Google Ad Grant dashboard
   MOCK API RESPONSE

   This object mirrors the shape of the ActivatUs monitoring API
   ("account sweep") so the UI can later be fed a real response
   with no component changes.

   HOW TO CONNECT THE REAL API LATER
   ---------------------------------
   Replace the default export of this file with the parsed API
   response (same keys), or pass the response into <App data={...} />.
   Nothing in the components reads from this file directly: they read
   from the object handed to <App/>, and all human-facing wording is
   produced by src/lib/translate.js. So swapping this mock for a live
   fetch() result is a one-line change in src/main.jsx.

   Every value below comes from the supplied sample sweep. No metric
   has been invented. Fields we were not given are left null.
   ============================================================ */

export const mockData = {
  // ---- Account (who this report is about) ------------------------
  account: {
    name: "Bookshare",
    label: "Google Ad Grant",
    // Google's raw account status. Translated for the client in the UI.
    status: "ENABLED",
    // Ad Grant accounts are denominated in USD. Shown only in the
    // technical section; never invented into a client-facing metric.
    currency: "USD",
  },

  // ---- The most recent monitoring sweep --------------------------
  // latestSweepDate powers "Last checked" in the hero.
  latestSweepDate: "2026-08-08",

  // ---- What the ads did this month (month to date) ---------------
  // Raw Google metrics. The UI translates each into plain language.
  performance: {
    period: "month_to_date",
    // The sample sweep is early in the month, so month-over-month
    // is not yet like-for-like. dayOfMonth guards the comparison UI.
    dayOfMonth: 7,
    impressions: 10320,
    clicks: 1080,
    conversions: 66.46,     // Google reports fractional conversions
    ctr: 10.47,             // percent
  },

  // ---- Last full month (for context, not a scoreboard) -----------
  // Only the figures we were given. Impressions/clicks for last month
  // were not supplied, so they stay null and are never shown.
  lastMonth: {
    conversions: 392,
    ctr: 11.18,             // percent
    impressions: null,
    clicks: null,
  },

  // ---- Daily ad visibility for the recent week -------------------
  // Used by the weekly chart. label is pre-formatted for readability.
  impressionHistory: [
    { date: "2026-07-31", label: "Jul 31", impressions: 1724 },
    { date: "2026-08-01", label: "Aug 1",  impressions: 1249 },
    { date: "2026-08-02", label: "Aug 2",  impressions: 1604 },
    { date: "2026-08-03", label: "Aug 3",  impressions: 1326 },
    { date: "2026-08-04", label: "Aug 4",  impressions: 1880 },
    { date: "2026-08-05", label: "Aug 5",  impressions: 1905 },
    { date: "2026-08-06", label: "Aug 6",  impressions: 2245 },
  ],

  // ---- Account management activity -------------------------------
  management: {
    recentChanges: 23,
    lastChangeDaysAgo: 9,
  },

  // ---- Structural counts (for "See details" + technical) ---------
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

  // ---- Monitoring checks -----------------------------------------
  // Each check is one thing ActivatUs watches. `state` is one of:
  //   "good"  -> looks good, no action
  //   "watch" -> worth monitoring, no client action needed
  //   "action"-> the client needs to do something
  // `key` maps to human copy in src/lib/translate.js.
  // `group` decides where the check surfaces in the UI:
  //   "metric"     -> the "What your ads are doing" numbers
  //   "management" -> the "actively managed" statement
  //   "health"     -> the editorial health rows
  //   "attention"  -> the "keeping an eye on" section
  checks: [
    { key: "account_status",        state: "good",  group: "health" },
    { key: "account_structure",     state: "good",  group: "health" },
    { key: "ad_disapprovals",       state: "good",  group: "health" },
    { key: "conversion_tracking",   state: "good",  group: "health" },
    { key: "geo_targeting",         state: "good",  group: "health" },
    { key: "keyword_hygiene",       state: "good",  group: "health" },
    { key: "keyword_quality_score", state: "good",  group: "health" },
    { key: "serving_collapse",      state: "good",  group: "health" },
    { key: "sitelinks",             state: "good",  group: "health" },
    { key: "smart_bidding",         state: "good",  group: "health" },
    { key: "conversions_monthly",   state: "good",  group: "metric" },
    { key: "ctr_monthly",           state: "good",  group: "metric" },
    { key: "active_management",     state: "good",  group: "management" },
    {
      key: "campaign_serving",
      state: "watch",
      group: "attention",
      // Google's raw, campaign-level report. Kept out of the plain-
      // language summary and shown only under "technical details".
      detail: {
        campaign: "RSO - Bookshare",
        googleStatus: "LIMITED",
        reportedReason: "HAS_ADS_DISAPPROVED",
      },
    },
  ],
};

export default mockData;
