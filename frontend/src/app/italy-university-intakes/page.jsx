import Link from "next/link";

import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

const SITE_URL = "https://www.europeandreamss.com";
const CANONICAL = `${SITE_URL}/italy-university-intakes`;

const PAGE_TITLE = "Italy University Intakes & Deadlines 2026/27 | Indian Students";
const PAGE_DESCRIPTION =
  "Verified Italy university application and Universitaly pre-enrolment deadlines for 2026/27 and 2027/28, by university, programme route and applicant type. Official sources only.";

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
  { name: "Italy University Intakes & Deadlines", href: CANONICAL },
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

const planningStages = [
  {
    stage: "University research",
    window: "Varies by university and course",
    note: "Shortlist programmes and note each one's own call, applicant categories and language requirements.",
  },
  {
    stage: "Admission and application",
    window: "Varies by university and course",
    note: "Calls can open nearly a year before the intake and run in multiple rounds — some already closed for 2026/27.",
  },
  {
    stage: "Admission result",
    window: "Varies by university and call",
    note: "Outcome dates are published per call; later calls can push results close to the intake.",
  },
  {
    stage: "Scholarship application",
    window: "Varies by scheme and year",
    note: "Each scholarship runs its own call — often earlier than admission deadlines. See our Italy scholarships guide.",
  },
  {
    stage: "Universitaly pre-enrolment",
    window: "Varies by university; national backstop 30 November 2026 for 2026/27 ordinary courses",
    note: "Defined per university for first and second-cycle courses — the institution's earlier date governs.",
  },
  {
    stage: "Visa application",
    window: "After admission and pre-enrolment; national backstop 30 November 2026 for 2026/27 ordinary courses",
    note: "Apply as early as your mission allows — this date is a final limit, never a target.",
  },
  {
    stage: "Travel and arrival",
    window: "Before your course start date",
    note: "Leave buffer for accommodation, insurance and residence-permit formalities after landing.",
  },
];

const findDeadlineSteps = [
  "Find your course and open its official university page — never start from a third-party list.",
  "Read the “How to apply” section or the official call for applications for your intake year.",
  "Check the rules for your applicant category: EU, non-EU visa-seeking, resident in Italy, or programme-specific quotas.",
  "Confirm the academic year on the call and note the deadline timezone (Italian time commonly applies).",
  "Work backward from the earliest applicable date — admission, pre-enrolment and visa each need their own buffer.",
  "Do not rely on third-party deadline lists as final authority; re-check the official page before submitting.",
];

const mistakes = [
  {
    title: "Assuming September is the only intake",
    text: "Autumn is the main cycle, but selected programmes admit for a second semester — and many do not. Check your programme, not the calendar.",
  },
  {
    title: "Assuming a January intake exists for every programme",
    text: "Second-semester entry is the exception, limited to specified programmes and universities. Politecnico di Milano, for example, restricts it to selected Engineering programmes.",
  },
  {
    title: "Confusing the admission deadline with the Universitaly deadline",
    text: "The university's application window and the pre-enrolment window are different dates on different systems. Track both.",
  },
  {
    title: "Confusing the national visa date with the university deadline",
    text: "30 November 2026 is the national final visa-submission date for 2026/27 ordinary courses — it is not any university's application deadline, and institutions may require far earlier dates.",
  },
  {
    title: "Checking an old academic-year call",
    text: "Calls, rounds and dates are reissued yearly. A 2025/26 PDF found through search can silently mislead a 2026/27 applicant.",
  },
  {
    title: "Ignoring applicant-category differences",
    text: "EU, non-EU visa-seeking and Italy-resident applicants routinely face different windows — later rounds are frequently residents-only.",
  },
  {
    title: "Waiting until the national visa deadline",
    text: "Treating the backstop as a plan leaves no room for validation, appointments or document requests. Apply at the earliest date your route allows.",
  },
];

