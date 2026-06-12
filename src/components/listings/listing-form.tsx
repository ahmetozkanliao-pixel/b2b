"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/ui/image-upload-field";
import { HierarchicalCategorySelect } from "@/components/ui/hierarchical-category-select";
import { getCategoryById, getCategoryLabel } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Category, Listing } from "@/types";

interface ListingFormProps {
  categories: Category[];
  companyId: string;
  userId: string;
  isDemo?: boolean;
  listingId?: string;
  initialListing?: Listing;
}

function buildInitialForm(listing: Listing, categories: Category[]) {
  const sub = getCategoryById(categories, listing.category_id);
  return {
    title: listing.title,
    main_category_id: sub?.parent_id || "",
    category_id: listing.category_id || "",
    description: listing.description,
    technical_details: listing.technical_details || "",
    image_url: listing.image_url || "",
    budget_min: listing.budget_min != null ? String(listing.budget_min) : "",
    budget_max: listing.budget_max != null ? String(listing.budget_max) : "",
    delivery_time: listing.delivery_time || "",
    city: listing.city || "",
    application_deadline: listing.application_deadline?.slice(0, 10) || "",
  };
}

const STEPS = [
  { id: 1, title: "Başlık", description: "İlan başlığını girin" },
  { id: 2, title: "Kategori", description: "Ana ve alt kategori seçin" },
  { id: 3, title: "Detaylar", description: "Açıklama, teknik bilgi ve görsel" },
  { id: 4, title: "Bütçe", description: "Bütçe aralığını belirleyin" },
  { id: 5, title: "Teslim", description: "Teslim süresini girin" },
  { id: 6, title: "Başvuru", description: "Son başvuru tarihi" },
] as const;

