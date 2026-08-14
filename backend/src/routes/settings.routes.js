import express from "express";

import {
  getAdminSettings,
  getPublicSettings,
  updateSettings,
} from "../controllers/settings.controller.js";

import { authorize, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/*
 * Public
 * GET /api/settings
 *
 * Returns public website configuration:
 * - Website name and branding
 * - Italy-focused statistics
 * - Contact details
 * - Social links
 * - SEO defaults
 * - Business hours
 * - Maintenance status
 */
router.get("/", getPublicSettings);

/*
 * Admin
 * GET /api/settings/admin
 */
router.get(
  "/admin",
  protect,
  authorize("super_admin", "admin", "editor"),
  getAdminSettings,
);

/*
 * Admin
 * PUT /api/settings
 */
router.put("/", protect, authorize("super_admin", "admin"), updateSettings);

export default router;
