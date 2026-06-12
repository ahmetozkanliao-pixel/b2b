import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { getDemoUserById } from "@/lib/demo/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const demoUser = session.isDemo ? getDemoUserById(session.id) : null;
  const company = demoUser?.company;

  return NextResponse.json({
    user: {
      id: session.id,
      email: session.email,
      full_name: session.full_name,
      role: session.role,
      companyId: session.companyId,
      companyName: company?.name ?? null,
      companySlug: company?.slug ?? null,
      dashboardPath: session.role === "admin" ? "/admin" : "/dashboard",
    },
  });
}
