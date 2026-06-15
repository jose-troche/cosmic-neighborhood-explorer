import { Suspense, lazy, useEffect, useState } from "react";
import { AlertTriangle, BarChart3, Binoculars, Globe2, Info, Orbit, Rocket, ScatterChart, Stars, Timer } from "lucide-react";
import {
  SPEED_PRESETS,
  formatDurationYears,
  travelYears,
  type Catalog,
  type DeepSkyObject,
  type Exoplanet,
  type FactsPayload,
  type InsightsPayload,
  type NearEarthObject,
  type SourceStatus,
  type Star
} from "@cosmic/shared";
import { loadCatalog, loadFacts, loadInsights } from "./api";
import { StellarMap, type MapSelection, type MapVisibleLayers, type StarColorMode } from "./components/StellarMap";
import { TravelExplorer } from "./components/TravelExplorer";

const HabitabilityChart = lazy(() =>
  import("./components/HabitabilityChart").then((module) => ({ default: module.HabitabilityChart }))
);
const NearbyWorldsRace = lazy(() =>
  import("./components/NearbyWorldsRace").then((module) => ({ default: module.NearbyWorldsRace }))
);
const NearEarthObjects = lazy(() =>
  import("./components/NearEarthObjects").then((module) => ({ default: module.NearEarthObjects }))
);
const DeepSkyObjects = lazy(() =>
  import("./components/DeepSkyObjects").then((module) => ({ default: module.DeepSkyObjects }))
);
const DiscoveryTimeline = lazy(() =>
  import("./components/DiscoveryTimeline").then((module) => ({ default: module.DiscoveryTimeline }))
);
const DensityHeatmap = lazy(() =>
  import("./components/DensityHeatmap").then((module) => ({ default: module.DensityHeatmap }))
);

type ActiveView = "map" | "facts" | "habitability" | "travel" | "worlds" | "hazards" | "objects" | "timeline" | "density";

const tabs: Array<{ id: ActiveView; label: string; icon: typeof Orbit }> = [
  { id: "map", label: "Map", icon: Orbit },
  { id: "facts", label: "Facts", icon: Info },
  { id: "habitability", label: "Habitability", icon: BarChart3 },
  { id: "travel", label: "Travel", icon: Rocket },
  { id: "worlds", label: "Worlds", icon: Globe2 },
  { id: "hazards", label: "NEOs", icon: AlertTriangle },
  { id: "objects", label: "Deep Sky", icon: Binoculars },
  { id: "timeline", label: "Timeline", icon: Timer },
  { id: "density", label: "Density", icon: ScatterChart }
];

