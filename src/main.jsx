import React from "react";
import { createRoot } from "react-dom/client";
import AuthGate from "./AuthGate.jsx";

/* ============================================================
   Entry point.

   AuthGate handles sign-in (Supabase) and then loads the signed-in
   client's data from the serverless API:
     /api/session   -> client identity + Ad Grant (mock platform for now)
     /api/projects  -> live ClickUp work, scoped to the client
   ============================================================ */

createRoot(document.getElementById("root")).render(<AuthGate />);
