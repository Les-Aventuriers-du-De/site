import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import * as yaml from "js-yaml";
import fs from "node:fs";

const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    updated: z.string(),
  }),
});

const credits = defineCollection({
  loader: async () => {
    const file = fs.readFileSync("src/data/crédits.yml", "utf8");
    const parsed = yaml.load(file) as { items: Record<string, any> };
    const r  = Object.entries(parsed.items).map(([id, value]) => ({
      id,
      ...value,
    }));
    return r;
  },
  schema: z.object({
    page: z.string(),
    author: z.string(),
    authorUrl: z.url(),
    license: z.string(),
    source: z.string(),
    sourceUrl: z.url(),
  }),
});

export const collections = { pages, credits };
