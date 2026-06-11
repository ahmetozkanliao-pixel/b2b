"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Crown, Check, Sparkles, Headphones, BarChart3, Link2, Zap } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PRODUCER_PLAN_FEATURES,
  PRODUCER_PRO_PRICE,
  PRODUCER_FREE_MONTHLY_APPLICATION_LIMIT,
  type ProducerPlan,
} from "@/lib/membership";
import { formatCurrency } from "@/lib/utils";

interface MembershipCardProps {
  plan: ProducerPlan;
  monthlyApplicationCount: number;
  isDemo?: boolean;
}

export function MembershipCard({
  plan,
  monthlyApplicationCount,
  isDemo = false,
}: MembershipCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const isPro = plan === "pro";
  const features = PRODUCER_PLAN_FEATURES[plan];
  const remaining = isPro
    ? null
    : Math.max(0, PRODUCER_FREE_MONTHLY_APPLICATION_LIMIT - monthlyApplicationCount);

  async function handleUpgrade() {
    setLoading(true);
    setSuccess(false);

    if (isDemo) {
      const res = await fetch("/api/demo/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro" }),
      });
      if (res.ok) {
        setSuccess(true);
        router.refresh();
      }
    }

    setLoading(false);
  }

  return (
    <Card className={isPro ? "border-brand-300 ring-1 ring-brand-200" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPro ? (
              <Crown className="h-5 w-5 text-brand-600" />
            ) : (
              <Sparkles className="h-5 w-5 text-slate-400" />
            )}
            <h2 className="text-lg font-semibold text-slate-900">Üyelik Paketi</h2>
          </div>
          <Badge variant={isPro ? "brand" : "default"}>
            {features.label}
          </Badge>
        </div>
        {isPro ? (
          <p className="text-sm text-slate-500">
            Pro üyeliğiniz aktif. Tüm premium özelliklere erişiminiz var.
          </p>
        ) : (
          <p className="text-sm text-slate-500">
            Bu ay <strong>{monthlyApplicationCount}/{PRODUCER_FREE_MONTHLY_APPLICATION_LIMIT}</strong> ilana
            teklif verdiniz
            {remaining !== null && remaining > 0 && ` · ${remaining} hak kaldı`}.
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
              <Check className="h-4 w-4 shrink-0 text-brand-600" />
              {f}
            </li>
          ))}
        </ul>

        {isPro && (
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
        )}

        {!isPro && (
          <>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Pro ile neler kazanırsınız?</p>
              <ul className="mt-2 space-y-1.5">
                {PRODUCER_PLAN_FEATURES.pro.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-slate-500">
                    <Zap className="h-3 w-3 text-brand-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-lg font-bold text-slate-900">
                {formatCurrency(PRODUCER_PRO_PRICE)}
                <span className="text-sm font-normal text-slate-500">/ay</span>
              </p>
            </div>

            {success ? (
              <p className="rounded-xl bg-green-50 p-3 text-sm text-green-600">
                Pro üyeliğiniz aktif edildi! Sayfa yenileniyor...
              </p>
            ) : (
              <Button onClick={handleUpgrade} disabled={loading} className="w-full">
                <Crown className="h-4 w-4" />
                {loading ? "Yükseltiliyor..." : "Pro'ya Yükselt"}
              </Button>
            )}
            <p className="text-center text-xs text-slate-400">
              Demo modunda ödeme alınmaz; yükseltme anında aktif olur.
            </p>
          </>
        )}

        {isPro && (
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/firma">
              <Button variant="outline" size="sm">Profil Sayfam</Button>
            </Link>
            <Link href="/dashboard/raporlar">
              <Button variant="outline" size="sm">Raporlar</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
