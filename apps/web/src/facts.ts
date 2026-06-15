import { SPEED_PRESETS, formatDurationYears, travelYears, type Catalog, type CosmicFact } from "@cosmic/shared";

export function deriveLocalFacts(catalog: Catalog): CosmicFact[] {
  const starsWithin20 = catalog.stars.filter((star) => star.id !== "sun" && star.distanceLy <= 20);
  const habitable = catalog.exoplanets.filter((planet) => planet.potentiallyHabitable).sort((a, b) => a.distanceLy - b.distanceLy);
  const nearestHabitable = habitable[0];
  const redDwarfs = starsWithin20.filter((star) => star.spectralType.startsWith("M"));
  const brightest = starsWithin20.reduce((best, star) => (star.apparentMagnitude < best.apparentMagnitude ? star : best));
  const closest = starsWithin20.reduce((best, star) => (star.distanceLy < best.distanceLy ? star : best));
  const fastest = starsWithin20.reduce((best, star) => (star.properMotionArcsecYr > best.properMotionArcsecYr ? star : best));
  const voyager = SPEED_PRESETS.find((speed) => speed.id === "voyager-1")!;
  const proxima = catalog.travelTargets.find((target) => target.id === "proxima-centauri")!;

  if (!nearestHabitable) return [];

  return [
    {
      id: "nearest-habitable",
      title: "Closest Habitable Candidate",
      body: `${nearestHabitable.name} is the closest potentially habitable planet in this snapshot.`,
      metric: `${nearestHabitable.distanceLy.toFixed(1)} ly`,
      category: "planets"
    },
    {
      id: "voyager-to-proxima",
      title: "Voyager-Scale Travel",
      body: `Reaching Proxima Centauri at Voyager 1 speed would take about ${formatDurationYears(travelYears(proxima.distanceLy, voyager.kmS))}.`,
      metric: formatDurationYears(travelYears(proxima.distanceLy, voyager.kmS)),
      category: "travel"
    },
    {
      id: "brightest-not-closest",
      title: "Brightness Is Not Closeness",
      body: `${brightest.name} outshines the nearer ${closest.name} from Earth's sky.`,
      metric: brightest.name,
      category: "stars"
    },
    {
      id: "red-dwarf-majority",
      title: "Red Dwarfs Dominate",
      body: `${redDwarfs.length} of ${starsWithin20.length} nearby stars are M-type red dwarfs.`,
      metric: `${Math.round((redDwarfs.length / starsWithin20.length) * 100)}%`,
      category: "stars"
    },
    {
      id: "star-of-day",
      title: "Star of the Day",
      body: `${fastest.name} races across our sky faster than any other star in this snapshot.`,
      metric: `${fastest.properMotionArcsecYr.toFixed(2)} arcsec/yr`,
      category: "motion"
    }
  ];
}
