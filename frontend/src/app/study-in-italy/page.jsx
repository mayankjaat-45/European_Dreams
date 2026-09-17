import Link from "next/link";

import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

const SITE_URL = "https://www.europeandreamss.com";
const CANONICAL = `${SITE_URL}/study-in-italy`;

export const metadata = {
  title: "Study in Italy for Indian Students | Universities, Admission & Visa",
  description:
    "Study in Italy for Indian students. Explore Italian universities, English-taught courses, admission requirements, scholarships, tuition fees, application process and student visa guidance.",
  alternates: {
    canonical: CANONICAL,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Study in Italy for Indian Students | Universities, Admission & Visa",
    description:
      "Study in Italy for Indian students. Explore Italian universities, English-taught courses, admission requirements, scholarships, tuition fees, application process and student visa guidance.",
    url: CANONICAL,
    siteName: "European Dreams",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Study in Italy for Indian Students | Universities, Admission & Visa",
    description:
      "Study in Italy for Indian students. Explore Italian universities, English-taught courses, admission requirements, scholarships, tuition fees, application process and student visa guidance.",
  },
};

const breadcrumbItems = [
  { name: "Home", href: `${SITE_URL}/` },
  { name: "Study in Italy", href: CANONICAL },
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
  name: "Study in Italy for Indian Students | Universities, Admission & Visa",
  description:
    "Guide for Indian students planning to study in Italy: universities, courses, admission, Universitaly pre-enrolment, costs, scholarships and student visa.",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  breadcrumb: { "@id": `${CANONICAL}#breadcrumb` },
  inLanguage: "en-IN",
};

const popularUniversities = [
  {
    name: "University of Bologna",
    href: "/universities/university-of-bologna",
    note: "One of the oldest universities in Europe, with a wide choice of programmes.",
  },
  {
    name: "Sapienza University of Rome",
    href: "/universities/sapienza-university-of-rome",
    note: "A large public university in Rome offering many English-taught options.",
  },
  {
    name: "University of Milan",
    href: "/universities/university-of-milan",
    note: "A major public university with programmes across sciences and humanities.",
  },
  {
    name: "Polytechnic University of Milan",
    href: "/universities/polytechnic-university-of-milan",
    note: "A leading choice for architecture, design and engineering programmes.",
  },
  {
    name: "University of Padua",
    href: "/universities/university-of-padua",
    note: "A historic university with English-taught Bachelor's and Master's courses.",
  },
  {
    name: "University of Turin",
    href: "/universities/university-of-turin",
    note: "A well-established public university in northern Italy.",
  },
];

const journeySteps = [
  {
    title: "Evaluate your profile",
    text: "Review your previous qualification, subjects, grades and language readiness against the level you want to study.",
  },
  {
    title: "Choose your course",
    text: "Shortlist Bachelor's, Master's or single-cycle programmes that match your background and goals.",
  },
  {
    title: "Choose your university",
    text: "Compare universities by programme content, admission requirements, deadlines and fees.",
  },
  {
    title: "Prepare your documents",
    text: "Collect transcripts, certificates, passport and any programme-specific documents well in advance.",
  },
  {
    title: "Submit your application",
    text: "Apply through each university's own admission process before its deadline.",
  },
  {
    title: "Receive your admission",
    text: "If selected, the university confirms your admission or pre-admission for the intake.",
  },
  {
    title: "Complete pre-enrolment where required",
    text: "Students who need a visa generally complete pre-enrolment on Universitaly after admission.",
  },
  {
    title: "Apply for your student visa",
    text: "Apply with your admission, pre-enrolment summary and supporting documents.",
  },
  {
    title: "Prepare for departure",
    text: "Arrange accommodation, finances, insurance and travel once your plans are confirmed.",
  },
  {
    title: "Arrive in Italy",
    text: "Complete local formalities after arrival. Non-EU students generally declare their presence at the Questura (police headquarters) within 8 days and apply for the residence permit (permesso di soggiorno). The exact procedure and deadlines must be verified with the competent Italian authorities.",
  },
];

