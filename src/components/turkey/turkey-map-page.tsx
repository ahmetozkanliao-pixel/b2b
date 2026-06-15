"use client";

import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";
import { TurkeyMap } from "@/components/turkey/turkey-map";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/i18n-provider";

export function TurkeyMapPage() {
  const { t } = useI18n();

  const stats = [
    { value: "81", label: t("turkey.statProvinces") },
    { value: "2.400+", label: t("turkey.statSuppliers") },
    { value: "8.500+", label: t("turkey.statListings") },
  ];

  return (
    <div className="bg-page">
      <section className="surface-dark relative overflow-hidden gradient-hero">
        <div className="hero-orb hero-orb-delay-1 -left-16 top-16 h-64 w-64 bg-brand-500/20" aria-hidden />
        <div className="hero-orb hero-orb-delay-2 right-0 top-1/4 h-80 w-80 bg-primary-400/20" aria-hidden />
        <div className="resend-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="editorial-label">{t("turkey.label")}</p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {t("turkey.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {t("turkey.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/kayit?tip=uretici">
              <Button size="lg" className="group h-11">
                {t("turkey.ctaProducer")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/ilanlar">
              <Button
                size="lg"
                variant="outline"
                className="h-11 border-white/20 bg-white/5 text-white hover:border-white/30 hover:bg-white/10"
              >
                {t("turkey.ctaListings")}
              </Button>
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4"
              >
                <p className="text-2xl font-bold text-brand-300">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-dark relative overflow-hidden bg-primary-950 pb-20 pt-10 sm:pb-24 sm:pt-14">
        <div className="resend-grid pointer-events-none absolute inset-0 opacity-20" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.1),transparent_65%)]" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 ring-1 ring-brand-400/25">
              <Map className="h-5 w-5 text-brand-300" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white">{t("turkey.mapTitle")}</h2>
              <p className="text-sm text-slate-400">{t("turkey.mapSubtitle")}</p>
            </div>
          </div>

          <TurkeyMap />
        </div>
      </section>
    </div>
  );
}
