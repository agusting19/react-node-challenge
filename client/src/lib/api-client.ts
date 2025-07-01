/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000, // 20s timeout para uploads
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth token utilities
export const getAuthToken = (): string | null => {
  return localStorage.getItem("fuel_track_manager_auth_token");
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem("fuel_track_manager_auth_token", token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem("fuel_track_manager_auth_token");
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Error handler
const handleApiError = (error: AxiosError): Error => {
  const message =
    (error.response?.data as any)?.message ||
    error.message ||
    "Ha ocurrido un error inesperado";

  return new Error(message);
};

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Auto logout en 401
    if (error.response?.status === 401) {
      clearAuthToken();

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(handleApiError(error));
  }
);

// Generic API functions
export const get = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.get<T>(url, config);
  return response.data;
};

export const post = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
};

export const patch = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.patch<T>(url, data, config);
  return response.data;
};

export const del = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
};
