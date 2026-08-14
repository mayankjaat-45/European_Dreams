import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  BookOpenCheck,
  ClipboardCheck,
  FileCheck2,
  PlaneTakeoff,
  Stamp,
} from "lucide-react";

const services = [
  {
    icon: ClipboardCheck,
    title: "Free Profile Evaluation",
    description:
      "Get your academic profile reviewed and discover the best study opportunities available for you in Italy.",
    href: "/contact?type=admission",
  },
  {
    icon: BookOpenCheck,
    title: "University & Course Selection",
    description:
      "Select suitable Italian universities and English-taught courses based on your qualifications and career goals.",
    href: "/universities",
  },
  {
    icon: FileCheck2,
    title: "Application Assistance",
    description:
      "Receive complete assistance with university applications, document preparation and application tracking.",
    href: "/contact?type=admission",
  },
  {
    icon: BadgeDollarSign,
    title: "Scholarship Guidance",
    description:
      "Explore regional, merit-based and university scholarships with guidance for preparing the required documents.",
    href: "/contact?type=scholarship",
  },
  {
    icon: Stamp,
    title: "Visa Assistance",
    description:
      "Get guidance for your Italy student visa, financial documents, appointment and interview preparation.",
    href: "/contact?type=visa",
  },
  {
    icon: PlaneTakeoff,
    title: "Pre-Departure Support",
    description:
      "Prepare for your journey with assistance for accommodation, travel planning and essential pre-departure guidance.",
    href: "/contact?type=general",
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services"
      data-reveal
      className="relative scroll-mt-24 overflow-hidden bg-card-hover py-20 sm:py-24"
    >
      {/* Decorative backgrounds */}
      <div className="motion-float-slow pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="motion-float pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="container-custom relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div data-reveal="scale" className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
            Our Services
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Complete Support for Your{" "}
            <span className="text-primary">Study in Italy Journey</span>
          </h2>

          <p className="mt-5 text-base leading-8 text-muted sm:text-lg">
            From selecting the right university to preparing for departure,
            European Dreams supports you throughout every stage of your
            admission journey.
          </p>
        </div>

        {/* Services */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                data-reveal="scale"
                data-delay={(index % 3) + 1}
                className="h-full"
              >
                <article className="motion-card group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
                  {/* Hover glow */}
                  <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-primary/5 transition-transform duration-700 group-hover:scale-150" />

                  {/* Number */}
                  <span
                    aria-hidden="true"
                    className="absolute right-5 top-4 text-5xl font-black text-primary/5 transition-all duration-500 group-hover:scale-110 group-hover:text-primary/10"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Icon */}
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-3 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>

                  {/* Content */}
                  <h3 className="relative mt-6 text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                    {service.title}
                  </h3>

                  <p className="relative mt-3 flex-1 leading-7 text-muted">
                    {service.description}
                  </p>

                  {/* Link */}
                  <Link
                    href={service.href}
                    className="group/link relative mt-6 inline-flex w-fit items-center gap-2 font-bold text-primary transition-colors duration-300 hover:text-primary-hover"
                  >
                    Learn More
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>

                  {/* Bottom accent */}
                  <span className="absolute inset-x-0 bottom-0 mx-auto h-1 w-0 rounded-full bg-linear-to-r from-primary to-secondary transition-all duration-500 group-hover:w-1/2" />
                </article>
              </div>
            );
          })}
        </div>

        {/* Consultation CTA */}
        <div
          data-reveal="scale"
          data-delay="2"
          className="group relative mt-12 overflow-hidden rounded-[1.75rem] bg-primary px-6 py-8 text-center shadow-xl sm:px-10 lg:flex lg:items-center lg:justify-between lg:text-left"
        >
          {/* CTA decoration */}
          <div className="motion-float pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10 blur-2xl" />

          <div className="motion-float-slow pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-secondary/20 blur-2xl" />

          <div className="relative">
            <h3 className="text-2xl font-bold text-white sm:text-3xl">
              Unsure Where to Begin?
            </h3>

            <p className="mt-2 max-w-2xl leading-7 text-white/80">
              Speak with our counsellors for a free profile evaluation and
              receive a personalised roadmap for studying in Italy.
            </p>
          </div>

          <Link
            href="/contact?type=admission"
            className="group/button relative mt-6 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-secondary-hover hover:shadow-xl lg:mt-0"
          >
            Book Free Consultation
            <ArrowRight
              className="h-5 w-5 transition-transform duration-300 group-hover/button:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
