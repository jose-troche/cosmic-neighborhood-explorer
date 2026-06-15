import {
  starTemperatureColor,
  type Catalog,
  type DeepSkyObject,
  type Exoplanet,
  type NearEarthObject,
  type Star,
  type WorldProfile
} from "@cosmic/shared";

const generatedAt = "2026-06-14T00:00:00.000Z";

export const stars: Star[] = [
  {
    id: "sun",
    name: "Sun",
    spectralType: "G2V",
    distanceLy: 0.000016,
    raDeg: 0,
    decDeg: 0,
    xLy: 0,
    yLy: 0,
    zLy: 0,
    apparentMagnitude: -26.74,
    temperatureK: 5772,
    luminositySolar: 1,
    properMotionArcsecYr: 0,
    color: starTemperatureColor(5772)
  },
  {
    id: "proxima-centauri",
    name: "Proxima Centauri",
    spectralType: "M5.5V",
    distanceLy: 4.2465,
    raDeg: 217.4292,
    decDeg: -62.6795,
    xLy: -1.546,
    yLy: -3.758,
    zLy: -1.229,
    apparentMagnitude: 11.13,
    temperatureK: 3042,
    luminositySolar: 0.0017,
    properMotionArcsecYr: 3.85,
    color: starTemperatureColor(3042)
  },
  {
    id: "alpha-centauri-a",
    name: "Alpha Centauri A",
    spectralType: "G2V",
    distanceLy: 4.367,
    raDeg: 219.9021,
    decDeg: -60.8339,
    xLy: -1.606,
    yLy: -3.846,
    zLy: -1.303,
    apparentMagnitude: -0.01,
    temperatureK: 5790,
    luminositySolar: 1.52,
    properMotionArcsecYr: 3.71,
    color: starTemperatureColor(5790)
  },
  {
    id: "barnards-star",
    name: "Barnard's Star",
    spectralType: "M4V",
    distanceLy: 5.963,
    raDeg: 269.454,
    decDeg: 4.668,
    xLy: -0.056,
    yLy: -5.943,
    zLy: 0.485,
    apparentMagnitude: 9.54,
    temperatureK: 3134,
    luminositySolar: 0.0035,
    properMotionArcsecYr: 10.36,
    color: starTemperatureColor(3134)
  },
  {
    id: "wolf-359",
    name: "Wolf 359",
    spectralType: "M6V",
    distanceLy: 7.856,
    raDeg: 164.1032,
    decDeg: 7.0148,
    xLy: -7.5,
    yLy: 2.137,
    zLy: 0.958,
    apparentMagnitude: 13.54,
    temperatureK: 2800,
    luminositySolar: 0.0009,
    properMotionArcsecYr: 4.71,
    color: starTemperatureColor(2800)
  },
  {
    id: "lalande-21185",
    name: "Lalande 21185",
    spectralType: "M2V",
    distanceLy: 8.304,
    raDeg: 165.834,
    decDeg: 35.9699,
    xLy: -6.541,
    yLy: 1.655,
    zLy: 4.872,
    apparentMagnitude: 7.52,
    temperatureK: 3828,
    luminositySolar: 0.0195,
    properMotionArcsecYr: 4.78,
    color: starTemperatureColor(3828)
  },
  {
    id: "sirius-a",
    name: "Sirius A",
    spectralType: "A1V",
    distanceLy: 8.611,
    raDeg: 101.287,
    decDeg: -16.716,
    xLy: -1.622,
    yLy: 8.291,
    zLy: -2.477,
    apparentMagnitude: -1.46,
    temperatureK: 9940,
    luminositySolar: 25.4,
    properMotionArcsecYr: 1.33,
    color: starTemperatureColor(9940)
  },
  {
    id: "epsilon-eridani",
    name: "Epsilon Eridani",
    spectralType: "K2V",
    distanceLy: 10.475,
    raDeg: 53.2327,
    decDeg: -9.4583,
    xLy: 6.183,
    yLy: 8.275,
    zLy: -1.72,
    apparentMagnitude: 3.73,
    temperatureK: 5084,
    luminositySolar: 0.34,
    properMotionArcsecYr: 0.98,
    color: starTemperatureColor(5084)
  },
  {
    id: "ross-128",
    name: "Ross 128",
    spectralType: "M4V",
    distanceLy: 11.01,
    raDeg: 176.9377,
    decDeg: 0.804,
    xLy: -10.96,
    yLy: 0.586,
    zLy: 0.154,
    apparentMagnitude: 11.13,
    temperatureK: 3192,
    luminositySolar: 0.0036,
    properMotionArcsecYr: 1.61,
    color: starTemperatureColor(3192)
  },
  {
    id: "luytens-star",
    name: "Luyten's Star",
    spectralType: "M3.5V",
    distanceLy: 12.36,
    raDeg: 111.8521,
    decDeg: 5.2258,
    xLy: -4.584,
    yLy: 11.437,
    zLy: 1.126,
    apparentMagnitude: 9.87,
    temperatureK: 3150,
    luminositySolar: 0.0088,
    properMotionArcsecYr: 3.74,
    color: starTemperatureColor(3150)
  },
  {
    id: "tau-ceti",
    name: "Tau Ceti",
    spectralType: "G8.5V",
    distanceLy: 11.91,
    raDeg: 26.0093,
    decDeg: -15.9338,
    xLy: 10.293,
    yLy: 5.02,
    zLy: -3.27,
    apparentMagnitude: 3.5,
    temperatureK: 5344,
    luminositySolar: 0.52,
    properMotionArcsecYr: 1.92,
    color: starTemperatureColor(5344)
  },
  {
    id: "trappist-1",
    name: "TRAPPIST-1",
    spectralType: "M8V",
    distanceLy: 40.66,
    raDeg: 346.6224,
    decDeg: -5.0414,
    xLy: 39.398,
    yLy: -9.37,
    zLy: -3.572,
    apparentMagnitude: 18.8,
    temperatureK: 2566,
    luminositySolar: 0.00055,
    properMotionArcsecYr: 1.04,
    color: starTemperatureColor(2566)
  }
];

