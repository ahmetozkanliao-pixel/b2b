import { getSession } from "@/lib/auth/get-session";
import { getDemoSettings, getDemoCompany, getDemoMonthlyApplicationCount } from "@/lib/demo/store";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { MembershipCard } from "@/components/dashboard/membership-card";
import { UpgradeSuccessBanner } from "@/components/dashboard/upgrade-success-banner";
import { getProducerPlan } from "@/lib/membership";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) return null;

  const settings = session.isDemo ? getDemoSettings(session.id) : null;
  const isProducer = session.role === "producer";

  let plan: "free" | "pro" = "free";
  let monthlyApplicationCount = 0;

  if (isProducer && session.isDemo && session.companyId) {
    const company = getDemoCompany(session.companyId);
    if (company) {
      plan = getProducerPlan(company);
      monthlyApplicationCount = getDemoMonthlyApplicationCount(session.id);
    }
  }

  return (
    <div className={isProducer ? "mx-auto max-w-4xl" : "mx-auto max-w-2xl"}>
      <h1 className="text-2xl font-bold text-slate-900">Ayarlar</h1>
      <p className="mt-1 text-slate-500">Hesap, üyelik ve bildirim tercihlerinizi yönetin</p>

      <div className="mt-6 space-y-6">
        <UpgradeSuccessBanner />
        {isProducer && (
          <MembershipCard
            plan={plan}
            monthlyApplicationCount={monthlyApplicationCount}
          />
        )}

        {!isProducer && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            <strong className="text-slate-900">Müşteri</strong> — Teklif toplayabilir, satınalma süreçlerini yönetebilirsiniz. Platformu tamamen
            ücretsiz kullanıyorsunuz. İlan yayınlama ve teklif yönetimi için herhangi bir
            ücret alınmaz.
          </div>
        )}

        <SettingsForm
          isDemo={session.isDemo}
          initialSettings={settings}
          profile={{
            full_name: session.full_name,
            email: session.email,
          }}
          isProducerPro={isProducer && plan === "pro"}
        />
      </div>
    </div>
  );
}
