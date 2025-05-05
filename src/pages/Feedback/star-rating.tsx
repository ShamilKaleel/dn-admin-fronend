import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const StarRating = ({
  rating,
  size = "md",
  interactive = false,
  onChange,
  className,
}: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Determine the size of the stars based on the prop
  const starSize = {
    sm: 16,
    md: 20,
    lg: 24,
  }[size];

  // Determine text size for the rating number
  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size];

  const handleClick = (clickedRating: number) => {
    if (interactive && onChange) {
      onChange(clickedRating);
    }
  };

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <button
            key={`full-${i}`}
            type="button"
            onClick={() => handleClick(i + 1)}
            className={cn(
              "text-yellow-400",
              interactive
                ? "cursor-pointer hover:scale-110 transition-transform"
                : "cursor-default"
            )}
            aria-label={`${i + 1} stars`}
            disabled={!interactive}
          >
            <Star
              size={starSize}
              className="fill-yellow-400 transition-colors"
            />
          </button>
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <button
            type="button"
            onClick={() => handleClick(fullStars + 0.5)}
            className={cn(
              "text-yellow-400",
              interactive
                ? "cursor-pointer hover:scale-110 transition-transform"
                : "cursor-default"
            )}
            aria-label={`${fullStars + 0.5} stars`}
            disabled={!interactive}
          >
            <StarHalf
              size={starSize}
              className="fill-yellow-400 transition-colors"
            />
          </button>
        )}

        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <button
            key={`empty-${i}`}
            type="button"
            onClick={() =>
              handleClick(fullStars + (hasHalfStar ? 1 : 0) + i + 1)
            }
            className={cn(
              "text-gray-300 dark:text-gray-600",
              interactive
                ? "cursor-pointer hover:text-yellow-400 hover:scale-110 transition-all"
                : "cursor-default"
            )}
            aria-label={`${fullStars + (hasHalfStar ? 1 : 0) + i + 1} stars`}
            disabled={!interactive}
          >
            <Star size={starSize} className="transition-colors" />
          </button>
        ))}
      </div>

      {/* Rating number */}
      <span
        className={cn(
          "ml-1.5 font-medium text-gray-600 dark:text-gray-400",
          textSize
        )}
      >
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default StarRating;
