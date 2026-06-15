import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function readMetaString(meta: Record<string, unknown>, key: string): string | undefined {
  const value = meta[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readMetaCategoryIds(meta: Record<string, unknown>): string[] {
  const value = meta.category_ids;
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.length > 0);
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/giris?error=auth-callback`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/giris?error=auth-callback`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const meta = user.user_metadata ?? {};
    const companyName = readMetaString(meta, "company_name");
    const role = (readMetaString(meta, "role") as "demand_owner" | "producer") || "demand_owner";

    const { data: existingCompany } = await supabase
      .from("companies")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!existingCompany && companyName) {
      await supabase.from("companies").insert({
        owner_id: user.id,
        name: companyName,
        type: role,
        email: user.email,
        phone: readMetaString(meta, "phone") ?? null,
        website: readMetaString(meta, "website") ?? null,
        address: readMetaString(meta, "address") ?? null,
        country: readMetaString(meta, "country") ?? "Türkiye",
        city: readMetaString(meta, "city") ?? null,
        tax_number: readMetaString(meta, "tax_number") ?? null,
        category_ids: readMetaCategoryIds(meta),
      });
    }

    const nationalId = readMetaString(meta, "national_id");
    const phone = readMetaString(meta, "phone");
    if (nationalId || phone) {
      await supabase
        .from("profiles")
        .update({
          ...(nationalId ? { national_id: nationalId } : {}),
          ...(phone ? { phone } : {}),
        })
        .eq("id", user.id);
    }
  }

  return NextResponse.redirect(`${origin}${next}?verified=1`);
}
