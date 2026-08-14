"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CircleAlert,
  Eye,
  FileText,
  ImageIcon,
  LoaderCircle,
  RefreshCw,
  Save,
  Search,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import BlogImageUploader from "@/components/admin/blogs/BlogImageUploader";
import API from "@/lib/api";

const INITIAL_FORM = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  tags: "",
  authorName: "European Dreams",
  featuredImage: "",
  featuredImageAlt: "",
  readTime: "",
  status: "draft",
  seoTitle: "",
  metaDescription: "",
  keywords: "",
  canonicalUrl: "",
  isFeatured: false,
  isActive: true,
  displayOrder: 0,
};

function joinValues(value) {
  return Array.isArray(value) ? value.join(", ") : "";
}

function splitValues(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function FormSection({ title, description, icon: Icon, children }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Icon size={19} />
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>

          {description && (
            <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
          )}
        </div>
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function FieldError({ message }) {
  if (!message) return null;

  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-danger">
      <CircleAlert size={13} />
      {message}
    </p>
  );
}

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
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();

  const blogId = params.id;

  const [form, setForm] = useState(INITIAL_FORM);
  const [blog, setBlog] = useState(null);
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadError, setLoadError] = useState("");

  const titleLength = form.title.length;
  const excerptLength = form.excerpt.length;
  const seoTitleLength = form.seoTitle.length;
  const metaDescriptionLength = form.metaDescription.length;

  const loadBlog = useCallback(async () => {
    if (!blogId) return;

    try {
      setLoading(true);
      setLoadError("");

      const response = await API.get(`/api/blogs/admin/${blogId}`);

      const blogData = response.data?.data?.blog || response.data?.data || null;

      if (!blogData?._id) {
        throw new Error("Blog data was not found.");
      }

      setBlog(blogData);

      setForm({
        title: blogData.title || "",
        excerpt: blogData.excerpt || "",
        content: blogData.content || "",
        category: blogData.category || "",
        tags: joinValues(blogData.tags),
        authorName: blogData.authorName || "European Dreams",
        featuredImage: blogData.featuredImage || "",
        featuredImageAlt: blogData.featuredImageAlt || "",
        readTime: blogData.readTime || "",
        status: blogData.status || "draft",
        seoTitle: blogData.seoTitle || "",
        metaDescription: blogData.metaDescription || "",
        keywords: joinValues(blogData.keywords),
        canonicalUrl: blogData.canonicalUrl || "",
        isFeatured: Boolean(blogData.isFeatured),
        isActive: blogData.isActive !== false,
        displayOrder: blogData.displayOrder || 0,
      });
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        requestError.message ||
        "Unable to load blog.";

      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    loadBlog();
  }, [loadBlog]);

  function updateField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }
  }

  function validateForm() {
    const nextErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = "Blog title is required.";
    }

    if (!form.excerpt.trim()) {
      nextErrors.excerpt = "Blog excerpt is required.";
    }

    if (!form.content.trim()) {
      nextErrors.content = "Blog content is required.";
    }

    if (!form.category.trim()) {
      nextErrors.category = "Blog category is required.";
    }

    if (form.title.trim().length > 250) {
      nextErrors.title = "Title cannot exceed 250 characters.";
    }

    if (form.excerpt.trim().length > 500) {
      nextErrors.excerpt = "Excerpt cannot exceed 500 characters.";
    }

    if (form.seoTitle.trim().length > 70) {
      nextErrors.seoTitle = "SEO title cannot exceed 70 characters.";
    }

    if (form.metaDescription.trim().length > 180) {
      nextErrors.metaDescription =
        "Meta description cannot exceed 180 characters.";
    }

    if (form.canonicalUrl && !/^https?:\/\//i.test(form.canonicalUrl)) {
      nextErrors.canonicalUrl =
        "Canonical URL must start with http:// or https://.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function updateBlog(event) {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the highlighted fields.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        category: form.category.trim(),
        tags: splitValues(form.tags),
        authorName: form.authorName.trim() || "European Dreams",
        featuredImage: form.featuredImage.trim(),
        featuredImageAlt: form.featuredImageAlt.trim(),
        readTime: form.readTime.trim(),
        status: form.status,
        seoTitle: form.seoTitle.trim(),
        metaDescription: form.metaDescription.trim(),
        keywords: splitValues(form.keywords),
        canonicalUrl: form.canonicalUrl.trim(),
        isFeatured: form.isFeatured,
        isActive: form.isActive,
        displayOrder: Math.max(Number(form.displayOrder) || 0, 0),
      };

      const response = await API.put(`/api/blogs/${blogId}`, payload);

      const updatedBlog = response.data?.data?.blog || response.data?.data;

      if (updatedBlog?._id) {
        setBlog(updatedBlog);
      }

      toast.success(response.data?.message || "Blog updated successfully.");

      router.refresh();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to update blog.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteBlog() {
    const confirmed = window.confirm(
      `Delete "${blog?.title || "this blog"}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const response = await API.delete(`/api/blogs/${blogId}`);

      toast.success(response.data?.message || "Blog deleted successfully.");

      router.replace("/admin/blogs");
      router.refresh();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message || "Unable to delete blog.",
      );

      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-[65vh] place-items-center rounded-2xl border border-border bg-card">
        <div className="text-center">
          <LoaderCircle
            size={38}
            className="mx-auto animate-spin text-primary"
          />

          <p className="mt-3 text-sm font-semibold text-muted">
            Loading blog...
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="grid min-h-[65vh] place-items-center rounded-2xl border border-danger/20 bg-card p-6 text-center">
        <div>
          <CircleAlert size={42} className="mx-auto text-danger" />

          <h1 className="mt-4 text-xl font-bold text-foreground">
            Unable to open blog
          </h1>

          <p className="mt-2 text-sm text-muted">{loadError}</p>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={loadBlog}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white hover:bg-primary-hover"
            >
              <RefreshCw size={17} />
              Try Again
            </button>

            <Link
              href="/admin/blogs"
              className="inline-flex min-h-11 items-center rounded-xl border border-border px-5 text-sm font-bold text-foreground hover:bg-card-hover"
            >
              Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={updateBlog} className="space-y-6">
      {/* Header */}

      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:underline"
          >
            <ArrowLeft size={16} />
            Back to blogs
          </Link>

          <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-secondary">
            Content management
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Edit Blog
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            Update content, publishing settings and SEO information.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={deleteBlog}
            disabled={deleting || saving}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-danger/20 px-4 text-sm font-bold text-danger transition hover:bg-danger/10 disabled:opacity-50"
          >
            {deleting ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Trash2 size={17} />
            )}
            Delete
          </button>

          <button
            type="submit"
            disabled={saving || deleting}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Main form */}

        <div className="space-y-6">
          <FormSection
            title="Blog content"
            description="Update the title, summary and complete article."
            icon={FileText}
          >
            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-bold text-foreground">
                  Blog title <span className="text-danger">*</span>
                </span>

                <input
                  type="text"
                  maxLength={250}
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  className={`mt-2 min-h-12 w-full rounded-xl border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary ${
                    errors.title ? "border-danger" : "border-border"
                  }`}
                />

                <div className="mt-1.5 flex justify-between gap-3">
                  <FieldError message={errors.title} />

                  <span className="ml-auto text-xs text-muted">
                    {titleLength}/250
                  </span>
                </div>
              </label>

              {blog?.slug && (
                <div className="rounded-xl border border-border bg-background p-3">
                  <p className="text-xs font-bold text-muted">
                    Current public URL
                  </p>

                  <p className="mt-1 break-all text-sm text-primary">
                    /blogs/{blog.slug}
                  </p>
                </div>
              )}

              <label className="block">
                <span className="text-sm font-bold text-foreground">
                  Excerpt <span className="text-danger">*</span>
                </span>

                <textarea
                  rows={4}
                  maxLength={500}
                  value={form.excerpt}
                  onChange={(event) =>
                    updateField("excerpt", event.target.value)
                  }
                  className={`mt-2 w-full resize-y rounded-xl border bg-background p-4 text-sm leading-6 text-foreground outline-none focus:border-primary ${
                    errors.excerpt ? "border-danger" : "border-border"
                  }`}
                />

                <div className="mt-1.5 flex justify-between gap-3">
                  <FieldError message={errors.excerpt} />

                  <span className="ml-auto text-xs text-muted">
                    {excerptLength}/500
                  </span>
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-foreground">
                  Content <span className="text-danger">*</span>
                </span>

                <textarea
                  rows={22}
                  value={form.content}
                  onChange={(event) =>
                    updateField("content", event.target.value)
                  }
                  className={`mt-2 w-full resize-y rounded-xl border bg-background p-4 font-mono text-sm leading-7 text-foreground outline-none focus:border-primary ${
                    errors.content ? "border-danger" : "border-border"
                  }`}
                />

                <FieldError message={errors.content} />
              </label>
            </div>
          </FormSection>

          <FormSection
            title="Organization"
            description="Manage the category, author and tags."
            icon={Sparkles}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-foreground">
                  Category <span className="text-danger">*</span>
                </span>

                <input
                  type="text"
                  value={form.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                  className={`mt-2 min-h-11 w-full rounded-xl border bg-background px-3 text-sm text-foreground outline-none focus:border-primary ${
                    errors.category ? "border-danger" : "border-border"
                  }`}
                />

                <FieldError message={errors.category} />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-foreground">
                  Author name
                </span>

                <input
                  type="text"
                  value={form.authorName}
                  onChange={(event) =>
                    updateField("authorName", event.target.value)
                  }
                  className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-bold text-foreground">Tags</span>

                <input
                  type="text"
                  value={form.tags}
                  onChange={(event) => updateField("tags", event.target.value)}
                  placeholder="italy, scholarships, student visa"
                  className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary"
                />

                <p className="mt-1.5 text-xs text-muted">
                  Separate multiple tags with commas.
                </p>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-foreground">
                  Reading time
                </span>

                <input
                  type="text"
                  value={form.readTime}
                  onChange={(event) =>
                    updateField("readTime", event.target.value)
                  }
                  placeholder="8 min read"
                  className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-foreground">
                  Display order
                </span>

                <input
                  type="number"
                  min="0"
                  value={form.displayOrder}
                  onChange={(event) =>
                    updateField("displayOrder", event.target.value)
                  }
                  className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </label>
            </div>
          </FormSection>

          <FormSection
            title="Featured image"
            description="Upload the main image displayed on blog cards and the article page."
            icon={ImageIcon}
          >
            <BlogImageUploader
              imageUrl={form.featuredImage}
              imageAlt={form.featuredImageAlt}
              onImageChange={(url) => updateField("featuredImage", url)}
              onAltChange={(value) => updateField("featuredImageAlt", value)}
            />
          </FormSection>

          <FormSection
            title="Search engine optimization"
            description="Control how this article appears in search results."
            icon={Search}
          >
            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-bold text-foreground">
                  SEO title
                </span>

                <input
                  type="text"
                  maxLength={70}
                  value={form.seoTitle}
                  onChange={(event) =>
                    updateField("seoTitle", event.target.value)
                  }
                  className={`mt-2 min-h-11 w-full rounded-xl border bg-background px-3 text-sm text-foreground outline-none focus:border-primary ${
                    errors.seoTitle ? "border-danger" : "border-border"
                  }`}
                />

                <div className="mt-1.5 flex justify-between gap-3">
                  <FieldError message={errors.seoTitle} />

                  <span className="ml-auto text-xs text-muted">
                    {seoTitleLength}/70
                  </span>
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-foreground">
                  Meta description
                </span>

                <textarea
                  rows={4}
                  maxLength={180}
                  value={form.metaDescription}
                  onChange={(event) =>
                    updateField("metaDescription", event.target.value)
                  }
                  className={`mt-2 w-full resize-y rounded-xl border bg-background p-3 text-sm leading-6 text-foreground outline-none focus:border-primary ${
                    errors.metaDescription ? "border-danger" : "border-border"
                  }`}
                />

                <div className="mt-1.5 flex justify-between gap-3">
                  <FieldError message={errors.metaDescription} />

                  <span className="ml-auto text-xs text-muted">
                    {metaDescriptionLength}/180
                  </span>
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-foreground">
                  SEO keywords
                </span>

                <input
                  type="text"
                  value={form.keywords}
                  onChange={(event) =>
                    updateField("keywords", event.target.value)
                  }
                  placeholder="study in italy, italy universities"
                  className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-foreground">
                  Canonical URL
                </span>

                <input
                  type="url"
                  value={form.canonicalUrl}
                  onChange={(event) =>
                    updateField("canonicalUrl", event.target.value)
                  }
                  placeholder="https://europeandreams.org/blogs/article-slug"
                  className={`mt-2 min-h-11 w-full rounded-xl border bg-background px-3 text-sm text-foreground outline-none focus:border-primary ${
                    errors.canonicalUrl ? "border-danger" : "border-border"
                  }`}
                />

                <FieldError message={errors.canonicalUrl} />
              </label>
            </div>
          </FormSection>
        </div>

        {/* Sidebar */}

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <FormSection
            title="Publishing"
            description="Manage article visibility and status."
            icon={Send}
          >
            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-bold text-foreground">
                  Status
                </span>

                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField("status", event.target.value)
                  }
                  className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>

              <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border bg-background p-4">
                <span>
                  <span className="block text-sm font-bold text-foreground">
                    Active
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-muted">
                    Inactive blogs are hidden from the public website.
                  </span>
                </span>

                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    updateField("isActive", event.target.checked)
                  }
                  className="mt-1 h-5 w-5 rounded border-border accent-primary"
                />
              </label>

              <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border bg-background p-4">
                <span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                    <Sparkles size={15} className="text-secondary" />
                    Featured
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-muted">
                    Show this article in featured sections.
                  </span>
                </span>

                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(event) =>
                    updateField("isFeatured", event.target.checked)
                  }
                  className="mt-1 h-5 w-5 rounded border-border accent-secondary"
                />
              </label>
            </div>
          </FormSection>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Eye size={18} className="text-primary" />

              <h2 className="font-bold text-foreground">Search preview</h2>
            </div>

            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <p className="truncate text-xs text-success">
                europeandreams.org › blogs › {blog?.slug || "article"}
              </p>

              <p className="mt-1 line-clamp-2 text-base font-semibold text-primary">
                {form.seoTitle || form.title || "Your blog title"}
              </p>

              <p className="mt-1 line-clamp-3 text-xs leading-5 text-muted">
                {form.metaDescription ||
                  form.excerpt ||
                  "Your blog description will appear here."}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-bold text-foreground">Blog information</h2>

            <dl className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Created</dt>

                <dd className="text-right font-semibold text-foreground">
                  {formatDate(blog?.createdAt)}
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-muted">Updated</dt>

                <dd className="text-right font-semibold text-foreground">
                  {formatDate(blog?.updatedAt)}
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-muted">Published</dt>

                <dd className="text-right font-semibold text-foreground">
                  {formatDate(blog?.publishedAt)}
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-muted">Views</dt>

                <dd className="font-semibold text-foreground">
                  {blog?.views || 0}
                </dd>
              </div>
            </dl>
          </section>

          <button
            type="submit"
            disabled={saving || deleting}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}

            {saving ? "Saving changes..." : "Save Changes"}
          </button>
        </aside>
      </div>
    </form>
  );
}
