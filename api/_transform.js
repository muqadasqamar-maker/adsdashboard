/* ============================================================
   ClickUp -> app data transformer.

   Turns raw ClickUp tasks (REST API v2 shape) into the exact
   object the Projects UI already consumes (see src/data/projectsData.js).
   No ClickUp language leaks through: statuses become client states,
   tags/names become friendly categories, dates become plain timings.

   Files prefixed with "_" are not exposed as routes by Vercel; this
   is imported by api/projects.js.
   ============================================================ */

const CLIENT = "Bookshare";
const PROJECT = { id: "b2s-2026", name: "Back-to-School 2026" };

// ClickUp list status -> client-facing state.
const STATUS_TO_STATE = {
  "to do": "upcoming",
  "in production": "working",
  "internal review": "working", // still our step
  "client review": "review", // needs the client
  "client approved": "working", // approved; we publish next
  published: "complete",
  complete: "complete",
};

function statusName(task) {
  const s = task.status;
  return (typeof s === "string" ? s : s && s.status) || "";
}

function stateFor(task) {
  return STATUS_TO_STATE[statusName(task).toLowerCase()] || "working";
}

// Prefer ClickUp tags; fall back to inferring from the task name.
function categoryFor(task) {
  const tags = (task.tags || []).map((t) =>
    (typeof t === "string" ? t : t.name || "").toLowerCase()
  );
  const tagHas = (s) => tags.some((t) => t.includes(s));
  if (tagHas("blog")) return "blogs";
  if (tagHas("email")) return "email";
  if (tagHas("landing")) return "website";
  if (tagHas("social")) return "content_social";

  const n = (task.name || "").toLowerCase();
  if (/blog/.test(n)) return "blogs";
  if (/email/.test(n)) return "email";
  if (/landing page|what'?s[- ]new|feature page|portal/.test(n)) return "website";
  if (/spotlight|social|google ads|ad copy/.test(n)) return "content_social";
  return "content_social";
}

function cleanTitle(name) {
  let t = (name || "").replace(/^B2S\s+/i, "");
  const m = t.match(/spotlight\s*\d\s*\/\s*\d\s*[—-]\s*(.+)$/i);
  if (m) t = m[1];
  t = t.trim();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : t;
}

function describe(task, category) {
  const sm = (task.name || "").match(/spotlight\s*(\d)\s*\/\s*\d/i);
  if (sm) return `Part ${sm[1]} of the Back-to-School spotlight series.`;
  switch (category) {
    case "email":
      return "A campaign email for your Back-to-School push.";
    case "website":
      return "A web page for your Back-to-School campaign.";
    case "blogs":
      return "A blog post supporting your Back-to-School campaign.";
    default:
      return "A social asset for your Back-to-School campaign.";
  }
}

function friendlyDate(ms, now) {
  const d = new Date(Number(ms));
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const b = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((b - a) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff > 1 && diff < 7)
    return d.toLocaleDateString("en-US", { weekday: "long" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function shortDate(ms) {
  return new Date(Number(ms)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function timingFor(task, state, now) {
  if (state === "complete") {
    const ms = task.date_closed || task.due_date;
    return ms ? { kind: "completed", label: shortDate(ms) } : null;
  }
  if (!task.due_date) return null;
  // Don't show a due date that's already passed as a future "Expected".
  const d = new Date(Number(task.due_date));
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const b = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (Math.round((b - a) / 86400000) < 0) {
    return { kind: "status", label: "In progress" };
  }
  return { kind: "expected", label: friendlyDate(task.due_date, now) };
}

export function transform(tasks, now = new Date()) {
  const workItems = (tasks || []).map((task) => {
    const state = stateFor(task);
    const category = categoryFor(task);
    return {
      id: String(task.id),
      projectId: PROJECT.id,
      title: cleanTitle(task.name),
      category,
      state,
      description: describe(task, category),
      timing: timingFor(task, state, now),
    };
  });

  // Simple, honest progress from the spread of statuses.
  const states = new Set(workItems.map((w) => w.state));
  let current = 1; // Content
  if (workItems.length && workItems.every((w) => w.state === "complete"))
    current = 3;
  else if (states.has("review")) current = 2;
  else if (states.has("working")) current = 1;
  else current = 0;

  const milestones = ["Planning", "Content", "Review", "Launch"].map(
    (name, i) => ({
      name,
      state: i < current ? "done" : i === current ? "current" : "upcoming",
    })
  );
  const headline = [
    "Getting set up",
    "Content is underway",
    "In review with you",
    "Launching",
  ][current];

  return {
    client: CLIENT,
    monthLabel: now.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    projects: [
      {
        id: PROJECT.id,
        name: PROJECT.name,
        progress: {
          label: "Making good progress",
          headline,
          note: "We keep this in step with your campaign as work moves forward.",
          milestones,
        },
      },
    ],
    workItems,
  };
}
