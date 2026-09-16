import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Search,
  Sparkles,
} from "lucide-react";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { getBlogCategories, getBlogs } from "@/services/blogs.service.js";

const CANONICAL = "https://www.europeandreamss.com/blogs";

const PAGE_TITLE = "Study in Italy Blogs for Indian Students";
const PAGE_DESCRIPTION =
  "Read Study in Italy guides for Indian students covering Italian universities, admission, scholarships, student visas, fees, pre-enrolment and student life.";

const breadcrumbItems = [
  { name: "Home", href: "https://www.europeandreamss.com/" },
  { name: "Study in Italy Blogs", href: CANONICAL },
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
  name: "Study in Italy Blogs for Indian Students | European Dreams",
  description: PAGE_DESCRIPTION,
  isPartOf: { "@id": "https://www.europeandreamss.com/#website" },
  breadcrumb: { "@id": `${CANONICAL}#breadcrumb` },
  inLanguage: "en-IN",
};

function formatDate(date) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;

  const getFirst = (value) =>
    Array.isArray(value) ? value[0] : value;

  const search = getFirst(params?.search)?.trim();
  const category = getFirst(params?.category)?.trim();
  const sort = getFirst(params?.sort)?.trim();
  const page = getFirst(params?.page);

  const hasSearch = Boolean(search);
  const hasCategory = Boolean(category);
  const hasSort = Boolean(sort && sort !== "publishedAt");
  // page param alone should not force noindex per P0 instruction (canonicalize only)
  const hasFilter = hasSearch || hasCategory || hasSort;

  const pageNum = Math.max(Number(page) || 1, 1);
  const canonical =
    !hasFilter && pageNum > 1 ? `${CANONICAL}?page=${pageNum}` : CANONICAL;

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
    robots: hasFilter
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

export default async function BlogsPage({ searchParams }) {
  const params = await searchParams;

  const page = Math.max(Number(params?.page) || 1, 1);
  const search = params?.search || "";
  const category = params?.category || "";
  const sort = params?.sort || "publishedAt";

  const [{ blogs, pagination }, categories] = await Promise.all([
    getBlogs({
      page,
      limit: 9,
      search,
      category,
      sort,
      order: "desc",
    }),
    getBlogCategories(),
  ]);

  if ((pagination.totalPages > 0 && page > pagination.totalPages) || (page > 1 && blogs.length === 0)) {
    notFound();
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={collectionSchema} />
    <main className="min-h-screen bg-[var(--background)]">
      {/* HERO */}

      <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--hero-gradient)]">
        <div className="pointer-events-none absolute -right-32 -top-24 h-80 w-80 rounded-full bg-[var(--primary)]/10 blur-[120px]" />

        <div className="pointer-events-none absolute -bottom-28 -left-32 h-80 w-80 rounded-full bg-[var(--secondary)]/10 blur-[120px]" />

        <div className="container-custom relative mx-auto px-4 py-16 md:py-24">
          <div className="mb-7 flex justify-center">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--secondary)]/20 bg-[var(--secondary)]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--secondary)]">
              <Sparkles size={15} />
              Study in Italy Resources
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[var(--foreground)] md:text-5xl">
              Study in Italy Blogs for Indian Students
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
              Practical Study in Italy guides for Indian students — Italian
              universities, admission, scholarships, student visas, fees,
              pre-enrolment and student life, explained step by step.
            </p>
          </div>
        </div>
      </section>

      {/* SEO supporting section */}

      <section className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="container-custom mx-auto px-4 py-10">
          <h2 className="text-center text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
            Study in Italy Guides
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-6 text-[var(--muted)] sm:text-base">
            Researching Italian universities, admissions, scholarships, visas,
            costs and student life? These articles walk through each stage
            with practical, up-to-date guidance for Indian students.
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-6 text-[var(--muted)] sm:text-base">
            Start with our{" "}
            <Link
              href="/study-in-italy"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              Study in Italy guide
            </Link>
            {", "}
            <Link
              href="/italy-university-admission"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              Italy university admission guide
            </Link>
            {", "}
            <Link
              href="/italy-student-visa"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              Italy student visa guide
            </Link>
            {" and "}
            <Link
              href="/universities"
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              Universities in Italy
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FILTERS */}

      <section className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="container-custom mx-auto px-4 py-5">
          <form
            action="/blogs"
            className="flex flex-col gap-3 lg:flex-row lg:items-center"
          >
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
              />

              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search blogs..."
                className="
                w-full
                rounded-xl
                border
                border-[var(--border)]
                bg-[var(--background)]
                py-3
                pl-11
                pr-4
                text-sm
                text-[var(--foreground)]
                outline-none
                transition
                placeholder:text-[var(--muted)]
                focus:border-[var(--primary)]
                "
              />
            </div>

            <select
              name="category"
              defaultValue={category}
              className="
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--background)]
              px-4
              py-3
              text-sm
              text-[var(--foreground)]
              outline-none
              focus:border-[var(--primary)]
              "
            >
              <option value="">All Categories</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              name="sort"
              defaultValue={sort}
              className="
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--background)]
              px-4
              py-3
              text-sm
              text-[var(--foreground)]
              outline-none
              focus:border-[var(--primary)]
              "
            >
              <option value="publishedAt">Latest</option>
              <option value="views">Popular</option>
              <option value="title">Title</option>
            </select>

            <button
              type="submit"
              className="
              rounded-xl
              bg-[var(--primary)]
              px-6
              py-3
              text-sm
              font-bold
              text-white
              transition
              hover:bg-[var(--primary-hover)]
              "
            >
              Apply Filters
            </button>
          </form>
        </div>
      </section>

      {/* BLOGS */}

      <section className="container-custom mx-auto px-4 py-14 md:py-20">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--secondary)]">
              Latest Articles
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[var(--foreground)]">
              Explore our Study in Italy guides
            </h2>
          </div>

          {pagination.totalItems > 0 && (
            <p className="text-sm text-[var(--muted)]">
              {pagination.totalItems} articles
            </p>
          )}
        </div>

        {blogs.length ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                search={search}
                category={category}
                sort={sort}
              />
            )}
          </>
        ) : (
          <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] px-6 py-16 text-center">
            <h3 className="text-xl font-bold text-[var(--foreground)]">
              No blogs found
            </h3>

            <p className="mt-2 text-[var(--muted)]">
              Try changing your search or category filter.
            </p>

            <Link
              href="/blogs"
              className="mt-6 inline-flex rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white"
            >
              View all blogs
            </Link>
          </div>
        )}
      </section>
    </main>
    </>
  );
}

