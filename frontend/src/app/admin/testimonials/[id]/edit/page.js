"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  GraduationCap,
  LoaderCircle,
  Save,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import API from "@/lib/api";

const initialForm = {
  studentName: "",
  university: "",
  course: "",
  qualification: "",
  intake: "",
  review: "",
  shortReview: "",
  rating: 5,
  result: "",
  admissionYear: "",
  studentCity: "",
  visaApproved: false,
  visaJurisdiction: "Not specified",
  scholarshipReceived: false,
  scholarshipDetails: "",
  consentToPublish: false,
  isFeatured: false,
  isActive: true,
  displayOrder: 0,
};

const visaJurisdictions = [
  "Not specified",
  "New Delhi",
  "Mumbai",
  "Bengaluru",
  "Kolkata",
];

const inputClass =
  "min-h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10";

const textareaClass =
  "min-h-32 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-4 focus:ring-primary/10";

async function fetchAllPages(url, params = {}) {
  const firstResponse = await API.get(url, {
    params: {
      ...params,
      page: 1,
      limit: 100,
    },
  });

  const firstData = firstResponse.data?.data || {};
  const resourceKey = url.includes("universities") ? "universities" : "courses";

  let items = firstData[resourceKey] || [];
  const totalPages = Number(firstData.pagination?.totalPages) || 1;

  if (totalPages > 1) {
    const requests = [];

    for (let page = 2; page <= totalPages; page += 1) {
      requests.push(
        API.get(url, {
          params: {
            ...params,
            page,
            limit: 100,
          },
        }),
      );
    }

    const responses = await Promise.all(requests);

    responses.forEach((response) => {
      items = [...items, ...(response.data?.data?.[resourceKey] || [])];
    });
  }

  return items;
}

function Field({ label, required, hint, error, children }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3 text-sm font-bold text-foreground">
        <span>
          {label}

          {required && <span className="ml-1 text-danger">*</span>}
        </span>

        {hint && <span className="text-xs font-medium text-muted">{hint}</span>}
      </span>

      {children}

      {error && (
        <span className="mt-1.5 block text-xs font-semibold text-danger">
          {error}
        </span>
      )}
    </label>
  );
}

function FormSection({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-start gap-4 border-b border-border pb-5">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon size={21} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>

          <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
        </div>
      </div>

      {children}
    </section>
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
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-5 w-5 shrink-0 accent-primary"
      />
    </label>
  );
}

function RatingInput({ value, onChange }) {
  return (
    <div className="flex min-h-11 items-center gap-2 rounded-xl border border-border bg-background px-4">
      {Array.from({ length: 5 }).map((_, index) => {
        const rating = index + 1;
        const selected = rating <= value;

        return (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className="transition hover:scale-110"
            aria-label={`Set rating to ${rating}`}
          >
            <Star
              size={23}
              className={
                selected ? "fill-secondary text-secondary" : "text-border"
              }
            />
          </button>
        );
      })}

      <span className="ml-2 text-sm font-bold text-foreground">{value}/5</span>
    </div>
  );
}

