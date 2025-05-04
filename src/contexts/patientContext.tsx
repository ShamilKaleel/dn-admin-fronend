import { createContext, useReducer, ReactNode, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import { Patient, CreatePatient, UpdatePatient } from "@/types/patient";
import { useAuth } from "@/hooks/useAuth";
// Actions for Patient
type PatientAction =
  | { type: "FETCH_PATIENTS"; payload: Patient[] }
  | { type: "CREATE_PATIENT"; payload: Patient }
  | { type: "UPDATE_PATIENT"; payload: Patient }
  | { type: "DELETE_PATIENT"; payload: string };

// Patient state
interface PatientState {
  patients: Patient[];
}

const initialState: PatientState = {
  patients: [],
};

// Reducer
const patientReducer = (
  _state: PatientState,
  action: PatientAction
): PatientState => {
  switch (action.type) {
    case "FETCH_PATIENTS":
      return { patients: action.payload };
    case "CREATE_PATIENT":
      return { patients: [..._state.patients, action.payload] };
    case "UPDATE_PATIENT":
      return {
        patients: _state.patients.map((patient) =>
          patient.id === action.payload.id ? action.payload : patient
        ),
      };
    case "DELETE_PATIENT":
      return {
        patients: _state.patients.filter(
          (patient) => patient.id !== action.payload
        ),
      };
    default:
      return _state;
  }
};

// Context
export const PatientContext = createContext<{
  patientState: PatientState;
  fetchPatients: () => Promise<void>;
  createPatient: (patient: CreatePatient) => Promise<void>;
  updatePatient: (id: string, patient: UpdatePatient) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  getPatientById: (id: string) => Promise<Patient>;
  getOrCreatePatientFromBooking: (bookingId: string) => Promise<Patient>;
} | null>(null);

// Provider
export const PatientProvider = ({ children }: { children: ReactNode }) => {
  const [patientState, dispatch] = useReducer(patientReducer, initialState);
  const { authState } = useAuth();
  useEffect(() => {
    try {
      const fetchData = async () => {
        await fetchPatients();
      };
      fetchData();
    } catch (error) {
      console.error("Failed to fetch patients", error);
    }
  }, [authState]);

  const fetchPatients = async () => {
    const response = await axiosInstance.get("/patients/all");
    dispatch({ type: "FETCH_PATIENTS", payload: response.data });
  };

  const createPatient = async (patient: CreatePatient) => {
    console.log(patient);
    const response = await axiosInstance.post<Patient>(
      "/patients/create",
      patient
    );
    dispatch({ type: "CREATE_PATIENT", payload: response.data });
  };

  const getOrCreatePatientFromBooking = async (bookingId: string) => {
    const response = await axiosInstance.post<Patient>(
      `/bookings/${bookingId}/get-or-create-patient`
    );
    dispatch({ type: "CREATE_PATIENT", payload: response.data });

    return response.data;
  };

  const updatePatient = async (id: string, patient: UpdatePatient) => {
    const response = await axiosInstance.put<Patient>(
      `/patients/${id}`,
      patient
    );
    dispatch({ type: "UPDATE_PATIENT", payload: response.data });
  };

  const deletePatient = async (id: string) => {
    await axiosInstance.delete(`/patients/${id}`);
    dispatch({ type: "DELETE_PATIENT", payload: id });
  };

  const getPatientById = async (id: string) => {
    const response = await axiosInstance.get<Patient>(`/patients/${id}`);
    return response.data;
  };

  return (
    <PatientContext.Provider
      value={{
        patientState,
        fetchPatients,
        createPatient,
        updatePatient,
        deletePatient,
        getPatientById,
        getOrCreatePatientFromBooking,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};
