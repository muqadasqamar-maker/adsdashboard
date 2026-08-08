import React, { useState } from "react";
import { group } from "/src/lib/format.js";

/* ============================================================
   WeeklyVisibilityChart — "How often your ads appeared this week".
   A hand-built SVG so it matches the brand exactly: no dense grid,
   large readable labels, every value printed on the chart (nothing
   important hidden behind hover). Hover / focus just highlights.
   ============================================================ */

const W = 760;
const H = 320;
const PAD = { top: 64, right: 24, bottom: 48, left: 24 };

function niceCeil(max) {
  // Round the top of the scale up to a friendly number.
  const step = max > 2000 ? 500 : max > 1000 ? 250 : 100;
  return Math.ceil((max * 1.12) / step) * step;
}

export default function WeeklyVisibilityChart({ history }) {
  const [active, setActive] = useState(history.length - 1); // default: latest

  const values = history.map((d) => d.impressions);
  const max = niceCeil(Math.max(...values));
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const x = (i) =>
    PAD.left + (history.length === 1 ? plotW / 2 : (plotW * i) / (history.length - 1));
  const y = (v) => PAD.top + plotH - (v / max) * plotH;

  const points = history.map((d, i) => ({ ...d, cx: x(i), cy: y(d.impressions), i }));
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.cx},${p.cy}`).join(" ");
  const areaPath =
    `M${points[0].cx},${PAD.top + plotH} ` +
    points.map((p) => `L${p.cx},${p.cy}`).join(" ") +
    ` L${points[points.length - 1].cx},${PAD.top + plotH} Z`;

  const latest = history[history.length - 1];

  return (
    <section className="section chart-section" aria-labelledby="chart-heading">
      <div className="section__head">
        <h2 className="section__title" id="chart-heading">
          How often your ads appeared this week
        </h2>
        <p className="section__intro">
          Your ads have been showing consistently, with{" "}
          <strong>{group(latest.impressions)}</strong> appearances on the most
          recent day ({latest.label}).
        </p>
      </div>

      <figure className="chart">
        <svg
          className="chart__svg"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`Daily ad appearances from ${history[0].label} to ${latest.label}.`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="au_area" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--accent-teal)"
                stopOpacity="0.22"
              />
              <stop
                offset="100%"
                stopColor="var(--accent-teal)"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {/* single soft baseline, no dense grid */}
          <line
            x1={PAD.left}
            y1={PAD.top + plotH}
            x2={W - PAD.right}
            y2={PAD.top + plotH}
            className="chart__baseline"
          />

          <path d={areaPath} fill="url(#au_area)" />
          <path d={linePath} className="chart__line" fill="none" />

          {points.map((p) => {
            const isActive = p.i === active;
            return (
              <g key={p.date}>
                {/* value label above each point (always visible) */}
                <text
                  x={p.cx}
                  y={p.cy - 16}
                  className={`chart__value ${isActive ? "is-active" : ""}`}
                  textAnchor="middle"
                >
                  {group(p.impressions)}
                </text>

                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={isActive ? 7 : 4.5}
                  className={`chart__dot ${isActive ? "is-active" : ""}`}
                />

                {/* date label */}
                <text
                  x={p.cx}
                  y={H - 18}
                  className="chart__date"
                  textAnchor="middle"
                >
                  {p.label}
                </text>

                {/* generous invisible hit area for hover / focus */}
                <rect
                  x={p.cx - plotW / (history.length * 2)}
                  y={PAD.top}
                  width={plotW / history.length}
                  height={plotH + PAD.bottom - 8}
                  fill="transparent"
                  tabIndex={0}
                  role="button"
                  aria-label={`${p.label}: ${group(p.impressions)} appearances`}
                  onMouseEnter={() => setActive(p.i)}
                  onFocus={() => setActive(p.i)}
                />
              </g>
            );
          })}
        </svg>
      </figure>
    </section>
  );
}
