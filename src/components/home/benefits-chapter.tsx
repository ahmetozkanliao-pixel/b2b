"use client";

import { Building2, Factory, Shield, Lock, Eye, Zap } from "lucide-react";
import { ChapterSection } from "@/components/home/chapter-section";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useI18n } from "@/components/i18n/i18n-provider";

export function BenefitsChapter() {
  const { t } = useI18n();

  const benefits = [
    {
      icon: Building2,
      title: t("home.benefits.demandTitle"),
      subtitle: t("home.benefits.demandSubtitle"),
      points: [t("home.benefits.demand1"), t("home.benefits.demand2"), t("home.benefits.demand3")],
    },
    {
      icon: Factory,
      title: t("home.benefits.producerTitle"),
      subtitle: t("home.benefits.producerSubtitle"),
      points: [t("home.benefits.producer1"), t("home.benefits.producer2"), t("home.benefits.producer3")],
    },
    {
      icon: Shield,
      title: t("home.benefits.platformTitle"),
      subtitle: t("home.benefits.platformSubtitle"),
      points: [t("home.benefits.platform1"), t("home.benefits.platform2"), t("home.benefits.platform3")],
    },
  ];

  const trustIcons = [
    { icon: Lock, label: t("home.benefits.trustKvkk") },
    { icon: Eye, label: t("home.benefits.trustTransparency") },
    { icon: Zap, label: t("home.benefits.trustSpeed") },
  ];

  return (
    <ChapterSection id="avantajlar" variant="white">
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
        <ScrollReveal className="max-w-3xl">
          <p className="editorial-label">{t("home.benefits.label")}</p>
          <h2 className="editorial-heading mt-6 text-4xl sm:text-5xl lg:text-6xl">
            {t("home.benefits.titleLine1")}
            <span className="block text-slate-500">{t("home.benefits.titleLine2")}</span>
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {benefits.map((benefit, index) => (
            <ScrollReveal key={benefit.title} delay={index * 100}>
              <div className="group h-full rounded-xl border border-primary-100 bg-white p-8 shadow-soft transition-all duration-300 hover:border-primary-200 hover:shadow-card-hover">
                <benefit.icon className="h-7 w-7 text-brand-600" />
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">
                  {benefit.subtitle}
                </p>
                <h3 className="mt-2 text-xl font-medium text-slate-900">{benefit.title}</h3>
                <ul className="mt-6 space-y-3">
                  {benefit.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200} className="mt-14 flex flex-wrap items-center justify-center gap-8 border-t border-primary-100 pt-10 lg:justify-start">
          {trustIcons.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-slate-500">
              <item.icon className="h-4 w-4 text-slate-400" />
              <span className="font-mono text-[10px] uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </ChapterSection>
  );
}
