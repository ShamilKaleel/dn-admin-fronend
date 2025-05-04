import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReceptionist } from "@/hooks/useReceptionist";
import { useToast } from "@/hooks/use-toast";
import { CreateReceptionist } from "@/types/receptionist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const receptionistEditSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  gender: z.enum(["Male", "Female"]).refine((val) => val !== undefined, {
    message: "Gender is required",
  }),
  firstName: z.string().min(1, "First Name is required"),
  nic: z
    .string()
    .regex(/^\d{9}[VX]|[1-9]\d{11}$/i, "Please enter a valid NIC number")
    .min(10, "NIC number should be 10 characters")
    .max(12, "NIC number should be 12 characters"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone Number must be 10 digits"),
});

export type ReceptionistEditFormInputs = z.infer<typeof receptionistEditSchema>;

interface EditReceptionistFormProps {
  cardId: string; // The ID of the receptionist to be edited
  setIsOpen: (isOpen: boolean) => void;
}

const ReceptionistEditForm: React.FC<EditReceptionistFormProps> = ({
  cardId,
  setIsOpen,
}) => {
  const { getReceptionistById, updateReceptionist } = useReceptionist();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReceptionistEditFormInputs>({
    resolver: zodResolver(receptionistEditSchema),
  });

  useEffect(() => {
    const fetchReceptionist = async () => {
      try {
        const receptionist = await getReceptionistById(cardId);
        setValue("userName", receptionist.userName);
        setValue("email", receptionist.email);
        setValue("gender", receptionist.gender as "Male" | "Female");
        setValue("firstName", receptionist.firstName);
        setValue("nic", receptionist.nic);
        setValue("phoneNumber", receptionist.phoneNumber);
      } catch (error) {
        toast({
          title: "Error loading receptionist",
          description: "Could not load receptionist details",
          variant: "destructive",
        });
      }
    };

    fetchReceptionist();
  }, [cardId, getReceptionistById, setValue, toast]);

  const onSubmit = async (data: ReceptionistEditFormInputs) => {
    try {
      await updateReceptionist(cardId, data as CreateReceptionist);

      toast({
        title: "Receptionist Updated",
        description: "Receptionist details have been updated successfully.",
      });
      setIsOpen(false);
    } catch (error: any) {
      console.log(error.response?.data);
      toast({
        title: "Error updating receptionist",
        description: error.response?.data?.details.error || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full rounded px-5 md:px-0">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username and Email */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="userName" className="block font-medium">
              Username
            </label>
            <Input
              id="userName"
              {...register("userName")}
              className="w-full border p-2 rounded"
            />
            {errors.userName && (
              <p className="text-red-500 text-sm">{errors.userName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block font-medium">
              Email
            </label>
            <Input
              id="email"
              {...register("email")}
              className="w-full border p-2 rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* First Name and Gender */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="firstName" className="block font-medium">
              First Name
            </label>
            <Input
              id="firstName"
              {...register("firstName")}
              className="w-full border p-2 rounded"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="gender" className="block font-medium">
              Gender
            </label>
            <Select
              onValueChange={(value) => {
                setValue("gender", value as "Male" | "Female");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender.message}</p>
            )}
          </div>
        </div>

        {/* NIC and Phone Number */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="nic" className="block font-medium">
              NIC
            </label>
            <Input
              id="nic"
              {...register("nic")}
              className="w-full border p-2 rounded"
            />
            {errors.nic && (
              <p className="text-red-500 text-sm">{errors.nic.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block font-medium">
              Phone Number
            </label>
            <Input
              id="phoneNumber"
              {...register("phoneNumber")}
              className="w-full border p-2 rounded"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Update Receptionist"}
        </Button>
      </form>
    </div>
  );
};

export default ReceptionistEditForm;
