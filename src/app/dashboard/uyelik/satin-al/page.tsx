import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";
import { getDemoCompany } from "@/lib/demo/store";
import { getProducerPlan } from "@/lib/membership";
import { createClient } from "@/lib/supabase/server";
import { MembershipCheckout } from "@/components/dashboard/membership-checkout";

export default async function MembershipPurchasePage({
  searchParams,
}: {
  searchParams: Promise<{ billing?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/giris");

  if (session.role !== "producer") {
    redirect("/dashboard/ayarlar");
  }

  const params = await searchParams;
  const initialBilling =
    params.billing === "yearly" ? ("yearly" as const) : ("monthly" as const);

  let companyName = session.full_name || "Firmanız";
  let isPro = false;

  if (session.isDemo && session.companyId) {
    const company = getDemoCompany(session.companyId);
    if (company) {
      companyName = company.name;
      isPro = getProducerPlan(company) === "pro";
    }
  } else if (session.companyId) {
    const supabase = await createClient();
    const { data: company } = await supabase
      .from("companies")
      .select("name, type, membership_plan")
      .eq("id", session.companyId)
      .single();

    if (company) {
      companyName = company.name;
      isPro = getProducerPlan(company) === "pro";
    }
  }

  if (isPro) {
    redirect("/dashboard/ayarlar");
  }

  return (
    <MembershipCheckout
      companyName={companyName}
      userEmail={session.email}
      isDemo={session.isDemo}
      initialBilling={initialBilling}
    />
  );
}
