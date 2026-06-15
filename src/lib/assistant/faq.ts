import type { Locale } from "@/lib/i18n/config";

type FaqEntry = {
  id: string;
  keywords: string[];
  answer: Record<Locale, string>;
};

const FAQ_ENTRIES: FaqEntry[] = [
  {
    id: "register",
    keywords: [
      "kayıt",
      "kayit",
      "üye",
      "uye",
      "hesap aç",
      "hesap ac",
      "nasıl kayıt",
      "register",
      "sign up",
      "create account",
    ],
    answer: {
      tr: "Kayıt olmak için sağ üstten **Kayıt Ol**'a tıklayın. Müşteri iseniz teklif toplamak için; tedarikçi iseniz ilanlara başvurmak için kayıt olursunuz. Tedarikçiler faaliyet alanı (kategori) seçmek zorundadır.",
      en: "Click **Register** in the top right. Customers join to collect quotes; suppliers join to apply to listings. Suppliers must select at least one business category.",
    },
  },
  {
    id: "customer-vs-supplier",
    keywords: [
      "müşteri",
      "musteri",
      "tedarikçi",
      "tedarikci",
      "üretici",
      "uretici",
      "fark",
      "rol",
      "customer",
      "supplier",
      "difference",
    ],
    answer: {
      tr: "**Müşteri:** İhtiyacını ilan olarak yayınlar, tedarikçilerden teklif toplar.\n\n**Tedarikçi:** Kategorisine uygun ilanları görür ve teklif/başvuru gönderir.",
      en: "**Customer:** Publishes needs as listings and collects quotes from suppliers.\n\n**Supplier:** Sees listings in their categories and submits offers.",
    },
  },
  {
    id: "demo",
    keywords: [
      "demo",
      "test",
      "örnek",
      "ornek",
      "giriş bilgi",
      "giris bilgi",
      "şifre",
      "sifre",
      "e-posta",
      "eposta",
      "login",
      "password",
    ],
    answer: {
      tr: "Demo hesaplar (giriş sayfasında da görünür):\n\n• **Müşteri:** demo@talep.com — Talep2026!\n• **Tedarikçi (ücretsiz):** demo@tedarikci.com — Tedarikci2026!\n• **Tedarikçi (Pro):** demo@uretici.com — Uretici2026!\n• **Admin:** demo@admin.com — Admin2026!",
      en: "Demo accounts (also shown on the login page):\n\n• **Customer:** demo@talep.com — Talep2026!\n• **Supplier (free):** demo@tedarikci.com — Tedarikci2026!\n• **Supplier (Pro):** demo@uretici.com — Uretici2026!\n• **Admin:** demo@admin.com — Admin2026!",
    },
  },
  {
    id: "listing",
    keywords: [
      "ilan",
      "talep",
      "yayınla",
      "yayinla",
      "oluştur",
      "olustur",
      "listing",
      "publish",
      "post",
    ],
    answer: {
      tr: "Müşteri olarak panele girdikten sonra **İlanlarım → Yeni İlan** ile ihtiyacınızı yayınlayın. Ana ve alt kategori seçimi, bütçe ve teslim süresi girin. İlan aktif olunca kategorinize uygun tedarikçiler görebilir.",
      en: "As a customer, go to **My Listings → New Listing** in the dashboard. Choose main and sub category, budget, and delivery time. Once active, matching suppliers can see your listing.",
    },
  },
  {
    id: "apply",
    keywords: [
      "başvuru",
      "basvuru",
      "teklif ver",
      "teklif",
      "apply",
      "offer",
      "quote",
    ],
    answer: {
      tr: "Tedarikçi olarak kategorinize uygun ilanlara başvuru gönderebilirsiniz. Müşteri başvurunuzu onaylarsa mesaj odası açılır ve teklif süreci başlar.",
      en: "As a supplier, apply to listings that match your categories. When the customer approves your application, a chat room opens and the quote process begins.",
    },
  },
  {
    id: "category",
    keywords: [
      "kategori",
      "faaliyet",
      "alan",
      "sektör",
      "sektor",
      "category",
      "categories",
    ],
    answer: {
      tr: "Kayıt veya firma profilinde kategori seçerken arama kutusuna yazarak filtreleyebilirsiniz. İnşaat, hastane, sanayi, gıda tesisi ve daha birçok ana kategori altında alt kategoriler bulunur.",
      en: "When registering or editing your company profile, use the search box to filter categories. Main groups include construction, healthcare, industrial, food facilities, and more.",
    },
  },
  {
    id: "messages",
    keywords: [
      "mesaj",
      "yazışma",
      "yazisma",
      "sohbet",
      "message",
      "chat",
    ],
    answer: {
      tr: "Mesajlaşma, müşteri bir tedarikçi başvurusunu onayladığında başlar. Panelden **Mesajlar** bölümüne gidebilirsiniz.",
      en: "Messaging starts when a customer approves a supplier application. Open **Messages** from your dashboard.",
    },
  },
  {
    id: "membership",
    keywords: [
      "üyelik",
      "uyelik",
      "paket",
      "pro",
      "ücret",
      "ucret",
      "fiyat",
      "membership",
      "plan",
      "pricing",
    ],
    answer: {
      tr: "Müşteriler ücretsiz planda aylık sınırlı ilan açabilir; Pro ile sınırsız ilan mümkündür. Tedarikçiler başvuru limitleri pakete göre değişir. **Üyelik Paketleri** sayfasından detayları inceleyebilirsiniz.",
      en: "Customers on the free plan have a monthly listing limit; Pro offers unlimited listings. Supplier application limits depend on the plan. See **Membership Packages** for details.",
    },
  },
  {
    id: "contact",
    keywords: [
      "iletişim",
      "iletisim",
      "destek",
      "yardım",
      "yardim",
      "contact",
      "support",
      "help",
    ],
    answer: {
      tr: "Ek destek için **İletişim** sayfasından bize yazabilir veya **SSS** sayfasındaki sorulara göz atabilirsiniz.",
      en: "For more help, use the **Contact** page or browse **FAQ**.",
    },
  },
  {
    id: "how-it-works",
    keywords: [
      "nasıl çalışır",
      "nasil calisir",
      "süreç",
      "surec",
      "how it works",
      "how does",
      "platform",
    ],
    answer: {
      tr: "1) Müşteri ilan yayınlar → 2) Tedarikçiler başvurur → 3) Müşteri uygun teklifi onaylar → 4) Güvenli mesajlaşma ile süreç yürür. **Nasıl Çalışır** sayfasında adımları görebilirsiniz.",
      en: "1) Customer publishes a listing → 2) Suppliers apply → 3) Customer approves a quote → 4) Secure messaging continues the process. See **How It Works** for details.",
    },
  },
];

