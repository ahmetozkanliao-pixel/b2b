import {
  UserPlus,
  FileText,
  Send,
  CheckCircle,
  MessageCircle,
  Handshake,
  Building2,
  Factory,
  ArrowRight,
  Shield,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: UserPlus,
    title: "Kurumsal firma kayıt olur",
    description: "Platforma ücretsiz kayıt olun ve firma profilinizi oluşturun.",
    role: "demand" as const,
    phase: "Başlangıç",
    visual: "Kayıt formu doldurulur, firma profili oluşturulur.",
  },
  {
    icon: FileText,
    title: "İhtiyacını ilan olarak yayınlar",
    description: "Ürün veya hizmet ihtiyacınızı kategori seçerek detaylı ilan olarak paylaşın.",
    role: "demand" as const,
    phase: "Başlangıç",
    visual: "Bütçe, teslim süresi ve teknik detaylar eklenir.",
  },
  {
    icon: Send,
    title: "Üreticiler ilana başvurur",
    description: "Kategorinize uygun doğrulanmış üretici firmalar ilanınıza başvuru yapar.",
    role: "producer" as const,
    phase: "Eşleşme",
    visual: "Üreticiler teklif ve ön yazı ile başvurur.",
  },
  {
    icon: CheckCircle,
    title: "Kurumsal firma üreticiyi seçer",
    description: "Gelen başvuruları inceleyin ve en uygun üreticiyi onaylayın.",
    role: "demand" as const,
    phase: "Eşleşme",
    visual: "Başvurular karşılaştırılır, en uygun firma seçilir.",
  },
  {
    icon: MessageCircle,
    title: "Taraflar platform içinde görüşür",
    description: "Onay sonrası güvenli mesajlaşma ve dosya paylaşımı aktif olur.",
    role: "both" as const,
    phase: "İş Birliği",
    visual: "Güvenli mesajlaşma ve dosya paylaşımı başlar.",
  },
  {
    icon: Handshake,
    title: "İş anlaşması gerçekleşir",
    description: "Teklif paylaşımı ve süreç yönetimi ile iş birliğinizi tamamlayın.",
    role: "both" as const,
    phase: "İş Birliği",
    visual: "Teklif onaylanır, üretim süreci başlar.",
  },
];

const roleConfig = {
  demand: {
    label: "Talep Sahibi",
    icon: Building2,
    className: "bg-white/10 text-neutral-300 ring-white/10",
  },
  producer: {
    label: "Üretici",
    icon: Factory,
    className: "bg-white/10 text-neutral-300 ring-white/10",
  },
  both: {
    label: "Her İkisi",
    icon: Shield,
    className: "bg-white/10 text-neutral-300 ring-white/10",
  },
};

const phases = ["Başlangıç", "Eşleşme", "İş Birliği"] as const;

const phaseColors: Record<(typeof phases)[number], string> = {
  Başlangıç: "from-neutral-600 to-neutral-700",
  Eşleşme: "from-neutral-500 to-neutral-600",
  "İş Birliği": "from-neutral-400 to-neutral-500",
};

function StepCard({
  step,
  index,
  isLast,
}: {
  step: (typeof steps)[0];
  index: number;
  isLast: boolean;
}) {
  const role = roleConfig[step.role];
  const RoleIcon = role.icon;

  return (
    <div className="relative flex gap-6 lg:gap-8">
      {/* Sol zaman çizelgesi */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-soft",
            phaseColors[step.phase as keyof typeof phaseColors]
          )}
        >
          <step.icon className="h-6 w-6 text-white" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-black text-[10px] font-bold text-white">
            {index + 1}
          </span>
        </div>
        {!isLast && (
          <div className="mt-2 w-px flex-1 bg-gradient-to-b from-white/20 via-white/10 to-transparent min-h-[3rem] lg:min-h-[4rem]" />
        )}
      </div>

      {/* Kart */}
      <div className="gradient-box gradient-box-hover group mb-10 flex-1 rounded-xl p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1",
              role.className
            )}
          >
            <RoleIcon className="h-3 w-3" />
            {role.label}
          </span>
          <span className="text-xs font-medium text-neutral-500">{step.phase}</span>
        </div>

        <h3 className="text-lg font-medium text-white">{step.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-400">{step.description}</p>

        <div className="mt-4 flex items-center gap-3 rounded-lg border border-dashed border-white/10 bg-white/[0.02] px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
            <step.icon className="h-4 w-4 text-neutral-400" />
          </div>
          <p className="text-xs leading-relaxed text-neutral-500">{step.visual}</p>
        </div>
      </div>
    </div>
  );
}

