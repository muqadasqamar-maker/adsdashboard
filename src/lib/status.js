/* ============================================================
   Status system — three clearly understandable states.

   Every state pairs a WORD and an ICON, never colour alone
   (brand rule F20). Colour only reinforces the label.
   ============================================================ */

export const STATUS = {
  good: {
    key: "good",
    label: "Looks good",
    meaning: "No action is needed.",
    icon: "check",
    tone: "good",
  },
  watch: {
    key: "watch",
    label: "We're watching this",
    meaning:
      "We've spotted something worth monitoring, but you don't need to do anything right now.",
    icon: "watch",
    tone: "watch",
  },
  action: {
    key: "action",
    label: "We need something from you",
    meaning: "There's a step we need you to take. We'll walk you through it.",
    icon: "action",
    tone: "action",
  },
};

// The single source of truth for the whole-account headline.
// action beats watch beats good.
export function overallStatus(checks) {
  const counts = { good: 0, watch: 0, action: 0 };
  checks.forEach((c) => {
    counts[c.state] = (counts[c.state] || 0) + 1;
  });

  let level = "good";
  if (counts.action > 0) level = "action";
  else if (counts.watch > 0) level = "watch";

  // The hero copy is deliberately reassuring when nothing needs the
  // client's action, even if we're monitoring something.
  const headline =
    level === "action"
      ? "There's one thing we need from you."
      : "Things are looking good.";

  const good = counts.good;
  const attention = counts.watch + counts.action;

  let summary;
  if (attention === 0) {
    summary = `All ${good} of our checks look good.`;
  } else {
    summary = `${good} checks look good. ${attention} item${
      attention === 1 ? "" : "s"
    } need${attention === 1 ? "s" : ""} our attention.`;
  }

  return { level, headline, summary, counts, good, attention };
}
