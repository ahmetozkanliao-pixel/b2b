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
    className: "bg-primary-50 text-primary-700 ring-primary-200/60",
  },
  producer: {
    label: "Üretici",
    icon: Factory,
    className: "bg-brand-50 text-brand-700 ring-brand-200/60",
  },
  both: {
    label: "Her İkisi",
    icon: Shield,
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200/60",
  },
};

const phases = ["Başlangıç", "Eşleşme", "İş Birliği"] as const;

const phaseColors: Record<(typeof phases)[number], string> = {
  Başlangıç: "from-primary-500 to-primary-600",
  Eşleşme: "from-brand-500 to-brand-600",
  "İş Birliği": "from-emerald-500 to-emerald-600",
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
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-slate-700 shadow-sm ring-1 ring-slate-200">
            {index + 1}
          </span>
        </div>
        {!isLast && (
          <div className="mt-2 w-px flex-1 bg-gradient-to-b from-brand-300 via-brand-200 to-transparent min-h-[3rem] lg:min-h-[4rem]" />
        )}
      </div>

      {/* Kart */}
      <div className="group mb-10 flex-1 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card transition-all duration-300 hover:border-brand-200 hover:shadow-card-hover sm:p-6">
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
          <span className="text-xs font-medium text-slate-400">{step.phase}</span>
        </div>

        <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.description}</p>

        {/* Mini görsel önizleme */}
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
            <step.icon className="h-4 w-4 text-brand-600" />
          </div>
          <p className="text-xs leading-relaxed text-slate-500">{step.visual}</p>
        </div>
      </div>
    </div>
  );
}

function FlowDiagram() {
  return (
    <div className="mb-16 hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-8 lg:block">
      <div className="flex items-center justify-between gap-2">
        {/* Talep Sahibi */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 ring-4 ring-primary-50">
            <Building2 className="h-8 w-8 text-primary-600" />
          </div>
          <span className="text-xs font-semibold text-primary-700">Talep Sahibi</span>
        </div>

        <FlowArrow label="İlan yayınlar" />

        {/* Platform */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-brand shadow-soft ring-4 ring-brand-100">
            <Shield className="h-9 w-9 text-white" />
          </div>
          <span className="text-xs font-bold text-brand-700">B2B Platform</span>
        </div>

        <FlowArrow label="Başvuru alır" />

        {/* Üretici */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 ring-4 ring-brand-50">
            <Factory className="h-8 w-8 text-brand-600" />
          </div>
          <span className="text-xs font-semibold text-brand-700">Üretici</span>
        </div>

        <FlowArrow label="Eşleşme" />

        {/* Sonuç */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 ring-4 ring-emerald-50">
            <Handshake className="h-8 w-8 text-emerald-600" />
          </div>
          <span className="text-xs font-semibold text-emerald-700">İş Birliği</span>
        </div>
      </div>
    </div>
  );
}

function FlowArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 px-1">
      <div className="flex w-full items-center">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-300 to-brand-400" />
        <ArrowRight className="h-4 w-4 shrink-0 text-brand-500" />
        <div className="h-px flex-1 bg-gradient-to-r from-brand-400 via-brand-300 to-transparent" />
      </div>
      <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-wide text-slate-400">
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
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-soft"
        >
          <span
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white",
              phaseColors[phase]
            )}
          >
            {i + 1}
          </span>
          <span className="text-sm font-semibold text-slate-700">{phase}</span>
        </div>
      ))}
    </div>
  );
}

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.06),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="section-label">Süreç</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Nasıl Çalışır?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-500">
            6 basit adımda talep sahibi ile üreticiyi buluşturuyoruz
          </p>
        </div>

        <div className="mt-12">
          <FlowDiagram />
          <PhasePills />
        </div>

        {/* Mobil: yatay özet şerit */}
        <div className="mb-10 flex items-center justify-center gap-3 overflow-x-auto pb-2 lg:hidden">
          <div className="flex shrink-0 flex-col items-center gap-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100">
              <Building2 className="h-5 w-5 text-primary-600" />
            </div>
            <span className="text-[10px] font-medium text-slate-500">Talep</span>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-brand-400" />
          <div className="flex shrink-0 flex-col items-center gap-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-brand">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-[10px] font-bold text-brand-600">Platform</span>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-brand-400" />
          <div className="flex shrink-0 flex-col items-center gap-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100">
              <Factory className="h-5 w-5 text-brand-600" />
            </div>
            <span className="text-[10px] font-medium text-slate-500">Üretici</span>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-brand-400" />
          <div className="flex shrink-0 flex-col items-center gap-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
              <Handshake className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-[10px] font-medium text-slate-500">Anlaşma</span>
          </div>
        </div>

        {/* Adım listesi — 2 sütun desktop */}
        <div className="mx-auto max-w-5xl lg:grid lg:grid-cols-2 lg:gap-x-12">
          <div>
            {steps.slice(0, 3).map((step, i) => (
              <StepCard
                key={step.title}
                step={step}
                index={i}
                isLast={i === 2}
              />
            ))}
          </div>
          <div>
            {steps.slice(3).map((step, i) => (
              <StepCard
                key={step.title}
                step={step}
                index={i + 3}
                isLast={i === 2}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
