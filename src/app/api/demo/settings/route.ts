import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { isDemoMode } from "@/lib/demo/config";
import { getDemoSettings, updateDemoSettings } from "@/lib/demo/store";

export async function GET() {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const settings = getDemoSettings(session.id);
  return NextResponse.json({
    settings,
    profile: {
      full_name: session.full_name,
      email: session.email,
    },
  });
}

export async function PATCH(request: Request) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = await request.json();
  const settings = updateDemoSettings(session.id, body);

  return NextResponse.json({ ok: true, settings });
}
