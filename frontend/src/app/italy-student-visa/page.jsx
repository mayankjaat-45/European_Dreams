import Link from "next/link";

import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

const SITE_URL = "https://www.europeandreamss.com";
const CANONICAL = `${SITE_URL}/italy-student-visa`;

const UNIVERSITALY_STUDENTS_URL =
  "https://www.universitaly.it/it/studenti-stranieri";
const MUMBAI_STUDY_URL =
  "https://consmumbai.esteri.it/en/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/study-in-italy/";
const MUMBAI_DOV_URL =
  "https://consmumbai.esteri.it/en/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/dichiarazione-di-valore-dov/";
const EC_ITALY_PROFILE_URL =
  "https://education.ec.europa.eu/study-in-europe/country-profiles/italy";

export const metadata = {
  title: "Italy Student Visa for Indian Students | Requirements & Process",
  description:
    "Italy student visa for Indian students: requirements, documents, Universitaly pre-enrolment, application process, financial proof, checklist and post-arrival guidance.",
  alternates: {
    canonical: CANONICAL,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title:
      "Italy Student Visa for Indian Students | Requirements & Process",
    description:
      "Italy student visa for Indian students: requirements, documents, Universitaly pre-enrolment, application process, financial proof, checklist and post-arrival guidance.",
    url: CANONICAL,
    siteName: "European Dreams",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Italy Student Visa for Indian Students | Requirements & Process",
    description:
      "Italy student visa for Indian students: requirements, documents, Universitaly pre-enrolment, application process, financial proof, checklist and post-arrival guidance.",
  },
};

const breadcrumbItems = [
  { name: "Home", href: `${SITE_URL}/` },
  { name: "Italy Student Visa", href: CANONICAL },
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
  name: "Italy Student Visa for Indian Students | Requirements & Process",
  description:
    "Guide for Indian students on the Italy student visa: Universitaly pre-enrolment, requirements, documents, financial proof, checklist and post-arrival formalities.",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  breadcrumb: { "@id": `${CANONICAL}#breadcrumb` },
  inLanguage: "en-IN",
};

const processSteps = [
  {
    title: "Choose an Italian university and course",
    text: "Shortlist programmes that match your qualification, subjects and language readiness, and note each university's own deadlines.",
  },
  {
    title: "Apply to the university",
    text: "Submit the university application with transcripts, certificates and any programme-specific items before its deadline.",
  },
  {
    title: "Receive admission or pre-admission",
    text: "The university confirms whether you are admitted. Keep the admission letter safe — the visa stage builds on it.",
  },
  {
    title: "Complete Universitaly pre-enrolment when required",
    text: "Students who need a visa generally submit pre-enrolment on the Universitaly portal after admission, for the university to validate.",
  },
  {
    title: "Prepare your visa documents",
    text: "Collect documents exactly as listed in the current checklist of your competent mission — requirements differ by mission and applicant.",
  },
  {
    title: "Submit the appropriate visa application",
    text: "Long courses over 90 days generally need a national (D) study visa; shorter courses may use a Schengen (C) visa. Confirm which applies to you.",
  },
  {
    title: "Attend interview or biometrics where applicable",
    text: "Some missions require steps such as a video interview at submission. Follow the appointment instructions of your mission.",
  },
  {
    title: "Receive the visa decision",
    text: "The competent Italian authorities decide the application. Timelines vary, especially if additional documents are requested.",
  },
  {
    title: "Travel to Italy",
    text: "Travel once your visa is issued, carrying originals of the key documents you submitted.",
  },
  {
    title: "Complete post-arrival residence formalities",
    text: "Declare your presence and apply for the residence permit as required after arrival.",
  },
];

