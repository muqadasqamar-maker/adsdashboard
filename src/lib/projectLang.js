/* ============================================================
   Projects language layer.

   The only place project states and categories become client words.
   Components never hard-code these strings.
   ============================================================ */

// Work-item states -> plain client language.
// `owner` records who holds the next step, so the UI can reassure or
// ask clearly. `needsClient` drives the attention section.
export const WORK_STATES = {
  working: {
    key: "working",
    label: "We're working on this",
    reassure: "Nothing needed from you",
    owner: "activatus",
    needsClient: false,
    icon: "working",
    tone: "working",
  },
  review: {
    key: "review",
    label: "Ready for your review",
    reassure: "We need your feedback before we continue",
    owner: "client",
    needsClient: true,
    icon: "review",
    tone: "review",
  },
  waiting: {
    key: "waiting",
    label: "We need something from you",
    reassure: "Once we have this, we'll keep things moving",
    owner: "client",
    needsClient: true,
    icon: "waiting",
    tone: "waiting",
  },
  upcoming: {
    key: "upcoming",
    label: "Coming up",
    reassure: "We've scheduled this and will start it soon",
    owner: "activatus",
    needsClient: false,
    icon: "upcoming",
    tone: "upcoming",
  },
  complete: {
    key: "complete",
    label: "Complete",
    reassure: "This work is finished",
    owner: "none",
    needsClient: false,
    icon: "complete",
    tone: "complete",
  },
};

// Internal work categories -> polished client sections.
export const CATEGORIES = {
  content_social: { key: "content_social", label: "Content & social", icon: "content" },
  email: { key: "email", label: "Email", icon: "email" },
  website: { key: "website", label: "Website & landing pages", icon: "website" },
};

export function workState(key) {
  return WORK_STATES[key] || WORK_STATES.working;
}

export function category(key) {
  return CATEGORIES[key] || { key, label: key, icon: "content" };
}

// A friendly timing sentence fragment from an item's timing object.
export function timingLabel(timing) {
  if (!timing) return null;
  if (timing.kind === "expected") return `Expected: ${timing.label}`;
  if (timing.kind === "requested") return `Requested ${timing.label}`;
  if (timing.kind === "completed") return `Completed ${timing.label}`;
  if (timing.kind === "planned") return `Planned for ${timing.label}`;
  return timing.label;
}

// ---- Selectors over the data -----------------------------------
const byState = (data, ...states) =>
  data.workItems.filter((w) => states.includes(w.state));

export const attentionItems = (data) => byState(data, "review", "waiting");
export const workingItems = (data) => byState(data, "working");
export const upcomingItems = (data) => byState(data, "upcoming");
export const completedItems = (data) => byState(data, "complete");

// Group a set of items into ordered client-facing categories.
export function groupByCategory(items) {
  const order = ["content_social", "email", "website"];
  return order
    .map((key) => ({
      category: category(key),
      items: items.filter((i) => i.category === key),
    }))
    .filter((g) => g.items.length > 0);
}

// The counts shown in the monthly summary, all derived from the data.
export function workCounts(data) {
  return {
    working: workingItems(data).length,
    review: byState(data, "review").length,
    waiting: byState(data, "waiting").length,
    upcoming: upcomingItems(data).length,
    complete: completedItems(data).length,
  };
}

// A single, reassuring hero summary sentence built from the counts.
export function heroSummary(data) {
  const c = workCounts(data);
  const attention = c.review + c.waiting;
  const parts = [];
  if (c.working > 0)
    parts.push(`we're currently working on ${c.working} item${c.working === 1 ? "" : "s"}`);
  if (attention > 0)
    parts.push(
      `${attention} item${attention === 1 ? " is" : "s are"} ready for your review`
    );

  let sentence;
  if (parts.length === 0) {
    sentence = "We don't have any active project work to show right now.";
  } else {
    sentence = parts.join(", and ") + ".";
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
  }

  const headline = attention > 0 ? "Here's what we're working on for you." : "Everything is moving.";
  return { headline, sentence, attention, counts: c };
}
