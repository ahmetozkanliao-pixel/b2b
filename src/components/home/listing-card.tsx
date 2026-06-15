"use client";

import Link from "next/link";
import { MapPin, Calendar, Wallet, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCategoryLabel } from "@/lib/categories";
import { formatDate, formatBudget } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n/i18n-provider";
import type { Category, Listing } from "@/types";

interface ListingCardProps {
  listing: Listing;
  categories?: Category[];
  variant?: "light" | "dark";
}

export function ListingCard({ listing, categories, variant = "light" }: ListingCardProps) {
  const { t, locale } = useI18n();
  const categoryLabel = categories
    ? getCategoryLabel(categories, listing.category_id)
    : listing.category?.name;
  const isDark = variant === "dark";

  return (
    <Card hover variant={variant}>
      <CardContent>
        <div className="mb-4 flex items-start justify-between gap-2">
          {(listing.category_id || listing.category) && categoryLabel && (
            <Badge variant="brand">{categoryLabel}</Badge>
          )}
        </div>

        <h3
          className={cn(
            "line-clamp-2 text-lg font-medium transition-colors",
            isDark
              ? "text-white group-hover:text-neutral-300"
              : "text-slate-900 group-hover:text-brand-600"
          )}
        >
          {listing.title}
        </h3>

        <div
          className={cn(
            "mt-4 space-y-2.5 text-sm",
            isDark ? "text-neutral-400" : "text-slate-600"
          )}
        >
          {listing.city && (
            <div className="flex items-center gap-2">
              <MapPin
                className={cn("h-4 w-4 shrink-0", isDark ? "text-neutral-500" : "text-slate-400")}
              />
              <span>{listing.city}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar
              className={cn("h-4 w-4 shrink-0", isDark ? "text-neutral-500" : "text-slate-400")}
            />
            <span>{formatDate(listing.created_at, locale)}</span>
          </div>
          {(listing.budget_min || listing.budget_max) && (
            <div
              className={cn(
                "flex items-center gap-2 font-medium",
                isDark ? "text-neutral-300" : "text-slate-800"
              )}
            >
              <Wallet
                className={cn("h-4 w-4 shrink-0", isDark ? "text-neutral-400" : "text-slate-500")}
              />
              <span>
                {formatBudget(
                  listing.budget_min,
                  listing.budget_max,
                  locale,
                  t("common.notSpecified"),
                  locale === "en" ? "Up to" : "En fazla"
                )}
              </span>
            </div>
          )}
        </div>

        <Link
          href={`/ilanlar/${listing.id}`}
          className={cn(
            "mt-5 inline-flex items-center gap-1 text-sm font-medium transition-colors",
            isDark
              ? "text-brand-600 hover:text-brand-500"
              : "text-brand-600 hover:text-brand-700"
          )}
        >
          {t("common.viewDetails")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
