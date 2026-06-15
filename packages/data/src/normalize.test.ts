import { describe, expect, it } from "vitest";
import { catalogSchema } from "@cosmic/shared";
import { buildCatalog } from "./pipeline";

describe("source normalization", () => {
  it("merges source snapshots into the generated catalog", () => {
    const catalog = buildCatalog("2026-06-14T00:00:00.000Z", {
      gaiaStars: {
        data: [[123456789, 10, 20, 100, 7.5, 1.2, 120, -80]]
      },
      exoplanets: [
        {
          pl_name: "Example b",
          hostname: "Example Star",
          sy_dist: 10,
          ra: 45,
          dec: -12,
          st_teff: 4100,
          st_lum: -0.5,
          pl_rade: 1.2,
          pl_masse: 2.4,
          pl_eqt: 255,
          disc_year: 2026,
          pl_orbper: 18.2
        }
      ],
      nearEarthObjects: {
        fields: ["des", "cd", "dist", "v_rel", "h", "fullname"],
        data: [["2026 AB", "2026-Jun-15 00:00", "0.03", "12.5", "21.5", "2026 AB"]]
      },
      simbadDeepSky: {
        data: [
          ["M  42", "HII", 83.8201, -5.3876],
          ["M   1", "SNR", 83.6324, 22.0174, "M   1"]
        ]
      },
      sourceStatuses: [
        {
          id: "gaia",
          name: "ESA Gaia Archive",
          url: "https://gea.esac.esa.int/archive/",
          status: "ok",
          fetchedAt: "2026-06-14T00:00:00.000Z",
          recordCount: 1
        }
      ]
    });

    expect(catalogSchema.safeParse(catalog).success).toBe(true);
    expect(catalog.stars.map((star) => star.id)).toContain("gaia-dr3-123456789");
    expect(catalog.stars.map((star) => star.id)).toContain("example-star");
    expect(catalog.exoplanets.map((planet) => planet.id)).toContain("example-b");
    expect(catalog.nearEarthObjects.some((object) => object.name === "2026 AB")).toBe(true);
    expect(catalog.deepSkyObjects.map((object) => object.id)).toContain("orion-nebula");
    expect(catalog.deepSkyObjects.map((object) => object.id)).toContain("crab-nebula");
    expect(catalog.sourceStatuses).toContainEqual(
      expect.objectContaining({ id: "gaia", status: "ok", recordCount: 1 })
    );
  });
});
