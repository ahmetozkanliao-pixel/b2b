"use client";

import Link from "next/link";
import { MapPin, Calendar, Wallet, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCategoryLabel } from "@/lib/categories";
import { formatDate, formatBudget } from "@/lib/utils";
import { useI18n } from "@/components/i18n/i18n-provider";
import type { Category, Listing } from "@/types";

interface ListingCardProps {
  listing: Listing;
  categories?: Category[];
}

export function ListingCard({ listing, categories }: ListingCardProps) {
  const { t, locale } = useI18n();
  const categoryLabel = categories
    ? getCategoryLabel(categories, listing.category_id)
    : listing.category?.name;

  return (
    <Card hover className="group">
      <CardContent>
        <div className="mb-4 flex items-start justify-between gap-2">
          {(listing.category_id || listing.category) && categoryLabel && (
            <Badge variant="brand">{categoryLabel}</Badge>
          )}
        </div>

        <h3 className="line-clamp-2 text-lg font-medium text-white transition-colors group-hover:text-neutral-300">
          {listing.title}
        </h3>

        <div className="mt-4 space-y-2.5 text-sm text-neutral-400">
          {listing.city && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-neutral-500" />
              <span>{listing.city}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-neutral-500" />
            <span>{formatDate(listing.created_at, locale)}</span>
          </div>
          <div className="flex items-center gap-2 font-medium text-neutral-300">
            <Wallet className="h-4 w-4 shrink-0 text-neutral-400" />
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
        </div>

        <Link
          href={`/ilanlar/${listing.id}`}
          className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-white transition-colors hover:text-neutral-300"
        >
          {t("common.viewDetails")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
