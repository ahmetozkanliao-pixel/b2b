import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo/config";
import { getDemoUserById } from "@/lib/demo/session";
import { Header } from "@/components/layout/header";
import { PanelBottomNav } from "@/components/dashboard/panel-bottom-nav";

function AdminShell({
  userName,
  userEmail,
  companyName,
  children,
}: {
  userName: string;
  userEmail: string;
  companyName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-primary-950">
      <Header />
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col pt-14">
        <main className="panel-content panel-main flex-1 overflow-auto pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:pb-[calc(4.75rem+env(safe-area-inset-bottom))]">
          <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
        <PanelBottomNav
          role="admin"
          userName={userName}
          userEmail={userEmail}
          companyName={companyName}
        />
      </div>
    </div>
  );
}

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
      <AdminShell
        userName={session.full_name}
        userEmail={session.email}
        companyName={demoUser?.company.name}
      >
        {children}
      </AdminShell>
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
    <AdminShell
      userName={profile?.full_name ?? ""}
      userEmail={user.email ?? ""}
      companyName={company?.name}
    >
      {children}
    </AdminShell>
  );
}
