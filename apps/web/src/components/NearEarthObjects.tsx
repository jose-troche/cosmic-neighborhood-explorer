import type { NearEarthObject } from "@cosmic/shared";

export function NearEarthObjects({ objects }: { objects: NearEarthObject[] }) {
  const sorted = [...objects].sort((a, b) => a.distanceAu - b.distanceAu);

  return (
    <div className="object-list">
      {sorted.map((object) => (
        <article className={object.potentiallyHazardous ? "object-row hazardous" : "object-row"} key={object.id}>
          <header>
            <h3>{object.name}</h3>
            <span>{object.closeApproachDate}</span>
          </header>
          <div className="details-grid compact">
            <Metric label="Distance" value={`${object.distanceAu.toFixed(6)} AU`} />
            <Metric label="Velocity" value={`${object.relativeVelocityKmS.toFixed(2)} km/s`} />
            <Metric label="Diameter" value={object.diameterKm ? `${object.diameterKm.toFixed(3)} km` : "Unknown"} />
            <Metric label="Risk" value={object.potentiallyHazardous ? "Potentially hazardous" : "Watch list"} />
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
