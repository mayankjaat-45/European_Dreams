import Link from "next/link";

import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";

const SITE_URL = "https://www.europeandreamss.com";
const CANONICAL = `${SITE_URL}/open-semester-medicine-italy`;

const UNIVERSITALY_STUDENTS_URL =
  "https://www.universitaly.it/it/studenti-stranieri";

export const metadata = {
  title:
    "Italy Open Semester 2026/27: Medicine Guide for Indian Students",
  description:
    "Italy open semester 2026/27 for Italian-taught Medicine: enrolment, 3 exams, 18/30 threshold, ranking, deadlines and NEET/NMC notes for Indian students.",
  alternates: {
    canonical: CANONICAL,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title:
      "Italy Open Semester 2026/27: Medicine Guide for Indian Students",
    description:
      "Italy open semester 2026/27 for Italian-taught Medicine: enrolment, 3 exams, 18/30 threshold, ranking, deadlines and NEET/NMC notes for Indian students.",
    url: CANONICAL,
    siteName: "European Dreams",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Italy Open Semester 2026/27: Medicine Guide for Indian Students",
    description:
      "Italy open semester 2026/27 for Italian-taught Medicine: enrolment, 3 exams, 18/30 threshold, ranking, deadlines and NEET/NMC notes for Indian students.",
  },
};

const breadcrumbItems = [
  { name: "Home", href: `${SITE_URL}/` },
  { name: "Study in Italy", href: `${SITE_URL}/study-in-italy` },
  { name: "Open Semester Medicine", href: CANONICAL },
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
  name: "Italy Open Semester 2026/27: Medicine Guide for Indian Students",
  description:
    "2026/27 guide to Italy's open semester for Italian-taught Medicine and Surgery, Dentistry and Veterinary Medicine: who it covers, enrolment, lessons, three national exams, ranking, related-course fallback, non-EU and visa steps, and NEET/NMC considerations for Indian students.",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  breadcrumb: { "@id": `${CANONICAL}#breadcrumb` },
  inLanguage: "en-IN",
};

