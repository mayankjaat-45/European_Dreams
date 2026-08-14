"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  CircleAlert,
  FileSearch,
  GraduationCap,
  ImageIcon,
  LoaderCircle,
  MapPin,
  Save,
  Send,
  Sparkles,
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
        className={`mt-2 min-h-11 w-full rounded-xl border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary ${
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

export default function CreateUniversityPage() {
  const router = useRouter();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

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

  async function submitUniversity(event) {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the highlighted fields.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        country: "Italy",
        city: form.city.trim(),
        region: form.region.trim(),
        regionGroup: form.regionGroup,
        universityType: form.universityType,

        establishedYear: form.establishedYear
          ? Number(form.establishedYear)
          : null,

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

      const response = await API.post("/api/universities", payload);

      const university = response.data?.data?.university;

      toast.success(
        response.data?.message || "University created successfully.",
      );

      if (university?._id) {
        router.replace(`/admin/universities/${university._id}/edit`);
      } else {
        router.replace("/admin/universities");
      }

      router.refresh();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to create university.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submitUniversity} className="space-y-6">
      {/* Header */}

      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <Link
            href="/admin/universities"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:underline"
          >
            <ArrowLeft size={16} />
            Back to universities
          </Link>

          <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-secondary">
            Study destinations
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Add University
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            Add an Italian university and its admission information.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/universities"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-bold text-foreground transition hover:bg-card-hover"
          >
            Cancel
          </Link>

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

            {saving ? "Creating..." : "Create University"}
          </button>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Main form */}

        <div className="space-y-6">
          <FormSection
            title="University information"
            description="Add the university name, location, type and ranking."
            icon={Building2}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                label="University name"
                required
                error={errors.name}
                value={form.name}
                maxLength={200}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="University of Messina"
                className="sm:col-span-2"
              />

              <InputField label="Country" value="Italy" disabled readOnly />

              <InputField
                label="City"
                value={form.city}
                onChange={(event) => updateField("city", event.target.value)}
                placeholder="Messina"
              />

              <InputField
                label="Italian region"
                required
                error={errors.region}
                value={form.region}
                maxLength={100}
                onChange={(event) => updateField("region", event.target.value)}
                placeholder="Sicily"
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
                placeholder="1548"
              />

              <InputField
                label="Ranking"
                value={form.ranking}
                onChange={(event) => updateField("ranking", event.target.value)}
                placeholder="Top 500 globally"
              />
            </div>
          </FormSection>

          <FormSection
            title="Description"
            description="Explain the university and why students should choose it."
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
                placeholder="Write a short introduction displayed on university cards..."
              />

              <div className="text-right text-xs text-muted">
                {form.shortDescription.length}/500
              </div>

              <TextareaField
                label="Complete overview"
                rows={10}
                value={form.overview}
                onChange={(event) =>
                  updateField("overview", event.target.value)
                }
                placeholder="Write the complete university overview..."
              />

              <TextareaField
                label="Why choose this university?"
                rows={7}
                help="Enter one reason on each line."
                value={form.whyChoose}
                onChange={(event) =>
                  updateField("whyChoose", event.target.value)
                }
                placeholder={`Strong international reputation\nAffordable tuition fees\nExcellent research opportunities`}
              />

              <TextareaField
                label="Scholarships"
                rows={6}
                value={form.scholarships}
                onChange={(event) =>
                  updateField("scholarships", event.target.value)
                }
                placeholder="Describe available scholarships..."
              />

              <TextareaField
                label="Eligibility"
                rows={6}
                value={form.eligibility}
                onChange={(event) =>
                  updateField("eligibility", event.target.value)
                }
                placeholder="Describe general eligibility requirements..."
              />
            </div>
          </FormSection>

          <FormSection
            title="Admission requirements"
            description="Add academic and entrance-test requirements."
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
                placeholder="Minimum academic qualifications..."
                className="sm:col-span-2"
              />

              <InputField
                label="IELTS"
                value={form.ielts}
                onChange={(event) => updateField("ielts", event.target.value)}
                placeholder="Overall 6.0"
              />

              <InputField
                label="PTE"
                value={form.pte}
                onChange={(event) => updateField("pte", event.target.value)}
                placeholder="Minimum 59"
              />

              <InputField
                label="CEnT-S"
                value={form.centS}
                onChange={(event) => updateField("centS", event.target.value)}
                placeholder="Required for selected courses"
              />

              <InputField
                label="SAT"
                value={form.sat}
                onChange={(event) => updateField("sat", event.target.value)}
                placeholder="SAT requirement"
              />

              <InputField
                label="IMAT"
                value={form.imat}
                onChange={(event) => updateField("imat", event.target.value)}
                placeholder="Required for medicine"
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
            description="Add fees, intakes, deadlines and language information."
            icon={FileSearch}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                label="Application fee"
                value={form.applicationFee}
                onChange={(event) =>
                  updateField("applicationFee", event.target.value)
                }
                placeholder="€30"
              />

              <InputField
                label="Tuition fee range"
                value={form.tuitionFeeRange}
                onChange={(event) =>
                  updateField("tuitionFeeRange", event.target.value)
                }
                placeholder="€500 – €4,000 per year"
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
                placeholder="Varies by programme"
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
            description="Describe student life and housing options."
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
                  placeholder="https://www.university.it"
                />

                <InputField
                  label="Brochure URL"
                  type="url"
                  error={errors.brochureUrl}
                  value={form.brochureUrl}
                  onChange={(event) =>
                    updateField("brochureUrl", event.target.value)
                  }
                  placeholder="https://example.com/brochure.pdf"
                />
              </div>
            </div>
          </FormSection>

          <FormSection
            title="University images"
            description="Add the hero image and optional gallery images."
            icon={ImageIcon}
          >
            <div className="space-y-5">
              <InputField
                label="Hero image URL"
                value={form.heroImage}
                onChange={(event) =>
                  updateField("heroImage", event.target.value)
                }
                placeholder="https://res.cloudinary.com/.../image.jpg"
              />

              <InputField
                label="Hero image public ID"
                value={form.heroImagePublicId}
                onChange={(event) =>
                  updateField("heroImagePublicId", event.target.value)
                }
                placeholder="european-dreams/universities/image"
              />

              <div className="relative aspect-16/7 overflow-hidden rounded-xl border border-border bg-background">
                {form.heroImage && imagePreviewValid ? (
                  <img
                    src={form.heroImage}
                    alt="University preview"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-center">
                    <div>
                      <ImageIcon size={38} className="mx-auto text-muted/50" />

                      <p className="mt-2 text-xs font-semibold text-muted">
                        Hero image preview
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <TextareaField
                label="Gallery image URLs"
                rows={7}
                help="Enter one image URL on each line."
                value={form.gallery}
                onChange={(event) => updateField("gallery", event.target.value)}
                placeholder={`https://example.com/campus-1.jpg\nhttps://example.com/campus-2.jpg`}
              />
            </div>
          </FormSection>

          <FormSection
            title="Search engine optimization"
            description="Control the university search-result information."
            icon={Sparkles}
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
                placeholder="University of Messina – Courses and Admissions"
              />

              <div className="text-right text-xs text-muted">
                {form.seoTitle.length}/70
              </div>

              <TextareaField
                label="Meta description"
                rows={4}
                maxLength={180}
                error={errors.metaDescription}
                value={form.metaDescription}
                onChange={(event) =>
                  updateField("metaDescription", event.target.value)
                }
                placeholder="Explore courses, admission requirements, fees and scholarships..."
              />

              <div className="text-right text-xs text-muted">
                {form.metaDescription.length}/180
              </div>

              <InputField
                label="SEO keywords"
                value={form.keywords}
                onChange={(event) =>
                  updateField("keywords", event.target.value)
                }
                placeholder="university of messina, study in italy"
              />
            </div>
          </FormSection>
        </div>

        {/* Sidebar */}

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <FormSection
            title="Publishing"
            description="Manage website visibility and placement."
            icon={Send}
          >
            <div className="space-y-5">
              <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border bg-background p-4">
                <span>
                  <span className="block text-sm font-bold text-foreground">
                    Active
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-muted">
                    Display this university on the public website.
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
                    Show this university in featured sections.
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

              <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border bg-background p-4">
                <span>
                  <span className="block text-sm font-bold text-foreground">
                    Medicine in English
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-muted">
                    University offers an English-taught medicine programme.
                  </span>
                </span>

                <input
                  type="checkbox"
                  checked={form.offersMedicineInEnglish}
                  onChange={(event) =>
                    updateField("offersMedicineInEnglish", event.target.checked)
                  }
                  className="mt-1 h-5 w-5 rounded border-border accent-primary"
                />
              </label>

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
            description="These values calculate the total automatically."
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

                <p className="mt-1 text-xs text-muted">
                  Calculated automatically by the backend.
                </p>
              </div>
            </div>
          </FormSection>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="font-bold text-foreground">Search preview</h2>

            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <p className="truncate text-xs text-success">
                europeandreams.org › universities
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
            disabled={saving}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}

            {saving ? "Creating university..." : "Create University"}
          </button>
        </aside>
      </div>
    </form>
  );
}
