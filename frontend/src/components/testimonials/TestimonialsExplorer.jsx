"use client";

import { useCallback, useEffect, useState } from "react";

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
  Search,
  Star,
  Trophy,
  X,
} from "lucide-react";

import { getTestimonials } from "@/services/testimonial.service";

const TESTIMONIALS_PER_PAGE = 9;

export default function TestimonialsExplorer() {
  const [testimonials, setTestimonials] = useState([]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    limit: TESTIMONIALS_PER_PAGE,
  });

  const [searchInput, setSearchInput] = useState("");

  const [search, setSearch] = useState("");

  const [visaJurisdiction, setVisaJurisdiction] = useState("");

  const [visaApproved, setVisaApproved] = useState("");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getTestimonials({
        page,
        limit: TESTIMONIALS_PER_PAGE,

        search: search || undefined,

        visaJurisdiction: visaJurisdiction || undefined,

        visaApproved: visaApproved === "" ? undefined : visaApproved,
      });

      setTestimonials(
        Array.isArray(result?.testimonials) ? result.testimonials : [],
      );

      setPagination(
        result?.pagination || {
          currentPage: page,
          totalPages: 0,
          totalItems: 0,
          limit: TESTIMONIALS_PER_PAGE,
        },
      );
    } catch (requestError) {
      console.error("Failed to load testimonials:", requestError);

      setTestimonials([]);

      setPagination({
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        limit: TESTIMONIALS_PER_PAGE,
      });

      setError("We could not load student stories. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, search, visaJurisdiction, visaApproved]);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  const handleSearch = (event) => {
    event.preventDefault();

    setPage(1);

    setSearch(searchInput.trim());
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setVisaJurisdiction("");
    setVisaApproved("");
    setPage(1);
  };

  const changePage = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.totalPages || nextPage === page) {
      return;
    }

    setPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const currentPage = pagination?.currentPage || page;

  const totalPages = pagination?.totalPages || 1;

  const totalItems = pagination?.totalItems || 0;

  const hasFilters =
    Boolean(search) || Boolean(visaJurisdiction) || visaApproved !== "";

  return (
    <div>
      {/* Filters */}

      <form
        onSubmit={handleSearch}
        className="
        grid
        gap-3xl
        rounded-
        border
        border-[var(--border)
        bg-[var(--card)
        p-3
        shadow-sm
        lg:grid-cols-[minmax(0,1fr)_180px_170px_auto]
        "
      >
        {/* Search */}

        <div className="relative">
          <Search
            size={18}
            className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-[var(--muted)
            "
          />

          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search student stories..."
            className="
            min-h-12
            w-full
            rounded-xl
            border
            border-[var(--border)
            bg-[var(--background)
            pl-11
            pr-4
            text-sm
            text-[var(--foreground)
            outline-none
            transition
            placeholder:text-[var(--muted)
            focus:border-[var(--primary)
            focus:ring-2
            focus:ring-[var(--primary)/10
            "
          />
        </div>

        {/* Visa jurisdiction */}

        <select
          value={visaJurisdiction}
          onChange={(event) => {
            setVisaJurisdiction(event.target.value);

            setPage(1);
          }}
          className="
          min-h-12
          rounded-xl
          border
          border-[var(--border)
          bg-[var(--background)
          px-4
          text-sm
          text-[var(--foreground)
          outline-none
          transition
          focus:border-[var(--primary)
          "
        >
          <option value="">All visa offices</option>

          <option value="New Delhi">New Delhi</option>

          <option value="Mumbai">Mumbai</option>

          <option value="Bengaluru">Bengaluru</option>

          <option value="Kolkata">Kolkata</option>
        </select>

        {/* Visa outcome */}

        <select
          value={visaApproved}
          onChange={(event) => {
            setVisaApproved(event.target.value);

            setPage(1);
          }}
          className="
          min-h-12
          rounded-xl
          border
          border-[var(--border)
          bg-[var(--background)
          px-4
          text-sm
          text-[var(--foreground)
          outline-none
          transition
          focus:border-[var(--primary)
          "
        >
          <option value="">All outcomes</option>

          <option value="true">Visa approved</option>

          <option value="false">Other stories</option>
        </select>

        <button
          type="submit"
          className="
          min-h-12
          rounded-xl
          bg-[var(--primary)
          px-6
          text-sm
          font-bold
          text-white
          transition
          duration-300
          hover:-translate-y-0.5
          hover:bg-[var(--primary-hover)
          hover:shadow-lg
          "
        >
          Search
        </button>
      </form>

      {/* Results count */}

      {!loading && !error && (
        <div
          className="
          mt-7
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
          "
        >
          <p
            className="
            text-sm
            text-[var(--muted)
            "
          >
            {totalItems} student {totalItems === 1 ? "story" : "stories"}
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="
              inline-flex
              items-center
              gap-1.5
              text-sm
              font-bold
              text-[var(--primary)
              transition
              hover:text-[var(--primary-hover)
              "
            >
              <X size={15} />
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Error */}

      {error && (
        <div
          className="
          mt-8
          rounded-2xl
          border
          border-red-500/20
          bg-red-500/5
          p-8
          text-center
          "
        >
          <p
            className="
            font-medium
            text-red-600
            "
          >
            {error}
          </p>

          <button
            type="button"
            onClick={loadTestimonials}
            className="
            mt-4
            rounded-xl
            bg-[var(--primary)
            px-5
            py-2.5
            text-sm
            font-bold
            text-white
            "
          >
            Try again
          </button>
        </div>
      )}

      {/* Cards */}

      {!error && (
        <div
          className="
          mt-8
          grid
          gap-5
          md:grid-cols-2
          lg:grid-cols-3
          "
        >
          {loading
            ? Array.from({
                length: 6,
              }).map((_, index) => <TestimonialSkeleton key={index} />)
            : testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial._id}
                  testimonial={testimonial}
                />
              ))}
        </div>
      )}

      {/* Empty */}

      {!loading && !error && testimonials.length === 0 && (
        <div
          className="
            mt-8
            rounded-3xl
            border
            border-[var(--border)
            bg-[var(--card)
            px-6
            py-16
            text-center
            shadow-sm
            "
        >
          <h2
            className="
              text-2xl
              font-bold
              text-[var(--foreground)
              "
          >
            No student stories found
          </h2>

          <p
            className="
              mt-2
              text-[var(--muted)
              "
          >
            Try changing your search or filters.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="
              mt-5
              rounded-xl
              bg-[var(--primary)
              px-5
              py-2.5
              text-sm
              font-bold
              text-white
              "
          >
            View all testimonials
          </button>
        </div>
      )}

      {/* View all stories */}

      {/* Pagination */}

      {!loading && !error && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={changePage}
        />
      )}
    </div>
  );
}

function TestimonialCard({ testimonial }) {
  const university = testimonial?.university || null;

  const course = testimonial?.course || null;

  const review = testimonial?.shortReview || testimonial?.review || "";

  const rating = Math.min(Math.max(Number(testimonial?.rating) || 5, 1), 5);

  const showJurisdiction =
    Boolean(testimonial?.visaJurisdiction) &&
    testimonial.visaJurisdiction !== "Not specified";

  const studentInitial =
    testimonial?.studentName?.trim()?.charAt(0)?.toUpperCase() || "S";

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
      hover:shadow-xl
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
        line-clamp-5
        text-sm
        leading-6
        text-[var(--foreground)
        "
      >
        “{review}”
      </blockquote>

      {/* Status */}

      {(testimonial?.visaApproved || testimonial?.scholarshipReceived) && (
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
      )}

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
            {studentInitial}
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
              {testimonial?.studentName || "Student"}
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

        {/* City / jurisdiction */}

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
            <div className="flex gap-2">
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

        {/* Intake / year */}

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
                Intake:{" "}
                <strong
                  className="
                  text-[var(--foreground)
                  "
                >
                  {testimonial.intake}
                </strong>
              </span>
            )}

            {testimonial?.admissionYear && (
              <span>
                Year:{" "}
                <strong
                  className="
                  text-[var(--foreground)
                  "
                >
                  {testimonial.admissionYear}
                </strong>
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

        {/* Scholarship details */}

        {testimonial?.scholarshipReceived &&
          testimonial?.scholarshipDetails && (
            <div
              className="
              mt-3
              rounded-xl
              bg-[var(--secondary)/10
              px-3
              py-2.5
              "
            >
              <p
                className="
                text-[11px]
                font-bold
                uppercase
                tracking-wide
                text-[var(--secondary)
                "
              >
                Scholarship
              </p>

              <p
                className="
                mt-1
                text-xs
                leading-5
                text-[var(--foreground)
                "
              >
                {testimonial.scholarshipDetails}
              </p>
            </div>
          )}
      </div>
    </article>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <nav
      className="
      mt-12
      flex
      items-center
      justify-center
      gap-3
      "
      aria-label="Testimonial pagination"
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        border
        border-[var(--border)
        bg-[var(--card)
        text-[var(--foreground)
        transition
        hover:border-[var(--primary)
        hover:text-[var(--primary)
        disabled:pointer-events-none
        disabled:opacity-30
        "
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      <span
        className="
        rounded-full
        border
        border-[var(--border)
        bg-[var(--card)
        px-5
        py-2
        text-sm
        font-bold
        text-[var(--foreground)
        shadow-sm
        "
      >
        Page {currentPage} of {totalPages}
      </span>

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        border
        border-[var(--border)
        bg-[var(--card)
        text-[var(--foreground)
        transition
        hover:border-[var(--primary)
        hover:text-[var(--primary)
        disabled:pointer-events-none
        disabled:opacity-30
        "
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
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

function TestimonialSkeleton() {
  return (
    <div
      className="
      h-85
      animate-pulse
      rounded-[22px]
      border
      border-[var(--border)
      bg-[var(--card)
      "
    />
  );
}
