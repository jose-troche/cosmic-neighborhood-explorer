import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { SourceStatus } from "@cosmic/shared";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

type SourceSnapshot = {
  generatedAt: string;
  gaiaStars: unknown;
  exoplanets: unknown;
  nearEarthObjects: unknown;
  simbadDeepSky: unknown;
  sourceStatuses: SourceStatus[];
};

const gaiaTapQuery = `
select top 500
  source_id, ra, dec, parallax, phot_g_mean_mag, bp_rp, pmra, pmdec
from gaiadr3.gaia_source
where parallax > 40 and phot_g_mean_mag is not null
order by parallax desc
`;

const exoplanetTapQuery = `
select top 200
  pl_name, hostname, sy_dist, ra, dec, st_teff, st_lum, pl_rade, pl_masse, pl_eqt, disc_year, pl_orbper
from pscomppars
where sy_dist < 50 and sy_dist is not null
order by sy_dist asc
`;

const simbadIdentifiers = [
  "M  1",
  "M  8",
  "M 13",
  "M 16",
  "M 17",
  "M 20",
  "M 27",
  "M 31",
  "M 42",
  "M 45",
  "M 57",
  "M 81",
  "M 82",
  "NGC 104",
  "NGC 3372",
  "NGC 5139",
  "LMC",
  "SMC"
];

const simbadTapQuery = `
select top 50
  b.main_id, b.otype, b.ra, b.dec, i.id
from basic as b
join ident as i on b.oid = i.oidref
where i.id in (${simbadIdentifiers.map((id) => `'${id}'`).join(", ")})
`;

type SourceFetch = {
  id: string;
  name: string;
  url: string;
  run: () => Promise<unknown>;
  countRecords: (value: unknown) => number;
};

async function fetchJson(url: string, init?: RequestInit): Promise<unknown> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`${url} failed with ${response.status}`);
  }
  return response.json();
}

export async function fetchSourceSnapshot(generatedAt = new Date().toISOString()): Promise<SourceSnapshot> {
  const sourceRequests: [SourceFetch, SourceFetch, SourceFetch, SourceFetch] = [
    {
      id: "gaia",
      name: "ESA Gaia Archive",
      url: "https://gea.esac.esa.int/archive/",
      run: () =>
        fetchJson("https://gea.esac.esa.int/tap-server/tap/sync", {
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            REQUEST: "doQuery",
            LANG: "ADQL",
            FORMAT: "json",
            QUERY: gaiaTapQuery
          })
        }),
      countRecords: (value: unknown) => countArray((value as { data?: unknown }).data)
    },
    {
      id: "exoplanet-archive",
      name: "NASA Exoplanet Archive TAP",
      url: "https://exoplanetarchive.ipac.caltech.edu/TAP/",
      run: () =>
        fetchJson(
          `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=${encodeURIComponent(exoplanetTapQuery)}&format=json`
        ),
      countRecords: countArray
    },
    {
      id: "cneos",
      name: "NASA/JPL SBDB Close-Approach Data API",
      url: "https://ssd-api.jpl.nasa.gov/cad.api",
      run: () => fetchJson("https://ssd-api.jpl.nasa.gov/cad.api?date-min=now&dist-max=0.2&sort=date&fullname=true"),
      countRecords: (value: unknown) => countArray((value as { data?: unknown }).data)
    },
    {
      id: "simbad",
      name: "SIMBAD Astronomical Database",
      url: "https://simbad.cds.unistra.fr/simbad/",
      run: () =>
        fetchJson("https://simbad.cds.unistra.fr/simbad/sim-tap/sync", {
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            request: "doQuery",
            lang: "adql",
            format: "json",
            query: simbadTapQuery
          })
        }),
      countRecords: (value: unknown) => countArray((value as { data?: unknown }).data)
    }
  ];
  const [gaia, exoplanets, nearEarthObjects, simbad] = await Promise.all(
    [
      fetchSource(sourceRequests[0], generatedAt),
      fetchSource(sourceRequests[1], generatedAt),
      fetchSource(sourceRequests[2], generatedAt),
      fetchSource(sourceRequests[3], generatedAt)
    ]
  );

  return {
    generatedAt,
    gaiaStars: gaia.value,
    exoplanets: exoplanets.value,
    nearEarthObjects: nearEarthObjects.value,
    simbadDeepSky: simbad.value,
    sourceStatuses: [gaia.status, exoplanets.status, nearEarthObjects.status, simbad.status]
  };
}

async function fetchSource(source: SourceFetch, fetchedAt: string): Promise<{ value: unknown; status: SourceStatus }> {
  try {
    const value = await source.run();
    return {
      value,
      status: {
        id: source.id,
        name: source.name,
        url: source.url,
        status: "ok",
        fetchedAt,
        recordCount: source.countRecords(value)
      }
    };
  } catch (error) {
    return {
      value: null,
      status: {
        id: source.id,
        name: source.name,
        url: source.url,
        status: "error",
        fetchedAt,
        message: error instanceof Error ? error.message : "Source fetch failed."
      }
    };
  }
}

function countArray(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}

async function writeJson(path: string, value: unknown) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const snapshot = await fetchSourceSnapshot();
  await writeJson(resolve(packageRoot, "source-cache/source-snapshot.json"), snapshot);
}
