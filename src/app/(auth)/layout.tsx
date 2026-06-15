import { Logo } from "@/components/ui/logo";
import { AuthMarketingPanel } from "@/components/auth/auth-marketing-panel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen gradient-hero">
      <AuthMarketingPanel />

      <div className="relative flex w-full flex-col items-center px-4 py-8 sm:justify-center sm:py-12 lg:w-1/2 lg:py-12">
        <div className="resend-grid pointer-events-none absolute inset-0 opacity-20" aria-hidden />
        <div className="relative mb-6 lg:mb-8 lg:hidden">
          <Logo size="md" variant="light" href="/" />
        </div>
        <div className="relative w-full max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
