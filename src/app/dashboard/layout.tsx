import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/giris");
  }

  const role = session.role;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role={role} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
