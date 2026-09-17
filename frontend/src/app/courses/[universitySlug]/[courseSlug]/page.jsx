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

import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { getCourseBySlug } from "@/services/courses.service";

const formatLabel = (value = "") =>
  String(value)
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const SITE_URL = "https://www.europeandreamss.com";

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

function truncate(value, maxLength) {
  const text = String(value || "").trim().replace(/\s+/g, " ");
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}…`;
}

function stripMarkup(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripBrandSuffix(value) {
  return String(value || "")
    .trim()
    .replace(/\s*\|\s*European Dreams\s*$/i, "")
    .trim();
}

function getDegreeShortLabel(course = {}) {
  const degreeType = course.degreeType?.trim() || "";
  if (/bachelor/i.test(degreeType)) return "Bachelor's";
  if (/single-cycle/i.test(degreeType)) return "Single-cycle Master's";
  if (/master/i.test(degreeType)) return "Master's";
  if (/phd/i.test(degreeType)) return "PhD";
  if (course.degreeLevel?.trim()) return formatLabel(course.degreeLevel);
  return "";
}

function getUniversityShortName(university = {}) {
  const name = university?.name?.trim() || "";
  const head = (name.split(" University")[0] || "").trim();
  if (head && head.toLowerCase() !== "university") return head;
  return name;
}

function getDurationYears(duration) {
  const match = String(duration || "")
    .trim()
    .match(/^(\d+)\s*years?$/i);
  return match ? match[1] : null;
}

function escapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildCourseTitle(course, university) {
  const uniName = university?.name?.trim() || "";
  const degreeShort = getDegreeShortLabel(course);
  const core = uniName ? `${course.name} at ${uniName}` : `${course.name}`;
  const stored = course.seoTitle?.trim()
    ? stripBrandSuffix(course.seoTitle)
    : "";
  // Preserve existing architecture: stored seoTitle wins, legacy fallback otherwise.
  if (!stored) {
    if (degreeShort) return truncate(`${core} – ${degreeShort}`, 70);
    if (uniName)
      return `${course.name} at ${uniName} | Admission & Requirements`;
    return `${course.name} | Admission & Requirements`;
  }
  // Append verified degree qualifier when missing (e.g. Bachelor's).
  if (
    degreeShort &&
    !new RegExp(escapeRegExp(degreeShort), "i").test(stored) &&
    !/admission & requirements/i.test(stored)
  ) {
    const withDegree = `${stored} – ${degreeShort}`;
    // Title safety: never cut the core phrase.
    if (withDegree.length <= 70) return withDegree;
    if (core.length <= 70) return core;
    return truncate(core, 70);
  }
  if (stored.length <= 70) return stored;
  if (core.length <= 70) return core;
  return truncate(core, 70);
}

function buildCourseDescription(course, university) {
  const uniName = university?.name?.trim() || "";
  const degreeShort = getDegreeShortLabel(course);
  const years = getDurationYears(course.duration);
  const englishTaught =
    course.isEnglishTaught ||
    /^english$/i.test(String(course.language || "").trim());
  const place = [university?.city, university?.country]
    .filter(Boolean)
    .join(", ");
  // Factual snippet built only from verified fields.
  if (course.name && uniName) {
    const qualifiers = [];
    if (years) qualifiers.push(`${years}-year`);
    if (englishTaught) qualifiers.push("English-taught");
    if (degreeShort) qualifiers.push(degreeShort);
    const qualifierText = qualifiers.length
      ? ` – ${qualifiers.join(" ")}`
      : "";
    const placeText = place ? ` in ${place}` : "";
    // Approved snippet budget is 160 chars so the exact verified copy
    // (159 chars for this course) is never mid-word truncated.
    return truncate(
      `Study ${course.name} at ${uniName}${qualifierText}${placeText}. Admission requirements, eligibility and guidance.`,
      160,
    );
  }
  if (course.metaDescription?.trim())
    return truncate(course.metaDescription, 155);
  if (course.shortDescription?.trim())
    return truncate(course.shortDescription, 155);
  if (course.overview?.trim())
    return truncate(stripMarkup(course.overview), 155);
  const uniSuffix = university?.name ? ` at ${university.name}` : "";
  const facts = [];
  if (course.degreeType?.trim()) facts.push(course.degreeType.trim());
  else if (course.degreeLevel?.trim())
    facts.push(formatLabel(course.degreeLevel));
  if (course.duration?.trim()) facts.push(course.duration.trim());
  if (course.language?.trim()) facts.push(`taught in ${course.language.trim()}`);
  else if (course.isEnglishTaught) facts.push("taught in English");
  const factSuffix = facts.length ? ` (${facts.join(", ")})` : "";
  return truncate(
    `Explore ${course.name}${uniSuffix}${factSuffix}. Find eligibility, admission requirements and guidance for international students from European Dreams.`,
    155,
  );
}

function buildHeroIntro(course, university) {
  const base =
    course.shortDescription?.trim() ||
    `Study ${course.name} at ${university.name} in Italy.`;
  const degreeLabel = course.degreeType?.trim() || "";
  const duration = course.duration?.trim() || "";
  const language = course.language?.trim() || "";
  const studyMode = course.studyMode?.trim() || "";
  const fieldOfStudy = course.fieldOfStudy?.trim() || "";
  const place =
    [university.city, university.country].filter(Boolean).join(", ") ||
    "Italy";
  const sentences = [];
  if (degreeLabel && duration) {
    let fragment = `It is a ${degreeLabel} programme with a duration of ${duration}`;
    const languageText =
      language || (course.isEnglishTaught ? "English" : "");
    if (languageText) fragment += `, taught in ${languageText}`;
    if (studyMode) fragment += ` ${studyMode}`;
    fragment += ` in ${place}.`;
    sentences.push(fragment);
  } else if (degreeLabel) {
    let fragment = `It is a ${degreeLabel} programme`;
    const languageText =
      language || (course.isEnglishTaught ? "English" : "");
    if (languageText) fragment += ` taught in ${languageText}`;
    if (studyMode) fragment += ` (${studyMode})`;
    fragment += ` in ${place}.`;
    sentences.push(fragment);
  } else if (duration) {
    sentences.push(`Its duration is ${duration}.`);
    const languageText =
      language || (course.isEnglishTaught ? "English" : "");
    if (languageText) sentences.push(`It is taught in ${languageText}.`);
    if (studyMode) sentences.push(`The study mode is ${studyMode}.`);
    sentences.push(`It is offered in ${place}.`);
  } else {
    const languageText =
      language || (course.isEnglishTaught ? "English" : "");
    if (languageText) sentences.push(`It is taught in ${languageText}.`);
    if (studyMode) sentences.push(`The study mode is ${studyMode}.`);
    const mentionsUniversity = base.includes(university.name);
    const mentionsItaly = /Italy/i.test(base);
    if (!mentionsUniversity && !mentionsItaly)
      sentences.push(`It is offered by ${university.name} in ${place}.`);
    else if (!mentionsUniversity)
      sentences.push(`It is offered by ${university.name}.`);
    else if (!mentionsItaly)
      sentences.push(`The university is located in ${place}.`);
  }
  if (fieldOfStudy) sentences.push(`The field of study is ${fieldOfStudy}.`);
  sentences.push(
    "Explore admission requirements, eligibility and application guidance for international students, including applicants from India.",
  );
  return `${base} ${sentences.join(" ")}`;
}

function buildCourseH1(course, university) {
  const degreeShort = getDegreeShortLabel(course);
  const englishTaught =
    course.isEnglishTaught ||
    /^english$/i.test(String(course.language || "").trim());
  if (englishTaught && degreeShort)
    return `${course.name} at ${university.name} – English-taught ${degreeShort} in Italy`;
  if (degreeShort) return `${course.name} at ${university.name} – ${degreeShort} in Italy`;
  return `${course.name} at ${university.name}, Italy`;
}

export async function generateMetadata({ params }) {
  const { universitySlug, courseSlug } = await params;
  const data = await getCourseData(universitySlug, courseSlug);

  if (!data?.course) {
    return {
      title: "Course Not Found",
      description: "The requested course could not be found.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const { course, university } = data;
  const title = buildCourseTitle(course, university);
  const description = buildCourseDescription(course, university);
  const canonical = `${SITE_URL}/courses/${university?.slug || universitySlug}/${course.slug || courseSlug}`;
  // Use the established site-default OG asset when the university has no hero image.
  // Do not invent or fetch a university image.
  const DEFAULT_OG_IMAGE = `${SITE_URL}/images/hero.jpg`;
  const ogImage = university?.heroImage || DEFAULT_OG_IMAGE;
  // Page title carries no brand suffix here: root layout applies
  // the `%s | European Dreams` template exactly once.
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
              alt: `${course.name} at ${university?.name || "European Dreams"}`,
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

  const canonical = `${SITE_URL}/courses/${university?.slug || universitySlug}/${course.slug || courseSlug}`;
  const universityCanonical = `${SITE_URL}/universities/${university?.slug || universitySlug}`;
  const universityShortName = getUniversityShortName(university);
  const degreeShortLabel = getDegreeShortLabel(course);
  const overviewTitle = `${course.name} at ${universityShortName} – Course Overview`;
  const requirementsTitle = `Admission Requirements for ${course.name} at ${universityShortName}`;
  const relatedHeading = degreeShortLabel
    ? `More ${degreeShortLabel} Courses at ${university.name}`
    : `Related courses at ${university.name}`;

  const breadcrumbItems = [
    { name: "Home", href: `${SITE_URL}/` },
    { name: "Universities in Italy", href: `${SITE_URL}/universities` },
    { name: university.name, href: universityCanonical },
    { name: course.name, href: canonical },
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

  const courseSchema = (() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Course",
      "@id": `${canonical}#course`,
      name: course.name,
      description: buildCourseDescription(course, university),
      url: canonical,
      provider: {
        "@type": "CollegeOrUniversity",
        name: university.name,
        url: universityCanonical,
      },
    };

    if (course.language?.trim()) {
      schema.inLanguage = "en";
    }

    if (course.degreeLevel?.trim()) {
      schema.educationalLevel = course.degreeLevel.trim();
    }

    const duration = course.duration?.trim();
    const durationYears = getDurationYears(duration);
    if (durationYears) {
      schema.timeToComplete = `P${durationYears}Y`;
    }

    if (course.fieldOfStudy?.trim()) {
      schema.about = {
        "@type": "Thing",
        name: course.fieldOfStudy.trim(),
      };
    }

    // Only verified study-mode/duration data. No price, offers,
    // startDate, deadline, rating, prerequisites or FAQPage.
    const studyMode = course.studyMode?.trim() || "";
    if (studyMode || durationYears) {
      schema.hasCourseInstance = {
        "@type": "CourseInstance",
        ...(studyMode ? { courseMode: studyMode } : {}),
        inLanguage: "en",
        ...(durationYears ? { courseWorkload: `P${durationYears}Y` } : {}),
      };
    }

    return schema;
  })();

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={courseSchema} />
      <main className="min-h-screen bg-background">
        <section className="relative overflow-hidden border-b border-border bg-(--hero-gradient)">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />

          <div className="container-custom relative mx-auto px-4 py-14 md:py-20">
            <div className="mb-6">
              <Breadcrumbs items={breadcrumbItems} />
            </div>
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
                {buildCourseH1(course, university)}
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
                {buildHeroIntro(course, university)}
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
          <ContentSection id="overview" title={overviewTitle} icon={BookOpen}>
            <p className="leading-8 text-muted">
              {course.overview || course.shortDescription ||
                "Contact our counsellors to receive complete programme information."}
            </p>
            <p className="mt-4 leading-8 text-muted">
              {course.name} is offered by{" "}
              <Link
                href={`/universities/${university.slug}`}
                className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
              >
                {university.name}
              </Link>
              . You can also{" "}
              <Link
                href="/courses"
                className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
              >
                browse all courses in Italy
              </Link>{" "}
              for comparable English-taught options.
            </p>
            {course.degreeLevel === "bachelor" && (
              <p className="mt-4 leading-8 text-muted">
                Looking for a Master&apos;s programme? Explore related
                Master&apos;s options on the{" "}
                <Link
                  href={`/universities/${university.slug}`}
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  {university.name} page
                </Link>
                .
              </p>
            )}
          </ContentSection>

          {requirementItems.length > 0 && (
            <ContentSection id="requirements" title={requirementsTitle} icon={CheckCircle2}>
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
            <ContentSection id="eligibility" title="Who Can Apply – Eligibility" icon={GraduationCap}>
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

          <nav
            aria-label="Study in Italy guidance"
            className="rounded-3xl border border-border bg-card p-6 shadow-sm"
          >
            <h2 className="text-xl font-bold text-foreground">
              Study in Italy guidance
            </h2>
            <ul className="mt-4 space-y-3 text-sm font-semibold">
              <li>
                <Link
                  href="/courses"
                  className="text-primary transition hover:text-primary-hover hover:underline"
                >
                  Browse all courses in Italy
                </Link>
              </li>
              <li>
                <Link
                  href="/study-in-italy"
                  className="text-primary transition hover:text-primary-hover hover:underline"
                >
                  Study in Italy overview for international students
                </Link>
              </li>
              <li>
                <Link
                  href="/italy-university-admission"
                  className="text-primary transition hover:text-primary-hover hover:underline"
                >
                  Italy university admission process
                </Link>
              </li>
              <li>
                <Link
                  href="/italy-student-visa"
                  className="text-primary transition hover:text-primary-hover hover:underline"
                >
                  Italy student visa guidance
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
      </section>

      {relatedCourses.length > 0 && (
        <section className="border-t border-border bg-card">
          <div className="container-custom mx-auto px-4 py-16">
            <p className="font-semibold text-secondary">Explore more</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground">
              {relatedHeading}
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedCourses.map((relatedCourse) => (
                <Link
                  key={relatedCourse._id}
                  href={`/courses/${university.slug}/${relatedCourse.slug}`}
                  aria-label={`${relatedCourse.name} at ${university.name}`}
                  title={`${relatedCourse.name} at ${university.name}`}
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
    </>
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