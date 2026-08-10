/* ============================================================
   ClickUp -> app data transformer (per client, multi-list).

   Input: lists = [{ id, tasks: [ClickUp task, ...] }], and the client
   record. Output: the object the Projects UI consumes
   (see src/data/projectsData.js). No ClickUp language leaks through.

   Category comes from the ClickUp "Category" custom field (authoritative),
   falling back to name inference. Review Link is surfaced per item.
   ============================================================ */

// Feedback custom fields are resolved BY NAME per task, because their
// ids (and types) differ across client folders in ClickUp.

const STATUS_TO_STATE = {
  "to do": "upcoming",
  "in production": "working",
  "internal review": "working",
  "client review": "review",
  "client approved": "working",
  published: "complete",
  complete: "complete",
};

// ClickUp Category option -> app category key.
const CATEGORY_MAP = {
  social: "content_social",
  email: "email",
  "landing-page": "website",
  website: "website",
  blog: "blogs",
};

function statusName(task) {
  const s = task.status;
  return (typeof s === "string" ? s : s && s.status) || "";
}
function stateFor(task) {
  return STATUS_TO_STATE[statusName(task).toLowerCase()] || "working";
}

function fieldByName(task, name) {
  const n = name.trim().toLowerCase();
  return (task.custom_fields || []).find(
    (f) => (f.name || "").trim().toLowerCase() === n
  );
}
function optName(o) {
  return (o && (o.name || o.label)) || "";
}
// Resolve a dropdown/labels field's selected option name(s) to a string.
function dropdownName(f) {
  if (!f || f.value === undefined || f.value === null || f.value === "") return null;
  const opts = (f.type_config && f.type_config.options) || [];
  if (Array.isArray(f.value)) {
    // labels: value is an array of option ids
    return f.value.map((v) => optName(opts.find((o) => o.id === v))).join(" ");
  }
  const v = f.value;
  const opt =
    opts.find((o) => o.orderindex === v) ||
    opts.find((o) => o.id === v) ||
    (typeof v === "number" ? opts[v] : null);
  return opt ? optName(opt) : null;
}

function categoryFor(task) {
  const cat = dropdownName(fieldByName(task, "Category"));
  if (cat && CATEGORY_MAP[cat.toLowerCase()]) return CATEGORY_MAP[cat.toLowerCase()];
  // fallback: infer from name
  const n = (task.name || "").toLowerCase();
  if (/blog/.test(n)) return "blogs";
  if (/email/.test(n)) return "email";
  if (/landing page|what'?s[- ]new|feature page|portal/.test(n)) return "website";
  if (/spotlight|social|google ads|ad copy/.test(n)) return "content_social";
  return "content_social";
}

function reviewLinkFor(task) {
  const f = fieldByName(task, "Review Link");
  return f && f.value ? String(f.value) : null;
}

// Client Approval -> "approved" | "changes" | "pending".
function approvalFor(task) {
  const name = (dropdownName(fieldByName(task, "Client Approval")) || "").toLowerCase();
  if (name.includes("approved")) return "approved";
  if (name.includes("modification")) return "changes";
  return "pending";
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
  if (sm) return `Part ${sm[1]} of the spotlight series.`;
  switch (category) {
    case "email": return "An email we're preparing for you.";
    case "website": return "A web page we're preparing for you.";
    case "blogs": return "A blog post we're preparing for you.";
    default: return "A piece of content we're preparing for you.";
  }
}

function shortDate(ms) {
  return new Date(Number(ms)).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function friendlyDate(ms, now) {
  const d = new Date(Number(ms));
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const b = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((b - a) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff > 1 && diff < 7) return d.toLocaleDateString("en-US", { weekday: "long" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function timingFor(task, state, now) {
  if (state === "complete") {
    const ms = task.date_closed || task.due_date;
    return ms ? { kind: "completed", label: shortDate(ms) } : null;
  }
  if (!task.due_date) return null;
  const d = new Date(Number(task.due_date));
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const b = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (Math.round((b - a) / 86400000) < 0) return { kind: "status", label: "In progress" };
  return { kind: "expected", label: friendlyDate(task.due_date, now) };
}

function mapTask(task, projectId, now) {
  const state = stateFor(task);
  const category = categoryFor(task);
  const item = {
    id: String(task.id),
    projectId,
    title: cleanTitle(task.name),
    category,
    state,
    description: describe(task, category),
    timing: timingFor(task, state, now),
  };
  const link = reviewLinkFor(task);
  if (link) item.reviewLink = link;
  item.approval = approvalFor(task);
  return item;
}

function progressFor(items) {
  const states = new Set(items.map((i) => i.state));
  let current = 1;
  if (items.length && items.every((i) => i.state === "complete")) current = 3;
  else if (states.has("review")) current = 2;
  else if (states.has("working")) current = 1;
  else current = 0;
  const milestones = ["Planning", "Content", "Review", "Launch"].map((name, i) => ({
    name,
    state: i < current ? "done" : i === current ? "current" : "upcoming",
  }));
  const headline = ["Getting set up", "Content is underway", "In review with you", "Launching"][current];
  return {
    label: "Making good progress",
    headline,
    note: "We keep this in step with your campaign as work moves forward.",
    milestones,
  };
}

export function transform(lists, client, now = new Date()) {
  const projects = [];
  const workItems = [];

  (lists || []).forEach((list) => {
    const tasks = list.tasks || [];
    if (!tasks.length) return;
    const projectId = String(list.id);
    const projectName = (tasks[0].list && tasks[0].list.name) || "Project";
    const items = tasks.map((t) => mapTask(t, projectId, now));
    workItems.push(...items);
    projects.push({ id: projectId, name: projectName, progress: progressFor(items) });
  });

  return {
    client: (client && client.name) || "Your organization",
    monthLabel: now.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    projects,
    workItems,
  };
}
