import Link from "next/link";

import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

const SITE_URL = "https://www.europeandreamss.com";
const CANONICAL = `${SITE_URL}/study-in-italy-data-guide`;

const PAGE_TITLE =
  "Study in Italy 2026/27: Indian Student Cost, Scholarships, Visa & Application Data Guide";
const META_TITLE = "Study in Italy 2026/27: Costs & Scholarships";
const PAGE_DESCRIPTION =
  "Data-backed 2026/27 guide for Indian students: Italy tuition and living-cost frameworks, DSU/MAECI scholarships, ISEE Parificato, Type D visa funds, CIMEA vs DoV and application timelines — every figure with its official source.";

export const metadata = {
  title: META_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: CANONICAL,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: META_TITLE,
    description: PAGE_DESCRIPTION,
    url: CANONICAL,
    siteName: "European Dreams",
    type: "article",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

const breadcrumbItems = [
  { name: "Home", href: `${SITE_URL}/` },
  { name: "Study in Italy", href: `${SITE_URL}/study-in-italy` },
  { name: "2026/27 Data Guide", href: CANONICAL },
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

const faqs = [
  {
    question:
      "How much does it cost for an Indian student to study in Italy in 2026/27?",
    answer:
      "Public-university tuition follows the European Commission country profile for Italy at approximately €900–€4,000 per year (private institutions approximately €6,000–€20,000+), with public fees commonly scaled to declared family income (ISEE). Living costs are approximately €700–€1,100 per month depending on the city. Confirm exact fees for each programme — there is no single universal figure.",
  },
  {
    question: "What scholarships are available for Indian students in Italy?",
    answer:
      "Three routes: MAECI Italian government grants (the 2026-2027 call closed 26 March 2026 with €10,800 over 9 months; India was eligible), regional DSU need- and merit-based scholarships run by bodies such as ER.GO, EDISU Piemonte, DiSCo Lazio and DSU Toscana under annual calls, and university merit awards such as Padua's 2026/27 Excellence Scholarships (fee waiver plus €8,000 annual allowance). Nothing is guaranteed — every scheme has its own call.",
  },
  {
    question: "What funds are required for the Italy student visa?",
    answer:
      "The verified legal basis is €10,179.85 per year under Tabella A of the Interior Ministry Directive of 01.03.2000. An older ~€6,079.45 figure found in some material was the superseded 2024/25 requirement, and monthly figures such as €848.32 or €783.06 are different presentations of the same annual total. Always follow the current checklist of the competent mission for your jurisdiction.",
  },
  {
    question: "What is ISEE Parificato?",
    answer:
      "ISEE Parificato (also labelled ISEE University Equivalent or ISEEUP depending on the region) is the income indicator used instead of the standard ISEE for students whose family income and assets are outside Italy. It is built from translated and legalised foreign-income documents, often via an affiliated tax-assistance centre (CAF), under each regional call's own route and deadline.",
  },
  {
    question: "What is the difference between CIMEA and DoV?",
    answer:
      "Both recognise an Indian qualification for Italian admission but come from different bodies: a CIMEA Statement of Comparability or Verification is issued by CIMEA, while a Declaration of Value (DoV/DOV) is issued by the competent Italian mission. Requirements are programme- and university-dependent — some institutions accept one, some require the other, some require neither. Confirm in the official programme call.",
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
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)] sm:text-base sm:leading-7">
          {intro}
        </p>
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
      className={`inline-flex min-h-12 items-center justify-center rounded-xl px-6 py-3 text-sm font-bold transition sm:text-base ${styles}`}
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

function SourceNote({ children }) {
  return (
    <p className="border-t border-[var(--border)] px-5 py-4 text-xs leading-5 text-[var(--muted-foreground)]">
      Source: {children}
    </p>
  );
}

export default function StudyInItalyDataGuidePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={webPageSchema} />
      <JsonLd data={faqSchema} />
      <main className="min-h-screen bg-[var(--background)]">
        {/* Hero */}
        <section className="border-b border-[var(--border)] bg-[var(--hero-gradient)]">
          <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pb-12 sm:pt-10 lg:px-8">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="mt-5 max-w-3xl">
              <span className="mb-3 inline-flex rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)] sm:text-sm">
                Research &amp; data guide · 2026/27 · Indian students
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl">
                Study in Italy 2026/27: Indian Student Cost, Scholarships,
                Visa &amp; Application Data Guide
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)] sm:text-base sm:leading-7">
                A citation-ready reference for Indian students, families,
                journalists and counsellors: 2026/27 tuition and living-cost
                frameworks, regional DSU scholarship windows, MAECI grants,
                ISEE Parificato routes, Type D visa funds, CIMEA vs DoV and a
                September-intake timeline. Every dated figure carries its
                official 2026/27 source; thresholds reset annually and no
                outcome is guaranteed. Start with our{" "}
                <Link
                  href="/study-in-italy"
                  className="font-semibold text-[var(--primary)] hover:underline"
                >
                  Study in Italy guide for Indian students
                </Link>
                .
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                Last updated: September 2026
              </p>
            </div>
          </div>
        </section>

        {/* AEO answer block */}
        <section
          aria-label="Key answers"
          className="mx-auto max-w-7xl scroll-mt-[104px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        >
          <SectionHeading
            eyebrow="Direct answers"
            title="Study in Italy 2026/27: Key Answers"
            intro="Five self-contained answers. Each is expanded with full sources in its section below."
          />
          <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2">
            {faqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
              >
                <h3 className="font-bold text-[var(--foreground)]">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* 1. Snapshot */}
        <section className="scroll-mt-[104px] border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <SectionHeading
              eyebrow="2026/27 snapshot"
              title="Study in Italy 2026/27 Snapshot"
              intro="Framework figures for Indian students. Confirm programme-specific values in each official call."
            />
            <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)]">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-[var(--border)]">
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      Public tuition
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Approximately €900–€4,000 per year (European Commission
                      country profile for Italy, indicative)
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      Private tuition
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Approximately €6,000–€20,000+ per year (same source)
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
                      Approximately €700–€1,100 per month, depending on the city
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      Main intakes
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      September/October (main); February entry is limited and
                      university-specific — check each call
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      Student visa
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Type D long-stay national visa for courses over 90 days,
                      after Universitaly pre-enrolment
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      Work while studying
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Up to 20 hours per week, subject to residence-permit
                      conditions
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      After graduation
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Job-search residence permit (permesso di soggiorno per
                      attesa occupazione), generally up to 12 months subject to
                      current immigration rules — nothing automatic
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      Fee basis
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Public-university fees commonly depend on declared family
                      income (ISEE; ISEE Parificato for families abroad)
                    </td>
                  </tr>
                </tbody>
              </table>
              <SourceNote>
                <OfficialLink href="https://education.ec.europa.eu/study-in-europe/country-profiles/italy">
                  European Commission — Study in Italy country profile
                </OfficialLink>{" "}
                for tuition and living ranges; intake, visa, work and ISEE
                rows are expanded with sources in their sections below.
              </SourceNote>
            </div>
          </div>
        </section>

        {/* 2. Tuition */}
        <section className="mx-auto max-w-7xl scroll-mt-[104px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <SectionHeading
            eyebrow="Tuition"
            title="Tuition-Cost Framework"
            intro="Income-scaled public fees plus labelled 2026/27 evidence. No single universal fee exists."
          />
          <div className="mx-auto mt-8 max-w-3xl space-y-4 text-sm leading-6 text-[var(--muted-foreground)]">
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <strong className="text-[var(--foreground)]">
                Public universities: ISEE-based fees.
              </strong>{" "}
              Fees commonly depend on declared family income, so two students
              on the same course can pay different amounts — approximately
              €900–€4,000 per year per the{" "}
              <OfficialLink href="https://education.ec.europa.eu/study-in-europe/country-profiles/italy">
                European Commission country profile
              </OfficialLink>
              . Read each university&apos;s income-band rules; reductions and
              full exemptions run through separate calls with their own
              deadlines.
            </p>
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <strong className="text-[var(--foreground)]">
                Labelled 2026/27 example:
              </strong>{" "}
              the{" "}
              <OfficialLink href="https://www.dsu.toscana.it/documents/d/ardsu/bando-borsa-alloggio-26-27">
                DSU Toscana 2026/27 call
              </OfficialLink>{" "}
              set thresholds of ISEE €27,000 and ISPE €60,000 — this region and
              year only; other regions and universities set their own. Full
              context in our{" "}
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

        {/* 3. Living & accommodation */}
        <section className="scroll-mt-[104px] border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <SectionHeading
              eyebrow="Living"
              title="Living Costs & Accommodation"
              intro="The official framework plus housing types. No city rents are stated here — verify current housing costs per city."
            />
            <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-3">
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">
                  Official framework
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Approximately €700–€1,100 per month depending on the city, per
                  the{" "}
                  <OfficialLink href="https://education.ec.europa.eu/study-in-europe/country-profiles/italy">
                    European Commission country profile
                  </OfficialLink>
                  . Larger cities typically cost more than smaller university
                  towns.
                </p>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">
                  Housing types
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  University dormitories (limited, allocated per residence
                  rules), shared apartments (most common in larger cities) and
                  private studios or apartments (generally highest-cost). A
                  written rental agreement also supports the visa and
                  residence-permit file.
                </p>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">
                  DSU housing
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Regional DSU bodies may offer student housing subject to
                  availability under their own annual calls — see the DSU table
                  below and our{" "}
                  <Link
                    href="/living-in-italy-for-students"
                    className="font-semibold text-[var(--primary)] hover:underline"
                  >
                    living in Italy guide
                  </Link>
                  .
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 4. Scholarships */}
        <section className="mx-auto max-w-7xl scroll-mt-[104px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <SectionHeading
            eyebrow="Funding"
            title="Scholarships: 2026/27 Scholarship Ladder"
            intro="Amounts appear only where the official 2026/27 call verifies them. Everything else points to the call."
          />
          <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <caption className="px-5 pb-3 pt-5 text-left font-bold text-[var(--foreground)]">
                  Scholarship ladder — 2026/27 status per official sources
                </caption>
                <thead>
                  <tr className="border-y border-[var(--border)] bg-[var(--background)]">
                    <th
                      scope="col"
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]"
                    >
                      Scholarship
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]"
                    >
                      Provider / eligibility
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]"
                    >
                      2026/27 status
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]"
                    >
                      Amount / deadline
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      MAECI grants
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Italian Ministry of Foreign Affairs; Master&apos;s, PhD,
                      research and language courses; India on the 2026-2027
                      eligible-countries list
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      2026-2027 call closed 26 March 2026 at 14:00 Italian time
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      €10,800 total over 9 months, paid in instalments
                      conditional on presence, enrolment and progress;{" "}
                      <OfficialLink href="https://www.esteri.it/wp-content/uploads/2026/03/Bando-26-27-ENG.pdf">
                        official 2026-2027 call (English PDF)
                      </OfficialLink>
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      Invest Your Talent in Italy
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Master&apos;s-level courses plus a compulsory company
                      internship; students from selected countries including
                      India
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Offered year by year — check the current call
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      See the{" "}
                      <OfficialLink href="https://investyourtalentapplication.esteri.it/SITOIYT/EN/current-call">
                        official current call page
                      </OfficialLink>{" "}
                      (no amount stated here)
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      ER.GO (Emilia-Romagna)
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Regional right-to-study agency; EU, non-EU and non-EU
                      abroad students at Emilia-Romagna universities
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Ordinary window 23 June–24 Aug 2026, 16:00 (closed);
                      semestre-filtro applications reopen 10 Feb–15 Mar 2027
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Set in the call — see the{" "}
                      <OfficialLink href="https://www.er-go.it/cosa-fare-per/bandi-di-concorso/scadenze/scadenze-per-richiedere-i-benefici">
                        official ER.GO deadlines
                      </OfficialLink>
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      EDISU Piemonte
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Regional agency for Piedmont universities; ISEE Parificato
                      route in the 2026/27 call
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      22 July–4 Sept 2026, 12:00 (closed)
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Set in the call — see the{" "}
                      <OfficialLink href="https://www.edisu.piemonte.it/borse-e-contributi/benefici-economici/borsa-di-studio">
                        official EDISU scholarship page
                      </OfficialLink>
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      DiSCo Lazio
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Regional agency for Lazio universities; ISEEUP for
                      non-resident students
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      10 June–23 July 2026, closed 11 Aug 2026 (closed)
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Set in the call — see the{" "}
                      <OfficialLink href="https://laziodisco.it/bandi-aperti/bando-diritto-allo-studio-2026-2027/">
                        official DiSCo 2026/2027 call
                      </OfficialLink>
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      Padua Excellence
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      University of Padua; non-Italian citizenship with a
                      foreign entry qualification; English-taught programmes;
                      considered automatically
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      2026/27: up to 69 Excellence Scholarships plus up to 30
                      departmental awards
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Tuition fee-waiver plus an €8,000 annual allowance;{" "}
                      <OfficialLink href="https://www.unipd.it/en/scholarships">
                        official scholarships page
                      </OfficialLink>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <SourceNote>
              MAECI figures from the{" "}
              <OfficialLink href="https://www.esteri.it/en/servizi-opportunita/opportunita/borse-di-studio/per-cittadini-stranieri/borsestudio_stranieri/">
                MAECI scholarships page
              </OfficialLink>{" "}
              and the{" "}
              <OfficialLink href="https://ambnewdelhi.esteri.it/it/news/dall_ambasciata/2026/03/borse-di-studio-maeci-per-la-a-2026-2027/">
                Embassy of Italy in New Delhi notice
              </OfficialLink>
              ; regional rows from each authority&apos;s 2026/27 call. Full
              routes in our{" "}
              <Link
                href="/italy-scholarships"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Italy scholarships guide
              </Link>
              .
            </SourceNote>
          </div>

          {/* DSU 4-region table */}
          <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <caption className="px-5 pb-3 pt-5 text-left font-bold text-[var(--foreground)]">
                  DSU 4-region comparison — ordinary 2026/27 windows shown
                  closed as published reference points
                </caption>
                <thead>
                  <tr className="border-y border-[var(--border)] bg-[var(--background)]">
                    <th
                      scope="col"
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]"
                    >
                      Region
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]"
                    >
                      2026/27 window
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]"
                    >
                      Authority
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]"
                    >
                      Foreign-income / ISEE route
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]"
                    >
                      Caveat
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      Emilia-Romagna
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      23 June–24 Aug 2026, 16:00 (closed)
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      ER.GO
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Translated, legalised foreign-income documents via the
                      Dossier Utente
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Semestre-filtro students follow separate dates — see{" "}
                      <OfficialLink href="https://www.er-go.it/cosa-fare-per/studenti/studente-iscritto-al-semestre-filtro-aperto">
                        ER.GO semestre-filtro page
                      </OfficialLink>
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      Piedmont
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      22 July–4 Sept 2026, 12:00 (closed)
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      EDISU Piemonte
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      ISEE Parificato route in the 2026/27 call; temporary
                      access code where no SPID
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Semestre-filtro (LM-41/LM-46/LM-42) provisions apply —
                      read the bando
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      Lazio
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      10 June–23 July 2026, closed 11 Aug 2026 (closed)
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      DiSCo
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      ISEEUP at an affiliated CAF by 10 Dec 2026;
                      residence-permit uploads for extra-EU students
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Semestre-filtro applicants follow special FAQ rules — see{" "}
                      <OfficialLink href="https://laziodisco.it/bandi-aperti/bando-diritto-allo-studio-2026-2027/faq-studenti-internazionali/">
                        DiSCo international FAQ
                      </OfficialLink>
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      Veneto · Padua
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      All steps by 30 Sept 2026 (per 2026/27 call)
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      University of Padua (regional competition)
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      ISEE Parificato accepted via an affiliated CAF
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Padua runs its own competition, not ESU — see{" "}
                      <OfficialLink href="https://www.unipd.it/borse-studio-regionali">
                        Padua regional scholarships
                      </OfficialLink>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <SourceNote>
              ER.GO international documentation:{" "}
              <OfficialLink href="https://www.er-go.it/studenti-internazionali/documentazione-da-presentare">
                ER.GO studenti internazionali
              </OfficialLink>
              . DSU Toscana 2026/27 detail and foreign-student guidance:{" "}
              <OfficialLink href="https://www.dsu.toscana.it/borsa-di-studio">
                DSU Toscana scholarship call
              </OfficialLink>
              .
            </SourceNote>
          </div>
        </section>

        {/* 5. ISEE Parificato */}
        <section className="scroll-mt-[104px] border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <SectionHeading
              eyebrow="Income evidence"
              title="ISEE Parificato / CAF Routes"
              intro="The document that sets both tuition bands and DSU eligibility for families earning outside Italy."
            />
            <div className="mx-auto mt-8 max-w-3xl space-y-4 text-sm leading-6 text-[var(--muted-foreground)]">
              <p className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <strong className="text-[var(--foreground)]">
                  What it is.
                </strong>{" "}
                ISEE Parificato — labelled ISEE University Equivalent or ISEEUP
                depending on the region — replaces the standard ISEE where
                family income and assets are outside Italy. It is built from
                foreign-income documents, translated into Italian and legalised
                where applicable (for example, ER.GO requires upload via the
                Dossier Utente), often with an affiliated tax-assistance centre
                (CAF) in the loop.
              </p>
              <p className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <strong className="text-[var(--foreground)]">
                  Regional routes differ.
                </strong>{" "}
                DiSCo requires ISEEUP subscription at an affiliated CAF by 10
                December 2026; Padua accepts ISEE Parificato via an affiliated
                CAF alongside the 30 September 2026 steps; ER.GO and EDISU run
                their own documented foreign-income paths. Allow lead time —
                source documents come from Indian authorities first. See{" "}
                <OfficialLink href="https://www.er-go.it/studenti-internazionali/documentazione-da-presentare">
                  ER.GO international documentation
                </OfficialLink>{" "}
                and the{" "}
                <OfficialLink href="https://laziodisco.it/bandi-aperti/bando-diritto-allo-studio-2026-2027/faq-studenti-internazionali/">
                  DiSCo international FAQ
                </OfficialLink>
                .
              </p>
            </div>
          </div>
        </section>

        {/* 6. Visa + funds */}
        <section className="mx-auto max-w-7xl scroll-mt-[104px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <SectionHeading
            eyebrow="Visa"
            title="Type D Student Visa & Proof of Funds"
            intro="Pre-enrolment first, then the visa — and the funds figure depends on your mission's current checklist."
          />
          <div className="mx-auto mt-8 max-w-3xl space-y-4 text-sm leading-6 text-[var(--muted-foreground)]">
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <strong className="text-[var(--foreground)]">
                Type D + Universitaly.
              </strong>{" "}
              Courses over 90 days need a Type D long-stay national visa.
              Non-EU students first complete pre-enrolment on the{" "}
              <OfficialLink href="https://www.universitaly.it/en">
                Universitaly portal
              </OfficialLink>
              , validated by the university — see the{" "}
              <OfficialLink href="https://www.universitaly.it/studenti-stranieri">
                official foreign-student procedures
              </OfficialLink>
              . In India, applications are lodged through VFS Global centres
              acting for the competent mission; confirm jurisdiction and book
              via the{" "}
              <OfficialLink href="https://visa.vfsglobal.com/ind/en/ita/book-an-appointment">
                official VFS appointment page
              </OfficialLink>
              . Full process in our{" "}
              <Link
                href="/italy-student-visa"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Italy student visa guide
              </Link>
              .
            </p>
          </div>
          <div className="mx-auto mt-6 max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <table className="w-full text-left text-sm">
              <caption className="px-5 pb-3 pt-5 text-left font-bold text-[var(--foreground)]">
                Funds reconciliation — same requirement, different presentations
              </caption>
              <tbody className="divide-y divide-[var(--border)]">
                <tr>
                  <th
                    scope="row"
                    className="px-5 py-4 font-semibold text-[var(--foreground)]"
                  >
                    Current verified figure
                  </th>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    €10,179.85 per year under Tabella A of the Interior Ministry
                    Directive of 01.03.2000
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-5 py-4 font-semibold text-[var(--foreground)]"
                  >
                    Superseded figure
                  </th>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    ~€6,079.45 was the 2024/25 requirement still found in older
                    material — not current for 2026/27
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-5 py-4 font-semibold text-[var(--foreground)]"
                  >
                    Monthly presentations
                  </th>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    €848.32/month (annual ÷ 12) and €783.06/month (13-month
                    convention) present the same €10,179.85 annual total — not
                    different requirements
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-5 py-4 font-semibold text-[var(--foreground)]"
                  >
                    Jurisdiction caveat
                  </th>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Thresholds and accepted evidence are set by the competent
                    mission — for example{" "}
                    <OfficialLink href="https://consmumbai.esteri.it/en/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/study-in-italy/">
                      Mumbai
                    </OfficialLink>
                    ,{" "}
                    <OfficialLink href="https://consbangalore.esteri.it/en/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/study-in-italy">
                      Bengaluru
                    </OfficialLink>{" "}
                    and the{" "}
                    <OfficialLink href="https://conscalcutta.esteri.it/wp-content/uploads/2026/06/checklist-studio-2026-2027-2028-INDIA.pdf">
                      Kolkata 2026/27 checklist (PDF)
                    </OfficialLink>
                    . Always follow your mission&apos;s current checklist.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 7. CIMEA vs DoV */}
        <section className="scroll-mt-[104px] border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <SectionHeading
              eyebrow="Recognition"
              title="CIMEA vs Declaration of Value: Decision Table"
              intro="Two bodies, one question: which paper does your university accept? Requirements are programme-dependent."
            />
            <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)]">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-[var(--border)]">
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      If the call accepts CIMEA
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Obtain a CIMEA Statement of Comparability or Verification
                      — see{" "}
                      <OfficialLink href="https://www.cimea.it/EN/pagina-attestati-di-comparabilita-e-verifica">
                        CIMEA comparability services
                      </OfficialLink>
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      If the call requires a DoV
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Request a Declaration of Value from the competent Italian
                      mission — for example{" "}
                      <OfficialLink href="https://consmumbai.esteri.it/en/servizi-consolari-e-visti/servizi-per-il-cittadino-straniero/dichiarazione-di-valore-dov/">
                        Mumbai DoV procedures
                      </OfficialLink>
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      If the call requires neither
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Proceed without either — then verify the rule again in the
                      current call before paying for documents
                    </td>
                  </tr>
                  <tr>
                    <th
                      scope="row"
                      className="px-5 py-4 font-semibold text-[var(--foreground)]"
                    >
                      Always
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      Confirm in the official programme call and the
                      mission&apos;s instructions — the university decides which
                      instrument applies. Detail in our{" "}
                      <Link
                        href="/italy-university-admission"
                        className="font-semibold text-[var(--primary)] hover:underline"
                      >
                        Italy university admission guide
                      </Link>
                      .
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 8. Documents */}
        <section className="mx-auto max-w-7xl scroll-mt-[104px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <SectionHeading
            eyebrow="Paperwork"
            title="Application Documents Checklist"
            intro="There is no universal document list — confirm every item in the official programme call."
          />
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6">
            <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--muted-foreground)]">
              <li>Statement of purpose (SOP) tailored to the programme.</li>
              <li>
                Letters of recommendation (LORs), usually for postgraduate
                applications.
              </li>
              <li>Academic CV or résumé.</li>
              <li>Portfolio where the programme specifies it.</li>
              <li>
                CIMEA Statement or Declaration of Value per the recognition
                table above.
              </li>
              <li>
                Passport, transcripts and language evidence per the call; visa
                file adds admission proof, pre-enrolment summary, funds,
                accommodation and insurance per the mission checklist.
              </li>
            </ul>
          </div>
        </section>

        {/* 9. Intakes & timeline */}
        <section className="scroll-mt-[104px] border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <SectionHeading
              eyebrow="Planning"
              title="Intakes & September-Timeline"
              intro="Main September/October intake with limited February entry. Anchored dates are verified; everything else says check the call."
            />
            <ol className="mx-auto mt-8 max-w-3xl space-y-3">
              {[
                ["12–10 months out", "Shortlist universities and check each official call: requirements, language rules, fees and deadlines. See intakes in our Italy university intakes guide."],
                ["10–8 months out", "Prepare qualification recognition (CIMEA or DoV per the call) and start foreign-income paperwork for ISEE Parificato — both gate everything downstream."],
                ["8–6 months out", "Sit required tests where applicable: IMAT for English-taught Medicine (29 September 2026 per MUR DM 1005) or TOLC/CEnT-S where the call requires them."],
                ["6–4 months out", "Submit university applications; apply to DSU/MAECI calls on their own windows (all ordinary 2026/27 DSU windows above have closed — use them as timing reference for next year)."],
                ["4–2 months out", "After admission, complete Universitaly pre-enrolment and prepare the visa file from your mission's current checklist."],
                ["Final weeks", "Attend the VFS appointment, then arrange housing, insurance and travel. Enrolment and arrival formalities follow the university's instructions."],
              ].map(([when, what], index) => (
                <li
                  key={when}
                  className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="pt-1.5 text-sm leading-6 text-[var(--foreground)]">
                    <strong>{when}:</strong>{" "}
                    {index === 0 ? (
                      <>
                        Shortlist universities and check each official call:
                        requirements, language rules, fees and deadlines. See
                        intakes in our{" "}
                        <Link
                          href="/italy-university-intakes"
                          className="font-semibold text-[var(--primary)] hover:underline"
                        >
                          Italy university intakes guide
                        </Link>
                        .
                      </>
                    ) : index === 2 ? (
                      <>
                        Sit required tests where applicable: IMAT for
                        English-taught Medicine (29 September 2026 per{" "}
                        <OfficialLink href="https://www.mur.gov.it/it/atti-e-normativa/decreto-ministeriale-n-1005-del-06-08-2026">
                          MUR DM 1005
                        </OfficialLink>
                        ) or CISIA TOLC where the call requires it — see{" "}
                        <OfficialLink href="https://www.cisiaonline.it/en/">
                          CISIA
                        </OfficialLink>
                        . Medicine routes compared in our{" "}
                        <Link
                          href="/medicine-in-italy"
                          className="font-semibold text-[var(--primary)] hover:underline"
                        >
                          Medicine in Italy guide
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/open-semester-medicine-italy"
                          className="font-semibold text-[var(--primary)] hover:underline"
                        >
                          Open Semester guide
                        </Link>
                        .
                      </>
                    ) : index === 4 ? (
                      <>
                        After admission, complete pre-enrolment on the{" "}
                        <OfficialLink href="https://www.universitaly.it/en">
                          Universitaly portal
                        </OfficialLink>{" "}
                        and prepare the visa file — see our{" "}
                        <Link
                          href="/universitaly"
                          className="font-semibold text-[var(--primary)] hover:underline"
                        >
                          Universitaly guide
                        </Link>
                        .
                      </>
                    ) : (
                      what
                    )}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
              Italian-taught Medicine follows the separate open-semester system
              (national exams 10 December 2026 and 11 January 2027, ranking 22
              January 2027 per{" "}
              <OfficialLink href="https://www.mur.gov.it/it/atti-e-normativa/decreto-ministeriale-n-941-del-10-7-2026">
                MUR DM 941/2026
              </OfficialLink>
              ). English-taught options compared in our{" "}
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

        {/* 10. Mistakes */}
        <section className="mx-auto max-w-7xl scroll-mt-[104px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <SectionHeading
            eyebrow="Avoid these"
            title="Common Avoidable Mistakes"
            intro="Each mistake below is documented across the guides linked above."
          />
          <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2">
            {[
              {
                title: "Missing the scheme-specific deadline",
                text: "Scholarship, admission and visa deadlines are separate tracks — MAECI 2026-2027 closed 26 March 2026 while DSU windows ran into August/September 2026.",
              },
              {
                title: "Assuming admission means funding",
                text: "An offer letter is not a scholarship award. DSU, MAECI and university awards each need their own application.",
              },
              {
                title: "Weak income documentation",
                text: "Need-based outcomes live or die on translated, legalised foreign-income evidence filed through the correct regional route.",
              },
              {
                title: "Wrong recognition instrument",
                text: "CIMEA and DoV are not interchangeable — using the wrong one for a specific university costs weeks.",
              },
              {
                title: "Treating DSU as visa proof",
                text: "A future scholarship cannot substitute the mission's proof-of-funds requirement in the visa file.",
              },
              {
                title: "Relying on last year's call",
                text: "Thresholds, eligible countries and windows reset every academic year — work only from the current official call.",
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

        {/* 11. Sources & methodology */}
        <section className="scroll-mt-[104px] border-t border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <SectionHeading
              eyebrow="Methodology"
              title="Sources & Methodology"
              intro="How this guide was built — and its limits."
            />
            <div className="mx-auto mt-8 max-w-3xl space-y-3 text-sm leading-6 text-[var(--muted-foreground)]">
              <p className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                Every dated figure carries its cited 2026/27 official source
                (MUR decrees, regional DSU calls, MAECI calls, consulate
                checklists). Thresholds, eligible countries and windows reset
                annually — re-check the current call before acting.
              </p>
              <p className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                INR conversions are indicative only (approximately €1 ≈ ₹93 at
                the time of writing; exchange rates change). Regional amounts
                are shown only where the official call verifies them; otherwise
                the guide points to the call instead of quoting figures.
              </p>
              <p className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                No admission, scholarship, visa or residence outcome is
                guaranteed. Indian medical-regulatory questions (NEET/NMC)
                follow a separate track — see the{" "}
                <OfficialLink href="https://www.nmc.org.in/information-desk/for-students-to-study-in-abroad/">
                  NMC study-abroad guidance
                </OfficialLink>
                . Journalists and counsellors may quote labelled figures with
                attribution to the cited official source.
              </p>
            </div>
            <div className="mt-12 rounded-3xl bg-[var(--foreground)] px-6 py-10 text-center text-[var(--background)] sm:px-10">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Planning Italy for 2026/27?
              </h2>
              <p className="mx-auto mt-3 max-w-2xl opacity-80">
                Get personalised guidance on costs, scholarships, admission and
                the student visa.
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
