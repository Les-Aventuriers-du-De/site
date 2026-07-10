// src/scripts/theme.ts
export type Theme = "light" | "dark" | "system";

export const getTheme = (): Theme => {
  return (localStorage.getItem("theme") as Theme) ?? "system";
};

export const resolveTheme = (mode: Theme): "light" | "dark" => {
  if (mode !== "system") {
    return mode;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const applyTheme = (mode = getTheme()) => {
  document.documentElement.dataset.theme = resolveTheme(mode);
};

export const setTheme = (mode: Theme) => {
  localStorage.setItem("theme", mode);
  applyTheme(mode);
};
