import Link from "next/link";
import { ExternalLink, Crown, Lock } from "lucide-react";
import { getSession } from "@/lib/auth/get-session";
import { DEMO_CATEGORIES } from "@/lib/demo/config";
import { getDemoCompany, getDemoPortfolio } from "@/lib/demo/store";
import { createClient } from "@/lib/supabase/server";
import { CompanyForm } from "@/components/dashboard/company-form";
import { ProfileCustomizeForm } from "@/components/dashboard/profile-customize-form";
import { PortfolioManager } from "@/components/dashboard/portfolio-manager";
import { ShareProfileButton } from "@/components/profile/share-profile-button";
import { getCompanyProfilePath } from "@/lib/utils";
import { canUsePublicProfile } from "@/lib/membership";
import { Button } from "@/components/ui/button";
import type { Category, PortfolioItem } from "@/types";

export default async function CompanyPage() {
  const session = await getSession();
  if (!session) return null;

  let company = null;
  let portfolio: PortfolioItem[] = [];
  let categories: Category[] = DEMO_CATEGORIES;

  if (session.isDemo && session.companyId) {
    company = getDemoCompany(session.companyId);
    portfolio = getDemoPortfolio(session.companyId);
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("companies")
      .select("*")
      .eq("owner_id", session.id)
      .single();
    company = data;

    if (company) {
      const { data: items } = await supabase
        .from("portfolio_items")
        .select("*")
        .eq("company_id", company.id)
        .order("year", { ascending: false });
      portfolio = items || [];
    }

    const { data: dbCategories } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    categories = dbCategories || [];
  }

  const isProducer = session.role === "producer";
  const hasProfileAccess = company ? canUsePublicProfile(company) : false;
  const profilePath = company ? getCompanyProfilePath(company) : "/firma";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Firma Profili</h1>
          <p className="mt-1 text-slate-500">
            {isProducer
              ? hasProfileAccess
                ? "Pro üyelik — profilinizi özelleştirin ve paylaşın"
                : "Firma bilgilerinizi yönetin"
              : "Firma bilgilerinizi düzenleyin (ücretsiz)"}
          </p>
        </div>
        {company && hasProfileAccess && (
          <div className="flex gap-2">
            <Link
              href={profilePath}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-soft transition-colors hover:bg-slate-50"
            >
              <ExternalLink className="h-4 w-4" />
              Profili Görüntüle
            </Link>
            <ShareProfileButton url={profilePath} companyName={company.name} />
          </div>
        )}
      </div>

      {isProducer && !hasProfileAccess && (
        <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50/40 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100">
              <Lock className="h-6 w-6 text-brand-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-slate-900">Profil sayfası Pro üyelikte</h2>
              <p className="mt-1 text-sm text-slate-600">
                Herkese açık profil linki, önceki işler galerisi ve profil paylaşımı
                yalnızca Pro üreticilerde kullanılabilir. Ücretsiz planda aylık 10 ilana
                teklif verebilir ve temel destek alabilirsiniz.
              </p>
              <Link href="/dashboard/ayarlar" className="mt-4 inline-block">
                <Button size="sm">
                  <Crown className="h-4 w-4" />
                  Pro&apos;ya Yükselt
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-8">
        {company && hasProfileAccess && (
          <>
            <ProfileCustomizeForm company={company} isDemo={session.isDemo} />
            <PortfolioManager items={portfolio} isDemo={session.isDemo} />
          </>
        )}
        <CompanyForm
          company={company}
          userId={session.id}
          role={session.role}
          isDemo={session.isDemo}
          categories={categories}
        />
      </div>
    </div>
  );
}
