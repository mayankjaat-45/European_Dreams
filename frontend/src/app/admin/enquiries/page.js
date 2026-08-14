"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  ExternalLink,
  Filter,
  GraduationCap,
  LoaderCircle,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

import API from "@/lib/api";

const STATUSES = [
  "new",
  "contacted",
  "follow_up",
  "qualified",
  "converted",
  "closed",
  "spam",
];

const PRIORITIES = ["low", "medium", "high"];

const ENQUIRY_TYPES = [
  "general",
  "admission",
  "university",
  "course",
  "visa",
  "scholarship",
  "partnership",
  "other",
];

const SOURCES = [
  "website",
  "university_page",
  "course_page",
  "blog",
  "contact_page",
  "other",
];

const INITIAL_FILTERS = {
  search: "",
  status: "",
  priority: "",
  enquiryType: "",
  source: "",
  dateFrom: "",
  dateTo: "",
};

function formatLabel(value = "") {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value) {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getStoredRole() {
  if (typeof window === "undefined") return "";

  try {
    const user = JSON.parse(localStorage.getItem("admin_user") || "null");

    return user?.role || "";
  } catch {
    return "";
  }
}

function Badge({ value, type = "status" }) {
  const priorityColors = {
    high: "bg-danger/10 text-danger",
    medium: "bg-secondary/15 text-secondary",
    low: "bg-success/10 text-success",
  };

  const statusColors = {
    new: "bg-primary/10 text-primary",
    contacted: "bg-sky-500/10 text-sky-600",
    follow_up: "bg-secondary/15 text-secondary",
    qualified: "bg-violet-500/10 text-violet-600",
    converted: "bg-success/10 text-success",
    closed: "bg-muted/10 text-muted",
    spam: "bg-danger/10 text-danger",
  };

  const colors = type === "priority" ? priorityColors : statusColors;

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
        colors[value] || "bg-card-hover text-muted"
      }`}
    >
      {formatLabel(value)}
    </span>
  );
}

function EmptyState({ filtered }) {
  return (
    <div className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-border bg-card p-6 text-center">
      <div>
        <MessageSquareText size={40} className="mx-auto text-muted" />

        <h2 className="mt-4 text-lg font-bold text-foreground">
          No enquiries found
        </h2>

        <p className="mt-2 text-sm text-muted">
          {filtered
            ? "Try changing or clearing the filters."
            : "New website enquiries will appear here."}
        </p>
      </div>
    </div>
  );
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    limit: 12,
  });

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [draftSearch, setDraftSearch] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    setRole(getStoredRole());
  }, []);

  const canUpdate = ["super_admin", "admin"].includes(role);
  const canDelete = role === "super_admin";

  const hasFilters = useMemo(() => {
    return Object.values(filters).some(Boolean);
  }, [filters]);

  const loadEnquiries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/api/enquiries", {
        params: {
          ...filters,
          page,
          limit: 12,
        },
      });

      const data = response.data?.data || {};

      setEnquiries(data.enquiries || []);

      setPagination(
        data.pagination || {
          currentPage: page,
          totalPages: 0,
          totalItems: 0,
          limit: 12,
        },
      );
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        requestError.message ||
        "Unable to load enquiries.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);

  function changeFilter(name, value) {
    setPage(1);

    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function submitSearch(event) {
    event.preventDefault();
    changeFilter("search", draftSearch.trim());
  }

  function clearFilters() {
    setDraftSearch("");
    setPage(1);
    setFilters(INITIAL_FILTERS);
  }

  async function updateStatus(enquiry, status) {
    if (!canUpdate || status === enquiry.status) return;

    try {
      setUpdatingId(enquiry._id);

      const response = await API.put(`/api/enquiries/${enquiry._id}`, {
        status,
      });

      const updatedEnquiry = response.data?.data?.enquiry;

      setEnquiries((currentEnquiries) =>
        currentEnquiries.map((currentEnquiry) =>
          currentEnquiry._id === enquiry._id
            ? {
                ...currentEnquiry,
                ...(updatedEnquiry || {}),
                status: updatedEnquiry?.status || status,
              }
            : currentEnquiry,
        ),
      );

      toast.success(
        response.data?.message || "Enquiry status updated successfully.",
      );
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Unable to update enquiry status.",
      );
    } finally {
      setUpdatingId("");
    }
  }

  async function deleteEnquiry(enquiry) {
    if (!canDelete) return;

    const confirmed = window.confirm(
      `Delete the enquiry from ${enquiry.name}?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(enquiry._id);

      const response = await API.delete(`/api/enquiries/${enquiry._id}`);

      toast.success(response.data?.message || "Enquiry deleted successfully.");

      if (enquiries.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        loadEnquiries();
      }
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message || "Unable to delete enquiry.",
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}

      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-secondary">
            Lead management
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Enquiries
          </h1>

          <p className="mt-2 text-sm text-muted">
            Review and follow up with prospective students.{" "}
            {pagination.totalItems} total.
          </p>
        </div>

        <button
          type="button"
          onClick={loadEnquiries}
          disabled={loading}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-bold text-foreground transition hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      {/* Search and filters */}

      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <form onSubmit={submitSearch} className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              type="search"
              value={draftSearch}
              onChange={(event) => setDraftSearch(event.target.value)}
              placeholder="Search name, email or phone"
              className="min-h-11 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary"
            />
          </form>

          <button
            type="button"
            onClick={() => setShowFilters((current) => !current)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-bold text-foreground transition hover:bg-card-hover"
          >
            <Filter size={17} />
            Filters
            {hasFilters && (
              <span className="h-2 w-2 rounded-full bg-secondary" />
            )}
          </button>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold text-danger transition hover:bg-danger/10"
            >
              <X size={17} />
              Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2 xl:grid-cols-6">
            <select
              value={filters.status}
              onChange={(event) => changeFilter("status", event.target.value)}
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">All Statuses</option>

              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {formatLabel(status)}
                </option>
              ))}
            </select>

            <select
              value={filters.priority}
              onChange={(event) => changeFilter("priority", event.target.value)}
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">All Priorities</option>

              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {formatLabel(priority)}
                </option>
              ))}
            </select>

            <select
              value={filters.enquiryType}
              onChange={(event) =>
                changeFilter("enquiryType", event.target.value)
              }
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">All Enquiry Types</option>

              {ENQUIRY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {formatLabel(type)}
                </option>
              ))}
            </select>

            <select
              value={filters.source}
              onChange={(event) => changeFilter("source", event.target.value)}
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">All Sources</option>

              {SOURCES.map((source) => (
                <option key={source} value={source}>
                  {formatLabel(source)}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={filters.dateFrom}
              onChange={(event) => changeFilter("dateFrom", event.target.value)}
              aria-label="Enquiries from date"
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            />

            <input
              type="date"
              value={filters.dateTo}
              onChange={(event) => changeFilter("dateTo", event.target.value)}
              aria-label="Enquiries to date"
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
        )}
      </section>

      {/* Loading */}

      {loading ? (
        <div className="grid min-h-96 place-items-center rounded-2xl border border-border bg-card">
          <div className="text-center">
            <LoaderCircle
              size={36}
              className="mx-auto animate-spin text-primary"
            />

            <p className="mt-3 text-sm font-semibold text-muted">
              Loading enquiries...
            </p>
          </div>
        </div>
      ) : error ? (
        /* Error */

        <div className="grid min-h-80 place-items-center rounded-2xl border border-danger/20 bg-card p-6 text-center">
          <div>
            <CircleAlert size={40} className="mx-auto text-danger" />

            <h2 className="mt-4 text-lg font-bold text-foreground">
              Unable to load enquiries
            </h2>

            <p className="mt-2 text-sm text-muted">{error}</p>

            <button
              type="button"
              onClick={loadEnquiries}
              className="mt-5 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-hover"
            >
              Try again
            </button>
          </div>
        </div>
      ) : enquiries.length === 0 ? (
        <EmptyState filtered={hasFilters} />
      ) : (
        /* Enquiry cards */

        <div className="grid gap-5 xl:grid-cols-2">
          {enquiries.map((enquiry) => (
            <article
              key={enquiry._id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <Badge value={enquiry.status} />

                    <Badge value={enquiry.priority} type="priority" />

                    <span className="rounded-full bg-card-hover px-2.5 py-1 text-xs font-bold text-muted">
                      {formatLabel(enquiry.enquiryType)}
                    </span>
                  </div>

                  <h2 className="mt-3 truncate text-xl font-bold text-foreground">
                    {enquiry.name}
                  </h2>

                  <p className="mt-1 flex items-center gap-2 text-xs text-muted">
                    <Clock3 size={14} />
                    {formatDate(enquiry.createdAt)}
                  </p>
                </div>

                {canDelete && (
                  <button
                    type="button"
                    disabled={deletingId === enquiry._id}
                    onClick={() => deleteEnquiry(enquiry)}
                    aria-label={`Delete enquiry from ${enquiry.name}`}
                    className="grid h-10 w-10 place-items-center rounded-xl text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === enquiry._id ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : (
                      <Trash2 size={17} />
                    )}
                  </button>
                )}
              </div>

              {/* Contact details */}

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <a
                  href={`mailto:${enquiry.email}`}
                  className="flex min-w-0 items-center gap-3 rounded-xl bg-background p-3 text-sm font-semibold text-foreground transition hover:text-primary"
                >
                  <Mail size={17} className="shrink-0 text-primary" />

                  <span className="truncate">{enquiry.email}</span>
                </a>

                <a
                  href={`tel:${enquiry.phone}`}
                  className="flex items-center gap-3 rounded-xl bg-background p-3 text-sm font-semibold text-foreground transition hover:text-primary"
                >
                  <Phone size={17} className="shrink-0 text-primary" />

                  {enquiry.phone}
                </a>
              </div>

              {/* Study interest */}

              {(enquiry.universityInterested ||
                enquiry.courseInterested ||
                enquiry.countryInterested) && (
                <div className="mt-4 space-y-2 rounded-xl border border-border bg-background p-4 text-sm">
                  <p className="flex items-center gap-2 text-foreground">
                    <MapPin size={16} className="shrink-0 text-secondary" />

                    {enquiry.countryInterested || "Country not specified"}
                  </p>

                  {enquiry.universityInterested && (
                    <p className="flex items-center gap-2 text-foreground">
                      <GraduationCap
                        size={16}
                        className="shrink-0 text-primary"
                      />

                      {enquiry.universityInterested.name}
                    </p>
                  )}

                  {enquiry.courseInterested && (
                    <p className="pl-6 text-muted">
                      {enquiry.courseInterested.name}
                    </p>
                  )}
                </div>
              )}

              {enquiry.message && (
                <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted">
                  {enquiry.message}
                </p>
              )}

              {/* Card footer */}

              <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted">
                  <UserRound size={15} />

                  {enquiry.assignedTo?.name || "Unassigned"}

                  {enquiry.followUpDate && (
                    <>
                      <CalendarDays size={15} className="ml-2" />

                      {formatDate(enquiry.followUpDate)}
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {canUpdate && (
                    <select
                      value={enquiry.status}
                      disabled={updatingId === enquiry._id}
                      onChange={(event) =>
                        updateStatus(enquiry, event.target.value)
                      }
                      aria-label={`Update status for ${enquiry.name}`}
                      className="min-h-10 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {formatLabel(status)}
                        </option>
                      ))}
                    </select>
                  )}

                  <Link
                    href={`/admin/enquiries/${enquiry._id}`}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-white transition hover:bg-primary-hover"
                  >
                    View
                    <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}

      {pagination.totalPages > 1 && (
        <nav className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row">
          <p className="text-sm text-muted">
            Page{" "}
            <strong className="text-foreground">
              {pagination.currentPage}
            </strong>{" "}
            of{" "}
            <strong className="text-foreground">{pagination.totalPages}</strong>
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((currentPage) => currentPage - 1)}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-bold text-foreground transition hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={17} />
              Previous
            </button>

            <button
              type="button"
              disabled={page >= pagination.totalPages || loading}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={17} />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
