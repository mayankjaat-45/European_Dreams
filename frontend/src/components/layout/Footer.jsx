import Link from "next/link";
import { getSiteSettings } from "@/lib/getSiteSettings";

const exploreLinks = [
  { label: "Italian Universities", href: "/universities" },
  { label: "Courses in Italy", href: "/courses" },
  { label: "Latest Blogs", href: "/blogs" },
  { label: "About European Dreams", href: "/about" },
];

const supportLinks = [
  { label: "About Us", href: "/about" },
  { label: "Free Consultation", href: "/contact" },
  { label: "Scholarship Guidance", href: "/contact?type=scholarship" },
  { label: "Visa Assistance", href: "/contact?type=visa" },
];

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14m-5-5 5 5-5 5"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />

      <path strokeLinecap="round" strokeLinejoin="round" d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 11.5a8.5 8.5 0 0 1-12.6 7.44L3 20l1.12-5.2A8.5 8.5 0 1 1 21 11.5Z"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.5 8.2c.5 3.5 2.5 5.5 6 6"
      />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"
      />

      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />

      <circle cx="12" cy="12" r="4" />

      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 12s0-4-1-6c-.6-1.1-1.5-1.4-2.5-1.5C16.7 4.2 12 4.2 12 4.2s-4.7 0-6.5.3C4.5 4.6 3.6 4.9 3 6c-1 2-1 6-1 6s0 4 1 6c.6 1.1 1.5 1.4 2.5 1.5 1.8.3 6.5.3 6.5.3s4.7 0 6.5-.3c1-.1 1.9-.4 2.5-1.5 1-2 1-6 1-6Z"
      />

      <path fill="currentColor" stroke="none" d="m10 8.5 6 3.5-6 3.5v-7Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M14 8.5V6.8c0-.8.5-1 1-1h2.5V2.1L14.2 2C10.8 2 9 4 9 6.5v2H6v4h3V22h5v-9.5h3.2l.6-4H14Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M6.5 8.5H3V21h3.5V8.5ZM4.75 3A2.1 2.1 0 1 0 4.75 7.2 2.1 2.1 0 0 0 4.75 3ZM21 14c0-3.8-2-5.8-4.8-5.8-2.2 0-3.2 1.2-3.8 2V8.5H9V21h3.5v-6.2c0-1.6.3-3.2 2.4-3.2 2 0 2.1 1.9 2.1 3.3V21h4v-7Z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.8-6.3L6.7 22H3.5l7.2-8.3L3 2h6.3l4.4 5.8L18.9 2Zm-1.1 17.8h1.7L8.3 4H6.5l11.3 15.8Z" />
    </svg>
  );
}

function FooterLink({ href, children }) {
  return (
    <li>
      <Link
        href={href}
        className="group inline-flex items-center gap-2 text-sm text-slate-300 transition-all duration-300 hover:translate-x-1 hover:text-amber-400"
      >
        <span className="h-1 w-1 rounded-full bg-amber-400/70 transition-all duration-300 group-hover:scale-150 group-hover:bg-amber-400" />

        {children}
      </Link>
    </li>
  );
}

function ContactDetail({ href, icon: Icon, label, value, external = false }) {
  const content = (
    <>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/8 text-amber-400 transition group-hover:bg-amber-400 group-hover:text-slate-950">
        <Icon />
      </span>

      <span className="min-w-0">
        <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </span>

        <span className="mt-0.5 block wrap-break-wordbn text-sm font-semibold leading-5 text-slate-200 transition group-hover:text-white">
          {value}
        </span>
      </span>
    </>
  );

  const className =
    "group flex items-start gap-3 rounded-xl p-2 transition hover:bg-white/5";

  if (!href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={className}
    >
      {content}
    </a>
  );
}

function SocialLink({ href, label, icon: Icon }) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:border-amber-400/50 hover:bg-amber-400 hover:text-slate-950 hover:shadow-lg hover:shadow-amber-400/20"
    >
      <Icon />
    </a>
  );
}

