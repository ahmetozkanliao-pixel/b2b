import { DEMO_USERS } from "@/lib/demo/config";
import type { Company } from "@/types";

export function getCompanyOwnerInfo(company: Company) {
  const user = DEMO_USERS.find((u) => u.id === company.owner_id);
  if (user) {
    return { full_name: user.full_name, email: user.email };
  }
  return {
    full_name: company.name,
    email: company.email || "—",
  };
}

export const companyStatusMap: Record<
  string,
  { label: string; variant: "default" | "success" | "warning" | "danger" }
> = {
  pending: { label: "Bekliyor", variant: "warning" },
  approved: { label: "Onaylı", variant: "success" },
  rejected: { label: "Reddedildi", variant: "danger" },
  suspended: { label: "Askıya Alındı", variant: "danger" },
};

export const listingStatusMap: Record<
  string,
  { label: string; variant: "default" | "success" | "warning" | "danger" }
> = {
  draft: { label: "Taslak", variant: "default" },
  active: { label: "Aktif", variant: "success" },
  closed: { label: "Kapalı", variant: "warning" },
  cancelled: { label: "İptal", variant: "danger" },
};
