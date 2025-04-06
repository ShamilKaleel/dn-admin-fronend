import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLog } from "@/hooks/useLog";
import { PatientLog } from "@/types/patient-log";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChartLine, Clock, User } from "lucide-react";
import PatientLogg from "./patient-log";

const PatientLogDetails = () => {
  const { id, logID } = useParams<{
    id: string;
    logID: string;
  }>();
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

  // Loading state with skeleton UI
  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-full max-w-md" />
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Skeleton className="h-32 w-full rounded-md" />
                <Skeleton className="h-32 w-full rounded-md" />
                <Skeleton className="h-32 w-full rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg">
          <h2 className="text-lg font-medium">No log record found</h2>
          <p className="mt-2">
            The requested patient log could not be found or may have been
            deleted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-2xl font-bold">
              Treatment Record
            </CardTitle>
            <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
              {log.actionType}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>Dr. {log.dentistName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{new Date(log.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="logbook" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-2 md:w-auto">
              <TabsTrigger value="logbook" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Treatment Details</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <ChartLine className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="logbook" className="mt-0 border-0 p-0">
              <PatientLogg log={log} patientID={id!} />
            </TabsContent>
            <TabsContent value="analysis" className="mt-0 border-0 p-0">
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <ChartLine className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  Analytics Coming Soon
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Detailed treatment analytics will be available here in a
                  future update.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientLogDetails;
