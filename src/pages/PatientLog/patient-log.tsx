import React, { useState } from "react";
import { PatientLog } from "@/types/patient-log";
import PatientLogHeader from "./patient-log-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, ExternalLink, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PatientLoggProps {
  log: PatientLog;
  patientID: string;
}

const PatientLogg: React.FC<PatientLoggProps> = ({ log, patientID }) => {
  // State to track loading for each image
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>(
    log.photos.reduce((acc, photo) => {
      acc[photo.id] = true; // Initially, all images are loading
      return acc;
    }, {} as { [key: string]: boolean })
  );

  // Function to handle image load
  const handleImageLoad = (photoId: string) => {
    setLoadingStates((prev) => ({
      ...prev,
      [photoId]: false, // Set loading to false when image is loaded
    }));
  };

  return (
    <>
      <PatientLogHeader patientID={patientID} logID={log.id} />
      <div className="w-full py-4">
        <div className="space-y-6">
          {/* Treatment Details Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">Treatment Details</h2>
                  <Badge
                    variant="outline"
                    className="text-primary bg-primary/10 hover:bg-primary/20"
                  >
                    {log.actionType}
                  </Badge>
                </div>

                <div className="border-l-4 border-primary/60 pl-4 py-2 bg-muted/50 rounded-r-md">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">
                    {log.description || "No description provided."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      Attending Dentist
                    </p>
                    <p className="font-medium">Dr. {log.dentistName}</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="text-sm text-muted-foreground">Timestamp</p>
                    <p className="font-medium">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Treatment Images Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  Treatment Images
                </h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click on any image to view in full size</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {log.photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {log.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative aspect-square rounded-md overflow-hidden border"
                    >
                      {/* Loading Placeholder */}
                      {loadingStates[photo.id] && (
                        <Skeleton className="absolute inset-0 rounded-md" />
                      )}

                      {/* Image */}
                      <img
                        src={photo.url}
                        alt={photo.description || "Treatment image"}
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          loadingStates[photo.id] ? "opacity-0" : "opacity-100"
                        }`}
                        onLoad={() => handleImageLoad(photo.id)}
                      />

                      {/* Hover Overlay */}
                      <div
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => window.open(photo.url, "_blank")}
                      >
                        <ExternalLink className="h-6 w-6 text-white" />
                      </div>

                      {/* Optional Description */}
                      {photo.description && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-1 text-sm truncate">
                          {photo.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 bg-muted/30 rounded-md">
                  <Camera className="h-10 w-10 text-muted-foreground mb-2 opacity-50" />
                  <p className="text-muted-foreground">
                    No images available for this treatment.
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click "Add Image" above to upload treatment photos.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PatientLogg;
