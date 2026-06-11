import type { Company } from "@/types";

export type ProducerPlan = "free" | "pro";

export const PRODUCER_FREE_MONTHLY_APPLICATION_LIMIT = 10;
export const PRODUCER_PRO_PRICE = 799;

export const PRODUCER_PLAN_FEATURES = {
  free: {
    name: "Basic",
    label: "Ücretsiz",
    applicationLimit: PRODUCER_FREE_MONTHLY_APPLICATION_LIMIT,
    support: "Temel destek",
    features: [
      "Aylık 10 ilana teklif",
      "Temel destek",
      "İlan bildirimleri",
    ],
    missing: [
      "Profil sayfası",
      "Öne çıkan başvuru",
      "Gelişmiş raporlar",
      "Öncelikli destek",
    ],
  },
  pro: {
    name: "Premium",
    label: "Pro",
    applicationLimit: null,
    support: "Öncelikli destek",
    features: [
      "Sınırsız ilana teklif",
      "Profil sayfası ve paylaşım",
      "Öne çıkan başvuru rozeti",
      "Gelişmiş raporlar",
      "Öncelikli destek",
    ],
    missing: [],
  },
} as const;

export function getProducerPlan(company: Pick<Company, "type" | "membership_plan">): ProducerPlan {
  if (company.type !== "producer") return "free";
  return company.membership_plan === "pro" ? "pro" : "free";
}

export function isProducerPro(company: Pick<Company, "type" | "membership_plan">): boolean {
  return getProducerPlan(company) === "pro";
}

/** Talep sahipleri her zaman profil kullanabilir; üreticiler yalnızca Pro'da */
export function canUsePublicProfile(company: Pick<Company, "type" | "membership_plan">): boolean {
  if (company.type === "demand_owner") return true;
  return isProducerPro(company);
}

export function getMonthlyApplicationCount(
  applications: { applicant_id: string; created_at: string }[],
  userId: string
): number {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  return applications.filter(
    (a) =>
      a.applicant_id === userId &&
      new Date(a.created_at) >= monthStart
  ).length;
}

export function canProducerApply(
  monthlyCount: number,
  company: Pick<Company, "type" | "membership_plan">
): boolean {
  if (company.type !== "producer") return false;
  if (isProducerPro(company)) return true;
  return monthlyCount < PRODUCER_FREE_MONTHLY_APPLICATION_LIMIT;
}

export function getRemainingApplications(
  monthlyCount: number,
  company: Pick<Company, "type" | "membership_plan">
): number | null {
  if (!isProducerPro(company) && company.type === "producer") {
    return Math.max(0, PRODUCER_FREE_MONTHLY_APPLICATION_LIMIT - monthlyCount);
  }
  return null;
}
