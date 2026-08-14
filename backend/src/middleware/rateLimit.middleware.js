import { rateLimit } from "express-rate-limit";

const skipInDevelopment = () => process.env.NODE_ENV === "development";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  skip: skipInDevelopment,

  message: {
    success: false,
    message: "Too many requests from this IP. Please try again later.",
    errors: [],
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  skipSuccessfulRequests: true,

  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
    errors: [],
  },
});

export const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many enquiries submitted. Please try again later.",
    errors: [],
  },
});

export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many upload requests. Please try again later.",
    errors: [],
  },
});
