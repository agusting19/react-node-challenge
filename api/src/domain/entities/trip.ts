export interface Trip {
  id: string;
  truck: string;
  driver: string;
  origin: string;
  destination: string;
  fuel: FuelType;
  liters: number;
  departureDate: Date;
  status: TripStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

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
