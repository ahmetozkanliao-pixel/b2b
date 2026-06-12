"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { ListingStatus } from "@/types";

interface ListingActionsProps {
  listingId: string;
  status: ListingStatus;
  isDemo?: boolean;
}

export function ListingActions({ listingId, status, isDemo = false }: ListingActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const canEdit = status === "active" || status === "draft";
  const canCancel = status === "active" || status === "draft";

  if (!canEdit && !canCancel) return null;

  async function handleCancel() {
    const confirmed = window.confirm(
      "Bu ilandan vazgeçmek istediğinize emin misiniz? İlan iptal edilir ve yayından kalkar."
    );
    if (!confirmed) return;

    setLoading(true);

    if (isDemo) {
      const res = await fetch("/api/demo/listings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, status: "cancelled" }),
      });
      if (res.ok) router.refresh();
      setLoading(false);
      return;
    }

    const supabase = createClient();
    await supabase.from("listings").update({ status: "cancelled" }).eq("id", listingId);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex shrink-0 flex-wrap gap-2">
      {canEdit && (
        <Link href={`/dashboard/ilanlar/${listingId}/duzenle`}>
          <Button size="sm" variant="outline" disabled={loading}>
            <Pencil className="h-4 w-4" />
            Düzenle
          </Button>
        </Link>
      )}
      {canCancel && (
        <Button size="sm" variant="danger" onClick={handleCancel} disabled={loading}>
          <XCircle className="h-4 w-4" />
          {loading ? "İptal ediliyor..." : "Vazgeç"}
        </Button>
      )}
    </div>
  );
}
