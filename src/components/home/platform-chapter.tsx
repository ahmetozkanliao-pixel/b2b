"use client";

import Link from "next/link";
import { ArrowRight, Building2, Factory, Shield } from "lucide-react";
import { ChapterSection } from "@/components/home/chapter-section";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/i18n-provider";

export function PlatformChapter() {
  const { t } = useI18n();

  return (
    <ChapterSection id="platform" variant="light">
      <div className="resend-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-20">
          <ScrollReveal>
            <p className="editorial-label">{t("home.platform.label")}</p>
            <h2 className="editorial-heading mt-6 text-4xl sm:text-5xl lg:text-6xl">
              <span className="block">{t("home.platform.title1")}</span>
              <span className="block text-neutral-500">{t("home.platform.title2")}</span>
              <span className="block">{t("home.platform.title3")}</span>
            </h2>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-neutral-400 sm:text-lg">
              {t("home.platform.description")}
            </p>
            <Link href="/kayit" className="mt-10 inline-block">
              <Button className="group rounded-lg px-6">
                {t("home.platform.joinCta")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={150} className="mt-16 lg:mt-0">
            <div className="relative">
              <div className="relative space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                <FlowRow
                  icon={Building2}
                  label={t("home.platform.flowDemandLabel")}
                  title={t("home.platform.flowDemandTitle")}
                  description={t("home.platform.flowDemandDesc")}
                />
                <div className="flex justify-center">
                  <div className="h-10 w-px bg-white/15" />
                </div>
                <FlowRow
                  icon={Shield}
                  label={t("home.platform.flowPlatformLabel")}
                  title={t("home.platform.flowPlatformTitle")}
                  description={t("home.platform.flowPlatformDesc")}
                  highlight
                />
                <div className="flex justify-center">
                  <div className="h-10 w-px bg-white/15" />
                </div>
                <FlowRow
                  icon={Factory}
                  label={t("home.platform.flowProducerLabel")}
                  title={t("home.platform.flowProducerTitle")}
                  description={t("home.platform.flowProducerDesc")}
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
  highlight,
}: {
  icon: typeof Building2;
  label: string;
  title: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-4 rounded-lg p-4 transition-colors ${
        highlight ? "bg-white/10 ring-1 ring-white/10" : "bg-white/[0.02]"
      }`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neutral-300">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-neutral-500">{label}</p>
        <p className="mt-1 text-lg font-medium text-white">{title}</p>
        <p className="mt-1 text-sm text-neutral-400">{description}</p>
      </div>
    </div>
  );
}
