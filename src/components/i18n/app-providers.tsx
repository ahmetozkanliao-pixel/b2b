"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import { I18nProvider } from "./i18n-provider";

export function AppProviders({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: Locale;
}) {
  return <I18nProvider initialLocale={initialLocale}>{children}</I18nProvider>;
}
