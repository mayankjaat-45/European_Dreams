import Link from "next/link";

import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

const SITE_URL = "https://www.europeandreamss.com";
const CANONICAL = `${SITE_URL}/english-taught-courses-in-italy`;

const PAGE_TITLE = "English-Taught Courses in Italy for Indian Students | 2026/27";
const PAGE_DESCRIPTION =
  "Find English-taught courses in Italy for Indian students, including Bachelor's and Master's programmes, language requirements, admission and scholarships.";

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
  { name: "English-Taught Courses in Italy", href: CANONICAL },
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

const finderSteps = [
  "Open the official Universitaly course finder.",
  "Select the relevant degree type — Bachelor/first-level, Master/second-level or single-cycle.",
  "Set the course language filter to English.",
  "Narrow by subject, field or university as needed.",
  "Open the course details for shortlisted options.",
  "Visit the university's official programme and admission page for each option.",
  "Read the current admission call for your intake year.",
  "Check the language requirements and deadlines in that call before applying.",
];

const requirementRows = [
  {
    requirement: "Accepted certifications",
    varies:
      "Each call lists exactly which certificates it accepts — IELTS, TOEFL, Cambridge or others appear only where the call names them.",
  },
  {
    requirement: "Minimum score",
    varies:
      "Thresholds are set per programme and call. Padua's 2026/27 English-curricula table, for example, assigns minimum scores per course — never assume another programme matches.",
  },
  {
    requirement: "B1 vs B2 level",
    varies:
      "Padua's 2026/27 guidance states the required entry level can be B1 or B2 depending on the programme and call. Neither level is universal across Italy.",
  },
  {
    requirement: "Accepted alternatives",
    varies:
      "Some institutions accept specified alternatives under their own rules — Padua, for instance, recognises a prior degree taught entirely in English (partial study abroad does not count) and native-speaker status. Alternatives always depend on the call.",
  },
  {
    requirement: "Deadline for proof",
    varies:
      "Each admission notice sets its own manner and deadline for submitting certificates or provisional result statements.",
  },
  {
    requirement: "Previous English-taught degree",
    varies:
      "May be accepted in some institutions under strict conditions — Padua requires the documentation to explicitly show the language of instruction. Check your call.",
  },
];

const mistakes = [
  {
    title: "Relying on old course lists",
    text: "English-taught offerings change every academic year. A list compiled for a past intake can include withdrawn programmes and miss new ones.",
  },
  {
    title: "Assuming every class is in English",
    text: "An English-taught degree does not mean every module, lab or administrative process at the university runs in English. Read the curriculum language carefully.",
  },
  {
    title: "Assuming IELTS is always mandatory",
    text: "Only programmes whose call names IELTS require it. Other calls accept different certificates — or alternatives entirely.",
  },
  {
    title: "Assuming B2 is universal",
    text: "Required levels differ by programme and call. Padua's own 2026/27 guidance splits B1 and B2 across programmes — treat every other institution the same way.",
  },
  {
    title: "Checking third-party lists instead of university pages",
    text: "Aggregators summarise; only the university's programme page and current admission call define language, requirements and deadlines.",
  },
  {
    title: "Ignoring programme-specific deadlines",
    text: "English-taught tracks can carry their own rounds and cutoffs inside the university's wider calendar. Track the call, not the intake month.",
  },
  {
    title: "Ignoring non-EU and visa applicant requirements",
    text: "Visa-seeking applicants often face earlier rounds and extra steps. Confirm the rules for your applicant category, not the general ones.",
  },
];

const applicationFlow = [
  "Research the field and shortlist English-taught programmes from official listings.",
  "Verify eligibility against each programme's official requirements.",
  "Check the exact English-language requirement in the current call.",
  "Apply to the university within its window.",
  "Secure the admission outcome the process requires.",
  "File scholarship applications where applicable.",
  "Complete Universitaly pre-enrolment where it applies to you.",
  "Apply for the visa and prepare for arrival.",
];

