import API from "@/lib/api";

export async function adminLogin(credentials) {
  const response = await API.post("/api/auth/login", credentials);

  const responseData = response.data || {};
  const data = responseData.data || responseData;

  return {
    token:
      data.token ||
      data.accessToken ||
      responseData.token ||
      responseData.accessToken ||
      null,

    user:
      data.user ||
      data.admin ||
      responseData.user ||
      responseData.admin ||
      null,

    message: responseData.message || data.message || "Login successful",
  };
}

export function saveAdminSession({ token, user, remember }) {
  if (typeof window === "undefined") return;

  const selectedStorage = remember ? localStorage : sessionStorage;
  const otherStorage = remember ? sessionStorage : localStorage;

  otherStorage.removeItem("admin_token");
  otherStorage.removeItem("admin_user");

  if (token) {
    selectedStorage.setItem("admin_token", token);
  }

  if (user) {
    selectedStorage.setItem("admin_user", JSON.stringify(user));
  }
}

export function getAdminToken() {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("admin_token") || sessionStorage.getItem("admin_token")
  );
}

export function getStoredAdmin() {
  if (typeof window === "undefined") return null;

  try {
    const storedUser =
      localStorage.getItem("admin_user") ||
      sessionStorage.getItem("admin_user");

    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");

  sessionStorage.removeItem("admin_token");
  sessionStorage.removeItem("admin_user");
}
