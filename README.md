# ActivatUs — Google Ad Grant dashboard

A client-facing dashboard for the nonprofits whose Google Ad Grant accounts
ActivatUs manages. It is built for a non-technical reader (think a 50–70 year
old executive director) who should understand, within about ten seconds,
whether their grant is healthy and being looked after.

Frontend only. No backend, no auth, no database. All numbers come from a mock
object shaped like the real monitoring API, so it can be wired to the live API
later without redesigning any components.

Built with **React + Vite**.

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

## Connect the real API

1. Open `src/data/mockData.js`. It documents the exact shape the UI expects.
2. In `src/main.jsx`, replace the imported `mockData` with your fetched
   response:

   ```js
   const res = await fetch("/api/ad-grant/sweep?account=…");
   const data = await res.json();
   root.render(<App data={data} />);
   ```

As long as the response matches the shape in `mockData.js`, no component needs
to change. All human-facing wording is produced in `src/lib/translate.js`, so
raw Google Ads terminology never leaks into the primary interface.

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
