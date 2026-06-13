"use client";

import { Building2, Factory } from "lucide-react";
import { ChapterSection } from "@/components/home/chapter-section";
import { CompanyShowcaseCard } from "@/components/home/company-showcase-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useI18n } from "@/components/i18n/i18n-provider";
import type { Company } from "@/types";

interface CompaniesShowcaseProps {
  demand: Company[];
  producers: Company[];
}

function CompanyGroup({
  title,
  subtitle,
  companies,
  variant,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  companies: Company[];
  variant: "demand" | "producer";
  icon: typeof Building2;
}) {
  if (companies.length === 0) return null;

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neutral-300">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-2xl font-medium text-white sm:text-3xl">{title}</h3>
          <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {companies.map((company, index) => (
          <ScrollReveal key={company.id} delay={index * 80}>
            <CompanyShowcaseCard company={company} variant={variant} />
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

export function CompaniesShowcase({ demand, producers }: CompaniesShowcaseProps) {
  const { t } = useI18n();

  if (demand.length === 0 && producers.length === 0) return null;

  return (
    <ChapterSection id="firmalar" variant="dark" className="!min-h-0">
      <div className="resend-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <p className="editorial-label">{t("home.companies.references")}</p>
          <h2 className="editorial-heading-light mt-4 text-4xl text-white sm:text-5xl lg:text-6xl">
            {t("home.companies.title")}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-400 sm:text-lg">
            {t("home.companies.description")}
          </p>
        </ScrollReveal>

        <div className="mt-16 space-y-20">
          <CompanyGroup
            title={t("home.companies.demandTitle")}
            subtitle={t("home.companies.demandSubtitle")}
            companies={demand}
            variant="demand"
            icon={Building2}
          />

          <div className="h-px bg-white/10" />

          <CompanyGroup
            title={t("home.companies.producerTitle")}
            subtitle={t("home.companies.producerSubtitle")}
            companies={producers}
            variant="producer"
            icon={Factory}
          />
        </div>
      </div>
    </ChapterSection>
  );
}