const faqs = [
  {
    question: "Can Indian students study in Italy in English?",
    answer:
      "Yes. Multiple Italian universities offer degree programmes taught in English at Bachelor's, Master's and single-cycle level. Availability depends on the university, programme and academic year — verify each option on its official page and current call.",
  },
  {
    question: "Are there English-taught Bachelor's degrees in Italy?",
    answer:
      "Yes, though the choice is narrower than at Master's level and varies by university. The University of Padua's official listing, for example, includes Animal Care, Psychological Science, Information Engineering, Economics, Governance and Decision-Making, and Earth and Climate Dynamics. These are Padua examples, not an Italy-wide list.",
  },
  {
    question: "Are there English-taught Master's degrees in Italy?",
    answer:
      "Yes — English-taught Master's options are widespread across fields, but programme availability still varies. Verified Padua examples include Applied Economics, Management for Sustainable Firms, and the specified English curricula of Accounting, Finance and Business Consulting.",
  },
  {
    question: "How do I find English-taught courses in Italy?",
    answer:
      "Use the official Universitaly course finder: select the degree type, set the course language to English, filter as needed, then open each course and verify it on the university's official programme page and current admission call.",
  },
  {
    question: "Does every English-taught course require IELTS?",
    answer:
      "No. Only courses whose admission call names IELTS require it. Other programmes accept different certificates named in their calls, and some recognise alternatives such as a prior fully English-taught degree under strict conditions.",
  },
  {
    question: "Is B2 English required for Italy?",
    answer:
      "There is no single Italy-wide requirement. Required levels differ by programme and call — Padua's 2026/27 guidance, for instance, assigns B1 or B2 depending on the programme. Your call alone sets your level.",
  },
  {
    question: "Do I need to know Italian to study in English?",
    answer:
      "For a genuinely English-taught programme, Italian is not automatically a teaching-language requirement — but some programmes or universities add their own language conditions, and Italian remains useful for daily life and integration. Check the call; do not assume either way.",
  },
  {
    question: "Which Italian universities offer English-taught courses?",
    answer:
      "Many do, including institutions such as the University of Padua and Politecnico di Milano — but offerings, levels and requirements differ per institution and year. Use the Universitaly language filter and each university's official listing rather than any fixed list.",
  },
  {
    question: "How much do English-taught courses cost?",
    answer:
      "Fees follow the same institution and programme rules as any other course — public and private bands, income-based calculation and possible waivers all apply. See our cost of studying in Italy guide for the official indicative ranges and fee verification steps.",
  },
  {
    question: "Can I get scholarships for English-taught courses?",
    answer:
      "Yes — regional, university and government support can apply to English-taught programmes where you meet each scheme's own criteria. See our Italy scholarships guide for DSU, MAECI and university awards.",
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
    text: "Universities, admission, costs and the full journey from India.",
  },
  {
    href: "/courses",
    title: "Courses in Italy",
    text: "Browse programmes, then verify each language of instruction.",
  },
  {
    href: "/universities",
    title: "Universities in Italy",
    text: "Compare institutions and their official programme pages.",
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
    text: "Funding routes with their own calls and deadlines.",
  },
  {
    href: "/cost-of-studying-in-italy",
    title: "Cost of studying in Italy",
    text: "Tuition bands, living costs and fee verification.",
  },
];

