import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { enUS, tr } from "date-fns/locale";
import type { Locale } from "@/lib/i18n/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getDateFnsLocale(locale: Locale = "tr") {
  return locale === "en" ? enUS : tr;
}

export function formatDate(date: string | Date, locale: Locale = "tr") {
  return format(new Date(date), "d MMMM yyyy", { locale: getDateFnsLocale(locale) });
}

export function formatRelativeDate(date: string | Date, locale: Locale = "tr") {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: getDateFnsLocale(locale) });
}

export function formatCurrency(amount: number, locale: Locale = "tr") {
  const intlLocale = locale === "en" ? "en-US" : "tr-TR";
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatBudget(
  min?: number | null,
  max?: number | null,
  locale: Locale = "tr",
  notSpecified = "Belirtilmemiş",
  maxLabel = "En fazla"
) {
  if (!min && !max) return notSpecified;
  if (min && max) return `${formatCurrency(min, locale)} - ${formatCurrency(max, locale)}`;
  if (min) return `${formatCurrency(min, locale)}+`;
  return locale === "en"
    ? `Up to ${formatCurrency(max!, locale)}`
    : `${maxLabel} ${formatCurrency(max!, locale)}`;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getCompanyProfilePath(company: { slug?: string | null; id: string }) {
  return `/firma/${company.slug || company.id}`;
}
