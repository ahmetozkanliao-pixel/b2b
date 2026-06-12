import { Hero } from "@/components/home/hero";
import { HomeExperience } from "@/components/home/home-experience";
import { PlatformChapter } from "@/components/home/platform-chapter";
import { ProcessChapter } from "@/components/home/process-chapter";
import { BenefitsChapter } from "@/components/home/benefits-chapter";
import { CompaniesShowcase } from "@/components/home/companies-showcase";
import { LatestListings } from "@/components/home/latest-listings";
import { NewsSection } from "@/components/home/news-section";
import { getFeaturedCompanies } from "@/lib/companies";
import { getPublishedNews } from "@/lib/news";

export default async function HomePage() {
  const [news, companies] = await Promise.all([getPublishedNews(3), getFeaturedCompanies()]);

  return (
    <HomeExperience>
      <Hero />
      <PlatformChapter />
      <ProcessChapter />
      <BenefitsChapter />
      <CompaniesShowcase demand={companies.demand} producers={companies.producers} />
      <LatestListings />
      <NewsSection articles={news} />
    </HomeExperience>
  );
}
