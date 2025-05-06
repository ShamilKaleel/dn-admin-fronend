import React, { useEffect, useState } from "react";
import { useSchedules } from "@/hooks/useSchedule";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Label,
  XAxis,
  YAxis,
} from "recharts";
import { Schedule } from "@/types/schedule";
import {
  TrendingUp,
  TrendingDown,
  CalendarDays,
  Users,
  CheckCircle,
  Clock,
  BarChartIcon,
} from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Define chart colors
const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
];

const ScheduleAnalytics = () => {
  const { scheduleState } = useSchedules();
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState<
    Array<{ browser: string; visitors: number; fill: string }>
  >([]);
  const [dailyBookingsData, setDailyBookingsData] = useState<
    Array<{ month: string; desktop: number }>
  >([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [percentChange, setPercentChange] = useState({ value: 0, isUp: true });

  // For charts config
  const statusChartConfig = {
    visitors: { label: "Appointments" },
    AVAILABLE: { label: "Available", color: COLORS[0] },
    UNAVAILABLE: { label: "Unavailable", color: COLORS[1] },
    CANCELLED: { label: "Cancelled", color: COLORS[2] },
    FULL: { label: "Full", color: COLORS[3] },
    FINISHED: { label: "Finished", color: COLORS[4] },
    ACTIVE: { label: "Active", color: COLORS[5] },
  } as ChartConfig;

  const barChartConfig = {
    desktop: { label: "Appointments", color: COLORS[0] },
  } as ChartConfig;

  useEffect(() => {
    if (scheduleState.schedules.length > 0) {
      processData(scheduleState.schedules);
      setLoading(false);
    }
  }, [scheduleState.schedules]);

  const processData = (schedules: Schedule[]) => {
    // Calculate total appointments
    const totalBookings = schedules.reduce(
      (acc, schedule) => acc + schedule.numberOfBookings,
      0
    );
    setTotalAppointments(totalBookings);

    // Simulate percentage change (you could replace this with actual data)
    setPercentChange({
      value: 5.2,
      isUp: true,
    });

    // Process status distribution for pie chart
    const statusCounts: Record<string, number> = {};
    schedules.forEach((schedule) => {
      statusCounts[schedule.status] = (statusCounts[schedule.status] || 0) + 1;
    });

    const statusArray = Object.keys(statusCounts).map((status, index) => ({
      browser: status,
      visitors: statusCounts[status],
      fill: COLORS[index % COLORS.length],
    }));
    setStatusData(statusArray);

    // Process daily bookings data for bar chart
    const bookingsByDay: Record<string, number> = {};
    const dayOrder = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    schedules.forEach((schedule) => {
      const day = schedule.dayOfWeek;
      bookingsByDay[day] =
        (bookingsByDay[day] || 0) + schedule.numberOfBookings;
    });

    const dailyBookings = dayOrder
      .filter((day) => schedules.some((schedule) => schedule.dayOfWeek === day))
      .map((day) => ({
        month: day,
        desktop: bookingsByDay[day] || 0,
      }))
      .sort((a, b) => b.desktop - a.desktop); // Sort by number of bookings

    setDailyBookingsData(dailyBookings);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading analytics data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Dashboard Header */}
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:justify-between pb-4 border-b">
        <div className="pl-1">
          <h1 className="text-2xl font-bold tracking-tight pt-5">
            Schedule Analytics
          </h1>
          <p className="text-muted-foreground">
            Comprehensive overview of appointment schedules and booking
            statistics
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted p-2 rounded-lg">
          <BarChartIcon className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">
            Dashboard | Last Updated: {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Summary Cards Section */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Summary Cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Schedules
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {scheduleState.schedules.length}
              </div>
              <p className="text-xs text-muted-foreground">
                All scheduled appointments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {scheduleState.schedules.reduce(
                  (acc, schedule) => acc + schedule.numberOfBookings,
                  0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Total patient appointments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Available Schedules
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  scheduleState.schedules.filter(
                    (s) => s.status === "AVAILABLE"
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">Open for booking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Utilization Rate
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  (scheduleState.schedules.reduce(
                    (acc, schedule) => acc + schedule.numberOfBookings,
                    0
                  ) /
                    scheduleState.schedules.reduce(
                      (acc, schedule) => acc + schedule.capacity,
                      0
                    )) *
                    100
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Booked slots vs capacity
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Section */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Analytics Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule Status Distribution</CardTitle>
              <CardDescription>
                Current Schedule Status Breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={statusChartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={statusData}
                    dataKey="visitors"
                    nameKey="browser"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {totalAppointments.toLocaleString()}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                Appointments
                              </tspan>
                            </text>
                          );
                        }
                        return null;
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium leading-none">
                <span
                  className={`h-3 w-3 rounded-full ${COLORS[0]} bg-opacity-50`}
                ></span>
                {statusChartConfig.AVAILABLE.label}:{" "}
                {statusData.find((item) => item.browser === "AVAILABLE")
                  ?.visitors || 0}
              </div>
              <div className="leading-none text-muted-foreground">
                Showing schedule status distribution
              </div>
            </CardFooter>
          </Card>

          {/* Daily Bookings Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Bookings by Day</CardTitle>
              <CardDescription>
                Number of bookings for each day of the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={barChartConfig}>
                <BarChart
                  accessibilityLayer
                  data={dailyBookingsData}
                  layout="vertical"
                  margin={{
                    left: -20,
                  }}
                >
                  <XAxis type="number" dataKey="desktop" hide />
                  <YAxis
                    dataKey="month"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="desktop" fill={COLORS[0]} radius={5} />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                {dailyBookingsData.length > 0 && dailyBookingsData[0].month} is
                the busiest day
              </div>
              <div className="leading-none text-muted-foreground">
                Showing bookings by day of week
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAnalytics;
