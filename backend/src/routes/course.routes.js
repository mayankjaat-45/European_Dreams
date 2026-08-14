import express from "express";

import {
  createCourse,
  deleteCourse,
  getAdminCourses,
  getCourseById,
  getCourseBySlug,
  getCourses,
  updateCourse,
  updateCourseStatus,
} from "../controllers/course.controller.js";

import { authorize, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/*
 * Public
 * GET /api/courses
 *
 * Supported filters:
 * degreeLevel
 * programmeType
 * university
 * universitySlug
 * region
 * regionGroup
 * city
 * universityType
 * fieldOfStudy
 * studyMode
 * language
 * admissionYear
 * featured
 * englishTaught
 * medicine
 * requiresIMAT
 */
router.get("/", getCourses);

/*
 * Admin
 * GET /api/courses/admin/all
 */
router.get(
  "/admin/all",
  protect,
  authorize("super_admin", "admin", "editor"),
  getAdminCourses,
);

/*
 * Admin
 * GET /api/courses/admin/:id
 */
router.get(
  "/admin/:id",
  protect,
  authorize("super_admin", "admin", "editor"),
  getCourseById,
);

/*
 * Admin
 * POST /api/courses
 */
router.post("/", protect, authorize("super_admin", "admin"), createCourse);

/*
 * Admin
 * PUT /api/courses/:id
 */
router.put("/:id", protect, authorize("super_admin", "admin"), updateCourse);

/*
 * Admin
 * PATCH /api/courses/:id/status
 */
router.patch(
  "/:id/status",
  protect,
  authorize("super_admin", "admin"),
  updateCourseStatus,
);

/*
 * Admin
 * DELETE /api/courses/:id
 */
router.delete("/:id", protect, authorize("super_admin"), deleteCourse);

/*
 * Public
 * GET /api/courses/:universitySlug/:courseSlug
 *
 * Keep this route last so it does not capture:
 * /admin/all
 * /admin/:id
 */
router.get("/:universitySlug/:courseSlug", getCourseBySlug);

export default router;
