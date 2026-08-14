import SiteSettings from "../models/SiteSettings.js";
import University from "../models/University.js";
import Course from "../models/Course.js";
import Blog from "../models/Blog.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const getBaseUrl = () => {
  return (
    process.env.PUBLIC_SITE_URL ||
    process.env.FRONTEND_URL ||
    "http://localhost:3000"
  ).replace(/\/+$/, "");
};

const normalizeUrl = (value = "") => {
  if (!value) return "";

  return String(value).replace(/\/+$/, "");
};

const createAbsoluteUrl = (path = "") => {
  const baseUrl = getBaseUrl();

  if (!path) {
    return baseUrl;
  }

  if (
    String(path).startsWith("http://") ||
    String(path).startsWith("https://")
  ) {
    return normalizeUrl(path);
  }

  return `${baseUrl}/${String(path).replace(/^\/+/, "")}`;
};

const createSitemapItem = ({
  path,
  lastModified,
  changeFrequency = "weekly",
  priority = 0.7,
}) => {
  const parsedDate = lastModified ? new Date(lastModified) : new Date();

  return {
    url: createAbsoluteUrl(path),

    lastModified: Number.isNaN(parsedDate.getTime())
      ? new Date().toISOString()
      : parsedDate.toISOString(),

    changeFrequency,
    priority,
  };
};

const removeUndefinedValues = (object) => {
  Object.keys(object).forEach((key) => {
    const value = object[key];

    if (value === undefined || value === null || value === "") {
      delete object[key];
    }
  });

  return object;
};

/*
 * Public
 * GET /api/seo/sitemap
 */
