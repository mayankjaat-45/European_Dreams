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

    if (university.establishedYear) {
      schema.foundingDate = String(university.establishedYear);
    }

    const websiteUrl = (
      university.officialWebsite || university.website || ""
    ).trim();
    if (websiteUrl) {
      schema.sameAs = websiteUrl;
    }

    return schema;
  })();

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
            <Fact label="Established" value={university.establishedYear} />
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
                          {[course.duration, course.tuitionFee]
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
