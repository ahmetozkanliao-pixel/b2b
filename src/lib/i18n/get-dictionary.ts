import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/types";
import { tr } from "./dictionaries/tr";
import { en } from "./dictionaries/en";
import { createTranslator } from "./translate";

const dictionaries: Record<Locale, Dictionary> = { tr, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function getTranslator(locale: Locale) {
  return createTranslator(getDictionary(locale));
}
