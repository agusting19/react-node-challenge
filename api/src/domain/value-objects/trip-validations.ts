import { FuelType, TripStatus } from "@/domain/entities/trip";
import type { Trip } from "../entities/trip";

export const MAX_LITERS = 30000;

export const validateLiters = (liters: number): void => {
  if (liters <= 0) {
    throw new Error("Liters must be greater than 0");
  }

  if (liters > MAX_LITERS) {
    throw new Error(`Liters cannot exceed ${MAX_LITERS}`);
  }
};

export const validateDepartureDate = (date: Date): void => {
  const now = new Date();
  if (date < now) {
    throw new Error("Departure date cannot be in the past");
  }
};

export const validateTrip = (trip: Partial<Trip>): void => {
  if (trip.liters) validateLiters(trip.liters);
  if (trip.departureDate) validateDepartureDate(trip.departureDate);
};

// Validation helpers for enum values
export const isValidTripStatus = (value: string): value is TripStatus => {
  return Object.values(TripStatus).includes(value as TripStatus);
};

export const isValidFuelType = (value: string): value is FuelType => {
  return Object.values(FuelType).includes(value as FuelType);
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Unknown error occurred";
};

export type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

export const validateTripSafe = (trip: Partial<Trip>): ValidationResult => {
  const errors: string[] = [];

  try {
    if (trip.liters) validateLiters(trip.liters);
  } catch (error) {
    errors.push(getErrorMessage(error));
  }

  try {
    if (trip.departureDate) validateDepartureDate(trip.departureDate);
  } catch (error) {
    errors.push(getErrorMessage(error));
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
