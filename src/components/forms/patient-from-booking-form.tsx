import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Patient } from "@/types/patient";
import { Loader2 } from "lucide-react";
import { usePatient } from "@/hooks/usePatient";

// Zod schema for form validation
const bookingSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
});

type BookingFormInputs = z.infer<typeof bookingSchema>;

interface PatientFromBookingFormProps {
  onPatientRetrieved?: (patient: Patient) => void;
  onComplete?: () => void;
}

const PatientFromBookingForm: React.FC<PatientFromBookingFormProps> = ({
  onPatientRetrieved,
  onComplete,
}) => {
  const { toast } = useToast();
  const { getOrCreatePatientFromBooking } = usePatient();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormInputs>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormInputs) => {
    try {
      setLoading(true);
      const patient = await getOrCreatePatientFromBooking(data.bookingId);

      toast({
        title: "Patient Retrieved",
        description: `Successfully retrieved patient: ${patient.name}`,
      });

      if (onPatientRetrieved) {
        onPatientRetrieved(patient);
      }

      reset();

      if (onComplete) {
        onComplete();
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error retrieving patient",
        description:
          error.response?.data?.message ||
          "An error occurred while retrieving the patient from booking",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded px-5 md:px-0">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="bookingId" className="block font-medium mb-1">
            Booking ID
          </label>
          <Input
            id="bookingId"
            placeholder="Enter booking ID"
            {...register("bookingId")}
            className="w-full border p-2 rounded"
          />
          {errors.bookingId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.bookingId.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full py-2" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Get Patient from Booking"
          )}
        </Button>
      </form>
    </div>
  );
};

export default PatientFromBookingForm;
