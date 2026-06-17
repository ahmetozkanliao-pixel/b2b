export type OnboardingSlide = {
  id: string;
  emoji: string;
  title: string;
  description: string;
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: "intro",
    emoji: "🏭",
    title: "Türkiye'nin B2B Üretim Platformu",
    description:
      "Müşteriler ile doğrulanmış tedarikçileri tek platformda buluşturuyoruz. Üretim ve tedarik süreçlerinizi dijital ortamda yönetin.",
  },
  {
    id: "demand",
    emoji: "📋",
    title: "İhtiyacınızı İlan Olarak Yayınlayın",
    description:
      "Projenizi veya ürün ihtiyacınızı paylaşın. Kategorinize uygun tedarikçilerden teklif toplayın, başvuruları karşılaştırın.",
  },
  {
    id: "supplier",
    emoji: "🤝",
    title: "Tedarikçiler Teklif Versin",
    description:
      "Tedarikçi firmalar açık ilanlara teklif verir, müşterilerle güvenli mesajlaşma üzerinden süreci yönetir.",
  },
  {
    id: "trust",
    emoji: "🛡️",
    title: "Güvenli ve Şeffaf Süreç",
    description:
      "Onaylı firma profilleri, KVKK uyumlu altyapı ve platform içi mesajlaşma ile işinizi güvenle ilerletin.",
  },
];
