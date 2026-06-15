import { catalogSchema, type Catalog } from "@cosmic/shared";
import catalogSeed from "../../../packages/data/generated/catalog.v1.json";

const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";

export async function loadCatalog(): Promise<Catalog> {
  if (!apiBase) {
    return catalogSchema.parse(catalogSeed);
  }

  const response = await fetch(`${apiBase}/api/catalog`);

  if (!response.ok) {
    throw new Error(`Catalog request failed with ${response.status}`);
  }

  return catalogSchema.parse(await response.json());
}
