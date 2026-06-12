import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { DEMO_SESSION_COOKIE, isDemoMode } from "@/lib/demo/config";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

function hasDemoSession(request: NextRequest) {
  const raw = request.cookies.get(DEMO_SESSION_COOKIE)?.value;
  if (!raw) return false;
  try {
    JSON.parse(raw);
    return true;
  } catch {
    return false;
  }
}

export async function updateSession(request: NextRequest) {
  const protectedPaths = ["/dashboard", "/admin"];
  const isProtected = protectedPaths.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );

  // Demo oturumu veya demo modu: Edge'de DEMO_MODE bazen okunmaz; cookie varsa öncelik ver.
  const demoLoggedIn = hasDemoSession(request);
  const useDemoAuth = demoLoggedIn || isDemoMode();

  if (useDemoAuth) {
    if (isProtected && !demoLoggedIn) {
      const url = request.nextUrl.clone();
      url.pathname = "/giris";
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    if (
      demoLoggedIn &&
      (request.nextUrl.pathname === "/giris" || request.nextUrl.pathname === "/kayit")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    return NextResponse.next({ request });
  }

  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseAnonKey();

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/giris";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (user && (request.nextUrl.pathname === "/giris" || request.nextUrl.pathname === "/kayit")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
