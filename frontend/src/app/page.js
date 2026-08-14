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
