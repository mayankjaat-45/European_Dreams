import express from "express";

import {
  createTestimonial,
  deleteTestimonial,
  getAdminTestimonials,
  getTestimonialById,
  getTestimonials,
  updateTestimonial,
  updateTestimonialStatus,
} from "../controllers/testimonial.controller.js";

import { authorize, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/*
 * PUBLIC WEBSITE
 */
router.get("/", getTestimonials);

/*
 * ADMIN
 */
router.get(
  "/admin/all",
  protect,
  authorize("super_admin", "admin", "editor"),
  getAdminTestimonials,
);

router.get(
  "/admin/:id",
  protect,
  authorize("super_admin", "admin", "editor"),
  getTestimonialById,
);

router.post(
  "/",
  protect,
  authorize("super_admin", "admin", "editor"),
  createTestimonial,
);

router.put(
  "/:id",
  protect,
  authorize("super_admin", "admin", "editor"),
  updateTestimonial,
);

router.patch(
  "/:id/status",
  protect,
  authorize("super_admin", "admin"),
  updateTestimonialStatus,
);

router.delete(
  "/:id",
  protect,
  authorize("super_admin", "admin"),
  deleteTestimonial,
);

export default router;
