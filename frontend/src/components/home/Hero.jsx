import Image from "next/image";
import Link from "next/link";

const benefits = [
  "Top Universities",
  "Visa Assistance",
  "Application Support",
  "Career Guidance",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-125 w-125 rounded-full bg-primary/15 blur-[120px]" />

      <div className="pointer-events-none absolute -bottom-40 -left-40 h-112.5 w-112.5 rounded-full bg-secondary/15 blur-[110px]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-300 items-center gap-12 px-5 py-10 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-12">
        {/* Hero content */}
        <div data-reveal="left">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            Your trusted study abroad partner
          </div>

          <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Your journey to study in{" "}
            <span className="text-primary">Europe</span> starts here.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-muted sm:text-lg">
            Discover leading European universities, career-focused courses and
            expert support for applications, scholarships and student visas.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3.5 font-semibold text-white shadow-lg shadow-primary/20 transition duration-300 hover:-translate-y-1 hover:bg-primary-hover hover:shadow-xl"
            >
              Book Free Consultation
            </Link>

            <Link
              href="/universities"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3.5 font-semibold text-foreground transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:text-primary hover:shadow-lg"
            >
              Explore Universities
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-start gap-2 text-sm font-medium text-muted"
              >
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-xs font-bold text-success">
                  ✓
                </span>

                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual */}
        <div
          data-reveal="right"
          className="relative mx-auto w-full max-w-lg lg:ml-auto"
        >
          <div className="relative overflow-hidden rounded-4xl border border-border bg-card p-3 shadow-2xl shadow-primary/10">
            <div className="relative min-h-120 overflow-hidden rounded-3xl">
              <Image
                src="/images/hero.jpg"
                alt="Student planning to study at a European university"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover object-top transition-transform duration-700 hover:scale-105"
              />

              {/* Image overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#07152f]/75 via-transparent to-transparent" />

              {/* Image content */}
              <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-secondary">
                  Study in Europe
                </p>

                <h2 className="mt-2 font-display text-3xl font-bold leading-tight">
                  Build your future in Europe
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-white/85 sm:text-base">
                  Personalised counselling and complete admission support at
                  every step of your journey.
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -left-4 top-10 z-10 rounded-2xl border border-border bg-card/90 px-5 py-4 shadow-xl backdrop-blur-md sm:-left-10">
            <p className="text-2xl font-bold text-primary">200+</p>

            <p className="mt-1 text-xs font-medium text-muted">
              Partner Universities
            </p>
          </div>

          <div className="absolute -bottom-5 right-3 z-10 rounded-2xl border border-border bg-card/90 px-5 py-4 shadow-xl backdrop-blur-md sm:-right-6">
            <p className="text-2xl font-bold text-secondary">5000+</p>

            <p className="mt-1 text-xs font-medium text-muted">
              Students Guided
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
