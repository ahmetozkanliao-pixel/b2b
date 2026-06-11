import Link from "next/link";
import { Shield, Lock, MessageSquare, Eye } from "lucide-react";
import { Logo } from "@/components/ui/logo";

const footerLinks = {
  platform: [
    { href: "/ilanlar", label: "İlanlar" },
    { href: "/nasil-calisir", label: "Nasıl Çalışır" },
    { href: "/uyelik", label: "Üyelik Paketleri" },
  ],
  kurumsal: [
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/haberler", label: "Haberler" },
    { href: "/iletisim", label: "İletişim" },
  ],
  yasal: [
    { href: "/kvkk", label: "KVKK" },
    { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
    { href: "/kullanim-sartlari", label: "Kullanım Şartları" },
    { href: "/sss", label: "SSS" },
  ],
};

const trustItems = [
  { icon: Shield, label: "Onaylı Firma Sistemi" },
  { icon: Lock, label: "KVKK Uyumlu" },
  { icon: MessageSquare, label: "Güvenli Mesajlaşma" },
  { icon: Eye, label: "Şeffaf Süreç" },
];

export function Footer() {
  return (
    <footer className="bg-primary-950 text-slate-300">
      <div className="border-b border-white/5">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6 lg:px-8">
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/20">
                <item.icon className="h-5 w-5 text-brand-400" />
              </div>
              <span className="text-sm font-medium text-slate-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Logo size="sm" variant="light" href="/" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Üretici firmalar ile kurumsal firmaları güvenli ve şeffaf bir ortamda buluşturuyoruz.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Platform</h3>
            <ul className="space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 transition-colors hover:text-brand-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Kurumsal</h3>
            <ul className="space-y-2.5">
              {footerLinks.kurumsal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 transition-colors hover:text-brand-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Yasal</h3>
            <ul className="space-y-2.5">
              {footerLinks.yasal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 transition-colors hover:text-brand-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} B2B Üretim ve Tedarik Platformu. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
