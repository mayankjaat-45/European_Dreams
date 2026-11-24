import Link from "next/link";

import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

const SITE_URL = "https://www.europeandreamss.com";
const CANONICAL = `${SITE_URL}/italy-university-admission`;

const UNIVERSITALY_STUDENTS_URL =
  "https://www.universitaly.it/it/studenti-stranieri";

export const metadata = {
  title:
    "Italy University Admission for Indian Students | Requirements & Process",
  description:
    "Italy university admission for Indian students: eligibility, documents, application process, deadlines, English-taught courses, Universitaly and what to do after admission.",
  alternates: {
    canonical: CANONICAL,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title:
      "Italy University Admission for Indian Students | Requirements & Process",
    description:
      "Italy university admission for Indian students: eligibility, documents, application process, deadlines, English-taught courses, Universitaly and what to do after admission.",
    url: CANONICAL,
    siteName: "European Dreams",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Italy University Admission for Indian Students | Requirements & Process",
    description:
      "Italy university admission for Indian students: eligibility, documents, application process, deadlines, English-taught courses, Universitaly and what to do after admission.",
  },
};

const breadcrumbItems = [
  { name: "Home", href: `${SITE_URL}/` },
  { name: "Italy University Admission", href: CANONICAL },
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
  name: "Italy University Admission for Indian Students | Requirements & Process",
  description:
    "Guide for Indian students on Italy university admission: how admission works, requirements, Bachelor's and Master's specifics, documents, application process, deadlines and post-admission steps.",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  breadcrumb: { "@id": `${CANONICAL}#breadcrumb` },
  inLanguage: "en-IN",
};

const howItWorksSteps = [
  {
    title: "Choose your study level",
    text: "Decide between a Bachelor's, Master's or single-cycle programme based on your current qualification.",
  },
  {
    title: "Choose your course",
    text: "Match programmes to your subjects, grades, language readiness and career direction.",
  },
  {
    title: "Check eligibility",
    text: "Read the admission criteria of each shortlisted programme — they differ, sometimes substantially.",
  },
  {
    title: "Shortlist universities",
    text: "Compare a small set of universities on programme fit, not on prestige alone.",
  },
  {
    title: "Check intake and deadline",
    text: "Note the exact deadline of every programme you apply to. Deadlines are programme-specific.",
  },
  {
    title: "Prepare documents",
    text: "Collect transcripts, certificates, passport, language evidence and programme-specific items early.",
  },
  {
    title: "Submit the application",
    text: "Apply through each university's own portal or procedure before its deadline.",
  },
  {
    title: "Receive admission or pre-admission",
    text: "Universities communicate selection decisions individually and on their own timelines.",
  },
  {
    title: "Complete Universitaly where required",
    text: "Visa-seeking students generally complete pre-enrolment after admission.",
  },
  {
    title: "Continue with the visa process if applicable",
    text: "Admission unlocks the next stages: pre-enrolment validation, then the visa application.",
  },
];

