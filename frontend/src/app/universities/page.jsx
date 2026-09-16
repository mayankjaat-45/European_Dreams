import { notFound } from "next/navigation";
import UniversitiesExplorer from "@/components/home/universities/UniversitiesExplorer";

const CANONICAL = "https://www.europeandreamss.com/universities";

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const rawSearch = params?.search;
  const search = Array.isArray(rawSearch) ? rawSearch[0]?.trim() : String(rawSearch ?? "").trim();
  const hasSearch = Boolean(search);

  return {
    title: "European Universities | European Dreams",
    description:
      "Explore European universities, compare destinations and discover programmes for international students.",
    alternates: {
      canonical: CANONICAL,
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

  if (pagination.totalPages > 0 && page > pagination.totalPages) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />

        <div className="relative mx-auto max-w-300 px-5 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">
            Find your university
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Explore European Universities
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Compare universities across Europe and discover the right institution for your academic goals.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-300 px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <UniversitiesExplorer universities={universities} pagination={pagination} search={search} currentPage={page} />
      </section>
    </main>
  );
}
