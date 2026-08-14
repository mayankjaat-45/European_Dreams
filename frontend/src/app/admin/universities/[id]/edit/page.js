"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  CircleAlert,
  ExternalLink,
  FileSearch,
  GraduationCap,
  ImageIcon,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Save,
  Search,
  Send,
  Sparkles,
  Trash2,
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

const INITIAL_FORM = {
  name: "",
  country: "Italy",
  city: "",
  region: "",
  regionGroup: "",
  universityType: "public",
  establishedYear: "",
  ranking: "",

  heroImage: "",
  heroImagePublicId: "",
  gallery: "",

  shortDescription: "",
  overview: "",
  whyChoose: "",
  scholarships: "",
  eligibility: "",

  academics: "",
  ielts: "",
  pte: "",
  centS: "",
  sat: "",
  imat: "",
  admissionNotes: "",

  applicationFee: "",
  tuitionFeeRange: "",
  intakes: "",
  applicationDeadline: "",
  languageRequirements: "",

  campusLife: "",
  accommodation: "",
  officialWebsite: "",
  brochureUrl: "",

  bachelorsCount: 0,
  mastersCount: 0,
  offersMedicineInEnglish: false,

  seoTitle: "",
  metaDescription: "",
  keywords: "",

  isFeatured: false,
  isActive: true,
  displayOrder: 0,
};

function joinCommaValues(value) {
  return Array.isArray(value) ? value.join(", ") : "";
}

function joinLineValues(value) {
  return Array.isArray(value) ? value.join("\n") : "";
}

function galleryToLines(gallery) {
  if (!Array.isArray(gallery)) return "";

  return gallery
    .map((image) => (typeof image === "string" ? image : image?.url))
    .filter(Boolean)
    .join("\n");
}

