import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/get-session";
import { getDemoCompany, getDemoApplicationsByApplicant, getDemoMonthlyApplicationCount } from "@/lib/demo/store";
import { isProducerPro } from "@/lib/membership";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Send, CheckCircle, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function ReportsPage() {
  const session = await getSession();
  if (!session || session.role !== "producer") {
    redirect("/dashboard");
  }

  let company = null;
  let applications: Array<{
    status: string;
    proposed_budget: number | null;
    listing_title?: string;
  }> = [];
  let monthlyCount = 0;

  if (session.isDemo && session.companyId) {
    company = getDemoCompany(session.companyId);
    applications = getDemoApplicationsByApplicant(session.id);
    monthlyCount = getDemoMonthlyApplicationCount(session.id);
  }

  if (!company || !isProducerPro(company)) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card">
          <BarChart3 className="mx-auto h-12 w-12 text-slate-300" />
          <h1 className="mt-4 text-xl font-bold text-slate-900">Gelişmiş Raporlar</h1>
          <p className="mt-2 text-sm text-slate-500">
            Detaylı teklif ve performans raporları Pro üyelikle kullanılabilir.
          </p>
          <Link
            href="/dashboard/uyelik/satin-al"
            className="mt-6 inline-flex rounded-xl gradient-brand px-5 py-2.5 text-sm font-semibold text-white"
          >
            Pro&apos;ya Yükselt
          </Link>
        </div>
      </div>
    );
  }

  const pending = applications.filter((a) => a.status === "pending").length;
  const approved = applications.filter((a) => a.status === "approved").length;
  const rejected = applications.filter((a) => a.status === "rejected").length;
  const totalBudget = applications
    .filter((a) => a.proposed_budget)
    .reduce((sum, a) => sum + (a.proposed_budget || 0), 0);
  const approvalRate = applications.length
    ? Math.round((approved / applications.length) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Gelişmiş Raporlar</h1>
        <Badge variant="brand">Pro</Badge>
      </div>
      <p className="mt-1 text-slate-500">Teklif performansınız ve analizler</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <Send className="h-8 w-8 text-brand-600" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{applications.length}</p>
              <p className="text-xs text-slate-500">Toplam teklif</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="text-2xl font-bold text-slate-900">%{approvalRate}</p>
              <p className="text-xs text-slate-500">Onay oranı</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <Clock className="h-8 w-8 text-amber-600" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{pending}</p>
              <p className="text-xs text-slate-500">Bekleyen</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <TrendingUp className="h-8 w-8 text-primary-600" />
            <div>
              <p className="text-2xl font-bold text-slate-900">{monthlyCount}</p>
              <p className="text-xs text-slate-500">Bu ay teklif</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-900">Teklif Durumu</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Onaylanan</span>
              <span className="font-semibold text-emerald-600">{approved}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Bekleyen</span>
              <span className="font-semibold text-amber-600">{pending}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Reddedilen</span>
              <span className="font-semibold text-red-600">{rejected}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-900">Teklif Özeti</h2>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalBudget)}</p>
            <p className="mt-1 text-sm text-slate-500">Toplam teklif tutarı</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <h2 className="font-semibold text-slate-900">Son Teklifler</h2>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-sm text-slate-400">Henüz teklif yok.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {applications.slice(0, 5).map((app, i) => (
                <li key={i} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-slate-700">{app.listing_title || "İlan"}</span>
                  <Badge
                    variant={
                      app.status === "approved"
                        ? "success"
                        : app.status === "pending"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {app.status === "approved"
                      ? "Onaylandı"
                      : app.status === "pending"
                        ? "Bekliyor"
                        : "Reddedildi"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
