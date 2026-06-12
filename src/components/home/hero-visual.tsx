"use client";

import { Building2, Factory, Shield, Sparkles } from "lucide-react";
import { useI18n } from "@/components/i18n/i18n-provider";
import { cn } from "@/lib/utils";

interface HeroVisualProps {
  className?: string;
}

export function HeroVisual({ className }: HeroVisualProps) {
  const { t } = useI18n();

  const activities = [
    { id: "quote", label: t("home.hero.visual.activity1"), className: "hero-visual-activity-1" },
    { id: "match", label: t("home.hero.visual.activity2"), className: "hero-visual-activity-2" },
    { id: "listing", label: t("home.hero.visual.activity3"), className: "hero-visual-activity-3" },
  ];

  return (
    <div className={cn("hero-visual", className)} aria-hidden>
      <div className="hero-visual-glow" />
      <div className="hero-visual-ring hero-visual-ring-1" />
      <div className="hero-visual-ring hero-visual-ring-2" />
      <div className="hero-visual-ring hero-visual-ring-3" />

      <svg className="hero-visual-connections" viewBox="0 0 400 400" fill="none">
        <path
          className="hero-visual-line hero-visual-line-1"
          d="M200 200 L80 120"
          pathLength={1}
        />
        <path
          className="hero-visual-line hero-visual-line-2"
          d="M200 200 L320 110"
          pathLength={1}
        />
        <path
          className="hero-visual-line hero-visual-line-3"
          d="M200 200 L340 260"
          pathLength={1}
        />
        <path
          className="hero-visual-line hero-visual-line-4"
          d="M200 200 L60 280"
          pathLength={1}
        />
        <circle className="hero-visual-pulse-dot hero-visual-pulse-dot-1" r="3" cx="80" cy="120" />
        <circle className="hero-visual-pulse-dot hero-visual-pulse-dot-2" r="3" cx="320" cy="110" />
        <circle className="hero-visual-pulse-dot hero-visual-pulse-dot-3" r="3" cx="340" cy="260" />
        <circle className="hero-visual-pulse-dot hero-visual-pulse-dot-4" r="3" cx="60" cy="280" />
      </svg>

      <div className="hero-visual-hub">
        <span className="hero-visual-hub-pulse hero-visual-hub-pulse-1" />
        <span className="hero-visual-hub-pulse hero-visual-hub-pulse-2" />
        <div className="hero-visual-hub-core">
          <Shield className="h-7 w-7 text-white sm:h-8 sm:w-8" strokeWidth={1.5} />
        </div>
      </div>

      <div className="hero-visual-orbit hero-visual-orbit-demand">
        <div className="hero-visual-node hero-visual-node-lg">
          <Building2 className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
        </div>
      </div>

      <div className="hero-visual-orbit hero-visual-orbit-producer">
        <div className="hero-visual-node hero-visual-node-lg">
          <Factory className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
        </div>
      </div>

      <div className="hero-visual-orbit hero-visual-orbit-satellite-a">
        <div className="hero-visual-node hero-visual-node-sm">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
        </div>
      </div>

      <div className="hero-visual-orbit hero-visual-orbit-satellite-b">
        <div className="hero-visual-node hero-visual-node-sm">
          <Building2 className="h-3.5 w-3.5" strokeWidth={1.5} />
        </div>
      </div>

      {activities.map((activity) => (
        <div key={activity.id} className={cn("hero-visual-activity", activity.className)}>
          <span className="hero-visual-activity-dot" />
          <span className="hero-visual-activity-text">{activity.label}</span>
        </div>
      ))}
    </div>
  );
}
