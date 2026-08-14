import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [250, "Blog title cannot exceed 250 characters"],
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    excerpt: {
      type: String,
      required: [true, "Blog excerpt is required"],
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },

    content: {
      type: String,
      required: [true, "Blog content is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Blog category is required"],
      trim: true,
      index: true,
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    authorName: {
      type: String,
      trim: true,
      default: "European Dreams",
    },

    featuredImage: {
      type: String,
      trim: true,
      default: "",
    },

    featuredImageAlt: {
      type: String,
      trim: true,
      default: "",
    },

    readTime: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },

    publishedAt: {
      type: Date,
      default: null,
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

    canonicalUrl: {
      type: String,
      trim: true,
      default: "",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
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

blogSchema.pre("validate", function () {
  if (this.title && (!this.slug || this.isModified("title"))) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  if (
    this.status === "published" &&
    (!this.publishedAt || this.isModified("status"))
  ) {
    this.publishedAt = new Date();
  }

  if (this.status === "draft") {
    this.publishedAt = null;
  }
});

blogSchema.index({
  title: "text",
  excerpt: "text",
  content: "text",
  category: "text",
  tags: "text",
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
