import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import path from "path";
import { getDemoDataDir, isDemoMemoryStore } from "./paths";

const MAX_BYTES = 500 * 1024;

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

const imageMemoryGlobal = globalThis as typeof globalThis & {
  __b2bDemoListingImages?: Map<string, { buffer: Buffer; contentType: string }>;
};

function getImageDir() {
  return path.join(getDemoDataDir(), "listing-images");
}

function getImageMemory() {
  if (!imageMemoryGlobal.__b2bDemoListingImages) {
    imageMemoryGlobal.__b2bDemoListingImages = new Map();
  }
  return imageMemoryGlobal.__b2bDemoListingImages;
}

export function getDemoListingImageApiPath(listingId: string) {
  return `/api/demo/listing-image/${listingId}`;
}

export function isInlineImageData(value: string | null | undefined) {
  return Boolean(value?.startsWith("data:image/"));
}

export function saveDemoListingImage(listingId: string, dataUrl: string): string {
  const match = dataUrl.match(/^data:image\/([\w+]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Geçersiz görsel formatı.");
  }

  const rawType = match[1].toLowerCase();
  const ext = rawType === "jpeg" ? "jpg" : rawType;
  const buffer = Buffer.from(match[2], "base64");

  if (buffer.length > MAX_BYTES) {
    throw new Error("Görsel çok büyük. Daha küçük bir görsel deneyin.");
  }

  if (isDemoMemoryStore()) {
    getImageMemory().set(listingId, {
      buffer,
      contentType: MIME[ext] ?? "image/jpeg",
    });
    return getDemoListingImageApiPath(listingId);
  }

  const imageDir = getImageDir();
  if (!existsSync(imageDir)) {
    mkdirSync(imageDir, { recursive: true });
  }

  removeExistingImages(listingId);
  writeFileSync(path.join(imageDir, `${listingId}.${ext}`), buffer);

  return getDemoListingImageApiPath(listingId);
}

export function readDemoListingImage(listingId: string): { buffer: Buffer; contentType: string } | null {
  if (isDemoMemoryStore()) {
    return getImageMemory().get(listingId) ?? null;
  }

  const imageDir = getImageDir();
  if (!existsSync(imageDir)) return null;

  for (const file of readdirSync(imageDir)) {
    if (!file.startsWith(`${listingId}.`)) continue;
    const ext = file.split(".").pop()?.toLowerCase() ?? "jpg";
    const buffer = readFileSync(path.join(imageDir, file));
    return {
      buffer,
      contentType: MIME[ext] ?? "image/jpeg",
    };
  }

  return null;
}

function removeExistingImages(listingId: string) {
  const imageDir = getImageDir();
  if (!existsSync(imageDir)) return;

  for (const file of readdirSync(imageDir)) {
    if (file.startsWith(`${listingId}.`)) {
      unlinkSync(path.join(imageDir, file));
    }
  }
}

export function processListingImageField(
  listingId: string,
  imageUrl: string | null | undefined
): string | null {
  if (!imageUrl) return null;

  if (isInlineImageData(imageUrl)) {
    return saveDemoListingImage(listingId, imageUrl);
  }

  return imageUrl;
}
