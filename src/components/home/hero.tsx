import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Shield, CheckCircle2, Zap } from "lucide-react";

const trustPoints = [
  { icon: Shield, text: "Doğrulanmış üreticiler" },
  { icon: CheckCircle2, text: "KVKK uyumlu" },
  { icon: Zap, text: "Güvenli mesajlaşma" },
];

const stats = [
  { value: "2.400+", label: "Üretici firma" },
  { value: "8.500+", label: "Aktif ilan" },
  { value: "%94", label: "Eşleşme başarısı" },
];

export function Hero() {
  return (
    <section id="giris" data-chapter="giris" className="relative flex min-h-screen flex-col overflow-hidden gradient-hero">
      <div
        className="hero-orb hero-orb-delay-1 -left-32 top-1/4 h-96 w-96 bg-brand-500/20"
        aria-hidden
      />
      <div
        className="hero-orb hero-orb-delay-2 -right-24 top-1/3 h-[28rem] w-[28rem] bg-primary-400/15"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.12),transparent_65%)]"
        aria-hidden
      />

      <div className="relative mx-auto flex flex-1 w-full max-w-7xl flex-col justify-center px-4 pb-28 pt-[5.5rem] sm:px-6 lg:px-8">
        <p className="hero-fade-up hero-fade-up-1 editorial-label text-center text-brand-300/90 lg:text-left">
          Talep · Üretici · İş Birliği
        </p>

        <h1 className="hero-fade-up hero-fade-up-2 editorial-heading-light mt-6 text-center text-[2.5rem] sm:text-5xl lg:text-left lg:text-6xl xl:text-7xl">
          <span className="block">Kurumsal firmalar ile</span>
          <span className="block text-brand-300">doğrulanmış üreticileri</span>
          <span className="block">buluşturuyoruz.</span>
        </h1>

        <p className="hero-fade-up hero-fade-up-3 mx-auto mt-8 max-w-2xl text-center text-base leading-relaxed text-slate-300/90 sm:text-lg lg:mx-0 lg:text-left">
          İhtiyacınızı yayınlayın, kategorinize uygun üreticilerden teklif alın.
          Tüm süreç tek platformda — şeffaf ve güvenli.
        </p>

        <div className="hero-fade-up hero-fade-up-4 mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
          {trustPoints.map((point) => (
            <span
              key={point.text}
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400 sm:text-sm"
            >
              <point.icon className="h-3.5 w-3.5 text-brand-400" />
              {point.text}
            </span>
          ))}
        </div>

        <div className="hero-fade-up hero-fade-up-5 mt-10 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
          <Link href="/kayit?tip=talep" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="group h-12 w-full min-w-[220px] rounded-full px-8 text-sm font-semibold uppercase tracking-wider shadow-lg shadow-brand-900/30 transition-all hover:scale-[1.02]"
            >
              Talep Oluştur
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/kayit?tip=uretici" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="secondary"
              className="h-12 w-full min-w-[220px] rounded-full border-white/25 bg-transparent px-8 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/10"
            >
              Üretici Olarak Katıl
            </Button>
          </Link>
        </div>

        <div className="hero-fade-up hero-fade-up-6 mt-16 grid max-w-3xl grid-cols-3 gap-6 border-t border-white/10 pt-10 lg:max-w-xl">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <p className="font-display text-2xl font-light text-white sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <a
        href="#platform"
        className="hero-fade-up hero-fade-up-6 absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/40 transition-colors hover:text-white/70"
        aria-label="Platform bölümüne kaydır"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.25em]">
          Keşfetmek için kaydır
        </span>
        <ChevronDown className="scroll-indicator h-5 w-5" />
      </a>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
