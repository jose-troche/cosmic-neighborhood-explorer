import { catalogSchema, factsSchema, insightsSchema } from "@cosmic/shared";
import catalogSeed from "../../../packages/data/generated/catalog.v1.json";
import factsSeed from "../../../packages/data/generated/facts.v1.json";
import insightsSeed from "../../../packages/data/generated/insights.v1.json";
import { createApp, refreshCache } from "./app";

const app = createApp();

export default {
  fetch: app.fetch,
  scheduled: async (_event: ScheduledController, env: Env, ctx: ExecutionContext) => {
    const catalog = catalogSchema.parse(catalogSeed);
    const facts = factsSchema.parse(factsSeed);
    const insights = insightsSchema.parse(insightsSeed);
    ctx.waitUntil(refreshCache(env, catalog, facts, insights));
  }
};
