import React from "react";
import ProjectsHero from "./ProjectsHero.jsx";
import ClientAttention from "./ClientAttention.jsx";
import WorkInProgress from "./WorkInProgress.jsx";
import MonthlyWorkSummary from "./MonthlyWorkSummary.jsx";
import ProjectProgress from "./ProjectProgress.jsx";
import ComingUpNext from "./ComingUpNext.jsx";
import RecentlyCompleted from "./RecentlyCompleted.jsx";

/* ============================================================
   ProjectsDashboard — "What we're doing for you".
   Order answers the client's questions:
     1. Is anything waiting on me?      -> ClientAttention
     2. What are we working on now?     -> WorkInProgress
     3. A quick picture of the month    -> MonthlyWorkSummary
     4. Where do projects stand?        -> ProjectProgress
     5. What's coming next?             -> ComingUpNext
     6. What's recently done?           -> RecentlyCompleted
   ============================================================ */

export default function ProjectsDashboard({ data }) {
  return (
    <>
      <ProjectsHero data={data} />
      <ClientAttention data={data} />
      <WorkInProgress data={data} />
      <MonthlyWorkSummary data={data} />
      <ProjectProgress projects={data.projects} />
      <ComingUpNext data={data} />
      <RecentlyCompleted data={data} />
    </>
  );
}
