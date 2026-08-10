import { requireClient } from "./_supabase.js";

/* ============================================================
   POST /api/feedback  (authenticated)

   Client feedback that writes back onto the SAME ClickUp task:
     { taskId, action: "note", text }
     { taskId, action: "approval", decision: "approved" | "changes" }
     { taskId, action: "file", filename, contentType, dataBase64 }

   Every write first verifies the task belongs to the caller's client
   (its list is one of the client's configured lists), so no one can
   write to another org's task.
   ============================================================ */

const FIELD = {
  clientNotes: "b87317bf-4256-4dc8-858f-f549df38cf35",
  clientApproval: "3c5b6a6a-0c4c-428e-8220-74f558516258",
};
const APPROVAL_OPTION = {
  approved: "8846cf7e-ee5e-49b4-8447-dd31570dcb6a",
  changes: "96a1bb1c-f8fd-4d40-85cf-6393dad6346e",
};

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

  // ---- authorize: the task must live in one of the client's lists ----
  let task;
  try {
    const r = await fetch(`${CU}/task/${taskId}?include_subtasks=false`, {
      headers: auth,
    });
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
      // Append to any existing notes so history is preserved.
      const existing = readTextField(task, FIELD.clientNotes);
      const value = existing ? `${existing}\n\n${text}` : text;
      await setField(taskId, FIELD.clientNotes, value, auth);
      res.status(200).json({ ok: true });
      return;
    }

    if (action === "approval") {
      const opt = APPROVAL_OPTION[body.decision];
      if (!opt) {
        res.status(400).json({ error: "Unknown approval decision." });
        return;
      }
      await setField(taskId, FIELD.clientApproval, opt, auth);
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
        headers: auth, // don't set Content-Type; FormData sets the boundary
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

function readTextField(task, fieldId) {
  const f = (task.custom_fields || []).find((x) => x.id === fieldId);
  return f && typeof f.value === "string" ? f.value : "";
}

async function setField(taskId, fieldId, value, auth) {
  const r = await fetch(`${CU}/task/${taskId}/field/${fieldId}`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`field ${fieldId} update failed: ${t.slice(0, 200)}`);
  }
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
