"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Crown,
  CreditCard,
  Lock,
  Shield,
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
  getProducerProPrice,
  type ProducerBillingCycle,
} from "@/lib/membership";
import { formatCurrency } from "@/lib/utils";

interface MembershipCheckoutProps {
  companyName: string;
  userEmail: string;
  isDemo?: boolean;
  initialBilling?: ProducerBillingCycle;
}

export function MembershipCheckout({
  companyName,
  userEmail,
  isDemo = false,
  initialBilling = "monthly",
}: MembershipCheckoutProps) {
  const router = useRouter();
  const [billing, setBilling] = useState<ProducerBillingCycle>(initialBilling);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const proFeatures = PRODUCER_PLAN_FEATURES.pro;
  const subtotal = getProducerProPrice(billing);
  const vatIncluded = Math.round(subtotal * 0.2);
  const total = subtotal;

  async function handlePurchase() {
    setLoading(true);
    setError("");

    if (isDemo) {
      const res = await fetch("/api/demo/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro", billing }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Ödeme işlemi tamamlanamadı.");
        setLoading(false);
        return;
      }
      router.push("/dashboard/ayarlar?upgraded=1");
      router.refresh();
      return;
    }

    setError("Ödeme entegrasyonu yakında aktif olacak. Stripe veya iyzico ile güvenli ödeme sunulacak.");
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/dashboard/ayarlar"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Ayarlara dön
      </Link>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <Crown className="h-8 w-8 text-brand-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Pro Üyelik Satın Al</h1>
            <p className="mt-1 text-sm text-slate-500">
              {companyName} için Pro paketi — aylık veya yıllık ödeme
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-900">Ödeme periyodu</h2>
          <p className="text-sm text-slate-500">Aylık veya yıllık ödeme seçin</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <BillingCycleToggle value={billing} onChange={setBilling} />
          <BillingPriceSummary billing={billing} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">Paket özellikleri</h2>
            <p className="text-sm text-slate-500">Pro ile açılan tüm özellikler</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {proFeatures.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">Sipariş özeti</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">
                Pro Üyelik ({billing === "monthly" ? "aylık" : "yıllık"})
              </span>
              <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">KDV (%20)</span>
              <span className="text-slate-700">{formatCurrency(vatIncluded)}</span>
            </div>
            <div className="border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Toplam</span>
                <span className="text-xl font-bold text-slate-900">{formatCurrency(total)}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {billing === "monthly"
                  ? "Aylık yenilenir, istediğiniz zaman iptal"
                  : "Yıllık tek seferde ödeme, 12 ay Pro erişim"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <p className="font-medium text-slate-800">Fatura bilgisi</p>
              <p className="mt-1">{companyName}</p>
              <p>{userEmail}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">Ödeme</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isDemo ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-medium">Demo ödeme modu</p>
              <p className="mt-1 text-amber-800">
                Gerçek kart bilgisi istenmez. &quot;Ödemeyi Tamamla&quot; ile Pro üyelik anında aktif edilir.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
              <CreditCard className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 font-medium text-slate-700">Güvenli ödeme altyapısı</p>
              <p className="mt-1">Stripe veya iyzico ile kart ödemesi yakında eklenecek.</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" />
              256-bit şifreleme
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              KVKK uyumlu
            </span>
            <Badge variant="default">
              {billing === "monthly" ? "Aylık abonelik" : "Yıllık abonelik"}
            </Badge>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Ödemeyi tamamlayarak kullanım şartlarını ve iptal koşullarını kabul etmiş olursunuz.
            </p>
            <Button onClick={handlePurchase} disabled={loading} size="lg" className="shrink-0">
              <Crown className="h-4 w-4" />
              {loading
                ? "İşleniyor..."
                : isDemo
                  ? billing === "monthly"
                    ? `Aylık Ödemeyi Tamamla (${formatCurrency(total)})`
                    : `Yıllık Ödemeyi Tamamla (${formatCurrency(total)})`
                  : "Ödemeye Geç"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
