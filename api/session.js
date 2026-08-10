import { requireClient } from "./_supabase.js";
import { buildAdGrant } from "./_adgrant_mock.js";

/* ============================================================
   GET /api/session

   Who is signed in + their Ad Grant. In the real build this calls
   platform.activatus.com for { client info + Ad Grant } using the
   client's account id; for now the Ad Grant is mock data (buildAdGrant).
   ============================================================ */

export default async function handler(req, res) {
  const { client, error } = await requireClient(req);
  if (error) {
    res.status(error.status).json({ error: error.message });
    return;
  }

  res.status(200).json({
    client: { id: client.id, name: client.name },
    adGrant: buildAdGrant(client),
  });
}
