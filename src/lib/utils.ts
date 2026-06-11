import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return format(new Date(date), "d MMMM yyyy", { locale: tr });
}

export function formatRelativeDate(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: tr });
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatBudget(min?: number | null, max?: number | null) {
  if (!min && !max) return "Belirtilmemiş";
  if (min && max) return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  if (min) return `${formatCurrency(min)}+`;
  return `En fazla ${formatCurrency(max!)}`;
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
