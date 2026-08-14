import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

if (!backendUrl) {
  console.warn("NEXT_PUBLIC_API_URL is missing. Add it to frontend/.env.local");
}

const API = axios.create({
  baseURL: backendUrl || "http://localhost:5000",
  timeout: 15000,
  withCredentials: true,

  headers: {
    Accept: "application/json",
  },
});

API.interceptors.response.use(
  (response) => response,

  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    error.message = message;

    return Promise.reject(error);
  },
);

export default API;
