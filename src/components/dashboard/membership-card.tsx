"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Crown,
  Check,
  X,
  Sparkles,
  Headphones,
  BarChart3,
  Link2,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BillingCycleToggle,
  BillingPriceSummary,
} from "@/components/dashboard/billing-cycle-toggle";
import {
  PRODUCER_PLAN_FEATURES,
  PRODUCER_PRO_MONTHLY_PRICE,
  PRODUCER_PRO_YEARLY_PRICE,
  PRODUCER_FREE_MONTHLY_APPLICATION_LIMIT,
  getProducerProPrice,
  type ProducerBillingCycle,
  type ProducerPlan,
} from "@/lib/membership";
import { cn, formatCurrency } from "@/lib/utils";

interface MembershipCardProps {
  plan: ProducerPlan;
  monthlyApplicationCount: number;
}

function PlanFeature({
  included,
  children,
}: {
  included: boolean;
  children: React.ReactNode;
}) {
  return (
    <li
      className={cn(
        "flex items-start gap-2 text-sm",
        included ? "text-slate-700" : "text-slate-400"
      )}
    >
      {included ? (
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
      ) : (
        <X className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
      )}
      <span>{children}</span>
    </li>
  );
}

export function MembershipCard({
  plan,
  monthlyApplicationCount,
}: MembershipCardProps) {
  const [billing, setBilling] = useState<ProducerBillingCycle>("monthly");
  const isPro = plan === "pro";
  const freeFeatures = PRODUCER_PLAN_FEATURES.free;
  const proFeatures = PRODUCER_PLAN_FEATURES.pro;
  const selectedPrice = getProducerProPrice(billing);
  const remaining = isPro
    ? null
    : Math.max(0, PRODUCER_FREE_MONTHLY_APPLICATION_LIMIT - monthlyApplicationCount);
  const usagePercent = isPro
    ? 100
    : Math.min(
        100,
        (monthlyApplicationCount / PRODUCER_FREE_MONTHLY_APPLICATION_LIMIT) * 100
      );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Üyelik ve Yükseltme</h2>
        <p className="mt-1 text-sm text-slate-500">
          Mevcut paketinizi görün, Pro ile ek özelliklere geçin.
        </p>
      </div>

      {!isPro && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-900">Aylık teklif kullanımı</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Ücretsiz planda ayda {PRODUCER_FREE_MONTHLY_APPLICATION_LIMIT} ilana teklif verebilirsiniz
                </p>
              </div>
              <Badge variant="default">
                {monthlyApplicationCount}/{PRODUCER_FREE_MONTHLY_APPLICATION_LIMIT} kullanıldı
              </Badge>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  usagePercent >= 90 ? "bg-amber-500" : "bg-brand-500"
                )}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            {remaining !== null && remaining > 0 && (
              <p className="mt-2 text-xs text-slate-500">Bu ay {remaining} teklif hakkınız kaldı.</p>
            )}
            {remaining === 0 && (
              <p className="mt-2 text-xs font-medium text-amber-700">
                Aylık limitiniz doldu. Pro ile sınırsız teklif verebilirsiniz.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className={cn(!isPro && "border-brand-200 ring-1 ring-brand-100")}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-slate-400" />
                <h3 className="font-semibold text-slate-900">{freeFeatures.name}</h3>
              </div>
              {!isPro && <Badge variant="brand">Mevcut</Badge>}
            </div>
            <p className="text-2xl font-bold text-slate-900">Ücretsiz</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {freeFeatures.features.map((f) => (
                <PlanFeature key={f} included>
                  {f}
                </PlanFeature>
              ))}
              {freeFeatures.missing.map((f) => (
                <PlanFeature key={f} included={false}>
                  {f}
                </PlanFeature>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className={cn(isPro && "border-brand-300 ring-1 ring-brand-200")}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-brand-600" />
                <h3 className="font-semibold text-slate-900">{proFeatures.name}</h3>
              </div>
              {isPro && <Badge variant="brand">Mevcut</Badge>}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {proFeatures.features.map((f) => (
                <PlanFeature key={f} included>
                  {f}
                </PlanFeature>
              ))}
            </ul>

            {!isPro && (
              <div className="space-y-4 border-t border-slate-100 pt-4">
                <BillingCycleToggle value={billing} onChange={setBilling} />
                <BillingPriceSummary billing={billing} />
                <Link href={`/dashboard/uyelik/satin-al?billing=${billing}`}>
                  <Button className="w-full">
                    <Crown className="h-4 w-4" />
                    Ödemeye Geç ({formatCurrency(selectedPrice)})
                  </Button>
                </Link>
              </div>
            )}

            {isPro && (
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <p className="text-sm text-slate-600">
                  Pro üyeliğiniz aktif. Tüm premium özelliklere erişiminiz var.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span>
                    Aylık: <strong className="text-slate-900">{formatCurrency(PRODUCER_PRO_MONTHLY_PRICE)}</strong>
                  </span>
                  <span>
                    Yıllık: <strong className="text-slate-900">{formatCurrency(PRODUCER_PRO_YEARLY_PRICE)}</strong>
                  </span>
                </div>
                <div className="grid gap-2 rounded-xl bg-brand-50/50 p-4 sm:grid-cols-3">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Link2 className="h-4 w-4 text-brand-600" />
                    Profil sayfası
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <BarChart3 className="h-4 w-4 text-brand-600" />
                    Gelişmiş raporlar
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Headphones className="h-4 w-4 text-brand-600" />
                    Öncelikli destek
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href="/dashboard/firma">
                    <Button variant="outline" size="sm">
                      Profil Sayfam
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/raporlar">
                    <Button variant="outline" size="sm">
                      Raporlar
                      <BarChart3 className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {!isPro && (
        <div className="rounded-xl border border-dashed border-brand-200 bg-brand-50/40 px-4 py-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5 font-medium text-brand-800">
            <Zap className="h-4 w-4" />
            Pro ile kazanın
          </span>
          <span className="mt-1 block text-slate-600">
            Sınırsız teklif, herkese açık profil ve öne çıkan rozet ile daha fazla müşteriye ulaşın.
          </span>
        </div>
      )}
    </div>
  );
}
