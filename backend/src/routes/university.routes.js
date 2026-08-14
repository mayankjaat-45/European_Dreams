import express from "express";

import {
  createUniversity,
  deleteUniversity,
  getAdminUniversities,
  getUniversities,
  getUniversityById,
  getUniversityBySlug,
  updateUniversity,
  updateUniversityStatus,
} from "../controllers/university.controller.js";

import { authorize, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/*
 * Public
 * GET /api/universities
 */
router.get("/", getUniversities);

/*
 * Admin
 * GET /api/universities/admin/all
 */
router.get(
  "/admin/all",
  protect,
  authorize("super_admin", "admin", "editor"),
  getAdminUniversities,
);

/*
 * Admin
 * GET /api/universities/admin/:id
 */
router.get(
  "/admin/:id",
  protect,
  authorize("super_admin", "admin", "editor"),
  getUniversityById,
);

/*
 * Admin
 * POST /api/universities
 */
router.post("/", protect, authorize("super_admin", "admin"), createUniversity);

/*
 * Admin
 * PUT /api/universities/:id
 */
router.put(
  "/:id",
  protect,
  authorize("super_admin", "admin"),
  updateUniversity,
);

/*
 * Admin
 * PATCH /api/universities/:id/status
 */
router.patch(
  "/:id/status",
  protect,
  authorize("super_admin", "admin"),
  updateUniversityStatus,
);

/*
 * Admin
 * DELETE /api/universities/:id
 */
router.delete("/:id", protect, authorize("super_admin"), deleteUniversity);

/*
 * Public
 * GET /api/universities/:slug
 *
 * Keep this route last so it does not capture:
 * /admin/all
 * /admin/:id
 */
router.get("/:slug", getUniversityBySlug);

export default router;