function FlowDiagram() {
  return (
    <div className="gradient-box mb-16 hidden overflow-hidden rounded-xl p-8 lg:block">
      <div className="flex items-center justify-between gap-2">
        {/* Talep Sahibi */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <Building2 className="h-8 w-8 text-neutral-300" />
          </div>
          <span className="text-xs font-medium text-neutral-400">Talep Sahibi</span>
        </div>

        <FlowArrow label="İlan yayınlar" />

        <div className="flex flex-col items-center gap-2">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-white/20 bg-white/10">
            <Shield className="h-9 w-9 text-white" />
          </div>
          <span className="text-xs font-medium text-white">B2B Platform</span>
        </div>

        <FlowArrow label="Başvuru alır" />

        <div className="flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <Factory className="h-8 w-8 text-neutral-300" />
          </div>
          <span className="text-xs font-medium text-neutral-400">Üretici</span>
        </div>

        <FlowArrow label="Eşleşme" />

        <div className="flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <Handshake className="h-8 w-8 text-neutral-300" />
          </div>
          <span className="text-xs font-medium text-neutral-400">İş Birliği</span>
        </div>
      </div>
    </div>
  );
}

function FlowArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 px-1">
      <div className="flex w-full items-center">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-white/30" />
        <ArrowRight className="h-4 w-4 shrink-0 text-neutral-500" />
        <div className="h-px flex-1 bg-gradient-to-r from-white/30 via-white/20 to-transparent" />
      </div>
      <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-wide text-neutral-500">
        {label}
      </span>
    </div>
  );
}

function PhasePills() {
  return (
    <div className="mb-12 flex flex-wrap justify-center gap-3">
      {phases.map((phase, i) => (
        <div
          key={phase}
          className="gradient-box flex items-center gap-2 rounded-lg px-4 py-2"
        >
          <span
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white",
              phaseColors[phase]
            )}
          >
            {i + 1}
          </span>
          <span className="text-sm font-medium text-neutral-300">{phase}</span>
        </div>
      ))}
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="nasil-calisir" className="public-content chapter-bg-muted section-divider relative overflow-hidden py-28 sm:py-32">
      <div className="resend-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div className="pointer-events-none absolute inset-0 section-ambient" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center">
          <p className="editorial-label">Süreç</p>
          <h2 className="editorial-heading mt-4 text-4xl sm:text-5xl lg:text-6xl">
            Nasıl çalışır?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
            6 basit adımda talep sahibi ile üreticiyi buluşturuyoruz
          </p>
        </ScrollReveal>

        <ScrollReveal delay={120} className="mt-16">
          <FlowDiagram />
          <PhasePills />
        </ScrollReveal>

        {/* Mobil: yatay özet şerit */}
        <div className="mb-10 flex items-center justify-center gap-3 overflow-x-auto pb-2 lg:hidden">
          <div className="flex shrink-0 flex-col items-center gap-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
              <Building2 className="h-5 w-5 text-neutral-400" />
            </div>
            <span className="text-[10px] font-medium text-neutral-500">Talep</span>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-neutral-600" />
          <div className="flex shrink-0 flex-col items-center gap-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/20 bg-white/10">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-[10px] font-medium text-white">Platform</span>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-neutral-600" />
          <div className="flex shrink-0 flex-col items-center gap-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
              <Factory className="h-5 w-5 text-neutral-400" />
            </div>
            <span className="text-[10px] font-medium text-neutral-500">Üretici</span>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-neutral-600" />
          <div className="flex shrink-0 flex-col items-center gap-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
              <Handshake className="h-5 w-5 text-neutral-400" />
            </div>
            <span className="text-[10px] font-medium text-neutral-500">Anlaşma</span>
          </div>
        </div>

        <div className="mx-auto max-w-5xl lg:grid lg:grid-cols-2 lg:gap-x-12">
          <ScrollReveal delay={80}>
            {steps.slice(0, 3).map((step, i) => (
              <StepCard
                key={step.title}
                step={step}
                index={i}
                isLast={i === 2}
              />
            ))}
          </ScrollReveal>
          <ScrollReveal delay={160}>
            {steps.slice(3).map((step, i) => (
              <StepCard
                key={step.title}
                step={step}
                index={i + 3}
                isLast={i === 2}
              />
            ))}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
