import { getCollection, type CollectionEntry } from "astro:content";

const credits = await getCollection("credits")

export type Credits = CollectionEntry<"credits">["data"];

export const creditFor = (name: string): Credits | undefined =>
  credits.find((credit) => credit.id === name)?.data;
