import TestimonialsExplorer from "@/components/testimonials/TestimonialsExplorer";

export const metadata = {
  title: "Student Success Stories | European Dreams",
  description:
    "Read real student experiences with European Dreams, including Study in Italy admissions, visa approvals and scholarship success stories.",
};

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}

      <section className="relative overflow-hidden border-b border-border bg-(--hero-gradient)">
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-32
            -top-24
            h-80
            w-80
            rounded-full
            bg-primary/10
            blur-[120px]
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -bottom-32
            -left-32
            h-80
            w-80
            rounded-full
            bg-secondary/10
            blur-[120px]
          "
        />

        <div className="container-custom relative mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-secondary">
              Student Success Stories
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Real Students.
              <span className="text-primary"> Real Italy Journeys.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted md:text-lg">
              Read experiences from students who received guidance for Italian
              university admissions, scholarships and study visa applications
              with European Dreams.
            </p>
          </div>
        </div>
      </section>

      {/* All testimonials */}

      <section className="container-custom mx-auto px-4 py-14 md:py-20">
        <TestimonialsExplorer />
      </section>
    </main>
  );
}
