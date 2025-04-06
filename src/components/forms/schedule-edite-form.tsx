import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useSchedules } from "@/hooks/useSchedule";
import { useToast } from "@/hooks/use-toast";
import { CreateSchedule, Schedule } from "@/types/schedule";
import { Dentist } from "@/types/dentist";
import { useDentist } from "@/hooks/useDentist";

// Zod schema for validation
const editScheduleSchema = z.object({
  date: z
    .string()
    .nonempty("Date is required")
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
  status: z.enum(
    ["AVAILABLE", "UNAVAILABLE", "FULL", "CANCELLED", "FINISHED", "ACTIVE"],
    {
      errorMap: () => ({
        message: "Please select a valid status",
      }),
    }
  ),
  startTime: z
    .string()
    .nonempty("Start time is required")
    .regex(
      /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
      "Invalid time format (HH:MM:SS)"
    ),
  endTime: z
    .string()
    .nonempty("End time is required")
    .regex(
      /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
      "Invalid time format (HH:MM:SS)"
    ),
  dentistId: z.string().min(1, "Dentist ID is required"),
  capacity: z
    .number()
    .min(1, "Capacity must be a positive number")
    .nonnegative("Capacity must be valid"),
});

// TypeScript type inferred from Zod schema
type ScheduleEditForm = z.infer<typeof editScheduleSchema>;

interface ScheduleEditFormProps {
  cardId: string;
  setIsOpen: (isOpen: boolean) => void;
}