const faqs = [
  {
    question: "How can Indian students apply to Italian universities?",
    answer:
      "Choose a programme, verify its eligibility and deadline, prepare documents, and submit the university's own application. After admission, visa-seeking students complete Universitaly pre-enrolment. Each university runs its own process.",
  },
  {
    question: "What are Italy university admission requirements?",
    answer:
      "Typically a relevant previous qualification, transcripts, passport, language evidence where required, and programme-specific items such as entrance tests, portfolios or statements. Exact requirements vary by university and programme.",
  },
  {
    question: "How do I apply for a Master's in Italy?",
    answer:
      "You generally need a relevant Bachelor's degree plus programme-specific prerequisites, transcripts, language evidence and supporting documents. Check the Master's admission page of each university — prerequisites differ by field.",
  },
  {
    question: "How do I apply for a Bachelor's in Italy?",
    answer:
      "You generally apply with Class 12 (or equivalent) qualification meeting the programme's subject and grade expectations, plus transcripts, passport and language evidence where required. There is no single universal eligibility rule.",
  },
  {
    question: "Do Italian universities require IELTS?",
    answer:
      "Only where the programme requires it. English-taught programmes commonly ask for English proficiency evidence, but accepted tests and minimum levels are programme-specific — some programmes accept alternatives.",
  },
  {
    question: "When should I apply to Italian universities?",
    answer:
      "As early as the programme's window allows. Deadlines vary by university, programme, intake and applicant category, and visa timelines add extra weeks — verify each programme's exact date rather than relying on a general one.",
  },
  {
    question: "What documents are required?",
    answer:
      "Common categories include qualification certificates, transcripts, passport, language evidence, CV, motivation statement, recommendation letters and programme-specific items such as portfolios or test scores — exactly as each programme specifies.",
  },
  {
    question: "What is Universitaly pre-enrolment?",
    answer:
      "A post-admission step on Italy's official university portal for students who need a visa. It is separate from the university application: first you are admitted by the university, then you pre-enrol for the university to validate.",
  },
  {
    question: "Can I apply to multiple Italian universities?",
    answer:
      "Generally yes — applications go to each university individually, so you can pursue several options in parallel. Track every deadline and document set separately, since processes differ.",
  },
  {
    question: "What happens after I receive admission?",
    answer:
      "Accept the offer per the university's instructions, complete Universitaly pre-enrolment where required, prepare the visa application, arrange accommodation and travel, and complete arrival formalities in Italy.",
  },
  {
    question: "Do all Italian universities require TOLC or CEnT-S for admission?",
    answer:
      "No. Some programmes use CISIA TOLC for selection or self-evaluation and, in specific fields, CEnT-S where the university has adopted it, while other programmes use a university-specific entrance test, interview or no test at all. Depending on the university and programme, requirements vary — always check the official programme call.",
  },
  {
    question: "Do Indian students always need a CIMEA Statement or Declaration of Value?",
    answer:
      "Not for every application. Depending on the university and course, some institutions accept a CIMEA Statement of Comparability or Verification for foreign qualifications, others request a Declaration of Value from the competent Italian mission, and some require neither. Confirm what your specific university requires; for detailed DOV and CIMEA guidance see the Italy student visa guide.",
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

export default function ItalyUniversityAdmissionPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={webPageSchema} />
      <JsonLd data={faqSchema} />
      <main className="min-h-screen bg-[var(--background)]">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--hero-gradient)]">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--primary)]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[var(--primary)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="mt-7 max-w-3xl">
              <span className="mb-4 inline-flex rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-1.5 text-sm font-semibold text-[var(--primary)]">
                Admission guide for Indian students
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
                Italy University Admission for Indian Students
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
                The complete university admission journey for Indian students —
                choosing a level and course, checking eligibility, preparing
                documents, applying before programme deadlines, and understanding
                what admission unlocks next.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <CtaButton href="/universities">
                  Explore Universities
                </CtaButton>
                <CtaButton href="/courses" variant="secondary">
                  Explore Courses
                </CtaButton>
                <CtaButton href="/contact" variant="secondary">
                  Free Consultation
                </CtaButton>
              </div>
            </div>
          </div>
        </section>

        {/* Source note */}
        <section className="border-b border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              Last updated: September 2026
            </p>
            <h2 className="mt-2 text-lg font-bold text-[var(--foreground)]">
              How to use this admission guide
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
              European Dreams provides guidance and support. Admission
              requirements, deadlines and fees are set by individual
              universities and programmes — always confirm them on the official
              programme page. Visa and pre-enrolment rules come from the
              competent Italian authorities and Universitaly, the Italian
              Ministry of University and Research portal (MUR — Ministero dell’Università e della Ricerca).
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="The journey"
            title="How University Admission in Italy Works"
            intro="Ten stages from choosing a level to starting the visa process. Universities decide admissions individually."
          />
          <ol className="mx-auto mt-10 max-w-3xl space-y-4">
            {howItWorksSteps.map((step, index) => (
              <li
                key={step.title}
                className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
                  {index + 1}
                </span>
                <span className="pt-1">
                  <span className="font-bold text-[var(--foreground)]">
                    {step.title}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-[var(--muted-foreground)]">
                    {step.text}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Requirements */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Eligibility"
              title="Italy University Admission Requirements"
              intro="Requirements vary by university and programme. Treat the categories below as a checklist of what to verify — never as a universal rule."
            />
            <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
              See{" "}
              <Link
                href="/study-in-italy"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                the full Study in Italy journey for Indian students
              </Link>{" "}
              for how each requirement fits into the journey from India to
              arrival.
            </p>
            <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Academic qualification",
                  text: "Class 12 (or equivalent) for Bachelor's, or a relevant Bachelor's degree for Master's — with subjects the programme expects.",
                },
                {
                  title: "Transcripts and certificates",
                  text: "Mark sheets, degree certificates and sometimes syllabus details or credential evaluation, as specified.",
                },
                {
                  title: "Passport",
                  text: "A valid passport is needed for the application and essential for everything after admission.",
                },
                {
                  title: "Language requirements",
                  text: "English or Italian proficiency evidence where the programme requires it. Tests and minimum levels are programme-specific.",
                },
                {
                  title: "Entrance tests where applicable",
                  text: "Some programmes — notably Medicine and Architecture — use national or university entrance examinations.",
                },
                {
                  title: "Portfolio where applicable",
                  text: "Design, architecture and arts programmes commonly assess a portfolio of work.",
                },
                {
                  title: "Motivation or personal statement",
                  text: "Many programmes ask why you chose the course and how it fits your background and goals.",
                },
                {
                  title: "Recommendation letters",
                  text: "Master's programmes in particular may request academic references.",
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
                >
                  <h3 className="font-bold text-[var(--foreground)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Bachelor's */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Undergraduate"
            title="Bachelor's Admission in Italy"
            intro="Bachelor's (Laurea) programmes generally admit students completing Class 12 or equivalent — but subject expectations, grade thresholds and language rules are set per programme, so there is no single universal eligibility rule."
          />
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <p className="text-sm leading-6 text-[var(--muted-foreground)]">
              Check whether your stream covers the programme&apos;s expected
              subjects, whether an entrance or language test applies, and what
              the exact deadline is. Open-access and limited-access
              (programmed-number) courses follow different selection routes.{" "}
              <Link
                href="/courses"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Browse Bachelor&apos;s courses
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Master's */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Postgraduate"
              title="Master's Admission in Italy"
              intro="Master's (Laurea Magistrale) admission centres on the relevance of your Bachelor's background plus programme-specific prerequisites."
            />
            <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Relevant Bachelor's qualification",
                  text: "Programmes expect a Bachelor's in a related field, sometimes with minimum credits in specific subjects.",
                },
                {
                  title: "Academic background review",
                  text: "Many universities pre-evaluate transcripts before formal application — use pre-evaluation where offered.",
                },
                {
                  title: "Programme-specific prerequisites",
                  text: "Bridge requirements, interviews or tests may apply for competitive or specialised Master's courses.",
                },
                {
                  title: "Language and documents",
                  text: "Language evidence plus transcripts, CV, motivation statement and references, exactly as listed.",
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
                >
                  <h3 className="font-bold text-[var(--foreground)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
            <div className="mt-8 text-center">
              <CtaButton href="/courses">
                Browse Master&apos;s courses
              </CtaButton>
            </div>
          </div>
        </section>

        {/* Choose university */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Shortlisting"
            title="How to Choose an Italian University"
            intro="Compare on factors that affect your admission odds and your experience — not on reputation alone."
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Programme content and specialisation",
              "Language of instruction",
              "Admission criteria and selectivity",
              "Tuition fees and fee rules",
              "City, location and living costs",
              "Application deadlines per intake",
            ].map((factor) => (
              <div
                key={factor}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-center text-sm font-semibold leading-6 text-[var(--foreground)]"
              >
                {factor}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <CtaButton href="/universities">
              Compare universities in Italy
            </CtaButton>
          </div>
        </section>

        {/* Find courses */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Programmes"
              title="How to Find Courses in Italy"
              intro="Filter by level, field, language and university — then verify shortlisted options on official programme pages."
            />
            <div className="mt-8 text-center">
              <CtaButton href="/courses">Search courses in Italy</CtaButton>
            </div>
          </div>
        </section>

        {/* Documents table */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Paperwork"
            title="Documents Required for Italian University Admission"
            intro="A practical starting list. Your programme's page is the final authority — treat anything missing from it as not required, and anything on it as mandatory."
          />
          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-[var(--border)]">
                {[
                  ["Qualification certificates", "Class 12 / Bachelor's degree as applicable"],
                  ["Transcripts and mark sheets", "Full academic record, sometimes with syllabus details"],
                  ["Passport", "Valid passport for identification and later stages"],
                  ["Language evidence", "As the programme requires — test and level vary"],
                  ["CV and motivation statement", "Background, goals and fit for the programme"],
                  ["Recommendation letters", "Often for Master's applications"],
                  ["Portfolio or test scores", "Where the programme specifically requires them"],
                ].map(([doc, note]) => (
                  <tr key={doc}>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      {doc}
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      {note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Application process detail */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Step by step"
              title="Italy University Application Process"
              intro="The detailed flow most Indian applicants follow. Timelines overlap, so work the stages in parallel where possible."
            />
            <ol className="mx-auto mt-10 max-w-3xl space-y-4">
              {[
                "Research programmes and record each one's eligibility, documents, fees and deadline.",
                "Complete any pre-evaluation the university offers before the formal call opens.",
                "Prepare and attest documents, translations and language evidence in advance.",
                "Submit each university application through its own portal before the deadline.",
                "Track portal updates and respond quickly to integration or interview requests.",
                "Accept the offer following the university's enrolment instructions and timelines.",
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
          </div>
        </section>

        {/* Entrance Tests and Qualification Recognition */}
        <section
          id="entrance-tests-qualification-recognition"
          className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
        >
          <SectionHeading
            eyebrow="Tests & recognition"
            title="Entrance Tests and Qualification Recognition"
            intro="Entrance tests decide whether you are selected for a specific programme; qualification recognition describes how your previous Indian qualification compares to the Italian system. They are separate processes — whether either applies depends on the university and programme, and requirements vary by course."
          />
          <div className="mx-auto mt-10 max-w-5xl space-y-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Entrance tests — programme-dependent, not universal
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Some programmes use a test for selection or self-evaluation;
                many do not. There is no single national entrance score that
                applies to every Italian course. Always check the official call
                (bando) of the exact programme you are applying to.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                  <h4 className="font-bold text-[var(--foreground)]">
                    CISIA TOLC
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                    Some universities use CISIA TOLC for admission,
                    placement or self-assessment in fields such as
                    engineering, economics, humanities and sciences.
                    Depending on the programme, a TOLC may be mandatory,
                    optional for ranking, or not required at all.{" "}
                    <OfficialLink href="https://www.cisiaonline.it/en/">
                      CISIA official information on TOLC
                    </OfficialLink>
                    .
                  </p>
                </article>
                <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                  <h4 className="font-bold text-[var(--foreground)]">
                    CEnT-S where adopted
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                    In specific scientific and technical areas, some
                    universities have adopted CISIA CEnT-S (Test CISIA
                    for Science). Where a programme lists CEnT-S, it
                    applies only to that programme and intake — other
                    programmes may not use it.{" "}
                    <OfficialLink href="https://www.cisiaonline.it/en/">
                      CISIA official information on CEnT-S
                    </OfficialLink>
                    .
                  </p>
                </article>
                <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                  <h4 className="font-bold text-[var(--foreground)]">
                    Programme / university-specific tests
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                    Some courses — notably nationally regulated or
                    limited-access programmes such as Medicine and
                    Architecture — use national or university-run entrance
                    examinations, interviews or portfolio reviews. Other
                    open-access programmes select on documents alone.
                    Requirements vary by programme and year. Students
                    considering Medicine can also see our{" "}
                    <Link
                      href="/medicine-in-italy"
                      className="font-semibold text-[var(--primary)] hover:underline"
                    >
                      Medicine in Italy for Indian Students
                    </Link>{" "}
                    guide for 2026/27 IMAT, seat allocation and NEET/NMC
                    requirements.
                  </p>
                </article>
                <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                  <h4 className="font-bold text-[var(--foreground)]">
                    No universal test or score
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                    Do not assume a single cutoff or test applies
                    everywhere. Some programmes publish a minimum TOLC
                    or entrance-test score, others rank applicants
                    without a fixed threshold, and others do not use a
                    test at all. Verify the exact rule for each
                    programme.
                  </p>
                </article>
              </div>
            </div>
          </div>

            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
              <SectionHeading
                eyebrow="Recognition"
                title="CIMEA vs Declaration of Value (DoV) for Italian University Admission"
                intro="The university decides which recognition document (if any) it requires. Some accept CIMEA, some require DoV, some require neither. Always confirm with your specific university."
              />
              
              {/* Comparison table */}
              <div className="mx-auto mt-10 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">
                  CIMEA vs DoV — Comparison
                </h3>
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-[var(--border)]">
                    <tr>
                      <th className="px-5 py-4 font-semibold text-[var(--foreground)]" scope="row">
                        CIMEA Statement of Comparability
                      </th>
                      <td className="px-5 py-4 text-[var(--muted-foreground)]">
                        Identifies the foreign qualification level with reference to the Bologna Process cycles and European Qualifications Framework (EQF) levels.
                        <br />
                        <span className="text-xs text-[var(--muted-foreground)] block mt-1">
                          Processing times and fees vary by service. Check the current CIMEA-DiploMe platform for the most up-to-date figures before applying.
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th className="px-5 py-4 font-semibold text-[var(--foreground)]" scope="row">
                        CIMEA Statement of Verification
                      </th>
                      <td className="px-5 py-4 text-[var(--muted-foreground)]">
                        Confirms that a foreign qualification was actually awarded by an official body.
                        <br />
                        <span className="text-xs text-[var(--muted-foreground)] block mt-1">
                          CIMEA describes the qualification&apos;s level but does not guarantee formal recognition — institutional assessment by the Italian HEI is a separate step.
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th className="px-5 py-4 font-semibold text-[var(--foreground)]" scope="row">
                        Declaration of Value (DoV)
                      </th>
                      <td className="px-5 py-4 text-[var(--muted-foreground)]">
                        Describes the foreign qualification for Italian HEI admission. Issued by the Italian mission whose jurisdiction covers the state where the qualification was awarded.
                        <br />
                        <span className="text-xs text-[var(--muted-foreground)] block mt-1">
                          The DoV is free for verified study reasons; fees apply for other purposes (such as PhD or employment). The DoV is issued by the Italian mission covering the state where your qualification was awarded, not where you currently live.
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Student decision flow */}
              <div className="mx-auto mt-10 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">
                  Student Decision Flow
                </h3>
                <ol className="space-y-4">
                  <li>
                    <strong>Identify the exact university and programme.</strong> Admission requirements vary by institution and course.
                  </li>
                  <li>
                    <strong>Check the university&apos;s current admission call (bando)</strong> for the specific intake year. State explicitly which recognition document is required: CIMEA Comparability, CIMEA Verification, Declaration of Value, or neither.
                  </li>
                  <li>
                    <strong>Ask the university in writing</strong> whether CIMEA Comparability, Verification, DoV, or another document is required, and in what format.
                  </li>
                  <li>
                    <strong>Confirm the accepted document format and authentication procedure</strong> with the university before starting any process.
                  </li>
                  <li>
                    <strong>If DoV is required:</strong> Identify the competent Italian mission based on the state where your highest qualification was issued (not your current residence). Follow that mission&apos;s current DoV document checklist.
                  </li>
                  <li>
                    <strong>Keep admission-document requirements separate from visa-document requirements.</strong> Even if the university says no document is needed, the competent Italian mission&apos;s visa checklist may still require CIMEA or DoV.
                  </li>
                  <li>
                    <strong>Obtain written confirmation</strong> from the university admissions office specifying exactly which document is required and for which intake year before committing time or money.
                  </li>
                </ol>
              </div>

              {/* Indian document authentication */}
              <div className="mx-auto mt-10 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">
                  Indian Document Authentication
                </h3>
                <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                  Procedures differ across the four Indian consular missions in India. Do not claim identical procedures across all four missions.
                </p>
                <ul className="space-y-3 text-sm leading-6 text-[var(--muted-foreground)]">
                  <li>
                    <strong>State-level HRD authentication:</strong> All four missions require attestation from the competent state Higher Education Department. SDM (Sub-Divisional Magistrate) attestation is NOT acceptable at any mission.
                  </li>
                  <li>
                    <strong>MEA Apostille:</strong> All four missions require authentication with an Apostille issued by the Ministry of External Affairs, Government of India. E-Sanad acceptability varies by mission: Kolkata accepts E-Sanad for Apostille; New Delhi does not accept E-Sanad for HRD attestation and requires traditional HRD authentication. Mumbai and Bengaluru E-Sanad status is not explicitly confirmed in extracted checklists; treat as unverified.
                  </li>
                  <li>
                    <strong>Mission-specific jurisdiction:</strong> The DoV is issued by the Italian mission whose jurisdiction covers the state where the qualification was issued, not where the student currently lives. Mumbai: Chhattisgarh, Goa, Gujarat, Kerala, Madhya Pradesh, Maharashtra and related territories. New Delhi: Union Territories of Delhi and Chandigarh; Haryana, Punjab, Rajasthan, Jammu-Kashmir, Himachal Pradesh, Uttar Pradesh. Bengaluru: Karnataka, Tamil Nadu, Telangana, Andhra Pradesh, Puducherry. Kolkata: assigns jurisdiction according to state where qualification was issued, with explicit boundary list (Arunachal Pradesh, Assam, Bihar, Jharkhand, Manipur, Meghalaya, Mizoram, Nagaland, Orissa, Sikkim, Tripura, West Bengal, Andaman & Nicobar Islands & Nepal).
                  </li>
                  <li>
                    <strong>Document differences by qualification level:</strong> Requirements vary by mission and degree level. Mumbai form asks to tick &quot;School level (X/XII) o University level (Bachelor/Master) o Pre degree /Diploma o Professional formation/ Post Graduate.&quot; New Delhi: Class 12 copy (DigiLocker with Apostille acceptable); Bachelor: copy of Class 12; Master: copy of Class 12 + Bachelor. Bengaluru: similar pattern. Kolkata procedure focuses on highest qualification + transcript. Do not present one mission&apos;s checklist as a universal India-wide rule.
                  </li>
                </ul>
<p className="mt-4 text-xs leading-5 text-[var(--muted-foreground)]">
                          Full procedure details for the Bengaluru and Kolkata Italian consular missions are still being verified. Check the latest checklist of the mission responsible for your qualification&apos;s issuing state.
                        </p>
              </div>

              {/* Fees and timelines */}
              <div className="mx-auto mt-10 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">
                  Fees and Timelines
                </h3>
                <p className="text-sm leading-relaxed text-[var(--muted-foreground)] mb-6">
                  Do not state €300 as a confirmed combined fee. Treat €150 and €250 as unconfirmed unless the exact official DiploMe listing and its service scope are directly verifiable. The 60-working-day figure may only be described as an official estimate if the cited CIMEA source explicitly supports it. Do not present the 30-day urgent service or €100 surcharge as confirmed without direct official evidence. Exclude INR conversions if the underlying EUR fee is not verified. Do not include ARDI €100 pricing or India applicability until Lisbon Convention / ARDI eligibility is verified.
                </p>
                <ul className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                  <li>CIMEA Comparability service: Check the current service fee on the official CIMEA-DiploMe platform before applying.</li>
                  <li>CIMEA Comparability & Verification combined: Fees vary; check the official CIMEA-DiploMe platform for current pricing.</li>
                  <li>Standard processing: CIMEA publishes processing estimates; confirm current timelines through the official service.</li>
                  <li>Urgent processing: CIMEA&apos;s urgent service options and fees are set by the official service; confirm availability and cost through the CIMEA-DiploMe platform.</li>
                  <li>CIMEA winter closure: No new requests accepted Dec 21 2026–Jan 17 2027 — <span className="font-bold">CONFIRMED</span> (CIMEA official page explicitly states this)</li>
                  <li>Closure days not counted toward processing guarantees — <span className="font-bold">CONFIRMED</span> (CIMEA official page: &quot;closure days will not be counted as part of the period guaranteed for the release of statements&quot;)</li>
                  <li>DoV fee for verified study reasons: Free — <span className="font-bold">CONFIRMED</span> (New Delhi procedure; Mumbai, Bengaluru, Kolkata follow same policy)</li>
                  <li>DoV fees for other purposes (PhD, employment): Applicable consular fees — <span className="font-bold">CONFIRMED</span></li>
                </ul>
              </div>

              {/* Admission vs visa distinction */}
              <div className="mx-auto mt-10 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">
                  Admission vs Visa Documentation
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="font-bold text-[var(--foreground)] mb-2">University Admission</h4>
                    <ul className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                      <li>The specific university / HEI decides which document (CIMEA, DoV, or neither) is required.</li>
                      <li>Some universities require CIMEA, some require DoV, some require neither.</li>
                      <li>Written confirmation from the admissions office is strongly recommended before starting any document process.</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--foreground)] mb-2">Italian Student Visa</h4>
                    <ul className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                      <li>The competent Italian diplomatic mission governs visa documentation requirements.</li>
                      <li>The visa mission may require CIMEA or DoV even if the university says no document is needed.</li>
                      <li>The Embassy of Italy visa checklist 2026–2027 for India states CIMEA/DoV is required &quot;if required by the Italian HEI.&quot;</li>
                      <li>Do not claim that visa authorities can never request additional documents.</li>
                      <li>Do not imply that university acceptance automatically guarantees visa approval.</li>
                    </ul>
                  </div>
                </div>
<p className="mt-4 text-xs leading-5 text-[var(--muted-foreground)]">
                          Visa checklist requirements may change. Always confirm the current requirements with the Italian mission responsible for your qualification&apos;s issuing state.
                        </p>
              </div>

              {/* FAQs — integrated with existing page FAQs */}
              <div className="mx-auto mt-10 space-y-4">
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">
                  CIMEA / DoV Frequently Asked Questions
                </h3>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
                  <article>
                    <h4 className="font-bold text-[var(--foreground)]">
                      Do all Indian students need CIMEA?
                    </h4>
                    <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                      No. Some Italian universities accept neither CIMEA nor DoV. Some accept one or the other. Check the specific university&apos;s admission call.
                    </p>
                  </article>
                  <article>
                    <h4 className="font-bold text-[var(--foreground)]">
                      Is DoV compulsory for every Italian university?
                    </h4>
                    <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                      No. University admission policies vary. Some require DoV, some accept CIMEA, some accept neither.
                    </p>
                  </article>
                  <article>
                    <h4 className="font-bold text-[var(--foreground)]">
                      Are CIMEA Comparability and Verification the same?
                    </h4>
                    <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                      No. They are separate services with different purposes: Comparability identifies the qualification&apos;s Bologna/EQF level; Verification confirms the qualification was awarded by an official body. Some universities require both.
                    </p>
                  </article>
                  <article>
                    <h4 className="font-bold text-[var(--foreground)]">
                      Can a student choose CIMEA instead of DoV?
                    </h4>
                    <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                      Only if the target university accepts CIMEA in place of DoV. The university decides, not the applicant. Written confirmation required.
                    </p>
                  </article>
                  <article>
                    <h4 className="font-bold text-[var(--foreground)]">
                      Does Apostille replace CIMEA or DoV?
                    </h4>
                    <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                      No. Apostille is a authentication step for Indian documents (HRD + MEA). It does not substitute for CIMEA or DoV, which are separate qualification-information documents.
                    </p>
                  </article>
                  <article>
                    <h4 className="font-bold text-[var(--foreground)]">
                      Which Italian mission should an applicant consult?
                    </h4>
                    <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                      The mission whose jurisdiction covers the state where your highest qualification was issued, not your current residence. Mumbai, Kolkata, Bengaluru, or New Delhi — determined by degree-issuing state.
                    </p>
                  </article>
                  <article>
                    <h4 className="font-bold text-[var(--foreground)]">
                      Does admission approval guarantee visa approval?
                    </h4>
                    <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                      No. Admission and visa are separate processes. Visa approval depends on the competent mission&apos;s requirements and the applicant&apos;s overall profile.
                    </p>
                  </article>
                </div>
              </div>
            </div>
        </section>

        {/* Admission vs pre-enrolment */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Key distinction"
            title="University Admission vs Universitaly Pre-Enrolment"
            intro="These are two different stages with different decision-makers. Confusing them is one of the most common planning errors."
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                1. University admission
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                You apply to the university; the university selects you. Rules,
                tests and deadlines are the university&apos;s own, and not
                every applicant follows an identical process.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                2. Universitaly pre-enrolment
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                After admission, visa-seeking students pre-enrol on the
                official portal for university validation — the validated
                summary then supports the visa application.{" "}
                <OfficialLink href={UNIVERSITALY_STUDENTS_URL}>
                  Official Universitaly information
                </OfficialLink>
                .
              </p>
            </article>
          </div>
        </section>

        {/* Deadlines */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Timing"
              title="Italy University Admission Deadlines"
              intro="Deadlines vary significantly — there is no universal Italian application deadline. Verify the exact date for every programme."
            />
            <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Varies by university",
                  text: "Each institution sets its own admission calendar and call windows.",
                },
                {
                  title: "Varies by programme",
                  text: "Limited-access courses close earlier and follow test-linked schedules.",
                },
                {
                  title: "Varies by intake",
                  text: "Autumn and spring intakes (where offered) carry separate deadlines.",
                },
                {
                  title: "Varies by applicant category",
                  text: "Visa-seeking non-EU applicants often face earlier cutoffs than EU or resident applicants.",
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
                >
                  <h3 className="font-bold text-[var(--foreground)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
            <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
              For September and February intakes, the 2026/27 national dates
              and verified university examples, see our{" "}
              <Link
                href="/italy-university-intakes"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Italy university intakes and deadlines guide
              </Link>
              .
            </p>
          </div>
        </section>

        {/* English-taught */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Language"
            title="English-Taught Courses in Italy"
            intro="Many programmes run fully or partly in English — but language requirements stay programme-specific."
          />
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <p className="text-sm leading-6 text-[var(--muted-foreground)]">
              Filter for English-taught options, then confirm the language of
              instruction and any English-proficiency evidence for your exact
              programme and intake.{" "}
              <Link
                href="/courses"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Explore English-taught courses
              </Link>{" "}
              or read our{" "}
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

        {/* Fees + scholarships (summary, links out) */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Costs and funding"
              title="Tuition Fees and Scholarships"
              intro="Fees and funding differ per institution and student. The full picture lives in our main Italy guide."
            />
            <div className="mt-8 text-center">
              <CtaButton href="/study-in-italy">
                Costs and scholarships in the Study in Italy guide
              </CtaButton>
            </div>
            <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
              Planning your funding too? See our dedicated{" "}
              <Link
                href="/italy-scholarships"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Italy scholarships guide for Indian students
              </Link>{" "}
              — DSU, MAECI and university awards.
            </p>
            <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
              For tuition bands, living costs and how to verify your exact
              fee, see our{" "}
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

        {/* After admission */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Next stages"
            title="What Happens After Admission?"
            intro="Admission is the gateway — these stages follow it."
          />
          <ol className="mx-auto mt-10 max-w-3xl space-y-4">
            {[
              "Accept the offer and follow the university's enrolment instructions.",
              "Complete Universitaly pre-enrolment where required.",
              "Prepare and submit the visa process with mission-specific documents.",
              "Arrange accommodation, finances, insurance and travel.",
              "Complete arrival formalities in Italy.",
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
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
            The pre-enrolment stage has its own steps, documents and
            deadlines — see our{" "}
            <Link
              href="/universitaly"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              Universitaly pre-enrolment guide for Indian students
            </Link>
            . Admission does not itself grant a visa; visa submission
            follows your residence jurisdiction through the VFS channel
            for the competent Italian mission — see the{" "}
            <Link
              href="/italy-student-visa"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              Italy student visa guide
            </Link>
            .
          </p>
          <div className="mt-8 text-center">
            <CtaButton href="/italy-student-visa">
              Continue to the student visa guide
            </CtaButton>
          </div>
        </section>

        {/* Mistakes */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Avoid refusal risks"
              title="Common Application Mistakes"
            />
            <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Missing programme-specific requirements",
                  text: "General eligibility is not enough — entrance tests, portfolios and prerequisites decide selections.",
                },
                {
                  title: "Wrong or late documents",
                  text: "Untranslated, unattested or incomplete files stall or sink applications.",
                },
                {
                  title: "Ignoring deadlines",
                  text: "Each programme has its own date. One missed deadline cannot be borrowed from another.",
                },
                {
                  title: "Assuming one process fits all",
                  text: "Every university runs its own admission mechanics — verify each separately.",
                },
                {
                  title: "Relying on outdated information",
                  text: "Calls, tests and deadlines change yearly. Work from current official pages.",
                },
                {
                  title: "Confusing admission with visa approval",
                  text: "A university offer does not guarantee a visa. Each stage has its own decision-maker.",
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
                >
                  <h3 className="font-bold text-[var(--foreground)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ + final CTA */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="FAQ"
            title="Italy University Admission FAQs"
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
          <div className="mx-auto mt-12 max-w-3xl rounded-3xl bg-[var(--foreground)] px-6 py-10 text-center text-[var(--background)] sm:px-10">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to apply to Italian universities?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl opacity-80">
              Get personalised guidance on shortlisting, eligibility,
              documents, deadlines and applications.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <CtaButton href="/contact">Book a free consultation</CtaButton>
              <CtaButton href="/universities" variant="secondary">
                Explore universities
              </CtaButton>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
