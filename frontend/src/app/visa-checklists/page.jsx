import Link from "next/link";

export const metadata = {
  title: "Italian Study Visa Checklists",
  description:
    "Download the latest Italian study visa document checklists for the New Delhi Embassy and Bengaluru, Mumbai, and Kolkata consulates.",
};

const visaChecklists = [
  {
    id: "delhi",
    city: "New Delhi",
    office: "Embassy of Italy",
    jurisdiction: "New Delhi Embassy",
    file: "/visa-checklists/delhi-study-visa-checklist.pdf",
  },
  {
    id: "mumbai",
    city: "Mumbai",
    office: "Consulate General of Italy",
    jurisdiction: "Mumbai Consulate",
    file: "/visa-checklists/bengaluru-mumbai-study-visa-checklist.pdf",
  },
  {
    id: "bengaluru",
    city: "Bengaluru",
    office: "Consulate General of Italy",
    jurisdiction: "Bengaluru Consulate",
    file: "/visa-checklists/bengaluru-mumbai-study-visa-checklist.pdf",
  },
  {
    id: "kolkata",
    city: "Kolkata",
    office: "Consulate General of Italy",
    jurisdiction: "Kolkata Consulate",
    file: "/visa-checklists/kolkata-study-visa-checklist.pdf",
  },
];

function DocumentIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-7 w-7"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8L14 2Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 2v6h6M8 13h8M8 17h8M8 9h2"
      />
    </svg>
  );
}

function ViewIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"
      />
    </svg>
  );
}

export default function VisaChecklistsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Hero section */}
      <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--hero-gradient)]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--primary)]/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[var(--primary)]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-7 flex items-center gap-2 text-sm text-[var(--muted-foreground)]"
          >
            <Link
              href="/"
              className="transition-colors hover:text-[var(--primary)]"
            >
              Home
            </Link>

            <span aria-hidden="true">/</span>

            <span className="text-[var(--foreground)]">Visa Checklists</span>
          </nav>

          <div className="max-w-3xl">
            <span className="mb-4 inline-flex rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-4 py-1.5 text-sm font-semibold text-[var(--primary)]">
              Study in Italy
            </span>

            <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              Italian Study Visa Checklists
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
              Select your applicable Italian Embassy or Consulate to view and
              download the required study visa document checklist.
            </p>
          </div>
        </div>
      </section>

      {/* Checklist cards */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
            Select your jurisdiction
          </span>

          <h2 className="mt-3 text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
            Embassy and Consulate Checklists
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[var(--muted-foreground)]">
            Visa requirements may vary according to the Embassy or Consulate
            responsible for processing your application.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visaChecklists.map((checklist) => (
            <article
              key={checklist.id}
              className="group flex h-full flex-col rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)]/40 hover:shadow-xl"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] transition-colors duration-300 group-hover:bg-[var(--primary)] group-hover:text-white">
                <DocumentIcon />
              </div>

              <p className="text-sm font-medium text-[var(--primary)]">
                {checklist.office}
              </p>

              <h3 className="mt-2 text-2xl font-bold text-[var(--foreground)]">
                {checklist.city}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                Study visa document checklist for applicants covered under the{" "}
                {checklist.jurisdiction}.
              </p>

              <div className="mt-auto space-y-3 pt-7">
                <a
                  href={checklist.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
                >
                  <ViewIcon />
                  View checklist
                </a>

                <a
                  href={checklist.file}
                  download
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 hover:text-[var(--primary)]"
                >
                  <DownloadIcon />
                  Download PDF
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Important notice */}
        <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-700">
              !
            </div>

            <div>
              <h2 className="font-semibold text-amber-950">
                Important information
              </h2>

              <p className="mt-1 text-sm leading-6 text-amber-900">
                Visa requirements and procedures may be revised by the Italian
                authorities. Applicants should verify the latest requirements
                with the relevant Embassy, Consulate, or authorized visa
                application centre before submitting an application.
              </p>
            </div>
          </div>
        </div>

        {/* Support section */}
        <div className="mt-12 rounded-3xl bg-[var(--foreground) px-6 py-10 text-center text-[var(--background) sm:px-10">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Need help with your Italian study visa?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl opacity-80">
            European Dreams can guide you through documentation, university
            applications, scholarships, and the study visa process.
          </p>

          <Link
            href="/contact"
            className="mt-7 inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
          >
            Book a free consultation
          </Link>
        </div>
      </section>
    </main>
  );
}
