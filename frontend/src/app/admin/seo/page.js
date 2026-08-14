"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CircleAlert,
  ExternalLink,
  FileSearch,
  Globe2,
  ImageIcon,
  LoaderCircle,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Tags,
} from "lucide-react";
import { toast } from "sonner";

import API from "@/lib/api";

const INITIAL_FORM = {
  defaultTitle: "",
  defaultDescription: "",
  defaultKeywords: "",
  ogImage: "",
  canonicalUrl: "",
  robotsIndex: true,
  robotsFollow: true,
};

function FormSection({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon size={19} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>

          <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
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

function Toggle({ checked, onChange, title, description }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border bg-background p-4">
      <span>
        <span className="block text-sm font-bold text-foreground">{title}</span>

        <span className="mt-1 block text-xs leading-5 text-muted">
          {description}
        </span>
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-5 w-5 shrink-0 accent-primary"
      />
    </label>
  );
}

function isValidWebUrl(value) {
  if (!value.trim()) return true;

  try {
    const url = new URL(value.trim());

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function AdminSeoPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [loadError, setLoadError] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  const keywordList = useMemo(() => {
    return form.defaultKeywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);
  }, [form.defaultKeywords]);

  const loadSeo = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");

      const response = await API.get("/api/settings/admin");

      const settings =
        response.data?.data?.settings || response.data?.data || null;

      const seo = settings?.seo || {};

      setForm({
        defaultTitle: seo.defaultTitle || "",
        defaultDescription: seo.defaultDescription || "",

        defaultKeywords: Array.isArray(seo.defaultKeywords)
          ? seo.defaultKeywords.join(", ")
          : "",

        ogImage: seo.ogImage || "",
        canonicalUrl: seo.canonicalUrl || "",

        robotsIndex: seo.robotsIndex !== false,
        robotsFollow: seo.robotsFollow !== false,
      });

      setUpdatedAt(settings?.updatedAt || "");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to load SEO settings.";

      setLoadError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSeo();
  }, [loadSeo]);

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

    if (form.defaultTitle.trim().length > 70) {
      nextErrors.defaultTitle =
        "Default SEO title cannot exceed 70 characters.";
    }

    if (form.defaultDescription.trim().length > 180) {
      nextErrors.defaultDescription =
        "Default meta description cannot exceed 180 characters.";
    }

    if (!isValidWebUrl(form.canonicalUrl)) {
      nextErrors.canonicalUrl =
        "Canonical URL must start with http:// or https://.";
    }

    if (!isValidWebUrl(form.ogImage)) {
      nextErrors.ogImage =
        "Open Graph image must be a valid http:// or https:// URL.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function saveSeo(event) {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the highlighted SEO fields.");

      return;
    }

    try {
      setSaving(true);

      const response = await API.put("/api/settings", {
        seo: {
          defaultTitle: form.defaultTitle.trim(),
          defaultDescription: form.defaultDescription.trim(),
          defaultKeywords: keywordList,
          ogImage: form.ogImage.trim(),
          canonicalUrl: form.canonicalUrl.trim(),
          robotsIndex: form.robotsIndex,
          robotsFollow: form.robotsFollow,
        },
      });

      const settings =
        response.data?.data?.settings || response.data?.data || null;

      if (settings?.updatedAt) {
        setUpdatedAt(settings.updatedAt);
      }

      toast.success(
        response.data?.message || "SEO settings saved successfully.",
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to save SEO settings.";

      toast.error(message);
    } finally {
      setSaving(false);
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
            Loading SEO settings...
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
            Unable to load SEO settings
          </h1>

          <p className="mt-2 text-sm text-muted">{loadError}</p>

          <button
            type="button"
            onClick={loadSeo}
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={saveSeo} className="space-y-6">
      {/* Header */}

      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-secondary">
            Search visibility
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            SEO Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Manage the default metadata used when a page does not provide its
            own SEO information.
          </p>

          {updatedAt && (
            <p className="mt-2 text-xs text-muted">
              Last updated {new Date(updatedAt).toLocaleString("en-IN")}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}

          {saving ? "Saving..." : "Save SEO Settings"}
        </button>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Main column */}

        <div className="space-y-6">
          <FormSection
            icon={FileSearch}
            title="Default search metadata"
            description="Fallback title and description used across the website."
          >
            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-bold text-foreground">
                  Default SEO title
                </span>

                <input
                  type="text"
                  maxLength={70}
                  value={form.defaultTitle}
                  onChange={(event) =>
                    updateField("defaultTitle", event.target.value)
                  }
                  placeholder="European Dreams | Study in Italy"
                  className={`mt-2 min-h-12 w-full rounded-xl border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary ${
                    errors.defaultTitle ? "border-danger" : "border-border"
                  }`}
                />

                <div className="mt-1.5 flex justify-between gap-3">
                  <FieldError message={errors.defaultTitle} />

                  <span className="ml-auto text-xs text-muted">
                    {form.defaultTitle.length}/70
                  </span>
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-foreground">
                  Default meta description
                </span>

                <textarea
                  rows={5}
                  maxLength={180}
                  value={form.defaultDescription}
                  onChange={(event) =>
                    updateField("defaultDescription", event.target.value)
                  }
                  placeholder="Describe the website for search engines..."
                  className={`mt-2 w-full resize-y rounded-xl border bg-background p-4 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted focus:border-primary ${
                    errors.defaultDescription
                      ? "border-danger"
                      : "border-border"
                  }`}
                />

                <div className="mt-1.5 flex justify-between gap-3">
                  <FieldError message={errors.defaultDescription} />

                  <span className="ml-auto text-xs text-muted">
                    {form.defaultDescription.length}/180
                  </span>
                </div>
              </label>
            </div>
          </FormSection>

          <FormSection
            icon={Tags}
            title="Default keywords"
            description="Separate keywords with commas. Page-specific keywords can override these defaults."
          >
            <textarea
              rows={4}
              value={form.defaultKeywords}
              onChange={(event) =>
                updateField("defaultKeywords", event.target.value)
              }
              placeholder="study in Italy, Italian universities, Italy scholarships"
              className="w-full resize-y rounded-xl border border-border bg-background p-4 text-sm leading-6 text-foreground outline-none placeholder:text-muted focus:border-primary"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              {keywordList.length ? (
                keywordList.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {keyword}
                  </span>
                ))
              ) : (
                <p className="text-xs text-muted">No default keywords added.</p>
              )}
            </div>
          </FormSection>

          <FormSection
            icon={Globe2}
            title="Canonical URL and social image"
            description="Define the preferred website URL and default sharing image."
          >
            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-bold text-foreground">
                  Canonical website URL
                </span>

                <input
                  type="url"
                  value={form.canonicalUrl}
                  onChange={(event) =>
                    updateField("canonicalUrl", event.target.value)
                  }
                  placeholder="https://www.europeandreams.org"
                  className={`mt-2 min-h-12 w-full rounded-xl border bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary ${
                    errors.canonicalUrl ? "border-danger" : "border-border"
                  }`}
                />

                <FieldError message={errors.canonicalUrl} />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-foreground">
                  Open Graph image URL
                </span>

                <input
                  type="url"
                  value={form.ogImage}
                  onChange={(event) =>
                    updateField("ogImage", event.target.value)
                  }
                  placeholder="https://res.cloudinary.com/.../og-image.jpg"
                  className={`mt-2 min-h-12 w-full rounded-xl border bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary ${
                    errors.ogImage ? "border-danger" : "border-border"
                  }`}
                />

                <FieldError message={errors.ogImage} />

                <p className="mt-1.5 text-xs text-muted">
                  Recommended size: 1200 × 630 pixels.
                </p>
              </label>

              <div className="relative aspect-1200/630 overflow-hidden rounded-xl border border-border bg-background">
                {form.ogImage && isValidWebUrl(form.ogImage) ? (
                  <img
                    src={form.ogImage}
                    alt="Open Graph preview"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-center">
                    <div>
                      <ImageIcon size={38} className="mx-auto text-muted/50" />

                      <p className="mt-2 text-xs font-semibold text-muted">
                        Social sharing image preview
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </FormSection>
        </div>

        {/* Sidebar */}

        <aside className="space-y-6">
          <FormSection
            icon={ShieldCheck}
            title="Search engine access"
            description="Control the default robots instructions."
          >
            <div className="space-y-3">
              <Toggle
                checked={form.robotsIndex}
                onChange={(value) => updateField("robotsIndex", value)}
                title="Allow indexing"
                description="Allow search engines to include public pages in results."
              />

              <Toggle
                checked={form.robotsFollow}
                onChange={(value) => updateField("robotsFollow", value)}
                title="Allow link following"
                description="Allow search engines to follow links on public pages."
              />
            </div>

            {!form.robotsIndex && (
              <div className="mt-4 rounded-xl border border-danger/20 bg-danger/5 p-3 text-xs leading-5 text-danger">
                Indexing is disabled. Your public pages may disappear from
                search results after crawlers revisit the website.
              </div>
            )}
          </FormSection>

          {/* Google preview */}

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Search size={17} className="text-primary" />
              Google preview
            </div>

            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <p className="truncate text-xs text-success">
                {form.canonicalUrl || "https://www.europeandreams.org"}
              </p>

              <p className="mt-1 line-clamp-2 text-lg font-medium leading-6 text-primary">
                {form.defaultTitle || "European Dreams | Study in Italy"}
              </p>

              <p className="mt-1 line-clamp-3 text-xs leading-5 text-muted">
                {form.defaultDescription ||
                  "Your default search description will appear here."}
              </p>
            </div>
          </section>

          {/* SEO endpoints */}

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-bold text-foreground">
              Public SEO APIs
            </h2>

            <div className="mt-3 space-y-2 text-xs text-muted">
              {["/api/seo/defaults", "/api/seo/robots", "/api/seo/sitemap"].map(
                (path) => (
                  <div
                    key={path}
                    className="flex items-center justify-between gap-2 rounded-lg bg-background px-3 py-2"
                  >
                    <code>{path}</code>
                    <ExternalLink size={13} />
                  </div>
                ),
              )}
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
}
