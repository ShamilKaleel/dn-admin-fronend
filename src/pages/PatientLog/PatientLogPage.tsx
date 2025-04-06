import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLog } from "@/hooks/useLog";
import { PatientLog } from "@/types/patient-log";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Lorder from "@/components/Lorder";
import PatientLogg from "./patient-log";
const PatientLogDetails = () => {
  const { id, logID } = useParams<{ id: string; logID: string }>();
  const { getLogById } = useLog();
  const [log, setLog] = useState<PatientLog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const logData = await getLogById(id!, logID!);
        setLog(logData);
      } catch (error) {
        console.error("Error fetching log:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLog();
  }, [id, logID, getLogById]);

  if (loading)
    return (
      <div className=" flex w-full h-screen justify-center items-center">
        <Lorder />
      </div>
    );
  if (!log) return <p>No log found.</p>;

  return (
    <>
      <div className="flex flex-col">
        <div className="pb-5 px-2 lg:px-0">
          <Tabs defaultValue="logbook">
            <TabsList className=" ">
              <TabsTrigger value="logbook">Log Book </TabsTrigger>
              <TabsTrigger value="analysis">Not ready</TabsTrigger>
            </TabsList>
            <TabsContent value="logbook">
              <PatientLogg log={log} patientID={id!} />
            </TabsContent>
            <TabsContent value="analysis">
              <div>hi</div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default PatientLogDetails;
