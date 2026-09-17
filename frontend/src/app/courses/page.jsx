import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import CoursesExplorer from "@/components/home/courses/CoursesExplorer";

const CANONICAL = "https://www.europeandreamss.com/courses";

const PAGE_TITLE = "Courses in Italy for International Students";
const PAGE_DESCRIPTION =
  "Explore courses in Italy for international and Indian students. Compare Bachelor\u2019s, Master\u2019s and PhD programmes, universities, study levels and admission options.";

const breadcrumbItems = [
  { name: "Home", href: "https://www.europeandreamss.com/" },
  { name: "Courses in Italy", href: CANONICAL },
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

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${CANONICAL}#webpage`,
  url: CANONICAL,
  name: "Courses in Italy for International Students | European Dreams",
  description: PAGE_DESCRIPTION,
  isPartOf: { "@id": "https://www.europeandreamss.com/#website" },
  breadcrumb: { "@id": `${CANONICAL}#breadcrumb` },
  inLanguage: "en-IN",
};

function getFirst(value) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const search = String(getFirst(params?.search) ?? "").trim();
  const degreeLevel = String(getFirst(params?.degreeLevel) ?? "").trim();
  const country = String(getFirst(params?.country) ?? "").trim();

  const hasFilter = Boolean(search || degreeLevel || country);
  const page = parsePage(getFirst(params?.page));

  const canonical =
    !hasFilter && page > 1 ? `${CANONICAL}?page=${page}` : CANONICAL;

  return {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${PAGE_TITLE} | European Dreams`,
      description: PAGE_DESCRIPTION,
      url: canonical,
      siteName: "European Dreams",
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${PAGE_TITLE} | European Dreams`,
      description: PAGE_DESCRIPTION,
    },
    robots: hasFilter ? { index: false, follow: true } : { index: true, follow: true },
  };
}

function parsePage(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 1) return 1;
  return Math.floor(num);
}

async function fetchCourses({ page, search, degreeLevel, country }) {
  const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.europeandreamss.com").replace(/\/+$/, "");
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", "12");
  params.set("sort", "displayOrder");
  params.set("order", "asc");
  if (search) params.set("search", search);
  if (degreeLevel) params.set("degreeLevel", degreeLevel);
  if (country) params.set("country", country);

  const url = `${API_URL}/api/courses?${params.toString()}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return { courses: [], pagination: { currentPage: page, totalPages: 0, totalItems: 0, limit: 12 } };
    }
    const json = await res.json();
    const data = json?.data ?? {};
    return {
      courses: data.courses ?? [],
      pagination: data.pagination ?? { currentPage: page, totalPages: 0, totalItems: 0, limit: 12 },
    };
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return { courses: [], pagination: { currentPage: page, totalPages: 0, totalItems: 0, limit: 12 } };
  }
}

export default async function CoursesPage({ searchParams }) {
  const params = await searchParams;
  const search = String(getFirst(params?.search) ?? "").trim();
  const degreeLevel = String(getFirst(params?.degreeLevel) ?? "").trim();
  const country = String(getFirst(params?.country) ?? "").trim();
  const page = parsePage(getFirst(params?.page));

  const { courses, pagination } = await fetchCourses({ page, search, degreeLevel, country });

  if ((pagination.totalPages > 0 && page > pagination.totalPages) || (page > 1 && courses.length === 0)) {
    notFound();
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={collectionSchema} />
      <main className="min-h-screen bg-background">
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-300 px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-6">
              <Breadcrumbs items={breadcrumbItems} />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-secondary">
              Study programmes
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Courses in Italy for International Students
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              Explore courses at Italian universities for international and
              Indian students. Compare Bachelor&apos;s and Master&apos;s
              courses, English-taught programmes, universities, admission
              requirements, tuition fees and scholarships.
            </p>
          </div>
        </section>
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-300 px-5 py-10 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Explore Courses in Italy
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-muted">
              Browse study programmes across Italy by university, degree
              level, subject and country. Most international students focus
              on English-taught Bachelor&apos;s and Master&apos;s courses —
              see our{" "}
              <Link
                href="/english-taught-courses-in-italy"
                className="font-semibold text-primary hover:underline"
              >
                English-taught courses in Italy guide
              </Link>{" "}
              for how to find and verify them. Shortlist a few options,
              then verify admission requirements, language rules, deadlines
              and fees for each programme.
            </p>
            <p className="mt-3 max-w-3xl leading-7 text-muted">
              Once you have a shortlist, the guides below explain what comes
              next, from applications to visas.{" "}
              <Link
                href="/study-in-italy"
                className="font-semibold text-primary hover:underline"
              >
                Study in Italy guide
              </Link>
              {", "}
              <Link
                href="/italy-university-admission"
                className="font-semibold text-primary hover:underline"
              >
                Italy university admission guide
              </Link>
              {", "}
              <Link
                href="/universities"
                className="font-semibold text-primary hover:underline"
              >
                Universities in Italy
              </Link>
              {" and "}
              <Link
                href="/visa-checklists"
                className="font-semibold text-primary hover:underline"
              >
                Italy student visa checklists
              </Link>
              .
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-300 px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
          <CoursesExplorer
            courses={courses}
            pagination={pagination}
            search={search}
            degreeLevel={degreeLevel}
            country={country}
            currentPage={page}
          />
        </section>
      </main>
    </>
  );
}
