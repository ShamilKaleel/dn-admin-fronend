import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFeedback } from "@/hooks/useFeedback";
import { Feedback } from "@/types/feedback";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";

// Import our custom components
import EnhancedFeedbackPage from "./EnhancedFeedbackPage";
import FeedbackAnalytics from "./FeedbackAnalytics";

import StarRating from "./star-rating";

const FeedbackPage = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("manage");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { feedbackState, fetchFeedbacks } = useFeedback();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await fetchFeedbacks();
      } catch (error) {
        console.error("Failed to fetch feedback data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchFeedbacks]);

  const handleViewDetails = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setIsDetailOpen(true);
  };

  // If still loading initial data
  if (loading && feedbackState.feedbacks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4 " />
        <p className="text-muted-foreground">Loading feedback data...</p>
      </div>
    );
  }

  return (
    <div className="container pb-5 px-2 lg:px-0 mx-auto">
      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground mb-4">
          <TabsTrigger
            value="manage"
            className="inline-flex items-center justify-center whitespace-nowrap px-4 "
          >
            Feedback
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="inline-flex items-center justify-center whitespace-nowrap px-4"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Manage Feedback Tab */}
        <TabsContent value="manage" className="mt-4">
          <div className="pl-2 mb-6">
            <h1 className="text-2xl font-bold">Feedback Management</h1>
            <p className="text-muted-foreground">
              View and manage patient feedback
            </p>
          </div>
          <EnhancedFeedbackPage onViewDetails={handleViewDetails} />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-4">
          <div className="mb-6 pl-2">
            <h1 className="text-2xl font-bold">Feedback Analytics</h1>
            <p className="text-muted-foreground">
              View insights from patient feedback data
            </p>
          </div>
          <FeedbackAnalytics />
        </TabsContent>
      </Tabs>

      {/* Feedback Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-xl">
          {selectedFeedback && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle>Feedback Details</DialogTitle>
                  <StarRating rating={selectedFeedback.rating} />
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium">Name:</div>
                  <div className="col-span-2">{selectedFeedback.name}</div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium">Email:</div>
                  <div className="col-span-2 break-all">
                    {selectedFeedback.email}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium">Visibility:</div>
                  <div className="col-span-2">
                    {selectedFeedback.showOnWebsite ? "Public" : "Hidden"}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-medium">Comments:</div>
                  <div className="bg-muted/50 p-4 rounded-md max-h-64 overflow-y-auto whitespace-pre-wrap break-words">
                    {selectedFeedback.comments}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setIsDetailOpen(false)}>Close</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackPage;
