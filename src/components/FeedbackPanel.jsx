import React, { useState } from "react";
import { apiPost } from "../lib/api.js";

/* ============================================================
   FeedbackPanel — the client's write-back controls for one work item.
   Review link, a note, a file, and approve / request-changes. Each
   action posts to /api/feedback, which writes onto the ClickUp task.
   ============================================================ */

const MAX_BYTES = 4 * 1024 * 1024; // ~4MB (serverless body limit)

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const s = String(r.result);
      resolve(s.slice(s.indexOf(",") + 1)); // strip data: prefix
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export default function FeedbackPanel({ item }) {
  const [note, setNote] = useState("");
  const [approval, setApproval] = useState(item.approval || "pending");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  async function run(fn) {
    setBusy(true);
    setMsg(null);
    try {
      await fn();
    } catch (e) {
      setMsg({ type: "err", text: e.message || "Something went wrong." });
    }
    setBusy(false);
  }

  const sendNote = () =>
    run(async () => {
      if (!note.trim()) {
        setMsg({ type: "err", text: "Please write a note first." });
        return;
      }
      await apiPost("/api/feedback", { taskId: item.id, action: "note", text: note });
      setNote("");
      setMsg({ type: "ok", text: "Note sent to your ActivatUs team." });
    });

  const decide = (decision) =>
    run(async () => {
      await apiPost("/api/feedback", { taskId: item.id, action: "approval", decision });
      setApproval(decision === "approved" ? "approved" : "changes");
      setMsg({
        type: "ok",
        text: decision === "approved" ? "Approved. Thank you!" : "Thanks. We'll make those changes.",
      });
    });

  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setMsg({ type: "err", text: "Please choose a file under 4 MB." });
      return;
    }
    run(async () => {
      const dataBase64 = await toBase64(file);
      await apiPost("/api/feedback", {
        taskId: item.id,
        action: "file",
        filename: file.name,
        contentType: file.type,
        dataBase64,
      });
      setMsg({ type: "ok", text: `Attached "${file.name}".` });
    });
  };

  return (
    <div className="fb">
      {approval === "approved" ? (
        <p className="fb__approved">You've approved this. Thank you.</p>
      ) : null}

      <div className="fb__actions">
        {item.reviewLink ? (
          <a
            className="as-btn as-btn-primary"
            href={item.reviewLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Review this
          </a>
        ) : null}
        <button
          type="button"
          className="as-btn as-btn-outline"
          disabled={busy || approval === "approved"}
          onClick={() => decide("approved")}
        >
          Approve
        </button>
        <button
          type="button"
          className="as-btn as-btn-outline"
          disabled={busy}
          onClick={() => decide("changes")}
        >
          Request changes
        </button>
      </div>

      <div className="fb__field">
        <label className="fb__label" htmlFor={`note-${item.id}`}>
          Leave a note for us
        </label>
        <textarea
          id={`note-${item.id}`}
          className="fb__textarea"
          rows={3}
          placeholder="Anything you'd like us to know or change…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="fb__row">
          <button
            type="button"
            className="as-btn as-btn-outline"
            disabled={busy}
            onClick={sendNote}
          >
            Send note
          </button>

          <label className="fb__file">
            <input type="file" onChange={onFile} disabled={busy} hidden />
            <span className="fb__file-btn">Add a file</span>
          </label>
        </div>
      </div>

      {msg ? (
        <p className={`fb__msg fb__msg--${msg.type}`} role="status">
          {msg.text}
        </p>
      ) : null}
    </div>
  );
}
