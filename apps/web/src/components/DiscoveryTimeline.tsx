import type { DiscoveryTimelinePoint } from "@cosmic/shared";

export function DiscoveryTimeline({ points }: { points: DiscoveryTimelinePoint[] }) {
  const max = Math.max(...points.map((point) => point.discovered), 1);

  return (
    <div className="timeline-chart" role="img" aria-label="Planet discovery timeline">
      {points.map((point) => (
        <div className="timeline-row" key={point.year}>
          <span>{point.year}</span>
          <div className="timeline-track">
            <div className="timeline-total" style={{ width: `${(point.discovered / max) * 100}%` }} />
            <div className="timeline-habitable" style={{ width: `${(point.potentiallyHabitable / max) * 100}%` }} />
          </div>
          <strong>{point.discovered}</strong>
        </div>
      ))}
      <p className="legend"><span /> Potentially habitable candidates</p>
    </div>
  );
}
