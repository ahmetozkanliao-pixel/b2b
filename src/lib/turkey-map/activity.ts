export interface ProvinceActivity {
  suppliers: number;
  customers: number;
  listings: number;
  level: "high" | "medium" | "low";
}

const HIGH_ACTIVITY_CODES = new Set([
  "34", "06", "35", "16", "41", "27", "42", "33", "07", "01", "26", "38", "55", "61",
]);

const MEDIUM_ACTIVITY_CODES = new Set([
  "10", "45", "20", "21", "31", "63", "59", "17", "48", "09", "52", "54", "58", "44",
]);

function hashCode(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getProvinceActivity(code: string): ProvinceActivity {
  const level = HIGH_ACTIVITY_CODES.has(code)
    ? "high"
    : MEDIUM_ACTIVITY_CODES.has(code)
      ? "medium"
      : "low";

  const seed = hashCode(code);

  const multiplier = level === "high" ? 1 : level === "medium" ? 0.55 : 0.28;

  return {
    suppliers: Math.round((12 + (seed % 48)) * multiplier),
    customers: Math.round((4 + (seed % 18)) * multiplier),
    listings: Math.round((6 + (seed % 24)) * multiplier),
    level,
  };
}

export const TURKEY_HUBS = [
  { id: "istanbul", code: "34", x: 228, y: 148, labelTr: "İstanbul", labelEn: "Istanbul" },
  { id: "ankara", code: "06", x: 418, y: 198, labelTr: "Ankara", labelEn: "Ankara" },
  { id: "izmir", code: "35", x: 108, y: 238, labelTr: "İzmir", labelEn: "Izmir" },
  { id: "bursa", code: "16", x: 278, y: 172, labelTr: "Bursa", labelEn: "Bursa" },
  { id: "gaziantep", code: "27", x: 652, y: 298, labelTr: "Gaziantep", labelEn: "Gaziantep" },
  { id: "kocaeli", code: "41", x: 258, y: 132, labelTr: "Kocaeli", labelEn: "Kocaeli" },
] as const;

export const HUB_CONNECTIONS: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 5],
  [1, 4],
  [2, 3],
  [1, 3],
];

export const TURKISH_PROVINCE_NAMES: Record<string, string> = {
  "34": "İstanbul",
  "06": "Ankara",
  "35": "İzmir",
  "16": "Bursa",
  "41": "Kocaeli",
  "27": "Gaziantep",
  "07": "Antalya",
  "01": "Adana",
  "42": "Konya",
  "33": "Mersin",
  "38": "Kayseri",
  "55": "Samsun",
  "61": "Trabzon",
  "26": "Eskişehir",
  "10": "Balıkesir",
  "45": "Manisa",
  "20": "Denizli",
  "21": "Diyarbakır",
  "31": "Hatay",
  "63": "Şanlıurfa",
  "59": "Tekirdağ",
  "17": "Çanakkale",
  "48": "Muğla",
  "09": "Aydın",
  "52": "Ordu",
  "54": "Sakarya",
  "58": "Sivas",
  "44": "Malatya",
};