const faqs = [
  {
    question: "When do Italian universities start?",
    answer:
      "The standard academic year generally starts in autumn, with many courses beginning around September or October. Exact start dates are set per university and programme.",
  },
  {
    question: "Is September the main intake in Italy?",
    answer:
      "Yes. Autumn is the major academic cycle with the widest programme availability and the most application rounds. If you keep one intake as your primary plan, make it this one.",
  },
  {
    question: "Does Italy have a January intake?",
    answer:
      "Only for selected programmes and universities — there is no universal January or February intake. Verify second-semester availability directly on your programme's official page before planning around it.",
  },
  {
    question: "When should Indian students apply?",
    answer:
      "As early as your university's first applicable round allows. Visa-seeking applicants need extra months for pre-enrolment, validation and the consular process, so early rounds matter more for Indian students than the final deadlines suggest.",
  },
  {
    question: "What is the Italy university deadline for 2026/27?",
    answer:
      "There is no single deadline — each university and programme sets its own, and several 2026/27 rounds have already closed. Check the official call for your exact course and applicant category.",
  },
  {
    question: "Is 30 November 2026 the university application deadline?",
    answer:
      "No. It is the national final visa-submission date for 2026/27 ordinary degree courses under the current procedure — not any university's application deadline, and institutions may require far earlier dates.",
  },
  {
    question: "When should I complete Universitaly?",
    answer:
      "Within your university's own pre-enrolment window, which it defines for first and second-cycle courses. Complete it as early as that window allows rather than waiting for the national backstop.",
  },
  {
    question: "Can university deadlines be earlier than the national visa deadline?",
    answer:
      "Yes — routinely. The national date never replaces institution dates, and later application rounds are often restricted to EU or Italy-resident applicants.",
  },
  {
    question: "Are Bachelor and Master deadlines different?",
    answer:
      "They can be. Universities frequently run separate calls and rounds for undergraduate, postgraduate and single-cycle programmes — Turin, for example, opened postgraduate and undergraduate windows on different dates for 2026/27. Check the call for your level.",
  },
  {
    question: "How do I check the exact deadline?",
    answer:
      "Find the course, open its official university page, read the “How to apply” call for your intake year, confirm your applicant category and the deadline timezone, and never treat third-party lists as final authority.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const plannerLinks = [
  {
    href: "/study-in-italy",
    title: "Study in Italy guide",
    text: "Universities, courses, costs and the full journey from India.",
  },
  {
    href: "/italy-university-admission",
    title: "Italy university admission",
    text: "Requirements and the academic application stage.",
  },
  {
    href: "/universitaly",
    title: "Universitaly pre-enrolment",
    text: "The official portal stage after admission.",
  },
  {
    href: "/italy-student-visa",
    title: "Italy student visa",
    text: "The consular stage and its timelines.",
  },
  {
    href: "/italy-scholarships",
    title: "Italy scholarships",
    text: "Funding calls with their own earlier deadlines.",
  },
  {
    href: "/cost-of-studying-in-italy",
    title: "Cost of studying in Italy",
    text: "Tuition bands, living costs and fee verification.",
  },
  {
    href: "/universities",
    title: "Universities in Italy",
    text: "Compare institutions and their official calls.",
  },
  {
    href: "/courses",
    title: "Courses in Italy",
    text: "Shortlist programmes, then check each deadline.",
  },
];

export default function ItalyUniversityIntakesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={webPageSchema} />
      <JsonLd data={faqSchema} />
      <main className="min-h-screen bg-[var(--background)]">
        {/* 1. Hero */}
        <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--hero-gradient)]">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--primary)]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[var(--primary)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="mt-7 max-w-3xl">
              <span className="mb-4 inline-flex rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-1.5 text-sm font-semibold text-[var(--primary)]">
                2026/27 intakes and deadlines
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
                Italy University Intakes & Deadlines for Indian Students
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
                Most Italian degree programmes follow an autumn academic
                cycle — but application windows vary significantly by
                university, programme and applicant status. This guide maps
                the September and February intakes, the 2026/27 timelines
                and how to pin down your exact deadline.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <CtaButton href="/universities">Explore Universities</CtaButton>
                <CtaButton href="/italy-university-admission" variant="secondary">
                  Admission Guide
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
              Three different clocks — do not mix them
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
              Italy has no universal application deadline. National visa
              dates, university admission windows, programme-specific calls
              and scholarship deadlines are four separate clocks — this page
              labels each one, and all dated examples belong to the 2026/27
              editions linked throughout. Annual procedures can be updated,
              so re-verify the current call before acting.
            </p>
          </div>
        </section>

        {/* 3. Intake overview */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="The big picture"
            title="Italy University Intake Overview"
            intro="One dominant intake, one limited second window — and availability decided programme by programme."
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Main autumn intake
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                The standard academic year generally starts in autumn, and
                the great majority of Bachelor&apos;s, Master&apos;s and
                single-cycle places are offered for this cycle, with several
                application rounds at many universities.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Second-semester intake where offered
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                A smaller number of programmes admit for a February start.
                Because places depend on remaining capacity and school-level
                decisions, many universities and courses offer no second
                intake at all.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6 sm:col-span-2">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Why January is not universal
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Second-semester entry exists only where a university
                explicitly opens it — typically for specified programmes,
                sometimes only where places remain. Never assume a February
                option exists for your course; verify it on the
                programme&apos;s official page first.
              </p>
            </article>
          </div>
        </section>

        {/* 4. September intake */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Main cycle"
              title="September Intake in Italy"
              intro="The cycle that carries most places, most rounds and most visa-seeking applicants."
            />
            <div className="mx-auto mt-10 max-w-3xl space-y-4 text-sm leading-6 text-[var(--muted-foreground)]">
              <p className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                Many courses start around September or October, but
                applications can open months earlier — some universities run
                first rounds from the preceding autumn. For 2026/27, several
                early rounds for visa-seeking applicants have already closed,
                which is why starting with the current call matters more
                than starting with the intake month.
              </p>
              <p className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                Visa applicants should apply in the earliest round open to
                them: admission, Universitaly pre-enrolment with university
                validation, and the consular process must all complete
                before courses begin. The university examples further down
                show how early these windows really open.
              </p>
            </div>
          </div>
        </section>

        {/* 5. February intake */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Limited window"
            title="January and February Intake in Italy"
            intro="Real for some programmes, non-existent for most. A verified example shows the pattern."
          />
          <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
            <h3 className="text-xl font-bold text-[var(--foreground)]">
              Verified example: Politecnico di Milano 2026/27
            </h3>
            <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
              Politecnico di Milano&apos;s official 2026/27 deadlines
              confirm the pattern precisely: the first semester begins in
              September and the second in February; Architecture and Design
              programmes admit in the first semester only, while Engineering
              programmes admit in both — except Architectural Engineering,
              Building Engineering for Sustainability and Management of
              Built Environment. For foreign qualifications, the February
              2027 Engineering intake ran a single general call from 18 May
              to 18 June 2026. See the{" "}
              <OfficialLink href="https://www.polimi.it/en/prospective-students/how-to-apply/admission-to-laurea-magistrale/foreign-qualification/deadlines">
                official Politecnico deadlines page
              </OfficialLink>
              .
            </p>
            <h3 className="mt-6 text-xl font-bold text-[var(--foreground)]">
              What this means for you
            </h3>
            <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
              Treat February entry as programme-specific good fortune, not a
              fallback plan: check availability, eligible programmes and the
              (usually single, early) call on your own programme page, and
              keep September as the primary plan.
            </p>
          </div>
        </section>

        {/* 6. 2026/27 timeline table */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Plan backwards"
              title="Italy Admission Timeline 2026/27"
              intro="Seven stages with deliberately non-fixed windows — plus the one national date that frames them."
            />
            <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)]">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th scope="col" className="px-5 py-4 font-bold text-[var(--foreground)]">
                      Stage
                    </th>
                    <th scope="col" className="px-5 py-4 font-bold text-[var(--foreground)]">
                      Typical planning window
                    </th>
                    <th scope="col" className="px-5 py-4 font-bold text-[var(--foreground)]">
                      Important note
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {planningStages.map((row) => (
                    <tr key={row.stage}>
                      <th scope="row" className="px-5 py-4 font-semibold text-[var(--foreground)]">
                        {row.stage}
                      </th>
                      <td className="px-5 py-4 text-[var(--muted-foreground)]">
                        {row.window}
                      </td>
                      <td className="px-5 py-4 text-[var(--muted-foreground)]">
                        {row.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 7. National visa date */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="National backstop"
            title="Italy Student Visa Deadline 2026/27"
            intro="One clearly labelled national date — and what it is not."
          />
          <div className="mx-auto mt-10 max-w-3xl space-y-4 text-sm leading-6 text-[var(--muted-foreground)]">
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              Under the current national procedure, the final
              visa-submission date for ordinary degree courses in 2026/27 is{" "}
              <strong className="text-[var(--foreground)]">
                30 November 2026
              </strong>
              . This is the last date by which visa applications for these
              courses may be submitted — a ceiling set nationally, confirmed
              in the official procedure documents.
            </p>
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              It is <strong className="text-[var(--foreground)]">not</strong>{" "}
              a university application deadline, and universities may
              require far earlier dates for admission, pre-enrolment and
              validation. Plan around your institution&apos;s dates; treat
              the national date as the point beyond which nothing can be
              filed.
            </p>
          </div>
        </section>

        {/* 8. 2027/28 */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Look ahead"
              title="Planning for the 2027/28 Intake"
              intro="Early orientation for next-year planners — not a substitute for the coming calls."
            />
            <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 text-sm leading-6 text-[var(--muted-foreground)]">
              <p>
                The corresponding national visa backstop currently published
                for 2027/28 ordinary degree courses is{" "}
                <strong className="text-[var(--foreground)]">
                  31 October 2027
                </strong>
                . University-specific deadlines for that year can be earlier
                and are not yet all published; annual procedures can be
                updated, so confirm the current edition before building
                plans on this date.
              </p>
            </div>
          </div>
        </section>

        {/* 9. University examples — verified tracker */}
        <section
          id="deadlines"
          className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
        >
          <SectionHeading
            eyebrow="Verified tracker"
            title="Verified Application & Universitaly Deadline Tracker — 2026/27"
            intro="Official sources only. Dates vary by university, programme route, degree level and applicant type. Each row separates the application window from Universitaly and national visa timing where relevant."
          />
          <div className="mx-auto mt-10 max-w-6xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                    <th scope="col" className="px-4 py-4 font-bold text-[var(--foreground)]">
                      University
                    </th>
                    <th scope="col" className="px-4 py-4 font-bold text-[var(--foreground)]">
                      Degree / Route
                    </th>
                    <th scope="col" className="px-4 py-4 font-bold text-[var(--foreground)]">
                      Applicant Type
                    </th>
                    <th scope="col" className="px-4 py-4 font-bold text-[var(--foreground)]">
                      Intake
                    </th>
                    <th scope="col" className="px-4 py-4 font-bold text-[var(--foreground)]">
                      Application Window
                    </th>
                    <th scope="col" className="px-4 py-4 font-bold text-[var(--foreground)]">
                      Universitaly Deadline
                    </th>
                    <th scope="col" className="px-4 py-4 font-bold text-[var(--foreground)]">
                      Visa Ceiling
                    </th>
                    <th scope="col" className="px-4 py-4 font-bold text-[var(--foreground)]">
                      Official Source
                    </th>
                    <th scope="col" className="px-4 py-4 font-bold text-[var(--foreground)]">
                      Last Verified
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <tr>
                    <th scope="row" className="px-4 py-4 font-semibold text-[var(--foreground)]">
                      Politecnico di Milano
                    </th>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Master&apos;s / foreign qualification — Engineering
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Non-EU / visa-seeking where applicable
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Fall 2026 and Spring 2027 Engineering
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      1 Oct–1 Dec 2025 and 13 Jan–26 Feb 2026 (Fall 2026);
                      18 May–18 Jun 2026 for Feb 2027 Engineering. Second
                      semester Engineering only, with named programme exclusions.
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Per call; national ceiling 30 Nov 2026 applies
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      30 Nov 2026 (national ceiling, not university deadline)
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      <OfficialLink href="https://www.polimi.it/en/prospective-students/how-to-apply/admission-to-laurea-magistrale/foreign-qualification/deadlines">
                        Official dates
                      </OfficialLink>
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Verified Sep 2026
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-4 font-semibold text-[var(--foreground)]">
                      University of Padua
                    </th>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      English-taught — unlimited vs limited-place
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Non-EU abroad (limited); All where unlimited
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Fall 2026
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Unlimited Call One 2 Nov 2025–2 Feb 2026; Call Two 2 Mar–2
                      May 2026; limited, non-EU abroad 7 Jan–7 Mar 2026. Later
                      calls EU/Italy-resident only.
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Per call; national ceiling 30 Nov 2026
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      30 Nov 2026 (national ceiling)
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      <OfficialLink href="https://www.unipd.it/en/studiare-inglese-come-fare-domanda">
                        Official dates
                      </OfficialLink>
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Verified Sep 2026
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-4 font-semibold text-[var(--foreground)]">
                      Sapienza University of Rome
                    </th>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      English-taught — pre-selection then call
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Non-EU visa-seeking; EU/equivalent separate
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Fall 2026
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Non-EU pre-selection 22 Dec 2025–15 May 2026.
                      Pre-selection alone does not enrol; programme call completes
                      admission.
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      By 30 Jun 2026 (non-EU); by 31 Jul 2026 (EU/equivalent)
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      30 Nov 2026 (national ceiling)
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      <OfficialLink href="https://www.uniroma1.it/en/en/admissions">
                        Official dates
                      </OfficialLink>
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Verified Sep 2026
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-4 font-semibold text-[var(--foreground)]">
                      University of Turin — Postgraduate
                    </th>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Postgraduate (Master&apos;s)
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      All; later calls Italians/EU/residents only
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Fall 2026
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      25 Nov 2025–29 Jan 2026
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      By 15 Jul 2026
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      30 Nov 2026 (national ceiling)
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      <OfficialLink href="https://www.en.unito.it/studying-unito/international-degree-seeking-students/application-international-students">
                        Official dates
                      </OfficialLink>
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Verified Sep 2026
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-4 font-semibold text-[var(--foreground)]">
                      University of Turin — Undergraduate / 5–6 year
                    </th>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Undergraduate / 5–6 year single-cycle
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      All; later calls Italians/EU/residents only
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Fall 2026
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      19 Feb–15 Apr 2026
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      By 15 Jul 2026
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      30 Nov 2026 (national ceiling)
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      <OfficialLink href="https://www.en.unito.it/studying-unito/international-degree-seeking-students/application-international-students">
                        Official dates
                      </OfficialLink>
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Verified Sep 2026
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-4 font-semibold text-[var(--foreground)]">
                      University of Genoa
                    </th>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Multiple degree levels (as per official deadlines page)
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Non-EU visa-seeking: 26 Nov 2025–20 Mar 2026 pre-evaluation;
                      Resident: 9 Apr–28 Aug / 25 Sep 2026
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Fall 2026
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Pre-evaluation 26 Nov 2025–20 Mar 2026 (visa); 9 Apr–28
                      Aug / 25 Sep 2026 (resident, level-dependent)
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Visa request 4 May–19 Jun 2026; integration response by
                      31 Jul 2026
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      30 Nov 2026 (national ceiling); arrival by 25 Jan 2027
                      per call
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      <OfficialLink href="https://unige.it/en/internazionale/iscrizioni-internazionali/scadenze">
                        Official dates
                      </OfficialLink>
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Verified Sep 2026
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-4 font-semibold text-[var(--foreground)]">
                      University of Pisa
                    </th>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Multiple degree levels
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Non-EU visa applicants
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Fall 2026
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Per call; limited-access may be earlier
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      By 30 Sep 2026
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Visas only issued by 30 Nov 2026 per Pisa page
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      <OfficialLink href="https://www.unipi.it/en/education/registration/enrolment-and-registration/enrolment-for-international-students/pre-registration-on-universitaly">
                        Official dates
                      </OfficialLink>
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Verified Sep 2026
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-4 font-semibold text-[var(--foreground)]">
                      University of Macerata
                    </th>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Multiple degree levels
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Non-EU visa-seeking
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Fall 2026
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Per call
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Pre-enrol 29 Jul 2026 extended; integration 31 Aug 2026
                      where applicable
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      30 Nov 2026 (national ceiling)
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      <OfficialLink href="https://apply.unimc.it/en_GB/news/new/93-pre-enrolment-procedure-visa-seeking-students-now-open-ay-20262027-extended-deadline-july-29-2026">
                        Official dates
                      </OfficialLink>
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      Verified Sep 2026
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="border-t border-[var(--border)] px-5 py-4 text-xs leading-5 text-[var(--muted-foreground)]">
              All rows are 2026/27 examples verified on the linked official
              pages. The national date of 30 Nov 2026 is a visa-related ceiling
              for 2026/27 ordinary courses, not a university application
              deadline. Your course, level and applicant category can carry
              different dates — always read the current call.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6">
            <h3 className="font-bold text-[var(--foreground)]">
              How to read this tracker
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--muted-foreground)]">
              <li>
                <span className="font-semibold text-[var(--foreground)]">
                  Application deadline ≠ Universitaly deadline
                </span>{" "}
                — the university call defines each separately.
              </li>
              <li>
                <span className="font-semibold text-[var(--foreground)]">
                  Universitaly deadline ≠ visa issuance guarantee
                </span>{" "}
                — validation allows you to apply for the visa; issuance is by
                the consulate.
              </li>
              <li>
                EU / Italy-resident / non-EU visa applicants can have different
                windows — later calls are often EU/resident only, as shown above.
              </li>
              <li>
                Degree and programme route change the deadline — free-access vs
                programmed-access (limited places) and Bachelor vs Master vs
                single-cycle matter.
              </li>
              <li>
                Limited-access programmes can have earlier or test-linked
                deadlines — always check the call, not this tracker.
              </li>
              <li>
                Always verify the linked official call before applying — dates
                can change.
              </li>
            </ul>
          </div>
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6">
            <h3 className="font-bold text-[var(--foreground)]">
              Universitaly Deadlines for Non-EU Students
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
              These verified examples show why the national visa ceiling should
              not be treated as a university-specific Universitaly deadline:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--muted-foreground)]">
              <li>Turin: by 15 Jul 2026</li>
              <li>Milan: by 31 Jul 2026</li>
              <li>Macerata: 29 Jul 2026 extended (integration 31 Aug where applicable)</li>
              <li>Roma Tre: by 15 Sep 2026</li>
              <li>Pisa: by 30 Sep 2026; visas only issued by 30 Nov 2026</li>
            </ul>
            <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
              For the full pre-enrolment steps, see our{" "}
              <Link
                href="/universitaly"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Universitaly pre-enrolment guide
              </Link>
              .
            </p>
          </div>
        </section>

        {/* 10. Indian timeline */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Your sequence"
              title="Italy Admission Timeline for Indian Students"
              intro="The practical order of operations, with the guides for each stage."
            />
            <ol className="mx-auto mt-10 max-w-3xl space-y-4">
              {[
                "Research universities and courses, noting each call and applicant category.",
                "Check eligibility against the programme's official requirements.",
                "Submit the university application in the earliest round open to visa-seeking applicants.",
                "Secure the admission or eligibility outcome the process requires.",
                "File scholarship applications where applicable — many close before admission does.",
                "Complete Universitaly pre-enrolment within the university's window.",
                "Apply for the visa with admission, validated pre-enrolment and supporting evidence.",
                "Travel and arrive with buffer for housing, insurance and residence-permit steps.",
              ].map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
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
              Stage guides:{" "}
              <Link href="/italy-university-admission" className="font-semibold text-[var(--primary)] hover:underline">
                admission
              </Link>
              {" · "}
              <Link href="/universitaly" className="font-semibold text-[var(--primary)] hover:underline">
                Universitaly
              </Link>
              {" · "}
              <Link href="/italy-student-visa" className="font-semibold text-[var(--primary)] hover:underline">
                student visa
              </Link>
              {" · "}
              <Link href="/italy-scholarships" className="font-semibold text-[var(--primary)] hover:underline">
                scholarships
              </Link>
              .
            </p>
          </div>
        </section>

        {/* 11. How to find exact deadline */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Verify before you apply"
            title="How to Find Your Exact Deadline"
            intro="Five checks that beat any deadline list — plus the rule about lists."
          />
          <ol className="mx-auto mt-10 max-w-3xl space-y-4">
            {findDeadlineSteps.map((step, index) => (
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
            Course-level starting points: the{" "}
            <OfficialLink href="https://www.universitaly.it/en/studenti-stranieri">
              Universitaly foreign-students page
            </OfficialLink>
            ,{" "}
            <OfficialLink href="https://www.universitaly.it/it/first-steps">
              first-steps guidance
            </OfficialLink>
            , the{" "}
            <OfficialLink href="https://studyinitaly.esteri.it/static/ProcedureIscrizione">
              Study in Italy enrolment procedures
            </OfficialLink>{" "}
            and the{" "}
            <OfficialLink href="https://www.mur.gov.it/it/aree-tematiche/universita/sportello-digitale-unico/submitting-initial-application-admission-italian">
              MUR admission guidance
            </OfficialLink>
            .
          </p>
        </section>

        {/* 12. Mistakes */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Avoid these"
              title="Common Deadline Mistakes"
            />
            <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
              {mistakes.map((item) => (
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

        {/* 13. FAQ */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="FAQ"
            title="Italy Intakes & Deadlines: FAQs"
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
        </section>

        {/* 14. Keep planning + CTA */}
        <section className="border-t border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Keep planning"
              title="Plan the Rest of Your Italy Journey"
              intro="Deadlines are the frame — admission, funding and the visa fill it."
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
            <div className="mt-12 rounded-3xl bg-[var(--foreground)] px-6 py-10 text-center text-[var(--background)] sm:px-10">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Worried about missing a deadline?
              </h2>
              <p className="mx-auto mt-3 max-w-2xl opacity-80">
                Get personalised guidance on intakes, calls, applications and
                the Italy student visa — mapped to your profile.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-4">
                <CtaButton href="/contact">Book a free consultation</CtaButton>
                <CtaButton href="/study-in-italy" variant="secondary">
                  Back to the Study in Italy guide
                </CtaButton>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
