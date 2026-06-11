"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types";

interface ListingFormProps {
  categories: Category[];
  companyId: string;
  userId: string;
  isDemo?: boolean;
}

export function ListingForm({ categories, companyId, userId, isDemo = false }: ListingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    category_id: "",
    description: "",
    technical_details: "",
    budget_min: "",
    budget_max: "",
    delivery_time: "",
    city: "",
    application_deadline: "",
  });

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent, status: "draft" | "active") {
    e.preventDefault();
    setError("");

    if (status === "active" && !form.category_id) {
      setError("İlan yayınlamak için kategori seçmelisiniz.");
      return;
    }

    setLoading(true);

    if (isDemo) {
      const res = await fetch("/api/demo/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "İlan kaydedilemedi.");
        setLoading(false);
        return;
      }
    } else {
      const supabase = createClient();
      const { error: insertError } = await supabase.from("listings").insert({
        company_id: companyId,
        created_by: userId,
        title: form.title,
        category_id: form.category_id || null,
        description: form.description,
        technical_details: form.technical_details || null,
        budget_min: form.budget_min ? parseFloat(form.budget_min) : null,
        budget_max: form.budget_max ? parseFloat(form.budget_max) : null,
        delivery_time: form.delivery_time || null,
        city: form.city || null,
        application_deadline: form.application_deadline || null,
        status,
      });

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
    }

    router.push("/dashboard/ilanlar");
    router.refresh();
  }

  return (
    <form className="space-y-6">
      <Input
        id="title"
        label="İlan Başlığı *"
        value={form.title}
        onChange={(e) => updateField("title", e.target.value)}
        placeholder="Örn: Paslanmaz Çelik Boru Üretimi"
        required
      />

      <div className="space-y-1.5">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Kategori *
        </label>
        <p className="text-xs text-gray-500">
          İhtiyacınızın kategorisini seçin. Sadece bu alanda üretim yapan firmalar ilanı görecektir.
        </p>
        <select
          id="category"
          value={form.category_id}
          onChange={(e) => updateField("category_id", e.target.value)}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">Kategori seçin</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <Textarea
        id="description"
        label="Açıklama *"
        value={form.description}
        onChange={(e) => updateField("description", e.target.value)}
        placeholder="İhtiyacınızı detaylı olarak açıklayın..."
        rows={4}
        required
      />

      <Textarea
        id="technical_details"
        label="Teknik Detaylar"
        value={form.technical_details}
        onChange={(e) => updateField("technical_details", e.target.value)}
        placeholder="Teknik özellikler, standartlar, malzeme bilgileri..."
        rows={3}
      />

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

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="delivery_time"
          label="Teslim Süresi"
          value={form.delivery_time}
          onChange={(e) => updateField("delivery_time", e.target.value)}
          placeholder="30 gün"
        />
        <Input
          id="city"
          label="Şehir"
          value={form.city}
          onChange={(e) => updateField("city", e.target.value)}
          placeholder="İstanbul"
        />
      </div>

      <Input
        id="application_deadline"
        label="Son Başvuru Tarihi"
        type="date"
        value={form.application_deadline}
        onChange={(e) => updateField("application_deadline", e.target.value)}
      />

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={(e) => handleSubmit(e, "draft")}
        >
          Taslak Kaydet
        </Button>
        <Button
          type="button"
          disabled={loading}
          onClick={(e) => handleSubmit(e, "active")}
        >
          {loading ? "Yayınlanıyor..." : "İlanı Yayınla"}
        </Button>
      </div>
    </form>
  );
}
