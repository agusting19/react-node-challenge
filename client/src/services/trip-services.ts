import { del, get, patch, post } from "@/lib/api-client";
import type { PaginatedResponse, PaginationParams } from "@/types/api";
import type { CreateTripRequest, Trip, UpdateTripRequest } from "@/types/trip";

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
): Promise<PaginatedResponse<Trip>> => {
  const queryString = buildQueryString(params);
  const url = queryString ? `/api/trips?${queryString}` : "/api/trips";
  return await get<PaginatedResponse<Trip>>(url);
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
  return await patch<Trip>(`/api/trips/${id}`, updateData);
};

export const deleteTrip = async (id: string): Promise<void> => {
  await del(`/api/trips/${id}`);
};