function splitCommaValues(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitLineValues(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function createGallery(value) {
  return splitLineValues(value).map((url) => ({
    url,
    publicId: "",
    alt: "",
  }));
}

function formatDate(value) {
  if (!value) return "Not available";

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

function InputField({ label, required, error, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-bold text-foreground">
        {label}

        {required && <span className="ml-1 text-danger">*</span>}
      </span>

      <input
        {...props}
        className={`mt-2 min-h-11 w-full rounded-xl border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary disabled:cursor-not-allowed disabled:opacity-60 ${
          error ? "border-danger" : "border-border"
        }`}
      />

      <FieldError message={error} />
    </label>
  );
}

function TextareaField({
  label,
  required,
  error,
  help,
  className = "",
  rows = 5,
  ...props
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-bold text-foreground">
        {label}

        {required && <span className="ml-1 text-danger">*</span>}
      </span>

      {help && <p className="mt-1 text-xs leading-5 text-muted">{help}</p>}

      <textarea
        {...props}
        rows={rows}
        className={`mt-2 w-full resize-y rounded-xl border bg-background p-3 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted focus:border-primary ${
          error ? "border-danger" : "border-border"
        }`}
      />

      <FieldError message={error} />
    </label>
  );
}

export default function EditUniversityPage() {
  const params = useParams();
  const router = useRouter();

  const universityId = params.id;

  const [form, setForm] = useState(INITIAL_FORM);
  const [university, setUniversity] = useState(null);
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadError, setLoadError] = useState("");

  const totalEnglishCourses =
    Math.max(Number(form.bachelorsCount) || 0, 0) +
    Math.max(Number(form.mastersCount) || 0, 0);

  const imagePreviewValid = useMemo(() => {
    return (
      form.heroImage.startsWith("http://") ||
      form.heroImage.startsWith("https://") ||
      form.heroImage.startsWith("/")
    );
  }, [form.heroImage]);

  const loadUniversity = useCallback(async () => {
    if (!universityId) return;

    try {
      setLoading(true);
      setLoadError("");

      const response = await API.get(`/api/universities/admin/${universityId}`);

      const data = response.data?.data?.university || response.data?.data;

      if (!data?._id) {
        throw new Error("University data was not found.");
      }

      const admission = data.admissionRequirements || {};

      setUniversity(data);

      setForm({
        name: data.name || "",
        country: "Italy",
        city: data.city || "",
        region: data.region || "",
        regionGroup: data.regionGroup || "",
        universityType: data.universityType || "public",
        establishedYear: data.establishedYear || "",
        ranking: data.ranking || "",

        heroImage: data.heroImage || "",
        heroImagePublicId: data.heroImagePublicId || "",
        gallery: galleryToLines(data.gallery),

        shortDescription: data.shortDescription || "",
        overview: data.overview || "",
        whyChoose: joinLineValues(data.whyChoose),
        scholarships: data.scholarships || "",
        eligibility: data.eligibility || "",

        academics: admission.academics || "",
        ielts: admission.ielts || "",
        pte: admission.pte || "",
        centS: admission.centS || "",
        sat: admission.sat || "",
        imat: admission.imat || "",
        admissionNotes: admission.notes || "",

        applicationFee: data.applicationFee || "",
        tuitionFeeRange: data.tuitionFeeRange || "",
        intakes: joinCommaValues(data.intakes),
        applicationDeadline: data.applicationDeadline || "",
        languageRequirements: data.languageRequirements || "",

        campusLife: data.campusLife || "",
        accommodation: data.accommodation || "",
        officialWebsite: data.officialWebsite || "",
        brochureUrl: data.brochureUrl || "",

        bachelorsCount: data.bachelorsCount || 0,
        mastersCount: data.mastersCount || 0,

        offersMedicineInEnglish: Boolean(data.offersMedicineInEnglish),

        seoTitle: data.seoTitle || "",
        metaDescription: data.metaDescription || "",
        keywords: joinCommaValues(data.keywords),

        isFeatured: Boolean(data.isFeatured),
        isActive: data.isActive !== false,
        displayOrder: data.displayOrder || 0,
      });
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        requestError.message ||
        "Unable to load university.";

      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [universityId]);

  useEffect(() => {
    loadUniversity();
  }, [loadUniversity]);

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

    if (!form.name.trim()) {
      nextErrors.name = "University name is required.";
    }

    if (!form.region.trim()) {
      nextErrors.region = "Italian region is required.";
    }

    if (!form.regionGroup) {
      nextErrors.regionGroup = "Region group is required.";
    }

    if (form.name.trim().length > 200) {
      nextErrors.name = "Name cannot exceed 200 characters.";
    }

    if (form.region.trim().length > 100) {
      nextErrors.region = "Region cannot exceed 100 characters.";
    }

    if (form.shortDescription.length > 500) {
      nextErrors.shortDescription =
        "Short description cannot exceed 500 characters.";
    }

    if (form.seoTitle.length > 70) {
      nextErrors.seoTitle = "SEO title cannot exceed 70 characters.";
    }

    if (form.metaDescription.length > 180) {
      nextErrors.metaDescription =
        "Meta description cannot exceed 180 characters.";
    }

    if (
      form.establishedYear &&
      (Number(form.establishedYear) < 1000 ||
        Number(form.establishedYear) > new Date().getFullYear())
    ) {
      nextErrors.establishedYear = "Enter a valid established year.";
    }

    if (form.officialWebsite && !/^https?:\/\//i.test(form.officialWebsite)) {
      nextErrors.officialWebsite =
        "Website must start with http:// or https://.";
    }

    if (form.brochureUrl && !/^https?:\/\//i.test(form.brochureUrl)) {
      nextErrors.brochureUrl =
        "Brochure URL must start with http:// or https://.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function updateUniversity(event) {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the highlighted fields.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        city: form.city.trim(),
        region: form.region.trim(),
        regionGroup: form.regionGroup,
        universityType: form.universityType,

        establishedYear: form.establishedYear
          ? Number(form.establishedYear)
          : "",

        ranking: form.ranking.trim(),

        heroImage: form.heroImage.trim(),
        heroImagePublicId: form.heroImagePublicId.trim(),

        gallery: createGallery(form.gallery),

        shortDescription: form.shortDescription.trim(),

        overview: form.overview.trim(),
        whyChoose: splitLineValues(form.whyChoose),

        scholarships: form.scholarships.trim(),
        eligibility: form.eligibility.trim(),

        admissionRequirements: {
          academics: form.academics.trim(),
          ielts: form.ielts.trim(),
          pte: form.pte.trim(),
          centS: form.centS.trim(),
          sat: form.sat.trim(),
          imat: form.imat.trim(),
          notes: form.admissionNotes.trim(),
        },

        applicationFee: form.applicationFee.trim(),
        tuitionFeeRange: form.tuitionFeeRange.trim(),

        intakes: splitCommaValues(form.intakes),

        applicationDeadline: form.applicationDeadline.trim(),

        languageRequirements: form.languageRequirements.trim(),

        campusLife: form.campusLife.trim(),
        accommodation: form.accommodation.trim(),

        officialWebsite: form.officialWebsite.trim(),

        brochureUrl: form.brochureUrl.trim(),

        bachelorsCount: Math.max(Number(form.bachelorsCount) || 0, 0),

        mastersCount: Math.max(Number(form.mastersCount) || 0, 0),

        offersMedicineInEnglish: form.offersMedicineInEnglish,

        seoTitle: form.seoTitle.trim(),

        metaDescription: form.metaDescription.trim(),

        keywords: splitCommaValues(form.keywords),

        isFeatured: form.isFeatured,
        isActive: form.isActive,

        displayOrder: Math.max(Number(form.displayOrder) || 0, 0),
      };

      const response = await API.put(
        `/api/universities/${universityId}`,
        payload,
      );

      const updatedUniversity = response.data?.data?.university;

      if (updatedUniversity?._id) {
        setUniversity(updatedUniversity);
      }

      toast.success(
        response.data?.message || "University updated successfully.",
      );

      router.refresh();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to update university.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteUniversity() {
    const confirmed = window.confirm(
      `Delete "${university?.name}"?\n\nThis only works if the university has no associated courses.`,
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const response = await API.delete(`/api/universities/${universityId}`);

      toast.success(
        response.data?.message || "University deleted successfully.",
      );

      router.replace("/admin/universities");
      router.refresh();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message || "Unable to delete university.",
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
            Loading university...
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
            Unable to open university
          </h1>

          <p className="mt-2 text-sm text-muted">{loadError}</p>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={loadUniversity}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white hover:bg-primary-hover"
            >
              <RefreshCw size={17} />
              Try Again
            </button>

            <Link
              href="/admin/universities"
              className="inline-flex min-h-11 items-center rounded-xl border border-border px-5 text-sm font-bold text-foreground hover:bg-card-hover"
            >
              Back to Universities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={updateUniversity} className="space-y-6">
      {/* Header */}

      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <Link
            href="/admin/universities"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            <ArrowLeft size={16} />
            Back to universities
          </Link>

          <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-secondary">
            Study destinations
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Edit University
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            Update university, admission and SEO information.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {university?.slug && (
            <Link
              href={`/universities/${university.slug}`}
              target="_blank"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-bold text-foreground hover:bg-card-hover"
            >
              <ExternalLink size={17} />
              View Page
            </Link>
          )}

          <button
            type="button"
            onClick={deleteUniversity}
            disabled={deleting || saving}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-danger/20 px-4 text-sm font-bold text-danger hover:bg-danger/10 disabled:opacity-50"
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
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-60"
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
        <div className="space-y-6">
          <FormSection
            title="University information"
            description="Update the university name, location and classification."
            icon={Building2}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                label="University name"
                required
                error={errors.name}
                maxLength={200}
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="sm:col-span-2"
              />

              {university?.slug && (
                <div className="rounded-xl border border-border bg-background p-3 sm:col-span-2">
                  <p className="text-xs font-bold text-muted">Current URL</p>

                  <p className="mt-1 break-all text-sm text-primary">
                    /universities/{university.slug}
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    Changing the name also updates the slug.
                  </p>
                </div>
              )}

              <InputField label="Country" value="Italy" disabled readOnly />

              <InputField
                label="City"
                value={form.city}
                onChange={(event) => updateField("city", event.target.value)}
              />

              <InputField
                label="Italian region"
                required
                error={errors.region}
                maxLength={100}
                value={form.region}
                onChange={(event) => updateField("region", event.target.value)}
              />

              <label className="block">
                <span className="text-sm font-bold text-foreground">
                  Region group
                  <span className="ml-1 text-danger">*</span>
                </span>

                <select
                  value={form.regionGroup}
                  onChange={(event) =>
                    updateField("regionGroup", event.target.value)
                  }
                  className={`mt-2 min-h-11 w-full rounded-xl border bg-background px-3 text-sm text-foreground outline-none focus:border-primary ${
                    errors.regionGroup ? "border-danger" : "border-border"
                  }`}
                >
                  <option value="">Select region group</option>

                  {REGION_GROUPS.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>

                <FieldError message={errors.regionGroup} />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-foreground">
                  University type
                </span>

                <select
                  value={form.universityType}
                  onChange={(event) =>
                    updateField("universityType", event.target.value)
                  }
                  className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="technical">Technical</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <InputField
                label="Established year"
                type="number"
                min="1000"
                max={new Date().getFullYear()}
                error={errors.establishedYear}
                value={form.establishedYear}
                onChange={(event) =>
                  updateField("establishedYear", event.target.value)
                }
              />

              <InputField
                label="Ranking"
                value={form.ranking}
                onChange={(event) => updateField("ranking", event.target.value)}
              />
            </div>
          </FormSection>

          <FormSection
            title="Description"
            description="Update the public university content."
            icon={BookOpen}
          >
            <div className="space-y-5">
              <TextareaField
                label="Short description"
                rows={4}
                maxLength={500}
                error={errors.shortDescription}
                value={form.shortDescription}
                onChange={(event) =>
                  updateField("shortDescription", event.target.value)
                }
              />

              <p className="text-right text-xs text-muted">
                {form.shortDescription.length}/500
              </p>

              <TextareaField
                label="Complete overview"
                rows={10}
                value={form.overview}
                onChange={(event) =>
                  updateField("overview", event.target.value)
                }
              />

              <TextareaField
                label="Why choose this university?"
                rows={7}
                help="Enter one reason on each line."
                value={form.whyChoose}
                onChange={(event) =>
                  updateField("whyChoose", event.target.value)
                }
              />

              <TextareaField
                label="Scholarships"
                rows={6}
                value={form.scholarships}
                onChange={(event) =>
                  updateField("scholarships", event.target.value)
                }
              />

              <TextareaField
                label="Eligibility"
                rows={6}
                value={form.eligibility}
                onChange={(event) =>
                  updateField("eligibility", event.target.value)
                }
              />
            </div>
          </FormSection>

          <FormSection
            title="Admission requirements"
            description="Update academic and entrance-test requirements."
            icon={GraduationCap}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <TextareaField
                label="Academic requirements"
                rows={4}
                value={form.academics}
                onChange={(event) =>
                  updateField("academics", event.target.value)
                }
                className="sm:col-span-2"
              />

              <InputField
                label="IELTS"
                value={form.ielts}
                onChange={(event) => updateField("ielts", event.target.value)}
              />

              <InputField
                label="PTE"
                value={form.pte}
                onChange={(event) => updateField("pte", event.target.value)}
              />

              <InputField
                label="CEnT-S"
                value={form.centS}
                onChange={(event) => updateField("centS", event.target.value)}
              />

              <InputField
                label="SAT"
                value={form.sat}
                onChange={(event) => updateField("sat", event.target.value)}
              />

              <InputField
                label="IMAT"
                value={form.imat}
                onChange={(event) => updateField("imat", event.target.value)}
              />

              <TextareaField
                label="Additional notes"
                rows={4}
                value={form.admissionNotes}
                onChange={(event) =>
                  updateField("admissionNotes", event.target.value)
                }
                className="sm:col-span-2"
              />
            </div>
          </FormSection>

          <FormSection
            title="Fees and applications"
            description="Update fees, intakes and deadlines."
            icon={FileSearch}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                label="Application fee"
                value={form.applicationFee}
                onChange={(event) =>
                  updateField("applicationFee", event.target.value)
                }
              />

              <InputField
                label="Tuition fee range"
                value={form.tuitionFeeRange}
                onChange={(event) =>
                  updateField("tuitionFeeRange", event.target.value)
                }
              />

              <InputField
                label="Intakes"
                value={form.intakes}
                onChange={(event) => updateField("intakes", event.target.value)}
                placeholder="September, February"
              />

              <InputField
                label="Application deadline"
                value={form.applicationDeadline}
                onChange={(event) =>
                  updateField("applicationDeadline", event.target.value)
                }
              />

              <TextareaField
                label="Language requirements"
                rows={5}
                value={form.languageRequirements}
                onChange={(event) =>
                  updateField("languageRequirements", event.target.value)
                }
                className="sm:col-span-2"
              />
            </div>
          </FormSection>

          <FormSection
            title="Campus and accommodation"
            description="Update student-life and housing details."
            icon={MapPin}
          >
            <div className="space-y-5">
              <TextareaField
                label="Campus life"
                rows={6}
                value={form.campusLife}
                onChange={(event) =>
                  updateField("campusLife", event.target.value)
                }
              />

              <TextareaField
                label="Accommodation"
                rows={6}
                value={form.accommodation}
                onChange={(event) =>
                  updateField("accommodation", event.target.value)
                }
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <InputField
                  label="Official website"
                  type="url"
                  error={errors.officialWebsite}
                  value={form.officialWebsite}
                  onChange={(event) =>
                    updateField("officialWebsite", event.target.value)
                  }
                />

                <InputField
                  label="Brochure URL"
                  type="url"
                  error={errors.brochureUrl}
                  value={form.brochureUrl}
                  onChange={(event) =>
                    updateField("brochureUrl", event.target.value)
                  }
                />
              </div>
            </div>
          </FormSection>

          <FormSection
            title="University images"
            description="Update the hero and gallery images."
            icon={ImageIcon}
          >
            <div className="space-y-5">
              <InputField
                label="Hero image URL"
                value={form.heroImage}
                onChange={(event) =>
                  updateField("heroImage", event.target.value)
                }
              />

              <InputField
                label="Hero image public ID"
                value={form.heroImagePublicId}
                onChange={(event) =>
                  updateField("heroImagePublicId", event.target.value)
                }
              />

              <div className="relative aspect-16/7 overflow-hidden rounded-xl border border-border bg-background">
                {form.heroImage && imagePreviewValid ? (
                  <img
                    key={form.heroImage}
                    src={form.heroImage}
                    alt={form.name || "University preview"}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <ImageIcon size={38} className="text-muted/50" />
                  </div>
                )}
              </div>

              <TextareaField
                label="Gallery image URLs"
                rows={7}
                help="Enter one image URL on each line."
                value={form.gallery}
                onChange={(event) => updateField("gallery", event.target.value)}
              />
            </div>
          </FormSection>

          <FormSection
            title="Search engine optimization"
            description="Update search-result information."
            icon={Search}
          >
            <div className="space-y-5">
              <InputField
                label="SEO title"
                maxLength={70}
                error={errors.seoTitle}
                value={form.seoTitle}
                onChange={(event) =>
                  updateField("seoTitle", event.target.value)
                }
              />

              <p className="text-right text-xs text-muted">
                {form.seoTitle.length}/70
              </p>

              <TextareaField
                label="Meta description"
                rows={4}
                maxLength={180}
                error={errors.metaDescription}
                value={form.metaDescription}
                onChange={(event) =>
                  updateField("metaDescription", event.target.value)
                }
              />

              <p className="text-right text-xs text-muted">
                {form.metaDescription.length}/180
              </p>

              <InputField
                label="SEO keywords"
                value={form.keywords}
                onChange={(event) =>
                  updateField("keywords", event.target.value)
                }
                placeholder="Separate keywords with commas"
              />
            </div>
          </FormSection>
        </div>

        {/* Sidebar */}

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <FormSection
            title="Publishing"
            description="Manage website visibility."
            icon={Send}
          >
            <div className="space-y-5">
              {[
                {
                  name: "isActive",
                  title: "Active",
                  description: "Display this university publicly.",
                  checked: form.isActive,
                },
                {
                  name: "isFeatured",
                  title: "Featured",
                  description: "Show in featured university sections.",
                  checked: form.isFeatured,
                },
                {
                  name: "offersMedicineInEnglish",
                  title: "Medicine in English",
                  description: "Offers an English medicine programme.",
                  checked: form.offersMedicineInEnglish,
                },
              ].map((setting) => (
                <label
                  key={setting.name}
                  className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border bg-background p-4"
                >
                  <span>
                    <span className="block text-sm font-bold text-foreground">
                      {setting.title}
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-muted">
                      {setting.description}
                    </span>
                  </span>

                  <input
                    type="checkbox"
                    checked={setting.checked}
                    onChange={(event) =>
                      updateField(setting.name, event.target.checked)
                    }
                    className="mt-1 h-5 w-5 rounded border-border accent-primary"
                  />
                </label>
              ))}

              <InputField
                label="Display order"
                type="number"
                min="0"
                value={form.displayOrder}
                onChange={(event) =>
                  updateField("displayOrder", event.target.value)
                }
              />
            </div>
          </FormSection>

          <FormSection
            title="English programmes"
            description="The total is calculated automatically."
            icon={GraduationCap}
          >
            <div className="space-y-5">
              <InputField
                label="Bachelor programmes"
                type="number"
                min="0"
                value={form.bachelorsCount}
                onChange={(event) =>
                  updateField("bachelorsCount", event.target.value)
                }
              />

              <InputField
                label="Master programmes"
                type="number"
                min="0"
                value={form.mastersCount}
                onChange={(event) =>
                  updateField("mastersCount", event.target.value)
                }
              />

              <div className="rounded-xl bg-primary/10 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-primary">
                  Total English courses
                </p>

                <p className="mt-2 text-3xl font-bold text-foreground">
                  {totalEnglishCourses}
                </p>
              </div>
            </div>
          </FormSection>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-secondary" />

              <h2 className="font-bold text-foreground">
                University information
              </h2>
            </div>

            <dl className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Created</dt>

                <dd className="text-right font-semibold text-foreground">
                  {formatDate(university?.createdAt)}
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-muted">Updated</dt>

                <dd className="text-right font-semibold text-foreground">
                  {formatDate(university?.updatedAt)}
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-muted">Country</dt>

                <dd className="font-semibold text-foreground">Italy</dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-muted">Database total</dt>

                <dd className="font-semibold text-foreground">
                  {university?.totalEnglishCourses || 0}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-bold text-foreground">Search preview</h2>

            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <p className="truncate text-xs text-success">
                europeandreams.org › universities › {university?.slug || ""}
              </p>

              <p className="mt-1 line-clamp-2 text-base font-semibold text-primary">
                {form.seoTitle || form.name || "University name"}
              </p>

              <p className="mt-1 line-clamp-3 text-xs leading-5 text-muted">
                {form.metaDescription ||
                  form.shortDescription ||
                  "University description will appear here."}
              </p>
            </div>
          </section>

          <button
            type="submit"
            disabled={saving || deleting}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-60"
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
