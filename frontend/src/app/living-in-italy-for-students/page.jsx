import Link from "next/link";

import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

const SITE_URL = "https://www.europeandreamss.com";
const CANONICAL = `${SITE_URL}/living-in-italy-for-students`;

const PAGE_TITLE = "Living in Italy for Students | Accommodation, Costs & Student Life";
const PAGE_DESCRIPTION =
  "Living in Italy for international and Indian students: accommodation, living costs, transport, healthcare, part-time work and arrival essentials.";

export const metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: CANONICAL,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: CANONICAL,
    siteName: "European Dreams",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

const breadcrumbItems = [
  { name: "Home", href: `${SITE_URL}/` },
  { name: "Study in Italy", href: `${SITE_URL}/study-in-italy` },
  { name: "Living in Italy for Students", href: CANONICAL },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": `${CANONICAL}#breadcrumb`,
  itemListElement: breadcrumbItems.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.href,
  })),
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${CANONICAL}#webpage`,
  url: CANONICAL,
  name: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  isPartOf: { "@id": `${SITE_URL}/#website` },
  breadcrumb: { "@id": `${CANONICAL}#breadcrumb` },
  inLanguage: "en-IN",
};

function SectionHeading({ eyebrow, title, intro }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && (
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-4 leading-7 text-[var(--muted-foreground)]">{intro}</p>
      )}
    </div>
  );
}

