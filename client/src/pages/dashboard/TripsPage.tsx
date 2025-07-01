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
import { PlusCircle, Truck } from "lucide-react";
import { useState } from "react";

const STATUS_OPTIONS = [
  { value: "scheduled", label: "Programados" },
  { value: "in-transit", label: "En Tránsito" },
  { value: "delivered", label: "Entregados" },
  { value: "cancelled", label: "Cancelados" },
  { value: "all", label: "Todos" },
];

function TripsPage() {
  const [activeTab, setActiveTab] = useState("scheduled");

  const {
    isCreateSheetOpen,
    openCreateSheet,
    closeCreateSheet,
    isEditSheetOpen,
    tripToEdit,
    closeEditSheet,
  } = useTripStore();

  const getCurrentTabLabel = () => {
    return (
      STATUS_OPTIONS.find((tab) => tab.value === activeTab)?.label ||
      "Programados"
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Truck className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Gestión de Viajes</h1>
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
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-8 gap-1" onClick={openCreateSheet}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Nuevo Viaje
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value="scheduled">
          <TripsTab status={TripStatus.SCHEDULED} />
        </TabsContent>
        <TabsContent value="in-transit">
          <TripsTab status={TripStatus.IN_TRANSIT} />
        </TabsContent>
        <TabsContent value="delivered">
          <TripsTab status={TripStatus.DELIVERED} />
        </TabsContent>
        <TabsContent value="cancelled">
          <TripsTab status={TripStatus.CANCELLED} />
        </TabsContent>
        <TabsContent value="all">
          <TripsTab />
        </TabsContent>
      </Tabs>
      <CreateTripSheet
        open={isCreateSheetOpen}
        onOpenChange={(open) => (open ? openCreateSheet() : closeCreateSheet())}
      />
      <EditTripSheet
        trip={tripToEdit}
        open={isEditSheetOpen}
        onOpenChange={(open) => (open ? null : closeEditSheet())}
      />
    </div>
  );
}

export default TripsPage;
