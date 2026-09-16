import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import UniversitiesExplorer from "@/components/home/universities/UniversitiesExplorer";

const CANONICAL = "https://www.europeandreamss.com/universities";

const breadcrumbItems = [
  { name: "Home", href: "https://www.europeandreamss.com/" },
  { name: "Universities in Italy", href: CANONICAL },
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
  "@type": "CollectionPage",
  "@id": `${CANONICAL}#webpage`,
  url: CANONICAL,
  name: "Universities in Italy for International Students | European Dreams",
  description:
    "Directory of universities in Italy for international and Indian students: compare Italian universities, English-taught programmes, admission requirements and study options.",
  isPartOf: { "@id": "https://www.europeandreamss.com/#website" },
  breadcrumb: { "@id": `${CANONICAL}#breadcrumb` },
  inLanguage: "en-IN",
};

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const rawSearch = params?.search;
  const search = Array.isArray(rawSearch) ? rawSearch[0]?.trim() : String(rawSearch ?? "").trim();
  const hasSearch = Boolean(search);

  return {
    title: "Universities in Italy for International Students",
    description:
      "Explore universities in Italy for international students and Indian students. Compare Italian universities, courses, English-taught programmes, admission requirements and study options.",
    alternates: {
      canonical: CANONICAL,
    },
    openGraph: {
      title: "Universities in Italy for International Students",
      description:
        "Explore universities in Italy for international students and Indian students. Compare Italian universities, courses, English-taught programmes, admission requirements and study options.",
      url: CANONICAL,
      siteName: "European Dreams",
      type: "website",
      locale: "en_IN",
    },
    robots: hasSearch ? { index: false, follow: true } : { index: true, follow: true },
  };
}

function parsePage(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 1) return 1;
  return Math.floor(num);
}

async function fetchUniversities({ page, search }) {
  const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://api.europeandreamss.com").replace(/\/+$/, "");
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", "12");
  params.set("country", "Italy");
  params.set("sort", "displayOrder");
  params.set("order", "asc");
  if (search) params.set("search", search);

  const url = `${API_URL}/api/universities?${params.toString()}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return { universities: [], pagination: { currentPage: page, totalPages: 0, totalItems: 0, limit: 12 } };
    }
    const json = await res.json();
    const data = json?.data ?? {};
    return {
      universities: data.universities ?? [],
      pagination: data.pagination ?? { currentPage: page, totalPages: 0, totalItems: 0, limit: 12 },
    };
  } catch (error) {
    console.error("Failed to fetch universities:", error);
    return { universities: [], pagination: { currentPage: page, totalPages: 0, totalItems: 0, limit: 12 } };
  }
}

export default async function UniversitiesPage({ searchParams }) {
  const params = await searchParams;
  const rawSearch = params?.search;
  const search = Array.isArray(rawSearch) ? rawSearch[0]?.trim() : String(rawSearch ?? "").trim();
  const page = parsePage(params?.page);

  const { universities, pagination } = await fetchUniversities({ page, search });

  if ((pagination.totalPages > 0 && page > pagination.totalPages) || (page > 1 && universities.length === 0)) {
    notFound();
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={webPageSchema} />
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />

        <div className="relative mx-auto max-w-300 px-5 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-6 flex justify-center">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">
            Find your university
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Universities in Italy
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Explore Italian universities for international and Indian students.
            Compare public universities, Bachelor&apos;s and Master&apos;s
            programmes, English-taught courses, admission requirements,
            tuition fees and scholarships to find the right fit.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-300 px-5 py-10 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Explore Universities in Italy
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-6 text-muted sm:text-base">
            Shortlist by programme and language of instruction, then check
            each university&apos;s admission requirements, tuition, location,
            deadlines and scholarship options. The guide below explains the
            full journey around this directory.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold">
            <Link
              href="/italy-university-admission"
              className="rounded-xl border border-border bg-background px-5 py-2.5 text-foreground transition hover:border-primary hover:text-primary"
            >
              Admission guide
            </Link>
            <Link
              href="/study-in-italy"
              className="rounded-xl border border-border bg-background px-5 py-2.5 text-foreground transition hover:border-primary hover:text-primary"
            >
              Study in Italy guide
            </Link>
            <Link
              href="/courses"
              className="rounded-xl border border-border bg-background px-5 py-2.5 text-foreground transition hover:border-primary hover:text-primary"
            >
              Browse courses
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-300 px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <UniversitiesExplorer universities={universities} pagination={pagination} search={search} currentPage={page} />
      </section>
    </main>
    </>
  );
}
