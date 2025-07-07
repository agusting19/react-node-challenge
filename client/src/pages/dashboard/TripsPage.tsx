import { CreateTripSheet } from "@/components/dashboard/CreateTripSheet";
import { EditTripSheet } from "@/components/dashboard/EditTripSheet";
import TripsTab from "@/components/dashboard/TripsTab";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTripStore } from "@/stores/useTripStore";
import { TripStatus } from "@/types/trip";
import { PlusCircle, Search, Truck, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const STATUS_OPTIONS = [
  { value: "scheduled", label: "Programados" },
  { value: "in-transit", label: "En Tránsito" },
  { value: "delivered", label: "Entregados" },
  { value: "cancelled", label: "Cancelados" },
  { value: "all", label: "Todos" },
];

function TripsPage() {
  const [activeTab, setActiveTab] = useState("scheduled");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchTerm = searchParams.get("q") || "";

  const {
    isCreateSheetOpen,
    openCreateSheet,
    closeCreateSheet,
    isEditSheetOpen,
    tripToEdit,
    closeEditSheet,
  } = useTripStore();

  const clearSearch = () => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.delete("q");

    const queryString = currentParams.toString();
    navigate(`${location.pathname}${queryString ? `?${queryString}` : ""}`);
  };

  const getCurrentTabLabel = () => {
    return (
      STATUS_OPTIONS.find((tab) => tab.value === activeTab)?.label ||
      "Programados"
    );
  };

  const getStatusFromTab = (tabValue: string): TripStatus | undefined => {
    const statusMap: Record<string, TripStatus> = {
      scheduled: TripStatus.SCHEDULED,
      "in-transit": TripStatus.IN_TRANSIT,
      delivered: TripStatus.DELIVERED,
      cancelled: TripStatus.CANCELLED,
    };
    return statusMap[tabValue];
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Truck className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Gestión de Viajes</h1>
          {searchTerm && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <Search className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Buscando:
              </span>
              <span className="text-sm font-semibold text-blue-900 dark:text-blue-100 bg-blue-100 dark:bg-blue-900/50 px-2 rounded">
                "{searchTerm}"
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="h-5 w-5 p-0 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                title="Limpiar búsqueda"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="sm:hidden">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue>{getCurrentTabLabel()}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <TabsList className="hidden sm:flex">
              <TabsTrigger value="scheduled">Programados</TabsTrigger>
              <TabsTrigger value="in-transit">En Tránsito</TabsTrigger>
              <TabsTrigger value="delivered">Entregados</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
              <TabsTrigger value="all">Todos</TabsTrigger>
            </TabsList>
          </div>
          <Button size="sm" className="h-8 gap-1" onClick={openCreateSheet}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Nuevo Viaje
            </span>
          </Button>
        </div>

        {STATUS_OPTIONS.map((statusOption) => (
          <TabsContent key={statusOption.value} value={statusOption.value}>
            <TripsTab
              status={getStatusFromTab(statusOption.value)}
              searchTerm={searchTerm}
            />
          </TabsContent>
        ))}
      </Tabs>
      <CreateTripSheet
        open={isCreateSheetOpen}
        onOpenChange={closeCreateSheet}
      />
      {tripToEdit && (
        <EditTripSheet
          open={isEditSheetOpen}
          onOpenChange={closeEditSheet}
          trip={tripToEdit}
        />
      )}
    </div>
  );
}

export default TripsPage;
