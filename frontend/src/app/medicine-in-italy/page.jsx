import Link from "next/link";

import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

const SITE_URL = "https://www.europeandreamss.com";
const CANONICAL = `${SITE_URL}/medicine-in-italy`;

export const metadata = {
  title: "Medicine in Italy for Indian Students 2026/27 | IMAT, Seats & NEET",
  description:
    "Medicine in Italy for Indian students: 2026/27 IMAT, English-taught universities and seats, open-semester route, NEET, NMC and visa guidance.",
  alternates: {
    canonical: CANONICAL,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Medicine in Italy for Indian Students 2026/27 | IMAT, Seats & NEET",
    description:
      "Medicine in Italy for Indian students: 2026/27 IMAT, English-taught universities and seats, open-semester route, NEET, NMC and visa guidance.",
    url: CANONICAL,
    siteName: "European Dreams",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medicine in Italy for Indian Students 2026/27 | IMAT, Seats & NEET",
    description:
      "Medicine in Italy for Indian students: 2026/27 IMAT, English-taught universities and seats, open-semester route, NEET, NMC and visa guidance.",
  },
};

const breadcrumbItems = [
  { name: "Home", href: `${SITE_URL}/` },
  { name: "Study in Italy", href: `${SITE_URL}/study-in-italy` },
  { name: "Medicine in Italy", href: CANONICAL },
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
  name: "Medicine in Italy for Indian Students 2026/27 | IMAT, Seats & NEET",
  description:
    "2026/27 guide for Indian students on Medicine and Surgery in Italy: national IMAT route for English-taught programmes, university seats, Italian open-semester route, NEET and NMC requirements, and admission steps.",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  breadcrumb: { "@id": `${CANONICAL}#breadcrumb` },
  inLanguage: "en-IN",
};

