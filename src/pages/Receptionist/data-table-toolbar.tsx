import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // State to manage selected column for filtering
  const [selectedColumn, setSelectedColumn] = useState<string>("email");

  return (
    <div className="flex  items-center justify-between">
      <div className="flex flex-1  items-center gap-2">
        {/* Input for filtering */}
        <Input
          placeholder={`Filter ${selectedColumn
            .replace(/([A-Z])/g, " $1")
            .trim()}...`}
          value={
            (table.getColumn(selectedColumn)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) => {
            table.getColumn(selectedColumn)?.setFilterValue(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[250px] capitalize"
        />

        {/* Select dropdown for selecting column */}
        <Select
          value={selectedColumn}
          onValueChange={(value) => setSelectedColumn(value)}
        >
          <SelectTrigger className="h-8 px-2 border rounded-md w-[120px] sm:w-[150px]  capitalize">
            <SelectValue
              placeholder={selectedColumn.replace(/([A-Z])/g, " $1").trim()}
            />
          </SelectTrigger>
          <SelectContent>
            {table.getAllColumns().map(
              (column) =>
                column.getCanFilter() && (
                  <SelectItem
                    key={column.id}
                    value={column.id}
                    className="capitalize"
                  >
                    {column.id.replace(/([A-Z])/g, " $1").trim()}
                  </SelectItem>
                )
            )}
          </SelectContent>
        </Select>

        {/* Reset button for clearing filters */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4 " />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <Button variant="outline" size="sm">
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Delete ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        ) : null}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
