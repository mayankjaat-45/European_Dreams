import express from "express";

import {
  createEnquiry,
  deleteEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
} from "../controllers/enquiry.controller.js";

import { authorize, protect } from "../middleware/auth.middleware.js";

import { enquiryLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post("/", enquiryLimiter, createEnquiry);

router.get(
  "/",
  protect,
  authorize("super_admin", "admin", "editor"),
  getEnquiries,
);

router.get(
  "/:id",
  protect,
  authorize("super_admin", "admin", "editor"),
  getEnquiryById,
);

router.put("/:id", protect, authorize("super_admin", "admin"), updateEnquiry);

router.delete("/:id", protect, authorize("super_admin"), deleteEnquiry);

export default router;
