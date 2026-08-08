/* ============================================================
   Translation layer.

   This is the ONLY place raw API / Google Ads language is turned
   into the words a nonprofit executive actually reads. Components
   never hard-code check wording: they ask this file.

   Each entry returns:
     title        short plain-English headline
     explanation  one warm sentence
     details      optional [{label, value}] shown under "See details"
     technical    optional [{term, value}] shown in the technical
                  section (the Google Ads vocabulary behind the summary)

   Some entries need live numbers, so builders receive the whole
   data object and pull from data.structure etc.
   ============================================================ */

import { group, whole, percent } from "/src/lib/format.js";

const CHECKS = {
  account_status: (d) => ({
    title: "Your account is active",
    explanation:
      "Your Google Ad Grant is enabled and able to run advertising.",
    technical: [{ term: "Account status", value: d.account.status }],
  }),

  account_structure: (d) => ({
    title: "Your campaigns are well structured",
    explanation:
      "Your campaigns have enough ad groups and ads to meet the structure we look for.",
    details: [
      { label: "Campaigns", value: group(d.structure.campaigns) },
      { label: "Ad groups", value: group(d.structure.adGroups) },
      { label: "Enabled ads", value: group(d.structure.enabledAds) },
      {
        label: "Responsive search ads",
        value: group(d.structure.responsiveSearchAds),
      },
    ],
  }),

  ad_disapprovals: (d) => ({
    title: "Your ads meet Google's policies",
    explanation:
      "No ads are currently showing as disapproved or policy limited.",
    details: [
      { label: "Ads not approved", value: group(d.structure.disapprovedAds) },
    ],
  }),

  conversion_tracking: (d) => ({
    title: "Your conversion tracking is working",
    explanation:
      "We're successfully measuring the important actions people take after clicking your ads.",
    details: [
      {
        label: "Tracked actions",
        value: group(d.structure.conversionActions),
      },
    ],
  }),

  geo_targeting: () => ({
    title: "Your targeting is set up",
    explanation: "Every active campaign is targeting specific locations.",
  }),

  keyword_hygiene: (d) => ({
    title: "Your keywords are healthy",
    explanation:
      "We aren't seeing problematic single-word or overly generic search terms in your active targeting.",
    details: [
      { label: "Search terms reviewed", value: group(d.structure.keywords) },
    ],
  }),

  keyword_quality_score: (d) => ({
    title: "Your keywords are relevant",
    explanation:
      "Google rates how well your search terms match what people look for. None of yours are rated poorly.",
    details: [
      {
        label: "Very low quality-score terms",
        value: group(d.structure.lowQualityScoreKeywords),
      },
    ],
    technical: [
      {
        term: "Low Quality Score keywords",
        value: group(d.structure.lowQualityScoreKeywords),
      },
    ],
  }),

  serving_collapse: () => ({
    title: "Your ads are appearing normally",
    explanation:
      "We keep an eye on whether your ads suddenly stop showing. Everything is steady.",
  }),

  sitelinks: (d) => ({
    title: "Your helpful links are active",
    explanation: `Your ads currently have ${d.structure.sitelinks} extra links helping people reach important pages.`,
    details: d.structure.sitelinkText.map((t) => ({ label: t, value: "" })),
    technical: [{ term: "Sitelinks", value: group(d.structure.sitelinks) }],
  }),

  smart_bidding: () => ({
    title: "Your campaigns use automated bidding",
    explanation:
      "Your active campaigns let Google's automated tools decide how to compete for each search, so your grant works efficiently.",
  }),

  // ---- Metric checks (surfaced as the big numbers) ---------------
  conversions_monthly: (d) => ({
    title: "Meaningful actions",
    explanation:
      "Important actions people took because of your ads this month.",
    technical: [{ term: "Conversions", value: d.performance.conversions }],
  }),

  ctr_monthly: (d) => ({
    title: "People responding to your ads",
    explanation: "How often the people who saw your ads decided to click.",
    technical: [{ term: "Click-through rate", value: percent(d.performance.ctr) }],
  }),

  // ---- Management ------------------------------------------------
  active_management: (d) => ({
    title: "Your account is being actively managed",
    explanation:
      "We regularly review and improve your account so your grant keeps working.",
    technical: [
      { term: "Recent changes", value: group(d.management.recentChanges) },
      {
        term: "Days since last change",
        value: group(d.management.lastChangeDaysAgo),
      },
    ],
  }),

  // ---- Attention -------------------------------------------------
  campaign_serving: (d, check) => ({
    title: "One campaign has a limitation",
    explanation:
      "Most of your campaigns are running normally. One campaign is currently listed by Google as limited, and we're keeping an eye on it.",
    // Careful wording: the sweep also reports zero disapproved ads, so
    // we present Google's campaign-level reason as a report, not a fact
    // about a specific ad.
    technical: [
      { term: "Campaign", value: check.detail.campaign },
      { term: "Google status", value: check.detail.googleStatus },
      { term: "Reported reason", value: check.detail.reportedReason },
    ],
  }),
};

// Human copy for a single check.
export function translateCheck(check, data) {
  const builder = CHECKS[check.key];
  if (!builder) {
    return { title: check.key, explanation: "" };
  }
  return builder(data, check);
}

// Convenience: pull checks by their UI group, translated and ready.
export function checksByGroup(data, groupName) {
  return data.checks
    .filter((c) => c.group === groupName)
    .map((c) => ({ ...c, content: translateCheck(c, data) }));
}
