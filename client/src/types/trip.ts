// Enums
export enum TripStatus {
  SCHEDULED = "Scheduled",
  IN_TRANSIT = "In Transit",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled",
}

export enum FuelType {
  DIESEL = "Diesel",
  SUPER_GASOLINE = "Super Gasoline",
  PREMIUM_GASOLINE = "Premium Gasoline",
  CNG = "CNG",
}

// Main Trip interface
export interface Trip {
  id: string;
  truck: string;
  driver: string;
  origin: string;
  destination: string;
  fuel: FuelType;
  liters: number;
  departureDate: string; // ISO string from API
  status: TripStatus;
  createdAt: string;
  updatedAt: string;
}

// Request DTOs for API calls
export interface CreateTripRequest {
  truck: string;
  driver: string;
  origin: string;
  destination: string;
  fuel: FuelType;
  liters: number;
  departureDate: string; // ISO string to send to API
}

export interface UpdateTripRequest {
  truck?: string;
  driver?: string;
  origin?: string;
  destination?: string;
  fuel?: FuelType;
  liters?: number;
  departureDate?: string;
  status?: TripStatus;
}

// Filter interface for queries
export interface TripFilters {
  status?: TripStatus;
  driver?: string;
  fuel?: FuelType;
  dateFrom?: string;
  dateTo?: string;
}
