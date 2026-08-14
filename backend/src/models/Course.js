import mongoose from "mongoose";
import slugify from "slugify";

const courseSchema = new mongoose.Schema(
  {
    /*
     * Course belongs to one Italian university.
     * Country is not stored because the website is Italy-only.
     */
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: [true, "University is required"],
      index: true,
    },

    name: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
      maxlength: [250, "Course name cannot exceed 250 characters"],
    },

    slug: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },

    /*
     * General academic level.
     */
    degreeLevel: {
      type: String,
      enum: ["bachelor", "master", "phd", "diploma", "certificate", "other"],
      required: [true, "Degree level is required"],
      index: true,
    },

    /*
     * Used to distinguish normal Master's programmes
     * from single-cycle programmes such as Medicine.
     */
    programmeType: {
      type: String,
      enum: [
        "bachelor",
        "master",
        "single-cycle-master",
        "phd",
        "diploma",
        "certificate",
        "other",
      ],
      required: [true, "Programme type is required"],
      index: true,
    },

    degreeType: {
      type: String,
      trim: true,
      default: "",
    },

    fieldOfStudy: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    duration: {
      type: String,
      trim: true,
      default: "To be confirmed",
    },

    studyMode: {
      type: String,
      enum: ["on-campus", "online", "hybrid"],
      default: "on-campus",
    },

    language: {
      type: String,
      trim: true,
      default: "English",
    },

    isEnglishTaught: {
      type: Boolean,
      default: true,
      index: true,
    },

    admissionYear: {
      type: String,
      trim: true,
      default: "2026/27",
      index: true,
    },

    campus: {
      type: String,
      trim: true,
      default: "",
    },

    tuitionFee: {
      type: String,
      trim: true,
      default: "",
    },

    applicationFee: {
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

    eligibility: {
      type: String,
      trim: true,
      default: "",
    },

    academicRequirements: [
      {
        type: String,
        trim: true,
      },
    ],

    /*
     * Course-level admission requirements.
     * These can override or supplement university requirements.
     */
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

      toefl: {
        type: String,
        trim: true,
        default: "",
      },

      pte: {
        type: String,
        trim: true,
        default: "",
      },

      duolingo: {
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

      other: {
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

    documentsRequired: [
      {
        type: String,
        trim: true,
      },
    ],

    curriculum: [
      {
        type: String,
        trim: true,
      },
    ],

    careerOpportunities: [
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

    /*
     * Medicine and Surgery programmes are generally
     * six-year single-cycle programmes requiring IMAT.
     */
    requiresIMAT: {
      type: Boolean,
      default: false,
      index: true,
    },

    isMedicineProgramme: {
      type: Boolean,
      default: false,
      index: true,
    },

    specialNotes: {
      type: String,
      trim: true,
      default: "",
    },

    brochureUrl: {
      type: String,
      trim: true,
      default: "",
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

/*
 * Generate course slug.
 *
 * The same slug can exist at different universities because
 * uniqueness is enforced using university + slug.
 */
courseSchema.pre("validate", function () {
  if (this.name && (!this.slug || this.isModified("name"))) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  /*
   * Automatically apply Medicine defaults.
   */
  if (this.isMedicineProgramme || this.requiresIMAT) {
    this.isMedicineProgramme = true;
    this.requiresIMAT = true;
    this.degreeLevel = "master";
    this.programmeType = "single-cycle-master";

    if (!this.duration || this.duration === "To be confirmed") {
      this.duration = "6 Years";
    }
  }

  /*
   * Programme type fallback for ordinary programmes.
   */
  if (!this.programmeType && this.degreeLevel) {
    this.programmeType = this.degreeLevel;
  }

  /*
   * Keep language flag consistent.
   */
  if (this.language) {
    this.isEnglishTaught = this.language.trim().toLowerCase() === "english";
  }
});

/*
 * Prevent duplicate course names within the same university.
 */
courseSchema.index(
  {
    university: 1,
    slug: 1,
  },
  {
    unique: true,
  },
);

courseSchema.index({
  name: "text",
  fieldOfStudy: "text",
  shortDescription: "text",
  overview: "text",
});

courseSchema.index({
  programmeType: 1,
  isActive: 1,
  displayOrder: 1,
});

courseSchema.index({
  degreeLevel: 1,
  isEnglishTaught: 1,
  isActive: 1,
});

courseSchema.index({
  requiresIMAT: 1,
  isActive: 1,
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
