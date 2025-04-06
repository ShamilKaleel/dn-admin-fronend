import { Patient } from "@/types/patient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, User, CreditCard, Fingerprint } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PatientDetailsProps {
  patient: Patient;
}

export default function PatientDetails({ patient }: PatientDetailsProps) {
  // Get patient initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="mt-5 w-full transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Patient Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Patient Avatar and Core Details */}
          <div className="flex items-center gap-3 md:border-r md:pr-6 pb-4 md:pb-0">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {getInitials(patient.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{patient.name}</h3>
              <p className="text-sm text-muted-foreground">
                Patient ID: {patient.id}
              </p>
            </div>
          </div>

          {/* Contact Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
            <div className="flex gap-2 items-start">
              <Fingerprint className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">NIC</p>
                <p className="font-medium">{patient.nic}</p>
              </div>
            </div>

            <div className="flex gap-2 items-start">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium truncate max-w-[180px]">
                  {patient.email}
                </p>
              </div>
            </div>

            <div className="flex gap-2 items-start">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Contact Numbers</p>
                <div>
                  {patient.contactNumbers.map((number, index) => (
                    <p key={index} className="font-medium">
                      {number}
                      {index < patient.contactNumbers.length - 1 && ", "}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
