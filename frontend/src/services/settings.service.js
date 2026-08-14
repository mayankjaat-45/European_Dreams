import API from "@/lib/api";

export async function getPublicSettings() {
  const response = await API.get("/api/settings");

  return response.data?.data?.settings;
}
