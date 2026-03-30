const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

export function setToken(token: string) {
  localStorage.setItem("admin_token", token);
}

export function removeToken() {
  localStorage.removeItem("admin_token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, { headers, ...options });

  if (res.status === 401) {
    removeToken();
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
      window.location.href = "/admin/login";
    }
    throw new Error("Unauthorized");
  }

  if (res.status === 204) return null as T;
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `API error: ${res.status}` }));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  return res.json();
}

// Auth
export const login = (data: { login: string; password: string }) =>
  request<{ token: string }>("/auth/login", { method: "POST", body: JSON.stringify(data) });

// Artists (GET — public, rest — admin)
export const getArtists = () => request<any[]>("/artists");
export const getArtist = (id: string) => request<any>(`/artists/${id}`);
export const createArtist = (data: { name: string; bio?: string; photoUrl?: string; styles?: string[] }) =>
  request<any>("/artists", { method: "POST", body: JSON.stringify(data) });
export const updateArtist = (id: string, data: any) =>
  request<any>(`/artists/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteArtist = (id: string) =>
  request<void>(`/artists/${id}`, { method: "DELETE" });

// Bookings (POST — public, rest — admin)
export const createBooking = (data: { name: string; phone: string; email?: string; message?: string; date: string; artistId: string }) =>
  request<any>("/bookings", { method: "POST", body: JSON.stringify(data) });
export const getBookings = () => request<any[]>("/bookings");
export const getBookedSlots = (artistId: string) => request<string[]>(`/bookings/slots/${artistId}`);
export const updateBooking = (id: string, data: { status: string }) =>
  request<any>(`/bookings/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteBooking = (id: string) =>
  request<void>(`/bookings/${id}`, { method: "DELETE" });

// Services (GET — public, rest — admin)
export const getServices = () => request<any[]>("/services");
export const createService = (data: { name: string; description?: string; price: number; imageUrl?: string }) =>
  request<any>("/services", { method: "POST", body: JSON.stringify(data) });
export const updateService = (id: string, data: any) =>
  request<any>(`/services/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteService = (id: string) =>
  request<void>(`/services/${id}`, { method: "DELETE" });

// Portfolio (GET — public, rest — admin)
export const getPortfolio = (params?: { style?: string; artistId?: string }) => {
  const query = params ? new URLSearchParams(params as Record<string, string>).toString() : "";
  return request<any[]>(`/portfolio${query ? `?${query}` : ""}`);
};
export const createPortfolioItem = (data: { imageUrl: string; title?: string; style?: string; artistId: string }) =>
  request<any>("/portfolio", { method: "POST", body: JSON.stringify(data) });
export const updatePortfolioItem = (id: string, data: any) =>
  request<any>(`/portfolio/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deletePortfolioItem = (id: string) =>
  request<void>(`/portfolio/${id}`, { method: "DELETE" });

// Upload
export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}/upload`, { method: "POST", headers, body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Ошибка загрузки" }));
    throw new Error(err.error || "Ошибка загрузки");
  }
  const data = await res.json();
  return data.url;
}

// Schedule — stored as JSON field on Artist
export const getArtistSchedule = (id: string) =>
  request<Record<string, string[]>>(`/artists/${id}/schedule`);
export const updateArtistSchedule = (id: string, schedule: Record<string, string[]>) =>
  request<any>(`/artists/${id}/schedule`, { method: "PUT", body: JSON.stringify({ schedule }) });

// Stats
export const getStats = () => request<any>("/stats");

// Health
export const checkHealth = () => request<{ status: string }>("/health");
