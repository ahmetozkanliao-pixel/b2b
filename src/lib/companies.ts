import { isDemoMode } from "@/lib/demo/config";
import { getPublicDemoCompanies } from "@/lib/demo/store";
import { canUsePublicProfile } from "@/lib/membership";
import { createClient } from "@/lib/supabase/server";
import type { Company } from "@/types";

function isShowcaseCompany(company: Company) {
  if (company.status !== "approved") return false;
  if (company.profile_public === false) return false;
  if (!canUsePublicProfile(company)) return false;
  if (!company.slug) return false;
  if (company.name === "Platform Yönetimi") return false;
  return true;
}

export interface FeaturedCompanies {
  demand: Company[];
  producers: Company[];
}

export async function getFeaturedCompanies(): Promise<FeaturedCompanies> {
  if (isDemoMode()) {
    const all = getPublicDemoCompanies().filter(isShowcaseCompany);
    return {
      demand: all.filter((c) => c.type === "demand_owner"),
      producers: all.filter((c) => c.type === "producer"),
    };
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("companies")
    .select("*")
    .eq("status", "approved")
    .eq("profile_public", true)
    .not("slug", "is", null)
    .order("name");

  const companies = (data ?? []).filter(isShowcaseCompany);

  return {
    demand: companies.filter((c) => c.type === "demand_owner"),
    producers: companies.filter((c) => c.type === "producer"),
  };
}
