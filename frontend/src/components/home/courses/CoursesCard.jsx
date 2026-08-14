import Link from "next/link";

const formatMode = (value = "") =>
  value.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function CourseCard({ course }) {
  if (!course) return null;

  const university =
    course.university && typeof course.university === "object"
      ? course.university
      : {};

  const universitySlug =
    university.slug ||
    course.universitySlug ||
    course.universityDetails?.slug ||
    "";

  const courseSlug = course.slug || "";

  const universityUrl = universitySlug
    ? `/universities/${encodeURIComponent(universitySlug)}`
    : null;

  const courseUrl =
    universitySlug && courseSlug
      ? `/courses/${encodeURIComponent(
          universitySlug,
        )}/${encodeURIComponent(courseSlug)}`
      : null;

  const location = [
    university.city || course.city,
    university.country || course.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="motion-card group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
      {/* Decorative hover glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/5 transition-transform duration-700 group-hover:scale-150" />

      {/* Badges */}
      <div className="relative flex items-start justify-between gap-4">
        <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary transition duration-300 group-hover:bg-primary group-hover:text-white">
          {course.degreeType || formatMode(course.degreeLevel) || "Course"}
        </span>

        {course.isFeatured && (
          <span className="rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-bold text-secondary transition duration-300 group-hover:scale-105">
            Featured
          </span>
        )}
      </div>

      {/* Course title */}
      <h2 className="relative mt-5 text-xl font-extrabold leading-snug text-foreground transition-colors duration-300 group-hover:text-primary">
        {course.name || course.title}
      </h2>

      {/* University */}
      {university.name &&
        (universityUrl ? (
          <Link
            href={universityUrl}
            className="relative mt-3 w-fit text-sm font-semibold text-primary transition hover:text-primary-hover hover:underline"
          >
            {university.name}
          </Link>
        ) : (
          <p className="relative mt-3 text-sm font-semibold text-primary">
            {university.name}
          </p>
        ))}

      {/* Location */}
      {location && (
        <p className="relative mt-1 text-sm text-muted">
          <span aria-hidden="true">📍</span> {location}
        </p>
      )}

      {/* Description */}
      {course.shortDescription && (
        <p className="relative mt-4 line-clamp-3 text-sm leading-6 text-muted">
          {course.shortDescription}
        </p>
      )}

      {/* Course information */}
      <div className="relative mt-6 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-background p-3 transition duration-300 group-hover:bg-primary/5">
          <p className="text-xs text-muted">Duration</p>

          <p className="mt-1 font-bold text-foreground">
            {course.duration || "TBC"}
          </p>
        </div>

        <div className="rounded-xl bg-background p-3 transition duration-300 group-hover:bg-secondary/5">
          <p className="text-xs text-muted">Study mode</p>

          <p className="mt-1 font-bold text-foreground">
            {formatMode(course.studyMode) || "TBC"}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="relative mt-auto flex items-center justify-between gap-4 border-t border-border pt-5">
        <span className="text-sm text-muted">
          {course.tuitionFee || "Fees on request"}
        </span>

        {courseUrl ? (
          <Link
            href={courseUrl}
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
        ) : (
          <span className="shrink-0 text-sm font-semibold text-muted">
            Details unavailable
          </span>
        )}
      </div>

      {/* Bottom hover accent */}
      <span className="absolute inset-x-0 bottom-0 mx-auto h-1 w-0 rounded-full bg-linear-to-r from-primary to-secondary transition-all duration-500 group-hover:w-1/2" />
    </article>
  );
}
