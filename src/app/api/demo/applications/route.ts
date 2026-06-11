import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { isDemoMode } from "@/lib/demo/config";
import {
  addDemoChatRoom,
  addDemoNotification,
  createId,
  getDemoApplications,
  getDemoCompany,
  updateDemoApplication,
} from "@/lib/demo/store";

export async function GET() {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session?.companyId) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const applications = getDemoApplications(session.companyId);
  return NextResponse.json({ applications });
}

export async function PATCH(request: Request) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session?.companyId) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = await request.json();
  const { applicationId, status } = body as {
    applicationId: string;
    status: "approved" | "rejected";
  };

  const applications = getDemoApplications(session.companyId);
  const app = applications.find((a) => a.id === applicationId);
  if (!app) {
    return NextResponse.json({ error: "Başvuru bulunamadı." }, { status: 404 });
  }

  updateDemoApplication(applicationId, { status });

  if (status === "approved") {
    const roomId = createId("room");
    const demandCompany = getDemoCompany(session.companyId);

    addDemoChatRoom({
      id: roomId,
      application_id: applicationId,
      listing_id: app.listing_id,
      listing_title: app.listing_title,
      demand_company_id: session.companyId,
      demand_company_name: demandCompany?.name || "Talep Sahibi",
      producer_company_id: app.producer_company_id,
      producer_name: app.producer_name,
      created_at: new Date().toISOString(),
    });

    addDemoNotification({
      id: createId("notif"),
      user_id: session.id,
      type: "application_approved",
      title: "Başvuru Onaylandı",
      message: `${app.producer_name} başvurusu onaylandı. Mesajlaşmaya başlayabilirsiniz.`,
      link: `/dashboard/mesajlar/${roomId}`,
      is_read: false,
      created_at: new Date().toISOString(),
    });
  } else {
    addDemoNotification({
      id: createId("notif"),
      user_id: session.id,
      type: "application_rejected",
      title: "Başvuru Reddedildi",
      message: `${app.producer_name} başvurusu reddedildi.`,
      link: "/dashboard/basvurular",
      is_read: false,
      created_at: new Date().toISOString(),
    });
  }

  return NextResponse.json({ ok: true });
}
