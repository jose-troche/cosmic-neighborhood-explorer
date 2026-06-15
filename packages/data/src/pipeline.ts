import {
  SPEED_PRESETS,
  catalogSchema,
  factsSchema,
  formatDurationYears,
  travelYears,
  type Catalog,
  type CosmicFact,
  type FactsPayload
} from "@cosmic/shared";
import { seedCatalog } from "./seed";

export function buildCatalog(generatedAt = new Date().toISOString()): Catalog {
  const catalog = { ...seedCatalog(), generatedAt };
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
  const voyager = SPEED_PRESETS.find((speed) => speed.id === "voyager-1");
  const proxima = catalog.travelTargets.find((target) => target.id === "proxima-centauri");

  if (!nearestHabitable || !voyager || !proxima) {
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
      body: `This MVP catalog includes ${planetsWithin20.length} confirmed planets and ${starsWithin20.length} nearby stars within 20 light-years.`,
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
    }
  ];

  return factsSchema.parse({
    version: catalog.version,
    generatedAt,
    facts
  });
}
