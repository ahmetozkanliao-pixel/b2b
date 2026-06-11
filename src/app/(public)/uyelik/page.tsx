import type { Metadata } from "next";
import { Pricing } from "@/components/home/pricing";

export const metadata: Metadata = {
  title: "Üyelik Paketleri",
};

export default function MembershipPage() {
  return <Pricing />;
}
