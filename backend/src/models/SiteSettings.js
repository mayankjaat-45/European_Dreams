import mongoose from "mongoose";

const socialLinksSchema = new mongoose.Schema(
  {
    facebook: {
      type: String,
      trim: true,
      default: "",
    },

    instagram: {
      type: String,
      trim: true,
      default: "",
    },

    youtube: {
      type: String,
      trim: true,
      default: "",
    },

    linkedin: {
      type: String,
      trim: true,
      default: "",
    },

    twitter: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: false,
  },
);

const seoSchema = new mongoose.Schema(
  {
    defaultTitle: {
      type: String,
      trim: true,
      maxlength: [70, "Default SEO title cannot exceed 70 characters"],
      default: "",
    },

    defaultDescription: {
      type: String,
      trim: true,
      maxlength: [180, "Default meta description cannot exceed 180 characters"],
      default: "",
    },

    defaultKeywords: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    ogImage: {
      type: String,
      trim: true,
      default: "",
    },

    canonicalUrl: {
      type: String,
      trim: true,
      default: "",
    },

    robotsIndex: {
      type: Boolean,
      default: true,
    },

    robotsFollow: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  },
);

const analyticsSchema = new mongoose.Schema(
  {
    googleAnalyticsId: {
      type: String,
      trim: true,
      default: "",
    },

    googleTagManagerId: {
      type: String,
      trim: true,
      default: "",
    },

    metaPixelId: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: false,
  },
);

const businessHoursSchema = new mongoose.Schema(
  {
    mondayToSaturday: {
      type: String,
      trim: true,
      default: "10:00 AM - 7:00 PM",
    },

    sunday: {
      type: String,
      trim: true,
      default: "Closed",
    },
  },
  {
    _id: false,
  },
);

const websiteStatsSchema = new mongoose.Schema(
  {
    partnerUniversities: {
      type: Number,
      min: 0,
      default: 200,
    },

    availableCourses: {
      type: Number,
      min: 0,
      default: 2000,
    },

    europeanCountries: {
      type: Number,
      min: 0,
      default: 28,
    },

    studentsGuided: {
      type: Number,
      min: 0,
      default: 5000,
    },

    showPlusSign: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  },
);

const siteSettingsSchema = new mongoose.Schema(
  {
    websiteName: {
      type: String,
      trim: true,
      default: "European Dreams",
    },

    tagline: {
      type: String,
      trim: true,
      default: "Your journey to study in Europe starts here.",
    },

    logo: {
      type: String,
      trim: true,
      default: "",
    },

    logoPublicId: {
      type: String,
      trim: true,
      default: "",
    },

    darkLogo: {
      type: String,
      trim: true,
      default: "",
    },

    darkLogoPublicId: {
      type: String,
      trim: true,
      default: "",
    },

    favicon: {
      type: String,
      trim: true,
      default: "",
    },

    faviconPublicId: {
      type: String,
      trim: true,
      default: "",
    },

    primaryEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },

    secondaryEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },

    primaryPhone: {
      type: String,
      trim: true,
      default: "",
    },

    secondaryPhone: {
      type: String,
      trim: true,
      default: "",
    },

    whatsappNumber: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    state: {
      type: String,
      trim: true,
      default: "",
    },

    country: {
      type: String,
      trim: true,
      default: "India",
    },

    postalCode: {
      type: String,
      trim: true,
      default: "",
    },

    googleMapUrl: {
      type: String,
      trim: true,
      default: "",
    },

    googleMapEmbedUrl: {
      type: String,
      trim: true,
      default: "",
    },

    footerDescription: {
      type: String,
      trim: true,
      maxlength: [1000, "Footer description cannot exceed 1000 characters"],
      default: "",
    },

    copyrightText: {
      type: String,
      trim: true,
      default: "",
    },

    socialLinks: {
      type: socialLinksSchema,
      default: () => ({}),
    },

    seo: {
      type: seoSchema,
      default: () => ({}),
    },

    analytics: {
      type: analyticsSchema,
      default: () => ({}),
    },

    businessHours: {
      type: businessHoursSchema,
      default: () => ({}),
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    maintenanceMessage: {
      type: String,
      trim: true,
      default:
        "Our website is currently under maintenance. Please check again shortly.",
    },

    enquiryNotificationEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },
    websiteStats: {
      type: websiteStatsSchema,
      default: () => ({
        partnerUniversities: 200,
        availableCourses: 2000,
        europeanCountries: 28,
        studentsGuided: 5000,
        showPlusSign: true,
      }),
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);

export default SiteSettings;
