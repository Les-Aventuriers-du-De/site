import { z } from "astro/zod";

export const EnvSchema = z.object({
  FEATURES_PAGES_BLOG: z.enum(["true", "false"]).default("false"),
  FEATURES_PAGES_EVENTS: z.enum(["true", "false"]).default("false"),
  FEATURES_PAGES_GAMES: z.enum(["true", "false"]).default("false"),
});
