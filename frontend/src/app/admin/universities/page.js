"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Edit3,
  GraduationCap,
  HeartPulse,
  ImageIcon,
  LoaderCircle,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import API from "@/lib/api";

const REGION_GROUPS = [
  "Piedmont & Liguria",
  "Lombardy",
  "Trentino, Veneto & Friuli",
  "Emilia-Romagna",
  "Central Italy",
  "Southern Italy",
  "The Islands",
];

const UNIVERSITY_TYPES = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "technical", label: "Technical" },
  { value: "other", label: "Other" },
];

const INITIAL_FILTERS = {
  search: "",
  status: "all",
  city: "",
  region: "",
  regionGroup: "",
  universityType: "",
  featured: "",
  medicine: "",
};

function formatType(value) {
  if (!value) return "University";

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function StatusBadge({ active }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
        active ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function EmptyState({ filtered }) {
  return (
    <div className="grid min-h-96 place-items-center rounded-2xl border border-dashed border-border bg-card p-6 text-center">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Building2 size={28} />
        </div>

        <h2 className="mt-4 text-xl font-bold text-foreground">
          {filtered ? "No matching universities" : "No universities created"}
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
          {filtered
            ? "Change or clear the selected filters."
            : "Add the first Italian university to the website."}
        </p>

        {!filtered && (
          <Link
            href="/admin/universities/create"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover"
          >
            <Plus size={17} />
            Add University
          </Link>
        )}
      </div>
    </div>
  );
}

export default function AdminUniversitiesPage() {
  const [universities, setUniversities] = useState([]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    limit: 12,
  });

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [draftSearch, setDraftSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const hasFilters =
    filters.search ||
    filters.status !== "all" ||
    filters.city ||
    filters.region ||
    filters.regionGroup ||
    filters.universityType ||
    filters.featured !== "" ||
    filters.medicine !== "";

  const loadUniversities = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: 12,
      };

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && !(key === "status" && value === "all")) {
          params[key] = value;
        }
      });

      const response = await API.get("/api/universities/admin/all", {
        params,
      });

      const data = response.data?.data || {};

      setUniversities(data.universities || []);

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
        "Unable to load universities.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    loadUniversities();
  }, [loadUniversities]);

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

  async function updateActiveStatus(university) {
    const nextValue = !university.isActive;

    try {
      setUpdatingId(university._id);

      const response = await API.patch(
        `/api/universities/${university._id}/status`,
        {
          isActive: nextValue,
        },
      );

      const updatedUniversity = response.data?.data?.university;

      setUniversities((current) =>
        current.map((item) =>
          item._id === university._id
            ? {
                ...item,
                ...(updatedUniversity || {}),
                isActive: updatedUniversity?.isActive ?? nextValue,
              }
            : item,
        ),
      );

      toast.success(
        response.data?.message ||
          `University ${nextValue ? "activated" : "deactivated"} successfully.`,
      );
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Unable to update university status.",
      );
    } finally {
      setUpdatingId("");
    }
  }

  async function updateFeaturedStatus(university) {
    const nextValue = !university.isFeatured;

    try {
      setUpdatingId(university._id);

      const response = await API.put(`/api/universities/${university._id}`, {
        isFeatured: nextValue,
      });

      const updatedUniversity = response.data?.data?.university;

      setUniversities((current) =>
        current.map((item) =>
          item._id === university._id
            ? {
                ...item,
                ...(updatedUniversity || {}),
                isFeatured: updatedUniversity?.isFeatured ?? nextValue,
              }
            : item,
        ),
      );

      toast.success(
        response.data?.message ||
          `University ${
            nextValue ? "marked as featured" : "removed from featured"
          }.`,
      );
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Unable to update featured status.",
      );
    } finally {
      setUpdatingId("");
    }
  }

  async function deleteUniversity(university) {
    const confirmed = window.confirm(
      `Delete "${university.name}"?\n\nThe university can only be deleted when it has no associated courses.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(university._id);

      const response = await API.delete(`/api/universities/${university._id}`);

      toast.success(
        response.data?.message || "University deleted successfully.",
      );

      if (universities.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        loadUniversities();
      }
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message || "Unable to delete university.",
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-secondary">
            Study destinations
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Universities
          </h1>

          <p className="mt-2 text-sm text-muted">
            Manage Italian universities and their information.{" "}
            {pagination.totalItems} total.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadUniversities}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-bold text-foreground transition hover:bg-card-hover disabled:opacity-60"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <Link
            href="/admin/universities/create"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover"
          >
            <Plus size={18} />
            Add University
          </Link>
        </div>
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
              placeholder="Search university, slug, city or region"
              className="min-h-11 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary"
            />
          </form>

          <button
            type="button"
            onClick={() => setShowFilters((current) => !current)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-bold text-foreground transition hover:bg-card-hover"
          >
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
          <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2 xl:grid-cols-4">
            <select
              value={filters.status}
              onChange={(event) => changeFilter("status", event.target.value)}
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="all">Active and Inactive</option>
              <option value="active">Active only</option>
              <option value="inactive">Inactive only</option>
            </select>

            <select
              value={filters.regionGroup}
              onChange={(event) =>
                changeFilter("regionGroup", event.target.value)
              }
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">All region groups</option>

              {REGION_GROUPS.map((regionGroup) => (
                <option key={regionGroup} value={regionGroup}>
                  {regionGroup}
                </option>
              ))}
            </select>

            <select
              value={filters.universityType}
              onChange={(event) =>
                changeFilter("universityType", event.target.value)
              }
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">All university types</option>

              {UNIVERSITY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <select
              value={filters.featured}
              onChange={(event) => changeFilter("featured", event.target.value)}
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">Featured and standard</option>
              <option value="true">Featured only</option>
              <option value="false">Not featured</option>
            </select>

            <select
              value={filters.medicine}
              onChange={(event) => changeFilter("medicine", event.target.value)}
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">All programmes</option>
              <option value="true">Medicine in English</option>
              <option value="false">No medicine in English</option>
            </select>

            <input
              type="text"
              value={filters.city}
              onChange={(event) => changeFilter("city", event.target.value)}
              placeholder="Search city"
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary"
            />

            <input
              type="text"
              value={filters.region}
              onChange={(event) => changeFilter("region", event.target.value)}
              placeholder="Exact Italian region"
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary"
            />
          </div>
        )}
      </section>

      {/* Content */}

      {loading ? (
        <div className="grid min-h-96 place-items-center rounded-2xl border border-border bg-card">
          <div className="text-center">
            <LoaderCircle
              size={36}
              className="mx-auto animate-spin text-primary"
            />

            <p className="mt-3 text-sm font-semibold text-muted">
              Loading universities...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="grid min-h-80 place-items-center rounded-2xl border border-danger/20 bg-card p-6 text-center">
          <div>
            <CircleAlert size={40} className="mx-auto text-danger" />

            <h2 className="mt-4 text-lg font-bold text-foreground">
              Unable to load universities
            </h2>

            <p className="mt-2 text-sm text-muted">{error}</p>

            <button
              type="button"
              onClick={loadUniversities}
              className="mt-5 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-hover"
            >
              Try again
            </button>
          </div>
        </div>
      ) : universities.length === 0 ? (
        <EmptyState filtered={hasFilters} />
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {universities.map((university) => {
            const updating = updatingId === university._id;
            const deleting = deletingId === university._id;

            return (
              <article
                key={university._id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="grid sm:grid-cols-[200px_minmax(0,1fr)]">
                  {/* Image */}

                  <div className="relative min-h-52 overflow-hidden bg-card-hover sm:min-h-full">
                    {university.heroImage ? (
                      <img
                        src={university.heroImage}
                        alt={university.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center">
                        <ImageIcon size={40} className="text-muted/40" />
                      </div>
                    )}

                    {university.isFeatured && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-white shadow">
                        <Sparkles size={12} />
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Details */}

                  <div className="min-w-0 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge active={university.isActive} />

                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                        {formatType(university.universityType)}
                      </span>

                      {university.offersMedicineInEnglish && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2.5 py-1 text-xs font-bold text-danger">
                          <HeartPulse size={12} />
                          Medicine
                        </span>
                      )}
                    </div>

                    <h2 className="mt-3 line-clamp-2 text-xl font-bold leading-7 text-foreground">
                      {university.name}
                    </h2>

                    <p className="mt-1 truncate text-xs text-muted">
                      /universities/{university.slug}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={14} />
                        {[university.city, university.region]
                          .filter(Boolean)
                          .join(", ") || "Italy"}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <GraduationCap size={14} />
                        {university.totalEnglishCourses || 0} English courses
                      </span>
                    </div>

                    {university.regionGroup && (
                      <p className="mt-3 rounded-lg bg-card-hover px-3 py-2 text-xs font-semibold text-muted">
                        {university.regionGroup}
                      </p>
                    )}

                    {university.shortDescription && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
                        {university.shortDescription}
                      </p>
                    )}

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-background p-2 text-center">
                        <p className="text-base font-bold text-foreground">
                          {university.bachelorsCount || 0}
                        </p>

                        <p className="text-[10px] font-semibold text-muted">
                          Bachelors
                        </p>
                      </div>

                      <div className="rounded-lg bg-background p-2 text-center">
                        <p className="text-base font-bold text-foreground">
                          {university.mastersCount || 0}
                        </p>

                        <p className="text-[10px] font-semibold text-muted">
                          Masters
                        </p>
                      </div>

                      <div className="rounded-lg bg-background p-2 text-center">
                        <p className="text-base font-bold text-foreground">
                          {university.displayOrder || 0}
                        </p>

                        <p className="text-[10px] font-semibold text-muted">
                          Order
                        </p>
                      </div>
                    </div>

                    {/* Actions */}

                    <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                      <button
                        type="button"
                        disabled={updating}
                        onClick={() => updateActiveStatus(university)}
                        className="inline-flex min-h-10 items-center justify-center rounded-xl border border-border px-3 text-xs font-bold text-foreground transition hover:bg-card-hover disabled:opacity-50"
                      >
                        {updating ? (
                          <LoaderCircle size={15} className="animate-spin" />
                        ) : university.isActive ? (
                          "Deactivate"
                        ) : (
                          "Activate"
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={updating}
                        onClick={() => updateFeaturedStatus(university)}
                        className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition disabled:opacity-50 ${
                          university.isFeatured
                            ? "border-secondary/30 bg-secondary/10 text-secondary"
                            : "border-border text-foreground hover:bg-card-hover"
                        }`}
                      >
                        <Sparkles size={14} />

                        {university.isFeatured ? "Featured" : "Feature"}
                      </button>

                      <Link
                        href={`/admin/universities/${university._id}/edit`}
                        className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white transition hover:bg-primary-hover"
                        aria-label={`Edit ${university.name}`}
                      >
                        <Edit3 size={15} />
                      </Link>

                      <button
                        type="button"
                        disabled={deleting}
                        onClick={() => deleteUniversity(university)}
                        className="grid h-10 w-10 place-items-center rounded-xl text-danger transition hover:bg-danger/10 disabled:opacity-50"
                        aria-label={`Delete ${university.name}`}
                      >
                        {deleting ? (
                          <LoaderCircle size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
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
              onClick={() => setPage((current) => current - 1)}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-bold text-foreground transition hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={17} />
              Previous
            </button>

            <button
              type="button"
              disabled={page >= pagination.totalPages || loading}
              onClick={() => setPage((current) => current + 1)}
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