export const getSitemapData = async (req, res, next) => {
  try {
    const [universities, courses, blogs] = await Promise.all([
      University.find({
        isActive: true,
      })
        .select("slug updatedAt")
        .lean(),

      Course.find({
        isActive: true,
      })
        .select("slug university updatedAt")
        .populate("university", "slug isActive")
        .lean(),

      Blog.find({
        isActive: true,
        status: "published",

        publishedAt: {
          $lte: new Date(),
        },
      })
        .select("slug updatedAt publishedAt")
        .lean(),
    ]);

    const staticPages = [
      createSitemapItem({
        path: "/",
        changeFrequency: "daily",
        priority: 1,
      }),

      createSitemapItem({
        path: "/study-in-italy",
        changeFrequency: "weekly",
        priority: 0.95,
      }),

      createSitemapItem({
        path: "/universities",
        changeFrequency: "daily",
        priority: 0.95,
      }),

      createSitemapItem({
        path: "/courses",
        changeFrequency: "daily",
        priority: 0.95,
      }),

      createSitemapItem({
        path: "/scholarships",
        changeFrequency: "weekly",
        priority: 0.85,
      }),

      createSitemapItem({
        path: "/medicine-in-italy",
        changeFrequency: "weekly",
        priority: 0.85,
      }),

      createSitemapItem({
        path: "/blogs",
        changeFrequency: "daily",
        priority: 0.8,
      }),

      createSitemapItem({
        path: "/about",
        changeFrequency: "monthly",
        priority: 0.6,
      }),

      createSitemapItem({
        path: "/contact",
        changeFrequency: "monthly",
        priority: 0.6,
      }),
    ];

    const universityPages = universities.map((university) =>
      createSitemapItem({
        path: `/universities/${university.slug}`,

        lastModified: university.updatedAt,

        changeFrequency: "weekly",
        priority: 0.85,
      }),
    );

    const coursePages = courses
      .filter(
        (course) => course.university && course.university.isActive !== false,
      )
      .map((course) =>
        createSitemapItem({
          path: `/courses/${course.university.slug}/${course.slug}`,

          lastModified: course.updatedAt,

          changeFrequency: "weekly",
          priority: 0.8,
        }),
      );

    const blogPages = blogs.map((blog) =>
      createSitemapItem({
        path: `/blogs/${blog.slug}`,

        lastModified: blog.updatedAt || blog.publishedAt,

        changeFrequency: "monthly",
        priority: 0.7,
      }),
    );

    const urls = [
      ...staticPages,
      ...universityPages,
      ...coursePages,
      ...blogPages,
    ];

    res.status(200).json(
      new ApiResponse(
        200,
        {
          baseUrl: getBaseUrl(),

          totalUrls: urls.length,

          urls,

          groups: {
            static: staticPages,
            universities: universityPages,
            courses: coursePages,
            blogs: blogPages,
          },
        },
        "Sitemap data fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Public
 * GET /api/seo/robots
 */
export const getRobotsData = async (req, res, next) => {
  try {
    const settings = await SiteSettings.findOne().select("seo maintenanceMode");

    const shouldIndex =
      !settings?.maintenanceMode && settings?.seo?.robotsIndex !== false;

    const shouldFollow = settings?.seo?.robotsFollow !== false;

    res.status(200).json(
      new ApiResponse(
        200,
        {
          rules: [
            {
              userAgent: "*",

              allow: shouldIndex ? "/" : "",

              disallow: shouldIndex
                ? ["/admin", "/api", "/login", "/reset-password"]
                : ["/"],
            },
          ],

          sitemap: createAbsoluteUrl("/sitemap.xml"),

          host: getBaseUrl(),

          robots: {
            index: shouldIndex,
            follow: shouldFollow,
          },
        },
        "Robots configuration fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Public
 * GET /api/seo/defaults
 */
export const getDefaultSeo = async (req, res, next) => {
  try {
    const settings = await SiteSettings.findOne();

    const websiteName = settings?.websiteName || "European Dreams";

    const defaultTitle =
      settings?.seo?.defaultTitle || `${websiteName} | Study in Italy`;

    const defaultDescription =
      settings?.seo?.defaultDescription ||
      "Study in Italy with leading public universities, English-taught courses, scholarships, admission guidance and student visa support.";

    const defaultKeywords = settings?.seo?.defaultKeywords?.length
      ? settings.seo.defaultKeywords
      : [
          "study in Italy",
          "Italian universities",
          "English courses in Italy",
          "Italy scholarships",
          "Italy student visa",
          "medicine in Italy",
        ];

    const canonicalUrl = settings?.seo?.canonicalUrl || getBaseUrl();

    const ogImage = settings?.seo?.ogImage || settings?.logo || "";

    const absoluteCanonicalUrl = createAbsoluteUrl(canonicalUrl);

    const absoluteOgImage = ogImage ? createAbsoluteUrl(ogImage) : "";

    res.status(200).json(
      new ApiResponse(
        200,
        {
          title: defaultTitle,

          description: defaultDescription,

          keywords: defaultKeywords,

          canonicalUrl: absoluteCanonicalUrl,

          ogImage: absoluteOgImage,

          robots: {
            index:
              settings?.seo?.robotsIndex !== false &&
              !settings?.maintenanceMode,

            follow: settings?.seo?.robotsFollow !== false,
          },

          openGraph: {
            type: "website",
            siteName: websiteName,
            title: defaultTitle,

            description: defaultDescription,

            url: absoluteCanonicalUrl,

            locale: "en_IN",

            images: absoluteOgImage
              ? [
                  {
                    url: absoluteOgImage,

                    alt: `${websiteName} - Study in Italy`,
                  },
                ]
              : [],
          },

          twitter: {
            card: "summary_large_image",

            title: defaultTitle,

            description: defaultDescription,

            images: absoluteOgImage ? [absoluteOgImage] : [],
          },
        },
        "Default SEO data fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Public
 * GET /api/seo/page/:type/:slug
 *
 * Supported types:
 * university
 * blog
 */
export const getPageSeo = async (req, res, next) => {
  try {
    const type = String(req.params.type || "")
      .trim()
      .toLowerCase();

    const slug = String(req.params.slug || "")
      .trim()
      .toLowerCase();

    if (!slug) {
      throw new ApiError(400, "Page slug is required");
    }

    let record = null;
    let pagePath = "";
    let pageType = "website";

    if (type === "university") {
      record = await University.findOne({
        slug,
        isActive: true,
      }).select(
        [
          "name",
          "slug",
          "seoTitle",
          "metaDescription",
          "keywords",
          "heroImage",
          "logo",
          "shortDescription",
          "city",
          "region",
          "regionGroup",
          "universityType",
          "updatedAt",
        ].join(" "),
      );

      pagePath = `/universities/${slug}`;
    } else if (type === "blog") {
      record = await Blog.findOne({
        slug,
        status: "published",
        isActive: true,

        publishedAt: {
          $lte: new Date(),
        },
      }).select(
        [
          "title",
          "slug",
          "seoTitle",
          "metaDescription",
          "keywords",
          "canonicalUrl",
          "featuredImage",
          "featuredImageAlt",
          "excerpt",
          "authorName",
          "publishedAt",
          "updatedAt",
        ].join(" "),
      );

      pagePath = `/blogs/${slug}`;
      pageType = "article";
    } else {
      throw new ApiError(400, "SEO page type must be university or blog");
    }

    if (!record) {
      throw new ApiError(404, "SEO page not found");
    }

    const title =
      record.seoTitle || record.title || `${record.name} | Study in Italy`;

    const description =
      record.metaDescription || record.excerpt || record.shortDescription || "";

    const image = record.featuredImage || record.heroImage || record.logo || "";

    const canonicalUrl = record.canonicalUrl || createAbsoluteUrl(pagePath);

    const absoluteCanonicalUrl = createAbsoluteUrl(canonicalUrl);

    const absoluteImage = image ? createAbsoluteUrl(image) : "";

    const structuredData =
      type === "university"
        ? removeUndefinedValues({
            "@context": "https://schema.org",

            "@type": "CollegeOrUniversity",

            name: record.name,

            url: absoluteCanonicalUrl,

            description,

            image: absoluteImage || undefined,

            address: removeUndefinedValues({
              "@type": "PostalAddress",

              addressLocality: record.city || undefined,

              addressRegion: record.region || undefined,

              addressCountry: "IT",
            }),
          })
        : null;

    res.status(200).json(
      new ApiResponse(
        200,
        {
          type,
          title,
          description,

          keywords: record.keywords || [],

          canonicalUrl: absoluteCanonicalUrl,

          robots: {
            index: true,
            follow: true,
          },

          openGraph: {
            type: pageType,
            title,
            description,

            url: absoluteCanonicalUrl,

            locale: "en_IN",

            images: absoluteImage
              ? [
                  {
                    url: absoluteImage,

                    alt:
                      record.featuredImageAlt ||
                      record.title ||
                      record.name ||
                      "",
                  },
                ]
              : [],
          },

          twitter: {
            card: "summary_large_image",

            title,
            description,

            images: absoluteImage ? [absoluteImage] : [],
          },

          article:
            type === "blog"
              ? {
                  publishedTime: record.publishedAt || null,

                  modifiedTime: record.updatedAt || null,

                  authors: record.authorName ? [record.authorName] : [],
                }
              : null,

          structuredData,
        },
        "Page SEO data fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Public
 * GET /api/seo/course/:universitySlug/:courseSlug
 */
export const getCourseSeo = async (req, res, next) => {
  try {
    const universitySlug = String(req.params.universitySlug || "")
      .trim()
      .toLowerCase();

    const courseSlug = String(req.params.courseSlug || "")
      .trim()
      .toLowerCase();

    if (!universitySlug) {
      throw new ApiError(400, "University slug is required");
    }

    if (!courseSlug) {
      throw new ApiError(400, "Course slug is required");
    }

    const university = await University.findOne({
      slug: universitySlug,
      isActive: true,
    }).select(
      [
        "name",
        "slug",
        "logo",
        "heroImage",
        "city",
        "region",
        "regionGroup",
        "officialWebsite",
      ].join(" "),
    );

    if (!university) {
      throw new ApiError(404, "University not found");
    }

    const course = await Course.findOne({
      university: university._id,

      slug: courseSlug,
      isActive: true,
    }).select(
      [
        "name",
        "slug",
        "seoTitle",
        "metaDescription",
        "keywords",
        "shortDescription",
        "fieldOfStudy",
        "degreeLevel",
        "programmeType",
        "duration",
        "tuitionFee",
        "language",
        "studyMode",
        "admissionYear",
        "isEnglishTaught",
        "requiresIMAT",
        "isMedicineProgramme",
      ].join(" "),
    );

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    const title =
      course.seoTitle ||
      `${course.name} at ${university.name} | Study in Italy`;

    const description =
      course.metaDescription ||
      course.shortDescription ||
      `Study ${course.name} at ${university.name}, Italy. Explore duration, admission requirements, tuition fees and programme details.`;

    const canonicalUrl = createAbsoluteUrl(
      `/courses/${university.slug}/${course.slug}`,
    );

    const image = university.heroImage || university.logo || "";

    const absoluteImage = image ? createAbsoluteUrl(image) : "";

    const courseInstance = {
      "@type": "CourseInstance",

      courseMode: course.studyMode || "on-campus",

      courseWorkload: course.duration || undefined,

      location: {
        "@type": "Place",

        name: university.name,

        address: removeUndefinedValues({
          "@type": "PostalAddress",

          addressLocality: university.city || undefined,

          addressRegion: university.region || undefined,

          addressCountry: "IT",
        }),
      },
    };

    const structuredData = removeUndefinedValues({
      "@context": "https://schema.org",

      "@type": "Course",

      name: course.name,

      description,

      url: canonicalUrl,

      provider: {
        "@type": "CollegeOrUniversity",

        name: university.name,

        url: createAbsoluteUrl(`/universities/${university.slug}`),
      },

      educationalLevel: course.degreeLevel || undefined,

      inLanguage: course.language || "English",

      timeRequired: course.duration || undefined,

      courseCode: course.slug,

      hasCourseInstance: courseInstance,
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          type: "course",

          title,
          description,

          keywords: course.keywords || [],

          canonicalUrl,

          robots: {
            index: true,
            follow: true,
          },

          openGraph: {
            type: "website",
            title,
            description,
            url: canonicalUrl,
            locale: "en_IN",

            images: absoluteImage
              ? [
                  {
                    url: absoluteImage,

                    alt: `${course.name} at ${university.name}`,
                  },
                ]
              : [],
          },

          twitter: {
            card: "summary_large_image",

            title,
            description,

            images: absoluteImage ? [absoluteImage] : [],
          },

          structuredData,
        },
        "Course SEO data fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};

/*
 * Public
 * GET /api/seo/structured-data
 */
export const getOrganizationStructuredData = async (req, res, next) => {
  try {
    const settings = await SiteSettings.findOne();

    const websiteName = settings?.websiteName || "European Dreams";

    const description =
      settings?.seo?.defaultDescription ||
      settings?.footerDescription ||
      "Study in Italy guidance for universities, English-taught courses, scholarships, admissions and student visas.";

    const addressParts = [
      settings?.address,
      settings?.city,
      settings?.state,
      settings?.postalCode,
      settings?.country,
    ].filter(Boolean);

    const socialLinks =
      settings?.socialLinks?.toObject?.() || settings?.socialLinks || {};

    const sameAs = Object.values(socialLinks).filter(Boolean);

    const structuredData = removeUndefinedValues({
      "@context": "https://schema.org",

      "@type": "EducationalOrganization",

      name: websiteName,

      url: getBaseUrl(),

      description,

      areaServed: {
        "@type": "Country",
        name: "Italy",
      },

      knowsAbout: [
        "Study in Italy",
        "Italian Universities",
        "English-taught Courses in Italy",
        "Scholarships in Italy",
        "Italy Student Visa",
        "Medicine and Surgery in Italy",
        "IMAT Guidance",
      ],

      logo: settings?.logo ? createAbsoluteUrl(settings.logo) : undefined,

      image: settings?.seo?.ogImage
        ? createAbsoluteUrl(settings.seo.ogImage)
        : undefined,

      email: settings?.primaryEmail || undefined,

      telephone: settings?.primaryPhone || undefined,

      address: addressParts.length
        ? removeUndefinedValues({
            "@type": "PostalAddress",

            streetAddress: settings?.address || undefined,

            addressLocality: settings?.city || undefined,

            addressRegion: settings?.state || undefined,

            postalCode: settings?.postalCode || undefined,

            addressCountry: settings?.country || "IN",
          })
        : undefined,

      sameAs: sameAs.length ? sameAs : undefined,
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          structuredData,
        },
        "Organization structured data fetched successfully",
      ),
    );
  } catch (error) {
    next(error);
  }
};
