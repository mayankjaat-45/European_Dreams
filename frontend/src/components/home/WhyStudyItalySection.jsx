import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CircleDollarSign,
  Globe2,
  GraduationCap,
  Landmark,
} from "lucide-react";

const benefits = [
  {
    icon: CircleDollarSign,
    title: "Affordable Education",
    description:
      "Study at respected public universities with comparatively affordable tuition fees and living costs.",
  },
  {
    icon: GraduationCap,
    title: "Scholarship Opportunities",
    description:
      "Explore regional, merit-based and university scholarships available to international students.",
  },
  {
    icon: Landmark,
    title: "Renowned Universities",
    description:
      "Learn at some of Europe’s oldest universities with globally recognised qualifications.",
  },
  {
    icon: Globe2,
    title: "English-Taught Courses",
    description:
      "Choose from a wide range of bachelor’s and master’s programs delivered in English.",
  },
  {
    icon: Building2,
    title: "Culture and Lifestyle",
    description:
      "Experience historic cities, world-famous art, diverse cuisine and an enriching student lifestyle.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Career Opportunities",
    description:
      "Gain international exposure and explore valuable work opportunities during and after your studies.",
  },
];

export default function WhyStudyItalySection() {
  return (
    <section
      data-reveal
      className="relative overflow-hidden bg-background py-20 sm:py-24"
    >
      {/* Decorative background */}
      <div className="motion-float-slow pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="motion-float pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

      <div className="container-custom relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div data-reveal="scale" className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-secondary/25 bg-secondary/10 px-4 py-2 text-sm font-bold text-secondary">
            <span className="text-base" aria-hidden="true">
              🇮🇹
            </span>
            Study in Italy
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Why Choose Italy for Your{" "}
            <span className="text-primary">Higher Education?</span>
          </h2>

          <p className="mt-5 text-base leading-8 text-muted sm:text-lg">
            Italy combines quality education, affordable study options and an
            unforgettable European experience for international students.
          </p>
        </div>

        {/* Benefit cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <article
                key={benefit.title}
                data-reveal="scale"
                data-delay={(index % 3) + 1}
                className="motion-card group relative overflow-hidden rounded-[1.75rem] border border-border bg-card p-6 shadow-sm"
              >
                {/* Decorative card circle */}
                <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />

                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>

                <h3 className="relative mt-6 text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                  {benefit.title}
                </h3>

                <p className="relative mt-3 leading-7 text-muted">
                  {benefit.description}
                </p>

                {/* Bottom accent */}
                <span className="absolute inset-x-0 bottom-0 mx-auto h-1 w-0 rounded-full bg-linear-to-r from-primary to-secondary transition-all duration-500 group-hover:w-1/2" />
              </article>
            );
          })}
        </div>

        {/* Actions */}
        <div
          data-reveal
          data-delay="4"
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/contact?type=admission"
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20"
          >
            Get Free Counselling
            <ArrowRight
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>

          <Link
            href="/universities"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 font-bold text-foreground transition duration-300 hover:-translate-y-1 hover:border-primary hover:text-primary hover:shadow-lg"
          >
            Explore Universities
          </Link>
        </div>
      </div>
    </section>
  );
}
