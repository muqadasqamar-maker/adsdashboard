import React from "react";
import HealthCheckRow from "./HealthCheckRow.jsx";
import { checksByGroup } from "../lib/translate.js";

/* ============================================================
   HealthChecks — "We're taking care of the details".
   The value story: the things Google asks a grant to keep right,
   and that we monitor so the client doesn't have to. Editorial
   rows with hairline dividers, not a card grid.
   ============================================================ */

export default function HealthChecks({ data }) {
  const rows = checksByGroup(data, "health");

  return (
    <section className="section health" aria-labelledby="health-heading">
      <div className="section__head">
        <h2 className="section__title" id="health-heading">
          We're taking care of the details
        </h2>
        <p className="section__intro">
          Google has rules your Ad Grant needs to follow. We monitor the
          important ones so you don't have to.
        </p>
      </div>

      <div className="health__rows">
        {rows.map((row) => (
          <HealthCheckRow key={row.key} check={row} />
        ))}
      </div>
    </section>
  );
}
