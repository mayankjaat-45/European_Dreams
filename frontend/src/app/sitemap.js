const WEBSITE_URL = "https://www.europeandreamss.com";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.europeandreamss.com";

async function fetchItems(endpoint) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      return [];
    }

    const result = await response.json();

    return (
      result?.data?.universities ||
      result?.data?.courses ||
      result?.data?.countries ||
      result?.data?.blogs ||
      result?.data ||
      []
    );
  } catch (error) {
    console.error(`Sitemap fetch failed for ${endpoint}:`, error);
    return [];
  }
}

export default async function sitemap() {
  const [universities, courses, countries, blogs] = await Promise.all([
    fetchItems("/api/universities?limit=1000"),
    fetchItems("/api/courses?limit=1000"),
    fetchItems("/api/countries?limit=1000"),
    fetchItems("/api/blogs?status=published&limit=1000"),
  ]);

  const staticPages = [
    "",
    "/about",
    "/contact",
    "/universities",
    "/courses",
    "/countries",
    "/blogs",
    "/testimonials",
    "/privacy-policy",
    "/terms-and-conditions",
  ].map((path) => ({
    url: `${WEBSITE_URL}${path}`,
    lastModified: new Date(),
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

      return course.slug && universitySlug;
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

  const countryPages = countries
    .filter((item) => item.slug)
    .map((item) => ({
      url: `${WEBSITE_URL}/countries/${item.slug}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  const blogPages = blogs
    .filter((item) => item.slug)
    .map((item) => ({
      url: `${WEBSITE_URL}/blogs/${item.slug}`,
      lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [
    ...staticPages,
    ...universityPages,
    ...coursePages,
    ...countryPages,
    ...blogPages,
  ];
}
