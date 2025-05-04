import { createContext, useReducer, ReactNode } from "react";
import axiosInstance from "@/api/axiosInstance";
import { Dentist, CreateDentist, UpdateDentist } from "@/types/dentist";
import { useEffect } from "react";

// Actions for Dentist
type DentistAction =
  | { type: "FETCH_DENTISTS"; payload: Dentist[] }
  | { type: "CREATE_DENTIST"; payload: Dentist }
  | { type: "UPDATE_DENTIST"; payload: Dentist }
  | { type: "DELETE_DENTIST"; payload: string };

// Dentist state
interface DentistState {
  dentists: Dentist[];
}

const initialState: DentistState = {
  dentists: [],
};

// Reducer
const dentistReducer = (
  _state: DentistState,
  action: DentistAction
): DentistState => {
  switch (action.type) {
    case "FETCH_DENTISTS":
      return { dentists: action.payload };
    case "CREATE_DENTIST":
      return { dentists: [..._state.dentists, action.payload] };
    case "UPDATE_DENTIST":
      return {
        dentists: _state.dentists.map((dentist) =>
          dentist.id === action.payload.id ? action.payload : dentist
        ),
      };
    case "DELETE_DENTIST":
      return {
        dentists: _state.dentists.filter(
          (dentist) => dentist.id !== action.payload
        ),
      };
    default:
      return _state;
  }
};

// Context
export const DentistContext = createContext<{
  dentistState: DentistState;
  fetchDentists: () => Promise<void>;
  createDentist: (dentist: CreateDentist) => Promise<void>;
  updateDentist: (id: string, dentist: UpdateDentist) => Promise<void>;
  deleteDentist: (id: string) => Promise<void>;
  getDentistById: (id: string) => Promise<Dentist>;
} | null>(null);

// Provider
export const DentistProvider = ({ children }: { children: ReactNode }) => {
  const [dentistState, dispatch] = useReducer(dentistReducer, initialState);

  useEffect(() => {
    try {
      const fetchData = async () => {
        await fetchDentists();
      };
      fetchData();
    } catch (error) {
      console.error("Failed to fetch dentists", error);
    }
  }, []);

  const fetchDentists = async () => {
    const response = await axiosInstance.get("/dentist/all");
    dispatch({ type: "FETCH_DENTISTS", payload: response.data });
  };

  const createDentist = async (dentist: CreateDentist) => {
    const response = await axiosInstance.post<Dentist>(
      "/dentist/create",
      dentist
    );
    dispatch({ type: "CREATE_DENTIST", payload: response.data });
  };

  const updateDentist = async (id: string, dentist: UpdateDentist) => {
    const response = await axiosInstance.put<Dentist>(
      `/dentist/edit/${id}`,
      dentist
    );
    dispatch({ type: "UPDATE_DENTIST", payload: response.data });
  };

  const deleteDentist = async (id: string) => {
    await axiosInstance.delete(`/dentist/${id}`);
    dispatch({ type: "DELETE_DENTIST", payload: id });
  };

  const getDentistById = async (id: string) => {
    const response = await axiosInstance.get<Dentist>(`/dentist/${id}`);
    return response.data;
  };

  return (
    <DentistContext.Provider
      value={{
        dentistState,
        fetchDentists,
        createDentist,
        updateDentist,
        deleteDentist,
        getDentistById,
      }}
    >
      {children}
    </DentistContext.Provider>
  );
};
