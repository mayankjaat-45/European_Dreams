import express from "express";

import {
  createBlog,
  deleteBlog,
  getAdminBlogs,
  getBlogById,
  getBlogBySlug,
  getBlogCategories,
  getBlogs,
  updateBlog,
  updateBlogActiveStatus,
  updateBlogStatus,
} from "../controllers/blog.controller.js";

import { authorize, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/*
 * Public routes
 */
router.get("/", getBlogs);
router.get("/categories", getBlogCategories);

/*
 * Admin routes
 */
router.get(
  "/admin/all",
  protect,
  authorize("super_admin", "admin", "editor"),
  getAdminBlogs,
);

router.get(
  "/admin/:id",
  protect,
  authorize("super_admin", "admin", "editor"),
  getBlogById,
);

router.post(
  "/",
  protect,
  authorize("super_admin", "admin", "editor"),
  createBlog,
);

router.put(
  "/:id",
  protect,
  authorize("super_admin", "admin", "editor"),
  updateBlog,
);

router.patch(
  "/:id/status",
  protect,
  authorize("super_admin", "admin", "editor"),
  updateBlogStatus,
);

router.patch(
  "/:id/active",
  protect,
  authorize("super_admin", "admin"),
  updateBlogActiveStatus,
);

router.delete("/:id", protect, authorize("super_admin", "admin"), deleteBlog);

/*
 * Dynamic public route must remain last.
 */
router.get("/:slug", getBlogBySlug);

export default router;
