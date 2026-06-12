import type { Dictionary } from "./dictionaries/types";

export function createTranslator(dictionary: Dictionary) {
  return function t(key: string): string {
    const parts = key.split(".");
    let value: unknown = dictionary;

    for (const part of parts) {
      if (value && typeof value === "object" && part in value) {
        value = (value as Record<string, unknown>)[part];
      } else {
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  };
}

export type Translator = ReturnType<typeof createTranslator>;
