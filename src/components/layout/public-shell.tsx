"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      <Header />
      <main className={cn("public-content min-h-screen", !isHome && "bg-page pt-14")}>
        {children}
      </main>
      <Footer />
    </>
  );
}
