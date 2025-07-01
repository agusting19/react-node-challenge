import { TripsTable } from "@/components/dashboard/TripsTable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTrips } from "@/hooks/api-hooks";
import type { PaginationParams } from "@/types/api";
import type { TripStatus } from "@/types/trip";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";

interface TripsTabProps {
  status?: TripStatus; // "Scheduled", "In Transit", etc.
  searchTerm?: string;
}

function TripsTab({ status, searchTerm }: TripsTabProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const queryParams = useMemo<PaginationParams>(
    () => ({
      page: currentPage,
      limit: pageSize,
      search: searchTerm || undefined,
      status: status || undefined,
    }),
    [currentPage, searchTerm, status]
  );

  const { data, isLoading, isError, error, refetch, isFetching } =
    useTrips(queryParams);

  const resetPage = () => setCurrentPage(1);

  useMemo(() => {
    resetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, status]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Error al cargar los viajes: {error?.message}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Reintentar
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const trips = data?.data || [];
  const pagination = data?.pagination;

  return (
    <TripsTable
      trips={trips}
      pagination={pagination}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      isLoading={isFetching}
    />
  );
}

export default TripsTab;
