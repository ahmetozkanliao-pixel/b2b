import { Header } from "@/components/layout/header";
import { AuthMarketingPanel } from "@/components/auth/auth-marketing-panel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col bg-page pt-14 lg:gradient-hero">
        <div className="flex min-h-[calc(100dvh-3.5rem)] flex-1 flex-col lg:flex-row">
          <AuthMarketingPanel />

          <div className="relative flex w-full flex-col items-center px-4 py-6 pb-24 sm:justify-center sm:py-12 lg:w-1/2 lg:bg-page lg:py-12 lg:pb-12">
            <div className="resend-grid pointer-events-none absolute inset-0 opacity-20" aria-hidden />
            <div className="relative w-full max-w-2xl">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
