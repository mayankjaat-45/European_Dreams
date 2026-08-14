import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | European Dreams",
  description:
    "Learn how European Dreams collects, uses, stores and protects information submitted through its enquiry and contact forms.",
};

const sections = [
  {
    title: "1. Information We Collect",
    content: (
      <>
        <p>
          European Dreams may collect personal information that you voluntarily
          provide through our enquiry or contact forms. This may include:
        </p>

        <ul>
          <li>Your name</li>
          <li>Email address</li>
          <li>Phone or WhatsApp number</li>
          <li>Preferred country, university or course</li>
          <li>Educational background</li>
          <li>Any message or information included in your enquiry</li>
        </ul>
      </>
    ),
  },
  {
    title: "2. How We Use Your Information",
    content: (
      <>
        <p>Information submitted through the website may be used to:</p>

        <ul>
          <li>Respond to your enquiry</li>
          <li>Provide education and study-abroad guidance</li>
          <li>Recommend suitable countries, universities or courses</li>
          <li>Provide information about admission and visa processes</li>
          <li>
            Contact you regarding services in which you expressed interest
          </li>
          <li>Improve our services and customer support</li>
        </ul>
      </>
    ),
  },
  {
    title: "3. Consent to Communication",
    content: (
      <p>
        By submitting an enquiry, you consent to being contacted by European
        Dreams through phone, email or WhatsApp regarding your enquiry and
        relevant educational consultancy services. You may ask us to stop
        contacting you at any time.
      </p>
    ),
  },
  {
    title: "4. Information Sharing",
    content: (
      <p>
        European Dreams does not sell or rent your personal information. Your
        information may only be shared with authorised staff, service providers,
        educational institutions or other relevant organisations when required
        to respond to your enquiry or provide a service requested by you.
      </p>
    ),
  },
  {
    title: "5. Data Security",
    content: (
      <p>
        We take reasonable administrative and technical measures to protect
        personal information against unauthorised access, misuse, alteration or
        disclosure. However, no method of online transmission or electronic
        storage can be guaranteed to be completely secure.
      </p>
    ),
  },
  {
    title: "6. Data Retention",
    content: (
      <p>
        We retain enquiry information only for as long as reasonably necessary
        to respond to your request, provide our services, maintain business
        records and comply with applicable legal obligations.
      </p>
    ),
  },
  {
    title: "7. External Links",
    content: (
      <p>
        Our website may contain links to universities, government portals or
        third-party websites. European Dreams is not responsible for the privacy
        practices, security or content of those external websites.
      </p>
    ),
  },
  {
    title: "8. Your Rights",
    content: (
      <p>
        You may contact us to request access to, correction of or deletion of
        personal information submitted through our website. Some information may
        be retained where required for legal or legitimate business purposes.
      </p>
    ),
  },
  {
    title: "9. Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy when our services or legal
        requirements change. The latest version will always be published on this
        page with its updated date.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="border-b border-[var(--border)] bg-[var(--hero-gradient)]">
        <div className="mx-auto max-w-[1000px] px-5 py-20 text-center sm:px-8 lg:py-24">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--secondary)]">
            Legal Information
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">
            This policy explains how European Dreams handles information
            submitted through its enquiry and contact forms.
          </p>

          <p className="mt-4 text-sm text-[var(--muted)]">
            Last updated: 11 August 2026
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-5 py-14 sm:px-8 lg:py-20">
        <div className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-10">
          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-4 text-2xl font-bold text-[var(--foreground)]">
                  {section.title}
                </h2>

                <div className="space-y-4 text-[15px] leading-7 text-[var(--muted)] [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
                  {section.content}
                </div>
              </section>
            ))}

            <section>
              <h2 className="mb-4 text-2xl font-bold text-[var(--foreground)]">
                10. Contact Us
              </h2>

              <div className="space-y-2 text-[15px] leading-7 text-[var(--muted)]">
                <p>
                  For privacy-related questions or requests, contact European
                  Dreams:
                </p>

                <p>
                  Email:{" "}
                  <a
                    href="mailto:foreigndreams660@gmail.com"
                    className="font-semibold text-[var(--primary)] hover:underline"
                  >
                    foreigndreams660@gmail.com
                  </a>
                </p>

                <p>
                  Phone:{" "}
                  <a
                    href="tel:+393391952921"
                    className="font-semibold text-[var(--primary)] hover:underline"
                  >
                    +39 339 195 2921
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="font-semibold text-primary hover:underline"
          >
            ← Return to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
