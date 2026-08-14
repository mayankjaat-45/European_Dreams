import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Search,
  Sparkles,
} from "lucide-react";
import { getBlogCategories, getBlogs } from "@/services/blogs.service.js";

function formatDate(date) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export const metadata = {
  title: "Study in Italy Blogs | European Dreams",
  description:
    "Explore Study in Italy guides covering universities, admissions, scholarships, student visas, pre-enrolment and student life.",
};

export default async function BlogsPage({ searchParams }) {
  const params = await searchParams;

  const page = Number(params?.page) || 1;
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

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* HERO */}

      <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--hero-gradient)]">
        <div className="pointer-events-none absolute -right-32 -top-24 h-80 w-80 rounded-full bg-[var(--primary)]/10 blur-[120px]" />

        <div className="pointer-events-none absolute -bottom-28 -left-32 h-80 w-80 rounded-full bg-[var(--secondary)]/10 blur-[120px]" />

        <div className="container-custom relative mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--secondary)]/20 bg-[var(--secondary)]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--secondary)]">
              <Sparkles size={15} />
              Study in Italy Resources
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[var(--foreground)] md:text-5xl">
              Guides, updates and advice for your
              <span className="text-[var(--primary)]"> Italy journey</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
              Explore practical articles about Italian universities, admissions,
              scholarships, pre-enrolment, student visas and life in Italy.
            </p>
          </div>
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
