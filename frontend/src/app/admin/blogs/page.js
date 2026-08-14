"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Edit3,
  Eye,
  FileText,
  Filter,
  ImageIcon,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import API from "@/lib/api";

const INITIAL_FILTERS = {
  search: "",
  status: "all",
  category: "",
  active: "all",
  featured: "",
};

function formatDate(value) {
  if (!value) return "Not published";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function StatusBadge({ status }) {
  const published = status === "published";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
        published
          ? "bg-success/10 text-success"
          : "bg-secondary/10 text-secondary"
      }`}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}

function ActiveBadge({ isActive }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
        isActive ? "bg-primary/10 text-primary" : "bg-danger/10 text-danger"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function EmptyState({ filtered }) {
  return (
    <div className="grid min-h-96 place-items-center rounded-2xl border border-dashed border-border bg-card p-6 text-center">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <FileText size={28} />
        </div>

        <h2 className="mt-4 text-xl font-bold text-foreground">
          {filtered ? "No matching blogs" : "No blogs created"}
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
          {filtered
            ? "Try changing or clearing the selected filters."
            : "Create your first blog article for the European Dreams website."}
        </p>

        {!filtered && (
          <Link
            href="/admin/blogs/create"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover"
          >
            <Plus size={17} />
            Create Blog
          </Link>
        )}
      </div>
    </div>
  );
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);

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
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const hasFilters =
    filters.search ||
    filters.status !== "all" ||
    filters.category ||
    filters.active !== "all" ||
    filters.featured !== "";

  const loadBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: 12,
      };

      if (filters.search) {
        params.search = filters.search;
      }

      if (filters.status !== "all") {
        params.status = filters.status;
      }

      if (filters.category) {
        params.category = filters.category;
      }

      if (filters.active !== "all") {
        params.active = filters.active;
      }

      if (filters.featured !== "") {
        params.featured = filters.featured;
      }

      const response = await API.get("/api/blogs/admin/all", {
        params,
      });

      const data = response.data?.data || {};

      setBlogs(data.blogs || []);

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
        "Unable to load blogs.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

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

  async function updateStatus(blog) {
    const nextStatus = blog.status === "published" ? "draft" : "published";

    const action = nextStatus === "published" ? "publish" : "move to draft";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${blog.title}"?`,
    );

    if (!confirmed) return;

    try {
      setUpdatingId(blog._id);

      const response = await API.patch(`/api/blogs/${blog._id}/status`, {
        status: nextStatus,
      });

      const updatedBlog = response.data?.data?.blog;

      setBlogs((currentBlogs) =>
        currentBlogs.map((currentBlog) =>
          currentBlog._id === blog._id
            ? {
                ...currentBlog,
                ...(updatedBlog || {}),
                status: updatedBlog?.status || nextStatus,
                publishedAt:
                  updatedBlog?.publishedAt ??
                  (nextStatus === "published"
                    ? new Date().toISOString()
                    : null),
              }
            : currentBlog,
        ),
      );

      toast.success(
        response.data?.message ||
          `Blog ${
            nextStatus === "published" ? "published" : "moved to draft"
          } successfully.`,
      );
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message || "Unable to update blog status.",
      );
    } finally {
      setUpdatingId("");
    }
  }

  async function updateActiveStatus(blog) {
    const nextValue = !blog.isActive;

    try {
      setUpdatingId(blog._id);

      const response = await API.patch(`/api/blogs/${blog._id}/active`, {
        isActive: nextValue,
      });

      const updatedBlog = response.data?.data?.blog;

      setBlogs((currentBlogs) =>
        currentBlogs.map((currentBlog) =>
          currentBlog._id === blog._id
            ? {
                ...currentBlog,
                ...(updatedBlog || {}),
                isActive: updatedBlog?.isActive ?? nextValue,
              }
            : currentBlog,
        ),
      );

      toast.success(
        response.data?.message ||
          `Blog ${nextValue ? "activated" : "deactivated"} successfully.`,
      );
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Unable to update active status.",
      );
    } finally {
      setUpdatingId("");
    }
  }

  async function updateFeaturedStatus(blog) {
    const nextValue = !blog.isFeatured;

    try {
      setUpdatingId(blog._id);

      const response = await API.put(`/api/blogs/${blog._id}`, {
        isFeatured: nextValue,
      });

      const updatedBlog = response.data?.data?.blog;

      setBlogs((currentBlogs) =>
        currentBlogs.map((currentBlog) =>
          currentBlog._id === blog._id
            ? {
                ...currentBlog,
                ...(updatedBlog || {}),
                isFeatured: updatedBlog?.isFeatured ?? nextValue,
              }
            : currentBlog,
        ),
      );

      toast.success(
        response.data?.message ||
          `Blog ${nextValue ? "marked as featured" : "removed from featured"}.`,
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

  async function deleteBlog(blog) {
    const confirmed = window.confirm(
      `Delete "${blog.title}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(blog._id);

      const response = await API.delete(`/api/blogs/${blog._id}`);

      toast.success(response.data?.message || "Blog deleted successfully.");

      if (blogs.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        loadBlogs();
      }
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message || "Unable to delete blog.",
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
            Content management
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Blogs
          </h1>

          <p className="mt-2 text-sm text-muted">
            Create and manage website articles. {pagination.totalItems} total.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadBlogs}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-bold text-foreground transition hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <Link
            href="/admin/blogs/create"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover"
          >
            <Plus size={18} />
            Create Blog
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
              placeholder="Search title, slug or category"
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
          <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2 xl:grid-cols-4">
            <select
              value={filters.status}
              onChange={(event) => changeFilter("status", event.target.value)}
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            <select
              value={filters.active}
              onChange={(event) => changeFilter("active", event.target.value)}
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="all">Active and Inactive</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={filters.featured}
              onChange={(event) => changeFilter("featured", event.target.value)}
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">All Blogs</option>
              <option value="true">Featured</option>
              <option value="false">Not Featured</option>
            </select>

            <input
              type="text"
              value={filters.category}
              onChange={(event) => changeFilter("category", event.target.value)}
              placeholder="Exact category"
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
              Loading blogs...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="grid min-h-80 place-items-center rounded-2xl border border-danger/20 bg-card p-6 text-center">
          <div>
            <CircleAlert size={40} className="mx-auto text-danger" />

            <h2 className="mt-4 text-lg font-bold text-foreground">
              Unable to load blogs
            </h2>

            <p className="mt-2 text-sm text-muted">{error}</p>

            <button
              type="button"
              onClick={loadBlogs}
              className="mt-5 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-hover"
            >
              Try again
            </button>
          </div>
        </div>
      ) : blogs.length === 0 ? (
        <EmptyState filtered={hasFilters} />
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {blogs.map((blog) => {
            const updating = updatingId === blog._id;
            const deleting = deletingId === blog._id;

            return (
              <article
                key={blog._id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="grid sm:grid-cols-[190px_minmax(0,1fr)]">
                  {/* Image */}

                  <div className="relative min-h-48 overflow-hidden bg-card-hover sm:min-h-full">
                    {blog.featuredImage ? (
                      <img
                        src={blog.featuredImage}
                        alt={blog.featuredImageAlt || blog.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center">
                        <ImageIcon size={38} className="text-muted/50" />
                      </div>
                    )}

                    {blog.isFeatured && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-white shadow">
                        <Sparkles size={12} />
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Details */}

                  <div className="min-w-0 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={blog.status} />

                      <ActiveBadge isActive={blog.isActive} />

                      {blog.category && (
                        <span className="rounded-full bg-card-hover px-2.5 py-1 text-xs font-bold text-muted">
                          {blog.category}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-3 line-clamp-2 text-xl font-bold leading-7 text-foreground">
                      {blog.title}
                    </h2>

                    <p className="mt-1 truncate text-xs text-muted">
                      /blogs/{blog.slug}
                    </p>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
                      {blog.excerpt}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={14} />
                        {blog.status === "published"
                          ? formatDate(blog.publishedAt)
                          : `Created ${formatDate(blog.createdAt)}`}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Eye size={14} />
                        {blog.views || 0} views
                      </span>
                    </div>

                    {/* Actions */}

                    <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                      <button
                        type="button"
                        disabled={updating}
                        onClick={() => updateStatus(blog)}
                        className="inline-flex min-h-10 items-center justify-center rounded-xl border border-border px-3 text-xs font-bold text-foreground transition hover:bg-card-hover disabled:opacity-50"
                      >
                        {updating ? (
                          <LoaderCircle size={15} className="animate-spin" />
                        ) : blog.status === "published" ? (
                          "Move to Draft"
                        ) : (
                          "Publish"
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={updating}
                        onClick={() => updateFeaturedStatus(blog)}
                        className={`inline-flex min-h-10 items-center justify-center rounded-xl border px-3 text-xs font-bold transition disabled:opacity-50 ${
                          blog.isFeatured
                            ? "border-secondary/30 bg-secondary/10 text-secondary"
                            : "border-border text-foreground hover:bg-card-hover"
                        }`}
                      >
                        <Sparkles size={14} className="mr-1.5" />

                        {blog.isFeatured ? "Featured" : "Feature"}
                      </button>

                      <button
                        type="button"
                        disabled={updating}
                        onClick={() => updateActiveStatus(blog)}
                        className="inline-flex min-h-10 items-center justify-center rounded-xl border border-border px-3 text-xs font-bold text-foreground transition hover:bg-card-hover disabled:opacity-50"
                      >
                        {blog.isActive ? "Deactivate" : "Activate"}
                      </button>

                      <Link
                        href={`/admin/blogs/${blog._id}/edit`}
                        className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white transition hover:bg-primary-hover"
                        aria-label={`Edit ${blog.title}`}
                      >
                        <Edit3 size={15} />
                      </Link>

                      <button
                        type="button"
                        disabled={deleting}
                        onClick={() => deleteBlog(blog)}
                        className="grid h-10 w-10 place-items-center rounded-xl text-danger transition hover:bg-danger/10 disabled:opacity-50"
                        aria-label={`Delete ${blog.title}`}
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