const ScheduleEditForm: React.FC<ScheduleEditFormProps> = ({
  cardId,
  setIsOpen,
}) => {
  const [date, setDate] = useState<Date | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { updateSchedule, getSchedule } = useSchedules();
  const { dentistState } = useDentist();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleEditForm>({
    resolver: zodResolver(editScheduleSchema),
  });

  // Common time presets
  const commonTimes = [
    { label: "8:00 AM", value: "08:00:00" },
    { label: "9:00 AM", value: "09:00:00" },
    { label: "10:00 AM", value: "10:00:00" },
    { label: "11:00 AM", value: "11:00:00" },
    { label: "12:00 PM", value: "12:00:00" },
    { label: "1:00 PM", value: "13:00:00" },
    { label: "2:00 PM", value: "14:00:00" },
    { label: "3:00 PM", value: "15:00:00" },
    { label: "4:00 PM", value: "16:00:00" },
    { label: "5:00 PM", value: "17:00:00" },
    { label: "6:00 PM", value: "18:00:00" },
  ];

  const formatTimeDisplay = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hourNum = parseInt(hours, 10);
    const ampm = hourNum >= 12 ? "PM" : "AM";
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setIsLoading(true);
        const schedule = await getSchedule(cardId);

        // Parse the schedule data and set form values
        reset({
          date: schedule.date,
          status: schedule.status === "ON_GOING" ? "ACTIVE" : schedule.status,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          dentistId: schedule.dentistId,
          capacity: schedule.capacity,
        });

        // Set the date for the calendar
        if (schedule.date) {
          setDate(parse(schedule.date, "yyyy-MM-dd", new Date()));
        }
      } catch (error) {
        console.error("Failed to fetch schedule", error);
        toast({
          title: "Error",
          description: "Failed to load schedule details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [cardId, getSchedule, reset, toast]);

  const onSubmit: SubmitHandler<ScheduleEditForm> = async (data) => {
    try {
      await updateSchedule(cardId, data as CreateSchedule);
      setIsOpen(false);
      toast({
        title: "Schedule Updated",
        description: "Schedule has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error updating schedule",
        description: error.response?.data?.error || "An error occurred",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading schedule details...</div>;
  }

  if (dentistState.dentists.length === 0) {
    return (
      <div className="w-full">
        <p className="text-red-500">
          No Doctors available. Please add doctors first.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-5 md:px-0">
      {/* Date Field */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium mb-1">
          Date:
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, "EEEE, MMMM d, yyyy")
              ) : (
                <span>Select appointment date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate);
                if (newDate) {
                  setValue("date", format(newDate, "yyyy-MM-dd"));
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
        )}
      </div>

      {/* Time Selection Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Start Time Field */}
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium mb-1">
            Start Time:
          </label>
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {field.value
                      ? formatTimeDisplay(field.value)
                      : "Select start time"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72" align="start">
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {commonTimes.map((time) => (
                        <Button
                          key={time.value}
                          variant={
                            field.value === time.value ? "default" : "outline"
                          }
                          size="sm"
                          className={cn(
                            "transition-colors",
                            field.value === time.value
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          )}
                          onClick={() => {
                            setValue("startTime", time.value);
                          }}
                        >
                          {time.label}
                        </Button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Hours
                        </span>
                        <Select
                          value={field.value ? field.value.split(":")[0] : "09"}
                          onValueChange={(hour) => {
                            const [_, min, sec] = field.value
                              ? field.value.split(":")
                              : ["00", "00", "00"];
                            setValue("startTime", `${hour}:${min}:${sec}`);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem
                                key={i}
                                value={i.toString().padStart(2, "0")}
                              >
                                {i.toString().padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Minutes
                        </span>
                        <Select
                          value={field.value ? field.value.split(":")[1] : "00"}
                          onValueChange={(min) => {
                            const [hour, _, sec] = field.value
                              ? field.value.split(":")
                              : ["09", "00", "00"];
                            setValue("startTime", `${hour}:${min}:${sec}`);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem
                                key={i}
                                value={(i * 5).toString().padStart(2, "0")}
                              >
                                {(i * 5).toString().padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.startTime && (
            <p className="text-red-500 text-sm mt-1">
              {errors.startTime.message}
            </p>
          )}
        </div>

        {/* End Time Field */}
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium mb-1">
            End Time:
          </label>
          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {field.value
                      ? formatTimeDisplay(field.value)
                      : "Select end time"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72" align="start">
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {commonTimes.map((time) => (
                        <Button
                          key={time.value}
                          variant={
                            field.value === time.value ? "default" : "outline"
                          }
                          size="sm"
                          className={cn(
                            "transition-colors",
                            field.value === time.value
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          )}
                          onClick={() => {
                            setValue("endTime", time.value);
                          }}
                        >
                          {time.label}
                        </Button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Hours
                        </span>
                        <Select
                          value={field.value ? field.value.split(":")[0] : "17"}
                          onValueChange={(hour) => {
                            const [_, min, sec] = field.value
                              ? field.value.split(":")
                              : ["17", "00", "00"];
                            setValue("endTime", `${hour}:${min}:${sec}`);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem
                                key={i}
                                value={i.toString().padStart(2, "0")}
                              >
                                {i.toString().padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Minutes
                        </span>
                        <Select
                          value={field.value ? field.value.split(":")[1] : "00"}
                          onValueChange={(min) => {
                            const [hour, _, sec] = field.value
                              ? field.value.split(":")
                              : ["17", "00", "00"];
                            setValue("endTime", `${hour}:${min}:${sec}`);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem
                                key={i}
                                value={(i * 5).toString().padStart(2, "0")}
                              >
                                {(i * 5).toString().padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.endTime?.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.endTime.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Status Field */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status:
          </label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => setValue("status", value as any)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">AVAILABLE</SelectItem>
                  <SelectItem value="UNAVAILABLE">UNAVAILABLE</SelectItem>
                  <SelectItem value="FULL">FULL</SelectItem>
                  <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="FINISHED">FINISHED</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
          )}
        </div>

        {/* Capacity Field */}
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium mb-1">
            Capacity:
          </label>
          <Input
            type="number"
            id="capacity"
            {...register("capacity", { valueAsNumber: true })}
            className="block w-full rounded-md"
          />
          {errors.capacity && (
            <p className="text-red-500 text-sm mt-1">
              {errors.capacity.message}
            </p>
          )}
        </div>

        {/* Dentist ID Field */}
        <div>
          <label htmlFor="dentistId" className="block text-sm font-medium mb-1">
            Dentist:
          </label>
          <Controller
            name="dentistId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => setValue("dentistId", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent>
                  {dentistState.dentists.map((dentist: Dentist) => (
                    <SelectItem key={dentist.id} value={dentist.id.toString()}>
                      Dr. {dentist.firstName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.dentistId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.dentistId.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Schedule"}
        </Button>
      </div>
    </form>
  );
};

export default ScheduleEditForm;
