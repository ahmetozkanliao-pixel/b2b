import type { Metadata } from "next";
import { StaticPage } from "@/components/pages/static-page";

export const metadata: Metadata = {
  title: "Kullanım Şartları",
};

export default function TermsPage() {
  return (
    <StaticPage title="Kullanım Şartları">
      <p>
        B2B Üretim Platformu&apos;nu kullanarak aşağıdaki şartları kabul etmiş
        sayılırsınız.
      </p>
      <h2>Genel Koşullar</h2>
      <p>
        Platform, kurumsal firmalar ile üretici firmaları buluşturmak amacıyla
        sunulmaktadır. Kullanıcılar doğru ve güncel bilgi sağlamakla yükümlüdür.
      </p>
      <h2>Kullanıcı Sorumlulukları</h2>
      <p>
        Kullanıcılar platformu yasalara uygun şekilde kullanmak, diğer
        kullanıcılara saygılı davranmak ve hesap güvenliğini sağlamakla
        yükümlüdür.
      </p>
      <h2>Fikri Mülkiyet</h2>
      <p>
        Platform üzerindeki tüm içerik, tasarım ve yazılım B2B Üretim Platformu&apos;na
        aittir.
      </p>
    </StaticPage>
  );
}
