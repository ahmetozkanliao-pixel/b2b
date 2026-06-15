import { NextResponse } from "next/server";
import { z } from "zod";
import { resolveFaqReply } from "@/lib/assistant/faq";
import { generateGeminiReply, isGeminiConfigured } from "@/lib/assistant/gemini";

const requestSchema = z.object({
  message: z.string().trim().min(1).max(500),
  locale: z.enum(["tr", "en"]).default("tr"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      })
    )
    .max(8)
    .default([]),
});

const FAQ_CONFIDENT_SCORE = 8;

export async function GET() {
  return NextResponse.json({
    geminiEnabled: isGeminiConfigured(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
    }

    const { message, locale, history } = parsed.data;
    const faq = resolveFaqReply(message, locale);

    if (faq.score >= FAQ_CONFIDENT_SCORE) {
      return NextResponse.json({
        reply: faq.reply,
        source: "faq",
        geminiEnabled: isGeminiConfigured(),
      });
    }

    if (!isGeminiConfigured()) {
      return NextResponse.json({
        reply: faq.reply,
        source: faq.score >= 3 ? "faq" : "fallback",
        geminiEnabled: false,
      });
    }

    try {
      const reply = await generateGeminiReply(message, locale, history);
      return NextResponse.json({
        reply,
        source: "gemini",
        geminiEnabled: true,
      });
    } catch {
      return NextResponse.json({
        reply: faq.reply,
        source: "fallback",
        geminiEnabled: true,
      });
    }
  } catch {
    return NextResponse.json({ error: "Asistan yanıt veremedi." }, { status: 500 });
  }
}
