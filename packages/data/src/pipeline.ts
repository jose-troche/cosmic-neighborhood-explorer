import {
  SPEED_PRESETS,
  catalogSchema,
  factsSchema,
  formatDurationYears,
  insightsSchema,
  travelYears,
  type Catalog,
  type CosmicFact,
  type DensityCell,
  type DiscoveryTimelinePoint,
  type FactsPayload,
  type InsightsPayload
} from "@cosmic/shared";
import { mergeSourceSnapshot } from "./normalize";
import { seedCatalog } from "./seed";

export function buildCatalog(generatedAt = new Date().toISOString(), sourceSnapshot?: unknown): Catalog {
  const seed = { ...seedCatalog(), generatedAt };
  const catalog = sourceSnapshot ? mergeSourceSnapshot(seed, sourceSnapshot) : seed;
  return catalogSchema.parse(catalog);
}

export function deriveFacts(catalog: Catalog, generatedAt = catalog.generatedAt): FactsPayload {
  const starsWithin20 = catalog.stars.filter((star) => star.id !== "sun" && star.distanceLy <= 20);
  const planetsWithin20 = catalog.exoplanets.filter((planet) => planet.distanceLy <= 20);
  const habitablePlanets = catalog.exoplanets
    .filter((planet) => planet.potentiallyHabitable)
    .sort((a, b) => a.distanceLy - b.distanceLy);
  const nearestHabitable = habitablePlanets[0];
  const brightestNearby = starsWithin20.reduce((brightest, star) =>
    star.apparentMagnitude < brightest.apparentMagnitude ? star : brightest
  );
  const closestStar = starsWithin20.reduce((closest, star) => (star.distanceLy < closest.distanceLy ? star : closest));
  const redDwarfs = starsWithin20.filter((star) => star.spectralType.startsWith("M"));
  const fastestMotion = starsWithin20.reduce((fastest, star) =>
    star.properMotionArcsecYr > fastest.properMotionArcsecYr ? star : fastest
  );
  const nearestHazard = catalog.nearEarthObjects
    .filter((object) => object.potentiallyHazardous)
    .sort((a, b) => a.distanceAu - b.distanceAu)[0];
  const nearestDeepSky = [...catalog.deepSkyObjects].sort((a, b) => a.distanceLy - b.distanceLy)[0];
  const voyager = SPEED_PRESETS.find((speed) => speed.id === "voyager-1");
  const proxima = catalog.travelTargets.find((target) => target.id === "proxima-centauri");

  if (!nearestHabitable || !voyager || !proxima || !nearestHazard || !nearestDeepSky) {
    throw new Error("Seed catalog is missing required fact inputs.");
  }

  const facts: CosmicFact[] = [
    {
      id: "nearest-habitable",
      title: "Closest Habitable Candidate",
      body: `${nearestHabitable.name} is the closest potentially habitable planet in this snapshot at ${nearestHabitable.distanceLy.toFixed(1)} light-years away.`,
      metric: `${nearestHabitable.distanceLy.toFixed(1)} ly`,
      category: "planets"
    },
    {
      id: "planets-vs-stars-20ly",
      title: "Planets Within 20 Light-Years",
      body: `This catalog includes ${planetsWithin20.length} confirmed planets and ${starsWithin20.length} nearby stars within 20 light-years.`,
      metric: `${planetsWithin20.length}:${starsWithin20.length}`,
      category: "density"
    },
    {
      id: "voyager-to-proxima",
      title: "Voyager-Scale Travel",
      body: `At Voyager 1 speed, reaching Proxima Centauri would take about ${formatDurationYears(travelYears(proxima.distanceLy, voyager.kmS))}.`,
      metric: formatDurationYears(travelYears(proxima.distanceLy, voyager.kmS)),
      category: "travel"
    },
    {
      id: "brightest-not-closest",
      title: "Brightness Is Not Closeness",
      body: `${brightestNearby.name} is the brightest nearby star in this snapshot, while ${closestStar.name} is the closest.`,
      metric: brightestNearby.name,
      category: "stars"
    },
    {
      id: "red-dwarf-majority",
      title: "Red Dwarfs Dominate",
      body: `${redDwarfs.length} of ${starsWithin20.length} stars within 20 light-years are cool M-type red dwarfs.`,
      metric: `${Math.round((redDwarfs.length / starsWithin20.length) * 100)}%`,
      category: "stars"
    },
    {
      id: "star-of-day",
      title: "Star of the Day",
      body: `${fastestMotion.name} has the fastest apparent motion in the nearby-star snapshot at ${fastestMotion.properMotionArcsecYr.toFixed(2)} arcseconds per year.`,
      metric: `${fastestMotion.properMotionArcsecYr.toFixed(2)} arcsec/yr`,
      category: "motion"
    },
    {
      id: "closest-hazard",
      title: "Closest Hazard Watch",
      body: `${nearestHazard.name} is the closest potentially hazardous asteroid approach in this snapshot at ${nearestHazard.distanceAu.toFixed(6)} AU.`,
      metric: `${nearestHazard.distanceAu.toFixed(6)} AU`,
      category: "hazards"
    },
    {
      id: "nearest-deep-sky-object",
      title: "Nearest Deep Sky Marker",
      body: `${nearestDeepSky.name} is the nearest deep sky object in the map overlay, about ${nearestDeepSky.distanceLy.toLocaleString("en-US")} light-years away.`,
      metric: nearestDeepSky.name,
      category: "objects"
    }
  ];

  return factsSchema.parse({
    version: catalog.version,
    generatedAt,
    facts
  });
}

