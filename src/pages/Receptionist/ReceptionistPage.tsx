import { useReceptionist } from "@/hooks/useReceptionist";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import ScheduleForm from "@/components/forms/schedule-form";
import DoctorForm from "@/components/forms/doctor-form";
import { useEffect, useState } from "react";
export default function ReceptionistPage() {
  const { receptionistState, fetchReceptionists } = useReceptionist();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    try {
      const fetchData = async () => {
        await fetchReceptionists();
      };
      fetchData();
    } catch (error) {
      console.error("Failed to fetch Receptionists", error);
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
        <Tabs defaultValue="receptionist">
          <TabsList className=" ">
            <TabsTrigger value="receptionist">Receptionist </TabsTrigger>
            <TabsTrigger value="notready">Not ready</TabsTrigger>
          </TabsList>
          <TabsContent value="receptionist">
            <DataTable
              columns={columns}
              data={receptionistState.receptionists}
            />
          </TabsContent>
          <TabsContent value="notready">
            <div>hi</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
