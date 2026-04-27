import type { Metadata } from "next";
import NewsClient from "@/components/NewsClient";

export const metadata: Metadata = {
  title: "News — Live World & India News | PreppTools",
  description: "Stay updated with live news from around the world. Filter by country, city, or topic — top stories, business, tech, sports, politics and more.",
  keywords: ["world news", "India news", "live news", "latest news", "top stories", "business news", "tech news"],
  alternates: { canonical: "https://www.prepptools.com/news" },
  openGraph: {
    title: "Live News — PreppTools",
    description: "Latest news from around the world. Filter by country, city, or category.",
    url: "https://www.prepptools.com/news",
    type: "website",
  },
};

export default function NewsPage() {
  return <NewsClient />;
}
