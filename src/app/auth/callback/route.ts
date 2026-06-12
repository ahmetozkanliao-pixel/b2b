import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    const companyName = meta.company_name as string | undefined;
    const role = (meta.role as string) || "demand_owner";

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
      });
    }
  }

  return NextResponse.redirect(`${origin}${next}?verified=1`);
}
