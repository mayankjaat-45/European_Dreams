import AboutSection from "@/components/home/AboutSection";
import CoursesSection from "@/components/home/CoursesSection";
import Hero from "@/components/home/Hero";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import LatestBlogsSection from "@/components/home/LatestBlogsSection";
import ScholarshipsSection from "@/components/home/ScholarshipsSection";
import ServicesSection from "@/components/home/ServicesSection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import UniversitiesSection from "@/components/home/UniversitiesSection";
import WhyStudyItalySection from "@/components/home/WhyStudyItalySection";

const SITE_URL = "https://www.europeandreamss.com";

export const metadata = {
  title: "Study in Europe & Italy for Indian Students",
  description:
    "Explore universities, courses, scholarships and admission guidance for studying in Europe and Italy. Get expert assistance for Indian students from European Dreams.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Study in Europe & Italy for Indian Students | European Dreams",
    description:
      "Explore universities, courses, scholarships and admission guidance for studying in Europe and Italy. Get expert assistance for Indian students from European Dreams.",
    url: SITE_URL,
    siteName: "European Dreams",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 630,
        alt: "European Dreams - Study in Italy and Europe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Study in Europe & Italy for Indian Students | European Dreams",
    description:
      "Explore universities, courses, scholarships and admission guidance for studying in Europe and Italy. Get expert assistance for Indian students from European Dreams.",
    images: ["/images/hero.jpg"],
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <StatsSection />
      <AboutSection />
      <WhyStudyItalySection />
      <UniversitiesSection />
      <CoursesSection />
      <TestimonialsSection />
      <ServicesSection />
      {/* <VisaProcessSection /> */}
      <HowItWorksSection />
      <ScholarshipsSection />
      <LatestBlogsSection />
    </main>
  );
}
