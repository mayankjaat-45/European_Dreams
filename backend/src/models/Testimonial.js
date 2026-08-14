import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      maxlength: [120, "Student name cannot exceed 120 characters"],
    },

    /*
     * Website currently focuses only on Study in Italy.
     */
    country: {
      type: String,
      default: "Italy",
      immutable: true,
      trim: true,
    },

    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      default: null,
      index: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
      index: true,
    },

    qualification: {
      type: String,
      trim: true,
      default: "",
      maxlength: [200, "Qualification cannot exceed 200 characters"],
    },

    intake: {
      type: String,
      trim: true,
      default: "",
      maxlength: [100, "Intake cannot exceed 100 characters"],
    },

    review: {
      type: String,
      required: [true, "Testimonial review is required"],
      trim: true,
      maxlength: [3000, "Review cannot exceed 3000 characters"],
    },

    shortReview: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Short review cannot exceed 500 characters"],
    },

    rating: {
      type: Number,
      min: [1, "Rating cannot be less than 1"],
      max: [5, "Rating cannot exceed 5"],
      default: 5,
    },

    result: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Result cannot exceed 500 characters"],
    },

    admissionYear: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    studentCity: {
      type: String,
      trim: true,
      default: "",
    },

    visaApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
    visaJurisdiction: {
      type: String,
      enum: ["New Delhi", "Mumbai", "Bengaluru", "Kolkata", "Not specified"],
      default: "Not specified",
      trim: true,
      index: true,
    },
    scholarshipReceived: {
      type: Boolean,
      default: false,
      index: true,
    },

    scholarshipDetails: {
      type: String,
      trim: true,
      default: "",
      maxlength: [1000, "Scholarship details cannot exceed 1000 characters"],
    },

    /*
     * Important:
     * Public website shows testimonial only if consent is true.
     */
    consentToPublish: {
      type: Boolean,
      default: false,
      index: true,
    },

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
      min: 0,
      default: 0,
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
    versionKey: false,
  },
);

/*
 * Automatically generate short review.
 */
testimonialSchema.pre("validate", function () {
  if (this.review && !this.shortReview) {
    const review = String(this.review).replace(/\s+/g, " ").trim();

    this.shortReview =
      review.length > 300 ? `${review.slice(0, 297).trim()}...` : review;
  }

  /*
   * No scholarship = no scholarship details.
   */
  if (!this.scholarshipReceived) {
    this.scholarshipDetails = "";
  }

  /*
   * Cannot feature testimonial without publishing consent.
   */
  if (!this.consentToPublish) {
    this.isFeatured = false;
  }
});

testimonialSchema.index({
  studentName: "text",
  review: "text",
  shortReview: "text",
  result: "text",
  qualification: "text",
  studentCity: "text",
});

testimonialSchema.index({
  university: 1,
  course: 1,
  isActive: 1,
});

testimonialSchema.index({
  isActive: 1,
  consentToPublish: 1,
  isFeatured: -1,
  displayOrder: 1,
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
