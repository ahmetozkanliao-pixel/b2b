"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategorySelect } from "@/components/ui/category-select";
import { CategoryBadges } from "@/components/ui/category-badges";
import { getCategoriesByIds } from "@/lib/categories";
import { createClient } from "@/lib/supabase/client";
import type { Category, Company } from "@/types";

interface CompanyFormProps {
  company: Company | null;
  userId: string;
  role: string;
  isDemo?: boolean;
  categories?: Category[];
}

export function CompanyForm({
  company,
  userId,
  role,
  isDemo = false,
  categories = [],
}: CompanyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const isProducer = role === "producer";

  const [form, setForm] = useState({
    name: company?.name || "",
    description: company?.description || "",
    website: company?.website || "",
    city: company?.city || "",
    phone: company?.phone || "",
    email: company?.email || "",
    tax_number: company?.tax_number || "",
    address: company?.address || "",
  });

  const [categoryIds, setCategoryIds] = useState<string[]>(company?.category_ids || []);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isProducer && categoryIds.length === 0) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    const payload = {
      ...form,
      ...(isProducer ? { category_ids: categoryIds } : {}),
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
      setLoading(false);
      return;
    }

    const supabase = createClient();

    if (company) {
      await supabase.from("companies").update(payload).eq("id", company.id);
    } else {
      await supabase.from("companies").insert({
        ...payload,
        owner_id: userId,
        type: isProducer ? "producer" : "demand_owner",
      });
    }

    setLoading(false);
    setSuccess(true);
    router.refresh();
  }

  const selectedCategories = getCategoriesByIds(categoryIds, categories);

  return (
    <Card>
      <CardContent>
        {company?.verified && (
          <div className="mb-4">
            <Badge variant="success">Doğrulanmış Firma</Badge>
          </div>
        )}

        {isProducer && selectedCategories.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-gray-500">Üretim Alanlarınız</p>
            <CategoryBadges categories={selectedCategories} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            label="Firma Adı *"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
          />
          <Textarea
            id="description"
            label="Açıklama"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
          />

          {isProducer && categories.length > 0 && (
            <CategorySelect
              categories={categories}
              selected={categoryIds}
              onChange={setCategoryIds}
              label="Üretim Kategorileri"
              hint="Hangi alanlarda üretim yaptığınızı seçin. Sadece eşleşen kategorideki ilanları görürsünüz."
              required
            />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="city"
              label="Şehir"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
            />
            <Input
              id="phone"
              label="Telefon"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>
          <Input
            id="email"
            label="E-posta"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
          <Input
            id="website"
            label="Web Sitesi"
            value={form.website}
            onChange={(e) => updateField("website", e.target.value)}
          />
          <Input
            id="tax_number"
            label="Vergi Numarası"
            value={form.tax_number}
            onChange={(e) => updateField("tax_number", e.target.value)}
          />
          <Textarea
            id="address"
            label="Adres"
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
            rows={2}
          />

          {success && (
            <p className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
              Firma bilgileri kaydedildi.
            </p>
          )}

          <Button type="submit" disabled={loading || (isProducer && categoryIds.length === 0)}>
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
