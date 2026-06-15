import type { DeepSkyObject } from "@cosmic/shared";

export function DeepSkyObjects({ objects }: { objects: DeepSkyObject[] }) {
  return (
    <div className="object-list">
      {[...objects]
        .sort((a, b) => a.distanceLy - b.distanceLy)
        .map((object) => (
          <article className="object-row" key={object.id}>
            <header>
              <h3>{object.name}</h3>
              <span>{object.type} in {object.constellation}</span>
            </header>
            <p>{object.summary}</p>
            <div className="details-grid compact">
              <Metric label="Distance" value={`${object.distanceLy.toLocaleString("en-US")} ly`} />
              <Metric label="Magnitude" value={object.apparentMagnitude?.toFixed(2) ?? "Unknown"} />
            </div>
          </article>
        ))}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
