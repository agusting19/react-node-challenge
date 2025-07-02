import type { SortConfig, SortDirection } from "@/types/sorting";
import type { Trip } from "@/types/trip";
import { useMemo, useState } from "react";

export function useTableSorting(data: Trip[]) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "",
    direction: null,
  });

  const handleSort = (field: string) => {
    setSortConfig((prevSort) => {
      // If the field is already sorted, toggle the direction
      if (prevSort.field === field) {
        const nextDirection: SortDirection =
          prevSort.direction === null
            ? "asc"
            : prevSort.direction === "asc"
            ? "desc"
            : null;

        return {
          field: nextDirection === null ? "" : field,
          direction: nextDirection,
        };
      }

      // If it's a new field, start with ascending
      return {
        field,
        direction: "asc",
      };
    });
  };

  const getComparableValue = (
    trip: Trip,
    field: string
  ): string | number | Date => {
    const fieldKey = field as keyof Trip;
    const value = trip[fieldKey];

    switch (field) {
      case "departureDate":
        return new Date(value as string);

      case "liters":
        return Number(value);

      case "driver":
      case "truck":
      case "origin":
      case "destination":
      case "fuel":
      case "status":
        return String(value).toLowerCase();

      default:
        return typeof value === "string"
          ? value.toLowerCase()
          : typeof value === "number"
          ? value
          : String(value).toLowerCase();
    }
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.field || !sortConfig.direction) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = getComparableValue(a, sortConfig.field);
      const bValue = getComparableValue(b, sortConfig.field);

      let comparison = 0;
      if (aValue > bValue) {
        comparison = 1;
      } else if (aValue < bValue) {
        comparison = -1;
      }

      return sortConfig.direction === "desc" ? comparison * -1 : comparison;
    });
  }, [data, sortConfig]);

  return {
    sortedData,
    sortConfig,
    handleSort,
  };
}
