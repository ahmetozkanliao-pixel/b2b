import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { isDemoMode } from "@/lib/demo/config";
import {
  addDemoNotification,
  createId,
  getDemoCompany,
  updateDemoCompany,
} from "@/lib/demo/store";

export async function PATCH(request: Request) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = await request.json();
  const { companyId, status, verified } = body as {
    companyId: string;
    status?: "approved" | "rejected" | "suspended";
    verified?: boolean;
  };

  const company = getDemoCompany(companyId);
  if (!company) {
    return NextResponse.json({ error: "Firma bulunamadı." }, { status: 404 });
  }

  if (verified !== undefined) {
    if (company.status !== "approved") {
      return NextResponse.json(
        { error: "Yalnızca onaylı firmalar doğrulanabilir." },
        { status: 400 }
      );
    }

    updateDemoCompany(companyId, { verified });

    if (company.owner_id) {
      addDemoNotification({
        id: createId("notif"),
        user_id: company.owner_id,
        type: verified ? "company_verified" : "company_unverified",
        title: verified ? "Doğrulanmış Üretici Rozeti" : "Doğrulama Kaldırıldı",
        message: verified
          ? "Firmanız admin tarafından doğrulanmış üretici olarak işaretlendi."
          : "Firmanızın doğrulama rozeti kaldırıldı.",
        link: "/dashboard/firma",
        is_read: false,
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ ok: true });
  }

  if (!status) {
    return NextResponse.json({ error: "status veya verified gerekli." }, { status: 400 });
  }

  updateDemoCompany(companyId, {
    status,
    verified: status === "approved" ? company.verified : false,
    profile_public: status === "approved" && company.membership_plan === "pro",
  });

  if (company.owner_id) {
    const isApproved = status === "approved";
    addDemoNotification({
      id: createId("notif"),
      user_id: company.owner_id,
      type: isApproved ? "company_approved" : "company_rejected",
      title: isApproved ? "Firmanız Onaylandı" : "Firma Başvurunuz Reddedildi",
      message: isApproved
        ? "Firma kaydınız onaylandı. Artık platformu tam olarak kullanabilirsiniz."
        : "Firma başvurunuz incelendi ve onaylanmadı.",
      link: "/dashboard",
      is_read: false,
      created_at: new Date().toISOString(),
    });
  }

  return NextResponse.json({ ok: true });
}
