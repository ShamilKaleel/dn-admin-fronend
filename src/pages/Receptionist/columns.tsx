import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Receptionist } from "@/types/receptionist";

export const columns: ColumnDef<Receptionist>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] capitalize">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] capitalize">{row.getValue("userName")}</div>
    ),
  },

  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="firstName" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] capitalize">{row.getValue("firstName")}</div>
    ),
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="gender" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] capitalize">{row.getValue("gender")}</div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] capitalize">{row.getValue("phoneNumber")}</div>
    ),
  },
  {
    accessorKey: "nic",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NIC" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] capitalize">{row.getValue("nic")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="w-[120px] ">{row.getValue("email")}</div>
    ),
  },

  {
    id: "actions",

    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
