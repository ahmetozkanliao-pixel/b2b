import { getSession } from "@/lib/auth/get-session";
import { getDemoApplicationsByApplicant } from "@/lib/demo/store";
import type { DemoApplication } from "@/lib/demo/types";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";

const statusMap: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" }> = {
  pending: { label: "Bekliyor", variant: "warning" },
  approved: { label: "Onaylandı", variant: "success" },
  rejected: { label: "Reddedildi", variant: "danger" },
  withdrawn: { label: "Geri Çekildi", variant: "default" },
};

export default async function MyApplicationsPage() {
  const session = await getSession();

  let applications: DemoApplication[] | Array<{
    id: string;
    status: string;
    proposed_budget: number | null;
    created_at: string;
    listing_title?: string;
    listing?: { title: string; city: string | null };
  }> = [];

  if (session?.isDemo) {
    applications = getDemoApplicationsByApplicant(session.id);
  } else {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from("applications")
      .select("*, listing:listings(title, city)")
      .eq("applicant_id", user!.id)
      .order("created_at", { ascending: false });
    applications = data || [];
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Başvurularım</h1>
      <p className="mt-1 text-gray-500">Yaptığınız ilan başvurularını takip edin</p>

      <div className="mt-6 space-y-4">
        {applications.length > 0 ? (
          applications.map((app) => {
            const status = statusMap[app.status] || statusMap.pending;
            const title = app.listing_title || app.listing?.title;

            return (
              <Card key={app.id}>
                <CardContent>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{title}</h3>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {formatDate(app.created_at)}
                      </p>
                      {app.proposed_budget && (
                        <p className="mt-2 text-sm font-medium">
                          Teklifiniz: {formatCurrency(app.proposed_budget)}
                        </p>
                      )}
                    </div>
                    {app.status === "approved" && (
                      <Link
                        href="/dashboard/mesajlar"
                        className="text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        Mesajlara Git →
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              Henüz başvuru yapmadınız.{" "}
              <Link href="/dashboard/ilanlar" className="text-primary-600 hover:underline">
                İlanları keşfedin
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
