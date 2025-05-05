import { Button } from "@/components/ui/button";

import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiFirstPage, BiLastPage } from "react-icons/bi";

import PaginationSelection from "./PaginationSelection";
import { useEffect, useState } from "react";
import { Table } from "@tanstack/react-table";

interface TableProps<TData> {
  table: Table<TData>;
}

export default function PaginationArea<TData>({ table }: TableProps<TData>) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  const currentPage = table.getState().pagination.pageIndex + 1; // 0-based index, so add 1
  const totalPages = table.getPageCount();

  return (
    <div
      className={`relative w-full h-[80px] max-sm:h-[206px] max-sm:pt-4 max-sm:pb-4 
    overflow-hidden flex justify-between items-center px-6 bg-white dark:bg-muted 
    border max-sm:flex-col max-sm:gap-2 rounded-b-xl`}
    >
      <PaginationSelection table={table} />
      <div className="flex gap-6 items-center max-sm:flex-col max-sm:mt-4 max-sm:gap-2 ">
        {/* Show current page number and total pages */}
        <span className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center justify-end space-x-2">
          {/* First Page Button */}
          <Button
            variant="outline"
            className="size-9 w-12"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <BiFirstPage />
          </Button>

          {/* Previous Page Button */}
          <Button
            variant="outline"
            className="size-9 w-12"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <GrFormPrevious />
          </Button>

          {/* Next Page Button */}
          <Button
            className="size-9 w-12"
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <GrFormNext />
          </Button>

          {/* Last Page Button */}
          <Button
            className="size-9 w-12"
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <BiLastPage />
          </Button>
        </div>
      </div>
    </div>
  );
}
