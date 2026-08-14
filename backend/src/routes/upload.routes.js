import express from "express";

import {
  deleteUploadedFile,
  uploadMultipleFiles,
  uploadSingleFile,
} from "../controllers/upload.controller.js";

import { authorize, protect } from "../middleware/auth.middleware.js";

import { uploadLimiter } from "../middleware/rateLimit.middleware.js";

import upload from "../middleware/upload.middleware.js";

const router = express.Router();

/*
 * All upload routes require authentication.
 */
router.use(protect);

/*
 * Upload files
 *
 * Allowed roles:
 * super_admin
 * admin
 * editor
 */
router.post(
  "/single",
  authorize("super_admin", "admin", "editor"),
  uploadLimiter,
  upload.single("file"),
  uploadSingleFile,
);

router.post(
  "/multiple",
  authorize("super_admin", "admin", "editor"),
  uploadLimiter,
  upload.array("files", 10),
  uploadMultipleFiles,
);

/*
 * Delete Cloudinary file
 *
 * Editors should not delete uploaded assets.
 */
router.delete(
  "/",
  authorize("super_admin", "admin"),
  uploadLimiter,
  deleteUploadedFile,
);

export default router;
