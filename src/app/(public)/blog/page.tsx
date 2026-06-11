import type { Metadata } from "next";
import { StaticPage } from "@/components/pages/static-page";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogPage() {
  return (
    <StaticPage title="Blog">
      <p>
        Üretim sektörü, tedarik zinciri ve B2B ticaret hakkında güncel yazılar
        yakında burada yayınlanacak.
      </p>
    </StaticPage>
  );
}
