import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { isDemoMode } from "@/lib/demo/config";
import { processLogoField } from "@/lib/demo/logo-storage";
import { getDemoCompany, updateDemoCompany } from "@/lib/demo/store";

export async function GET() {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session?.companyId) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const company = getDemoCompany(session.companyId);
  return NextResponse.json({ company });
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
  const { slugify } = await import("@/lib/utils");
  const { canUsePublicProfile } = await import("@/lib/membership");

  const existing = getDemoCompany(session.companyId);
  if (!existing) {
    return NextResponse.json({ error: "Firma bulunamadı." }, { status: 404 });
  }

  if (body.name && !body.slug) {
    body.slug = slugify(body.name);
  }

  if (!canUsePublicProfile(existing) && body.profile_public === true) {
    body.profile_public = false;
  }

  if ("logo_url" in body) {
    try {
      body.logo_url = processLogoField(session.companyId, body.logo_url);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Logo kaydedilemedi.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  const company = updateDemoCompany(session.companyId, body);

  return NextResponse.json({ ok: true, company });
}
