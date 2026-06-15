import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { PanelBottomNav } from "@/components/dashboard/panel-bottom-nav";
import { getDemoUserById } from "@/lib/demo/session";
import { getPanelBadges } from "@/lib/panel-badges";

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

  const initialBadges =
    session.role === "admin" ? { messages: 0, notifications: 0 } : await getPanelBadges(session);

  return (
    <div className="min-h-screen bg-primary-950">
      <Header />
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col pt-14">
        <main className="panel-content panel-main flex-1 overflow-auto pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:pb-[calc(4.75rem+env(safe-area-inset-bottom))]">
          <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
        <PanelBottomNav
          role={session.role}
          userName={session.full_name}
          userEmail={session.email}
          companyName={companyName}
          initialBadges={initialBadges}
        />
      </div>
    </div>
  );
}
