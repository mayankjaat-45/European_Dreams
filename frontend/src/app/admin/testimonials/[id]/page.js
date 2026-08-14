"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Award,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  LoaderCircle,
  MapPin,
  Pencil,
  Quote,
  ShieldCheck,
  Star,
  Trash2,
  UserRound,
  XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import API from "@/lib/api";

function getStoredUserRole() {
  if (typeof window === "undefined") return "";

  try {
    const storedUser = localStorage.getItem("admin_user");

    if (!storedUser) return "";

    return JSON.parse(storedUser)?.role || "";
  } catch {
    return "";
  }
}

function formatDate(date) {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsedDate);
}

function getPersonName(person) {
  if (!person) return "System";

  if (typeof person === "string") {
    return person;
  }

  return person.name || person.email || "System";
}

function getUniversityLocation(university) {
  if (!university) return "Location not available";

  const country =
    typeof university.country === "object"
      ? university.country?.name
      : university.country;

  return [university.city, university.region, country]
    .filter(Boolean)
    .join(", ");
}

function StatusBadge({
  active,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
        active ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
      }`}
    >
      {active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}

      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

function DetailItem({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Icon size={17} />
          </div>
        )}

        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">
            {label}
          </p>

          <p className="mt-1 wrap-break-word text-sm font-bold leading-6 text-foreground">
            {value || "Not specified"}
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailSection({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-start gap-4 border-b border-border pb-5">
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

      {children}
    </section>
  );
}

function LoadingState() {
  return (
    <div className="grid min-h-125 place-items-center rounded-2xl border border-border bg-card">
      <div className="text-center">
        <LoaderCircle size={36} className="mx-auto animate-spin text-primary" />

        <p className="mt-4 text-sm font-semibold text-muted">
          Loading testimonial...
        </p>
      </div>
    </div>
  );
}

export default function TestimonialDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const testimonialId = params?.id;

  const [testimonial, setTestimonial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [currentRole, setCurrentRole] = useState("");

  useEffect(() => {
    setCurrentRole(getStoredUserRole());
  }, []);

  const canManage = ["super_admin", "admin"].includes(currentRole);

  useEffect(() => {
    if (!testimonialId) return;

    let active = true;

    const loadTestimonial = async () => {
      try {
        setLoading(true);
        setApiError("");

        const response = await API.get(
          `/api/testimonials/admin/${testimonialId}`,
        );

        if (!active) return;

        setTestimonial(response.data?.data?.testimonial || null);
      } catch (requestError) {
        if (!active) return;

        const message =
          requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load testimonial.";

        setApiError(message);
        toast.error(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadTestimonial();

    return () => {
      active = false;
    };
  }, [testimonialId]);

  const handleStatusChange = async () => {
    if (!testimonial) return;

    try {
      setUpdatingStatus(true);

      const response = await API.patch(
        `/api/testimonials/${testimonial._id}/status`,
        {
          isActive: !testimonial.isActive,
        },
      );

      const updatedTestimonial = response.data?.data?.testimonial;

      setTestimonial((previous) => ({
        ...previous,
        ...(updatedTestimonial || {}),
        isActive: updatedTestimonial?.isActive ?? !previous.isActive,
      }));

      toast.success(
        response.data?.message ||
          `Testimonial ${
            testimonial.isActive ? "deactivated" : "activated"
          } successfully.`,
      );
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to update testimonial status.",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!testimonial) return;

    const shouldDelete = window.confirm(
      `Delete the testimonial from "${testimonial.studentName}" permanently?\n\nThis action cannot be undone.`,
    );

    if (!shouldDelete) return;

    try {
      setDeleting(true);

      const response = await API.delete(`/api/testimonials/${testimonial._id}`);

      toast.success(
        response.data?.message || "Testimonial deleted successfully.",
      );

      router.replace("/admin/testimonials");
      router.refresh();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to delete testimonial.",
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (apiError || !testimonial) {
    return (
      <div className="grid min-h-125 place-items-center rounded-2xl border border-danger/20 bg-card p-6">
        <div className="max-w-md text-center">
          <XCircle size={42} className="mx-auto text-danger" />

          <h1 className="mt-4 text-2xl font-bold text-foreground">
            Testimonial unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            {apiError || "The testimonial could not be found."}
          </p>

          <Link
            href="/admin/testimonials"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover"
          >
            <ArrowLeft size={17} />
            Back to testimonials
          </Link>
        </div>
      </div>
    );
  }

  const university = testimonial.university;
  const course = testimonial.course;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div>
          <Link
            href="/admin/testimonials"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted transition hover:text-primary"
          >
            <ArrowLeft size={17} />
            Back to testimonials
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <StatusBadge active={testimonial.isActive} />

            <StatusBadge
              active={testimonial.consentToPublish}
              activeLabel="Consent given"
              inactiveLabel="Consent missing"
            />

            {testimonial.isFeatured && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/15 px-3 py-1.5 text-xs font-bold text-secondary">
                <Star size={14} className="fill-secondary" />
                Featured
              </span>
            )}
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-4xl">
            {testimonial.studentName}
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted sm:text-base">
            Student testimonial and success information.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/testimonials/${testimonial._id}/edit`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary/30 px-5 text-sm font-bold text-primary transition hover:bg-primary/5"
          >
            <Pencil size={17} />
            Edit
          </Link>

          {canManage && (
            <>
              <button
                type="button"
                disabled={updatingStatus}
                onClick={handleStatusChange}
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  testimonial.isActive
                    ? "bg-danger/10 text-danger hover:bg-danger/15"
                    : "bg-success/10 text-success hover:bg-success/15"
                }`}
              >
                {updatingStatus ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : testimonial.isActive ? (
                  <XCircle size={17} />
                ) : (
                  <CheckCircle2 size={17} />
                )}

                {testimonial.isActive ? "Deactivate" : "Activate"}
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-danger/25 px-5 text-sm font-bold text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <Trash2 size={17} />
                )}

                {deleting ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          {/* Review */}
          <DetailSection
            icon={Quote}
            title="Testimonial review"
            description="The student’s complete experience."
          >
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={21}
                  className={
                    index < testimonial.rating
                      ? "fill-secondary text-secondary"
                      : "text-border"
                  }
                />
              ))}

              <span className="ml-2 text-sm font-bold text-foreground">
                {testimonial.rating}/5
              </span>
            </div>

            {testimonial.shortReview && (
              <div className="mt-5 rounded-xl border border-secondary/20 bg-secondary/10 p-4">
                <p className="text-sm font-bold leading-7 text-foreground">
                  “{testimonial.shortReview}”
                </p>
              </div>
            )}

            <div className="mt-5 whitespace-pre-line text-sm leading-7 text-foreground sm:text-base">
              {testimonial.review}
            </div>
          </DetailSection>

          {/* Student details */}
          <DetailSection
            icon={UserRound}
            title="Student information"
            description="Personal and admission-related information."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                label="Student name"
                value={testimonial.studentName}
                icon={UserRound}
              />

              <DetailItem
                label="Student city"
                value={testimonial.studentCity}
                icon={MapPin}
              />

              <DetailItem
                label="Qualification"
                value={testimonial.qualification}
                icon={GraduationCap}
              />

              <DetailItem
                label="Admission year"
                value={testimonial.admissionYear}
                icon={CalendarDays}
              />

              <DetailItem
                label="Intake"
                value={testimonial.intake}
                icon={CalendarDays}
              />

              <DetailItem
                label="Result"
                value={testimonial.result}
                icon={CheckCircle2}
              />
            </div>
          </DetailSection>

          {/* University and course */}
          <DetailSection
            icon={GraduationCap}
            title="University and course"
            description="Academic records connected with this testimonial."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-background p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">
                  University
                </p>

                <p className="mt-2 text-base font-bold text-foreground">
                  {university?.name || "Not selected"}
                </p>

                {university && (
                  <>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {getUniversityLocation(university)}
                    </p>

                    {university.regionGroup && (
                      <p className="mt-2 text-xs font-semibold text-primary">
                        {university.regionGroup}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="rounded-xl border border-border bg-background p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">
                  Course
                </p>

                <p className="mt-2 text-base font-bold text-foreground">
                  {course?.name || "Not selected"}
                </p>

                {course && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {course.degreeLevel && (
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                        {course.degreeLevel}
                      </span>
                    )}

                    {course.programmeType && (
                      <span className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-bold text-secondary">
                        {course.programmeType}
                      </span>
                    )}

                    {course.duration && (
                      <span className="rounded-full bg-card-hover px-3 py-1 text-xs font-bold text-muted">
                        {course.duration}
                      </span>
                    )}

                    {course.fieldOfStudy && (
                      <span className="rounded-full bg-card-hover px-3 py-1 text-xs font-bold text-muted">
                        {course.fieldOfStudy}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </DetailSection>

          {/* Visa and scholarship */}
          <div className="grid gap-6 lg:grid-cols-2">
            <DetailSection icon={ShieldCheck} title="Visa information">
              <div className="space-y-4">
                <StatusBadge
                  active={testimonial.visaApproved}
                  activeLabel="Visa approved"
                  inactiveLabel="Visa not approved"
                />

                <DetailItem
                  label="Visa jurisdiction"
                  value={testimonial.visaJurisdiction}
                  icon={MapPin}
                />
              </div>
            </DetailSection>

            <DetailSection icon={Award} title="Scholarship information">
              <div className="space-y-4">
                <StatusBadge
                  active={testimonial.scholarshipReceived}
                  activeLabel="Scholarship received"
                  inactiveLabel="No scholarship"
                />

                {testimonial.scholarshipReceived && (
                  <div className="rounded-xl border border-border bg-background p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted">
                      Scholarship details
                    </p>

                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-foreground">
                      {testimonial.scholarshipDetails || "Details not provided"}
                    </p>
                  </div>
                )}
              </div>
            </DetailSection>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">
              Publishing status
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-muted">Active</span>

                <StatusBadge
                  active={testimonial.isActive}
                  activeLabel="Yes"
                  inactiveLabel="No"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-muted">
                  Consent
                </span>

                <StatusBadge
                  active={testimonial.consentToPublish}
                  activeLabel="Given"
                  inactiveLabel="Missing"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-muted">
                  Featured
                </span>

                <StatusBadge
                  active={testimonial.isFeatured}
                  activeLabel="Yes"
                  inactiveLabel="No"
                />
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                <span className="text-sm font-semibold text-muted">
                  Display order
                </span>

                <span className="text-sm font-bold text-foreground">
                  {testimonial.displayOrder ?? 0}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-bold text-foreground">
              Record history
            </h2>

            <div className="mt-5 space-y-5">
              <div className="flex gap-3">
                <CalendarDays
                  size={18}
                  className="mt-0.5 shrink-0 text-primary"
                />

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">
                    Created
                  </p>

                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {formatDate(testimonial.createdAt)}
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    By {getPersonName(testimonial.createdBy)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 border-t border-border pt-5">
                <Clock3 size={18} className="mt-0.5 shrink-0 text-primary" />

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">
                    Last updated
                  </p>

                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {formatDate(testimonial.updatedAt)}
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    By {getPersonName(testimonial.updatedBy)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <Link
              href={`/admin/testimonials/${testimonial._id}/edit`}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover"
            >
              <Pencil size={17} />
              Edit testimonial
            </Link>

            <Link
              href="/admin/testimonials"
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border px-5 text-sm font-bold text-foreground transition hover:bg-card-hover"
            >
              <ArrowLeft size={17} />
              Back to list
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
