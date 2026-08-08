import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { mockData } from "./data/mockData.js";
import { projectsData } from "./data/projectsData.js";

/* ============================================================
   Entry point.

   TO CONNECT REAL APIS LATER:
   Replace the two mock objects with your fetched responses, e.g.

     const [adGrant, projects] = await Promise.all([
       fetch("/api/ad-grant/sweep?account=…").then((r) => r.json()),
       fetch("/api/projects?account=…").then((r) => r.json()),
     ]);
     root.render(<App adGrant={adGrant} projects={projects} />);

   As long as the responses match the shapes in data/mockData.js and
   data/projectsData.js, no component needs to change.
   ============================================================ */

const root = createRoot(document.getElementById("root"));
root.render(<App adGrant={mockData} projects={projectsData} />);
