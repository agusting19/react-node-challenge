import type { Trip } from "@/types/trip";
import { create } from "zustand";

interface TripStore {
  // Create Trip Sheet
  isCreateSheetOpen: boolean;
  openCreateSheet: () => void;
  closeCreateSheet: () => void;

  // Edit Trip Sheet
  isEditSheetOpen: boolean;
  tripToEdit: Trip | null;
  openEditSheet: (trip: Trip) => void;
  closeEditSheet: () => void;

  // Delete Trip Dialog
  isDeleteDialogOpen: boolean;
  tripToDelete: Trip | null;
  openDeleteDialog: (trip: Trip) => void;
  closeDeleteDialog: () => void;
}

export const useTripStore = create<TripStore>((set) => ({
  // Create Trip Sheet
  isCreateSheetOpen: false,
  openCreateSheet: () => set({ isCreateSheetOpen: true }),
  closeCreateSheet: () => set({ isCreateSheetOpen: false }),

  // Edit Trip Sheet
  isEditSheetOpen: false,
  tripToEdit: null,
  openEditSheet: (trip) =>
    set({
      isEditSheetOpen: true,
      tripToEdit: trip,
    }),
  closeEditSheet: () =>
    set({
      isEditSheetOpen: false,
      tripToEdit: null,
    }),

  // Delete Trip Dialog
  isDeleteDialogOpen: false,
  tripToDelete: null,
  openDeleteDialog: (trip) =>
    set({
      isDeleteDialogOpen: true,
      tripToDelete: trip,
    }),
  closeDeleteDialog: () =>
    set({
      isDeleteDialogOpen: false,
      tripToDelete: null,
    }),
}));
