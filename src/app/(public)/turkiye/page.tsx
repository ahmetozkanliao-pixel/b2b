import type { Metadata } from "next";
import { TurkeyMapPage } from "@/components/turkey/turkey-map-page";

export const metadata: Metadata = {
  title: "Türkiye",
  description:
    "Türkiye genelinde müşteri ve tedarikçi ağımızı keşfedin. 81 ilde canlı B2B üretim ve tedarik haritası.",
};

export default function TurkiyePage() {
  return <TurkeyMapPage />;
}
