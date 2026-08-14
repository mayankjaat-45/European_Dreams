"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  GraduationCap,
  Languages,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Stethoscope,
  Trash2,
  University,
  X,
} from "lucide-react";
import { toast } from "sonner";

import API from "@/lib/api";

const initialPagination = {
  currentPage: 1,
  totalPages: 0,
  totalItems: 0,
  limit: 20,
};

const initialFilters = {
  search: "",
  status: "all",
  degreeLevel: "",
  programmeType: "",
  university: "",
  regionGroup: "",
  featured: "",
  medicine: "",
  requiresIMAT: "",
};

const degreeLevels = [
  { value: "", label: "All degree levels" },
  { value: "bachelor", label: "Bachelor" },
  { value: "master", label: "Master" },
  { value: "phd", label: "PhD" },
  { value: "diploma", label: "Diploma" },
  { value: "foundation", label: "Foundation" },
];

const programmeTypes = [
  { value: "", label: "All programme types" },
  { value: "bachelor", label: "Bachelor" },
  { value: "master", label: "Master" },
  { value: "phd", label: "PhD" },
  { value: "single-cycle", label: "Single Cycle" },
  { value: "foundation", label: "Foundation" },
];

const regionGroups = [
  { value: "", label: "All regions" },
  { value: "Northern Italy", label: "Northern Italy" },
  { value: "Central Italy", label: "Central Italy" },
  { value: "Southern Italy", label: "Southern Italy" },
  { value: "The Islands", label: "The Islands" },
];

