import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Locale } from "@/lib/i18n/config";
import { getFaqKnowledgeContext } from "@/lib/assistant/faq";

export function isGeminiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

function buildSystemPrompt(locale: Locale) {
  const faqContext = getFaqKnowledgeContext(locale);

  if (locale === "en") {
    return `You are the help assistant for a B2B production and supply platform in Turkey.
Answer briefly, clearly, and in English. Use short paragraphs or bullet lists when helpful.
Only answer questions about the platform: registration, customer vs supplier roles, listings, applications, messaging, categories, membership, demo accounts, and contact.
Never ask for or store personal data (ID numbers, passwords, card details).
If a question is outside the platform scope, politely redirect to FAQ (/sss) or Contact (/iletisim).

Platform knowledge base:
${faqContext}`;
  }

  return `Sen Türkiye'deki bir B2B üretim ve tedarik platformunun yardım asistanısın.
Kısa, net ve Türkçe yanıt ver. Gerekirse madde madde yaz.
Yalnızca platformla ilgili soruları yanıtla: kayıt, müşteri/tedarikçi rolleri, ilanlar, başvurular, mesajlaşma, kategoriler, üyelik, demo hesaplar ve iletişim.
Kişisel veri (TC, şifre, kart bilgisi vb.) isteme veya saklama.
Soru platform dışındaysa kibarca SSS (/sss) veya İletişim (/iletisim) sayfasına yönlendir.

Platform bilgi bankası:
${faqContext}`;
}

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export async function generateGeminiReply(
  message: string,
  locale: Locale,
  history: ChatTurn[] = []
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const modelName = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: buildSystemPrompt(locale),
  });

  const recentHistory = history.slice(-6);
  const contents = [
    ...recentHistory.map((turn) => ({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: turn.content }],
    })),
    { role: "user", parts: [{ text: message }] },
  ] as { role: string; parts: { text: string }[] }[];

  const result = await model.generateContent({ contents });
  const text = result.response.text().trim();

  if (!text) {
    throw new Error("Empty Gemini response");
  }

  return text;
}
