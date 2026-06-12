import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const demandPlans = [
  {
    name: "Ücretsiz",
    price: 0,
    features: [
      "Sınırsız ilan yayınlama",
      "Başvuru yönetimi",
      "Firma profili",
      "Ücretsiz — ödeme yok",
    ],
    cta: "Ücretsiz Başla",
    highlighted: true,
  },
];

const producerPlans = [
  {
    name: "Basic",
    price: 0,
    features: ["Aylık 10 ilana teklif", "Temel destek", "İlan bildirimleri"],
    cta: "Ücretsiz Başla",
    highlighted: false,
  },
  {
    name: "Pro",
    price: 799,
    features: [
      "Sınırsız ilana teklif",
      "Profil sayfası ve paylaşım",
      "Öne çıkan başvuru rozeti",
      "Gelişmiş raporlar",
      "Öncelikli destek",
    ],
    cta: "Pro'ya Geç",
    highlighted: true,
  },
];

function PlanCard({
  plan,
  type,
}: {
  plan: (typeof demandPlans)[0];
  type: "demand" | "producer";
}) {
  return (
    <Card
      className={cn(
        "relative",
        plan.highlighted && "border-white/20 ring-1 ring-white/10"
      )}
    >
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white">
            <Sparkles className="h-3 w-3" />
            Popüler
          </span>
        </div>
      )}
      <CardHeader>
        <h3 className="text-xl font-medium text-white">{plan.name}</h3>
        <div className="mt-2">
          <span className="text-3xl font-semibold text-white">
            {plan.price === 0 ? "Ücretsiz" : formatCurrency(plan.price)}
          </span>
          {plan.price > 0 && <span className="text-sm text-neutral-500">/ay</span>}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-sm text-neutral-400">
              <Check className="h-4 w-4 shrink-0 text-neutral-300" />
              {feature}
            </li>
          ))}
        </ul>
        <Link href={`/kayit?tip=${type === "demand" ? "talep" : "uretici"}`} className="mt-6 block">
          <Button
            variant={plan.highlighted ? "primary" : "outline"}
            className="w-full"
          >
            {plan.cta}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export function Pricing() {
  return (
    <section className="public-content chapter-bg-light section-divider relative overflow-hidden py-24">
      <div className="resend-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div className="pointer-events-none absolute inset-0 section-ambient-bottom" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="editorial-label">Fiyatlandırma</p>
          <h2 className="editorial-heading mt-4 text-4xl sm:text-5xl">
            Üyelik Paketleri
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-400">
            İhtiyacınıza uygun planı seçin, istediğiniz zaman yükseltin
          </p>
        </div>

        <div className="mt-16">
          <h3 className="mb-2 text-center text-lg font-medium text-neutral-300">
            Talep Sahibi Firma
          </h3>
          <p className="mb-6 text-center text-sm text-neutral-500">
            Tamamen ücretsiz — herhangi bir ücret alınmaz
          </p>
          <div className="mx-auto max-w-sm">
            {demandPlans.map((plan) => (
              <PlanCard key={plan.name} plan={plan} type="demand" />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h3 className="mb-6 text-center text-lg font-medium text-neutral-300">
            Üretici Firma
          </h3>
          <div className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">
            {producerPlans.map((plan) => (
              <PlanCard key={plan.name} plan={plan} type="producer" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
