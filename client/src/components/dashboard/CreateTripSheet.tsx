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
import { useCreateTrip } from "@/hooks/api-hooks";
import {
  convertFormDataToRequest,
  defaultTripFormValues,
  FUEL_TYPES,
  tripFormSchema,
  type TripFormData,
} from "@/lib/trip-form-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

export function CreateTripSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createTrip = useCreateTrip();

  const form = useForm<TripFormData>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: defaultTripFormValues,
  });

  const onSubmit = async (data: TripFormData) => {
    const tripData = convertFormDataToRequest(data);
    try {
      await createTrip.mutateAsync(tripData);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Crear Nuevo Viaje</SheetTitle>
          <SheetDescription>
            Programa un nuevo viaje de transporte de combustible con todos los
            detalles necesarios.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-4"
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                        onFocus={(e) => e.currentTarget.select()}
                        onClick={(e) => e.currentTarget.select()}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.currentTarget.value) || 0)
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
                <FormItem>
                  <FormLabel>Fecha y Hora de Salida *</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormDescription>
                    La fecha debe ser posterior al momento actual
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="gap-2 mt-12">
              <Button type="submit" disabled={createTrip.isPending}>
                {createTrip.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Crear Viaje
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createTrip.isPending}
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
