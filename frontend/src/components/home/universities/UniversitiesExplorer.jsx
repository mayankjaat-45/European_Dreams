"use client";

import { useCallback, useEffect, useState } from "react";

import { getUniversities } from "@/services/universities.service";
import UniversityCard from "./UniversityCard";

function UniversitySkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[1.75rem] border border-border bg-card">
      <div className="h-52 bg-card-hover" />

      <div className="space-y-4 p-6">
        <div className="h-4 w-1/3 rounded bg-card-hover" />
        <div className="h-7 w-4/5 rounded bg-card-hover" />
        <div className="h-4 w-1/2 rounded bg-card-hover" />
        <div className="h-16 rounded bg-card-hover" />
      </div>
    </div>
  );
}

export default function UniversitiesExplorer() {
  const [universities, setUniversities] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUniversities = useCallback(async () => {
    try {
      setError("");

      const result = await getUniversities({
        page,
        limit: 12,
        search: search || undefined,
        country: "Italy",
        sort: "displayOrder",
        order: "asc",
      });

      setUniversities(result.universities || []);
      setPagination(result.pagination || null);
    } catch (requestError) {
      console.error("Unable to load universities:", requestError);

      setUniversities([]);
      setPagination(null);
      setError("We could not load the Italian universities. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadUniversities();
  }, [loadUniversities]);

  function handleSearch(event) {
    event.preventDefault();

    const nextSearch = searchInput.trim();

    setError("");
    setPage(1);

    /*
     * If the search value has not changed and we are already on page 1,
     * manually reload the results.
     */
    if (nextSearch === search && page === 1) {
      setLoading(true);
      loadUniversities();
      return;
    }

    setLoading(true);
    setSearch(nextSearch);
  }

  function clearSearch() {
    setSearchInput("");
    setError("");
    setPage(1);
    setLoading(true);

    if (search === "" && page === 1) {
      loadUniversities();
      return;
    }

    setSearch("");
  }

  function retryLoading() {
    setLoading(true);
    setError("");
    loadUniversities();
  }

  function goToPage(nextPage) {
    setLoading(true);
    setError("");
    setPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const totalItems =
    pagination?.totalItems ??
    pagination?.totalUniversities ??
    universities.length;

  const currentPage = pagination?.currentPage ?? page;
  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div>
      <form
        data-reveal="scale"
        onSubmit={handleSearch}
        className="grid gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm transition duration-300 hover:shadow-md sm:grid-cols-[minmax(0,1fr)_auto]"
      >
        <label className="sr-only" htmlFor="university-search">
          Search Italian universities
        </label>

        <input
          id="university-search"
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search by university, city or course..."
          className="min-h-12 rounded-xl border border-border bg-background px-4 text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
        />

        <button
          type="submit"
          className="min-h-12 rounded-xl bg-primary px-7 font-bold text-white transition hover:bg-primary-hover"
        >
          Search
        </button>
      </form>

      {!loading && !error && (
        <div
          data-reveal
          className="mt-6 flex flex-wrap items-center justify-between gap-3"
        >
          <p className="text-sm text-muted">
            {totalItems} Italian university
            {totalItems === 1 ? "y" : "ies"} found.
          </p>

          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="text-sm font-semibold text-primary transition hover:text-primary-hover"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {error && (
        <div
          data-reveal="scale"
          className="mt-8 rounded-2xl border border-danger/25 bg-danger/5 p-6 text-center"
        >
          <p className="font-medium text-danger">{error}</p>

          <button
            type="button"
            onClick={retryLoading}
            className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover"
          >
            Try again
          </button>
        </div>
      )}

      {!error && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }, (_, index) => (
                <UniversitySkeleton key={index} />
              ))
            : universities.map((university, index) => (
                <div
                  key={university._id || university.slug}
                  data-reveal="scale"
                  data-delay={(index % 3) + 1}
                  className="h-full"
                >
                  <UniversityCard university={university} />
                </div>
              ))}
        </div>
      )}

      {!loading && !error && universities.length === 0 && (
        <div
          data-reveal="scale"
          className="mt-8 rounded-2xl border border-border bg-card px-6 py-14 text-center"
        >
          <h2 className="text-2xl font-bold text-foreground">
            No universities found
          </h2>

          <p className="mt-2 text-muted">
            Try another university, city or course name.
          </p>

          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover"
            >
              View all universities
            </button>
          )}
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <nav
          data-reveal
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
          aria-label="Universities pagination"
        >
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => goToPage(Math.max(1, currentPage - 1))}
            className="rounded-xl border border-border bg-card px-5 py-2.5 font-semibold text-foreground transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous
          </button>

          <span className="text-sm font-medium text-muted">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => goToPage(currentPage + 1)}
            className="rounded-xl border border-border bg-card px-5 py-2.5 font-semibold text-foreground transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  );
}
