import { createContext, useReducer, ReactNode, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import { Receptionist, CreateReceptionist } from "@/types/receptionist";

// Actions for Receptionist
type ReceptionistAction =
  | { type: "FETCH_RECEPTIONISTS"; payload: Receptionist[] }
  | { type: "CREATE_RECEPTIONIST"; payload: Receptionist }
  | { type: "UPDATE_RECEPTIONIST"; payload: Receptionist }
  | { type: "DELETE_RECEPTIONIST"; payload: string };

// Receptionist state
interface ReceptionistState {
  receptionists: Receptionist[];
}

const initialState: ReceptionistState = {
  receptionists: [],
};

// Reducer
const receptionistReducer = (
  state: ReceptionistState,
  action: ReceptionistAction
): ReceptionistState => {
  switch (action.type) {
    case "FETCH_RECEPTIONISTS":
      return { receptionists: action.payload };
    case "CREATE_RECEPTIONIST":
      return { receptionists: [...state.receptionists, action.payload] };
    case "UPDATE_RECEPTIONIST":
      return {
        receptionists: state.receptionists.map((receptionist) =>
          receptionist.id === action.payload.id ? action.payload : receptionist
        ),
      };
    case "DELETE_RECEPTIONIST":
      return {
        receptionists: state.receptionists.filter(
          (receptionist) => receptionist.id !== action.payload
        ),
      };
    default:
      return state;
  }
};

// Context
export const ReceptionistContext = createContext<{
  receptionistState: ReceptionistState;
  fetchReceptionists: () => Promise<void>;
  createReceptionist: (receptionist: CreateReceptionist) => Promise<void>;
  updateReceptionist: (
    id: string,
    receptionist: CreateReceptionist
  ) => Promise<void>;
  deleteReceptionist: (id: string) => Promise<void>;
  getReceptionistById: (id: string) => Promise<Receptionist>;
} | null>(null);

// Provider
export const ReceptionistProvider = ({ children }: { children: ReactNode }) => {
  const [receptionistState, dispatch] = useReducer(
    receptionistReducer,
    initialState
  );

  useEffect(() => {
    try {
      const fetchData = async () => {
        await fetchReceptionists();
      };
      fetchData();
    } catch (error) {
      console.error("Failed to fetch receptionists", error);
    }
  }, []);

  const fetchReceptionists = async () => {
    const response = await axiosInstance.get("/receptionist/all");
    dispatch({ type: "FETCH_RECEPTIONISTS", payload: response.data });
  };

  const createReceptionist = async (receptionist: CreateReceptionist) => {
    const response = await axiosInstance.post<Receptionist>(
      "/receptionist/create",
      receptionist
    );
    dispatch({ type: "CREATE_RECEPTIONIST", payload: response.data });
  };

  const updateReceptionist = async (
    id: string,
    receptionist: CreateReceptionist
  ) => {
    const response = await axiosInstance.put<Receptionist>(
      `/receptionist/${id}`,
      receptionist
    );
    dispatch({ type: "UPDATE_RECEPTIONIST", payload: response.data });
  };

  const deleteReceptionist = async (id: string) => {
    await axiosInstance.delete(`/receptionist/${id}`);

    dispatch({ type: "DELETE_RECEPTIONIST", payload: id });
  };

  const getReceptionistById = async (id: string) => {
    const response = await axiosInstance.get<Receptionist>(
      `/receptionist/${id}`
    );
    return response.data;
  };

  return (
    <ReceptionistContext.Provider
      value={{
        receptionistState,
        fetchReceptionists,
        createReceptionist,
        updateReceptionist,
        deleteReceptionist,
        getReceptionistById,
      }}
    >
      {children}
    </ReceptionistContext.Provider>
  );
};