export const exoplanets: Exoplanet[] = [
  {
    id: "proxima-centauri-b",
    name: "Proxima Centauri b",
    hostStarId: "proxima-centauri",
    hostStarName: "Proxima Centauri",
    distanceLy: 4.2465,
    radiusEarth: 1.08,
    massEarth: 1.27,
    equilibriumTempK: 234,
    discoveryYear: 2016,
    potentiallyHabitable: true,
    orbitalPeriodDays: 11.19
  },
  {
    id: "barnards-star-b",
    name: "Barnard's Star b",
    hostStarId: "barnards-star",
    hostStarName: "Barnard's Star",
    distanceLy: 5.963,
    radiusEarth: 1.9,
    massEarth: 3.2,
    equilibriumTempK: 105,
    discoveryYear: 2024,
    potentiallyHabitable: false,
    orbitalPeriodDays: 3.15
  },
  {
    id: "epsilon-eridani-b",
    name: "Epsilon Eridani b",
    hostStarId: "epsilon-eridani",
    hostStarName: "Epsilon Eridani",
    distanceLy: 10.475,
    radiusEarth: 11.2,
    massEarth: 246,
    equilibriumTempK: 150,
    discoveryYear: 2000,
    potentiallyHabitable: false,
    orbitalPeriodDays: 2671
  },
  {
    id: "trappist-1e",
    name: "TRAPPIST-1 e",
    hostStarId: "trappist-1",
    hostStarName: "TRAPPIST-1",
    distanceLy: 40.66,
    radiusEarth: 0.92,
    massEarth: 0.69,
    equilibriumTempK: 251,
    discoveryYear: 2017,
    potentiallyHabitable: true,
    orbitalPeriodDays: 6.1
  },
  {
    id: "trappist-1f",
    name: "TRAPPIST-1 f",
    hostStarId: "trappist-1",
    hostStarName: "TRAPPIST-1",
    distanceLy: 40.66,
    radiusEarth: 1.05,
    massEarth: 1.04,
    equilibriumTempK: 219,
    discoveryYear: 2017,
    potentiallyHabitable: true,
    orbitalPeriodDays: 9.21
  },
  {
    id: "trappist-1g",
    name: "TRAPPIST-1 g",
    hostStarId: "trappist-1",
    hostStarName: "TRAPPIST-1",
    distanceLy: 40.66,
    radiusEarth: 1.13,
    massEarth: 1.32,
    equilibriumTempK: 199,
    discoveryYear: 2017,
    potentiallyHabitable: true,
    orbitalPeriodDays: 12.35
  },
  {
    id: "ross-128-b",
    name: "Ross 128 b",
    hostStarId: "ross-128",
    hostStarName: "Ross 128",
    distanceLy: 11.01,
    radiusEarth: 1.1,
    massEarth: 1.4,
    equilibriumTempK: 280,
    discoveryYear: 2017,
    potentiallyHabitable: true,
    orbitalPeriodDays: 9.87
  },
  {
    id: "gj-273-b",
    name: "Luyten b",
    hostStarId: "luytens-star",
    hostStarName: "Luyten's Star",
    distanceLy: 12.36,
    radiusEarth: 1.5,
    massEarth: 2.89,
    equilibriumTempK: 259,
    discoveryYear: 2017,
    potentiallyHabitable: true,
    orbitalPeriodDays: 18.65
  },
  {
    id: "tau-ceti-e",
    name: "Tau Ceti e",
    hostStarId: "tau-ceti",
    hostStarName: "Tau Ceti",
    distanceLy: 11.91,
    radiusEarth: 1.8,
    massEarth: 3.93,
    equilibriumTempK: 270,
    discoveryYear: 2012,
    potentiallyHabitable: true,
    orbitalPeriodDays: 162.87
  }
];