function CtaButton({ href, children, variant = "primary" }) {
  const styles =
    variant === "primary"
      ? "bg-[var(--primary)] text-white hover:opacity-90"
      : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--primary)]";
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center rounded-xl px-7 py-3 font-bold transition ${styles}`}
    >
      {children}
    </Link>
  );
}

function OfficialLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-[var(--primary)] hover:underline"
    >
      {children}
    </a>
  );
}

const faqs = [
  {
    question: "Is Italy good for international students?",
    answer:
      "Italy combines historic public universities, growing English-taught provision and lively university cities with international student communities. Whether it suits you depends on your programme, budget and preferences — compare real options rather than deciding on reputation alone.",
  },
  {
    question: "How do international students find accommodation in Italy?",
    answer:
      "Start with your university's housing or student services office and its official accommodation portals, check regional right-to-study opportunities, and only then compare verified private options — confirming the contract, commute and what is included before paying anything.",
  },
  {
    question: "How much does it cost to live in Italy as a student?",
    answer:
      "Current official guidance puts typical student spending at roughly €700–€1,100 per month depending on the city, with accommodation as the largest part. Actual costs vary by city, housing type and lifestyle — see our cost of studying in Italy guide.",
  },
  {
    question: "Can Indian students work while studying in Italy?",
    answer:
      "Work eligibility depends on immigration status and the rules in force — European Commission guidance notes non-EU students may work up to 20 hours per week with a valid residence permit. Verify the current rules before accepting any employment, and never budget around assumed earnings.",
  },
  {
    question: "Do international students need to know Italian?",
    answer:
      "Not automatically for English-taught programmes, but some universities add their own conditions — and basic Italian helps enormously with housing, shops, transport, healthcare and administration. Check your call for the requirement; learn the language for daily life.",
  },
  {
    question: "What should I do after arriving in Italy?",
    answer:
      "Reach your accommodation, contact the university international office, complete residence and permit steps within their legal deadlines, arrange healthcare under the applicable route, and settle transport, SIM, campus and orientation. The first-week checklist on this page walks through it.",
  },
  {
    question: "What is permesso di soggiorno?",
    answer:
      "The residence permit non-EU students apply for after arrival. For students arriving with a type D national study visa for university enrolment, Universitaly states the permit-of-stay application appointment must be initiated within 8 working days of arrival — follow current official and Questura instructions exactly.",
  },
  {
    question: "Can students live in university accommodation?",
    answer:
      "Often, subject to availability. Many institutions provide renting information, manage housing facilities or run residences, dorms and colleges — but places are limited and never guaranteed, so apply through official channels early and keep a backup plan.",
  },
  {
    question: "How do students get healthcare in Italy?",
    answer:
      "Arrangements depend on student status and eligibility: health insurance is required for international students, with private cover or registration with the Italian National Health Service as the routes for non-EU students per current official guidance. Confirm the applicable route before departure.",
  },
  {
    question: "What documents should I arrange after arriving?",
    answer:
      "Keep your passport, visa, enrolment proof and accommodation documentation in order; obtain the codice fiscale where applicable; complete university registration; and start the residence-permit process within its legal deadline. Requirements vary, so follow your university and the current official instructions.",
  },
];

const plannerLinks = [
  {
    href: "/study-in-italy",
    title: "Study in Italy guide",
    text: "Universities, admission, costs and the full journey from India.",
  },
  {
    href: "/italy-university-admission",
    title: "Italy university admission",
    text: "Requirements and the academic application stage.",
  },
  {
    href: "/italy-student-visa",
    title: "Italy student visa",
    text: "The consular stage before you travel.",
  },
  {
    href: "/universitaly",
    title: "Universitaly pre-enrolment",
    text: "The official portal stage after admission.",
  },
  {
    href: "/cost-of-studying-in-italy",
    title: "Cost of studying in Italy",
    text: "Tuition bands, living costs and fee verification.",
  },
  {
    href: "/italy-scholarships",
    title: "Italy scholarships",
    text: "Funding routes with their own calls and deadlines.",
  },
  {
    href: "/italy-university-intakes",
    title: "Italy university intakes",
    text: "September and February intakes and 2026/27 deadlines.",
  },
  {
    href: "/english-taught-courses-in-italy",
    title: "English-taught courses",
    text: "Find and verify programmes taught in English.",
  },
  {
    href: "/universities",
    title: "Universities in Italy",
    text: "Compare institutions and their student services.",
  },
  {
    href: "/courses",
    title: "Courses in Italy",
    text: "Shortlist programmes before planning the move.",
  },
];

export default function LivingInItalyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={webPageSchema} />
      <main className="min-h-screen bg-[var(--background)]">
        {/* 1. Hero */}
        <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--hero-gradient)]">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--primary)]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[var(--primary)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="mt-7 max-w-3xl">
              <span className="mb-4 inline-flex rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-1.5 text-sm font-semibold text-[var(--primary)]">
                2026/27 arrival and living guide
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
                Living in Italy for Students: Accommodation, Costs & Student Life
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
                Moving to Italy for university means planning accommodation,
                monthly expenses, transport, healthcare, documents, university
                services, student life and — where legally applicable —
                part-time work. This guide maps all of it, before and after
                you land.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <CtaButton href="/cost-of-studying-in-italy">
                  Cost Guide
                </CtaButton>
                <CtaButton href="/italy-student-visa" variant="secondary">
                  Student Visa Guide
                </CtaButton>
                <CtaButton href="/contact" variant="secondary">
                  Get Free Consultation
                </CtaButton>
              </div>
            </div>
          </div>
        </section>

        {/* Currency of information */}
        <section className="border-b border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              Last updated: September 2026
            </p>
            <h2 className="mt-2 text-lg font-bold text-[var(--foreground)]">
              Rules vary — verify locally
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
              Accommodation, university services, healthcare procedures,
              local transport and administrative requirements can vary by
              city, institution and student status. Verify current
              requirements with the university and official Italian
              authorities. This page is guidance, not legal advice.
            </p>
          </div>
        </section>

        {/* 4. Student life */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Daily life"
            title="What Is Student Life Like in Italy?"
            intro="University-centred days inside historic, walkable cities — with an adjustment curve worth respecting."
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                University-based life
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Lectures, libraries, student associations and university
                events anchor the week, with international student services
                helping newcomers navigate enrolment, housing leads and
                orientation.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                City life and culture
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Historic centres, local festivals and regional food shape
                weekends, and student cards commonly unlock transport,
                museum and cultural discounts. Each university city has its
                own rhythm and price level.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Academic calendar
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                The year generally starts in autumn with examination
                sessions spread across winter and summer. Confirm your
                programme&apos;s exact calendar — single-cycle and
                regulated degrees can differ.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Italian still helps
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Even on English-taught programmes, Universitaly&apos;s
                foreign-student guidance highlights Italian for integration
                — landlords, shops, transport staff and clinics do not all
                operate in English. Basic Italian pays off from week one.
              </p>
            </article>
          </div>
        </section>

        {/* 5. Accommodation */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Housing"
              title="Accommodation in Italy for Students"
              intro="The first thing to secure and the hardest to fix late. Official channels first."
            />
            <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  University accommodation
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Many institutions publish renting information, manage
                  housing facilities or run residences, dorms, guestrooms
                  and colleges. These can be more affordable than the
                  private market in some cities — but places are limited, so
                  availability is never promised.
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Shared and private apartments
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Shared flats are the most common student setup, with
                  single rooms, studios and whole apartments beyond that.
                  Whatever the format, verify the contract and terms, confirm
                  the distance from campus, and understand exactly which
                  utilities are included.
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Temporary arrival cover
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  If long-term housing is not confirmed before you travel,
                  arrange verified short-term cover for the first days or
                  weeks — never arrive assuming a flat will materialise.
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Payment safety
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Never pay deposits without verifying the property and the
                  provider through official or traceable channels. Keep
                  every document and payment record — you will need them
                  for administrative steps too.
                </p>
              </article>
            </div>
            <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
              Official starting points:{" "}
              <OfficialLink href="https://www.universitaly.it/en/borse-studio/alloggi">
                Universitaly accommodation
              </OfficialLink>{" "}
              and{" "}
              <OfficialLink href="https://www.universitaly.it/it/vivere-in-italia">
                living in Italy guidance
              </OfficialLink>
              .
            </p>
          </div>
        </section>

        {/* 6. How to find */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Housing search"
            title="How to Find Student Accommodation in Italy"
            intro="Six steps in the order that protects you."
          />
          <ol className="mx-auto mt-10 max-w-3xl space-y-4">
            {[
              "Check your university's housing and student services first — official channels carry the least risk.",
              "Check regional right-to-study opportunities, which can include housing support for eligible students.",
              "Use official university accommodation portals where they exist.",
              "Compare private accommodation only after verifying the contract and the provider.",
              "Confirm the location and the real commute to campus before committing.",
              "Keep all documents and payment records from day one.",
            ].map((step, index) => (
              <li
                key={step}
                className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
                  {index + 1}
                </span>
                <span className="pt-1.5 leading-6 text-[var(--foreground)]">
                  {step}
                </span>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
            Begin at the{" "}
            <OfficialLink href="https://www.universitaly.it/en/borse-studio/alloggi">
              Universitaly accommodation page
            </OfficialLink>
            .
          </p>
        </section>

        {/* 7. Cost of living */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Budget"
              title="Cost of Living in Italy for Students"
              intro="Categories, not city rent tables — actual spending varies by city, housing type and lifestyle."
            />
            <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Accommodation",
                  text: "The largest line by far; shared rooms cost less than studios, and cities differ widely.",
                },
                {
                  title: "Food and groceries",
                  text: "Cooking beats eating out; markets and canteens stretch the budget.",
                },
                {
                  title: "Transport",
                  text: "Passes and student concessions where offered; cycling where practical.",
                },
                {
                  title: "Phone and internet",
                  text: "Prepaid SIMs and home connections — compare student offers on arrival.",
                },
                {
                  title: "Study materials",
                  text: "Books, printing and supplies; libraries cover much of it.",
                },
                {
                  title: "Healthcare and insurance",
                  text: "Required cover with routes depending on status — budget the applicable option.",
                },
                {
                  title: "Personal expenses",
                  text: "Clothing, leisure and daily life — the most lifestyle-sensitive line.",
                },
                {
                  title: "Deposits and setup",
                  text: "One-off arrival costs: deposits, initial purchases and overlap months.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
                >
                  <h3 className="font-bold text-[var(--foreground)]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-[var(--muted-foreground)]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
              Official indicative ranges and fee verification live in our{" "}
              <Link
                href="/cost-of-studying-in-italy"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                cost of studying in Italy guide
              </Link>
              .
            </p>
          </div>
        </section>

        {/* 8. Transport */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Getting around"
            title="Public Transport and Getting Around Italy"
            intro="Good networks, local rules — check the operator, not a generic price."
          />
          <div className="mx-auto mt-10 max-w-3xl space-y-4 text-sm leading-6 text-[var(--muted-foreground)]">
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              Local public transport varies by city and region — buses,
              trams, metros and suburban rail in different combinations.
              Check your city&apos;s operator and any student concessions
              the university or municipality points to; no ticket price
              quoted generically here would stay correct.
            </p>
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              Walking and cycling are practical daily options in many
              university towns, while intercity rail and bus networks
              connect cities with offers that change by route and season.
              Plan from current operator information.
            </p>
          </div>
        </section>

        {/* 9. Healthcare */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Health"
              title="Healthcare for International Students in Italy"
              intro="High level only — the applicable route depends on you."
            />
            <div className="mx-auto mt-10 max-w-3xl space-y-4 text-sm leading-6 text-[var(--muted-foreground)]">
              <p className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                Healthcare arrangements depend on student status and
                eligibility. Health insurance is required for international
                students in Italy; for non-EU students the routes are
                private cover or registration with the Italian National
                Health Service, per current official guidance.
              </p>
              <p className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                Universities can point to local guidance, but confirm fees
                and registration rules with the official Italian health
                authorities and{" "}
                <OfficialLink href="https://www.universitaly.it/it/studenti-stranieri">
                  Universitaly
                </OfficialLink>{" "}
                before relying on any specific procedure — including the{" "}
                <OfficialLink href="https://www.salute.gov.it/">
                  Ministry of Health
                </OfficialLink>
                .
              </p>
            </div>
          </div>
        </section>

        {/* 10. Documents and admin */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Paperwork"
            title="Documents and Admin After Arriving in Italy"
            intro="Keep everything in order and respect the legal deadlines — this is guidance, not legal advice."
          />
          <ul className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
            {[
              {
                title: "Passport and visa",
                text: "Carry copies separately from originals; know your visa's conditions and expiry.",
              },
              {
                title: "University enrolment",
                text: "Complete enrolment steps and registration with the university within its deadlines.",
              },
              {
                title: "Codice fiscale",
                text: "The tax code used across Italian administration — obtain it where applicable to your situation.",
              },
              {
                title: "Accommodation documentation",
                text: "Contracts, receipts and proof of address feed several later procedures — keep them all.",
              },
              {
                title: "Permesso di soggiorno",
                text: "For students arriving with a type D national study visa for university enrolment, Universitaly states the permit-of-stay application appointment must be initiated within 8 working days of arrival.",
              },
              {
                title: "Local requirements",
                text: "Follow current official instructions plus your university's and Questura's guidance for anything further.",
              },
            ].map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
              >
                <h3 className="font-bold text-[var(--foreground)]">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-[var(--muted-foreground)]">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
            Official references:{" "}
            <OfficialLink href="https://www.universitaly.it/it/first-steps">
              Universitaly first steps
            </OfficialLink>
            {" · "}
            <OfficialLink href="https://studyinitaly.esteri.it/Static/InformazioniSoggiorno">
              Study in Italy stay information
            </OfficialLink>
            .
          </p>
        </section>

        {/* 11. Part-time work */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Work"
              title="Part-Time Work While Studying in Italy"
              intro="Carefully scoped: eligibility first, earnings never assumed."
            />
            <div className="mx-auto mt-10 max-w-3xl space-y-4 text-sm leading-6 text-[var(--muted-foreground)]">
              <p className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                Work eligibility depends on immigration status and the
                rules in force. European Commission guidance notes that
                non-EU students may work up to 20 hours per week with a
                valid residence permit — that scope is specific, so verify
                the current rules for your own status before accepting any
                employment.
              </p>
              <p className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                No salary figures and no job-availability claims belong in
                a plan: treat any earnings as a supplement, never as the
                funding base for tuition or rent.
              </p>
            </div>
          </div>
        </section>

        {/* 12. Italian language */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Language"
            title="Italian Language for International Students"
            intro="English-taught course, Italian-taught daily life."
          />
          <div className="mx-auto mt-10 max-w-3xl space-y-4 text-sm leading-6 text-[var(--muted-foreground)]">
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              An English-taught degree does not make every part of daily
              life English: accommodation viewings, shops, transport desks,
              clinics and counters run substantially in Italian. Language
              needs vary by programme and city.
            </p>
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              Italian is not universally mandatory for English-taught
              degrees — check your call — but learning the basics before
              and after arrival is among the highest-return preparations
              you can make. Programme-level detail is in our{" "}
              <Link
                href="/english-taught-courses-in-italy"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                English-taught courses guide
              </Link>
              .
            </p>
          </div>
        </section>

        {/* 13. Indian students */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="From India"
              title="Student Life for Indian Students in Italy"
              intro="Practical notes — no demographic claims, just preparation."
            />
            <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Food and groceries",
                  text: "Indian groceries are findable in larger cities; elsewhere, cooking familiar food depends on what you carry and source locally. Cooking beats eating out on every budget.",
                },
                {
                  title: "Communities and adjustment",
                  text: "Indian student communities exist in major university cities and ease the first months — join them early while building wider local circles too.",
                },
                {
                  title: "Weather and clothing",
                  text: "Northern winters are genuinely cold and damp; southern summers are hot. Pack and budget for the climate of your city, not a generic Italy.",
                },
                {
                  title: "Academic routine",
                  text: "Examination sessions reward steady work over last-minute bursts. Align with the local calendar from week one.",
                },
                {
                  title: "Budgeting",
                  text: "Track spending monthly against the cost framework — small leaks sink student budgets faster than big bills.",
                },
                {
                  title: "Staying connected",
                  text: "Set up home calls, banking access and document backups before departure so arrival weeks stay focused on settling.",
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
                >
                  <h3 className="font-bold text-[var(--foreground)]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-[var(--muted-foreground)]">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 14. First week */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Landing"
            title="Your First Week in Italy: Practical Checklist"
            intro="In rough order — legal deadlines first."
          />
          <ul className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
            {[
              "Reach your confirmed accommodation safely.",
              "Contact the university international office.",
              "Complete required residence and permit steps within their legal deadlines.",
              "Arrange healthcare according to the route that applies to you.",
              "Obtain or confirm local administrative documents.",
              "Activate a local SIM.",
              "Understand the public transport basics.",
              "Locate groceries and a pharmacy.",
              "Locate your campus and classrooms.",
              "Save emergency contacts.",
              "Attend university orientation.",
            ].map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-sm font-semibold leading-6 text-[var(--foreground)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* 15. First month */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Settling"
              title="Your First Month in Italy"
              intro="From surviving to settled."
            />
            <ul className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
              {[
                "Finalise enrolment with the university.",
                "Settle accommodation for the term.",
                "Establish a monthly budget and track it.",
                "Master the transport you will actually use.",
                "Join university and student services.",
                "Organise healthcare cover properly.",
                "Learn basic Italian deliberately.",
                "Build a steady academic routine.",
                "Explore the city safely, in daylight first.",
              ].map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 text-sm font-semibold leading-6 text-[var(--foreground)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 16. Mistakes */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Avoid these"
            title="Common Mistakes International Students Make"
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
            {[
              {
                title: "Booking accommodation without verification",
                text: "Unverified listings and advance deposits are the classic arrival scam. Verify property and provider first.",
              },
              {
                title: "Ignoring university housing deadlines",
                text: "Official housing has early cutoffs and limited places — late applicants inherit the private market.",
              },
              {
                title: "Assuming English is enough everywhere",
                text: "It covers the classroom, not the rental contract, the clinic or the counter.",
              },
              {
                title: "Ignoring administrative deadlines",
                text: "Permit, enrolment and registration windows are legal facts, not suggestions.",
              },
              {
                title: "Relying on outdated social media advice",
                text: "Rules, fees and portals change yearly; random videos rarely carry the current edition.",
              },
              {
                title: "Budgeting tuition only",
                text: "Living costs dominate most student budgets — plan them with the same rigour as fees.",
              },
              {
                title: "Assuming approval ends the process",
                text: "Visa and admission approvals do not complete arrival requirements — permits, registration and enrolment still await.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
              >
                <h3 className="font-bold text-[var(--foreground)]">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-[var(--muted-foreground)]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* 17. Related guides */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Keep planning"
              title="Related Study in Italy Guides"
              intro="Living well starts with the steps before arrival."
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plannerLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/40 hover:shadow-xl"
                >
                  <h3 className="text-xl font-bold text-[var(--foreground)] transition group-hover:text-[var(--primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                    {item.text}
                  </p>
                  <span className="mt-4 inline-block text-sm font-bold text-[var(--primary)]">
                    Continue
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 18. FAQ */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="FAQ"
            title="Living in Italy: Frequently Asked Questions"
          />
          <div className="mx-auto mt-10 max-w-3xl space-y-4">
            {faqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
              >
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
          <div className="mx-auto mt-12 max-w-5xl rounded-3xl bg-[var(--foreground)] px-6 py-10 text-center text-[var(--background)] sm:px-10">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Planning your move to Italy?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl opacity-80">
              Get personalised guidance on universities, housing leads,
              budgeting and the Italy student visa.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <CtaButton href="/contact">Book a free consultation</CtaButton>
              <CtaButton href="/study-in-italy" variant="secondary">
                Back to the Study in Italy guide
              </CtaButton>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
