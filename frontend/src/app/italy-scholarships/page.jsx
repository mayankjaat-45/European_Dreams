import Link from "next/link";

import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

const SITE_URL = "https://www.europeandreamss.com";
const CANONICAL = `${SITE_URL}/italy-scholarships`;

const PAGE_TITLE = "Italy Scholarships for Indian Students: DSU, MAECI & University Aid";
const PAGE_DESCRIPTION =
  "Italy scholarships for Indian students: DSU, MAECI grants, Invest Your Talent & university awards — eligibility, documents and deadlines.";

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
  { name: "Italy Scholarships", href: CANONICAL },
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

const scholarshipTypes = [
  {
    title: "Regional (DSU) scholarships",
    text: "Funding that follows the region, not the country. Italy's right-to-study system leaves each region to run its own student-aid agency, so you apply where you enrol. Support can mix cash with meals and housing help, while rules, income bands and dates are set afresh in every regional call.",
  },
  {
    title: "MAECI government grants",
    text: "One national call issued each year by Italy's Ministry of Foreign Affairs and International Cooperation. It names the eligible study levels, the eligible nationalities — India featured on the 2026-2027 list — and a single fixed deadline, with applications only on the Study in Italy portal.",
  },
  {
    title: "University merit awards",
    text: "Awards decided inside each university's own admissions process to attract strong profiles — fee waivers, reductions or yearly allowances. Padua's 2026/27 International Excellence Scholarships for English-taught programmes are one verified instance; every other institution defines its own.",
  },
  {
    title: "Programme-linked opportunities",
    text: "Funding built into a named programme rather than a standalone grant: Invest Your Talent in Italy pairs a Master's-level course with a mandatory company internship for applicants from a set list of countries that includes India. Offered year by year, not permanently.",
  },
];

const applicationSteps = [
  "Shortlist your university and course, and confirm you meet the programme's admission requirements.",
  "Identify which scholarship type fits you — regional DSU, MAECI, university merit award or a programme-linked scheme.",
  "Read the official annual call for that exact scholarship and academic year; note the deadline first.",
  "Prepare your documents: academic records, passport/identity, and family-income evidence where the scheme requires it.",
  "Submit the university admission application where required — many scholarships assume or require it.",
  "Submit the scholarship application separately where required (for example, on the regional agency portal or the Study in Italy portal).",
  "Track the official ranking or result announcement; do not assume selection until it is published.",
  "Complete the remaining steps: enrolment, Universitaly pre-enrolment where needed, and the student visa process.",
];

const mistakes = [
  {
    title: "Missing the scholarship-specific deadline",
    text: "Scholarship deadlines are separate from admission deadlines and are often earlier. The MAECI 2026-2027 call, for instance, closed at 14:00 Italian time on 26 March 2026.",
  },
  {
    title: "Assuming admission means funding",
    text: "A university offer letter is not a scholarship award. Every funding scheme has its own application and selection — apply for each one explicitly.",
  },
  {
    title: "Submitting incomplete financial documentation",
    text: "Need-based schemes live or die on income evidence. Non-EU applicants typically need translated, legalised family income and asset documents submitted exactly as the call specifies.",
  },
  {
    title: "Relying on last year's information",
    text: "Calls, thresholds, eligible countries and amounts change every academic year. Always work from the current call on the official portal, not blogs quoting older editions.",
  },
  {
    title: "Treating unofficial sources as final",
    text: "Agents, forums and aggregator sites can guide you, but the regional agency, the university or MAECI call is the only authority on eligibility, documents and dates.",
  },
];

