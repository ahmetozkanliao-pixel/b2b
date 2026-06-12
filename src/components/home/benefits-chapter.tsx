import { Building2, Factory, Shield, Lock, Eye, Zap } from "lucide-react";
import { ChapterSection } from "@/components/home/chapter-section";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const benefits = [
  {
    icon: Building2,
    title: "Talep sahipleri",
    subtitle: "Kurumsal firmalar",
    points: ["Ücretsiz ilan yayınlama", "Doğrulanmış üretici havuzu", "Şeffaf başvuru yönetimi"],
    accent: "text-brand-300",
    ring: "ring-brand-400/20",
  },
  {
    icon: Factory,
    title: "Üreticiler",
    subtitle: "Üretim firmaları",
    points: ["Kategoriye uygun ilanlar", "Pro ile firma profili", "Sınırsız teklif imkânı"],
    accent: "text-emerald-300",
    ring: "ring-emerald-400/20",
  },
  {
    icon: Shield,
    title: "Platform",
    subtitle: "Güven & şeffaflık",
    points: ["KVKK uyumlu altyapı", "Güvenli mesajlaşma", "Onaylı firma sistemi"],
    accent: "text-primary-300",
    ring: "ring-primary-400/20",
  },
];

const trustIcons = [
  { icon: Lock, label: "KVKK" },
  { icon: Eye, label: "Şeffaflık" },
  { icon: Zap, label: "Hız" },
];

export function BenefitsChapter() {
  return (
    <ChapterSection id="avantajlar" variant="dark">
      <div
        className="hero-orb hero-orb-delay-2 -right-32 top-1/4 h-80 w-80 bg-brand-500/15"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(20,184,166,0.1),transparent_60%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
        <ScrollReveal className="max-w-3xl">
          <p className="editorial-label text-brand-300/80">04 — Avantajlar</p>
          <h2 className="editorial-heading-light mt-6 text-4xl sm:text-5xl lg:text-6xl">
            Herkes için
            <span className="block text-brand-300">daha güvenli üretim.</span>
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {benefits.map((benefit, index) => (
            <ScrollReveal key={benefit.title} delay={index * 100}>
              <div
                className={`group h-full rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:bg-white/10 ring-1 ${benefit.ring}`}
              >
                <benefit.icon className={`h-8 w-8 ${benefit.accent}`} />
                <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {benefit.subtitle}
                </p>
                <h3 className="mt-2 font-display text-2xl font-light text-white">{benefit.title}</h3>
                <ul className="mt-6 space-y-3">
                  {benefit.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200} className="mt-14 flex flex-wrap items-center justify-center gap-8 border-t border-white/10 pt-10 lg:justify-start">
          {trustIcons.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-slate-400">
              <item.icon className="h-4 w-4 text-brand-400" />
              <span className="text-xs font-medium uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </ChapterSection>
  );
}
