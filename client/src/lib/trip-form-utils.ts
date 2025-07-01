import type { CreateTripRequest } from "@/types/trip";
import { FuelType, TripStatus } from "@/types/trip";
import { z } from "zod";

// Form data type for CREATE
export interface TripFormData {
  truck: string;
  driver: string;
  origin: string;
  destination: string;
  fuel: FuelType;
  liters: number;
  departureDate: string;
}

// Form data type for EDIT
export interface EditTripFormData extends TripFormData {
  status: TripStatus;
}

// Base schema for trip form validation
const baseTripSchema = {
  truck: z
    .string()
    .min(1, "Camión es requerido")
    .max(20, "Camión no puede exceder 20 caracteres"),

  driver: z
    .string()
    .min(1, "Conductor es requerido")
    .max(100, "Nombre del conductor no puede exceder 100 caracteres"),

  origin: z
    .string()
    .min(1, "Origen es requerido")
    .max(100, "Origen no puede exceder 100 caracteres"),

  destination: z
    .string()
    .min(1, "Destino es requerido")
    .max(100, "Destino no puede exceder 100 caracteres"),

  fuel: z.nativeEnum(FuelType, {
    errorMap: () => ({ message: "Selecciona un tipo de combustible válido" }),
  }),

  liters: z
    .number()
    .min(1, "La cantidad debe ser mayor a 0")
    .max(30000, "La cantidad no puede exceder 30,000 litros")
    .int("La cantidad debe ser un número entero"),

  departureDate: z
    .string()
    .min(1, "Fecha de salida es requerida")
    .refine((date) => {
      const selectedDate = new Date(date);
      const now = new Date();
      return selectedDate > now;
    }, "La fecha de salida debe ser posterior al momento actual"),
};

export const tripFormSchema = z.object(baseTripSchema);

export const editTripFormSchema = z.object({
  ...baseTripSchema,
  status: z.nativeEnum(TripStatus, {
    errorMap: () => ({ message: "Selecciona un estado válido" }),
  }),
});

// Constants for select options
export const FUEL_TYPES = [
  { value: FuelType.DIESEL, label: "Diésel" },
  { value: FuelType.SUPER_GASOLINE, label: "Nafta Súper" },
  { value: FuelType.PREMIUM_GASOLINE, label: "Nafta Premium" },
  { value: FuelType.CNG, label: "GNC" },
] as const;

// Default values
export const defaultTripFormValues: TripFormData = {
  truck: "",
  driver: "",
  origin: "",
  destination: "",
  fuel: FuelType.DIESEL,
  liters: 0,
  departureDate: "",
};

export const defaultEditTripFormValues: EditTripFormData = {
  ...defaultTripFormValues,
  status: TripStatus.SCHEDULED,
};

// Convert form data to API request format
export const convertFormDataToRequest = (
  formData: TripFormData
): CreateTripRequest => {
  return {
    truck: formData.truck.toUpperCase().trim(),
    driver: formData.driver.trim(),
    origin: formData.origin.trim(),
    destination: formData.destination.trim(),
    fuel: formData.fuel,
    liters: formData.liters,
    departureDate: new Date(formData.departureDate).toISOString(),
  };
};

// Helper to format datetime-local input value
export const formatDateTimeLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Helper to get minimum datetime for form input (now + 1 hour)
export const getMinDateTime = (): string => {
  const now = new Date();
  now.setHours(now.getHours() + 1); // Add 1 hour to current time
  return formatDateTimeLocal(now);
};
