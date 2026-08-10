import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { mockData } from "./data/mockData.js";
import { projectsData } from "./data/projectsData.js";

/* ============================================================
   Entry point.

   Ad Grant data is the mock (swap for its own API later, see
   data/mockData.js). Projects data comes LIVE from ClickUp via the
   /api/projects serverless proxy (see api/projects.js), with the
   local mock used as an instant, safe fallback until the proxy
   responds (or if the token isn't configured yet / running locally
   without `vercel dev`).
   ============================================================ */

const root = createRoot(document.getElementById("root"));

function render(projects) {
  root.render(<App adGrant={mockData} projects={projects} />);
}

// 1) Render immediately with the bundled fallback so there's never a blank page.
render(projectsData);

// 2) Pull live ClickUp data and swap it in when it arrives.
fetch("/api/projects")
  .then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
  .then((data) => {
    if (data && Array.isArray(data.workItems) && data.workItems.length) {
      render(data);
    }
  })
  .catch(() => {
    /* No proxy / token yet: keep the fallback. */
  });
