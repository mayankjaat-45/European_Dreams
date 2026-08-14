import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import corsOptions from "./config/cors.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import universityRoutes from "./routes/university.routes.js";
import courseRoutes from "./routes/course.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import enquiryRoutes from "./routes/enquiry.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import testimonialRoutes from "./routes/testimonial.routes.js";
import seoRoutes from "./routes/seo.routes.js";

import { apiLimiter } from "./middleware/rateLimit.middleware.js";

import {
  preventParameterPollution,
  rejectDangerousKeys,
} from "./middleware/security.middleware.js";

import ApiResponse from "./utils/ApiResponse.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.disable("x-powered-by");

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

app.use(cors(corsOptions));

app.use(
  express.json({
    limit: "2mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  }),
);

app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(rejectDangerousKeys);
app.use(preventParameterPollution);

app.get("/", (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      {
        environment: process.env.NODE_ENV,
      },
      "European Dreams Backend Running 🚀",
    ),
  );
});

app.get("/api/health", (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
      "API is healthy",
    ),
  );
});

app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/seo", seoRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
