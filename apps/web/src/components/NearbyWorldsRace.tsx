import type { WorldProfile } from "@cosmic/shared";

const metrics: Array<{ key: keyof WorldProfile; label: string; suffix: string; max: number }> = [
  { key: "gravityEarth", label: "Gravity", suffix: "g", max: 1.2 },
  { key: "dayLengthHours", label: "Day", suffix: "h", max: 400 },
  { key: "temperatureK", label: "Temp", suffix: "K", max: 320 },
  { key: "atmosphericPressureEarth", label: "Pressure", suffix: "atm", max: 1.5 }
];

export function NearbyWorldsRace({ worlds }: { worlds: WorldProfile[] }) {
  return (
    <div className="race-list">
      {worlds.map((world) => (
        <article className="world-row" key={world.id}>
          <header>
            <div>
              <h3>{world.name}</h3>
              <span>{world.category}</span>
            </div>
            <strong>{world.radiusEarth.toFixed(2)} Rearth</strong>
          </header>
          <p>{world.highlight}</p>
          <div className="race-bars">
            {metrics.map((metric) => {
              const rawValue = Number(world[metric.key]);
              const width = Math.max(2, Math.min(100, (rawValue / metric.max) * 100));
              return (
                <div className="race-metric" key={metric.key}>
                  <span>{metric.label}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${width}%` }} />
                  </div>
                  <strong>
                    {rawValue < 0.01 ? rawValue.toExponential(1) : rawValue.toFixed(rawValue >= 10 ? 0 : 2)} {metric.suffix}
                  </strong>
                </div>
              );
            })}
          </div>
        </article>
      ))}
    </div>
  );
}
