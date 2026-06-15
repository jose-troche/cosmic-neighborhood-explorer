import {
  sourceStatusSchema,
  starTemperatureColor,
  type Catalog,
  type DeepSkyObject,
  type Exoplanet,
  type NearEarthObject,
  type SourceStatus,
  type Star
} from "@cosmic/shared";

const PARSEC_TO_LIGHT_YEAR = 3.261563777;

type SourceSnapshot = {
  generatedAt?: unknown;
  gaiaStars?: unknown;
  exoplanets?: unknown;
  nearEarthObjects?: unknown;
  simbadDeepSky?: unknown;
  sourceStatuses?: unknown;
};

type GaiaPayload = {
  data?: unknown;
};

type ExoplanetArchiveRow = {
  pl_name?: unknown;
  hostname?: unknown;
  sy_dist?: unknown;
  ra?: unknown;
  dec?: unknown;
  st_teff?: unknown;
  st_lum?: unknown;
  pl_rade?: unknown;
  pl_masse?: unknown;
  pl_eqt?: unknown;
  disc_year?: unknown;
  pl_orbper?: unknown;
};

type CneosPayload = {
  fields?: unknown;
  data?: unknown;
};

type SimbadPayload = {
  data?: unknown;
};

const deepSkyCatalog: Record<string, Pick<DeepSkyObject, "name" | "type" | "distanceLy" | "constellation" | "summary" | "color" | "apparentMagnitude">> = {
  "M 1": {
    name: "Crab Nebula",
    type: "nebula",
    distanceLy: 6500,
    constellation: "Taurus",
    summary: "A supernova remnant whose expanding gas records a stellar explosion observed in 1054.",
    color: "#ffb37a",
    apparentMagnitude: 8.4
  },
  "M 8": {
    name: "Lagoon Nebula",
    type: "nebula",
    distanceLy: 4100,
    constellation: "Sagittarius",
    summary: "A bright emission nebula and star-forming region visible in the summer Milky Way.",
    color: "#ff8fc5",
    apparentMagnitude: 6
  },
  "M 13": {
    name: "Hercules Globular Cluster",
    type: "cluster",
    distanceLy: 22_200,
    constellation: "Hercules",
    summary: "A dense halo cluster containing hundreds of thousands of old stars.",
    color: "#ffd9a3",
    apparentMagnitude: 5.8
  },
  "M 16": {
    name: "Eagle Nebula",
    type: "nebula",
    distanceLy: 5700,
    constellation: "Serpens",
    summary: "A star-forming region that contains the Pillars of Creation.",
    color: "#d0ff9c",
    apparentMagnitude: 6
  },
  "M 17": {
    name: "Omega Nebula",
    type: "nebula",
    distanceLy: 5500,
    constellation: "Sagittarius",
    summary: "A massive emission nebula sculpted by young hot stars.",
    color: "#ff9db0",
    apparentMagnitude: 6
  },
  "M 20": {
    name: "Trifid Nebula",
    type: "nebula",
    distanceLy: 5200,
    constellation: "Sagittarius",
    summary: "A compact nebula where dark lanes divide glowing gas into three lobes.",
    color: "#b997ff",
    apparentMagnitude: 6.3
  },
  "M 27": {
    name: "Dumbbell Nebula",
    type: "nebula",
    distanceLy: 1360,
    constellation: "Vulpecula",
    summary: "A nearby planetary nebula formed as a dying Sun-like star shed its outer layers.",
    color: "#8ce8ff",
    apparentMagnitude: 7.5
  },
  "M 31": {
    name: "Andromeda Galaxy",
    type: "galaxy",
    distanceLy: 2_537_000,
    constellation: "Andromeda",
    summary: "The nearest large spiral galaxy, far outside the local stellar neighborhood.",
    color: "#f1e2ff",
    apparentMagnitude: 3.44
  },
  "M 42": {
    name: "Orion Nebula",
    type: "nebula",
    distanceLy: 1344,
    constellation: "Orion",
    summary: "A nearby stellar nursery where new stars are forming inside glowing gas.",
    color: "#d98cff",
    apparentMagnitude: 4
  },
  "M 45": {
    name: "Pleiades",
    type: "cluster",
    distanceLy: 444,
    constellation: "Taurus",
    summary: "A bright young open cluster whose blue stars are visible without a telescope.",
    color: "#91c7ff",
    apparentMagnitude: 1.6
  },
  "M 57": {
    name: "Ring Nebula",
    type: "nebula",
    distanceLy: 2560,
    constellation: "Lyra",
    summary: "A planetary nebula with a ring-like shell around a hot stellar remnant.",
    color: "#82ffe6",
    apparentMagnitude: 8.8
  },
  "M 81": {
    name: "Bode's Galaxy",
    type: "galaxy",
    distanceLy: 11_740_000,
    constellation: "Ursa Major",
    summary: "A grand-design spiral galaxy in the nearby M81 group.",
    color: "#ffe3a3",
    apparentMagnitude: 6.9
  },
  "M 82": {
    name: "Cigar Galaxy",
    type: "galaxy",
    distanceLy: 11_420_000,
    constellation: "Ursa Major",
    summary: "A starburst galaxy whose central region is forming stars at an intense rate.",
    color: "#ff9a7a",
    apparentMagnitude: 8.4
  },
  "NAME LMC": {
    name: "Large Magellanic Cloud",
    type: "galaxy",
    distanceLy: 162_000,
    constellation: "Dorado",
    summary: "A satellite galaxy of the Milky Way and one of the closest galaxies to Earth.",
    color: "#b7d7ff",
    apparentMagnitude: 0.9
  },
  "NAME SMC": {
    name: "Small Magellanic Cloud",
    type: "galaxy",
    distanceLy: 200_000,
    constellation: "Tucana",
    summary: "A nearby dwarf galaxy orbiting the Milky Way.",
    color: "#c4bbff",
    apparentMagnitude: 2.7
  },
  "NGC 104": {
    name: "47 Tucanae",
    type: "cluster",
    distanceLy: 13_000,
    constellation: "Tucana",
    summary: "A massive globular cluster near the Small Magellanic Cloud in the southern sky.",
    color: "#ffd59a",
    apparentMagnitude: 4.1
  },
  "NGC 3372": {
    name: "Carina Nebula",
    type: "nebula",
    distanceLy: 8500,
    constellation: "Carina",
    summary: "A giant star-forming complex containing some of the Milky Way's most massive stars.",
    color: "#ff7fa8",
    apparentMagnitude: 1
  },
  "NGC 5139": {
    name: "Omega Centauri",
    type: "cluster",
    distanceLy: 15_800,
    constellation: "Centaurus",
    summary: "The largest and brightest globular cluster visible from Earth.",
    color: "#ffe2a3",
    apparentMagnitude: 3.9
  }
};

