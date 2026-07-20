import axios, { AxiosError } from "axios";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
/** Origine du backend sans le prefixe /api (ex: http://localhost:4000). */
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

/** URL pour afficher le PDF dans le navigateur (apercu inline). */
export function getEpreuvePreviewUrl(fichierUrl: string): string {
  if (fichierUrl.startsWith("http://") || fichierUrl.startsWith("https://")) {
    return fichierUrl;
  }
  return `${API_ORIGIN}${fichierUrl.startsWith("/") ? fichierUrl : `/${fichierUrl}`}`;
}
const TOKEN_KEY = "epreuves.token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export const api = axios.create({
  baseURL: API_URL,
});

// Ajoute le token JWT a chaque requete.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Deconnexion automatique si le token est invalide/expire.
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401 && getToken()) {
      setToken(null);
      if (!window.location.pathname.startsWith("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

// Extrait un message d'erreur lisible depuis une erreur axios.
export function getErrorMessage(error: unknown, fallback = "Une erreur est survenue"): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: { message?: string } } | undefined;
    return data?.error?.message ?? error.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
