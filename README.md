# ActivatUs — Google Ad Grant dashboard

A client-facing dashboard for the nonprofits whose Google Ad Grant accounts
ActivatUs manages. It is built for a non-technical reader (think a 50–70 year
old executive director) who should understand, within about ten seconds,
whether their grant is healthy and being looked after.

Built with **React + Vite**. The Ad Grant view runs on mock data shaped like
the real monitoring API. The Projects view reads **live from ClickUp** through
a thin serverless proxy that keeps the API token server-side (see "Connect
ClickUp" below). No database, no client-side secrets.

---

## Run it locally

```bash
npm install
npm run dev      # local dev server with hot reload
```

Then open the printed `http://localhost:5173` address.

To produce the production build:

```bash
npm run build    # outputs to dist/
npm run preview  # serve the built dist/ locally to check it
```

> React is bundled by the build. The Bricolage / Hanken fonts still load from
> Google Fonts, so an internet connection is needed to see the exact brand type.

---

## Deploy

The repo is preconfigured for a zero-setup deploy on either host:

- **Netlify** — `netlify.toml` sets build command `npm run build` and publish
  dir `dist`. Import the repo and click Deploy.
- **Vercel** — auto-detects Vite (build `vite build`, output `dist`). Import
  the repo and click Deploy. No settings to change.

---

## Connect ClickUp (live Projects data)

The Projects area reads **live** from ClickUp through a small serverless proxy
so the API token stays on the server and never reaches the browser.

- `api/projects.js` — Vercel serverless function. Reads the token from the
  environment, fetches the campaign list, and returns the client view.
- `api/_transform.js` — maps ClickUp tasks (statuses, tags/names, due dates)
  onto the app's shape. No ClickUp terminology reaches the client.
- `src/main.jsx` — renders instantly with the bundled fallback, then swaps in
  the live data from `/api/projects` when it arrives.

**Setup (one time):**

1. Create a ClickUp API token: ClickUp → your avatar → **Settings → Apps →
   API Token** (a personal token, `pk_…`).
2. In Vercel → your project → **Settings → Environment Variables**, add:
   - `CLICKUP_TOKEN` = your token (required)
   - `CLICKUP_LIST_ID` = a list id (optional; defaults to the Back-to-School
     2026 list `901820231824`)
3. Redeploy. The Projects page now shows live ClickUp data.

The token lives only in Vercel's environment. It is never committed, never
sent to the browser, and can be rotated in the dashboard at any time. If it
isn't set (or you're running locally without `vercel dev`), the app quietly
falls back to the bundled sample so nothing breaks.

**Run the function locally:** `vercel dev` (serves both the Vite app and the
`/api` function). Plain `npm run dev` runs the UI only, on the fallback data.

### Ad Grant data

The Ad Grant view still uses the mock in `src/data/mockData.js`. To wire its
own API later, fetch it in `src/main.jsx` and pass it as `adGrant` to `<App>`;
the shape is documented in that file. All human-facing wording is produced in
`src/lib/translate.js`, so raw Google Ads terminology never leaks into the UI.

---

## How the code is organised

```
index.html            Vite entry
netlify.toml          Netlify build config
vite.config.js        Vite + React plugin
package.json
public/assets/        Real ActivatUs brand assets (logos, favicon)
src/
  main.jsx            Entry: renders <App data={…} />
  App.jsx             Composes the report sections
  data/
    mockData.js       The mock API response (single source of data)
  lib/
    translate.js      Check key -> plain-English copy (the translation layer)
    status.js         The three-state status system + overall roll-up
    format.js         Number and date formatting helpers
  components/
    DashboardHeader.jsx
    HealthHero.jsx           "Is everything okay?"
    MetricSummary.jsx        "What did my grant accomplish?"
    MetricItem.jsx
    WeeklyVisibilityChart.jsx
    HealthChecks.jsx         "Is ActivatUs taking care of it?"
    HealthCheckRow.jsx
    AttentionSection.jsx     "Anything I need to worry about?"
    ManagementActivity.jsx
    MonthComparison.jsx
    TechnicalDetails.jsx     "If I want the details…"
    StatusBadge.jsx
    Icons.jsx
  styles/
    tokens.css        ActivatUs design tokens (verbatim, single source of truth)
    app.css           Dashboard styles, all referencing tokens
```

### Design principles baked in

- Reassurance before numbers. The hero answers "is everything okay?" first.
- Plain language everywhere; Google Ads jargon lives only in tooltips and the
  collapsed technical section.
- Status is never colour alone: every state pairs an icon and a word.
- Black text on a light surface; the brand gradient is a rare accent, never a
  background behind text.
- Bricolage Grotesque for display, Hanken Grotesk for body, tight tracking.
- Editorial rows and proud numbers instead of a generic card grid.
- Built for older readers: 17px base body text, strong contrast, large targets,
  nothing important hidden behind hover.

### A note on the sample data

The dashboard reflects the supplied sweep exactly. No metric is invented.
Because the sample is only day 7 of the month, the month-over-month section is
deliberately worded to prevent a non-technical reader from mistaking a
partial month for a decline.
