"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface ApplicationActionsProps {
  applicationId: string;
  listingOwnerId: string;
  applicantUserId: string;
  isDemo?: boolean;
}

export function ApplicationActions({
  applicationId,
  listingOwnerId,
  applicantUserId,
  isDemo = false,
}: ApplicationActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function handleAction(status: "approved" | "rejected") {
    setLoading(status === "approved" ? "approve" : "reject");

    if (isDemo) {
      const res = await fetch("/api/demo/applications", {
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

    const supabase = createClient();

    await supabase
      .from("applications")
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: listingOwnerId,
      })
      .eq("id", applicationId);

    const notificationType = status === "approved" ? "application_approved" : "application_rejected";
    const title = status === "approved" ? "Teklifiniz Onaylandı" : "Teklifiniz Reddedildi";
    const message =
      status === "approved"
        ? "Tebrikler! Teklifiniz onaylandı. Mesajlaşmaya başlayabilirsiniz."
        : "Teklifiniz reddedildi.";

    await supabase.from("notifications").insert({
      user_id: applicantUserId,
      type: notificationType,
      title,
      message,
      link: status === "approved" ? "/dashboard/mesajlar" : "/dashboard/basvurularim",
    });

    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex shrink-0 gap-2">
      <Button
        size="sm"
        onClick={() => handleAction("approved")}
        disabled={loading !== null}
      >
        {loading === "approve" ? "Onaylanıyor..." : "Onayla"}
      </Button>
      <Button
        size="sm"
        variant="danger"
        onClick={() => handleAction("rejected")}
        disabled={loading !== null}
      >
        {loading === "reject" ? "Reddediliyor..." : "Reddet"}
      </Button>
    </div>
  );
}
