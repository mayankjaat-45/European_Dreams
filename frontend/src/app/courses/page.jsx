import CoursesExplorer from "@/components/home/courses/CoursesExplorer";

export const metadata = {
  title: "Courses in Europe | European Dreams",
  description:
    "Explore bachelor, master and postgraduate courses at leading European universities.",
};

export default function CoursesPage() {
  return (
    <>
      <main className="min-h-screen bg-background">
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-300 px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-secondary">
              Study programmes
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Find the right course in Europe
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              Compare programmes, universities, destinations, eligibility and
              admission requirements.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-300 px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
          <CoursesExplorer />
        </section>
      </main>
    </>
  );
}