export const nearEarthObjects: NearEarthObject[] = [
  {
    id: "apophis-2029",
    name: "99942 Apophis",
    closeApproachDate: "2029-04-13",
    distanceAu: 0.000254,
    relativeVelocityKmS: 7.42,
    diameterKm: 0.34,
    potentiallyHazardous: true
  },
  {
    id: "2001-wn5-2028",
    name: "153814 (2001 WN5)",
    closeApproachDate: "2028-06-26",
    distanceAu: 0.001663,
    relativeVelocityKmS: 10.24,
    diameterKm: 0.932,
    potentiallyHazardous: true
  },
  {
    id: "eros",
    name: "433 Eros",
    closeApproachDate: "2056-01-24",
    distanceAu: 0.149,
    relativeVelocityKmS: 5.82,
    diameterKm: 16.84,
    potentiallyHazardous: false
  }
];

export const deepSkyObjects: DeepSkyObject[] = [
  {
    id: "orion-nebula",
    name: "Orion Nebula",
    type: "nebula",
    distanceLy: 1344,
    raDeg: 83.8221,
    decDeg: -5.3911,
    xLy: 141.1,
    yLy: 1327.7,
    zLy: -126.3,
    apparentMagnitude: 4,
    constellation: "Orion",
    summary: "A nearby stellar nursery where new stars are forming inside glowing gas.",
    color: "#d98cff"
  },
  {
    id: "pleiades",
    name: "Pleiades",
    type: "cluster",
    distanceLy: 444,
    raDeg: 56.75,
    decDeg: 24.1167,
    xLy: 222.1,
    yLy: 327.4,
    zLy: 181.6,
    apparentMagnitude: 1.6,
    constellation: "Taurus",
    summary: "A bright young open cluster whose blue stars are visible without a telescope.",
    color: "#91c7ff"
  },
  {
    id: "hyades",
    name: "Hyades",
    type: "cluster",
    distanceLy: 153,
    raDeg: 66.75,
    decDeg: 15.8667,
    xLy: 58.1,
    yLy: 135.8,
    zLy: 41.9,
    apparentMagnitude: 0.5,
    constellation: "Taurus",
    summary: "The nearest major open cluster and a useful benchmark for stellar distances.",
    color: "#ffd79c"
  },
  {
    id: "andromeda-galaxy",
    name: "Andromeda Galaxy",
    type: "galaxy",
    distanceLy: 2_537_000,
    raDeg: 10.6847,
    decDeg: 41.2692,
    xLy: 1_878_189,
    yLy: 354_371,
    zLy: 1_673_701,
    apparentMagnitude: 3.44,
    constellation: "Andromeda",
    summary: "The nearest large spiral galaxy, far outside the local stellar neighborhood.",
    color: "#f1e2ff"
  }
];

