export type SortDirection = "asc" | "desc" | null;

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

export type TripSortField =
  | "driver" // conductor
  | "truck" // camión
  | "fuel" // combustible
  | "status" // estado
  | "liters" // cantidad litros
  | "departureDate" // fecha salida
  | "origin" // origen
  | "destination"; // destino

export interface TripSortConfig {
  field: TripSortField;
  direction: SortDirection;
}
