import { Skeleton } from "../ui/skeleton";
import { TableHead, TableRow } from "../ui/table";

const TableSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i}>
          <TableHead>
            <Skeleton className="h-4 w-32" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-20" />
          </TableHead>
          <TableHead className="hidden md:table-cell">
            <Skeleton className="h-4 w-16" />
          </TableHead>
          <TableHead className="hidden md:table-cell">
            <Skeleton className="h-4 w-12" />
          </TableHead>
          <TableHead className="hidden md:table-cell">
            <Skeleton className="h-4 w-24" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-8 w-16" />
          </TableHead>
        </TableRow>
      ))}
    </>
  );
};

export default TableSkeleton;
