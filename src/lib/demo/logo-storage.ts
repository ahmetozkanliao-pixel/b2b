import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import path from "path";

const LOGO_DIR = path.join(process.cwd(), "data", "logos");
const MAX_BYTES = 200 * 1024;

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export function getDemoLogoApiPath(companyId: string) {
  return `/api/demo/logo/${companyId}`;
}

export function isInlineImageData(value: string | null | undefined) {
  return Boolean(value?.startsWith("data:image/"));
}

export function saveDemoLogo(companyId: string, dataUrl: string): string {
  const match = dataUrl.match(/^data:image\/([\w+]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Geçersiz görsel formatı.");
  }

  const rawType = match[1].toLowerCase();
  const ext = rawType === "jpeg" ? "jpg" : rawType;
  const buffer = Buffer.from(match[2], "base64");

  if (buffer.length > MAX_BYTES) {
    throw new Error("Logo çok büyük. Daha küçük bir görsel deneyin.");
  }

  if (!existsSync(LOGO_DIR)) {
    mkdirSync(LOGO_DIR, { recursive: true });
  }

  removeExistingLogos(companyId);
  writeFileSync(path.join(LOGO_DIR, `${companyId}.${ext}`), buffer);

  return getDemoLogoApiPath(companyId);
}

export function deleteDemoLogo(companyId: string) {
  removeExistingLogos(companyId);
}

export function readDemoLogo(companyId: string): { buffer: Buffer; contentType: string } | null {
  if (!existsSync(LOGO_DIR)) return null;

  for (const file of readdirSync(LOGO_DIR)) {
    if (!file.startsWith(`${companyId}.`)) continue;
    const ext = file.split(".").pop()?.toLowerCase() ?? "jpg";
    const buffer = readFileSync(path.join(LOGO_DIR, file));
    return {
      buffer,
      contentType: MIME[ext] ?? "image/jpeg",
    };
  }

  return null;
}

function removeExistingLogos(companyId: string) {
  if (!existsSync(LOGO_DIR)) return;

  for (const file of readdirSync(LOGO_DIR)) {
    if (file.startsWith(`${companyId}.`)) {
      unlinkSync(path.join(LOGO_DIR, file));
    }
  }
}

export function processLogoField(
  companyId: string,
  logoUrl: string | null | undefined
): string | null {
  if (!logoUrl) {
    deleteDemoLogo(companyId);
    return null;
  }

  if (isInlineImageData(logoUrl)) {
    return saveDemoLogo(companyId, logoUrl);
  }

  return logoUrl;
}
