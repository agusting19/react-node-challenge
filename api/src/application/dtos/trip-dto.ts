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
