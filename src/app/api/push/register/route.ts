import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/get-session";
import { isDemoMode } from "@/lib/demo/config";

const bodySchema = z.object({
  token: z.string().min(10),
  platform: z.enum(["ios", "android", "web"]).optional(),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.isDemo) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  if (isDemoMode()) {
    // Demo modu: gerçek DB yok; token kaydını no-op yapalım.
    return NextResponse.json({ ok: true, stored: false });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("push_tokens").upsert(
    {
      user_id: session.id,
      token: parsed.data.token,
      platform: parsed.data.platform ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "token" }
  );

  if (error) {
    return NextResponse.json({ ok: false, error: "DB error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, stored: true });
}

