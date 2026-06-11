import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo/config";
import { getDemoSession, getDemoUserById } from "@/lib/demo/session";
import type { UserRole } from "@/types";

export interface AppSession {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  companyId: string | null;
  isDemo: boolean;
}

export async function getSession(): Promise<AppSession | null> {
  if (isDemoMode()) {
    const demo = await getDemoSession();
    if (!demo) return null;
    const user = getDemoUserById(demo.userId);
    if (!user) return null;

    return {
      id: demo.userId,
      email: demo.email,
      full_name: demo.full_name,
      role: demo.role,
      companyId: demo.companyId,
      isDemo: true,
    };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? "",
    full_name: profile?.full_name ?? "",
    role: (profile?.role as UserRole) ?? "demand_owner",
    companyId: company?.id ?? null,
    isDemo: false,
  };
}
