import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },

    subject: {
      type: String,
      trim: true,
      maxlength: [200, "Subject cannot exceed 200 characters"],
      default: "",
    },

    enquiryType: {
      type: String,
      enum: [
        "general",
        "admission",
        "university",
        "course",
        "visa",
        "scholarship",
        "partnership",
        "other",
      ],
      default: "admission",
      index: true,
    },

    countryInterested: {
      type: String,
      trim: true,
      default: "Italy",
    },

    universityInterested: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      default: null,
    },

    courseInterested: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },

    currentQualification: {
      type: String,
      trim: true,
      maxlength: [200, "Current qualification cannot exceed 200 characters"],
      default: "",
    },

    preferredIntake: {
      type: String,
      trim: true,
      maxlength: [100, "Preferred intake cannot exceed 100 characters"],
      default: "",
    },

    message: {
      type: String,
      trim: true,
      maxlength: [2000, "Message cannot exceed 2000 characters"],
      default: "",
    },

    source: {
      type: String,
      enum: [
        "website",
        "university_page",
        "course_page",
        "blog",
        "contact_page",
        "other",
      ],
      default: "website",
      index: true,
    },

    pageUrl: {
      type: String,
      trim: true,
      maxlength: [1000, "Page URL cannot exceed 1000 characters"],
      default: "",
    },

    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "follow_up",
        "qualified",
        "converted",
        "closed",
        "spam",
      ],
      default: "new",
      index: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    adminNotes: {
      type: String,
      trim: true,
      maxlength: [3000, "Admin notes cannot exceed 3000 characters"],
      default: "",
    },

    followUpDate: {
      type: Date,
      default: null,
      index: true,
    },

    contactedAt: {
      type: Date,
      default: null,
    },

    emailNotificationSent: {
      type: Boolean,
      default: false,
    },

    confirmationEmailSent: {
      type: Boolean,
      default: false,
    },

    // Google Ads and campaign attribution
    attribution: {
      gclid: {
        type: String,
        trim: true,
        maxlength: [500, "GCLID cannot exceed 500 characters"],
        default: "",
      },

      gbraid: {
        type: String,
        trim: true,
        maxlength: [500, "GBRAID cannot exceed 500 characters"],
        default: "",
      },

      wbraid: {
        type: String,
        trim: true,
        maxlength: [500, "WBRAID cannot exceed 500 characters"],
        default: "",
      },

      utmSource: {
        type: String,
        trim: true,
        maxlength: [200, "UTM source cannot exceed 200 characters"],
        default: "",
      },

      utmMedium: {
        type: String,
        trim: true,
        maxlength: [200, "UTM medium cannot exceed 200 characters"],
        default: "",
      },

      utmCampaign: {
        type: String,
        trim: true,
        maxlength: [300, "UTM campaign cannot exceed 300 characters"],
        default: "",
      },

      utmTerm: {
        type: String,
        trim: true,
        maxlength: [300, "UTM term cannot exceed 300 characters"],
        default: "",
      },

      utmContent: {
        type: String,
        trim: true,
        maxlength: [300, "UTM content cannot exceed 300 characters"],
        default: "",
      },

      landingPage: {
        type: String,
        trim: true,
        maxlength: [1500, "Landing page cannot exceed 1500 characters"],
        default: "",
      },

      referrer: {
        type: String,
        trim: true,
        maxlength: [1500, "Referrer cannot exceed 1500 characters"],
        default: "",
      },
    },

    // User permission to be contacted
    consent: {
      contact: {
        type: Boolean,
        required: [true, "Contact consent is required"],
        validate: {
          validator: (value) => value === true,
          message: "Contact consent must be accepted",
        },
      },

      capturedAt: {
        type: Date,
        required: [true, "Consent capture time is required"],
      },
    },

    ipAddress: {
      type: String,
      trim: true,
      maxlength: [100, "IP address cannot exceed 100 characters"],
      default: "",
    },

    userAgent: {
      type: String,
      trim: true,
      maxlength: [1000, "User agent cannot exceed 1000 characters"],
      default: "",
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

enquirySchema.index({
  name: "text",
  email: "text",
  phone: "text",
  subject: "text",
  message: "text",
});

enquirySchema.index({
  status: 1,
  priority: 1,
  createdAt: -1,
});

enquirySchema.index({
  assignedTo: 1,
  followUpDate: 1,
});
enquirySchema.index({
  "attribution.gclid": 1,
});

enquirySchema.index({
  "attribution.utmCampaign": 1,
  createdAt: -1,
});

const Enquiry = mongoose.model("Enquiry", enquirySchema);

export default Enquiry;
