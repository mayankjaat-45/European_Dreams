import {
  ArrowRight,
  BadgeCheck,
  FileCheck2,
  GraduationCap,
  PlaneTakeoff,
} from "lucide-react";
import Link from "next/link";

const processSteps = [
  {
    number: "01",
    icon: GraduationCap,
    title: "Profile Evaluation & Admission",
    description:
      "Our expert counsellors evaluate your academic profile, interests and career goals to help you select suitable universities and courses.",
    points: [
      "Profile assessment",
      "University selection",
      "Course selection",
      "Application assistance",
    ],
  },
  {
    number: "02",
    icon: FileCheck2,
    title: "Pre-Enrolment",
    description:
      "We assist with pre-enrolment procedures, document preparation, attestations and the information required before official enrolment.",
    points: [
      "Document verification",
      "Pre-enrolment guidance",
      "Attestation assistance",
      "Application tracking",
    ],
  },
  {
    number: "03",
    icon: BadgeCheck,
    title: "Scholarship Assistance",
    description:
      "Our team helps you identify eligible scholarships and guides you through the application and documentation process.",
    points: [
      "Scholarship search",
      "Eligibility guidance",
      "Document preparation",
      "Application support",
    ],
  },
  {
    number: "04",
    icon: PlaneTakeoff,
    title: "Visa & Departure Support",
    description:
      "Get complete guidance for your student visa application and preparation for travelling to your study destination.",
    points: [
      "Visa application assistance",
      "Cover and sponsor letters",
      "Travel and health insurance",
      "Pre-departure guidance",
    ],
  },
];

export default function VisaProcessSection() {
  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24">
      <div className="absolute -right-32 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -left-32 bottom-10 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative mx-auto max-w-300 px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-secondary/10 px-4 py-2 text-sm font-bold text-secondary">
            Complete Student Support
          </span>

          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            From Application to{" "}
            <span className="text-primary">Visa Approval</span>
          </h2>

          <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
            We support students throughout their study-abroad journey, from
            profile evaluation and admission to scholarships, visa preparation
            and departure.
          </p>
        </div>

        <div className="relative mt-12 grid gap-6 md:grid-cols-2 lg:mt-16">
          {processSteps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="group relative overflow-hidden rounded-[28px] border border-border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl sm:p-8"
              >
                <span className="absolute right-6 top-3 text-7xl font-black text-primary/5">
                  {step.number}
                </span>

                <div className="relative">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                      <Icon size={27} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">
                        Step {step.number}
                      </p>

                      <h3 className="mt-1 text-xl font-extrabold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-6 leading-7 text-muted">
                    {step.description}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {step.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-center gap-2 text-sm font-semibold text-foreground"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-xs text-success">
                          ✓
                        </span>
                        {point}
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contact?type=admission"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-bold text-white transition hover:bg-primary-hover"
          >
            Book Free Consultation
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 font-bold text-foreground transition hover:border-primary/30 hover:text-primary"
          >
            Explore Our Services
          </Link>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-5 text-muted">
          Admission, scholarship and visa outcomes depend on eligibility,
          university policies and official authorities. Assistance does not
          guarantee approval.
        </p>
      </div>
    </section>
  );
}
