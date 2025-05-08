import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePatient } from "@/hooks/usePatient";
import AppointmentDeleteForm from "@/components/forms/appointment-delete-form";
import BookingEditForm from "@/components/forms/appointment-edit-form";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import {
  MoreHorizontal,
  SquarePen,
  Trash2,
  Copy,
  UserPlus,
} from "lucide-react";

interface WithId<T> {
  referenceId: string;
}
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData extends WithId<string>>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { toast } = useToast();
  const { getOrCreatePatientFromBooking } = usePatient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cardId = row.original.referenceId as string;

  // Common button class for consistent styling
  const buttonClass =
    "w-full flex items-center rounded-md p-2 transition-all duration-75";

  return (
    <>
      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Edit Appointment"
        className="sm:max-w-screen-md p-20"
      >
        <BookingEditForm cardId={cardId} setIsOpen={setIsEditOpen} />
      </ResponsiveDialog>

      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Delete Appointment"
        description="Are you sure you want to delete this Appointment?"
      >
        <AppointmentDeleteForm cardId={cardId} setIsOpen={setIsDeleteOpen} />
      </ResponsiveDialog>

      <ResponsiveDialog
        isOpen={isAddPatientOpen}
        setIsOpen={setIsAddPatientOpen}
        title="Add as Patient"
        description="Are you sure you want to add this Appointment as a Patient?"
      >
        <div className="flex justify-end space-x-4 mt-4">
          <Button variant="outline" onClick={() => setIsAddPatientOpen(false)}>
            No
          </Button>
          <Button
            onClick={async () => {
              try {
                setIsLoading(true);
                const patient = await getOrCreatePatientFromBooking(cardId);
                toast({
                  title: "Success",
                  description: `Successfully added ${patient.name} as a patient`,
                });
                setIsAddPatientOpen(false);
              } catch (error: any) {
                toast({
                  title: "Error",
                  description:
                    error.response?.data?.message || "Failed to add patient",
                  variant: "destructive",
                });
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Yes"
            )}
          </Button>
        </div>
      </ResponsiveDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[160px] z-50">
          {/* Edit button */}
          <DropdownMenuItem className="p-0">
            <button onClick={() => setIsEditOpen(true)} className={buttonClass}>
              <SquarePen className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Edit</span>
            </button>
          </DropdownMenuItem>

          {/* Copy ID button */}
          <DropdownMenuItem className="p-0">
            <button
              onClick={() =>
                navigator.clipboard.writeText(row.original.referenceId)
              }
              className={buttonClass}
            >
              <Copy className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Copy ID</span>
            </button>
          </DropdownMenuItem>

          {/* Add as Patient button */}
          <DropdownMenuItem className="p-0">
            <button
              onClick={() => setIsAddPatientOpen(true)}
              className={buttonClass}
            >
              <UserPlus className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Add as Patient</span>
            </button>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Delete button */}
          <DropdownMenuItem className="p-0">
            <button
              onClick={() => setIsDeleteOpen(true)}
              className={`${buttonClass} text-red-500`}
            >
              <Trash2 className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Delete</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
