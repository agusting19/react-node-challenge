import { FuelType, type Trip, TripStatus } from "@/domain/entities/trip.js";
import mongoose, { Document, Schema } from "mongoose";

export interface TripDocument extends Omit<Trip, "id">, Document {
  _id: string;
}

const tripSchema = new Schema<TripDocument>(
  {
    truck: { type: String, required: true },
    driver: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    fuel: {
      type: String,
      enum: Object.values(FuelType),
      required: true,
    },
    liters: { type: Number, required: true, min: 1, max: 30000 },
    departureDate: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(TripStatus),
      default: TripStatus.SCHEDULED,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const TripModel = mongoose.model<TripDocument>("Trip", tripSchema);
