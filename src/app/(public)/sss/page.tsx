import type { Metadata } from "next";
import { StaticPage } from "@/components/pages/static-page";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
};

const faqs = [
  {
    q: "Platforma nasıl kayıt olabilirim?",
    a: "Ana sayfadaki 'Kayıt Ol' butonuna tıklayarak müşteri veya tedarikçi olarak kayıt olabilirsiniz.",
  },
  {
    q: "İlan oluşturmak ücretli mi?",
    a: "Ücretsiz paket ile aylık 3 ilan oluşturabilirsiniz. Pro paket ile sınırsız ilan yayınlayabilirsiniz.",
  },
  {
    q: "Tedarikçi firmalar nasıl doğrulanır?",
    a: "Firma kaydı sonrası admin ekibimiz firma bilgilerini ve sertifikaları inceleyerek onay sürecini tamamlar.",
  },
  {
    q: "Mesajlaşma ne zaman başlar?",
    a: "Müşteri bir tedarikçi başvurusunu onayladığında otomatik olarak mesaj odası açılır.",
  },
  {
    q: "Ödeme nasıl yapılır?",
    a: "Üyelik paketleri için Stripe veya iyzico üzerinden güvenli ödeme yapabilirsiniz.",
  },
];

export default function FAQPage() {
  return (
    <StaticPage title="Sıkça Sorulan Sorular">
      <div className="space-y-6">
        {faqs.map((faq) => (
          <div key={faq.q}>
            <h3 className="text-lg font-semibold text-gray-900">{faq.q}</h3>
            <p className="mt-2 text-gray-600">{faq.a}</p>
          </div>
        ))}
      </div>
    </StaticPage>
  );
}
