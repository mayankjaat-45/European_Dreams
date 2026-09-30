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

function buildUniversityDescription(university, courseCount, slug, forSchema) {
  if (
    !forSchema &&
    (university.slug || slug) === "university-of-milan"
  ) {
    const count = Number(courseCount) || 35;
    return truncate(
      `Explore University of Milan (La Statale), with ${count} courses currently listed in our database, 2026/27 fees, deadlines and scholarships for international students.`,
      160,
    );
  }
  if (
    !forSchema &&
    (university.slug || slug) === "university-of-genoa"
  ) {
    return truncate(
      "Explore University of Genoa (UniGe), including bachelor's and English-taught courses, 2026 admission dates, fees and scholarships for international students.",
      160,
    );
  }
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

function buildUniversityTitle(university, slug) {
  if ((university.slug || slug) === "university-of-milan")
    return "University of Milan (La Statale): Courses, Fees & Admission";
  if ((university.slug || slug) === "university-of-genoa")
    return "University of Genoa (UniGe): Bachelor's & English-Taught Courses";
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
  const title = buildUniversityTitle(university, slug);
  const description = buildUniversityDescription(
    university,
    courseCount,
    slug,
  );
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

  // Genoa-only gate. The verified slug is "university-of-genoa"
  // (live route + API record); every Genoa section below uses this flag
  // so no other university page is affected.
  const isGenoa = (university.slug || slug) === "university-of-genoa";

  // Turin-only gate. The verified slug is "university-of-turin"
  // (live route + API record); every Turin section below uses this flag
  // so no other university page is affected.
  const isTurin = (university.slug || slug) === "university-of-turin";

  // Eastern-Piedmont-only gate. The verified slug is
  // "university-of-eastern-piedmont" (live route + API record); every
  // Eastern Piedmont section below uses this flag so no other
  // university page is affected. Declared before every usage below.
  const isEasternPiedmont =
    (university.slug || slug) === "university-of-eastern-piedmont";

  // The data object supports establishedYear (Number) but the Milan,
  // Sapienza, Genoa and Turin records have none; fall back to the
  // officially documented founding years for these pages only.
  // Ranking/tuitionFeeRange are intentionally left untouched.
  const displayEstablishedYear =
    university.establishedYear ||
    (isUniversityOfMilan ? 1924 : null) ||
    (isSapienza ? 1303 : null) ||
    (isGenoa ? 1481 : null) ||
    (isTurin ? 1404 : null) ||
    (isEasternPiedmont ? 1998 : null);

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

  // Visible Genoa FAQs. Each answer repeats only content already present in
  // the gated sections below — no invented claims.
  const genoaFaqs = isGenoa
    ? [
        {
          question: "Is the University of Genoa a public university?",
          answer:
            "Yes. The University of Genoa (Università degli Studi di Genova, UniGe) is a public university in Genoa, Italy. Its main seat is at Via Balbi 5 in Genoa, with additional campuses in Imperia, Savona and La Spezia.",
        },
        {
          question: "When was the University of Genoa founded?",
          answer:
            "The university states it was founded in 1481, giving it more than six centuries of academic tradition. See the About section above and the university's official history pages for detail.",
        },
        {
          question:
            "How many English-taught courses are available at the University of Genoa?",
          answer:
            "UniGe states it offers 15 degree courses in English among more than 130 degree courses. This page lists the 17 English-taught courses currently in our database below — not the university's official total. Browse the course cards or the official English catalogue linked in the English-taught programmes section.",
        },
        {
          question: "How do non-EU students apply to the University of Genoa?",
          answer:
            "Students with non-Italian qualifications start with UniGeApply for qualification assessment. Non-EU students residing abroad who need a visa additionally complete pre-enrolment on the Universitaly portal. See How to apply below and the linked admission, Universitaly and visa guides.",
        },
        {
          question:
            "How are tuition fees and scholarships structured at the University of Genoa?",
          answer:
            "The student contribution consists of stamp duty, regional tax and an ISEE-U-based university contribution, paid in three instalments via pagoPA. ALISEO regional grants alongside UniGe incentives and, where eligible, MAECI or Invest Your Talent in Italy opportunities may apply. Amounts and eligibility change yearly, so verify the current fees page and scholarship calls.",
        },
      ]
    : [];

  // Visible Turin FAQs. Each answer repeats only content already present in
  // the gated sections below — no invented claims.
  const turinFaqs = isTurin
    ? [
        {
          question: "Is the University of Turin a public university?",
          answer:
            "Yes. The University of Turin (Università degli Studi di Torino, UniTo) is a public university in Turin, Italy. Its main seat is at Via Verdi 8 in Turin, with locations across the city and Piedmont.",
        },
        {
          question: "When was the University of Turin founded?",
          answer:
            "The university states it was founded in 1404, making it one of the most ancient universities in Italy. See the About section above and the university's official history page for detail.",
        },
        {
          question:
            "What English-taught options does the University of Turin offer?",
          answer:
            "For 2026-27 the university lists 3 undergraduate programmes, 13 postgraduate programmes and 5 curricula taught in English, plus the 6-year Medicine and Surgery programme. Our course database currently lists 33 Turin course records — not the university's official total. Browse the course cards or the official English catalogue linked in the English-taught programmes section.",
        },
        {
          question: "How do international and non-EU students apply?",
          answer:
            "Students with non-Italian qualifications apply through Apply@UniTo for assessment. Non-EU students residing abroad who need a visa additionally complete pre-enrolment on the Universitaly portal. See How to apply below and the linked admission, Universitaly and visa guides.",
        },
        {
          question:
            "How are tuition fees and scholarships structured at the University of Turin?",
          answer:
            "Tuition is paid in four instalments: a fixed first payment covering stamp duty and regional tax, plus an ISEE-based or, for residents abroad, GDP-PPP country-band contribution with a simulator and EDISU treatment per the current regulation. EDISU regional grants alongside Talent 4 UniTo and, where eligible, Students at Risk/UNICORE or MAECI opportunities may apply. Amounts and eligibility change yearly, so verify the current fees page and scholarship calls.",
        },
      ]
    : [];

  // Visible Eastern Piedmont FAQs. Each answer repeats only content
  // already present in the gated sections below — no invented claims.
  // Visible only; no FAQPage schema is added anywhere on this page.
  const easternPiedmontFaqs = isEasternPiedmont
    ? [
        {
          question: "What is the University of Eastern Piedmont?",
          answer:
            "The University of Eastern Piedmont, officially the Università degli Studi del Piemonte Orientale “Amedeo Avogadro” (UPO), is a public university founded on 30 July 1998. It is named after the Piedmontese scientist Amedeo Avogadro and follows a polycentric model across Alessandria, Novara and Vercelli.",
        },
        {
          question: "Where is UPO located?",
          answer:
            "UPO is rooted in three city-campuses — Alessandria, Novara and Vercelli — with the Rectorate in Vercelli, alongside additional teaching sites elsewhere in Piedmont. See the About and Departments sections above and the university's official where-we-are page for detail.",
        },
        {
          question: "Does UPO offer English-taught programmes?",
          answer:
            "Yes. Verified entirely-in-English options include the Management for Sustainability bachelor's degree and master's degrees in Food, Health and Environment, Medical Biotechnologies, Management and Finance, and Disaster and Health Crisis Management. This page lists the English-taught courses currently in our database below — not the university's complete official catalogue.",
        },
        {
          question: "How do non-EU students apply to UPO?",
          answer:
            "Non-EU students residing abroad who need a visa complete pre-enrolment on the Universitaly portal, which UPO validates before it goes to the embassy or consulate. Master's programmes also set their own programme-level procedures, so always verify the current programme page. See How to apply below and the linked admission, Universitaly and visa guides.",
        },
        {
          question:
            "How are tuition fees and scholarships handled at UPO?",
          answer:
            "UPO charges an annual all-inclusive fee in instalments, calculated with ISEE or, for households with income abroad, ISEE Parificato, with a No-Tax Area and a fee simulator. Scholarships, accommodation and canteens run through EDISU Piemonte via a separate application. Amounts and calls change yearly, so verify the current fees pages and EDISU calls.",
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
        null,
        true,
      ),
    };

    const image = university.heroImage || university.image;
    if (image?.trim()) {
      schema.image = image.trim();
    }

    if (university.logo?.trim()) {
      schema.logo = university.logo.trim();
    }

    if (isUniversityOfMilan) {
      schema.alternateName = [
        "Università degli Studi di Milano",
        "La Statale",
      ];
    }

    const city = university.city?.trim();
    const region = university.region?.trim();
    if (isUniversityOfMilan) {
      schema.address = {
        "@type": "PostalAddress",
        streetAddress: "Via Festa del Perdono, 7",
        addressLocality: city || "Milan",
        addressRegion: region || "Lombardy",
        postalCode: "20122",
        addressCountry: "IT",
      };
    } else if (city || region) {
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
      university.officialWebsite ||
      university.website ||
      (isUniversityOfMilan ? "https://www.unimi.it/" : "") ||
      (isGenoa ? "https://unige.it" : "") ||
      (isTurin ? "https://www.unito.it" : "") ||
      (isEasternPiedmont ? "https://www.uniupo.it" : "")
    ).trim();
    if (isUniversityOfMilan) {
      schema.sameAs = ["https://www.unimi.it/"];
    } else if (websiteUrl) {
      schema.sameAs = websiteUrl;
    }

    return schema;
  })();

  // Milan-only FAQPage: generated from the same visible milanFaqs data
  // rendered below — no schema-only questions or answers.
  const milanFaqSchema =
    isUniversityOfMilan && milanFaqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${canonical}#faq`,
          about: { "@id": `${canonical}#university` },
          mainEntity: milanFaqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  // Milan-only ItemList: mirrors the course cards actually rendered
  // below (same courses array, absolute canonical URLs, no invented
  // tuition or admission properties).
  const milanCourseItems = isUniversityOfMilan
    ? courses.filter((course) => course?.slug && (course.name || course.title))
    : [];
  const milanCourseItemListSchema =
    isUniversityOfMilan && milanCourseItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "@id": `${canonical}#courses`,
          about: { "@id": `${canonical}#university` },
          name: "University of Milan courses",
          numberOfItems: milanCourseItems.length,
          itemListElement: milanCourseItems.map((course, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${SITE_URL}/courses/${university.slug}/${course.slug}`,
            name: course.name || course.title,
          })),
        }
      : null;

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={universitySchema} />
      {milanFaqSchema && <JsonLd data={milanFaqSchema} />}
      {milanCourseItemListSchema && (
        <JsonLd data={milanCourseItemListSchema} />
      )}
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
                {isUniversityOfMilan
                  ? "University of Milan (La Statale)"
                  : isGenoa
                    ? "University of Genoa (UniGe)"
                    : university.name}
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
              {isUniversityOfMilan && (
                <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">
                  The Università degli Studi di Milano, commonly called
                  La Statale, is a public university in Milan,
                  Lombardy, Italy, founded in 1924. Its historic seat
                  is at Via Festa del Perdono 7, with scientific
                  faculties in the Città Studi district, and it is a
                  member of the League of European Research
                  Universities (LERU) and the 4EU+ European University
                  Alliance. The university states it offers over 40
                  English-taught programmes; its 2026/27 first
                  instalment is €146, with deadlines and scholarships
                  detailed in the sections below.
                </p>
              )}

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
                  <p className="mt-4">
                    QS World University Rankings 2026: #=276. See the{" "}
                    <a
                      href="https://www.topuniversities.com/universities/university-milan"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      QS profile for the University of Milan
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
                <Section title="University of Milan vs other universities in Milan">
                  <p>
                    University of Milan (La Statale) is different from
                    Politecnico di Milano and the University of
                    Milano-Bicocca. All three are separate universities
                    in Milan.
                  </p>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[480px] text-left text-sm">
                      <thead>
                        <tr className="border-y border-border bg-background">
                          <th
                            scope="col"
                            className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-foreground"
                          >
                            University
                          </th>
                          <th
                            scope="col"
                            className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-foreground"
                          >
                            Main identity
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            University of Milan (La Statale)
                          </td>
                          <td className="px-5 py-4">
                            Broad public university with programmes
                            across multiple academic areas
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            <Link
                              href="/universities/polytechnic-university-of-milan"
                              className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                            >
                              Politecnico di Milano
                            </Link>
                          </td>
                          <td className="px-5 py-4">
                            Polytechnic university focused on
                            engineering, architecture and design
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            <Link
                              href="/universities"
                              className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                            >
                              University of Milano-Bicocca
                            </Link>
                          </td>
                          <td className="px-5 py-4">
                            Public university with its own separate
                            programmes and campuses
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4">
                    If you are searching specifically for University of
                    Milan / La Statale, use the programmes and
                    application information on this page rather than
                    results for Politecnico di Milano or
                    Milano-Bicocca.
                  </p>
                </Section>
              )}

              {isUniversityOfMilan && (
                <Section title="English-taught programmes at the University of Milan">
                  <p>
                    The University of Milan states that it offers over 40
                    English-taught Bachelor&apos;s, Master&apos;s and PhD
                    programmes, together with more than 20 double-degree
                    programmes. Our database currently lists{" "}
                    {totals.courses ?? courses.length} programmes; this is
                    a subset and not the University&apos;s official total
                    — spanning bachelor&apos;s degrees, single-cycle
                    master&apos;s degrees such as{" "}
                    <Link
                      href="/medicine-in-italy"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Medicine and Surgery
                    </Link>
                    , and master&apos;s degrees across science, economics,
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

              {isGenoa && (
                <Section title="About the University of Genoa (UniGe)">
                  <p>
                    The University of Genoa (Università degli Studi di
                    Genova, commonly called UniGe) is a public university
                    in Genoa, Italy, founded in 1481. Its main seat is at
                    Via Balbi 5 in the historic centre of Genoa.
                  </p>
                  <p className="mt-4">
                    The university states it has 5 Schools, 22 Departments
                    and 15 Libraries, with more than 36,000 students
                    including more than 3,000 international students of
                    110 nationalities. It describes four campuses across
                    Liguria: Genoa, Imperia, Savona and La Spezia. For
                    authoritative history and institutional detail, see
                    the{" "}
                    <a
                      href="https://unige.it/en/unige"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      university&apos;s official about page
                    </a>{" "}
                    and the{" "}
                    <a
                      href="https://unige.it/en/welcome/perche-studiare-in-unige"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official why-study-at-UniGe page
                    </a>
                    .
                  </p>
                </Section>
              )}

              {isGenoa && (
                <Section title="Schools, Departments and Campuses">
                  <p>
                    Teaching, research and technology transfer at UniGe
                    are organised through 5 Schools and 22 Departments
                    across 11 subject areas, supported by research,
                    service and strategic centres and the University
                    Library System.
                  </p>
                  <p className="mt-4">
                    The main and historic seat is Genoa. The university
                    describes Imperia as a decentralised seat, alongside
                    the Savona University Campus and the La Spezia
                    university pole, extending its presence across
                    Liguria. Details are published on the{" "}
                    <a
                      href="https://rubrica.unige.it/strutture/scuole-dipartimenti"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official schools and departments directory
                    </a>
                    , the{" "}
                    <a
                      href="https://unige.it/en/poli/imperia"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official Imperia campus page
                    </a>
                    , the{" "}
                    <a
                      href="https://unige.it/en/poli/savona"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official Savona campus page
                    </a>{" "}
                    and the{" "}
                    <a
                      href="https://unige.it/en/poli/laspezia"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official La Spezia campus page
                    </a>
                    .
                  </p>
                </Section>
              )}

              {isGenoa && (
                <Section title="English-taught programmes at the University of Genoa">
                  <p>
                    UniGe states it offers 15 degree courses in English
                    among more than 130 degree courses. This page lists{" "}
                    {totals.courses ?? courses.length} English-taught
                    courses currently in our database — 2
                    Bachelor&apos;s degrees and 15 Master&apos;s degrees
                    — spanning engineering and robotics, maritime science
                    and yacht design, biotechnology and materials
                    science, architecture and design, and economics and
                    data science. This count reflects our database, not
                    the university&apos;s official total.
                  </p>
                  <p className="mt-4">
                    For bachelor&apos;s applicants: our database
                    currently includes 2 bachelor-level entries for
                    UniGe, including Computer Engineering at the Imperia
                    campus — so not every bachelor entry is based in
                    Genoa city.
                  </p>
                  <p className="mt-4">
                    Browse the course cards below, compare with other{" "}
                    <Link
                      href="/english-taught-courses-in-italy"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      English-taught courses in Italy
                    </Link>{" "}
                    or{" "}
                    <Link
                      href="/courses"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      browse all courses in Italy
                    </Link>
                    . The full official offer, including programmes
                    taught in Italian, is on the{" "}
                    <a
                      href="https://corsi.unige.it/en/corsi/lingua/en"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      university&apos;s official English-language course
                      catalogue
                    </a>
                    .
                  </p>
                </Section>
              )}

              {isTurin && (
                <Section title="About the University of Turin (UniTo)">
                  <p>
                    The University of Turin (Università degli Studi di
                    Torino, commonly called UniTo) is a public
                    university in Turin, Italy, founded in 1404. Its
                    main seat is at Via Verdi 8 in Turin.
                  </p>
                  <p className="mt-4">
                    The university states it hosts around 83,000
                    students across about 170 degree programmes, with
                    27 Departments, 6 Schools and 22 Libraries, and
                    around 4,200 international students. For
                    authoritative history and institutional detail, see
                    the{" "}
                    <a
                      href="https://en.unito.it/university/about-us/short-history"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      university&apos;s official history page
                    </a>{" "}
                    and the{" "}
                    <a
                      href="https://en.unito.it/university/about-us"
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

              {isTurin && (
                <Section title="Schools, Departments and Campuses">
                  <p>
                    Teaching and research at UniTo are organised through
                    27 Departments grouped into 6 Schools: Agriculture
                    and Veterinary Medicine; Human Sciences; Law,
                    Politics and Social-Economic Sciences; Management
                    and Economics; Medicine; and Science of Nature.
                  </p>
                  <p className="mt-4">
                    The university describes itself as a
                    city-within-a-city, with around 120 buildings
                    including the historic Rettorato in Via Verdi,
                    Palazzo Nuovo, the Campus Luigi Einaudi, the
                    Molinette medicine pole, the Grugliasco campus and
                    the Savigliano location alongside extra-metropolitan
                    seats. Details are published on the{" "}
                    <a
                      href="https://en.unito.it/university/organization-and-locations/schools"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official schools page
                    </a>{" "}
                    and the{" "}
                    <a
                      href="https://en.unito.it/university/organization-and-locations/departments"
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

              {isTurin && (
                <Section title="English-taught programmes at the University of Turin">
                  <p>
                    For 2026-27 the university lists 3 undergraduate
                    programmes, 13 postgraduate programmes and 5
                    curricula taught in English, alongside the 6-year
                    Medicine and Surgery programme taught in English.
                    Our course database currently lists 33 Turin course
                    records; this should not be interpreted as the
                    university&apos;s official total of English-taught
                    programmes.
                  </p>
                  <p className="mt-4">
                    Browse the course cards below, compare with other{" "}
                    <Link
                      href="/english-taught-courses-in-italy"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      English-taught courses in Italy
                    </Link>{" "}
                    or{" "}
                    <Link
                      href="/courses"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      browse all courses in Italy
                    </Link>
                    . The full official offer, including programmes
                    taught in Italian, is on the{" "}
                    <a
                      href="https://en.unito.it/studying-unito/programs/degree-programs/degree-programs-english"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      university&apos;s official English programme
                      catalogue
                    </a>
                    .
                  </p>
                </Section>
              )}

              {isTurin && (
                <Section title="Bachelor's and Master's study options">
                  <p>
                    Undergraduate paths at UniTo include the three
                    English-taught bachelor&apos;s degrees alongside a
                    wide Italian-taught offer with free or programmed
                    access. Admission to free-admission undergraduate
                    courses runs through the TOLC orientation test,
                    which UniTo delivers remotely as TOLC@CASA, while
                    Business &amp; Management additionally uses the SAT
                    before enrolment.
                  </p>
                  <p className="mt-4">
                    Postgraduate paths span the English-taught
                    master&apos;s degrees and the 6-year Medicine and
                    Surgery programme. Master&apos;s admission is based
                    on curricular requirements and, where the programme
                    sets one, an assessment or interview, with B2-level
                    English proof or a medium-of-instruction document
                    depending on the programme. Always verify the
                    current programme call before applying.
                  </p>
                </Section>
              )}

              {isEasternPiedmont && (
                <Section title="About the University of Eastern Piedmont (UPO)">
                  <p>
                    The University of Eastern Piedmont, officially the
                    Università degli Studi del Piemonte Orientale
                    “Amedeo Avogadro” (UPO), is a public university
                    founded on 30 July 1998 after its separation from
                    the University of Turin. It is named in honour of
                    the Piedmontese scientist Amedeo Avogadro, who
                    taught in Vercelli.
                  </p>
                  <p className="mt-4">
                    UPO was founded with a polycentric vision: instead
                    of a single concentrated seat, it is spread across
                    three city-campuses — Alessandria, Novara and
                    Vercelli — with additional teaching sites elsewhere
                    in Piedmont. For authoritative history and
                    institutional detail, see the{" "}
                    <a
                      href="https://www.uniupo.it/en/about-upo/about-us"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      university&apos;s official about page
                    </a>
                    .
                  </p>
                </Section>
              )}

              {isEasternPiedmont && (
                <Section title="Departments and Campuses">
                  <p>
                    Teaching and research at UPO are organised through
                    its departments: Law and Political, Economic and
                    Social Sciences (DIGSPES); Science and Technological
                    Innovation (DISIT); Pharmaceutical Sciences (DSF);
                    Studies for Economics and Business (DISEI);
                    Translational Medicine (DIMET) and Health Sciences
                    (DISS), whose teaching activities are coordinated by
                    the School of Medicine; Humanities (DISUM); and
                    Sustainable Development and Ecological Transition
                    (DISSTE).
                  </p>
                  <p className="mt-4">
                    The three main city-campuses are Alessandria,
                    Novara — the largest — and Vercelli, which hosts
                    the Rectorate, with further teaching activities in
                    cities including Alba, Asti, Fossano, Biella and
                    Verbania. Details are published on the{" "}
                    <a
                      href="https://www.uniupo.it/en/about-upo/our-structure/departments"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official departments page
                    </a>{" "}
                    and the{" "}
                    <a
                      href="https://www.uniupo.it/en/about-upo/where-we-are"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official where-we-are page
                    </a>
                    .
                  </p>
                </Section>
              )}

              {isEasternPiedmont && (
                <Section title="English-taught programmes at UPO">
                  <p>
                    UPO&apos;s verified entirely-in-English offering
                    covers both undergraduate and postgraduate level.
                    At bachelor&apos;s level, Management for
                    Sustainability is a 3-year L-18 degree taught in
                    English in blended mode, with open admission
                    subject to a non-selective initial assessment and
                    B2-level English. At master&apos;s level, Food,
                    Health and Environment (Vercelli), Medical
                    Biotechnologies (Novara), Management and Finance
                    (Novara), and Disaster and Health Crisis Management
                    (LM-81, Vercelli, blended with on-campus sessions
                    and B2-level English) are delivered entirely in
                    English.
                  </p>
                  <p className="mt-4">
                    A note on names: UPO&apos;s official source calls
                    the bachelor&apos;s programme “Management for
                    Sustainability”. Where our course card below reads
                    “Management for One Sustainability”, treat it as
                    the same English-taught management-and-sustainability
                    pathway and confirm the exact official title on the
                    programme page before applying.
                  </p>
                  <p className="mt-4">
                    The university&apos;s official overview reports a
                    broader English-taught offer beyond any single
                    page, so the {totals.courses ?? courses.length}{" "}
                    course cards below reflect the English-taught
                    courses currently in our database — not the
                    university&apos;s complete official catalogue.
                    Browse the cards, compare with other{" "}
                    <Link
                      href="/english-taught-courses-in-italy"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      English-taught courses in Italy
                    </Link>{" "}
                    or{" "}
                    <Link
                      href="/courses"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      browse all courses in Italy
                    </Link>
                    . The full official offer is on the{" "}
                    <a
                      href="https://www.uniupo.it/en/international/students/you-want-come-upo/what-you-can-study/what-you-can-study-upo"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      university&apos;s official what-you-can-study page
                    </a>
                    .
                  </p>
                </Section>
              )}

              {isEasternPiedmont && (
                <Section title="Bachelor's and Master's study options">
                  <p>
                    UPO&apos;s bachelor&apos;s degrees are mainly
                    taught in Italian, with some units delivered in
                    English, while its master&apos;s degrees are also
                    mainly taught in Italian with some English units —
                    alongside the fully English-taught paths described
                    above. Single-cycle master&apos;s degrees follow
                    the same mainly-Italian pattern.
                  </p>
                  <p className="mt-4">
                    If you are targeting an English-taught path, start
                    from the English-taught programmes section and the
                    course cards below, then verify the teaching
                    language and admission rules on the current
                    official programme page before applying.
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

              {isGenoa && (
                <Section title="How to apply to the University of Genoa">
                  <h3 className="font-bold text-foreground">
                    Who must use UniGeApply
                  </h3>
                  <p className="mt-2">
                    Students who access UniGe with a non-Italian
                    qualification start with UniGeApply, the
                    university&apos;s international admissions portal
                    for qualification assessment. This covers foreign
                    titles obtained abroad or in Italy, as well as
                    Italian diplomas obtained abroad, with limited
                    exemptions published by the university.
                  </p>
                  <h3 className="mt-5 font-bold text-foreground">
                    Fall versus spring selections
                  </h3>
                  <p className="mt-2">
                    UniGe runs two selections per academic year: a fall
                    session reserved for students who need a visa, and a
                    spring session for Italian, EU and non-EU students
                    already regularly resident in Italy. Programmes with
                    scheduled access may set their own earlier closures
                    linked to entrance-test registration, so always
                    check the current UniGeApply call.
                  </p>
                  <h3 className="mt-5 font-bold text-foreground">
                    Universitaly pre-enrolment for visa applicants
                  </h3>
                  <p className="mt-2">
                    Non-EU students residing abroad who need a study
                    visa additionally complete pre-enrolment on the
                    Universitaly portal after UniGeApply assessment, and
                    use it for the visa request. Our{" "}
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
                    Documents are handled in phases across UniGeApply,
                    Universitaly where applicable, and final enrolment:
                    identity and stay documents plus title documents on
                    the foreign qualification. Depending on the
                    qualification and programme, recognised proof such
                    as CIMEA comparability or a Declaration of Value
                    may apply — neither is universally mandatory for
                    every applicant. UniGe guidance states that
                    knowledge of Italian is not required for courses
                    taught in English. Verify the current programme
                    call, the{" "}
                    <a
                      href="https://unige.it/en/international-enrolment"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official international enrolment page
                    </a>{" "}
                    and the{" "}
                    <a
                      href="https://unige.it/en/internazionale/iscrizioni-internazionali/unigeapply"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official UniGeApply page
                    </a>{" "}
                    before applying.
                  </p>
                </Section>
              )}

              {isGenoa && (
                <Section title="University of Genoa Application Deadlines 2026">
                  <p>
                    UniGe runs two UniGeApply selections per academic
                    year with different applicant categories. The dates
                    below are the verified 2026 admission milestones;
                    programme-specific calls can have earlier or
                    different deadlines, so always check the official
                    call for the exact programme.
                  </p>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left text-sm">
                      <thead>
                        <tr className="border-y border-border bg-background">
                          <th
                            scope="col"
                            className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-foreground"
                          >
                            Milestone
                          </th>
                          <th
                            scope="col"
                            className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-foreground"
                          >
                            2026 date
                          </th>
                          <th
                            scope="col"
                            className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-foreground"
                          >
                            Who / what
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            Fall selection (UniGeApply, visa applicants)
                          </td>
                          <td className="px-5 py-4">
                            26 November 2025 – 20 March 2026 (CLOSED)
                          </td>
                          <td className="px-5 py-4">
                            Non-EU students residing abroad who require
                            a visa
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            Spring selection, Master&apos;s (UniGeApply,
                            residents)
                          </td>
                          <td className="px-5 py-4">
                            9 April – 28 August 2026
                          </td>
                          <td className="px-5 py-4">
                            Italian, EU and non-EU students already
                            regularly resident in Italy
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            Spring selection, Bachelor&apos;s and
                            single-cycle (UniGeApply, residents)
                          </td>
                          <td className="px-5 py-4">
                            9 April – 25 September 2026
                          </td>
                          <td className="px-5 py-4">
                            Italian, EU and non-EU students already
                            regularly resident in Italy
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <h3 className="mt-6 font-bold text-foreground">
                    Early closures for selected English-taught
                    programmes
                  </h3>
                  <p className="mt-2">
                    Some English-taught programmes closed their fall
                    selection early: Medical-Pharmaceutical
                    Biotechnology on 13 February 2026, Maritime Science
                    and Technology on 18 February 2026, and the
                    bachelor&apos;s in Computer Engineering on 8 March
                    2026. These dates applied to the 2026 fall
                    selection only.
                  </p>
                  <h3 className="mt-6 font-bold text-foreground">
                    Application conditions
                  </h3>
                  <p className="mt-2">
                    Applicants can request evaluation for a maximum of
                    2 courses on UniGeApply. English-taught programmes
                    require B2 English or an accepted medium-of-
                    instruction document where applicable, and CEnT,
                    TOLC, SAT or ACT evidence may apply by programme
                    with no universal minimum score established here.
                    Qualifying degrees should generally be completed by
                    15 August 2026. See our{" "}
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
                    alongside the{" "}
                    <a
                      href="https://unige.it/en/internazionale/iscrizioni-internazionali/unigeapply"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official UniGeApply page
                    </a>{" "}
                    and the{" "}
                    <a
                      href="https://unige.it/en/international-enrolment"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official international enrolment page
                    </a>
                    .
                  </p>
                </Section>
              )}

              {isGenoa && (
                <Section title="University of Genoa Tuition Fees">
                  <p>
                    The student contribution consists of stamp duty, a
                    regional tax and a university contribution, paid in
                    three instalments. The figures below are those shown
                    on the verified official UniGe fee source.
                  </p>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[480px] text-left text-sm">
                      <thead>
                        <tr className="border-y border-border bg-background">
                          <th
                            scope="col"
                            className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-foreground"
                          >
                            Item
                          </th>
                          <th
                            scope="col"
                            className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-foreground"
                          >
                            Verified information
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            First instalment on official fee page
                          </td>
                          <td className="px-5 py-4">
                            €136 (€16 stamp duty + €120 regional tax
                            minimum)
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            ALISEO route
                          </td>
                          <td className="px-5 py-4">
                            €16 initial payment under the stated route
                            for students applying through ALISEO
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            Payment structure
                          </td>
                          <td className="px-5 py-4">3 instalments</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            Income-based calculation
                          </td>
                          <td className="px-5 py-4">
                            ISEE-U / ISEE-U Parificato and contribution
                            class/group
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            2026/27 maximum contribution
                          </td>
                          <td className="px-5 py-4">
                            Verify against the current UniGe regulation
                            before publishing — 2026/27 maxima are not
                            stated here
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4">
                    Do not read €136 as a total annual tuition fee — it
                    is the verified first-instalment figure only. See
                    the{" "}
                    <a
                      href="https://unige.it/en/tasse-e-benefici/calcolo-contributo-universitario"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official UniGe fee calculation page
                    </a>{" "}
                    and our{" "}
                    <Link
                      href="/cost-of-studying-in-italy"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      cost of studying in Italy guide
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/italy-scholarships"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Italy scholarships guidance
                    </Link>
                    .
                  </p>
                </Section>
              )}

              {isGenoa && (
                <Section title="Tuition fees and scholarships">
                  <p>
                    The student contribution consists of stamp duty
                    (€16), regional tax (minimum €120) and a university
                    contribution based on ISEE-U for university
                    benefits. It is paid in three instalments via
                    pagoPA. Students whose household lives abroad or
                    holds assets abroad use ISEE-U Parificato. Students
                    who apply for an ALISEO regional study grant follow
                    the university&apos;s specific initial-payment
                    treatment for grant applicants.
                  </p>
                  <p className="mt-4">
                    Support includes ALISEO regional study grants
                    alongside UniGe scholarships, incentives and awards,
                    as well as MAECI government opportunities and
                    Invest Your Talent in Italy where eligible. Calls,
                    eligibility and amounts change every academic year,
                    so always verify the current regulation. See our{" "}
                    <Link
                      href="/italy-scholarships"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Italy scholarships guidance
                    </Link>
                    , our{" "}
                    <Link
                      href="/cost-of-studying-in-italy"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      cost of studying in Italy guidance
                    </Link>{" "}
                    and the university&apos;s{" "}
                    <a
                      href="https://unige.it/en/fees-and-benefits"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official tuition fees and benefits page
                    </a>
                    .
                  </p>
                </Section>
              )}

              {isGenoa && (
                <Section title="International student essentials">
                  <p>
                    The Welcome Office supports international students
                    with accommodation search, residence permit and tax
                    code assistance, and information on health care,
                    bank accounts, bus passes and university canteens.
                    The university organises Italian language courses
                    for foreign enrolled students and supports incoming
                    Erasmus+ and other mobility periods.
                  </p>
                  <p className="mt-4">
                    UniGe is also a partner in the Ulysseus European
                    University alliance. Our{" "}
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

              {isGenoa && (
                <Section title="Applying to the University of Genoa from India">
                  <p>
                    Applicants applying from India follow the non-EU
                    resident-abroad pathway where a visa applies: check
                    the English-taught programme and its requirements,
                    complete qualification assessment on UniGeApply
                    where required, follow the university selection and
                    admission steps, then complete pre-enrolment on the
                    Universitaly portal where applicable and proceed
                    with the visa process and arrival formalities.
                  </p>
                  <p className="mt-4">
                    Prepare identity documents, title documents on the
                    foreign qualification, and accepted proof of English
                    proficiency for English-taught programmes. CIMEA
                    comparability or a Declaration of Value may apply
                    depending on the qualification and programme — not
                    for every applicant. Admission and visa outcomes
                    are never guaranteed. Verify the current programme
                    call and official enrolment pages before applying —
                    see the{" "}
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

              {isGenoa && genoaFaqs.length > 0 && (
                <Section title="Frequently asked questions about the University of Genoa">
                  <div className="space-y-3">
                    {genoaFaqs.map((faq) => (
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

              {isTurin && (
                <Section title="How to apply to the University of Turin">
                  <h3 className="font-bold text-foreground">
                    Who needs Apply@UniTo
                  </h3>
                  <p className="mt-2">
                    All students who access UniTo with a non-Italian
                    qualification submit their application on
                    Apply@UniTo, the university&apos;s international
                    applications portal. The application carries a €60
                    fee and lets each candidate choose up to two
                    programmes, subject to the exemptions the
                    university publishes.
                  </p>
                  <h3 className="mt-5 font-bold text-foreground">
                    Undergraduate application
                  </h3>
                  <p className="mt-2">
                    Free-admission undergraduate courses verify minimum
                    preparation through the TOLC test, which UniTo
                    delivers remotely as TOLC@CASA and which can also
                    be sat at other universities. Business &amp;
                    Management additionally requires the SAT before
                    enrolment, while programmed-access courses run
                    their own entrance tests and rankings.
                  </p>
                  <h3 className="mt-5 font-bold text-foreground">
                    Postgraduate application
                  </h3>
                  <p className="mt-2">
                    Postgraduate applications on Apply@UniTo are
                    assessed against curricular requirements and, where
                    the programme sets one, an interview or assessment.
                    Calls are published per intake with separate tracks
                    for visa applicants and for residents, so the
                    current call is the only authoritative source for
                    steps and dates. Our{" "}
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
                    Enrolment after admission
                  </h3>
                  <p className="mt-2">
                    Admitted students complete enrolment through
                    MyUniTo, creating a prospective-student account and
                    following the procedure for their course type. The
                    International Students Office checks foreign
                    qualifications before releasing payment
                    instructions, so verify the current enrolment page,
                    the{" "}
                    <a
                      href="https://apply.unito.it"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official Apply@UniTo portal
                    </a>{" "}
                    and the{" "}
                    <a
                      href="https://en.unito.it/studying-unito/international-degree-seeking-students/application-international-students"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official international application page
                    </a>{" "}
                    before applying.
                  </p>
                </Section>
              )}

              {isTurin && (
                <Section title="International and non-EU admission">
                  <p>
                    Non-EU students residing abroad who need a study
                    visa additionally submit a pre-enrolment
                    application on the Universitaly portal — one
                    programme only — so the university can validate it
                    towards the visa request. University admission and
                    the visa process are separate procedures with
                    separate requirements.
                  </p>
                  <p className="mt-4">
                    After entry, plan for arrival formalities: an
                    official Italian tax code, enrolment completion,
                    and a residence permit request with the
                    documentation the university lists. Documents on the
                    foreign qualification may need recognised proof
                    such as CIMEA comparability or a Declaration of
                    Value depending on the qualification and programme
                    — neither is universally mandatory. The B2 Italian
                    certificate applies to the relevant Italian-taught
                    free-admission routes, not as a blanket requirement
                    for English-taught programmes. See our{" "}
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
                    </Link>
                    .
                  </p>
                </Section>
              )}

              {isTurin && (
                <Section title="Tuition fees and scholarships">
                  <p>
                    Tuition is paid in four instalments. The first
                    payment, due at matriculation or enrolment, covers
                    the €16 stamp duty and the €140 regional tax for
                    the right to university study. The remaining
                    university contribution depends on ISEE University
                    for eligible students or, for students resident
                    abroad, on the GDP-PPP country-band mechanism, with
                    a simulator and EDISU treatment set by the current
                    regulation.
                  </p>
                  <p className="mt-4">
                    Support includes EDISU Piemonte regional grants
                    alongside Talent 4 UniTo scholarships for English
                    open-access postgraduate entrants and, where
                    eligible, UniTo for Students at Risk, UNICORE or
                    MAECI opportunities. Regulations, eligibility and
                    calls change every academic year, so always verify
                    the current official pages. See our{" "}
                    <Link
                      href="/italy-scholarships"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Italy scholarships guidance
                    </Link>
                    , our{" "}
                    <Link
                      href="/cost-of-studying-in-italy"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      cost of studying in Italy guidance
                    </Link>{" "}
                    and the university&apos;s{" "}
                    <a
                      href="https://en.unito.it/studying-unito/tuition-fees"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official tuition fees page
                    </a>
                    .
                  </p>
                </Section>
              )}

              {isTurin && (
                <Section title="International student essentials">
                  <p>
                    The International Students Office and the Welcome
                    Office support international students with tax code
                    requests, residence permit assistance, the Buddy
                    Project and accommodation orientation through Cerco
                    Alloggio, plus counselling via Passi@UniTo. The
                    university also supports Italian language learning
                    for foreign enrolled students.
                  </p>
                  <p className="mt-4">
                    UniTo coordinates the UNITA European university
                    alliance and runs over 1,700 Erasmus+ mobility
                    agreements alongside 40-plus double or joint degree
                    programmes. Our{" "}
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

              {isTurin && (
                <Section title="Applying to the University of Turin from India">
                  <p>
                    Applicants applying from India follow the non-EU
                    resident-abroad pathway where a visa applies:
                    choose a verified programme, complete assessment on
                    Apply@UniTo, pass the programme-specific selection
                    such as TOLC, SAT or interview steps, secure
                    admission, then complete pre-enrolment on the
                    Universitaly portal where applicable and proceed
                    with the visa process and arrival and residence
                    formalities.
                  </p>
                  <p className="mt-4">
                    Prepare identity documents, title documents on the
                    foreign qualification, and accepted proof of English
                    proficiency where the programme requires it —
                    requirements depend on the programme. CIMEA
                    comparability or a Declaration of Value may apply
                    depending on the qualification and programme.
                    Admission and visa outcomes are not guaranteed.
                    Verify the current programme call and official
                    enrolment pages before applying — see the{" "}
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

              {isEasternPiedmont && (
                <Section title="How to apply to UPO">
                  <h3 className="font-bold text-foreground">
                    EU versus non-EU applicants
                  </h3>
                  <p className="mt-2">
                    Admission procedures vary by citizenship and
                    residency. Non-EU students residing abroad who need
                    a study visa complete pre-enrolment on the
                    Universitaly portal: UPO reviews and validates the
                    application then forwards it, with admission
                    information, to the embassy or consulate the student
                    selected for the visa request. University admission
                    and the visa decision remain separate procedures.
                  </p>
                  <h3 className="mt-5 font-bold text-foreground">
                    Programme-level procedures always apply
                  </h3>
                  <p className="mt-2">
                    Master&apos;s programmes set additional procedures
                    beyond Universitaly, published on each programme
                    page. Any application that does not follow the
                    programme&apos;s stated procedure cannot be
                    considered, so the current programme page is the
                    only authoritative source for steps and
                    requirements. Our{" "}
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
                    Documents and language at a glance
                  </h3>
                  <p className="mt-2">
                    Depending on the qualification and programme,
                    foreign-title documents may require a Declaration
                    of Value or, alternatively, CIMEA comparability and
                    verification certificates, plus certified
                    translation and any academic-eligibility document
                    required in the country of origin. Language proof
                    at B2 level follows the programme&apos;s teaching
                    language — English certification or
                    medium-of-instruction evidence for English-taught
                    paths. UPO charges no additional fee for
                    qualification evaluation. Verify the current
                    programme page, the{" "}
                    <a
                      href="https://www.uniupo.it/en/international/degree-seeking"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official degree-seeking page
                    </a>{" "}
                    and the{" "}
                    <a
                      href="https://www.uniupo.it/en/international/degree-seeking/you-want-come-upo/how-enrol-upo/enrol-universitaly"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official enrol-via-Universitaly page
                    </a>{" "}
                    before applying.
                  </p>
                </Section>
              )}

              {isEasternPiedmont && (
                <Section title="Tuition fees and scholarships">
                  <p>
                    UPO charges an annual all-inclusive fee (COA) paid
                    in instalments. The amount depends on the
                    department, the full-time or part-time study regime,
                    merit from the second year onward, and the
                    household&apos;s economic position measured through
                    ISEE for the right to higher education — or ISEE
                    Parificato, issued via an authorised CAF, for
                    students whose income or household sits abroad. A
                    No-Tax Area exemption and a fee simulator are
                    provided under the current rules.
                  </p>
                  <p className="mt-4">
                    Scholarships, accommodation places and canteens are
                    managed by the regional agency EDISU Piemonte and
                    need a separate application. Amounts, thresholds
                    and calls change every academic year, so always
                    verify the current regulation. See our{" "}
                    <Link
                      href="/italy-scholarships"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Italy scholarships guidance
                    </Link>
                    , our{" "}
                    <Link
                      href="/cost-of-studying-in-italy"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      cost of studying in Italy guidance
                    </Link>{" "}
                    and the university&apos;s{" "}
                    <a
                      href="https://www.uniupo.it/en/studentinfo/fees-and-taxes"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official fees and taxes page
                    </a>
                    .
                  </p>
                </Section>
              )}

              {isEasternPiedmont && (
                <Section title="International student essentials">
                  <p>
                    UPO supports international students through its
                    International Students Office, the CLUPO university
                    language centre for foreign-language learning and
                    certification support, EDISU services for
                    accommodation and canteens, and Erasmus+
                    international mobility alongside programme-level
                    internships and thesis projects abroad.
                  </p>
                  <p className="mt-4">
                    Plan for the standard essentials: validated
                    admission, Universitaly pre-enrolment and the visa
                    request where applicable, an Italian tax code, and
                    enrolment completion with verified foreign-title
                    documents. Our{" "}
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

              {isEasternPiedmont && (
                <Section title="Applying to UPO from India">
                  <p>
                    Applicants applying from India follow the non-EU
                    resident-abroad pathway where a visa applies:
                    identify the degree programme and its teaching
                    language, check the programme-specific admission
                    requirements, prepare foreign-qualification
                    documents with recognised proof where the programme
                    requires it, and use the UPO plus Universitaly
                    process for validation toward the visa request.
                  </p>
                  <p className="mt-4">
                    UPO sets no India-specific admission rules — the
                    same programme requirements apply. Verify the
                    current programme page and official enrolment pages
                    before applying — see the{" "}
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
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/italy-student-visa"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Italy student visa guidance
                    </Link>
                    .
                  </p>
                </Section>
              )}

              {isTurin && turinFaqs.length > 0 && (
                <Section title="Frequently asked questions about the University of Turin">
                  <div className="space-y-3">
                    {turinFaqs.map((faq) => (
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

              {isEasternPiedmont && easternPiedmontFaqs.length > 0 && (
                <Section title="Frequently asked questions about the University of Eastern Piedmont">
                  <div className="space-y-3">
                    {easternPiedmontFaqs.map((faq) => (
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
                <Section title="University of Milan application deadlines 2026/27">
                  <p>
                    University of Milan deadlines vary by programme and
                    applicant category. The dates below are the main
                    2026/27 milestones verified from official University
                    of Milan admission and enrolment sources.
                  </p>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left text-sm">
                      <thead>
                        <tr className="border-y border-border bg-background">
                          <th
                            scope="col"
                            className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-foreground"
                          >
                            Milestone
                          </th>
                          <th
                            scope="col"
                            className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-foreground"
                          >
                            2026/27 date
                          </th>
                          <th
                            scope="col"
                            className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-foreground"
                          >
                            Who / what
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            Open-admission Master&apos;s applications open
                          </td>
                          <td className="px-5 py-4">
                            22 January 2026
                          </td>
                          <td className="px-5 py-4">
                            Open-admission Master&apos;s programmes
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            Non-EU admission deadline
                          </td>
                          <td className="px-5 py-4">30 April 2026</td>
                          <td className="px-5 py-4">
                            Non-EU applicants residing abroad who require
                            a visa
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            Enrolment window opens
                          </td>
                          <td className="px-5 py-4">5 May 2026</td>
                          <td className="px-5 py-4">
                            Students admitted through the relevant
                            programme process
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            Universitaly pre-enrolment deadline
                          </td>
                          <td className="px-5 py-4">31 July 2026</td>
                          <td className="px-5 py-4">
                            Non-EU students residing abroad
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            Foreign-qualification document completion
                          </td>
                          <td className="px-5 py-4">
                            30 November 2026
                          </td>
                          <td className="px-5 py-4">
                            International enrolments
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4">
                    Programme-specific calls can have different
                    application, test, ranking and enrolment dates.
                    Always check the official call for the exact
                    programme. See our{" "}
                    <Link
                      href="/italy-university-intakes"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Italy university intakes guide
                    </Link>
                    ,{" "}
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
                    </Link>
                    . Official sources:{" "}
                    <a
                      href="https://www.unimi.it/en/study/bachelor-and-master-study/degree-programme-enrolment/enrolment-masters-programme/open-admission-master-programmes"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      open-admission Master&apos;s programmes
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://www.unimi.it/en/international/coming-abroad/enrol-programme/international-enrolment-degree-programmes"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      international enrolment
                    </a>
                    .
                  </p>
                  <h3 className="mt-6 font-bold text-foreground">
                    Medicine and Dentistry: programme-specific timelines
                  </h3>
                  <p className="mt-2">
                    These Medicine timelines are programme-specific and
                    should not be treated as general university
                    deadlines. English-taught International Medical
                    School (IMS): 60 EU/equivalent + 15 non-EU abroad
                    places. Universitaly registration: 26 August–9
                    September 2026, 15:00. IMAT: 29 September 2026 at
                    13:30. Italian-taught Medicine, Dental Medicine and
                    Veterinary Medicine follow the 2026/27 open-semester
                    process rather than the English IMS IMAT route:
                    open-semester Universitaly registration 13 July–3
                    August 2026, 18:00; University of Milan enrolment 15
                    July–6 August 2026, 14:00; exams 10 December 2026
                    and 11 January 2027. See our{" "}
                    <Link
                      href="/medicine-in-italy"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Medicine in Italy guide
                    </Link>
                    , the{" "}
                    <a
                      href="https://apps.unimi.it/files/bandi/call-2027-1-medicine-and-surgery---international-medical-school-(classe-lm-41-r).pdf?31-AUG-26="
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official IMS Medicine call
                    </a>{" "}
                    and the{" "}
                    <a
                      href="https://www.unimi.it/sites/default/files/2026-08/Avviso%20Semestre%20aperto%20Med%20Odonto%20Veterinaria%2026_27%20rev2_EN.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official open-semester notice
                    </a>
                    .
                  </p>
                </Section>
              )}

              {isUniversityOfMilan && (
                <Section title="Tuition fees at the University of Milan 2026/27">
                  <p>
                    For 2026/27, University of Milan students pay a first
                    instalment of €146 (€130 regional tax + €16 stamp
                    duty). The second instalment is calculated according
                    to the student&apos;s ISEE University, enrolment
                    status and tuition area; international students with
                    household income abroad may instead fall under
                    country-group rules.
                  </p>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left text-sm">
                      <thead>
                        <tr className="border-y border-border bg-background">
                          <th
                            scope="col"
                            className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-foreground"
                          >
                            Fee component
                          </th>
                          <th
                            scope="col"
                            className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-foreground"
                          >
                            2026/27
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            First instalment
                          </td>
                          <td className="px-5 py-4">€146</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            Regional tax component
                          </td>
                          <td className="px-5 py-4">€130</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            Stamp duty
                          </td>
                          <td className="px-5 py-4">€16</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            Area A maximum, on-track / 1-year off-track
                          </td>
                          <td className="px-5 py-4">€3,204</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            Area B maximum, on-track / 1-year off-track
                          </td>
                          <td className="px-5 py-4">€4,101.12</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            Area A maximum, 2+ years off-track
                          </td>
                          <td className="px-5 py-4">€4,806</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            Area B maximum, 2+ years off-track
                          </td>
                          <td className="px-5 py-4">€6,151.68</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4">
                    No-tax area: for on-track students and students up
                    to one year off-track, the second instalment can be
                    €0 when ISEE University is up to €30,000. Students
                    two or more years off-track have a €200 minimum
                    second instalment.
                  </p>
                  <p className="mt-4">
                    ISEE University should be requested by 10 October
                    2026. Late requests between 11 October and 31
                    December 2026 are subject to a €250 penalty; after
                    31 December the maximum fee may apply. First-year
                    students entering a biennial Master&apos;s programme
                    have a separate deadline exception. See the{" "}
                    <a
                      href="https://www.unimi.it/en/study/bachelor-and-master-study/fees-and-how-pay-them/isee-certification"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official ISEE certification page
                    </a>{" "}
                    and our{" "}
                    <Link
                      href="/cost-of-studying-in-italy"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      cost of studying in Italy guide
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/study-in-italy-data-guide"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      2026/27 data guide
                    </Link>
                    . Official fee regulation:{" "}
                    <a
                      href="https://www.unimi.it/sites/default/files/regolamenti/Regolamento%20tasse%20e%20contributi%202026_2027_EN.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      2026/27 fees regulation (PDF)
                    </a>
                    .
                  </p>
                  <h3 className="mt-6 font-bold text-foreground">
                    Fees for new international students with household
                    income abroad
                  </h3>
                  <p className="mt-2">
                    For new 2026/27 international students, the
                    University of Milan uses country groups for
                    second-instalment amounts.
                  </p>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[480px] text-left text-sm">
                      <thead>
                        <tr className="border-y border-border bg-background">
                          <th
                            scope="col"
                            className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-foreground"
                          >
                            Country group
                          </th>
                          <th
                            scope="col"
                            className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-foreground"
                          >
                            Area A
                          </th>
                          <th
                            scope="col"
                            className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-foreground"
                          >
                            Area B
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            Group A
                          </td>
                          <td className="px-5 py-4">€200</td>
                          <td className="px-5 py-4">€256</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            Group B
                          </td>
                          <td className="px-5 py-4">€910</td>
                          <td className="px-5 py-4">€1,164</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            Group C
                          </td>
                          <td className="px-5 py-4">€3,204</td>
                          <td className="px-5 py-4">€4,101.12</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4">
                    Regional tax by country group is €130 for Group A,
                    €160 for Group B and €190 for Group C.
                    Country-group classification is defined in Annex 2
                    of the University&apos;s 2026/27 fee regulation.
                    Students should verify the applicable group for
                    their country before estimating the fee. See the{" "}
                    <a
                      href="https://www.unimi.it/sites/default/files/regolamenti/Regolamento%20tasse%20e%20contributi%202026_2027_EN.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      official 2026/27 fee regulation (PDF)
                    </a>
                    .
                  </p>
                </Section>
              )}

              {isUniversityOfMilan && (
                <Section title="Scholarships at the University of Milan 2026/27">
                  <p>
                    International students can access the same
                    need-and-merit benefits as Italian students where
                    eligible. Amounts, eligibility and calls change every
                    academic year, so always verify the current official
                    call before applying.
                  </p>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left text-sm">
                      <thead>
                        <tr className="border-y border-border bg-background">
                          <th
                            scope="col"
                            className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-foreground"
                          >
                            Scholarship
                          </th>
                          <th
                            scope="col"
                            className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-foreground"
                          >
                            2026/27 verified information
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            DSU Lombardia
                          </td>
                          <td className="px-5 py-4">
                            Regional scholarship; international students
                            eligible subject to call requirements;
                            benefits vary by student status
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            University scholarships
                          </td>
                          <td className="px-5 py-4">
                            1,055 scholarships × €1,800
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            European Futures
                          </td>
                          <td className="px-5 py-4">
                            30 scholarships × €10,000; EU-country
                            residents entering eligible Master&apos;s
                            programmes
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4 font-semibold text-foreground">
                            MAECI
                          </td>
                          <td className="px-5 py-4">
                            2026/27 call closed 26 March 2026
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4">
                    2026/27 DSU benefits vary by student category; the
                    official call reports overall amounts ranging from
                    €2,143 to €8,248, with additional mobility support
                    under the call rules. DSU applications are due 30
                    September 2026, 23:59; students seeking
                    accommodation under the DSU call should note the 7
                    August 2026 date. See our{" "}
                    <Link
                      href="/italy-scholarships"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Italy scholarships guidance
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/living-in-italy-for-students"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      living in Italy guide
                    </Link>
                    . Official sources:{" "}
                    <a
                      href="https://www.unimi.it/en/study/financial-support/regional-scholarships"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      regional scholarships
                    </a>
                    ,{" "}
                    <a
                      href="https://www.unimi.it/en/study/financial-support/university-scholarships"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      university scholarships
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://www.unimi.it/en/study/financial-support/international-scholarships"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      international scholarships
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
                    </Link>
                    ,{" "}
                    <Link
                      href="/italy-student-visa"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Italy student visa guidance
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/living-in-italy-for-students"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      living in Italy guide
                    </Link>{" "}
                    cover these steps in more depth.
                  </p>
                </Section>
              )}

              {isUniversityOfMilan && (
                <Section title="Applying to the University of Milan from India">
                  <p>
                    For Indian applicants, the application route depends
                    on the programme and applicant category.
                    International applicants should follow the
                    University&apos;s programme-specific admission call,
                    then complete the required{" "}
                    <Link
                      href="/universitaly"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      Universitaly
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/italy-student-visa"
                      className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                    >
                      visa steps
                    </Link>{" "}
                    when applicable.
                  </p>
                  <p className="mt-4">
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
