import { useState, useEffect } from "react";
import { useFeedback } from "@/hooks/useFeedback";
import { Feedback } from "@/types/feedback";
import {
  Star,
  StarHalf,
  Search,
  SlidersHorizontal,
  X,
  ThumbsUp,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface EnhancedFeedbackPageProps {
  onViewDetails?: (feedback: Feedback) => void;
}

const EnhancedFeedbackPage = ({ onViewDetails }: EnhancedFeedbackPageProps) => {
  const { feedbackState, fetchFeedbacks, toggleShowOnWebsite } = useFeedback();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterVisibility, setFilterVisibility] = useState<boolean | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        setLoading(true);
        await fetchFeedbacks();
      } catch (error) {
        console.error("Failed to fetch feedbacks", error);
        toast({
          title: "Error",
          description: "Failed to load feedback data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadFeedbacks();
  }, []);

  const handleToggleVisibility = async (id: string, currentState: boolean) => {
    try {
      await toggleShowOnWebsite(id);
      toast({
        title: "Success",
        description: `Feedback is now ${
          currentState ? "hidden from" : "visible on"
        } the website`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update visibility",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (feedback: Feedback) => {
    if (onViewDetails) {
      onViewDetails(feedback);
    } else {
      setSelectedFeedback(feedback);
      setIsDetailOpen(true);
    }
  };

  const clearFilters = () => {
    setFilterRating(null);
    setFilterVisibility(null);
    setSearchTerm("");
  };

  const filteredFeedbacks = feedbackState.feedbacks.filter((feedback) => {
    // Filter by search term
    const matchesSearch =
      searchTerm === "" ||
      feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.comments.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by rating
    const matchesRating =
      filterRating === null || feedback.rating >= filterRating;

    // Filter by visibility
    const matchesVisibility =
      filterVisibility === null || feedback.showOnWebsite === filterVisibility;

    // Filter by tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "visible" && feedback.showOnWebsite) ||
      (activeTab === "hidden" && !feedback.showOnWebsite);

    return matchesSearch && matchesRating && matchesVisibility && matchesTab;
  });

  // Sort feedbacks
  const sortedFeedbacks = [...filteredFeedbacks].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (b.id as any) - (a.id as any); // Using id as proxy for creation date
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      case "a-z":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Function to render stars
  const StarRating = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            size={16}
            className="fill-yellow-400 text-yellow-400"
          />
        ))}

        {hasHalfStar && (
          <StarHalf size={16} className="fill-yellow-400 text-yellow-400" />
        )}

        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={16} className="text-gray-300" />
        ))}

        <span className="ml-1 text-xs text-gray-500">({rating})</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            type="text"
            placeholder="Search by name, email or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => setSearchTerm("")}
            >
              <X size={14} />
            </Button>
          )}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all" className="flex-1 sm:flex-initial">
              All
            </TabsTrigger>
            <TabsTrigger value="visible" className="flex-1 sm:flex-initial">
              Public
            </TabsTrigger>
            <TabsTrigger value="hidden" className="flex-1 sm:flex-initial">
              Hidden
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort Options</SelectLabel>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="highest">Highest Rating</SelectItem>
                <SelectItem value="lowest">Lowest Rating</SelectItem>
                <SelectItem value="a-z">Name (A-Z)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* <Button
            variant="outline"
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal size={16} />
            <span className="hidden md:inline">Filters</span>
          </Button> */}
        </div>
      </div>

      {/* Active Filters Display */}
      {(filterRating !== null || filterVisibility !== null || searchTerm) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>

          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search:{" "}
              {searchTerm.length > 15
                ? `${searchTerm.substring(0, 15)}...`
                : searchTerm}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => setSearchTerm("")}
              >
                <X size={10} />
              </Button>
            </Badge>
          )}

          {filterRating !== null && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Min Rating: {filterRating}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => setFilterRating(null)}
              >
                <X size={10} />
              </Button>
            </Badge>
          )}

          {filterVisibility !== null && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filterVisibility ? "Public Only" : "Hidden Only"}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => setFilterVisibility(null)}
              >
                <X size={10} />
              </Button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={clearFilters}
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Feedback Grid */}
      {loading && feedbackState.feedbacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading feedback data...</p>
        </div>
      ) : sortedFeedbacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="bg-muted rounded-full p-3 mb-4">
            <ThumbsUp className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-1">No feedback found</h3>
          <p className="text-muted-foreground">
            {searchTerm || filterRating !== null || filterVisibility !== null
              ? "Try adjusting your filters to see more results"
              : "Your patients haven't submitted any feedback yet"}
          </p>
          {(searchTerm ||
            filterRating !== null ||
            filterVisibility !== null) && (
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear All Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedFeedbacks.map((feedback) => (
            <Card
              key={feedback.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardHeader className="p-4 pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base line-clamp-1">
                      {feedback.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {feedback.email}
                    </p>
                  </div>
                  <StarRating rating={feedback.rating} />
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-2 pb-0">
                <div
                  className="bg-muted/40 p-3 rounded-md cursor-pointer h-24 overflow-hidden relative"
                  onClick={() => handleViewDetails(feedback)}
                >
                  <p className="text-sm line-clamp-4 text-muted-foreground">
                    {feedback.comments}
                  </p>
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background/90 to-transparent" />
                </div>
              </CardContent>

              <CardFooter className="flex justify-between items-center p-4 pt-3">
                <div className="flex items-center gap-2">
                  {feedback.showOnWebsite ? (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 text-xs bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                    >
                      <Eye size={12} />
                      Public
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 text-xs bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800"
                    >
                      <EyeOff size={12} />
                      Hidden
                    </Badge>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <SlidersHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleViewDetails(feedback)}
                    >
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleToggleVisibility(
                          feedback.id,
                          feedback.showOnWebsite
                        )
                      }
                    >
                      {feedback.showOnWebsite
                        ? "Hide from Website"
                        : "Show on Website"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Filter Dialog */}

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
                  <div className="col-span-2 flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="visibility-toggle"
                        checked={selectedFeedback.showOnWebsite}
                        onCheckedChange={(checked) => {
                          handleToggleVisibility(selectedFeedback.id, !checked);
                          setSelectedFeedback({
                            ...selectedFeedback,
                            showOnWebsite: checked,
                          });
                        }}
                      />
                      <Label htmlFor="visibility-toggle">
                        {selectedFeedback.showOnWebsite ? "Public" : "Hidden"}
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-medium">Comments:</div>
                  <div className="bg-muted/50 p-4 rounded-md max-h-64 overflow-y-auto whitespace-pre-wrap break-words">
                    {selectedFeedback.comments}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={() => setIsDetailOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dynamic count badge */}
      <div className="text-sm text-muted-foreground pt-2">
        Showing {sortedFeedbacks.length} of {feedbackState.feedbacks.length}{" "}
        feedback entries
      </div>
    </div>
  );
};

export default EnhancedFeedbackPage;
