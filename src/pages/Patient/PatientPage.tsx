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
          <TabsList className="mb-4">
            <TabsTrigger value="patients">Patient List</TabsTrigger>
            <TabsTrigger value="booking-patient">
              Patient from Booking
            </TabsTrigger>
          </TabsList>
          <TabsContent value="patients">
            <DataTable columns={columns} data={patientState.patients} />
          </TabsContent>
          <TabsContent value="booking-patient">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Get Patient from Booking ID</CardTitle>
                  <CardDescription>
                    Enter a booking ID to retrieve or create a patient record
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PatientFromBookingForm
                    onPatientRetrieved={(patient) => {
                      setRetrievedPatient(patient);
                      fetchPatients(); // Refresh patient list
                    }}
                  />
                </CardContent>
              </Card>

              {retrievedPatient && (
                <Card>
                  <CardHeader>
                    <CardTitle>Retrieved Patient</CardTitle>
                    <CardDescription>
                      Patient details retrieved from booking
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold">Name</h3>
                      <p>{retrievedPatient.name}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p>{retrievedPatient.email}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">NIC</h3>
                      <p>{retrievedPatient.nic}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Contact Numbers</h3>
                      <ul className="list-disc pl-5">
                        {retrievedPatient.contactNumbers.map(
                          (number, index) => (
                            <li key={index}>{number}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
