import { Button } from "@/components/ui/button";
import { Plus, Download, UserSearch } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { exportToExcel } from "@/lib/export-to-excel";
import { useState } from "react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import PatientForm from "@/components/forms/patient-form";
import PatientFromBookingForm from "@/components/forms/patient-from-booking-form";
import { columnHeadersSchedule } from "@/constant/index";
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableHeader<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);

  const handleExport = () => {
    const dataToExport = table
      .getRowModel()
      .rows.map((row: any) => row.original);
    exportToExcel(
      dataToExport,
      "Patient",
      columnHeadersSchedule,
      Array(columnHeadersSchedule.length).fill(20)
    );
  };
  return (
    <div className="flex justify-between py-5">
      <ResponsiveDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Add Patient"
        className="sm:max-w-screen-md p-8"
      >
        <PatientForm setIsOpen={setIsOpen} />
      </ResponsiveDialog>

      <ResponsiveDialog
        isOpen={isBookingFormOpen}
        setIsOpen={setIsBookingFormOpen}
        title="Get Patient from Booking"
        className="sm:max-w-screen-md p-8"
      >
        <PatientFromBookingForm
          onPatientRetrieved={() => {
            // Just close the dialog when patient is retrieved
            setIsBookingFormOpen(false);
          }}
          onComplete={() => setIsBookingFormOpen(false)}
        />
      </ResponsiveDialog>
      <h1 className="text-2xl font-bold pl-1">Patient List</h1>
      <div className="flex gap-2 md:gap-5">
        <Button
          className="btn btn-primary bg-muted"
          variant="ghost"
          onClick={handleExport}
        >
          <span className="hidden md:block"> Export CSV</span>
          <Download className="md:hidden" />
        </Button>
        <Button
          className="btn btn-primary bg-muted"
          variant="outline"
          onClick={() => setIsBookingFormOpen(true)}
        >
          <span className="hidden md:block">Patient from Booking</span>
          <UserSearch className="md:hidden" />
        </Button>
        <Button className="btn btn-primary p-o" onClick={() => setIsOpen(true)}>
          <span className="hidden md:block"> Add Patient</span>
          <Plus className="md:hidden" />
        </Button>
      </div>
    </div>
  );
}
