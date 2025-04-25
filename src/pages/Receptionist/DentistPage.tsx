import { useDentist } from "@/hooks/useDentist";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import ScheduleForm from "@/components/forms/schedule-form";
import DoctorForm from "@/components/forms/doctor-form";
import { useEffect, useState } from "react";
export default function DentistPage() {
  const { dentistState, fetchDentists } = useDentist();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    try {
      const fetchData = async () => {
        await fetchDentists();
      };
      fetchData();
    } catch (error) {
      console.error("Failed to fetch dentists", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="pb-5 px-2 lg:px-0">
        <Tabs defaultValue="schedules">
          <TabsList className=" ">
            <TabsTrigger value="schedules">Doctors </TabsTrigger>
            <TabsTrigger value="apoinments">Not ready</TabsTrigger>
          </TabsList>
          <TabsContent value="schedules">
            <DataTable columns={columns} data={dentistState.dentists} />
          </TabsContent>
          <TabsContent value="apoinments">
            <div>hi</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
