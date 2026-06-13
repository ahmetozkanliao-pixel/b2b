"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  UserPlus,
  FileText,
  Send,
  CheckCircle,
  MessageCircle,
  Handshake,
  ArrowRight,
} from "lucide-react";
import { ChapterSection } from "@/components/home/chapter-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n/i18n-provider";

export function ProcessChapter() {
  const { t } = useI18n();
  const [activePhase, setActivePhase] = useState(0);

  const phases = useMemo(
    () => [
      {
        id: "baslangic",
        label: t("home.process.phaseStart"),
        steps: [
          {
            icon: UserPlus,
            title: t("home.process.stepRegister"),
            description: t("home.process.stepRegisterDesc"),
          },
          {
            icon: FileText,
            title: t("home.process.stepPublish"),
            description: t("home.process.stepPublishDesc"),
          },
        ],
      },
      {
        id: "eslesme",
        label: t("home.process.phaseMatch"),
        steps: [
          {
            icon: Send,
            title: t("home.process.stepApply"),
            description: t("home.process.stepApplyDesc"),
          },
          {
            icon: CheckCircle,
            title: t("home.process.stepCompare"),
            description: t("home.process.stepCompareDesc"),
          },
        ],
      },
      {
        id: "isbirligi",
        label: t("home.process.phaseCollab"),
        steps: [
          {
            icon: MessageCircle,
            title: t("home.process.stepMessage"),
            description: t("home.process.stepMessageDesc"),
          },
          {
            icon: Handshake,
            title: t("home.process.stepDeal"),
            description: t("home.process.stepDealDesc"),
          },
        ],
      },
    ],
    [t]
  );

  const phase = phases[activePhase];

  return (
    <ChapterSection id="surec" variant="dark">
      <div className="resend-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="editorial-label">{t("home.process.label")}</p>
            <h2 className="editorial-heading-light mt-6 text-4xl text-white sm:text-5xl lg:text-6xl">
              {t("home.process.titleLine1")}
              <span className="hero-gradient-text block">{t("home.process.titleLine2")}</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-neutral-400 sm:text-lg">
              {t("home.process.description")}
            </p>

            <div className="mt-10 flex flex-col gap-2">
              {phases.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActivePhase(index)}
                  className={cn(
                    "flex items-center gap-4 rounded-lg px-4 py-3 text-left transition-all duration-300",
                    activePhase === index
                      ? "bg-white/10 ring-1 ring-white/10"
                      : "opacity-60 hover:bg-white/5 hover:opacity-100"
                  )}
                >
                  <span className="font-mono text-[10px] tabular-nums text-neutral-500">
                    0{index + 1}
                  </span>
                  <span className="text-sm font-medium uppercase tracking-wider text-neutral-300">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            <Link href="/nasil-calisir" className="mt-10 hidden lg:inline-block">
              <Button
                variant="outline"
                className="rounded-lg border-white/20 bg-white/5 px-6 text-white hover:border-white/30 hover:bg-white/10"
              >
                {t("home.process.viewAllSteps")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-12 lg:col-span-7 lg:mt-0">
            <div key={phase.id} className="chapter-fade-in space-y-4">
              {phase.steps.map((step, stepIndex) => (
                <div
                  key={step.title}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-white/15 sm:p-8"
                  style={{ animationDelay: `${stepIndex * 100}ms` }}
                >
                  <div className="flex items-start gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                      <step.icon className="h-5 w-5 text-neutral-300" />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-neutral-500">
                        {t("home.process.stepLabel")} {activePhase * 2 + stepIndex + 1} · {phase.label}
                      </p>
                      <h3 className="mt-1 text-xl font-medium text-white">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-400 sm:text-base">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 text-center lg:hidden">
          <Link href="/nasil-calisir">
            <Button
              variant="outline"
              className="rounded-lg border-white/20 bg-white/5 px-6 text-white hover:border-white/30 hover:bg-white/10"
            >
              {t("home.process.viewAllSteps")}
            </Button>
          </Link>
        </div>
      </div>
    </ChapterSection>
  );
}