export default function EditTestimonialPage() {
  const params = useParams();
  const router = useRouter();

  const testimonialId = params?.id;

  const [form, setForm] = useState(initialForm);
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loadingRelations, setLoadingRelations] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingTestimonial, setLoadingTestimonial] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!testimonialId) return;

    let active = true;

    const loadTestimonial = async () => {
      try {
        setLoadingTestimonial(true);

        const response = await API.get(
          `/api/testimonials/admin/${testimonialId}`,
        );

        if (!active) return;

        const testimonial = response.data?.data?.testimonial;

        if (!testimonial) {
          throw new Error("Testimonial not found.");
        }

        const universityId =
          typeof testimonial.university === "object"
            ? testimonial.university?._id
            : testimonial.university;

        const courseId =
          typeof testimonial.course === "object"
            ? testimonial.course?._id
            : testimonial.course;

        setForm({
          studentName: testimonial.studentName || "",
          university: universityId || "",
          course: courseId || "",
          qualification: testimonial.qualification || "",
          intake: testimonial.intake || "",
          review: testimonial.review || "",
          shortReview: testimonial.shortReview || "",
          rating: Number(testimonial.rating) || 5,
          result: testimonial.result || "",
          admissionYear: testimonial.admissionYear || "",
          studentCity: testimonial.studentCity || "",
          visaApproved: Boolean(testimonial.visaApproved),
          visaJurisdiction: testimonial.visaJurisdiction || "New Delhi",
          scholarshipReceived: Boolean(testimonial.scholarshipReceived),
          scholarshipDetails: testimonial.scholarshipDetails || "",
          consentToPublish: Boolean(testimonial.consentToPublish),
          isFeatured: Boolean(testimonial.isFeatured),
          isActive: Boolean(testimonial.isActive),
          displayOrder:
            testimonial.displayOrder !== undefined
              ? String(testimonial.displayOrder)
              : "0",
        });
      } catch (requestError) {
        const message =
          requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load testimonial.";

        toast.error(message);
        router.replace("/admin/testimonials");
      } finally {
        if (active) {
          setLoadingTestimonial(false);
        }
      }
    };

    loadTestimonial();

    return () => {
      active = false;
    };
  }, [router, testimonialId]);
  useEffect(() => {
    let active = true;

    const loadUniversities = async () => {
      try {
        setLoadingRelations(true);

        const records = await fetchAllPages("/api/universities", {
          status: "active",
        });

        if (!active) return;

        setUniversities(
          [...records].sort((first, second) =>
            first.name.localeCompare(second.name),
          ),
        );
      } catch (requestError) {
        if (!active) return;

        toast.error(
          requestError.response?.data?.message ||
            requestError.message ||
            "Unable to load universities.",
        );
      } finally {
        if (active) {
          setLoadingRelations(false);
        }
      }
    };

    loadUniversities();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadCourses = async () => {
      if (!form.university) {
        setCourses([]);
        return;
      }

      try {
        setLoadingCourses(true);

        /*
         * The university parameter is sent to the API when supported.
         * Client-side filtering below also guarantees correct results.
         */
        const records = await fetchAllPages("/api/courses", {
          university: form.university,
          status: "active",
        });

        if (!active) return;

        const relatedCourses = records.filter((course) => {
          const universityId =
            typeof course.university === "object"
              ? course.university?._id
              : course.university;

          return universityId === form.university;
        });

        setCourses(
          relatedCourses.sort((first, second) =>
            first.name.localeCompare(second.name),
          ),
        );
      } catch (requestError) {
        if (!active) return;

        setCourses([]);

        toast.error(
          requestError.response?.data?.message ||
            requestError.message ||
            "Unable to load university courses.",
        );
      } finally {
        if (active) {
          setLoadingCourses(false);
        }
      }
    };

    loadCourses();

    return () => {
      active = false;
    };
  }, [form.university]);

  const selectedUniversity = useMemo(
    () => universities.find((university) => university._id === form.university),
    [form.university, universities],
  );

  const updateForm = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleUniversityChange = (value) => {
    setForm((previous) => ({
      ...previous,
      university: value,
      course: "",
    }));

    setErrors((previous) => ({
      ...previous,
      university: "",
      course: "",
    }));
  };

  const handleConsentChange = (checked) => {
    setForm((previous) => ({
      ...previous,
      consentToPublish: checked,
      isFeatured: checked ? previous.isFeatured : false,
    }));
  };

  const handleScholarshipChange = (checked) => {
    setForm((previous) => ({
      ...previous,
      scholarshipReceived: checked,
      scholarshipDetails: checked ? previous.scholarshipDetails : "",
    }));

    setErrors((previous) => ({
      ...previous,
      scholarshipDetails: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.studentName.trim()) {
      nextErrors.studentName = "Student name is required.";
    }

    if (!form.review.trim()) {
      nextErrors.review = "Testimonial review is required.";
    }

    if (form.review.trim().length > 3000) {
      nextErrors.review = "Review cannot exceed 3000 characters.";
    }

    if (form.shortReview.trim().length > 500) {
      nextErrors.shortReview = "Short review cannot exceed 500 characters.";
    }

    if (form.scholarshipReceived && !form.scholarshipDetails.trim()) {
      nextErrors.scholarshipDetails =
        "Add scholarship details when scholarship is received.";
    }

    if (Number(form.displayOrder) < 0) {
      nextErrors.displayOrder = "Display order cannot be negative.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the highlighted fields.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        studentName: form.studentName.trim(),
        university: form.university || null,
        course: form.course || null,
        qualification: form.qualification.trim(),
        intake: form.intake.trim(),
        review: form.review.trim(),
        shortReview: form.shortReview.trim(),
        rating: Number(form.rating),
        result: form.result.trim(),
        admissionYear: form.admissionYear.trim(),
        studentCity: form.studentCity.trim(),
        visaApproved: form.visaApproved,
        visaJurisdiction: form.visaJurisdiction,
        scholarshipReceived: form.scholarshipReceived,
        scholarshipDetails: form.scholarshipReceived
          ? form.scholarshipDetails.trim()
          : "",
        consentToPublish: form.consentToPublish,
        isFeatured: form.consentToPublish && form.isFeatured,
        isActive: form.isActive,
        displayOrder: Math.max(Number(form.displayOrder) || 0, 0),
      };

      const response = await API.post("/api/testimonials", payload);

      const updatedTestimonial = response.data?.data?.testimonial;

      toast.success(
        response.data?.message || "Testimonial updated successfully.",
      );

      router.push(
        `/admin/testimonials/${updatedTestimonial?._id || testimonialId}`,
      );

      router.refresh();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to update testimonial.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingTestimonial) {
    return (
      <div className="grid min-h-125 place-items-center rounded-2xl border border-border bg-card">
        <div className="text-center">
          <LoaderCircle
            size={36}
            className="mx-auto animate-spin text-primary"
          />

          <p className="mt-4 text-sm font-semibold text-muted">
            Loading testimonial...
          </p>
        </div>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <Link
            href={`/admin/testimonials/${testimonialId}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-muted transition hover:text-primary"
          >
            <ArrowLeft size={17} />
            Back to testimonial
          </Link>

          <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-primary">
            Student success
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-4xl">
            Edit testimonial
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
            Update the student review, academic information and publishing
            permissions.
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

          {submitting ? "Updating..." : "Update testimonial"}
        </button>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {/* Student information */}
          <FormSection
            icon={UserRound}
            title="Student information"
            description="Add the student’s personal and academic details."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Student name" required error={errors.studentName}>
                <input
                  type="text"
                  value={form.studentName}
                  onChange={(event) =>
                    updateForm("studentName", event.target.value)
                  }
                  placeholder="Enter student name"
                  maxLength={150}
                  className={inputClass}
                />
              </Field>

              <Field label="Student city">
                <input
                  type="text"
                  value={form.studentCity}
                  onChange={(event) =>
                    updateForm("studentCity", event.target.value)
                  }
                  placeholder="Example: Moradabad"
                  className={inputClass}
                />
              </Field>

              <Field label="Qualification">
                <input
                  type="text"
                  value={form.qualification}
                  onChange={(event) =>
                    updateForm("qualification", event.target.value)
                  }
                  placeholder="Example: B.Tech Computer Science"
                  maxLength={200}
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
                  placeholder="Example: 2026"
                  className={inputClass}
                />
              </Field>

              <Field label="Intake">
                <input
                  type="text"
                  value={form.intake}
                  onChange={(event) => updateForm("intake", event.target.value)}
                  placeholder="Example: September 2026"
                  maxLength={100}
                  className={inputClass}
                />
              </Field>

              <Field label="Result">
                <input
                  type="text"
                  value={form.result}
                  onChange={(event) => updateForm("result", event.target.value)}
                  placeholder="Example: Admitted successfully"
                  maxLength={500}
                  className={inputClass}
                />
              </Field>
            </div>
          </FormSection>

          {/* University and course */}
          <FormSection
            icon={GraduationCap}
            title="University and course"
            description="Connect this testimonial with an existing university and course."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="University" error={errors.university}>
                <select
                  value={form.university}
                  disabled={loadingRelations}
                  onChange={(event) =>
                    handleUniversityChange(event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">
                    {loadingRelations
                      ? "Loading universities..."
                      : "Select university"}
                  </option>

                  {universities.map((university) => (
                    <option key={university._id} value={university._id}>
                      {university.name}
                      {university.city ? ` — ${university.city}` : ""}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Course"
                hint={
                  form.university
                    ? `${courses.length} available`
                    : "Select university first"
                }
                error={errors.course}
              >
                <select
                  value={form.course}
                  disabled={!form.university || loadingCourses}
                  onChange={(event) => updateForm("course", event.target.value)}
                  className={inputClass}
                >
                  <option value="">
                    {loadingCourses
                      ? "Loading courses..."
                      : !form.university
                        ? "Select university first"
                        : courses.length === 0
                          ? "No courses available"
                          : "Select course"}
                  </option>

                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {selectedUniversity && (
              <div className="mt-5 rounded-xl border border-primary/15 bg-primary/5 p-4">
                <p className="text-sm font-bold text-foreground">
                  {selectedUniversity.name}
                </p>

                <p className="mt-1 text-xs leading-5 text-muted">
                  {[
                    selectedUniversity.city,
                    selectedUniversity.country?.name ||
                      selectedUniversity.country,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Location not specified"}
                </p>
              </div>
            )}
          </FormSection>

          {/* Testimonial */}
          <FormSection
            icon={Star}
            title="Testimonial review"
            description="Add the complete student review and its rating."
          >
            <div className="space-y-5">
              <Field label="Rating" required>
                <RatingInput
                  value={form.rating}
                  onChange={(value) => updateForm("rating", value)}
                />
              </Field>

              <Field
                label="Full review"
                required
                hint={`${form.review.length}/3000`}
                error={errors.review}
              >
                <textarea
                  value={form.review}
                  onChange={(event) => updateForm("review", event.target.value)}
                  placeholder="Write the student's complete experience..."
                  maxLength={3000}
                  rows={8}
                  className={textareaClass}
                />
              </Field>

              <Field
                label="Short review"
                hint={`${form.shortReview.length}/500 · optional`}
                error={errors.shortReview}
              >
                <textarea
                  value={form.shortReview}
                  onChange={(event) =>
                    updateForm("shortReview", event.target.value)
                  }
                  placeholder="Leave empty to generate it automatically from the full review."
                  maxLength={500}
                  rows={4}
                  className={textareaClass}
                />
              </Field>
            </div>
          </FormSection>

          {/* Visa */}
          <FormSection
            icon={ShieldCheck}
            title="Visa information"
            description="Record the student’s visa result and jurisdiction."
          >
            <div className="space-y-5">
              <Toggle
                label="Visa approved"
                description="Enable this when the student’s visa has been approved."
                checked={form.visaApproved}
                onChange={(checked) => updateForm("visaApproved", checked)}
              />

              <Field label="Visa jurisdiction">
                <select
                  value={form.visaJurisdiction}
                  onChange={(event) =>
                    updateForm("visaJurisdiction", event.target.value)
                  }
                  className={inputClass}
                >
                  {visaJurisdictions.map((jurisdiction) => (
                    <option key={jurisdiction} value={jurisdiction}>
                      {jurisdiction}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </FormSection>

          {/* Scholarship */}
          <FormSection
            icon={Award}
            title="Scholarship information"
            description="Add scholarship status and supporting details."
          >
            <div className="space-y-5">
              <Toggle
                label="Scholarship received"
                description="Enable this if the student received a scholarship."
                checked={form.scholarshipReceived}
                onChange={handleScholarshipChange}
              />

              {form.scholarshipReceived && (
                <Field
                  label="Scholarship details"
                  required
                  hint={`${form.scholarshipDetails.length}/1000`}
                  error={errors.scholarshipDetails}
                >
                  <textarea
                    value={form.scholarshipDetails}
                    onChange={(event) =>
                      updateForm("scholarshipDetails", event.target.value)
                    }
                    placeholder="Enter scholarship name, amount and other relevant details..."
                    maxLength={1000}
                    rows={5}
                    className={textareaClass}
                  />
                </Field>
              )}
            </div>
          </FormSection>
        </div>

        {/* Right sidebar */}
        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">
              Publishing controls
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted">
              Control whether this testimonial can appear on the public website.
            </p>

            <div className="mt-5 space-y-3">
              <Toggle
                label="Publishing consent"
                description="Required before this testimonial can be featured publicly."
                checked={form.consentToPublish}
                onChange={handleConsentChange}
              />

              <Toggle
                label="Featured testimonial"
                description={
                  form.consentToPublish
                    ? "Show this testimonial in featured website sections."
                    : "Publishing consent is required before featuring."
                }
                checked={form.isFeatured}
                disabled={!form.consentToPublish}
                onChange={(checked) => updateForm("isFeatured", checked)}
              />

              <Toggle
                label="Active"
                description="Allow this testimonial to appear in eligible public listings."
                checked={form.isActive}
                onChange={(checked) => updateForm("isActive", checked)}
              />
            </div>

            {!form.consentToPublish && (
              <div className="mt-4 rounded-xl border border-secondary/20 bg-secondary/10 p-4">
                <p className="text-xs font-semibold leading-5 text-secondary">
                  Without publishing consent, the testimonial will remain hidden
                  from the public website and cannot be featured.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">
              Display settings
            </h2>

            <div className="mt-5">
              <Field
                label="Display order"
                hint="Lower numbers appear first"
                error={errors.displayOrder}
              >
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.displayOrder}
                  onChange={(event) =>
                    updateForm("displayOrder", event.target.value)
                  }
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">
              Record summary
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted">Student</span>
                <span className="max-w-45 truncate font-bold text-foreground">
                  {form.studentName || "Not entered"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-muted">University</span>
                <span className="max-w-45 truncate text-right font-bold text-foreground">
                  {selectedUniversity?.name || "Not selected"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-muted">Rating</span>
                <span className="font-bold text-foreground">
                  {form.rating}/5
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-muted">Consent</span>
                <span
                  className={`font-bold ${
                    form.consentToPublish ? "text-success" : "text-danger"
                  }`}
                >
                  {form.consentToPublish ? "Given" : "Missing"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-muted">Status</span>
                <span
                  className={`font-bold ${
                    form.isActive ? "text-success" : "text-danger"
                  }`}
                >
                  {form.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}

              {submitting ? "Updating testimonial..." : "Update testimonial"}
            </button>

            <Link
              href="/admin/testimonials"
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-border px-5 text-sm font-bold text-foreground transition hover:bg-card-hover"
            >
              Cancel
            </Link>
          </section>
        </aside>
      </div>

      <div className="flex flex-col-reverse gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={`/admin/testimonials/${testimonialId}`}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-bold text-foreground transition hover:bg-card-hover"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <CheckCircle2 size={18} />
          )}

          {submitting ? "Updating..." : "Update testimonial"}
        </button>
      </div>
    </form>
  );
}
