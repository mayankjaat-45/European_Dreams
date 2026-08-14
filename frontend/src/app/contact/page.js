import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import EnquiryForm from "@/components/home/EnquiryForm";
import { getSiteSettings } from "@/lib/getSiteSettings";

export const metadata = {
  title: "Free Study in Italy Consultation",
  description:
    "Contact European Dreams for personalised guidance on Italian universities, courses, scholarships, admissions and student visas.",
};

const supportItems = [
  {
    title: "University & course selection",
    description:
      "Shortlist suitable Italian universities and English-taught programmes for your profile.",
  },
  {
    title: "Application guidance",
    description:
      "Understand eligibility, documents, deadlines and the complete admission process.",
  },
  {
    title: "Scholarship support",
    description:
      "Explore scholarships and financial support available for international students.",
  },
  {
    title: "Visa assistance",
    description:
      "Prepare your student visa documentation with clear, step-by-step guidance.",
  },
];

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="h-5 w-5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ContactItem({
  href,
  icon: Icon,
  label,
  value,
  external = false,
  variant = "primary",
}) {
  const colorClasses = {
    primary: {
      link: "hover:border-primary/30 hover:bg-primary/5",
      icon: `
        bg-primary/10
        text-primary
        group-hover:bg-primary
        group-hover:text-white
      `,
      value: "group-hover:text-primary",
    },

    whatsapp: {
      link: "hover:border-green-500/30 hover:bg-green-500/5",
      icon: `
        bg-green-500/10
        text-green-600
        group-hover:bg-green-600
        group-hover:text-white
      `,
      value: "group-hover:text-green-600",
    },

    secondary: {
      link: "hover:border-secondary/30 hover:bg-secondary/5",
      icon: `
        bg-secondary/10
        text-secondary
        group-hover:bg-secondary
        group-hover:text-white
      `,
      value: "group-hover:text-secondary",
    },
  };

  const colors = colorClasses[variant] || colorClasses.primary;

  const content = (
    <>
      <span
        className={`
          grid
          h-10
          w-10
          shrink-0
          place-items-center
          rounded-xl
          transition
          duration-300
          ${colors.icon}
        `}
      >
        <Icon size={18} />
      </span>

      <span className="min-w-0">
        <span className="block text-xs font-semibold text-muted">{label}</span>

        <span
          className={`
            mt-0.5
            block
            wrap-break-word
            text-sm
            font-bold
            leading-5
            text-foreground
            transition-colors
            ${colors.value}
          `}
        >
          {value}
        </span>
      </span>
    </>
  );

  const className = `
    group
    flex
    items-start
    gap-3
    rounded-xl
    border
    border-border
    bg-background
    p-3
    transition
    duration-300
    ${colors.link}
  `;

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

export default async function ContactPage({ searchParams }) {
  const [query, settings] = await Promise.all([
    searchParams,
    getSiteSettings(),
  ]);

  const requestedType = Array.isArray(query?.type)
    ? query.type[0]
    : query?.type;

  const requestedUniversity = Array.isArray(query?.university)
    ? query.university[0]
    : query?.university;

  const requestedCourse = Array.isArray(query?.course)
    ? query.course[0]
    : query?.course;

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

  const whatsappMessage = [
    "Hello European Dreams,",
    "I would like to book a free study consultation.",
    requestedUniversity ? `Preferred university: ${requestedUniversity}` : "",
    requestedCourse ? `Preferred course: ${requestedCourse}` : "",
    requestedType ? `Consultation type: ${requestedType}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const whatsappBookingHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
        whatsappMessage,
      )}`
    : "";

  const hasContactDetails = Boolean(
    primaryEmail || primaryPhone || whatsappNumber || fullAddress,
  );

  return (
    <main className="min-h-screen overflow-x-clip bg-background">
      {/* Hero */}

      <section className="relative overflow-hidden border-b border-border bg-(--hero-gradient)">
        {/* Background decorations */}

        <div
          aria-hidden="true"
          className="
            motion-float-slow
            pointer-events-none
            absolute
            -right-24
            -top-24
            h-80
            w-80
            rounded-full
            bg-primary/15
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            motion-float
            pointer-events-none
            absolute
            -bottom-32
            left-10
            h-80
            w-80
            rounded-full
            bg-secondary/15
            blur-3xl
          "
        />

        <div
          data-reveal
          className="
            relative
            mx-auto
            w-full
            max-w-300
            px-5
            py-16
            text-center
            sm:px-6
            lg:px-8
            lg:py-20
          "
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-secondary">
            Start your journey
          </p>

          <h1 className="mx-auto mt-4 max-w-4xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Let&apos;s plan your future in Italy
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Get personalised guidance for university selection, applications,
            scholarships and your Italian student visa.
          </p>
        </div>
      </section>

      {/* Main content */}

      <section
        className="
          mx-auto
          grid
          w-full
          max-w-300
          gap-10
          px-5
          py-14
          sm:px-6
          lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)]
          lg:gap-16
          lg:px-8
          lg:py-20
        "
      >
        {/* Left column */}

        <div
          data-reveal="left"
          className="min-w-0 lg:sticky lg:top-28 lg:self-start"
        >
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-secondary">
            How we help
          </p>

          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Clear guidance at every step
          </h2>

          <p className="mt-4 leading-7 text-muted">
            Whether you are still exploring or ready to apply, our counsellors
            will help you make confident decisions.
          </p>

          {/* Support cards */}

          <div className="mt-8 space-y-4">
            {supportItems.map((item, index) => (
              <div
                key={item.title}
                data-reveal
                data-delay={(index % 4) + 1}
                className="
                  motion-card
                  group
                  flex
                  min-w-0
                  gap-4
                  rounded-2xl
                  border
                  border-border
                  bg-card
                  p-5
                  shadow-sm
                "
              >
                <span
                  className="
                    grid
                    h-10
                    w-10
                    shrink-0
                    place-items-center
                    rounded-xl
                    bg-primary-light
                    text-primary
                    transition-all
                    duration-300
                    group-hover:scale-110
                    group-hover:bg-primary
                    group-hover:text-white
                  "
                >
                  <CheckIcon />
                </span>

                <div className="min-w-0">
                  <h3 className="font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-muted">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Free consultation */}

          {/* Free consultation */}

          <div
            data-reveal="scale"
            data-delay="4"
            className="
    mt-6
    min-w-0
    rounded-2xl
    border
    border-green-500/25
    bg-green-500/5
    p-5
  "
          >
            <div className="flex items-start gap-3">
              <span
                className="
        grid
        h-11
        w-11
        shrink-0
        place-items-center
        rounded-xl
        bg-green-600
        text-white
      "
              >
                <MessageCircle size={21} />
              </span>

              <div className="min-w-0">
                <p className="font-bold text-foreground">
                  Free and personalised
                </p>

                <p className="mt-1 text-sm leading-6 text-muted">
                  Your first consultation is free and tailored to your academic
                  background and goals.
                </p>
              </div>
            </div>

            {whatsappNumber ? (
              <a
                href={whatsappBookingHref}
                target="_blank"
                rel="noopener noreferrer"
                className="
        mt-5
        inline-flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-green-600
        px-5
        py-3
        text-sm
        font-bold
        text-white
        shadow-lg
        shadow-green-600/20
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:bg-green-700
        hover:shadow-xl
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-green-500
        focus-visible:ring-offset-2
      "
              >
                <MessageCircle size={19} />
                Book Free Consultation on WhatsApp
              </a>
            ) : (
              <p className="mt-4 rounded-xl bg-background p-3 text-sm text-muted">
                Complete the consultation form and our counsellor will contact
                you.
              </p>
            )}
          </div>

          {/* Contact details */}

          {hasContactDetails && (
            <div
              data-reveal="scale"
              className="
                mt-6
                rounded-2xl
                border
                border-border
                bg-card
                p-5
                shadow-sm
              "
            >
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-secondary">
                Contact us
              </p>

              <h3 className="mt-2 font-display text-xl font-bold text-foreground">
                Speak with our counsellors
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Contact our team directly if you need assistance before
                submitting the consultation form.
              </p>

              <div className="mt-5 space-y-3">
                {primaryEmail && (
                  <ContactItem
                    href={`mailto:${primaryEmail}`}
                    icon={Mail}
                    label="Email"
                    value={primaryEmail}
                  />
                )}

                {primaryPhone && (
                  <ContactItem
                    href={phoneHref}
                    icon={Phone}
                    label="Call us"
                    value={primaryPhone}
                  />
                )}

                {whatsappNumber && (
                  <ContactItem
                    href={whatsappBookingHref}
                    icon={MessageCircle}
                    label="Book on WhatsApp"
                    value={whatsappNumber}
                    external
                    variant="whatsapp"
                  />
                )}

                {fullAddress && (
                  <ContactItem
                    href={settings?.googleMapUrl || ""}
                    icon={MapPin}
                    label="Office address"
                    value={fullAddress}
                    external={Boolean(settings?.googleMapUrl)}
                    variant="secondary"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right column / Form */}

        <div data-reveal="right" className="w-full min-w-0">
          <EnquiryForm
            initialEnquiryType={requestedType}
            initialUniversity={requestedUniversity}
            initialCourse={requestedCourse}
            whatsappNumber={whatsappNumber}
          />
        </div>
      </section>
    </main>
  );
}
