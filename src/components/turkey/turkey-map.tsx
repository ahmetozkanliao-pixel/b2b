"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Building2, Factory, FileText, MousePointer2, Radar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n/i18n-provider";
import provincesData from "@/lib/turkey-map/provinces.json";
import {
  getProvinceActivity,
  HUB_CONNECTIONS,
  TURKEY_HUBS,
  TURKISH_PROVINCE_NAMES,
  type ProvinceActivity,
} from "@/lib/turkey-map/activity";

interface Province {
  id: string;
  code: string;
  name: string;
  d: string;
}

const VIEWBOX = "0 0 1000 422";
const TOUR_INTERVAL_MS = 2200;

function getFillColor(
  activity: ProvinceActivity,
  state: "default" | "auto" | "hover"
) {
  if (state === "hover") return "rgba(94, 234, 212, 0.95)";
  if (state === "auto") return "rgba(20, 184, 166, 0.88)";

  switch (activity.level) {
    case "high":
      return "rgba(42, 68, 112, 0.82)";
    case "medium":
      return "rgba(30, 51, 88, 0.68)";
    default:
      return "rgba(22, 38, 68, 0.52)";
  }
}

export function TurkeyMap() {
  const { t, locale } = useI18n();
  const provinces = provincesData as Province[];
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);
  const [activeCode, setActiveCode] = useState<string | null>(null);

  const tourCodes = useMemo(
    () =>
      [...provinces]
        .sort((a, b) => Number(a.code) - Number(b.code))
        .map((province) => province.code),
    [provinces]
  );

  useEffect(() => {
    if (tourCodes.length === 0 || hoveredCode) return;

    setActiveCode(tourCodes[0]);
    let index = 0;

    const timer = window.setInterval(() => {
      index = (index + 1) % tourCodes.length;
      setActiveCode(tourCodes[index]);
    }, TOUR_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [tourCodes, hoveredCode]);

  const focusCode = hoveredCode ?? activeCode;
  const focusProvince = provinces.find((p) => p.code === focusCode);
  const focusActivity = focusProvince ? getProvinceActivity(focusProvince.code) : null;
  const isUserExploring = Boolean(hoveredCode);

  const displayName = useCallback(
    (province: Province) => {
      if (locale === "tr" && TURKISH_PROVINCE_NAMES[province.code]) {
        return TURKISH_PROVINCE_NAMES[province.code];
      }
      return province.name;
    },
    [locale]
  );

  const totals = useMemo(() => {
    return provinces.reduce(
      (acc, province) => {
        const activity = getProvinceActivity(province.code);
        acc.suppliers += activity.suppliers;
        acc.customers += activity.customers;
        acc.listings += activity.listings;
        return acc;
      },
      { suppliers: 0, customers: 0, listings: 0 }
    );
  }, [provinces]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
      <div>
        <div className="turkey-map-shell relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-5">
          <div className="turkey-map-orb turkey-map-orb-1" aria-hidden />
          <div className="turkey-map-orb turkey-map-orb-2" aria-hidden />

          {focusProvince && (
            <div
              className={cn(
                "absolute left-3 top-3 z-20 flex items-center gap-2 rounded-xl border px-3 py-2 text-sm shadow-lg backdrop-blur-md sm:left-4 sm:top-4",
                isUserExploring
                  ? "border-white/25 bg-white/15 text-white"
                  : "border-brand-400/30 bg-brand-500/15 text-brand-50"
              )}
            >
              {isUserExploring ? (
                <MousePointer2 className="h-4 w-4 shrink-0 text-brand-200" />
              ) : (
                <Radar className="h-4 w-4 shrink-0 animate-pulse text-brand-300" />
              )}
              <span className="font-semibold">{displayName(focusProvince)}</span>
              <span className="hidden text-xs text-slate-300 sm:inline">
                · {isUserExploring ? t("turkey.exploring") : t("turkey.autoTour")}
              </span>
            </div>
          )}

          <svg
            viewBox={VIEWBOX}
            className="relative z-10 h-auto w-full"
            role="img"
            aria-label={t("turkey.mapAria")}
          >
            <defs>
              <linearGradient id="turkey-map-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#2a4470" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.45" />
              </linearGradient>
              <filter id="turkey-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="turkey-glow-strong" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width="1000" height="422" fill="url(#turkey-map-gradient)" className="turkey-map-shimmer" />

            <g className="turkey-map-connections" aria-hidden>
              {HUB_CONNECTIONS.map(([from, to], index) => {
                const a = TURKEY_HUBS[from];
                const b = TURKEY_HUBS[to];
                return (
                  <line
                    key={`${a.id}-${b.id}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    className="turkey-map-connection"
                    style={{ animationDelay: `${index * 0.35}s` }}
                  />
                );
              })}
            </g>

            <g>
              {provinces.map((province) => {
                const activity = getProvinceActivity(province.code);
                const isHovered = hoveredCode === province.code;
                const isAuto = activeCode === province.code && !hoveredCode;
                const state = isHovered ? "hover" : isAuto ? "auto" : "default";

                return (
                  <path
                    key={province.id}
                    d={province.d}
                    fill={getFillColor(activity, state)}
                    stroke={
                      isHovered ? "#ffffff" : isAuto ? "#5eead4" : "rgba(148, 163, 184, 0.28)"
                    }
                    strokeWidth={isHovered ? 2.2 : isAuto ? 1.6 : 0.6}
                    className={cn(
                      "turkey-map-province transition-all duration-300",
                      isAuto && "turkey-map-province-active",
                      isHovered && "turkey-map-province-hover"
                    )}
                    filter={isHovered ? "url(#turkey-glow-strong)" : isAuto ? "url(#turkey-glow)" : undefined}
                    onMouseEnter={() => setHoveredCode(province.code)}
                    onMouseLeave={() => setHoveredCode(null)}
                    onFocus={() => setHoveredCode(province.code)}
                    onBlur={() => setHoveredCode(null)}
                    tabIndex={0}
                    role="button"
                    aria-label={displayName(province)}
                  />
                );
              })}
            </g>

            <g aria-hidden>
              {TURKEY_HUBS.map((hub, index) => (
                <g key={hub.id} transform={`translate(${hub.x}, ${hub.y})`}>
                  <circle r="10" className="turkey-map-hub-pulse" style={{ animationDelay: `${index * 0.4}s` }} />
                  <circle r="4.5" className="turkey-map-hub-core" />
                </g>
              ))}
            </g>
          </svg>
        </div>

        <p className="mt-4 text-center text-sm leading-relaxed text-slate-400">
          {t("turkey.liveNote")}
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-300">
            {t("turkey.networkLabel")}
          </p>
          <h3 className="mt-2 text-xl font-bold text-white">
            {focusProvince ? displayName(focusProvince) : t("turkey.allTurkey")}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {focusProvince ? t("turkey.provinceHint") : t("turkey.defaultHint")}
          </p>

          {focusActivity && (
            <dl className="mt-5 grid grid-cols-3 gap-3">
              <StatPill icon={Factory} label={t("turkey.suppliers")} value={focusActivity.suppliers} />
              <StatPill icon={Building2} label={t("turkey.customers")} value={focusActivity.customers} />
              <StatPill icon={FileText} label={t("turkey.listings")} value={focusActivity.listings} />
            </dl>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
            {t("turkey.totalLabel")}
          </p>
          <dl className="mt-4 space-y-3">
            <TotalRow icon={Factory} label={t("turkey.suppliers")} value={totals.suppliers} />
            <TotalRow icon={Building2} label={t("turkey.customers")} value={totals.customers} />
            <TotalRow icon={FileText} label={t("turkey.listings")} value={totals.listings} />
          </dl>
        </div>
      </div>
    </div>
  );
}

function StatPill({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Factory;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-primary-900/50 px-3 py-3 text-center">
      <Icon className="mx-auto h-4 w-4 text-brand-300" />
      <dt className="mt-2 text-[10px] uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-white">{value}</dd>
    </div>
  );
}

function TotalRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Factory;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
      <span className="flex items-center gap-2 text-sm text-slate-300">
        <Icon className="h-4 w-4 text-brand-400" />
        {label}
      </span>
      <span className="font-semibold text-white">{value.toLocaleString("tr-TR")}</span>
    </div>
  );
}
