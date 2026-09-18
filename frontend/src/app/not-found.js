import Link from "next/link";

export const metadata = {
  title: "Page Not Found | European Dreams",
  description:
    "The page you requested could not be found. Explore study guides, universities, courses, or contact European Dreams for guidance.",
  robots: {
    index: false,
    follow: true,
  },
};

const helpfulLinks = [
  {
    href: "/study-in-italy",
    title: "Study in Italy guide",
    text: "Universities, courses, admission and the full journey.",
  },
  {
    href: "/universities",
    title: "Universities",
    text: "Browse universities in Italy.",
  },
  {
    href: "/courses",
    title: "Courses",
    text: "Explore English-taught courses in Italy.",
  },
  {
    href: "/contact",
    title: "Contact",
    text: "Get free guidance from our counsellors.",
  },
];

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-secondary">
          404
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Page Not Found
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-muted">
          The page you are looking for could not be found. It may have been
          moved, or the link may be incorrect. These guides can help you find
          what you need.
        </p>
        <div className="mt-10 grid gap-4 text-left sm:grid-cols-2">
          {helpfulLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            >
              <p className="text-lg font-bold text-foreground transition group-hover:text-primary">
                {link.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">{link.text}</p>
              <span className="mt-4 inline-block text-sm font-bold text-primary">
                Visit page →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
