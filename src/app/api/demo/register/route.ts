import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/demo/config";
import { registerDemoUser } from "@/lib/demo/store";
import { sendVerificationEmail } from "@/lib/email/send-verification-email";

export async function POST(request: Request) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const email = (body.email as string)?.trim();
    const password = body.password as string;
    const full_name = (body.full_name as string)?.trim();
    const company_name = (body.company_name as string)?.trim();
    const role = body.role as "demand_owner" | "producer";

    if (!email || !password || !full_name || !company_name) {
      return NextResponse.json({ error: "Tüm alanları doldurun." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Şifre en az 6 karakter olmalıdır." }, { status: 400 });
    }

    if (role !== "demand_owner" && role !== "producer") {
      return NextResponse.json({ error: "Geçersiz hesap türü." }, { status: 400 });
    }

    const token = randomUUID();
    const user = registerDemoUser({
      email,
      password,
      full_name,
      role,
      company_name,
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
