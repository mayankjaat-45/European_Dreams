"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BarChart3,
  Building2,
  CircleAlert,
  Clock3,
  Contact,
  Globe2,
  ImageIcon,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Save,
  Settings2,
  Share2,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";

import API from "@/lib/api";

const INITIAL_FORM = {
  websiteName: "",
  tagline: "",

  logo: "",
  logoPublicId: "",
  darkLogo: "",
  darkLogoPublicId: "",
  favicon: "",
  faviconPublicId: "",

  primaryEmail: "",
  secondaryEmail: "",
  primaryPhone: "",
  secondaryPhone: "",
  whatsappNumber: "",
  enquiryNotificationEmail: "",

  address: "",
  city: "",
  state: "",
  country: "India",
  postalCode: "",
  googleMapUrl: "",
  googleMapEmbedUrl: "",

  footerDescription: "",
  copyrightText: "",

  socialLinks: {
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    twitter: "",
  },

  analytics: {
    googleAnalyticsId: "",
    googleTagManagerId: "",
    metaPixelId: "",
  },

  businessHours: {
    mondayToSaturday: "10:00 AM - 7:00 PM",
    sunday: "Closed",
  },

  websiteStats: {
    partnerUniversities: 200,
    availableCourses: 2000,
    europeanCountries: 28,
    studentsGuided: 5000,
    showPlusSign: true,
  },

  maintenanceMode: false,
  maintenanceMessage:
    "Our website is currently under maintenance. Please check again shortly.",
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

          {description && (
            <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
          )}
        </div>
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  error = "",
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-foreground">{label}</span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`mt-2 min-h-11 w-full rounded-xl border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary ${
          error ? "border-danger" : "border-border"
        }`}
      />

      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-danger">
          <CircleAlert size={13} />
          {error}
        </p>
      )}
    </label>
  );
}

function Toggle({ checked, onChange, title, description }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border bg-background p-4">
      <span>
        <span className="block text-sm font-bold text-foreground">{title}</span>

        {description && (
          <span className="mt-1 block text-xs leading-5 text-muted">
            {description}
          </span>
        )}
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

function ImageUploader({
  label,
  imageUrl,
  publicId,
  onUploaded,
  onRemove,
  compact = false,
}) {
  const inputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function uploadFile(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");

      return;
    }

    const maxSize = 8 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Image size cannot exceed 8 MB.");

      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("type", "general");

      const response = await API.post("/api/uploads/single", formData);

      const uploadedFile = response.data?.data?.file;

      if (!uploadedFile?.url) {
        throw new Error("Uploaded image URL was not returned.");
      }

      onUploaded({
        url: uploadedFile.url,
        publicId: uploadedFile.publicId || "",
      });

      toast.success(`${label} uploaded successfully.`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          `Unable to upload ${label.toLowerCase()}.`,
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function handleDrop(event) {
    event.preventDefault();

    setDragging(false);

    uploadFile(event.dataTransfer.files?.[0]);
  }

  return (
    <div>
      <p className="text-sm font-bold text-foreground">{label}</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
        className="hidden"
        onChange={(event) => uploadFile(event.target.files?.[0])}
      />

      {imageUrl ? (
        <div
          className={`relative mt-2 overflow-hidden rounded-xl border border-border bg-background ${
            compact ? "h-32" : "aspect-16/7"
          }`}
        >
          <img
            src={imageUrl}
            alt={`${label} preview`}
            className="absolute inset-0 h-full w-full object-contain p-4"
          />

          <div className="absolute right-3 top-3 flex gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-bold text-white shadow-sm disabled:opacity-50"
            >
              {uploading ? (
                <LoaderCircle size={14} className="animate-spin" />
              ) : (
                <UploadCloud size={14} />
              )}
              Replace
            </button>

            <button
              type="button"
              onClick={() =>
                onRemove({
                  publicId,
                })
              }
              className="grid h-9 w-9 place-items-center rounded-lg bg-danger text-white shadow-sm"
              aria-label={`Remove ${label}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          onDragEnter={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`mt-2 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 text-center transition ${
            compact ? "min-h-32" : "min-h-44"
          } ${
            dragging
              ? "border-primary bg-primary/5"
              : "border-border bg-background"
          }`}
        >
          {uploading ? (
            <LoaderCircle size={32} className="animate-spin text-primary" />
          ) : (
            <ImageIcon size={32} className="text-muted/60" />
          )}

          <span className="mt-3 text-sm font-bold text-foreground">
            {uploading ? "Uploading..." : `Upload ${label}`}
          </span>

          <span className="mt-1 text-xs text-muted">
            Click or drag an image here
          </span>
        </button>
      )}
    </div>
  );
}

