import { Button } from "@/components/ui/button";
import { TableHead } from "@/components/ui/table";
import type { SortDirection } from "@/types/sorting";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

interface SortableTableHeaderProps {
  children: React.ReactNode;
  field: string;
  currentSort?: {
    field: string;
    direction: SortDirection;
  };
  onSort: (field: string) => void;
  className?: string;
  sortable?: boolean;
}

export function SortableTableHeader({
  children,
  field,
  currentSort,
  onSort,
  className,
  sortable = true,
}: SortableTableHeaderProps) {
  if (!sortable) {
    return <TableHead className={className}>{children}</TableHead>;
  }

  const isActive = currentSort?.field === field;
  const direction = isActive ? currentSort.direction : null;

  const getSortIcon = () => {
    if (!isActive || direction === null) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }

    return direction === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <TableHead className={className}>
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-0 font-medium hover:bg-transparent hover:cursor-pointer"
        onClick={() => onSort(field)}
      >
        {children}
        {getSortIcon()}
      </Button>
    </TableHead>
  );
}
