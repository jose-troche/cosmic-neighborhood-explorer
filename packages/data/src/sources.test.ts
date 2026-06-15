import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchSourceSnapshot } from "./sources";

describe("source fetching", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("records per-source errors without failing the whole snapshot", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);

        if (url.includes("ssd-api.jpl.nasa.gov")) {
          return new Response("temporarily unavailable", { status: 503 });
        }

        if (url.includes("gea.esac.esa.int")) {
          return Response.json({ data: [[123, 10, 20, 100, 7.5, 1.2, 120, -80]] });
        }

        if (url.includes("exoplanetarchive.ipac.caltech.edu")) {
          return Response.json([{ pl_name: "Example b" }]);
        }

        return Response.json({ data: [["M  42", "HII", 83.8201, -5.3876, "M  42"]] });
      })
    );

    const snapshot = await fetchSourceSnapshot("2026-06-14T00:00:00.000Z");

    expect(snapshot.sourceStatuses).toContainEqual(
      expect.objectContaining({ id: "gaia", status: "ok", recordCount: 1 })
    );
    expect(snapshot.sourceStatuses).toContainEqual(
      expect.objectContaining({ id: "cneos", status: "error", message: expect.stringContaining("503") })
    );
    expect(snapshot.nearEarthObjects).toBeNull();
  });
});
