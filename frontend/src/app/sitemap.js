const WEBSITE_URL = "https://www.europeandreamss.com";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.europeandreamss.com";

async function fetchAll(baseEndpoint, dataKey) {
  const allItems = [];
  const seen = new Set();
  let page = 1;
  let totalPages = 1;

  try {
    while (page <= totalPages) {
      const separator = baseEndpoint.includes("?") ? "&" : "?";
      const url = `${API_URL}${baseEndpoint}${separator}limit=100&page=${page}`;

      const response = await fetch(url, {
        next: {
          revalidate: 3600,
        },
      });

      if (!response.ok) {
        break;
      }

      const result = await response.json();
      const batch =
        result?.data?.[dataKey] ||
        result?.data?.universities ||
        result?.data?.courses ||
        result?.data?.blogs ||
        [];

      const pagination = result?.data?.pagination;

      if (!Array.isArray(batch) || batch.length === 0) {
        // No items on this page, break to avoid infinite loop
        if (page === 1) {
          // First page empty, return what we have
          break;
        }
        break;
      }

      for (const item of batch) {
        const id = item._id || item.slug || `${dataKey}-${allItems.length}`;
        if (!seen.has(id)) {
          seen.add(id);
          allItems.push(item);
        }
      }

      if (
        pagination &&
        typeof pagination.totalPages === "number" &&
        Number.isFinite(pagination.totalPages) &&
        pagination.totalPages > 0
      ) {
        totalPages = pagination.totalPages;
        if (page >= totalPages) {
          break;
        }
      } else {
        // No valid pagination info, assume single page
        break;
      }

      page += 1;

      // Safety guard against infinite loops (e.g., malformed totalPages)
      if (page > 100) {
        break;
      }
    }
  } catch (error) {
    console.error(`Sitemap fetchAll failed for ${baseEndpoint}:`, error);
  }

  return allItems;
}

export default async function sitemap() {
  const [universities, courses, blogs] = await Promise.all([
    fetchAll("/api/universities", "universities"),
    fetchAll("/api/courses", "courses"),
    fetchAll("/api/blogs?status=published", "blogs"),
  ]);

  const staticPages = [
    "",
    "/about",
    "/contact",
    "/universities",
    "/courses",
    "/visa-checklists",
    "/study-in-italy",
    "/italy-scholarships",
    "/italy-student-visa",
    "/italy-university-admission",
    "/blogs",
    "/testimonials",
    "/privacy-policy",
    "/terms-and-conditions",
  ].map((path) => ({
    url: `${WEBSITE_URL}${path}`,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const universityPages = universities
    .filter((item) => item.slug)
    .map((item) => ({
      url: `${WEBSITE_URL}/universities/${item.slug}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const coursePages = courses
    .filter((course) => {
      const universitySlug = course.university?.slug || course.universitySlug;

      return (
        course.slug &&
        universitySlug &&
        course.university?.isActive !== false
      );
    })
    .map((course) => {
      const universitySlug = course.university?.slug || course.universitySlug;

      return {
        url: `${WEBSITE_URL}/courses/${universitySlug}/${course.slug}`,
        lastModified: course.updatedAt
          ? new Date(course.updatedAt)
          : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });

  const blogPages = blogs
    .filter((item) => item.slug)
    .map((item) => {
      const canonical = item.canonicalUrl?.trim();

      if (canonical) {
        try {
          const canonicalUrl = new URL(canonical);
          const siteUrl = new URL(WEBSITE_URL);

          const isInternal =
            canonicalUrl.hostname.toLowerCase() ===
            siteUrl.hostname.toLowerCase();

          if (!isInternal) {
            return null;
          }

          return {
            url: canonical,
            lastModified: item.updatedAt
              ? new Date(item.updatedAt)
              : new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
          };
        } catch {
          // If canonical is not a valid absolute URL, treat relative paths as internal
          if (canonical.startsWith("/")) {
            return {
              url: `${WEBSITE_URL}${canonical}`,
              lastModified: item.updatedAt
                ? new Date(item.updatedAt)
                : new Date(),
              changeFrequency: "monthly",
              priority: 0.7,
            };
          }
          return null;
        }
      }

      return {
        url: `${WEBSITE_URL}/blogs/${item.slug}`,
        lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      };
    })
    .filter(Boolean);

  return [
    ...staticPages,
    ...universityPages,
    ...coursePages,
    ...blogPages,
  ];
}
