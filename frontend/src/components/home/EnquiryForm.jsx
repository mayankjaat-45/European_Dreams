"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, CalendarDays } from "lucide-react";

import { createEnquiry } from "@/services/enquiries.service";
import { getCourses } from "@/services/courses.service";
import { getUniversities } from "@/services/universities.service";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  enquiryType: "",
  subject: "",
  universityInterested: "",
  courseInterested: "",
  currentQualification: "",
  preferredIntake: "",
  message: "",
  website: "",
  consent: false,
};

const initialAttribution = {
  gclid: "",
  gbraid: "",
  wbraid: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmTerm: "",
  utmContent: "",
  landingPage: "",
  referrer: "",
};

const attributionParams = {
  gclid: "gclid",
  gbraid: "gbraid",
  wbraid: "wbraid",
  utmSource: "utm_source",
  utmMedium: "utm_medium",
  utmCampaign: "utm_campaign",
  utmTerm: "utm_term",
  utmContent: "utm_content",
};

const enquiryTypes = [
  ["admission", "Admission guidance"],
  ["university", "University selection"],
  ["course", "Course selection"],
  ["scholarship", "Scholarship guidance"],
  ["visa", "Visa assistance"],
  ["general", "General enquiry"],
  ["partnership", "Partnership"],
  ["other", "Other"],
];

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "We could not submit your enquiry. Please try again."
  );
}

function getId(value) {
  if (!value) return "";
  if (typeof value === "object") return String(value._id || value.id || "");
  return String(value);
}

function decodeQueryValue(value) {
  try {
    return decodeURIComponent(value || "")
      .trim()
      .toLowerCase();
  } catch {
    return String(value || "")
      .trim()
      .toLowerCase();
  }
}

const TOPMATE_BOOKING_URL =
  "https://topmate.io/nitil_kumar_shrivastava/1242440";

