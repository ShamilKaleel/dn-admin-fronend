import { usePatient } from "@/hooks/usePatient";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import PatientForm from "@/components/forms/patient-form";
import PatientFromBookingForm from "@/components/forms/patient-from-booking-form";
import { Patient } from "@/types/patient";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ChartLine } from "lucide-react";
export default function PatientPage() {
  const { patientState, fetchPatients } = usePatient();
  const [isOpen, setIsOpen] = useState(false);
  const [retrievedPatient, setRetrievedPatient] = useState<Patient | null>(
    null
  );
  // Commented code removed to clean up

  return (
    <div className="flex flex-col">
      {/* Add Patient Dialog */}
      <ResponsiveDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Add Patient"
        className="sm:max-w-screen-md p-8"
      >
        <PatientForm setIsOpen={setIsOpen} />
      </ResponsiveDialog>

      <div className="pb-5 px-2 lg:px-0">
        <Tabs defaultValue="patients">
          <TabsList className="">
            <TabsTrigger value="patients">Patient List</TabsTrigger>
            <TabsTrigger value="Analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="patients">
            <DataTable columns={columns} data={patientState.patients} />
          </TabsContent>
          <TabsContent value="Analytics">
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <ChartLine className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">
                Analytics Coming Soon
              </h3>
              <p className="text-muted-foreground max-w-md">
                Patient analytics features are currently in development. You'll
                soon be able to view treatment trends and patterns here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