export default async function Footer() {
  const settings = await getSiteSettings();

  const websiteName = settings?.websiteName || "European Dreams";

  const footerDescription =
    settings?.footerDescription ||
    "Helping students turn their dream of studying in Europe into a clear, confident journey—from university selection to admission, scholarships and visa guidance.";

  const primaryEmail = settings?.primaryEmail?.trim() || "";
  const primaryPhone = settings?.primaryPhone?.trim() || "";
  const whatsappNumber = settings?.whatsappNumber?.trim() || "";

  const fullAddress = [
    settings?.address,
    settings?.city,
    settings?.state,
    settings?.postalCode,
    settings?.country,
  ]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(", ");

  const phoneHref = primaryPhone
    ? `tel:${primaryPhone.replace(/[^\d+]/g, "")}`
    : "";

  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`
    : "";

  const socialLinks = settings?.socialLinks || {};

  const instagramUrl =
    socialLinks.instagram || "https://www.instagram.com/europeandreams.in/";

  const youtubeUrl =
    socialLinks.youtube || "https://www.youtube.com/@Europeandreams";

  const copyright =
    settings?.copyrightText ||
    `© ${new Date().getFullYear()} ${websiteName}. All rights reserved.`;

  const hasContactDetails = Boolean(
    primaryEmail || primaryPhone || whatsappNumber || fullAddress,
  );

  return (
    <footer className="relative overflow-hidden bg-[#07152f] text-white">
      {/* Decorative background */}

      <div
        aria-hidden="true"
        className="motion-float-slow absolute -right-32 -top-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="motion-float absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-300 px-5 pb-8 pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <div className="grid gap-12 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.9fr_1.15fr]">
          {/* Brand and contact details */}

          <div>
            <Link
              href="/"
              aria-label={`${websiteName} home`}
              className="group inline-flex text-2xl font-extrabold tracking-tight transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span className="text-blue-400 transition-colors duration-300 group-hover:text-blue-300">
                European
              </span>

              <span className="text-amber-400 transition-colors duration-300 group-hover:text-amber-300">
                Dreams
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
              {footerDescription}
            </p>

            {/* Dynamic contact information */}

            {hasContactDetails && (
              <div className="mt-6 space-y-1">
                {primaryEmail && (
                  <ContactDetail
                    href={`mailto:${primaryEmail}`}
                    icon={MailIcon}
                    label="Email"
                    value={primaryEmail}
                  />
                )}

                {primaryPhone && (
                  <ContactDetail
                    href={phoneHref}
                    icon={PhoneIcon}
                    label="Phone"
                    value={primaryPhone}
                  />
                )}

                {whatsappNumber && (
                  <ContactDetail
                    href={whatsappHref}
                    icon={WhatsAppIcon}
                    label="WhatsApp"
                    value={whatsappNumber}
                    external
                  />
                )}

                {fullAddress && (
                  <ContactDetail
                    href={settings?.googleMapUrl || ""}
                    icon={MapPinIcon}
                    label="Office"
                    value={fullAddress}
                    external={Boolean(settings?.googleMapUrl)}
                  />
                )}
              </div>
            )}

            {/* Dynamic social media */}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <SocialLink
                href={socialLinks.facebook}
                label="European Dreams on Facebook"
                icon={FacebookIcon}
              />

              <SocialLink
                href={instagramUrl}
                label="European Dreams on Instagram"
                icon={InstagramIcon}
              />

              <SocialLink
                href={youtubeUrl}
                label="European Dreams on YouTube"
                icon={YoutubeIcon}
              />

              <SocialLink
                href={socialLinks.linkedin}
                label="European Dreams on LinkedIn"
                icon={LinkedinIcon}
              />

              <SocialLink
                href={socialLinks.twitter}
                label="European Dreams on X"
                icon={TwitterIcon}
              />
            </div>
          </div>

          {/* Explore */}

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Explore
            </h2>

            <ul className="mt-5 space-y-3.5">
              {exploreLinks.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Student support */}

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Student Support
            </h2>

            <ul className="mt-5 space-y-3.5">
              {supportLinks.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Consultation card */}

          <div className="group rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/25 hover:bg-white/8 hover:shadow-2xl hover:shadow-black/10">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-400 text-slate-950 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110">
              <MailIcon />
            </div>

            <h2 className="mt-5 text-xl font-extrabold">
              Start your European journey
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              Talk to our counsellors and get personalised guidance for your
              study plans.
            </p>

            <Link
              href="/contact"
              className="group relative mt-5 inline-flex items-center gap-2 overflow-hidden rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/20"
            >
              <span className="absolute inset-y-0 -left-12 w-8 rotate-12 bg-white/30 blur-md transition-all duration-700 group-hover:left-[120%]" />

              <span className="relative">Book Free Consultation</span>

              <span className="relative">
                <ArrowIcon />
              </span>
            </Link>
          </div>
        </div>

        {/* Bottom footer */}

        <div className="flex flex-col gap-4 pt-7 text-xs text-slate-400 lg:flex-row lg:items-center lg:justify-between">
          <p>{copyright}</p>

          <p>
            Designed &amp; Developed by{" "}
            <a
              href="https://www.maytechsolution.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-semibold text-amber-400 transition-all duration-300 hover:-translate-y-0.5 hover:text-amber-300 hover:underline"
            >
              MayTech Solutions
            </a>
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href="/privacy-policy"
              className="transition-colors duration-300 hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms-and-conditions"
              className="transition-colors duration-300 hover:text-white"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
