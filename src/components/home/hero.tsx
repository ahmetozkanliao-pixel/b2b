"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { HeroVisual } from "@/components/home/hero-visual";
import { useI18n } from "@/components/i18n/i18n-provider";

export function Hero() {
  const { t } = useI18n();

  const stats = [
    { value: "2.400+", label: t("home.hero.stat1") },
    { value: "8.500+", label: t("home.hero.stat2") },
    { value: "%94", label: t("home.hero.stat3") },
  ];

  return (
    <section
      id="giris"
      data-chapter="giris"
      className="relative flex min-h-screen flex-col overflow-hidden bg-ambient"
    >
      <div className="resend-grid absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute inset-0 section-ambient" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(160,160,180,0.1),transparent_50%),radial-gradient(ellipse_at_70%_80%,rgba(100,100,120,0.07),transparent_45%)]"
        aria-hidden
      />

      <div className="relative mx-auto flex flex-1 w-full max-w-7xl flex-col justify-center px-4 pb-28 pt-[5.5rem] sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="hero-fade-up hero-fade-up-1 editorial-label">
              {t("home.hero.label")}
            </p>

            <h1 className="hero-fade-up hero-fade-up-2 editorial-heading-light mt-5 text-4xl sm:text-5xl lg:text-6xl xl:text-[3.5rem]">
              <span className="block">{t("home.hero.title1")}</span>
              <span className="block text-neutral-400">{t("home.hero.title2")}</span>
              <span className="block">{t("home.hero.title3")}</span>
            </h1>

            <p className="hero-fade-up hero-fade-up-3 mt-6 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
              {t("home.hero.subtitle")}
            </p>

            <div className="hero-fade-up hero-fade-up-4 mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/kayit?tip=talep" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="group h-11 w-full min-w-[200px] rounded-lg bg-white px-6 text-sm font-medium text-black hover:bg-neutral-200 sm:w-auto"
                >
                  {t("home.hero.ctaDemand")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/kayit?tip=uretici" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 w-full min-w-[200px] rounded-lg border-white/15 bg-transparent px-6 text-sm font-medium text-white hover:border-white/30 hover:bg-white/5 sm:w-auto"
                >
                  {t("home.hero.ctaProducer")}
                </Button>
              </Link>
            </div>

            <div className="hero-fade-up hero-fade-up-5 mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-xl font-semibold text-white sm:text-2xl">{stat.value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-neutral-500 sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-fade-up hero-fade-up-3 flex items-center justify-center py-4 sm:py-8 lg:justify-end">
            <HeroVisual className="mx-auto w-full max-w-[520px] lg:mr-4" />
          </div>
        </div>
      </div>

      <a
        href="#platform"
        className="hero-fade-up hero-fade-up-6 absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-neutral-500 transition-colors hover:text-white"
        aria-label={t("home.chapters.scrollToPlatform")}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
          {t("home.hero.scrollHint")}
        </span>
        <ChevronDown className="scroll-indicator h-5 w-5" />
      </a>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
    </section>
  );
}
