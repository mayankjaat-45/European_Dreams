"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  ExternalLink,
  GraduationCap,
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import API from "@/lib/api";

const STATUSES = [
  "new",
  "contacted",
  "follow_up",
  "qualified",
  "converted",
  "closed",
  "spam",
];

const PRIORITIES = ["low", "medium", "high"];

function formatLabel(value = "") {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value, includeTime = true) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(includeTime
      ? {
          hour: "numeric",
          minute: "2-digit",
        }
      : {}),
  }).format(date);
}

function toDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();

  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

function cleanPhone(value = "") {
  return value.replace(/[^\d+]/g, "");
}

function whatsappPhone(value = "") {
  return value.replace(/\D/g, "");
}

function Field({ label, value, children }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wider text-muted">
        {label}
      </dt>

      <dd className="mt-1 wrap-break-word text-sm font-semibold text-foreground">
        {children || value || "Not provided"}
      </dd>
    </div>
  );
}

function Panel({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>

        {description && (
          <p className="mt-1 text-sm text-muted">{description}</p>
        )}
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function EnquiryDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const enquiryId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [enquiry, setEnquiry] = useState(null);

  const [form, setForm] = useState({
    status: "new",
    priority: "medium",
    adminNotes: "",
    followUpDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const loadEnquiry = useCallback(async () => {
    if (!enquiryId) return;

    try {
      setLoading(true);
      setError("");

      const response = await API.get(`/api/enquiries/${enquiryId}`);

      const item = response.data?.data?.enquiry;

      if (!item) {
        throw new Error("Enquiry data was not returned.");
      }

      setEnquiry(item);

      setForm({
        status: item.status || "new",
        priority: item.priority || "medium",
        adminNotes: item.adminNotes || "",
        followUpDate: toDateTimeLocal(item.followUpDate),
      });
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        requestError.message ||
        "Unable to load enquiry.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [enquiryId]);

  useEffect(() => {
    loadEnquiry();
  }, [loadEnquiry]);

  const hasChanges = useMemo(() => {
    if (!enquiry) return false;

    return (
      form.status !== (enquiry.status || "new") ||
      form.priority !== (enquiry.priority || "medium") ||
      form.adminNotes !== (enquiry.adminNotes || "") ||
      form.followUpDate !== toDateTimeLocal(enquiry.followUpDate)
    );
  }, [enquiry, form]);

  function updateField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function saveChanges(event) {
    event.preventDefault();

    if (!hasChanges) return;

    try {
      setSaving(true);

      const response = await API.put(`/api/enquiries/${enquiryId}`, {
        status: form.status,
        priority: form.priority,
        adminNotes: form.adminNotes.trim(),
        followUpDate: form.followUpDate
          ? new Date(form.followUpDate).toISOString()
          : null,
      });

      const updated = response.data?.data?.enquiry;

      if (updated) {
        setEnquiry(updated);

        setForm({
          status: updated.status || "new",
          priority: updated.priority || "medium",
          adminNotes: updated.adminNotes || "",
          followUpDate: toDateTimeLocal(updated.followUpDate),
        });
      }

      toast.success(response.data?.message || "Enquiry updated successfully.");
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message || "Unable to update enquiry.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteEnquiry() {
    if (!enquiry) return;

    const confirmed = window.confirm(
      `Delete the enquiry from ${enquiry.name}?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const response = await API.delete(`/api/enquiries/${enquiryId}`);

      toast.success(response.data?.message || "Enquiry deleted successfully.");

      router.replace("/admin/enquiries");
      router.refresh();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Only a super admin can delete this enquiry.",
      );

      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center rounded-2xl border border-border bg-card">
        <div className="text-center">
          <LoaderCircle
            size={38}
            className="mx-auto animate-spin text-primary"
          />

          <p className="mt-3 text-sm font-semibold text-muted">
            Loading enquiry details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !enquiry) {
    return (
      <div className="grid min-h-[60vh] place-items-center rounded-2xl border border-danger/20 bg-card p-6 text-center">
        <div>
          <CircleAlert size={42} className="mx-auto text-danger" />

          <h1 className="mt-4 text-xl font-bold text-foreground">
            Unable to load enquiry
          </h1>

          <p className="mt-2 text-sm text-muted">{error}</p>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/admin/enquiries"
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-foreground"
            >
              Back to enquiries
            </Link>

            <button
              type="button"
              onClick={loadEnquiry}
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const attribution = enquiry.attribution || {};

  const hasAttribution = Object.values(attribution).some(Boolean);

  const phone = cleanPhone(enquiry.phone);
  const waPhone = whatsappPhone(enquiry.phone);

  return (
    <div className="space-y-6">
      {/* Page header */}

      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            <ArrowLeft size={16} />
            Back to enquiries
          </Link>

          <p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-secondary">
            {formatLabel(enquiry.enquiryType)} enquiry
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
            {enquiry.name}
          </h1>

          <p className="mt-2 flex items-center gap-2 text-sm text-muted">
            <Clock3 size={16} />
            Received {formatDate(enquiry.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={`mailto:${enquiry.email}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-bold text-foreground transition hover:bg-card-hover"
          >
            <Mail size={17} />
            Email
          </a>

          <a
            href={`tel:${phone}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-bold text-foreground transition hover:bg-card-hover"
          >
            <Phone size={17} />
            Call
          </a>

          {waPhone && (
            <a
              href={`https://wa.me/${waPhone}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-success px-4 text-sm font-bold text-white"
            >
              <MessageCircle size={17} />
              WhatsApp
            </a>
          )}

          <button
            type="button"
            onClick={loadEnquiry}
            className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-card text-foreground transition hover:bg-card-hover"
            aria-label="Refresh enquiry"
          >
            <RefreshCw size={17} />
          </button>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* Main details */}

        <div className="space-y-6">
          <Panel title="Student information">
            <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Full name" value={enquiry.name} />

              <Field label="Email">
                <a
                  href={`mailto:${enquiry.email}`}
                  className="text-primary hover:underline"
                >
                  {enquiry.email}
                </a>
              </Field>

              <Field label="Phone" value={enquiry.phone} />

              <Field
                label="Current qualification"
                value={enquiry.currentQualification}
              />

              <Field label="Preferred intake" value={enquiry.preferredIntake} />

              <Field label="Source" value={formatLabel(enquiry.source)} />
            </dl>
          </Panel>

          <Panel title="Study interest">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-background p-4">
                <MapPin size={20} className="text-secondary" />

                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted">
                  Country
                </p>

                <p className="mt-1 font-bold text-foreground">
                  {enquiry.countryInterested || "Not specified"}
                </p>
              </div>

              <div className="rounded-xl bg-background p-4">
                <GraduationCap size={20} className="text-primary" />

                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted">
                  University
                </p>

                <p className="mt-1 font-bold text-foreground">
                  {enquiry.universityInterested?.name || "Not specified"}
                </p>

                {enquiry.universityInterested?.city && (
                  <p className="mt-1 text-sm text-muted">
                    {enquiry.universityInterested.city}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-border p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted">
                Course
              </p>

              <p className="mt-1 font-bold text-foreground">
                {enquiry.courseInterested?.name || "Not specified"}
              </p>

              {enquiry.courseInterested && (
                <p className="mt-1 text-sm text-muted">
                  {[
                    enquiry.courseInterested.degreeLevel,
                    enquiry.courseInterested.duration,
                  ]
                    .filter(Boolean)
                    .join(" • ")}
                </p>
              )}
            </div>
          </Panel>

          <Panel title="Message">
            <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
              {enquiry.message || "No message was provided."}
            </p>

            {enquiry.subject && (
              <p className="mt-4 border-t border-border pt-4 text-sm text-muted">
                <strong className="text-foreground">Subject:</strong>{" "}
                {enquiry.subject}
              </p>
            )}
          </Panel>

          <Panel
            title="Campaign attribution"
            description="Google Ads and UTM data captured with this lead."
          >
            {hasAttribution ? (
              <dl className="grid gap-5 sm:grid-cols-2">
                <Field label="GCLID" value={attribution.gclid} />

                <Field label="GBRAID" value={attribution.gbraid} />

                <Field label="WBRAID" value={attribution.wbraid} />

                <Field label="UTM source" value={attribution.utmSource} />

                <Field label="UTM medium" value={attribution.utmMedium} />

                <Field label="UTM campaign" value={attribution.utmCampaign} />

                <Field label="UTM term" value={attribution.utmTerm} />

                <Field label="UTM content" value={attribution.utmContent} />

                <Field label="Landing page">
                  {attribution.landingPage ? (
                    <a
                      href={attribution.landingPage}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      Open page
                      <ExternalLink size={13} />
                    </a>
                  ) : null}
                </Field>

                <Field label="Referrer" value={attribution.referrer} />
              </dl>
            ) : (
              <p className="text-sm text-muted">
                No campaign attribution was captured.
              </p>
            )}
          </Panel>

          <Panel title="Consent and technical details">
            <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Contact consent">
                <span
                  className={`inline-flex items-center gap-2 ${
                    enquiry.consent?.contact ? "text-success" : "text-danger"
                  }`}
                >
                  {enquiry.consent?.contact && <CheckCircle2 size={16} />}

                  {enquiry.consent?.contact ? "Accepted" : "Not recorded"}
                </span>
              </Field>

              <Field
                label="Consent captured"
                value={formatDate(enquiry.consent?.capturedAt)}
              />

              <Field label="IP address" value={enquiry.ipAddress} />

              <Field
                label="Email notification"
                value={enquiry.emailNotificationSent ? "Sent" : "Not sent"}
              />

              <Field
                label="Confirmation email"
                value={enquiry.confirmationEmailSent ? "Sent" : "Not sent"}
              />

              <Field
                label="Last updated"
                value={formatDate(enquiry.updatedAt)}
              />
            </dl>

            {enquiry.userAgent && (
              <p className="mt-5 break-all border-t border-border pt-4 text-xs leading-5 text-muted">
                <strong>User agent:</strong> {enquiry.userAgent}
              </p>
            )}
          </Panel>
        </div>

        {/* Management sidebar */}

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <Panel
            title="Manage enquiry"
            description="Update follow-up information and save once."
          >
            <form onSubmit={saveChanges} className="space-y-4">
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
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {formatLabel(status)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-foreground">
                  Priority
                </span>

                <select
                  value={form.priority}
                  onChange={(event) =>
                    updateField("priority", event.target.value)
                  }
                  className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                >
                  {PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {formatLabel(priority)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-foreground">
                  Follow-up date
                </span>

                <input
                  type="datetime-local"
                  value={form.followUpDate}
                  onChange={(event) =>
                    updateField("followUpDate", event.target.value)
                  }
                  className="mt-2 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-foreground">
                  Admin notes
                </span>

                <textarea
                  rows={7}
                  maxLength={3000}
                  value={form.adminNotes}
                  onChange={(event) =>
                    updateField("adminNotes", event.target.value)
                  }
                  placeholder="Add call notes, document requirements or next steps..."
                  className="mt-2 w-full resize-y rounded-xl border border-border bg-background p-3 text-sm leading-6 text-foreground outline-none placeholder:text-muted focus:border-primary"
                />

                <span className="mt-1 block text-right text-xs text-muted">
                  {form.adminNotes.length}/3000
                </span>
              </label>

              <button
                type="submit"
                disabled={saving || !hasChanges}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}

                {saving ? "Saving..." : "Save changes"}
              </button>
            </form>
          </Panel>

          <Panel title="Assignment and activity">
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl bg-background p-4">
                <UserRound size={19} className="mt-0.5 shrink-0 text-primary" />

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">
                    Assigned to
                  </p>

                  <p className="mt-1 font-bold text-foreground">
                    {enquiry.assignedTo?.name || "Unassigned"}
                  </p>

                  {enquiry.assignedTo?.email && (
                    <p className="mt-1 text-xs text-muted">
                      {enquiry.assignedTo.email}
                    </p>
                  )}

                  {enquiry.assignedTo?.role && (
                    <p className="mt-1 text-xs font-semibold text-secondary">
                      {formatLabel(enquiry.assignedTo.role)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-background p-4">
                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-secondary"
                />

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">
                    Last updated by
                  </p>

                  <p className="mt-1 font-bold text-foreground">
                    {enquiry.updatedBy?.name || "Not available"}
                  </p>

                  {enquiry.updatedBy?.email && (
                    <p className="mt-1 text-xs text-muted">
                      {enquiry.updatedBy.email}
                    </p>
                  )}
                </div>
              </div>

              {enquiry.contactedAt && (
                <div className="flex items-center gap-3 text-sm text-muted">
                  <CalendarDays size={17} />
                  Contacted {formatDate(enquiry.contactedAt)}
                </div>
              )}

              <div className="flex items-center gap-3 text-sm text-muted">
                <Clock3 size={17} />
                Created {formatDate(enquiry.createdAt)}
              </div>
            </div>
          </Panel>

          <section className="rounded-2xl border border-danger/20 bg-card p-5">
            <h2 className="font-bold text-danger">Danger zone</h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              Only a super admin can permanently delete this enquiry.
            </p>

            <button
              type="button"
              onClick={deleteEnquiry}
              disabled={deleting}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-danger/30 px-4 text-sm font-bold text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Trash2 size={17} />
              )}

              {deleting ? "Deleting..." : "Delete enquiry"}
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}
