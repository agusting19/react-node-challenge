import type { Trip } from "@/domain/entities/trip";

export interface TripRepository {
  findAll(): Promise<Trip[]>;
  findById(id: string): Promise<Trip | null>;
  findByStatus(status: string): Promise<Trip[]>;
  findByDriver(driver: string): Promise<Trip[]>;
  findByFuel(fuel: string): Promise<Trip[]>;
  create(trip: Omit<Trip, "id" | "createdAt" | "updatedAt">): Promise<Trip>;
  update(id: string, trip: Partial<Trip>): Promise<Trip | null>;
  delete(id: string): Promise<boolean>;
  softDelete(id: string): Promise<boolean>;
}
