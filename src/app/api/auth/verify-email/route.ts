import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/demo/config";
import { verifyRegisteredDemoUser } from "@/lib/demo/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const origin = new URL(request.url).origin;

  if (!token) {
    return NextResponse.redirect(`${origin}/giris?error=invalid-token`);
  }

  if (isDemoMode()) {
    const user = verifyRegisteredDemoUser(token);
    if (!user) {
      return NextResponse.redirect(`${origin}/giris?error=invalid-token`);
    }
    return NextResponse.redirect(`${origin}/giris?verified=1`);
  }

  return NextResponse.redirect(`${origin}/giris?error=demo-only`);
}
