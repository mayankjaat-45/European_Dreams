import Link from "next/link";

export default function Breadcrumbs({ items = [], variant = "default" }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  const isDark = variant === "dark";

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const key = `${item.name}-${index}`;

          return (
            <li key={key} className="inline-flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={
                    isDark
                      ? "font-medium text-white/70 transition hover:text-white"
                      : "font-medium text-muted transition hover:text-primary"
                  }
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  className={
                    isLast
                      ? isDark
                        ? "font-semibold text-white"
                        : "font-semibold text-foreground"
                      : isDark
                        ? "font-medium text-white/70"
                        : "font-medium text-muted"
                  }
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.name}
                </span>
              )}
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={isDark ? "text-white/40" : "text-muted/60"}
                >
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
