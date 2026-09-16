import Link from "next/link";
import UniversityCard from "./UniversityCard";

export default function UniversitiesExplorer({ universities = [], pagination = {}, search = "", currentPage = 1 }) {
  const totalItems = pagination?.totalItems ?? pagination?.totalUniversities ?? universities.length;
  const totalPages = pagination?.totalPages ?? 1;
  const page = pagination?.currentPage ?? currentPage;

  function createHref(targetPage) {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (targetPage && targetPage !== 1) params.set("page", String(targetPage));
    else if (targetPage === 1 && search) {
      // keep search without page=1 to keep canonical clean, but allow page param when needed
      // if search exists and page=1, we omit page to avoid ?page=1 duplicate
    }
    // For pagination, always include page when >1, even with search
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `/universities?${qs}` : "/universities";
  }

  // Ensure search pagination preserves search
  const prevHref = page > 1 ? createHref(page - 1) : null;
  const nextHref = page < totalPages ? createHref(page + 1) : null;

  return (
    <div>
      <form
        method="GET"
        action="/universities"
        className="grid gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm transition duration-300 hover:shadow-md sm:grid-cols-[minmax(0,1fr)_auto]"
      >
        <label className="sr-only" htmlFor="university-search">
          Search Italian universities
        </label>

        <input
          id="university-search"
          type="search"
          name="search"
          defaultValue={search}
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

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {totalItems} Italian university{totalItems === 1 ? "y" : "ies"} found.
        </p>

        {search && (
          <Link
            href="/universities"
            className="text-sm font-semibold text-primary transition hover:text-primary-hover"
          >
            Clear search
          </Link>
        )}
      </div>

      {universities.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {universities.map((university, index) => (
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
      ) : (
        <div className="mt-8 rounded-2xl border border-border bg-card px-6 py-14 text-center">
          <h2 className="text-2xl font-bold text-foreground">No universities found</h2>
          <p className="mt-2 text-muted">Try another university, city or course name.</p>
          {search && (
            <Link
              href="/universities"
              className="mt-5 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover"
            >
              View all universities
            </Link>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-12 flex flex-wrap items-center justify-center gap-4" aria-label="Universities pagination">
          {page > 1 ? (
            <Link
              href={prevHref}
              className="rounded-xl border border-border bg-card px-5 py-2.5 font-semibold text-foreground transition hover:border-primary"
            >
              ← Previous
            </Link>
          ) : (
            <span className="rounded-xl border border-border bg-card px-5 py-2.5 font-semibold text-foreground opacity-40">← Previous</span>
          )}

          <span className="text-sm font-medium text-muted">
            Page {page} of {totalPages}
          </span>

          {page < totalPages ? (
            <Link
              href={nextHref}
              className="rounded-xl border border-border bg-card px-5 py-2.5 font-semibold text-foreground transition hover:border-primary"
            >
              Next →
            </Link>
          ) : (
            <span className="rounded-xl border border-border bg-card px-5 py-2.5 font-semibold text-foreground opacity-40">Next →</span>
          )}
        </nav>
      )}
    </div>
  );
}
