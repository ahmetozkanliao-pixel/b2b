import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { isDemoMode } from "@/lib/demo/config";
import { getDemoCompany, updateDemoCompany } from "@/lib/demo/store";

export async function POST(request: Request) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session?.companyId || session.role !== "producer") {
    return NextResponse.json({ error: "Sadece tedarikçi firmalar yükseltebilir." }, { status: 401 });
  }

  const body = await request.json();
  const plan = body.plan === "pro" ? "pro" : "free";

  const company = updateDemoCompany(session.companyId, {
    membership_plan: plan,
    ...(plan === "pro" ? { profile_public: true } : { profile_public: false }),
  });

  return NextResponse.json({ ok: true, company, plan });
}

export async function GET() {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session?.companyId) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const company = getDemoCompany(session.companyId);
  return NextResponse.json({
    plan: company?.membership_plan || "free",
    company,
  });
}
