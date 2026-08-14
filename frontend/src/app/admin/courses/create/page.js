"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  LoaderCircle,
  Plus,
  Save,
  Search,
  Stethoscope,
  X,
} from "lucide-react";
import { toast } from "sonner";

import API from "@/lib/api";

const initialForm = {
  university: "",
  name: "",
  degreeLevel: "",
  programmeType: "",
  degreeType: "",
  fieldOfStudy: "",

  duration: "To be confirmed",
  studyMode: "on-campus",
  language: "English",
  admissionYear: "2026/27",
  campus: "",

  tuitionFee: "",
  applicationFee: "",
  intakes: [],
  applicationDeadline: "",

  shortDescription: "",
  overview: "",
  eligibility: "",
  academicRequirements: [],

  admissionRequirements: {
    academics: "",
    ielts: "",
    toefl: "",
    pte: "",
    duolingo: "",
    centS: "",
    sat: "",
    imat: "",
    other: "",
    notes: "",
  },

  documentsRequired: [],
  curriculum: [],
  careerOpportunities: [],
  scholarships: "",

  requiresIMAT: false,
  isMedicineProgramme: false,
  specialNotes: "",

  brochureUrl: "",
  seoTitle: "",
  metaDescription: "",
  keywords: [],

  isFeatured: false,
  isActive: true,
  displayOrder: 0,
};

const sections = [
  { id: "basic", label: "Basic details" },
  { id: "academic", label: "Academic details" },
  { id: "admission", label: "Admission" },
  { id: "content", label: "Course content" },
  { id: "seo", label: "SEO & status" },
];

const degreeLevels = [
  { value: "bachelor", label: "Bachelor" },
  { value: "master", label: "Master" },
  { value: "phd", label: "PhD" },
  { value: "diploma", label: "Diploma" },
  { value: "certificate", label: "Certificate" },
  { value: "other", label: "Other" },
];

const programmeTypes = [
  { value: "bachelor", label: "Bachelor" },
  { value: "master", label: "Master" },
  { value: "single-cycle-master", label: "Single-cycle Master" },
  { value: "phd", label: "PhD" },
  { value: "diploma", label: "Diploma" },
  { value: "certificate", label: "Certificate" },
  { value: "other", label: "Other" },
];

const inputClass =
  "min-h-12 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10";

const textareaClass =
  "min-h-32 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10";

