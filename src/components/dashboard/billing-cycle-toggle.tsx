"use client";

import {
  PRODUCER_PRO_MONTHLY_PRICE,
  PRODUCER_PRO_YEARLY_PRICE,
  getProducerProPrice,
  type ProducerBillingCycle,
} from "@/lib/membership";
import { cn, formatCurrency } from "@/lib/utils";

interface BillingCycleToggleProps {
  value: ProducerBillingCycle;
  onChange: (value: ProducerBillingCycle) => void;
  className?: string;
}

export function BillingCycleToggle({ value, onChange, className }: BillingCycleToggleProps) {
  const isYearly = value === "yearly";

  return (
    <div
      className={cn("w-full sm:max-w-xs", className)}
      role="tablist"
      aria-label="Ödeme periyodu"
    >
      <div className="relative grid h-11 grid-cols-2 rounded-full border border-slate-200/80 bg-slate-100/90 p-1 shadow-inner">
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-[0_2px_8px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80 transition-transform duration-300 ease-[cubic-bezier(0.34,1.2,0.64,1)]",
            isYearly && "translate-x-[calc(100%+0.5rem)]"
          )}
        />

        <button
          type="button"
          role="tab"
          aria-selected={!isYearly}
          onClick={() => onChange("monthly")}
          className={cn(
            "relative z-10 rounded-full text-sm font-semibold transition-colors duration-200",
            !isYearly ? "text-brand-700" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Aylık
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={isYearly}
          onClick={() => onChange("yearly")}
          className={cn(
            "relative z-10 flex items-center justify-center gap-1.5 rounded-full text-sm font-semibold transition-colors duration-200",
            isYearly ? "text-brand-700" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Yıllık
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-colors duration-200",
              isYearly
                ? "bg-brand-100 text-brand-700"
                : "bg-slate-200/80 text-slate-500"
            )}
          >
            -17%
          </span>
        </button>
      </div>
    </div>
  );
}

export function BillingPriceSummary({ billing }: { billing: ProducerBillingCycle }) {
  const price = getProducerProPrice(billing);
  const yearlySavings = PRODUCER_PRO_MONTHLY_PRICE * 12 - PRODUCER_PRO_YEARLY_PRICE;

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 transition-colors duration-300",
        billing === "yearly"
          ? "border-brand-200/80 bg-brand-50/40"
          : "border-slate-200 bg-slate-50/80"
      )}
    >
      <p className="text-3xl font-bold text-slate-900">
        {formatCurrency(price)}
        <span className="text-base font-normal text-slate-500">
          {billing === "monthly" ? " / ay" : " / yıl"}
        </span>
      </p>
      <p className="mt-2 text-sm text-slate-600">
        {billing === "monthly"
          ? "Her ay yenilenir, istediğiniz zaman iptal edebilirsiniz."
          : `Yıllık tek ödeme — ${formatCurrency(yearlySavings)} tasarruf (12 aylık aylık ödemeye göre).`}
      </p>
    </div>
  );
}
