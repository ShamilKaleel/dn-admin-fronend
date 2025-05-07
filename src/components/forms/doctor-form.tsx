import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDentist } from "@/hooks/useDentist";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CreateDentist } from "@/types/dentist";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
const doctorSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  gender: z.enum(["Male", "Female"]).refine((val) => val !== undefined, {
    message: "Gender is required",
  }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one digit")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
  firstName: z.string().min(1, "First Name is required"),
  specialization: z.string().min(1, "Specialization is required"),
  licenseNumber: z.string().min(1, "License Number is required"),
  nic: z
    .string()
    .regex(/^(\d{9}[VX]|[1-9]\d{11})$/, "Please enter a valid NIC number")
    .min(10, "NIC number should be 10 characters")
    .max(12, "NIC number should be 12 characters"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone Number must be 10 digits"),
});

export type DoctorFormInputs = z.infer<typeof doctorSchema>;

interface DocterFormProps {
  setIsOpen: (isOpen: boolean) => void;
}

const DoctorForm: React.FC<DocterFormProps> = ({ setIsOpen }) => {
  const { createDentist } = useDentist();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<DoctorFormInputs>({
    resolver: zodResolver(doctorSchema),
  });

  const onSubmit = async (data: DoctorFormInputs) => {
    try {
      await createDentist(data as CreateDentist);

      toast({
        title: "Doctor Created",
        description:
          "New Doctor has been added Doctor user name: " + data.userName,
      });
      reset();
      setIsOpen(false);
    } catch (error: any) {
      toast({
        title: "Error creating doctor",
        description: error.response?.data?.details.error || "An error occurred",
        variant: "destructive",
      });

      console.error(
        "Error creating doctor:",
        error.response?.data?.details.error
      );
    }
  };

  return (
    <div className="w-full   rounded px-3 md:px-0">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Add this div to wrap the input fields */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="userName" className="block font-medium">
              Username
            </label>
            <Input
              id="userName"
              placeholder="Enter username"
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
              placeholder="Enter email"
              {...register("email")}
              className="w-full border p-2 rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Add this div to wrap the input fields */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="firstName" className="block font-medium">
              First Name
            </label>
            <Input
              id="firstName"
              placeholder="Enter first name"
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
                setValue("gender", value as any); // Cast to the expected type
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
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

        {/* Add this div to wrap the input fields */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="specialization" className="block font-medium">
              Specialization
            </label>
            <Input
              id="specialization"
              placeholder="Enter specialization"
              {...register("specialization")}
              className="w-full border p-2 rounded"
            />
            {errors.specialization && (
              <p className="text-red-500 text-sm">
                {errors.specialization.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="licenseNumber" className="block font-medium">
              License Number
            </label>
            <Input
              id="licenseNumber"
              placeholder="Enter license number"
              {...register("licenseNumber")}
              className="w-full border p-2 rounded"
            />
            {errors.licenseNumber && (
              <p className="text-red-500 text-sm">
                {errors.licenseNumber.message}
              </p>
            )}
          </div>
        </div>

        {/* Add this div to wrap the input fields */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="nic" className="block font-medium">
              NIC
            </label>
            <Input
              id="nic"
              placeholder="Enter NIC number"
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
              placeholder="Enter phone number"
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

        <div>
          <label htmlFor="password" className="block font-medium">
            Password
          </label>
          <Input
            id="password"
            placeholder="Enter password"
            type="password"
            {...register("password")}
            className="w-full border p-2 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full   py-2 "
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Create Doctor"}
        </Button>
      </form>
    </div>
  );
};

export default DoctorForm;
