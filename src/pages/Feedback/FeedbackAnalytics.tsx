import { useState, useEffect, useMemo } from "react";
import { useFeedback } from "@/hooks/useFeedback";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  Star,
  CheckCircle,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import StarRating from "@/pages/Feedback/star-rating";

const FeedbackAnalytics = () => {
  const { feedbackState, fetchFeedbacks } = useFeedback();
  const [loading, setLoading] = useState(true);

  const feedbacks = feedbackState.feedbacks;

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        if (isMounted) setLoading(true);
        await fetchFeedbacks();
      } catch (error) {
        console.error("Failed to fetch feedback data", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Only fetch if we don't already have data
    if (feedbacks.length === 0) {
      loadData();
    } else {
      setLoading(false);
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [fetchFeedbacks, feedbacks.length]);

  // Calculate average rating
  const averageRating = useMemo(() => {
    if (!feedbacks.length) return 0;
    return (
      feedbacks.reduce((sum, item) => sum + item.rating, 0) / feedbacks.length
    ).toFixed(1);
  }, [feedbacks]);

  // Calculate rating distribution
  const ratingDistribution = useMemo(() => {
    const distribution = [0, 0, 0, 0, 0]; // For ratings 1-5

    feedbacks.forEach((feedback) => {
      distribution[Math.floor(feedback.rating) - 1]++;
    });

    return [1, 2, 3, 4, 5].map((rating, index) => ({
      rating,
      count: distribution[index],
      percentage: feedbacks.length
        ? Math.round((distribution[index] / feedbacks.length) * 100)
        : 0,
    }));
  }, [feedbacks]);

  // Load appropriate content based on the current state
  if (loading && feedbacks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Tabs for Overview and Ratings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Feedback
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbacks.length}</div>
            <p className="text-xs text-muted-foreground">
              Total feedback received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <span className="text-2xl font-bold mr-2">{averageRating}</span>
              <StarRating rating={Number(averageRating)} size="sm" />
            </div>
            <p className="text-xs text-muted-foreground">
              From {feedbacks.length} reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Positive Feedback
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedbacks.filter((f) => f.rating >= 4).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {(
                (feedbacks.filter((f) => f.rating >= 4).length /
                  feedbacks.length) *
                  100 || 0
              ).toFixed(1)}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Areas for Improvement
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feedbacks.filter((f) => f.rating <= 2).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {(
                (feedbacks.filter((f) => f.rating <= 2).length /
                  feedbacks.length) *
                  100 || 0
              ).toFixed(1)}
              % of total
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rating Details</CardTitle>
          <CardDescription>
            Detailed breakdown of ratings across {feedbacks.length} feedbacks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ratingDistribution
              .slice()
              .reverse()
              .map((item) => (
                <div key={item.rating} className="flex items-center">
                  <div className="w-12 text-sm font-medium">
                    {item.rating} {item.rating === 1 ? "Star" : "Stars"}
                  </div>
                  <div className="w-full ml-4">
                    <div className="h-4 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor:
                            item.rating >= 4
                              ? "#22c55e" // green for 4-5 stars
                              : item.rating === 3
                              ? "#f59e0b" // amber for 3 stars
                              : "#ef4444", // red for 1-2 stars
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-right ml-4 text-sm font-medium">
                    {item.count}
                  </div>
                  <div className="w-16 text-right ml-2 text-sm text-muted-foreground">
                    {item.percentage}%
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rating Insights</CardTitle>
            <CardDescription>
              Key metrics about your feedback ratings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium">Average Rating</p>
                  <p className="text-2xl font-bold">{averageRating}</p>
                </div>
                <StarRating rating={Number(averageRating)} size="lg" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Highest Rated</p>
                  <p className="text-2xl font-bold">
                    {Math.max(...(feedbacks.map((f) => f.rating) || [0]))}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Lowest Rated</p>
                  <p className="text-2xl font-bold">
                    {feedbacks.length
                      ? Math.min(...feedbacks.map((f) => f.rating))
                      : 0}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">
                    Positive (4-5 Stars)
                  </p>
                  <p className="text-2xl font-bold">
                    {feedbacks.filter((f) => f.rating >= 4).length}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {(
                      (feedbacks.filter((f) => f.rating >= 4).length /
                        feedbacks.length) *
                        100 || 0
                    ).toFixed(1)}
                    % of total
                  </p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">
                    Negative (1-2 Stars)
                  </p>
                  <p className="text-2xl font-bold">
                    {feedbacks.filter((f) => f.rating <= 2).length}
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {(
                      (feedbacks.filter((f) => f.rating <= 2).length /
                        feedbacks.length) *
                        100 || 0
                    ).toFixed(1)}
                    % of total
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rating Comparison</CardTitle>
            <CardDescription>
              Compare different aspects of your ratings
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {feedbacks.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={[
                    {
                      name: "1 Star",
                      count: ratingDistribution[0].count,
                    },
                    {
                      name: "2 Stars",
                      count: ratingDistribution[1].count,
                    },
                    {
                      name: "3 Stars",
                      count: ratingDistribution[2].count,
                    },
                    {
                      name: "4 Stars",
                      count: ratingDistribution[3].count,
                    },
                    {
                      name: "5 Stars",
                      count: ratingDistribution[4].count,
                    },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" name="Number of Ratings">
                    {ratingDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index >= 3
                            ? "#22c55e" // green for 4-5 stars
                            : index === 2
                            ? "#f59e0b" // amber for 3 stars
                            : "#ef4444" // red for 1-2 stars
                        }
                      />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">
                  No rating data available
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackAnalytics;
