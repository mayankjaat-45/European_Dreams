"use client";

import { useCallback, useEffect, useState } from "react";

import { Search, X } from "lucide-react";

import { getBlogCategories, getBlogs } from "@/services/blog.service";

import BlogCard from "./BlogCard";

const BLOGS_PER_PAGE = 9;

function BlogSkeleton() {
  return (
    <div
      className="
      overflow-hidden
      rounded-3xl
      border
      border-border
      bg-card
      "
    >
      <div className="aspect-video animate-pulse bg-card-hover" />

      <div className="space-y-4 p-5">
        <div className="h-4 w-2/5 animate-pulse rounded bg-card-hover" />

        <div className="h-7 w-4/5 animate-pulse rounded bg-card-hover" />

        <div className="h-16 animate-pulse rounded bg-card-hover" />

        <div className="h-4 w-1/3 animate-pulse rounded bg-card-hover" />
      </div>
    </div>
  );
}

export default function BlogsExplorer() {
  const [blogs, setBlogs] = useState([]);

  const [categories, setCategories] = useState([]);

  const [pagination, setPagination] = useState(null);

  const [searchInput, setSearchInput] = useState("");

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const [sort, setSort] = useState("publishedAt");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    getBlogCategories()
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Unable to load blog categories:", error);
      });
  }, []);

  const loadBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getBlogs({
        page,
        limit: BLOGS_PER_PAGE,

        search: search || undefined,

        category: category || undefined,

        sort,

        order: "desc",
      });

      setBlogs(result.blogs || []);

      setPagination(result.pagination || null);
    } catch (requestError) {
      console.error("Unable to load blogs:", requestError);

      setBlogs([]);
      setPagination(null);

      setError("We could not load the articles. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, search, category, sort]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const handleSearch = (event) => {
    event.preventDefault();

    const nextSearch = searchInput.trim();

    setPage(1);
    setSearch(nextSearch);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategory("");
    setSort("publishedAt");
    setPage(1);
  };

  const currentPage = pagination?.currentPage ?? page;

  const totalPages = pagination?.totalPages ?? 1;

  const totalItems = pagination?.totalItems ?? blogs.length;

  const hasFilters = search || category || sort !== "publishedAt";

  return (
    <div className="relative">
      {/* Search */}

      <form
        onSubmit={handleSearch}
        className="
        mx-auto
        grid
        max-w-5xl
        gap-3
        rounded-3xl
        border
        border-border
        bg-card
        p-3
        shadow-sm
        md:grid-cols-[minmax(0,1fr)_190px_160px_auto]
        "
      >
        <label className="sr-only" htmlFor="blog-search">
          Search articles
        </label>

        <div className="relative">
          <Search
            size={18}
            className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-muted
            "
          />

          <input
            id="blog-search"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search Study in Italy articles..."
            className="
            min-h-12
            w-full
            rounded-xl
            border
            border-border
            bg-background
            pl-11
            pr-4
            text-sm
            text-foreground
            outline-none
            transition
            placeholder:text-muted
            focus:border-primary
            focus:ring-2
            focus:ring-primary/10
            "
          />
        </div>

        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);

            setPage(1);
          }}
          className="
          min-h-12
          rounded-xl
          border
          border-border
          bg-background
          px-4
          text-sm
          text-foreground
          outline-none
          focus:border-primary
          "
        >
          <option value="">All categories</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) => {
            setSort(event.target.value);

            setPage(1);
          }}
          className="
          min-h-12
          rounded-xl
          border
          border-border
          bg-background
          px-4
          text-sm
          text-foreground
          outline-none
          focus:border-primary
          "
        >
          <option value="publishedAt">Latest</option>

          <option value="views">Popular</option>

          <option value="title">Title</option>
        </select>

        <button
          type="submit"
          className="
          min-h-12
          rounded-xl
          bg-primary
          px-6
          text-sm
          font-bold
          text-white
          shadow-sm
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:bg-primary-hover
          hover:shadow-lg
          "
        >
          Search
        </button>
      </form>

      {/* Count */}

      {!loading && !error && (
        <div
          className="
          mt-7
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
          "
        >
          <p className="text-sm text-muted">
            {totalItems} article
            {totalItems === 1 ? "" : "s"} found
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="
              inline-flex
              items-center
              gap-1.5
              text-sm
              font-bold
              text-primary
              transition
              hover:text-primary-hover
              "
            >
              <X size={15} />
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Error */}

      {error && (
        <div
          className="
          mt-8
          rounded-2xl
          border
          border-danger/25
          bg-danger/5
          p-8
          text-center
          "
        >
          <p className="font-medium text-danger">{error}</p>

          <button
            type="button"
            onClick={loadBlogs}
            className="
            mt-4
            rounded-xl
            bg-primary
            px-5
            py-2.5
            text-sm
            font-bold
            text-white
            "
          >
            Try again
          </button>
        </div>
      )}

      {/* Cards */}

      {!error && (
        <div
          className="
          mt-8
          grid
          gap-6
          sm:grid-cols-2
          lg:grid-cols-3
          "
        >
          {loading
            ? Array.from({
                length: 6,
              }).map((_, index) => <BlogSkeleton key={index} />)
            : blogs.map((blog) => (
                <BlogCard key={blog._id || blog.slug} blog={blog} />
              ))}
        </div>
      )}

      {/* Empty */}

      {!loading && !error && blogs.length === 0 && (
        <div
          className="
            mt-8
            rounded-3xl
            border
            border-border
            bg-card
            px-6
            py-14
            text-center
            shadow-sm
            "
        >
          <h2
            className="
              text-2xl
              font-bold
              text-foreground
              "
          >
            No articles found
          </h2>

          <p className="mt-2 text-muted">
            Try changing your search term or category.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="
              mt-5
              rounded-xl
              bg-primary
              px-5
              py-2.5
              text-sm
              font-bold
              text-white
              "
          >
            View all articles
          </button>
        </div>
      )}

      {/* Pagination */}

      {!loading && !error && totalPages > 1 && (
        <nav
          className="
            mt-12
            flex
            flex-wrap
            items-center
            justify-center
            gap-4
            "
          aria-label="Blog pagination"
        >
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
            className="
              rounded-xl
              border
              border-border
              bg-card
              px-5
              py-2.5
              font-semibold
              text-foreground
              shadow-sm
              transition
              hover:border-primary/30
              disabled:pointer-events-none
              disabled:opacity-40
              "
          >
            ← Previous
          </button>

          <span
            className="
              rounded-xl
              bg-primary/10
              px-4
              py-2.5
              text-sm
              font-bold
              text-primary
              "
          >
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
            className="
              rounded-xl
              border
              border-border
              bg-card
              px-5
              py-2.5
              font-semibold
              text-foreground
              shadow-sm
              transition
              hover:border-primary/30
              disabled:pointer-events-none
              disabled:opacity-40
              "
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  );
}
