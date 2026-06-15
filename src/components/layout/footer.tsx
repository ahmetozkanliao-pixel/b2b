"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { useI18n } from "@/components/i18n/i18n-provider";

export function Footer() {
  const { t } = useI18n();

  const footerLinks = {
    platform: [
      { href: "/ilanlar", label: t("nav.listings") },
      { href: "/nasil-calisir", label: t("nav.howItWorks") },
      { href: "/uyelik", label: t("nav.membership") },
    ],
    kurumsal: [
      { href: "/turkiye", label: t("nav.turkey") },
      { href: "/hakkimizda", label: t("nav.about") },
      { href: "/haberler", label: t("nav.news") },
      { href: "/iletisim", label: t("nav.contact") },
    ],
    yasal: [
      { href: "/kvkk", label: t("nav.kvkk") },
      { href: "/gizlilik-politikasi", label: t("nav.privacy") },
      { href: "/kullanim-sartlari", label: t("nav.terms") },
      { href: "/sss", label: t("nav.faq") },
    ],
  };

  return (
    <footer className="border-t border-neutral-200 bg-white text-neutral-600">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Logo size="sm" variant="light" href="/" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-neutral-500">
              {t("footer.platform")}
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-brand-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-neutral-500">
              {t("footer.corporate")}
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.kurumsal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-brand-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-neutral-500">
              {t("footer.legal")}
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.yasal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-brand-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-8 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
}
