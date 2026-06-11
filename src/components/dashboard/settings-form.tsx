"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Headphones } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { DemoSettings } from "@/lib/demo/types";

interface SettingsFormProps {
  isDemo: boolean;
  initialSettings: DemoSettings | null;
  profile: { full_name: string; email: string };
  isProducerPro?: boolean;
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-200 p-4">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-primary-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </label>
  );
}

export function SettingsForm({ isDemo, initialSettings, profile, isProducerPro }: SettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [settings, setSettings] = useState<DemoSettings>(
    initialSettings ?? {
      email_notifications: true,
      sms_notifications: false,
      application_alerts: true,
      message_alerts: true,
      language: "tr",
    }
  );

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    if (isDemo) {
      await fetch("/api/demo/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
    }

    setLoading(false);
    setSuccess(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Profil Bilgileri</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input id="full_name" label="Ad Soyad" value={profile.full_name} readOnly />
          <Input id="email" label="E-posta" type="email" value={profile.email} readOnly />
          <p className="text-xs text-gray-500">
            Demo modunda profil bilgileri sabittir. Supabase bağlandığında düzenlenebilir.
          </p>
        </CardContent>
      </Card>

      {isProducerPro && (
        <Card className="border-brand-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-gray-900">Destek</h2>
              <Badge variant="brand">Öncelikli</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Pro üyeliğiniz sayesinde destek talepleriniz öncelikli sıraya alınır.
              Ortalama yanıt süresi: <strong>2 saat</strong> (ücretsiz planda 24 saat).
            </p>
            <p className="mt-2 text-sm text-brand-600">destek@b2b-platform.com</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Bildirim Tercihleri</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          <Toggle
            label="E-posta Bildirimleri"
            description="Önemli güncellemeler e-posta ile gönderilsin"
            checked={settings.email_notifications}
            onChange={(v) => setSettings((s) => ({ ...s, email_notifications: v }))}
          />
          <Toggle
            label="SMS Bildirimleri"
            description="Acil bildirimler SMS ile gönderilsin"
            checked={settings.sms_notifications}
            onChange={(v) => setSettings((s) => ({ ...s, sms_notifications: v }))}
          />
          <Toggle
            label="Başvuru Uyarıları"
            description="İlanlarınıza yeni başvuru geldiğinde bildirim al"
            checked={settings.application_alerts}
            onChange={(v) => setSettings((s) => ({ ...s, application_alerts: v }))}
          />
          <Toggle
            label="Mesaj Uyarıları"
            description="Yeni mesaj geldiğinde bildirim al"
            checked={settings.message_alerts}
            onChange={(v) => setSettings((s) => ({ ...s, message_alerts: v }))}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Dil ve Bölge</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">
              Dil
            </label>
            <select
              id="language"
              value={settings.language}
              onChange={(e) => setSettings((s) => ({ ...s, language: e.target.value }))}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {success && (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
          Ayarlarınız kaydedildi.
        </p>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}
      </Button>
    </form>
  );
}