export function mergeSourceSnapshot(catalog: Catalog, source: SourceSnapshot | null | undefined): Catalog {
  if (!source) return catalog;

  const gaiaStars = normalizeGaiaStars(source.gaiaStars);
  const sourceStars = normalizeExoplanetHosts(source.exoplanets);
  const sourcePlanets = normalizeExoplanets(source.exoplanets);
  const sourceNeos = normalizeNearEarthObjects(source.nearEarthObjects);
  const sourceDeepSky = normalizeDeepSkyObjects(source.simbadDeepSky);
  const sourceStatuses = normalizeSourceStatuses(source.sourceStatuses, {
    gaiaStars: source.gaiaStars,
    exoplanets: source.exoplanets,
    nearEarthObjects: source.nearEarthObjects,
    simbadDeepSky: source.simbadDeepSky
  });

  return {
    ...catalog,
    sources: catalog.sources.map((sourceInfo) =>
      sourceInfo.name.includes("NASA") || sourceInfo.name.includes("SIMBAD") || sourceInfo.name.includes("Gaia")
        ? { ...sourceInfo, notes: `${sourceInfo.notes} Live source cache merged when available.` }
        : sourceInfo
    ),
    stars: mergeStars(catalog.stars, [...gaiaStars, ...sourceStars]),
    exoplanets: mergeById(catalog.exoplanets, sourcePlanets),
    nearEarthObjects: mergeById(catalog.nearEarthObjects, sourceNeos),
    deepSkyObjects: mergeById(catalog.deepSkyObjects, sourceDeepSky),
    sourceStatuses: sourceStatuses.length > 0 ? sourceStatuses : catalog.sourceStatuses,
    travelTargets: mergeById(
      catalog.travelTargets,
      sourcePlanets
        .filter((planet) => planet.distanceLy <= 75)
        .slice(0, 8)
        .map((planet) => ({
          id: planet.id,
          name: planet.name,
          distanceLy: planet.distanceLy,
          type: "exoplanet" as const
        }))
    )
  };
}

