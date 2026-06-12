import { NextResponse } from "next/server";
import { isDemoMode } from "@/lib/demo/config";
import { readDemoLogo } from "@/lib/demo/logo-storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ companyId: string }> }
) {
  if (!isDemoMode()) {
    return NextResponse.json({ error: "Demo modu aktif değil." }, { status: 400 });
  }

  const { companyId } = await params;
  const logo = readDemoLogo(companyId);

  if (!logo) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(new Uint8Array(logo.buffer), {
    headers: {
      "Content-Type": logo.contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
