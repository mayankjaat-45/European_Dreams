"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Eye,
  FileText,
  GraduationCap,
  LoaderCircle,
  MapPin,
  Pencil,
  Search,
  ShieldCheck,
  Star,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

import API from "@/lib/api";

const visaJurisdictions = [
  "New Delhi",
  "Mumbai",
  "Bengaluru",
  "Kolkata",
  "Not specified",
];

const initialFilters = {
  search: "",
  status: "all",
  featured: "",
  consentToPublish: "",
  visaApproved: "",
  visaJurisdiction: "",
  scholarshipReceived: "",
};

const inputClass =
  "min-h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10";

function getStoredUserRole() {
  if (typeof window === "undefined") return "";

  try {
    const storedUser =
      localStorage.getItem("user") ||
      localStorage.getItem("admin_user") ||
      localStorage.getItem("crm_user");

    if (!storedUser) return "";

    const user = JSON.parse(storedUser);

    return user?.role || "";
  } catch {
    return "";
  }
}

function formatDate(date) {
  if (!date) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "ST";

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function RatingStars({ rating = 5 }) {
  const value = Math.max(1, Math.min(Number(rating) || 5, 5));

  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${value} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={15}
          className={
            index < value
              ? "fill-secondary text-secondary"
              : "fill-transparent text-border"
          }
        />
      ))}
    </div>
  );
}

