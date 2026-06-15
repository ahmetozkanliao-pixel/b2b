import type { Metadata } from "next";
import { ForgotPasswordPageContent } from "@/components/auth/forgot-password-page-content";

export const metadata: Metadata = {
  title: "Şifremi Unuttum",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageContent />;
}
