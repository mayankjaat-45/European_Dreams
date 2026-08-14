import express from "express";

import {
  getCourseSeo,
  getDefaultSeo,
  getOrganizationStructuredData,
  getPageSeo,
  getRobotsData,
  getSitemapData,
} from "../controllers/seo.controller.js";

const router = express.Router();

/*
 * Public
 * GET /api/seo/defaults
 */
router.get("/defaults", getDefaultSeo);

/*
 * Public
 * GET /api/seo/sitemap
 */
router.get("/sitemap", getSitemapData);

/*
 * Public
 * GET /api/seo/robots
 */
router.get("/robots", getRobotsData);

/*
 * Public
 * GET /api/seo/structured-data
 */
router.get("/structured-data", getOrganizationStructuredData);

/*
 * Public
 * GET /api/seo/course/:universitySlug/:courseSlug
 */
router.get("/course/:universitySlug/:courseSlug", getCourseSeo);

/*
 * Public
 * GET /api/seo/page/:type/:slug
 *
 * Supported types:
 * university
 * blog
 */
router.get("/page/:type/:slug", getPageSeo);

export default router;
