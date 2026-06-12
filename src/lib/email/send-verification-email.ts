interface SendVerificationEmailInput {
  to: string;
  name: string;
  verifyUrl: string;
}

export async function sendVerificationEmail({
  to,
  name,
  verifyUrl,
}: SendVerificationEmailInput): Promise<{ sent: boolean; devUrl?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "B2B Platform <onboarding@resend.dev>";

  const html = `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #0f172a;">E-posta adresinizi doğrulayın</h2>
      <p style="color: #475569; line-height: 1.6;">
        Merhaba ${name},<br><br>
        B2B Üretim Platformu hesabınızı oluşturmak için aşağıdaki butona tıklayın.
      </p>
      <p style="margin: 32px 0;">
        <a href="${verifyUrl}" style="background: #0d9488; color: white; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: 600;">
          E-postamı Doğrula
        </a>
      </p>
      <p style="color: #94a3b8; font-size: 13px;">
        Buton çalışmıyorsa bu bağlantıyı tarayıcınıza yapıştırın:<br>
        <a href="${verifyUrl}" style="color: #0d9488;">${verifyUrl}</a>
      </p>
    </div>
  `;

  if (!apiKey) {
    console.log(`[email] Doğrulama bağlantısı (${to}): ${verifyUrl}`);
    return { sent: false, devUrl: verifyUrl };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: "E-posta adresinizi doğrulayın — B2B Platform",
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`E-posta gönderilemedi: ${body}`);
  }

  return { sent: true };
}