const faqs = [
  {
    question: "How can Indian students apply for an Italy student visa?",
    answer:
      "Get admitted by an Italian university, complete Universitaly pre-enrolment where required, prepare documents per your competent mission's current checklist, and submit the visa application by appointment. Each mission publishes its own procedure.",
  },
  {
    question: "What is the Italy student visa process?",
    answer:
      "University admission, Universitaly pre-enrolment validation, document preparation, visa submission with biometrics or interview where applicable, and the decision by the competent Italian authorities — followed by post-arrival residence formalities in Italy.",
  },
  {
    question: "Do I need Universitaly pre-enrolment?",
    answer:
      "If you require a study visa, generally yes: after admission you submit pre-enrolment on the Universitaly portal for university validation, and the validated summary supports the visa application. Always follow your university's instructions.",
  },
  {
    question: "What documents are required for the Italy student visa?",
    answer:
      "Typical categories include passport, admission letter, Universitaly pre-enrolment summary, academic documents, language proof where required, financial evidence, accommodation evidence, insurance, photographs and forms — plus anything else your mission specifies. Exact lists vary by mission.",
  },
  {
    question: "How much financial proof is required?",
    answer:
      "There is no single universal figure published here: the mission defines the required means and accepted evidence. Prepare verifiable documents such as bank statements and sponsorship proof exactly as your mission's current checklist describes.",
  },
  {
    question: "Is a Declaration of Value (DOV) required?",
    answer:
      "Only where your university or course requires it. The DOV is requested by the Higher Education Institution and issued by the competent mission based on where the qualification was issued. Confirm with your university first, then follow the mission's DOV procedure.",
  },
  {
    question: "Is CIMEA required?",
    answer:
      "Not universally. Some universities accept CIMEA comparability or verification statements for foreign qualifications instead of, or alongside, other recognition documents. Check what your specific university accepts.",
  },
  {
    question: "How long does the Italy student visa take?",
    answer:
      "Timelines vary by mission, season and case. For example, published consulate guidance notes that long-stay decisions can take up to 90 days from receipt, longer if additional documents are requested. Apply as early as your mission allows — no timeline can be guaranteed.",
  },
  {
    question: "Can I work while studying in Italy?",
    answer:
      "International students can generally work part-time subject to Italian rules and residence-permit conditions — up to 20 hours per week with a valid permit for non-EU students, per the European Commission country profile. Confirm current rules with official sources.",
  },
  {
    question: "What should I do after arriving in Italy?",
    answer:
      "Complete local residence formalities, generally including declaring presence at the Questura and applying for the residence permit (permesso di soggiorno). Exact procedure and deadlines must be verified with the competent Italian authorities.",
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

export default function ItalyStudentVisaPage() {
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
                Visa guide for Indian students
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
                Italy Student Visa for Indian Students
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
                The Italy student visa journey for Indian students runs from
                university admission through Universitaly pre-enrolment to the
                visa application. This guide explains each stage, the documents
                involved, and where to verify current official requirements.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <CtaButton href="/contact">Free Consultation</CtaButton>
                <CtaButton href="/visa-checklists" variant="secondary">
                  Visa Checklists
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
              How to use this visa guide
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
              European Dreams provides guidance and support. University
              requirements come from individual universities, and visa
              decisions plus official visa requirements come from the competent
              Italian diplomatic and consular authorities. Always verify
              current requirements — including checklists, fees and timelines —
              with the relevant mission before submitting.
            </p>
          </div>
        </section>

        {/* Process */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="The process"
            title="Italy Student Visa Process for Indian Students"
            intro="Ten stages from shortlisting a course to settling in Italy. Start early — consulate procedures and university deadlines run on separate clocks."
          />
          <ol className="mx-auto mt-10 max-w-3xl space-y-4">
            {processSteps.map((step, index) => (
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

        {/* Do Indians need a visa */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Who needs one"
              title="Do Indian Students Need a Student Visa for Italy?"
              intro="It depends on the length of your course. Confirm your case with the competent mission."
            />
            <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Long-term study (over 90 days)
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Bachelor&apos;s, Master&apos;s and other long programmes
                  generally require a national (D) study visa applied for
                  before travelling. This covers almost all Indian degree
                  students.
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Short-term study (under 90 days)
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Short courses, language programmes or exchanges under 90
                  days may fall under a Schengen (C) visa instead. Check the
                  mission&apos;s guidance for your exact situation.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Documents"
            title="Italy Student Visa Requirements"
            intro="Missions organise requirements as document categories. Exact items, formats and attestations depend on your course, your profile and the competent Italian mission."
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
            {[
              {
                title: "Passport",
                text: "Valid passport meeting the mission's validity and blank-page rules, plus photographs and completed forms.",
              },
              {
                title: "Admission and enrolment proof",
                text: "University admission letter and evidence of enrolment fee payment where the mission requires it.",
              },
              {
                title: "Universitaly pre-enrolment summary",
                text: "Validated pre-enrolment summary where the university and mission require it.",
              },
              {
                title: "Academic documents",
                text: "Certificates, transcripts and any recognition documents (such as DOV or alternatives) the university or mission specifies.",
              },
              {
                title: "Language proof where required",
                text: "Evidence of English or Italian proficiency where the programme or mission requires it — thresholds are not universal.",
              },
              {
                title: "Financial evidence",
                text: "Verifiable proof of adequate means as defined by the mission. No universal minimum is published here.",
              },
              {
                title: "Accommodation evidence",
                text: "Proof of boarding and lodging arrangements as specified by the mission.",
              },
              {
                title: "Insurance and travel documents",
                text: "Health insurance and travel or return-related documentation where the mission requires them.",
              },
              {
                title: "Covering letter and purpose",
                text: "A statement explaining the choice of course and institution, means of support and accommodation plans.",
              },
              {
                title: "Anything else the mission asks for",
                text: "Missions may request additional documents case by case — always work from the current checklist.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
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
        </section>

        {/* Universitaly */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Pre-enrolment"
              title="Universitaly Pre-Enrolment for Indian Students"
              intro="Pre-enrolment connects your university admission to your visa application. The university validates your submission, and the validated summary is used at the mission."
            />
            <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6 text-center sm:p-8">
              <p className="leading-7 text-[var(--muted-foreground)]">
                Submit pre-enrolment only after admission, within the
                procedure window announced for your academic year, and select
                the correct diplomatic mission. Only validated applications
                can proceed to the visa stage.
              </p>
              <OfficialLink href={UNIVERSITALY_STUDENTS_URL}>
                <span className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--primary)] px-7 py-3 font-bold text-white transition hover:opacity-90">
                  Open the official Universitaly portal
                </span>
              </OfficialLink>
            </div>
            <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
              New to the portal? Read our{" "}
              <Link
                href="/universitaly"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Universitaly pre-enrolment guide for Indian students
              </Link>{" "}
              — steps, documents and 2026/27 deadlines.
            </p>
          </div>
        </section>

        {/* Checklist */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Checklists"
            title="Italy Student Visa Checklist for Indian Students"
            intro="A checklist is the mission's current list of exactly what to submit and how. Because checklists are revised, always download the latest one for your jurisdiction."
          />
          <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 text-center sm:p-8">
            <p className="leading-7 text-[var(--muted-foreground)]">
              We maintain downloadable checklists for New Delhi, Mumbai,
              Bengaluru and Kolkata applicants, based on the official mission
              documents for each jurisdiction.
            </p>
            <div className="mt-6">
              <CtaButton href="/visa-checklists">
                Open visa checklists
              </CtaButton>
            </div>
          </div>
        </section>

        {/* Financial proof */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Funds"
              title="Financial Proof for Italy Student Visa"
              intro="You must show adequate, verifiable financial means for tuition and stay — but the definition of adequate comes from the mission, not from any fixed figure on this page."
            />
            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6">
              <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                Prepare bank statements, sponsorship documents and income
                evidence exactly as the current checklist describes, ensuring
                payments and balances are visible and consistent. Sponsorship
                generally needs verifiable support documents. Because required
                amounts and evidence rules can change, verify them with the
                competent mission before applying.
              </p>
            </div>
          </div>
        </section>

        {/* Accommodation */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Stay"
            title="Accommodation Proof for Italy Student Visa"
            intro="Missions ask for evidence of where you will stay. General options below are illustrative — your mission's checklist is decisive."
          />
          <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-3">
            {[
              "Hotel booking for the initial period",
              "Signed rental or housing agreement",
              "University or institute accommodation confirmation",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-center text-sm font-semibold leading-6 text-[var(--foreground)]"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* DOV and CIMEA */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Qualification recognition"
              title="DOV and CIMEA for Italy"
              intro="Foreign qualifications sometimes need formal recognition. Requirements vary by university, course and mission — neither document is universally mandatory."
            />
            <div className="mx-auto mt-8 grid max-w-5xl gap-6 sm:grid-cols-2">
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Declaration of Value (DOV)
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  The DOV is requested by the Higher Education Institution
                  itself and issued by the territorially competent mission
                  based on where the qualification was issued. Submission is
                  generally in person with its own checklist.{" "}
                  <OfficialLink href={MUMBAI_DOV_URL}>
                    Mumbai consulate DOV guidance
                  </OfficialLink>
                  .
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  CIMEA statements
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Some universities accept CIMEA comparability or verification
                  statements for foreign qualifications. Ask your specific
                  university what it accepts before starting either route.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Processing time */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Timelines"
            title="Italy Student Visa Processing Time"
            intro="Only official processing information is stated here. Timelines are indicative at best — never guaranteed."
          />
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <p className="text-sm leading-6 text-[var(--muted-foreground)]">
              Published consulate guidance notes that long-stay decisions can
              take up to 90 days from receipt under applicable law — longer if
              additional documents are requested. Processing also varies by
              season and workload. Apply as early as your mission allows and
              never book non-refundable travel around an assumed date.{" "}
              <OfficialLink href={MUMBAI_STUDY_URL}>
                Mumbai consulate study guidance
              </OfficialLink>
              .
            </p>
          </div>
        </section>

        {/* Fees */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Fees"
              title="Italy Student Visa Fees"
              intro="Visa and service fees change over time, so no figure is published here."
            />
            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6">
              <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                Check the current fee with the competent mission or its
                authorised visa application centre before your appointment,
                and confirm accepted payment methods in advance.
              </p>
            </div>
          </div>
        </section>

        {/* Interview */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Verification"
            title="Italy Student Visa Interview"
            intro="Verification practices differ by mission — prepare as if you will be interviewed, even where it is not certain."
          />
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <p className="text-sm leading-6 text-[var(--muted-foreground)]">
              Some missions verify applicants directly: for example, published
              Mumbai consulate guidance describes a mandatory video interview
              at submission for its jurisdiction. Other missions have their
              own procedures, which may include document verification or
              biometrics. Know your course, finances and plans thoroughly, and
              keep every statement consistent with your documents.{" "}
              <OfficialLink href={MUMBAI_STUDY_URL}>
                Mumbai consulate study guidance
              </OfficialLink>
              .
            </p>
          </div>
        </section>

        {/* After arrival */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Arrival"
              title="After Arriving in Italy"
              intro="The visa gets you to Italy; residence formalities keep you compliant once there."
            />
            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6">
              <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                Non-EU students generally declare their presence at the
                Questura (police headquarters) shortly after arrival and apply
                for the residence permit (permesso di soggiorno). Exact
                procedure and deadlines must be verified with the competent
                Italian authorities — do not rely on fixed timelines from
                unofficial sources.
              </p>
            </div>
            <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
              For housing, healthcare, transport and first-week checklists,
              see our{" "}
              <Link
                href="/living-in-italy-for-students"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                living in Italy for students guide
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Mistakes */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Avoid refusal risks"
            title="Common Mistakes Indian Students Should Avoid"
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
            {[
              {
                title: "Applying with an outdated checklist",
                text: "Missions revise checklists. Always download the current one for your jurisdiction.",
              },
              {
                title: "Ignoring university-specific requirements",
                text: "Admission rules, DOV needs and deadlines differ per university — the consulate cannot override them.",
              },
              {
                title: "Incorrect or incomplete documents",
                text: "Mismatched names, missing attestations or invisible payments are common, avoidable problems.",
              },
              {
                title: "Relying on unofficial visa information",
                text: "Social media figures for funds, timelines and interviews are often wrong. Trust the mission.",
              },
              {
                title: "Confusing admission with visa approval",
                text: "A university offer does not guarantee a visa. Each stage has its own decision-maker.",
              },
              {
                title: "Waiting until the last moment",
                text: "Admission, pre-enrolment and visa queues overlap. Late starts miss windows that do not reopen.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
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
        </section>

        {/* Explore + FAQ */}
        <section className="border-t border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Keep exploring"
              title="Plan the Rest of Your Journey"
              intro="The visa is one stage. These guides cover everything around it."
            />
            <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  href: "/study-in-italy",
                  title: "Study in Italy guide",
                  text: "Universities, courses, costs and the full journey.",
                },
                {
                  href: "/visa-checklists",
                  title: "Visa checklists",
                  text: "Downloadable jurisdiction-wise document lists.",
                },
                {
                  href: "/universities",
                  title: "Universities",
                  text: "Compare Italian universities and deadlines.",
                },
                {
                  href: "/courses",
                  title: "Courses",
                  text: "Find English-taught Bachelor's and Master's programmes.",
                },
              ].map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--primary)]/40"
                >
                  <h3 className="font-bold text-[var(--foreground)] transition group-hover:text-[var(--primary)]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                    {card.text}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mx-auto mt-14 max-w-3xl">
              <h2 className="text-center text-3xl font-bold tracking-tight text-[var(--foreground)]">
                Italy Student Visa FAQs
              </h2>
              <div className="mt-8 space-y-4">
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

            <div className="mx-auto mt-12 max-w-3xl rounded-3xl bg-[var(--foreground)] px-6 py-10 text-center text-[var(--background)] sm:px-10">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Need help with your Italy student visa?
              </h2>
              <p className="mx-auto mt-3 max-w-2xl opacity-80">
                Get personalised guidance on admission, pre-enrolment,
                documents and the visa application.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-4">
                <CtaButton href="/contact">Book a free consultation</CtaButton>
                <CtaButton href="/study-in-italy" variant="secondary">
                  Read the Study in Italy guide
                </CtaButton>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
