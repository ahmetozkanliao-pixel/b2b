import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CompanyProfileView } from "@/components/profile/company-profile-view";
import { canUsePublicProfile } from "@/lib/membership";
import { isDemoMode } from "@/lib/demo/config";
import { getAppCategories } from "@/lib/get-categories";
import {
  getDemoCompanyBySlug,
  getDemoPortfolio,
  getDemoListings,
} from "@/lib/demo/store";
import { getSession } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (isDemoMode()) {
    const company = getDemoCompanyBySlug(slug);
    return { title: company?.name || "Firma Profili" };
  }

  const supabase = await createClient();
  const { data: company } = await supabase
    .from("companies")
    .select("name")
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single();

  return { title: company?.name || "Firma Profili" };
}

export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getSession();

  if (isDemoMode()) {
    const categories = await getAppCategories();
    const company = getDemoCompanyBySlug(slug);
    if (!company || company.profile_public === false || !canUsePublicProfile(company)) notFound();

    const portfolio = getDemoPortfolio(company.id);
    const isOwner = session?.companyId === company.id;
    const activeListingsCount =
      company.type === "demand_owner"
        ? getDemoListings(company.id).filter((l) => l.status === "active").length
        : undefined;

    return (
      <>
        <div className="border-b border-white/10 bg-black">
          <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Ana Sayfa
            </Link>
          </div>
        </div>
        <CompanyProfileView
          company={company}
          portfolio={portfolio}
          categories={categories}
          isOwner={isOwner}
          activeListingsCount={activeListingsCount}
        />
      </>
    );
  }

  const supabase = await createClient();
  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .eq("status", "approved")
    .single();

  if (!company || company.profile_public === false || !canUsePublicProfile(company)) notFound();

  const { data: portfolio } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("company_id", company.id)
    .order("year", { ascending: false });

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true);

  let activeListingsCount: number | undefined;
  if (company.type === "demand_owner") {
    const { count } = await supabase
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("company_id", company.id)
      .eq("status", "active");
    activeListingsCount = count ?? 0;
  }

  const isOwner = session?.companyId === company.id;

  return (
    <>
      <div className="border-b border-white/10 bg-black">
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Ana Sayfa
          </Link>
        </div>
      </div>
      <CompanyProfileView
        company={company}
        portfolio={portfolio || []}
        categories={categories || []}
        isOwner={isOwner}
        activeListingsCount={activeListingsCount}
      />
    </>
  );
}
