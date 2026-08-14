import Image from "next/image";
import Link from "next/link";

const highlights = [
  "Personalised profile evaluation for Study in Italy",
  "Italian university and course selection guidance",
  "Admission, pre-enrolment and document assistance",
  "Scholarship and Italian student-visa guidance",
];

const features = [
  {
    title: "39+ universities",
    description:
      "Explore leading Italian universities and English-taught study opportunities.",
    icon: "guidance",
  },
  {
    title: "600+ courses",
    description:
      "Discover Bachelor's, Master's and other programmes across Italy.",
    icon: "shield",
  },
];

const recognitions = [
  "Top 10% Creator recognition on Topmate",
  "Featured at Times Square, New York",
];

function FeatureIcon({ name }) {
  if (name === "shield") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="h-7 w-7"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3 5 6v5c0 4.8 2.8 8.3 7 10 4.2-1.7 7-5.2 7-10V6l-7-3Z"
        />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m9.5 12 1.7 1.7 3.5-3.7"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-7 w-7"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10.5 12 5l9 5.5-9 5.5-9-5.5Z"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.5 13.5V17c3.4 2.3 7.6 2.3 11 0v-3.5"
      />

      <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5V16" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 transition-transform group-hover:translate-x-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14m-6-6 6 6-6 6"
      />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 4h8v4a4 4 0 0 1-8 0V4Z"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 5H4v2a4 4 0 0 0 4 4M18 5h2v2a4 4 0 0 1-4 4M12 12v4m-3 4h6"
      />
    </svg>
  );
}

export default function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24">
      {/* Background decoration */}

      <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-28 -left-32 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-300 items-center gap-12 px-5 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-8">
        {/* ====================================================== */}
        {/* LEFT */}
        {/* ====================================================== */}

        <div
          data-reveal="left"
          className="relative mx-auto w-full max-w-130 lg:mx-0"
        >
          <div className="motion-card group relative overflow-hidden rounded-4xl bg-primary shadow-2xl shadow-primary/20">
            {/* Image */}

            <div className="relative h-64 overflow-hidden sm:h-72">
              <Image
                src="/images/about.jpeg"
                alt="European Dreams Study in Italy counselling and guidance"
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/20 to-transparent" />

              {/* Floating icon */}

              <div className="motion-float absolute bottom-5 left-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur-md">
                <FeatureIcon name="guidance" />
              </div>

              {/* Italy badge */}

              <div className="absolute right-5 top-5 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-white backdrop-blur-md">
                Study in Italy 🇮🇹
              </div>
            </div>

            {/* Content */}

            <div className="relative p-7 text-white sm:p-9">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border-28 border-white/10" />

              <div className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-secondary/30 blur-2xl" />

              <div className="relative">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
                  Your Italy journey
                </p>

                <h3 className="mt-3 max-w-md font-display text-3xl font-bold leading-tight sm:text-4xl">
                  More than admission advice—a mentor for your complete Study in
                  Italy journey.
                </h3>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {features.map((feature, index) => (
                    <article
                      key={feature.title}
                      data-reveal="scale"
                      data-delay={index + 1}
                      className="motion-card group/card rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm transition hover:bg-white/15"
                    >
                      <div className="text-amber-300 transition-transform duration-300 group-hover/card:-translate-y-1 group-hover/card:scale-110">
                        <FeatureIcon name={feature.icon} />
                      </div>

                      <h4 className="mt-4 text-lg font-bold text-white">
                        {feature.title}
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-white/70">
                        {feature.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating badge */}

          <div
            data-reveal="scale"
            data-delay="3"
            className="motion-float-slow absolute -bottom-5 right-5 rounded-2xl border border-border bg-card px-5 py-4 shadow-xl sm:right-8"
          >
            <p className="text-2xl font-extrabold text-secondary">End-to-end</p>

            <p className="mt-1 text-sm font-semibold text-muted">
              Study in Italy support
            </p>
          </div>
        </div>

        {/* ====================================================== */}
        {/* RIGHT */}
        {/* ====================================================== */}

        <div data-reveal="right">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-secondary">
            About European Dreams
          </p>

          <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Guiding students from their first choice to university life in Italy
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            European Dreams is an educational consulting service founded by
            Nitil Kumar Srivastava, focused on helping students understand and
            successfully navigate the process of studying in Italy.
          </p>

          <p className="mt-4 max-w-2xl leading-7 text-muted">
            From profile evaluation and university selection to applications,
            scholarships, pre-enrolment, visa preparation and arrival support,
            students receive practical guidance throughout the complete journey.
          </p>

          {/* Highlights */}

          <ul className="mt-7 grid gap-4 sm:grid-cols-2">
            {highlights.map((highlight, index) => (
              <li
                key={highlight}
                data-reveal
                data-delay={(index % 4) + 1}
                className="group flex items-start gap-3"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10 text-success transition-all duration-300 group-hover:scale-110 group-hover:bg-success group-hover:text-white">
                  <CheckIcon />
                </span>

                <span className="text-sm font-semibold leading-6 text-foreground">
                  {highlight}
                </span>
              </li>
            ))}
          </ul>

          {/* Recognition */}
          <div
            data-reveal
            data-delay="3"
            className="mt-8 rounded-3xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <TrophyIcon />
              </span>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">
                  Recognition & milestones
                </p>

                <p className="mt-1 text-sm font-semibold text-foreground">
                  Growing through education, guidance and student impact
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {recognitions.map((recognition) => (
                <div
                  key={recognition}
                  className="flex items-start gap-2 rounded-2xl bg-card-hover/60 px-4 py-3"
                >
                  <span className="mt-0.5 text-secondary">
                    <CheckIcon />
                  </span>

                  <p className="text-sm font-semibold leading-6 text-foreground">
                    {recognition}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}

          <div data-reveal data-delay="4" className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20"
            >
              Learn more about us
              <ArrowIcon />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center rounded-xl border border-border bg-card px-6 py-3 font-bold text-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:text-primary hover:shadow-lg"
            >
              Talk to a counsellor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
