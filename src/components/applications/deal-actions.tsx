"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Handshake, XCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ApplicationStatus } from "@/types";

interface DealActionsProps {
  applicationId: string;
  applicationStatus: ApplicationStatus;
  listingId: string;
  applicantUserId: string;
  isDemandOwner: boolean;
  isDemo?: boolean;
}

export function DealActions({
  applicationId,
  applicationStatus,
  listingId,
  applicantUserId,
  isDemandOwner,
  isDemo = false,
}: DealActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"agreed" | "no_agreement" | null>(null);

  if (!isDemandOwner) return null;

  if (applicationStatus === "agreed") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        Anlaşma sağlandı. İlan yayından kaldırıldı.
      </div>
    );
  }

  if (applicationStatus === "no_agreement") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
        <XCircle className="h-4 w-4 shrink-0" />
        Anlaşma sağlanamadı olarak işaretlendi.
      </div>
    );
  }

  if (applicationStatus !== "approved") return null;

  async function handleDeal(status: "agreed" | "no_agreement") {
    const confirmed =
      status === "agreed"
        ? window.confirm(
            "Anlaşıldı olarak işaretlerseniz ilan yayından kalkar ve diğer bekleyen teklifler reddedilir. Devam etmek istiyor musunuz?"
          )
        : window.confirm("Anlaşma sağlanamadı olarak işaretlemek istediğinize emin misiniz?");

    if (!confirmed) return;

    setLoading(status);

    if (isDemo) {
      const res = await fetch("/api/demo/deal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status }),
      });

      if (res.ok) {
        router.refresh();
      }
      setLoading(null);
      return;
    }

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    await supabase.from("applications").update({ status }).eq("id", applicationId);

    if (status === "agreed") {
      await supabase.from("listings").update({ status: "closed" }).eq("id", listingId);

      await supabase
        .from("applications")
        .update({ status: "rejected" })
        .eq("listing_id", listingId)
        .eq("status", "pending");

      await supabase
        .from("applications")
        .update({ status: "no_agreement" })
        .eq("listing_id", listingId)
        .eq("status", "approved")
        .neq("id", applicationId);

      await supabase.from("notifications").insert({
        user_id: applicantUserId,
        type: "deal_agreed",
        title: "Anlaşma Sağlandı",
        message: "Müşteri ile anlaştınız. İlan kapatıldı.",
        link: "/dashboard/basvurularim",
      });
    } else {
      await supabase.from("notifications").insert({
        user_id: applicantUserId,
        type: "deal_failed",
        title: "Anlaşma Sağlanamadı",
        message: "Müşteri anlaşma sağlanamadı olarak işaretledi.",
        link: "/dashboard/basvurularim",
      });
    }

    setLoading(null);
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <Handshake className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-900">Anlaşma durumu</p>
          <p className="mt-1 text-sm text-amber-800">
            Görüşmeler sonrasında bu tedarikçi ile anlaşıp anlaşmadığınızı işaretleyin.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => handleDeal("agreed")}
              disabled={loading !== null}
            >
              {loading === "agreed" ? "Kaydediliyor..." : "Anlaşıldı"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDeal("no_agreement")}
              disabled={loading !== null}
            >
              {loading === "no_agreement" ? "Kaydediliyor..." : "Anlaşılamadı"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