export const worldProfiles: WorldProfile[] = [
  {
    id: "earth",
    name: "Earth",
    category: "planet",
    distanceLy: 0,
    gravityEarth: 1,
    dayLengthHours: 23.93,
    temperatureK: 288,
    atmosphericPressureEarth: 1,
    radiusEarth: 1,
    highlight: "The reference point for every comparison."
  },
  {
    id: "mars",
    name: "Mars",
    category: "planet",
    distanceLy: 0.000024,
    gravityEarth: 0.38,
    dayLengthHours: 24.62,
    temperatureK: 210,
    atmosphericPressureEarth: 0.006,
    radiusEarth: 0.532,
    highlight: "A cold desert with a day length surprisingly close to Earth's."
  },
  {
    id: "europa",
    name: "Europa",
    category: "moon",
    distanceLy: 0.000067,
    gravityEarth: 0.134,
    dayLengthHours: 85.2,
    temperatureK: 102,
    atmosphericPressureEarth: 0.000000000001,
    radiusEarth: 0.245,
    highlight: "An icy ocean world with almost no atmosphere."
  },
  {
    id: "titan",
    name: "Titan",
    category: "moon",
    distanceLy: 0.000137,
    gravityEarth: 0.138,
    dayLengthHours: 382.7,
    temperatureK: 94,
    atmosphericPressureEarth: 1.45,
    radiusEarth: 0.404,
    highlight: "A frigid moon with a thicker atmosphere than Earth's."
  },
  {
    id: "proxima-centauri-b",
    name: "Proxima Centauri b",
    category: "exoplanet",
    distanceLy: 4.2465,
    gravityEarth: 1.08,
    dayLengthHours: 268.6,
    temperatureK: 234,
    atmosphericPressureEarth: 0,
    radiusEarth: 1.08,
    highlight: "The closest known potentially habitable exoplanet candidate."
  },
  {
    id: "trappist-1e",
    name: "TRAPPIST-1 e",
    category: "exoplanet",
    distanceLy: 40.66,
    gravityEarth: 0.93,
    dayLengthHours: 146.4,
    temperatureK: 251,
    atmosphericPressureEarth: 0,
    radiusEarth: 0.92,
    highlight: "An Earth-sized world in a compact multi-planet system."
  }
];

export function seedCatalog(): Catalog {
  return {
    version: "v1",
    generatedAt,
    sources: [
      {
        name: "ESA Gaia Archive",
        url: "https://gea.esac.esa.int/archive/",
        notes: "Star fields mirror Gaia/SIMBAD-style position, distance, brightness, and proper motion attributes."
      },
      {
        name: "NASA Exoplanet Archive TAP",
        url: "https://exoplanetarchive.ipac.caltech.edu/TAP/",
        notes: "Exoplanet fields align with confirmed planet and host-star parameters."
      },
      {
        name: "NASA/JPL SBDB Close-Approach Data API",
        url: "https://ssd-api.jpl.nasa.gov/cad.api",
        notes: "NEO records use close-approach date, distance, velocity, diameter, and hazard flag."
      },
      {
        name: "SIMBAD Astronomical Database",
        url: "https://simbad.cds.unistra.fr/simbad/",
        notes: "Deep sky records use SIMBAD-style identifiers, object classes, positions, distances, and constellation context."
      }
    ],
    sourceStatuses: [
      {
        id: "gaia",
        name: "ESA Gaia Archive",
        url: "https://gea.esac.esa.int/archive/",
        status: "seed",
        recordCount: stars.length,
        message: "Using curated nearby-star seed records."
      },
      {
        id: "exoplanet-archive",
        name: "NASA Exoplanet Archive TAP",
        url: "https://exoplanetarchive.ipac.caltech.edu/TAP/",
        status: "seed",
        recordCount: exoplanets.length,
        message: "Using curated confirmed-exoplanet seed records."
      },
      {
        id: "cneos",
        name: "NASA/JPL SBDB Close-Approach Data API",
        url: "https://ssd-api.jpl.nasa.gov/cad.api",
        status: "seed",
        recordCount: nearEarthObjects.length,
        message: "Using curated close-approach seed records."
      },
      {
        id: "simbad",
        name: "SIMBAD Astronomical Database",
        url: "https://simbad.cds.unistra.fr/simbad/",
        status: "seed",
        recordCount: deepSkyObjects.length,
        message: "Using curated deep-sky seed records."
      }
    ],
    stars,
    exoplanets,
    nearEarthObjects,
    deepSkyObjects,
    worldProfiles,
    travelTargets: [
      { id: "proxima-centauri", name: "Proxima Centauri", distanceLy: 4.2465, type: "star" },
      { id: "barnards-star", name: "Barnard's Star", distanceLy: 5.963, type: "star" },
      { id: "trappist-1", name: "TRAPPIST-1", distanceLy: 40.66, type: "star" },
      { id: "trappist-1e", name: "TRAPPIST-1 e", distanceLy: 40.66, type: "exoplanet" },
      { id: "ross-128-b", name: "Ross 128 b", distanceLy: 11.01, type: "exoplanet" },
      { id: "tau-ceti-e", name: "Tau Ceti e", distanceLy: 11.91, type: "exoplanet" }
    ]
  };
}
