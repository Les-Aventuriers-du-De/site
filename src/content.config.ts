import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    updated: z.string(),
  }),
});

export const collections = { pages };
