import Link from "next/link";

import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

const SITE_URL = "https://www.europeandreamss.com";
const CANONICAL = `${SITE_URL}/cost-of-studying-in-italy`;

const PAGE_TITLE =
  "Cost of Studying in Italy for Indian Students | Fees & Living Costs";
const PAGE_DESCRIPTION =
  "Cost of studying in Italy for Indian students (2026 guide): public & private tuition fees, living costs, city differences and how to check your exact fee.";

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
  { name: "Cost of Studying in Italy", href: CANONICAL },
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

const checkFeeSteps = [
  "Find your course on the official Universitaly portal, which lists course-level information for Italian institutions.",
  "Open the university and course information to see the programme structure, language and published fee references.",
  "Read the university's official tuition regulations or annual call for your intake — that document, not any guide, sets your fee.",
  "Check how income-based calculation and EU/non-EU rules apply to your situation.",
  "Check the same university's scholarships, reductions and exemption calls before assuming the headline amount.",
  "If anything is unclear, confirm the final amount with the university itself before you budget or apply.",
];

const plannerFramework = [
  {
    title: "A. Tuition",
    text: "Start from the programme's official fee for your intake and status (EU/non-EU, income band). Public-university figures cluster inside the official indicative range, but only your university's regulations give the real number.",
  },
  {
    title: "B. Living expenses",
    text: "Estimate monthly life in your chosen city — accommodation, food, transport and personal costs — using the indicative national range as a starting point and real housing listings for precision.",
  },
  {
    title: "C. One-time setup and administrative costs",
    text: "Add arrival costs: travel, initial deposits, insurance, permit-related charges and everyday setup. Each varies, so list them from the relevant official authority or provider.",
  },
  {
    title: "D. Scholarship and fee-waiver possibilities",
    text: "Subtract only what is confirmed. Regional, university and government support can lower the bill substantially — but only the official award letter counts, never an assumption.",
  },
  {
    title: "E. Emergency buffer",
    text: "Keep a reserve above your estimate for price changes, delays and surprises. A plan without a buffer is not a plan.",
  },
];

const faqs = [
  {
    question: "How much does it cost to study in Italy?",
    answer:
      "It depends on your institution, programme, city and lifestyle. As current official guidance, public universities generally fall around €900–€4,000 per year, private institutions around €6,000–€20,000+ per year, and students typically spend €700–€1,100 per month on living costs. These are indicative ranges, not fixed prices — confirm your exact figures officially.",
  },
  {
    question: "What are Italy university fees for international students?",
    answer:
      "Fees are set per institution and programme, and EU/non-EU treatment can differ. The European Commission notes that fees depend on declared family income and the chosen degree course, with reductions or exemptions offered by many universities. Always check the tuition regulations of your specific university and intake.",
  },
  {
    question: "Is studying in Italy cheap for Indian students?",
    answer:
      "Italy can be comparatively affordable, especially at public universities, and scholarships or waivers can reduce costs further. But 'cheap' depends on the city, programme and your lifestyle — use the indicative ranges as a starting point and verify the real numbers for your shortlist instead of relying on a single total.",
  },
  {
    question: "How much is public university tuition in Italy?",
    answer:
      "The European Commission's current guidance puts public university tuition at approximately €900–€4,000 per year. This is an indicative national range: individual universities set their own fees, often adjusted to family income, so your programme may sit anywhere inside — or be reduced below — that band.",
  },
  {
    question: "How much is private university tuition in Italy?",
    answer:
      "The current official guidance range is approximately €6,000–€20,000+ per year. Private institutions and specialised programmes vary substantially, so treat the range as orientation only and confirm the exact fee with the institution.",
  },
  {
    question: "What is the average cost of living for students in Italy?",
    answer:
      "Students typically spend €700–€1,100 per month depending on the city, according to current European Commission guidance. Accommodation is usually the largest part, followed by food, local transport and study or personal expenses — all shaped by city and lifestyle.",
  },
  {
    question: "Can scholarships reduce tuition costs?",
    answer:
      "Yes. Regional DSU support, university merit awards and waivers, and government grants can all lower what you pay — some cover tuition, others help with living costs. Each scheme has its own call and criteria, so see our dedicated Italy scholarships guide and never budget around unconfirmed funding.",
  },
  {
    question: "Do Italian universities calculate fees based on family income?",
    answer:
      "Often, yes. The European Commission notes that fees for EU and non-EU students depend on declared family income and the preferred degree course, and many universities offer reductions or exemptions. The exact mechanism differs per institution, so read its official fee regulations.",
  },
  {
    question: "How can I check the exact tuition fee for my course?",
    answer:
      "Find the course on Universitaly, open the university and course information, read the official tuition regulations or annual call for your intake, check income-based and non-EU rules plus any waiver calls, and confirm with the university if anything is unclear.",
  },
  {
    question: "Is the cost different between Italian cities?",
    answer:
      "Yes — living costs in particular vary by city and accommodation market, which is why official guidance gives a range rather than one figure. Compare actual housing options and university information for your chosen city instead of assuming a national average applies to you.",
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
    text: "Universities, courses, admission and the full journey from India.",
  },
  {
    href: "/italy-university-admission",
    title: "Italy university admission",
    text: "Requirements, application steps and deadlines per programme.",
  },
  {
    href: "/italy-scholarships",
    title: "Italy scholarships",
    text: "DSU, MAECI and university awards that can lower your costs.",
  },
  {
    href: "/italy-student-visa",
    title: "Italy student visa",
    text: "Financial evidence and the visa process after admission.",
  },
  {
    href: "/universities",
    title: "Universities in Italy",
    text: "Compare institutions and their official fee regulations.",
  },
  {
    href: "/courses",
    title: "Courses in Italy",
    text: "Shortlist programmes, then verify each exact fee.",
  },
];

