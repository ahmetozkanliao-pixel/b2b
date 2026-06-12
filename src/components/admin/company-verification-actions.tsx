"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, BadgeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface CompanyVerificationActionsProps {
  companyId: string;
  verified: boolean;
  isDemo?: boolean;
}

export function CompanyVerificationActions({
  companyId,
  verified,
  isDemo = false,
}: CompanyVerificationActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle(nextVerified: boolean) {
    setLoading(true);

    if (isDemo) {
      const res = await fetch("/api/demo/admin/companies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, verified: nextVerified }),
      });
      if (res.ok) router.refresh();
      setLoading(false);
      return;
    }

    const supabase = createClient();
    await supabase.from("companies").update({ verified: nextVerified }).eq("id", companyId);
    setLoading(false);
    router.refresh();
  }

  if (verified) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleToggle(false)}
        disabled={loading}
      >
        <BadgeX className="h-4 w-4" />
        Doğrulamayı Kaldır
      </Button>
    );
  }

  return (
    <Button size="sm" onClick={() => handleToggle(true)} disabled={loading}>
      <BadgeCheck className="h-4 w-4" />
      Doğrulanmış İşaretle
    </Button>
  );
}