const faqs = [
  {
    question: "Can Indian students study in Italy?",
    answer:
      "Yes. Indian students are admitted to Italian universities every year across Bachelor's, Master's and single-cycle programmes. You apply to the university, and if you need a visa, you complete pre-enrolment and then apply for a student visa.",
  },
  {
    question: "How do I apply to Italian universities?",
    answer:
      "Each university runs its own admission process with its own requirements and deadlines. In general you choose a programme, prepare your documents, submit the university application, and wait for the admission decision. After admission, visa-seeking students complete Universitaly pre-enrolment.",
  },
  {
    question: "What is Universitaly pre-enrolment?",
    answer:
      "Universitaly is the Italian Ministry of University and Research portal where international students who require a study visa submit a pre-enrolment application after receiving university admission. The university validates it, and the summary is used for the visa application.",
  },
  {
    question: "Do Indian students need a student visa for Italy?",
    answer:
      "Yes, Indian citizens generally need a national study visa for long-term study in Italy. You apply after admission and pre-enrolment with supporting documents. Visa issuance is decided by the competent Italian authorities, so always verify current requirements with the relevant Embassy or Consulate.",
  },
  {
    question: "Are English-taught courses available in Italy?",
    answer:
      "Yes. Many Italian universities offer Bachelor's and Master's programmes taught fully or partly in English. Use the courses listing to filter English-taught options and always confirm the language of instruction for your specific programme.",
  },
  {
    question: "Are scholarships available for Indian students in Italy?",
    answer:
      "There are regional need-based scholarships, university-specific merit reductions or waivers, and Italian government (MAECI) grants in some years. Availability, eligibility and amounts vary, so no scholarship can be promised in advance — check each scheme's official call before applying.",
  },
  {
    question: "How much does it cost to study in Italy?",
    answer:
      "Tuition varies by institution, programme and student circumstances, and living costs vary by city. Public universities generally charge less than private institutions, but there is no single universal figure — always confirm the exact fees for your chosen programme.",
  },
  {
    question: "What documents are required to study in Italy?",
    answer:
      "Typical documents include previous qualification certificates and transcripts, a valid passport, language evidence where the programme requires it, and programme-specific items such as portfolios or entrance test results. Visa applications additionally require admission proof, pre-enrolment summary, financial evidence and other supporting documents specified by the mission.",
  },
];

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

