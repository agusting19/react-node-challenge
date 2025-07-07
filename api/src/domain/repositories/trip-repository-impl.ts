import type { TripFilterDto } from "@/application/dtos/trip-dto";
import type { Trip } from "@/domain/entities/trip";
import { FuelType, TripStatus } from "@/domain/entities/trip";
import type { TripRepository } from "@/domain/repositories/trip-repository";
import {
  TripModel,
  type TripDocument,
} from "@/infrastructure/database/schemas/trip-schema";

// Tag mapping in Spanish at values ​​in English
const SPANISH_FUEL_MAPPING: Record<string, FuelType[]> = {
  diésel: [FuelType.DIESEL],
  diesel: [FuelType.DIESEL],
  nafta: [FuelType.SUPER_GASOLINE, FuelType.PREMIUM_GASOLINE],
  super: [FuelType.SUPER_GASOLINE],
  premium: [FuelType.PREMIUM_GASOLINE],
  gnc: [FuelType.CNG],
  cng: [FuelType.CNG],
  gas: [FuelType.CNG],
  gasoline: [FuelType.SUPER_GASOLINE, FuelType.PREMIUM_GASOLINE],
  súper: [FuelType.SUPER_GASOLINE],
  súpere: [FuelType.SUPER_GASOLINE],
};

// Function to obtain types of fuel based on search
const getFuelTypesFromSearch = (searchTerm: string): FuelType[] => {
  const normalizedSearch = searchTerm.toLowerCase().trim();
  const matchingFuels: FuelType[] = [];

  if (SPANISH_FUEL_MAPPING[normalizedSearch]) {
    matchingFuels.push(...SPANISH_FUEL_MAPPING[normalizedSearch]);
  }

  Object.keys(SPANISH_FUEL_MAPPING).forEach((key) => {
    if (key.includes(normalizedSearch) || normalizedSearch.includes(key)) {
      matchingFuels.push(...SPANISH_FUEL_MAPPING[key]);
    }
  });

  return [...new Set(matchingFuels)];
};

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

  async findAllPaginated(
    filters: TripFilterDto
  ): Promise<{ trips: Trip[]; total: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      const searchConditions: any[] = [
        { driver: { $regex: filters.search, $options: "i" } },
        { truck: { $regex: filters.search, $options: "i" } },
        { origin: { $regex: filters.search, $options: "i" } },
        { destination: { $regex: filters.search, $options: "i" } },
      ];

      const fuelTypes = getFuelTypesFromSearch(filters.search);
      if (fuelTypes.length > 0) {
        searchConditions.push({ fuel: { $in: fuelTypes } });
      }

      query.$or = searchConditions;
    }

    if (filters.driver) {
      query.driver = { $regex: filters.driver, $options: "i" };
    }

    if (filters.fuel) {
      query.fuel = filters.fuel;
    }

    const [trips, total] = await Promise.all([
      TripModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      TripModel.countDocuments(query),
    ]);

    return {
      trips: trips.map(mapToEntity),
      total,
    };
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
