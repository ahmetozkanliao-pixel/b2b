import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { isDemoMode } from "@/lib/demo/config";
import {
  addDemoNotification,
  closeListingAfterDeal,
  createId,
  getDemoApplicationById,
  getDemoCompany,
  getDemoListings,
  updateDemoApplication,
} from "@/lib/demo/store";

export async function PATCH(request: Request) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session?.companyId || session.role !== "demand_owner") {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = await request.json();
  const { applicationId, status } = body as {
    applicationId: string;
    status: "agreed" | "no_agreement";
  };

  if (!applicationId || !["agreed", "no_agreement"].includes(status)) {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const app = getDemoApplicationById(applicationId);
  if (!app) {
    return NextResponse.json({ error: "Başvuru bulunamadı." }, { status: 404 });
  }

  const ownerListing = getDemoListings(session.companyId).find((l) => l.id === app.listing_id);
  if (!ownerListing) {
    return NextResponse.json({ error: "Bu başvuruya erişim yetkiniz yok." }, { status: 403 });
  }

  if (app.status !== "approved") {
    return NextResponse.json(
      { error: "Sadece onaylanmış başvurular için anlaşma durumu işaretlenebilir." },
      { status: 400 }
    );
  }

  updateDemoApplication(applicationId, { status });

  const demandCompany = getDemoCompany(session.companyId);

  if (status === "agreed") {
    closeListingAfterDeal(app.listing_id, applicationId);

    addDemoNotification({
      id: createId("notif"),
      user_id: app.applicant_id,
      type: "deal_agreed",
      title: "Anlaşma Sağlandı",
      message: `${demandCompany?.name || "Talep sahibi"} ile anlaştınız. İlan kapatıldı.`,
      link: "/dashboard/basvurularim",
      is_read: false,
      created_at: new Date().toISOString(),
    });
  } else {
    addDemoNotification({
      id: createId("notif"),
      user_id: app.applicant_id,
      type: "deal_failed",
      title: "Anlaşma Sağlanamadı",
      message: `${demandCompany?.name || "Talep sahibi"} ile anlaşma sağlanamadı olarak işaretlendi.`,
      link: "/dashboard/basvurularim",
      is_read: false,
      created_at: new Date().toISOString(),
    });
  }

  return NextResponse.json({ ok: true, listingClosed: status === "agreed" });
}
