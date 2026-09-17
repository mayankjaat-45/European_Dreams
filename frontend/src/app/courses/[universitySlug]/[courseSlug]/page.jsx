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
    // Retry with the short university name (generic, no hardcoding).
    const shortUni = getUniversityShortName(university);
    const shortCore = shortUni
      ? `${course.name} at ${shortUni}`
      : `${course.name}`;
    const shortWithDegree = `${shortCore} – ${degreeShort}`;
    if (shortWithDegree.length <= 70) return shortWithDegree;
    // Preserve core course + university terms without mid-word truncation.
    if (shortCore.length <= 70) return shortCore;
    if (core.length <= 70) return core;
    // Last resort: keep the full course name plus degree when it fits.
    const courseWithDegree = `${course.name} – ${degreeShort}`;
    if (courseWithDegree.length <= 70) return courseWithDegree;
    return truncateWords(core, 70);
  }
  if (stored.length <= 70) return stored;
  if (core.length <= 70) return core;
  return truncateWords(core, 70);
}

function truncateWords(value, maxLength) {
  const text = String(value || "").trim().replace(/\s+/g, " ");
  if (!text || text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength - 1).trim();
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim()}…`;
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
    // SERP budget is 160 chars. Cascade through shorter factual variants
    // when the full description exceeds it; never cut mid-word.
    const FULL_CLOSE = "Admission requirements, eligibility and guidance.";
    const SHORT_CLOSE = "Admission requirements and guidance.";
    const buildFactual = (uniDisplayName, includePlace, closing) =>
      `Study ${course.name} at ${uniDisplayName}${qualifierText}${includePlace ? placeText : ""}. ${closing}`;
    const buildCompact = (uniDisplayName, closing) =>
      `Study ${course.name}${qualifierText} at ${uniDisplayName}. ${closing}`;
    const full = buildFactual(uniName, true, FULL_CLOSE);
    if (full.length <= 160) return full;
    const shortUni = getUniversityShortName(university);
    if (shortUni && shortUni !== uniName) {
      const shortened = buildFactual(shortUni, true, FULL_CLOSE);
      if (shortened.length <= 160) return shortened;
    }
    // Drop the place clause, then shorten the ending only as much as needed.
    const compact = buildCompact(uniName, FULL_CLOSE);
    if (compact.length <= 160) return compact;
    const compactShort = buildCompact(uniName, SHORT_CLOSE);
    if (compactShort.length <= 160) return compactShort;
    return truncateWords(full, 160);
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

  // Programme-specific verified content (official Sapienza source) for one
  // course page only. Slug-gated so no other course page is affected, and
  // used solely for visible body content — never for title/meta/schema.
  // Declared before quickLinks: both flags are referenced below.
  const isAcsaiSapienza =
    (university?.slug || universitySlug) ===
      "sapienza-university-of-rome" &&
    (course?.slug || courseSlug) ===
      "applied-computer-science-and-artificial-intelligence";

  // Programme-specific verified content (official Sapienza source) for one
  // course page only. Slug-gated so no other course page is affected, and
  // used solely for visible body content — never for title/meta/schema.
  const isProductServiceDesignSapienza =
    university?.slug === "sapienza-university-of-rome" &&
    course?.slug === "product-and-service-design";

  // Programme-specific verified content (official University of Trento
  // source) for one course page only. Slug-gated so no other course page
  // is affected, and used solely for visible body content — never for
  // title/meta/schema. Declared before quickLinks: referenced below.
  const isHumanComputerInteractionTrento =
    university?.slug === "university-of-trento" &&
    course?.slug === "human-computer-interaction-hci";

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
    ...(isAcsaiSapienza
      ? [{ href: "#what-you-study", label: "What You'll Study" }]
      : []),
    ...(isProductServiceDesignSapienza
      ? [{ href: "#what-you-study", label: "What You'll Study" }]
      : []),
    ...(isHumanComputerInteractionTrento
      ? [{ href: "#what-you-study", label: "What You'll Study" }]
      : []),
    ...(requirementItems.length
      ? [{ href: "#requirements", label: "Requirements" }]
      : []),
    ...(course.eligibility
      ? [{ href: "#eligibility", label: "Eligibility" }]
      : []),
    ...(isAcsaiSapienza ? [{ href: "#careers", label: "Careers" }] : []),
    ...(isProductServiceDesignSapienza
      ? [
          {
            href: "#careers",
            label: "Career Opportunities and Further Study",
          },
        ]
      : []),
    ...(isHumanComputerInteractionTrento
      ? [
          {
            href: "#careers",
            label: "Career Opportunities and Further Study",
          },
        ]
      : []),
    ...(course.scholarships
      ? [{ href: "#scholarships", label: "Scholarships" }]
      : []),
    ...(isAcsaiSapienza
      ? [{ href: "#study-plan", label: "Study Plan" }]
      : []),
    ...(isProductServiceDesignSapienza
      ? [
          {
            href: "#access-and-international",
            label: "Access, Study Plan and International Opportunities",
          },
        ]
      : []),
    ...(isHumanComputerInteractionTrento
      ? [
          {
            href: "#access-and-international",
            label: "Access, Study Plan and International Opportunities",
          },
        ]
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

          {isAcsaiSapienza && (
            <ContentSection
              id="what-you-study"
              title="What You’ll Study in Applied Computer Science and Artificial Intelligence"
              icon={School}
            >
              <p className="leading-8 text-muted">
                This Bachelor&apos;s programme combines computer science
                foundations with artificial intelligence and applied
                computing. It is offered by Sapienza&apos;s Faculty of
                Information Engineering, Computer Science and Statistics
                through the Department of Computer Science.
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "Programming languages",
                  "Software design and development",
                  "Algorithms and computational complexity",
                  "Discrete structures and mathematical foundations",
                  "Artificial intelligence techniques",
                  "Big data and learning from data",
                ].map((topic) => (
                  <li key={topic} className="flex gap-3 leading-7 text-muted">
                    <span className="font-bold text-success">✓</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 leading-8 text-muted">
                See how this English-taught degree fits among{" "}
                <Link
                  href="/english-taught-courses-in-italy"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  English-taught courses in Italy
                </Link>{" "}
                and explore more options on the{" "}
                <Link
                  href={`/universities/${university.slug}`}
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  {university.name} page
                </Link>
                .
              </p>
            </ContentSection>
          )}

          {isProductServiceDesignSapienza && (
            <ContentSection
              id="what-you-study"
              title="What You’ll Study in Product and Service Design"
              icon={School}
            >
              <p className="leading-8 text-muted">
                This English-taught Master&apos;s programme (LM-12) trains
                designers for the advanced production of innovative products
                and services, with strategic skills for post-industrial
                processes shaped by digital and ecological transitions. It is
                run jointly across Sapienza&apos;s Faculty of Architecture
                and the Faculty of Information Engineering, Computer Science
                and Statistics, through the Department of Planning, Design
                and Technology of Architecture.
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "Semester 1 — design languages and methods with graphic and technical foundations",
                  "Semester 2 — new technologies, processes and materials",
                  "Semester 3 — sustainable production and consumption",
                  "Semester 4 — electives, internship and thesis, including 12 elective CFU and company or R&D placements",
                ].map((topic) => (
                  <li key={topic} className="flex gap-3 leading-7 text-muted">
                    <span className="font-bold text-success">✓</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 leading-8 text-muted">
                See how this English-taught degree fits among{" "}
                <Link
                  href="/english-taught-courses-in-italy"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  English-taught courses in Italy
                </Link>{" "}
                and explore more options on the{" "}
                <Link
                  href={`/universities/${university.slug}`}
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  {university.name} page
                </Link>
                .
              </p>
            </ContentSection>
          )}

          {isHumanComputerInteractionTrento && (
            <ContentSection
              id="what-you-study"
              title="What You’ll Study in Human–Computer Interaction"
              icon={School}
            >
              <p className="leading-8 text-muted">
                This English-taught Master&apos;s programme investigates
                people and their actions as a starting point for technology
                design. It is jointly offered by the Department of
                Psychology and Cognitive Science and the Department of
                Information Engineering and Computer Science.
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "Social-cognitive area — brain/mind interaction, behaviour and cognition, and social processes",
                  "Computer science area — user interfaces, user-centred and participatory design, HCI, prototyping, and affective computing",
                  "Methodological area — experimental design, qualitative and quantitative methods, ethics and epistemology",
                ].map((topic) => (
                  <li key={topic} className="flex gap-3 leading-7 text-muted">
                    <span className="font-bold text-success">✓</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 leading-8 text-muted">
                Mandatory basics span all three areas before advanced
                electives. Learning outcomes cover simulative, observational
                and experimental methods, modelling and redesign of
                human-system interfaces, communication and decision theory,
                quantitative and qualitative data methods, individual and
                collective decision analysis, and independent basic and
                applied research — with an internship in a university
                laboratory or a private or public company forming an
                integral part of the programme.
              </p>
              <p className="mt-4 leading-8 text-muted">
                See how this English-taught degree fits among{" "}
                <Link
                  href="/english-taught-courses-in-italy"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  English-taught courses in Italy
                </Link>{" "}
                and explore more options on the{" "}
                <Link
                  href={`/universities/${university.slug}`}
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  {university.name} page
                </Link>
                .
              </p>
            </ContentSection>
          )}

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

              {isAcsaiSapienza && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Access procedure
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Admission test (test code 14824)
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Programme code
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      33502
                    </p>
                  </div>
                </div>
              )}

              {isProductServiceDesignSapienza && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Access procedure
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Restricted access with comparative qualification
                      assessment and admission test
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Programme code
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      33433
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Admission test code
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      16249
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      English prerequisite
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      B2 with certificate at application
                    </p>
                  </div>
                </div>
              )}

              {isProductServiceDesignSapienza && (
                <p className="mt-4 text-sm leading-6 text-muted">
                  Access follows the annual official Sapienza call — verify
                  the current call before applying.
                </p>
              )}

              {isHumanComputerInteractionTrento && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Access procedure
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Programmed access with qualification assessment
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Academic background
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Bachelor&apos;s degree with Information Science and/or
                      Psychology examinations
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      English prerequisite
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      B2 level with accepted proof at application
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Selection elements
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Academic curriculum, motivation letter, references and
                      self-presentation video pitch
                    </p>
                  </div>
                </div>
              )}

              {isHumanComputerInteractionTrento && (
                <p className="mt-4 text-sm leading-6 text-muted">
                  Admission calls, deadlines and application procedures can
                  change. Students should verify the current University of
                  Trento programme call before applying.
                </p>
              )}

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

          {isAcsaiSapienza && (
            <ContentSection
              id="careers"
              title="Career Opportunities and Further Study"
              icon={GraduationCap}
            >
              <p className="leading-8 text-muted">
                According to Sapienza&apos;s official programme description,
                graduates can work with intelligent digital systems and
                information systems, including parallel and distributed
                computing and related security aspects.
              </p>
              <p className="mt-4 leading-8 text-muted">
                The degree also provides a pathway to Master&apos;s-level
                study in Computer Science. For broader planning, see our{" "}
                <Link
                  href="/study-in-italy"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  Study in Italy guide
                </Link>
                .
              </p>
            </ContentSection>
          )}

          {isProductServiceDesignSapienza && (
            <ContentSection
              id="careers"
              title="Career Opportunities and Further Study"
              icon={GraduationCap}
            >
              <p className="leading-8 text-muted">
                According to Sapienza&apos;s official programme description,
                two professional profiles are documented. The Design
                Strategist designs high-innovation products and services and
                can lead design-thinking processes across ideation,
                production, communication and consumption — including Smart
                Objects, IoT and Robotics, healthcare, emergency and
                sustainability contexts, and sharing-economy innovation —
                working freelance, in public or private institutions, in
                design studios, or in small, medium and large firms.
              </p>
              <p className="mt-4 leading-8 text-muted">
                The Design Researcher carries out applied research in
                design-driven innovation, including digital, fabrication and
                sustainability fields, within applied research bodies and
                international corporate research divisions — and graduates
                can continue into doctoral research across design fields. For
                broader planning, see our{" "}
                <Link
                  href="/study-in-italy"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  Study in Italy guide
                </Link>
                .
              </p>
            </ContentSection>
          )}

          {isHumanComputerInteractionTrento && (
            <ContentSection
              id="careers"
              title="Career Opportunities and Further Study"
              icon={GraduationCap}
            >
              <p className="leading-8 text-muted">
                According to the University of Trento&apos;s official
                programme description, this Master&apos;s prepares
                researchers and professionals with multidisciplinary HCI
                skills for evolving technology domains — people able to
                analyse the complexity of human cognition, behaviour and
                emotion and embed that understanding in new computing
                artefacts and technologies.
              </p>
              <p className="mt-4 leading-8 text-muted">
                The programme documents a pathway toward PhD study in
                Human-Computer Interaction after the Master&apos;s degree.
                For broader planning, see our{" "}
                <Link
                  href="/study-in-italy"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  Study in Italy guide
                </Link>
                .
              </p>
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

          {isAcsaiSapienza && (
            <ContentSection
              id="study-plan"
              title="Study Plan and International Opportunities"
              icon={Languages}
            >
              <p className="leading-8 text-muted">
                The programme follows an official study plan published by
                Sapienza (programme code 33502). Students can also pursue
                international mobility opportunities documented by Sapienza,
                including Erasmus+ exchanges — confirm current destinations
                and calls on the official pages before planning around them.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Applicants from India should verify the programme&apos;s
                current academic and admission requirements and follow
                Sapienza&apos;s current international application process.
                See the{" "}
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
            </ContentSection>
          )}

          {isProductServiceDesignSapienza && (
            <ContentSection
              id="access-and-international"
              title="Access, Study Plan and International Opportunities"
              icon={Languages}
            >
              <p className="leading-8 text-muted">
                This is a restricted-access Master&apos;s programme (LM-12,
                programme code 33433). Admission runs through comparative
                assessment of prior qualifications plus an admission test
                (test code 16249). Eligible backgrounds include Industrial
                Design (L-4), Industrial, Civil and Information Engineering,
                Architecture, and Economics &amp; Management — with B2-level
                English certified at application. The degree runs over four
                semesters with an official study plan, and mobility can take
                place in the fourth semester alongside electives, internship
                and thesis work.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Documented international opportunities include Erasmus+
                study and traineeship mobility, the CIVIS alliance, Overseas
                placements, thesis-abroad grants, and the Design Carousel
                workshop run with European design schools through Cumulus
                membership — confirm current options in the official call
                before planning around them.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Students applying from India should verify the current
                Sapienza programme call, academic eligibility and
                English-language documentation requirements before applying.
                See the{" "}
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
            </ContentSection>
          )}

          {isHumanComputerInteractionTrento && (
            <ContentSection
              id="access-and-international"
              title="Access, Study Plan and International Opportunities"
              icon={Languages}
            >
              <p className="leading-8 text-muted">
                This is a Master&apos;s degree programme with programmed
                access, running over 2 years and 120 credits in English at
                Rovereto. Admission requires a Bachelor&apos;s degree or
                equivalent, with specific preparation in Information Science
                and/or Psychology demonstrated through degree examinations,
                plus B2-level English documented through an accepted proof —
                mother tongue, university confirmation of an English-medium
                degree, a transcript showing a B2 English exam, an accepted
                certificate, or the UniTrento CLA test. Selection weighs
                coherence with the programme alongside the academic
                curriculum, motivation letter, references and a
                self-presentation video pitch submitted online.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Documented international opportunities include Erasmus+
                study and traineeship mobility — the internship abroad runs
                at least four months at a single location — while
                national and international mobility periods can be
                recognised through the Learning Agreement, and thesis work
                abroad is supported. Confirm current options in the official
                call before planning around them.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Students applying from India should verify the current
                Trento programme call, academic-background fit and
                English-language documentation requirements before applying.
                See the{" "}
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