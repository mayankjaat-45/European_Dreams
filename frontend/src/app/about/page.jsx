import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About European Dreams | Study in Italy Guidance",
  description:
    "Learn how European Dreams helps students study in Italy with university selection, admissions, scholarships, student visa guidance and complete pre-departure support.",
};

const stats = [
  {
    value: "Italy",
    label: "Dedicated study destination",
  },
  {
    value: "600+",
    label: "Courses to explore",
  },
  {
    value: "39+",
    label: "Italian universities",
  },
  {
    value: "End-to-end",
    label: "Student support",
  },
];

const achievements = [
  {
    title: "Top 10% Creator on Topmate",
    subtitle: "Recognised among 100K+ creators",
    description:
      "Nitil Kumar Srivastava was recognised in Topmate's May Month Recap among the Top 10% of creators from a community of more than 100,000 creators.",
    image: "/images/achievements/topmate-top-10.jpeg",
    imageAlt:
      "Topmate recognition featuring Nitil Kumar Srivastava among the top 10 percent of creators",
    badge: "Creator Recognition",
  },
  {
    title: "Featured at Times Square, New York",
    subtitle: "European Dreams on a global stage",
    description:
      "Nitil Kumar Srivastava and European Dreams were featured on a Times Square digital billboard in New York through Loop Creators Club, marking a memorable milestone in the European Dreams journey.",
    image: "/images/achievements/times-square-feature.jpeg",
    imageAlt:
      "Nitil Kumar Srivastava and European Dreams featured on a Times Square digital billboard in New York",
    badge: "Times Square Feature",
  },
];

const supportAreas = [
  {
    number: "01",
    title: "Profile evaluation",
    description:
      "We understand your academic background, goals, preferred study level and budget before suggesting suitable Italian universities and programmes.",
  },
  {
    number: "02",
    title: "University & course selection",
    description:
      "We help you compare Italian universities, English-taught programmes, admission requirements and suitable study options.",
  },
  {
    number: "03",
    title: "Application & scholarship support",
    description:
      "Our team assists with university applications, document preparation, pre-enrolment and available regional scholarship opportunities.",
  },
  {
    number: "04",
    title: "Study visa guidance",
    description:
      "We guide students through documentation, visa preparation and the important steps required for an Italian student visa application.",
  },
  {
    number: "05",
    title: "Pre-departure support",
    description:
      "Before you travel, we help you understand important preparations for your arrival, university life and transition to studying in Italy.",
  },
  {
    number: "06",
    title: "Post-arrival guidance",
    description:
      "Our guidance continues after arrival so students can better understand university processes and settle into their new life in Italy.",
  },
];

