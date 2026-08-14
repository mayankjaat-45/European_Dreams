"use client";

import { useCallback, useEffect, useState } from "react";

import { getCourses } from "@/services/courses.service";
import CourseCard from "./CoursesCard";

function CourseSkeleton() {
  return (
    <div className="animate-pulse rounded-[1.75rem] border border-border bg-card p-6">
      <div className="h-6 w-24 rounded-full bg-card-hover" />
      <div className="mt-5 h-7 w-4/5 rounded bg-card-hover" />
      <div className="mt-3 h-4 w-2/3 rounded bg-card-hover" />
      <div className="mt-5 h-16 rounded bg-card-hover" />
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="h-16 rounded-xl bg-card-hover" />
        <div className="h-16 rounded-xl bg-card-hover" />
      </div>
    </div>
  );
}

export default function CoursesExplorer() {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [degreeLevel, setDegreeLevel] = useState("");
  const [country, setCountry] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = useCallback(async () => {
    try {
      const result = await getCourses({
        page,
        limit: 12,
        search: search || undefined,
        degreeLevel: degreeLevel || undefined,
        country: country || undefined,
        sort: "displayOrder",
        order: "asc",
      });
      setCourses(result.courses);
      setPagination(result.pagination);
      setError("");
    } catch (requestError) {
      console.error("Unable to load courses:", requestError);
      setCourses([]);
      setPagination(null);
      setError("We could not load the courses. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [country, degreeLevel, page, search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCourses();
  }, [loadCourses]);

  function applyFilters(event) {
    event.preventDefault();
    setLoading(true);
    setPage(1);
    setSearch(searchInput.trim());
  }

  function updateFilter(setter, value) {
    setLoading(true);
    setPage(1);
    setter(value);
  }

  const currentPage = pagination?.currentPage ?? page;
  const totalPages = pagination?.totalPages ?? 1;
  const totalItems = pagination?.totalItems ?? courses.length;

  return (
    <div>
      <form
        data-reveal="scale"
        onSubmit={applyFilters}
        className="grid gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm transition duration-300 hover:shadow-md lg:grid-cols-[minmax(0,1fr)_190px_190px_auto]"
      >
        <input
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search course, field or university..."
          aria-label="Search courses"
          className="min-h-12 rounded-xl border border-border bg-background px-4 text-foreground outline-none focus:border-primary"
        />
        <select
          value={degreeLevel}
          onChange={(event) => updateFilter(setDegreeLevel, event.target.value)}
          aria-label="Degree level"
          className="min-h-12 rounded-xl border border-border bg-background px-4 text-foreground outline-none focus:border-primary"
        >
          <option value="">All study levels</option>
          <option value="bachelor">Bachelor</option>
          <option value="master">Master</option>
          <option value="phd">PhD</option>
          <option value="diploma">Diploma</option>
        </select>
        <select
          value={country}
          onChange={(event) => updateFilter(setCountry, event.target.value)}
          aria-label="Country"
          className="min-h-12 rounded-xl border border-border bg-background px-4 text-foreground outline-none focus:border-primary"
        >
          <option value="">All countries</option>
          <option value="Italy">Italy</option>
          <option value="Germany">Germany</option>
          <option value="France">France</option>
          <option value="Spain">Spain</option>
        </select>
        <button
          type="submit"
          className="min-h-12 rounded-xl bg-primary px-7 font-bold text-white transition hover:bg-primary-hover"
        >
          Search
        </button>
      </form>

      {!loading && !error && (
        <p data-reveal className="mt-6 text-sm text-muted">
          {totalItems} course{totalItems === 1 ? "" : "s"} found.
        </p>
      )}

      {error && (
        <div
          data-reveal="scale"
          className="mt-8 rounded-2xl border border-danger/25 bg-danger/5 p-6 text-center"
        >
          <p className="font-medium text-danger">{error}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              loadCourses();
            }}
            className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white"
          >
            Try again
          </button>
        </div>
      )}

      {!error && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }, (_, index) => (
                <CourseSkeleton key={index} />
              ))
            : courses.map((course, index) => (
                <div
                  key={course._id || course.slug}
                  data-reveal="scale"
                  data-delay={(index % 3) + 1}
                  className="h-full"
                >
                  <CourseCard course={course} />
                </div>
              ))}
        </div>
      )}

      {!loading && !error && courses.length === 0 && (
        <div
          data-reveal="scale"
          className="mt-8 rounded-2xl border border-border bg-card px-6 py-14 text-center"
        >
          <h2 className="text-2xl font-bold text-foreground">
            No courses found
          </h2>
          <p className="mt-2 text-muted">
            Try changing your search or filters.
          </p>
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <nav
          data-reveal
          className="mt-12 flex items-center justify-center gap-4"
          aria-label="Courses pagination"
        >
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => {
              setLoading(true);
              setPage(page - 1);
            }}
            className="rounded-xl border border-border bg-card px-5 py-2.5 font-semibold disabled:opacity-40"
          >
            ← Previous
          </button>
          <span className="text-sm font-medium text-muted">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => {
              setLoading(true);
              setPage(page + 1);
            }}
            className="rounded-xl border border-border bg-card px-5 py-2.5 font-semibold disabled:opacity-40"
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  );
}
