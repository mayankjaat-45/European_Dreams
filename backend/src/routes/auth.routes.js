import express from "express";

import {
  changePassword,
  forgotPassword,
  getProfile,
  login,
  logout,
  resetPassword,
  validateResetToken,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import { authLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.post("/login", authLimiter, login);

router.post("/forgot-password", authLimiter, forgotPassword);

router.get("/reset-password/:token/validate", validateResetToken);

router.post("/reset-password/:token", authLimiter, resetPassword);

router.post("/logout", logout);

router.get("/profile", protect, getProfile);

router.put("/change-password", protect, authLimiter, changePassword);

export default router;
