import { Suspense } from "react";
import { LoginPageContent } from "@/components/auth/login-page-content";

function LoginFallback() {
  return (
    <div className="auth-card animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-slate-100" />
      <div className="mt-3 h-4 w-full max-w-sm rounded bg-slate-100" />
      <div className="mt-8 space-y-4">
        <div className="h-24 rounded-lg bg-slate-100" />
        <div className="h-11 rounded-lg bg-slate-100" />
        <div className="h-11 rounded-lg bg-slate-100" />
        <div className="h-11 rounded-lg bg-slate-100" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}