function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
        active ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-success" : "bg-danger"
        }`}
      />

      {active ? "Active" : "Inactive"}
    </span>
  );
}

function EmptyState({ hasFilters, onClear }) {
  return (
    <section className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
        <FileText size={30} />
      </div>

      <h2 className="mt-5 text-xl font-bold text-foreground">
        No testimonials found
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
        {hasFilters
          ? "No testimonial matches the selected filters. Try clearing some filters."
          : "Add the first student testimonial to display it here."}
      </p>

      {hasFilters ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-5 text-sm font-bold text-foreground transition hover:bg-card-hover"
        >
          <X size={17} />
          Clear filters
        </button>
      ) : (
        <Link
          href="/admin/testimonials/new"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover"
        >
          <CirclePlus size={18} />
          Add testimonial
        </Link>
      )}
    </section>
  );
}

function TestimonialCard({
  testimonial,
  canManageStatus,
  canDelete,
  statusUpdatingId,
  deletingId,
  onStatusChange,
  onDelete,
}) {
  const universityName =
    typeof testimonial.university === "object"
      ? testimonial.university?.name
      : "";

  const courseName =
    typeof testimonial.course === "object" ? testimonial.course?.name : "";

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-sm font-black text-white">
            {getInitials(testimonial.studentName)}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-foreground">
              {testimonial.studentName}
            </h2>

            <p className="mt-0.5 text-xs font-semibold text-muted">
              Updated {formatDate(testimonial.updatedAt)}
            </p>
          </div>
        </div>

        <StatusBadge active={testimonial.isActive} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <RatingStars rating={testimonial.rating} />

        {testimonial.isFeatured && (
          <span className="rounded-full bg-secondary/15 px-2.5 py-1 text-[11px] font-bold text-secondary">
            Featured
          </span>
        )}

        {testimonial.consentToPublish ? (
          <span className="rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-bold text-success">
            Publishing consent
          </span>
        ) : (
          <span className="rounded-full bg-danger/10 px-2.5 py-1 text-[11px] font-bold text-danger">
            No consent
          </span>
        )}
      </div>

      <blockquote className="mt-4 line-clamp-4 text-sm leading-6 text-muted">
        “
        {testimonial.shortReview ||
          testimonial.review ||
          "No review has been added."}
        ”
      </blockquote>

      <div className="mt-5 space-y-2.5 border-t border-border pt-4">
        {universityName && (
          <div className="flex items-start gap-2 text-sm text-muted">
            <GraduationCap size={16} className="mt-0.5 shrink-0 text-primary" />

            <span className="line-clamp-1">{universityName}</span>
          </div>
        )}

        {courseName && (
          <div className="flex items-start gap-2 text-sm text-muted">
            <FileText size={16} className="mt-0.5 shrink-0 text-primary" />

            <span className="line-clamp-1">{courseName}</span>
          </div>
        )}

        {testimonial.studentCity && (
          <div className="flex items-start gap-2 text-sm text-muted">
            <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />

            <span>{testimonial.studentCity}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {testimonial.visaApproved && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-success/10 px-2.5 py-1.5 text-xs font-bold text-success">
            <ShieldCheck size={14} />
            Visa approved
          </span>
        )}

        {testimonial.scholarshipReceived && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/15 px-2.5 py-1.5 text-xs font-bold text-secondary">
            <Award size={14} />
            Scholarship
          </span>
        )}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-5">
        <Link
          href={`/admin/testimonials/${testimonial._id}`}
          className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border px-3 text-xs font-bold text-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
        >
          <Eye size={16} />
          View
        </Link>

        <Link
          href={`/admin/testimonials/${testimonial._id}/edit`}
          className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border px-3 text-xs font-bold text-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
        >
          <Pencil size={15} />
          Edit
        </Link>

        {canManageStatus && (
          <button
            type="button"
            disabled={statusUpdatingId === testimonial._id}
            onClick={() => onStatusChange(testimonial)}
            className={`inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
              testimonial.isActive
                ? "bg-danger/10 text-danger hover:bg-danger/15"
                : "bg-success/10 text-success hover:bg-success/15"
            }`}
          >
            {statusUpdatingId === testimonial._id ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <CheckCircle2 size={15} />
            )}

            {testimonial.isActive ? "Deactivate" : "Activate"}
          </button>
        )}

        {canDelete && (
          <button
            type="button"
            disabled={deletingId === testimonial._id}
            onClick={() => onDelete(testimonial)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-danger/20 text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={`Delete testimonial from ${testimonial.studentName}`}
          >
            {deletingId === testimonial._id ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        )}
      </div>
    </article>
  );
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    limit: 12,
  });

  const [filters, setFilters] = useState(initialFilters);
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [statusUpdatingId, setStatusUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [apiError, setApiError] = useState("");
  const [currentRole, setCurrentRole] = useState("");

  useEffect(() => {
    setCurrentRole(getStoredUserRole());
  }, []);

  const canManageStatus = ["super_admin", "admin"].includes(currentRole);
  const canDelete = ["super_admin", "admin"].includes(currentRole);

  const hasFilters = useMemo(() => {
    return Boolean(
      appliedSearch ||
      filters.status !== "all" ||
      filters.featured ||
      filters.consentToPublish ||
      filters.visaApproved ||
      filters.visaJurisdiction ||
      filters.scholarshipReceived,
    );
  }, [appliedSearch, filters]);

  const loadTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setApiError("");

      const params = {
        page,
        limit: pagination.limit,
        status: filters.status,
      };

      if (appliedSearch) {
        params.search = appliedSearch;
      }

      if (filters.featured !== "") {
        params.featured = filters.featured;
      }

      if (filters.consentToPublish !== "") {
        params.consentToPublish = filters.consentToPublish;
      }

      if (filters.visaApproved !== "") {
        params.visaApproved = filters.visaApproved;
      }

      if (filters.visaJurisdiction) {
        params.visaJurisdiction = filters.visaJurisdiction;
      }

      if (filters.scholarshipReceived !== "") {
        params.scholarshipReceived = filters.scholarshipReceived;
      }

      const response = await API.get("/api/testimonials/admin/all", {
        params,
      });

      const data = response.data?.data || {};

      setTestimonials(data.testimonials || []);

      setPagination((previous) => ({
        ...previous,
        ...(data.pagination || {}),
      }));
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        requestError.message ||
        "Unable to load testimonials.";

      setApiError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [appliedSearch, filters, page, pagination.limit]);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  const updateFilter = (name, value) => {
    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name !== "search") {
      setPage(1);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();

    setAppliedSearch(filters.search.trim());
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setAppliedSearch("");
    setPage(1);
  };

  const handleStatusChange = async (testimonial) => {
    try {
      setStatusUpdatingId(testimonial._id);

      const response = await API.patch(
        `/api/testimonials/${testimonial._id}/status`,
        {
          isActive: !testimonial.isActive,
        },
      );

      const updatedTestimonial = response.data?.data?.testimonial;

      setTestimonials((previous) =>
        previous.map((item) =>
          item._id === testimonial._id
            ? {
                ...item,
                ...(updatedTestimonial || {}),
                isActive: updatedTestimonial?.isActive ?? !testimonial.isActive,
              }
            : item,
        ),
      );

      toast.success(
        response.data?.message ||
          `Testimonial ${
            testimonial.isActive ? "deactivated" : "activated"
          } successfully.`,
      );
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to update testimonial status.",
      );
    } finally {
      setStatusUpdatingId("");
    }
  };

  const handleDelete = async (testimonial) => {
    const shouldDelete = window.confirm(
      `Delete the testimonial from "${testimonial.studentName}" permanently?\n\nThis action cannot be undone.`,
    );

    if (!shouldDelete) return;

    try {
      setDeletingId(testimonial._id);

      const response = await API.delete(`/api/testimonials/${testimonial._id}`);

      toast.success(
        response.data?.message || "Testimonial deleted successfully.",
      );

      if (testimonials.length === 1 && page > 1) {
        setPage((previous) => previous - 1);
      } else {
        await loadTestimonials();
      }
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to delete testimonial.",
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
            Student success
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-4xl">
            Testimonials
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
            Manage student reviews, publishing consent, visa results and
            featured testimonials.
          </p>
        </div>

        <Link
          href="/admin/testimonials/new"
          className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover lg:self-auto"
        >
          <CirclePlus size={19} />
          Add testimonial
        </Link>
      </section>

      {/* Summary cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">
                Total records
              </p>

              <p className="mt-2 text-3xl font-black text-foreground">
                {pagination.totalItems}
              </p>
            </div>

            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <UserRound size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">
                Active on page
              </p>

              <p className="mt-2 text-3xl font-black text-success">
                {
                  testimonials.filter((testimonial) => testimonial.isActive)
                    .length
                }
              </p>
            </div>

            <div className="grid h-11 w-11 place-items-center rounded-xl bg-success/10 text-success">
              <CheckCircle2 size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">
                Featured on page
              </p>

              <p className="mt-2 text-3xl font-black text-secondary">
                {
                  testimonials.filter((testimonial) => testimonial.isFeatured)
                    .length
                }
              </p>
            </div>

            <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary/15 text-secondary">
              <Star size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">
                Visa approved
              </p>

              <p className="mt-2 text-3xl font-black text-primary">
                {
                  testimonials.filter((testimonial) => testimonial.visaApproved)
                    .length
                }
              </p>
            </div>

            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck size={21} />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              type="search"
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Search student, review, qualification or city..."
              className={`${inputClass} pl-11`}
            />
          </div>

          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover"
          >
            <Search size={17} />
            Search
          </button>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border px-5 text-sm font-bold text-foreground transition hover:bg-card-hover"
            >
              <X size={17} />
              Clear
            </button>
          )}
        </form>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <select
            value={filters.status}
            onChange={(event) => updateFilter("status", event.target.value)}
            className={inputClass}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={filters.consentToPublish}
            onChange={(event) =>
              updateFilter("consentToPublish", event.target.value)
            }
            className={inputClass}
          >
            <option value="">All consent states</option>
            <option value="true">Consent given</option>
            <option value="false">Consent missing</option>
          </select>

          <select
            value={filters.featured}
            onChange={(event) => updateFilter("featured", event.target.value)}
            className={inputClass}
          >
            <option value="">All featured states</option>
            <option value="true">Featured</option>
            <option value="false">Not featured</option>
          </select>

          <select
            value={filters.visaApproved}
            onChange={(event) =>
              updateFilter("visaApproved", event.target.value)
            }
            className={inputClass}
          >
            <option value="">All visa results</option>
            <option value="true">Visa approved</option>
            <option value="false">Visa not approved</option>
          </select>

          <select
            value={filters.scholarshipReceived}
            onChange={(event) =>
              updateFilter("scholarshipReceived", event.target.value)
            }
            className={inputClass}
          >
            <option value="">All scholarships</option>
            <option value="true">Scholarship received</option>
            <option value="false">No scholarship</option>
          </select>

          <select
            value={filters.visaJurisdiction}
            onChange={(event) =>
              updateFilter("visaJurisdiction", event.target.value)
            }
            className={inputClass}
          >
            <option value="">All jurisdictions</option>

            {visaJurisdictions.map((jurisdiction) => (
              <option key={jurisdiction} value={jurisdiction}>
                {jurisdiction}
              </option>
            ))}
          </select>
        </div>
      </section>

      {apiError && (
        <div className="rounded-2xl border border-danger/20 bg-danger/10 px-5 py-4 text-sm font-semibold text-danger">
          {apiError}
        </div>
      )}

      {/* Testimonials */}
      {loading ? (
        <div className="grid min-h-90 place-items-center rounded-2xl border border-border bg-card">
          <div className="text-center">
            <LoaderCircle
              size={34}
              className="mx-auto animate-spin text-primary"
            />

            <p className="mt-4 text-sm font-semibold text-muted">
              Loading testimonials...
            </p>
          </div>
        </div>
      ) : testimonials.length === 0 ? (
        <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial._id}
                testimonial={testimonial}
                canManageStatus={canManageStatus}
                canDelete={canDelete}
                statusUpdatingId={statusUpdatingId}
                deletingId={deletingId}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          <section className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row">
            <p className="text-sm font-semibold text-muted">
              Page{" "}
              <strong className="text-foreground">
                {pagination.currentPage}
              </strong>{" "}
              of{" "}
              <strong className="text-foreground">
                {Math.max(pagination.totalPages, 1)}
              </strong>{" "}
              · {pagination.totalItems} testimonials
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((previous) => Math.max(previous - 1, 1))}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-bold text-foreground transition hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              <button
                type="button"
                disabled={page >= pagination.totalPages || loading}
                onClick={() => setPage((previous) => previous + 1)}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-bold text-foreground transition hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ChevronRight size={17} />
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
