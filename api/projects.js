import { transform } from "./_transform.js";

/* ============================================================
   GET /api/projects  (Vercel serverless function)

   Holds the ClickUp token server-side (never sent to the browser),
   fetches the campaign list, and returns the transformed client
   view. The frontend calls this on load.

   Environment variables (set in Vercel -> Settings -> Env Vars):
     CLICKUP_TOKEN    (required)  your ClickUp API token, e.g. pk_...
     CLICKUP_LIST_ID  (optional)  defaults to the Back-to-School 2026 list
   ============================================================ */

const DEFAULT_LIST_ID = "901820231824"; // Benetech / Back-to-School 2026

export default async function handler(req, res) {
  const token = process.env.CLICKUP_TOKEN;
  const listId = process.env.CLICKUP_LIST_ID || DEFAULT_LIST_ID;

  if (!token) {
    res
      .status(500)
      .json({ error: "CLICKUP_TOKEN is not set on the server." });
    return;
  }

  const url =
    `https://api.clickup.com/api/v2/list/${listId}/task` +
    `?include_closed=true&subtasks=false`;

  try {
    const r = await fetch(url, { headers: { Authorization: token } });
    if (!r.ok) {
      const body = await r.text();
      res
        .status(502)
        .json({ error: "ClickUp request failed", status: r.status, body: body.slice(0, 400) });
      return;
    }
    const data = await r.json();
    const payload = transform(data.tasks || []);

    // Cache at the edge for 5 min; serve stale while revalidating.
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.status(200).json(payload);
  } catch (e) {
    res.status(500).json({ error: "Unexpected error", detail: String(e) });
  }
}
