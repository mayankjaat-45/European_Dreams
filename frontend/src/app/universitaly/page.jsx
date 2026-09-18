import Link from "next/link";

import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

const SITE_URL = "https://www.europeandreamss.com";
const CANONICAL = `${SITE_URL}/universitaly`;

const PAGE_TITLE = "Universitaly Pre-Enrolment for Indian Students | Italy Guide";
const PAGE_DESCRIPTION =
  "Universitaly pre-enrolment for Indian students: what the official Italy portal is, who needs it, steps, documents, 2026/27 deadlines and visa link.";

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
  { name: "Universitaly", href: CANONICAL },
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

const preEnrolmentSteps = [
  "Choose your university and course, and read that institution's own admission instructions first.",
  "Apply to the institution exactly as its course-specific process requires — deadlines and requirements are its own.",
  "Obtain the university's required admission or eligibility outcome where the process calls for one.",
  "Create an account on the official Universitaly portal, or log in if you already have one.",
  "Start a new pre-enrolment application for the relevant academic year.",
  "Select the institution and course the university directed you to.",
  "Enter the personal and academic information the form requests.",
  "Upload the documents requested — requirements vary by institution and consulate.",
  "Submit the pre-enrolment application within the applicable deadline.",
  "Wait for the university to review and validate the application on the portal.",
  "Proceed to the consular visa process where a visa applies to you.",
];

const mistakes = [
  {
    title: "Treating admission and pre-enrolment as the same step",
    text: "They are different stages on different timelines. Admission is the university's academic decision; pre-enrolment is the official portal stage that follows the university's instructions.",
  },
  {
    title: "Missing the university-specific deadline",
    text: "Universities define their own pre-enrolment and application dates, which can fall well before any national date. The institution's deadline is the one that binds you.",
  },
  {
    title: "Uploading incomplete or wrong documents",
    text: "Requirements vary by institution and consulate. A file that worked for someone else's case may not satisfy yours — follow your own call and checklist.",
  },
  {
    title: "Assuming validation guarantees the visa",
    text: "University validation of pre-enrolment does not guarantee visa issuance. The final decision belongs to the competent Italian diplomatic or consular authority.",
  },
  {
    title: "Relying on an old year's procedure",
    text: "Portals, dates and instructions are refreshed for each academic year. Work from the current 2026/27 procedure, not last year's screenshots or advice.",
  },
  {
    title: "Waiting for the national date when the university date is earlier",
    text: "The national final date is a backstop, not a target. If your university requires an earlier submission, the national date cannot save a late application.",
  },
];

