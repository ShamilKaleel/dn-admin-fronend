import PatientLogBook from "./patient-log-book";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ChartLine } from "lucide-react";

export default function PatientLogBookPage() {
  return (
    <div className="flex flex-col bg-background rounded-lg shadow-sm">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          Patient Records
        </h1>
        <p className="text-muted-foreground mb-6">
          View and manage patient treatment history and logs.
        </p>

        <Tabs defaultValue="logbook" className="w-full">
          <TabsList className="mb-2 grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="logbook" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Treatment Log</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <ChartLine className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <div className="bg-card rounded-lg p-4 sm:p-6">
            <TabsContent value="logbook" className="mt-0 border-0 p-0">
              <PatientLogBook />
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
                  Patient analytics features are currently in development.
                  You'll soon be able to view treatment trends and patterns
                  here.
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
