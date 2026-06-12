"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UserPlus,
  FileText,
  Send,
  CheckCircle,
  MessageCircle,
  Handshake,
  ArrowRight,
} from "lucide-react";
import { ChapterSection } from "@/components/home/chapter-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const phases = [
  {
    id: "baslangic",
    label: "Başlangıç",
    steps: [
      {
        icon: UserPlus,
        title: "Kayıt olun",
        description: "Talep sahibi veya üretici olarak ücretsiz hesap oluşturun.",
      },
      {
        icon: FileText,
        title: "İlan yayınlayın",
        description: "İhtiyacınızı kategori, bütçe ve teslim süresiyle paylaşın.",
      },
    ],
  },
  {
    id: "eslesme",
    label: "Eşleşme",
    steps: [
      {
        icon: Send,
        title: "Başvurular gelir",
        description: "Doğrulanmış üreticiler ilanınıza teklif ve ön yazı gönderir.",
      },
      {
        icon: CheckCircle,
        title: "Üretici seçilir",
        description: "Başvuruları karşılaştırın, en uygun firmayı onaylayın.",
      },
    ],
  },
  {
    id: "isbirligi",
    label: "İş Birliği",
    steps: [
      {
        icon: MessageCircle,
        title: "Güvenli görüşme",
        description: "Platform içi mesajlaşma ve dosya paylaşımı aktif olur.",
      },
      {
        icon: Handshake,
        title: "Anlaşma tamamlanır",
        description: "Teklif onaylanır, üretim süreci başlar.",
      },
    ],
  },
];

export function ProcessChapter() {
  const [activePhase, setActivePhase] = useState(0);
  const phase = phases[activePhase];

  return (
    <ChapterSection id="surec" variant="muted">
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="editorial-label">03 — Süreç</p>
            <h2 className="editorial-heading mt-6 text-4xl sm:text-5xl lg:text-6xl">
              Altı adımda
              <span className="block text-brand-600">iş birliği.</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-slate-500 sm:text-lg">
              Talep yayınlamadan anlaşmaya kadar her aşama platformda şeffaf şekilde ilerler.
            </p>

            <div className="mt-10 flex flex-col gap-2">
              {phases.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActivePhase(index)}
                  className={cn(
                    "flex items-center gap-4 rounded-xl px-4 py-3 text-left transition-all duration-500",
                    activePhase === index
                      ? "bg-white shadow-card ring-1 ring-brand-200/60"
                      : "opacity-50 hover:bg-white/60 hover:opacity-80"
                  )}
                >
                  <span className="text-[10px] font-semibold tabular-nums text-brand-500">
                    0{index + 1}
                  </span>
                  <span className="text-sm font-semibold uppercase tracking-wider text-slate-700">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            <Link href="/nasil-calisir" className="mt-10 hidden lg:inline-block">
              <Button variant="outline" className="rounded-full px-6 uppercase tracking-wider">
                Tüm adımları gör
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-12 lg:col-span-7 lg:mt-0">
            <div key={phase.id} className="chapter-fade-in space-y-4">
              {phase.steps.map((step, stepIndex) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card transition-all duration-500 hover:shadow-card-hover sm:p-8"
                  style={{ animationDelay: `${stepIndex * 100}ms` }}
                >
                  <div className="flex items-start gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-soft">
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Adım {activePhase * 2 + stepIndex + 1} · {phase.label}
                      </p>
                      <h3 className="mt-1 font-display text-2xl font-light text-slate-900">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-base">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 text-center lg:hidden">
          <Link href="/nasil-calisir">
            <Button variant="outline" className="rounded-full px-6">
              Tüm adımları gör
            </Button>
          </Link>
        </div>
      </div>
    </ChapterSection>
  );
}
