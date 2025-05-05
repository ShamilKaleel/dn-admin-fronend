import { useState, useEffect } from "react";
import { Star, Send, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFeedback } from "@/hooks/useFeedback";

// Define validation schema using Zod
const feedbackSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Please enter a valid email address"),
  comments: z
    .string()
    .min(5, "Comments must be at least 5 characters")
    .max(1000),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const { addFeedback } = useFeedback();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
  });

  const onSubmit = async (data: FeedbackFormData) => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Create feedback object with form data and rating
      const feedbackData = {
        id: Math.random().toString(36).substr(2, 9), // Temporary ID for demo
        name: data.name,
        email: data.email,
        rating: rating,
        comments: data.comments,
        showOnWebsite: true, // Default to showing feedback
      };

      // Call the addFeedback function from the context
      await addFeedback(feedbackData);

      // Show success message
      setSuccess(true);
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });

      // Reset form
      reset();
      setRating(0);

      // After 5 seconds, hide success message
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          Share Your Experience
        </CardTitle>
        <CardDescription className="text-center">
          We value your feedback. Please tell us about your visit.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {success ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
              Thank you!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your feedback has been submitted successfully.
            </p>
            <Button variant="outline" onClick={() => setSuccess(false)}>
              Submit Another Feedback
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Rating */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Rating</label>
              <div className="flex items-center justify-center">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={`transition-colors ${
                          (hoveredRating || rating) >= star
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              {rating === 0 && (
                <p className="text-xs text-center text-muted-foreground">
                  Please select a rating
                </p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Your name"
                className="w-full"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Your email address"
                className="w-full"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <label htmlFor="comments" className="block text-sm font-medium">
                Comments
              </label>
              <Textarea
                id="comments"
                {...register("comments")}
                placeholder="Please share your experience with us"
                rows={4}
                className="w-full"
              />
              {errors.comments && (
                <p className="text-xs text-red-500">
                  {errors.comments.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Feedback
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
