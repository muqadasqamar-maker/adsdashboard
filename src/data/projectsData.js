/* ============================================================
   ActivatUs — Projects
   MOCK PROJECT DATA

   A client-facing window into the work ActivatUs is doing. The
   shape mirrors what a project-management source (e.g. an internal
   tool) could provide, but NOTHING here is internal jargon: no tool
   names, no task IDs, no internal statuses, assignees, or priorities.

   Every work item carries a `state` that the UI turns into plain
   client language via src/lib/projectLang.js:
     working   -> "We're working on this"      (ActivatUs owns the next step)
     review    -> "Ready for your review"       (we need your feedback/approval)
     waiting   -> "We need something from you"  (your input is blocking progress)
     upcoming  -> "Coming up"                   (planned, not started yet)
     complete  -> "Complete"                    (finished)

   `category` groups work into friendly sections (see projectLang.js):
     content_social | email | website

   TO CONNECT A REAL SOURCE LATER: map the source records onto this
   shape (title, plain description, one of the five states, a friendly
   timing label). The UI and wording need no changes.
   ============================================================ */

export const projectsData = {
  client: "Bookshare",
  monthLabel: "August 2026",

  // Higher-level projects, used for the progress view.
  projects: [
    {
      id: "b2s-2026",
      name: "Back-to-School 2026",
      progress: {
        label: "Making good progress",
        headline: "Content is underway",
        note:
          "Most of the preparation is complete and we're now producing the campaign materials.",
        // The current step is marked "current"; earlier ones "done".
        milestones: [
          { name: "Planning", state: "done" },
          { name: "Content", state: "current" },
          { name: "Review", state: "upcoming" },
          { name: "Launch", state: "upcoming" },
        ],
      },
    },
  ],

  // The individual pieces of work. `needsYou` is derived from state in
  // the UI, but kept explicit here for clarity of intent.
  workItems: [
    // --- Ready for your review ----------------------------------
    {
      id: "b2s-org-access",
      projectId: "b2s-2026",
      title: "New Organizational Access",
      category: "website",
      state: "review",
      description:
        "We've finished this piece and would like your approval before we move forward.",
      timing: { kind: "requested", label: "today" },
      detail: {
        doing:
          "We prepared the new organizational access flow for the Back-to-School campaign.",
        stands:
          "It's finished on our side and ready for you to look over.",
        next:
          "Once you approve, we'll fold it into the launch sequence.",
        files: ["Organizational access walkthrough", "Preview link"],
        notes: [
          "No changes needed unless something looks off to you. A quick yes keeps us on schedule.",
        ],
      },
    },

    // --- We're working on this (the spotlight series) -----------
    {
      id: "b2s-natural-voice",
      projectId: "b2s-2026",
      title: "Natural Voice",
      category: "content_social",
      state: "working",
      description: "Part 2 of the Back-to-School spotlight series.",
      timing: { kind: "expected", label: "Today" },
    },
    {
      id: "b2s-sso",
      projectId: "b2s-2026",
      title: "SSO — Google and Clever",
      category: "content_social",
      state: "working",
      description: "Part 3 of the Back-to-School spotlight series.",
      timing: { kind: "expected", label: "Today" },
    },
    {
      id: "b2s-braille-mathml",
      projectId: "b2s-2026",
      title: "Braille and MathML",
      category: "content_social",
      state: "working",
      description: "Part 4 of the Back-to-School spotlight series.",
      timing: { kind: "expected", label: "Today" },
    },

    // --- Coming up ----------------------------------------------
    {
      id: "b2s-kickoff-email",
      projectId: "b2s-2026",
      title: "Kick-off email to existing members",
      category: "email",
      state: "upcoming",
      description: "We're preparing the campaign email for existing members.",
      timing: { kind: "expected", label: "Wednesday" },
    },
    {
      id: "b2s-landing-page",
      projectId: "b2s-2026",
      title: "Landing page",
      category: "website",
      state: "upcoming",
      description: "We're building the main Back-to-School landing page.",
      timing: { kind: "expected", label: "Monday" },
    },
    {
      id: "b2s-whats-new",
      projectId: "b2s-2026",
      title: "What's New feature page",
      category: "website",
      state: "upcoming",
      description: "We're preparing the supporting What's New page.",
      timing: { kind: "expected", label: "Thursday" },
    },

    // --- Recently completed -------------------------------------
    {
      id: "b2s-planning",
      projectId: "b2s-2026",
      title: "Campaign planning",
      category: "content_social",
      state: "complete",
      description: "We mapped out the full Back-to-School campaign with you.",
      timing: { kind: "completed", label: "Aug 4" },
    },
    {
      id: "b2s-audience",
      projectId: "b2s-2026",
      title: "Audience review",
      category: "email",
      state: "complete",
      description: "We reviewed who the campaign should reach.",
      timing: { kind: "completed", label: "Aug 2" },
    },
  ],
};

export default projectsData;
