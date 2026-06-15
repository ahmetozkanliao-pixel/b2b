import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/get-session";
import { getPanelBadges } from "@/lib/panel-badges";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ messages: 0, notifications: 0 });
  }

  const badges = await getPanelBadges(session);
  return NextResponse.json(badges);
}