function isValidUrl(value) {
  if (!value.trim()) return true;

  try {
    const url = new URL(value.trim());

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [loadError, setLoadError] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");

      const response = await API.get("/api/settings/admin");

      const settings = response.data?.data?.settings || response.data?.data;

      if (!settings) {
        throw new Error("Settings data was not returned.");
      }

      setForm({
        websiteName: settings.websiteName || "",
        tagline: settings.tagline || "",

        logo: settings.logo || "",
        logoPublicId: settings.logoPublicId || "",

        darkLogo: settings.darkLogo || "",
        darkLogoPublicId: settings.darkLogoPublicId || "",

        favicon: settings.favicon || "",
        faviconPublicId: settings.faviconPublicId || "",

        primaryEmail: settings.primaryEmail || "",
        secondaryEmail: settings.secondaryEmail || "",
        primaryPhone: settings.primaryPhone || "",
        secondaryPhone: settings.secondaryPhone || "",
        whatsappNumber: settings.whatsappNumber || "",
        enquiryNotificationEmail: settings.enquiryNotificationEmail || "",

        address: settings.address || "",
        city: settings.city || "",
        state: settings.state || "",
        country: settings.country || "India",
        postalCode: settings.postalCode || "",
        googleMapUrl: settings.googleMapUrl || "",
        googleMapEmbedUrl: settings.googleMapEmbedUrl || "",

        footerDescription: settings.footerDescription || "",
        copyrightText: settings.copyrightText || "",

        socialLinks: {
          facebook: settings.socialLinks?.facebook || "",
          instagram: settings.socialLinks?.instagram || "",
          youtube: settings.socialLinks?.youtube || "",
          linkedin: settings.socialLinks?.linkedin || "",
          twitter: settings.socialLinks?.twitter || "",
        },

        analytics: {
          googleAnalyticsId: settings.analytics?.googleAnalyticsId || "",

          googleTagManagerId: settings.analytics?.googleTagManagerId || "",

          metaPixelId: settings.analytics?.metaPixelId || "",
        },

        businessHours: {
          mondayToSaturday:
            settings.businessHours?.mondayToSaturday || "10:00 AM - 7:00 PM",

          sunday: settings.businessHours?.sunday || "Closed",
        },

        websiteStats: {
          partnerUniversities:
            settings.websiteStats?.partnerUniversities ?? 200,

          availableCourses: settings.websiteStats?.availableCourses ?? 2000,

          europeanCountries: settings.websiteStats?.europeanCountries ?? 28,

          studentsGuided: settings.websiteStats?.studentsGuided ?? 5000,

          showPlusSign: settings.websiteStats?.showPlusSign ?? true,
        },

        maintenanceMode: Boolean(settings.maintenanceMode),

        maintenanceMessage:
          settings.maintenanceMessage || INITIAL_FORM.maintenanceMessage,
      });

      setUpdatedAt(settings.updatedAt || "");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to load website settings.";

      setLoadError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

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

  function updateGroup(group, name, value) {
    setForm((current) => ({
      ...current,

      [group]: {
        ...current[group],
        [name]: value,
      },
    }));
  }

  function validateForm() {
    const nextErrors = {};

    if (!form.websiteName.trim()) {
      nextErrors.websiteName = "Website name is required.";
    }

    const emails = [
      ["primaryEmail", form.primaryEmail],
      ["secondaryEmail", form.secondaryEmail],
      ["enquiryNotificationEmail", form.enquiryNotificationEmail],
    ];

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    emails.forEach(([name, value]) => {
      if (value.trim() && !emailPattern.test(value.trim())) {
        nextErrors[name] = "Enter a valid email address.";
      }
    });

    const urls = [
      ["googleMapUrl", form.googleMapUrl],
      ["googleMapEmbedUrl", form.googleMapEmbedUrl],
    ];

    urls.forEach(([name, value]) => {
      if (!isValidUrl(value)) {
        nextErrors[name] = "URL must start with http:// or https://.";
      }
    });

    if (form.footerDescription.length > 1000) {
      nextErrors.footerDescription =
        "Footer description cannot exceed 1000 characters.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function removeImage(urlField, publicIdField) {
    /*
     * This clears the image from settings.
     * It does not immediately delete the old Cloudinary file, preventing
     * accidental permanent deletion before Save Settings is clicked.
     */
    setForm((current) => ({
      ...current,
      [urlField]: "",
      [publicIdField]: "",
    }));
  }

  async function saveSettings(event) {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the highlighted fields.");

      return;
    }

    try {
      setSaving(true);

      const response = await API.put("/api/settings", {
        websiteName: form.websiteName.trim(),
        tagline: form.tagline.trim(),

        logo: form.logo,
        logoPublicId: form.logoPublicId,

        darkLogo: form.darkLogo,
        darkLogoPublicId: form.darkLogoPublicId,

        favicon: form.favicon,
        faviconPublicId: form.faviconPublicId,

        primaryEmail: form.primaryEmail.trim(),
        secondaryEmail: form.secondaryEmail.trim(),

        primaryPhone: form.primaryPhone.trim(),
        secondaryPhone: form.secondaryPhone.trim(),

        whatsappNumber: form.whatsappNumber.trim(),

        enquiryNotificationEmail: form.enquiryNotificationEmail.trim(),

        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
        postalCode: form.postalCode.trim(),

        googleMapUrl: form.googleMapUrl.trim(),
        googleMapEmbedUrl: form.googleMapEmbedUrl.trim(),

        footerDescription: form.footerDescription.trim(),
        copyrightText: form.copyrightText.trim(),

        socialLinks: form.socialLinks,
        analytics: form.analytics,
        businessHours: form.businessHours,

        websiteStats: {
          partnerUniversities: Math.max(
            Number(form.websiteStats.partnerUniversities) || 0,
            0,
          ),

          availableCourses: Math.max(
            Number(form.websiteStats.availableCourses) || 0,
            0,
          ),

          europeanCountries: Math.max(
            Number(form.websiteStats.europeanCountries) || 0,
            0,
          ),

          studentsGuided: Math.max(
            Number(form.websiteStats.studentsGuided) || 0,
            0,
          ),

          showPlusSign: form.websiteStats.showPlusSign,
        },

        maintenanceMode: form.maintenanceMode,
        maintenanceMessage: form.maintenanceMessage.trim(),
      });

      const settings = response.data?.data?.settings || response.data?.data;

      if (settings?.updatedAt) {
        setUpdatedAt(settings.updatedAt);
      }

      toast.success(
        response.data?.message || "Website settings saved successfully.",
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to save website settings.",
      );
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
            Loading website settings...
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
            Unable to load settings
          </h1>

          <p className="mt-2 text-sm text-muted">{loadError}</p>

          <button
            type="button"
            onClick={loadSettings}
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white hover:bg-primary-hover"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={saveSettings} className="space-y-6">
      {/* Header */}

      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-secondary">
            Website configuration
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Website Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Manage branding, contact information, website statistics, analytics
            and maintenance settings.
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

          {saving ? "Saving..." : "Save Settings"}
        </button>
      </header>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Website identity */}

        <FormSection
          icon={Building2}
          title="Website identity"
          description="Manage the website name and public tagline."
        >
          <div className="grid gap-5">
            <TextField
              label="Website name"
              value={form.websiteName}
              onChange={(value) => updateField("websiteName", value)}
              placeholder="European Dreams"
              error={errors.websiteName}
            />

            <TextField
              label="Tagline"
              value={form.tagline}
              onChange={(value) => updateField("tagline", value)}
              placeholder="Your journey to study in Europe starts here."
            />
          </div>
        </FormSection>

        {/* Contact */}

        <FormSection
          icon={Contact}
          title="Contact information"
          description="Contact details displayed across the website."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Primary email"
              type="email"
              value={form.primaryEmail}
              onChange={(value) => updateField("primaryEmail", value)}
              error={errors.primaryEmail}
            />

            <TextField
              label="Secondary email"
              type="email"
              value={form.secondaryEmail}
              onChange={(value) => updateField("secondaryEmail", value)}
              error={errors.secondaryEmail}
            />

            <TextField
              label="Primary phone"
              value={form.primaryPhone}
              onChange={(value) => updateField("primaryPhone", value)}
            />

            <TextField
              label="Secondary phone"
              value={form.secondaryPhone}
              onChange={(value) => updateField("secondaryPhone", value)}
            />

            <TextField
              label="WhatsApp number"
              value={form.whatsappNumber}
              onChange={(value) => updateField("whatsappNumber", value)}
              placeholder="919876543210"
            />

            <TextField
              label="Enquiry notification email"
              type="email"
              value={form.enquiryNotificationEmail}
              onChange={(value) =>
                updateField("enquiryNotificationEmail", value)
              }
              error={errors.enquiryNotificationEmail}
            />
          </div>
        </FormSection>
      </div>

      {/* Branding images */}

      <FormSection
        icon={ImageIcon}
        title="Branding images"
        description="Upload the main logo, dark-mode logo and browser favicon."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <ImageUploader
            label="Main logo"
            imageUrl={form.logo}
            publicId={form.logoPublicId}
            onUploaded={(file) => {
              updateField("logo", file.url);
              updateField("logoPublicId", file.publicId);
            }}
            onRemove={() => removeImage("logo", "logoPublicId")}
          />

          <ImageUploader
            label="Dark logo"
            imageUrl={form.darkLogo}
            publicId={form.darkLogoPublicId}
            onUploaded={(file) => {
              updateField("darkLogo", file.url);
              updateField("darkLogoPublicId", file.publicId);
            }}
            onRemove={() => removeImage("darkLogo", "darkLogoPublicId")}
          />

          <ImageUploader
            label="Favicon"
            compact
            imageUrl={form.favicon}
            publicId={form.faviconPublicId}
            onUploaded={(file) => {
              updateField("favicon", file.url);
              updateField("faviconPublicId", file.publicId);
            }}
            onRemove={() => removeImage("favicon", "faviconPublicId")}
          />
        </div>
      </FormSection>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Address */}

        <FormSection
          icon={MapPin}
          title="Office address"
          description="Business location and Google Maps information."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-sm font-bold text-foreground">Address</span>

              <textarea
                rows={3}
                value={form.address}
                onChange={(event) => updateField("address", event.target.value)}
                className="mt-2 w-full resize-y rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </label>

            <TextField
              label="City"
              value={form.city}
              onChange={(value) => updateField("city", value)}
            />

            <TextField
              label="State"
              value={form.state}
              onChange={(value) => updateField("state", value)}
            />

            <TextField
              label="Country"
              value={form.country}
              onChange={(value) => updateField("country", value)}
            />

            <TextField
              label="Postal code"
              value={form.postalCode}
              onChange={(value) => updateField("postalCode", value)}
            />

            <div className="sm:col-span-2">
              <TextField
                label="Google Maps URL"
                value={form.googleMapUrl}
                onChange={(value) => updateField("googleMapUrl", value)}
                error={errors.googleMapUrl}
              />
            </div>

            <div className="sm:col-span-2">
              <TextField
                label="Google Maps embed URL"
                value={form.googleMapEmbedUrl}
                onChange={(value) => updateField("googleMapEmbedUrl", value)}
                error={errors.googleMapEmbedUrl}
              />
            </div>
          </div>
        </FormSection>

        {/* Social links */}

        <FormSection
          icon={Share2}
          title="Social links"
          description="Add complete profile URLs, including https://."
        >
          <div className="grid gap-5">
            {[
              ["facebook", "Facebook"],
              ["instagram", "Instagram"],
              ["youtube", "YouTube"],
              ["linkedin", "LinkedIn"],
              ["twitter", "X / Twitter"],
            ].map(([name, label]) => (
              <TextField
                key={name}
                label={label}
                value={form.socialLinks[name]}
                onChange={(value) => updateGroup("socialLinks", name, value)}
                placeholder={`https://${name}.com/...`}
              />
            ))}
          </div>
        </FormSection>
      </div>

      {/* Statistics */}

      <FormSection
        icon={BarChart3}
        title="Website statistics"
        description="Statistics displayed in the homepage achievements section."
      >
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["partnerUniversities", "Partner universities"],
            ["availableCourses", "Available courses"],
            ["europeanCountries", "European countries"],
            ["studentsGuided", "Students guided"],
          ].map(([name, label]) => (
            <TextField
              key={name}
              label={label}
              type="number"
              value={form.websiteStats[name]}
              onChange={(value) => updateGroup("websiteStats", name, value)}
            />
          ))}
        </div>

        <div className="mt-5">
          <Toggle
            checked={form.websiteStats.showPlusSign}
            onChange={(value) =>
              updateGroup("websiteStats", "showPlusSign", value)
            }
            title="Display plus sign"
            description="Show values as 200+, 2000+ and 5000+."
          />
        </div>
      </FormSection>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Business hours */}

        <FormSection
          icon={Clock3}
          title="Business hours"
          description="Office availability displayed to website visitors."
        >
          <div className="grid gap-5">
            <TextField
              label="Monday to Saturday"
              value={form.businessHours.mondayToSaturday}
              onChange={(value) =>
                updateGroup("businessHours", "mondayToSaturday", value)
              }
            />

            <TextField
              label="Sunday"
              value={form.businessHours.sunday}
              onChange={(value) =>
                updateGroup("businessHours", "sunday", value)
              }
            />
          </div>
        </FormSection>

        {/* Analytics */}

        <FormSection
          icon={Globe2}
          title="Analytics"
          description="Tracking IDs used by your website integration."
        >
          <div className="grid gap-5">
            <TextField
              label="Google Analytics ID"
              value={form.analytics.googleAnalyticsId}
              onChange={(value) =>
                updateGroup("analytics", "googleAnalyticsId", value)
              }
              placeholder="G-XXXXXXXXXX"
            />

            <TextField
              label="Google Tag Manager ID"
              value={form.analytics.googleTagManagerId}
              onChange={(value) =>
                updateGroup("analytics", "googleTagManagerId", value)
              }
              placeholder="GTM-XXXXXXX"
            />

            <TextField
              label="Meta Pixel ID"
              value={form.analytics.metaPixelId}
              onChange={(value) =>
                updateGroup("analytics", "metaPixelId", value)
              }
            />
          </div>
        </FormSection>
      </div>

      {/* Footer */}

      <FormSection
        icon={Settings2}
        title="Footer content"
        description="Manage the website footer description and copyright."
      >
        <div className="space-y-5">
          <label className="block">
            <span className="text-sm font-bold text-foreground">
              Footer description
            </span>

            <textarea
              rows={5}
              maxLength={1000}
              value={form.footerDescription}
              onChange={(event) =>
                updateField("footerDescription", event.target.value)
              }
              className={`mt-2 w-full resize-y rounded-xl border bg-background p-4 text-sm leading-6 text-foreground outline-none focus:border-primary ${
                errors.footerDescription ? "border-danger" : "border-border"
              }`}
            />

            <div className="mt-1.5 flex justify-between">
              {errors.footerDescription && (
                <p className="text-xs font-semibold text-danger">
                  {errors.footerDescription}
                </p>
              )}

              <span className="ml-auto text-xs text-muted">
                {form.footerDescription.length}/1000
              </span>
            </div>
          </label>

          <TextField
            label="Copyright text"
            value={form.copyrightText}
            onChange={(value) => updateField("copyrightText", value)}
            placeholder="© 2026 European Dreams. All rights reserved."
          />
        </div>
      </FormSection>

      {/* Maintenance */}

      <FormSection
        icon={Settings2}
        title="Maintenance mode"
        description="Temporarily restrict public access while updating the website."
      >
        <Toggle
          checked={form.maintenanceMode}
          onChange={(value) => updateField("maintenanceMode", value)}
          title="Enable maintenance mode"
          description="Search engine indexing is also disabled while maintenance mode is active."
        />

        {form.maintenanceMode && (
          <label className="mt-5 block">
            <span className="text-sm font-bold text-foreground">
              Maintenance message
            </span>

            <textarea
              rows={4}
              value={form.maintenanceMessage}
              onChange={(event) =>
                updateField("maintenanceMessage", event.target.value)
              }
              className="mt-2 w-full resize-y rounded-xl border border-border bg-background p-4 text-sm leading-6 text-foreground outline-none focus:border-primary"
            />
          </label>
        )}
      </FormSection>

      {/* Bottom save button */}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}

          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
