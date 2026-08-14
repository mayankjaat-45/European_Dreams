import mongoose from "mongoose";
import slugify from "slugify";

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "University name is required"],
      trim: true,
      maxlength: [200, "University name cannot exceed 200 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    country: {
      type: String,
      default: "Italy",
      immutable: true,
      trim: true,
      index: true,
    },

    region: {
      type: String,
      required: [true, "Italian region is required"],
      trim: true,
      maxlength: [100, "Region cannot exceed 100 characters"],
      index: true,
    },

    regionGroup: {
      type: String,
      required: [true, "Region group is required"],
      enum: [
        "Piedmont & Liguria",
        "Lombardy",
        "Trentino, Veneto & Friuli",
        "Emilia-Romagna",
        "Central Italy",
        "Southern Italy",
        "The Islands",
      ],
      index: true,
    },

    city: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    universityType: {
      type: String,
      enum: ["public", "private", "technical", "other"],
      default: "public",
      index: true,
    },

    establishedYear: {
      type: Number,
      default: null,
      min: [1000, "Established year is invalid"],
      max: [new Date().getFullYear(), "Established year cannot be in future"],
    },

    ranking: {
      type: String,
      trim: true,
      default: "",
    },

    heroImage: {
      type: String,
      trim: true,
      default: "",
    },

    heroImagePublicId: {
      type: String,
      trim: true,
      default: "",
    },

    gallery: [
      {
        url: {
          type: String,
          trim: true,
          required: true,
        },

        publicId: {
          type: String,
          trim: true,
          default: "",
        },

        alt: {
          type: String,
          trim: true,
          default: "",
        },

        _id: false,
      },
    ],

    shortDescription: {
      type: String,
      trim: true,
      maxlength: [500, "Short description cannot exceed 500 characters"],
      default: "",
    },

    overview: {
      type: String,
      trim: true,
      default: "",
    },

    whyChoose: [
      {
        type: String,
        trim: true,
      },
    ],

    scholarships: {
      type: String,
      trim: true,
      default: "",
    },

    eligibility: {
      type: String,
      trim: true,
      default: "",
    },

    admissionRequirements: {
      academics: {
        type: String,
        trim: true,
        default: "",
      },

      ielts: {
        type: String,
        trim: true,
        default: "",
      },

      pte: {
        type: String,
        trim: true,
        default: "",
      },

      centS: {
        type: String,
        trim: true,
        default: "",
      },

      sat: {
        type: String,
        trim: true,
        default: "",
      },

      imat: {
        type: String,
        trim: true,
        default: "",
      },

      notes: {
        type: String,
        trim: true,
        default: "",
      },
    },

    applicationFee: {
      type: String,
      trim: true,
      default: "",
    },

    tuitionFeeRange: {
      type: String,
      trim: true,
      default: "",
    },

    intakes: [
      {
        type: String,
        trim: true,
      },
    ],

    applicationDeadline: {
      type: String,
      trim: true,
      default: "",
    },

    languageRequirements: {
      type: String,
      trim: true,
      default: "",
    },

    campusLife: {
      type: String,
      trim: true,
      default: "",
    },

    accommodation: {
      type: String,
      trim: true,
      default: "",
    },

    officialWebsite: {
      type: String,
      trim: true,
      default: "",
    },

    brochureUrl: {
      type: String,
      trim: true,
      default: "",
    },

    bachelorsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    mastersCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalEnglishCourses: {
      type: Number,
      default: 0,
      min: 0,
    },

    offersMedicineInEnglish: {
      type: Boolean,
      default: false,
      index: true,
    },

    seoTitle: {
      type: String,
      trim: true,
      maxlength: [70, "SEO title cannot exceed 70 characters"],
      default: "",
    },

    metaDescription: {
      type: String,
      trim: true,
      maxlength: [180, "Meta description cannot exceed 180 characters"],
      default: "",
    },

    keywords: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
      min: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

universitySchema.pre("validate", function () {
  if (this.name && (!this.slug || this.isModified("name"))) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  this.country = "Italy";

  this.totalEnglishCourses =
    Number(this.bachelorsCount || 0) + Number(this.mastersCount || 0);
});

universitySchema.index({
  name: "text",
  city: "text",
  region: "text",
  regionGroup: "text",
  shortDescription: "text",
  overview: "text",
});

universitySchema.index({
  regionGroup: 1,
  isActive: 1,
  displayOrder: 1,
});

universitySchema.index({
  offersMedicineInEnglish: 1,
  isActive: 1,
});

universitySchema.index({
  isFeatured: 1,
  isActive: 1,
  displayOrder: 1,
});

const University = mongoose.model("University", universitySchema);

export default University;
