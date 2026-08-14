import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  GraduationCap,
  Landmark,
  WalletCards,
} from "lucide-react";

const scholarshipBenefits = [
  {
    icon: Landmark,
    title: "Regional Scholarships",
    description:
      "Explore need-based regional scholarships that may include tuition-fee waivers, meals, accommodation and financial support.",
  },
  {
    icon: GraduationCap,
    title: "University Scholarships",
    description:
      "Discover scholarships offered directly by Italian universities based on academic merit and student eligibility.",
  },
  {
    icon: WalletCards,
    title: "Affordable Education",
    description:
      "Reduce your overall study expenses through affordable public-university fees and available financial assistance.",
  },
  {
    icon: Building2,
    title: "Accommodation Support",
    description:
      "Some scholarship programmes may provide university accommodation or financial support toward housing costs.",
  },
];

const supportPoints = [
  "Scholarship eligibility assessment",
  "Required-document checklist",
  "Application-form assistance",
  "Income and financial-document guidance",
  "Deadline and application tracking",
  "Post-admission scholarship support",
];

export default function ScholarshipsSection() {
  return (
    <section
      data-reveal
      className="relative overflow-hidden bg-card-hover py-20 sm:py-24"
    >
      {/* Animated background */}
      <div className="motion-float-slow pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="motion-float pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="container-custom relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          {/* Left content */}
          <div>
            <div data-reveal="left">
              <span className="inline-flex items-center gap-2 rounded-full border border-secondary/25 bg-secondary/10 px-4 py-2 text-sm font-bold text-secondary">
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
                Scholarships in Italy
              </span>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Make Your Italian Education{" "}
                <span className="text-primary">More Affordable</span>
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
                International students may be eligible for regional, university
                and merit-based scholarships. Our counsellors help you
                understand the requirements and complete the application
                process.
              </p>
            </div>

            {/* Benefit cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {scholarshipBenefits.map((benefit, index) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    data-reveal="scale"
                    data-delay={(index % 2) + 1}
                    className="h-full"
                  >
                    <article className="motion-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
                      {/* Hover glow */}
                      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-primary/5 transition-transform duration-700 group-hover:scale-150" />

                      {/* Icon */}
                      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-3 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>

                      <h3 className="relative mt-4 text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                        {benefit.title}
                      </h3>

                      <p className="relative mt-2 flex-1 text-sm leading-6 text-muted">
                        {benefit.description}
                      </p>

                      {/* Bottom accent */}
                      <span className="absolute inset-x-0 bottom-0 mx-auto h-1 w-0 rounded-full bg-linear-to-r from-primary to-secondary transition-all duration-500 group-hover:w-1/2" />
                    </article>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right support card */}
          <div data-reveal="right" data-delay="2" className="relative">
            {/* Glow */}
            <div className="absolute -inset-4 rounded-[2.25rem] bg-linear-to-br from-primary/15 to-secondary/15 blur-2xl" />

            <div className="group relative overflow-hidden rounded-4xl bg-primary p-7 text-white shadow-2xl sm:p-9">
              {/* Decorations */}
              <div className="motion-float pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />

              <div className="motion-float-slow pointer-events-none absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-secondary/15 blur-xl" />

              <div className="relative">
                <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold transition duration-300 group-hover:bg-white/20">
                  Complete Guidance
                </span>

                <h3 className="mt-5 text-2xl font-bold sm:text-3xl">
                  How European Dreams Supports You
                </h3>

                <p className="mt-3 leading-7 text-white/80">
                  Get step-by-step assistance from eligibility checking to the
                  final scholarship application.
                </p>

                {/* Support points */}
                <ul className="mt-7 space-y-4">
                  {supportPoints.map((point, index) => (
                    <li
                      key={point}
                      className="group/item flex items-start gap-3"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary transition-all duration-300 group-hover/item:scale-110 group-hover/item:shadow-md">
                        <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                      </span>

                      <span className="font-medium text-white/90 transition-colors duration-300 group-hover/item:text-white">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/contact?type=scholarship"
                  className="group/button mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-secondary-hover hover:shadow-xl"
                >
                  Check Scholarship Eligibility
                  <ArrowRight
                    className="h-5 w-5 transition-transform duration-300 group-hover/button:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>

                <p className="mt-4 text-xs leading-5 text-white/65">
                  Scholarship availability and eligibility depend on the
                  university, region, programme and applicant profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
