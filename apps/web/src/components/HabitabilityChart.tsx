import type { Exoplanet } from "@cosmic/shared";

type Props = {
  planets: Exoplanet[];
};

export function HabitabilityChart({ planets }: Props) {
  const width = 420;
  const height = 300;
  const padding = 34;
  const maxDistance = Math.max(...planets.map((planet) => planet.distanceLy));
  const minTemp = 80;
  const maxTemp = 330;

  return (
    <div className="chart-shell">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Distance by temperature exoplanet bubble chart">
        <line x1={padding} x2={width - padding} y1={height - padding} y2={height - padding} className="axis" />
        <line x1={padding} x2={padding} y1={padding} y2={height - padding} className="axis" />
        <rect
          x={padding}
          y={scaleY(273, minTemp, maxTemp, height, padding)}
          width={width - padding * 2}
          height={scaleY(180, minTemp, maxTemp, height, padding) - scaleY(273, minTemp, maxTemp, height, padding)}
          className="habitable-band"
        />
        {planets.map((planet) => {
          const x = scaleX(planet.distanceLy, maxDistance, width, padding);
          const y = scaleY(planet.equilibriumTempK ?? 180, minTemp, maxTemp, height, padding);
          const radius = Math.max(5, Math.min(28, planet.radiusEarth * 5));

          return (
            <g key={planet.id}>
              <circle className={planet.potentiallyHabitable ? "planet-bubble habitable" : "planet-bubble"} cx={x} cy={y} r={radius} />
              <text x={x} y={y - radius - 6} textAnchor="middle" className="bubble-label">
                {planet.name.replace("Proxima Centauri ", "Proxima ")}
              </text>
            </g>
          );
        })}
        <text x={width / 2} y={height - 4} textAnchor="middle" className="axis-label">
          Distance from Earth
        </text>
        <text x={14} y={height / 2} textAnchor="middle" className="axis-label vertical">
          Equilibrium temperature
        </text>
      </svg>
    </div>
  );
}

function scaleX(value: number, max: number, width: number, padding: number) {
  return padding + (value / max) * (width - padding * 2);
}

function scaleY(value: number, min: number, max: number, height: number, padding: number) {
  return height - padding - ((value - min) / (max - min)) * (height - padding * 2);
}
