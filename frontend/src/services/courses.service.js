import API from "@/lib/api";

/*
 * GET /api/courses
 */
export async function getCourses(params = {}) {
  const response = await API.get("/api/courses", {
    params,
  });

  const data = response.data?.data || {};

  return {
    courses: data.courses || [],
    pagination: data.pagination || {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      limit: 12,
    },
  };
}

/*
 * GET /api/courses?featured=true
 */
export async function getFeaturedCourses(limit = 12) {
  const result = await getCourses({
    featured: true,
    page: 1,
    limit,
    sort: "displayOrder",
    order: "asc",
  });

  return result.courses;
}

/*
 * GET /api/courses/:universitySlug/:courseSlug
 */
export async function getCourseBySlug(universitySlug, courseSlug) {
  if (!universitySlug) {
    throw new Error("University slug is required");
  }

  if (!courseSlug) {
    throw new Error("Course slug is required");
  }

  const response = await API.get(
    `/api/courses/${encodeURIComponent(
      universitySlug,
    )}/${encodeURIComponent(courseSlug)}`,
  );

  return response.data?.data || null;
}
