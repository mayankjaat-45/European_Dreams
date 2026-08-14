import "server-only";

import { unstable_cache } from "next/cache";

async function fetchSiteSettings() {
  const backendUrl = process.env.API_URL?.replace(/\/+$/, "");

  if (!backendUrl) {
    throw new Error("API_URL is not configured.");
  }

  const settingsUrl = backendUrl.endsWith("/api")
    ? `${backendUrl}/settings`
    : `${backendUrl}/api/settings`;

  const response = await fetch(settingsUrl, {
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(
      `Settings request failed: ${response.status} ${response.statusText}`,
    );
  }

  const result = await response.json();

  return result?.data?.settings || result?.data || null;
}

const getCachedSiteSettings = unstable_cache(
  fetchSiteSettings,
  ["site-settings"],
  {
    revalidate: 300,
    tags: ["site-settings"],
  },
);

export async function getSiteSettings() {
  try {
    return await getCachedSiteSettings();
  } catch (error) {
    console.warn(
      "Unable to load site settings:",
      error.cause?.message || error.message,
    );

    return null;
  }
}
