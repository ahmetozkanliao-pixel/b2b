import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo/config";
import { getDemoUserById } from "@/lib/demo/session";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { PanelMobileMenu } from "@/components/dashboard/panel-mobile-menu";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isDemoMode()) {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      redirect("/dashboard");
    }

    const demoUser = getDemoUserById(session.id);

    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex pt-[4.25rem]">
          <Sidebar
            role="admin"
            userName={session.full_name}
            userEmail={session.email}
            companyName={demoUser?.company.name}
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <PanelMobileMenu
              role="admin"
              userName={session.full_name}
              userEmail={session.email}
              companyName={demoUser?.company.name}
            />
            <main className="flex-1 overflow-auto">
              <div className="p-4 sm:p-6 lg:p-8">{children}</div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/giris");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: company } = await supabase
    .from("companies")
    .select("name")
    .eq("owner_id", user.id)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="flex pt-[4.25rem]">
        <Sidebar
          role="admin"
          userName={profile?.full_name ?? ""}
          userEmail={user.email ?? ""}
          companyName={company?.name}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <PanelMobileMenu
            role="admin"
            userName={profile?.full_name ?? ""}
            userEmail={user.email ?? ""}
            companyName={company?.name}
          />
          <main className="flex-1 overflow-auto">
            <div className="p-4 sm:p-6 lg:p-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
