import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getUniversityBySlug } from "@/services/universities.service";

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

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { university } = normalizeResult(await loadUniversity(slug));

  if (!university) return { title: "University not found" };

  return {
    title: university.seoTitle || university.name,
    description:
      university.metaDescription ||
      university.shortDescription ||
      `Explore courses, admissions and student opportunities at ${university.name}.`,
    keywords: university.keywords,
    alternates: university.canonicalUrl
      ? { canonical: university.canonicalUrl }
      : undefined,
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

  return (
    <>
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
              </h1>
              {location && (
                <p className="mt-4 text-lg font-semibold text-white/90">
                  📍 {location}
                </p>
              )}
              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">
                {university.shortDescription ||
                  `Discover programmes, admission requirements and student opportunities at ${university.name}.`}
              </p>

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
                      Courses offered
                    </h2>
                  </div>
                  <span className="rounded-full bg-primary-light px-4 py-2 text-sm font-bold text-primary">
                    {totals.courses ?? courses.length} courses
                  </span>
                </div>

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

              {admissionRequirements.length > 0 && (
                <Section title="Admission requirements">
                  {Array.isArray(admissionRequirements) ? (
                    <ul className="space-y-3">
                      {admissionRequirements.map((requirement) => (
                        <li key={requirement} className="flex gap-3">
                          <span className="font-bold text-success">✓</span>
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="whitespace-pre-line">
                      {admissionRequirements}
                    </p>
                  )}
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
