import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Table } from "@tanstack/react-table";
interface TableProps<TData> {
  table: Table<TData>;
}
export default function PaginationSelection<TData>({
  table,
}: TableProps<TData>) {
  const [rowsPerPage, setRowsPerPage] = useState(
    table.getState().pagination.pageSize
  );

  const handleChange = (size: string) => {
    const newSize = parseInt(size, 10);
    setRowsPerPage(newSize);
    table.setPageSize(newSize); // Updates the table's pagination
  };

  return (
    <div className="flex items-center gap-2 max-sm:flex-col">
      <span className="text-sm text-gray-500">Rows Per Page</span>
      <Select onValueChange={handleChange} value={rowsPerPage.toString()}>
        <SelectTrigger className="w-[90px]">
          <SelectValue placeholder={rowsPerPage.toString()} />
        </SelectTrigger>
        <SelectContent>
          {[4, 6, 8, 10, 15, 20, 30].map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
