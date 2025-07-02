import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTableSorting } from "@/hooks/useTableSorting";
import type { PaginationMeta } from "@/types/api";
import type { Trip } from "@/types/trip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SortableTableHeader } from "./SortableTableHeader";
import TableSkeleton from "./TableSkeleton";
import { TripRow } from "./TripRow";

export function TripsTable({
  trips,
  pagination,
  currentPage,
  onPageChange,
  isLoading = false,
}: {
  trips: Trip[];
  pagination?: PaginationMeta;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}) {
  const { sortedData, sortConfig, handleSort } = useTableSorting(trips);

  const handlePrevPage = () => {
    if (pagination?.hasPrev) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination?.hasNext) {
      onPageChange(currentPage + 1);
    }
  };

  const renderTableBody = () => {
    if (isLoading) return <TableSkeleton />;

    if (sortedData.length === 0) {
      return (
        <TableRow>
          <td colSpan={8} className="text-center py-8 text-muted-foreground">
            No se encontraron viajes
          </td>
        </TableRow>
      );
    }

    return sortedData.map((trip) => <TripRow key={trip.id} trip={trip} />);
  };

  const renderPaginationInfo = () => {
    const tripsCount = sortedData.length;
    const totalCount = pagination?.total || tripsCount;

    if (totalCount === 0) {
      return (
        <div className="text-xs text-muted-foreground">
          No hay viajes para mostrar
        </div>
      );
    }

    if (!pagination) {
      return (
        <div className="text-xs text-muted-foreground">
          Mostrando <strong>{tripsCount}</strong> de{" "}
          <strong>{totalCount}</strong> viajes
        </div>
      );
    }

    const { page, limit } = pagination;
    const startItem = totalCount > 0 ? Math.max(1, (page - 1) * limit + 1) : 0;
    const endItem = Math.min(page * limit, totalCount);

    return (
      <div className="text-xs text-muted-foreground">
        Mostrando{" "}
        <strong>
          {startItem}-{endItem}
        </strong>{" "}
        de <strong>{totalCount}</strong> viajes
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Viajes de Combustible</CardTitle>
        <CardDescription>
          Gestiona y monitorea todos los viajes de transporte de combustible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHeader
                field="driver"
                currentSort={sortConfig}
                onSort={handleSort}
              >
                Conductor
              </SortableTableHeader>
              <SortableTableHeader
                field="truck"
                currentSort={sortConfig}
                onSort={handleSort}
              >
                Camión
              </SortableTableHeader>
              <SortableTableHeader
                field="origin"
                onSort={handleSort}
                className="hidden md:table-cell"
                sortable={false}
              >
                Ruta
              </SortableTableHeader>
              <SortableTableHeader
                field="fuel"
                currentSort={sortConfig}
                onSort={handleSort}
                className="hidden md:table-cell"
              >
                Combustible
              </SortableTableHeader>
              <SortableTableHeader
                field="liters"
                currentSort={sortConfig}
                onSort={handleSort}
                className="hidden lg:table-cell"
              >
                Litros
              </SortableTableHeader>
              <SortableTableHeader
                field="departureDate"
                currentSort={sortConfig}
                onSort={handleSort}
                className="hidden lg:table-cell"
              >
                Salida
              </SortableTableHeader>
              <SortableTableHeader
                field="status"
                currentSort={sortConfig}
                onSort={handleSort}
                className="hidden sm:table-cell"
              >
                Estado
              </SortableTableHeader>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderTableBody()}</TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex items-center w-full justify-between">
          {renderPaginationInfo()}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevPage}
              disabled={!pagination?.hasPrev || isLoading}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
            {pagination && (
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <span>Página</span>
                <strong>{pagination.page}</strong>
                <span>de</span>
                <strong>{pagination.totalPages}</strong>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextPage}
              disabled={!pagination?.hasNext || isLoading}
            >
              Siguiente
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
