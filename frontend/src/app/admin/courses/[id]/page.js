"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  GraduationCap,
  Languages,
  LoaderCircle,
  MapPin,
  Pencil,
  RefreshCw,
  Search,
  Stethoscope,
  Trash2,
  University,
  WalletCards,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import API from "@/lib/api";

const formatValue = (value) => {
  if (!value) return "Not specified";

  return String(value)
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const formatDate = (date) => {
  if (!date) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
};

const getStoredRole = () => {
  if (typeof window === "undefined") return "";

  const storageKeys = ["admin_user", "user", "crm_user"];

  for (const key of storageKeys) {
    try {
      const storedValue = localStorage.getItem(key);

      if (!storedValue) continue;

      const parsedValue = JSON.parse(storedValue);

      if (parsedValue?.role) {
        return parsedValue.role;
      }

      if (parsedValue?.user?.role) {
        return parsedValue.user.role;
      }
    } catch {
      // Continue checking other storage keys.
    }
  }

  return "";
};

function Section({ title, description, icon: Icon, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-start gap-3 border-b border-border px-5 py-5 sm:px-6">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon size={21} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>

          {description && (
            <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function Detail({ label, value, fullWidth = false }) {
  return (
    <div
      className={`rounded-xl border border-border bg-background p-4 ${
        fullWidth ? "sm:col-span-2" : ""
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>

      <p className="mt-2 whitespace-pre-line wrap-break-word text-sm font-semibold leading-6 text-foreground">
        {value || "Not specified"}
      </p>
    </div>
  );
}

function StatusBadge({ active, activeText, inactiveText }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
        active ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
      }`}
    >
      {active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}

      {active ? activeText : inactiveText}
    </span>
  );
}

function ItemList({ items, emptyText = "No information added." }) {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-background px-4 py-8 text-center text-sm text-muted">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className="flex items-start gap-3 rounded-xl border border-border bg-background p-4"
        >
          <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-success" />

          <span className="text-sm font-medium leading-6 text-foreground">
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}

function LoadingPage() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-4 w-32 rounded bg-card-hover" />
        <div className="mt-5 h-10 w-2/3 rounded bg-card-hover" />
        <div className="mt-3 h-5 w-1/3 rounded bg-card-hover" />
      </div>

      <div className="grid animate-pulse gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-2xl border border-border bg-card p-5"
          >
            <div className="h-4 w-20 rounded bg-card-hover" />
            <div className="mt-4 h-6 w-28 rounded bg-card-hover" />
          </div>
        ))}
      </div>

      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-64 animate-pulse rounded-2xl border border-border bg-card"
        />
      ))}
    </div>
  );
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();

  const courseId = params.id;

  const [course, setCourse] = useState(null);
  const [currentRole, setCurrentRole] = useState("");

  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const canEdit = ["super_admin", "admin"].includes(currentRole);
  const canDelete = ["super_admin", "admin"].includes(currentRole);

  const loadCourse = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(`/api/courses/admin/${courseId}`);

      setCourse(response.data?.data?.course || null);
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        requestError.message ||
        "Unable to load course.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentRole(getStoredRole());
  }, []);

  useEffect(() => {
    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const handleStatusUpdate = async () => {
    if (!course || !canEdit) return;

    const nextStatus = !course.isActive;

    try {
      setUpdatingStatus(true);

      const response = await API.patch(`/api/courses/${course._id}/status`, {
        isActive: nextStatus,
      });

      const updatedCourse = response.data?.data?.course;

      setCourse((previous) => ({
        ...previous,
        ...(updatedCourse || {}),
      }));

      toast.success(
        response.data?.message ||
          `Course ${nextStatus ? "activated" : "deactivated"} successfully.`,
      );
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        requestError.message ||
        "Unable to update course status.";

      toast.error(message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!course || !canDelete) return;

    const shouldDelete = window.confirm(
      `Delete "${course.name}" permanently?\n\nThis action cannot be undone.`,
    );

    if (!shouldDelete) return;

    try {
      setDeleting(true);

      const response = await API.delete(`/api/courses/${course._id}`);

      toast.success(response.data?.message || "Course deleted successfully.");

      router.push("/admin/courses");
      router.refresh();
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        requestError.message ||
        "Unable to delete course.";

      toast.error(message);
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error || !course) {
    return (
      <section className="rounded-2xl border border-danger/20 bg-card px-6 py-16 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-danger/10 text-danger">
          <XCircle size={30} />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-foreground">
          Course could not be loaded
        </h1>

        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
          {error || "The requested course does not exist."}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/admin/courses"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-5 text-sm font-bold text-foreground"
          >
            <ArrowLeft size={17} />
            Back to courses
          </Link>

          <button
            type="button"
            onClick={loadCourse}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white"
          >
            <RefreshCw size={17} />
            Try again
          </button>
        </div>
      </section>
    );
  }

  const university = course.university || {};
  const requirements = course.admissionRequirements || {};

  const admissionRequirementItems = [
    ["Academic requirement", requirements.academics],
    ["IELTS", requirements.ielts],
    ["TOEFL", requirements.toefl],
    ["PTE", requirements.pte],
    ["Duolingo", requirements.duolingo],
    ["CEnT-S", requirements.centS],
    ["SAT", requirements.sat],
    ["IMAT", requirements.imat],
    ["Other requirement", requirements.other],
    ["Additional notes", requirements.notes],
  ].filter(([, value]) => value);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
        <div className="min-w-0">
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted transition hover:text-primary"
          >
            <ArrowLeft size={17} />
            Back to courses
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <StatusBadge
              active={course.isActive}
              activeText="Active"
              inactiveText="Inactive"
            />

            {course.isFeatured && (
              <span className="rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-bold text-secondary">
                Featured
              </span>
            )}

            {course.isEnglishTaught && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                <Languages size={14} />
                English taught
              </span>
            )}

            {course.isMedicineProgramme && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-600">
                <Stethoscope size={14} />
                Medicine
              </span>
            )}

            {course.requiresIMAT && (
              <span className="rounded-full bg-violet-500/10 px-3 py-1.5 text-xs font-bold text-violet-600">
                IMAT required
              </span>
            )}
          </div>

          <h1 className="mt-4 wrap-break-word font-display text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-4xl">
            {course.name}
          </h1>

          <p className="mt-3 flex items-start gap-2 text-sm font-semibold text-muted sm:text-base">
            <University size={18} className="mt-0.5 shrink-0 text-primary" />

            <span>
              {university.name || "University not available"}

              {university.city ? `, ${university.city}` : ""}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {canEdit && (
            <button
              type="button"
              onClick={handleStatusUpdate}
              disabled={updatingStatus}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                course.isActive
                  ? "bg-danger/10 text-danger hover:bg-danger/15"
                  : "bg-success/10 text-success hover:bg-success/15"
              }`}
            >
              {updatingStatus ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : course.isActive ? (
                <XCircle size={17} />
              ) : (
                <CheckCircle2 size={17} />
              )}

              {updatingStatus
                ? "Updating..."
                : course.isActive
                  ? "Deactivate"
                  : "Activate"}
            </button>
          )}

          {canEdit && (
            <Link
              href={`/admin/courses/${course._id}/edit`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover"
            >
              <Pencil size={17} />
              Edit course
            </Link>
          )}

          {canDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-danger/20 bg-danger/5 px-4 text-sm font-bold text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Trash2 size={17} />
              )}

              {deleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Degree level",
            value: formatValue(course.degreeLevel),
            icon: GraduationCap,
          },
          {
            label: "Programme type",
            value: formatValue(course.programmeType),
            icon: BookOpen,
          },
          {
            label: "Duration",
            value: course.duration || "Not specified",
            icon: Clock3,
          },
          {
            label: "Admission year",
            value: course.admissionYear || "Not specified",
            icon: CalendarDays,
          },
        ].map(({ label, value, icon: Icon }) => (
          <article
            key={label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {label}
                </p>

                <p className="mt-3 text-base font-bold text-foreground">
                  {value}
                </p>
              </div>

              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon size={19} />
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Course information */}
      <Section
        title="Course information"
        description="Primary academic and university information."
        icon={GraduationCap}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Detail label="University" value={university.name} />

          <Detail
            label="University location"
            value={[university.city, university.region, university.country]
              .filter(Boolean)
              .join(", ")}
          />

          <Detail label="Degree type" value={course.degreeType} />

          <Detail label="Field of study" value={course.fieldOfStudy} />

          <Detail label="Study mode" value={formatValue(course.studyMode)} />

          <Detail label="Language" value={course.language} />

          <Detail label="Campus" value={course.campus} />

          <Detail
            label="Display order"
            value={String(course.displayOrder ?? 0)}
          />

          <Detail
            label="Short description"
            value={course.shortDescription}
            fullWidth
          />

          <Detail label="Course overview" value={course.overview} fullWidth />
        </div>
      </Section>

      {/* Fees and admission */}
      <Section
        title="Fees and admission"
        description="Fee, intake, deadline and eligibility information."
        icon={WalletCards}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Detail label="Tuition fee" value={course.tuitionFee} />

          <Detail label="Application fee" value={course.applicationFee} />

          <Detail
            label="Application deadline"
            value={course.applicationDeadline}
          />

          <Detail
            label="Intakes"
            value={
              Array.isArray(course.intakes) && course.intakes.length
                ? course.intakes.join(", ")
                : ""
            }
          />

          <Detail
            label="General eligibility"
            value={course.eligibility}
            fullWidth
          />

          <Detail label="Scholarships" value={course.scholarships} fullWidth />

          <Detail label="Special notes" value={course.specialNotes} fullWidth />
        </div>
      </Section>

      {/* Admission requirements */}
      <Section
        title="Admission requirements"
        description="Academic, language and entrance examination requirements."
        icon={Search}
      >
        {admissionRequirementItems.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {admissionRequirementItems.map(([label, value]) => (
              <Detail
                key={label}
                label={label}
                value={value}
                fullWidth={label === "Additional notes"}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-background px-4 py-8 text-center text-sm text-muted">
            No course-specific admission requirements added.
          </div>
        )}

        <div className="mt-6">
          <h3 className="mb-3 text-sm font-bold text-foreground">
            Academic requirements
          </h3>

          <ItemList
            items={course.academicRequirements}
            emptyText="No academic requirements added."
          />
        </div>
      </Section>

      {/* Documents */}
      <Section
        title="Documents required"
        description="Documents applicants must provide."
        icon={FileText}
      >
        <ItemList
          items={course.documentsRequired}
          emptyText="No required documents added."
        />
      </Section>

      {/* Curriculum */}
      <Section
        title="Curriculum"
        description="Subjects and course content."
        icon={BookOpen}
      >
        <ItemList
          items={course.curriculum}
          emptyText="No curriculum information added."
        />
      </Section>

      {/* Career */}
      <Section
        title="Career opportunities"
        description="Possible roles and career paths after graduation."
        icon={BriefcaseBusiness}
      >
        <ItemList
          items={course.careerOpportunities}
          emptyText="No career opportunities added."
        />
      </Section>

      {/* Medicine */}
      {(course.isMedicineProgramme || course.requiresIMAT) && (
        <Section
          title="Medicine programme"
          description="Medicine and IMAT-related configuration."
          icon={Stethoscope}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Detail
              label="Medicine programme"
              value={course.isMedicineProgramme ? "Yes" : "No"}
            />

            <Detail
              label="Requires IMAT"
              value={course.requiresIMAT ? "Yes" : "No"}
            />

            <Detail
              label="IMAT requirement"
              value={requirements.imat}
              fullWidth
            />
          </div>
        </Section>
      )}

      {/* SEO */}
      <Section
        title="SEO and publishing"
        description="Search metadata and public visibility settings."
        icon={ExternalLink}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Detail label="Slug" value={course.slug} />

          <Detail
            label="Public status"
            value={course.isActive ? "Active" : "Inactive"}
          />

          <Detail label="Featured" value={course.isFeatured ? "Yes" : "No"} />

          <Detail
            label="English taught"
            value={course.isEnglishTaught ? "Yes" : "No"}
          />

          <Detail label="SEO title" value={course.seoTitle} fullWidth />

          <Detail
            label="Meta description"
            value={course.metaDescription}
            fullWidth
          />

          <Detail
            label="Keywords"
            value={
              Array.isArray(course.keywords) && course.keywords.length
                ? course.keywords.join(", ")
                : ""
            }
            fullWidth
          />

          <Detail label="Brochure URL" value={course.brochureUrl} fullWidth />
        </div>

        {course.brochureUrl && (
          <a
            href={course.brochureUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white"
          >
            <ExternalLink size={17} />
            Open brochure
          </a>
        )}
      </Section>

      {/* Audit information */}
      <Section
        title="Record information"
        description="Creation and most recent update details."
        icon={Clock3}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Detail
            label="Created by"
            value={
              course.createdBy
                ? `${course.createdBy.name || "User"}${
                    course.createdBy.email ? ` (${course.createdBy.email})` : ""
                  }`
                : "Not recorded"
            }
          />

          <Detail
            label="Last updated by"
            value={
              course.updatedBy
                ? `${course.updatedBy.name || "User"}${
                    course.updatedBy.email ? ` (${course.updatedBy.email})` : ""
                  }`
                : "Not recorded"
            }
          />

          <Detail label="Created on" value={formatDate(course.createdAt)} />

          <Detail label="Last updated" value={formatDate(course.updatedAt)} />
        </div>
      </Section>

      {/* Bottom actions */}
      <section className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/admin/courses"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border px-5 text-sm font-bold text-foreground transition hover:bg-card-hover"
        >
          <ArrowLeft size={17} />
          Back to courses
        </Link>

        {canEdit && (
          <Link
            href={`/admin/courses/${course._id}/edit`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white transition hover:bg-primary-hover"
          >
            <Pencil size={17} />
            Edit course
          </Link>
        )}
      </section>
    </div>
  );
}
