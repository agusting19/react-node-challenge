import type { PaginationParams } from "@/types/api";
import type {
  AuthApiResponse,
  AuthResponse,
  LoginRequest,
  UserRole,
} from "@/types/auth";
import type { CreateTripRequest, Trip, UpdateTripRequest } from "@/types/trip";
import {
  clearAuthToken,
  del,
  get,
  post,
  put,
  setAuthToken,
} from "./api-client";

// Auth API
export const login = async (
  credentials: LoginRequest
): Promise<AuthResponse> => {
  const apiResponse = await post<AuthApiResponse>(
    "/api/auth/login",
    credentials
  );

  const response: AuthResponse = {
    success: true,
    token: apiResponse.token,
    user: {
      id: apiResponse.user.id,
      email: apiResponse.user.email,
      name: apiResponse.user.name,
      role: apiResponse.user.role as UserRole,
    },
  };

  if (response.token) {
    setAuthToken(response.token);
  }

  return response;
};

export const logout = async (): Promise<void> => {
  clearAuthToken();
};

// Health API
export const checkHealth = async (): Promise<{
  status: string;
  timestamp: string;
}> => {
  return await get("/health");
};

// Helper function to build query string
const buildQueryString = (params: PaginationParams): string => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.search) searchParams.append("search", params.search);
  if (params.status && params.status !== "all")
    searchParams.append("status", params.status);
  if (params.driver) searchParams.append("driver", params.driver);
  if (params.fuel) searchParams.append("fuel", params.fuel);

  return searchParams.toString();
};

// Trips API
export const getTrips = async (
  params: PaginationParams = {}
): Promise<Trip[]> => {
  const queryString = buildQueryString(params);
  const url = queryString ? `/api/trips?${queryString}` : "/api/trips";
  return await get<Trip[]>(url);
};

export const getTrip = async (id: string): Promise<Trip> => {
  return await get<Trip>(`/api/trips/${id}`);
};

export const createTrip = async (
  tripData: CreateTripRequest
): Promise<Trip> => {
  return await post<Trip>("/api/trips", tripData);
};

export const updateTrip = async (
  id: string,
  updateData: UpdateTripRequest
): Promise<Trip> => {
  return await put<Trip>(`/api/trips/${id}`, updateData);
};

export const deleteTrip = async (id: string): Promise<void> => {
  await del(`/api/trips/${id}`);
};
