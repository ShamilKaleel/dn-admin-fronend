import { createContext, useReducer, ReactNode } from "react";
import axiosInstance from "@/api/axiosInstance";
import { Feedback } from "@/types/feedback";

// Actions for Feedback
type FeedbackAction =
  | { type: "FETCH_FEEDBACKS"; payload: Feedback[] }
  | { type: "ADD_FEEDBACK"; payload: Feedback }
  | { type: "DELETE_FEEDBACK"; payload: string }
  | { type: "TOGGLE_SHOW_ON_WEBSITE"; payload: Feedback };

// Feedback state
interface FeedbackState {
  feedbacks: Feedback[];
}

const initialState: FeedbackState = {
  feedbacks: [],
};

// Reducer
const feedbackReducer = (
  state: FeedbackState,
  action: FeedbackAction
): FeedbackState => {
  switch (action.type) {
    case "FETCH_FEEDBACKS":
      return { feedbacks: action.payload };
    case "ADD_FEEDBACK":
      return { feedbacks: [...state.feedbacks, action.payload] };
    case "DELETE_FEEDBACK":
      return {
        feedbacks: state.feedbacks.filter(
          (feedback) => feedback.id !== action.payload
        ),
      };
    case "TOGGLE_SHOW_ON_WEBSITE":
      return {
        feedbacks: state.feedbacks.map((feedback) =>
          feedback.id === action.payload.id ? action.payload : feedback
        ),
      };
    default:
      return state;
  }
};

// Context
export const FeedbackContext = createContext<{
  feedbackState: FeedbackState;
  fetchFeedbacks: () => Promise<void>;
  addFeedback: (feedback: Feedback) => Promise<void>;
  deleteFeedback: (id: string) => Promise<void>;
  toggleShowOnWebsite: (id: string) => Promise<void>;
} | null>(null);

// Provider
export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const [feedbackState, dispatch] = useReducer(feedbackReducer, initialState);

  // feedbackContext.tsx (partial changes)
  const fetchFeedbacks = async () => {
    // Don't fetch if we already have data
    if (feedbackState.feedbacks.length > 0) {
      return;
    }

    try {
      const response = await axiosInstance.get<Feedback[]>("/feedback/all");
      dispatch({ type: "FETCH_FEEDBACKS", payload: response.data });
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      // Re-throw so component can handle display of error
    }
  };

  const addFeedback = async (feedback: Feedback) => {
    const response = await axiosInstance.post<Feedback>(
      "/api/feedback/submit",
      feedback
    );
    dispatch({ type: "ADD_FEEDBACK", payload: response.data });
  };

  const deleteFeedback = async (id: string) => {
    await axiosInstance.delete(`/feedback/${id}`);
    dispatch({ type: "DELETE_FEEDBACK", payload: id });
  };

  const toggleShowOnWebsite = async (id: string) => {
    const response = await axiosInstance.put<Feedback>(`/feedback/show/${id}`);
    dispatch({ type: "TOGGLE_SHOW_ON_WEBSITE", payload: response.data });
  };

  return (
    <FeedbackContext.Provider
      value={{
        feedbackState,
        fetchFeedbacks,
        addFeedback,
        deleteFeedback,
        toggleShowOnWebsite,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};
