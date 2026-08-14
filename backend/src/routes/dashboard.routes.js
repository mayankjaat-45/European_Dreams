import express from "express";

import {
  getDashboardStats,
  getEnquiryChart,
  getEnquiryStatusSummary,
  getUpcomingFollowUps,
} from "../controllers/dashboard.controller.js";

import { authorize, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect, authorize("super_admin", "admin", "editor"));

router.get("/stats", getDashboardStats);

router.get("/enquiry-chart", getEnquiryChart);

router.get("/enquiry-status", getEnquiryStatusSummary);

router.get("/upcoming-follow-ups", getUpcomingFollowUps);

export default router;
