import Link from "next/link";
import CourseCard from "./CoursesCard";

export default function CoursesExplorer({
  courses = [],
  pagination = {},
  search = "",
  degreeLevel = "",
  country = "",
  currentPage = 1,
}) {
  const totalPages = pagination?.totalPages ?? 1;
  const page = pagination?.currentPage ?? currentPage;
  const totalItems = pagination?.totalItems ?? courses.length;

  function createHref(targetPage) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (degreeLevel) params.set("degreeLevel", degreeLevel);
    if (country) params.set("country", country);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `/courses?${qs}` : "/courses";
  }

  const prevHref = page > 1 ? createHref(page - 1) : null;
  const nextHref = page < totalPages ? createHref(page + 1) : null;

  return (
    <div>
      <form
        method="GET"
        action="/courses"
        className="grid gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm transition duration-300 hover:shadow-md lg:grid-cols-[minmax(0,1fr)_190px_190px_auto]"
      >
        <input
          type="search"
          name="search"
          defaultValue={search}
          placeholder="Search course, field or university..."
          aria-label="Search courses"
          className="min-h-12 rounded-xl border border-border bg-background px-4 text-foreground outline-none focus:border-primary"
        />
        <select
          name="degreeLevel"
          defaultValue={degreeLevel}
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
          name="country"
          defaultValue={country}
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

      <p className="mt-6 text-sm text-muted">
        {totalItems} course{totalItems === 1 ? "" : "s"} found.
      </p>

      {courses.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
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
      ) : (
        <div className="mt-8 rounded-2xl border border-border bg-card px-6 py-14 text-center">
          <h2 className="text-2xl font-bold text-foreground">No courses found</h2>
          <p className="mt-2 text-muted">Try changing your search or filters.</p>
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-4" aria-label="Courses pagination">
          {page > 1 ? (
            <Link
              href={prevHref}
              className="rounded-xl border border-border bg-card px-5 py-2.5 font-semibold disabled:opacity-40"
            >
              ← Previous
            </Link>
          ) : (
            <span className="rounded-xl border border-border bg-card px-5 py-2.5 font-semibold opacity-40">← Previous</span>
          )}
          <span className="text-sm font-medium text-muted">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={nextHref}
              className="rounded-xl border border-border bg-card px-5 py-2.5 font-semibold disabled:opacity-40"
            >
              Next →
            </Link>
          ) : (
            <span className="rounded-xl border border-border bg-card px-5 py-2.5 font-semibold opacity-40">Next →</span>
          )}
        </nav>
      )}
    </div>
  );
}
