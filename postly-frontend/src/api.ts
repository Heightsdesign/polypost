// src/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// ---------------------------------------------------------
// TOKEN MANAGEMENT
// ---------------------------------------------------------
export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem("postly_token", token);
  } else {
    localStorage.removeItem("postly_token");
  }
}

// Restore token on boot (but don't apply it globally)
const savedToken = localStorage.getItem("postly_token");
if (savedToken) {
  // we store it, but do NOT add it to default headers
  // because we inject it dynamically per request below
  console.log("Restoring saved token");
}

// ---------------------------------------------------------
// REQUEST INTERCEPTOR
// ---------------------------------------------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("postly_token");

  // Public endpoints: do NOT send Authorization
  const publicEndpoints = [
    "/auth/register/",
    "/auth/login/",
    "/auth/password-reset/",
    "/auth/password-reset/confirm/",
    "/brand/persona/",
    "/brand/persona/sample-captions/",
  ];

  // If URL contains any public endpoint — skip auth header
  if (publicEndpoints.some((ep) => config.url?.includes(ep))) {
    return config; // no token attached
  }

  // Attach token only for protected endpoints
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

// ---------------------------------------------------------
// PASSWORD RESET HELPERS
// ---------------------------------------------------------
export const requestPasswordReset = (email: string) =>
  api.post("/auth/password-reset/", { email });

export const confirmPasswordReset = (
  uid: string,
  token: string,
  new_password: string
) => api.post("/auth/password-reset/confirm/", { uid, token, new_password });

// --- Support & Reviews --- //

export type SupportTicketPayload = {
  email: string;
  subject: string;
  category: "bug" | "billing" | "idea" | "other";
  message: string;
};

export const submitSupportTicket = (payload: SupportTicketPayload) =>
  api.post("/support/", payload);

export type ReviewPayload = {
  rating: number;
  title?: string;
  comment: string;
};

export const fetchReviews = () => api.get("/reviews/");
export const submitReview = (payload: ReviewPayload) =>
  api.post("/reviews/", payload);

export const fetchFeaturedReviews = () => api.get("/reviews/featured/");

export default api;