const formatValue = (value) => {
  if (!value) return "Not specified";

  return String(value)
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getStoredRole = () => {
  if (typeof window === "undefined") return "";

  const storageKeys = ["admin_user", "ed_admin_user", "user", "crm_user"];

  for (const key of storageKeys) {
    try {
      const storedUser = localStorage.getItem(key);

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser?.role) {
          return parsedUser.role;
        }
      }
    } catch {
      // Ignore invalid local-storage values.
    }
  }

  return "";
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [appliedSearch, setAppliedSearch] = useState("");
  const [pagination, setPagination] = useState(initialPagination);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [currentRole, setCurrentRole] = useState("");

  const canDelete = currentRole === "super_admin";

  useEffect(() => {
    setCurrentRole(getStoredRole());
  }, []);

  /*
   * Debounce course search.
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAppliedSearch(filters.search.trim());
      setPagination((previous) => ({
        ...previous,
        currentPage: 1,
      }));
    }, 500);

    return () => clearTimeout(timeout);
  }, [filters.search]);

  /*
   * Load universities for the university filter.
   */
  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const response = await API.get("/api/universities", {
          params: {
            page: 1,
            limit: 100,
          },
        });

        const data = response.data?.data || {};

        setUniversities(data.universities || []);
      } catch (requestError) {
        console.error("Unable to load universities:", requestError);
      }
    };

    loadUniversities();
  }, []);

  const loadCourses = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        setError("");

        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const params = {
          page: pagination.currentPage,
          limit: pagination.limit,
          search: appliedSearch || undefined,
          status: filters.status,
          degreeLevel: filters.degreeLevel || undefined,
          programmeType: filters.programmeType || undefined,
          university: filters.university || undefined,
          regionGroup: filters.regionGroup || undefined,
          featured: filters.featured || undefined,
          medicine: filters.medicine || undefined,
          requiresIMAT: filters.requiresIMAT || undefined,
        };

        const response = await API.get("/api/courses/admin/all", {
          params,
        });

        const data = response.data?.data || {};

        setCourses(data.courses || []);
        setPagination((previous) => ({
          ...previous,
          ...(data.pagination || initialPagination),
        }));
      } catch (requestError) {
        console.error("Unable to load courses:", requestError);

        const message =
          requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load courses.";

        setError(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      appliedSearch,
      filters.status,
      filters.degreeLevel,
      filters.programmeType,
      filters.university,
      filters.regionGroup,
      filters.featured,
      filters.medicine,
      filters.requiresIMAT,
      pagination.currentPage,
      pagination.limit,
    ],
  );

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const updateFilter = (name, value) => {
    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name !== "search") {
      setPagination((previous) => ({
        ...previous,
        currentPage: 1,
      }));
    }
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setAppliedSearch("");

    setPagination((previous) => ({
      ...previous,
      currentPage: 1,
    }));
  };

  const changePage = (page) => {
    if (
      page < 1 ||
      page > pagination.totalPages ||
      page === pagination.currentPage
    ) {
      return;
    }

    setPagination((previous) => ({
      ...previous,
      currentPage: page,
    }));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleStatusUpdate = async (course) => {
    try {
      setUpdatingId(course._id);

      const response = await API.patch(`/api/courses/${course._id}/status`, {
        isActive: !course.isActive,
      });

      const updatedCourse = response.data?.data?.course;

      setCourses((previous) =>
        previous.map((item) =>
          item._id === course._id
            ? {
                ...item,
                ...(updatedCourse || {
                  isActive: !item.isActive,
                }),
              }
            : item,
        ),
      );

      toast.success(
        response.data?.message ||
          `Course ${course.isActive ? "deactivated" : "activated"} successfully.`,
      );
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to update course status.",
      );
    } finally {
      setUpdatingId("");
    }
  };

  const handleDelete = async (course) => {
    if (!canDelete) {
      toast.error("Only a super admin can delete courses.");
      return;
    }

    const confirmed = window.confirm(
      `Delete "${course.name}" permanently?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(course._id);

      const response = await API.delete(`/api/courses/${course._id}`);

      toast.success(response.data?.message || "Course deleted successfully.");

      if (courses.length === 1 && pagination.currentPage > 1) {
        setPagination((previous) => ({
          ...previous,
          currentPage: previous.currentPage - 1,
        }));
      } else {
        await loadCourses({ refresh: true });
      }
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to delete course.",
      );
    } finally {
      setDeletingId("");
    }
  };

  const hasFilters =
    appliedSearch ||
    filters.status !== "all" ||
    filters.degreeLevel ||
    filters.programmeType ||
    filters.university ||
    filters.regionGroup ||
    filters.featured ||
    filters.medicine ||
    filters.requiresIMAT;

  const firstItem =
    pagination.totalItems > 0
      ? (pagination.currentPage - 1) * pagination.limit + 1
      : 0;

  const lastItem = Math.min(
    pagination.currentPage * pagination.limit,
    pagination.totalItems,
  );

  return (
    <div className="space-y-6">
      {/* Heading */}
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-secondary">
            Content management
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-4xl">
            Courses
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
            Manage all university programmes shown on the website.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => loadCourses({ refresh: true })}
            disabled={refreshing}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-bold text-foreground shadow-sm transition hover:border-primary/30 hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <Link
            href="/admin/courses/create"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover"
          >
            <Plus size={18} />
            Add course
          </Link>
        </div>
      </section>

      {/* Search and filters */}
      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="relative flex-1">
            <Search
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              type="search"
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Search course, slug or field of study..."
              className="min-h-12 w-full rounded-xl border border-border bg-background pl-12 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </label>

          <select
            value={filters.status}
            onChange={(event) => updateFilter("status", event.target.value)}
            className="min-h-12 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
          >
            <option value="all">All statuses</option>
            <option value="active">Active courses</option>
            <option value="inactive">Inactive courses</option>
          </select>

          <button
            type="button"
            onClick={() => setFiltersOpen((previous) => !previous)}
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition ${
              filtersOpen
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-foreground hover:border-primary/30"
            }`}
          >
            <Filter size={18} />
            More filters
          </button>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-danger/20 bg-danger/10 px-4 text-sm font-bold text-danger transition hover:bg-danger/15"
            >
              <X size={18} />
              Clear
            </button>
          )}
        </div>

        {filtersOpen && (
          <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2 xl:grid-cols-4">
            <select
              value={filters.degreeLevel}
              onChange={(event) =>
                updateFilter("degreeLevel", event.target.value)
              }
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              {degreeLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>

            <select
              value={filters.programmeType}
              onChange={(event) =>
                updateFilter("programmeType", event.target.value)
              }
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              {programmeTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <select
              value={filters.university}
              onChange={(event) =>
                updateFilter("university", event.target.value)
              }
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">All universities</option>

              {universities.map((university) => (
                <option key={university._id} value={university._id}>
                  {university.name}
                </option>
              ))}
            </select>

            <select
              value={filters.regionGroup}
              onChange={(event) =>
                updateFilter("regionGroup", event.target.value)
              }
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              {regionGroups.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select>

            <select
              value={filters.featured}
              onChange={(event) => updateFilter("featured", event.target.value)}
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">Featured: All</option>
              <option value="true">Featured only</option>
              <option value="false">Not featured</option>
            </select>

            <select
              value={filters.medicine}
              onChange={(event) => updateFilter("medicine", event.target.value)}
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">Medicine: All</option>
              <option value="true">Medicine only</option>
              <option value="false">Non-medicine</option>
            </select>

            <select
              value={filters.requiresIMAT}
              onChange={(event) =>
                updateFilter("requiresIMAT", event.target.value)
              }
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">IMAT: All</option>
              <option value="true">IMAT required</option>
              <option value="false">IMAT not required</option>
            </select>

            <select
              value={pagination.limit}
              onChange={(event) => {
                setPagination((previous) => ({
                  ...previous,
                  currentPage: 1,
                  limit: Number(event.target.value),
                }));
              }}
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value={12}>12 per page</option>
              <option value={20}>20 per page</option>
              <option value={40}>40 per page</option>
              <option value={60}>60 per page</option>
            </select>
          </div>
        )}
      </section>

      {error && (
        <div className="rounded-2xl border border-danger/20 bg-danger/10 px-5 py-4 text-sm font-semibold text-danger">
          {error}
        </div>
      )}

      {/* Result count */}
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <p className="text-sm text-muted">
          Showing{" "}
          <span className="font-bold text-foreground">
            {firstItem}–{lastItem}
          </span>{" "}
          of{" "}
          <span className="font-bold text-foreground">
            {pagination.totalItems.toLocaleString("en-IN")}
          </span>{" "}
          courses
        </p>

        {currentRole && (
          <p className="text-xs font-semibold capitalize text-muted">
            Access: {currentRole.replaceAll("_", " ")}
          </p>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <section className="grid gap-5 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-border bg-card p-5"
            >
              <div className="h-5 w-3/4 rounded bg-card-hover" />
              <div className="mt-3 h-4 w-1/2 rounded bg-card-hover" />
              <div className="mt-6 h-16 rounded-xl bg-card-hover" />
              <div className="mt-5 h-10 rounded-xl bg-card-hover" />
            </div>
          ))}
        </section>
      ) : courses.length > 0 ? (
        <section className="grid gap-5 lg:grid-cols-2">
          {courses.map((course) => {
            const universityData = course.university || {};
            const isUpdating = updatingId === course._id;
            const isDeleting = deletingId === course._id;

            return (
              <article
                key={course._id}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:border-primary/20 hover:shadow-lg"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            course.isActive
                              ? "bg-success/10 text-success"
                              : "bg-danger/10 text-danger"
                          }`}
                        >
                          {course.isActive ? "Active" : "Inactive"}
                        </span>

                        {course.isFeatured && (
                          <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">
                            Featured
                          </span>
                        )}

                        {course.isEnglishTaught && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                            <Languages size={12} />
                            English
                          </span>
                        )}

                        {course.isMedicineProgramme && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-600">
                            <Stethoscope size={12} />
                            Medicine
                          </span>
                        )}

                        {course.requiresIMAT && (
                          <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-600">
                            IMAT
                          </span>
                        )}
                      </div>

                      <h2 className="mt-4 text-xl font-bold leading-snug text-foreground">
                        {course.name}
                      </h2>

                      <p className="mt-2 flex items-start gap-2 text-sm font-medium text-muted">
                        <University
                          size={16}
                          className="mt-0.5 shrink-0 text-primary"
                        />

                        <span>
                          {universityData.name || "University not available"}
                          {universityData.city
                            ? `, ${universityData.city}`
                            : ""}
                        </span>
                      </p>
                    </div>

                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <GraduationCap size={21} />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl bg-background p-3">
                      <p className="text-xs text-muted">Level</p>
                      <p className="mt-1 truncate text-sm font-bold text-foreground">
                        {formatValue(course.degreeLevel)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-background p-3">
                      <p className="text-xs text-muted">Duration</p>
                      <p className="mt-1 truncate text-sm font-bold text-foreground">
                        {course.duration || "Not specified"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-background p-3">
                      <p className="text-xs text-muted">Study mode</p>
                      <p className="mt-1 truncate text-sm font-bold text-foreground">
                        {formatValue(course.studyMode)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-background p-3">
                      <p className="text-xs text-muted">Admission</p>
                      <p className="mt-1 truncate text-sm font-bold text-foreground">
                        {course.admissionYear || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-2 text-sm text-muted">
                    <BookOpen
                      size={16}
                      className="mt-0.5 shrink-0 text-secondary"
                    />

                    <span>{course.fieldOfStudy || "Field not specified"}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-border bg-background/50 px-5 py-4 sm:px-6">
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(course)}
                    disabled={isUpdating}
                    className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-3 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      course.isActive
                        ? "bg-success/10 text-success hover:bg-success/15"
                        : "bg-danger/10 text-danger hover:bg-danger/15"
                    }`}
                  >
                    {isUpdating && (
                      <LoaderCircle size={14} className="animate-spin" />
                    )}

                    {isUpdating
                      ? "Updating..."
                      : course.isActive
                        ? "Active"
                        : "Inactive"}
                  </button>

                  <div className="ml-auto flex items-center gap-2">
                    <Link
                      href={`/admin/courses/${course._id}`}
                      title="View course"
                      className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted transition hover:border-primary/30 hover:text-primary"
                    >
                      <Eye size={16} />
                    </Link>

                    <Link
                      href={`/admin/courses/${course._id}/edit`}
                      title="Edit course"
                      className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted transition hover:border-secondary/30 hover:text-secondary"
                    >
                      <Pencil size={16} />
                    </Link>

                    {canDelete && (
                      <button
                        type="button"
                        title="Delete course"
                        onClick={() => handleDelete(course)}
                        disabled={isDeleting}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-danger/20 bg-danger/5 text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isDeleting ? (
                          <LoaderCircle size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-border bg-card px-6 py-20 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
            <GraduationCap size={29} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-foreground">
            No courses found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
            No courses match the selected filters. Clear the filters or add a
            new course.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-bold text-foreground"
              >
                <X size={17} />
                Clear filters
              </button>
            )}

            <Link
              href="/admin/courses/create"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white"
            >
              <Plus size={18} />
              Add course
            </Link>
          </div>
        </section>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <section className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row">
          <p className="text-sm text-muted">
            Page{" "}
            <span className="font-bold text-foreground">
              {pagination.currentPage}
            </span>{" "}
            of{" "}
            <span className="font-bold text-foreground">
              {pagination.totalPages}
            </span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => changePage(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-3 text-sm font-bold text-foreground transition hover:border-primary/30 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={17} />
              Previous
            </button>

            <span className="grid min-h-10 min-w-10 place-items-center rounded-xl bg-primary px-3 text-sm font-bold text-white">
              {pagination.currentPage}
            </span>

            <button
              type="button"
              onClick={() => changePage(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-3 text-sm font-bold text-foreground transition hover:border-primary/30 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={17} />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
