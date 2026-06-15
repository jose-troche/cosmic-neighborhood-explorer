const apiBaseUrl = process.env.COSMIC_API_BASE_URL?.replace(/\/$/, "");
const pagesUrl = process.env.COSMIC_PAGES_URL?.replace(/\/$/, "");

if (!apiBaseUrl || !pagesUrl) {
  throw new Error("COSMIC_API_BASE_URL and COSMIC_PAGES_URL are required.");
}

const checks: Array<{ name: string; url: string; assert: (response: Response, body: string) => void }> = [
  {
    name: "api health",
    url: `${apiBaseUrl}/api/health`,
    assert: (response, body) => {
      const health = parseJson(body) as { service?: string; sourceStatuses?: unknown[] };
      if (!response.ok || health.service !== "cosmic-neighborhood-api" || !Array.isArray(health.sourceStatuses)) {
        throw new Error(`Health check failed: ${response.status} ${body}`);
      }
    }
  },
  {
    name: "api catalog",
    url: `${apiBaseUrl}/api/catalog`,
    assert: (response, body) => {
      if (!response.ok || !body.includes("deepSkyObjects") || !body.includes("exoplanets")) {
        throw new Error(`Catalog check failed: ${response.status}`);
      }
    }
  },
  {
    name: "api insights",
    url: `${apiBaseUrl}/api/insights`,
    assert: (response, body) => {
      if (!response.ok || !body.includes("discoveryTimeline") || !body.includes("densityCells")) {
        throw new Error(`Insights check failed: ${response.status}`);
      }
    }
  },
  {
    name: "pages app",
    url: pagesUrl,
    assert: (response, body) => {
      if (!response.ok || !body.includes("Cosmic Neighborhood Explorer")) {
        throw new Error(`Pages check failed: ${response.status}`);
      }
    }
  }
];

for (const check of checks) {
  const response = await fetch(check.url);
  const body = await response.text();
  check.assert(response, body);
  console.log(`${check.name}: ok`);
}

function parseJson(body: string): unknown {
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

export {};
