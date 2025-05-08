import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import StatusBar from "./data-table-status-bar";
import { DataTableRowActions } from "./data-table-row-actions";
import { Booking } from "@/types/booking";

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "referenceId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reference Id" />
    ),
    enableSorting: false,
    enableHiding: false,

    cell: ({ row }) => (
      <div className="w-[80px] capitalize ">{row.getValue("referenceId")}</div>
    ),
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[140px]  capitalize">{row.getValue("name")}</div>
    ),
  },

  {
    accessorKey: "contactNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Number" />
    ),
    cell: ({ row }) => (
      <div className="w-[90px]  capitalize">
        {row.getValue("contactNumber")}
      </div>
    ),
  },
  {
    accessorKey: "nic",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NIC" />
    ),
    cell: ({ row }) => (
      <div className="w-[90px]  capitalize">{row.getValue("nic")}</div>
    ),
  },
  {
    accessorKey: "scheduleDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Schedule Date" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] capitalize ">
        {row.getValue("scheduleDate")}
      </div>
    ),
  },
  {
    accessorKey: "doctorName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Doctor Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] capitalize ">{row.getValue("doctorName")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="status" />
    ),
    cell: ({ row }) => <StatusBar status={row.getValue("status")} />,
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
