import UniversitiesExplorer from "@/components/home/universities/UniversitiesExplorer";


export const metadata = {
  title: "European Universities | European Dreams",
  description:
    "Explore European universities, compare destinations and discover programmes for international students.",
};

export default function UniversitiesPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />

        <div className="relative mx-auto max-w-300 px-5 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">
            Find your university
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Explore European Universities
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Compare universities across Europe and discover the right
            institution for your academic goals.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-300 px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <UniversitiesExplorer />
      </section>
    </main>
  );
}
