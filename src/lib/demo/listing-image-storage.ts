import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import path from "path";

const IMAGE_DIR = path.join(process.cwd(), "data", "listing-images");
const MAX_BYTES = 500 * 1024;

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

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

  if (!existsSync(IMAGE_DIR)) {
    mkdirSync(IMAGE_DIR, { recursive: true });
  }

  removeExistingImages(listingId);
  writeFileSync(path.join(IMAGE_DIR, `${listingId}.${ext}`), buffer);

  return getDemoListingImageApiPath(listingId);
}

export function readDemoListingImage(listingId: string): { buffer: Buffer; contentType: string } | null {
  if (!existsSync(IMAGE_DIR)) return null;

  for (const file of readdirSync(IMAGE_DIR)) {
    if (!file.startsWith(`${listingId}.`)) continue;
    const ext = file.split(".").pop()?.toLowerCase() ?? "jpg";
    const buffer = readFileSync(path.join(IMAGE_DIR, file));
    return {
      buffer,
      contentType: MIME[ext] ?? "image/jpeg",
    };
  }

  return null;
}

function removeExistingImages(listingId: string) {
  if (!existsSync(IMAGE_DIR)) return;

  for (const file of readdirSync(IMAGE_DIR)) {
    if (file.startsWith(`${listingId}.`)) {
      unlinkSync(path.join(IMAGE_DIR, file));
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
