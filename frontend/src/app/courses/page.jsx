import { notFound } from "next/navigation";
import CoursesExplorer from "@/components/home/courses/CoursesExplorer";

const CANONICAL = "https://www.europeandreamss.com/courses";

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

  return {
    title: "Courses in Europe | European Dreams",
    description:
      "Explore bachelor, master and postgraduate courses at leading European universities.",
    alternates: {
      canonical: CANONICAL,
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

  if (pagination.totalPages > 0 && page > pagination.totalPages) {
    notFound();
  }

  return (
    <>
      <main className="min-h-screen bg-background">
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-300 px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-secondary">
              Study programmes
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Find the right course in Europe
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              Compare programmes, universities, destinations, eligibility and admission requirements.
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
