import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { PanelMobileMenu } from "@/components/dashboard/panel-mobile-menu";
import { getDemoUserById } from "@/lib/demo/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/giris");
  }

  const demoUser = session.isDemo ? getDemoUserById(session.id) : null;
  let companyName = demoUser?.company.name;

  if (!companyName && !session.isDemo) {
    const supabase = await createClient();
    const { data: company } = await supabase
      .from("companies")
      .select("name")
      .eq("owner_id", session.id)
      .maybeSingle();
    companyName = company?.name ?? undefined;
  }

  return (
    <div className="min-h-screen bg-primary-950">
      <Header />
      <div className="flex pt-14">
        <Sidebar
          role={session.role}
          userName={session.full_name}
          userEmail={session.email}
          companyName={companyName}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <PanelMobileMenu
            role={session.role}
            userName={session.full_name}
            userEmail={session.email}
            companyName={companyName}
          />
          <main className="panel-content panel-main flex-1 overflow-auto">
            <div className="p-4 sm:p-6 lg:p-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