const faqs = [
  {
    question: "What is Italy's open semester for Medicine?",
    answer:
      "The open semester (semestre aperto/filtro) is the 2026/27 access route to Italian-taught single-cycle Medicine and Surgery, Dentistry and Veterinary Medicine at state universities, governed by MUR Decree No. 941 of 10 July 2026 (academic year 2026/2027). Students enrol freely in a first semester of three subjects, sit national examinations, and are ordered in a national merit ranking that decides second-semester admission. Capped places remain: free enrolment is not guaranteed admission.",
  },
  {
    question: "Can Indian students apply for the open semester?",
    answer:
      "Yes. Enrolment in the filter semester is open to EU students, non-EU students in the applicable resident category, and non-EU students resident abroad — the category Indian applicants from India fall into. Non-EU-abroad students compete in their own dedicated national ranking with reserved places, following the same enrolment deadlines as everyone else.",
  },
  {
    question: "Does the open semester cover English-taught Medicine?",
    answer:
      "No. The open semester applies only to Italian-taught programmes at state universities. English-taught Medicine, Dentistry and Veterinary Medicine follow the separate national admission-test regime (MUR Decree No. 1005 of 6 August 2026, test on 29 September 2026). See our Medicine in Italy guide for the English-taught route.",
  },
  {
    question: "Is IMAT required for the open semester?",
    answer:
      "No. There is no IMAT or any pre-enrolment entrance test for the Italian-taught open semester. Selection happens after the semester, through the three national profit examinations (10 December 2026 and 11 January 2027) and the national ranking published on 22 January 2027.",
  },
  {
    question: "Which subjects are tested in the open semester?",
    answer:
      "Three subjects, 6 CFU each (18 CFU total): Biology, Physics, and Chemistry and propaedeutic biochemistry. Syllabi were published by MUR on 19 June 2026. Each subject has its own national examination and its own grade out of 30.",
  },
  {
    question: "When are the 2026/27 open-semester exams?",
    answer:
      "Two sittings per subject, same date and time nationwide: 10 December 2026 at 11:00 and 11 January 2027 at 11:00 (Directorial Decree No. 249 of 13 July 2026). Results were announced on 23 December 2026 and 20 January 2027 respectively. Students must sit at least one of the two sittings for each subject.",
  },
  {
    question: "How are the open-semester exams scored?",
    answer:
      "Each paper has 31 questions — 21 multiple-choice (five options) and 10 completion questions — in 50 minutes, with a 30-minute interval between papers. Correct answers score +1, omitted answers 0, wrong answers −0.10. The grade is expressed out of 30 and the pass threshold is 18/30 per subject.",
  },
  {
    question: "What happens if I sit both exam sittings?",
    answer:
      "Where a student sits both sittings for the same subject, the higher score counts automatically, provided it is at least 18/30. After the second results are published, students confirm acceptance or refusal of grades by 23:59 the following day; silence counts as acceptance.",
  },
  {
    question: "How does the national ranking work?",
    answer:
      "The ranking has three ordered sections: students with three valid exams (≥18/30 each) are placed with 300 points plus the sum of their grades; two valid exams with 200 points plus the sum; one valid exam with 100 points plus the grade. A higher section always outranks a lower one. Ties are broken by disability status, then younger age, then higher exam average. Students admitted with one or two valid exams must recover the missing credits before second-semester enrolment.",
  },
  {
    question: "Does completing the Open Semester guarantee admission to Medicine?",
    answer:
      "No. Enrolment in the semester is free, but Italian-taught Medicine, Dentistry and Veterinary places remain capped. After the national exams, separate EU/residents and non-EU-abroad merit rankings admit students to the second semester strictly by ranking position and available places. Completing lessons and sitting the exams only makes you rankable — it reserves no place.",
  },
  {
    question: "When is the ranking published and what happens next?",
    answer:
      "Both national rankings (EU/residents and non-EU abroad) were published on 22 January 2027 at 16:00 in each student's Universitaly personal area, with the assigned university. Enrolment ran 22–28 January 2027, with forfeiture for missing the window. Outcomes were published on 1 February 2027; unused non-EU-abroad places flowed into the EU ranking. EU re-assignments were published on 8 February 2027 and the final EU list on 12 February 2027.",
  },
  {
    question: "What happens if I do not get a Medicine place?",
    answer:
      "At enrolment every student also chooses related courses (corsi affini) such as Biotechnology, Biological Sciences, Pharmacy and Zootechnical Sciences, plus designated health-profession classes. Affine assignments were published on 16 February 2027 with enrolment on 16–20 February 2027, and a final backstop allowed enrolment in another available course until 12 March 2027. An affine degree is an Italian academic fallback — it does not by itself qualify anyone to practise medicine in India.",
  },
  {
    question: "Is NEET required for Indians studying Medicine in Italy?",
    answer:
      "For the Indian side, yes. Indian citizens intending to take MBBS or an equivalent qualification abroad on or after May 2018 must mandatorily qualify NEET-UG; the result serves as the eligibility certificate and is valid for three years. This is separate from Italian university admission — verify the current rule with the National Medical Commission.",
  },
  {
    question: "Will an Italian Medicine degree allow me to practise in India?",
    answer:
      "Not automatically. Registration in India is governed by the NMC Foreign Medical Graduate Licentiate Regulations 2021: minimum 54 months in a single institution plus a 12-month internship in the same foreign institution, English as medium of instruction, an MBBS-equivalent curriculum, registration or licence parity in the country of award, the screening or NEXT test, and a further 12-month internship in India. The NMC endorses no list of foreign universities, and Italian admission never guarantees Indian registration. Note the open-semester track is Italian-medium, so FMGL compliance needs careful verification.",
  },
  {
    question: "Do non-EU students need a visa process as well?",
    answer:
      "Yes, as a separate track. Open-semester admission does not replace immigration steps: students who require a visa separately complete pre-enrolment on Universitaly for consulate processing, and admission never guarantees a visa. Language and document rules can also differ by university — for example, some universities require B2-level certification — so each university's notice must be checked.",
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

export default function OpenSemesterMedicineItalyPage() {
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
                2026/27 official framework · DM 941/2026
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl">
                Italy Open Semester 2026/27: Medicine Guide for Indian Students
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)] sm:text-base sm:leading-7">
                How the 2026/27 open semester works for Italian-taught Medicine,
                Dentistry and Veterinary Medicine — enrolment, lessons, three
                national exams, ranking and deadlines — plus what Indian
                students must verify separately on visas, NEET and NMC rules.
                For the wider journey, start with our{" "}
                <Link
                  href="/study-in-italy"
                  className="font-semibold text-[var(--primary)] hover:underline"
                >
                  Study in Italy guide for Indian students
                </Link>
                .
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <CtaButton href="/medicine-in-italy">
                  Compare the English-taught route
                </CtaButton>
                <CtaButton href="/italy-university-admission" variant="secondary">
                  Admission requirements
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

        {/* Verified for 2026/27 */}
        <div className="border-b border-[var(--border)] bg-[var(--background)]">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
              <p className="text-sm font-bold text-[var(--foreground)]">
                Verified for 2026/27
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                This guide was reviewed against MUR Decree D.M. 941/2026 and
                the official 2026/27 admission notices. Key dates, exam rules,
                ranking mechanics and eligibility details were checked against
                official sources.
              </p>
            </div>
          </div>
        </div>

        {/* Direct answer */}
        <section
          id="overview"
          className="scroll-mt-[104px] border-b border-[var(--border)] bg-[var(--card)]"
        >
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <SectionHeading
              eyebrow="Direct answer"
              title="The Open Semester in One Minute"
              intro="Five facts that frame everything below. Italian admission, Indian regulation and visas are three different tracks — verify each separately."
            />
            <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">
                  1. What it is
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  A first semester of three science subjects with national
                  examinations. Selection happens after the semester through
                  exam grades and a national merit ranking — there is no
                  entrance test beforehand.
                </p>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">
                  2. Who it applies to
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Italian-taught, state-university, single-cycle Medicine and
                  Surgery (LM-41), Dentistry (LM-46) and Veterinary Medicine
                  (LM-42) for 2026/27 — including non-EU students applying from
                  abroad.
                </p>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">
                  3. Who it excludes
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  English-taught Medicine, Dentistry and Veterinary programmes
                  keep the separate national admission-test regime, and private
                  universities run their own selections. See our{" "}
                  <Link
                    href="/medicine-in-italy"
                    className="font-semibold text-[var(--primary)] hover:underline"
                  >
                    Medicine in Italy guide
                  </Link>{" "}
                  for the English-taught route.
                </p>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">
                  4. How selection works
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Three national exams graded out of 30 (pass at 18/30) feed a
                  national ranking published on 22 January 2027. Capped places
                  remain — free enrolment is not admission.
                </p>
              </article>
            </div>
            <div className="mx-auto mt-4 max-w-5xl rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5 dark:border-amber-900/30 dark:bg-amber-950/20">
              <h3 className="font-bold text-[var(--foreground)]">
                5. Three separate tracks
              </h3>
              <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                Italian university admission, the student-visa process, and
                Indian NEET/NMC eligibility each have their own decision-maker.
                Success in one never guarantees the others. Sources:{" "}
                <OfficialLink href="https://www.mur.gov.it/it/atti-e-normativa/decreto-ministeriale-n-941-del-10-7-2026">
                  MUR DM 941/2026
                </OfficialLink>
                {", "}
                <OfficialLink href="https://www.nmc.org.in/information-desk/for-students-to-study-in-abroad/">
                  NMC guidance for study abroad
                </OfficialLink>
                .
              </p>
            </div>
          </div>
        </section>

        {/* At a glance */}
        <section
          id="glance"
          aria-label="Open semester 2026/27 at a glance"
          className="mx-auto max-w-7xl scroll-mt-[104px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        >
          <SectionHeading
            eyebrow="At a glance"
            title="Open Semester 2026/27 at a Glance"
            intro="Only verified 2026/27 figures. Detail and sources follow in each section."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "3 subjects",
                text: "Biology, Physics, and Chemistry and propaedeutic biochemistry — the only examinable subjects.",
              },
              {
                title: "6 CFU each · 18 total",
                text: "Each subject is worth 6 university credits once passed at 18/30 or above.",
              },
              {
                title: "2 exam sessions",
                text: "10 December 2026 and 11 January 2027, 11:00, same date and time nationwide.",
              },
              {
                title: "18/30 pass threshold",
                text: "Per subject. Only grades of 18/30 or above count as valid for the ranking.",
              },
              {
                title: "31 questions · 50 minutes",
                text: "21 multiple-choice plus 10 completion questions per paper; +1 / 0 / −0.10 scoring.",
              },
              {
                title: "Ranking: 22 January 2027",
                text: "National merit ranking published at 16:00 in each student's Universitaly area.",
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

        {/* What is the open semester */}
        <section
          id="what-is"
          className="scroll-mt-[104px] border-y border-[var(--border)] bg-[var(--card)]"
        >
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <SectionHeading
              eyebrow="The mechanism"
              title="What Is the Open Semester?"
              intro="Free entry, examined exit. The semester replaces a pre-admission test with university-level exams."
            />
            <div className="mx-auto mt-8 max-w-3xl space-y-4 text-sm leading-6 text-[var(--muted-foreground)]">
              <p>
                Under MUR Decree No. 941 of 10 July 2026, eligible students
                enrol freely — without any entrance test — in the first
                semester of their chosen degree class at a state university.
                They attend lessons from 1 September 2026 and then sit three
                national profit examinations. Grades from those exams determine
                each student&apos;s position in a national merit ranking, and
                only students placed usefully are admitted to the second
                semester. This is not a shortcut: capped places
                (programmed access) remain in force.
              </p>
              <p>
                The decree governs the 2026/2027 academic year and consolidates
                the previous year&apos;s rules into a single text. Exam dates
                are fixed separately by Directorial Decree No. 249 of 13 July
                2026. Students who do not reach Medicine, Dentistry or
                Veterinary are not left empty-handed: the same decree provides
                assignment to related degree courses (
                <em>corsi affini</em>). Sources:{" "}
                <OfficialLink href="https://www.mur.gov.it/it/news/lunedi-13072026/medicina-al-le-iscrizioni-al-semestre-aperto">
                  MUR announcement 13/07/2026
                </OfficialLink>
                {", "}
                <OfficialLink href="https://www.mur.gov.it/sites/default/files/2026-07/Decreto%20Ministeriale%20n.%20941%20del%2010-7-2026.pdf">
                  DM 941/2026 full text
                </OfficialLink>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Who can apply */}
        <section
          id="who-can-apply"
          className="mx-auto max-w-7xl scroll-mt-[104px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        >
          <SectionHeading
            eyebrow="Eligibility"
            title="Who Can Apply?"
            intro="One enrolment, two rankings. Your residence category decides which ranking you compete in."
          />
          <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-3">
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">
                EU students
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Compete in the EU-and-residents national ranking (Annex 3 of
                DM 941/2026), published 22 January 2027.
              </p>
            </article>
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">
                Non-EU residents in Italy
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Students in the applicable resident category join the same
                EU/residents ranking under Annex 3.
              </p>
            </article>
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">
                Non-EU residents abroad
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Indian applicants applying from India fall here. A dedicated
                non-EU-abroad ranking (Annex 4) with reserved places is
                published the same day, 22 January 2027 — same exams, same
                deadlines.
              </p>
            </article>
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
            Unused non-EU-abroad places flow into the EU/residents ranking
            from 1 February 2027. General admission context for all routes is
            in our{" "}
            <Link
              href="/italy-university-admission"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              Italy university admission guide
            </Link>
            .
          </p>
        </section>

        {/* Who is NOT covered */}
        <section
          id="not-covered"
          className="scroll-mt-[104px] border-y border-[var(--border)] bg-[var(--card)]"
        >
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <SectionHeading
              eyebrow="Scope limits"
              title="Who Is NOT Covered?"
              intro="Two large groups follow completely different rules. Do not mix them up."
            />
            <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">
                  English-taught programmes
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Medicine, Dentistry and Veterinary programmes taught in
                  English keep the separate national admission-test regime
                  under MUR Decree No. 1005 of 6 August 2026, with the test on
                  29 September 2026 — no open semester, direct enrolment after
                  the ranking. Everything about that route is in our{" "}
                  <Link
                    href="/medicine-in-italy"
                    className="font-semibold text-[var(--primary)] hover:underline"
                  >
                    Medicine in Italy guide
                  </Link>
                  .
                </p>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">
                  Private universities
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  The open semester applies to state universities only.
                  Private institutions select through their own admission
                  procedures — check each university&apos;s official call.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Enrolment */}
        <section
          id="enrolment"
          className="mx-auto max-w-7xl scroll-mt-[104px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        >
          <SectionHeading
            eyebrow="How to enter"
            title="Enrolment Process 2026/27"
            intro="One portal, one fee, ordered preferences. Miss a step and the application lapses."
          />
          <ol className="mx-auto mt-8 max-w-3xl space-y-4">
            {[
              "Apply on the Universitaly portal from 13 July to 3 August 2026 (18:00 Italian time) — see the Universitaly process in our Universitaly guide.",
              "Pay the €250 flat contribution unless a statutory exemption or reduction applies (including applicable ISEE/disability provisions); non-EU applicants without ISEE should check their university notice for the applicable amount. Pay on the chosen university's portal between 13 July and 6 August 2026. Non-payment invalidates the application.",
              "Indicate at least 10 preferred university seats (sedi) for the chosen degree class, in order of preference.",
              "Also indicate related-course (affine) preferences as a fallback in case the Medicine ranking does not work out.",
              "Keep the registration receipt and payment proof: lessons start 1 September 2026 with no exceptions.",
            ].map((step, index) => (
              <li
                key={step}
                className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
                  {index + 1}
                </span>
                <span className="pt-1.5 text-sm leading-6 text-[var(--foreground)]">
                  {index === 0 ? (
                    <>
                      Apply on the Universitaly portal from 13 July to 3
                      August 2026 (18:00 Italian time) — see the process in
                      our{" "}
                      <Link
                        href="/universitaly"
                        className="font-semibold text-[var(--primary)] hover:underline"
                      >
                        Universitaly guide
                      </Link>
                      .
                    </>
                  ) : (
                    step
                  )}
                </span>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
            Source:{" "}
            <OfficialLink href="https://www.mur.gov.it/it/news/lunedi-13072026/medicina-al-le-iscrizioni-al-semestre-aperto">
              MUR announcement 13/07/2026
            </OfficialLink>
            . Non-EU students: enrolment here is separate from the visa
            pre-enrolment described in the{" "}
            <Link
              href="/italy-student-visa"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              Italy student visa guide
            </Link>
            .
          </p>
        </section>

        {/* Lessons */}
        <section
          id="lessons"
          className="scroll-mt-[104px] border-y border-[var(--border)] bg-[var(--card)]"
        >
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <SectionHeading
              eyebrow="Attendance"
              title="Lessons and Attendance"
              intro="Fixed start, compulsory attendance, university-verified."
            />
            <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-3">
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">
                  Start: 1 September 2026
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Teaching begins on the same date at every university, with
                  no exceptions.
                </p>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">
                  Attendance compulsory
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Presence at lessons is mandatory and verified by each
                  university. The decree provides exemption categories —
                  check your university&apos;s notice for how they apply.
                </p>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">
                  End-date rule
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Lessons must finish at least ten days before the first exam
                  — no later than 30 November 2026. Each university sets its
                  own calendar within that rule.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Subjects */}
        <section
          id="subjects"
          className="mx-auto max-w-7xl scroll-mt-[104px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        >
          <SectionHeading
            eyebrow="What you study"
            title="The Three Subjects"
            intro="Identical content nationwide, from the syllabi published 19 June 2026."
          />
          <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th scope="col" className="px-5 py-4 font-bold text-[var(--foreground)]">
                    Subject
                  </th>
                  <th scope="col" className="px-5 py-4 font-bold text-[var(--foreground)]">
                    Credits
                  </th>
                  <th scope="col" className="px-5 py-4 font-bold text-[var(--foreground)]">
                    Exam
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {[
                  ["Biology", "6 CFU", "Own national paper"],
                  ["Physics", "6 CFU", "Own national paper"],
                  ["Chemistry and propaedeutic biochemistry", "6 CFU", "Own national paper"],
                ].map(([subject, cfu, exam]) => (
                  <tr key={subject}>
                    <th scope="row" className="px-5 py-4 font-semibold text-[var(--foreground)]">
                      {subject}
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">{cfu}</td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">{exam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
            18 CFU in total. Source:{" "}
            <OfficialLink href="https://www.mur.gov.it/it/news/venerdi-19062026/semestre-aperto-aa-2026-2027">
              MUR syllabi notice 19/06/2026
            </OfficialLink>
            .
          </p>
        </section>

        {/* Exams */}
        <section
          id="exams"
          className="scroll-mt-[104px] border-y border-[var(--border)] bg-[var(--card)]"
        >
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <SectionHeading
              eyebrow="The selection"
              title="Exam Structure 2026/27"
              intro="Two national sittings per subject. Best valid score counts."
            />
            <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">
                  Dates and results
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  First sitting: 10 December 2026, 11:00 — results 23
                  December 2026. Second sitting: 11 January 2027, 11:00 —
                  results 20 January 2027. Same date and time at every
                  university, taken where you attended. You must sit at
                  least one sitting per subject.
                </p>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">
                  Paper format
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  31 questions per subject: 21 multiple-choice (five options,
                  one correct) and 10 completion questions answered in
                  uppercase block letters. 50 minutes per paper with a
                  30-minute interval; students remain for the whole session.
                  Disability and DSA accommodations apply.
                </p>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">
                  Scoring and pass mark
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Correct +1, omitted 0, wrong −0.10. Grades are out of 30
                  and a subject counts as valid at 18/30 or above. Papers are
                  read electronically by CINECA and graded by the university
                  examination board.
                </p>
              </article>
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-[var(--foreground)]">
                  Best score and acceptance
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  Sitting both dates? The higher score (if ≥18/30) counts
                  automatically. After the second results, accept or refuse
                  each grade by 23:59 the next day — silence means acceptance.
                </p>
              </article>
            </div>
            <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-[var(--muted-foreground)]">
              Sources:{" "}
              <OfficialLink href="https://www.mur.gov.it/it/atti-e-normativa/decreto-direttoriale-n-249-del-13-7-2026">
                DD 249/2026 (exam dates)
              </OfficialLink>
              {", "}
              <OfficialLink href="https://www.mur.gov.it/sites/default/files/2026-07/All.%202%20al%20D.M.%2010-07-2026%20n.%20941.pdf">
                Annex 2, DM 941/2026 (format and scoring)
              </OfficialLink>
              .
            </p>
          </div>
        </section>

        {/* Ranking */}
        <section
          id="ranking"
          className="mx-auto max-w-7xl scroll-mt-[104px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        >
          <SectionHeading
            eyebrow="Admission decision"
            title="National Ranking"
            intro="Three ordered sections. Section first, grades second — no predictions, just mechanics."
          />
          <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th scope="col" className="px-5 py-4 font-bold text-[var(--foreground)]">
                    Valid exams (≥18/30)
                  </th>
                  <th scope="col" className="px-5 py-4 font-bold text-[var(--foreground)]">
                    Ranking score
                  </th>
                  <th scope="col" className="px-5 py-4 font-bold text-[var(--foreground)]">
                    Then
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                <tr>
                  <th scope="row" className="px-5 py-4 font-semibold text-[var(--foreground)]">
                    All three
                  </th>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    300 points + sum of accepted grades
                  </td>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Direct second-semester enrolment if placed usefully
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="px-5 py-4 font-semibold text-[var(--foreground)]">
                    Two of three
                  </th>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    200 points + sum of the two grades
                  </td>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Must recover the missing subject&apos;s credits first
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="px-5 py-4 font-semibold text-[var(--foreground)]">
                    One of three
                  </th>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    100 points + the single grade
                  </td>
                  <td className="px-5 py-4 text-[var(--muted-foreground)]">
                    Must recover the two missing subjects&apos; credits first
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mx-auto mt-6 max-w-3xl space-y-3 text-sm leading-6 text-[var(--muted-foreground)]">
            <p>
              A higher section always outranks a lower one, whatever the
              grades. Ties break in this order: disability status, younger
              age, higher exam average. Assignment to a university follows
              your ranking position, your ordered seat preferences, the
              choices of those ahead of you, and places available at each
              seat.
            </p>
            <p>
              Key dates (Annexes 3 and 4): ranking and seat assignment on 22
              January 2027 at 16:00 in your Universitaly personal area;
              enrolment 22–28 January 2027 under penalty of forfeiture;
              outcomes on 1 February 2027, when unused non-EU-abroad places
              move to the EU ranking; EU re-assignments on 8 February 2027;
              final EU list on 12 February 2027. Sources:{" "}
              <OfficialLink href="https://www.mur.gov.it/sites/default/files/2026-07/All.%203%20al%20D.M.%2010-07-2026%20n.%20941.pdf">
                Annex 3 (EU/residents)
              </OfficialLink>
              {", "}
              <OfficialLink href="https://www.mur.gov.it/sites/default/files/2026-07/All.%204%20al%20D.M.%2010-07-2026%20n.%20941.pdf">
                Annex 4 (non-EU abroad)
              </OfficialLink>
              .
            </p>
          </div>
        </section>

        {/* Fallback */}
        <section
          id="fallback"
          className="scroll-mt-[104px] border-y border-[var(--border)] bg-[var(--card)]"
        >
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <SectionHeading
              eyebrow="Plan B"
              title="What If I Don't Get Medicine?"
              intro="The related-course safety net — an Italian academic fallback, not a medical licence."
            />
            <div className="mx-auto mt-8 max-w-3xl space-y-4 text-sm leading-6 text-[var(--muted-foreground)]">
              <p>
                Related courses (<em>corsi affini</em>) include degree classes
                such as Biotechnology (L-2), Biological Sciences (L-13),
                Pharmacy and Industrial Pharmacy (LM-13), Zootechnical
                Sciences (L-38), plus designated health-profession classes
                set yearly. Affine assignments were published on 16 February
                2027 at 17:00, with enrolment on 16–20 February 2027; a final
                list appeared on 12 March 2027, and students not enrolled in
                Medicine or an affine course could still enrol in another
                available course until 12 March 2027.
              </p>
              <p>
                Be clear-eyed: an affine degree keeps you inside the Italian
                university system, but it does not by itself qualify anyone
                to practise medicine in India or elsewhere. Source:{" "}
                <OfficialLink href="https://www.mur.gov.it/sites/default/files/2026-07/All.%205%20al%20D.M.%2010-07-2026%20n.%20941.pdf">
                  Annex 5, DM 941/2026
                </OfficialLink>
                .
              </p>
            </div>
          </div>
        </section>

        {/* NEET + NMC */}
        <section
          id="neet-nmc"
          className="mx-auto max-w-7xl scroll-mt-[104px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        >
          <SectionHeading
            eyebrow="Indian requirements"
            title="NEET and NMC Rules for Indian Students"
            intro="ITALIAN ADMISSION is one thing. INDIAN REGISTRATION is another. Read both, verify both."
          />
          <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">
                NEET qualification
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Indian citizens intending to take MBBS or an equivalent
                qualification abroad on or after May 2018 must mandatorily
                qualify NEET-UG; the result serves as the eligibility
                certificate and is valid for three years. Verify the current
                rule with the NMC before applying.
              </p>
            </article>
            <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h3 className="font-bold text-[var(--foreground)]">
                FMGL 2021 conditions
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Registration in India requires, among other things: at least
                54 months in a single foreign institution plus a 12-month
                internship there, English as medium of instruction, an
                MBBS-equivalent curriculum, licence parity in the country of
                award, the screening or NEXT test, and a further 12-month
                internship in India — all training in one country.
              </p>
            </article>
          </div>
          <div className="mx-auto mt-4 max-w-5xl rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5 dark:border-amber-900/30 dark:bg-amber-950/20">
            <h3 className="font-bold text-[var(--foreground)]">
              What this page does NOT claim
            </h3>
            <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
              No Italian university is described here as NMC-approved or
              NMC-recognised — the NMC endorses no list of foreign
              universities. Italian admission never guarantees Indian
              registration. Because this page&apos;s track is Italian-medium,
              FMGL&apos;s English-medium requirement needs particularly
              careful verification. Sources:{" "}
              <OfficialLink href="https://www.nmc.org.in/information-desk/for-students-to-study-in-abroad/">
                NMC study-abroad guidance
              </OfficialLink>
              {", "}
              <OfficialLink href="https://nmc.org.in/storage/cms/rules-regulation-nmc/yFQCJ2Bf9yZU5zBfLCNUFIFG2E3optNdIAQfas9Z.pdf">
                NMC FMGL 2021 FAQ
              </OfficialLink>
              .
            </p>
          </div>
        </section>

        {/* Visa */}
        <section
          id="visa"
          className="scroll-mt-[104px] border-y border-[var(--border)] bg-[var(--card)]"
        >
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <SectionHeading
              eyebrow="Immigration"
              title="Non-EU Students and the Visa"
              intro="Admission first, visa separately. One never guarantees the other."
            />
            <div className="mx-auto mt-8 max-w-3xl space-y-4 text-sm leading-6 text-[var(--muted-foreground)]">
              <p>
                Non-EU students follow the same open-semester enrolment and
                deadlines above, competing in their dedicated ranking. In
                parallel, students who require a visa separately complete
                pre-enrolment on Universitaly for consulate processing, which
                takes teaching start dates into account. Non-Italian
                nationals access Universitaly with personal portal
                credentials rather than SPID/CIE.
              </p>
              <p>
                Language and document rules can differ by university — for
                example, the University of Eastern Piedmont requires B2-level
                certification from an accredited centre — so read your
                university&apos;s notice, and plan funding via our{" "}
                <Link
                  href="/italy-scholarships"
                  className="font-semibold text-[var(--primary)] hover:underline"
                >
                  Italy scholarships guide
                </Link>{" "}
                and the{" "}
                <Link
                  href="/italy-student-visa"
                  className="font-semibold text-[var(--primary)] hover:underline"
                >
                  Italy student visa guide
                </Link>
                . Source:{" "}
                <OfficialLink href="https://uniupo.it/en/studentinfo/arrangements-access-medicine-and-surgery-ay-20262027">
                  University of Eastern Piedmont 2026/27 notice
                </OfficialLink>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Open semester vs admission test */}
        <section
          id="vs-test"
          className="mx-auto max-w-7xl scroll-mt-[104px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        >
          <SectionHeading
            eyebrow="Two doors"
            title="Open Semester vs English-Taught Admission Test"
            intro="Pick your language track first — the systems are not interchangeable."
          />
          <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th scope="col" className="px-5 py-4 font-bold text-[var(--foreground)]">
                    Aspect
                  </th>
                  <th scope="col" className="px-5 py-4 font-bold text-[var(--foreground)]">
                    This page: Italian-taught
                  </th>
                  <th scope="col" className="px-5 py-4 font-bold text-[var(--foreground)]">
                    English-taught
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {[
                  ["Language", "Italian", "English"],
                  ["Mechanism", "Free enrolment, then 3 national exams + ranking", "Single national test, then ranking"],
                  ["2026/27 exam", "10 Dec 2026 and 11 Jan 2027", "29 September 2026"],
                  ["For whom", "Includes non-EU abroad ranking", "EU and non-EU contingents per university"],
                  ["Guide", "This page", "Medicine in Italy guide"],
                ].map(([aspect, italian, english]) => (
                  <tr key={aspect}>
                    <th scope="row" className="px-5 py-4 font-semibold text-[var(--foreground)]">
                      {aspect}
                    </th>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      {italian}
                    </td>
                    <td className="px-5 py-4 text-[var(--muted-foreground)]">
                      {aspect === "Guide" ? (
                        <Link
                          href="/medicine-in-italy"
                          className="font-semibold text-[var(--primary)] hover:underline"
                        >
                          Medicine in Italy guide
                        </Link>
                      ) : (
                        english
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Timeline */}
        <section
          id="timeline"
          className="scroll-mt-[104px] border-y border-[var(--border)] bg-[var(--card)]"
        >
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <SectionHeading
              eyebrow="Dates"
              title="2026/27 Timeline"
              intro="Every date below comes from the official decrees. Confirm each in the current call."
            />
            <ol className="mx-auto mt-8 max-w-3xl space-y-3">
              {[
                ["13 Jul – 3 Aug 2026", "Universitaly enrolment (until 18:00)"],
                ["By 6 Aug 2026", "Fee payment deadline (€250 unless a statutory exemption or reduction applies)"],
                ["1 Sep 2026", "Lessons begin everywhere"],
                ["By 30 Nov 2026", "Lessons end (≥10 days before first exam)"],
                ["10 Dec 2026, 11:00", "First national exam sitting"],
                ["23 Dec 2026", "First results published"],
                ["11 Jan 2027, 11:00", "Second national exam sitting"],
                ["20 Jan 2027", "Second results published"],
                ["22 Jan 2027, 16:00", "National rankings + seat assignment"],
                ["22 – 28 Jan 2027", "Enrolment at assigned seat (or forfeit)"],
                ["1 Feb 2027", "Enrolment outcomes; unused non-EU places to EU ranking"],
                ["8 Feb 2027", "EU re-assignments published"],
                ["12 Feb 2027", "Final EU enrolled list"],
                ["16 Feb 2027, 17:00", "Related-course (affine) assignments"],
                ["16 – 20 Feb 2027", "Affine enrolment window"],
                ["12 Mar 2027", "Final affine list; backstop enrolment deadline"],
              ].map(([date, event]) => (
                <li
                  key={date}
                  className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4"
                >
                  <span className="min-w-36 shrink-0 pt-0.5 text-sm font-bold text-[var(--primary)] sm:min-w-44">
                    {date}
                  </span>
                  <span className="pt-0.5 text-sm leading-6 text-[var(--foreground)]">
                    {event}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="mx-auto max-w-7xl scroll-mt-[104px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        >
          <SectionHeading
            eyebrow="FAQ"
            title="Open Semester: Frequently Asked Questions"
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
          <div
            id="sources"
            className="mx-auto mt-10 max-w-3xl scroll-mt-[104px] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6"
          >
            <h2 className="text-lg font-bold text-[var(--foreground)]">
              Official sources
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
              All figures and dates on this page come from the documents
              below. Always re-check the current university call before
              applying.
            </p>
            <h3 className="mt-4 font-bold text-[var(--foreground)]">MUR</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--muted-foreground)]">
              <li>
                <OfficialLink href="https://www.mur.gov.it/it/news/lunedi-13072026/medicina-al-le-iscrizioni-al-semestre-aperto">
                  MUR announcement 13/07/2026 — open-semester enrolment
                </OfficialLink>
              </li>
              <li>
                <OfficialLink href="https://www.mur.gov.it/it/news/venerdi-19062026/semestre-aperto-aa-2026-2027">
                  MUR notice 19/06/2026 — syllabi
                </OfficialLink>
              </li>
              <li>
                <OfficialLink href="https://www.mur.gov.it/it/atti-e-normativa/decreto-ministeriale-n-941-del-10-7-2026">
                  MUR DM 941 (10/07/2026) — filter semester 2026/27
                </OfficialLink>
              </li>
              <li>
                <OfficialLink href="https://www.mur.gov.it/sites/default/files/2026-07/Decreto%20Ministeriale%20n.%20941%20del%2010-7-2026.pdf">
                  DM 941/2026 full text (PDF)
                </OfficialLink>
              </li>
              <li>
                <OfficialLink href="https://www.mur.gov.it/it/atti-e-normativa/decreto-direttoriale-n-249-del-13-7-2026">
                  DD 249 (13/07/2026) — exam dates
                </OfficialLink>
              </li>
              <li>
                <OfficialLink href="https://www.mur.gov.it/sites/default/files/2026-07/All.%202%20al%20D.M.%2010-07-2026%20n.%20941.pdf">
                  Annex 2 — exam format and scoring
                </OfficialLink>
              </li>
              <li>
                <OfficialLink href="https://www.mur.gov.it/sites/default/files/2026-07/All.%203%20al%20D.M.%2010-07-2026%20n.%20941.pdf">
                  Annex 3 — EU/residents ranking
                </OfficialLink>
              </li>
              <li>
                <OfficialLink href="https://www.mur.gov.it/sites/default/files/2026-07/All.%204%20al%20D.M.%2010-07-2026%20n.%20941.pdf">
                  Annex 4 — non-EU-abroad ranking
                </OfficialLink>
              </li>
              <li>
                <OfficialLink href="https://www.mur.gov.it/sites/default/files/2026-07/All.%205%20al%20D.M.%2010-07-2026%20n.%20941.pdf">
                  Annex 5 — related-course assignment
                </OfficialLink>
              </li>
            </ul>
            <h3 className="mt-4 font-bold text-[var(--foreground)]">
              Universitaly
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--muted-foreground)]">
              <li>
                <OfficialLink href="https://www.universitaly.it/en">
                  Universitaly portal
                </OfficialLink>
              </li>
              <li>
                <OfficialLink href={UNIVERSITALY_STUDENTS_URL}>
                  Universitaly foreign-student procedures
                </OfficialLink>
              </li>
            </ul>
            <h3 className="mt-4 font-bold text-[var(--foreground)]">
              University sources
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--muted-foreground)]">
              <li>
                <OfficialLink href="https://uniupo.it/en/studentinfo/arrangements-access-medicine-and-surgery-ay-20262027">
                  University of Eastern Piedmont — 2026/27 access arrangements
                </OfficialLink>
              </li>
            </ul>
            <h3 className="mt-4 font-bold text-[var(--foreground)]">NMC</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-[var(--muted-foreground)]">
              <li>
                <OfficialLink href="https://www.nmc.org.in/information-desk/for-students-to-study-in-abroad/">
                  NMC guidance for study abroad (NEET, no endorsed list)
                </OfficialLink>
              </li>
              <li>
                <OfficialLink href="https://nmc.org.in/storage/cms/rules-regulation-nmc/yFQCJ2Bf9yZU5zBfLCNUFIFG2E3optNdIAQfas9Z.pdf">
                  NMC FMGL Regulations 2021 FAQ
                </OfficialLink>
              </li>
            </ul>
            <p className="mt-4 text-sm leading-6 text-[var(--muted-foreground)]">
              Related guides:{" "}
              <Link href="/study-in-italy" className="font-semibold text-[var(--primary)] hover:underline">
                Study in Italy
              </Link>
              {" · "}
              <Link href="/medicine-in-italy" className="font-semibold text-[var(--primary)] hover:underline">
                Medicine in Italy
              </Link>
              {" · "}
              <Link href="/italy-university-admission" className="font-semibold text-[var(--primary)] hover:underline">
                Admission
              </Link>
              {" · "}
              <Link href="/italy-student-visa" className="font-semibold text-[var(--primary)] hover:underline">
                Student visa
              </Link>
              {" · "}
              <Link href="/italy-scholarships" className="font-semibold text-[var(--primary)] hover:underline">
                Scholarships
              </Link>
              {" · "}
              <Link href="/universitaly" className="font-semibold text-[var(--primary)] hover:underline">
                Universitaly
              </Link>
            </p>
          </div>

          <div className="mt-8 rounded-2xl bg-[var(--foreground)] px-6 py-8 text-center text-[var(--background)] sm:px-10 sm:py-10">
            <h2 className="text-xl font-bold sm:text-2xl">
              Planning Medicine in Italy for 2026/27?
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm opacity-80 sm:text-base">
              Get personalised guidance on the open semester, the
              English-taught route, NEET/NMC eligibility and the student visa.
            </p>
            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
              <CtaButton href="/contact">Book a free consultation</CtaButton>
              <CtaButton href="/medicine-in-italy" variant="secondary">
                Compare Medicine routes
              </CtaButton>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
