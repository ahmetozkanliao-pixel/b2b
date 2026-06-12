export interface HomeChapter {
  id: string;
  number: string;
  label: string;
  shortLabel: string;
}

export const HOME_CHAPTERS: HomeChapter[] = [
  { id: "giris", number: "01", label: "Giriş", shortLabel: "Giriş" },
  { id: "platform", number: "02", label: "Platform nedir?", shortLabel: "Platform" },
  { id: "surec", number: "03", label: "Nasıl çalışır?", shortLabel: "Süreç" },
  { id: "avantajlar", number: "04", label: "Avantajlar", shortLabel: "Avantaj" },
  { id: "firmalar", number: "05", label: "Firmalar", shortLabel: "Firma" },
  { id: "ilanlar", number: "06", label: "Son ilanlar", shortLabel: "İlanlar" },
  { id: "haberler", number: "07", label: "Haberler", shortLabel: "Haber" },
];
