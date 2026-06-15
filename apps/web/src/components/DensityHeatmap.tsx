import type { DensityCell } from "@cosmic/shared";

export function DensityHeatmap({ cells }: { cells: DensityCell[] }) {
  const max = Math.max(...cells.map((cell) => cell.densityScore), 1);

  return (
    <div className="density-grid" role="img" aria-label="Cosmic neighborhood density heat map">
      {cells.map((cell) => {
        const intensity = Math.max(0.16, cell.densityScore / max);
        return (
          <article
            className="density-cell"
            key={cell.id}
            style={{
              background: `rgba(111, 226, 190, ${intensity})`
            }}
          >
            <h3>{cell.id.replaceAll("-", " ")}</h3>
            <strong>{cell.densityScore.toFixed(2)}</strong>
            <span>{cell.starCount} stars / {cell.planetCount} planets</span>
          </article>
        );
      })}
    </div>
  );
}