function normalize(text: string) {
  return text.trim().toLocaleLowerCase("tr");
}

function scoreQuery(query: string, keywords: string[]) {
  const normalized = normalize(query);
  if (!normalized) return 0;

  let score = 0;
  for (const keyword of keywords) {
    const key = normalize(keyword);
    if (normalized === key) score += 10;
    else if (normalized.includes(key)) score += key.length >= 4 ? 5 : 3;
  }
  return score;
}

export function getAssistantReply(query: string, locale: Locale): string {
  const result = resolveFaqReply(query, locale);
  return result.reply;
}

export function resolveFaqReply(
  query: string,
  locale: Locale
): { reply: string; score: number; matchedId: string | null } {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      reply:
        locale === "tr"
          ? "Lütfen bir soru yazın veya aşağıdaki kısayollardan birini seçin."
          : "Please type a question or pick a shortcut below.",
      score: 0,
      matchedId: null,
    };
  }

  let best: FaqEntry | null = null;
  let bestScore = 0;

  for (const entry of FAQ_ENTRIES) {
    const score = scoreQuery(trimmed, entry.keywords);
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (best && bestScore >= 3) {
    return { reply: best.answer[locale], score: bestScore, matchedId: best.id };
  }

  return {
    reply:
      locale === "tr"
        ? "Bu konuda net bir eşleşme bulamadım. Şunları deneyebilirsiniz: kayıt, demo hesaplar, ilan açma, kategori seçimi veya iletişim. Daha fazla bilgi için **SSS** ve **İletişim** sayfalarına da bakabilirsiniz."
        : "I couldn't find a clear match. Try asking about: registration, demo accounts, listings, categories, or contact. You can also visit **FAQ** and **Contact**.",
    score: bestScore,
    matchedId: null,
  };
}

export function getFaqKnowledgeContext(locale: Locale): string {
  return FAQ_ENTRIES.map((entry) => `- ${entry.answer[locale].replace(/\*\*/g, "")}`).join("\n");
}

export function getAssistantQuickPrompts(locale: Locale): { id: string; label: string; query: string }[] {
  if (locale === "en") {
    return [
      { id: "register", label: "How to register?", query: "How do I register?" },
      { id: "demo", label: "Demo accounts", query: "demo login password" },
      { id: "roles", label: "Customer vs supplier", query: "customer supplier difference" },
      { id: "listing", label: "Create a listing", query: "how to publish listing" },
      { id: "category", label: "Categories", query: "category selection" },
    ];
  }

  return [
    { id: "register", label: "Nasıl kayıt olunur?", query: "Nasıl kayıt olabilirim?" },
    { id: "demo", label: "Demo hesaplar", query: "Demo giriş bilgileri" },
    { id: "roles", label: "Müşteri / Tedarikçi", query: "Müşteri ve tedarikçi farkı" },
    { id: "listing", label: "İlan nasıl açılır?", query: "İlan nasıl oluşturulur?" },
    { id: "category", label: "Kategori seçimi", query: "Kategori nasıl seçilir?" },
  ];
}