export function ListingForm({
  categories,
  companyId,
  userId,
  isDemo = false,
  listingId,
  initialListing,
}: ListingFormProps) {
  const router = useRouter();
  const isEdit = Boolean(listingId && initialListing);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState(() =>
    initialListing ? buildInitialForm(initialListing, categories) : {
      title: "",
      main_category_id: "",
      category_id: "",
      description: "",
      technical_details: "",
      image_url: "",
      budget_min: "",
      budget_max: "",
      delivery_time: "",
      city: "",
      application_deadline: "",
    }
  );

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  function validateStep(current: number): string | null {
    switch (current) {
      case 1:
        if (!form.title.trim()) return "İlan başlığı zorunludur.";
        return null;
      case 2:
        if (!form.main_category_id) return "Ana kategori seçmelisiniz.";
        if (!form.category_id) return "Alt kategori seçmelisiniz.";
        return null;
      case 3:
        if (!form.description.trim()) return "Açıklama zorunludur.";
        return null;
      default:
        return null;
    }
  }

  function goNext() {
    const validationError = validateStep(step);
    if (validationError) {
      setError(validationError);
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length));
  }

  function goBack() {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit(status: "draft" | "active") {
    for (const s of [1, 2, 3]) {
      const validationError = validateStep(s);
      if (validationError) {
        setError(validationError);
        setStep(s);
        return;
      }
    }

    setLoading(true);
    setError("");

    const payload = {
      title: form.title.trim(),
      category_id: form.category_id,
      description: form.description.trim(),
      technical_details: form.technical_details.trim() || null,
      image_url: form.image_url || null,
      budget_min: form.budget_min || null,
      budget_max: form.budget_max || null,
      delivery_time: form.delivery_time.trim() || null,
      city: form.city.trim() || null,
      application_deadline: form.application_deadline || null,
      status,
    };

    if (isDemo) {
      const res = await fetch("/api/demo/listings", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEdit ? { listingId, ...payload } : payload
        ),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "İlan kaydedilemedi.");
        setLoading(false);
        return;
      }
    } else {
      const supabase = createClient();

      if (isEdit && listingId) {
        const { error: updateError } = await supabase
          .from("listings")
          .update({
            title: payload.title,
            category_id: payload.category_id || null,
            description: payload.description,
            technical_details: payload.technical_details,
            budget_min: payload.budget_min ? parseFloat(String(payload.budget_min)) : null,
            budget_max: payload.budget_max ? parseFloat(String(payload.budget_max)) : null,
            delivery_time: payload.delivery_time,
            city: payload.city,
            application_deadline: payload.application_deadline,
            status,
          })
          .eq("id", listingId);

        if (updateError) {
          setError(updateError.message);
          setLoading(false);
          return;
        }
      } else {
        const { error: insertError } = await supabase.from("listings").insert({
          company_id: companyId,
          created_by: userId,
          title: payload.title,
          category_id: payload.category_id || null,
          description: payload.description,
          technical_details: payload.technical_details,
          budget_min: payload.budget_min ? parseFloat(String(payload.budget_min)) : null,
          budget_max: payload.budget_max ? parseFloat(String(payload.budget_max)) : null,
          delivery_time: payload.delivery_time,
          city: payload.city,
          application_deadline: payload.application_deadline,
          status,
        });

        if (insertError) {
          setError(insertError.message);
          setLoading(false);
          return;
        }
      }
    }

    setLoading(false);
    router.push("/dashboard/ilanlar");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        {STEPS.map((s, index) => {
          const done = step > s.id;
          const active = step === s.id;
          return (
            <div key={s.id} className="flex min-w-0 flex-1 items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  done && "bg-brand-500 text-white",
                  active && !done && "bg-primary-100 text-primary-700 ring-2 ring-primary-500",
                  !done && !active && "bg-slate-100 text-slate-400"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : s.id}
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className={cn("truncate text-xs font-semibold", active ? "text-slate-900" : "text-slate-400")}>
                  {s.title}
                </p>
              </div>
              {index < STEPS.length - 1 && (
                <div className={cn("h-px flex-1", done ? "bg-brand-300" : "bg-slate-200")} />
              )}
            </div>
          );
        })}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900">{STEPS[step - 1].title}</h2>
        <p className="mt-1 text-sm text-slate-500">{STEPS[step - 1].description}</p>
      </div>

      <div className="min-h-[280px]">
        {step === 1 && (
          <Input
            id="title"
            label="İlan Başlığı *"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Örn: Paslanmaz Çelik Boru Üretimi"
            autoFocus
          />
        )}

        {step === 2 && (
          <HierarchicalCategorySelect
            categories={categories}
            mainCategoryId={form.main_category_id}
            subCategoryId={form.category_id}
            onMainChange={(id) => updateField("main_category_id", id)}
            onSubChange={(id) => updateField("category_id", id)}
          />
        )}

        {step === 3 && (
          <div className="space-y-5">
            <Textarea
              id="description"
              label="Açıklama *"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="İhtiyacınızı detaylı olarak açıklayın..."
              rows={4}
            />
            <Textarea
              id="technical_details"
              label="Teknik Detaylar"
              value={form.technical_details}
              onChange={(e) => updateField("technical_details", e.target.value)}
              placeholder="Teknik özellikler, standartlar, malzeme bilgileri..."
              rows={3}
            />
            <ImageUploadField
              id="listing_image"
              label="Görsel Ekle"
              value={form.image_url}
              onChange={(value) => updateField("image_url", value)}
              hint="İlanınızı görselle destekleyin (isteğe bağlı, max 2MB)"
              previewClassName="h-40 w-full max-w-sm rounded-xl object-cover"
            />
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="budget_min"
              label="Minimum Bütçe (₺)"
              type="number"
              value={form.budget_min}
              onChange={(e) => updateField("budget_min", e.target.value)}
              placeholder="50000"
            />
            <Input
              id="budget_max"
              label="Maksimum Bütçe (₺)"
              type="number"
              value={form.budget_max}
              onChange={(e) => updateField("budget_max", e.target.value)}
              placeholder="150000"
            />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <Input
              id="delivery_time"
              label="Teslim Süresi"
              value={form.delivery_time}
              onChange={(e) => updateField("delivery_time", e.target.value)}
              placeholder="Örn: 30 gün"
            />
            <Input
              id="city"
              label="Şehir"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="İstanbul"
            />
          </div>
        )}

        {step === 6 && (
          <div className="space-y-5">
            <Input
              id="application_deadline"
              label="Son Başvuru Tarihi"
              type="date"
              value={form.application_deadline}
              onChange={(e) => updateField("application_deadline", e.target.value)}
            />
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-900">Özet</p>
              <ul className="mt-2 space-y-1">
                <li><span className="text-slate-500">Başlık:</span> {form.title || "—"}</li>
                <li>
                  <span className="text-slate-500">Kategori:</span>{" "}
                  {getCategoryLabel(categories, form.category_id)}
                </li>
                <li><span className="text-slate-500">Teslim:</span> {form.delivery_time || "—"}</li>
                <li><span className="text-slate-500">Son başvuru:</span> {form.application_deadline || "—"}</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={goBack}
          disabled={step === 1 || loading}
        >
          <ChevronLeft className="h-4 w-4" />
          Geri
        </Button>

        <div className="flex flex-wrap gap-2">
          {step < STEPS.length ? (
            <Button type="button" onClick={goNext} disabled={loading}>
              İleri
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <>
              {(!isEdit || initialListing?.status === "draft") && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={() => handleSubmit("draft")}
                >
                  {isEdit ? "Taslak Olarak Kaydet" : "Taslak Kaydet"}
                </Button>
              )}
              <Button type="button" disabled={loading} onClick={() => handleSubmit("active")}>
                {loading
                  ? "Kaydediliyor..."
                  : isEdit
                    ? initialListing?.status === "active"
                      ? "Değişiklikleri Kaydet"
                      : "Güncelle ve Yayınla"
                    : "İlanı Yayınla"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
