import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { getUniversityBySlug } from "@/services/universities.service";

const SITE_URL = "https://www.europeandreamss.com";

const getCachedUniversity = cache(getUniversityBySlug);

async function loadUniversity(slug) {
  try {
    return await getCachedUniversity(slug);
  } catch (error) {
    if (error.response?.status === 404 || error.status === 404) return null;
    throw error;
  }
}

function normalizeResult(result) {
  if (!result) return { university: null, courses: [], totals: {} };

  return {
    university: result.university ?? result,
    courses: result.courses ?? result.featuredCourses ?? [],
    totals: result.totals ?? {},
  };
}

function truncate(value, maxLength) {
  const text = String(value || "").trim().replace(/\s+/g, " ");
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}…`;
}

function buildUniversityDescription(university, courseCount) {
  if (university.metaDescription?.trim()) {
    const base = truncate(university.metaDescription, 155);
    // Generic factual suffix from existing data; only when it fits.
    const count = Number(courseCount);
    const city = university.city?.trim();
    if (count > 0 && city) {
      const enriched = `${base} Explore ${count} English-taught courses in ${city}.`;
      if (enriched.length <= 155) return enriched;
    }
    return base;
  }
  if (university.shortDescription?.trim()) {
    return truncate(university.shortDescription, 155);
  }
  if (university.overview?.trim()) {
    return truncate(university.overview, 155);
  }
  const location = [university.city, university.country]
    .filter(Boolean)
    .join(", ");
  const locationSuffix = location ? ` in ${location}` : " in Italy";
  const coursesSuffix =
    Number(courseCount) > 0 ? ` Explore ${courseCount} courses,` : "";
  return truncate(
    `${university.name}${locationSuffix}.${coursesSuffix} Find admission requirements, fees and English-taught programmes with European Dreams guidance.`,
    155,
  );
}

function stripBrandSuffix(value) {
  return String(value || "")
    .trim()
    .replace(/\s*\|\s*European Dreams\s*$/i, "")
    .trim();
}

function buildUniversityTitle(university) {
  if (university.seoTitle?.trim())
    return truncate(stripBrandSuffix(university.seoTitle), 60);
  const name = String(university.name || "").trim();
  const full = `${name} in Italy – Courses, Fees & Admission`;
  if (full.length <= 60) return full;
  const shortSuffix = " – Courses, Fees & Admission";
  if (name.length + shortSuffix.length <= 60) return `${name}${shortSuffix}`;
  return truncate(`${name}${shortSuffix}`, 60);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { university, courses, totals } = normalizeResult(
    await loadUniversity(slug),
  );

  if (!university) {
    return {
      title: "University Not Found",
      description: "The requested university could not be found.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const courseCount = totals.courses ?? courses.length;
  const title = buildUniversityTitle(university);
  const description = buildUniversityDescription(university, courseCount);
  const canonical = `${SITE_URL}/universities/${university.slug || slug}`;
  // Site-default OG asset when the university has no hero image.
  const ogImage =
    university.heroImage ||
    university.image ||
    `${SITE_URL}/images/hero.jpg`;
  const ogTitle = `${title} | European Dreams`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: ogTitle,
      description,
      url: canonical,
      siteName: "European Dreams",
      type: "website",
      locale: "en_IN",
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: university.name,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

function Fact({ label, value }) {
  if (!value) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
      <p className="mt-2 font-semibold leading-6 text-foreground">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm sm:p-8">
      <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
        {title}
      </h2>
      <div className="mt-5 leading-7 text-muted">{children}</div>
    </section>
  );
}

function formatList(value) {
  return Array.isArray(value) ? value.filter(Boolean).join(", ") : value;
}

const ADMISSION_FIELD_LABELS = [
  ["academics", "Academics"],
  ["ielts", "IELTS"],
  ["pte", "PTE"],
  ["centS", "CENT-S"],
  ["sat", "SAT"],
  ["imat", "IMAT"],
  ["notes", "Notes"],
];

// Admission requirements arrive as an object ({ academics, ielts, ... }),
// which has no `.length` — so the gate must be object-aware.
function getAdmissionEntries(source) {
  if (Array.isArray(source)) {
    return source
      .filter(Boolean)
      .map((item) => ({ label: "", value: String(item) }));
  }
  if (source && typeof source === "object") {
    return ADMISSION_FIELD_LABELS.map(([key, label]) => ({
      label,
      value: String(source[key] ?? "").trim(),
    })).filter((entry) => entry.value);
  }
  if (source) return [{ label: "", value: String(source) }];
  return [];
}

export default async function UniversityDetailsPage({ params }) {
  const { slug } = await params;
  const { university, courses, totals } = normalizeResult(
    await loadUniversity(slug),
  );

  if (!university?.name) notFound();

  const heroImage = university.heroImage || university.image;
  const location = [university.city, university.country]
    .filter(Boolean)
    .join(", ");
  const highlights =
    university.highlights ||
    university.whyChooseUs ||
    university.features ||
    [];
  const facilities = university.facilities || [];
  const admissionRequirements =
    university.admissionRequirements || university.eligibility || [];
  const admissionEntries = getAdmissionEntries(admissionRequirements);

  // Milan-only verified content (official unimi.it / apply.unimi.it sources).
  // Slug-gated so no other university page is affected, and used solely for
  // visible body content — never for title/meta/canonical/robots. Declared
  // before every usage below.
  const isUniversityOfMilan =
    (university.slug || slug) === "university-of-milan";

  // Sapienza-only gate. The verified slug is "sapienza-university-of-rome"
  // (live route + API record); every Sapienza section below uses this flag
  // so no other university page is affected.
  const isSapienza =
    (university.slug || slug) === "sapienza-university-of-rome";

  // The data object supports establishedYear (Number) but the Milan and
  // Sapienza records have none; fall back to the officially documented
  // founding years for these pages only. Ranking/tuitionFeeRange are
  // intentionally left untouched.
  const displayEstablishedYear =
    university.establishedYear ||
    (isUniversityOfMilan ? 1924 : null) ||
    (isSapienza ? 1303 : null);

  // Visible Milan FAQs. Each answer repeats only content already present in
  // the gated sections above — no invented claims.
  const milanFaqs = isUniversityOfMilan
    ? [
        {
          question: "Is the University of Milan a public university?",
          answer:
            "Yes. The University of Milan, known as La Statale, is a public university in Milan, Italy, founded in 1924. Its statute defines it as a public institution for research and higher education.",
        },
        {
          question:
            "How many English-taught programmes does the University of Milan offer?",
          answer:
            "The university states it offers over 40 English-taught programmes across Bachelor's, Master's and PhD level, plus more than 20 double-degree programmes. This page lists the English-taught courses currently in our database below.",
        },
        {
          question:
            "How do international students from outside the EU apply?",
          answer:
            "Holders of non-Italian qualifications apply through the university's apply.unimi.it portal, and non-EU students residing abroad additionally submit a pre-enrolment application for one university and one programme on the Universitaly portal so they can request a study visa. Admission itself follows the programme's own path: open-admission programmes evaluate curricular requirements and personal preparation, while limited-enrolment programmes rank applicants by entrance examination.",
        },
        {
          question:
            "What do tuition fees and scholarships look like at the University of Milan?",
          answer:
            "Tuition is paid in two instalments: a fixed first instalment and a variable second instalment based on ISEE University or, for students whose household earns abroad, a fixed country-group amount. International students can access DSU regional scholarships, Excellence Scholarships for master's entrants, European Futures scholarships for EU students, and MAECI or MUR-CRUI opportunities where eligible. Amounts and country groups change yearly, so always verify the current official fees regulation and scholarship calls.",
        },
        {
          question: "Where is the University of Milan located?",
          answer:
            "The university is in Milan, Lombardy, with its historic seat at Via Festa del Perdono 7 and scientific faculties in the Città Studi district. Teaching is organised by 31 departments across 8 Faculties and 2 Schools.",
        },
      ]
    : [];

  // Visible Sapienza FAQs. Each answer repeats only content already present
  // in the gated sections below — no invented claims.
  const sapienzaFaqs = isSapienza
    ? [
        {
          question: "Is Sapienza University of Rome a public university?",
          answer:
            "Yes. Sapienza University of Rome, also known as La Sapienza, is a public university in Rome, Italy, founded in 1303 by Pope Boniface VIII as the Studium Urbis.",
        },
        {
          question: "When was Sapienza University of Rome founded?",
          answer:
            "Sapienza was founded in 1303, making it the oldest university in Rome and one of the oldest universities in the world. Its main campus is the Città Universitaria in Rome, with additional locations in Latina and Rieti.",
        },
        {
          question: "How do non-EU students apply to Sapienza?",
          answer:
            "International applicants first complete a pre-selection application on the MoveIn platform where available, then follow the programme call on Infostud. Non-EU students residing abroad must additionally submit a pre-enrolment application on the Universitaly portal and use it to request a study visa, competing for reserved quota places where applicable.",
        },
        {
          question:
            "Does Sapienza offer English-taught programmes?",
          answer:
            "Yes. Sapienza states that over 70 of its 311 degree programmes are taught in English. This page lists the English-taught courses currently in our database below.",
        },
        {
          question:
            "What should international students do after arriving in Italy?",
          answer:
            "Plan for the essentials: get an Italian tax code, complete enrolment on Infostud, and — for non-EU stays over three months — apply for a residence permit within eight days of entering Italy. The Hello/Ciao offices and the International Student Office support newcomers, including with Italian language learning.",
        },
      ]
    : [];

  const canonical = `${SITE_URL}/universities/${university.slug || slug}`;

  const breadcrumbItems = [
    { name: "Home", href: `${SITE_URL}/` },
    { name: "Universities in Italy", href: `${SITE_URL}/universities` },
    { name: university.name, href: canonical },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href,
    })),
  };

  const universitySchema = (() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "CollegeOrUniversity",
      "@id": `${canonical}#university`,
      name: university.name,
      url: canonical,
      description: buildUniversityDescription(
        university,
        totals.courses ?? courses.length,
      ),
    };

    const image = university.heroImage || university.image;
    if (image?.trim()) {
      schema.image = image.trim();
    }

    if (university.logo?.trim()) {
      schema.logo = university.logo.trim();
    }

    const city = university.city?.trim();
    const region = university.region?.trim();
    if (city || region) {
      const address = {
        "@type": "PostalAddress",
        addressCountry: "Italy",
      };
      if (city) address.addressLocality = city;
      if (region) address.addressRegion = region;
      schema.address = address;
    }

    if (displayEstablishedYear) {
      schema.foundingDate = String(displayEstablishedYear);
    }

    const websiteUrl = (
      university.officialWebsite || university.website || ""
    ).trim();
    if (websiteUrl) {
      schema.sameAs = websiteUrl;
    }

    return schema;
  })();

  // No FAQPage schema: FAQs stay visible only, per task constraints.
  // CollegeOrUniversity + BreadcrumbList remain the only schemas here.

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={universitySchema} />
      <main className="min-h-screen bg-background">
        <header
          className="relative isolate min-h-125 overflow-hidden bg-slate-950 bg-cover bg-center"
          style={
            heroImage ? { backgroundImage: `url("${heroImage}")` } : undefined
          }
        >
          <div className="absolute inset-0 -z-10 bg-linear-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />
          <div className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />

          <div className="mx-auto flex min-h-125 max-w-300 items-end px-5 py-14 text-white sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-4xl">
              <div className="mb-6">
                <Breadcrumbs items={breadcrumbItems} variant="dark" />
              </div>
              <Link
                href="/universities"
                className="text-sm font-bold text-white/80 transition hover:text-white"
              >
                ← All universities
              </Link>

              <div className="mt-7 flex items-center gap-4">
                {university.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={university.logo}
                    alt={`${university.name} logo`}
                    className="h-16 w-16 rounded-2xl border border-white/30 bg-white object-contain p-2 shadow-lg"
                  />
                )}
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-300">
                  {university.universityType || "European university"}
                </p>
              </div>

              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {university.name}
                {university.country ? `, ${university.country}` : " in Italy"}
              </h1>
              {location && (
                <p className="mt-4 text-lg font-semibold text-white/90">
                  📍 {location}
                </p>
              )}
              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">
                {university.shortDescription ||
                  `Discover courses, admission requirements, fees and scholarships at ${university.name} in Italy.`}
              </p>
              {(() => {
                const courseCount = totals.courses ?? courses.length;
                const typePart = university.universityType
                  ? ` is a ${String(university.universityType).toLowerCase()}`
                  : "";
                const locationPart = location
                  ? ` located in ${location}`
                  : " in Italy";
                if (!typePart && !courseCount) return null;
                return (
                  <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">
                    {university.name}
                    {typePart}
                    {locationPart}
                    {Number(courseCount) > 0
                      ? ` with ${courseCount} course${Number(courseCount) === 1 ? "" : "s"} listed below`
                      : ""}
                    . Explore English-taught programmes, admission guidance
                    and opportunities for international and Indian students.
                  </p>
                );
              })()}

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#courses"
                  className="rounded-xl bg-secondary px-5 py-3 font-bold text-white transition hover:bg-secondary-hover"
                >
                  Explore courses
                </a>
                <Link
                  href={`/contact?type=admission&university=${encodeURIComponent(
                    university.name,
                  )}`}
                  className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Get free guidance
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-300 px-5 py-12 sm:px-6 lg:px-8 lg:py-20">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Fact label="Location" value={location} />
            <Fact label="University type" value={university.universityType} />
            <Fact label="Established" value={displayEstablishedYear} />
            <Fact label="World ranking" value={university.ranking} />
            <Fact label="Tuition fees" value={university.tuitionFeeRange} />
            <Fact
              label="Available courses"
              value={totals.courses ?? courses.length}
            />
            <Fact label="Main intakes" value={formatList(university.intakes)} />
            <Fact
              label="Language"
              value={formatList(university.language || university.languages)}
            />
          </section>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-8">
              {(university.overview || university.description) && (
                <Section title={`About ${university.name}`}>
                  <p className="whitespace-pre-line">
                    {university.overview || university.description}
                  </p>
                </Section>
              )}

              {highlights.length > 0 && (
                <Section title="Why choose this university?">
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {highlights.map((item) => (
                      <li
                        key={item}
                        className="rounded-xl bg-primary-light p-4 font-medium text-foreground"
                      >
                        <span className="mr-2 text-primary">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {isUniversityOfMilan && (
                <Section title="About the University of Milan (La Statale)">
                  <p>
                    The University of Milan, known as La Statale, is a
                    public university in Milan, Italy, founded in 1924 on
                    the initiative of Luigi Mangiagalli. Its statute
                    defines it as a public institution for research and
                    higher education. The first four faculties were Law,
                    Humanities, Medicine, and Mathematical, Physical and
                    Natural Sciences, and the university has grown into a
                    large multidisciplinary institution.
                  </p>
                  <p className="mt-4">
                    The historic seat is at Via Festa del Perdono 7 in
                    central Milan, while the scientific faculties are
                    concentrated in the Città Studi district. The
                    university describes itself as a member of
                    international networks including the League of
                    European Research Universities (LERU) and the 4EU+
                    European University Alliance. For authoritative
                    history and institutional detail, see the{" "}
                    <a
                      href="https://www.unimi.it/en/university/la-statale/our-heritage-our-future"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      university&apos;s official heritage page
                    </a>
                    .
                  </p>
                </Section>
              )}

              {isUniversityOfMilan && (
                <Section title="Faculties, Schools and Departments">
                  <p>
                    Teaching at the University of Milan is organised by
                    departments and coordinated by faculties, which
                    promote courses across their disciplinary fields. The
                    university counts 8 Faculties and 2 Schools alongside
                    31 departments spanning the social sciences and
                    humanities, the physical sciences and engineering,
                    and the life sciences.
                  </p>
                  <p className="mt-4">
                    The university lists its faculties and schools as
                    Humanities; Exercise and Sports Science; Pharmacy;
                    Medicine; Veterinary Medicine; Law; Political,
                    Economic and Social Sciences; Agricultural and Food
                    Sciences; Science and Technology; and Language
                    Mediation and Intercultural Communication. Details
                    are published on the{" "}
                    <a
                      href="https://www.unimi.it/en/education/faculties-and-schools"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official faculties and schools page
                    </a>{" "}
                    and the{" "}
                    <a
                      href="https://www.unimi.it/en/university/offices-and-facilities/departments"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official departments page
                    </a>
                    .
                  </p>
                </Section>
              )}

              {isUniversityOfMilan && (
                <Section title="English-taught programmes at the University of Milan">
                  <p>
                    The university states it offers over 40
                    English-taught programmes across Bachelor&apos;s,
                    Master&apos;s and PhD level, alongside more than 20
                    double-degree programmes run with international
                    partner universities. This page lists{" "}
                    {totals.courses ?? courses.length} English-taught
                    courses currently in our database — spanning
                    bachelor&apos;s degrees, single-cycle master&apos;s
                    degrees such as Medicine and Surgery, and
                    master&apos;s degrees across science, economics,
                    humanities and social sciences.
                  </p>
                  <p className="mt-4">
                    Browse the course cards below, or compare with other{" "}
                    <Link
                      href="/english-taught-courses-in-italy"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      English-taught courses in Italy
                    </Link>
                    . The full official catalogue, including programmes
                    taught in Italian, is on the{" "}
                    <a
                      href="https://www.unimi.it/en/international/coming-abroad/enrol-programme/programmes-english"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      university&apos;s programmes-in-English page
                    </a>
                    .
                  </p>
                </Section>
              )}

              {isSapienza && (
                <Section title="About Sapienza University of Rome (La Sapienza)">
                  <p>
                    Sapienza University of Rome, also known as La
                    Sapienza, is a public university in Rome, Italy,
                    founded in 1303 by Pope Boniface VIII as the Studium
                    Urbis. It is the oldest university in Rome and one
                    of the oldest universities in the world, with a
                    history closely tied to the city across more than
                    seven centuries.
                  </p>
                  <p className="mt-4">
                    The main campus is the Città Universitaria in the
                    heart of Rome, a short distance from Termini central
                    station, with additional locations including Latina
                    and Rieti. For authoritative history and
                    institutional detail, see the{" "}
                    <a
                      href="https://www.uniroma1.it/en/pagina/our-history"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      university&apos;s official history page
                    </a>{" "}
                    and the{" "}
                    <a
                      href="https://www.uniroma1.it/en/pagina/about-us"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official about page
                    </a>
                    .
                  </p>
                </Section>
              )}

              {isSapienza && (
                <Section title="Faculties, Schools and Departments">
                  <p>
                    Sapienza is organised into 11 faculties alongside a
                    School for Advanced Studies and 58 departments, as
                    established by the university statute. Teaching and
                    research activities are organised by the departments
                    and coordinated by the faculties across every major
                    academic area.
                  </p>
                  <p className="mt-4">
                    The current faculty and department organisation is
                    published on the{" "}
                    <a
                      href="https://www.uniroma1.it/en/pagina/faculties"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official faculties page
                    </a>{" "}
                    and the{" "}
                    <a
                      href="https://www.uniroma1.it/en/pagina/structures"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official structures page
                    </a>
                    .
                  </p>
                </Section>
              )}

              {isSapienza && (
                <Section title="English-taught programmes at Sapienza">
                  <p>
                    Sapienza states that over 70 of its 311 degree
                    programmes are taught in English, spanning
                    Bachelor&apos;s and Master&apos;s level. This page
                    lists {totals.courses ?? courses.length}{" "}
                    English-taught courses currently in our database —
                    spanning bachelor&apos;s degrees, master&apos;s
                    degrees across engineering, science, economics,
                    humanities and social sciences, and single-cycle
                    master&apos;s paths.
                  </p>
                  <p className="mt-4">
                    Browse the course cards below, or compare with other{" "}
                    <Link
                      href="/english-taught-courses-in-italy"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      English-taught courses in Italy
                    </Link>
                    . The full official offer is described on the{" "}
                    <a
                      href="https://www.uniroma1.it/en/admissions"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      university&apos;s international admissions page
                    </a>
                    .
                  </p>
                </Section>
              )}

              <section
                id="courses"
                className="scroll-mt-24 rounded-[1.75rem] border border-border bg-card p-6 shadow-sm sm:p-8"
              >
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-secondary">
                      Programmes
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
                      Courses at {university.name}
                    </h2>
                  </div>
                  <span className="rounded-full bg-primary-light px-4 py-2 text-sm font-bold text-primary">
                    {totals.courses ?? courses.length} courses
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">
                  <Link
                    href="/courses"
                    className="font-semibold text-primary transition hover:text-primary-hover"
                  >
                    Browse all courses in Italy
                  </Link>
                  {" · "}
                  <Link
                    href="/study-in-italy"
                    className="font-semibold text-primary transition hover:text-primary-hover"
                  >
                    Study in Italy guide
                  </Link>
                </p>

                {courses.length > 0 ? (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {courses.map((course) => (
                      <Link
                        key={course._id || course.slug}
                        href={`/courses/${university.slug}/${course.slug}`}
                        className="group rounded-2xl border border-border bg-background p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                      >
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-secondary">
                          {course.degreeLevel ||
                            course.degreeType ||
                            "Programme"}
                        </p>
                        <h3 className="mt-2 text-lg font-bold text-foreground transition group-hover:text-primary">
                          {course.name || course.title}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-muted">
                          {[
                            course.duration,
                            course.tuitionFee,
                            // Displayed language comes from the actual
                            // course.language value; isEnglishTaught is only
                            // supporting logic when language is missing.
                            course.language ||
                              (course.isEnglishTaught ? "English" : ""),
                          ]
                            .filter(Boolean)
                            .join(" · ") ||
                            "View course details and requirements"}
                        </p>
                        <span className="mt-4 inline-block text-sm font-bold text-primary">
                          View course →
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl bg-background p-8 text-center">
                    <p className="font-bold text-foreground">
                      Courses are coming soon
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      Contact our counsellors for the latest programme
                      information.
                    </p>
                  </div>
                )}
              </section>

              {admissionEntries.length > 0 && (
                <Section title={`Admission requirements at ${university.name}`}>
                  <ul className="space-y-3">
                    {admissionEntries.map((entry) => (
                      <li
                        key={entry.label || entry.value}
                        className="flex gap-3"
                      >
                        <span className="font-bold text-success">✓</span>
                        <span>
                          {entry.label ? (
                            <span className="font-bold">
                              {entry.label}:{" "}
                            </span>
                          ) : null}
                          {entry.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm leading-6 text-muted">
                    <Link
                      href="/italy-university-admission"
                      className="font-bold text-primary transition hover:text-primary-hover"
                    >
                      Full Italy university admission guide →
                    </Link>
                  </p>
                </Section>
              )}

              {isSapienza && (
                <Section title="How to apply to Sapienza">
                  <h3 className="font-bold text-foreground">
                    Sapienza pre-selection and MoveIn
                  </h3>
                  <p className="mt-2">
                    International applicants first complete a
                    pre-selection application on the MoveIn platform
                    where available for their programme, so Sapienza can
                    assess eligibility before the official call is
                    published. Where pre-selection applies, each student
                    can apply for a maximum of two programmes per
                    academic year. Always check the programme&apos;s
                    admission requirements and accepted qualifications
                    before applying.
                  </p>
                  <h3 className="mt-5 font-bold text-foreground">
                    Infostud and programme calls
                  </h3>
                  <p className="mt-2">
                    Enrolment itself runs through Infostud,
                    Sapienza&apos;s student services portal, following
                    the instructions in the programme&apos;s official
                    call for applications in the course catalogue. Calls
                    are published during the admission cycle, so the
                    current call is the only authoritative source for
                    steps and dates.
                  </p>
                  <h3 className="mt-5 font-bold text-foreground">
                    EU versus non-EU applicants
                  </h3>
                  <p className="mt-2">
                    Admission procedures vary by citizenship and
                    residency: EU citizens and non-EU citizens legally
                    residing in Italy follow one track, while non-EU
                    students residing abroad follow another. Non-EU
                    students residing abroad must complete mandatory
                    pre-enrolment on the Universitaly portal and use it
                    to request a study visa, competing for reserved
                    quota places where the programme sets them. Our{" "}
                    <Link
                      href="/italy-university-admission"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Italy university admission guide
                    </Link>
                    ,{" "}
                    <Link
                      href="/universitaly"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Universitaly guidance
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/italy-student-visa"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Italy student visa guidance
                    </Link>{" "}
                    explain the surrounding steps.
                  </p>
                  <h3 className="mt-5 font-bold text-foreground">
                    Documents and language at a glance
                  </h3>
                  <p className="mt-2">
                    Expect to provide a passport, diplomas, transcripts
                    and a language certificate, plus recognised proof of
                    foreign qualifications such as CIMEA comparability
                    or a Declaration of Value where relevant. Non-EU
                    applicants to Italian-taught programmes generally
                    face a B2-level Italian language test, while
                    applicants to programmes taught entirely in English
                    are exempt from the Italian test. Requirements,
                    quotas and deadlines change every year, so always
                    verify the current programme call and the{" "}
                    <a
                      href="https://www.uniroma1.it/en/pagina/international-student-office"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      International Student Office page
                    </a>{" "}
                    before applying.
                  </p>
                </Section>
              )}

              {isSapienza && (
                <Section title="Tuition fees and scholarships">
                  <p>
                    Sapienza tuition is paid in three instalments —
                    roughly a 30/35/35 split — with the amount based on
                    ISEE for the right to university study for students
                    assessed in Italy. Enrolment also includes the
                    regional tax and stamp duty, and Sapienza provides
                    exemptions and benefits for eligible groups, such as
                    full exemption at lower ISEE levels and reductions
                    above them.
                  </p>
                  <p className="mt-4">
                    International students can access regional Disco —
                    LazioDiSCo scholarships for university degree
                    programmes alongside other Sapienza benefits, as
                    well as MAECI government scholarship opportunities
                    where eligible. Amounts, thresholds and calls change
                    every academic year, so always verify the current
                    regulation. See our{" "}
                    <Link
                      href="/italy-scholarships"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Italy scholarships guidance
                    </Link>
                    , the university&apos;s{" "}
                    <a
                      href="https://www.uniroma1.it/en/node/24520"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official tuition fees and benefits page
                    </a>{" "}
                    and the{" "}
                    <a
                      href="https://www.uniroma1.it/en/pagina/exemptions-and-benefits"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official exemptions and benefits page
                    </a>
                    .
                  </p>
                </Section>
              )}

              {isSapienza && (
                <Section title="International student essentials">
                  <p>
                    Sapienza supports newcomers through the Hello and
                    Ciao orientation offices and the International
                    Student Office. Plan for three practical essentials:
                    obtain an Italian tax code, complete enrolment steps
                    on Infostud, and — for non-EU stays over three
                    months — apply for a residence permit within eight
                    days of entering Italy.
                  </p>
                  <p className="mt-4">
                    The university also supports Italian language
                    learning for international students. Our{" "}
                    <Link
                      href="/study-in-italy"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Study in Italy guide
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/italy-student-visa"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Italy student visa guidance
                    </Link>{" "}
                    cover these steps in more depth.
                  </p>
                </Section>
              )}

              {isSapienza && (
                <Section title="Applying to Sapienza from India">
                  <p>
                    Applicants applying from India follow the non-EU
                    resident-abroad pathway: a pre-selection application
                    on MoveIn where available for the programme,
                    enrolment steps on Infostud under the current
                    programme call, a pre-enrolment application on the
                    Universitaly portal, and a study visa request,
                    competing for reserved quota places where
                    applicable. Prepare foreign qualification documents
                    with CIMEA comparability or a Declaration of Value
                    where relevant, plus accepted proof of English
                    proficiency for English-taught programmes.
                  </p>
                  <p className="mt-4">
                    Admission calls, quotas, fee rules and scholarship
                    calls change every academic year. Students applying
                    from India should verify the current programme call
                    on uniroma1.it, the Universitaly pre-enrolment
                    window, and visa documentation before applying — see
                    the{" "}
                    <Link
                      href="/study-in-italy"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Study in Italy guide
                    </Link>
                    ,{" "}
                    <Link
                      href="/italy-university-admission"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Italy university admission process
                    </Link>
                    ,{" "}
                    <Link
                      href="/universitaly"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Universitaly guidance
                    </Link>
                    ,{" "}
                    <Link
                      href="/italy-student-visa"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Italy student visa guidance
                    </Link>
                    ,{" "}
                    <Link
                      href="/italy-scholarships"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Italy scholarships guidance
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/english-taught-courses-in-italy"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      English-taught courses in Italy
                    </Link>
                    .
                  </p>
                </Section>
              )}

              {isSapienza && sapienzaFaqs.length > 0 && (
                <Section title="Frequently asked questions about Sapienza">
                  <div className="space-y-3">
                    {sapienzaFaqs.map((faq) => (
                      <details
                        key={faq.question}
                        className="rounded-xl border border-border bg-background p-5"
                      >
                        <summary className="cursor-pointer font-bold text-foreground">
                          {faq.question}
                        </summary>
                        <p className="mt-3 whitespace-pre-line">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </Section>
              )}

              {isUniversityOfMilan && (
                <Section title="How to apply to the University of Milan">
                  <h3 className="font-bold text-foreground">
                    Where applications start
                  </h3>
                  <p className="mt-2">
                    Students holding a qualification issued by a
                    non-Italian institution apply through the
                    university&apos;s international admissions portal at{" "}
                    <a
                      href="https://apply.unimi.it/"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      apply.unimi.it
                    </a>
                    , where candidates can apply for up to three degree
                    programmes per academic year. Students with Italian
                    qualifications instead follow the standard enrolment
                    section of the university website.
                  </p>
                  <h3 className="mt-5 font-bold text-foreground">
                    Open versus limited enrolment
                  </h3>
                  <p className="mt-2">
                    Open-admission master&apos;s programmes evaluate an
                    admission application against the programme&apos;s
                    curricular requirements and the candidate&apos;s
                    personal preparation — some also require B1 or B2
                    English proficiency. Limited-enrolment programmes
                    require an entrance examination, and the resulting
                    ranking decides who may enrol. Bachelor&apos;s
                    applicants likewise sit an admission test or skills
                    assessment, whose rules are set in each
                    programme&apos;s official call.
                  </p>
                  <h3 className="mt-5 font-bold text-foreground">
                    EU versus non-EU applicants
                  </h3>
                  <p className="mt-2">
                    Italian, EU and non-EU citizens holding an Italian
                    residence permit apply directly to the university.
                    Non-EU students residing abroad additionally submit a
                    pre-enrolment application for one university and one
                    programme on the Universitaly portal, compete for
                    reserved places, and use it to request a study visa.
                    The university publishes the full procedure on its{" "}
                    <a
                      href="https://www.unimi.it/en/international/coming-abroad/enrol-programme/international-enrolment-degree-programmes"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      international enrolment page
                    </a>
                    . Our{" "}
                    <Link
                      href="/italy-university-admission"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Italy university admission guide
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/universitaly"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Universitaly guidance
                    </Link>{" "}
                    explain the surrounding steps.
                  </p>
                  <h3 className="mt-5 font-bold text-foreground">
                    Documents at a glance
                  </h3>
                  <p className="mt-2">
                    Expect to provide academic transcripts and degree
                    certificates with translations where required, plus a
                    CIMEA statement of comparability and verification or
                    a Declaration of Value for foreign qualifications —
                    diplomas from European Higher Education Area
                    universities may use the Diploma Supplement instead.
                    Qualifications are accepted in English, French,
                    German, Spanish or Italian unless a programme states
                    otherwise, and an Italian tax code is needed to
                    complete online enrolment. Calls, deadlines and
                    document lists change every year, so always verify
                    the current programme call on unimi.it before
                    applying.
                  </p>
                </Section>
              )}

              {isUniversityOfMilan && (
                <Section title="Tuition fees and scholarships">
                  <p>
                    Tuition is paid in two instalments: a fixed first
                    instalment covering the regional tax and stamp duty,
                    and a variable second instalment. Students whose
                    household has income and assets in Italy are assessed
                    through ISEE University; students whose household
                    earns and holds assets abroad pay a fixed second
                    instalment based on their country group and tuition
                    area. Amounts and country groups are reset each
                    academic year in the official fees regulation.
                  </p>
                  <p className="mt-4">
                    International students can access the same
                    need-and-merit benefits as Italian students,
                    including DSU regional scholarships funded by the
                    Lombardy Region and the Ministry of University and
                    Research, which combine a grant with canteen access
                    and exempt winners from the second instalment. The
                    university also runs Excellence Scholarships for top
                    international entrants to master&apos;s programmes,
                    European Futures scholarships for EU students on
                    master&apos;s programmes, and MAECI and MUR-CRUI
                    opportunities for eligible groups. See our{" "}
                    <Link
                      href="/italy-scholarships"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Italy scholarships guidance
                    </Link>{" "}
                    and the university&apos;s{" "}
                    <a
                      href="https://www.unimi.it/en/international/coming-abroad/fees-scholarships-and-opportunities"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official fees and scholarships page
                    </a>
                    .
                  </p>
                </Section>
              )}

              {isUniversityOfMilan && (
                <Section title="International student essentials">
                  <p>
                    The Welcome Desk of the International Students Office
                    supports newcomers with first arrival and with
                    verifying foreign qualifications for enrolment. Plan
                    for three practical essentials: obtain an Italian tax
                    code before enrolling online, pay the first
                    instalment to complete enrolment, and — for non-EU
                    stays over three months — apply for a residence
                    permit within eight days of entering Italy.
                  </p>
                  <p className="mt-4">
                    The university offers free Italian language courses
                    to international students. An Italian proficiency
                    test applies only to Italian-taught paths, with
                    exemptions including B2-level certification under the
                    CLIQ system; English-taught programmes instead
                    assess English proficiency. Our{" "}
                    <Link
                      href="/study-in-italy"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Study in Italy guide
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/italy-student-visa"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Italy student visa guidance
                    </Link>{" "}
                    cover these steps in more depth.
                  </p>
                </Section>
              )}

              {isUniversityOfMilan && (
                <Section title="Applying to the University of Milan from India">
                  <p>
                    Applicants applying from India follow the non-EU
                    resident-abroad pathway: an admission application on
                    apply.unimi.it, a single-choice pre-enrolment
                    application on the Universitaly portal, and a study
                    visa request, competing for the reserved non-EU
                    places in the chosen programme. Prepare foreign
                    qualification documents with CIMEA comparability or a
                    Declaration of Value, plus accepted proof of English
                    proficiency for English-taught programmes.
                  </p>
                  <p className="mt-4">
                    Admission calls, reserved-place counts, fee country
                    groups and scholarship amounts change every academic
                    year. Students applying from India should verify the
                    current programme call on unimi.it, the Universitaly
                    pre-enrolment window, and visa documentation before
                    applying — see the{" "}
                    <Link
                      href="/study-in-italy"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Study in Italy guide
                    </Link>
                    ,{" "}
                    <Link
                      href="/italy-university-admission"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Italy university admission process
                    </Link>
                    ,{" "}
                    <Link
                      href="/universitaly"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Universitaly guidance
                    </Link>
                    ,{" "}
                    <Link
                      href="/italy-student-visa"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Italy student visa guidance
                    </Link>
                    ,{" "}
                    <Link
                      href="/italy-scholarships"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Italy scholarships guidance
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/english-taught-courses-in-italy"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      English-taught courses in Italy
                    </Link>
                    .
                  </p>
                </Section>
              )}

              {isUniversityOfMilan && milanFaqs.length > 0 && (
                <Section title="Frequently asked questions about the University of Milan">
                  <div className="space-y-3">
                    {milanFaqs.map((faq) => (
                      <details
                        key={faq.question}
                        className="rounded-xl border border-border bg-background p-5"
                      >
                        <summary className="cursor-pointer font-bold text-foreground">
                          {faq.question}
                        </summary>
                        <p className="mt-3 whitespace-pre-line">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </Section>
              )}

              {facilities.length > 0 && (
                <Section title="Campus facilities">
                  <div className="flex flex-wrap gap-3">
                    {facilities.map((facility) => (
                      <span
                        key={facility}
                        className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </Section>
              )}

              {university.faqs?.length > 0 && (
                <Section title="Frequently asked questions">
                  <div className="space-y-3">
                    {university.faqs.map((faq) => (
                      <details
                        key={faq._id || faq.question}
                        className="rounded-xl border border-border bg-background p-5"
                      >
                        <summary className="cursor-pointer font-bold text-foreground">
                          {faq.question}
                        </summary>
                        <p className="mt-3 whitespace-pre-line">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </Section>
              )}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[1.75rem] bg-primary p-7 text-white shadow-xl shadow-primary/15">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-white/70">
                  Application support
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold">
                  Interested in {university.name}?
                </h2>
                <p className="mt-4 leading-7 text-white/80">
                  Get personalised guidance for course selection, documents,
                  applications and your student visa.
                </p>
                <Link
                  href={`/contact?university=${encodeURIComponent(university.name)}`}
                  className="mt-6 inline-flex rounded-xl bg-secondary px-5 py-3 font-bold text-white transition hover:bg-secondary-hover"
                >
                  Book free consultation
                </Link>
                <Link
                  href="/italy-university-admission"
                  className="mt-3 inline-flex font-bold text-white/80 transition hover:text-white"
                >
                  Italy university admission guide →
                </Link>
                <Link
                  href="/italy-student-visa"
                  className="mt-3 inline-flex font-bold text-white/80 transition hover:text-white"
                >
                  Italy student visa guide →
                </Link>
              </div>

              {(university.website || university.applicationDeadline) && (
                <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Quick information
                  </h2>
                  <div className="mt-5 space-y-5 text-sm leading-6">
                    {university.applicationDeadline && (
                      <div>
                        <p className="font-bold text-foreground">
                          Application deadline
                        </p>
                        <p className="mt-1 text-muted">
                          {university.applicationDeadline}
                        </p>
                      </div>
                    )}
                    {university.website && (
                      <a
                        href={university.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex font-bold text-primary hover:text-primary-hover"
                      >
                        Visit official website ↗
                      </a>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
