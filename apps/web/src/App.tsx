import { useEffect, useMemo, useState } from "react";
import { BarChart3, Gauge, Info, Orbit, Rocket, Stars } from "lucide-react";
import {
  SPEED_PRESETS,
  formatDurationYears,
  travelYears,
  type Catalog,
  type Star,
  type TravelTarget
} from "@cosmic/shared";
import { deriveLocalFacts } from "./facts";
import { loadCatalog } from "./api";
import { StellarMap } from "./components/StellarMap";
import { HabitabilityChart } from "./components/HabitabilityChart";
import { TravelExplorer } from "./components/TravelExplorer";

type ActiveView = "map" | "facts" | "habitability" | "travel";

const tabs: Array<{ id: ActiveView; label: string; icon: typeof Orbit }> = [
  { id: "map", label: "Map", icon: Orbit },
  { id: "facts", label: "Facts", icon: Info },
  { id: "habitability", label: "Habitability", icon: BarChart3 },
  { id: "travel", label: "Travel", icon: Rocket }
];

export function App() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [activeView, setActiveView] = useState<ActiveView>("map");
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  const [speedId, setSpeedId] = useState(SPEED_PRESETS[3]?.id ?? "voyager-1");
  const [targetId, setTargetId] = useState("proxima-centauri");

  useEffect(() => {
    loadCatalog()
      .then((nextCatalog) => {
        setCatalog(nextCatalog);
        setSelectedStar(nextCatalog.stars.find((star) => star.id === "sirius-a") ?? nextCatalog.stars[0] ?? null);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const facts = useMemo(() => (catalog ? deriveLocalFacts(catalog) : []), [catalog]);
  const selectedSpeed = SPEED_PRESETS.find((speed) => speed.id === speedId) ?? SPEED_PRESETS[0]!;
  const selectedTarget =
    catalog?.travelTargets.find((target) => target.id === targetId) ?? catalog?.travelTargets[0] ?? null;
  const travelDuration =
    selectedTarget && selectedSpeed ? formatDurationYears(travelYears(selectedTarget.distanceLy, selectedSpeed.kmS)) : "";

  return (
    <main className="app-shell">
      <section className="scene-region" aria-label="Interactive stellar neighborhood">
        {catalog && (
          <StellarMap stars={catalog.stars} selectedStarId={selectedStar?.id} onSelectStar={setSelectedStar} />
        )}
        {status === "loading" && <div className="status-overlay">Loading stellar neighborhood...</div>}
        {status === "error" && <div className="status-overlay">Catalog unavailable.</div>}
      </section>

      <aside className="control-panel" aria-label="Cosmic explorer controls">
        <header className="panel-header">
          <div>
            <p className="eyebrow">Cloudflare Free Tier MVP</p>
            <h1>Cosmic Neighborhood Explorer</h1>
          </div>
          <Stars aria-hidden="true" />
        </header>

        <nav className="tabs" aria-label="Explorer views">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                className={activeView === tab.id ? "tab active" : "tab"}
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                type="button"
                aria-pressed={activeView === tab.id}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {activeView === "map" && (
          <section className="panel-section">
            <h2>Selected Star</h2>
            {selectedStar ? <StarDetails star={selectedStar} /> : <p className="muted">Select a star in the map.</p>}
          </section>
        )}

        {activeView === "facts" && (
          <section className="panel-section facts-list">
            <h2>Cosmic Facts</h2>
            {facts.map((fact) => (
              <article className="fact-card" key={fact.id}>
                <strong>{fact.metric}</strong>
                <h3>{fact.title}</h3>
                <p>{fact.body}</p>
              </article>
            ))}
          </section>
        )}

        {activeView === "habitability" && catalog && (
          <section className="panel-section">
            <h2>Habitability Bubble Chart</h2>
            <HabitabilityChart planets={catalog.exoplanets} />
          </section>
        )}

        {activeView === "travel" && catalog && selectedTarget && (
          <section className="panel-section">
            <h2>What If We Left Today?</h2>
            <TravelExplorer
              duration={travelDuration}
              speedId={speedId}
              targetId={selectedTarget.id}
              targets={catalog.travelTargets}
              onSpeedChange={setSpeedId}
              onTargetChange={setTargetId}
            />
          </section>
        )}

        <footer className="panel-footer">
          {catalog ? `${catalog.stars.length} stars, ${catalog.exoplanets.length} exoplanets, ${catalog.nearEarthObjects.length} NEOs` : "Loading catalog"}
        </footer>
      </aside>
    </main>
  );
}

function StarDetails({ star }: { star: Star }) {
  return (
    <div className="details-grid">
      <Metric label="Distance" value={`${star.distanceLy.toFixed(2)} ly`} />
      <Metric label="Temperature" value={`${Math.round(star.temperatureK).toLocaleString("en-US")} K`} />
      <Metric label="Luminosity" value={`${star.luminositySolar.toFixed(4)} Lsun`} />
      <Metric label="Motion" value={`${star.properMotionArcsecYr.toFixed(2)} arcsec/yr`} />
      <Metric label="Spectral type" value={star.spectralType} />
      <Metric label="Magnitude" value={star.apparentMagnitude.toFixed(2)} />
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
