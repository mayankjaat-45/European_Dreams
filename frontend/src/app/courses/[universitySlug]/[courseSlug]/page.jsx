import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

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

const getCachedCourse = cache(getCourseBySlug);

const formatLabel = (value = "") =>
  String(value)
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const SITE_URL = "https://www.europeandreamss.com";

const getCourseData = async (universitySlug, courseSlug) => {
  try {
    return await getCachedCourse(universitySlug, courseSlug);
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

  // Programme-specific verified content (official Ca' Foscari source) for
  // one course page only. Slugs verified against the live API
  // (ca-foscari-university-of-venice / global-accounting-and-finance).
  // Slug-gated so no other course page is affected, and used solely for
  // visible body content — never for title/meta/schema. Declared before
  // quickLinks: referenced below.
  const isGlobalAccountingFinanceCaFoscari =
    university?.slug === "ca-foscari-university-of-venice" &&
    course?.slug === "global-accounting-and-finance";

  // Programme-specific verified content (official Sapienza source) for one
  // course page only. Slug-gated so no other course page is affected, and
  // used solely for visible body content — never for title/meta/schema.
  // Declared before quickLinks: referenced below.
  const isEconFinanceSapienza =
    (university?.slug || universitySlug) ===
      "sapienza-university-of-rome" &&
    (course?.slug || courseSlug) === "economics-and-finance";

  // Programme-specific verified content (official Sapienza source) for one
  // course page only. Slug-gated so no other course page is affected, and
  // used solely for visible body content — never for title/meta/schema.
  // Declared before quickLinks: referenced below.
  const isBamSapienza =
    (university?.slug || universitySlug) ===
      "sapienza-university-of-rome" &&
    (course?.slug || courseSlug) ===
      "business-administration-and-management";

  // Programme-specific verified content (official University of Ferrara
  // source) for one course page only. Slug-gated so no other course page
  // is affected, and used solely for visible body content — never for
  // title/meta/schema. Declared before quickLinks: referenced below.
  const isSbmFerrara =
    (university?.slug || universitySlug) === "university-of-ferrara" &&
    (course?.slug || courseSlug) ===
      "small-business-management-in-international-markets";

  // Programme-specific verified content (official University of Milan
  // source) for one course page only. Slug-gated so no other course page
  // is affected, and used solely for visible body content — never for
  // title/meta/schema. Declared before quickLinks: referenced below.
  // Milan only: do not mix Turin-variant information into this page.
  const isCosmisMilan =
    (university?.slug || universitySlug) === "university-of-milan" &&
    (course?.slug || courseSlug) === "cosmetic-industrial-science";

  // Programme-specific verified content (official Polytechnic University
  // of Marche source) for one course page only. Slug-gated so no other
  // course page is affected, and used solely for visible body content —
  // never for title/meta/schema. Declared before quickLinks: referenced
  // below.
  const isEscpMarche =
    (university?.slug || universitySlug) === "university-of-marche" &&
    (course?.slug || courseSlug) ===
      "environmental-sciences-and-civil-protection";

  // Programme-specific verified content (official Polytechnic University
  // of Marche source) for one course page only. Slug-gated so no other
  // course page is affected, and used solely for visible body content —
  // never for title/meta/schema. Declared before quickLinks: referenced
  // below.
  const isDebMarche =
    (university?.slug || universitySlug) === "university-of-marche" &&
    (course?.slug || courseSlug) === "digital-economics-and-business";

  // Programme-specific verified content (official University of Cagliari
  // source) for one course page only. Slug-gated so no other course page
  // is affected, and used solely for visible body content — never for
  // title/meta/schema. Declared before quickLinks: referenced below.
  const isCyberAiCagliari =
    (university?.slug || universitySlug) === "university-of-cagliari" &&
    (course?.slug || courseSlug) ===
      "computer-engineering-cybersecurity-and-artificial-intelligence";

  // Programme-specific verified content (official Sapienza source) for one
  // course page only. Slug-gated so no other course page is affected, and
  // used solely for visible body content — never for title/meta/schema.
  // Declared before quickLinks: referenced below.
  const isBioinfoSapienza =
    (university?.slug || universitySlug) ===
      "sapienza-university-of-rome" &&
    (course?.slug || courseSlug) === "bioinformatics";

  // Programme-specific verified content (official University of Perugia
  // source) for one course page only. Slug-gated so no other course page
  // is affected, and used solely for visible body content — never for
  // title/meta/schema. Declared before quickLinks: referenced below.
  const isEngMgmtPerugia =
    (university?.slug || universitySlug) === "university-of-perugia" &&
    (course?.slug || courseSlug) === "engineering-management-bsc";

  // Programme-specific verified content (official University of Bologna
  // source) for one course page only. Slug-gated so no other course page
  // is affected, and used solely for visible body content — never for
  // title/meta/schema. Declared before quickLinks: referenced below.
  const isBioHealthBologna =
    (university?.slug || universitySlug) === "university-of-bologna" &&
    (course?.slug || courseSlug) ===
      "biology-of-human-and-environmental-health";

  // Programme-specific verified content (official UNIMORE source) for one
  // course page only. Slug-gated so no other course page is affected, and
  // used solely for visible body content — never for title/meta/schema.
  // Declared before quickLinks: referenced below.
  const isEnergyUnimore =
    (university?.slug || universitySlug) ===
      "university-of-modena-and-reggio-emilia" &&
    (course?.slug || courseSlug) === "energy-engineering";

  // Programme-specific verified content (official University of Bergamo
  // source) for one course page only. Slug-gated so no other course page is
  // affected, and used solely for visible body content — never for
  // title/meta/schema. Declared before quickLinks: referenced below.
  const isBergamoIMM =
    (university?.slug || universitySlug) === "university-of-bergamo" &&
    (course?.slug || courseSlug) ===
      "international-management-and-marketing";

  // Programme-specific verified content (official University of Genoa
  // source) for one course page only. Slug-gated so no other course page is
  // affected, and used solely for visible body content — never for
  // title/meta/schema. Declared before quickLinks: referenced below.
  const isGenoaImperia =
    (university?.slug || universitySlug) === "university-of-genoa" &&
    (course?.slug || courseSlug) === "computer-engineering-imperia-campus";

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
    ...(isGlobalAccountingFinanceCaFoscari
      ? [{ href: "#what-you-study", label: "What You'll Study" }]
      : []),
    ...(isEconFinanceSapienza
      ? [{ href: "#what-you-study", label: "What You'll Study" }]
      : []),
    ...(isBamSapienza
      ? [{ href: "#what-you-study", label: "What You'll Study" }]
      : []),
    ...(isSbmFerrara
      ? [{ href: "#what-you-study", label: "What You'll Study" }]
      : []),
    ...(isCosmisMilan
      ? [{ href: "#what-you-study", label: "What You'll Study" }]
      : []),
    ...(isEscpMarche
      ? [{ href: "#what-you-study", label: "What You'll Study" }]
      : []),
    ...(isDebMarche
      ? [{ href: "#what-you-study", label: "What You'll Study" }]
      : []),
    ...(isCyberAiCagliari
      ? [{ href: "#what-you-study", label: "What You'll Study" }]
      : []),
    ...(isBioinfoSapienza
      ? [{ href: "#what-you-study", label: "What You'll Study" }]
      : []),
    ...(isEngMgmtPerugia
      ? [{ href: "#what-you-study", label: "What You'll Study" }]
      : []),
    ...(isBioHealthBologna
      ? [{ href: "#what-you-study", label: "What You'll Study" }]
      : []),
    ...(isEnergyUnimore
      ? [{ href: "#what-you-study", label: "What You'll Study" }]
      : []),
    ...(isBergamoIMM
      ? [{ href: "#what-you-study", label: "What You'll Study" }]
      : []),
    ...(isGenoaImperia
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
    ...(isGlobalAccountingFinanceCaFoscari
      ? [
          {
            href: "#careers",
            label: "Career Opportunities and Further Study",
          },
        ]
      : []),
    ...(isEconFinanceSapienza
      ? [
          {
            href: "#careers",
            label: "Career Opportunities and Further Study",
          },
        ]
      : []),
    ...(isBamSapienza
      ? [
          {
            href: "#careers",
            label: "Career Opportunities and Further Study",
          },
        ]
      : []),
    ...(isSbmFerrara
      ? [
          {
            href: "#careers",
            label: "Career Opportunities and Further Study",
          },
        ]
      : []),
    ...(isCosmisMilan
      ? [
          {
            href: "#careers",
            label: "Career Opportunities and Further Study",
          },
        ]
      : []),
    ...(isEscpMarche
      ? [
          {
            href: "#careers",
            label: "Career Opportunities and Further Study",
          },
        ]
      : []),
    ...(isDebMarche
      ? [
          {
            href: "#careers",
            label: "Career Opportunities and Further Study",
          },
        ]
      : []),
    ...(isCyberAiCagliari
      ? [
          {
            href: "#careers",
            label: "Career Opportunities and Further Study",
          },
        ]
      : []),
    ...(isBioinfoSapienza
      ? [
          {
            href: "#careers",
            label: "Career Opportunities and Further Study",
          },
        ]
      : []),
    ...(isEngMgmtPerugia
      ? [
          {
            href: "#careers",
            label: "Career Opportunities and Further Study",
          },
        ]
      : []),
    ...(isBioHealthBologna
      ? [
          {
            href: "#careers",
            label: "Career Opportunities and Further Study",
          },
        ]
      : []),
    ...(isEnergyUnimore
      ? [
          {
            href: "#careers",
            label: "Career Opportunities and Further Study",
          },
        ]
      : []),
    ...(isBergamoIMM
      ? [{ href: "#careers", label: "Career Opportunities" }]
      : []),
    ...(isGenoaImperia
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
    ...(isGlobalAccountingFinanceCaFoscari
      ? [
          {
            href: "#access-and-international",
            label: "Access, Study Plan and International Opportunities",
          },
        ]
      : []),
    ...(isEconFinanceSapienza
      ? [
          {
            href: "#access-and-international",
            label: "Access, Study Plan and International Opportunities",
          },
        ]
      : []),
    ...(isBamSapienza
      ? [
          {
            href: "#access-and-international",
            label: "Access, Study Plan and International Opportunities",
          },
        ]
      : []),
    ...(isSbmFerrara
      ? [
          {
            href: "#access-and-international",
            label: "Access, Study Plan and International Opportunities",
          },
        ]
      : []),
    ...(isCosmisMilan
      ? [
          {
            href: "#access-and-international",
            label: "Access, Study Plan and International Opportunities",
          },
        ]
      : []),
    ...(isEscpMarche
      ? [
          {
            href: "#access-and-international",
            label: "Access, Study Plan and International Opportunities",
          },
        ]
      : []),
    ...(isDebMarche
      ? [
          {
            href: "#access-and-international",
            label: "Access, Study Plan and International Opportunities",
          },
        ]
      : []),
    ...(isCyberAiCagliari
      ? [
          {
            href: "#access-and-international",
            label: "Access, Study Plan and International Opportunities",
          },
        ]
      : []),
    ...(isBioinfoSapienza
      ? [
          {
            href: "#access-and-international",
            label: "Access, Study Plan and International Opportunities",
          },
        ]
      : []),
    ...(isEngMgmtPerugia
      ? [
          {
            href: "#access-and-international",
            label: "Access, Study Plan and International Opportunities",
          },
        ]
      : []),
    ...(isBioHealthBologna
      ? [{ href: "#skills", label: "Health and Research Skills" }]
      : []),
    ...(isBioHealthBologna
      ? [
          {
            href: "#access-and-international",
            label: "Access, Study Plan and International Opportunities",
          },
        ]
      : []),
    ...(isEnergyUnimore
      ? [
          {
            href: "#access-and-international",
            label: "Access, Study Plan and International Opportunities",
          },
        ]
      : []),
    ...(isBergamoIMM
      ? [
          {
            href: "#access-and-international",
            label: "Access & International",
          },
        ]
      : []),
    ...(isGenoaImperia
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

          {isGlobalAccountingFinanceCaFoscari && (
            <ContentSection
              id="what-you-study"
              title="What You’ll Study in Global Accounting and Finance"
              icon={School}
            >
              <p className="leading-8 text-muted">
                This English-taught Master&apos;s programme (LM-77 R) at
                the Venice School of Management runs over 2 years and 120
                ECTS in Venice. Its accounting and finance curriculum is
                documented through Ca&apos; Foscari&apos;s official study
                plan and teaching pages.
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "Accounting and finance curriculum areas for global business contexts",
                  "Business Economics within a 20-credit Business block",
                  "Economics, Law, and Mathematics and Statistics foundations",
                  "Official study plan and teaching documentation published by Ca’ Foscari",
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

          {isEconFinanceSapienza && (
            <ContentSection
              id="what-you-study"
              title="What You’ll Study in Economics and Finance"
              icon={School}
            >
              <p className="leading-8 text-muted">
                This Bachelor&apos;s programme (L-33) is offered by
                Sapienza&apos;s Faculty of Economics through the Department
                of Economics and Law. The catalogue lists the programme in
                Italian and English, with a taught-in-English pathway
                confirmed through the official admission call and
                English-track teaching schedules.
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "First-year foundations — political economy, business economics, law, and quantitative methods",
                  "Second-year areas — intermediate political economy, econometrics, financial intermediaries, statistics, and economic policy",
                  "Third-year areas — financial economics, financial mathematics, monetary economics and policy, electives and final essay work",
                  "Optional-group areas — banking, international economy, economic policy, applied financial economics, environmental and development economics",
                ].map((topic) => (
                  <li key={topic} className="flex gap-3 leading-7 text-muted">
                    <span className="font-bold text-success">✓</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-6 text-muted">
                Study-plan areas above summarise the official catalogue at
                a high level. Confirm the current English-track module list
                in Sapienza&apos;s official study plan before planning
                around individual subjects.
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

          {isBamSapienza && (
            <ContentSection
              id="what-you-study"
              title="What You’ll Study in Business Administration and Management"
              icon={School}
            >
              <p className="leading-8 text-muted">
                This Bachelor&apos;s programme (L-18) is offered by
                Sapienza&apos;s Faculty of Economics through the Department
                of Management. The catalogue lists the programme in Italian
                and English, with a taught-in-English pathway confirmed
                through the official admission call and English-track
                teaching schedules.
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "First-year foundations — business administration, law, mathematics, and political economy",
                  "Second-year areas — business and management, economic policy, statistics, commercial law, and financial intermediaries",
                  "Third-year areas — planning and management control, auditing, banking, securities markets, and corporate finance",
                  "Cross-cutting themes — sustainability and responsibility, international sensitivity, and operational management skills",
                ].map((topic) => (
                  <li key={topic} className="flex gap-3 leading-7 text-muted">
                    <span className="font-bold text-success">✓</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-6 text-muted">
                Study-plan areas above summarise the official catalogue at
                a high level. Confirm the current English-track module list
                in Sapienza&apos;s official study plan before planning
                around individual subjects.
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

          {isSbmFerrara && (
            <ContentSection
              id="what-you-study"
              title="What You’ll Study in Small Business Management in International Markets"
              icon={School}
            >
              <p className="leading-8 text-muted">
                This Master&apos;s programme (LM-77) at the University of
                Ferrara&apos;s Department of Economics and Management runs
                over 2 years and 120 ECTS, taught entirely in English. It
                focuses on the management of small businesses operating in
                international markets, combining industrial economics with
                business administration.
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "Advanced industrial economics and business administration for SME internationalisation",
                  "Global-market dynamics, economic development, and corporate structures",
                  "Quantitative and legal tools for business decisions, including scenario analysis",
                  "International marketing, operations and logistics, organisation and innovation",
                  "Interactive small-group teaching with projects, workshops, and case studies",
                  "Thesis work that can be combined with an internship or company project",
                ].map((topic) => (
                  <li key={topic} className="flex gap-3 leading-7 text-muted">
                    <span className="font-bold text-success">✓</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-6 text-muted">
                The programme follows a two-curriculum structure documented
                on Ferrara&apos;s official pages. Confirm the current
                per-year study plan on the official training-path page for
                your enrolment year.
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

          {isCosmisMilan && (
            <ContentSection
              id="what-you-study"
              title="What You’ll Study in Cosmetic Industrial Science"
              icon={School}
            >
              <p className="leading-8 text-muted">
                This Master&apos;s programme (LM-71 R) at the University of
                Milan runs over 2 years and 120 ECTS, taught in English in
                Milan through the Department of Pharmaceutical Sciences. It
                trains graduates in the research, development, industrial
                production, quality control and marketing of cosmetic
                products, combining theoretical lectures — most complemented
                by laboratory activities — with a compulsory internship of
                at least 34 credits in the last semester, carried out in a
                university laboratory or a company in Italy or abroad. The
                programme uses a blended study mode.
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "Skin and formulation sciences — physiology and biochemistry of skin and annexes, microbiological contamination and controls",
                  "Cosmetic ingredients — inorganic, organic, polymeric and functional ingredients",
                  "Product development — skincare, hygiene, perfume and make-up preparations, including decorative cosmetics",
                  "Manufacturing and packaging technologies, materials and processes",
                  "Regulation and market placement of new cosmetic products under European guidelines",
                  "Toxicology, microbiological risk assessment and alternative toxicological protocols",
                  "Quality assessment, stability monitoring and analysis of cosmetic ingredients and products",
                  "Marketing and communication, business plan and project financial evaluation",
                  "Internship project developed into an English-language thesis discussed at the final examination",
                ].map((topic) => (
                  <li key={topic} className="flex gap-3 leading-7 text-muted">
                    <span className="font-bold text-success">✓</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-6 text-muted">
                The study-plan areas above summarise the official programme
                description at a high level. Confirm the current module list
                and internship rules on the official programme pages for
                your enrolment year.
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

          {isEscpMarche && (
            <ContentSection
              id="what-you-study"
              title="What You’ll Study in Environmental Sciences and Civil Protection"
              icon={School}
            >
              <p className="leading-8 text-muted">
                This 3-year Bachelor&apos;s programme (L-32) at the
                Polytechnic University of Marche is taught in
                English in Ancona through the Department of Life and
                Environmental Sciences. It integrates basic-science
                foundations with environmental monitoring and remediation
                skills, plus specialised civil-protection training in
                forecasting, prevention and emergency management.
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "Basic sciences — mathematics and statistics, physics and chemistry",
                  "Biological foundations — biology and ecology",
                  "Earth sciences — geology, oceanography, meteorology and climatology",
                  "Environmental monitoring and remediation — ecotoxicology, energy, environmental monitoring, environmental analysis, remediation and environmental legislation",
                  "Civil-protection and risk topics — geography of risk and disasters, IT and telecommunication tools, civil-protection statute and emergency management",
                  "Laboratory and field activities alongside lectures, plus an internship in external institutions or university laboratories",
                ].map((topic) => (
                  <li key={topic} className="flex gap-3 leading-7 text-muted">
                    <span className="font-bold text-success">✓</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-6 text-muted">
                The study-plan areas above summarise the official programme
                description at a high level. Confirm the current module list
                on the official programme pages for your enrolment year.
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

          {isDebMarche && (
            <ContentSection
              id="what-you-study"
              title="What You’ll Study in Digital Economics and Business"
              icon={School}
            >
              <p className="leading-8 text-muted">
                This 3-year Bachelor&apos;s programme (interclass L-33 and
                L-18, 180 ECTS) at the Polytechnic University of Marche is
                taught entirely in English in Ancona through the Faculty of
                Economics &ldquo;Giorgio Fu&agrave;&rdquo;. It combines
                business, economics and IT-based data analytics so graduates
                can apply a data-driven approach to decision-making. The
                first two years are largely shared, with third-year choices
                shaping an economic-financial or economic-business emphasis.
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "Year 1 areas — mathematics, principles of economics, business economics and accounting, IT law, computing fundamentals, economic history of technological change and advanced English",
                  "Year 2 areas — statistics, business management and digital applications, business information systems, industrial economics and digital transformation, with financial statement analysis or corporate finance options",
                  "Year 3 areas — international trade and finance, data analytics, marketing and digital applications, plus guided choices across financial economics, machine learning and financial mathematics, planning and control or finance and fintech",
                  "Laboratory and project work with real data across the three years, plus elective internship options and a final project",
                ].map((topic) => (
                  <li key={topic} className="flex gap-3 leading-7 text-muted">
                    <span className="font-bold text-success">✓</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-6 text-muted">
                The study-plan areas above summarise the official study plan
                at a high level. Confirm the current module list and
                third-year choice rules on the official programme pages for
                your enrolment year.
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

          {isCyberAiCagliari && (
            <ContentSection
              id="what-you-study"
              title="What You’ll Study in Computer Engineering, Cybersecurity and Artificial Intelligence"
              icon={School}
            >
              <p className="leading-8 text-muted">
                This Master&apos;s programme (LM-32) at the University of
                Cagliari runs over 2 years and 120 ECTS in line with the
                Bologna process, taught in English in Cagliari through the
                Department of Electrical and Electronic Engineering (DIEE).
                The curriculum is organised into four building blocks —
                Computer Engineering, Systems Engineering, Cybersecurity
                and Artificial Intelligence — with traineeship
                opportunities in Sardinia, Italy and Europe, plus a
                documented double-degree option and a final examination.
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "Computer Engineering block — core computer-engineering subjects",
                  "Systems Engineering block — systems-level engineering subjects",
                  "Cybersecurity block — security-focused subjects, within a programme listed in ENISA’s CyberHEAD higher-education database and the Cybersecurity National Lab’s Italian MSc database",
                  "Artificial Intelligence block — AI-focused subjects, alongside DIEE research laboratories working on cybersecurity and artificial intelligence",
                  "Traineeship opportunities in Sardinia, Italy and Europe, plus entrepreneurial projects through the University’s CREA innovation and entrepreneurship centre",
                ].map((topic) => (
                  <li key={topic} className="flex gap-3 leading-7 text-muted">
                    <span className="font-bold text-success">✓</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-6 text-muted">
                The blocks above summarise the official programme
                presentation at a high level. Confirm the current module
                list in the official study plan for your enrolment year.
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

          {isBioinfoSapienza && (
            <ContentSection
              id="what-you-study"
              title="What You’ll Study in Bioinformatics"
              icon={School}
            >
              <p className="leading-8 text-muted">
                This Bachelor&apos;s programme (L-2, programme code 33455)
                at Sapienza is a 3-year, English-taught, in-person
                interfaculty degree spanning Pharmacy and Medicine,
                Information Engineering, Computer Science and Statistics,
                Medicine and Dentistry, and Mathematical, Physical and
                Natural Sciences, with the Department of Molecular Medicine
                as the reference department. It follows a single
                curriculum combining biology, computer science,
                mathematics and statistics.
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "Year 1 areas — principles of mathematics, organic and inorganic chemistry, computer science with Python programming, physics, biomedical statistics and cell biology",
                  "Year 2 areas — genetics and computational genomics, algorithms, microbiology, molecular biology, biochemistry, immunology and molecular pathologies, pharmaceutical chemistry and Bioinformatics I with omics pipelines and structural bioinformatics",
                  "Year 3 areas — Bioinformatics II with network medicine, bioethics, molecular biology and genomics, plus electives such as algorithms, biomolecular networks and AI laboratory topics",
                  "Practical training with a traineeship, further linguistic and work-market skills, and a final thesis developed from the practical training",
                ].map((topic) => (
                  <li key={topic} className="flex gap-3 leading-7 text-muted">
                    <span className="font-bold text-success">✓</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-6 text-muted">
                The study-plan areas above summarise the official 2026
                curriculum at a high level. Confirm the current module
                list on the official catalogue pages for your enrolment
                year.
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

          {isEngMgmtPerugia && (
            <ContentSection
              id="what-you-study"
              title="What You’ll Study in Engineering Management"
              icon={School}
            >
              <p className="leading-8 text-muted">
                This Bachelor&apos;s programme (interclass L-8 and L-9) at
                the University of Perugia is a 3-year degree taught in
                English in Perugia through the Department of Engineering
                in conventional mode — delivered mainly in person with the
                option of attending live online if necessary. It trains a
                management engineer for manufacturing and service
                companies and public administration, combining industrial
                and information engineering with economics and management.
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "Year 1 areas — Mathematics I and Geometry, Mathematics II and Statistics, Manufacturing Engineering and Technology, Fundamentals of Computer Science and Physics",
                  "Year 2 areas — Systems Engineering, Engineering Economy, Strategic Business Management, Mathematical Methods, Energy Management, Facility Planning and Design, Control Systems and System Mechanics",
                  "Year 3 areas — Product Design, Industrial Automation with Production Systems and Computer Integrated Manufacturing, Production Planning, Quality Management and Organisational and Work Sociology, plus a guided choice between data analysis and industrial economics",
                  "Applied finish — free-choice modules, a curricular internship and a supervised final project (project work) summarising the knowledge acquired during the degree",
                ].map((topic) => (
                  <li key={topic} className="flex gap-3 leading-7 text-muted">
                    <span className="font-bold text-success">✓</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-6 text-muted">
                The study-plan areas above summarise the official teaching
                regulations at a high level. Confirm the current module
                list on the official department pages for your enrolment
                year.
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

          {isBioHealthBologna && (
            <ContentSection
              id="what-you-study"
              title="What You’ll Study in Biology of Human and Environmental Health"
              icon={School}
            >
              <p className="leading-8 text-muted">
                This 3-year First Cycle Degree (L-13 Biology, 180 ECTS) is
                delivered entirely in English through the Department of
                Biological, Geological, and Environmental Sciences (BiGeA)
                as a joint international programme with the University of
                Padua, with teaching locations in Padova and Bologna. The
                programme examines the biological bases of disease alongside
                human-environment interactions.
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "First-two-year foundation — cellular biology, genetics, bioinformatics, biostatistics and physiology areas",
                  "Third-year focus — biological bases of diseases or environmental influences on human health",
                  "Practical activities included alongside theoretical and methodological training",
                  "Theoretical and methodological approaches to human health and environmental influences",
                ].map((topic) => (
                  <li key={topic} className="flex gap-3 leading-7 text-muted">
                    <span className="font-bold text-success">✓</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-6 text-muted">
                The areas above summarise the official programme description
                at a high level. Confirm the current module list on the
                official Bologna programme pages for your enrolment year.
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

          {isBioHealthBologna && (
            <ContentSection
              id="skills"
              title="Human Health, Environmental Health and Research Skills"
              icon={BookOpen}
            >
              <p className="leading-8 text-muted">
                The programme builds understanding of the biological bases
                of disease together with the ways environmental factors
                affect human health. Training combines theoretical study
                with methodological approaches used in human and
                environmental health.
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "Disease biology — biological bases underlying human disease",
                  "Human-environment interactions — how environmental influences relate to human health",
                  "Biomarker identification skills for human and environmental health",
                  "Data-analysis and research methods for human and environmental health",
                ].map((topic) => (
                  <li key={topic} className="flex gap-3 leading-7 text-muted">
                    <span className="font-bold text-success">✓</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 leading-8 text-muted">
                Practical activities support this skills training. For
                broader context on preparing for science degrees in Italy,
                see our{" "}
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

          {isBergamoIMM && (
            <ContentSection
              id="what-you-study"
              title="What You’ll Study in International Management and Marketing"
              icon={School}
            >
              <p className="leading-8 text-muted">
                This 2-year Master&apos;s degree (LM-77, 120 ECTS) is
                delivered entirely in English through the Department of
                Management at the University of Bergamo, in conventional
                mode at the Campus of Economics and Law (Via dei Caniana 2,
                Bergamo). It is the programme &quot;International Management
                and Marketing&quot; (IMM), class LM-77 Scienze
                economico-aziendali, taught in English as documented in the
                official University of Bergamo course catalogue.
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "Two curricula from the first year — International Management and Marketing",
                  "International management area — business models, projects and digital processes in international economic and social contexts, entrepreneurial ideas for new ventures and existing firms, market diagnostics and business intelligence platforms",
                  "Marketing area — strategic and operational marketing, digital marketing management and new consumption models",
                  "Core business foundations — economic-business, statistical, digital and legal subjects that support the international manager and marketing specialist profile within an international and intercultural perspective",
                  "Experiential learning — case studies, field projects with national and international firms, simulations and group or individual operational work, with access to European and extra-European internships and thematic teaching programmes",
                ].map((topic) => (
                  <li key={topic} className="flex gap-3 leading-7 text-muted">
                    <span className="font-bold text-success">✓</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-6 text-muted">
                The areas above summarise the official University of Bergamo
                programme description at a high level. Confirm the current
                module list and curriculum structure on the official programme
                pages for your enrolment year.
              </p>
              <p className="mt-4 leading-8 text-muted">
                See the{" "}
                <a
                  href="https://ls-imm.unibg.it/en"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  official IMM programme site (ls-imm.unibg.it)
                </a>{" "}
                and the{" "}
                <a
                  href="https://www.unibg.it/studiare/corsi/offertaformativa/international-management-and-marketing"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  official University of Bergamo course catalogue page
                </a>
                . See how this English-taught degree fits among{" "}
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

          {isGenoaImperia && (
            <ContentSection
              id="what-you-study"
              title="What You'll Study in Computer Engineering (Imperia Campus)"
              icon={School}
            >
              <p className="leading-8 text-muted">
                This 3-year Bachelor&apos;s Degree (L-8 Information Engineering,
                180 CFU) is delivered entirely in English at the University of
                Genoa&apos;s Imperia campus through the Department of
                Informatics, Bioengineering, Robotics and Systems Engineering
                (DIBRIS) — Interscuola Politecnica. The programme is listed in
                the official University of Genoa catalogue as Computer
                Engineering at Imperia (course code 12133, class L-8 R), with
                teaching in Imperia and free (open) access subject to an initial
                preparation check.
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "Foundations — mathematical analysis, algebra and geometry, general physics, and probability for engineering",
                  "Computing and computation — algorithms, automata and computability, programming languages and software design",
                  "Systems and architectures — electronic computers and operating systems, computer networks and communication protocols",
                  "Data and intelligence — databases, artificial intelligence fundamentals and data-driven applications",
                  "Engineering breadth — electronics, telecommunications and control systems alongside management-engineering elements",
                  "Laboratory and project work alongside lectures, with practical activities that complement theory",
                ].map((topic) => (
                  <li key={topic} className="flex gap-3 leading-7 text-muted">
                    <span className="font-bold text-success">✓</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-6 text-muted">
                The areas above summarise the official University of Genoa
                programme description at a high level. Confirm the current
                module list and teaching regulations on the official programme
                pages for your enrolment year.
              </p>
              <p className="mt-4 leading-8 text-muted">
                See the{" "}
                <a
                  href="https://corsi.unige.it/en/corsi/12133"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  official UniGe course page for Computer Engineering at Imperia (corsi.unige.it/corsi/12133)
                </a>{" "}
                and the{" "}
                <a
                  href="https://www.unige.it/en/campus-details/imperia"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  official Imperia campus page (unige.it — Imperia)
                </a>{" "}
                and also{" "}
                <a
                  href="https://corsi.unige.it/corsi/12133"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  corsi.unige.it/corsi/12133 (Italian catalogue)
                </a>
                . See how this English-taught degree fits among{" "}
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

              {isGlobalAccountingFinanceCaFoscari && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Access procedure
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Limited access with online written entry test and
                      ranking-based selection
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Curricular requirement
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      60 out of 180 ECTS — 20 in Business including Business
                      Economics, plus 40 across Economics, Law and
                      Mathematics-Statistics
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Academic threshold
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Minimum 70% CGPA with transcript, CV and motivation
                      letter evaluation
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      English prerequisite
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      B2 level with accepted certification or exemption
                    </p>
                  </div>
                </div>
              )}

              {isGlobalAccountingFinanceCaFoscari && (
                <p className="mt-4 text-sm leading-6 text-muted">
                  Admission calls, deadlines, fees and application
                  procedures can change. Students should verify the current
                  Ca&apos; Foscari programme call before applying.
                </p>
              )}

              {isEconFinanceSapienza && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Access procedure
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Entrance test to verify knowledge (test code 14613)
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Programme code
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      34177 (L-33)
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Admission test route
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      TOLC-E or CEnT-S; CEnT-S or SAT for the
                      English-language curriculum
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Academic requirement
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Upper secondary diploma, obtained or to be obtained
                      in the admission year
                    </p>
                  </div>
                </div>
              )}

              {isEconFinanceSapienza && (
                <p className="mt-4 text-sm leading-6 text-muted">
                  Additional learning requirements (OFA) apply below the
                  official test thresholds and are completed in the first
                  year. Access follows the annual official Sapienza call
                  — verify the current call before applying.
                </p>
              )}

              {isBamSapienza && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Access procedure
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Entrance test to verify knowledge (test code 14613)
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Programme code
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      34175 (L-18)
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Admission test route
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      TOLC-E or CEnT-S; CEnT-S or SAT for the
                      English-language curriculum
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Academic requirement
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Upper secondary diploma, obtained or to be obtained
                      in the admission year
                    </p>
                  </div>
                </div>
              )}

              {isBamSapienza && (
                <p className="mt-4 text-sm leading-6 text-muted">
                  Additional learning requirements (OFA) apply below the
                  official test thresholds and are completed in the first
                  year. Access follows the annual official Sapienza call
                  — verify the current call before applying.
                </p>
              )}

              {isSbmFerrara && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Access procedure
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Open access with assessment of personal competencies
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Curricular requirement
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Bachelor&apos;s degree with at least 50 credits —
                      30 in business, 10 in economics, 5 in
                      mathematics-statistics and 5 in law
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Competence-assessment waiver
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Waived for final grades of 85/110 or above
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      English prerequisite
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      B2 level, via accepted certification or commission
                      interview
                    </p>
                  </div>
                </div>
              )}

              {isSbmFerrara && (
                <p className="mt-4 text-sm leading-6 text-muted">
                  Direct admission applies to matching
                  Economics/Management backgrounds (including L-18 and
                  L-33 classes). Admission calls, places and application
                  procedures can change. Students should verify the
                  current University of Ferrara programme call before
                  applying.
                </p>
              )}

              {isCosmisMilan && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Access procedure
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Open access subject to entry requirements, with a
                      compulsory entry test
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Curricular requirement
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      L-27 or L-29 degree, or at least 35 ECTS across
                      maths, physics, chemistry and biology — including
                      at least 25 ECTS in chemistry and biology, with at
                      least 15 ECTS in chemistry
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      English prerequisite
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      B2 level, verified through the University Language
                      Centre (SLAM)
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Entry assessment
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Compulsory test in biology and chemistry principles,
                      passed at 50% correct answers
                    </p>
                  </div>
                </div>
              )}

              {isCosmisMilan && (
                <p className="mt-4 text-sm leading-6 text-muted">
                  For 2026, the official admission notice schedules two
                  test sessions — 12 May 2026 and 9 September 2026 — with
                  candidates applying for a student visa participating in
                  the first session. Admission requirements must be met by
                  31 December 2026. Access follows the annual official
                  Milan call — verify the current call before applying.
                </p>
              )}

              {isEscpMarche && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Access procedure
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Free and open access, with a non-selective,
                      non-binding knowledge check
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Academic requirement
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Upper secondary diploma or recognised equivalent
                      foreign qualification
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      English prerequisite
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      B2 level for the English-taught programme
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Expected background
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Foundations in biology, chemistry, physics and
                      mathematics with an interest in environmental and
                      civil-protection themes
                    </p>
                  </div>
                </div>
              )}

              {isEscpMarche && (
                <p className="mt-4 text-sm leading-6 text-muted">
                  No selective admission test applies — the knowledge
                  check does not affect enrolment. Access follows the
                  annual official Marche call — verify the current call
                  before applying.
                </p>
              )}

              {isDebMarche && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Access procedure
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Free and open access, with pre-evaluation for
                      international qualifications
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      English prerequisite
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      B2 level for the English-taught programme
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Knowledge check
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Non-selective OFA test in mathematics and logic —
                      20 questions, passed with at least 8 correct
                      answers including one per subject area
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Exemption route
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      TOLC-E, TOLC-I or CEnT recognised for exemption at
                      40% in mathematics and logic, alongside SAT and
                      prior-university routes
                    </p>
                  </div>
                </div>
              )}

              {isDebMarche && (
                <p className="mt-4 text-sm leading-6 text-muted">
                  Missing the OFA threshold does not block enrolment but
                  assigns an additional learning requirement (OFA) to be
                  cleared in the first year. Access follows the annual
                  official Marche call — verify the current call before
                  applying.
                </p>
              )}

              {isCyberAiCagliari && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Access procedure
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Free (open) access with curricular requirements and
                      verification of personal preparation
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Curricular requirement
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      At least 12 ECTS in mathematics and physics, plus at
                      least 36 ECTS in computer science, computer
                      engineering and ICT — including at least 18 ECTS in
                      computer science and computer engineering
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      English prerequisite
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      B2-level English certification, waived where the
                      prior degree was mainly delivered in English
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Preparation check
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Committee assessment on mathematics, physics and
                      computer science topics, with an interview where the
                      file alone is not conclusive
                    </p>
                  </div>
                </div>
              )}

              {isCyberAiCagliari && (
                <p className="mt-4 text-sm leading-6 text-muted">
                  Foreign applicants go through an online pre-evaluation
                  with a dedicated foreign-student quota noted on the
                  official prospective-student page. Access follows the
                  annual official Cagliari call — verify the current call
                  before applying.
                </p>
              )}

              {isBioinfoSapienza && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Access procedure
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Restricted access with admission test (programme code
                      33455, test code 12952)
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Current admission route
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      CEnT-S examination with a total score over 18 under
                      the 2026-2027 call
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      English prerequisite
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      B2-level English, as the CEnT-S route is conducted
                      in English
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      International route
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      MoveIn pre-selection for non-EU applicants residing
                      abroad, with a dedicated non-EU quota selection
                    </p>
                  </div>
                </div>
              )}

              {isBioinfoSapienza && (
                <p className="mt-4 text-sm leading-6 text-muted">
                  The English TOLC-F route belonged to the previous
                  admission year; the current 2026-2027 call uses CEnT-S.
                  Access follows the annual official Sapienza call —
                  verify the current call before applying.
                </p>
              )}

              {isEngMgmtPerugia && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Access procedure
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Free access with a sustainable capacity of 180
                      students, including a 60-place visa-applicant quota
                      under the 2026-2027 regulations
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      English prerequisite
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      B2-level English or equivalent — obtainable by the
                      end of the first year, but required at visa
                      application for visa applicants
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Admission test routes
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      TOLC-I, CEnT-S, SAT or ACT under the current
                      department rules — for example TOLC-I 14/50 with at
                      least 7/20 in mathematics
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Knowledge check
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Mandatory mathematics, logic and verbal-comprehension
                      check — below the threshold assigns an additional
                      learning requirement (OFA) without blocking
                      enrolment, except for visa applicants
                    </p>
                  </div>
                </div>
              )}

              {isEngMgmtPerugia && (
                <p className="mt-4 text-sm leading-6 text-muted">
                  Missing the test entirely blocks registration for the
                  first mathematics-area exam until it is taken. Access
                  follows the annual official Perugia regulations —
                  verify the current call before applying.
                </p>
              )}

              {isBioHealthBologna && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Access procedure
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Restricted access — check the official admission page
                      for the current procedure
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <p className="text-sm font-medium text-muted">
                      Teaching language
                    </p>
                    <p className="mt-2 font-semibold leading-6 text-foreground">
                      Delivered entirely in English
                    </p>
                  </div>
                </div>
              )}

              {isBioHealthBologna && (
                <p className="mt-4 text-sm leading-6 text-muted">
                  The programme is a 3-year First Cycle Degree (L-13
                  Biology, 180 ECTS) run jointly with the University of
                  Padua. Access follows the annual official Bologna call
                  — verify the current admission page before applying.
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

          {isGlobalAccountingFinanceCaFoscari && (
            <ContentSection
              id="careers"
              title="Career Opportunities and Further Study"
              icon={GraduationCap}
            >
              <p className="leading-8 text-muted">
                According to Ca&apos; Foscari&apos;s official programme
                description, this Master&apos;s provides professional
                preparation in accounting and finance for global business
                contexts, assessed through transcript, CV and motivation
                letter review alongside the entry test.
              </p>
              <p className="mt-4 leading-8 text-muted">
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

          {isEconFinanceSapienza && (
            <ContentSection
              id="careers"
              title="Career Opportunities and Further Study"
              icon={GraduationCap}
            >
              <p className="leading-8 text-muted">
                According to Sapienza&apos;s official programme
                description, graduates combine economic knowledge with
                theoretical and quantitative tools for administrative and
                managerial careers in private and public enterprises,
                European and international organisations, and national and
                international research institutions — including finance,
                international cooperation, and sustainable-resource
                management roles.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Documented professional profiles include international
                economic analyst, environmental-economic analyst, and
                economic and financial analyst. The degree also provides
                preparation for Master&apos;s-level study in economics and
                finance. For broader planning, see our{" "}
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

          {isBamSapienza && (
            <ContentSection
              id="careers"
              title="Career Opportunities and Further Study"
              icon={GraduationCap}
            >
              <p className="leading-8 text-muted">
                According to Sapienza&apos;s official programme
                description, documented profiles cover business consulting,
                banking, insurance and financial consulting, management
                consulting, and management-assistance roles — across
                planning, budgeting, auditing, strategy, credit and
                finance, organisation, production, marketing, logistics,
                and accounting functions.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Graduates work in industrial, commercial and service firms,
                banks and financial institutions, public administration,
                non-profit organisations, and professional studios. The
                programme also documents a pathway toward the regulated
                professions of esperto contabile and revisore legale after
                traineeship and the state examination, and continuation to
                Master&apos;s-level study. For broader planning, see our{" "}
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

          {isSbmFerrara && (
            <ContentSection
              id="careers"
              title="Career Opportunities and Further Study"
              icon={GraduationCap}
            >
              <p className="leading-8 text-muted">
                According to the University of Ferrara&apos;s official
                programme description, graduates are prepared for
                management or consultancy positions in small businesses
                operating in international markets — including management
                consultancy, general management, marketing, and human
                resources roles, as well as business start-ups and family
                business succession.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Documented outlets also include public research institutes
                and venture-capital firms and banks, with a pathway toward
                PhD research in entrepreneurship and related fields. For
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

          {isCosmisMilan && (
            <ContentSection
              id="careers"
              title="Career Opportunities and Further Study"
              icon={GraduationCap}
            >
              <p className="leading-8 text-muted">
                According to the University of Milan&apos;s official
                programme description, graduates are prepared for qualified
                positions at different levels within cosmetic companies —
                covering research and development, industrial production,
                quality control, regulatory work for placing new products
                on the market, and marketing-related roles. The internship
                project feeds directly into the English-language thesis.
              </p>
              <p className="mt-4 leading-8 text-muted">
                The Master&apos;s degree also documents a pathway toward
                doctoral (PhD) study and further research training. For
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

          {isEscpMarche && (
            <ContentSection
              id="careers"
              title="Career Opportunities and Further Study"
              icon={GraduationCap}
            >
              <p className="leading-8 text-muted">
                According to the Polytechnic University of Marche&apos;s
                official programme description, graduates take on
                technical-operational roles in public and private
                organisations — spanning environmental monitoring,
                environmental remediation and civil-protection work, from
                field sampling and laboratory analysis through emergency
                planning and emergency cooperation.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Graduates can apply to Section B of the junior
                professional registers — junior biologist, junior planner,
                graduate agricultural technician and graduate land
                surveyor — and can continue toward second-level study in
                the LM-75 class, including the Marche Master&apos;s in
                environmental risk and civil protection. For broader
                planning, see our{" "}
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

          {isDebMarche && (
            <ContentSection
              id="careers"
              title="Career Opportunities and Further Study"
              icon={GraduationCap}
            >
              <p className="leading-8 text-muted">
                According to the Polytechnic University of Marche&apos;s
                official programme description, the degree trains three
                professional directions: the data-driven economic and
                financial analyst, the data-driven business analyst, and
                the data analyst for economics and business — producing
                relevant information from corporate, real-market and
                financial-market data to guide company and institutional
                decision-making.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Graduates work with companies, consultancies, public
                bodies and financial institutions, or continue to a
                Master&apos;s degree consistent with the programme. For
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

          {isCyberAiCagliari && (
            <ContentSection
              id="careers"
              title="Career Opportunities and Further Study"
              icon={GraduationCap}
            >
              <p className="leading-8 text-muted">
                According to the University of Cagliari&apos;s official
                programme pages, this LM-32 Master&apos;s prepares
                computer engineers for roles spanning cybersecurity and
                artificial intelligence — within a programme listed in
                ENISA&apos;s CyberHEAD higher-education database and the
                Cybersecurity National Lab&apos;s Italian MSc database,
                and connected to DIEE research laboratories in these
                fields.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Documented pathways include traineeships in Sardinia,
                Italy and Europe, entrepreneurial projects through the
                CREA centre, and a double-degree option. For broader
                planning, see our{" "}
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

          {isBioinfoSapienza && (
            <ContentSection
              id="careers"
              title="Career Opportunities and Further Study"
              icon={GraduationCap}
            >
              <p className="leading-8 text-muted">
                According to Sapienza&apos;s official catalogue, documented
                profiles include Bioinformatician, Biological Data
                analyst and modeller, Biological Data manager, Biological
                Data Integration Professional and Tools Developer for
                biological data — working with biomedical research
                bodies, hospitals and healthcare structures, and the
                biomedical, pharmaceutical, biotechnology and medical IT
                industries.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Graduates can also continue to Master&apos;s degrees in
                areas such as biochemistry, molecular biology, genomic
                biotechnology and data science. For broader planning, see
                our{" "}
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

          {isEngMgmtPerugia && (
            <ContentSection
              id="careers"
              title="Career Opportunities and Further Study"
              icon={GraduationCap}
            >
              <p className="leading-8 text-muted">
                According to the University of Perugia&apos;s official
                department pages, the degree trains a management
                engineer for manufacturing and service companies and
                public administration — working with information and
                communication systems, economics and business
                organisation, decision modelling, marketing, production
                processes and logistics, and safety and quality
                management.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Documented pathways include a curricular internship
                through department company agreements, continuation to
                the Engineering Management Master&apos;s degree, the
                state examination for the engineering profession, and
                Erasmus+ study and traineeship mobility. For broader
                planning, see our{" "}
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

          {isBioHealthBologna && (
            <ContentSection
              id="careers"
              title="Career Opportunities and Further Study"
              icon={GraduationCap}
            >
              <p className="leading-8 text-muted">
                According to the University of Bologna&apos;s official
                course pages, the programme describes guidance, internships
                and support for students moving into further study or
                work. Graduates may, after the relevant State examination,
                enrol in the professional register as junior Biologist.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Further study can include second-cycle degrees and
                first-level university master&apos;s programmes. For
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

          {isBergamoIMM && (
            <ContentSection
              id="careers"
              title="Career Opportunities and Further Study"
              icon={GraduationCap}
            >
              <p className="leading-8 text-muted">
                According to the University of Bergamo&apos;s official
                programme description, this Master&apos;s forms two main
                professional profiles — the international manager and the
                marketing manager — able to work in highly dynamic national
                and international contexts focused on innovation and the
                digitalisation of services and products, where competition
                is global and contexts are multicultural.
              </p>
              <p className="mt-4 leading-8 text-muted">
                The course documents outlets across entrepreneurship and
                business development for new and existing firms, digital
                project management, international management and export
                management, digital business advisory, innovation strategy,
                global leadership, multicultural management and business
                internacional areas supported by business intelligence
                platforms and field projects. For broader planning, see our{" "}
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

          {isGenoaImperia && (
            <ContentSection
              id="careers"
              title="Career Opportunities and Further Study"
              icon={GraduationCap}
            >
              <p className="leading-8 text-muted">
                According to the University of Genoa&apos;s official programme
                description, Computer Engineering at Imperia trains a Bachelor-
                level computer engineer able to design, develop and manage
                information systems and computer networks. Graduates combine
                scientific foundations in mathematics and physics with core
                informatics and engineering skills applicable across IT and
                engineering sectors.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Documented outlets include IT industries operating in hardware
                and software production, automation and robotics industries,
                companies operating in information systems and computer
                networks, service companies and public-administration IT
                services. The three-year Bachelor&apos;s also provides a pathway
                to Master&apos;s-level study in Computer Engineering and related
                LM-32 / LM-18 programmes. For broader planning, see our{" "}
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

          {isGlobalAccountingFinanceCaFoscari && (
            <ContentSection
              id="access-and-international"
              title="Access, Study Plan and International Opportunities"
              icon={Languages}
            >
              <p className="leading-8 text-muted">
                This is a limited-access Master&apos;s programme (LM-77 R)
                at the Venice School of Management, running over 2 years
                and 120 ECTS in English at Venice. Admission runs through
                an online written entry test with ranking-based selection
                across two selection rounds. Eligible candidates hold a
                Bachelor&apos;s degree or equivalent and meet a 60-out-of-180
                ECTS curricular bar — 20 credits in Business including
                Business Economics, plus 40 credits across Economics, Law
                and Mathematics-Statistics — alongside a minimum 70% CGPA,
                with transcript, CV and motivation letter reviewed by the
                Teaching Committee. B2-level English is mandatory for
                enrolment through accepted certifications or exemptions.
              </p>
              <p className="mt-4 leading-8 text-muted">
                The programme documents double-degree options and
                international mobility opportunities — confirm current
                options in the official call before planning around them.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Students applying from India should verify the current
                Ca&apos; Foscari programme call, curricular eligibility,
                English-language documentation and application requirements
                before applying. See the{" "}
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

          {isEconFinanceSapienza && (
            <ContentSection
              id="access-and-international"
              title="Access, Study Plan and International Opportunities"
              icon={Languages}
            >
              <p className="leading-8 text-muted">
                This is a Bachelor&apos;s programme (L-33, programme code
                34177) with an entrance test to verify knowledge (test code
                14613). The English-language curriculum is accessed through
                CEnT-S or SAT, while the broader admission regime also
                recognises TOLC-E. Teaching follows conventional in-person
                delivery, with English-track schedules published alongside
                the official call.
              </p>
              <p className="mt-4 leading-8 text-muted">
                International applicants follow Sapienza&apos;s
                pre-selection process with the admission-call procedures,
                including foreign-qualification documentation. Confirm
                current test sessions, enrolment steps and mobility options
                in the official call before planning around them.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Students applying from India should verify the current
                Sapienza programme call, academic eligibility and
                English-language documentation requirements before
                applying. See the{" "}
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

          {isBamSapienza && (
            <ContentSection
              id="access-and-international"
              title="Access, Study Plan and International Opportunities"
              icon={Languages}
            >
              <p className="leading-8 text-muted">
                This is a Bachelor&apos;s programme (L-18, programme code
                34175) with an entrance test to verify knowledge (test code
                14613). The English-language curriculum is accessed through
                CEnT-S or SAT, while the broader admission regime also
                recognises TOLC-E. Teaching follows conventional in-person
                delivery, with a taught-in-English pathway structured
                alongside the general programme.
              </p>
              <p className="mt-4 leading-8 text-muted">
                International applicants follow Sapienza&apos;s
                pre-selection process with the admission-call procedures,
                including foreign-qualification documentation. Confirm
                current test sessions, enrolment steps and mobility options
                in the official call before planning around them.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Students applying from India should verify the current
                Sapienza programme call, academic eligibility and
                English-language documentation requirements before
                applying. See the{" "}
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

          {isSbmFerrara && (
            <ContentSection
              id="access-and-international"
              title="Access, Study Plan and International Opportunities"
              icon={Languages}
            >
              <p className="leading-8 text-muted">
                This is an open-access Master&apos;s programme (LM-77)
                running over 2 years and 120 ECTS in English at Ferrara,
                with an assessment of personal competencies. Teaching is
                face-to-face, and attendance is not mandatory but is highly
                recommended. Documented double-degree options include
                partner universities in Sweden, Germany and Spain —
                confirm current options in the official call before
                planning around them.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Ferrara&apos;s official application portal describes a
                €20 one-time application fee and an annual fee range of
                about €156 to €2,250 calculated on family income and
                credits obtained. Teaching follows a multi-method,
                interactive format with Erasmus+ and study-abroad options
                alongside thesis-linked internships.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Students applying from India should verify the current
                Ferrara programme call, curricular eligibility,
                English-language documentation and visa-related steps
                before applying. See the{" "}
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

          {isCosmisMilan && (
            <ContentSection
              id="access-and-international"
              title="Access, Study Plan and International Opportunities"
              icon={Languages}
            >
              <p className="leading-8 text-muted">
                This is an open-access Master&apos;s programme (LM-71 R)
                subject to entry requirements, running over 2 years and
                120 ECTS in English in Milan with a blended study mode.
                Admission requires an L-27 or L-29 background, or at least
                35 ECTS across maths, physics, chemistry and biology with
                the official chemistry/biology distribution, alongside B2
                English verified through SLAM and a compulsory
                biology-and-chemistry entry test. The final semester
                centres on the compulsory internship and the
                English-language thesis.
              </p>
              <p className="mt-4 leading-8 text-muted">
                For 2026, the official admission notice accepts online
                applications from 22 January to 25 August 2026, with
                non-EU applicants applying for a visa applying from 22
                January to 30 April 2026. Entry tests run on 12 May 2026
                and 9 September 2026 — visa applicants sit the first
                session — and admitted candidates enrol from 5 May 2026
                until 15 January 2027. Confirm current dates and steps in
                the official call before planning around them.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Students applying from India should verify the current
                Milan programme call, curricular eligibility,
                English-language documentation and visa-related steps
                before applying. See the{" "}
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

          {isEscpMarche && (
            <ContentSection
              id="access-and-international"
              title="Access, Study Plan and International Opportunities"
              icon={Languages}
            >
              <p className="leading-8 text-muted">
                This is a free, open-access Bachelor&apos;s programme
                (L-32) taught in English in Ancona over 3 years.
                Enrolment requires an upper secondary diploma or
                recognised equivalent, B2-level English and the
                scientific foundations above; the knowledge check is
                non-selective and non-binding. Teaching combines lectures
                with laboratory and field activities, an internship in
                external institutions or university laboratories, and
                professionalising electives such as data analysis,
                contaminant analysis, GIS applications and workplace
                safety.
              </p>
              <p className="mt-4 leading-8 text-muted">
                The programme documents international exchange
                opportunities alongside partnerships with regional and
                national authorities, research bodies and companies —
                confirm current options in the official call before
                planning around them.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Students applying from India should verify the current
                Marche programme call, academic eligibility,
                English-language documentation and visa-related steps
                before applying. See the{" "}
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

          {isDebMarche && (
            <ContentSection
              id="access-and-international"
              title="Access, Study Plan and International Opportunities"
              icon={Languages}
            >
              <p className="leading-8 text-muted">
                This is a free, open-access Bachelor&apos;s programme
                (interclass L-33 and L-18, 180 ECTS) taught entirely in
                English in Ancona over 3 years. International applicants
                with foreign qualifications go through a pre-evaluation of
                curricular background, B2 English and personal preparation
                by a dedicated commission. Before enrolment, candidates
                sit an English-language logic-and-mathematics check that
                is non-selective: it supports self-assessment and, below
                the threshold, assigns an additional learning requirement
                (OFA) cleared in the first year. TOLC-E, TOLC-I or CEnT
                results are recognised as an exemption route under the
                official wording.
              </p>
              <p className="mt-4 leading-8 text-muted">
                The programme documents Erasmus+ and Campus World
                exchanges plus agreements with foreign universities, with
                laboratory and project work running across the three years
                — confirm current options in the official pages before
                planning around them.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Students applying from India should verify the current
                Marche programme call, pre-evaluation steps,
                English-language documentation and visa-related steps
                before applying. See the{" "}
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

          {isCyberAiCagliari && (
            <ContentSection
              id="access-and-international"
              title="Access, Study Plan and International Opportunities"
              icon={Languages}
            >
              <p className="leading-8 text-muted">
                This is a free-access Master&apos;s programme (LM-32)
                running over 2 years and 120 ECTS in English in Cagliari,
                subject to the mathematics, physics and ICT curricular
                requirements and B2 English above, plus a committee check
                of personal preparation. Enrolment for the preparation
                check runs through the Esse3 online services within the
                General Manifesto deadlines, and upcoming graduates may
                apply conditionally under the student-career rules.
              </p>
              <p className="mt-4 leading-8 text-muted">
                The programme documents traineeship mobility in Sardinia,
                Italy and Europe alongside a double-degree option —
                confirm current options on the official pages before
                planning around them.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Students applying from India should verify the current
                Cagliari programme call, curricular eligibility,
                English-language documentation and visa-related steps
                before applying. See the{" "}
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

          {isBioinfoSapienza && (
            <ContentSection
              id="access-and-international"
              title="Access, Study Plan and International Opportunities"
              icon={Languages}
            >
              <p className="leading-8 text-muted">
                This is a restricted-access Bachelor&apos;s programme
                (L-2, programme code 33455) with selection through the
                CEnT-S examination (test code 12952) under the current
                2026-2027 call, registered via Infostud. Teaching follows
                conventional in-person delivery in English, and
                international applicants follow Sapienza&apos;s
                pre-selection process with foreign-qualification
                documentation.
              </p>
              <p className="mt-4 leading-8 text-muted">
                The catalogue documents international experiences and
                study-abroad options through Sapienza&apos;s
                International Office — confirm current options in the
                official call before planning around them.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Students applying from India should verify the current
                Sapienza programme call, academic eligibility and
                English-language documentation requirements before
                applying. See the{" "}
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

          {isEngMgmtPerugia && (
            <ContentSection
              id="access-and-international"
              title="Access, Study Plan and International Opportunities"
              icon={Languages}
            >
              <p className="leading-8 text-muted">
                This is a free-access Bachelor&apos;s programme
                (interclass L-8 and L-9) taught in English in Perugia
                over 3 years, within a 180-student sustainable capacity
                that includes a 60-place visa-applicant quota under the
                2026-2027 regulations. Admission combines the B2 English
                rule with a mandatory TOLC-I, CEnT-S, SAT or ACT check
                that is non-blocking except for visa applicants, and
                teaching runs mainly in person with live-online
                attendance possible where needed.
              </p>
              <p className="mt-4 leading-8 text-muted">
                The programme documents Erasmus+ study and traineeship
                mobility, a curricular internship through extensive
                company agreements, and continuation to the Engineering
                Management Master&apos;s — confirm current options in
                the official pages before planning around them.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Students applying from India should verify the current
                Perugia regulations, the dedicated 2026/2027
                pre-enrolment procedure for visa applicants,
                English-language documentation and visa-related steps
                before applying. See the{" "}
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

          {isBioHealthBologna && (
            <ContentSection
              id="access-and-international"
              title="Access, Study Plan and International Opportunities"
              icon={Languages}
            >
              <p className="leading-8 text-muted">
                This is a restricted-access, 3-year First Cycle Degree
                (L-13 Biology, 180 ECTS) delivered entirely in English as
                a joint degree with the University of Padua, with teaching
                locations in Padova and Bologna through the Department of
                Biological, Geological, and Environmental Sciences
                (BiGeA). Admission details sit alongside the existing
                admission requirements above — always verify the current
                official Bologna admission page for the applicable
                procedure.
              </p>
              <p className="mt-4 leading-8 text-muted">
                International opportunities documented on the official
                pages include internships in international organisations
                and exchange programmes, alongside practical activities
                during the degree. Confirm current options on the official
                programme pages before planning around them.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Students applying from India should use this English-taught
                biology pathway as a starting point and then verify the
                current Bologna programme call, academic eligibility and
                admission steps before applying. See our{" "}
                <Link
                  href="/study-in-italy"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  Study in Italy guide
                </Link>
                , the{" "}
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

          {isBergamoIMM && (
            <ContentSection
              id="access-and-international"
              title="Access, Study Plan and International Opportunities"
              icon={Languages}
            >
              <p className="leading-8 text-muted">
                This is a 2-year Master&apos;s degree (LM-77) delivered
                entirely in English at the University of Bergamo in
                conventional mode, as documented in the official ordinance
                for 2025/2026. Admission is subject to verification of
                curricular requirements and adequate preparation; the
                official call describes a candidate evaluation process for
                Italian and foreign qualification holders.
              </p>
              <p className="mt-4 leading-8 text-muted">
                The programme documents two curricula (International
                Management and Marketing) from the first year, a study plan
                organised over two years for 120 ECTS, and an international
                and multicultural learning experience with experiential
                methods — case studies, field projects, simulations and work
                in groups or individually — and visiting professors and
                international students.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Documented international opportunities include a Double
                Degree with the University of Stuttgart (Germany), agreements
                such as the Double Degree with Krems and the Joint Degree
                MERCURI, the Global Business Internship project with
                international companies, and a broader portfolio of mobility
                supported by cooperation agreements including Johannes Kepler
                Universität Linz (Austria) and Erasmus+ where published.
                Teaching includes business intelligence platform practice
                and thematic teaching programmes, with European and
                extra-European internships. Confirm current double-degree,
                mobility and internship options in the official call before
                planning around them.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Access follows the annual official University of Bergamo
                call — verify the current call for eligibility, documents
                and procedures before applying. International applicants
                should also check the applicable non-EU and Universitaly
                steps and visa process. See the{" "}
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

          {isGenoaImperia && (
            <ContentSection
              id="access-and-international"
              title="Access, Study Plan and International Opportunities"
              icon={Languages}
            >
              <p className="leading-8 text-muted">
                This is a free-access Bachelor&apos;s Degree (L-8 Information
                Engineering, 180 CFU) delivered in English at the Imperia
                campus over 3 years. Enrolment requires an upper secondary
                diploma (or recognised equivalent) and a verification of initial
                preparation as documented on the official course page (course
                code 12133). The verification follows the modalities published
                for the Imperia location — confirm dates and procedures on the
                official page before planning around them.
              </p>
              <p className="mt-4 leading-8 text-muted">
                The study plan follows the 3-year, 180-CFU structure for class
                L-8 R through DIBRIS — Interscuola Politecnica — with teaching
                at Imperia. Laboratory and project activities complement
                lectures. Documents such as the manifesto degli studi, didattica
                programmata and regolamento for 2026/2027 are published on the
                official course site.
              </p>
              <p className="mt-4 leading-8 text-muted">
                International opportunities documented by UniGe include Erasmus+
                study and traineeship mobility and department partnerships.
                Foreign qualification holders follow the dedicated international
                enrolments information indicated for the Imperia location, with
                Italian-language proof waived where the course is taught in
                English — verify the current UniGe portal and official call
                before applying.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Access follows the annual official University of Genoa call —
                verify the current call for eligibility, documents and
                procedures before applying. International applicants should also
                check the applicable non-EU and Universitaly steps and visa
                process. See the{" "}
                <a
                  href="https://corsi.unige.it/en/corsi/12133"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  official UniGe course page (corsi.unige.it/en/corsi/12133)
                </a>
                ,{" "}
                <a
                  href="https://corsi.unige.it/corsi/12133"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  corsi.unige.it/corsi/12133
                </a>
                ,{" "}
                <a
                  href="https://www.unige.it/en/campus-details/imperia"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  official Imperia campus page (unige.it — Imperia)
                </a>{" "}
                and{" "}
                <a
                  href="https://unige.it/en/poli/imperia"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  unige.it/en/poli/imperia
                </a>
                . For application guidance see the{" "}
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
                . See also{" "}
                <Link
                  href="/english-taught-courses-in-italy"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  English-taught courses in Italy
                </Link>{" "}
                and the{" "}
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

          {isEnergyUnimore && (
            <ContentSection
              id="what-you-study"
              title="What You’ll Study in Energy Engineering"
              icon={School}
            >
              <p className="leading-8 text-muted">
                This is a Master&apos;s degree in Energy Engineering (LM-30
                Energy and Nuclear Engineering) running over 2 years in
                English in Reggio Emilia through the Department of Sciences
                and Methods for Engineering (DISMI). The programme focuses
                on energy transition and electrification across energy
                systems and processes.
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "Energy Systems and Processes area — energy systems and processes, renewable energy and energy efficiency",
                  "Power Generation and Conversion area — power generation and conversion with electricity and hydrogen as energy sources and carriers",
                  "Energy transition and electrification focus across both areas",
                  "Applied finish — work experience and a final examination",
                ].map((topic) => (
                  <li key={topic} className="flex gap-3 leading-7 text-muted">
                    <span className="font-bold text-success">✓</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-6 text-muted">
                The areas above summarise the official UNIMORE programme
                description at a high level. Confirm the current teaching
                plan on the official programme pages for your enrolment
                year.
              </p>
              <p className="mt-4 leading-8 text-muted">
                See the{" "}
                <a
                  href="https://www.unimore.it/en/education/degree-programmes/energy-engineering"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  official UNIMORE degree-programme page
                </a>{" "}
                and the{" "}
                <a
                  href="https://dismi.unimore.it/en/education/masters-degree-programmes/energy-engineering"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  official DISMI masters-programme page
                </a>
                . See how this English-taught degree fits among{" "}
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
                </Link>{" "}
                or by{" "}
                <Link
                  href="/courses"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  browsing all courses in Italy
                </Link>
                .
              </p>
            </ContentSection>
          )}

          {isEnergyUnimore && (
            <ContentSection
              id="access-and-international"
              title="Access, Study Plan and International Opportunities"
              icon={Languages}
            >
              <p className="leading-8 text-muted">
                This is a free-access Master&apos;s programme delivered
                entirely in English in blended mode. The department
                describes delivery as approximately 50% face-to-face and
                50% online. Admission requires English at B2 level alongside
                prior university credits: a minimum of 33 credits in
                specified mathematics, physics and chemistry areas and a
                minimum of 12 credits in specified engineering-energy
                areas. Verify the exact credit tables on the current
                official admission pages before applying.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Official 2026/27 calls exist for this programme. Treat any
                dates, places and procedures drawn from those calls as
                2026/27 call-specific rather than evergreen, and always
                verify the current programme call. Extra-EU applicants
                should verify the current programme call and the applicable
                Universitaly and embassy process. See the{" "}
                <a
                  href="https://dismi.unimore.it/en/services/future-student/admission-procedures-masters-degree-programmes"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  official DISMI admission-procedures page
                </a>{" "}
                and the{" "}
                <a
                  href="https://www.unimore.it/en/university/calls/call-application-and-results-energy-engineering-reserved-extra-ue-students"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  official 2026/27 extra-EU call page
                </a>
                .
              </p>
              <p className="mt-4 leading-8 text-muted">
                For students applying from India: verify the current
                programme admission requirements, verify academic-credit
                eligibility against the 33-credit and 12-credit rules,
                prepare foreign-qualification documentation, follow the
                applicable non-EU and Universitaly process where required,
                and check the current programme call before applying. See
                the{" "}
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
                , the{" "}
                <Link
                  href="/study-in-italy"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  Study in Italy guide
                </Link>
                ,{" "}
                <Link
                  href="/italy-scholarships"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  Italy scholarships guidance
                </Link>
                ,{" "}
                <Link
                  href="/english-taught-courses-in-italy"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  English-taught courses in Italy
                </Link>
                , the{" "}
                <Link
                  href={`/universities/${university.slug}`}
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  {university.name} page
                </Link>{" "}
                and{" "}
                <Link
                  href="/courses"
                  className="font-semibold text-primary transition hover:text-primary-hover hover:underline"
                >
                  all courses in Italy
                </Link>
                .
              </p>
            </ContentSection>
          )}

          {isEnergyUnimore && (
            <ContentSection
              id="careers"
              title="Career Opportunities and Further Study"
              icon={GraduationCap}
            >
              <p className="leading-8 text-muted">
                According to UNIMORE&apos;s official programme pages, the
                degree develops knowledge relevant to energy systems and
                processes, power generation and conversion, renewable
                energy, energy efficiency, and electrification and energy
                transition, including electricity and hydrogen as energy
                sources and carriers.
              </p>
              <p className="mt-4 leading-8 text-muted">
                Further study can include doctoral and other postgraduate
                pathways where admission requirements are met. For broader
                planning, see our{" "}
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