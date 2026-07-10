import { EnvSchema } from "./environment";

const parsedEnv = EnvSchema.parse(import.meta.env);

export const FeatureFlags = {
  pages: {
    blog: parsedEnv.FEATURES_PAGES_BLOG === "true",
    events: parsedEnv.FEATURES_PAGES_EVENTS === "true",
    games: parsedEnv.FEATURES_PAGES_GAMES === "true",
  }
} as const;

type FeatureCategory = keyof typeof FeatureFlags;
type FeatureName<T extends FeatureCategory> = keyof typeof FeatureFlags[T];


export function isEnabled<T extends FeatureCategory>(
  category: T,
  name: FeatureName<T>
): boolean {
  if (!(category in FeatureFlags)) return false;
  if (!(name in FeatureFlags[category])) return false;
  return FeatureFlags[category][name] as boolean;
}
