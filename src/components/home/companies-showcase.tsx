import { Building2, Factory } from "lucide-react";
import { ChapterSection } from "@/components/home/chapter-section";
import { CompanyShowcaseCard } from "@/components/home/company-showcase-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
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

  const isDemand = variant === "demand";

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            isDemand ? "bg-primary-100 text-primary-600" : "bg-brand-100 text-brand-600"
          }`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-display text-2xl font-light text-slate-900 sm:text-3xl">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
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
  if (demand.length === 0 && producers.length === 0) return null;

  return (
    <ChapterSection id="firmalar" variant="light" className="!min-h-0">
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <p className="editorial-label">Referanslar</p>
          <h2 className="editorial-heading mt-4 text-4xl sm:text-5xl lg:text-6xl">
            Platformdaki firmalar
          </h2>
          <p className="mt-6 text-base leading-relaxed text-slate-500 sm:text-lg">
            Doğrulanmış talep sahipleri ve üreticiler — profile tıklayarak detayları inceleyin.
          </p>
        </ScrollReveal>

        <div className="mt-16 space-y-20">
          <CompanyGroup
            title="Talep eden kurumsal firmalar"
            subtitle="İhtiyaçlarını platformda ilan olarak yayınlayan firmalar"
            companies={demand}
            variant="demand"
            icon={Building2}
          />

          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          <CompanyGroup
            title="Üretici firmalar"
            subtitle="Doğrulanmış üretim kapasitesiyle teklif sunan firmalar"
            companies={producers}
            variant="producer"
            icon={Factory}
          />
        </div>
      </div>
    </ChapterSection>
  );
}