function normalizeSourceStatuses(value: unknown, payloads: Record<string, unknown>): SourceStatus[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => sourceStatusSchema.safeParse(item))
      .filter((result) => result.success)
      .map((result) => result.data);
  }

  return [
    inferSourceStatus("gaia", "ESA Gaia Archive", "https://gea.esac.esa.int/archive/", payloads.gaiaStars),
    inferSourceStatus(
      "exoplanet-archive",
      "NASA Exoplanet Archive TAP",
      "https://exoplanetarchive.ipac.caltech.edu/TAP/",
      payloads.exoplanets
    ),
    inferSourceStatus(
      "cneos",
      "NASA/JPL SBDB Close-Approach Data API",
      "https://ssd-api.jpl.nasa.gov/cad.api",
      payloads.nearEarthObjects
    ),
    inferSourceStatus("simbad", "SIMBAD Astronomical Database", "https://simbad.cds.unistra.fr/simbad/", payloads.simbadDeepSky)
  ];
}

function inferSourceStatus(id: string, name: string, url: string, value: unknown): SourceStatus {
  const recordCount = inferRecordCount(value);
  return {
    id,
    name,
    url,
    status: recordCount > 0 ? "ok" : "error",
    recordCount,
    message: recordCount > 0 ? "Source cache predates explicit status metadata." : "No usable source records were available."
  };
}

function inferRecordCount(value: unknown): number {
  if (Array.isArray(value)) return value.length;
  const data = (value as { data?: unknown } | null | undefined)?.data;
  return Array.isArray(data) ? data.length : 0;
}

function normalizeGaiaStars(value: unknown): Star[] {
  const payload = value as GaiaPayload;
  if (!Array.isArray(payload.data)) return [];

  return payload.data
    .slice(0, 500)
    .map((row) => normalizeGaiaStar(Array.isArray(row) ? row : []))
    .filter((star): star is Star => Boolean(star));
}

function normalizeGaiaStar(row: unknown[]): Star | null {
  const sourceId = asString(row[0]) ?? (typeof row[0] === "number" ? String(row[0]) : null);
  const raDeg = asNumber(row[1]);
  const decDeg = asNumber(row[2]);
  const parallaxMas = asNumber(row[3]);
  const apparentMagnitude = asNumber(row[4]);
  const bpRp = asNumber(row[5]);
  const pmra = asNumber(row[6]) ?? 0;
  const pmdec = asNumber(row[7]) ?? 0;

  if (!sourceId || raDeg === null || decDeg === null || !parallaxMas || apparentMagnitude === null) return null;

  const distancePc = 1000 / parallaxMas;
  const distanceLy = distancePc * PARSEC_TO_LIGHT_YEAR;
  const temperatureK = temperatureFromBpRp(bpRp);
  const absoluteMagnitude = apparentMagnitude + 5 - 5 * Math.log10(distancePc);
  const luminositySolar = Math.max(0.0001, 10 ** (-0.4 * (absoluteMagnitude - 4.67)));
  const position = sphericalToCartesian(distanceLy, raDeg, decDeg);

  return {
    id: `gaia-dr3-${sourceId}`,
    name: `Gaia DR3 ${sourceId}`,
    spectralType: spectralTypeFromTemperature(temperatureK),
    distanceLy: round(distanceLy, 4),
    raDeg,
    decDeg,
    xLy: round(position.x, 3),
    yLy: round(position.y, 3),
    zLy: round(position.z, 3),
    apparentMagnitude: round(apparentMagnitude, 3),
    temperatureK: round(temperatureK, 0),
    luminositySolar: round(luminositySolar, 5),
    properMotionArcsecYr: round(Math.hypot(pmra, pmdec) / 1000, 4),
    color: starTemperatureColor(temperatureK)
  };
}