const faqs = [
  {
    question: "What is Universitaly?",
    answer:
      "Universitaly is the official — and free — Italian Ministry portal for higher education. Among other functions, it is where relevant international students submit pre-enrolment for study in Italy.",
  },
  {
    question: "Is Universitaly free?",
    answer:
      "Yes. Universitaly is the official Italian Ministry portal and using it is free. Any charge you encounter elsewhere relates to other services or intermediaries, not to the portal itself.",
  },
  {
    question: "Who needs Universitaly pre-enrolment?",
    answer:
      "International students applying from abroad who need a visa for study in Italy submit pre-enrolment through Universitaly. Students who do not need a visa follow different procedures — check the official guidance for your situation rather than assuming either way.",
  },
  {
    question: "Is Universitaly the same as university admission?",
    answer:
      "No. University admission is the institution's own academic selection with its own requirements and deadlines; Universitaly pre-enrolment is the separate official stage that follows the university's instructions and supports the subsequent visa process.",
  },
  {
    question: "When should Indian students apply?",
    answer:
      "As early as your university allows. For 2026/27 the national final visa-submission date for ordinary degree courses is 30 November 2026, but individual universities and courses may require much earlier dates — the institution's deadline governs your plan.",
  },
  {
    question: "What documents are needed?",
    answer:
      "Exact requirements vary. Common categories include passport or identity documents, academic qualifications and transcripts, admission or eligibility information, language evidence where required, and anything else your university or consulate requests. No universal list covers every applicant.",
  },
  {
    question: "Does Universitaly guarantee a visa?",
    answer:
      "No. University validation of your pre-enrolment does not guarantee visa issuance. The final visa decision belongs to the competent Italian diplomatic or consular authority.",
  },
  {
    question: "What is the 2026/27 deadline?",
    answer:
      "Under the current national procedure, the final visa-submission date for ordinary degree courses in 2026/27 is 30 November 2026. For 2027/28 the corresponding national date is 31 October 2027. Always confirm the current procedure, since annual rules can change.",
  },
  {
    question: "Can university deadlines be earlier?",
    answer:
      "Yes — and they often are. Universities define their own pre-enrolment and application deadlines, and the national dates never replace them. Plan around the earliest date that applies to you.",
  },
  {
    question: "What happens after Universitaly validation?",
    answer:
      "After the university validates your pre-enrolment, you proceed to the consular visa process where a visa applies — and after arrival, to residence-permit formalities. Validation is a gateway, not the finish line.",
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
    text: "The academic stage that comes before pre-enrolment.",
  },
  {
    href: "/italy-student-visa",
    title: "Italy student visa",
    text: "The consular stage that follows pre-enrolment.",
  },
  {
    href: "/cost-of-studying-in-italy",
    title: "Cost of studying in Italy",
    text: "Tuition bands, living costs and fee verification.",
  },
  {
    href: "/italy-scholarships",
    title: "Italy scholarships",
    text: "DSU, MAECI and university awards for Indian students.",
  },
  {
    href: "/universities",
    title: "Universities in Italy",
    text: "Compare institutions and their own deadlines.",
  },
  {
    href: "/courses",
    title: "Courses in Italy",
    text: "Shortlist programmes before starting pre-enrolment.",
  },
];

