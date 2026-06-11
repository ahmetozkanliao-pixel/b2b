import type { Metadata } from "next";
import { StaticPage } from "@/components/pages/static-page";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
};

export default function KVKKPage() {
  return (
    <StaticPage title="KVKK Aydınlatma Metni">
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında,
        kişisel verileriniz veri sorumlusu olarak B2B Üretim Platformu tarafından
        aşağıda açıklanan kapsamda işlenebilecektir.
      </p>
      <h2>İşlenen Kişisel Veriler</h2>
      <p>
        Kimlik bilgileri, iletişim bilgileri, firma bilgileri, işlem güvenliği
        bilgileri ve platform kullanım verileri işlenmektedir.
      </p>
      <h2>İşleme Amaçları</h2>
      <p>
        Üyelik işlemlerinin yürütülmesi, ilan ve başvuru süreçlerinin yönetimi,
        mesajlaşma hizmetinin sağlanması ve yasal yükümlülüklerin yerine getirilmesi.
      </p>
      <h2>Haklarınız</h2>
      <p>
        KVKK&apos;nın 11. maddesi kapsamında kişisel verilerinizle ilgili bilgi talep
        etme, düzeltme, silme ve itiraz etme haklarına sahipsiniz.
      </p>
    </StaticPage>
  );
}
