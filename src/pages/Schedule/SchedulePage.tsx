import { useSchedules } from "@/hooks/useSchedule";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import ScheduleForm from "@/components/forms/schedule-form";
import ScheduleAnalytics from "./schedule-analytics";
import { useEffect, useState } from "react";
import Lorder from "@/components/Lorder";

export default function SchedulePage() {
  const { scheduleState, fetchSchedules } = useSchedules();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchSchedules();
      } catch (error) {
        console.error("Failed to fetch schedules", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <Lorder />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Add Schedule Dialog */}
      <ResponsiveDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Add Schedule"
        className="sm:max-w-screen-md p-20"
      >
        <ScheduleForm setIsOpen={setIsOpen} />
      </ResponsiveDialog>

      <div className="pb-5 px-2 lg:px-0">
        <Tabs defaultValue="schedules">
          <TabsList className="">
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="schedules">
            <DataTable columns={columns} data={scheduleState.schedules} />
          </TabsContent>
          <TabsContent value="analytics">
            <ScheduleAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
