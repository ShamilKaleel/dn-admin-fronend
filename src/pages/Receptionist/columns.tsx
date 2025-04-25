import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Dentist } from "@/types/dentist";

export const columns: ColumnDef<Dentist>[] = [
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
    accessorKey: "specialization",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="specialization" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] capitalize">
        {row.getValue("specialization")}
      </div>
    ),
  },
  {
    accessorKey: "licenseNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="licenseNumber" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] capitalize">
        {row.getValue("licenseNumber")}
      </div>
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
