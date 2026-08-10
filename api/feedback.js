import { requireClient } from "./_supabase.js";

/* ============================================================
   POST /api/feedback  (authenticated)

   Client feedback written back onto the SAME ClickUp task:
     { taskId, action: "note", text }
     { taskId, action: "approval", decision: "approved" | "changes" }
     { taskId, action: "file", filename, contentType, dataBase64 }

   Custom fields are resolved BY NAME on the task (their ids and types
   differ per client folder). Every write first verifies the task is
   in one of the caller client's lists.
   ============================================================ */

const CU = "https://api.clickup.com/api/v2";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { client, error } = await requireClient(req);
  if (error) {
    res.status(error.status).json({ error: error.message });
    return;
  }

  const token = process.env.CLICKUP_TOKEN;
  if (!token) {
    res.status(500).json({ error: "CLICKUP_TOKEN is not set on the server." });
    return;
  }
  const auth = { Authorization: token };

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body || {};
  const { taskId, action } = body;
  if (!taskId || !action) {
    res.status(400).json({ error: "Missing taskId or action." });
    return;
  }

  // ---- fetch the task + authorize (must be in the client's lists) ----
  let task;
  try {
    const r = await fetch(`${CU}/task/${taskId}`, { headers: auth });
    if (!r.ok) {
      res.status(404).json({ error: "We couldn't find that item." });
      return;
    }
    task = await r.json();
  } catch {
    res.status(502).json({ error: "Couldn't reach ClickUp." });
    return;
  }
  const listId = task.list && task.list.id;
  if (!listId || !(client.clickup_list_ids || []).includes(String(listId))) {
    res.status(403).json({ error: "This item isn't part of your account." });
    return;
  }

  try {
    if (action === "note") {
      const text = (body.text || "").trim();
      if (!text) {
        res.status(400).json({ error: "Please write a note first." });
        return;
      }
      const f = fieldByName(task, "Client Notes");
      if (!f) {
        res.status(400).json({ error: "This item can't take notes yet." });
        return;
      }
      const existing = typeof f.value === "string" ? f.value : "";
      const value = existing ? `${existing}\n\n${text}` : text;
      await setField(taskId, f.id, value, auth);
      res.status(200).json({ ok: true });
      return;
    }

    if (action === "approval") {
      const f = fieldByName(task, "Client Approval");
      if (!f) {
        res.status(400).json({ error: "This item can't be approved here yet." });
        return;
      }
      const opts = (f.type_config && f.type_config.options) || [];
      const want = body.decision === "changes" ? "modif" : "approved";
      const opt = opts.find((o) => optName(o).trim().toLowerCase().includes(want));
      if (!opt) {
        res.status(400).json({ error: "Couldn't find that approval option in ClickUp." });
        return;
      }
      // Labels fields take an array of option ids; dropdowns take one id.
      const value = f.type === "labels" ? [opt.id] : opt.id;
      await setField(taskId, f.id, value, auth);
      res.status(200).json({ ok: true });
      return;
    }

    if (action === "file") {
      const { filename, contentType, dataBase64 } = body;
      if (!filename || !dataBase64) {
        res.status(400).json({ error: "No file received." });
        return;
      }
      const buf = Buffer.from(dataBase64, "base64");
      const form = new FormData();
      form.append(
        "attachment",
        new Blob([buf], { type: contentType || "application/octet-stream" }),
        filename
      );
      const r = await fetch(`${CU}/task/${taskId}/attachment`, {
        method: "POST",
        headers: auth,
        body: form,
      });
      if (!r.ok) {
        const t = await r.text();
        res.status(502).json({ error: "ClickUp rejected the file.", detail: t.slice(0, 300) });
        return;
      }
      res.status(200).json({ ok: true });
      return;
    }

    res.status(400).json({ error: "Unknown action." });
  } catch (e) {
    res.status(500).json({ error: "Something went wrong saving your feedback.", detail: String(e) });
  }
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

async function setField(taskId, fieldId, value, auth) {
  const r = await fetch(`${CU}/task/${taskId}/field/${fieldId}`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`ClickUp field update failed: ${t.slice(0, 200)}`);
  }
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
