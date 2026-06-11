import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { producerMatchesListing } from "@/lib/categories";
import { DEMO_DEMAND_USER, isDemoMode } from "@/lib/demo/config";
import {
  addDemoApplication,
  addDemoNotification,
  createId,
  getDemoCompany,
  getDemoListingById,
  getDemoMonthlyApplicationCount,
  hasDemoApplication,
} from "@/lib/demo/store";
import { canProducerApply } from "@/lib/membership";
import { getDemoUserById } from "@/lib/demo/session";
import type { DemoApplication } from "@/lib/demo/types";

export async function POST(request: Request) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session || session.role !== "producer" || !session.companyId) {
    return NextResponse.json({ error: "Sadece üretici firmalar başvurabilir." }, { status: 401 });
  }

  const body = await request.json();
  const { listingId, coverLetter, proposedBudget, proposedDelivery } = body;

  const listing = getDemoListingById(listingId);
  if (!listing) {
    return NextResponse.json({ error: "İlan bulunamadı." }, { status: 404 });
  }

  if (hasDemoApplication(listingId, session.id)) {
    return NextResponse.json({ error: "Bu ilana zaten başvurdunuz." }, { status: 409 });
  }

  const producer = getDemoUserById(session.id);
  const producerCompany = getDemoCompany(session.companyId);

  if (!producerCompany || !producerMatchesListing(producerCompany, listing)) {
    return NextResponse.json(
      { error: "Bu ilan kategorisi üretim alanlarınızla eşleşmiyor." },
      { status: 403 }
    );
  }

  const monthlyCount = getDemoMonthlyApplicationCount(session.id);
  if (!canProducerApply(monthlyCount, producerCompany)) {
    return NextResponse.json(
      {
        error:
          "Aylık 10 teklif limitinize ulaştınız. Sınırsız teklif için Pro'ya yükseltin.",
        upgradeRequired: true,
      },
      { status: 403 }
    );
  }

  const application: DemoApplication = {
    id: createId("app"),
    listing_id: listingId,
    producer_company_id: session.companyId,
    applicant_id: session.id,
    cover_letter: coverLetter,
    proposed_budget: proposedBudget ? Number(proposedBudget) : null,
    proposed_delivery: proposedDelivery || null,
    status: "pending",
    created_at: new Date().toISOString(),
    listing_title: listing.title,
    producer_name: producerCompany?.name || producer?.company.name || "Üretici",
    producer_city: producerCompany?.city || producer?.company.city || "",
  };

  addDemoApplication(application);

  addDemoNotification({
    id: createId("notif"),
    user_id: DEMO_DEMAND_USER.id,
    type: "new_application",
    title: "Yeni Başvuru",
    message: `${application.producer_name} ilanınıza başvurdu.`,
    link: "/dashboard/basvurular",
    is_read: false,
    created_at: new Date().toISOString(),
  });

  addDemoNotification({
    id: createId("notif"),
    user_id: session.id,
    type: "new_application",
    title: "Başvurunuz Alındı",
    message: `"${listing.title}" ilanına başvurunuz gönderildi.`,
    link: "/dashboard/basvurularim",
    is_read: false,
    created_at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, application });
}
