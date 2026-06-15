import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/demo/config";
import { registerDemoUser } from "@/lib/demo/store";
import { sendVerificationEmail } from "@/lib/email/send-verification-email";
import {
  normalizeRegistrationPayload,
  validateRegistrationPayload,
} from "@/lib/auth/registration";

export async function POST(request: Request) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const validationError = validateRegistrationPayload(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const payload = normalizeRegistrationPayload(body);
    const token = randomUUID();
    const user = registerDemoUser({
      ...payload,
      verification_token: token,
    });

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      request.headers.get("origin") ||
      "http://localhost:3000";
    const verifyUrl = `${origin}/api/auth/verify-email?token=${token}`;

    let emailSent = false;
    let devVerifyUrl: string | undefined;

    try {
      const emailResult = await sendVerificationEmail({
        to: user.email,
        name: user.full_name,
        verifyUrl,
      });
      emailSent = emailResult.sent;
      devVerifyUrl = emailResult.devUrl;
    } catch (emailError) {
      console.error("[register] E-posta gönderilemedi:", emailError);
      devVerifyUrl = verifyUrl;
    }

    return NextResponse.json({
      ok: true,
      message: emailSent
        ? "Kayıt başarılı. E-posta adresinize doğrulama bağlantısı gönderildi."
        : "Kayıt başarılı. E-posta gönderilemedi; aşağıdaki doğrulama bağlantısını kullanın.",
      emailSent,
      devVerifyUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kayıt başarısız.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
