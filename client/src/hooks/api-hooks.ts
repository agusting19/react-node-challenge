import { QUERY_KEYS } from "@/lib/query-keys";
import {
  createTrip,
  deleteTrip,
  getTrips,
  updateTrip,
} from "@/services/trip-services";
import type { PaginationParams } from "@/types/api";
import type { UpdateTripRequest } from "@/types/trip";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useTrips = (params: PaginationParams = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.trips.list(params),
    queryFn: () => getTrips(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTrip,
    onSuccess: (trip) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trips.all });

      toast.success("¡Viaje creado exitosamente!", {
        description: `Conductor: ${trip.driver} | Camión: ${trip.truck}`,
      });
    },
    onError: (error: Error) => {
      toast.error("Error al crear el viaje", {
        description: error.message,
      });
    },
  });
};

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTripRequest }) =>
      updateTrip(id, data),
    onSuccess: (trip) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trips.all });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.trips.detail(trip.id),
      });

      toast.success("¡Viaje actualizado exitosamente!", {
        description: `${trip.driver} - ${trip.status}`,
      });
    },
    onError: (error: Error) => {
      toast.error("Error al actualizar el viaje", {
        description: error.message,
      });
    },
  });
};

export const useDeleteTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trips.all });

      toast.success("¡Viaje eliminado exitosamente!", {
        description: "El viaje ha sido cancelado correctamente",
      });
    },
    onError: (error: Error) => {
      toast.error("Error al eliminar el viaje", {
        description: error.message,
      });
    },
  });
};
