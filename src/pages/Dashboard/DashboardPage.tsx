import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Chart from "./chart";
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as PendingIcon,
  BarChart3Icon,
  Users2Icon,
  CalendarRangeIcon,
  ActivityIcon,
} from "lucide-react";

// Define types for schedules
interface UpcomingSchedule {
  date: string;
  startTime: string;
  endTime: string;
  appointmentCount: number;
}

interface CancelledSchedule {
  date: string;
  startTime: string;
  endTime: string;
}

interface BookingStats {
  finishedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
  totalBookings: number;
  month: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [schedules, setSchedules] = useState<UpcomingSchedule[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState<boolean>(true);
  const [cancelledSchedules, setCancelledSchedules] = useState<
    CancelledSchedule[]
  >([]);
  const [cancelledLoading, setCancelledLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    // Fetch booking stats
    axios
      .get<BookingStats>(
        "http://localhost:8080/api/bookings/currentMonth/stats"
      )
      .then((response) => setStats(response.data))
      .catch((error) => console.error("Error fetching booking stats:", error))
      .finally(() => setLoading(false));

    // Fetch upcoming schedules
    axios
      .get<UpcomingSchedule[]>(
        "http://localhost:8080/api/schedules/upcomingSchedules"
      )
      .then((response) => setSchedules(response.data))
      .catch((error) =>
        console.error("Error fetching upcoming schedules:", error)
      )
      .finally(() => setScheduleLoading(false));

    // Fetch cancelled schedules
    axios
      .get<CancelledSchedule[]>(
        "http://localhost:8080/api/schedules/cancelledSchedules"
      )
      .then((response) => setCancelledSchedules(response.data))
      .catch((error) =>
        console.error("Error fetching cancelled schedules:", error)
      )
      .finally(() => setCancelledLoading(false));
  }, []);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6 bg-background">
      {/* Header with improved styling */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Booking management overview and statistics
          </p>
        </div>

        <div className="mt-2 md:mt-0">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary flex gap-2 py-1 px-3"
          >
            <CalendarIcon size={16} />
            <span>Current Month: {stats?.month || "Loading..."}</span>
          </Badge>
        </div>
      </header>

      {/* Main tabs navigation */}
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:inline-grid md:grid-cols-3 h-auto p-1">
          <TabsTrigger value="overview" className="py-2">
            <BarChart3Icon size={16} className="mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger value="schedule" className="py-2">
            <CalendarRangeIcon size={16} className="mr-2" /> Schedules
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="py-2 col-span-2 md:col-span-1"
          >
            <ActivityIcon size={16} className="mr-2" /> Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-4">
          {/* Stats Cards with improved visual hierarchy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-28 w-full rounded-lg" />
              ))
            ) : (
              <>
                <Card className="overflow-hidden border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Finished Bookings
                        </p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-bold">
                            {stats?.finishedBookings}
                          </p>
                          <span className="text-sm text-muted-foreground">
                            {stats?.month}
                          </span>
                        </div>
                      </div>
                      <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-l-4 border-l-red-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Cancelled Bookings
                        </p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-bold">
                            {stats?.cancelledBookings}
                          </p>
                          <span className="text-sm text-muted-foreground">
                            {stats?.month}
                          </span>
                        </div>
                      </div>
                      <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-full">
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-l-4 border-l-amber-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Pending Bookings
                        </p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-bold">
                            {stats?.pendingBookings}
                          </p>
                          <span className="text-sm text-muted-foreground">
                            {stats?.month}
                          </span>
                        </div>
                      </div>
                      <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full">
                        <PendingIcon className="h-5 w-5 text-amber-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Total Bookings
                        </p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-bold">
                            {stats?.totalBookings}
                          </p>
                          <span className="text-sm text-muted-foreground">
                            {stats?.month}
                          </span>
                        </div>
                      </div>
                      <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
                        <Users2Icon className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Chart */}
          <section className="rounded-lg">{!loading && <Chart />}</section>
        </TabsContent>

        {/* Schedule Tab Content */}
        <TabsContent value="schedule" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Upcoming Schedules Table */}
            {scheduleLoading ? (
              <Skeleton className="h-80 w-full rounded-lg" />
            ) : (
              <Card className="shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarIcon size={18} className="text-primary" />
                    Upcoming Schedules
                  </CardTitle>
                  <CardDescription>
                    {schedules.length} upcoming appointments scheduled
                  </CardDescription>
                </CardHeader>
                <div className="max-h-80 overflow-y-auto">
                  {schedules.length > 0 ? (
                    <div className="divide-y">
                      {schedules.map((schedule, idx) => (
                        <div
                          key={idx}
                          className="p-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                                <CalendarIcon
                                  size={16}
                                  className="text-primary"
                                />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {formatDate(schedule.date)}
                                </p>
                                <div className="flex items-center text-sm text-muted-foreground gap-1">
                                  <ClockIcon size={14} />
                                  <span>
                                    {schedule.startTime} - {schedule.endTime}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-primary/5">
                              {schedule.appointmentCount}{" "}
                              {schedule.appointmentCount === 1
                                ? "appointment"
                                : "appointments"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-semibold">
                        No upcoming schedules
                      </h3>
                      <p className="text-muted-foreground text-sm mt-2">
                        There are no upcoming schedules currently planned.
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Cancelled Schedules Table */}
            {cancelledLoading ? (
              <Skeleton className="h-80 w-full rounded-lg" />
            ) : (
              <Card className="shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <XCircleIcon size={18} className="text-red-500" />
                    Cancelled Schedules
                  </CardTitle>
                  <CardDescription>
                    {cancelledSchedules.length} cancelled appointments
                  </CardDescription>
                </CardHeader>
                <div className="max-h-80 overflow-y-auto">
                  {cancelledSchedules.length > 0 ? (
                    <div className="divide-y">
                      {cancelledSchedules.map((schedule, idx) => (
                        <div
                          key={idx}
                          className="p-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                                <XCircleIcon
                                  size={16}
                                  className="text-red-500"
                                />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {formatDate(schedule.date)}
                                </p>
                                <div className="flex items-center text-sm text-muted-foreground gap-1">
                                  <ClockIcon size={14} />
                                  <span>
                                    {schedule.startTime} - {schedule.endTime}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-red-100 dark:bg-red-900/20 text-red-500 border-red-200 dark:border-red-800"
                            >
                              Cancelled
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <CheckCircleIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-semibold">
                        No cancelled schedules
                      </h3>
                      <p className="text-muted-foreground text-sm mt-2">
                        There are no cancelled schedules at this time.
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Analytics Tab Content */}
        <TabsContent value="analytics" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Appointment Analytics</CardTitle>
              <CardDescription>
                Detailed analytics view of your appointment history
              </CardDescription>
            </CardHeader>
            <CardContent>{!loading && <Chart />}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
