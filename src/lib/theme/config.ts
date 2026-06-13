export const THEME_STORAGE_KEY = "b2b-theme";
export const THEME_COOKIE = "b2b_theme";

export type Theme = "light" | "dark";

export const DEFAULT_THEME: Theme = "light";

export function isTheme(value: string | null | undefined): value is Theme {
  return value === "light" || value === "dark";
}
