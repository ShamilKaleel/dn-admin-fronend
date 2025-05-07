import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBooking } from "@/hooks/useBooking";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import Lorder from "@/components/Lorder";
import { useSchedules } from "@/hooks/useSchedule";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectSchedule } from "@/types/schedule";

// Define Zod schema
const bookingSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(40, "Name should be less than 40 characters"),
  nic: z
    .string()
    .regex(/^(\d{9}[VX]|[1-9]\d{11})$/, "Please enter a valid NIC number")
    .min(10, "NIC number should be 10 characters")
    .max(12, "NIC number should be 12 characters"),
  contactNumber: z
    .string()
    .regex(/^\d{10}$/, "Contact number must be 10 digits"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  scheduleId: z.string({ required_error: "Schedule Id is required" }),
});

// Infer TypeScript types
type BookingForm = z.infer<typeof bookingSchema>;

interface BookingEditFormProps {
  cardId: string;
  setIsOpen: (isOpen: boolean) => void;
}

const BookingEditForm: React.FC<BookingEditFormProps> = ({
  cardId,
  setIsOpen,
}) => {
  const { getBookingById, updateBooking } = useBooking();
  const { getAvailableSchedules } = useSchedules();
  const [schedules, setSchedules] = useState<SelectSchedule[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch the booking data by ID
        const booking = await getBookingById(cardId);

        // Set initial form values
        setValue("name", booking.name);
        setValue("nic", booking.nic);
        setValue("contactNumber", booking.contactNumber);
        setValue("email", booking.email);
        setValue("address", booking.address);
        setValue("scheduleId", booking.scheduleId);

        // Fetch available schedules
        const availableSchedules = await getAvailableSchedules();
        setSchedules(availableSchedules);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error fetching booking details",
          description: error.message || "Something went wrong",
        });
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cardId, getBookingById, getAvailableSchedules, setIsOpen, setValue]);

  const onSubmit: SubmitHandler<BookingForm> = async (data) => {
    try {
      await updateBooking(cardId, data);
      setIsOpen(false);
      toast({
        title: "Booking updated successfully",
        description: "Your changes have been saved.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating booking",
        description:
          error.response?.data?.details?.error || "Something went wrong",
      });
    }
  };

  if (!schedules) {
    return (
      <div className="w-full">
        <p className=" text-red-500">No Schedules</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-5 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <Input
            id="name"
            {...register("name")}
            className="mt-1 block w-full border rounded-md p-2"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="nic" className="block text-sm font-medium">
            NIC
          </label>
          <Input
            id="nic"
            {...register("nic")}
            className="mt-1 block w-full border rounded-md p-2"
          />
          {errors.nic && (
            <p className="text-red-500 text-sm">{errors.nic.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="contactNumber" className="block text-sm font-medium">
            Contact Number
          </label>
          <Input
            id="contactNumber"
            {...register("contactNumber")}
            className="mt-1 block w-full border rounded-md p-2"
          />
          {errors.contactNumber && (
            <p className="text-red-500 text-sm">
              {errors.contactNumber.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="scheduleId" className="block text-sm font-medium">
            Schedule
          </label>
          <Select
            onValueChange={(value) => setValue("scheduleId", value)}
            defaultValue={schedules[0]?.id.toString()}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Schedule" />
            </SelectTrigger>
            <SelectContent>
              {schedules.map((schedule) => (
                <SelectItem key={schedule.id} value={schedule.id.toString()}>
                  {schedule.date} - {schedule.dayOfWeek} - {schedule.startTime}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.scheduleId && (
            <p className="text-red-500 text-sm">{errors.scheduleId.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          {...register("email")}
          className="mt-1 block w-full border rounded-md p-2"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium">
          Address
        </label>
        <Input
          id="address"
          {...register("address")}
          className="mt-1 block w-full border rounded-md p-2"
        />
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address.message}</p>
        )}
      </div>

      <div className="flex justify-center gap-5 pt-5 relative">
        <Button onClick={() => setIsOpen(false)} variant="ghost">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Lorder /> : "Update"}
        </Button>
      </div>
    </form>
  );
};

export default BookingEditForm;