function normalizeExoplanets(value: unknown): Exoplanet[] {
  if (!Array.isArray(value)) return [];

  return uniqueById(
    value
      .map((row) => normalizeExoplanet(row as ExoplanetArchiveRow))
      .filter((planet): planet is Exoplanet => Boolean(planet))
  );
}

function normalizeExoplanet(row: ExoplanetArchiveRow): Exoplanet | null {
  const name = asString(row.pl_name);
  const hostName = asString(row.hostname);
  const distancePc = asNumber(row.sy_dist);
  const radiusEarth = asNumber(row.pl_rade);
  const discoveryYear = asNumber(row.disc_year);

  if (!name || !hostName || !distancePc || !radiusEarth || !discoveryYear) return null;

  const equilibriumTempK = positiveOptional(row.pl_eqt);
  return {
    id: slug(name),
    name,
    hostStarId: slug(hostName),
    hostStarName: hostName,
    distanceLy: round(distancePc * PARSEC_TO_LIGHT_YEAR, 4),
    radiusEarth: round(radiusEarth, 3),
    massEarth: positiveOptional(row.pl_masse),
    equilibriumTempK,
    discoveryYear: Math.round(discoveryYear),
    potentiallyHabitable: radiusEarth >= 0.5 && radiusEarth <= 2 && Boolean(equilibriumTempK && equilibriumTempK >= 180 && equilibriumTempK <= 310),
    orbitalPeriodDays: positiveOptional(row.pl_orbper)
  };
}

function normalizeExoplanetHosts(value: unknown): Star[] {
  if (!Array.isArray(value)) return [];

  return uniqueById(
    value
      .map((row) => normalizeExoplanetHost(row as ExoplanetArchiveRow))
      .filter((star): star is Star => Boolean(star))
  );
}

function normalizeExoplanetHost(row: ExoplanetArchiveRow): Star | null {
  const hostName = asString(row.hostname);
  const distancePc = asNumber(row.sy_dist);
  const raDeg = asNumber(row.ra);
  const decDeg = asNumber(row.dec);
  const temperatureK = asNumber(row.st_teff) ?? 3600;

  if (!hostName || !distancePc || raDeg === null || decDeg === null) return null;

  const distanceLy = distancePc * PARSEC_TO_LIGHT_YEAR;
  const position = sphericalToCartesian(distanceLy, raDeg, decDeg);
  const luminositySolar = luminosityFromLog(row.st_lum);

  return {
    id: slug(hostName),
    name: hostName,
    spectralType: spectralTypeFromTemperature(temperatureK),
    distanceLy: round(distanceLy, 4),
    raDeg,
    decDeg,
    xLy: round(position.x, 3),
    yLy: round(position.y, 3),
    zLy: round(position.z, 3),
    apparentMagnitude: 12,
    temperatureK: round(temperatureK, 0),
    luminositySolar,
    properMotionArcsecYr: 0,
    color: starTemperatureColor(temperatureK)
  };
}

function normalizeNearEarthObjects(value: unknown): NearEarthObject[] {
  const payload = value as CneosPayload;
  if (!Array.isArray(payload.fields) || !Array.isArray(payload.data)) return [];

  const fieldIndex = new Map(payload.fields.map((field, index) => [String(field), index]));
  return payload.data
    .slice(0, 40)
    .map((row) => normalizeNearEarthObject(Array.isArray(row) ? row : [], fieldIndex))
    .filter((object): object is NearEarthObject => Boolean(object));
}

function normalizeNearEarthObject(row: unknown[], fieldIndex: Map<string, number>): NearEarthObject | null {
  const des = asString(row[fieldIndex.get("des") ?? -1]);
  const fullname = asString(row[fieldIndex.get("fullname") ?? -1])?.trim();
  const closeApproachDate = asString(row[fieldIndex.get("cd") ?? -1]);
  const distanceAu = asNumber(row[fieldIndex.get("dist") ?? -1]);
  const velocityKmS = asNumber(row[fieldIndex.get("v_rel") ?? -1]);
  const absoluteMagnitude = asNumber(row[fieldIndex.get("h") ?? -1]);

  if (!des || !closeApproachDate || !distanceAu || !velocityKmS) return null;

  const diameterKm = absoluteMagnitude ? estimateAsteroidDiameterKm(absoluteMagnitude) : undefined;

  return {
    id: slug(`neo-${des}-${closeApproachDate}`),
    name: fullname || des,
    closeApproachDate,
    distanceAu: round(distanceAu, 8),
    relativeVelocityKmS: round(velocityKmS, 3),
    diameterKm,
    potentiallyHazardous: distanceAu <= 0.05 && (diameterKm ?? 0) >= 0.14
  };
}

