import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSchedules } from "@/hooks/useSchedule";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type StatusBarProps = {
  status:
    | "AVAILABLE"
    | "UNAVAILABLE"
    | "CANCELLED"
    | "FULL"
    | "FINISHED"
    | "ACTIVE";
  cardId: string;
};

const StatusBar: React.FC<StatusBarProps> = ({ status, cardId }) => {
  const [currentStatus, setCurrentStatus] = useState<string>(status);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);

  const { toast } = useToast();
  const { updateScheduleStatus } = useSchedules();

  // Define styles or messages for each status
  const statusStyles: { [key: string]: string } = {
    FULL: "text-yellow-900 bg-yellow-200 border-yellow-600",
    AVAILABLE: "text-purple-900 bg-purple-300 border-purple-500",
    CANCELLED: "text-gray-900 bg-gray-300 border-gray-500",
    UNAVAILABLE: "text-red-900 bg-red-200 border-red-500",
    FINISHED: "text-green-900 bg-green-200 border-green-500",
    ACTIVE: "text-blue-900 bg-blue-200 border-blue-500",
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);
    setLoadingStatus(newStatus);

    try {
      await updateScheduleStatus(cardId, newStatus);
      setCurrentStatus(newStatus);

      toast({
        title: "Status updated",
        description: `Status updated to ${newStatus}`,
      });
    } catch (error: any) {
      console.log(error.response);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.details?.error || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
      setLoadingStatus(null);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`w-[85px] h-6 text-center border font-semibold rounded-lg text-xs ${statusStyles[currentStatus]} flex items-center justify-center`}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              currentStatus
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px] z-50">
          <DropdownMenuItem className="group flex w-full items-center justify-between text-left p-0 text-sm font-base">
            <button
              onClick={() => handleStatusChange("AVAILABLE")}
              className="w-full justify-start flex rounded-md p-2 transition-all duration-75"
              disabled={isLoading}
            >
              {loadingStatus === "AVAILABLE" ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  AVAILABLE
                </span>
              ) : (
                "AVAILABLE"
              )}
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem className="group flex w-full items-center justify-between text-left p-0 text-sm font-base">
            <button
              onClick={() => handleStatusChange("UNAVAILABLE")}
              className="w-full justify-start flex rounded-md p-2 transition-all duration-75"
              disabled={isLoading}
            >
              {loadingStatus === "UNAVAILABLE" ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  UNAVAILABLE
                </span>
              ) : (
                "UNAVAILABLE"
              )}
            </button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="group flex w-full items-center justify-between text-left p-0 text-sm font-base">
            <button
              onClick={() => handleStatusChange("ACTIVE")}
              className="w-full justify-start flex rounded-md p-2 transition-all duration-75"
              disabled={isLoading}
            >
              {loadingStatus === "ACTIVE" ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ACTIVE
                </span>
              ) : (
                "ACTIVE"
              )}
            </button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="group flex w-full items-center justify-between text-left p-0 text-sm font-base">
            <button
              onClick={() => handleStatusChange("FULL")}
              className="w-full justify-start flex rounded-md p-2 transition-all duration-75"
              disabled={isLoading}
            >
              {loadingStatus === "FULL" ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  FULL
                </span>
              ) : (
                "FULL"
              )}
            </button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="group flex w-full items-center justify-between text-left p-0 text-sm font-base">
            <button
              onClick={() => handleStatusChange("CANCELLED")}
              className="w-full justify-start flex rounded-md p-2 transition-all duration-75"
              disabled={isLoading}
            >
              {loadingStatus === "CANCELLED" ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  CANCELLED
                </span>
              ) : (
                "CANCELLED"
              )}
            </button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="group flex w-full items-center justify-between text-left p-0 text-sm font-base">
            <button
              onClick={() => handleStatusChange("FINISHED")}
              className="w-full justify-start flex rounded-md p-2 transition-all duration-75"
              disabled={isLoading}
            >
              {loadingStatus === "FINISHED" ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  FINISHED
                </span>
              ) : (
                "FINISHED"
              )}
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default StatusBar;