const faqs = [
  {
    question: "Can Indian students study Medicine in Italy?",
    answer:
      "Yes. Indian students are admitted to English-taught Medicine and Surgery programmes in Italy every year through the national IMAT route, subject to each year's ministerial framework and the individual university's call. Separately, Indian medical-regulatory (NEET/NMC) eligibility must be verified with the applicable Indian authorities.",
  },
  {
    question: "Is NEET required for Indian students to study Medicine in Italy?",
    answer:
      "For the Indian side, yes: under the NMC Foreign Medical Graduate Licentiate Regulations 2021, a person must have successfully qualified NEET (UG) for admission to a foreign medical institution. This is separate from Italian university admission — verify the current rule with the National Medical Commission before applying.",
  },
  {
    question: "What is IMAT?",
    answer:
      "IMAT (International Medical Admission Test) is the national admission test for English-taught single-cycle Medicine and Surgery, Dentistry and Veterinary programmes in Italy for 2026/27, governed by MUR Decree No. 1005 of 6 August 2026. It is prepared centrally and is identical in content across test locations.",
  },
  {
    question: "When is IMAT 2026?",
    answer:
      "The 2026/27 IMAT for English-taught Medicine, Dentistry and Veterinary programmes is set for 29 September 2026, following the MUR announcement of 7 July 2026 as integrated by the errata corrige of 29 July 2026. Registration ran on Universitaly from 26 August to 9 September 2026 (15:00 GMT+2). Always confirm dates in the current official call.",
  },
  {
    question: "How many Medicine seats are available in Italy in 2026/27?",
    answer:
      "For English-taught Medicine and Surgery (LM-41), the 2026/27 ministerial framework allocates 2,430 EU/equivalent and 1,362 non-EU-abroad places across universities (3,792 total), plus separate Dentistry and Veterinary allocations. Per-university figures are listed in the seat table on this page; annual numbers can change.",
  },
  {
    question: "Which Italian universities offer Medicine in English?",
    answer:
      "For 2026/27, English-taught Medicine and Surgery places are allocated to universities including Bologna, Milan (Statale), Milan-Bicocca (Bergamo), Pavia, Padua (Venice and MedTech), Turin (Orbassano), Sapienza Rome, Tor Vergata Rome, Naples Federico II, Bari, Cagliari, Campania Vanvitelli, Catania, Messina, Parma/Piacenza and Ancona, plus private institutions. Check each university's current call for its exact programme.",
  },
  {
    question: "Is Medicine in Italy taught in English?",
    answer:
      "Yes, where the programme confirms it: several universities offer Medicine and Surgery entirely in English via the IMAT route, while most Medicine places remain Italian-taught via the open-semester route. Always confirm the language of instruction for your exact programme and intake.",
  },
  {
    question: "What is the difference between IMAT and the open-semester route?",
    answer:
      "IMAT is the single national admission test for English-taught Medicine, Dentistry and Veterinary programmes. The open semester applies to Italian-taught Medicine and Dentistry: students enrol freely in a first semester of Biology, Chemistry and Physics, then sit national examinations that feed a national merit ranking for second-semester admission. The two systems are not interchangeable.",
  },
  {
    question: "Does Italian medical admission guarantee Indian medical registration?",
    answer:
      "No. Admission to an Italian medical programme does not by itself guarantee eligibility for medical registration in India. Meeting NEET/NMC requirements does not guarantee admission to a particular Italian university either. The two tracks — Italian admission and Indian regulatory eligibility — must each be verified separately.",
  },
  {
    question: "Can I study Medicine in Italy after 12th?",
    answer:
      "Yes, where the programme's call allows it: English-taught Medicine and Surgery is a single-cycle degree entered after secondary school (Class 12 or equivalent qualification recognised as suitable), subject to the IMAT route and programme-specific prerequisites. Confirm academic requirements in the current call and NEET/NMC eligibility separately.",
  },
  {
    question: "Are scholarships available for Medicine students?",
    answer:
      "General routes — regional DSU need-based support, university merit measures and MAECI government grants in selected years — can apply to Medicine students where the specific call allows it. None can be promised in advance; medicine-specific eligibility must be checked against the current regional or university call.",
  },
  {
    question: "How does Universitaly fit into the Medicine process?",
    answer:
      "Universitaly is the MUR portal used across the Medicine journey: IMAT registration runs on Universitaly, and international students who require a visa separately complete pre-enrolment there after admission. The validated pre-enrolment summary then supports the student visa application.",
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

const seatRows = [
  { university: "University of Bologna", city: "Bologna", course: "Medicine and Surgery (English)", total: "160", eu: "140", nonEu: "20", note: "" },
  { university: "University of Milan", city: "Milan", course: "International Medical School (English)", total: "75", eu: "60", nonEu: "15", note: "" },
  { university: "University of Pavia", city: "Pavia", course: "Medicine and Surgery – Harvey (English)", total: "143", eu: "103", nonEu: "40", note: "" },
  { university: "University of Padua", city: "Venice", course: "Medicine and Surgery (English)", total: "100", eu: "75", nonEu: "25", note: "" },
  { university: "University of Padua", city: "Padua", course: "Medicine and Surgery – MedTech (English)", total: "85", eu: "70", nonEu: "15", note: "Listed as in fase di accreditamento in the ministerial table." },
  { university: "University of Turin", city: "Orbassano", course: "Medicine and Surgery (English)", total: "105", eu: "73", nonEu: "32", note: "" },
  { university: "Sapienza University of Rome", city: "Rome", course: "Medicine and Surgery 'F' (English)", total: "65", eu: "52", nonEu: "13", note: "" },
  { university: "University of Rome Tor Vergata", city: "Rome", course: "Medicine and Surgery (English)", total: "85", eu: "65", nonEu: "20", note: "" },
  { university: "University of Rome Tor Vergata", city: "Tirana", course: "Medicine and Surgery (English)", total: "320", eu: "0", nonEu: "320", note: "Tirana campus is in Albania, not Italy." },
  { university: "University of Naples Federico II", city: "Naples", course: "Medicine and Surgery (English)", total: "80", eu: "35", nonEu: "45", note: "" },
  { university: "University of Bari", city: "Bari", course: "Medicine and Surgery (English)", total: "100", eu: "89", nonEu: "11", note: "" },
  { university: "University of Cagliari", city: "Cagliari", course: "Medicine and Surgery (English)", total: "98", eu: "80", nonEu: "18", note: "" },
  { university: "University of Campania Luigi Vanvitelli", city: "Naples", course: "Medicine and Surgery (English)", total: "120", eu: "70", nonEu: "50", note: "" },
  { university: "University of Catania", city: "Catania", course: "Medicine and Surgery (English)", total: "80", eu: "40", nonEu: "40", note: "" },
  { university: "University of Messina", city: "Messina", course: "Medicine and Surgery (English)", total: "116", eu: "55", nonEu: "61", note: "" },
  { university: "University of Milano-Bicocca", city: "Bergamo", course: "Medicine and Surgery (English)", total: "60", eu: "40", nonEu: "20", note: "Bergamo sede under Milano-Bicocca." },
  { university: "University of Parma", city: "Parma/Piacenza", course: "Medicine and Surgery (English)", total: "130", eu: "80", nonEu: "50", note: "Piacenza sede under Parma; university bando confirms 80 + 50." },
  { university: "Marche Polytechnic University", city: "Ancona", course: "Medicine and Surgery (English)", total: "80", eu: "30", nonEu: "50", note: "" },
  { university: "UniCamillus – Saint Camillus International", city: "Rome", course: "Medicine and Surgery (English)", total: "650", eu: "425", nonEu: "225", note: "Private institution; decree lists EU/equivalent and non-EU categories separately." },
  { university: "Vita-Salute San Raffaele", city: "Milan", course: "Medicine and Surgery (English)", total: "150", eu: "86", nonEu: "64", note: "Private institution; decree lists EU/equivalent and non-EU categories separately." },
  { university: "Campus Bio-Medico", city: "Rome", course: "Medicine and Surgery (English)", total: "120", eu: "84", nonEu: "36", note: "Private institution; decree lists EU/equivalent and non-EU categories separately." },
  { university: "Campus Bio-Medico", city: "Rome", course: "Medicine and Surgery – MedTech (English)", total: "80", eu: "68", nonEu: "12", note: "Private institution; separate MedTech programme row in the decree table." },
];

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

export default function MedicineInItalyPage() {
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
                2026/27 official framework
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl">
                Medicine in Italy for Indian Students
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)] sm:text-base sm:leading-7">
                How Indian students can study Medicine and Surgery in Italy in
                2026/27 — the national IMAT route for English-taught programmes,
                university seats, the Italian open-semester route, and Indian
                NEET/NMC requirements.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <CtaButton href="/universities">Explore Universities</CtaButton>
                <CtaButton href="/courses" variant="secondary">
                  Explore Courses
                </CtaButton>
                <CtaButton href="/contact" variant="secondary">
                  Get Free Consultation
                </CtaButton>
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                Last updated: September 2026
              </p>
            </div>
          </div>
        </section>

        {/* What to know */}
        <section
          id="overview"
          className="scroll-mt-[104px] border-b border-[var(--border)] bg-[var(--card)]"
        >
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <SectionHeading
              eyebrow="Direct answer"
              title="Medicine in Italy: What Indian Students Need to Know"
              intro="Five separate tracks. Do not conflate them — each has its own decision-maker and its own official sources."
            />
            <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">
                  1. Italian university admission
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Decided by the university under the national ministerial
                  framework (DM 1005 for English-taught; DM 941 open semester
                  for Italian-taught). Your call (bando) for that intake is the
                  binding document.
                </p>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">
                  2. English-taught Medicine admission
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Uses the 2026/27 national IMAT route where applicable:
                  single test on 29 September 2026, national ranking, per-university
                  EU/non-EU seat contingents listed below.
                </p>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">
                  3. Italian-taught Medicine admission
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Uses the 2026/27 open-semester system: free enrolment in
                  Biology, Chemistry and Physics, then national examinations
                  feeding a national merit ranking. No single entrance test.
                </p>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">
                  4. Indian NEET/NMC requirements
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Governed solely by Indian authorities (NMC FMGL Regulations
                  2021): NEET-UG qualification before foreign admission, PCB
                  core subjects, and programme conditions. Verify with the NMC.
                </p>
              </article>
            </div>
            <div className="mx-auto mt-4 max-w-5xl rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5 dark:border-amber-900/30 dark:bg-amber-950/20">
              <h3 className="font-bold text-[var(--foreground)]">
                5. Medical registration in India
              </h3>
              <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                Admission to an Italian university does NOT by itself guarantee
                eligibility for medical registration or practice in India.
                Meeting NEET/NMC requirements does not guarantee admission to a
                particular Italian university either. Verify both tracks
                separately.
              </p>
            </div>
          </div>
        </section>

        {/* At a glance */}
        <section
          id="glance"
          aria-label="Medicine in Italy 2026/27 at a glance"
          className="mx-auto max-w-7xl scroll-mt-[104px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        >
          <SectionHeading
            eyebrow="At a glance"
            title="Medicine in Italy 2026/27 at a Glance"
            intro="Key facts for 2026/27. Detail and sources follow in each section below."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">English Medicine test: IMAT</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                National test for English-taught Medicine, Dentistry and
                Veterinary (DM 1005 of 6 August 2026), identical content at all
                locations.
              </p>
            </article>
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">IMAT date: 29 September 2026</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Set by the MUR announcement of 7 July 2026 as integrated by the
                errata corrige of 29 July 2026; confirmed in university bandi.
              </p>
            </article>
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">Registration: 26 August – 9 September 2026</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                On Universitaly, closing 15:00 GMT+2 without exceptions, per
                university bandi citing the decree annex.
              </p>
            </article>
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">English requirement: B2 where required</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Programmes such as Parma require B2-level English certification
                per the applicable call; missing it means exclusion from later
                stages.
              </p>
            </article>
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">Test: 60 questions / 100 minutes</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Multiple-choice format reported in university bandi; scoring
                +1.5 correct, −0.4 incorrect, 0 unanswered (max 90).
              </p>
            </article>
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">Italian-taught route: open semester</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                2026/27 open-semester system (DM 941): Biology, Chemistry and
                Physics with national examinations and merit ranking. See our{" "}
                <Link
                  href="/open-semester-medicine-italy"
                  className="font-semibold text-[var(--primary)] hover:underline"
                >
                  Italy Open Semester 2026/27
                </Link>{" "}
                guide.
              </p>
            </article>
          </div>
        </section>

        {/* English-taught */}
        <section
          id="english-track"
          className="scroll-mt-[104px] border-y border-[var(--border)] bg-[var(--card)]"
        >
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <SectionHeading
              eyebrow="English track"
              title="English-Taught Medicine in Italy"
              intro="English-taught Medicine and Surgery uses the 2026/27 national IMAT route where applicable. Exact requirements remain subject to the official decree and each university's call."
            />
            <div className="mx-auto mt-6 max-w-3xl space-y-3 text-sm leading-6 text-[var(--muted-foreground)]">
              <p>
                Admission runs through one national test with national ranking,
                not through separate university-designed exams. Universities
                publish their own calls implementing the ministerial framework,
                including seat contingents, language rules and deadlines.
              </p>
              <p>
                Applicants compete in separate contingents: EU citizens and
                equivalent categories (including qualifying non-EU residents in
                Italy) in one pool, and non-EU residents abroad in another. The
                seat table below shows both contingents per university.
              </p>
              <p>
                No minimum score or ranking outcome is stated here: thresholds
                emerge from each year&apos;s ranking and scrolling, so treat any
                historical cutoff as background only — never as a guarantee.
              </p>
            </div>
            <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
              For general admission mechanics that also apply to medics, see our{" "}
              <Link
                href="/italy-university-admission"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Italy university admission guide
              </Link>{" "}
              and{" "}
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

        {/* Seats */}
        <section
          id="seats"
          className="mx-auto max-w-7xl scroll-mt-[104px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        >
          <SectionHeading
            eyebrow="2026/27 seats"
            title="2026/27 English Medicine Universities and Seats"
            intro="Seat allocations are for 2026/27 and come from the MUR admission framework and official university notices. Annual seat numbers can change."
          />
          <div className="mx-auto mt-8 max-w-6xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                    <th scope="col" className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]">University</th>
                    <th scope="col" className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]">City</th>
                    <th scope="col" className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]">Course</th>
                    <th scope="col" className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]">Total</th>
                    <th scope="col" className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]">EU/equivalent</th>
                    <th scope="col" className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]">Non-EU abroad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {seatRows.map((row) => (
                    <tr key={`${row.university}-${row.city}-${row.course}`}>
                      <th scope="row" className="px-5 py-4 font-semibold text-[var(--foreground)]">
                        {row.university}
                        {row.note && (
                          <span className="mt-1 block text-xs font-normal leading-5 text-[var(--muted-foreground)]">
                            {row.note}
                          </span>
                        )}
                      </th>
                      <td className="px-5 py-4 text-[var(--muted-foreground)]">{row.city}</td>
                      <td className="px-5 py-4 text-[var(--muted-foreground)]">{row.course}</td>
                      <td className="px-5 py-4 font-semibold text-[var(--foreground)]">{row.total}</td>
                      <td className="px-5 py-4 text-[var(--muted-foreground)]">{row.eu}</td>
                      <td className="px-5 py-4 text-[var(--muted-foreground)]">{row.nonEu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-[var(--border)] px-5 py-4 text-xs leading-5 text-[var(--muted-foreground)]">
              Seat allocations are for 2026/27 and come from the MUR admission
              framework (DM 1005 Tabella B posti) and official university
              notices. Annual seat numbers can change. Sources:{" "}
              <a
                href="https://www.mur.gov.it/it/atti-e-normativa/decreto-ministeriale-n-1005-del-06-08-2026"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                MUR DM 1005 (06/08/2026)
              </a>
              {" · "}
              <a
                href="https://www.mur.gov.it/it/news/martedi-07072026/universita-fissate-le-date-delle-prove-dammissione-le-facolta-ad-accesso"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                MUR admission dates 07/07/2026
              </a>
              {" · "}
              <a
                href="https://www.unipd.it/ammissioni-medicine-surgery"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                University of Padua Medicine admissions
              </a>
              {" · "}
              <a
                href="https://corsi.unipr.it/it/cdlm-ms/test-di-ammissione"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                University of Parma admission test page
              </a>
              .
            </p>
          </div>
          <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
            Comparing universities? See all institutions on our{" "}
            <Link
              href="/universities"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              universities in Italy listing
            </Link>{" "}
            and programmes on{" "}
            <Link
              href="/courses"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              courses in Italy
            </Link>
            . For a concrete English-taught example, see{" "}
            <Link
              href="/courses/university-of-milan/medicine-and-surgery-single-cycle-masters-6-yrs"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              Medicine and Surgery at the University of Milan
            </Link>{" "}
            and the related{" "}
            <Link
              href="/courses/university-of-milan/dental-medicine-single-cycle-masters-6-yrs"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              Dental Medicine at the University of Milan
            </Link>
            .
          </p>
        </section>

        {/* IMAT */}
        <section
          id="imat"
          className="scroll-mt-[104px] border-y border-[var(--border)] bg-[var(--card)]"
        >
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <SectionHeading
              eyebrow="The test"
              title="IMAT 2026/27"
              intro="The national admission test for English-taught Medicine, Dentistry and Veterinary programmes."
            />
            <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">Full name</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  International Medical Admission Test (IMAT) — the national
                  test for English-taught single-cycle Medicine and Surgery,
                  Dentistry and Veterinary programmes.
                </p>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">Date</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  29 September 2026, per the MUR announcement of 7 July 2026 as
                  integrated by the errata corrige of 29 July 2026 and confirmed
                  in university bandi.
                </p>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">Registration window</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  On Universitaly from 26 August to 9 September 2026 (15:00
                  GMT+2), without exceptions, per university bandi citing the
                  decree annex.
                </p>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">Format and scoring</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  60 multiple-choice questions in 100 minutes; +1.5 per correct
                  answer, −0.4 per wrong answer, 0 for unanswered (maximum 90),
                  as reported in university bandi.
                </p>
              </article>
            </div>
            <div className="mx-auto mt-4 max-w-5xl rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">
                B2 English requirement where the call requires it
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Programmes such as Parma require B2-level English certification
                under the applicable call, with exclusion from later stages for
                non-compliance. Check your university&apos;s call for its exact
                language rule.
              </p>
            </div>
            <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
              Official references:{" "}
              <a
                href="https://www.universitaly.it/en/imat"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Universitaly IMAT page
              </a>
              {" · "}
              <a
                href="https://www.universitaly.it/en"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                Universitaly portal
              </a>
              .
            </p>
          </div>
        </section>

        {/* NEET/NMC */}
        <section
          id="neet-nmc"
          className="mx-auto max-w-7xl scroll-mt-[104px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        >
          <SectionHeading
            eyebrow="Indian eligibility"
            title="Medicine in Italy for Indian Students: NEET and NMC"
            intro="Italian admission and Indian medical-regulatory eligibility are two separate tracks. Read this section carefully."
          />
          <div className="mx-auto mt-8 max-w-3xl space-y-3 text-sm leading-6 text-[var(--muted-foreground)]">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">1. Separate tracks</h3>
              <p className="mt-2">
                Italian university admission (IMAT/call) and Indian
                medical-regulatory eligibility (NEET/NMC) are decided by
                different authorities under different rules. Progress on one
                track implies nothing about the other.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">2. NEET-UG before going abroad</h3>
              <p className="mt-2">
                Under the NMC Foreign Medical Graduate Licentiate Regulations
                2021, a person must have successfully qualified NEET (UG) for
                admission to a foreign medical institution. These regulations
                apply to students joining foreign programmes on or after their
                Gazette commencement (18 November 2021), covering 2026/27
                applicants.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">3. PCB core subjects</h3>
              <p className="mt-2">
                The regulation requires Physics, Chemistry and Biology /
                Biotechnology as core or main subjects in the last two years of
                schooling (including practical tests), as applicable.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">4. Programme conditions (54 + 12)</h3>
              <p className="mt-2">
                Registration in India requires, subject to the applicable
                regulation: a foreign medical course of minimum 54 months plus
                a minimum 12-month internship in the same foreign institution,
                with no part of training in India or a third country.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">5. English medium</h3>
              <p className="mt-2">
                The foreign medical degree must have English as the medium of
                instruction — a condition English-taught Italian Medicine
                programmes satisfy where the programme confirms it.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">6. Registrability abroad</h3>
              <p className="mt-2">
                The graduate must be registered (or registrable) with the
                competent professional body of the awarding country. No claim is
                made here about any specific university&apos;s status — verify
                with the competent authorities.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">7. FMGE until NExT</h3>
              <p className="mt-2">
                After the foreign degree, registration in India requires
                clearing the Foreign Medical Graduate Examination (FMGE) until
                the National Exit Test (NExT) becomes operational, with the
                future pathway thereafter as notified by the Commission.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-4 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5 dark:border-amber-900/30 dark:bg-amber-950/20">
            <p className="text-sm font-bold leading-6 text-[var(--foreground)]">
              Meeting NEET/NMC requirements does not guarantee admission to a
              particular Italian university, and admission to an Italian medical
              programme does not by itself guarantee eligibility for medical
              registration in India.
            </p>
            <p className="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">
              Sources:{" "}
              <a
                href="https://www.nmc.org.in/ActivitiWebClient/open/getDocument?path=%2FDocuments%2FPublic%2FPortal%2FNmcGazette%2F231275.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--primary)] hover:underline"
              >
                NMC FMGL Regulations 2021 (Gazette)
              </a>
              . No “NMC-approved” or “NMC-recognised” university is claimed
              anywhere on this page.
            </p>
          </div>
        </section>

        {/* English vs Italian */}
        <section
          id="routes"
          className="scroll-mt-[104px] border-y border-[var(--border)] bg-[var(--card)]"
        >
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <SectionHeading
              eyebrow="Two systems"
              title="English Medicine vs Italian Medicine"
              intro="The two routes are different systems with different rules. They are not interchangeable."
            />
            <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                      <th scope="col" className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]">Aspect</th>
                      <th scope="col" className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]">English-taught route</th>
                      <th scope="col" className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-[var(--foreground)]">Italian-taught route</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    <tr>
                      <th scope="row" className="px-5 py-4 font-semibold text-[var(--foreground)]">Mechanism</th>
                      <td className="px-5 py-4 text-[var(--muted-foreground)]">National IMAT admission test</td>
                      <td className="px-5 py-4 text-[var(--muted-foreground)]">2026/27 open-semester system (DM 941)</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-5 py-4 font-semibold text-[var(--foreground)]">Language</th>
                      <td className="px-5 py-4 text-[var(--muted-foreground)]">English-taught programme; B2 proof where the call requires it</td>
                      <td className="px-5 py-4 text-[var(--muted-foreground)]">Italian-taught programme</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-5 py-4 font-semibold text-[var(--foreground)]">2026/27 key date</th>
                      <td className="px-5 py-4 text-[var(--muted-foreground)]">Test on 29 September 2026</td>
                      <td className="px-5 py-4 text-[var(--muted-foreground)]">First semester from September 2026; national examinations in December 2026 and January 2027 sessions</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-5 py-4 font-semibold text-[var(--foreground)]">Selection basis</th>
                      <td className="px-5 py-4 text-[var(--muted-foreground)]">National ranking from the single test</td>
                      <td className="px-5 py-4 text-[var(--muted-foreground)]">National merit ranking from Biology, Chemistry (+ biochemistry) and Physics examinations</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-5 py-4 font-semibold text-[var(--foreground)]">Framework</th>
                      <td className="px-5 py-4 text-[var(--muted-foreground)]">National admission framework (DM 1005)</td>
                      <td className="px-5 py-4 text-[var(--muted-foreground)]">National open-semester framework (DM 941)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section
          id="process"
          className="mx-auto max-w-7xl scroll-mt-[104px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        >
          <SectionHeading
            eyebrow="Roadmap"
            title="Admission Process for Indian Students"
            intro="Ten concise stages from route choice to arrival."
          />
          <ol className="mx-auto mt-8 max-w-3xl space-y-3">
            {[
              "Choose the English (IMAT) or Italian (open-semester) route.",
              "Check the university and programme call for that intake.",
              "Check NEET/NMC eligibility with the applicable Indian authorities.",
              "Prepare qualification and programme documents (certificates, transcripts, passport, language proof where required).",
              "Register through the applicable Italian admission system before its deadline.",
              "Take the required test or complete the required process.",
              "Receive the admission result and follow enrolment instructions.",
              "Complete Universitaly pre-enrolment where applicable.",
              "Apply for the student visa with supporting documents.",
              "Complete enrolment and arrival requirements in Italy.",
            ].map((step, index) => (
              <li
                key={step}
                className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
                  {index + 1}
                </span>
                <span className="pt-1 text-sm leading-6 text-[var(--foreground)]">
                  {step}
                </span>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
            Universitaly and visa steps explained in our{" "}
            <Link
              href="/universitaly"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              Universitaly guide
            </Link>
            {", "}
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
              visa document checklists
            </Link>
            .
          </p>
        </section>

        {/* Fees */}
        <section
          id="fees"
          className="scroll-mt-[104px] border-y border-[var(--border)] bg-[var(--card)]"
        >
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <SectionHeading
              eyebrow="Funding"
              title="Medicine Tuition Fees and Scholarships"
              intro="No medicine-specific national fee is stated here. Fees and aid follow the same university and regional rules as other programmes."
            />
            <div className="mx-auto mt-6 max-w-3xl space-y-3 text-sm leading-6 text-[var(--muted-foreground)]">
              <p>
                Tuition fees vary by university and programme. Public university
                fees can depend on institutional rules and income-based (ISEE)
                assessment where applicable — confirm the exact fee in your
                programme&apos;s call.
              </p>
              <p>
                Regional DSU support and other scholarships depend on regional
                and university rules; medicine-specific eligibility must be
                checked against the current call. Nothing can be promised in
                advance.
              </p>
            </div>
            <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
              See our{" "}
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

        {/* Documents */}
        <section
          id="documents"
          className="mx-auto max-w-7xl scroll-mt-[104px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        >
          <SectionHeading
            eyebrow="Paperwork"
            title="Indian Student Documents Checklist"
            intro="Only documents supported by the existing verified admission and visa framework. There is no single universal checklist."
          />
          <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">University admission</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Secondary qualification recognised as suitable, transcripts,
                passport, B2 English proof where the call requires it, and any
                programme-specific items in the call.
              </p>
            </article>
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">Indian medical eligibility</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                NEET-UG qualification evidence and schooling records as the NMC
                framework requires — verified with the applicable Indian
                authorities, not the university.
              </p>
            </article>
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">Universitaly</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Admission proof plus the validated pre-enrolment summary, per
                the university&apos;s Universitaly instructions.
              </p>
            </article>
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">Student visa</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Admission and pre-enrolment proof, financial evidence,
                accommodation, insurance and other items the competent mission
                specifies.
              </p>
            </article>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="mx-auto max-w-7xl scroll-mt-[104px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        >
          <SectionHeading
            eyebrow="FAQ"
            title="Medicine in Italy: Frequently Asked Questions"
          />
          <div className="mx-auto mt-8 max-w-3xl space-y-3">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                open={index === 0}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 open:shadow-sm"
              >
                <summary className="cursor-pointer list-none marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-3">
                    <span role="heading" aria-level="3" className="text-base font-bold text-[var(--foreground)]">
                      {faq.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-sm font-bold text-[var(--primary)] group-open:rotate-45 group-open:border-[var(--primary)]"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          {/* Sources */}
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6">
            <h2 className="text-lg font-bold text-[var(--foreground)]">
              Sources &amp; verification
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
              Seat figures are 2026/27 from the MUR admission framework and
              official university notices; NMC rules from the official Gazette.
              Always re-check the current call before applying.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--muted-foreground)]">
              <li>
                <a href="https://www.mur.gov.it/it/atti-e-normativa/decreto-ministeriale-n-1005-del-06-08-2026" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--primary)] hover:underline">
                  MUR DM 1005 (06/08/2026) — English Medicine/Dentistry/Veterinary
                </a>
              </li>
              <li>
                <a href="https://www.mur.gov.it/it/news/martedi-07072026/universita-fissate-le-date-delle-prove-dammissione-le-facolta-ad-accesso" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--primary)] hover:underline">
                  MUR admission dates 07/07/2026
                </a>
              </li>
              <li>
                <a href="https://www.universitaly.it/en/imat" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--primary)] hover:underline">
                  Universitaly IMAT page
                </a>{" "}
                and{" "}
                <a href="https://www.universitaly.it/en/studenti-stranieri" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--primary)] hover:underline">
                  foreign-student procedures 2026/27–2027/28
                </a>
              </li>
              <li>
                <a href="https://www.nmc.org.in/ActivitiWebClient/open/getDocument?path=%2FDocuments%2FPublic%2FPortal%2FNmcGazette%2F231275.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--primary)] hover:underline">
                  NMC FMGL Regulations 2021 (Gazette)
                </a>
              </li>
              <li>
                University bandi:{" "}
                <a href="https://www.unipd.it/ammissioni-medicine-surgery" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--primary)] hover:underline">
                  Padua
                </a>
                {", "}
                <a href="https://corsi.unipr.it/it/cdlm-ms/test-di-ammissione" target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--primary)] hover:underline">
                  Parma
                </a>
              </li>
            </ul>
            <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
              Related guides:{" "}
              <Link href="/study-in-italy" className="font-semibold text-[var(--primary)] hover:underline">
                Study in Italy
              </Link>
              {" · "}
              <Link href="/italy-university-admission" className="font-semibold text-[var(--primary)] hover:underline">
                Admission
              </Link>
              {" · "}
              <Link href="/cost-of-studying-in-italy" className="font-semibold text-[var(--primary)] hover:underline">
                Costs
              </Link>
              {" · "}
              <Link href="/italy-scholarships" className="font-semibold text-[var(--primary)] hover:underline">
                Scholarships
              </Link>
              {" · "}
              <Link href="/universitaly" className="font-semibold text-[var(--primary)] hover:underline">
                Universitaly
              </Link>
              {" · "}
              <Link href="/italy-student-visa" className="font-semibold text-[var(--primary)] hover:underline">
                Student visa
              </Link>
              {" · "}
              <Link href="/visa-checklists" className="font-semibold text-[var(--primary)] hover:underline">
                Visa checklists
              </Link>
              {" · "}
              <Link href="/universities" className="font-semibold text-[var(--primary)] hover:underline">
                Universities
              </Link>
              {" · "}
              <Link href="/courses" className="font-semibold text-[var(--primary)] hover:underline">
                Courses
              </Link>
            </p>
          </div>

          <div className="mt-8 rounded-2xl bg-[var(--foreground)] px-6 py-8 text-center text-[var(--background)] sm:px-10 sm:py-10">
            <h2 className="text-xl font-bold sm:text-2xl">
              Ready to plan Medicine in Italy?
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm opacity-80 sm:text-base">
              Get personalised guidance on IMAT, universities, NMC eligibility
              and the Italy student visa.
            </p>
            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
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
