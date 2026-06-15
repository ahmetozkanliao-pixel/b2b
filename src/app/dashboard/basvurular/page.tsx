import { getSession } from "@/lib/auth/get-session";
import { getCategoriesByIds } from "@/lib/categories";
import { getAppCategories } from "@/lib/get-categories";
import {
  getDemoApplications,
  getDemoChatRoomByApplicationId,
  getDemoCompany,
} from "@/lib/demo/store";
import type { DemoApplication } from "@/lib/demo/types";
import { canUsePublicProfile, isProducerPro } from "@/lib/membership";
import { CategoryBadges } from "@/components/ui/category-badges";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { ApplicationCompare, type CompareApplication } from "@/components/applications/application-compare";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApplicationActions } from "@/components/applications/application-actions";
import { DealActions } from "@/components/applications/deal-actions";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { formatDate, formatCurrency, getCompanyProfilePath } from "@/lib/utils";
import type { ApplicationStatus, Company } from "@/types";

const statusMap: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" }> = {
  pending: { label: "Bekliyor", variant: "warning" },
  approved: { label: "Onaylandı", variant: "success" },
  rejected: { label: "Reddedildi", variant: "danger" },
  withdrawn: { label: "Geri Çekildi", variant: "default" },
  agreed: { label: "Anlaşıldı", variant: "success" },
  no_agreement: { label: "Anlaşılamadı", variant: "default" },
};

type ApplicationRow = DemoApplication | {
  id: string;
  listing_id: string;
  status: string;
  cover_letter: string | null;
  proposed_budget: number | null;
  proposed_delivery: string | null;
  created_at: string;
  applicant_id: string;
  listing_title?: string;
  producer_name?: string;
  producer_city?: string;
  producer_company_id?: string;
  listing?: { title: string };
  producer_company?: {
    name: string;
    city: string | null;
    category_ids?: string[];
    verified?: boolean;
    slug?: string | null;
    type?: string;
    membership_plan?: string;
    profile_public?: boolean;
  };
};

function resolveProducerCompany(
  app: ApplicationRow,
  sessionIsDemo: boolean | undefined
): Company | null {
  if (sessionIsDemo && app.producer_company_id) {
    return getDemoCompany(app.producer_company_id);
  }
  return null;
}

function buildCompareGroups(
  applications: ApplicationRow[],
  sessionIsDemo: boolean | undefined,
  chatRoomByApplication: Map<string, string>
) {
  const byListing = new Map<string, CompareApplication[]>();

  for (const app of applications) {
    const producerCompany = resolveProducerCompany(app, sessionIsDemo);
    const listingTitle = app.listing_title || app.listing?.title || "İlan";
    const listingId = app.listing_id;

    const producerRef = producerCompany ?? app.producer_company;
    const row: CompareApplication = {
      id: app.id,
      listingId,
      listingTitle,
      producerName:
        app.producer_name ||
        producerCompany?.name ||
        app.producer_company?.name ||
        "Tedarikçi",
      producerCity:
        app.producer_city || producerCompany?.city || app.producer_company?.city || null,
      producerCompanyId: app.producer_company_id || producerCompany?.id || "",
      producerSlug: producerCompany?.slug ?? app.producer_company?.slug,
      verified: producerRef?.verified ?? false,
      isPro: producerRef ? isProducerPro(producerRef as Company) : false,
      profilePublic: producerRef ? canUsePublicProfile(producerRef as Company) : false,
      proposedBudget: app.proposed_budget,
      proposedDelivery: app.proposed_delivery,
      status: app.status as ApplicationStatus,
      createdAt: app.created_at,
      coverLetter: app.cover_letter,
      chatRoomId: chatRoomByApplication.get(app.id),
    };

    const group = byListing.get(listingId) || [];
    group.push(row);
    byListing.set(listingId, group);
  }

  return Array.from(byListing.entries()).map(([listingId, apps]) => ({
    listingId,
    listingTitle: apps[0]?.listingTitle || "İlan",
    applications: apps,
  }));
}

