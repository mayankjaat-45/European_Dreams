import API from "@/lib/api";

export async function getUniversities(params = {}) {
  const response = await API.get("/api/universities", {
    params,
  });

  const data = response.data?.data ?? {};

  return {
    universities: data.universities ?? [],

    pagination: data.pagination ?? {
      currentPage: data.currentPage ?? 1,
      totalPages: data.totalPages ?? 1,
      totalItems: data.totalItems ?? data.totalUniversities ?? 0,
      limit: data.limit ?? params.limit ?? 12,
    },
  };
}

export async function getFeaturedUniversities(limit = 6) {
  const result = await getUniversities({
    featured: true,
    page: 1,
    limit,
    sort: "displayOrder",
    order: "asc",
  });

  return result.universities;
}

export async function getUniversityBySlug(slug) {
  if (!slug) {
    throw new Error("University slug is required");
  }

  const response = await API.get(
    `/api/universities/${encodeURIComponent(slug)}`,
  );

  return response.data?.data ?? null;
}
