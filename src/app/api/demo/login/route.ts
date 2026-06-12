import { NextResponse } from "next/server";
import {
  DEMO_SESSION_COOKIE,
  isDemoMode,
} from "@/lib/demo/config";
import { createDemoSession } from "@/lib/demo/session";
import { findDemoUser, findUnverifiedRegisteredUser } from "@/lib/demo/user-lookup";

export async function POST(request: Request) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const body = await request.json();
  const email = body.email as string;
  const password = body.password as string;

  const unverified = findUnverifiedRegisteredUser(email, password);
  if (unverified) {
    return NextResponse.json(
      { error: "E-postanızı doğrulamanız gerekiyor. Gelen kutunuzu kontrol edin." },
      { status: 403 }
    );
  }

  const user = findDemoUser(email, password);
  if (!user) {
    return NextResponse.json({ error: "E-posta veya şifre hatalı." }, { status: 401 });
  }

  const session = createDemoSession(user);
  const response = NextResponse.json({
    ok: true,
    user: {
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    },
  });

  response.cookies.set(DEMO_SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
