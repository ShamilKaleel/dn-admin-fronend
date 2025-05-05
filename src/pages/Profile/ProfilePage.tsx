import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/api/axiosInstance";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Shield,
  Stethoscope,
  Settings,
  Mail,
  Phone,
  IdCard,
  UserCircle,
  Briefcase,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

// Define interfaces based on provided types
interface User {
  username: string;
  roles: string[];
}

interface Dentist {
  id: string;
  userName: string;
  email: string;
  gender: "Male" | "Female";
  firstName: string;
  specialization: string;
  licenseNumber: string;
  nic: string;
  phoneNumber: string;
  roles: string[];
}

interface Receptionist {
  id: string;
  userName: string;
  email: string;
  gender: string;
  firstName: string;
  phoneNumber: string;
  nic: string;
  roles: string[];
}

type UserDetails = Partial<Dentist> &
  Partial<Receptionist> & {
    roles: string[];
  };

const ProfilePage = () => {
  const { authState } = useAuth();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user details from the backend
  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        // First get basic user info
        const userResponse = await axiosInstance.get("/auth/user");
        const userData = userResponse.data;

        // Initial user details
        const details: UserDetails = {
          id: userData.id,
          userName: userData.username,
          email: userData.email || "",
          roles: userData.roles,
        };

        // Check roles and fetch additional details if needed
        if (userData.roles.includes("ROLE_DENTIST")) {
          try {
            // If user is a dentist, fetch dentist-specific details
            const dentistResponse = await axiosInstance.get(
              `/dentist/${userData.id}`
            );
            const dentistData = dentistResponse.data;

            // Add dentist-specific data
            details.specialization = dentistData.specialization;
            details.licenseNumber = dentistData.licenseNumber;
            details.firstName = dentistData.firstName;
            details.phoneNumber = dentistData.phoneNumber;
            details.nic = dentistData.nic;
            details.gender = dentistData.gender;
          } catch (error) {
            console.error("Error fetching dentist details:", error);
          }
        } else if (userData.roles.includes("ROLE_RECEPTIONIST")) {
          try {
            // If user is a receptionist, fetch receptionist-specific details
            const receptionistResponse = await axiosInstance.get(
              `/receptionist/${userData.id}`
            );
            const receptionistData = receptionistResponse.data;

            // Add receptionist-specific data
            details.firstName = receptionistData.firstName;
            details.phoneNumber = receptionistData.phoneNumber;
            details.nic = receptionistData.nic;
            details.gender = receptionistData.gender;
          } catch (error) {
            console.error("Error fetching receptionist details:", error);
          }
        }
        // For admin users, we already have their basic info from auth/user
        // No need to fetch additional details for admin

        setUserDetails(details);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast({
          title: "Error",
          description: "Failed to load profile information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (authState) {
      fetchUserDetails();
    }
  }, [authState, toast]);

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ROLE_ADMIN":
        return <Shield className="h-4 w-4" />;
      case "ROLE_DENTIST":
        return <Stethoscope className="h-4 w-4" />;
      case "ROLE_RECEPTIONIST":
        return <Settings className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case "ROLE_ADMIN":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "ROLE_DENTIST":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "ROLE_RECEPTIONIST":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Determine if it's a dentist or receptionist profile
  const isDentist = userDetails?.roles.includes("ROLE_DENTIST");
  const isReceptionist = userDetails?.roles.includes("ROLE_RECEPTIONIST");
  const isAdmin = userDetails?.roles.includes("ROLE_ADMIN");

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview Card */}
        <Card className="col-span-1 lg:col-span-1 overflow-hidden">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/10 dark:to-primary/5 p-6 flex flex-col items-center">
            <Avatar className="h-32 w-32 ring-4 ring-background shadow-xl">
              <AvatarImage src="" alt={userDetails?.userName || "User"} />
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                {userDetails?.firstName?.[0] ||
                  userDetails?.userName?.[0] ||
                  "U"}
              </AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-2xl font-bold">
              {userDetails?.firstName || userDetails?.userName}
            </h2>
            {userDetails?.email && (
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{userDetails.email}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {userDetails?.roles.map((role, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className={`px-3 py-1 ${getRoleColor(
                    role
                  )} border-none flex gap-2 items-center`}
                >
                  {getRoleIcon(role)}
                  {role.replace("ROLE_", "")}
                </Badge>
              ))}
            </div>

            {isAdmin && (
              <div className="mt-4 text-center px-4 py-3 bg-primary/10 rounded-lg">
                <p className="text-sm text-primary font-medium">
                  Admin account with system management privileges
                </p>
              </div>
            )}
          </div>

          {/* Account Info Section */}
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <UserCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium">{userDetails?.userName}</p>
                </div>
              </div>

              {userDetails?.nic && (
                <div className="flex items-start gap-3">
                  <IdCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">NIC</p>
                    <p className="font-medium">{userDetails.nic}</p>
                  </div>
                </div>
              )}

              {userDetails?.gender && (
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium">{userDetails.gender}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information Card */}
        <Card className="col-span-1 lg:col-span-2 overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-6">
              {isAdmin
                ? "Administrator Details"
                : isDentist
                ? "Dentist Profile"
                : "Receptionist Profile"}
            </h3>

            {/* Only show this section for non-admin users */}
            {!isAdmin && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userDetails?.firstName && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-5 w-5 text-primary" />
                        <h4 className="font-medium">First Name</h4>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        {userDetails.firstName}
                      </div>
                    </div>
                  )}

                  {userDetails?.phoneNumber && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-primary" />
                        <h4 className="font-medium">Phone Number</h4>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        {userDetails.phoneNumber}
                      </div>
                    </div>
                  )}

                  {/* Dentist specific fields */}
                  {isDentist && (
                    <>
                      {userDetails?.specialization && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-primary" />
                            <h4 className="font-medium">Specialization</h4>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg">
                            {userDetails.specialization}
                          </div>
                        </div>
                      )}

                      {userDetails?.licenseNumber && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <h4 className="font-medium">License Number</h4>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg">
                            {userDetails.licenseNumber}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {(isDentist || isReceptionist) && (
                  <div className="mt-8">
                    <Separator className="my-6" />
                    <div className="bg-muted/30 p-5 rounded-lg">
                      <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary inline-block"></span>
                        {isDentist ? "Dental Professional" : "Staff Member"}
                      </h4>
                      <p className="text-muted-foreground">
                        {isDentist
                          ? "As a dental professional, you have access to patient records, appointment scheduling, and treatment planning tools."
                          : "As a receptionist, you help manage appointments, patient intake, and clinic operations."}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Admin specific content */}
            {isAdmin && (
              <div className="space-y-6">
                <div className="bg-primary/10 p-5 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    System Administrator
                  </h4>
                  <p className="text-muted-foreground">
                    As an administrator, you have full access to manage the
                    dental clinic system, including user accounts, permissions,
                    and system settings.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <h5 className="font-medium mb-1">User Management</h5>
                    <p className="text-sm text-muted-foreground">
                      Manage staff accounts and permissions
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <h5 className="font-medium mb-1">System Settings</h5>
                    <p className="text-sm text-muted-foreground">
                      Configure clinic operations
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <h5 className="font-medium mb-1">Reports & Analytics</h5>
                    <p className="text-sm text-muted-foreground">
                      Access clinic performance data
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
