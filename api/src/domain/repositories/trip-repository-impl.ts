import type { Trip } from "@/domain/entities/trip";
import { TripStatus } from "@/domain/entities/trip";
import type { TripRepository } from "@/domain/repositories/trip-repository";
import {
  TripModel,
  type TripDocument,
} from "@/infrastructure/database/schemas/trip-schema";

const mapToEntity = (doc: TripDocument): Trip => ({
  id: doc._id.toString(),
  truck: doc.truck,
  driver: doc.driver,
  origin: doc.origin,
  destination: doc.destination,
  fuel: doc.fuel,
  liters: doc.liters,
  departureDate: doc.departureDate,
  status: doc.status,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export const tripRepositoryImpl: TripRepository = {
  async findAll(): Promise<Trip[]> {
    const trips = await TripModel.find().sort({ createdAt: -1 });
    return trips.map(mapToEntity);
  },

  async findById(id: string): Promise<Trip | null> {
    const trip = await TripModel.findById(id);
    return trip ? mapToEntity(trip) : null;
  },

  async findByStatus(status: string): Promise<Trip[]> {
    const trips = await TripModel.find({ status }).sort({ createdAt: -1 });
    return trips.map(mapToEntity);
  },

  async findByDriver(driver: string): Promise<Trip[]> {
    const trips = await TripModel.find({
      driver: { $regex: driver, $options: "i" },
    }).sort({ createdAt: -1 });
    return trips.map(mapToEntity);
  },

  async findByFuel(fuel: string): Promise<Trip[]> {
    const trips = await TripModel.find({ fuel }).sort({ createdAt: -1 });
    return trips.map(mapToEntity);
  },

  async create(
    trip: Omit<Trip, "id" | "createdAt" | "updatedAt">
  ): Promise<Trip> {
    const createdTrip = await TripModel.create(trip);
    return mapToEntity(createdTrip);
  },

  async update(id: string, trip: Partial<Trip>): Promise<Trip | null> {
    const updatedTrip = await TripModel.findByIdAndUpdate(id, trip, {
      new: true,
      runValidators: true,
    });
    return updatedTrip ? mapToEntity(updatedTrip) : null;
  },

  async delete(id: string): Promise<boolean> {
    const result = await TripModel.findByIdAndDelete(id);
    return !!result;
  },

  async softDelete(id: string): Promise<boolean> {
    const result = await TripModel.findByIdAndUpdate(
      id,
      { status: TripStatus.CANCELLED },
      { new: true }
    );
    return !!result;
  },
};
