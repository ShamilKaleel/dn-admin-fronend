import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Lorder from "@/components/Lorder";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import LoginImage from "@/assets/images/LoginImage.png";
import Pattern from "@/assets/images/Pattern.png";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/assets/images/Logo.png";
import { useToast } from "@/hooks/use-toast";

// Schema validation using Zod
const schema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

// Infer the form values' types from the schema
type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
  // Get the login function from the AuthContext
  const { login } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  // Initialize React Hook Form with Zod resolver and default values
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  // Function to handle form submission
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await login(data.username, data.password);
      toast({
        title: "Login Successful",
        description: "Redirecting to dashboard...",
      });
    } catch (error: any) {
      // Handle API error response
      setError("root", {
        type: "manual",
        message: error.response?.data?.message || "Invalid email or password",
      });
    }
  };

  return (
    <div className=" grid grid-cols-1 lg:grid-cols-2 ">
      <div className="flex flex-col justify-center w-full h-screen items-center relative">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold lg:absolute top-10 left-10 pb-10"
        >
          <img src={Logo} className="h-10 w-10" />

          <span className="text-2xl font-bold ">DN Dental</span>
        </Link>
        <div className="px-8 py-16">
          <h1 className="text-2xl font-bold text-center mb-3">
            Login to your account
          </h1>
          <p className="text-balance text-sm text-muted-foreground pb-10">
            Enter your email below to login to your account
          </p>

          {/* Form for email and password input */}
          <form
            className="flex flex-col gap-5 w-[300px]"
            onSubmit={handleSubmit(onSubmit)} // Attach form submission handler
          >
            {/* Email input field */}
            <div className="flex flex-col items-start relative">
              <label htmlFor="email" className="pl-1 mb-2">
                Email
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  {...register("username")}
                  type="text"
                  placeholder="name@example.com"
                  className="pl-10 w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              {/* Display email validation error */}
              <p className="text-red-500 text-xs mt-1 pl-1">
                {errors.username?.message}
              </p>
            </div>

            {/* Password input field */}
            <div className="flex flex-col items-start relative">
              <label htmlFor="password" className="pl-1 mb-2">
                Password
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 w-full pr-10 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {/* Display password validation error */}
              <p className="text-red-500 text-xs mt-1 pl-1">
                {errors.password?.message}
              </p>
              <p className="text-right w-full block mt-5">
                <Link
                  to="/forget-password"
                  className="underline text-gray-500 hover:text-primary transition-colors"
                >
                  Forgot Password?
                </Link>
              </p>
            </div>

            {/* Submit button with loader */}
            <div className="w-full pt-5 relative">
              <Button
                disabled={isSubmitting} // Disable button during submission
                type="submit"
                className="mx-auto w-full"
              >
                {isSubmitting ? <Lorder /> : "Sign In"}{" "}
                {/* Show loader or text */}
              </Button>
              {/* Display form-level error message */}

              <p className="text-center text-red-500 pl-1 absolute top-32 left-0 right-0">
                {errors.root?.message}
              </p>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden lg:block bg-primary relative object-cover ">
        <img src={Pattern} alt="login" className="h-screen w-full absolute" />
        <div className="pl-10 flex justify-center w-full h-screen items-center   ">
          <img src={LoginImage} alt="login" className="" />
        </div>
      </div>
    </div>
  );
}
