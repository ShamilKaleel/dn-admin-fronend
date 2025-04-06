import { ChartLine } from "lucide-react";
import { Card } from "@/components/ui/card";

const AppointmentAnalytics = () => {
  return (
    <Card className="py-12 flex flex-col items-center justify-center text-center mt-5">
      <div className="rounded-full bg-primary/10 p-4 mb-4">
        <ChartLine className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-xl font-medium mb-2">Analytics Coming Soon</h3>
      <p className="text-muted-foreground max-w-md">
        Patient analytics features are currently in development. You'll soon be
        able to view treatment trends and patterns here.
      </p>
    </Card>
  );
};

export default AppointmentAnalytics;
