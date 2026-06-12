import { Logo } from "@/components/ui/logo";
import { AuthMarketingPanel } from "@/components/auth/auth-marketing-panel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black">
      <AuthMarketingPanel />

      <div className="relative flex w-full flex-col items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="resend-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mb-8 lg:hidden">
          <Logo size="md" variant="light" href="/" />
        </div>
        <div className="relative w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
