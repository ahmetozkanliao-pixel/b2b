"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ImageUploadField } from "@/components/ui/image-upload-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyProfileLink } from "@/components/profile/share-profile-button";
import { ShareProfileButton } from "@/components/profile/share-profile-button";
import { getCompanyProfilePath, slugify } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Company } from "@/types";

interface ProfileCustomizeFormProps {
  company: Company;
  isDemo?: boolean;
}

export function ProfileCustomizeForm({ company, isDemo = false }: ProfileCustomizeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    slug: company.slug || slugify(company.name),
    tagline: company.tagline || "",
    logo_url: company.logo_url || "",
    cover_image_url: company.cover_image_url || "",
    founded_year: company.founded_year?.toString() || "",
    employee_count: company.employee_count || "",
    profile_public: company.profile_public !== false,
  });

  const profilePath = getCompanyProfilePath({ slug: form.slug, id: company.id });

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const payload = {
      slug: form.slug || slugify(company.name),
      tagline: form.tagline || null,
      logo_url: form.logo_url || null,
      cover_image_url: form.cover_image_url || null,
      founded_year: form.founded_year ? Number(form.founded_year) : null,
      employee_count: form.employee_count || null,
      profile_public: form.profile_public,
    };

    if (isDemo) {
      const res = await fetch("/api/demo/company", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSuccess(true);
        router.refresh();
      }
    } else {
      const supabase = createClient();
      await supabase.from("companies").update(payload).eq("id", company.id);
      setSuccess(true);
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <Card>
      <CardContent>
        <h2 className="text-lg font-semibold text-slate-900">Profil Özelleştirme</h2>
        <p className="mt-1 text-sm text-slate-500">
          Herkese açık profil sayfanızı kişiselleştirin
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex-1">
            <p className="text-xs font-medium text-slate-500">Profil bağlantınız</p>
            <CopyProfileLink url={profilePath} />
          </div>
          <ShareProfileButton url={profilePath} companyName={company.name} />
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            id="slug"
            label="Profil Adresi (URL)"
            value={form.slug}
            onChange={(e) => updateField("slug", slugify(e.target.value))}
            placeholder="firma-adi"
          />
          <p className="-mt-2 text-xs text-slate-400">
            Adres: /firma/{form.slug || "..."}
          </p>

          <Input
            id="tagline"
            label="Kısa Slogan"
            value={form.tagline}
            onChange={(e) => updateField("tagline", e.target.value)}
            placeholder="Firmanızı tek cümleyle tanıtın"
          />

          <ImageUploadField
            id="profile_logo_url"
            label="Firma Logosu"
            value={form.logo_url}
            onChange={(value) => updateField("logo_url", value)}
            hint="Profil sayfanızın üst kısmında görünür."
          />

          <Input
            id="cover_image_url"
            label="Kapak Görseli URL"
            value={form.cover_image_url}
            onChange={(e) => updateField("cover_image_url", e.target.value)}
            placeholder="https://..."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="founded_year"
              label="Kuruluş Yılı"
              type="number"
              value={form.founded_year}
              onChange={(e) => updateField("founded_year", e.target.value)}
              placeholder="2010"
            />
            <Input
              id="employee_count"
              label="Çalışan Sayısı"
              value={form.employee_count}
              onChange={(e) => updateField("employee_count", e.target.value)}
              placeholder="50-100"
            />
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
            <input
              type="checkbox"
              checked={form.profile_public}
              onChange={(e) => updateField("profile_public", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <div>
              <p className="text-sm font-medium text-slate-900">Profil herkese açık</p>
              <p className="text-xs text-slate-500">
                Kapatırsanız profil sayfanız görünmez olur
              </p>
            </div>
          </label>

          {success && (
            <p className="rounded-xl bg-green-50 p-3 text-sm text-green-600">
              Profil ayarları kaydedildi.
            </p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Kaydediliyor..." : "Profili Kaydet"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
