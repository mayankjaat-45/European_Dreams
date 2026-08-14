import mongoose from "mongoose";
import slugify from "slugify";

import Blog from "../models/Blog.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const parseBoolean = (value) => {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;

  return value === "true";
};

const parseArray = (value) => {
  if (value === undefined) return undefined;

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const generateUniqueSlug = async (title, excludedBlogId = null) => {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const filter = {
      slug,
    };

    if (excludedBlogId) {
      filter._id = {
        $ne: excludedBlogId,
      };
    }

    const existingBlog = await Blog.findOne(filter).select("_id");

    if (!existingBlog) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

/*
 * Public
 * GET /api/blogs
 */
export const getBlogs = async (req, res, next) => {
  try {
    const {
      search = "",
      category = "",
      tag = "",
      featured,
      page = 1,
      limit = 12,
      sort = "publishedAt",
      order = "desc",
    } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);

    const limitNumber = Math.min(Math.max(Number(limit) || 12, 1), 100);

    const filter = {
      status: "published",
      isActive: true,
      publishedAt: {
        $lte: new Date(),
      },
    };

    if (search.trim()) {
      filter.$or = [
        {
          title: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          excerpt: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          category: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    if (category.trim()) {
      filter.category = {
        $regex: `^${category.trim()}$`,
        $options: "i",
      };
    }

    if (tag.trim()) {
      filter.tags = {
        $regex: `^${tag.trim()}$`,
        $options: "i",
      };
    }

    const featuredValue = parseBoolean(featured);

    if (featuredValue !== undefined) {
      filter.isFeatured = featuredValue;
    }

    const allowedSortFields = [
      "publishedAt",
      "createdAt",
      "title",
      "views",
      "displayOrder",
    ];

    const sortField = allowedSortFields.includes(sort) ? sort : "publishedAt";

    const sortDirection = order === "asc" ? 1 : -1;

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .select("-content")
        .sort({
          [sortField]: sortDirection,
          displayOrder: 1,
        })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .lean(),

      Blog.countDocuments(filter),
    ]);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          blogs,
          pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalItems: total,
            limit: limitNumber,
          },
        },
        "Blogs fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Public
 * GET /api/blogs/categories
 */
export const getBlogCategories = async (req, res, next) => {
  try {
    const categories = await Blog.distinct("category", {
      status: "published",
      isActive: true,
    });

    categories.sort((a, b) => a.localeCompare(b));

    res.status(200).json(
      new ApiResponse(
        200,
        {
          categories,
        },
        "Blog categories fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Public
 * GET /api/blogs/:slug
 */
export const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      {
        slug: req.params.slug.toLowerCase(),
        status: "published",
        isActive: true,
        publishedAt: {
          $lte: new Date(),
        },
      },
      {
        $inc: {
          views: 1,
        },
      },
      {
        new: true,
      },
    )
      .populate("createdBy", "name")
      .lean();

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          blog,
        },
        "Blog fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Admin
 * GET /api/blogs/admin/all
 */
export const getAdminBlogs = async (req, res, next) => {
  try {
    const {
      search = "",
      status = "all",
      category = "",
      active = "all",
      featured,
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);

    const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const filter = {};

    if (search.trim()) {
      filter.$or = [
        {
          title: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          slug: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          category: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    if (status === "draft" || status === "published") {
      filter.status = status;
    }

    if (active === "active") {
      filter.isActive = true;
    }

    if (active === "inactive") {
      filter.isActive = false;
    }

    if (category.trim()) {
      filter.category = {
        $regex: `^${category.trim()}$`,
        $options: "i",
      };
    }

    const featuredValue = parseBoolean(featured);

    if (featuredValue !== undefined) {
      filter.isFeatured = featuredValue;
    }

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .select("-content")
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .sort({
          createdAt: -1,
        })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber),

      Blog.countDocuments(filter),
    ]);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          blogs,
          pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            totalItems: total,
            limit: limitNumber,
          },
        },
        "Admin blogs fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Admin
 * GET /api/blogs/admin/:id
 */
export const getBlogById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid blog ID");
    }

    const blog = await Blog.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          blog,
        },
        "Blog fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Admin
 * POST /api/blogs
 */
export const createBlog = async (req, res, next) => {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      tags,
      authorName,
      featuredImage,
      featuredImageAlt,
      readTime,
      status,
      publishedAt,
      seoTitle,
      metaDescription,
      keywords,
      canonicalUrl,
      isFeatured,
      isActive,
      displayOrder,
    } = req.body;

    if (!title?.trim()) {
      throw new ApiError(400, "Blog title is required");
    }

    if (!excerpt?.trim()) {
      throw new ApiError(400, "Blog excerpt is required");
    }

    if (!content?.trim()) {
      throw new ApiError(400, "Blog content is required");
    }

    if (!category?.trim()) {
      throw new ApiError(400, "Blog category is required");
    }

    const slug = await generateUniqueSlug(title.trim());

    const blogStatus = status === "published" ? "published" : "draft";

    const blog = await Blog.create({
      title: title.trim(),
      slug,
      excerpt: excerpt.trim(),
      content,
      category: category.trim(),
      tags: parseArray(tags) || [],
      authorName: authorName?.trim() || "European Dreams",
      featuredImage,
      featuredImageAlt,
      readTime,
      status: blogStatus,
      publishedAt:
        blogStatus === "published"
          ? publishedAt
            ? new Date(publishedAt)
            : new Date()
          : null,
      seoTitle,
      metaDescription,
      keywords: parseArray(keywords) || [],
      canonicalUrl,
      isFeatured: parseBoolean(isFeatured) ?? false,
      isActive: parseBoolean(isActive) ?? true,
      displayOrder: Number(displayOrder) || 0,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    res.status(201).json(
      new ApiResponse(
        201,
        {
          blog,
        },
        "Blog created successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Admin
 * PUT /api/blogs/:id
 */
export const updateBlog = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid blog ID");
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    if (req.body.title?.trim()) {
      const newTitle = req.body.title.trim();

      if (newTitle !== blog.title) {
        blog.title = newTitle;
        blog.slug = await generateUniqueSlug(newTitle, blog._id);
      }
    }

    const stringFields = [
      "excerpt",
      "content",
      "category",
      "authorName",
      "featuredImage",
      "featuredImageAlt",
      "readTime",
      "seoTitle",
      "metaDescription",
      "canonicalUrl",
    ];

    stringFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        blog[field] = req.body[field];
      }
    });

    if (req.body.tags !== undefined) {
      blog.tags = parseArray(req.body.tags);
    }

    if (req.body.keywords !== undefined) {
      blog.keywords = parseArray(req.body.keywords);
    }

    if (req.body.status !== undefined) {
      if (!["draft", "published"].includes(req.body.status)) {
        throw new ApiError(400, "Status must be draft or published");
      }

      const wasPublished = blog.status === "published";

      blog.status = req.body.status;

      if (req.body.status === "published") {
        blog.publishedAt = req.body.publishedAt
          ? new Date(req.body.publishedAt)
          : wasPublished && blog.publishedAt
            ? blog.publishedAt
            : new Date();
      } else {
        blog.publishedAt = null;
      }
    } else if (req.body.publishedAt !== undefined) {
      blog.publishedAt = req.body.publishedAt
        ? new Date(req.body.publishedAt)
        : null;
    }

    if (req.body.isFeatured !== undefined) {
      blog.isFeatured = parseBoolean(req.body.isFeatured);
    }

    if (req.body.isActive !== undefined) {
      blog.isActive = parseBoolean(req.body.isActive);
    }

    if (req.body.displayOrder !== undefined) {
      blog.displayOrder = Number(req.body.displayOrder) || 0;
    }

    blog.updatedBy = req.user._id;

    await blog.save();

    res.status(200).json(
      new ApiResponse(
        200,
        {
          blog,
        },
        "Blog updated successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Admin
 * PATCH /api/blogs/:id/status
 */
export const updateBlogStatus = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid blog ID");
    }

    const { status } = req.body;

    if (!["draft", "published"].includes(status)) {
      throw new ApiError(400, "Status must be draft or published");
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    blog.status = status;

    if (status === "published") {
      blog.publishedAt = blog.publishedAt || new Date();
    } else {
      blog.publishedAt = null;
    }

    blog.updatedBy = req.user._id;

    await blog.save();

    res.status(200).json(
      new ApiResponse(
        200,
        {
          blog,
        },
        `Blog ${status} successfully`,
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Admin
 * PATCH /api/blogs/:id/active
 */
export const updateBlogActiveStatus = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid blog ID");
    }

    const { isActive } = req.body;

    if (isActive === undefined) {
      throw new ApiError(400, "isActive value is required");
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        isActive: parseBoolean(isActive),
        updatedBy: req.user._id,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          blog,
        },
        `Blog ${blog.isActive ? "activated" : "deactivated"} successfully`,
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Admin
 * DELETE /api/blogs/:id
 */
export const deleteBlog = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new ApiError(400, "Invalid blog ID");
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    await blog.deleteOne();

    res
      .status(200)
      .json(new ApiResponse(200, null, "Blog deleted successfully"));
  } catch (error) {
    next(error);
  }
};