function normalizeDeepSkyObjects(value: unknown): DeepSkyObject[] {
  const payload = value as SimbadPayload;
  if (!Array.isArray(payload.data)) return [];

  return payload.data
    .map((row) => normalizeDeepSkyObject(Array.isArray(row) ? row : []))
    .filter((object): object is DeepSkyObject => Boolean(object));
}

function normalizeDeepSkyObject(row: unknown[]): DeepSkyObject | null {
  const rawId = (asString(row[4]) ?? asString(row[0]))?.replace(/\s+/g, " ").trim();
  const raDeg = asNumber(row[2]);
  const decDeg = asNumber(row[3]);
  if (!rawId || raDeg === null || decDeg === null) return null;

  const template = deepSkyCatalog[rawId];
  if (!template) return null;

  const position = sphericalToCartesian(template.distanceLy, raDeg, decDeg);
  return {
    id: slug(template.name),
    ...template,
    raDeg,
    decDeg,
    xLy: round(position.x, 3),
    yLy: round(position.y, 3),
    zLy: round(position.z, 3)
  };
}

function mergeById<T extends { id: string }>(base: T[], additions: T[]): T[] {
  const existing = new Set(base.map((item) => item.id));
  return [...base, ...additions.filter((item) => !existing.has(item.id))];
}

function mergeStars(base: Star[], additions: Star[]): Star[] {
  const merged = [...base];
  for (const star of additions) {
    const duplicate = merged.some(
      (existing) =>
        existing.id === star.id ||
        (Math.abs(existing.raDeg - star.raDeg) < 0.08 &&
          Math.abs(existing.decDeg - star.decDeg) < 0.08 &&
          Math.abs(existing.distanceLy - star.distanceLy) < 0.2)
    );
    if (!duplicate) merged.push(star);
  }
  return merged;
}

function uniqueById<T extends { id: string }>(items: T[]): T[] {
  return [...new Map(items.map((item) => [item.id, item])).values()];
}

function sphericalToCartesian(distance: number, raDeg: number, decDeg: number) {
  const ra = (raDeg * Math.PI) / 180;
  const dec = (decDeg * Math.PI) / 180;
  return {
    x: distance * Math.cos(dec) * Math.cos(ra),
    y: distance * Math.cos(dec) * Math.sin(ra),
    z: distance * Math.sin(dec)
  };
}

function spectralTypeFromTemperature(temperatureK: number): string {
  if (temperatureK >= 30_000) return "O";
  if (temperatureK >= 10_000) return "B";
  if (temperatureK >= 7_500) return "A";
  if (temperatureK >= 6_000) return "F";
  if (temperatureK >= 5_200) return "G";
  if (temperatureK >= 3_700) return "K";
  return "M";
}

function temperatureFromBpRp(bpRp: number | null): number {
  if (bpRp === null) return 4500;
  const clamped = Math.max(-0.4, Math.min(4, bpRp));
  return Math.max(2600, Math.min(12_000, 4600 * (1 / (0.92 * clamped + 1.7) + 1 / (0.92 * clamped + 0.62))));
}

function luminosityFromLog(value: unknown): number {
  const parsed = asNumber(value);
  if (parsed === null) return 0.01;
  return round(Math.max(0.0001, 10 ** parsed), 5);
}

function estimateAsteroidDiameterKm(absoluteMagnitude: number): number {
  const assumedAlbedo = 0.14;
  return round((1329 / Math.sqrt(assumedAlbedo)) * 10 ** (-absoluteMagnitude / 5), 4);
}

function positiveOptional(value: unknown): number | undefined {
  const parsed = asNumber(value);
  return parsed && parsed > 0 ? round(parsed, 3) : undefined;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function round(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
