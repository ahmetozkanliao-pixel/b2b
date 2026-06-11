import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { LatestListings } from "@/components/home/latest-listings";
import { NewsSection } from "@/components/home/news-section";
import { getPublishedNews } from "@/lib/news";

export default async function HomePage() {
  const news = await getPublishedNews(3);

  return (
    <>
      <Hero />
      <HowItWorks />
      <LatestListings />
      <NewsSection articles={news} />
    </>
  );
}