const faqs = [
  {
    question: "Can Indian students get scholarships in Italy?",
    answer:
      "Yes. Indian students can compete for regional DSU scholarships, university merit awards, programme-linked schemes such as Invest Your Talent in Italy, and MAECI government grants — India appeared on the official MAECI eligible-countries list for 2026-2027. Each scheme has its own criteria, so nothing is guaranteed and every call must be read carefully.",
  },
  {
    question: "What is the DSU scholarship?",
    answer:
      "DSU (diritto allo studio universitario) scholarships are need- and merit-based benefits awarded by each Italian region's student-aid agency. Depending on the region and year, winners may receive money plus services such as free or subsidised meals, accommodation subject to availability, and exemption from the regional study tax. Eligibility is assessed on family economic indicators and academic merit, and every region publishes its own annual call.",
  },
  {
    question: "Is the Italy scholarship application separate from university admission?",
    answer:
      "Usually yes. University admission and scholarship applications are different processes, often on different portals with different deadlines. Some awards are granted automatically with admission, but most — including regional DSU calls and MAECI grants — require a separate application.",
  },
  {
    question: "Can I apply for scholarships before getting admission?",
    answer:
      "It depends on the scheme. Some regional calls allow you to apply while intending to enrol, while others expect enrolment first; MAECI applications run on the Study in Italy portal on the call's own timeline. Read the specific call to see whether admission must come first.",
  },
  {
    question: "Does every Italian university offer scholarships?",
    answer:
      "No. Merit awards and waivers are decided by each university individually — some offer structured international scholarships every year, others offer little or nothing. Check the official fees and funding pages of each university on your shortlist rather than assuming support exists.",
  },
  {
    question: "When should Indian students apply for Italy scholarships?",
    answer:
      "As early as the official calls allow. Government and regional calls typically open months before the academic year — for reference, the MAECI 2026-2027 call closed in March 2026 and the DSU Toscana 2026/27 degree-course window ran from July to September 2026. Start tracking calls in the first half of the year for the following intake.",
  },
  {
    question: "What documents are commonly required?",
    answer:
      "Academic transcripts and certificates, a valid passport, and programme-specific items for admission; plus, for need-based scholarships, translated and legalised family income and asset documents. Language evidence may be needed where the programme or call requires it. Exact lists differ per scheme, so follow the official call.",
  },
  {
    question: "Can scholarship support help with living costs?",
    answer:
      "It can, but the form varies. DSU-type benefits may include meals, accommodation and money; MAECI grants are paid as a living-cost contribution in instalments during the months you actually spend in Italy; university awards are often tuition waivers with a separate cash allowance. Confirm what each award covers before budgeting around it.",
  },
];

const plannerLinks = [
  {
    href: "/study-in-italy",
    title: "Study in Italy guide",
    text: "Universities, courses, costs and the full journey from India.",
  },
  {
    href: "/italy-university-admission",
    title: "Italy university admission",
    text: "Requirements, application steps and deadlines per programme.",
  },
  {
    href: "/italy-student-visa",
    title: "Italy student visa",
    text: "Documents, appointments and the visa process after admission.",
  },
  {
    href: "/universities",
    title: "Universities in Italy",
    text: "Compare institutions before shortlisting your options.",
  },
  {
    href: "/courses",
    title: "Courses in Italy",
    text: "Find English-taught Bachelor's, Master's and single-cycle courses.",
  },
  {
    href: "/visa-checklists",
    title: "Visa document checklists",
    text: "Prepare the paperwork missions commonly ask for.",
  },
];

