"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, Building2, Factory, MapPin } from "lucide-react";
import { getCompanyProfilePath } from "@/lib/utils";
import { useI18n } from "@/components/i18n/i18n-provider";
import type { Company } from "@/types";

interface CompanyShowcaseCardProps {
  company: Company;
  variant: "demand" | "producer";
}

export function CompanyShowcaseCard({ company, variant }: CompanyShowcaseCardProps) {
  const { t } = useI18n();
  const href = getCompanyProfilePath(company);

  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
          {company.logo_url ? (
            <Image
              src={company.logo_url}
              alt={company.name}
              width={48}
              height={48}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-neutral-400">
              {variant === "demand" ? (
                <Building2 className="h-5 w-5" />
              ) : (
                <Factory className="h-5 w-5" />
              )}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium text-white transition-colors group-hover:text-neutral-300">
              {company.name}
            </h3>
            {company.verified && (
              <BadgeCheck
                className="h-4 w-4 shrink-0 text-neutral-300"
                aria-label={t("common.verified")}
              />
            )}
          </div>
          {company.tagline && (
            <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{company.tagline}</p>
          )}
          {company.city && (
            <p className="mt-2 flex items-center gap-1 text-xs text-neutral-500">
              <MapPin className="h-3.5 w-3.5" />
              {company.city}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">
          {variant === "demand" ? t("roles.demand_owner") : t("roles.producer")}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-300 transition-transform group-hover:translate-x-0.5">
          {t("common.viewProfile")}
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
