import { starTemperatureColor, type Catalog, type Exoplanet, type NearEarthObject, type Star } from "@cosmic/shared";

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

export function seedCatalog(): Catalog {
  return {
    version: "v1",
    generatedAt,
    sources: [
      {
        name: "ESA Gaia Archive",
        url: "https://gea.esac.esa.int/archive/",
        notes: "MVP star fields mirror Gaia/SIMBAD-style position, distance, brightness, and proper motion attributes."
      },
      {
        name: "NASA Exoplanet Archive TAP",
        url: "https://exoplanetarchive.ipac.caltech.edu/TAP/",
        notes: "MVP exoplanet fields align with confirmed planet and host-star parameters."
      },
      {
        name: "NASA/JPL SBDB Close-Approach Data API",
        url: "https://ssd-api.jpl.nasa.gov/cad.api",
        notes: "MVP NEO records use close-approach date, distance, velocity, diameter, and hazard flag."
      }
    ],
    stars,
    exoplanets,
    nearEarthObjects,
    travelTargets: [
      { id: "proxima-centauri", name: "Proxima Centauri", distanceLy: 4.2465, type: "star" },
      { id: "barnards-star", name: "Barnard's Star", distanceLy: 5.963, type: "star" },
      { id: "trappist-1", name: "TRAPPIST-1", distanceLy: 40.66, type: "star" },
      { id: "trappist-1e", name: "TRAPPIST-1 e", distanceLy: 40.66, type: "exoplanet" }
    ]
  };
}
