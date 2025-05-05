import React, { useState, useEffect } from "react";
import { PatientLog } from "@/types/patient-log";
import PatientLogHeader from "./patient-log-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, ExternalLink, Info, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLog } from "@/hooks/useLog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface PatientLoggProps {
  log: PatientLog;
  patientID: string;
}

const PatientLogg: React.FC<PatientLoggProps> = ({ log, patientID }) => {
  // Get functions from context
  const { deletePhotoFromLog, getLogById } = useLog();

  // State to track the current log data
  const [currentLog, setCurrentLog] = useState<PatientLog>(log);

  // State for tracking loading images
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});

  // Initialize loading states when photos change
  useEffect(() => {
    setLoadingStates(
      currentLog.photos.reduce((acc, photo) => {
        acc[photo.id] = true; // Initially, all images are loading
        return acc;
      }, {} as { [key: string]: boolean })
    );
  }, [currentLog.photos]);

  // Refresh log data when log prop changes
  useEffect(() => {
    setCurrentLog(log);
  }, [log]);

  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);

  // Function to handle image load
  const handleImageLoad = (photoId: string) => {
    setLoadingStates((prev) => ({
      ...prev,
      [photoId]: false, // Set loading to false when image is loaded
    }));
  };

  // Function to open delete confirmation dialog
  const openDeleteDialog = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent click event (image open)
    setPhotoToDelete(photoId);
    setIsDeleteDialogOpen(true);
  };

  // Function to handle photo deletion
  const handleDeletePhoto = async () => {
    if (!photoToDelete) return;

    try {
      await deletePhotoFromLog(patientID, currentLog.id, photoToDelete);

      // Update the local state by filtering out the deleted photo
      setCurrentLog((prev) => ({
        ...prev,
        photos: prev.photos.filter((photo) => photo.id !== photoToDelete),
      }));

      toast({
        title: "Photo deleted",
        description: "The photo has been successfully removed.",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to delete photo:", error);
      toast({
        title: "Error",
        description: "Failed to delete the photo. Please try again.",
        variant: "destructive",
      });

      // Refresh the log data from the server in case of an error
      try {
        const refreshedLog = await getLogById(patientID, currentLog.id);
        setCurrentLog(refreshedLog);
      } catch (refreshError) {
        console.error("Failed to refresh log data:", refreshError);
      }
    } finally {
      setIsDeleteDialogOpen(false);
      setPhotoToDelete(null);
    }
  };

  return (
    <>
      <PatientLogHeader patientID={patientID} logID={currentLog.id} />
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
                    {currentLog.actionType}
                  </Badge>
                </div>

                <div className="border-l-4 border-primary/60 pl-4 py-2 bg-muted/50 rounded-r-md">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">
                    {currentLog.description || "No description provided."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      Attending Dentist
                    </p>
                    <p className="font-medium">Dr. {currentLog.dentistName}</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-md">
                    <p className="text-sm text-muted-foreground">Timestamp</p>
                    <p className="font-medium">
                      {new Date(currentLog.timestamp).toLocaleString()}
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
                      <p>
                        Click on image to view full size, or hover for options
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {currentLog.photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {currentLog.photos.map((photo) => (
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
                        onClick={() => window.open(photo.url, "_blank")}
                      />

                      {/* Hover Controls Overlay */}
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* View Image Button */}
                        <button
                          className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mx-1 hover:bg-white/30 transition-colors"
                          onClick={() => window.open(photo.url, "_blank")}
                          aria-label="View full image"
                        >
                          <ExternalLink className="h-4 w-4 text-white" />
                        </button>

                        {/* Delete Image Button */}
                        <button
                          className="h-8 w-8 rounded-full bg-red-500/70 flex items-center justify-center mx-1 hover:bg-red-500/90 transition-colors"
                          onClick={(e) => openDeleteDialog(photo.id, e)}
                          aria-label="Delete image"
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePhoto}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PatientLogg;
