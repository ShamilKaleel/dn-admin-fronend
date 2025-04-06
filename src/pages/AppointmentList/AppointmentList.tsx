import { useBooking } from "@/hooks/useBooking";
import { DataTable } from "@/pages/AppointmentList/data-table";
import { columns } from "@/pages/AppointmentList/columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentAnalytics from "./AppointmentAnalytics";
import Lorder from "@/components/Lorder";
import { useState, useEffect } from "react";

export default function BookingPage() {
  const { state } = useBooking();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading to ensure data is fetched
    if (state && state.bookings) {
      setIsLoading(false);
    }
  }, [state]);

  if (isLoading) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <Lorder />
      </div>
    );
  }

  if (!state || !state.bookings) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Appointment List</h1>
        <p>No appointment data available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="pb-5 px-2 lg:px-0">
        <Tabs defaultValue="appointments">
          <TabsList>
            <TabsTrigger value="appointments">All Appointments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
          </TabsList>
          <TabsContent value="appointments">
            <DataTable columns={columns} data={state.bookings} />
          </TabsContent>
          <TabsContent value="analytics" className="mt-0 border-0 p-0">
            <AppointmentAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
