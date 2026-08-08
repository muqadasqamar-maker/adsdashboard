/* ============================================================
   Formatting helpers — presentation only, no data.
   Kept tiny and dependency-free.
   ============================================================ */

// 10320 -> "10,320"
export function group(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return Math.round(n).toLocaleString("en-US");
}

// 66.46 -> "66"  (the honest client-facing whole number)
export function whole(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return Math.round(n).toLocaleString("en-US");
}

// 10.47 -> "10.47%"
export function percent(n, digits = 2) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return `${n.toFixed(digits)}%`;
}

// A CTR of 10.47% -> "10 in every 100"
export function inEveryHundred(ctr) {
  if (ctr === null || ctr === undefined || Number.isNaN(ctr)) return "—";
  return `${Math.round(ctr)} in every 100`;
}

// "2026-08-08" -> "Friday, 8 August 2026"
export function longDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Is the given ISO date the same calendar day as `today`?
// Defaults to the real "now" so "Last checked" reads naturally,
// but accepts an override for deterministic rendering/testing.
export function isToday(iso, today = new Date()) {
  if (!iso) return false;
  const d = new Date(iso + "T00:00:00");
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

// A friendly "Last checked" phrase from the sweep date.
export function lastCheckedPhrase(iso, today = new Date()) {
  if (isToday(iso, today)) return "Today";
  return longDate(iso);
}

// 9 -> "9 days ago" (1 -> "yesterday", 0 -> "today")
export function daysAgoPhrase(days) {
  if (days === null || days === undefined) return "—";
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}
