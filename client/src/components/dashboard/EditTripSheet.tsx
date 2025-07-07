import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUpdateTrip } from "@/hooks/api-hooks";
import {
  defaultEditTripFormValues,
  defaultTripFormValues,
  editTripFormSchema,
  formatDateTimeLocal,
  FUEL_TYPES,
  type EditTripFormData,
  type TripFormData,
} from "@/lib/trip-form-utils";
import { cn } from "@/lib/utils";
import type { Trip } from "@/types/trip";
import { TripStatus } from "@/types/trip";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, startOfToday } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const TRIP_STATUS_OPTIONS = [
  { value: TripStatus.SCHEDULED, label: "Programado" },
  { value: TripStatus.IN_TRANSIT, label: "En Tránsito" },
  { value: TripStatus.DELIVERED, label: "Entregado" },
  { value: TripStatus.CANCELLED, label: "Cancelado" },
] as const;

export function EditTripSheet({
  trip,
  open,
  onOpenChange,
}: {
  trip: Trip | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const updateTrip = useUpdateTrip();

  const form = useForm<EditTripFormData>({
    resolver: zodResolver(editTripFormSchema),
    defaultValues: defaultEditTripFormValues,
  });

  useEffect(() => {
    if (trip && open) {
      form.reset({
        truck: trip.truck,
        driver: trip.driver,
        origin: trip.origin,
        destination: trip.destination,
        fuel: trip.fuel,
        liters: trip.liters,
        departureDate: formatDateTimeLocal(new Date(trip.departureDate)),
        status: trip.status,
      });
    } else if (!open) {
      form.reset({
        ...defaultTripFormValues,
        status: TripStatus.SCHEDULED,
      });
    }
  }, [trip, open, form]);

  const onSubmit = async (data: TripFormData & { status: TripStatus }) => {
    if (!trip) return;

    try {
      const updateData = {
        truck: data.truck,
        driver: data.driver,
        origin: data.origin,
        destination: data.destination,
        fuel: data.fuel,
        liters: data.liters,
        departureDate: new Date(data.departureDate).toISOString(),
        status: data.status,
      };

      await updateTrip.mutateAsync({
        id: trip.id,
        data: updateData,
      });

      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error updating trip:", error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-[500px] flex flex-col overflow-y-auto">
        <SheetHeader className="shrink-0">
          <SheetTitle>Editar Viaje</SheetTitle>
          <SheetDescription>
            Modifica los detalles del viaje de transporte de combustible.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-4"
            id="edit-trip-form"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="truck"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Camión *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej. ABC123"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="driver"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conductor *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej. Juan Pérez"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origen *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej. Planta Norte"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destino *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej. Estación Sur"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fuel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Combustible *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona combustible" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FUEL_TYPES.map((fuel) => (
                          <SelectItem key={fuel.value} value={fuel.value}>
                            {fuel.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="liters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad (Litros) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="30000"
                        placeholder="15000"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.currentTarget.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Máximo 30,000 litros permitidos
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="departureDate"
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2">
                  {/* Fecha */}
                  <FormField
                    control={form.control}
                    name="departureDate"
                    render={({ field }) => {
                      const date = field.value ? new Date(field.value) : null;

                      return (
                        <FormItem className="flex flex-col">
                          <FormLabel>Fecha *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !date && "text-muted-foreground"
                                  )}
                                >
                                  {date
                                    ? format(date, "PPP")
                                    : "Selecciona una fecha"}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={date ?? undefined}
                                onSelect={(selectedDate) => {
                                  const currentTime = date ?? new Date();
                                  const newDateTime = new Date(
                                    selectedDate ?? currentTime
                                  );
                                  newDateTime.setHours(
                                    currentTime.getHours(),
                                    currentTime.getMinutes()
                                  );
                                  field.onChange(newDateTime.toISOString());
                                }}
                                disabled={(date) => date < startOfToday()}
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      );
                    }}
                  />
                  <FormItem>
                    <FormLabel>Hora *</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        value={
                          field.value
                            ? format(new Date(field.value), "HH:mm")
                            : ""
                        }
                        onChange={(e) => {
                          const date = field.value
                            ? new Date(field.value)
                            : new Date();
                          const [hours, minutes] = e.target.value
                            .split(":")
                            .map(Number);
                          date.setHours(hours);
                          date.setMinutes(minutes);
                          field.onChange(date.toISOString());
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado del Viaje *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRIP_STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Actualiza el estado actual del viaje
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="gap-2 mt-12">
              <Button
                type="submit"
                form="edit-trip-form"
                disabled={updateTrip.isPending}
              >
                {updateTrip.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Guardar Cambios
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={updateTrip.isPending}
              >
                Cancelar
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