export default function UniversitalyPage() {
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
                2026/27 official procedure
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
                Universitaly Pre-Enrolment for Indian Students
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
                Universitaly is Italy&apos;s official higher-education portal.
                For international students who need a visa, it is where
                pre-enrolment happens — after university admission and before
                the visa application. This guide explains who needs it, how it
                works and where it fits in your Italy plan.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <CtaButton href="/italy-university-admission">
                  Admission Guide
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
              Annual procedure — verify the current edition
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
              Pre-enrolment rules, dates and instructions are refreshed every
              academic year. Dates below belong to the 2026/27 national
              procedure — for any other year, the current edition on{" "}
              <OfficialLink href="https://www.universitaly.it/en/studenti-stranieri">
                Universitaly
              </OfficialLink>{" "}
              and your university&apos;s own pages is the only final source.
              Nothing here promises admission or a visa.
            </p>
          </div>
        </section>

        {/* 3. What is Universitaly */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="The portal"
            title="What Is Universitaly?"
            intro="The official meeting point between international students, Italian institutions and the visa process."
          />
          <div className="mx-auto mt-10 max-w-3xl space-y-4 text-sm leading-6 text-[var(--muted-foreground)]">
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              Universitaly is the official — and free — portal of the Italian
              Ministry for higher education. It publishes course information,
              first-step guidance for foreign students and, crucially, the
              pre-enrolment channel used by international students who require
              a visa for study in Italy.
            </p>
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              Think of it as the middle link in a three-part chain: the
              university decides admission, Universitaly carries the official
              pre-enrolment record, and the consulate decides the visa. Each
              link has its own rules — see the{" "}
              <OfficialLink href="https://www.universitaly.it/en/studenti-stranieri">
                Universitaly foreign-students page
              </OfficialLink>{" "}
              and{" "}
              <OfficialLink href="https://www.universitaly.it/it/first-steps">
                first-steps guidance
              </OfficialLink>
              .
            </p>
          </div>
        </section>

        {/* 4. Who needs it */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Eligibility"
              title="Who Needs Universitaly Pre-Enrolment?"
              intro="Whether you use the portal depends on your situation — the two cases below are not interchangeable."
            />
            <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Applying from abroad and needing a visa
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  International students in this position — including most
                  Indian applicants — submit pre-enrolment through
                  Universitaly. The validated pre-enrolment then supports the
                  subsequent visa application at the competent consulate.
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Students who do not need a visa
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Different procedures apply where no visa is required — for
                  example EU students or those already legally in Italy for
                  other reasons. Do not follow the visa-track process by
                  default; confirm the correct route on the official pages
                  for your case.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 5. Admission vs pre-enrolment */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Two stages, not one"
            title="University Admission vs Universitaly Pre-Enrolment"
            intro="Confusing these two stages causes most pre-enrolment problems. They differ in who decides, what is judged and when."
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                University admission
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--muted-foreground)]">
                <li>You apply for the course on the institution&apos;s own channel.</li>
                <li>The university evaluates your academic application.</li>
                <li>Requirements and deadlines are university-specific.</li>
              </ul>
              <p className="mt-4 text-sm leading-6 text-[var(--muted-foreground)]">
                Full detail in our{" "}
                <Link
                  href="/italy-university-admission"
                  className="font-semibold text-[var(--primary)] hover:underline"
                >
                  Italy university admission guide
                </Link>
                .
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Universitaly pre-enrolment
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--muted-foreground)]">
                <li>The official pre-enrolment stage for relevant international students.</li>
                <li>It follows the university&apos;s instructions — contact and apply to the institution first.</li>
                <li>It creates the record that supports the subsequent visa process.</li>
              </ul>
              <p className="mt-4 text-sm leading-6 text-[var(--muted-foreground)]">
                Enrolment steps are described in the{" "}
                <OfficialLink href="https://studyinitaly.esteri.it/static/ProcedureIscrizione">
                  Study in Italy enrolment procedures
                </OfficialLink>
                .
              </p>
            </article>
          </div>
        </section>

        {/* 6. How to apply */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Step by step"
              title="How to Apply on Universitaly"
              intro="Eleven steps in order. Steps 1–3 belong to the institution; the portal work starts at step 4."
            />
            <ol className="mx-auto mt-10 max-w-3xl space-y-4">
              {preEnrolmentSteps.map((step, index) => (
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

        {/* 7. Documents */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Paperwork"
            title="Documents for Universitaly Pre-Enrolment"
            intro="No universal list exists. Expect some combination of the categories below, exactly as your institution and consulate request."
          />
          <ul className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
            {[
              {
                title: "Passport and identity",
                text: "A valid passport and the identity details the form asks for.",
              },
              {
                title: "Academic qualification",
                text: "Your entry qualification for the course level — school leaving certificate, Bachelor's degree or equivalent.",
              },
              {
                title: "Transcripts",
                text: "Mark sheets and academic records supporting the qualification.",
              },
              {
                title: "Admission or eligibility information",
                text: "Whatever proves your standing with the institution under its own process.",
              },
              {
                title: "Language evidence where required",
                text: "Proof of English or Italian at the required level, if the programme or call demands it.",
              },
              {
                title: "Other requested documents",
                text: "Anything else the university or consulate specifies — declarations, translations or legalisations.",
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
        </section>

        {/* 8. Validation */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="What validation means"
              title="University Validation of Pre-Enrolment"
              intro="Validation moves you forward — but it is not an approval of everything downstream."
            />
            <div className="mx-auto mt-10 max-w-3xl space-y-4 text-sm leading-6 text-[var(--muted-foreground)]">
              <p className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <strong className="text-[var(--foreground)]">
                  What it is:
                </strong>{" "}
                the university&apos;s confirmation on the portal that your
                pre-enrolment record is in order from its side — the green
                light to proceed toward the consular stage.
              </p>
              <p className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <strong className="text-[var(--foreground)]">
                  What it is not:
                </strong>{" "}
                a visa. University validation of pre-enrolment does NOT
                guarantee visa issuance — the final decision belongs solely
                to the competent Italian diplomatic or consular authority,
                which assesses your application on its own criteria.
              </p>
            </div>
          </div>
        </section>

        {/* 9. Visa link */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Next stage"
            title="From Universitaly to the Italy Student Visa"
            intro="The chain only works in this order."
          />
          <ol className="mx-auto mt-10 grid max-w-3xl gap-4">
            {[
              "University admission — the academic decision.",
              "Universitaly pre-enrolment — the official portal record.",
              "Consular and visa process — the authority decision.",
            ].map((step, index) => (
              <li
                key={step}
                className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
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
            Continue with our{" "}
            <Link
              href="/italy-student-visa"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              Italy student visa guide
            </Link>{" "}
            and the official{" "}
            <OfficialLink href="https://studyinitaly.esteri.it/Static/Visto">
              Study in Italy visa information
            </OfficialLink>
            .
          </p>
        </section>

        {/* 10. Deadlines */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="2026/27 timing"
              title="Universitaly Deadlines 2026/27"
              intro="National backstop dates below — your university's earlier dates govern your plan. Procedures refresh yearly, so re-verify for any other intake."
            />
            <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)]">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-[var(--border)]">
                  <tr>
                    <th scope="row" className="px-5 py-4 font-semibold text-[var(--foreground)]">
                      National final visa-submission date, ordinary degree courses, 2026/27
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      30 November 2026 — covers Master&apos;s, Bachelor&apos;s
                      and single-cycle ordinary degree courses under the
                      current national procedure.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-5 py-4 font-semibold text-[var(--foreground)]">
                      Corresponding national date, 2027/28
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      31 October 2027 — published reference for the following
                      year; confirm the current procedure before relying on it.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-5 py-4 font-semibold text-[var(--foreground)]">
                      University and course-specific dates
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Set per institution and programme, often earlier than
                      the national date — these are the binding deadlines.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-5 py-4 font-semibold text-[var(--foreground)]">
                      PhD and other categories
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Follow institution-specific timelines where applicable —
                      check the institution, not the national table.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 11. Indian students */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="From India"
            title="Universitaly Pre-Enrolment for Indian Students"
            intro="The official consular flow for Indian applicants, and where jurisdiction matters."
          />
          <div className="mx-auto mt-10 max-w-3xl space-y-4 text-sm leading-6 text-[var(--muted-foreground)]">
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              Per the Consulate General of Italy in Mumbai&apos;s official
              guidance, Indian students follow three mandatory steps: apply
              for admission on the chosen institution&apos;s website within
              its deadline, then apply online for pre-enrolment on the
              Universitaly portal once admitted, then apply for a D-visa
              where the course exceeds 90 days — or a C-visa for shorter
              courses.
            </p>
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              Visa jurisdiction depends on where you reside: different
              consulates cover different Indian states, each with its own
              submission centres and instructions. Confirm the mission
              competent for your residence — the Mumbai guidance above
              applies to its own jurisdiction, not automatically to every
              Indian applicant. See the{" "}
              <OfficialLink href="https://consmumbai.esteri.it/en/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/study-in-italy/">
                Consulate General of Italy in Mumbai — Study in Italy
              </OfficialLink>{" "}
              page as a reference example.
            </p>
          </div>
        </section>

        {/* 12. Mistakes */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Avoid these"
              title="Common Universitaly Mistakes"
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

        {/* 13. After arrival */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="After landing"
            title="Residence Permit After Arrival"
            intro="One formal step closes the chain — briefly, since this is not a residence guide."
          />
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-sm leading-6 text-[var(--muted-foreground)]">
            <p>
              After arrival, non-EU students on a Type-D study visa must
              begin residence-permit procedures within 8 working days. For
              the current requirements see the official{" "}
              <OfficialLink href="https://studyinitaly.esteri.it/Static/InformazioniSoggiorno">
                Study in Italy residence-permit information
              </OfficialLink>
              .
            </p>
          </div>
        </section>

        {/* 14. FAQs */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="FAQ"
              title="Universitaly: Frequently Asked Questions"
            />
            <div className="mx-auto mt-10 max-w-3xl space-y-4">
              {faqs.map((faq) => (
                <article
                  key={faq.question}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6"
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
          </div>
        </section>

        {/* 15. Keep planning + CTA */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Keep planning"
            title="Plan the Rest of Your Italy Journey"
            intro="Pre-enrolment is the middle link — admission comes before it, funding and the visa around it."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plannerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/40 hover:shadow-xl"
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
              Confused about admission vs pre-enrolment?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl opacity-80">
              Get personalised guidance on universities, Universitaly
              pre-enrolment, scholarships and the Italy student visa.
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
