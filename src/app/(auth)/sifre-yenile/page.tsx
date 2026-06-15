import type { Metadata } from "next";
import { ResetPasswordPageContent } from "@/components/auth/reset-password-page-content";

export const metadata: Metadata = {
  title: "Yeni Şifre Belirle",
};

export default function ResetPasswordPage() {
  return <ResetPasswordPageContent />;
}