const values = [
  {
    title: "Student-first guidance",
    description:
      "Every recommendation begins with the student's academic profile, goals and long-term plans—not a one-size-fits-all shortlist.",
  },
  {
    title: "Clear and practical support",
    description:
      "We explain university requirements, application processes and visa steps clearly so students can make informed decisions.",
  },
  {
    title: "Complete Italy journey",
    description:
      "Students receive coordinated support from their first counselling session through university admission, visa preparation and arrival in Italy.",
  },
];

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
      className="h-5 w-5"
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
        d="M6 5H4v2a4 4 0 0 0 4 4M18 5h2v2a4 4 0 0 1-4 4M12 12v4m-3 4h6m-3-4a4 4 0 0 0-3 4m3-4a4 4 0 0 1 3 4"
      />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden border-b border-border bg-(--hero-gradient)">
        <div className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />

        <div className="relative mx-auto max-w-300 px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">
              About European Dreams
            </p>

            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Making your
              <span className="text-primary"> Study in Italy </span>
              journey easier to understand
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              European Dreams helps students navigate Italian universities,
              English-taught programmes, applications, scholarships, student
              visas and the journey to starting university life in Italy.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20"
              >
                Book Free Consultation
                <ArrowIcon />
              </Link>

              <Link
                href="/universities"
                className="inline-flex items-center rounded-xl border border-border bg-card px-6 py-3 font-bold text-foreground transition hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
              >
                Explore Italian Universities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* WHO WE ARE */}
      {/* ====================================================== */}

      <section className="mx-auto max-w-300 px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Left */}

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-secondary">
              Who we are
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              A mentor for every stage of your Study in Italy journey
            </h2>

            <p className="mt-6 text-lg leading-8 text-muted">
              Founded by Nitil Kumar Srivastava, European Dreams is an
              educational consulting service focused on helping students
              understand and successfully navigate the process of studying in
              Italy.
            </p>

            <p className="mt-4 leading-8 text-muted">
              We combine educational content, personalised counselling and
              practical application assistance. Students receive guidance for
              profile evaluation, university selection, applications,
              pre-enrolment, scholarships, student visas and preparation for
              life in Italy.
            </p>

            <div className="mt-7 space-y-4">
              {[
                "Personalised university and course recommendations",
                "Admission, pre-enrolment and document assistance",
                "Regional scholarship and student-visa guidance",
                "Pre-departure and post-arrival student support",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                    <CheckIcon />
                  </span>

                  <p className="font-semibold leading-7 text-foreground">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right mission card */}

          <div className="relative overflow-hidden rounded-4xl bg-primary p-4 text-white shadow-2xl shadow-primary/20 sm:p-5">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-32 border-white/10" />

            <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-secondary/30 blur-3xl" />

            <div className="relative">
              <div className="group relative aspect-4/3 overflow-hidden rounded-3xl">
                <Image
                  src="/images/about.jpeg"
                  alt="European Dreams Study in Italy counselling and student guidance"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-primary/50 via-transparent to-transparent" />
              </div>

              <div className="px-3 pb-4 pt-7 sm:px-5 sm:pb-5">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
                  Our mission
                </p>

                <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
                  Make studying in Italy clear, practical and achievable.
                </h2>

                <p className="mt-5 leading-8 text-white/75">
                  Our mission is to simplify university admissions and student
                  visa processes while helping every student make confident
                  academic decisions for their future in Italy.
                </p>

                <div className="mt-9 grid grid-cols-2 gap-4">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm"
                    >
                      <p className="text-2xl font-extrabold text-amber-300 sm:text-3xl">
                        {stat.value}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-white/70">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* ACHIEVEMENTS */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden border-y border-border bg-card-hover/40 py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

        <div className="relative mx-auto max-w-300 px-5 sm:px-6 lg:px-8">
          {/* Heading */}

          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-4 py-2">
              <span className="text-secondary">
                <TrophyIcon />
              </span>

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-secondary sm:text-sm">
                Recognition & Milestones
              </span>
            </div>

            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              A journey recognised
              <span className="text-primary"> beyond borders</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              European Dreams continues to grow through educational content,
              student guidance and a community built around making Study in
              Italy easier to understand.
            </p>
          </div>

          {/* Achievement cards */}

          <div className="mt-12 grid gap-7 lg:grid-cols-2">
            {achievements.map((achievement, index) => (
              <article
                key={achievement.title}
                className="group relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm transition duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10"
              >
                {/* Image */}

                <div className="relative aspect-[16/10] overflow-hidden bg-background">
                  <Image
                    src={achievement.image}
                    alt={achievement.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Badge */}

                  <div className="absolute left-5 top-5">
                    <span className="inline-flex items-center rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md">
                      {achievement.badge}
                    </span>
                  </div>

                  {/* Number */}

                  <div className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-sm font-extrabold text-white backdrop-blur-md">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>

                {/* Content */}

                <div className="relative p-6 sm:p-8">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

                  <div className="relative">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-secondary">
                      {achievement.subtitle}
                    </p>

                    <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                      {achievement.title}
                    </h3>

                    <p className="mt-4 leading-7 text-muted">
                      {achievement.description}
                    </p>

                    <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                        <CheckIcon />
                      </span>

                      <p className="text-sm font-semibold text-foreground">
                        A milestone in the European Dreams journey
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Founder credibility strip */}

          <div className="relative mt-10 overflow-hidden rounded-[2rem] bg-primary px-6 py-8 text-white shadow-xl shadow-primary/15 sm:px-8 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border-30 border-white/10" />

            <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-secondary/25 blur-3xl" />

            <div className="relative">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
                Built through education & community
              </p>

              <h3 className="mt-3 max-w-3xl font-display text-2xl font-bold leading-tight sm:text-3xl">
                Making the Study in Italy journey easier for students and
                families.
              </h3>

              <p className="mt-3 max-w-2xl leading-7 text-white/75">
                European Dreams combines educational content, personalised
                counselling and practical admission guidance to help students
                make better-informed decisions.
              </p>
            </div>

            <div className="relative mt-6 shrink-0 lg:mt-0">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-primary transition hover:-translate-y-0.5 hover:bg-white/90"
              >
                Start Your Italy Journey
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* SUPPORT PROCESS */}
      {/* ====================================================== */}

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-300 px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-secondary">
              How we support you
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              From your first conversation to your first day in Italy
            </h2>

            <p className="mt-4 leading-7 text-muted">
              One connected guidance process keeps your university choices,
              applications, documents and important deadlines moving in the
              right direction.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {supportAreas.map((area) => (
              <article
                key={area.number}
                className="group rounded-[1.75rem] border border-border bg-card p-7 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-sm font-extrabold text-primary transition group-hover:bg-primary group-hover:text-white">
                  {area.number}
                </span>

                <h3 className="mt-6 text-xl font-bold text-foreground">
                  {area.title}
                </h3>

                <p className="mt-3 leading-7 text-muted">{area.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* VALUES */}
      {/* ====================================================== */}

      <section className="border-y border-border bg-card-hover/40 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-300 px-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-secondary">
              What guides us
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Guidance built on trust and student goals
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted">
              We believe students make better decisions when they have clear
              information, realistic expectations and the right guidance
              throughout the process.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.title}
                className="rounded-[1.75rem] border border-border bg-card p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-secondary/30 hover:shadow-xl"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary-light text-secondary">
                  <CheckIcon />
                </span>

                <h3 className="mt-5 text-xl font-bold text-foreground">
                  {value.title}
                </h3>

                <p className="mt-3 leading-7 text-muted">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* FINAL CTA */}
      {/* ====================================================== */}

      <section className="mx-auto max-w-300 px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="relative overflow-hidden rounded-4xl bg-primary px-6 py-10 text-center text-white shadow-2xl shadow-primary/20 sm:px-10 lg:px-16 lg:py-14">
          <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full border-30 border-white/10" />

          <div className="pointer-events-none absolute -bottom-28 -right-16 h-64 w-64 rounded-full bg-secondary/30 blur-3xl" />

          <div className="relative mx-auto max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
              Start your Italy journey
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Your Study in Italy dream deserves a clear next step
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/75">
              Speak with a counsellor about your profile, Italian universities,
              English-taught courses, admissions, scholarships and student visa
              preparation.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-primary transition hover:-translate-y-0.5 hover:bg-white/90"
              >
                Get Free Guidance
                <ArrowIcon />
              </Link>

              <Link
                href="/courses"
                className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
