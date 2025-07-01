import type { FuelType, TripStatus } from "@/domain/entities/trip";

export interface CreateTripDto {
  truck: string;
  driver: string;
  origin: string;
  destination: string;
  fuel: FuelType;
  liters: number;
  departureDate: string; // ISO string from frontend
}

export interface UpdateTripDto {
  truck?: string;
  driver?: string;
  origin?: string;
  destination?: string;
  fuel?: FuelType;
  liters?: number;
  departureDate?: string;
  status?: TripStatus;
}

export interface TripFilterDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: TripStatus;
  driver?: string;
  fuel?: FuelType;
  dateFrom?: string;
  dateTo?: string;
}

export interface TripResponseDto {
  id: string;
  truck: string;
  driver: string;
  origin: string;
  destination: string;
  fuel: FuelType;
  liters: number;
  departureDate: string;
  status: TripStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedTripsResponse {
  data: TripResponseDto[];
  pagination: PaginationMeta;
}
