import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Factory,
  Building2,
  CheckCircle2,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";

const trustPoints = [
  { icon: Shield, text: "Doğrulanmış üreticiler" },
  { icon: CheckCircle2, text: "KVKK uyumlu" },
  { icon: Zap, text: "Güvenli mesajlaşma" },
];

const stats = [
  { value: "2.400+", label: "Üretici firma", accent: "text-brand-300" },
  { value: "8.500+", label: "Aktif ilan", accent: "text-white" },
  { value: "%94", label: "Eşleşme başarısı", accent: "text-emerald-300" },
];

export function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden gradient-hero sm:min-h-0">
      {/* Animasyonlu arka plan küreleri */}
      <div
        className="hero-orb hero-orb-delay-1 -left-20 top-20 h-72 w-72 bg-brand-500/25"
        aria-hidden
      />
      <div
        className="hero-orb hero-orb-delay-2 -right-16 top-1/3 h-96 w-96 bg-primary-400/20"
        aria-hidden
      />
      <div
        className="hero-orb hero-orb-delay-3 bottom-20 left-1/3 h-64 w-64 bg-emerald-500/15"
        aria-hidden
      />

      {/* Izgara deseni */}
      <div
        className="hero-grid-move absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(42,68,112,0.35),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Sol: metin */}
          <div className="text-center lg:text-left">
            <div className="hero-fade-up hero-fade-up-1 mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-brand-200 shadow-lg shadow-brand-900/20 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="hero-pulse-ring absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
              </span>
              <Factory className="h-4 w-4 text-brand-300" />
              Türkiye&apos;nin Güvenilir B2B Üretim Ağı
            </div>

            <h1 className="hero-fade-up hero-fade-up-2 text-balance text-[1.75rem] font-bold leading-[1.2] tracking-tight text-white sm:text-4xl lg:text-[2.75rem] xl:text-5xl">
              Kurumsal Firmalar ile{" "}
              <span className="hero-gradient-text">Doğrulanmış Üreticileri</span>{" "}
              Buluşturuyoruz
            </h1>

            <p className="hero-fade-up hero-fade-up-3 mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg lg:mx-0">
              İhtiyacınızı yayınlayın, kategorinize uygun üreticilerden teklif alın.
              Tüm süreç tek platformda, şeffaf ve güvenli.
            </p>

            <div className="hero-fade-up hero-fade-up-4 mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              {trustPoints.map((point) => (
                <span
                  key={point.text}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm sm:text-sm"
                >
                  <point.icon className="h-3.5 w-3.5 text-brand-400" />
                  {point.text}
                </span>
              ))}
            </div>

            <div className="hero-fade-up hero-fade-up-5 mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link href="/kayit?tip=talep" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="group w-full shadow-lg shadow-brand-900/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-800/40 sm:min-w-[200px]"
                >
                  Talep Oluştur
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/kayit?tip=uretici" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full border-white/25 bg-white/10 text-white backdrop-blur-sm transition-all hover:scale-[1.02] hover:border-white/40 hover:bg-white/15 sm:min-w-[200px]"
                >
                  Üretici Olarak Katıl
                </Button>
              </Link>
            </div>
          </div>

          {/* Sağ: görsel kart (masaüstü) */}
          <div className="hero-fade-up hero-fade-up-6 relative mt-12 hidden lg:block">
            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="absolute -right-3 -top-3 flex items-center gap-1.5 rounded-full gradient-brand px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                <Sparkles className="h-3.5 w-3.5" />
                Canlı Platform
              </div>

              {/* Mini akış görseli */}
              <div className="space-y-4">
                <FlowCard
                  icon={Building2}
                  label="Talep Sahibi"
                  title="Paslanmaz Çelik Boru Üretimi"
                  meta="İstanbul · ₺50K–150K"
                  color="primary"
                />
                <div className="flex justify-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-400/30 bg-brand-500/20">
                    <ArrowRight className="h-4 w-4 rotate-90 text-brand-300" />
                  </div>
                </div>
                <FlowCard
                  icon={Factory}
                  label="Üretici Teklifi"
                  title="Marmara Metal San."
                  meta="22 gün · ₺88.000 teklif"
                  color="brand"
                  highlight
                />
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs text-slate-300">Eşleşme onaylandı</span>
                </div>
                <span className="text-xs font-semibold text-brand-300">Mesajlaşma aktif</span>
              </div>
            </div>

            {/* Dekoratif yüzen kartlar */}
            <div className="absolute -left-8 top-1/4 animate-[hero-float_6s_ease-in-out_infinite] rounded-xl border border-white/10 bg-primary-800/80 px-3 py-2 backdrop-blur-md">
              <p className="text-xs font-bold text-white">+127</p>
              <p className="text-[10px] text-slate-400">bugün başvuru</p>
            </div>
            <div className="absolute -right-6 bottom-1/4 animate-[hero-float_7s_ease-in-out_infinite_-3s] rounded-xl border border-brand-400/20 bg-brand-900/60 px-3 py-2 backdrop-blur-md">
              <p className="text-xs font-bold text-brand-200">%94</p>
              <p className="text-[10px] text-slate-400">başarı oranı</p>
            </div>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="hero-fade-up hero-fade-up-6 mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:mt-16 sm:gap-6 sm:p-8 lg:max-w-4xl">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group text-center transition-transform duration-300 hover:scale-105"
            >
              <p className={`text-xl font-bold sm:text-3xl ${stat.accent}`}>{stat.value}</p>
              <p className="mt-1 text-[10px] text-slate-400 sm:text-sm">{stat.label}</p>
              <div className="mx-auto mt-2 h-0.5 w-0 rounded-full bg-brand-400 transition-all duration-300 group-hover:w-8" />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
    </section>
  );
}

function FlowCard({
  icon: Icon,
  label,
  title,
  meta,
  color,
  highlight,
}: {
  icon: typeof Building2;
  label: string;
  title: string;
  meta: string;
  color: "primary" | "brand";
  highlight?: boolean;
}) {
  const bg = color === "primary" ? "bg-primary-500/20" : "bg-brand-500/20";
  const iconColor = color === "primary" ? "text-primary-300" : "text-brand-300";

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        highlight
          ? "border-brand-400/30 bg-brand-500/10"
          : "border-white/10 bg-white/5"
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <span className="text-xs font-medium text-slate-400">{label}</span>
      </div>
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-xs text-slate-400">{meta}</p>
    </div>
  );
}
