"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, X } from "lucide-react";

export function UpgradeSuccessBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("upgraded") === "1") {
      setVisible(true);
    }
  }, [searchParams]);

  function dismiss() {
    setVisible(false);
    router.replace("/dashboard/ayarlar");
  }

  if (!visible) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
      <div className="flex-1">
        <p className="font-medium text-green-900">Pro üyeliğiniz aktif!</p>
        <p className="mt-1 text-sm text-green-800">
          Ödeme tamamlandı. Sınırsız teklif, profil sayfası ve raporlar artık kullanılabilir.
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="rounded-lg p-1 text-green-700 transition-colors hover:bg-green-100"
        aria-label="Kapat"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
