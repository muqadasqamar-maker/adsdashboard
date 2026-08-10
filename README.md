# ActivatUs — Google Ad Grant dashboard

A client-facing dashboard for the nonprofits whose Google Ad Grant accounts
ActivatUs manages. It is built for a non-technical reader (think a 50–70 year
old executive director) who should understand, within about ten seconds,
whether their grant is healthy and being looked after.

Built with **React + Vite**, with **Supabase** auth and **Vercel** serverless
functions. Each client signs in (via an invite), then sees only their own data:
their Projects come **live from ClickUp**, and their Ad Grant is mock data for
now (shaped like the real platform, swappable later). All secrets stay
server-side; the browser only ever holds the Supabase anon key.

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

**Deploy to Vercel.** It auto-detects Vite (build `vite build`, output `dist`)
**and** runs the `/api` serverless functions this app now depends on for auth
and data. Import the repo, add the environment variables (below), and deploy.

> Note: a plain static host (e.g. the older Netlify deploy) serves the UI but
> not the `/api` functions, so sign-in and data won't work there. Use Vercel.

---

## Setup: Supabase auth + invites + ClickUp

The portal is gated: a client's people create accounts via an **invite link**,
then log in and see only their client's data.

**How it fits together**
- `supabase/schema.sql` — three tables: `clients` (registry), `invites`
  (per-client sign-up tokens), `profiles` (account → client).
- `api/signup.js` — invite-gated account creation (server-side, service role).
- `api/session.js` — returns the signed-in client + Ad Grant (mock for now).
- `api/projects.js` + `api/_transform.js` — fetch that client's ClickUp list(s)
  and translate them (status → plain state, `Category` field → section, due date
  → timing). No ClickUp terminology reaches the client.
- `src/AuthGate.jsx` — sign-in / invite sign-up, then loads the portal.

**One-time setup**

1. **Supabase project** → run `supabase/schema.sql` in the SQL editor
   (Dashboard → SQL → New query). Edit the seeded invite token to a long random
   string, or add your own invites/clients.
2. **Supabase → Authentication → Providers → Email:** enabled. **Turn OFF**
   "Allow new users to sign up" — accounts are only created server-side through
   an invite (admin API bypasses this toggle).
3. **ClickUp API token:** ClickUp → avatar → Settings → Apps → API Token (`pk_…`).
4. **Vercel → Settings → Environment Variables** (see `.env.example`):
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (browser-safe)
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (server only — secret)
   - `CLICKUP_TOKEN` (server only — one ActivatUs workspace token reads all
     client folders)
   - `ADMIN_TOKEN` (server only — the password that unlocks the admin page)
5. Redeploy.

**Inviting a client (admin page):** go to `https://<your-app>/?admin=1`, enter
the `ADMIN_TOKEN` password, pick a client, and click **Create invite** to get a
copyable `…/?invite=<token>` link. Revoke a link there anytime. (You can also
insert an `invites` row in Supabase by hand, but the admin page is the easy
way.) Recipients sign up once (one account per email), then log in normally.

**Adding a client:** add a row to `clients` with their `clickup_list_ids` (the
lists that feed their Projects view) and `clickup_customer` value.

**Local dev:** `vercel dev` (runs the Vite app + `/api` functions with your
`.env.local`). Plain `npm run dev` runs the UI only — the API calls fail and the
sign-in screen shows, which is expected without the functions.

### Ad Grant data (still mock)

`api/_adgrant_mock.js` returns the Ad Grant sweep per client. When
platform.activatus.com exposes its API, replace `buildAdGrant()` there with a
fetch using the client's `ad_grant_account_id`, mapped onto the same shape. All
Google Ads wording is produced in `src/lib/translate.js`, so terminology never
leaks into the UI.

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
