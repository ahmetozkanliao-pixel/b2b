import Link from "next/link";
import { MapPin, Calendar, Wallet, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatBudget } from "@/lib/utils";
import type { Listing } from "@/types";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Card hover className="group">
      <CardContent>
        <div className="mb-4 flex items-start justify-between gap-2">
          {listing.category && (
            <Badge variant="brand">{listing.category.name}</Badge>
          )}
        </div>

        <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-primary-800 transition-colors">
          {listing.title}
        </h3>

        <div className="mt-4 space-y-2.5 text-sm text-slate-500">
          {listing.city && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
              <span>{listing.city}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
            <span>{formatDate(listing.created_at)}</span>
          </div>
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <Wallet className="h-4 w-4 shrink-0 text-brand-600" />
            <span>{formatBudget(listing.budget_min, listing.budget_max)}</span>
          </div>
        </div>

        <Link
          href={`/ilanlar/${listing.id}`}
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
        >
          Detay Gör
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
