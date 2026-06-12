import { PRODUCER_PLAN_FEATURES, PRODUCER_PRO_PRICE } from "@/lib/membership";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

export default function AdminMembershipPage() {
  const plans = [
    {
      key: "free" as const,
      target: "Üretici",
      price: "Ücretsiz",
      data: PRODUCER_PLAN_FEATURES.free,
    },
    {
      key: "pro" as const,
      target: "Üretici",
      price: `₺${PRODUCER_PRO_PRICE}/ay`,
      data: PRODUCER_PLAN_FEATURES.pro,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Üyelik Paketleri</h1>
      <p className="mt-1 text-gray-500">Platform üyelik planları ve özellikleri</p>

      <Card className="mt-6 border-primary-100 bg-primary-50/50">
        <CardContent className="py-4">
          <p className="text-sm text-primary-800">
            <strong>Talep sahipleri</strong> için üyelik ücretsizdir ve firma profili her zaman aktiftir.
            Üretici firmalar Basic (ücretsiz) veya Pro plan arasında seçim yapabilir.
          </p>
        </CardContent>
      </Card>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.key} className={plan.key === "pro" ? "border-brand-200" : ""}>
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{plan.data.name}</h2>
                  <p className="text-sm text-gray-500">{plan.target} · {plan.data.label}</p>
                </div>
                {plan.key === "pro" && <Badge variant="brand">Önerilen</Badge>}
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">{plan.price}</p>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                {plan.data.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 shrink-0 text-green-600" />
                    {feature}
                  </li>
                ))}
                {plan.data.missing.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-400">
                    <X className="h-4 w-4 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
