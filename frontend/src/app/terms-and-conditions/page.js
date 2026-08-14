import Link from "next/link";

export const metadata = {
  title: "Terms and Conditions | European Dreams",
  description:
    "Read the terms and conditions governing the use of the European Dreams website and educational consultancy services.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: (
      <p>
        By accessing this website or submitting an enquiry, you agree to these
        Terms and Conditions. If you do not agree with these terms, please do
        not use the website or its services.
      </p>
    ),
  },
  {
    title: "2. Our Services",
    content: (
      <p>
        European Dreams provides educational consultancy and guidance related to
        universities, courses, admissions, scholarships, student visas and
        studying abroad. The exact scope of any paid service will be
        communicated separately before the service begins.
      </p>
    ),
  },
  {
    title: "3. Information and Guidance",
    content: (
      <p>
        Website content is provided for general information and guidance.
        University requirements, tuition fees, scholarship rules, visa
        procedures, deadlines and government regulations may change. Users
        should confirm important information through the relevant university,
        embassy or official government website.
      </p>
    ),
  },
  {
    title: "4. No Guarantee of Admission or Visa",
    content: (
      <p>
        European Dreams may assist with applications and documentation, but does
        not guarantee admission, scholarships, visa approval or any specific
        outcome. Final decisions are made exclusively by universities,
        government authorities, embassies and other relevant institutions.
      </p>
    ),
  },
  {
    title: "5. User Responsibilities",
    content: (
      <>
        <p>When using our services, you agree to:</p>

        <ul>
          <li>Provide complete, accurate and genuine information</li>
          <li>Submit authentic educational and personal documents</li>
          <li>Review application details before submission</li>
          <li>Meet relevant deadlines and eligibility requirements</li>
          <li>Inform us promptly about changes affecting your application</li>
          <li>Comply with applicable university and immigration rules</li>
        </ul>
      </>
    ),
  },
  {
    title: "6. Enquiry Submissions",
    content: (
      <p>
        Submission of an enquiry does not create a formal consultant-client
        relationship or require European Dreams to provide a particular service.
        A formal engagement begins only when the service scope, fees and other
        applicable conditions have been agreed upon.
      </p>
    ),
  },
  {
    title: "7. Fees and Payments",
    content: (
      <p>
        Fees for consultancy or document-assistance services, where applicable,
        will be communicated before work begins. University fees, visa fees,
        insurance, travel expenses, application charges and third-party costs
        are separate unless explicitly stated otherwise.
      </p>
    ),
  },
  {
    title: "8. Third-Party Services",
    content: (
      <p>
        We may provide links or information relating to universities, payment
        providers, insurance providers, accommodation services or government
        portals. European Dreams does not control and is not responsible for
        third-party decisions, availability, pricing, security or performance.
      </p>
    ),
  },
  {
    title: "9. Intellectual Property",
    content: (
      <p>
        Unless otherwise stated, the website design, branding, text, graphics
        and original content belong to European Dreams. They may not be copied,
        republished or used commercially without prior written permission.
      </p>
    ),
  },
  {
    title: "10. Prohibited Use",
    content: (
      <p>
        You must not misuse the website, attempt unauthorised access, submit
        false information, distribute harmful code, interfere with website
        operation or use its content for unlawful or fraudulent activity.
      </p>
    ),
  },
  {
    title: "11. Limitation of Liability",
    content: (
      <p>
        To the extent permitted by applicable law, European Dreams will not be
        liable for indirect losses arising from reliance on general website
        information, third-party services, university decisions, visa decisions
        or circumstances outside our reasonable control.
      </p>
    ),
  },
  {
    title: "12. Privacy",
    content: (
      <p>
        Personal information submitted through this website is handled in
        accordance with our{" "}
        <Link
          href="/privacy-policy"
          className="font-semibold text-[var(--primary) hover:underline"
        >
          Privacy Policy
        </Link>
        .
      </p>
    ),
  },
  {
    title: "13. Changes to These Terms",
    content: (
      <p>
        European Dreams may update these Terms and Conditions when its services
        or legal requirements change. Continued use of the website after an
        update constitutes acceptance of the revised terms.
      </p>
    ),
  },
];

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)">
      <section className="border-b border-[var(--border) bg-[var(--hero-gradient)">
        <div className="mx-auto max-w-250 px-5 py-20 text-center sm:px-8 lg:py-24">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--secondary)">
            Legal Information
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground) sm:text-5xl">
            Terms &amp; Conditions
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--muted)">
            These terms govern your use of the European Dreams website and
            educational consultancy services.
          </p>

          <p className="mt-4 text-sm text-[var(--muted)">
            Last updated: 11 August 2026
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-225 px-5 py-14 sm:px-8 lg:py-20">
        <div className="rounded-[28px] border border-[var(--border) bg-[var(--card) p-6 shadow-sm sm:p-10">
          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-4 text-2xl font-bold text-[var(--foreground)">
                  {section.title}
                </h2>

                <div className="space-y-4 text-[15px] leading-7 text-[var(--muted) [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
                  {section.content}
                </div>
              </section>
            ))}

            <section>
              <h2 className="mb-4 text-2xl font-bold text-[var(--foreground)">
                14. Contact Us
              </h2>

              <div className="space-y-2 text-[15px] leading-7 text-[var(--muted)">
                <p>For questions about these Terms and Conditions, contact:</p>

                <p>
                  Email:{" "}
                  <a
                    href="mailto:foreigndreams660@gmail.com"
                    className="font-semibold text-[var(--primary) hover:underline"
                  >
                    foreigndreams660@gmail.com
                  </a>
                </p>

                <p>
                  Phone:{" "}
                  <a
                    href="tel:+393391952921"
                    className="font-semibold text-[var(--primary) hover:underline"
                  >
                    +39 339 195 2921
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="font-semibold text-primary hover:underline">
            ← Return to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
