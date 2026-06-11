"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function NotificationActions() {
  const router = useRouter();

  async function markAllRead() {
    await fetch("/api/demo/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    });
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" onClick={markAllRead}>
      Tümünü Okundu İşaretle
    </Button>
  );
}
