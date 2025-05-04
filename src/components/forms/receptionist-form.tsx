import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReceptionist } from "@/hooks/useReceptionist";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CreateReceptionist } from "@/types/receptionist";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const receptionistSchema = z.object({
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
  nic: z
    .string()
    .regex(/^(\d{9}[VX]|[1-9]\d{11})$/, "Please enter a valid NIC number")
    .min(10, "NIC number should be 10 characters")
    .max(12, "NIC number should be 12 characters"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone Number must be 10 digits"),
});

export type ReceptionistFormInputs = z.infer<typeof receptionistSchema>;

interface ReceptionistFormProps {
  setIsOpen: (isOpen: boolean) => void;
}

const ReceptionistForm: React.FC<ReceptionistFormProps> = ({ setIsOpen }) => {
  const { createReceptionist } = useReceptionist();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<ReceptionistFormInputs>({
    resolver: zodResolver(receptionistSchema),
  });

  const onSubmit = async (data: ReceptionistFormInputs) => {
    try {
      await createReceptionist(data as CreateReceptionist);

      toast({
        title: "Receptionist Created",
        description:
          "New Receptionist has been added with username: " + data.userName,
      });
      reset();
      setIsOpen(false);
    } catch (error: any) {
      toast({
        title: "Error creating receptionist",
        description: error.response?.data?.details.error || "An error occurred",
        variant: "destructive",
      });

      console.error(
        "Error creating receptionist:",
        error.response?.data?.details.error
      );
    }
  };

  return (
    <div className="w-full rounded px-3 md:px-0">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* First row - Username and Email */}
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

        {/* Second row - First Name and Gender */}
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

        {/* Third row - NIC and Phone Number */}
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

        {/* Fourth row - Password */}
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

        {/* Submit button */}
        <Button type="submit" className="w-full py-2" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create Receptionist"}
        </Button>
      </form>
    </div>
  );
};

export default ReceptionistForm;