export function App() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [factsPayload, setFactsPayload] = useState<FactsPayload | null>(null);
  const [insights, setInsights] = useState<InsightsPayload | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [activeView, setActiveView] = useState<ActiveView>("map");
  const [visibleLayers, setVisibleLayers] = useState<MapVisibleLayers>({
    stars: true,
    exoplanets: true,
    nearEarthObjects: true,
    deepSkyObjects: true
  });
  const [starColorMode, setStarColorMode] = useState<StarColorMode>("luminosity");
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  const [selectedObject, setSelectedObject] = useState<MapSelection | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [speedId, setSpeedId] = useState(SPEED_PRESETS[3]?.id ?? "voyager-1");
  const [targetId, setTargetId] = useState("proxima-centauri");

  useEffect(() => {
    Promise.all([loadCatalog(), loadFacts(), loadInsights()])
      .then(([nextCatalog, nextFacts, nextInsights]) => {
        setCatalog(nextCatalog);
        setFactsPayload(nextFacts);
        setInsights(nextInsights);
        const initialStar = nextCatalog.stars.find((star) => star.id === "sirius-a") ?? nextCatalog.stars[0] ?? null;
        setSelectedStar(initialStar);
        setSelectedObject(initialStar ? { type: "star", item: initialStar } : null);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const facts = factsPayload?.facts.filter((fact) => fact.id !== insights?.starOfTheDay.id) ?? [];
  const selectedSpeed = SPEED_PRESETS.find((speed) => speed.id === speedId) ?? SPEED_PRESETS[0]!;
  const selectedTarget =
    catalog?.travelTargets.find((target) => target.id === targetId) ?? catalog?.travelTargets[0] ?? null;
  const travelDuration =
    selectedTarget && selectedSpeed ? formatDurationYears(travelYears(selectedTarget.distanceLy, selectedSpeed.kmS)) : "";

  return (
    <main className="app-shell">
      <section className="scene-region" aria-label="Interactive stellar neighborhood">
        {catalog && (
          <StellarMap
            deepSkyObjects={catalog.deepSkyObjects}
            exoplanets={catalog.exoplanets}
            nearEarthObjects={catalog.nearEarthObjects}
            stars={catalog.stars}
            starColorMode={starColorMode}
            visibleLayers={visibleLayers}
            selectedStarId={selectedStar?.id}
            onSelectObject={setSelectedObject}
            onSelectStar={setSelectedStar}
          />
        )}
        {status === "loading" && <div className="status-overlay">Loading stellar neighborhood...</div>}
        {status === "error" && <div className="status-overlay">Catalog unavailable.</div>}
      </section>

      <aside className="control-panel" aria-label="Cosmic explorer controls">
        <header className="panel-header">
          <div>
            <h1>Cosmic Neighborhood Explorer</h1>
          </div>
          <div className="header-actions">
            <button
              className="help-toggle"
              type="button"
              onClick={() => setHelpOpen(true)}
              aria-expanded={helpOpen}
              aria-controls="help-panel"
            >
              <Info size={16} />
              <span>Help</span>
            </button>
            <Stars aria-hidden="true" />
          </div>
        </header>

        {helpOpen && (
          <div className="help-overlay" role="dialog" aria-modal="true" aria-labelledby="help-panel-title">
            <section id="help-panel" className="help-panel" aria-label="Quick use">
              <div className="help-panel-header">
                <h2 id="help-panel-title">Quick use</h2>
                <button className="help-close" type="button" onClick={() => setHelpOpen(false)} aria-label="Close help">
                  ×
                </button>
              </div>
              <ul>
                <li>Drag the star field to orbit, then scroll or pinch to zoom.</li>
                <li>Select a star, planet marker, asteroid, or deep-sky object for details.</li>
                <li>Use Star Color to compare luminosity, distance, temperature, or motion.</li>
                <li>Switch tabs for facts, habitability, travel times, worlds, and hazards.</li>
              </ul>
            </section>
          </div>
        )}

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
            {selectedObject && <SelectedObjectDetails selection={selectedObject} />}
            {catalog && selectedStar && (
              <MapLayerSummary
                catalog={catalog}
                selectedStar={selectedStar}
                starColorMode={starColorMode}
                visibleLayers={visibleLayers}
                onStarColorModeChange={setStarColorMode}
                onLayerToggle={(layer) => setVisibleLayers((current) => ({ ...current, [layer]: !current[layer] }))}
              />
            )}
          </section>
        )}

        {activeView === "facts" && (
          <section className="panel-section facts-list">
            <h2>Cosmic Facts</h2>
            {insights && (
              <article className="fact-card featured">
                <strong>{insights.starOfTheDay.metric}</strong>
                <h3>{insights.starOfTheDay.title}</h3>
                <p>{insights.starOfTheDay.body}</p>
              </article>
            )}
            {facts.map((fact) => (
              <article className="fact-card" key={fact.id}>
                <strong>{fact.metric}</strong>
                <h3>{fact.title}</h3>
                <p>{fact.body}</p>
              </article>
            ))}
          </section>
        )}

        <Suspense fallback={<PanelFallback />}>
          {activeView === "habitability" && catalog && (
            <section className="panel-section">
              <h2>Habitability Bubble Chart</h2>
              <HabitabilityChart planets={catalog.exoplanets} />
            </section>
          )}
        </Suspense>

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

        <Suspense fallback={<PanelFallback />}>
          {activeView === "worlds" && catalog && (
            <section className="panel-section">
              <h2>Nearby Worlds Race</h2>
              <NearbyWorldsRace worlds={catalog.worldProfiles} />
            </section>
          )}

          {activeView === "hazards" && catalog && (
            <section className="panel-section">
              <h2>Near-Earth Object Watch</h2>
              <NearEarthObjects objects={catalog.nearEarthObjects} />
            </section>
          )}

          {activeView === "objects" && catalog && (
            <section className="panel-section">
              <h2>Deep Sky Objects</h2>
              <DeepSkyObjects objects={catalog.deepSkyObjects} />
            </section>
          )}

          {activeView === "timeline" && insights && (
            <section className="panel-section">
              <h2>Planet Discovery Timeline</h2>
              <DiscoveryTimeline points={insights.discoveryTimeline} />
            </section>
          )}

          {activeView === "density" && insights && (
            <section className="panel-section">
              <h2>Cosmic Neighborhood Density</h2>
              <DensityHeatmap cells={insights.densityCells} />
            </section>
          )}
        </Suspense>

        {catalog && <SourceStatusSummary generatedAt={catalog.generatedAt} statuses={catalog.sourceStatuses} />}

        <footer className="panel-footer">
          {catalog
            ? `${catalog.stars.length} stars, ${catalog.exoplanets.length} exoplanets, ${catalog.nearEarthObjects.length} NEOs, ${catalog.deepSkyObjects.length} deep sky`
            : "Loading catalog"}
        </footer>
      </aside>
    </main>
  );
}

function SourceStatusSummary({ generatedAt, statuses }: { generatedAt: string; statuses: SourceStatus[] }) {
  const live = statuses.filter((status) => status.status === "ok").length;
  const seed = statuses.filter((status) => status.status === "seed").length;
  const failed = statuses.filter((status) => status.status === "error").length;
  const generatedLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(generatedAt));

  return (
    <section className="source-status" aria-label="Data source freshness">
      <header>
        <span>Data refresh</span>
        <strong>{generatedLabel}</strong>
      </header>
      <div className="source-status-summary">
        <span className="source-pill ok">{live} live</span>
        <span className="source-pill seed">{seed} seed</span>
        <span className={failed > 0 ? "source-pill error" : "source-pill"}>{failed} errors</span>
      </div>
      <ul>
        {statuses.map((status) => (
          <li key={status.id}>
            <i className={`source-dot ${status.status}`} />
            <span>{status.name}</span>
            <strong>{status.recordCount?.toLocaleString("en-US") ?? status.status}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PanelFallback() {
  return <div className="panel-loading">Loading view...</div>;
}

function SelectedObjectDetails({ selection }: { selection: MapSelection }) {
  const title = {
    star: "Selected Star",
    exoplanet: "Selected Exoplanet",
    nearEarthObject: "Selected Near-Earth Object",
    deepSkyObject: "Selected Deep Sky Object"
  }[selection.type];

  return (
    <article className="map-context selected-object">
      <h3>{title}</h3>
      {selection.type === "star" && <StarObjectDetails star={selection.item} />}
      {selection.type === "exoplanet" && <ExoplanetObjectDetails planet={selection.item} />}
      {selection.type === "nearEarthObject" && <NeoObjectDetails object={selection.item} />}
      {selection.type === "deepSkyObject" && <DeepSkyObjectDetails object={selection.item} />}
    </article>
  );
}

function StarObjectDetails({ star }: { star: Star }) {
  return (
    <dl className="object-detail-list">
      <div><dt>Name</dt><dd>{star.name}</dd></div>
      <div><dt>Distance</dt><dd>{star.distanceLy.toFixed(2)} ly</dd></div>
      <div><dt>Temperature</dt><dd>{Math.round(star.temperatureK).toLocaleString("en-US")} K</dd></div>
    </dl>
  );
}

function ExoplanetObjectDetails({ planet }: { planet: Exoplanet }) {
  return (
    <dl className="object-detail-list">
      <div><dt>Name</dt><dd>{planet.name}</dd></div>
      <div><dt>Host</dt><dd>{planet.hostStarName}</dd></div>
      <div><dt>Radius</dt><dd>{planet.radiusEarth.toFixed(2)} Rearth</dd></div>
      <div><dt>Temperature</dt><dd>{planet.equilibriumTempK ? `${Math.round(planet.equilibriumTempK)} K` : "Unknown"}</dd></div>
    </dl>
  );
}

function NeoObjectDetails({ object }: { object: NearEarthObject }) {
  return (
    <dl className="object-detail-list">
      <div><dt>Name</dt><dd>{object.name}</dd></div>
      <div><dt>Approach</dt><dd>{object.closeApproachDate}</dd></div>
      <div><dt>Distance</dt><dd>{object.distanceAu.toFixed(6)} AU</dd></div>
      <div><dt>Velocity</dt><dd>{object.relativeVelocityKmS.toFixed(1)} km/s</dd></div>
    </dl>
  );
}

function DeepSkyObjectDetails({ object }: { object: DeepSkyObject }) {
  return (
    <dl className="object-detail-list">
      <div><dt>Name</dt><dd>{object.name}</dd></div>
      <div><dt>Type</dt><dd>{object.type}</dd></div>
      <div><dt>Distance</dt><dd>{object.distanceLy.toLocaleString("en-US")} ly</dd></div>
      <div><dt>Constellation</dt><dd>{object.constellation}</dd></div>
    </dl>
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

function MapLayerSummary({
  catalog,
  selectedStar,
  starColorMode,
  visibleLayers,
  onStarColorModeChange,
  onLayerToggle
}: {
  catalog: Catalog;
  selectedStar: Star;
  starColorMode: StarColorMode;
  visibleLayers: MapVisibleLayers;
  onStarColorModeChange: (mode: StarColorMode) => void;
  onLayerToggle: (layer: keyof MapVisibleLayers) => void;
}) {
  const hostedPlanets = catalog.exoplanets.filter((planet) => planet.hostStarId === selectedStar.id).slice(0, 5);
  const closestNeos = [...catalog.nearEarthObjects].sort((a, b) => a.distanceAu - b.distanceAu).slice(0, 3);
  const layerControls: Array<{ id: keyof MapVisibleLayers; label: string; swatch: string; count: number }> = [
    { id: "stars", label: "Stars", swatch: "legend-star", count: catalog.stars.length },
    { id: "exoplanets", label: "Exoplanets", swatch: "legend-planet", count: catalog.exoplanets.length },
    { id: "nearEarthObjects", label: "NEOs", swatch: "legend-neo", count: catalog.nearEarthObjects.length },
    { id: "deepSkyObjects", label: "Deep sky", swatch: "legend-deep", count: catalog.deepSkyObjects.length }
  ];
  const colorModes: Array<{ id: StarColorMode; label: string; description: string }> = [
    { id: "distance", label: "Distance", description: "Near green, mid blue, far amber" },
    { id: "temperature", label: "Temperature", description: "Cool red, Sun-like cream, hot blue" },
    { id: "luminosity", label: "Luminosity", description: "Dim blue, bright gold" },
    { id: "motion", label: "Motion", description: "Slow slate, fast pink" }
  ];

  return (
    <div className="map-layer-summary">
      <article className="map-context star-color-controls">
        <h3>Star Color</h3>
        <div className={`star-color-ramp ${starColorMode}`} aria-hidden="true" />
        <div className="color-mode-grid" aria-label="Star color meaning">
          {colorModes.map((mode) => (
            <button
              className={starColorMode === mode.id ? "color-mode active" : "color-mode"}
              key={mode.id}
              onClick={() => onStarColorModeChange(mode.id)}
              type="button"
              aria-pressed={starColorMode === mode.id}
              title={mode.description}
            >
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
        <p className="muted">{colorModes.find((mode) => mode.id === starColorMode)?.description}</p>
      </article>

      <div className="layer-legend" aria-label="3D map layers">
        {layerControls.map((layer) => (
          <button
            className={visibleLayers[layer.id] ? "layer-toggle active" : "layer-toggle"}
            key={layer.id}
            onClick={() => onLayerToggle(layer.id)}
            type="button"
            aria-pressed={visibleLayers[layer.id]}
          >
            <i className={layer.swatch} />
            <span>{layer.label}</span>
            <strong>{layer.count}</strong>
          </button>
        ))}
      </div>

      <article className="map-context">
        <h3>Hosted Planets</h3>
        {hostedPlanets.length > 0 ? (
          <ul>
            {hostedPlanets.map((planet) => (
              <li key={planet.id}>
                <strong>{planet.name}</strong>
                <span>{planet.radiusEarth.toFixed(2)} Rearth / {planet.distanceLy.toFixed(1)} ly</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">No confirmed planets in this catalog for the selected star.</p>
        )}
      </article>

      <article className="map-context">
        <h3>Closest NEO Markers</h3>
        <ul>
          {closestNeos.map((object) => (
            <li key={object.id}>
              <strong>{object.name}</strong>
              <span>{object.distanceAu.toFixed(6)} AU / {object.relativeVelocityKmS.toFixed(1)} km/s</span>
            </li>
          ))}
        </ul>
      </article>
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
