/* ============================================================
   ClickUp -> app data transformer (per client, multi-list).

   Input: lists = [{ id, tasks: [ClickUp task, ...] }], and the client
   record. Output: the object the Projects UI consumes
   (see src/data/projectsData.js). No ClickUp language leaks through.

   Category comes from the ClickUp "Category" custom field (authoritative),
   falling back to name inference. Review Link is surfaced per item.
   ============================================================ */

const FIELD = {
  category: "a3539949-f5a6-4331-aab1-258979739267",
  reviewLink: "74e61632-87b2-4036-b848-e1acbc0a43c7",
  clientApproval: "3c5b6a6a-0c4c-428e-8220-74f558516258",
};

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

function field(task, id) {
  return (task.custom_fields || []).find((f) => f.id === id);
}
function dropdownName(f) {
  if (!f || f.value === undefined || f.value === null) return null;
  const opts = (f.type_config && f.type_config.options) || [];
  const v = f.value;
  const opt =
    opts.find((o) => o.orderindex === v) ||
    opts.find((o) => o.id === v) ||
    (typeof v === "number" ? opts[v] : null);
  return opt ? opt.name : null;
}

function categoryFor(task) {
  const cat = dropdownName(field(task, FIELD.category));
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
  const f = field(task, FIELD.reviewLink);
  return f && f.value ? String(f.value) : null;
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
    case "email": return "A campaign email for your Back-to-School push.";
    case "website": return "A web page for your Back-to-School campaign.";
    case "blogs": return "A blog post supporting your Back-to-School campaign.";
    default: return "A social asset for your Back-to-School campaign.";
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
