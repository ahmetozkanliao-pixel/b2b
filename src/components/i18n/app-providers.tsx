"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import { I18nProvider } from "./i18n-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";

export function AppProviders({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: Locale;
}) {
  return (
    <ThemeProvider>
      <I18nProvider initialLocale={initialLocale}>{children}</I18nProvider>
    </ThemeProvider>
  );
}
