import type { Metadata } from "next";
import { StaticPage } from "@/components/pages/static-page";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
};

export default function PrivacyPage() {
  return (
    <StaticPage title="Gizlilik Politikası">
      <p>
        B2B Üretim Platformu olarak gizliliğinize önem veriyoruz. Bu politika,
        platformumuzu kullanırken toplanan bilgilerin nasıl işlendiğini açıklar.
      </p>
      <h2>Toplanan Bilgiler</h2>
      <p>
        Kayıt sırasında sağladığınız kişisel ve firma bilgileri, platform
        kullanım verileri ve iletişim içerikleri toplanmaktadır.
      </p>
      <h2>Bilgilerin Kullanımı</h2>
      <p>
        Toplanan bilgiler hizmet sunumu, güvenlik, iyileştirme ve yasal
        yükümlülüklerin yerine getirilmesi amacıyla kullanılır.
      </p>
      <h2>Veri Güvenliği</h2>
      <p>
        Verileriniz SSL şifreleme ve endüstri standardı güvenlik önlemleriyle
        korunmaktadır.
      </p>
    </StaticPage>
  );
}
