import { useLog } from "@/hooks/useLog";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MoreHorizontal,
  SquarePen,
  Trash2,
  ArrowUpRight,
  FileText,
  Calendar,
} from "lucide-react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import LogDeleteForm from "@/components/forms/log-delete-from";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PatientLogsProps {
  patientID: string;
}

const PatientLogs: React.FC<PatientLogsProps> = ({ patientID }) => {
  const { logState } = useLog();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedLogIndex, setSelectedLogIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleView = (id: string) => {
    navigate(`/patient/${patientID}/log/${id}`);
  };

  // Function to format date in a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  if (!logState) {
    return (
      <div className="mt-5">
        <Card>
          <CardContent className="p-8 flex justify-center">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
              <p className="text-muted-foreground">Loading patient logs...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {selectedLogIndex !== null && (
        <ResponsiveDialog
          isOpen={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          title="Delete Treatment Log"
          description="Are you sure you want to delete this treatment log? This action cannot be undone."
        >
          <LogDeleteForm
            patientId={patientID}
            logId={logState.logs[selectedLogIndex].id}
            setIsOpen={setIsDeleteOpen}
          />
        </ResponsiveDialog>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Treatment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logState.logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-md">
              <Calendar className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
              <h3 className="text-lg font-medium">No Treatment Records</h3>
              <p className="text-muted-foreground max-w-md mt-1">
                This patient doesn't have any treatment logs yet. Click "Add Log
                Book" to create the first entry.
              </p>
            </div>
          ) : (
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {logState.logs.map((log, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <Card className="h-full border border-border hover:border-primary/40 transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <Badge
                            variant="outline"
                            className="bg-primary/10 text-primary hover:bg-primary/20 whitespace-nowrap"
                          >
                            {log.actionType}
                          </Badge>

                          <DropdownMenu>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Actions</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleView(log.id)}
                              >
                                <SquarePen className="h-4 w-4 mr-2" />
                                <span>View Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-500 focus:text-red-500"
                                onClick={() => {
                                  setSelectedLogIndex(index);
                                  setIsDeleteOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm">
                            <span className="text-muted-foreground mr-2">
                              Dr:
                            </span>
                            <span className="font-medium truncate">
                              {log.dentistName}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="text-muted-foreground mr-2">
                              Date:
                            </span>
                            <span className="font-medium">
                              {formatDate(log.timestamp)}
                            </span>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleView(log.id)}
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <span>View Record</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-end gap-2 mt-4">
                <CarouselPrevious className="static transform-none" />
                <CarouselNext className="static transform-none" />
              </div>
            </Carousel>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientLogs;
