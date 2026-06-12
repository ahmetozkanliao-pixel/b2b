import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import path from "path";
import { getDemoDataDir, isDemoMemoryStore } from "./paths";

const MAX_BYTES = 200 * 1024;

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

const logoMemoryGlobal = globalThis as typeof globalThis & {
  __b2bDemoLogos?: Map<string, { buffer: Buffer; contentType: string }>;
};

function getLogoDir() {
  return path.join(getDemoDataDir(), "logos");
}

function getLogoMemory() {
  if (!logoMemoryGlobal.__b2bDemoLogos) {
    logoMemoryGlobal.__b2bDemoLogos = new Map();
  }
  return logoMemoryGlobal.__b2bDemoLogos;
}

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

  if (isDemoMemoryStore()) {
    getLogoMemory().set(companyId, {
      buffer,
      contentType: MIME[ext] ?? "image/jpeg",
    });
    return getDemoLogoApiPath(companyId);
  }

  const logoDir = getLogoDir();
  if (!existsSync(logoDir)) {
    mkdirSync(logoDir, { recursive: true });
  }

  removeExistingLogos(companyId);
  writeFileSync(path.join(logoDir, `${companyId}.${ext}`), buffer);

  return getDemoLogoApiPath(companyId);
}

export function deleteDemoLogo(companyId: string) {
  if (isDemoMemoryStore()) {
    getLogoMemory().delete(companyId);
    return;
  }
  removeExistingLogos(companyId);
}

export function readDemoLogo(companyId: string): { buffer: Buffer; contentType: string } | null {
  if (isDemoMemoryStore()) {
    return getLogoMemory().get(companyId) ?? null;
  }

  const logoDir = getLogoDir();
  if (!existsSync(logoDir)) return null;

  for (const file of readdirSync(logoDir)) {
    if (!file.startsWith(`${companyId}.`)) continue;
    const ext = file.split(".").pop()?.toLowerCase() ?? "jpg";
    const buffer = readFileSync(path.join(logoDir, file));
    return {
      buffer,
      contentType: MIME[ext] ?? "image/jpeg",
    };
  }

  return null;
}

function removeExistingLogos(companyId: string) {
  const logoDir = getLogoDir();
  if (!existsSync(logoDir)) return;

  for (const file of readdirSync(logoDir)) {
    if (file.startsWith(`${companyId}.`)) {
      unlinkSync(path.join(logoDir, file));
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