export default function CostOfStudyingInItalyPage() {
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
                2026 cost guide for Indian students
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
                Cost of Studying in Italy for Indian Students
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
                Your total cost depends on tuition, city, accommodation,
                lifestyle, programme and whether a scholarship or fee waiver
                applies. This guide gives the current official indicative
                ranges and shows you how to verify the exact fee for your own
                course.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <CtaButton href="/universities">Explore Universities</CtaButton>
                <CtaButton href="/italy-scholarships" variant="secondary">
                  Scholarships Guide
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
              Important: fees and costs change
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
              Ranges below reflect current official guidance, principally the{" "}
              <OfficialLink href="https://education.ec.europa.eu/study-in-europe/country-profiles/italy">
                European Commission Italy profile
              </OfficialLink>{" "}
              (last updated 24 March 2026). They are indicative, not prices —
              your university&apos;s official tuition regulations for your
              intake are the only final source. European Dreams does not
              guarantee any specific cost.
            </p>
          </div>
        </section>

        {/* 3. Quick cost overview */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="At a glance"
            title="Study in Italy Cost: Quick Overview"
            intro="Three indicative figures from current official guidance. Each needs verification against your programme and city."
          />
          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                  <th scope="col" className="px-5 py-4 font-bold text-[var(--foreground)]">
                    Category
                  </th>
                  <th scope="col" className="px-5 py-4 font-bold text-[var(--foreground)]">
                    Indicative cost
                  </th>
                  <th scope="col" className="px-5 py-4 font-bold text-[var(--foreground)]">
                    Important note
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                <tr>
                  <th scope="row" className="px-5 py-4 font-semibold text-[var(--foreground)]">
                    Public university tuition
                  </th>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Approximately €900–€4,000 per year
                  </td>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Varies by institution, programme and family income; reductions possible
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="px-5 py-4 font-semibold text-[var(--foreground)]">
                    Private institution tuition
                  </th>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Approximately €6,000–€20,000+ per year
                  </td>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Varies substantially by institution and programme
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="px-5 py-4 font-semibold text-[var(--foreground)]">
                    Living costs
                  </th>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Approximately €700–€1,100 per month
                  </td>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Depends on the city, accommodation and lifestyle
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="border-t border-[var(--border)] px-5 py-4 text-xs leading-5 text-[var(--muted-foreground)]">
              Source:{" "}
              <OfficialLink href="https://education.ec.europa.eu/study-in-europe/country-profiles/italy">
                European Commission — Study in Italy country profile
              </OfficialLink>
              . Indicative guidance, not universal fixed fees.
            </p>
          </div>
        </section>

        {/* 4. Tuition fees explained */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Tuition"
              title="Italy University Fees for International Students"
              intro="There is no single Italian tuition fee. Six factors decide what you actually pay."
            />
            <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Public vs private
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Public universities charge within the lower official band;
                  private institutions set their own, generally higher fees.
                  The gap between the two sectors is the single biggest
                  tuition variable.
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Programme differences
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Fees differ by degree course — specialised, laboratory-heavy
                  or internationally oriented programmes can sit at different
                  points of the range even inside the same university.
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Income-based calculation
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Fees commonly depend on declared family income, so two
                  students on the same course can pay different amounts. Read
                  your university&apos;s income-band rules carefully.
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  EU vs non-EU treatment
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Fees may be lower for EU/EEA students, and the treatment of
                  non-EU students such as Indian applicants can differ by
                  institution — confirm which rules apply to you.
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Reductions and exemptions
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Many universities offer reductions or full exemptions on
                  merit or income grounds. These come from separate calls with
                  their own deadlines — see our{" "}
                  <Link
                    href="/italy-scholarships"
                    className="font-semibold text-[var(--primary)] hover:underline"
                  >
                    Italy scholarships guide
                  </Link>
                  .
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  The only final source
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Your exact fee lives in the university&apos;s tuition
                  regulations or annual call for your intake, cross-checked at
                  course level on{" "}
                  <OfficialLink href="https://www.universitaly.it/it/studenti-stranieri">
                    Universitaly
                  </OfficialLink>
                  . No guide can substitute for those documents.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 5 + 6. Public and private ranges */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Tuition bands"
            title="Italy Tuition Fees: Public vs Private"
            intro="The two official indicative bands, and what they do — and do not — promise."
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Public university fees: €900–€4,000 per year
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                The European Commission&apos;s current guidance places public
                university tuition at approximately €900–€4,000 per year. This
                describes the sector broadly — it does not mean every public
                university charges within it for every programme, and
                income-based placement plus reductions can move your figure
                below the band.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Private university fees: €6,000–€20,000+ per year
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Private institutions are guided at approximately
                €6,000–€20,000+ per year — and the open-ended &ldquo;+&rdquo;
                matters. Specialised and international programmes can vary
                substantially, so confirm the exact fee with the institution
                before shortlisting on price.
              </p>
            </article>
          </div>
        </section>

        {/* 7. Cost of living */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Living costs"
              title="Cost of Living in Italy for Students"
              intro="Current official guidance: students typically spend €700–€1,100 per month, depending on the city. Four buckets make up that total — described here without invented sub-prices."
            />
            <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Accommodation
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Usually the largest monthly expense — shared flats, single
                  rooms, university residences and dorms differ widely by city
                  and neighbourhood. Compare real listings for your chosen
                  city rather than assuming any single rent.
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Food
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Cooking at home costs far less than eating out, and
                  university canteens or regional DSU meal services can help
                  where available. Your habits decide this line more than any
                  average can.
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Local transport
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Monthly passes and student discounts keep commuting
                  affordable in most university cities; cycling is common in
                  flatter towns. Check the local transport company&apos;s
                  student fares.
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Study and personal expenses
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Books and materials, phone plans, clothing and leisure add
                  up. They are the most lifestyle-sensitive part of the
                  budget — track yours for a month to calibrate.
                </p>
              </article>
            </div>
            <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
              For housing searches, transport, healthcare and arrival
              checklists, see our{" "}
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

        {/* 8. City differences */}
        <section
          id="location-matters"
          className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
        >
          <SectionHeading
            eyebrow="Location matters"
            title="Milan and Rome vs Other University Cities"
            intro="Living costs sit inside the official Italy-wide range of approximately €700–€1,100 per month — where a city falls within that range varies. The tiers below are directional, not price bands."
          />
          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                  <th
                    scope="col"
                    className="px-5 py-4 font-bold text-[var(--foreground)]"
                  >
                    Living-cost tier
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-4 font-bold text-[var(--foreground)]"
                  >
                    Example cities
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-4 font-bold text-[var(--foreground)]"
                  >
                    How to read it
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                <tr>
                  <th
                    scope="row"
                    className="px-5 py-4 font-semibold text-[var(--foreground)]"
                  >
                    Higher-cost examples
                  </th>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Milan, Rome
                  </td>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Often toward the top of the national range, driven mainly
                    by competitive accommodation markets
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-5 py-4 font-semibold text-[var(--foreground)]"
                  >
                    Mid-range examples
                  </th>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Bologna, Florence
                  </td>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Often around the middle of the national range, with
                    variation by neighbourhood and housing type
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="px-5 py-4 font-semibold text-[var(--foreground)]"
                  >
                    Often-lower-cost examples
                  </th>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Padua, Turin, Pisa
                  </td>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Often toward the lower part of the national range, but
                    still varies by accommodation and lifestyle
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="border-t border-[var(--border)] px-5 py-4 text-xs leading-5 text-[var(--muted-foreground)]">
              These tiers are directional, not fixed price bands. The official
              Italy-wide indicative range of approximately €700–€1,100 per month
              (European Commission country profile for Italy) still applies;
              actual costs vary by accommodation, neighbourhood, lifestyle,
              transport and intake year. No city is labelled cheapest or most
              expensive — budget from actual listings for your intake year and
              verify housing early.
            </p>
          </div>
          <div className="mx-auto mt-6 max-w-3xl space-y-4 text-sm leading-6 text-[var(--muted-foreground)]">
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              Larger, high-demand cities such as Milan and Rome generally sit
              toward the top of the national living-cost range, driven mainly
              by competitive accommodation markets — while smaller university
              towns often sit lower. That is a qualitative pattern, not a
              price promise for any specific city.
            </p>
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              Within any city, neighbourhood, room type and timing matter as
              much as the city name: start your housing search early, compare
              university residences against the private market, and budget
              from actual listings for your intake year.
            </p>
          </div>
        </section>

        {/* 9. Additional costs */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Beyond tuition and rent"
              title="Additional Study-Related Costs in Italy"
              intro="Smaller but real costs that belong in the plan. Each varies — verify with the relevant authority or university."
            />
            <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Application and enrolment charges
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Universities may levy application, enrolment or
                  region-linked student charges where applicable. Amounts and
                  applicability differ per institution — check the call, not
                  a generic figure.
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Health insurance and healthcare
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Health insurance is required for international students in
                  Italy — via private cover or registration with the Italian
                  National Health Service, per current official guidance.
                  Confirm the accepted options for your situation before
                  departure.
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Residence permit costs
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Applying for the residence permit after arrival involves
                  official charges that can change. Check the current
                  figures on the{" "}
                  <OfficialLink href="https://studyinitaly.esteri.it/static/ProcedureIscrizione">
                    official Study in Italy guidance
                  </OfficialLink>{" "}
                  and budget them as indicative, not fixed. Visa-step detail
                  is in our{" "}
                  <Link
                    href="/italy-student-visa"
                    className="font-semibold text-[var(--primary)] hover:underline"
                  >
                    Italy student visa guide
                  </Link>
                  .
                </p>
              </article>
              <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Travel and setup
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Flights, initial accommodation deposits, everyday setup and
                  the first month&apos;s overlap costs. One-off but
                  unavoidable — price them from real quotes, not averages.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 10. Scholarships */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Pay less"
            title="Scholarships and Fee Reductions"
            intro="Funding is the other half of cost planning. Each route below has its own call — nothing here substitutes for it."
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                Regional DSU support
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Need- and merit-based benefits from each region&apos;s
                student-aid agency — money plus possible meals, housing help
                and tax exemption, assessed on income and merit.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                University awards and waivers
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Merit reductions, tuition waivers and allowances decided by
                each university — the fastest way to cut the headline fee,
                where you qualify.
              </p>
            </article>
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6 sm:col-span-2">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                MAECI grants and other routes
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Italian government grants plus programme-linked schemes can
                contribute to living costs. Full detail lives in our{" "}
                <Link
                  href="/italy-scholarships"
                  className="font-semibold text-[var(--primary)] hover:underline"
                >
                  Italy scholarships guide for Indian students
                </Link>{" "}
                — DSU, MAECI, university awards, documents and deadlines.
              </p>
            </article>
          </div>
        </section>

        {/* 11. Planning framework */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Your budget"
              title="Cost Planning Framework for Indian Students"
              intro="No single fabricated total follows — instead, build your own annual cost from these five blocks."
            />
            <ul className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
              {plannerFramework.map((item) => (
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

        {/* 12. Bachelor vs Master */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Degree level"
            title="Bachelor vs Master Costs in Italy"
            intro="The level alone does not fix the price — the institution and programme do."
          />
          <div className="mx-auto mt-10 max-w-3xl space-y-4 text-sm leading-6 text-[var(--muted-foreground)]">
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              Bachelor&apos;s (Laurea), Master&apos;s (Laurea Magistrale) and
              single-cycle programmes each sit inside the same official
              tuition bands; where your fee lands depends on the university,
              the course and your income band — not on a universal
              Bachelor-versus-Master price. Duration matters more for total
              spend: a three-year Bachelor accumulates more living costs than
              a two-year Master in the same city.
            </p>
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              Compare real programmes in our{" "}
              <Link
                href="/courses"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                courses in Italy
              </Link>{" "}
              listing and verify each fee with the{" "}
              <Link
                href="/universities"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                university
              </Link>{" "}
              behind it.
            </p>
          </div>
        </section>

        {/* 13. How to check exact fee */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="Verify before you apply"
              title="How to Check the Exact Fee Before Applying"
              intro="Six steps from shortlist to a confirmed number."
            />
            <ol className="mx-auto mt-10 max-w-3xl space-y-4">
              {checkFeeSteps.map((step, index) => (
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
              Course-level information starts at{" "}
              <OfficialLink href="https://studyinitaly.esteri.it/Static/TrovaIlTuoCorso">
                Find your course on Study in Italy
              </OfficialLink>{" "}
              and international-student procedures at{" "}
              <OfficialLink href="https://www.universitaly.it/it/studenti-stranieri">
                Universitaly
              </OfficialLink>
              .
            </p>
          </div>
        </section>

        {/* 14. Admission / scholarship / visa */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="How the pieces connect"
            title="Admission, Scholarships and Visa Costs"
            intro="Connected but separate processes — each with its own cost logic."
          />
          <div className="mx-auto mt-10 max-w-3xl space-y-4 text-sm leading-6 text-[var(--muted-foreground)]">
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <strong className="text-[var(--foreground)]">Admission</strong>{" "}
              — the academic decision plus any application or enrolment
              charges the university sets. Start with the{" "}
              <Link
                href="/italy-university-admission"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Italy university admission guide
              </Link>
              .
            </p>
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <strong className="text-[var(--foreground)]">
                Scholarships
              </strong>{" "}
              — the lever that lowers tuition and living costs, applied for
              separately on its own timeline. See the{" "}
              <Link
                href="/italy-scholarships"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Italy scholarships guide
              </Link>
              .
            </p>
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <strong className="text-[var(--foreground)]">Visa</strong> —
              decided by the competent authorities on admission,
              pre-enrolment and supporting evidence including financial
              means. Costs here are administrative, not tuition; detail is in
              the{" "}
              <Link
                href="/italy-student-visa"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                student visa guide
              </Link>
              .
            </p>
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              The full journey from India is mapped in our{" "}
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

        {/* 15. FAQ */}
        <section className="border-y border-[var(--border)] bg-[var(--card)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow="FAQ"
              title="Cost of Studying in Italy: FAQs"
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

        {/* 16. Keep planning + CTA */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Keep planning"
            title="Plan the Rest of Your Italy Journey"
            intro="Costs are one piece — funding, admission and the visa complete the picture."
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
              Want help budgeting your Italy plan?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl opacity-80">
              Get personalised guidance on universities, real fee
              verification, scholarships and the Italy student visa.
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
