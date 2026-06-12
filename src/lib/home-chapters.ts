export interface HomeChapter {
  id: string;
  number: string;
  labelKey: string;
  shortLabelKey: string;
}

export const HOME_CHAPTERS: HomeChapter[] = [
  { id: "giris", number: "01", labelKey: "home.chapters.intro", shortLabelKey: "home.chapters.intro" },
  { id: "platform", number: "02", labelKey: "home.chapters.platform", shortLabelKey: "home.chapters.platformShort" },
  { id: "surec", number: "03", labelKey: "home.chapters.process", shortLabelKey: "home.chapters.processShort" },
  { id: "avantajlar", number: "04", labelKey: "home.chapters.benefits", shortLabelKey: "home.chapters.benefitsShort" },
  { id: "firmalar", number: "05", labelKey: "home.chapters.companies", shortLabelKey: "home.chapters.companiesShort" },
  { id: "ilanlar", number: "06", labelKey: "home.chapters.listings", shortLabelKey: "home.chapters.listingsShort" },
  { id: "haberler", number: "07", labelKey: "home.chapters.news", shortLabelKey: "home.chapters.newsShort" },
];