export function deriveInsights(catalog: Catalog, generatedAt = catalog.generatedAt): InsightsPayload {
  const starOfTheDay = deriveFacts(catalog, generatedAt).facts.find((fact) => fact.id === "star-of-day");

  if (!starOfTheDay) {
    throw new Error("Star of the Day fact could not be derived.");
  }

  const timelineMap = new Map<number, DiscoveryTimelinePoint>();
  for (const planet of catalog.exoplanets) {
    const current = timelineMap.get(planet.discoveryYear) ?? {
      year: planet.discoveryYear,
      discovered: 0,
      potentiallyHabitable: 0
    };
    current.discovered += 1;
    if (planet.potentiallyHabitable) current.potentiallyHabitable += 1;
    timelineMap.set(planet.discoveryYear, current);
  }

  const discoveryTimeline = [...timelineMap.values()].sort((a, b) => a.year - b.year);
  const densityCells = buildDensityCells(catalog);

  return insightsSchema.parse({
    version: catalog.version,
    generatedAt,
    starOfTheDay,
    discoveryTimeline,
    densityCells
  });
}

function buildDensityCells(catalog: Catalog): DensityCell[] {
  const hostStars = new Map(catalog.stars.map((star) => [star.id, star]));
  const cells = new Map<string, DensityCell>();
  const radiusLy = 20;

  for (const star of catalog.stars.filter((item) => item.id !== "sun")) {
    const id = cellId(star.xLy, star.yLy, star.zLy);
    const cell = cells.get(id) ?? createDensityCell(id, star.xLy, star.yLy, star.zLy, radiusLy);
    cell.starCount += 1;
    cells.set(id, cell);
  }

  for (const planet of catalog.exoplanets) {
    const host = hostStars.get(planet.hostStarId);
    if (!host) continue;

    const id = cellId(host.xLy, host.yLy, host.zLy);
    const cell = cells.get(id) ?? createDensityCell(id, host.xLy, host.yLy, host.zLy, radiusLy);
    cell.planetCount += 1;
    cells.set(id, cell);
  }

  return [...cells.values()]
    .map((cell) => ({
      ...cell,
      densityScore: Number(((cell.starCount * 1.6 + cell.planetCount) / radiusLy).toFixed(3))
    }))
    .sort((a, b) => b.densityScore - a.densityScore);
}

function cellId(xLy: number, yLy: number, zLy: number): string {
  return `${xLy >= 0 ? "east" : "west"}-${yLy >= 0 ? "north" : "south"}-${zLy >= 0 ? "up" : "down"}`;
}

function createDensityCell(id: string, xLy: number, yLy: number, zLy: number, radiusLy: number): DensityCell {
  return {
    id,
    xLy: xLy >= 0 ? radiusLy / 2 : -radiusLy / 2,
    yLy: yLy >= 0 ? radiusLy / 2 : -radiusLy / 2,
    zLy: zLy >= 0 ? radiusLy / 2 : -radiusLy / 2,
    radiusLy,
    starCount: 0,
    planetCount: 0,
    densityScore: 0
  };
}
