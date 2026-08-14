import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  GraduationCap,
  Languages,
  MapPin,
  School,
  Sparkles,
} from "lucide-react";

import { getCourseBySlug } from "@/services/courses.service";

const formatLabel = (value = "") =>
  String(value)
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const getCourseData = async (universitySlug, courseSlug) => {
  try {
    return await getCourseBySlug(universitySlug, courseSlug);
  } catch (error) {
    if (
      error.message === "Course not found" ||
      error.message === "University not found"
    ) {
      return null;
    }

    throw error;
  }
};

export async function generateMetadata({ params }) {
  const { universitySlug, courseSlug } = await params;
  const data = await getCourseData(universitySlug, courseSlug);

  if (!data?.course) {
    return { title: "Course Not Found | European Dreams" };
  }

  const { course, university } = data;

  return {
    title:
      course.seoTitle ||
      `${course.name} at ${university?.name} | European Dreams`,
    description:
      course.metaDescription ||
      course.shortDescription ||
      `Explore ${course.name} at ${university?.name}.`,
  };
}

export default async function CourseDetailsPage({ params }) {
  const { universitySlug, courseSlug } = await params;
  const data = await getCourseData(universitySlug, courseSlug);

  if (!data?.course || !data?.university) notFound();

  const { course, university, relatedCourses = [] } = data;
  const admissionRequirements = course.admissionRequirements || {};
  const consultationUrl = `/contact?type=course&university=${encodeURIComponent(
    university._id || "",
  )}&course=${encodeURIComponent(course._id || "")}`;

  const requirementItems = [
    {
      label: "Academic requirement",
      value:
        admissionRequirements.academics ||
        course.academicRequirements?.join(", "),
    },
    { label: "IELTS", value: admissionRequirements.ielts },
    { label: "TOEFL", value: admissionRequirements.toefl },
    { label: "PTE", value: admissionRequirements.pte },
    { label: "Duolingo", value: admissionRequirements.duolingo },
    { label: "CENT-S", value: admissionRequirements.centS },
    { label: "SAT", value: admissionRequirements.sat },
    { label: "IMAT", value: admissionRequirements.imat },
  ].filter((item) => item.value);

  const quickLinks = [
    { href: "#overview", label: "Overview" },
    ...(requirementItems.length
      ? [{ href: "#requirements", label: "Requirements" }]
      : []),
    ...(course.eligibility
      ? [{ href: "#eligibility", label: "Eligibility" }]
      : []),
    ...(course.scholarships
      ? [{ href: "#scholarships", label: "Scholarships" }]
      : []),
  ];

  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border bg-(--hero-gradient)">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />

        <div className="container-custom relative mx-auto px-4 py-14 md:py-20">
          <Link
            href={`/universities/${university.slug}`}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:-translate-x-1 hover:text-primary-hover"
          >
            <ArrowLeft size={18} />
            Back to {university.name}
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
            <div className="animate-[fade-up_0.6s_ease-out_both]">
              <div className="mb-5 flex flex-wrap gap-3">
                <Badge>{course.degreeType || formatLabel(course.degreeLevel)}</Badge>

                {course.isEnglishTaught && (
                  <Badge tone="secondary">English-taught</Badge>
                )}

                {course.requiresIMAT && (
                  <span className="rounded-full bg-danger/10 px-4 py-2 text-sm font-semibold text-danger">
                    IMAT Required
                  </span>
                )}
              </div>

              <p className="mb-3 flex items-center gap-2 font-medium text-muted">
                <School size={19} />
                {university.name}
                {(university.city || university.country) && (
                  <>
                    <span aria-hidden="true">•</span>
                    <MapPin size={17} />
                    {[university.city, university.country]
                      .filter(Boolean)
                      .join(", ")}
                  </>
                )}
              </p>

              <h1 className="max-w-4xl font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
                {course.name}
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
                {course.shortDescription ||
                  `Study ${course.name} at ${university.name} in Italy.`}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={consultationUrl}
                  className="group inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-7 py-3.5 font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-xl"
                >
                  Apply for this course
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href={`/universities/${university.slug}`}
                  className="inline-flex min-h-12 items-center rounded-xl border border-border bg-card px-7 py-3.5 font-bold text-foreground transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary"
                >
                  View university
                </Link>
              </div>
            </div>

            <div className="group relative h-75 animate-[fade-up_0.7s_ease-out_0.1s_both] overflow-hidden rounded-[28px] border border-border bg-card shadow-xl md:h-90">
              {university.heroImage ? (
                <Image
                  src={university.heroImage}
                  alt={`${university.name} campus`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-primary-light">
                  <GraduationCap size={72} className="text-primary" />
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 to-transparent opacity-60" />
            </div>
          </div>
        </div>
      </section>

      <nav className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="container-custom mx-auto flex items-center gap-2 overflow-x-auto px-4 py-3 scrollbar-none [&::-webkit-scrollbar]:hidden">
          {quickLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-muted transition hover:border-primary/30 hover:bg-primary-light hover:text-primary"
            >
              {item.label}
            </a>
          ))}
          <Link
            href={consultationUrl}
            className="ml-auto hidden shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-bold text-white transition hover:bg-primary-hover sm:inline-flex"
          >
            Enquire now
          </Link>
        </div>
      </nav>

      <section className="container-custom mx-auto px-4 py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard icon={GraduationCap} label="Degree" value={course.degreeType || formatLabel(course.degreeLevel)} />
          <InfoCard icon={Clock3} label="Duration" value={course.duration || "To be confirmed"} />
          <InfoCard icon={Languages} label="Language" value={course.language || "English"} />
          <InfoCard icon={CalendarDays} label="Admission year" value={course.admissionYear || "2026/27"} />
        </div>
      </section>

      <section className="container-custom mx-auto grid gap-8 px-4 pb-24 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <ContentSection id="overview" title="Course Overview" icon={BookOpen}>
            <p className="leading-8 text-muted">
              {course.overview || course.shortDescription ||
                "Contact our counsellors to receive complete programme information."}
            </p>
          </ContentSection>

          {requirementItems.length > 0 && (
            <ContentSection id="requirements" title="Admission Requirements" icon={CheckCircle2}>
              <div className="grid gap-4 sm:grid-cols-2">
                {requirementItems.map((item) => (
                  <div key={item.label} className="group rounded-2xl border border-border bg-background p-5 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                    <p className="text-sm font-medium text-muted">{item.label}</p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>

              {admissionRequirements.notes && (
                <details className="group mt-5 rounded-2xl border border-secondary/20 bg-secondary-light p-4 open:shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-foreground">
                    Important admission notes
                    <ChevronDown className="h-5 w-5 text-secondary transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-muted">{admissionRequirements.notes}</p>
                </details>
              )}
            </ContentSection>
          )}

          {course.eligibility && (
            <ContentSection id="eligibility" title="Eligibility" icon={GraduationCap}>
              <p className="leading-8 text-muted">{course.eligibility}</p>
            </ContentSection>
          )}

          {course.scholarships && (
            <ContentSection id="scholarships" title="Scholarships" icon={Sparkles}>
              <p className="leading-8 text-muted">{course.scholarships}</p>
              <p className="mt-5 rounded-xl bg-secondary-light p-4 text-sm leading-6 text-muted">
                Scholarship availability and awards depend on eligibility and official university or regional policies.
              </p>
            </ContentSection>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground">Course Details</h2>
            <div className="mt-6 space-y-5">
              <DetailRow label="Field of study" value={course.fieldOfStudy || "Not specified"} />
              <DetailRow label="Study mode" value={formatLabel(course.studyMode || "on-campus")} />
              <DetailRow label="Programme type" value={formatLabel(course.programmeType) || "Not specified"} />
              <DetailRow label="Campus" value={course.campus || university.city || "Italy"} />
              <DetailRow label="Tuition fee" value={course.tuitionFee || "Contact for details"} />
              <DetailRow label="Application deadline" value={course.applicationDeadline || "To be confirmed"} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-primary p-7 text-white shadow-xl shadow-primary/15">
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
            <h2 className="relative text-2xl font-bold">Need application support?</h2>
            <p className="relative mt-3 leading-7 text-white/80">
              Get personalised guidance for eligibility, documents, admission and visa preparation.
            </p>
            <Link
              href={consultationUrl}
              className="group relative mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary transition hover:-translate-y-0.5 hover:bg-secondary-light"
            >
              Book Free Consultation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </aside>
      </section>

      {relatedCourses.length > 0 && (
        <section className="border-t border-border bg-card">
          <div className="container-custom mx-auto px-4 py-16">
            <p className="font-semibold text-secondary">Explore more</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground">
              Related courses at {university.name}
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedCourses.map((relatedCourse) => (
                <Link
                  key={relatedCourse._id}
                  href={`/courses/${university.slug}/${relatedCourse.slug}`}
                  className="group rounded-[22px] border border-border bg-background p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
                >
                  <p className="text-sm font-semibold text-primary">
                    {relatedCourse.degreeType || formatLabel(relatedCourse.degreeLevel)}
                  </p>
                  <h3 className="mt-3 text-xl font-bold leading-7 text-foreground transition group-hover:text-primary">
                    {relatedCourse.name}
                  </h3>
                  <div className="mt-5 flex items-center justify-between gap-4 text-sm text-muted">
                    <span>{relatedCourse.duration || "Duration TBC"} · {relatedCourse.language || "English"}</span>
                    <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="fixed inset-x-4 bottom-4 z-40 sm:hidden">
        <Link href={consultationUrl} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-white shadow-2xl">
          Apply for this course <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </main>
  );
}

function Badge({ children, tone = "primary" }) {
  const styles = tone === "secondary"
    ? "bg-secondary-light text-secondary"
    : "bg-primary-light text-primary";
  return <span className={`rounded-full px-4 py-2 text-sm font-semibold ${styles}`}>{children}</span>;
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="group rounded-[22px] border border-border bg-card p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary transition group-hover:bg-primary group-hover:text-white">
        <Icon size={23} />
      </div>
      <p className="mt-4 text-sm text-muted">{label}</p>
      <p className="mt-1 font-bold text-foreground">{value}</p>
    </div>
  );
}

function ContentSection({ id, title, icon: Icon, children }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
          <Icon className="h-6 w-6" />
        </span>
        <h2 className="font-display text-2xl font-bold text-foreground">{title}</h2>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="border-b border-border pb-4 last:border-0 last:pb-0">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-semibold text-foreground">{value}</p>
    </div>
  );
}