function Field({ label, required = false, hint = "", error = "", children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-foreground">
        {label}

        {required && <span className="ml-1 text-danger">*</span>}
      </span>

      {children}

      {error ? (
        <span className="mt-1.5 block text-xs font-semibold text-danger">
          {error}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs leading-5 text-muted">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

function FormSection({ id, title, description, children }) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="border-b border-border pb-5">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>

        <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}

function ArrayInput({
  label,
  value,
  onChange,
  placeholder,
  hint = "Press Enter or use the Add button.",
}) {
  const [entry, setEntry] = useState("");

  const addItem = () => {
    const cleanedItem = entry.trim();

    if (!cleanedItem) return;

    const alreadyExists = value.some(
      (item) => item.toLowerCase() === cleanedItem.toLowerCase(),
    );

    if (!alreadyExists) {
      onChange([...value, cleanedItem]);
    }

    setEntry("");
  };

  const removeItem = (index) => {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <Field label={label} hint={hint}>
      <div className="flex gap-2">
        <input
          type="text"
          value={entry}
          onChange={(event) => setEntry(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addItem();
            }
          }}
          placeholder={placeholder}
          className={inputClass}
        />

        <button
          type="button"
          onClick={addItem}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-white transition hover:bg-primary-hover"
          aria-label={`Add ${label}`}
        >
          <Plus size={19} />
        </button>
      </div>

      {value.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {value.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary"
            >
              {item}

              <button
                type="button"
                onClick={() => removeItem(index)}
                className="rounded-full transition hover:text-danger"
                aria-label={`Remove ${item}`}
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
      )}
    </Field>
  );
}

function Toggle({ label, description, checked, onChange, disabled = false }) {
  return (
    <label
      className={`flex items-start justify-between gap-4 rounded-xl border border-border bg-background p-4 ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
    >
      <span>
        <span className="block text-sm font-bold text-foreground">{label}</span>

        <span className="mt-1 block text-xs leading-5 text-muted">
          {description}
        </span>
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
        className="mt-1 h-5 w-5 shrink-0 accent-primary"
      />
    </label>
  );
}

export default function CreateCoursePage() {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [universities, setUniversities] = useState([]);
  const [universitySearch, setUniversitySearch] = useState("");

  const [loadingUniversities, setLoadingUniversities] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        setLoadingUniversities(true);

        const response = await API.get("/api/universities", {
          params: {
            page: 1,
            limit: 100,
          },
        });

        const data = response.data?.data || {};

        setUniversities(data.universities || []);
      } catch (requestError) {
        const message =
          requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load universities.";

        setApiError(message);
      } finally {
        setLoadingUniversities(false);
      }
    };

    loadUniversities();
  }, []);

  const updateForm = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  const updateAdmissionRequirement = (name, value) => {
    setForm((previous) => ({
      ...previous,
      admissionRequirements: {
        ...previous.admissionRequirements,
        [name]: value,
      },
    }));
  };

  const handleMedicineChange = (checked) => {
    setForm((previous) => ({
      ...previous,
      isMedicineProgramme: checked,
      requiresIMAT: checked ? true : previous.requiresIMAT,
      degreeLevel: checked ? "master" : previous.degreeLevel,
      programmeType: checked ? "single-cycle-master" : previous.programmeType,
      duration: checked ? "6 Years" : previous.duration,
    }));

    setErrors((previous) => ({
      ...previous,
      degreeLevel: "",
      programmeType: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.university) {
      nextErrors.university = "Please select a university.";
    }

    if (!form.name.trim()) {
      nextErrors.name = "Course name is required.";
    }

    if (!form.degreeLevel) {
      nextErrors.degreeLevel = "Degree level is required.";
    }

    if (!form.programmeType) {
      nextErrors.programmeType = "Programme type is required.";
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

    if (Number(form.displayOrder) < 0) {
      nextErrors.displayOrder = "Display order cannot be negative.";
    }

    setErrors(nextErrors);

    const firstError = Object.keys(nextErrors)[0];

    if (firstError) {
      document
        .querySelector(`[name="${firstError}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });

      toast.error("Please correct the highlighted fields.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setApiError("");

      const payload = {
        ...form,
        name: form.name.trim(),
        displayOrder: Number(form.displayOrder) || 0,
      };

      const response = await API.post("/api/courses", payload);
      const createdCourse = response.data?.data?.course;

      toast.success(response.data?.message || "Course created successfully.");

      if (createdCourse?._id) {
        router.push(`/admin/courses/${createdCourse._id}`);
      } else {
        router.push("/admin/courses");
      }

      router.refresh();
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        requestError.message ||
        "Unable to create course.";

      setApiError(message);
      toast.error(message);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUniversities = universities.filter((university) => {
    const searchValue = universitySearch.trim().toLowerCase();

    if (!searchValue) return true;

    return [university.name, university.city, university.region]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(searchValue));
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Heading */}
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted transition hover:text-primary"
          >
            <ArrowLeft size={17} />
            Back to courses
          </Link>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-4xl">
            Add course
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
            Create a new university course for the European Dreams website.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 lg:self-auto"
        >
          {submitting ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}

          {submitting ? "Creating course..." : "Create course"}
        </button>
      </section>

      {apiError && (
        <div className="rounded-2xl border border-danger/20 bg-danger/10 px-5 py-4 text-sm font-semibold text-danger">
          {apiError}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-border bg-card p-2 shadow-sm">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold text-muted transition hover:bg-primary/10 hover:text-primary"
          >
            {section.label}
          </a>
        ))}
      </nav>

      {/* Basic details */}
      <FormSection
        id="basic"
        title="Basic course details"
        description="Select the university and provide the main course information."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <Field
              label="University"
              required
              error={errors.university}
              hint="Only active universities can be selected."
            >
              <div className="mb-3">
                <div className="relative">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    type="search"
                    value={universitySearch}
                    onChange={(event) =>
                      setUniversitySearch(event.target.value)
                    }
                    placeholder="Search university, city or region..."
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <select
                name="university"
                value={form.university}
                onChange={(event) =>
                  updateForm("university", event.target.value)
                }
                disabled={loadingUniversities}
                className={inputClass}
              >
                <option value="">
                  {loadingUniversities
                    ? "Loading universities..."
                    : "Select university"}
                </option>

                {filteredUniversities.map((university) => (
                  <option key={university._id} value={university._id}>
                    {university.name}
                    {university.city ? ` — ${university.city}` : ""}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Course name" required error={errors.name}>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={(event) => updateForm("name", event.target.value)}
              placeholder="Example: Artificial Intelligence"
              maxLength={250}
              className={inputClass}
            />
          </Field>

          <Field label="Field of study">
            <input
              type="text"
              value={form.fieldOfStudy}
              onChange={(event) =>
                updateForm("fieldOfStudy", event.target.value)
              }
              placeholder="Example: Computer Science"
              className={inputClass}
            />
          </Field>

          <Field label="Degree level" required error={errors.degreeLevel}>
            <select
              name="degreeLevel"
              value={form.degreeLevel}
              onChange={(event) =>
                updateForm("degreeLevel", event.target.value)
              }
              disabled={form.isMedicineProgramme}
              className={inputClass}
            >
              <option value="">Select degree level</option>

              {degreeLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Programme type" required error={errors.programmeType}>
            <select
              name="programmeType"
              value={form.programmeType}
              onChange={(event) =>
                updateForm("programmeType", event.target.value)
              }
              disabled={form.isMedicineProgramme}
              className={inputClass}
            >
              <option value="">Select programme type</option>

              {programmeTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Degree type"
            hint="Official qualification awarded by the university."
          >
            <input
              type="text"
              value={form.degreeType}
              onChange={(event) => updateForm("degreeType", event.target.value)}
              placeholder="Example: MSc, BSc or Laurea Magistrale"
              className={inputClass}
            />
          </Field>

          <Field label="Campus">
            <input
              type="text"
              value={form.campus}
              onChange={(event) => updateForm("campus", event.target.value)}
              placeholder="Example: Milan Campus"
              className={inputClass}
            />
          </Field>
        </div>
      </FormSection>

      {/* Academic details */}
      <FormSection
        id="academic"
        title="Academic details"
        description="Add the duration, delivery mode, language, fees and intake information."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Duration">
            <input
              type="text"
              value={form.duration}
              onChange={(event) => updateForm("duration", event.target.value)}
              placeholder="Example: 2 Years"
              className={inputClass}
            />
          </Field>

          <Field label="Study mode">
            <select
              value={form.studyMode}
              onChange={(event) => updateForm("studyMode", event.target.value)}
              className={inputClass}
            >
              <option value="on-campus">On campus</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </Field>

          <Field
            label="Language"
            hint="English-taught status is calculated from this value."
          >
            <input
              type="text"
              value={form.language}
              onChange={(event) => updateForm("language", event.target.value)}
              placeholder="English"
              className={inputClass}
            />
          </Field>

          <Field label="Admission year">
            <input
              type="text"
              value={form.admissionYear}
              onChange={(event) =>
                updateForm("admissionYear", event.target.value)
              }
              placeholder="2026/27"
              className={inputClass}
            />
          </Field>

          <Field label="Tuition fee">
            <input
              type="text"
              value={form.tuitionFee}
              onChange={(event) => updateForm("tuitionFee", event.target.value)}
              placeholder="Example: €2,500 per year"
              className={inputClass}
            />
          </Field>

          <Field label="Application fee">
            <input
              type="text"
              value={form.applicationFee}
              onChange={(event) =>
                updateForm("applicationFee", event.target.value)
              }
              placeholder="Example: €50"
              className={inputClass}
            />
          </Field>

          <Field label="Application deadline">
            <input
              type="text"
              value={form.applicationDeadline}
              onChange={(event) =>
                updateForm("applicationDeadline", event.target.value)
              }
              placeholder="Example: 30 April 2027"
              className={inputClass}
            />
          </Field>

          <div className="sm:col-span-2">
            <ArrayInput
              label="Intakes"
              value={form.intakes}
              onChange={(value) => updateForm("intakes", value)}
              placeholder="Example: September"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Toggle
            label="Medicine programme"
            description="Automatically sets Master, single-cycle programme, six years and IMAT."
            checked={form.isMedicineProgramme}
            onChange={handleMedicineChange}
          />

          <Toggle
            label="Requires IMAT"
            description="Enable when admission requires the IMAT examination."
            checked={form.requiresIMAT}
            onChange={(checked) => updateForm("requiresIMAT", checked)}
            disabled={form.isMedicineProgramme}
          />
        </div>
      </FormSection>

      {/* Admission requirements */}
      <FormSection
        id="admission"
        title="Admission and eligibility"
        description="Provide general eligibility and course-specific examination requirements."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <Field label="General eligibility">
            <textarea
              value={form.eligibility}
              onChange={(event) =>
                updateForm("eligibility", event.target.value)
              }
              placeholder="Describe the general eligibility criteria..."
              className={textareaClass}
            />
          </Field>

          <Field label="Academic requirement">
            <textarea
              value={form.admissionRequirements.academics}
              onChange={(event) =>
                updateAdmissionRequirement("academics", event.target.value)
              }
              placeholder="Example: Relevant bachelor's degree with minimum credits..."
              className={textareaClass}
            />
          </Field>

          {[
            ["ielts", "IELTS"],
            ["toefl", "TOEFL"],
            ["pte", "PTE"],
            ["duolingo", "Duolingo"],
            ["centS", "CEnT-S"],
            ["sat", "SAT"],
            ["imat", "IMAT"],
            ["other", "Other requirement"],
          ].map(([key, label]) => (
            <Field key={key} label={label}>
              <input
                type="text"
                value={form.admissionRequirements[key]}
                onChange={(event) =>
                  updateAdmissionRequirement(key, event.target.value)
                }
                placeholder={`Enter ${label} requirement`}
                className={inputClass}
              />
            </Field>
          ))}

          <div className="lg:col-span-2">
            <Field label="Admission notes">
              <textarea
                value={form.admissionRequirements.notes}
                onChange={(event) =>
                  updateAdmissionRequirement("notes", event.target.value)
                }
                placeholder="Add any additional admission notes..."
                className={textareaClass}
              />
            </Field>
          </div>

          <ArrayInput
            label="Academic requirements"
            value={form.academicRequirements}
            onChange={(value) => updateForm("academicRequirements", value)}
            placeholder="Example: Relevant bachelor's degree"
          />

          <ArrayInput
            label="Documents required"
            value={form.documentsRequired}
            onChange={(value) => updateForm("documentsRequired", value)}
            placeholder="Example: Academic transcripts"
          />
        </div>
      </FormSection>

      {/* Course content */}
      <FormSection
        id="content"
        title="Course content"
        description="Add website descriptions, curriculum and career information."
      >
        <div className="grid gap-5">
          <Field
            label="Short description"
            error={errors.shortDescription}
            hint={`${form.shortDescription.length}/500 characters`}
          >
            <textarea
              name="shortDescription"
              value={form.shortDescription}
              onChange={(event) =>
                updateForm("shortDescription", event.target.value)
              }
              placeholder="Write a brief introduction to the course..."
              maxLength={500}
              className={textareaClass}
            />
          </Field>

          <Field label="Course overview">
            <textarea
              value={form.overview}
              onChange={(event) => updateForm("overview", event.target.value)}
              placeholder="Provide the complete course overview..."
              className="min-h-48 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </Field>

          <div className="grid gap-5 lg:grid-cols-2">
            <ArrayInput
              label="Curriculum"
              value={form.curriculum}
              onChange={(value) => updateForm("curriculum", value)}
              placeholder="Example: Machine Learning"
            />

            <ArrayInput
              label="Career opportunities"
              value={form.careerOpportunities}
              onChange={(value) => updateForm("careerOpportunities", value)}
              placeholder="Example: Data Scientist"
            />
          </div>

          <Field label="Scholarships">
            <textarea
              value={form.scholarships}
              onChange={(event) =>
                updateForm("scholarships", event.target.value)
              }
              placeholder="Describe available scholarship opportunities..."
              className={textareaClass}
            />
          </Field>

          <Field label="Special notes">
            <textarea
              value={form.specialNotes}
              onChange={(event) =>
                updateForm("specialNotes", event.target.value)
              }
              placeholder="Add special conditions or important information..."
              className={textareaClass}
            />
          </Field>

          <Field label="Brochure URL">
            <input
              type="url"
              value={form.brochureUrl}
              onChange={(event) =>
                updateForm("brochureUrl", event.target.value)
              }
              placeholder="https://university.example/course-brochure.pdf"
              className={inputClass}
            />
          </Field>
        </div>
      </FormSection>

      {/* SEO */}
      <FormSection
        id="seo"
        title="SEO and publishing"
        description="Configure search metadata, visibility and display priority."
      >
        <div className="grid gap-5">
          <Field
            label="SEO title"
            error={errors.seoTitle}
            hint={`${form.seoTitle.length}/70 characters`}
          >
            <input
              name="seoTitle"
              type="text"
              value={form.seoTitle}
              onChange={(event) => updateForm("seoTitle", event.target.value)}
              placeholder="Course name | University | European Dreams"
              maxLength={70}
              className={inputClass}
            />
          </Field>

          <Field
            label="Meta description"
            error={errors.metaDescription}
            hint={`${form.metaDescription.length}/180 characters`}
          >
            <textarea
              name="metaDescription"
              value={form.metaDescription}
              onChange={(event) =>
                updateForm("metaDescription", event.target.value)
              }
              placeholder="Write a search-friendly course description..."
              maxLength={180}
              className={textareaClass}
            />
          </Field>

          <ArrayInput
            label="SEO keywords"
            value={form.keywords}
            onChange={(value) => updateForm("keywords", value)}
            placeholder="Example: study artificial intelligence in Italy"
          />

          <Field
            label="Display order"
            error={errors.displayOrder}
            hint="Lower numbers are displayed first."
          >
            <input
              name="displayOrder"
              type="number"
              min="0"
              value={form.displayOrder}
              onChange={(event) =>
                updateForm("displayOrder", event.target.value)
              }
              className={inputClass}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Toggle
              label="Active course"
              description="The course will be visible on the public website."
              checked={form.isActive}
              onChange={(checked) => updateForm("isActive", checked)}
            />

            <Toggle
              label="Featured course"
              description="Show this course in featured website sections."
              checked={form.isFeatured}
              onChange={(checked) => updateForm("isFeatured", checked)}
            />
          </div>
        </div>
      </FormSection>

      {/* Bottom actions */}
      <section className="sticky bottom-4 z-20 flex flex-col-reverse justify-between gap-3 rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center">
        <Link
          href="/admin/courses"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-bold text-foreground transition hover:bg-card-hover"
        >
          Cancel
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 text-xs font-semibold text-muted md:flex">
            <CheckCircle2 size={16} className="text-success" />
            Required fields are marked with *
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
          >
            {submitting ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : form.isMedicineProgramme ? (
              <Stethoscope size={18} />
            ) : (
              <BookOpen size={18} />
            )}

            {submitting ? "Creating..." : "Create course"}
          </button>
        </div>
      </section>
    </form>
  );
}
