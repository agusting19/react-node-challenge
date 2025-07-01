import type {
  CreateTripDto,
  TripFilterDto,
  TripResponseDto,
  UpdateTripDto,
} from "@/application/dtos/trip-dto";
import type { Trip } from "@/domain/entities/trip";
import { TripStatus } from "@/domain/entities/trip";
import type { TripRepository } from "@/domain/repositories/trip-repository";
import { validateTrip } from "@/domain/value-objects/trip-validations";

export const createTripUseCase = (tripRepository: TripRepository) => {
  return async (tripData: CreateTripDto): Promise<TripResponseDto> => {
    // Convert DTO to domain entity
    const trip: Omit<Trip, "id" | "createdAt" | "updatedAt"> = {
      ...tripData,
      departureDate: new Date(tripData.departureDate),
      status: TripStatus.SCHEDULED,
    };

    // Validate business rules
    validateTrip(trip);

    // Create trip
    const createdTrip = await tripRepository.create(trip);

    // Convert to response DTO
    return mapTripToResponseDto(createdTrip);
  };
};

export const getAllTripsUseCase = (tripRepository: TripRepository) => {
  return async (filters?: TripFilterDto): Promise<TripResponseDto[]> => {
    let trips: Trip[];

    if (filters?.status) {
      trips = await tripRepository.findByStatus(filters.status);
    } else if (filters?.driver) {
      trips = await tripRepository.findByDriver(filters.driver);
    } else if (filters?.fuel) {
      trips = await tripRepository.findByFuel(filters.fuel);
    } else {
      trips = await tripRepository.findAll();
    }

    return trips.map(mapTripToResponseDto);
  };
};

export const getTripByIdUseCase = (tripRepository: TripRepository) => {
  return async (id: string): Promise<TripResponseDto | null> => {
    const trip = await tripRepository.findById(id);
    return trip ? mapTripToResponseDto(trip) : null;
  };
};

export const updateTripUseCase = (tripRepository: TripRepository) => {
  return async (
    id: string,
    updateData: UpdateTripDto
  ): Promise<TripResponseDto | null> => {
    // Convert dates if present
    const updateTrip: Partial<Trip> = {
      ...updateData,
      departureDate: updateData.departureDate
        ? new Date(updateData.departureDate)
        : undefined,
    };

    // Validate if updating critical fields
    if (updateTrip.liters || updateTrip.departureDate) {
      validateTrip(updateTrip);
    }

    const updatedTrip = await tripRepository.update(id, updateTrip);
    return updatedTrip ? mapTripToResponseDto(updatedTrip) : null;
  };
};

export const deleteTripUseCase = (tripRepository: TripRepository) => {
  return async (id: string): Promise<boolean> => {
    return await tripRepository.softDelete(id);
  };
};

// Helper function to map domain entity to response DTO
const mapTripToResponseDto = (trip: Trip): TripResponseDto => ({
  id: trip.id,
  truck: trip.truck,
  driver: trip.driver,
  origin: trip.origin,
  destination: trip.destination,
  fuel: trip.fuel,
  liters: trip.liters,
  departureDate: trip.departureDate.toISOString(),
  status: trip.status,
  createdAt: trip.createdAt?.toISOString() || "",
  updatedAt: trip.updatedAt?.toISOString() || "",
});