export default function EnquiryForm({
  initialEnquiryType = "admission",
  initialUniversity = "",
  initialCourse = "",
  whatsappNumber = "",
}) {
  const validInitialType = enquiryTypes.some(
    ([value]) => value === initialEnquiryType,
  )
    ? initialEnquiryType
    : "admission";

  const [form, setForm] = useState({
    ...initialForm,
    enquiryType: validInitialType,
  });
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [attribution, setAttribution] = useState(initialAttribution);
  const initialSelectionApplied = useRef(false);
  const formStartTracked = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let stored = {};

    try {
      stored = JSON.parse(localStorage.getItem("ed_lead_attribution") || "{}");
    } catch {
      stored = {};
    }

    const captured = {
      ...initialAttribution,
      ...stored,
      landingPage: stored.landingPage || window.location.href,
      referrer: stored.referrer || document.referrer,
    };

    Object.entries(attributionParams).forEach(([key, queryKey]) => {
      const value = params.get(queryKey);
      if (value) captured[key] = value.slice(0, 500);
    });

    setAttribution(captured);

    try {
      localStorage.setItem("ed_lead_attribution", JSON.stringify(captured));
    } catch {
      // Attribution still works for this page when storage is unavailable.
    }
  }, []);

  useEffect(() => {
    initialSelectionApplied.current = false;
  }, [initialUniversity, initialCourse]);

  useEffect(() => {
    let active = true;

    async function loadOptions() {
      setOptionsLoading(true);

      const [universityResult, courseResult] = await Promise.allSettled([
        getUniversities({
          country: "Italy",
          limit: 200,
          sort: "name",
          order: "asc",
        }),
        getCourses({
          country: "Italy",
          limit: 1000,
          sort: "name",
          order: "asc",
        }),
      ]);

      if (!active) return;

      const loadedUniversities =
        universityResult.status === "fulfilled"
          ? universityResult.value.universities || []
          : [];

      const loadedCourses =
        courseResult.status === "fulfilled"
          ? courseResult.value.courses || []
          : [];

      setUniversities(loadedUniversities);
      setCourses(loadedCourses);

      setOptionsLoading(false);
    }

    loadOptions();

    return () => {
      active = false;
    };
  }, [initialUniversity, initialCourse]);

  /*
   * Apply URL selections only after both option lists have been committed to
   * state. This ensures the selected course <option> exists before the select
   * receives its value.
   */
  useEffect(() => {
    if (optionsLoading || initialSelectionApplied.current) return;

    const universityQuery = decodeQueryValue(initialUniversity);
    const courseQuery = decodeQueryValue(initialCourse);

    const matchedUniversity = universities.find(
      (university) =>
        getId(university) === String(initialUniversity || "") ||
        university.slug?.toLowerCase() === universityQuery ||
        university.name?.trim().toLowerCase() === universityQuery,
    );

    const matchedCourse = courses.find(
      (course) =>
        getId(course) === String(initialCourse || "") ||
        course.slug?.toLowerCase() === courseQuery ||
        course.name?.trim().toLowerCase() === courseQuery ||
        course.title?.trim().toLowerCase() === courseQuery,
    );

    const courseUniversityId = getId(
      matchedCourse?.university || matchedCourse?.universityId,
    );

    const selectedUniversityId = getId(matchedUniversity) || courseUniversityId;

    const courseBelongsToSelectedUniversity =
      matchedCourse &&
      (!selectedUniversityId ||
        !courseUniversityId ||
        courseUniversityId === selectedUniversityId);

    setForm((current) => ({
      ...current,
      universityInterested:
        selectedUniversityId || current.universityInterested,
      courseInterested: courseBelongsToSelectedUniversity
        ? getId(matchedCourse)
        : "",
    }));

    initialSelectionApplied.current = true;
  }, [courses, initialCourse, initialUniversity, optionsLoading, universities]);

  const visibleCourses = useMemo(() => {
    if (!form.universityInterested) return courses;

    return courses.filter((course) => {
      const universityId = getId(course.university || course.universityId);

      return universityId === String(form.universityInterested);
    });
  }, [courses, form.universityInterested]);

  const selectedUniversity = useMemo(() => {
    return universities.find(
      (university) => getId(university) === String(form.universityInterested),
    );
  }, [form.universityInterested, universities]);

  const selectedCourse = useMemo(() => {
    return courses.find(
      (course) => getId(course) === String(form.courseInterested),
    );
  }, [courses, form.courseInterested]);

  const selectedEnquiryTypeLabel =
    enquiryTypes.find(([value]) => value === form.enquiryType)?.[1] ||
    form.enquiryType;

  const whatsappBookingHref = useMemo(() => {
    const cleanNumber = whatsappNumber.replace(/\D/g, "");

    if (!cleanNumber) return "";

    const universityName = selectedUniversity?.name?.trim() || "Not selected";

    const courseName =
      selectedCourse?.name?.trim() ||
      selectedCourse?.title?.trim() ||
      "Not selected";

    const message = [
      "Hello European Dreams,",
      "",
      "I would like to book a free study consultation.",
      "",
      form.name.trim() ? `Name: ${form.name.trim()}` : "",
      form.phone.trim() ? `Phone: ${form.phone.trim()}` : "",
      form.email.trim() ? `Email: ${form.email.trim()}` : "",
      `Enquiry type: ${selectedEnquiryTypeLabel}`,
      `Preferred university: ${universityName}`,
      `Preferred course: ${courseName}`,
      form.currentQualification.trim()
        ? `Current qualification: ${form.currentQualification.trim()}`
        : "",
      form.preferredIntake ? `Preferred intake: ${form.preferredIntake}` : "",
      form.subject.trim() ? `Subject: ${form.subject.trim()}` : "",
      form.message.trim() ? `Message: ${form.message.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  }, [
    form.currentQualification,
    form.email,
    form.message,
    form.name,
    form.phone,
    form.preferredIntake,
    form.subject,
    selectedCourse,
    selectedEnquiryTypeLabel,
    selectedUniversity,
    whatsappNumber,
  ]);

  function updateField(event) {
    const { checked, name, type, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "universityInterested" ? { courseInterested: "" } : {}),
    }));
    setError("");
  }

  function trackFormStart() {
    if (formStartTracked.current) return;
    formStartTracked.current = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "lead_form_start",
      form_name: "study_in_italy_consultation",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Quietly reject bots that fill the hidden honeypot field.
    if (form.website) return;

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const response = await createEnquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        enquiryType: form.enquiryType,
        countryInterested: "Italy",
        universityInterested: form.universityInterested || null,
        courseInterested: form.courseInterested || null,
        currentQualification: form.currentQualification.trim(),
        preferredIntake: form.preferredIntake.trim(),
        message: form.message.trim(),
        source: "contact_page",
        pageUrl: window.location.href,
        attribution,
        consent: {
          contact: form.consent,
          capturedAt: new Date().toISOString(),
        },
      });

      setSuccess(true);
      setForm({ ...initialForm, enquiryType: validInitialType });

      const leadId =
        response?.enquiry?._id ||
        response?.data?.enquiry?._id ||
        response?.data?._id ||
        response?._id ||
        "";

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "generate_lead",
        form_name: "study_in_italy_consultation",
        enquiry_type: form.enquiryType,
        lead_id: leadId,
        traffic_source:
          attribution.utmSource || (attribution.gclid ? "google" : "direct"),
      });

      document.getElementById("enquiry-form-heading")?.focus();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  const fieldClass =
    "mt-2 min-h-12 w-full rounded-xl border border-border bg-background px-4 text-foreground outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60";
  const labelClass = "text-sm font-bold text-foreground";

  return (
    <form
      onSubmit={handleSubmit}
      onFocusCapture={trackFormStart}
      id="consultation-form"
      className="rounded-4xl border border-border bg-card p-5 shadow-xl shadow-primary/5 sm:p-8"
    >
      <div className="mb-7">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-secondary">
          Tell us about your plans
        </p>
        <h2
          id="enquiry-form-heading"
          tabIndex={-1}
          className="mt-2 font-display text-3xl font-bold text-foreground outline-none"
        >
          Book your free consultation
        </h2>
        <p className="mt-3 leading-7 text-muted">
          Share a few details and our counsellor will contact you to discuss
          your study options in Italy.
        </p>
      </div>

      {success && (
        <div
          role="status"
          className="mb-6 rounded-2xl border border-success/25 bg-success/10 p-4 text-sm font-medium text-success"
        >
          Thank you! Your enquiry has been submitted successfully. Our
          counsellor will contact you soon.
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-danger/25 bg-danger/10 p-4 text-sm font-medium text-danger"
        >
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="absolute left-[9999px]" aria-hidden="true">
          <label>
            Website
            <input
              name="website"
              value={form.website}
              onChange={updateField}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>
        <label className={labelClass}>
          Full name <span className="text-danger">*</span>
          <input
            name="name"
            value={form.name}
            onChange={updateField}
            required
            maxLength={100}
            autoComplete="name"
            placeholder="Your full name"
            className={fieldClass}
          />
        </label>

        <label className={labelClass}>
          Phone number <span className="text-danger">*</span>
          <input
            name="phone"
            value={form.phone}
            onChange={updateField}
            required
            maxLength={20}
            autoComplete="tel"
            inputMode="tel"
            placeholder="Your phone number"
            className={fieldClass}
          />
        </label>

        <label className={labelClass}>
          Email address <span className="text-danger">*</span>
          <input
            name="email"
            value={form.email}
            onChange={updateField}
            required
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={fieldClass}
          />
        </label>

        <label className={labelClass}>
          Enquiry type
          <select
            name="enquiryType"
            value={form.enquiryType}
            onChange={updateField}
            className={fieldClass}
          >
            {enquiryTypes.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className={`${labelClass} sm:col-span-2`}>
          Subject
          <input
            name="subject"
            value={form.subject}
            onChange={updateField}
            maxLength={200}
            placeholder="How can we help you?"
            className={fieldClass}
          />
        </label>

        <label className={labelClass}>
          Preferred university
          <select
            name="universityInterested"
            value={form.universityInterested}
            onChange={updateField}
            disabled={optionsLoading}
            className={fieldClass}
          >
            <option value="">
              {optionsLoading
                ? "Loading universities..."
                : "Select a university (optional)"}
            </option>
            {universities.map((university) => (
              <option key={getId(university)} value={getId(university)}>
                {university.name}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClass}>
          Preferred course
          <select
            name="courseInterested"
            value={form.courseInterested}
            onChange={updateField}
            disabled={optionsLoading}
            className={fieldClass}
          >
            <option value="">
              {optionsLoading
                ? "Loading courses..."
                : "Select a course (optional)"}
            </option>
            {visibleCourses.map((course) => (
              <option key={getId(course)} value={getId(course)}>
                {course.name || course.title}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClass}>
          Current qualification
          <input
            name="currentQualification"
            value={form.currentQualification}
            onChange={updateField}
            maxLength={200}
            placeholder="For example: B.Tech CSE"
            className={fieldClass}
          />
        </label>

        <label className={labelClass}>
          Preferred intake
          <select
            name="preferredIntake"
            value={form.preferredIntake}
            onChange={updateField}
            className={fieldClass}
          >
            <option value="">Select preferred intake</option>
            <option value="September 2026">September 2026</option>
            <option value="February 2027">February 2027</option>
            <option value="September 2027">September 2027</option>
            <option value="Not decided">Not decided yet</option>
          </select>
        </label>

        <label className={`${labelClass} sm:col-span-2`}>
          Message
          <textarea
            name="message"
            value={form.message}
            onChange={updateField}
            maxLength={2000}
            rows={5}
            placeholder="Tell us about your study goals, preferred programme or questions..."
            className={`${fieldClass} resize-y py-3`}
          />
          <span className="mt-1 block text-right text-xs font-normal text-muted">
            {form.message.length}/2000
          </span>
        </label>

        <label className="flex items-start gap-3 sm:col-span-2">
          <input
            type="checkbox"
            name="consent"
            checked={form.consent}
            onChange={updateField}
            required
            className="mt-1 h-4 w-4 shrink-0 accent-primary"
          />
          <span className="text-xs leading-5 text-muted">
            I agree that European Dreams may contact me by phone, email or
            WhatsApp about my study-abroad enquiry.{" "}
            <span className="text-danger">*</span>
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-7 inline-flex min-h-13 w-full items-center justify-center rounded-xl bg-primary px-7 py-3.5 font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {submitting ? "Submitting your enquiry..." : "Book Free Consultation"}
      </button>

      {whatsappBookingHref && (
        <>
          <div className="my-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />

            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Or
            </span>

            <span className="h-px flex-1 bg-border" />
          </div>

          <a
            href={whatsappBookingHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              window.dataLayer = window.dataLayer || [];

              window.dataLayer.push({
                event: "whatsapp_consultation_click",
                form_name: "study_in_italy_consultation",
                enquiry_type: form.enquiryType,
                university_id: form.universityInterested,
                university_name: selectedUniversity?.name || "",
                course_id: form.courseInterested,
                course_name:
                  selectedCourse?.name || selectedCourse?.title || "",
              });
            }}
            className="
        inline-flex
        min-h-13
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-green-600
        px-7
        py-3.5
        font-bold
        text-white
        shadow-lg
        shadow-green-600/20
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:bg-green-700
        hover:shadow-xl
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-green-500
        focus-visible:ring-offset-2
      "
          >
            <MessageCircle size={20} />
            Continue on WhatsApp
          </a>
        </>
      )}

      <a
        href={TOPMATE_BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          window.dataLayer = window.dataLayer || [];

          window.dataLayer.push({
            event: "topmate_consultation_click",
            form_name: "study_in_italy_consultation",
            enquiry_type: form.enquiryType,
            university_id: form.universityInterested,
            university_name: selectedUniversity?.name || "",
            course_id: form.courseInterested,
            course_name: selectedCourse?.name || selectedCourse?.title || "",
          });
        }}
        className="
    mt-3
    inline-flex
    min-h-13
    w-full
    items-center
    justify-center
    gap-2
    rounded-xl
    border
    border-primary/25
    bg-primary
    px-7
    py-3.5
    font-bold
    text-white
    shadow-lg
    shadow-primary/20
    transition-all
    duration-300
    hover:-translate-y-0.5
    hover:bg-primary-hover
    hover:shadow-xl
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-primary
    focus-visible:ring-offset-2
  "
      >
        <CalendarDays size={20} />
        Schedule a Call on Topmate
      </a>

      <p className="mt-4 text-center text-xs leading-5 text-muted">
        By submitting this form, you agree to be contacted about your enquiry.
      </p>
    </form>
  );
}