export default function EnglishTaughtCoursesPage() {
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
                2026/27 English-taught programmes
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
                English-Taught Courses in Italy for Indian Students
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
                Italy offers degree programmes taught in English — but
                availability depends on the university, the programme and
                the academic year. This guide shows how to find them on
                official listings and verify each admission call before you
                apply.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <CtaButton href="/courses">Explore Courses</CtaButton>
                <CtaButton href="/universities" variant="secondary">
                  Explore Universities
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
              Offerings change every year — verify the current listing
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
              Programme examples below come from official 2026/27 listings
              and are labelled as such. English-taught availability changes
              annually, so the current course listing and admission call —
              not this page — are final. No university ranking and no
              guaranteed admission or visa is implied anywhere here.
            </p>
          </div>
        </section>

        {/* 3. What are English-taught courses */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="The concept"
            title="What Are English-Taught Courses in Italy?"
            intro="Three related but different things hide behind the same label."
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-3">
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Fully English-taught programmes
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Degrees delivered entirely in English from lectures to
                examinations — the category this guide focuses on, and the
                one the Universitaly language filter is built to find.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                English curricula within programmes
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Some degrees offer specified English-language curricula or
                tracks alongside Italian ones. Enrolment, requirements and
                places can differ per curriculum — check which one you are
                applying to.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Individual English modules
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Single courses or modules taught in English inside an
                otherwise Italian degree. These do not make the degree
                English-taught — read the programme-level language, not the
                module list.
              </p>
            </article>
          </div>
        </section>

        {/* 4. How to find */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Official workflow"
              title="How to Find English-Taught Courses in Italy"
              intro="Eight steps on official sources — third-party lists are for orientation only."
            />
            <ol className="mx-auto mt-10 max-w-3xl space-y-4">
              {finderSteps.map((step, index) => (
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
              Start at the{" "}
              <OfficialLink href="https://www.universitaly.it/it/cerca-corsi">
                Universitaly course finder
              </OfficialLink>{" "}
              and cross-check foreign-student procedures on{" "}
              <OfficialLink href="https://www.universitaly.it/it/studenti-stranieri">
                Universitaly
              </OfficialLink>{" "}
              and{" "}
              <OfficialLink href="https://studyinitaly.esteri.it/">
                Study in Italy
              </OfficialLink>
              .
            </p>
          </div>
        </section>

        {/* 5. Bachelor's */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Undergraduate"
            title="English-Taught Bachelor's Degrees in Italy"
            intro="Available but selective by institution — examples from one verified official listing."
          />
          <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
            <h3 className="text-xl font-bold text-[var(--foreground)]">
              Verified examples: University of Padua&apos;s official listing
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--muted-foreground)]">
              <li>Animal Care</li>
              <li>Psychological Science</li>
              <li>Information Engineering</li>
              <li>Economics, Governance and Decision-Making</li>
              <li>Earth and Climate Dynamics</li>
            </ul>
            <p className="mt-4 text-sm leading-6 text-[var(--muted-foreground)]">
              These are examples from Padua&apos;s official current listing
              of English-taught degree programmes — not a complete
              Italy-wide list, and not every university offers
              English-taught Bachelor&apos;s. See the{" "}
              <OfficialLink href="https://www.unipd.it/en/corsi-laurea-lingua-inglese">
                official Padua listing
              </OfficialLink>
              .
            </p>
          </div>
        </section>

        {/* 6. Master's */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Postgraduate"
              title="English-Taught Master's Degrees in Italy"
              intro="The widest English-taught choice — still programme-dependent."
            />
            <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6 sm:p-8">
              <h3 className="text-xl font-bold text-[var(--foreground)]">
                Verified examples: Padua English-language provision
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--muted-foreground)]">
                <li>Applied Economics</li>
                <li>Management for Sustainable Firms</li>
                <li>
                  Accounting, Finance and Business Consulting — specified
                  English curricula
                </li>
              </ul>
              <p className="mt-4 text-sm leading-6 text-[var(--muted-foreground)]">
                Politecnico di Milano is another example of an institution
                publishing English-language requirements for Master&apos;s
                (Laurea Magistrale) admission — without implying every
                programme follows the same requirement. See the{" "}
                <OfficialLink href="https://www.polimi.it/en/students/language-requirements/students-of-laurea-magistrale-study-programmes">
                  official Politecnico language requirements
                </OfficialLink>
                .
              </p>
            </div>
          </div>
        </section>

        {/* 7. Single-cycle */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Long degrees"
            title="English-Taught Single-Cycle Programmes"
            intro="A smaller set — mention only what official listings confirm."
          />
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-sm leading-6 text-[var(--muted-foreground)]">
            <p>
              Padua&apos;s official English-taught listing confirms
              single-cycle provision including Medicine and Surgery and the
              Medicine and Surgery — MedTech programme. As with every
              category here, confirm the current listing and call before
              planning around it.
            </p>
          </div>
        </section>

        {/* 8. Language requirements */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Proof of English"
              title="English Language Requirements for Italy"
              intro="There is no single Italy-wide English test requirement. The university or course admission call controls the exact requirement — the table shows what varies."
            />
            <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)]">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th scope="col" className="px-5 py-4 font-bold text-[var(--foreground)]">
                      Requirement
                    </th>
                    <th scope="col" className="px-5 py-4 font-bold text-[var(--foreground)]">
                      What can vary
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {requirementRows.map((row) => (
                    <tr key={row.requirement}>
                      <th scope="row" className="px-5 py-4 font-semibold text-[var(--foreground)]">
                        {row.requirement}
                      </th>
                      <td className="px-5 py-4 text-[var(--muted-foreground)]">
                        {row.varies}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
              The worked example is Padua&apos;s 2026/27 guidance, where
              English-taught programmes require B1 or B2 depending on the
              programme and call — see the{" "}
              <OfficialLink href="https://www.unipd.it/en/requisito-inglese-ammissione">
                official 2026/27 English-proficiency page
              </OfficialLink>
              .
            </p>
          </div>
        </section>

        {/* 9. Italian need */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Italian language"
            title="Do Indian Students Need Italian?"
            intro="A balanced answer — neither universally required nor universally unnecessary."
          />
          <div className="mx-auto mt-10 max-w-3xl space-y-4 text-sm leading-6 text-[var(--muted-foreground)]">
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              For a genuinely English-taught programme, Italian is not
              automatically the teaching-language requirement — and a course
              being taught in English does not by itself create an Italian
              proof requirement. Requirements depend on the programme.
            </p>
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              That said, some programmes or universities add their own
              language conditions, and Italian remains genuinely useful for
              daily life, part-time work and integration. Check the call
              for the requirement; learn the language for everything else.
            </p>
          </div>
        </section>

        {/* 10. Admission requirements */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Eligibility"
              title="Admission Requirements for English-Taught Courses"
              intro="The usual components — no programme needs all of them."
            />
            <ul className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Academic qualification",
                  text: "School leaving results for Bachelor's or a recognised degree for Master's, relevant to the field where required.",
                },
                {
                  title: "Transcripts",
                  text: "Mark sheets and records supporting the qualification.",
                },
                {
                  title: "Programme prerequisites",
                  text: "Required subjects, credit minimums or background knowledge the call specifies.",
                },
                {
                  title: "English-language proof",
                  text: "Where the call requires it, in the exact form, level and deadline it sets.",
                },
                {
                  title: "Entrance tests",
                  text: "Where applicable — some regulated or selective programmes test all applicants.",
                },
                {
                  title: "Portfolio or interview",
                  text: "Design, architecture and similar fields may assess work samples or hold interviews.",
                },
                {
                  title: "University-specific documents",
                  text: "Declarations, translations or formats unique to the institution's process.",
                },
              ].map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
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
          </div>
        </section>

        {/* 11. Fees and scholarships */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Funding"
            title="Fees and Scholarships for English-Taught Courses"
            intro="English-taught status does not create a separate fee system — the same rules apply."
          />
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-sm leading-6 text-[var(--muted-foreground)]">
            <p>
              Fees vary by university and programme, income-based reductions
              may exist, and scholarships or fee waivers may be available
              where you meet each scheme&apos;s own criteria. Detail lives
              in our{" "}
              <Link
                href="/cost-of-studying-in-italy"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                cost of studying in Italy guide
              </Link>{" "}
              and{" "}
              <Link
                href="/italy-scholarships"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Italy scholarships guide
              </Link>
              .
            </p>
          </div>
        </section>

        {/* 12. Flow */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="The chain"
              title="English Course → Admission → Universitaly → Visa"
              intro="Finding the course is step one of six."
            />
            <ol className="mx-auto mt-10 grid max-w-3xl gap-4">
              {[
                "Find the English-taught course on official listings.",
                "Check the official admission call, including language proof.",
                "Apply to the university within its window.",
                "Secure the admission outcome the process requires.",
                "Complete Universitaly pre-enrolment where it applies.",
                "Apply for the visa where it applies.",
              ].map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="pt-1.5 font-semibold leading-6 text-[var(--foreground)]">
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
              .
            </p>
          </div>
        </section>

        {/* 13. Subject areas */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Fields"
            title="Popular English-Taught Subject Areas"
            intro="Broad categories to orient a search — not promises of availability at any given university."
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Engineering",
              "Computer Science, Data and AI",
              "Economics, Finance and Management",
              "Architecture and Design",
              "Life Sciences",
              "Environmental Sciences",
              "Social Sciences",
              "Medicine-related programmes where officially available",
            ].map((area) => (
              <div
                key={area}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-sm font-semibold leading-6 text-[var(--foreground)]"
              >
                {area}
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
            Browse real options in our{" "}
            <Link
              href="/courses"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              courses in Italy
            </Link>{" "}
            listing and compare institutions via{" "}
            <Link
              href="/universities"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              universities in Italy
            </Link>
            .
          </p>
        </section>

        {/* 14. Verification checklist */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Trust but verify"
              title="How to Verify a Course Is Actually Taught in English"
              intro="Six confirmations before you treat any listing as fact."
            />
            <ul className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Course page says English",
                  text: "The listing itself names English as the teaching language.",
                },
                {
                  title: "Universitaly language filter",
                  text: "The course appears under the English filter in the official finder.",
                },
                {
                  title: "Official university programme page",
                  text: "The institution's own page confirms the language for your intake.",
                },
                {
                  title: "Current admission call",
                  text: "The call for your year repeats the language — old calls do not count.",
                },
                {
                  title: "Curriculum language",
                  text: "Check whether English covers the full curriculum or only specified tracks.",
                },
                {
                  title: "Language requirements",
                  text: "The call's proof requirements match an English-taught track, not an Italian one.",
                },
              ].map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
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
          </div>
        </section>

        {/* 15. Mistakes */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Avoid these"
            title="Common English-Taught Course Mistakes"
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
            {mistakes.map((item) => (
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

        {/* 15b. Without IELTS */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Without IELTS"
              title="Can Indian Students Study in Italy Without IELTS?"
              intro="What ΓÇ£study in Italy without IELTSΓÇ¥ really means for Indian students ΓÇö documented routes, not blanket exemptions."
            />
            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6">
              <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                There is no universal Italy-wide rule that lets Indian
                students skip IELTS. Each university and programme sets its
                own English-language proof: some documented routes accept a
                qualifying English-medium degree instead of a test, while
                others require a recognized certificate regardless of previous
                study. An MOI letter is not automatically accepted everywhere,
                and university admission rules are separate from student-visa
                documentation.
              </p>
            </div>
            <div className="mx-auto mt-10 grid max-w-5xl gap-6">
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  When Can an English-Medium Degree Replace IELTS?
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  The strongest documented example is Politecnico di Milano.
                  For its relevant Master&apos;s foreign-qualification route,
                  a Bachelor&apos;s degree taught in English for at least 3
                  years can qualify for exemption from English certification
                  ΓÇö but a certified university document is required, and it
                  must confirm that at least 75% of the courses were taught
                  in English. IELTS ΓëÑ6 is otherwise one accepted
                  certification route for that Master&apos;s admission
                  context.{" "}
                  <OfficialLink href="https://www.polimi.it/en/prospective-students/how-to-apply/admission-to-laurea-magistrale/foreign-qualification/application/list-of-documents-required-by-the-admissions-office">
                    Polimi admissions-office documents list
                  </OfficialLink>
                  .
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                  Bologna and Turin also have programme-dependent
                  English-medium routes where their official sources
                  explicitly support them ΓÇö Bologna&apos;s DHDK Master&apos;s
                  page lists a Bachelor&apos;s or Master&apos;s with English
                  as medium of instruction as one way to meet B2, and Turin
                  states some programmes accept a university certificate
                  attesting bachelor studies in English. These are documented
                  examples, not an Italy-wide rule.{" "}
                  <OfficialLink href="https://corsi.unibo.it/2cycle/DigitalHumanitiesKnowledge/english-language-requirement-for-admission">
                    Bologna DHDK English requirement
                  </OfficialLink>
                  {" ┬╖ "}
                  <OfficialLink href="https://en.unito.it/studying-unito/international-degree-seeking-students/faqs/language-requirements">
                    Turin language-requirements FAQ
                  </OfficialLink>
                  .
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  MOI vs IELTS: What Indian Students Should Check
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  MOI means proof from the previous institution that the
                  relevant education was delivered in English ΓÇö but acceptance
                  depends on the specific university and programme. Check
                  whether your call requires a particular certificate, a
                  certified institutional document, a percentage of coursework
                  in English, transcript evidence, or another form of proof. A
                  simple generic MOI letter is not sufficient everywhere.
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                  Sapienza&apos;s documented waiver list is a good cautionary
                  example: it covers specific qualifications and
                  MOI-country nationalities (UK, US, Canada, Ireland,
                  Australia, New Zealand) ΓÇö India is not on its listed
                  MOI-country nationality waiver, so Indian applicants should
                  not assume that waiver applies to them.{" "}
                  <OfficialLink href="https://www.uniroma1.it/sites/default/files/field_file_allegati/language_requirements_sapienza_2026.pdf">
                    Sapienza 2026 English language requirements (PDF)
                  </OfficialLink>
                  .
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Bachelor&apos;s vs Master&apos;s: Requirements Can Differ
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Polimi shows why level matters: its English-taught
                  Bachelor&apos;s routes include a qualification-in-English
                  route, while its relevant Master&apos;s foreign-qualification
                  route centres on certified English testing unless the
                  documented 3-year/75% English-medium exemption applies.
                  Treat this as one university&apos;s example ΓÇö always check
                  the call for your exact level and programme.{" "}
                  <OfficialLink href="https://www.polimi.it/en/students/language-requirements/students-of-an-english-language-laurea-study-programme">
                    Polimi Bachelor&apos;s language requirements
                  </OfficialLink>
                  .
                </p>
              </article>
            </div>
            <div className="mx-auto mt-8 max-w-5xl">
              <h3 className="text-center text-lg font-bold text-[var(--foreground)]">
                University-Specific Examples
              </h3>
              <p className="mx-auto mt-2 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
                How the IELTS requirement and English-medium options compare
                across documented routes. There is no verified list of
                &ldquo;Italy universities without IELTS&rdquo; ΓÇö check each
                call.
              </p>
            </div>
            <div className="mx-auto mt-6 max-w-5xl overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--background)]">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th
                      scope="col"
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]"
                    >
                      University
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]"
                    >
                      Route
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]"
                    >
                      English test requirement
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]"
                    >
                      English-medium/MOI option
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]"
                    >
                      Official source
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      Politecnico di Milano
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Master&apos;s foreign-qualification route
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Listed certificates including IELTS ΓëÑ6
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Exempt with Bachelor&apos;s taught in English ΓëÑ3 years
                      plus certified document confirming ΓëÑ75% courses in
                      English
                    </td>
                    <td className="px-5 py-4">
                      <OfficialLink href="https://www.polimi.it/en/prospective-students/how-to-apply/admission-to-laurea-magistrale/foreign-qualification/application/list-of-documents-required-by-the-admissions-office">
                        Admissions-office documents
                      </OfficialLink>
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      Sapienza University of Rome
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      English-taught programmes (B2 baseline)
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Listed certificates named per programme call
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Waivers only for listed cases; India is not on the
                      MOI-country nationality waiver
                    </td>
                    <td className="px-5 py-4">
                      <OfficialLink href="https://www.uniroma1.it/sites/default/files/field_file_allegati/language_requirements_sapienza_2026.pdf">
                        2026 requirements (PDF)
                      </OfficialLink>
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      University of Bologna ΓÇö DHDK Master&apos;s example
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Programme example, not a university-wide rule
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      B2 via listed certificates per programme table
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Bachelor&apos;s or Master&apos;s with English as medium
                      of instruction listed as one route
                    </td>
                    <td className="px-5 py-4">
                      <OfficialLink href="https://corsi.unibo.it/2cycle/DigitalHumanitiesKnowledge/english-language-requirement-for-admission">
                        DHDK English requirement
                      </OfficialLink>
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      University of Turin
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Programme-dependent ΓÇö check Apply@UniTo
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Listed certificates including IELTS where the programme
                      requires them
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Some programmes accept a university certificate of
                      bachelor studies in English; Duolingo never accepted
                    </td>
                    <td className="px-5 py-4">
                      <OfficialLink href="https://en.unito.it/studying-unito/international-degree-seeking-students/faqs/language-requirements">
                        Language-requirements FAQ
                      </OfficialLink>
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      University of Milan
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Per-course B1/B2 with certificate-or-test model
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Accepted certificates or SLAM placement/entry tests
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Certificate-or-test model; no official MOI exemption
                      identified in the reviewed sources
                    </td>
                    <td className="px-5 py-4">
                      <OfficialLink href="https://www.unimi.it/en/study/language-proficiency/placement-tests-entry-tests-and-english-courses">
                        Language-proficiency pages
                      </OfficialLink>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">Warning</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Do not assume that an MOI letter is accepted by every Italian
                university or programme. Always check the current admission
                call or language-requirements page for your exact programme.
              </p>
            </div>
            <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">
                MOI for University Admission vs Italy Student Visa
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                The Indian mission checklists treat language separately from
                admission: for an English-taught course they provide for
                B2-level English certification or an equivalent Medium of
                Education (MOI) declaration from the previous Higher Education
                Institution. So do not tell Indian students the visa
                universally requires IELTS ΓÇö while remembering the
                university&apos;s own call can still require IELTS or another
                recognized certificate.{" "}
                <OfficialLink href="https://conscalcutta.esteri.it/wp-content/uploads/2026/06/checklist-studio-2026-2027-2028-INDIA.pdf">
                  Kolkata 2026-27/2027-28 checklist (PDF)
                </OfficialLink>
                {" ┬╖ "}
                <OfficialLink href="https://assets.ctfassets.net/xxg4p8gt3sg6/1ZYRulWbCqUIuOwoUJxnqK/585138aa7caa983f43ea2a35e2af188d/checklist_studio__2026_2027_2028_Italy_in_INDIA._Rev_India_16.06.pdf">
                  New Delhi 2026-27/2027-28 checklist (PDF)
                </OfficialLink>
                .
              </p>
            </div>
          </div>
        </section>

        {/* 16. Indian flow */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Your sequence"
              title="Indian Student Application Flow for English Courses"
              intro="Nine stages from research to arrival."
            />
            <ol className="mx-auto mt-10 max-w-3xl space-y-4">
              {applicationFlow.map((step, index) => (
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
              Full journey context in our{" "}
              <Link
                href="/study-in-italy"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Study in Italy guide
              </Link>
              .
            </p>
          </div>
        </section>

        {/* 17. FAQ */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="FAQ"
            title="English-Taught Courses in Italy: FAQs"
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

        {/* 18. Keep planning + CTA */}
        <section className="border-t border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Keep planning"
              title="Plan the Rest of Your Italy Journey"
              intro="Language is settled — now admission, funding and the visa."
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
                Found English-taught options? Verify them with us.
              </h2>
              <p className="mx-auto mt-3 max-w-2xl opacity-80">
                Get personalised guidance on programmes, language proof,
                applications and the Italy student visa.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-4">
                <CtaButton href="/contact">Book a free consultation</CtaButton>
                <CtaButton href="/courses" variant="secondary">
                  Browse courses
                </CtaButton>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
