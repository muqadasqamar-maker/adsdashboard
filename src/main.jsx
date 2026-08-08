import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { mockData } from "./data/mockData.js";

/* ============================================================
   Entry point.

   TO CONNECT THE REAL API LATER:
   Replace `mockData` with your fetched response, e.g.

     const res = await fetch("/api/ad-grant/sweep?account=…");
     const data = await res.json();
     root.render(<App data={data} />);

   As long as the response matches the shape in data/mockData.js,
   no component needs to change.
   ============================================================ */

const root = createRoot(document.getElementById("root"));
root.render(<App data={mockData} />);
