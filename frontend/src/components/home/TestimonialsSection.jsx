"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Landmark,
  MapPin,
  Quote,
  School,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

import { getFeaturedTestimonials } from "@/services/testimonial.service";

const TESTIMONIALS_PER_PAGE = 6;

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    limit: TESTIMONIALS_PER_PAGE,
  });

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const sectionRef = useRef(null);

  useEffect(() => {
    let active = true;

    const loadTestimonials = async () => {
      try {
        setLoading(true);

        const result = await getFeaturedTestimonials({
          page,
          limit: TESTIMONIALS_PER_PAGE,
        });

        if (!active) return;

        setTestimonials(result?.testimonials || []);

        setPagination(
          result?.pagination || {
            currentPage: page,
            totalPages: 0,
            totalItems: 0,
            limit: TESTIMONIALS_PER_PAGE,
          },
        );
      } catch (error) {
        console.error("Failed to load testimonials:", error);

        if (active) {
          setTestimonials([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadTestimonials();

    return () => {
      active = false;
    };
  }, [page]);

  const changePage = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.totalPages || nextPage === page) {
      return;
    }

    setPage(nextPage);

    setTimeout(() => {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  if (!loading && !testimonials.length && page === 1) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="
      relative
      scroll-mt-24
      overflow-hidden
      bg-[var(--background)
      py-14
      md:py-20
      "
    >
      {/* Background */}

      <div
        className="
        pointer-events-none
        absolute
        -right-40
        top-0
        h-80
        w-80
        rounded-full
        bg-[var(--primary)/10
        blur-[120px]
        "
      />

      <div
        className="
        pointer-events-none
        absolute
        -bottom-20
        -left-40
        h-80
        w-80
        rounded-full
        bg-[var(--secondary)/10
        blur-[120px]
        "
      />

      <div
        className="
        container-custom
        relative
        z-10
        mx-auto
        px-4
        "
      >
        {/* Heading */}

        <div
          className="
          mx-auto
          max-w-3xl
          text-center
          "
        >
          <div
            className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-[var(--secondary)/20
            bg-[var(--secondary)/10
            px-3
            py-1.5
            text-xs
            font-bold
            uppercase
            tracking-[0.14em]
            text-[var(--secondary)
            "
          >
            <Sparkles size={14} />
            Student Success Stories
          </div>

          <h2
            className="
            mt-4
            text-3xl
            font-bold
            text-[var(--foreground)
            md:text-4xl
            "
          >
            Real Students.
            <span className="text-[var(--primary)"> Real Italy Journeys.</span>
          </h2>

          <p
            className="
            mx-auto
            mt-3
            max-w-2xl
            text-sm
            leading-6
            text-[var(--muted)
            md:text-base
            "
          >
            Real experiences from students who received admission and visa
            guidance for studying in Italy.
          </p>

          {!loading && pagination.totalItems > 0 && (
            <p
              className="
                mt-3
                text-xs
                font-medium
                text-[var(--muted)
                "
            >
              {pagination.totalItems} featured student success{" "}
              {pagination.totalItems === 1 ? "story" : "stories"}
            </p>
          )}
        </div>

        {/* Cards */}

        {loading ? (
          <TestimonialsSkeleton />
        ) : (
          <>
            <div
              className="
              mt-9
              grid
              gap-4
              md:grid-cols-2
              lg:grid-cols-3
              "
            >
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial._id}
                  testimonial={testimonial}
                />
              ))}
            </div>

            {/* Pagination */}

            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={changePage}
              />
            )}

            {/* View all */}

            {/* View all success stories */}

            <div className="mt-10 flex justify-center">
              <Link
                href="/testimonials"
                className="
      inline-flex
      min-h-12
      items-center
      justify-center
      rounded-xl
      border
      border-primary
      bg-primary
      px-7
      py-3
      text-sm
      font-bold
      text-white
      shadow-lg
      shadow-primary/20
      transition-all
      duration-300
      hover:-translate-y-0.5
      hover:bg-primary-hover
      hover:shadow-xl
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-primary
      focus-visible:ring-offset-2
    "
              >
                View All Success Stories
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }) {
  const university = testimonial?.university;

  const course = testimonial?.course;

  const review = testimonial?.shortReview || testimonial?.review || "";

  const rating = Math.min(Math.max(Number(testimonial?.rating) || 5, 1), 5);

  const showJurisdiction =
    testimonial?.visaJurisdiction &&
    testimonial.visaJurisdiction !== "Not specified";

  return (
    <article
      className="
      group
      relative
      flex
      h-full
      flex-col
      overflow-hidden
      rounded-[22px]
      border
      border-[var(--border)
      bg-[var(--card)
      p-5
      shadow-sm
      transition
      duration-300
      hover:-translate-y-1
      hover:border-[var(--primary)/30
      hover:shadow-lg
      "
    >
      {/* Accent */}

      <div
        className="
        absolute
        inset-x-0
        top-0
        h-0.75
        bg-linear-to-r
        from-[var(--primary)
        via-[var(--secondary)
        to-[var(--primary)
        "
      />

      {/* Top */}

      <div
        className="
        flex
        items-center
        justify-between
        gap-3
        "
      >
        <div
          className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-xl
          bg-[var(--primary)/10
          text-[var(--primary)
          "
        >
          <Quote size={17} />
        </div>

        <RatingStars rating={rating} />
      </div>

      {/* Review */}

      <blockquote
        className="
        mt-4
        line-clamp-4
        text-sm
        leading-6
        text-[var(--foreground)
        "
      >
        “{review}”
      </blockquote>

      {/* Status */}

      <div
        className="
        mt-4
        flex
        flex-wrap
        gap-1.5
        "
      >
        {testimonial?.visaApproved && (
          <span
            className="
            inline-flex
            items-center
            gap-1
            rounded-full
            bg-green-500/10
            px-2.5
            py-1
            text-[11px]
            font-semibold
            text-green-600
            "
          >
            <CheckCircle2 size={12} />
            Visa Approved
          </span>
        )}

        {testimonial?.scholarshipReceived && (
          <span
            className="
            inline-flex
            items-center
            gap-1
            rounded-full
            bg-[var(--secondary)/10
            px-2.5
            py-1
            text-[11px]
            font-semibold
            text-[var(--secondary)
            "
          >
            <Trophy size={12} />
            Scholarship
          </span>
        )}
      </div>

      {/* Student */}

      <div
        className="
        mt-4
        border-t
        border-[var(--border)
        pt-4
        "
      >
        <div
          className="
          flex
          items-center
          gap-3
          "
        >
          <div
            className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-linear-to-br
            from-[var(--primary)/15
            to-[var(--secondary)/15
            font-bold
            text-[var(--primary)
            "
          >
            {testimonial?.studentName?.charAt(0)?.toUpperCase() || "S"}
          </div>

          <div className="min-w-0">
            <h3
              className="
              truncate
              text-sm
              font-bold
              text-[var(--foreground)
              "
            >
              {testimonial?.studentName}
            </h3>

            {testimonial?.qualification && (
              <p
                className="
                mt-0.5
                flex
                items-center
                gap-1
                text-xs
                text-[var(--muted)
                "
              >
                <GraduationCap size={12} />

                {testimonial.qualification}
              </p>
            )}
          </div>
        </div>

        {/* City / Jurisdiction */}

        {(testimonial?.studentCity || showJurisdiction) && (
          <div
            className="
            mt-3
            flex
            flex-wrap
            gap-1.5
            "
          >
            {testimonial?.studentCity && (
              <MetaBadge icon={MapPin} value={testimonial.studentCity} />
            )}

            {showJurisdiction && (
              <MetaBadge
                icon={Landmark}
                value={`Visa: ${testimonial.visaJurisdiction}`}
                primary
              />
            )}
          </div>
        )}

        {/* University */}

        {university?.name && (
          <div
            className="
            mt-3
            rounded-xl
            border
            border-[var(--border)
            bg-[var(--background)
            p-3
            "
          >
            <div
              className="
              flex
              gap-2
              "
            >
              <School
                size={15}
                className="
                mt-0.5
                shrink-0
                text-[var(--primary)
                "
              />

              <div className="min-w-0">
                <p
                  className="
                  text-xs
                  font-semibold
                  leading-5
                  text-[var(--primary)
                  "
                >
                  {university.name}
                </p>

                {(university.city || university.region) && (
                  <p
                    className="
                    mt-0.5
                    text-[11px]
                    text-[var(--muted)
                    "
                  >
                    {[university.city, university.region]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}

                {course?.name && (
                  <p
                    className="
                    mt-1
                    line-clamp-1
                    text-[11px]
                    font-medium
                    text-[var(--foreground)
                    "
                  >
                    {course.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Meta */}

        {(testimonial?.intake || testimonial?.admissionYear) && (
          <div
            className="
            mt-3
            flex
            flex-wrap
            gap-x-3
            gap-y-1
            text-[11px]
            text-[var(--muted)
            "
          >
            {testimonial?.intake && (
              <span>
                Intake: <strong>{testimonial.intake}</strong>
              </span>
            )}

            {testimonial?.admissionYear && (
              <span>
                Year: <strong>{testimonial.admissionYear}</strong>
              </span>
            )}
          </div>
        )}

        {/* Result */}

        {testimonial?.result && (
          <div
            className="
            mt-3
            flex
            items-center
            gap-2
            rounded-xl
            bg-green-500/6
            px-3
            py-2.5
            "
          >
            <CheckCircle2
              size={14}
              className="
              shrink-0
              text-green-600
              "
            />

            <p
              className="
              text-xs
              font-semibold
              text-[var(--foreground)
              "
            >
              {testimonial.result}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div
      className="
      mt-9
      flex
      items-center
      justify-center
      gap-3
      "
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-full
        border
        border-[var(--border)
        bg-[var(--card
        text-[var(--foreground)
        transition
        hover:border-[var(--primary)
        disabled:pointer-events-none
        disabled:opacity-30
        "
      >
        <ChevronLeft size={17} />
      </button>

      <div
        className="
        rounded-full
        border
        border-[var(--border)
        bg-[var(--card)
        px-4
        py-2
        text-xs
        font-semibold
        text-[var(--foreground)
        shadow-sm
        "
      >
        {currentPage} / {totalPages}
      </div>

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-full
        border
        border-[var(--border)
        bg-[var(--card)
        text-[var(--foreground)
        transition
        hover:border-[var(--primary)
        disabled:pointer-events-none
        disabled:opacity-30
        "
      >
        <ChevronRight size={17} />
      </button>
    </div>
  );
}

function RatingStars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({
        length: 5,
      }).map((_, index) => (
        <Star
          key={index}
          size={13}
          className={
            index < rating
              ? "fill-[var(--secondary) text-[var(--secondary)"
              : "text-[var(--border)"
          }
        />
      ))}
    </div>
  );
}

function MetaBadge({ icon: Icon, value, primary = false }) {
  return (
    <span
      className={`
      inline-flex
      items-center
      gap-1
      rounded-full
      px-2.5
      py-1
      text-[11px]
      font-medium
      ${
        primary
          ? "bg-[var(--primary)/10 text-[var(--primary)"
          : "bg-[var(--background) text-[var(--muted)"
      }
      `}
    >
      <Icon size={11} />
      {value}
    </span>
  );
}

function TestimonialsSkeleton() {
  return (
    <div
      className="
      mt-9
      grid
      gap-4
      md:grid-cols-2
      lg:grid-cols-3
      "
    >
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <div
          key={index}
          className="
          h-85
          animate-pulse
          rounded-[22px]
          border
          border-[var(--border)
          bg-[var(--card)
          "
        />
      ))}
    </div>
  );
}
