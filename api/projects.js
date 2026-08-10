import { requireClient } from "./_supabase.js";
import { transform } from "./_transform.js";

/* ============================================================
   GET /api/projects  (authenticated)

   Resolves the signed-in account -> client, fetches that client's
   configured ClickUp list(s) with the one ActivatUs workspace token,
   and returns the transformed client view. Data is always scoped to
   the caller's client; the client id is never taken from the request.
   ============================================================ */

export default async function handler(req, res) {
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

  const listIds = client.clickup_list_ids || [];
  if (!listIds.length) {
    res.status(200).json(transform([], client));
    return;
  }

  try {
    const lists = await Promise.all(
      listIds.map(async (id) => {
        const url =
          `https://api.clickup.com/api/v2/list/${id}/task` +
          `?include_closed=true&subtasks=false`;
        const r = await fetch(url, { headers: { Authorization: token } });
        if (!r.ok) return { id, tasks: [] };
        const data = await r.json();
        return { id, tasks: data.tasks || [] };
      })
    );

    const payload = transform(lists, client);
    res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=300");
    res.status(200).json(payload);
  } catch (e) {
    res.status(500).json({ error: "Couldn't load your projects right now.", detail: String(e) });
  }
}
