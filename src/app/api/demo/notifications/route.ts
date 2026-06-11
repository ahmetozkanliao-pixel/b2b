import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { isDemoMode } from "@/lib/demo/config";
import {
  getDemoNotifications,
  markAllDemoNotificationsRead,
  markDemoNotificationRead,
} from "@/lib/demo/store";

export async function GET() {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const notifications = getDemoNotifications(session.id);
  return NextResponse.json({ notifications });
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

  if (body.markAll) {
    markAllDemoNotificationsRead(session.id);
    return NextResponse.json({ ok: true });
  }

  if (body.notificationId) {
    markDemoNotificationRead(body.notificationId, session.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
}
