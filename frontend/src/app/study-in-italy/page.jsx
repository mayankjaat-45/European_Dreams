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

export default function StudyInItalyPage() {
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
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
            <h3 className="font-bold text-[var(--foreground)]">
              Why Indian students consider Italy
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
              For many Indian students, Italy is considered because public
              universities set tuition per institution and programme — often
              with income-based assessment that can mean two students on the
              same course pay different amounts — and because need-based
              regional (DSU), university merit and government (MAECI) support
              routes exist where you meet the specific call. Many
              Bachelor&apos;s and Master&apos;s programmes are offered in
              English, so you can study without Italian as the language of
              instruction where the programme confirms it. The overall process
              is structured — university admission, then Universitaly
              pre-enrolment, then the student visa — and living costs vary
              significantly by city rather than being fixed nationally.
            </p>
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
            <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
              Typical flow at a glance: Research → Check eligibility → Choose
              programme → Apply → Admission → Scholarship / ISEE Parificato
              (where applicable) → Universitaly pre-enrolment → Student visa →
              Travel → Residence formalities (permesso di soggiorno) after
              arrival.
            </p>
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
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">
                Bachelor&apos;s in Italy — what to check
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Bachelor&apos;s (Laurea) programmes generally admit students
                completing Class 12 or equivalent — but subject expectations,
                grade thresholds and language rules are set per programme, so
                there is no single universal eligibility rule. Check whether
                your stream covers the programme&apos;s expected subjects, and
                whether the course is open-access or limited / programmed-access
                — selection routes differ. Always confirm requirements on the
                official programme page.
              </p>
            </article>
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">
                Master&apos;s in Italy — what to check
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Master&apos;s (Laurea Magistrale) admission centres on the
                relevance of your Bachelor&apos;s background plus
                programme-specific prerequisites. Programmes expect a
                Bachelor&apos;s in a related field, sometimes with minimum
                credits in specific subjects. Many universities pre-evaluate
                transcripts before the formal application — use pre-evaluation
                where the university offers it. Always confirm prerequisites on
                the official programme call.
              </p>
            </article>
          </div>
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h3 className="font-bold text-[var(--foreground)]">
              Do I need an entrance test?
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
              Requirements vary by programme and year. Entrance tests assess
              readiness and rank you for that programme&apos;s places;
              qualification recognition (CIMEA / Declaration of Value) is a
              separate process — you may need one, both or neither. Check the
              official programme call (bando) for your exact course.
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted-foreground)]">
              <li className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
                <span className="font-semibold text-[var(--foreground)]">
                  Medicine &amp; regulated programmes:
                </span>{" "}
                Programme-specific entrance requirements and testing may apply
                where the programme lists them — nationally regulated or
                limited-access courses such as Medicine and Architecture may use
                national or university-run entrance examinations.
              </li>
              <li className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
                <span className="font-semibold text-[var(--foreground)]">
                  Engineering / Economics &amp; similar:
                </span>{" "}
                CISIA TOLC where the programme requires it, or CEnT-S where the
                university has adopted it for specific scientific areas — only
                where listed in the call. Depending on the programme, a TOLC may
                be mandatory, optional for ranking, or not required at all.
              </li>
              <li className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
                <span className="font-semibold text-[var(--foreground)]">
                  Design / Architecture:
                </span>{" "}
                Portfolio, interview or other programme-specific selection
                methods may apply where the course specifies them.
              </li>
              <li className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
                <span className="font-semibold text-[var(--foreground)]">
                  Other programmes:
                </span>{" "}
                Many courses select on documents alone. Always verify whether a
                test applies — and which one — on the official call; there is
                no single national entrance score that applies to every Italian
                course.
              </li>
            </ul>
            <p className="mt-3 text-xs leading-5 text-[var(--muted-foreground)]">
              Sources:{" "}
              <a
                href="https://www.cisiaonline.it/en/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                CISIA (official TOLC / CEnT-S information)
              </a>
              {" · "}
              <a
                href="https://www.cimea.it/EN/pagina-attestati-di-comparabilita-e-verifica"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                CIMEA comparability services
              </a>
              . For the detailed comparison of entrance tests vs qualification
              recognition, see{" "}
              <Link
                href="/italy-university-admission#entrance-tests-qualification-recognition"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                entrance tests and qualification recognition
              </Link>
              .
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
            Requirements are not universal — every programme sets its own
            criteria. For the complete requirements and step-by-step process,
            see{" "}
            <Link
              href="/italy-university-admission"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              Italy university admission requirements and process
            </Link>
            .
          </p>
        </section>

        {/* 6b. Medicine in Italy */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Medicine"
            title="Medicine in Italy: IMAT, NEET and Programme-Specific Requirements"
            intro="Medicine is a regulated, limited-access area — every requirement is programme-specific. Always verify the current official programme call before relying on any test or eligibility rule."
          />
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <p className="text-sm leading-6 text-[var(--muted-foreground)]">
              Medicine and Surgery admission is governed by the individual
              university&apos;s call (bando) for that intake. Whether IMAT or
              another selection route is used depends on the programme&apos;s
              current admission route — where the programme is English-taught,
              IMAT may be relevant where the current route uses it. The call
              also defines academic prerequisites, language requirements,
              available places, rankings and deadlines for that year, so no
              score or cutoff is universal.
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
              For Indian students, additional NEET-related requirements may
              apply depending on the programme and applicable Indian rules.
              Italian university admission requirements and Indian
              regulatory/eligibility requirements are separate — a university
              admission does not replace any Indian eligibility check, and an
              Indian eligibility check does not replace the Italian
              university&apos;s call. Verify both sides with the current
              official sources before planning around Medicine.
            </p>
            <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">
                Practical checks before you apply to Medicine
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--muted-foreground)]">
                <li>Confirm whether the programme is English-taught.</li>
                <li>Check the current official admission call for that intake.</li>
                <li>
                  Check whether IMAT or another selection route is required
                  where the call lists it.
                </li>
                <li>
                  Check programme-specific academic prerequisites for Medicine.
                </li>
                <li>
                  Check applicable NEET and related Indian eligibility
                  requirements with the relevant official authority.
                </li>
                <li>
                  Check application, Universitaly pre-enrolment and student visa
                  steps separately — each has its own timeline.
                </li>
              </ul>
            </div>
            <p className="mt-4 text-xs leading-5 text-[var(--muted-foreground)]">
              Medicine places and selection methods are set per call, so no
              universal seat count or cutoff is stated here. For current
              procedures, see the official portal at{" "}
              <a
                href="https://www.universitaly.it"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Universitaly
              </a>{" "}
              and the specific university&apos;s programme page and call.
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
            For the detailed admission and qualification-recognition context,
            see{" "}
            <Link
              href="/italy-university-admission"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              See the Italy university admission guide
            </Link>
            .
          </p>
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
              . For programme-specific entrance requirements and how
              qualification recognition differs from entrance tests, see{" "}
              <Link
                href="/italy-university-admission#entrance-tests-qualification-recognition"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Italy university admission, entrance tests and qualification
                recognition
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
                  Italy) — INR at approx. €1 ≈ ₹93, rates change
                </caption>
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                    <th
                      scope="col"
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]"
                    >
                      EC indicative range
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]"
                    >
                      Approx. INR
                    </th>
                  </tr>
                </thead>
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
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      ≈ ₹84k–₹3.72L per year
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
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      ≈ ₹5.58L–₹18.6L+ per year
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
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      ≈ ₹65k–₹1.02L per month
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="border-t border-[var(--border)] px-5 py-4 text-xs leading-5 text-[var(--muted-foreground)]">
                These are indicative ranges only — actual costs vary by
                university, programme, city and individual circumstances, and
                fees may depend on declared family income. Indicative INR
                conversions only; actual university fees depend on programme,
                income-based assessment, university rules and applicable
                reductions. INR at approx. €1 ≈ ₹93 — exchange rates change;
                verify the rate when budgeting. Source:{" "}
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
            <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">
                Why two students can pay different fees: ISEE &amp; ISEE
                Parificato
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Fees commonly depend on declared family income, so two
                students on the same course can pay different amounts. Read
                your university&apos;s income-band rules carefully. For
                families whose income and assets are outside Italy, universities
                use an equivalent indicator (ISEE Parificato / ISEE University
                Equivalent) instead of the standard ISEE. As a labelled
                example, the DSU Toscana 2026/27 call set thresholds of ISEE
                €27,000 and ISPE €60,000 — other regions and universities set
                their own. Many universities also offer reductions or full
                exemptions on merit or income grounds through separate calls
                with their own deadlines.
              </p>
            </div>
            <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
              <Link
                href="/cost-of-studying-in-italy#location-matters"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                See our city cost guide for a practical comparison of living-cost
                tiers across Italian student cities.
              </Link>
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
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
          <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)]">
            <div className="bg-[var(--card)] px-5 py-4">
              <h3 className="font-bold text-[var(--foreground)]">
                2026/27 scholarship snapshot — verified examples
              </h3>
              <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
                Examples only — every scheme publishes its own annual call.
                Scholarship rules, eligible countries and deadlines vary by
                scheme and university.
              </p>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-y border-[var(--border)] bg-[var(--background)]">
                  <th
                    scope="col"
                    className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]"
                  >
                    Scheme
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]"
                  >
                    2026/27 example
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]"
                  >
                    What it offered
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                <tr>
                  <th
                    scope="row"
                    className="px-5 py-4 font-semibold text-[var(--foreground)]"
                  >
                    MAECI government grants
                  </th>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Applications closed at 14:00 Italian time on 26 March 2026
                  </td>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    €10,800 total (9 months) per the official 2026-2027 call;
                    paid in instalments conditional on presence, enrolment and
                    academic progress
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-5 py-4 font-semibold text-[var(--foreground)]"
                  >
                    DSU Toscana (regional)
                  </th>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    20 July–7 September 2026 for degree courses
                  </td>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    ISEE €27,000 and ISPE €60,000 thresholds (this region/year
                    only); need- and merit-based benefits vary by region and
                    year
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-5 py-4 font-semibold text-[var(--foreground)]"
                  >
                    University of Padua
                  </th>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    International Excellence Scholarships 2026/27
                  </td>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Up to 69 scholarships — one per English-taught programme —
                    each with a tuition fee-waiver and an €8,000 annual
                    allowance; eligible students considered automatically
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="border-t border-[var(--border)] px-5 py-4 text-xs leading-5 text-[var(--muted-foreground)]">
              These are verified 2026/27 examples, not guarantees — India
              featured on the official MAECI 2026-2027 eligible-countries list,
              but eligibility is reset each year. Scholarship amounts, thresholds
              and deadlines are set anew in each annual call. No scholarship
              can be promised in advance.
            </p>
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
            <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 text-left">
              <h3 className="font-bold text-[var(--foreground)]">
                India-specific visa &amp; document context
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--muted-foreground)]">
                <li>
                  <span className="font-semibold text-[var(--foreground)]">
                    Jurisdiction &amp; checklists:
                  </span>{" "}
                  Visa and document procedures depend on the competent Italian
                  mission for your jurisdiction. Always prepare from the current
                  checklist of that mission. See our{" "}
                  <Link
                    href="/italy-student-visa"
                    className="font-semibold text-[var(--primary)] hover:underline"
                  >
                    Italy student visa guide for Indian students
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/visa-checklists"
                    className="font-semibold text-[var(--primary)] hover:underline"
                  >
                    jurisdiction-wise visa document checklists
                  </Link>
                  .
                </li>
                <li>
                  <span className="font-semibold text-[var(--foreground)]">
                    CIMEA vs Declaration of Value (DOV):
                  </span>{" "}
                  Qualification-recognition requirements are programme and
                  university dependent — not every Indian student needs a CIMEA
                  Statement and not every student needs a DOV. Depending on the
                  university and course, some institutions accept a CIMEA
                  Statement of Comparability or Verification, others request a
                  Declaration of Value from the competent Italian mission, and
                  some require neither. Confirm what your specific university
                  requires — see{" "}
                  <Link
                    href="/italy-university-admission#entrance-tests-qualification-recognition"
                    className="font-semibold text-[var(--primary)] hover:underline"
                  >
                    entrance tests &amp; qualification recognition
                  </Link>
                  .
                </li>
                <li>
                  <span className="font-semibold text-[var(--foreground)]">
                    Medicine / MBBS programmes:
                  </span>{" "}
                  Medicine and other regulated programmes have
                  programme-specific requirements and entrance testing — for
                  example, nationally regulated or university entrance
                  examinations where applicable. Requirements vary by programme
                  and year; always check the official programme call.
                </li>
              </ul>
            </div>
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
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
            For accommodation, living costs, transport, healthcare and
            arrival checklists, see our{" "}
            <Link
              href="/living-in-italy-for-students"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              living in Italy for students guide
            </Link>
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
          <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <div className="bg-[var(--card)] px-5 py-4">
              <h3 className="font-bold text-[var(--foreground)]">
                Deadlines at a glance — 2026/27 verified examples
              </h3>
              <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
                Each row is one institution&apos;s 2026/27 position — never an
                Italy-wide rule. Your course, level and applicant category can
                carry different dates — always read the current call.
              </p>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-y border-[var(--border)] bg-[var(--background)]">
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
                    Programme &amp; intake context
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]"
                  >
                    Official deadline example
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]"
                  >
                    Important caveat
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
                    Master&apos;s, foreign qualification; September 2026 and
                    February 2027 Engineering intakes
                  </td>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Sept intake calls 1 Oct–1 Dec 2025 and 13 Jan–26 Feb 2026;
                    Feb 2027 Engineering call 18 May–18 Jun 2026.{" "}
                    <a
                      href="https://www.polimi.it/en/prospective-students/how-to-apply/admission-to-laurea-magistrale/foreign-qualification/deadlines"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[var(--primary)] hover:underline"
                    >
                      Official dates
                    </a>
                  </td>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Second semester Engineering only, with named programme
                    exclusions
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-5 py-4 font-semibold text-[var(--foreground)]"
                  >
                    University of Padua
                  </th>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    English-taught degrees; unlimited vs limited-place
                    programmes
                  </td>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Unlimited places: Call One 2 Nov 2025–2 Feb 2026, Call Two 2
                    Mar–2 May 2026; limited places, non-EU abroad: 7 Jan–7 Mar
                    2026.{" "}
                    <a
                      href="https://www.unipd.it/en/studiare-inglese-come-fare-domanda"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[var(--primary)] hover:underline"
                    >
                      Official dates
                    </a>
                  </td>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Later calls restricted to EU and Italy-resident applicants
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
                    English-taught programmes, pre-selection then call
                  </td>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Non-EU visa-seeking pre-selection 22 Dec 2025–15 May 2026;
                    Universitaly by 30 Jun 2026; EU/equivalent to 31 Jul 2026.{" "}
                    <a
                      href="https://www.uniroma1.it/en/en/admissions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[var(--primary)] hover:underline"
                    >
                      Official dates
                    </a>
                  </td>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Pre-selection alone does not enrol; the programme call
                    completes admission
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
                    Separate undergraduate and postgraduate application windows
                  </td>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Postgraduate 25 Nov 2025–29 Jan 2026; undergraduate and 5–6
                    year programmes 19 Feb–15 Apr 2026.{" "}
                    <a
                      href="https://www.en.unito.it/studying-unito/international-degree-seeking-students/application-international-students"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[var(--primary)] hover:underline"
                    >
                      Official dates
                    </a>
                  </td>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Later 2026 calls reserved to Italians, EU and Italy
                    residents
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="border-t border-[var(--border)] px-5 py-4 text-xs leading-5 text-[var(--muted-foreground)]">
              All examples are 2026/27 editions verified on the linked official
              pages. Your course, level and applicant category can carry
              different dates — always read the current call.
            </p>
          </div>
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/30 dark:bg-amber-950/20">
            <h3 className="font-bold text-[var(--foreground)]">
              Understand the three different deadlines
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--muted-foreground)]">
              <li>
                <span className="font-semibold text-[var(--foreground)]">
                  University / programme deadline
                </span>{" "}
                — the date your chosen university sets for its own application
                call (examples in the table above). This is the binding date
                for admission.
              </li>
              <li>
                <span className="font-semibold text-[var(--foreground)]">
                  Universitaly / pre-enrolment timing
                </span>{" "}
                — the window the university defines for validating your
                pre-enrolment on the official portal after admission.
              </li>
              <li>
                <span className="font-semibold text-[var(--foreground)]">
                  Visa-related national backstop: 30 November 2026
                </span>{" "}
                — the latest date by which visa applications for 2026/27
                ordinary degree courses (Bachelor&apos;s, Master&apos;s,
                single-cycle) may be submitted under the current national
                procedure. This is a final ceiling, not a university application
                deadline. Institutions may require far earlier dates, and this
                date does not create extra time beyond the university&apos;s
                own deadline.
              </li>
            </ul>
          </div>
          <div className="mt-8 text-center">
            <CtaButton href="/universities">
              Check universities and deadlines
            </CtaButton>
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
            For September and February intakes, the full 2026/27 timeline and
            all verified university examples, see our{" "}
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
            <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 text-left">
              <h3 className="font-bold text-[var(--foreground)]">
                What Indian students should know about English requirements
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--muted-foreground)]">
                <li>
                  English proof is programme-specific — only where the
                  programme&apos;s call names a test (IELTS, TOEFL, Cambridge
                  or others) is that evidence required. No single IELTS score
                  applies across Italy.
                </li>
                <li>
                  Required levels can differ by programme, including B1 vs B2
                  cases. Padua&apos;s 2026/27 guidance, for example, assigns B1
                  or B2 depending on the programme and call — always check your
                  exact call.
                </li>
                <li>
                  A previous degree taught entirely in English may sometimes be
                  accepted under programme-specific conditions — for example,
                  where documentation explicitly shows the language of
                  instruction. Whether this is accepted depends on the call.
                </li>
              </ul>
            </div>
            <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
              For Bachelor&apos;s and Master&apos;s examples, how to verify the
              language of instruction and the full requirement table, see our{" "}
              <Link
                href="/english-taught-courses-in-italy"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                English-taught courses in Italy guide for Indian students
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

        {/* 15b. Common Mistakes */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Avoidable errors"
              title="Common Mistakes Indian Students Make When Planning to Study in Italy"
              intro="Small planning errors cause most avoidable delays. Verify every detail on official university and government sources — not on generic lists."
            />
            <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Relying on generic deadlines",
                  text: "Deadlines are programme and intake-specific. A date that applied to another university or intake does not apply to yours — always check the official call of the exact programme.",
                },
                {
                  title: "Confusing admission with visa approval",
                  text: "University admission is decided by the university; the study visa is decided by the competent Italian authorities. Admission does not guarantee a visa — each stage has its own decision-maker.",
                },
                {
                  title: "Starting Universitaly and visa preparation too late",
                  text: "Universitaly pre-enrolment windows and visa appointments run on tight, non-extendable calendars. Start document collection well before admission arrives.",
                },
                {
                  title: "Ignoring programme-specific entrance tests",
                  text: "Some programmes require CISIA TOLC, CEnT-S where adopted, or a university-specific test or interview. Whether a test applies — and which one — varies by programme, so check the official call.",
                },
                {
                  title: "Delaying qualification and document checks",
                  text: "Whether a CIMEA Statement, Declaration of Value or other recognition document is needed depends on the university and course. Confirm early and allow time for issuing authorities.",
                },
                {
                  title: "Relying on unofficial information",
                  text: "Generic blogs and social posts often misstate fees, deadlines and document rules. Trust official university pages, Universitaly, CIMEA, CISIA and the competent Italian mission — verify before you act.",
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
