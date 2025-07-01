import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { useDeleteTrip } from "@/hooks/api-hooks";
import { useTripStore } from "@/stores/useTripStore";
import { FuelType, TripStatus, type Trip } from "@/types/trip";
import { Loader2, MapPin, MoreHorizontal } from "lucide-react";

const getStatusVariant = (status: TripStatus) => {
  switch (status) {
    case TripStatus.SCHEDULED:
      return "secondary";
    case TripStatus.IN_TRANSIT:
      return "default";
    case TripStatus.DELIVERED:
      return "outline";
    case TripStatus.CANCELLED:
      return "destructive";
    default:
      return "secondary";
  }
};

const getFuelVariant = (fuel: FuelType) => {
  switch (fuel) {
    case FuelType.DIESEL:
      return "default";
    case FuelType.SUPER_GASOLINE:
      return "secondary";
    case FuelType.PREMIUM_GASOLINE:
      return "outline";
    case FuelType.CNG:
      return "destructive";
    default:
      return "outline";
  }
};

const FUEL_LABELS: Record<FuelType, string> = {
  [FuelType.DIESEL]: "Diésel",
  [FuelType.SUPER_GASOLINE]: "Nafta Súper",
  [FuelType.PREMIUM_GASOLINE]: "Nafta Premium",
  [FuelType.CNG]: "GNC",
};

const STATUS_LABELS: Record<TripStatus, string> = {
  [TripStatus.SCHEDULED]: "Programado",
  [TripStatus.IN_TRANSIT]: "En Tránsito",
  [TripStatus.DELIVERED]: "Entregado",
  [TripStatus.CANCELLED]: "Cancelado",
};

export function TripRow({ trip }: { trip: Trip }) {
  const deleteTrip = useDeleteTrip();

  // Zustand store
  const {
    openEditSheet,
    isDeleteDialogOpen,
    tripToDelete,
    openDeleteDialog,
    closeDeleteDialog,
  } = useTripStore();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatLiters = (liters: number) => {
    return new Intl.NumberFormat("es-AR").format(liters);
  };

  const fuelLabel = FUEL_LABELS[trip.fuel] || trip.fuel;
  const statusLabel = STATUS_LABELS[trip.status] || trip.status;

  const handleDelete = async () => {
    try {
      await deleteTrip.mutateAsync(trip.id);
      closeDeleteDialog();
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  const handleEdit = () => {
    openEditSheet(trip);
  };

  const isCurrentTripInDialog = tripToDelete?.id === trip.id;

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          <div className="space-y-1">
            <span>{trip.driver}</span>
            <div className="text-xs text-muted-foreground">
              Creado: {formatDate(trip.createdAt)}
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {trip.truck}
            </Badge>
          </div>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <div className="space-y-1 max-w-[200px]">
            <div className="flex items-center gap-1 text-sm">
              <MapPin className="h-3 w-3 text-green-600" />
              <span className="truncate">{trip.origin}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <MapPin className="h-3 w-3 text-red-600" />
              <span className="truncate">{trip.destination}</span>
            </div>
          </div>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <Badge variant={getFuelVariant(trip.fuel)}>{fuelLabel}</Badge>
        </TableCell>
        <TableCell className="hidden lg:table-cell">
          <span className="font-medium">{formatLiters(trip.liters)}</span>
          <div className="text-xs text-muted-foreground">litros</div>
        </TableCell>
        <TableCell className="hidden lg:table-cell">
          <div className="text-sm">{formatDate(trip.departureDate)}</div>
        </TableCell>
        <TableCell className="hidden sm:table-cell">
          <Badge variant={getStatusVariant(trip.status)}>{statusLabel}</Badge>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleEdit}>Editar</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openDeleteDialog(trip)}
                className="text-red-600"
              >
                Cancelar viaje
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      {isCurrentTripInDialog && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Cancelar viaje?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción cancelará permanentemente el viaje de{" "}
                <strong>"{trip.driver}"</strong> con destino a{" "}
                <strong>"{trip.destination}"</strong>. Esta acción no se puede
                deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteTrip.isPending}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteTrip.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteTrip.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Cancelar viaje
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
