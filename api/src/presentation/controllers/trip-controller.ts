import type {
  CreateTripDto,
  TripFilterDto,
  UpdateTripDto,
} from "@/application/dtos/trip-dto";
import {
  createTripUseCase,
  deleteTripUseCase,
  getAllTripsUseCase,
  getTripByIdUseCase,
  updateTripUseCase,
} from "@/application/use-cases/trip-use-cases";
import { tripRepositoryImpl } from "@/domain/repositories/trip-repository-impl";
import type { Request, Response } from "express";

export const createTrip = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const tripData: CreateTripDto = req.body;

    const createTrip = createTripUseCase(tripRepositoryImpl);
    const result = await createTrip(tripData);

    res.status(201).json(result);
  } catch (error) {
    console.error("Create trip error:", error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllTrips = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const filters: TripFilterDto = req.query as any;

    const getTrips = getAllTripsUseCase(tripRepositoryImpl);
    const result = await getTrips(filters);

    res.json(result);
  } catch (error) {
    console.error("Get trips error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTripById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const getTrip = getTripByIdUseCase(tripRepositoryImpl);
    const result = await getTrip(id);

    if (!result) {
      res.status(404).json({ error: "Trip not found" });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error("Get trip error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTrip = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateTripDto = req.body;

    const updateTripCase = updateTripUseCase(tripRepositoryImpl);
    const result = await updateTripCase(id, updateData);

    if (!result) {
      res.status(404).json({ error: "Trip not found" });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error("Update trip error:", error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTrip = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const deleteTripCase = deleteTripUseCase(tripRepositoryImpl);
    const result = await deleteTripCase(id);

    if (!result) {
      res.status(404).json({ error: "Trip not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error("Delete trip error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
