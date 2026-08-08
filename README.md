# ActivatUs — Google Ad Grant dashboard

A client-facing dashboard for the nonprofits whose Google Ad Grant accounts
ActivatUs manages. It is built for a non-technical reader (think a 50–70 year
old executive director) who should understand, within about ten seconds,
whether their grant is healthy and being looked after.

Frontend only. No backend, no auth, no database. All numbers come from a mock
object shaped like the real monitoring API, so it can be wired to the live API
later without redesigning any components.

---

## Run it now (no install required)

There is no build step for the preview. It runs the real React source through
a tiny in-browser loader, so all you need is any static file server.

**Option A — the included PowerShell server (Windows, nothing to install):**

```bash
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

Then open the printed address (default `http://localhost:5178/`).
Use `-Port 5200` to change the port.

**Option B — any static server you already have**, for example:

```bash
npx serve .
```

> The preview needs a server (not `file://`) because it loads ES modules.
> It also loads React and the Bricolage/Hanken fonts from a CDN, so an
> internet connection is required the first time.

---

## Move to a production build (Vite)

The source in `src/` is standard React + JSX. When you are ready for a real
build (which removes the in-browser transpile and CDN dependency):

```bash
npm install
# use the Vite entry file instead of the no-build one:
#   Windows:  move index.html index.nobuild.html ; move index.vite.html index.html
#   macOS/Linux:  mv index.html index.nobuild.html && mv index.vite.html index.html
npm run dev      # or: npm run build
```

Nothing in `src/` changes between the two modes.

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
index.html            No-build preview entry (in-browser loader)
index.vite.html       Production entry (swap in for Vite)
serve.ps1             Dependency-free static server for the preview
package.json          Vite build path
assets/               Real ActivatUs brand assets (logos, favicon)
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
