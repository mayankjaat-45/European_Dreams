// src/services/blog.service.js

import API from "@/lib/api";

export async function getBlogs(params = {}) {
  const response = await API.get("/api/blogs", {
    params,
  });

  const data = response.data?.data || {};

  return {
    blogs: data.blogs || [],
    pagination: data.pagination || {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      limit: 12,
    },
  };
}

export async function getBlogBySlug(slug) {
  const response = await API.get(`/api/blogs/${encodeURIComponent(slug)}`);

  return response.data?.data?.blog || null;
}

export async function getBlogCategories() {
  const response = await API.get("/api/blogs/categories");

  return response.data?.data?.categories || [];
}

export async function getFeaturedBlogs(limit = 3) {
  const result = await getBlogs({
    featured: true,
    page: 1,
    limit,
    sort: "publishedAt",
    order: "desc",
  });

  return result.blogs;
}

export async function getRelatedBlogs({ category, excludeSlug, limit = 3 }) {
  const result = await getBlogs({
    category,
    page: 1,
    limit: limit + 1,
    sort: "publishedAt",
    order: "desc",
  });

  return result.blogs
    .filter((blog) => blog.slug !== excludeSlug)
    .slice(0, limit);
}
