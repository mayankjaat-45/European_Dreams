import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  FileText,
  MessageCircle,
  PlaneTakeoff,
  Stamp,
} from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    title: "Free Consultation",
    description:
      "Discuss your academic background, preferred course and career goals with our experienced counsellors.",
  },
  {
    icon: ClipboardCheck,
    title: "Profile Evaluation",
    description:
      "We evaluate your qualifications and identify suitable universities, courses and admission opportunities.",
  },
  {
    icon: FileText,
    title: "University Application",
    description:
      "Our team assists you with document preparation, university applications and submission tracking.",
  },
  {
    icon: BadgeCheck,
    title: "Admission & Scholarship",
    description:
      "Receive support with admission offers, scholarship applications and all required university formalities.",
  },
  {
    icon: Stamp,
    title: "Visa Preparation",
    description:
      "Get complete guidance for financial documents, visa appointments and interview preparation.",
  },
  {
    icon: PlaneTakeoff,
    title: "Fly to Italy",
    description:
      "Prepare for departure with guidance on accommodation, travel and settling into student life in Italy.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      data-reveal
      className="relative overflow-hidden bg-background py-20 sm:py-24"
    >
      {/* Decorative background */}
      <div className="motion-float-slow pointer-events-none absolute -left-40 top-0 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="motion-float pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="container-custom relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div data-reveal="scale" className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-secondary/25 bg-secondary/10 px-4 py-2 text-sm font-bold text-secondary">
            How It Works
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Your Journey to Italy in{" "}
            <span className="text-primary">Six Simple Steps</span>
          </h2>

          <p className="mt-5 text-base leading-8 text-muted sm:text-lg">
            From your first counselling session to your arrival in Italy, our
            team supports you throughout the complete admission process.
          </p>
        </div>

        {/* Process */}
        <div className="relative mt-14">
          {/* Desktop connecting line */}
          <div
            className="absolute left-[8%] right-[8%] top-9 hidden h-px bg-linear-to-r from-transparent via-primary/30 to-transparent lg:block"
            aria-hidden="true"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  data-reveal="scale"
                  data-delay={(index % 3) + 1}
                  className="h-full"
                >
                  <article className="motion-card group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
                    {/* Hover glow */}
                    <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-primary/5 transition-transform duration-700 group-hover:scale-150" />

                    {/* Step number + icon */}
                    <div className="relative flex items-center justify-between">
                      <div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-3 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20">
                        <Icon className="h-8 w-8" aria-hidden="true" />
                      </div>

                      <span
                        aria-hidden="true"
                        className="text-5xl font-black text-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:text-primary/20"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="relative mt-6 text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                      {step.title}
                    </h3>

                    <p className="relative mt-3 flex-1 leading-7 text-muted">
                      {step.description}
                    </p>

                    {/* Bottom step indicator */}
                    <div className="relative mt-6 flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-bold text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                        {index + 1}
                      </span>

                      <span className="h-px flex-1 bg-border transition-all duration-500 group-hover:bg-primary/50" />
                    </div>

                    {/* Bottom accent */}
                    <span className="absolute inset-x-0 bottom-0 mx-auto h-1 w-0 rounded-full bg-linear-to-r from-primary to-secondary transition-all duration-500 group-hover:w-1/2" />
                  </article>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div data-reveal="scale" data-delay="2" className="mt-12 text-center">
          <p className="text-lg font-semibold text-foreground">
            Ready to take the first step towards studying in Italy?
          </p>

          <Link
            href="/contact?type=admission"
            className="group mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/20"
          >
            Start Your Application
            <ArrowRight
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