export default function StudyInItalyPage() {
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
                Guide for the 2026/27 and 2027 intakes
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
                Study in Italy for Indian Students
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
                Everything Indian students need to plan higher education in
                Italy — universities, English-taught courses, admission
                requirements, application steps, Universitaly pre-enrolment,
                tuition costs, scholarships and the student visa process.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <CtaButton href="/universities">Explore Universities</CtaButton>
                <CtaButton href="/courses" variant="secondary">
                  Explore Courses
                </CtaButton>
                <CtaButton href="/contact" variant="secondary">
                  Get Free Consultation
                </CtaButton>
              </div>
            </div>
          </div>
        </section>

        {/* How to use this guide */}
        <section className="border-b border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              Last updated: September 2026
            </p>
            <h2 className="mt-2 text-lg font-bold text-[var(--foreground)]">
              How to use this guide
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
              European Dreams provides guidance and support for each step
              below. University-specific admission requirements and deadlines
              must be confirmed with the university itself, while visa
              requirements and decisions are handled by the competent Italian
              authorities. For current rules, always check official sources
              such as Universitaly, the MAECI Study in Italy portal and the
              relevant Italian consulate.
            </p>
          </div>
        </section>

        {/* 2. Why study in Italy */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Why Italy"
            title="Why Study in Italy?"
            intro="Italy combines historic public universities, growing English-taught provision and a welcoming environment for international students."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
              <h3 className="text-xl font-bold text-[var(--foreground)]">
                Public universities
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                Italy has an extensive network of public universities across
                its regions. Public institutions generally charge lower tuition
                than private ones, with exact fees set per institution and
                programme.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
              <h3 className="text-xl font-bold text-[var(--foreground)]">
                English-taught programmes
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                Many Italian universities now offer Bachelor&apos;s and
                Master&apos;s programmes taught in English.{" "}
                <Link
                  href="/courses"
                  className="font-semibold text-[var(--primary)] hover:underline"
                >
                  Browse English-taught courses
                </Link>{" "}
                and confirm the language of instruction for each programme.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
              <h3 className="text-xl font-bold text-[var(--foreground)]">
                Scholarship routes
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                Regional need-based scholarships, university merit measures and
                Italian government grants support eligible international
                students. Each scheme has its own criteria and deadlines.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
              <h3 className="text-xl font-bold text-[var(--foreground)]">
                Wide academic choice
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                From engineering, architecture and design to medicine,
                humanities, business and data science, Italian universities
                cover most major fields at Bachelor&apos;s and Master&apos;s
                level.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
              <h3 className="text-xl font-bold text-[var(--foreground)]">
                International student experience
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                University cities across Italy host growing international
                student communities, with support services, student housing
                options and cultural life that help newcomers settle in.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
              <h3 className="text-xl font-bold text-[var(--foreground)]">
                A structured admission path
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                The route from India is well defined: university admission,
                Universitaly pre-enrolment and then the student visa
                application. The steps below walk through each stage.
              </p>
            </article>
          </div>
        </section>

        {/* 3. Journey from India */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="From India to Italy"
              title="Study in Italy from India: the Overall Journey"
              intro="Most Indian students follow the same broad path. Each stage has its own requirements, so start early and track every deadline."
            />
            <ol className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Profile and course selection",
                "University application",
                "Admission decision",
                "Universitaly pre-enrolment",
                "Student visa application",
                "Arrival in Italy",
              ].map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="pt-1.5 font-semibold text-[var(--foreground)]">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 4. Universities */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Universities"
            title="Universities in Italy"
            intro="Compare universities by programme content, admission requirements, application deadlines and tuition fees before you apply."
          />
          <div className="mt-8 text-center">
            <CtaButton href="/universities">
              Compare all universities in Italy
            </CtaButton>
          </div>
        </section>

        {/* 5. Courses */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Programmes"
              title="Courses to Study in Italy"
              intro="Italian universities generally offer three-year Bachelor's degrees (Laurea), two-year Master's degrees (Laurea Magistrale) and five- to six-year single-cycle programmes in fields such as Medicine and Architecture. Durations and structures vary by programme."
            />
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Bachelor&apos;s programmes
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Undergraduate options across engineering, business, sciences,
                  humanities and more, including English-taught choices.
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Master&apos;s programmes
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Postgraduate specialisation with a strong English-taught
                  offering in many technical and management fields.
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Single-cycle programmes
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Long single-cycle degrees for regulated professions such as
                  Medicine, Dentistry and Architecture, with specific entry
                  tests where applicable.
                </p>
              </article>
            </div>
            <div className="mt-8 text-center">
              <CtaButton href="/courses">Find your course in Italy</CtaButton>
            </div>
          </div>
        </section>

        {/* 6. Admission requirements */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Eligibility"
            title="Study in Italy Admission Requirements"
            intro="Requirements vary by university and programme. There is no single universal percentage or language score — always check the official page of your chosen programme."
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Previous qualification
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Class 12 for Bachelor&apos;s or a recognised Bachelor&apos;s
                degree for Master&apos;s, with subjects relevant to the
                programme where required.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Academic transcripts
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Mark sheets, certificates and sometimes syllabus details or
                credential evaluation, as specified by the university.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Language requirements
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                English proficiency evidence for English-taught programmes, or
                Italian where the programme requires it. Accepted tests and
                minimum levels differ per programme.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Passport and programme-specific items
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                A valid passport plus anything the programme asks for, such as
                a portfolio, motivation letter, CV or entrance examination.
              </p>
            </article>
          </div>
        </section>

        {/* 7. How to apply */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Application process"
              title="How to Apply to Italian Universities"
              intro="Individual universities set their own requirements and deadlines. The steps below describe the typical process."
            />
            <ol className="mx-auto mt-10 max-w-3xl space-y-4">
              {[
                "Shortlist programmes and verify eligibility, language requirements and deadlines on each university website.",
                "Prepare documents: transcripts, certificates, passport, language evidence and programme-specific items.",
                "Submit the university application through its admission portal before the deadline.",
                "Complete any entrance test or interview the programme requires.",
                "Accept the admission offer and follow the university's enrolment instructions.",
                "Complete Universitaly pre-enrolment if you need a student visa.",
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
              For the complete application flow, see our{" "}
              <Link
                href="/italy-university-admission"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Italy university admission guide
              </Link>
              .
            </p>
          </div>
        </section>

        {/* 8. Universitaly */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Pre-enrolment"
            title="Universitaly Pre-Enrolment"
            intro="After admission, international students who require a visa for Italy generally submit a pre-enrolment application on the official Universitaly portal. The university validates it, and the validated summary supports the visa application."
          />
          <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 text-center sm:p-8">
            <p className="leading-7 text-[var(--muted-foreground)]">
              Pre-enrolment windows and procedures are announced for each
              academic year. Use the official portal and follow your
              university&apos;s instructions exactly.
            </p>
            <a
              href="https://www.universitaly.it"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background)] px-7 py-3 font-bold text-[var(--foreground)] transition hover:border-[var(--primary)]"
            >
              Visit the official Universitaly portal
            </a>
            <p className="mt-6 text-sm leading-6 text-[var(--muted-foreground)]">
              Confused about how pre-enrolment fits around admission and the
              visa? See our{" "}
              <Link
                href="/universitaly"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Universitaly pre-enrolment guide for Indian students
              </Link>
              .
            </p>
          </div>
        </section>

        {/* 9. Costs */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Tuition and living costs"
              title="Cost of Studying in Italy"
              intro="Tuition varies by institution, programme and student circumstances, and living costs vary significantly by city. Confirm exact figures for your chosen programme rather than relying on a single universal number."
            />
            <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Tuition fees
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Public universities generally charge lower annual tuition
                  than private institutions, often adjusted to family income
                  and merit. Check the fee regulations published by each
                  university.
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Living expenses
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Accommodation, food, transport and study materials depend on
                  the city and lifestyle. Larger cities typically cost more
                  than smaller university towns.
                </p>
              </article>
            </div>
            <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)]">
              <table className="w-full text-left text-sm">
                <caption className="px-5 pb-3 pt-5 text-left font-bold text-[var(--foreground)]">
                  Indicative ranges (European Commission country profile for
                  Italy)
                </caption>
                <tbody className="divide-y divide-[var(--border)]">
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      Public university tuition
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Approximately €900–€4,000 per year
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      Private institution tuition
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Approximately €6,000–€20,000+ per year
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      Living costs
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Approximately €700–€1,100 per month, depending on the
                      city
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="border-t border-[var(--border)] px-5 py-4 text-xs leading-5 text-[var(--muted-foreground)]">
                These are indicative ranges only — actual costs vary by
                university, programme, city and individual circumstances, and
                fees may depend on declared family income. Source:{" "}
                <a
                  href="https://education.ec.europa.eu/study-in-europe/country-profiles/italy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--primary)] hover:underline"
                >
                  European Commission — Study in Italy country profile
                </a>
                .
              </p>
            </div>
            <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
              For a detailed breakdown of tuition, living costs and how to
              verify your exact fee, see our{" "}
              <Link
                href="/cost-of-studying-in-italy"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                cost of studying in Italy guide for Indian students
              </Link>
              .
            </p>
          </div>
        </section>

        {/* 10. Scholarships */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Funding"
            title="Scholarships in Italy for Indian Students"
            intro="Several funding routes exist, but none can be promised in advance. Every scheme publishes its own eligibility rules, benefits and deadlines."
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-3">
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Regional (DSU) scholarships
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Need- and merit-based support administered by regional student
                aid bodies under Italy&apos;s right-to-study (DSU) system,
                generally assessed on income and merit. Benefits, eligibility
                and deadlines vary by region and year.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                University scholarships
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Merit reductions, tuition waivers or awards offered directly
                by individual universities to strong applicants. Check each
                university&apos;s official call — criteria and amounts differ.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Government (MAECI) grants
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Grants provided by Italy&apos;s Ministry of Foreign Affairs
                and International Cooperation for foreign students, announced
                in selected years. Read the official call carefully before
                applying.{" "}
                <a
                  href="https://studyinitaly.esteri.it/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--primary)] hover:underline"
                >
                  MAECI Study in Italy portal
                </a>
                .
              </p>
            </article>
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
            Students from India should also check Invest Your Talent in Italy,
            a programme combining postgraduate courses with internships at
            Italian companies for students from selected countries.
            Availability and criteria vary by year — see the official Study in
            Italy portal. For an overview of all routes, see the{" "}
            <a
              href="https://education.ec.europa.eu/study-in-europe/country-profiles/italy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              European Commission country profile
            </a>
            .
          </p>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
            For the full breakdown — DSU and regional scholarships, MAECI
            government grants, university merit awards, documents and
            deadlines — see our{" "}
            <Link
              href="/italy-scholarships"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              Italy scholarships guide for Indian students
            </Link>
            .
          </p>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
            For the latest scholarship updates and explainers, see our{" "}
            <Link
              href="/blogs"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              study in Italy blogs
            </Link>
            .
          </p>
        </section>

        {/* 11. Student visa */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Visa"
              title="Italy Student Visa for Indian Students"
              intro="The visa stage follows admission and pre-enrolment. Visa issuance is decided by the competent Italian authorities — prepare carefully and verify current requirements."
            />
            <ol className="mx-auto mt-10 max-w-3xl space-y-4">
              {[
                "Secure university admission and complete Universitaly pre-enrolment.",
                "Identify the competent mission for your jurisdiction and book your appointment.",
                "Prepare supporting documents: admission proof, pre-enrolment summary, financial evidence, accommodation, insurance and other items the mission specifies.",
                "Attend the appointment and provide biometrics where required.",
                "Await the decision and collect your passport with the visa if granted.",
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
            <p className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 text-sm leading-6 text-[var(--muted-foreground)]">
              Missions commonly also ask for financial evidence,
              accommodation evidence and other supporting documents alongside
              admission and pre-enrolment proof. There is no single universal
              minimum — thresholds and accepted evidence are set by the
              mission. Prepare with our{" "}
              <Link
                href="/visa-checklists"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                visa document checklists
              </Link>{" "}
              and the{" "}
              <a
                href="https://www.universitaly.it/studenti-stranieri"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                official Universitaly guidance for foreign students
              </a>
              . For the full process, see our{" "}
              <Link
                href="/italy-student-visa"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Italy student visa guide
              </Link>
              .
            </p>
            <div className="mt-8 text-center">
              <CtaButton href="/visa-checklists">
                View visa document checklists
              </CtaButton>
            </div>
          </div>
        </section>

        {/* Work and post-study */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Careers"
            title="Work While You Study and After Graduation"
            intro="Part-time work can support your stay, and graduates may explore post-study options — both depend on current rules and your individual situation."
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Part-time work during studies
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                International students can generally work part-time subject to
                applicable Italian rules and residence-permit conditions —
                non-EU students may work up to 20 hours per week with a valid
                residence permit. Confirm the current limits before relying on
                work income.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                After graduation
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Graduates may be able to explore post-study stay and employment
                routes under current immigration rules. Nothing is automatic:
                eligibility depends on the individual case, and rules can
                change, so verify with official Italian authorities. No
                employment or residence outcome can be promised.
              </p>
            </article>
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
            Source:{" "}
            <a
              href="https://education.ec.europa.eu/study-in-europe/country-profiles/italy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              European Commission — Study in Italy country profile
            </a>
            .
          </p>
        </section>

        {/* 12. Intakes and deadlines */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Planning"
            title="Intakes and Application Deadlines"
            intro="Deadlines vary by university, programme and intake. There is no universal Italian application deadline — check each programme page and apply early, since visa timelines add extra weeks."
          />
          <div className="mt-8 text-center">
            <CtaButton href="/universities">
              Check universities and deadlines
            </CtaButton>
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
            For September and February intakes, the 2026/27 timeline and
            verified university examples, see our{" "}
            <Link
              href="/italy-university-intakes"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              Italy university intakes and deadlines guide
            </Link>
            .
          </p>
        </section>

        {/* 13. English-taught courses */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Language of instruction"
              title="English-Taught Courses in Italy"
              intro="Many Italian universities offer programmes taught fully or partly in English, particularly at Master's level and in technical fields. Always confirm the language of instruction for your exact programme and intake."
            />
            <div className="mt-8 text-center">
              <CtaButton href="/courses">
                Explore English-taught courses
              </CtaButton>
            </div>
            <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
              For Bachelor&apos;s and Master&apos;s examples, language
              requirements and verification steps, see our{" "}
              <Link
                href="/english-taught-courses-in-italy"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                English-taught courses in Italy guide
              </Link>
              .
            </p>
          </div>
        </section>

        {/* 14. Popular universities */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Popular choices"
            title="Popular Italian Universities"
            intro="Start your comparison with these well-known universities, then explore the full listing."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {popularUniversities.map((university) => (
              <Link
                key={university.href}
                href={university.href}
                className="group rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/40 hover:shadow-xl"
              >
                <h3 className="text-xl font-bold text-[var(--foreground)] transition group-hover:text-[var(--primary)]">
                  {university.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                  {university.note}
                </p>
                <span className="mt-4 inline-block text-sm font-bold text-[var(--primary)]">
                  View university
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 15. Step by step */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Your roadmap"
              title="Study in Italy Step-by-Step"
              intro="A clear ten-stage journey from first shortlist to arrival."
            />
            <ol className="mx-auto mt-10 max-w-3xl space-y-4">
              {journeySteps.map((step, index) => (
                <li
                  key={step.title}
                  className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
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
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <CtaButton href="/contact">Get Free Consultation</CtaButton>
              <CtaButton href="/blogs" variant="secondary">
                Read study guides
              </CtaButton>
            </div>
          </div>
        </section>

        {/* 16. FAQ */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="FAQ"
            title="Study in Italy: Frequently Asked Questions"
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
          <div className="mt-12 rounded-3xl bg-[var(--foreground)] px-6 py-10 text-center text-[var(--background)] sm:px-10">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to start your study in Italy journey?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl opacity-80">
              Get personalised guidance on universities, courses, applications,
              scholarships and the Italy student visa.
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
