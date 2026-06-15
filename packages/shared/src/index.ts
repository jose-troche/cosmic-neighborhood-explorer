import { z } from "zod";

export const LIGHT_YEAR_KM = 9_460_730_472_580.8;
export const AU_KM = 149_597_870.7;
export const SECONDS_PER_YEAR = 31_557_600;

export const starSchema = z.object({
  id: z.string(),
  name: z.string(),
  spectralType: z.string(),
  distanceLy: z.number().positive(),
  raDeg: z.number(),
  decDeg: z.number(),
  xLy: z.number(),
  yLy: z.number(),
  zLy: z.number(),
  apparentMagnitude: z.number(),
  temperatureK: z.number().positive(),
  luminositySolar: z.number().nonnegative(),
  properMotionArcsecYr: z.number().nonnegative(),
  color: z.string()
});

export const exoplanetSchema = z.object({
  id: z.string(),
  name: z.string(),
  hostStarId: z.string(),
  hostStarName: z.string(),
  distanceLy: z.number().positive(),
  radiusEarth: z.number().positive(),
  massEarth: z.number().positive().optional(),
  equilibriumTempK: z.number().positive().optional(),
  discoveryYear: z.number().int(),
  potentiallyHabitable: z.boolean(),
  orbitalPeriodDays: z.number().positive().optional()
});

export const nearEarthObjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  closeApproachDate: z.string(),
  distanceAu: z.number().positive(),
  relativeVelocityKmS: z.number().positive(),
  diameterKm: z.number().positive().optional(),
  potentiallyHazardous: z.boolean()
});

export const deepSkyObjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["nebula", "cluster", "galaxy"]),
  distanceLy: z.number().positive(),
  raDeg: z.number(),
  decDeg: z.number(),
  xLy: z.number(),
  yLy: z.number(),
  zLy: z.number(),
  apparentMagnitude: z.number().optional(),
  constellation: z.string(),
  summary: z.string(),
  color: z.string()
});

export const worldProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["planet", "moon", "exoplanet"]),
  distanceLy: z.number().nonnegative(),
  gravityEarth: z.number().nonnegative(),
  dayLengthHours: z.number().positive(),
  temperatureK: z.number().positive(),
  atmosphericPressureEarth: z.number().nonnegative(),
  radiusEarth: z.number().positive(),
  highlight: z.string()
});

export const travelTargetSchema = z.object({
  id: z.string(),
  name: z.string(),
  distanceLy: z.number().positive(),
  type: z.enum(["star", "exoplanet", "moon", "planet"])
});

export const factSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  metric: z.string(),
  category: z.enum(["stars", "planets", "travel", "density", "motion", "objects", "hazards"])
});

export const sourceStatusSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  status: z.enum(["ok", "error", "seed"]),
  fetchedAt: z.string().optional(),
  recordCount: z.number().int().nonnegative().optional(),
  message: z.string().optional()
});

export const discoveryTimelinePointSchema = z.object({
  year: z.number().int(),
  discovered: z.number().int().nonnegative(),
  potentiallyHabitable: z.number().int().nonnegative()
});

export const densityCellSchema = z.object({
  id: z.string(),
  xLy: z.number(),
  yLy: z.number(),
  zLy: z.number(),
  radiusLy: z.number().positive(),
  starCount: z.number().int().nonnegative(),
  planetCount: z.number().int().nonnegative(),
  densityScore: z.number().nonnegative()
});

export const catalogSchema = z.object({
  version: z.string(),
  generatedAt: z.string(),
  sources: z.array(z.object({ name: z.string(), url: z.string(), notes: z.string() })),
  sourceStatuses: z.array(sourceStatusSchema),
  stars: z.array(starSchema),
  exoplanets: z.array(exoplanetSchema),
  nearEarthObjects: z.array(nearEarthObjectSchema),
  deepSkyObjects: z.array(deepSkyObjectSchema),
  worldProfiles: z.array(worldProfileSchema),
  travelTargets: z.array(travelTargetSchema)
});

export const factsSchema = z.object({
  version: z.string(),
  generatedAt: z.string(),
  facts: z.array(factSchema)
});

export const insightsSchema = z.object({
  version: z.string(),
  generatedAt: z.string(),
  starOfTheDay: factSchema,
  discoveryTimeline: z.array(discoveryTimelinePointSchema),
  densityCells: z.array(densityCellSchema)
});

export type Catalog = z.infer<typeof catalogSchema>;
export type CosmicFact = z.infer<typeof factSchema>;
export type DeepSkyObject = z.infer<typeof deepSkyObjectSchema>;
export type DensityCell = z.infer<typeof densityCellSchema>;
export type DiscoveryTimelinePoint = z.infer<typeof discoveryTimelinePointSchema>;
export type Exoplanet = z.infer<typeof exoplanetSchema>;
export type FactsPayload = z.infer<typeof factsSchema>;
export type InsightsPayload = z.infer<typeof insightsSchema>;
export type NearEarthObject = z.infer<typeof nearEarthObjectSchema>;
export type SourceStatus = z.infer<typeof sourceStatusSchema>;
export type Star = z.infer<typeof starSchema>;
export type TravelTarget = z.infer<typeof travelTargetSchema>;
export type WorldProfile = z.infer<typeof worldProfileSchema>;

export type SpeedPreset = {
  id: string;
  label: string;
  kmS: number;
};

export const SPEED_PRESETS: SpeedPreset[] = [
  { id: "walking", label: "Walking", kmS: 0.0014 },
  { id: "car", label: "Car", kmS: 0.0278 },
  { id: "airplane", label: "Airplane", kmS: 0.255 },
  { id: "voyager-1", label: "Voyager 1", kmS: 17 },
  { id: "new-horizons", label: "New Horizons", kmS: 14 },
  { id: "parker", label: "Parker Solar Probe", kmS: 190 },
  { id: "ten-percent-c", label: "10% speed of light", kmS: 29_979.2458 }
];

export function lightYearsToKm(lightYears: number): number {
  return lightYears * LIGHT_YEAR_KM;
}

export function auToKm(au: number): number {
  return au * AU_KM;
}

export function travelYears(distanceLy: number, speedKmS: number): number {
  if (distanceLy <= 0 || speedKmS <= 0) {
    throw new Error("Distance and speed must be positive.");
  }

  return lightYearsToKm(distanceLy) / speedKmS / SECONDS_PER_YEAR;
}

export function formatDurationYears(years: number): string {
  if (years >= 1_000_000) {
    return `${(years / 1_000_000).toFixed(1)} million years`;
  }

  if (years >= 1_000) {
    return `${Math.round(years).toLocaleString("en-US")} years`;
  }

  if (years >= 10) {
    return `${years.toFixed(1)} years`;
  }

  return `${years.toFixed(2)} years`;
}

export function starTemperatureColor(temperatureK: number): string {
  if (temperatureK >= 9_000) return "#9ecbff";
  if (temperatureK >= 6_500) return "#d7e9ff";
  if (temperatureK >= 5_200) return "#fff4d3";
  if (temperatureK >= 3_900) return "#ffd6a3";
  return "#ff8f70";
}
