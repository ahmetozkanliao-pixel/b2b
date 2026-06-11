"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface CompanyApprovalActionsProps {
  companyId: string;
  ownerId: string;
}

export function CompanyApprovalActions({ companyId, ownerId }: CompanyApprovalActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAction(status: "approved" | "rejected") {
    setLoading(true);
    const supabase = createClient();

    await supabase
      .from("companies")
      .update({ status, verified: status === "approved" })
      .eq("id", companyId);

    if (status === "approved") {
      await supabase.from("notifications").insert({
        user_id: ownerId,
        type: "company_approved",
        title: "Firmanız Onaylandı",
        message: "Firma kaydınız onaylandı. Artık platformu tam olarak kullanabilirsiniz.",
        link: "/dashboard",
      });
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" onClick={() => handleAction("approved")} disabled={loading}>
        Onayla
      </Button>
      <Button size="sm" variant="danger" onClick={() => handleAction("rejected")} disabled={loading}>
        Reddet
      </Button>
    </div>
  );
}