export default async function ApplicationsPage() {
  const session = await getSession();
  const categories = await getAppCategories();

  let applications: ApplicationRow[] = [];
  const chatRoomByApplication = new Map<string, string>();

  if (session?.isDemo && session.companyId) {
    applications = getDemoApplications(session.companyId);
    for (const app of applications) {
      const room = getDemoChatRoomByApplicationId(app.id);
      if (room) chatRoomByApplication.set(app.id, room.id);
    }
  } else {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", user!.id)
      .single();

    const { data: listings } = await supabase
      .from("listings")
      .select("id")
      .eq("company_id", company?.id || "");

    const listingIds = listings?.map((l) => l.id) || [];

    const { data } = await supabase
      .from("applications")
      .select(
        "*, listing:listings(title), producer_company:companies!applications_producer_company_id_fkey(name, city, verified, slug, type, membership_plan, profile_public)"
      )
      .in("listing_id", listingIds.length ? listingIds : ["none"])
      .order("created_at", { ascending: false });

    applications = data || [];

    const applicationIds = applications.map((a) => a.id);
    if (applicationIds.length) {
      const { data: rooms } = await supabase
        .from("chat_rooms")
        .select("id, application_id")
        .in("application_id", applicationIds);

      for (const room of rooms || []) {
        chatRoomByApplication.set(room.application_id, room.id);
      }
    }
  }

  const compareGroups = buildCompareGroups(
    applications,
    session?.isDemo,
    chatRoomByApplication
  );
  const messageableStatuses = new Set(["approved", "agreed", "no_agreement"]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Teklifler</h1>
      <p className="mt-1 text-gray-500">İlanlarınıza gelen tedarikçi teklifleri</p>

      {applications.length > 0 && (
        <div className="mt-6">
          <ApplicationCompare groups={compareGroups} />
        </div>
      )}

      <div className="mt-8 space-y-4">
        {applications.length > 0 ? (
          applications.map((app) => {
            const status = statusMap[app.status] || statusMap.pending;
            const listingTitle = app.listing_title || app.listing?.title;
            const producerCompany = resolveProducerCompany(app, session?.isDemo);
            const producerName =
              app.producer_name || producerCompany?.name || app.producer_company?.name;
            const producerCity =
              app.producer_city || producerCompany?.city || app.producer_company?.city;
            const producerCategories = getCategoriesByIds(
              producerCompany?.category_ids ?? app.producer_company?.category_ids,
              categories
            );
            const chatRoomId = chatRoomByApplication.get(app.id);
            const verified =
              producerCompany?.verified ?? app.producer_company?.verified ?? false;

            return (
              <Card key={app.id}>
                <CardContent>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {producerCompany && canUsePublicProfile(producerCompany) ? (
                            <Link
                              href={getCompanyProfilePath(producerCompany)}
                              className="text-brand-600 hover:text-brand-700"
                              target="_blank"
                            >
                              {producerName || "Tedarikçi"}
                            </Link>
                          ) : (
                            producerName || "Tedarikçi"
                          )}
                        </h3>
                        <VerifiedBadge verified={verified} type="producer" />
                        {producerCompany && isProducerPro(producerCompany) && (
                          <Badge variant="brand">Öne Çıkan</Badge>
                        )}
                        <Badge variant={status.variant}>{status.label}</Badge>
                        {messageableStatuses.has(app.status) && chatRoomId && (
                          <Link
                            href={`/dashboard/mesajlar/${chatRoomId}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100"
                          >
                            <MessageCircle className="h-4 w-4" />
                            Mesaja Git
                          </Link>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        İlan: {listingTitle} &middot; {producerCity} &middot; {formatDate(app.created_at)}
                      </p>
                      {producerCategories.length > 0 && (
                        <div className="mt-2">
                          <p className="mb-1 text-xs text-gray-400">Üretim alanları:</p>
                          <CategoryBadges categories={producerCategories} />
                        </div>
                      )}
                      {app.cover_letter && (
                        <p className="mt-3 text-sm text-gray-600">{app.cover_letter}</p>
                      )}
                      {app.proposed_budget && (
                        <p className="mt-2 text-sm font-medium text-gray-700">
                          Teklif: {formatCurrency(app.proposed_budget)}
                          {app.proposed_delivery && ` · Teslim: ${app.proposed_delivery}`}
                        </p>
                      )}
                    </div>
                    <div className="flex w-full shrink-0 flex-col gap-3 sm:max-w-xs">
                      {app.status === "pending" && (
                        <ApplicationActions
                          applicationId={app.id}
                          listingOwnerId={session!.id}
                          applicantUserId={app.applicant_id}
                          isDemo={session?.isDemo}
                        />
                      )}
                      {(app.status === "approved" ||
                        app.status === "agreed" ||
                        app.status === "no_agreement") && (
                        <DealActions
                          applicationId={app.id}
                          applicationStatus={app.status as ApplicationStatus}
                          listingId={app.listing_id}
                          applicantUserId={app.applicant_id}
                          isDemandOwner
                          isDemo={session?.isDemo}
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              Henüz teklif bulunmuyor.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