function BlogCard({ blog }) {
  return (
    <article
      className="
      group
      flex
      h-full
      flex-col
      overflow-hidden
      rounded-[24px]
      border
      border-[var(--border)]
      bg-[var(--card)]
      shadow-sm
      transition
      duration-300
      hover:-translate-y-1
      hover:border-[var(--primary)]/30
      hover:shadow-xl
      "
    >
      <Link href={`/blogs/${blog.slug}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden bg-[var(--card-hover)]">
          {blog.featuredImage ? (
            <img
              src={blog.featuredImage}
              alt={blog.featuredImageAlt || blog.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[var(--primary)]/10">
              <span className="text-lg font-bold text-[var(--primary)]">
                European Dreams
              </span>
            </div>
          )}

          <div className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
            {blog.category}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
          {blog.publishedAt && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} />
              {formatDate(blog.publishedAt)}
            </span>
          )}

          {blog.readTime && (
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={14} />
              {blog.readTime}
            </span>
          )}
        </div>

        <Link href={`/blogs/${blog.slug}`}>
          <h3
            className="
            mt-4
            line-clamp-2
            text-xl
            font-bold
            leading-7
            text-[var(--foreground)]
            transition
            group-hover:text-[var(--primary)]
            "
          >
            {blog.title}
          </h3>
        </Link>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--muted)]">
          {blog.excerpt}
        </p>

        <div className="mt-auto pt-5">
          <Link
            href={`/blogs/${blog.slug}`}
            className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-bold
            text-[var(--primary)]
            "
          >
            Read article
            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

function Pagination({ currentPage, totalPages, search, category, sort }) {
  const createHref = (page) => {
    const params = new URLSearchParams();

    params.set("page", String(page));

    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);

    return `/blogs?${params.toString()}`;
  };

  return (
    <div className="mt-12 flex items-center justify-center gap-3">
      {currentPage > 1 && (
        <Link
          href={createHref(currentPage - 1)}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]"
        >
          Previous
        </Link>
      )}

      <span className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white">
        {currentPage} / {totalPages}
      </span>

      {currentPage < totalPages && (
        <Link
          href={createHref(currentPage + 1)}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]"
        >
          Next
        </Link>
      )}
    </div>
  );
}
