import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, Building2, Factory, MapPin } from "lucide-react";
import { getCompanyProfilePath } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Company } from "@/types";

interface CompanyShowcaseCardProps {
  company: Company;
  variant: "demand" | "producer";
}

export function CompanyShowcaseCard({ company, variant }: CompanyShowcaseCardProps) {
  const href = getCompanyProfilePath(company);
  const isDemand = variant === "demand";

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-2xl border bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover",
        isDemand ? "border-primary-100/80 hover:border-primary-200" : "border-brand-100/80 hover:border-brand-200"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl",
            isDemand ? "bg-primary-50" : "bg-brand-50"
          )}
        >
          {company.logo_url ? (
            <Image
              src={company.logo_url}
              alt={company.name}
              width={56}
              height={56}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <span
              className={cn(
                "flex h-full w-full items-center justify-center text-white",
                isDemand ? "bg-primary-600" : "gradient-brand"
              )}
            >
              {isDemand ? (
                <Building2 className="h-6 w-6" />
              ) : (
                <Factory className="h-6 w-6" />
              )}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-900 transition-colors group-hover:text-brand-700">
              {company.name}
            </h3>
            {company.verified && (
              <BadgeCheck className="h-4 w-4 shrink-0 text-brand-500" aria-label="Doğrulanmış" />
            )}
          </div>
          {company.tagline && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{company.tagline}</p>
          )}
          {company.city && (
            <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="h-3.5 w-3.5" />
              {company.city}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {isDemand ? "Talep Sahibi" : "Üretici"}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 transition-transform group-hover:translate-x-0.5">
          Profili gör
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
