import Link from "next/link";
import { ArrowRight, Building2, Factory, Shield } from "lucide-react";
import { ChapterSection } from "@/components/home/chapter-section";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";

export function PlatformChapter() {
  return (
    <ChapterSection id="platform" variant="light">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(20,184,166,0.08),transparent_55%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-20">
          <ScrollReveal>
            <p className="editorial-label">02 — Platform</p>
            <h2 className="editorial-heading mt-6 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
              <span className="block">Türkiye&apos;nin</span>
              <span className="block text-brand-600">güvenilir B2B</span>
              <span className="block">üretim ağı.</span>
            </h2>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-slate-500 sm:text-lg">
              Kurumsal firmalar ihtiyaçlarını ilan olarak yayınlar; doğrulanmış üreticiler
              teklif verir. Tüm süreç tek platformda, şeffaf ve güvenli şekilde yönetilir.
            </p>
            <Link href="/kayit" className="mt-10 inline-block">
              <Button className="group rounded-full px-8 uppercase tracking-wider">
                Platforma Katıl
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={150} className="mt-16 lg:mt-0">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-100/50 to-primary-100/30 blur-2xl" />
              <div className="relative space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8">
                <FlowRow
                  icon={Building2}
                  label="Talep sahibi"
                  title="İlan yayınlar"
                  description="Bütçe, teslim süresi ve teknik detayları ekler."
                  color="primary"
                />
                <div className="flex justify-center">
                  <div className="h-10 w-px bg-gradient-to-b from-brand-300 to-brand-500" />
                </div>
                <FlowRow
                  icon={Shield}
                  label="Platform"
                  title="Eşleşme sağlar"
                  description="Doğrulanmış üreticilerden başvuru toplar."
                  color="brand"
                  highlight
                />
                <div className="flex justify-center">
                  <div className="h-10 w-px bg-gradient-to-b from-brand-300 to-emerald-400" />
                </div>
                <FlowRow
                  icon={Factory}
                  label="Üretici"
                  title="Teklif sunar"
                  description="Başvuru, mesajlaşma ve anlaşma tek yerde."
                  color="emerald"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </ChapterSection>
  );
}

function FlowRow({
  icon: Icon,
  label,
  title,
  description,
  color,
  highlight,
}: {
  icon: typeof Building2;
  label: string;
  title: string;
  description: string;
  color: "primary" | "brand" | "emerald";
  highlight?: boolean;
}) {
  const colors = {
    primary: "bg-primary-100 text-primary-600",
    brand: "bg-brand-100 text-brand-600",
    emerald: "bg-emerald-100 text-emerald-600",
  };

  return (
    <div
      className={`flex items-start gap-4 rounded-2xl p-4 transition-colors ${
        highlight ? "bg-brand-50/80 ring-1 ring-brand-200/60" : "bg-slate-50/50"
      }`}
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colors[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
        <p className="mt-1 font-display text-xl font-light text-slate-900">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}