export default function ItalyScholarshipsPage() {
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
                Funding guide for the 2026/27 intake
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
                Italy Scholarships for Indian Students
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
                Indian students can fund study in Italy through regional DSU
                scholarships, MAECI Italian government grants, university merit
                awards and programme-linked schemes such as Invest Your Talent
                in Italy. This guide explains who offers each option, who can
                apply, and how the scholarship process fits around admission
                and the student visa.
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
              Read this page with the official calls open
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
              Scholarship rules change every academic year. Figures and dates
              below come from the verified 2026/27 calls linked throughout and
              are labelled as such — for any other year, the current call on
              the official portal (regional agency, university or the MAECI{" "}
              <OfficialLink href="https://studyinitaly.esteri.it/">
                Study in Italy portal
              </OfficialLink>
              ) is the only final source. No scholarship can be promised in
              advance.
            </p>
          </div>
        </section>

        {/* 3. Main scholarship types */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Your options"
            title="Types of Scholarships to Study in Italy"
            intro="Four different kinds of organisations fund international students in Italy. They differ in who decides, what they assess and how you apply."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {scholarshipTypes.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-[var(--foreground)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* 4. DSU / regional scholarships */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Need- and merit-based"
              title="DSU and Regional Scholarships in Italy"
              intro="Every Italian region runs its own student-aid agency and publishes its own annual call. The pattern below holds broadly, but amounts, thresholds and dates differ by region and year."
            />
            <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Who runs them
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Regional agencies for the right to study (diritto allo
                  studio) — for example, DSU Toscana for students at the
                  universities of Florence, Pisa and Siena. Apply to the agency
                  of the region where your university is located, through that
                  agency&apos;s own portal and call.
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Income and merit assessment
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Economic eligibility is assessed on family income and assets
                  (the ISEE/ISPE indicators for students whose finances are in
                  Italy, or equivalent documented evidence for families abroad),
                  while merit is checked against credits and enrolment status.
                  As a labelled example, the DSU Toscana 2026/27 call set
                  thresholds of ISEE €27,000 and ISPE €60,000 — other regions
                  and years set their own.
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  What winners may receive
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Typically a money component plus services: free or subsidised
                  meals, accommodation subject to availability for out-of-town
                  students, and exemption from the regional study tax. The cash
                  amount varies with economic band and whether you are
                  classified as in-town, commuter or out-of-town — no fixed
                  national figure exists.
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  When to apply
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Each region sets its own window. For reference, DSU Toscana
                  accepted 2026/27 degree-course applications online from 20
                  July to 7 September 2026, with a separate window for PhD and
                  specialisation students. Awards are annual — you reapply every
                  year and must keep meeting the economic and merit
                  requirements.
                </p>
              </article>
            </div>
            <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
              Verify current regional rules on the official pages, for example
              the{" "}
              <OfficialLink href="https://www.dsu.toscana.it/borsa-di-studio">
                DSU Toscana scholarship call
              </OfficialLink>{" "}
              and its{" "}
              <OfficialLink href="https://www.dsu.toscana.it/-/studenti-stranieri-italiano">
                guidance for foreign students
              </OfficialLink>
              .
            </p>
          </div>
        </section>

        {/* 5. MAECI scholarships */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Italian government grants"
            title="MAECI Scholarships Italy"
            intro="Grants from Italy's Ministry of Foreign Affairs and International Cooperation (MAECI), governed by an annual call. Below is the verified 2026-2027 position — future calls may differ."
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Who administers them
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                MAECI offers the grants to foreign students and Italians
                resident abroad to promote cultural, scientific and
                technological cooperation. Selection is run by citizenship, and
                applications are accepted exclusively through the official
                Study in Italy portal — nowhere else.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Eligible study categories
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Under the 2026-2027 call: Master&apos;s degrees, AFAM
                (fine arts, music and dance), PhDs, research projects, and
                three-month intensive Italian language and culture courses.
                Bachelor&apos;s and single-cycle degrees were eligible only for
                renewals under the &ldquo;Costruiamo il futuro&rdquo;
                provision. Only onsite attendance in Italy is covered.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                India and the 2026-2027 call
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                India appeared on the official 2026-2027 eligible-countries
                list, and the Embassy of Italy in New Delhi published the call
                for resident applicants. The nine-month grants ran from 1
                November 2026 to 31 July 2027, with a total of €10,800 per the
                official call, paid in instalments conditional on presence in
                Italy, enrolment and academic progress. Nationality eligibility
                is reset in each annual call, so re-check it every year.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Deadlines and next steps
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Online applications for 2026-2027 closed at 14:00 Italian time
                on 26 March 2026. If you are targeting a later intake, watch
                the Study in Italy portal for the next annual call and prepare
                your passport, qualifications and language evidence in advance.
              </p>
            </article>
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
            Official sources: the{" "}
            <OfficialLink href="https://www.esteri.it/en/servizi-opportunita/opportunita/borse-di-studio/per-cittadini-stranieri/borsestudio_stranieri/">
              MAECI scholarships page
            </OfficialLink>
            , the{" "}
            <OfficialLink href="https://www.esteri.it/wp-content/uploads/2026/03/Bando-26-27-ENG.pdf">
              2026-2027 call (English PDF)
            </OfficialLink>
            , the{" "}
            <OfficialLink href="https://studyinitaly.esteri.it/Static/FAQ">
              Study in Italy FAQ
            </OfficialLink>{" "}
            and the{" "}
            <OfficialLink href="https://ambnewdelhi.esteri.it/it/news/dall_ambasciata/2026/03/borse-di-studio-maeci-per-la-a-2026-2027/">
              Embassy of Italy in New Delhi notice
            </OfficialLink>
            .
          </p>
        </section>

        {/* 6. University scholarships */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Merit-based"
              title="Italy University Scholarships"
              intro="Individual universities reward strong applicants with waivers, reductions or cash awards. Because each institution writes its own call, always verify the current edition on the university's official site."
            />
            <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6 sm:p-8">
              <h3 className="text-xl font-bold text-[var(--foreground)]">
                Verified example: University of Padua International Excellence
                Scholarships 2026/27
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                For 2026/27, Padua offered up to 69 Excellence Scholarships —
                one per English-taught degree programme — plus up to 30 further
                departmental awards. Each combined a tuition fee-waiver with an
                €8,000 annual allowance. Eligible applicants held non-Italian
                citizenship and a foreign entry qualification, did not already
                reside in Italy, and applied to an English-taught programme;
                eligible students were considered automatically with no
                separate scholarship form, and renewal depended on earning the
                required credits. See the University&apos;s{" "}
                <OfficialLink href="https://www.unipd.it/en/scholarships">
                  official scholarships page
                </OfficialLink>{" "}
                and the{" "}
                <OfficialLink href="https://protocollo.unipd.it/albo/viewer?view=files%2F016443011-UNPD0Z9-867fef6f-acdf-40fc-99f6-a49c973d9263-001.pdf">
                  official 2026/27 call (PDF)
                </OfficialLink>{" "}
                behind the figures above.
              </p>
              <h3 className="mt-6 text-xl font-bold text-[var(--foreground)]">
                How to find others
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                Shortlist universities first — for example through our{" "}
                <Link
                  href="/universities"
                  className="font-semibold text-[var(--primary)] hover:underline"
                >
                  universities in Italy
                </Link>{" "}
                listing — then check each institution&apos;s official fees,
                funding and admissions pages for its current merit calls. Note
                the pattern in the Padua example: awards usually cannot be
                combined with other public grants, and keeping them requires
                academic progress.
              </p>
            </div>
            <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
              Also check Invest Your Talent in Italy — Master&apos;s-level
              courses plus a compulsory company internship for students from
              selected countries including India — on the{" "}
              <OfficialLink href="https://investyourtalentapplication.esteri.it/SITOIYT/EN/current-call">
                official current call page
              </OfficialLink>
              .
            </p>
          </div>
        </section>

        {/* 7. Eligibility checklist */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Are you eligible?"
            title="Italy Scholarship Eligibility Checklist"
            intro="Exact requirements live in each call, but most schemes check some combination of the following."
          />
          <ul className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
            {[
              {
                title: "Admission or application status",
                text: "Enrolment, an offer, or at least a submitted university application, as the specific call requires.",
              },
              {
                title: "Academic documents",
                text: "Transcripts, degree certificates or school leaving results proving you qualify for the programme level.",
              },
              {
                title: "Financial and family-income evidence",
                text: "ISEE/ISPE documentation or translated, legalised family income and asset records where the scheme is need-based.",
              },
              {
                title: "Identity and passport documents",
                text: "A valid passport and, for non-EU applicants, the identity documents the call specifies.",
              },
              {
                title: "Language and programme requirements",
                text: "Proof of English or Italian at the required level where the programme or call demands it.",
              },
              {
                title: "Scholarship-specific conditions",
                text: "Citizenship or residence rules, no prior enrolment conditions, incompatibility with other grants, and renewal credit targets.",
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

        {/* 8. Application process */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Step by step"
              title="How to Apply for Scholarships in Italy"
              intro="Scholarship, admission and visa steps run on separate tracks. Follow them in this order so nothing is missed."
            />
            <ol className="mx-auto mt-10 max-w-3xl space-y-4">
              {applicationSteps.map((step, index) => (
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
              The admission track is covered in our{" "}
              <Link
                href="/italy-university-admission"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Italy university admission guide
              </Link>
              , and course choice starts with our{" "}
              <Link
                href="/courses"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                courses in Italy
              </Link>{" "}
              listing.
            </p>
          </div>
        </section>

        {/* 9. Documents */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Paperwork"
            title="Documents: Admission vs Scholarship vs Financial"
            intro="Three different document piles serve three different decisions. Do not assume one set covers everything."
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-3">
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                University admission documents
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Qualifications, transcripts, passport, language evidence and
                programme-specific items such as portfolios or test results —
                whatever the university&apos;s own call asks for.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Scholarship documents
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                The scholarship form itself plus whatever that call demands:
                declarations, acceptance forms, bank details for payment, or
                progress certificates for renewals. Each call lists its own.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Financial and income documents
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Required only where the scheme is need-based: ISEE/ISPE
                certification or, for families abroad, translated and legalised
                proof of family composition, income and assets. Merit-only
                awards do not ask for these.
              </p>
            </article>
          </div>
        </section>

        {/* 10. Scholarship + admission + visa relationship */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="How the pieces connect"
              title="Scholarships, Admission, Pre-enrolment and Visa"
              intro="Four related but separate processes. Winning one does not complete the others."
            />
            <div className="mx-auto mt-10 max-w-3xl space-y-4 text-sm leading-6 text-[var(--muted-foreground)]">
              <p className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <strong className="text-[var(--foreground)]">
                  Scholarship application
                </strong>{" "}
                — submitted to the regional agency, the university or MAECI on
                its own timeline. Awaiting its result should never delay your
                admission or visa steps.
              </p>
              <p className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <strong className="text-[var(--foreground)]">
                  University admission
                </strong>{" "}
                — the academic decision. Most scholarships assume you are
                admitted or enrolling, so treat admission as the foundation;
                see the{" "}
                <Link
                  href="/italy-university-admission"
                  className="font-semibold text-[var(--primary)] hover:underline"
                >
                  admission guide
                </Link>
                .
              </p>
              <p className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <strong className="text-[var(--foreground)]">
                  Universitaly pre-enrolment
                </strong>{" "}
                — after admission, visa-seeking students submit pre-enrolment
                on the official Universitaly portal. It is independent of any
                scholarship outcome.
              </p>
              <p className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <strong className="text-[var(--foreground)]">
                  Student visa
                </strong>{" "}
                — decided by the competent Italian authorities on admission,
                pre-enrolment and supporting evidence. A scholarship helps your
                financial picture but does not replace any visa requirement;
                details are in the{" "}
                <Link
                  href="/italy-student-visa"
                  className="font-semibold text-[var(--primary)] hover:underline"
                >
                  student visa guide
                </Link>{" "}
                and{" "}
                <Link
                  href="/visa-checklists"
                  className="font-semibold text-[var(--primary)] hover:underline"
                >
                  visa checklists
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* 11. Deadlines */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Timing"
            title="Italy Scholarship Deadlines"
            intro="There is no single scholarship deadline. Verified 2026/27 reference points are below — amounts, eligibility and dates are reset every year, so everything else must be taken from the current official call."
          />
          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-[var(--border)]">
                <tr>
                  <th
                    scope="row"
                    className="px-5 py-4 font-semibold text-[var(--foreground)]"
                  >
                    MAECI 2026-2027 call
                  </th>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Closed 26 March 2026 at 14:00 Italian time; next annual
                    call to be checked on the Study in Italy portal.
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-5 py-4 font-semibold text-[var(--foreground)]"
                  >
                    DSU Toscana 2026/27 (degree courses)
                  </th>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Online applications 20 July – 7 September 2026; PhD and
                    specialisation window separate.
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-5 py-4 font-semibold text-[var(--foreground)]"
                  >
                    University merit awards
                  </th>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Set per university and programme — generally aligned with
                    admission rounds; confirm on each official call.
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-5 py-4 font-semibold text-[var(--foreground)]"
                  >
                    Other regions and years
                  </th>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Always vary — use only the current call from the relevant
                    regional agency or institution.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 12. Common mistakes */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Avoid these"
              title="Common Scholarship Mistakes"
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
            title="Italy Scholarships: Frequently Asked Questions"
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
              intro="Scholarships are one piece — admission, visa and course choice complete the picture."
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
                Not sure which scholarship fits your profile?
              </h2>
              <p className="mx-auto mt-3 max-w-2xl opacity-80">
                Get personalised guidance on universities, funding options,
                applications and the Italy student visa.
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
