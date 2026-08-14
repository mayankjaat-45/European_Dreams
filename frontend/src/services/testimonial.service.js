import API from "@/lib/api";

/*
 * GET /api/testimonials
 */
export async function getTestimonials(params = {}) {
  const response = await API.get("/api/testimonials", {
    params,
  });

  const data = response.data?.data || {};

  return {
    testimonials: data.testimonials || [],

    pagination: data.pagination || {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      limit: 6,
    },
  };
}

/*
 * Featured testimonials with pagination
 */
export async function getFeaturedTestimonials({ page = 1, limit = 6 } = {}) {
  return getTestimonials({
    featured: true,
    page,
    limit,
  });
}
