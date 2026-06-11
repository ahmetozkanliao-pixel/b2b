import type { Metadata } from "next";
import { StaticPage } from "@/components/pages/static-page";

export const metadata: Metadata = {
  title: "Hakkımızda",
};

export default function AboutPage() {
  return (
    <StaticPage title="Hakkımızda">
      <p>
        B2B Üretim ve Tedarik Platformu, Türkiye&apos;deki kurumsal firmalar ile
        üretici firmaları güvenli ve şeffaf bir ortamda buluşturan dijital bir
        pazar yeridir.
      </p>
      <p>
        Amacımız, üretim süreçlerini dijitalleştirerek firmaların doğru üretici
        partnerlerine hızlı ve güvenilir şekilde ulaşmasını sağlamaktır.
      </p>
      <h2>Misyonumuz</h2>
      <p>
        Türkiye&apos;nin üretim ekosistemini dijitalleştirerek, kurumsal firmaların
        ihtiyaçlarını en uygun üreticilerle eşleştirmek ve tedarik zincirini
        optimize etmek.
      </p>
      <h2>Vizyonumuz</h2>
      <p>
        Türkiye&apos;nin lider B2B üretim ve tedarik platformu olmak.
      </p>
    </StaticPage>
  );
}
