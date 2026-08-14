import API from "@/lib/api";

export async function createEnquiry(payload) {
  const response = await API.post("/api/enquiries", payload);

  return response.data?.data ?? response.data;
}
