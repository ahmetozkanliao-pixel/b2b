import type { Metadata } from "next";
import { HowItWorks } from "@/components/home/how-it-works";

export const metadata: Metadata = {
  title: "Nasıl Çalışır",
  description: "B2B Üretim Platformu'nun çalışma prensibini öğrenin.",
};

export default function HowItWorksPage() {
  return <HowItWorks />;
}
