"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface ApplyFormProps {
  listingId: string;
  companyId: string;
  userId: string;
  listingOwnerId: string;
  isDemo?: boolean;
}

export function ApplyForm({
  listingId,
  companyId,
  userId,
  listingOwnerId,
  isDemo = false,
}: ApplyFormProps) {
  const router = useRouter();
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedBudget, setProposedBudget] = useState("");
  const [proposedDelivery, setProposedDelivery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [upgradeRequired, setUpgradeRequired] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setUpgradeRequired(false);
    setLoading(true);

    if (isDemo) {
      const res = await fetch("/api/demo/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          coverLetter,
          proposedBudget,
          proposedDelivery,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Başvuru gönderilemedi.");
        setUpgradeRequired(!!data.upgradeRequired);
        setLoading(false);
        return;
      }

      router.push("/dashboard/basvurularim");
      router.refresh();
      return;
    }

    const supabase = createClient();
    const { error: insertError } = await supabase.from("applications").insert({
      listing_id: listingId,
      producer_company_id: companyId,
      applicant_id: userId,
      cover_letter: coverLetter,
      proposed_budget: proposedBudget ? parseFloat(proposedBudget) : null,
      proposed_delivery: proposedDelivery || null,
    });

    if (insertError) {
      setError(insertError.message.includes("unique") ? "Bu ilana zaten başvurdunuz." : insertError.message);
      setLoading(false);
      return;
    }

    await supabase.from("notifications").insert({
      user_id: listingOwnerId,
      type: "new_application",
      title: "Yeni Teklif",
      message: "İlanınıza yeni bir tedarikçi teklifi geldi.",
      link: "/dashboard/basvurular",
    });

    router.push("/dashboard/basvurularim");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        id="coverLetter"
        label="Ön Yazı *"
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
        placeholder="Neden bu ilan için uygun olduğunuzu açıklayın..."
        rows={4}
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="proposedBudget"
          label="Teklif Tutarı (₺)"
          type="number"
          value={proposedBudget}
          onChange={(e) => setProposedBudget(e.target.value)}
          placeholder="75000"
        />
        <Input
          id="proposedDelivery"
          label="Teslim Süresi"
          value={proposedDelivery}
          onChange={(e) => setProposedDelivery(e.target.value)}
          placeholder="30 gün"
        />
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          <p>{error}</p>
          {upgradeRequired && (
            <Link href="/dashboard/uyelik/satin-al" className="mt-2 inline-block font-semibold text-brand-600 hover:text-brand-700">
              Pro&apos;ya yükselt →
            </Link>
          )}
        </div>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Gönderiliyor..." : "Başvur"}
      </Button>
    </form>
  );
}
