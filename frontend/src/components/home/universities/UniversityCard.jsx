import Link from "next/link";

export default function UniversityCard({ university }) {
  if (!university) return null;

  const location = [university.city, university.country]
    .filter(Boolean)
    .join(", ");

  const image = university.heroImage || university.image || university.logo;

  return (
    <article className="motion-card group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-linear-to-br from-primary/15 via-card-hover to-secondary/15">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={university.name || "University"}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div
            className="motion-float flex h-full items-center justify-center text-6xl transition-transform duration-500 group-hover:scale-110"
            aria-hidden="true"
          >
            🎓
          </div>
        )}

        {/* Image overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Featured badge */}
        {university.isFeatured && (
          <span className="absolute left-4 top-4 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-white shadow-sm transition duration-300 group-hover:scale-105">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="relative flex flex-1 flex-col p-6">
        {(university.universityType || location) && (
          <p className="text-sm font-semibold text-primary">
            {university.universityType || location}
          </p>
        )}

        <h2 className="mt-2 text-xl font-extrabold leading-snug text-foreground transition-colors duration-300 group-hover:text-primary">
          {university.name}
        </h2>

        {location && university.universityType && (
          <p className="mt-2 text-sm text-muted">📍 {location}</p>
        )}

        {university.shortDescription && (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted">
            {university.shortDescription}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-border pt-5">
          <span className="text-sm text-muted">
            {university.tuitionFeeRange || "Explore programmes"}
          </span>

          <Link
            href={`/universities/${university.slug}`}
            className="group/link inline-flex shrink-0 items-center gap-1 font-bold text-primary transition-colors duration-300 hover:text-primary-hover"
          >
            View details
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover/link:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>

        {/* Bottom hover accent */}
        <span className="absolute inset-x-0 bottom-0 mx-auto h-1 w-0 rounded-full bg-linear-to-r from-primary to-secondary transition-all duration-500 group-hover:w-1/2" />
      </div>
    </article>
  );
}
