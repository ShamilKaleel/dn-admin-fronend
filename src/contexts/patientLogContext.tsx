import { createContext, useReducer, ReactNode, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import { PatientLog, CreateLog } from "@/types/patient-log";
import { LogPhoto } from "@/types/patient-log";
import { useAuth } from "@/hooks/useAuth";

// Actions for Patient Log
type PatientLogAction =
  | { type: "FETCH_LOGS"; payload: PatientLog[] }
  | { type: "CREATE_LOG"; payload: PatientLog }
  | { type: "DELETE_LOG"; payload: string }
  | { type: "UPDATE_LOG"; payload: { logID: string; newPhoto: LogPhoto } };

// Patient Log state
interface PatientLogState {
  logs: PatientLog[];
}

const initialState: PatientLogState = {
  logs: [],
};

// Reducer
const patientLogReducer = (
  state: PatientLogState,
  action: PatientLogAction
): PatientLogState => {
  switch (action.type) {
    case "FETCH_LOGS":
      return { logs: action.payload };
    case "CREATE_LOG":
      return { logs: [...state.logs, action.payload] };
    case "DELETE_LOG":
      return {
        logs: state.logs.filter((log) => log.id !== action.payload),
      };
    case "UPDATE_LOG":
      return {
        logs: state.logs.map((log) =>
          log.id === action.payload.logID
            ? { ...log, photos: [...log.photos, action.payload.newPhoto] }
            : log
        ),
      };
    default:
      return state;
  }
};

// Context
export const PatientLogContext = createContext<{
  logState: PatientLogState;
  fetchLogs: (logs: PatientLog[]) => Promise<void>;
  createLog: (log: CreateLog, patientID: string) => Promise<void>;
  deleteLog: (patientId: string, id: string) => Promise<void>;
  getLogById: (patientId: string, id: string) => Promise<PatientLog>;
  addPhotoToLog: (
    patientID: string,
    logID: string,
    key: string
  ) => Promise<void>;
} | null>(null);

// Provider
export const PatientLogProvider = ({ children }: { children: ReactNode }) => {
  const [logState, dispatch] = useReducer(patientLogReducer, initialState);

  const fetchLogs = async (logs: PatientLog[]) => {
    dispatch({ type: "FETCH_LOGS", payload: logs });
  };

  const createLog = async (log: CreateLog, patientID: string) => {
    console.log(patientID);
    const response = await axiosInstance.post<PatientLog>(
      `/patients/${patientID}/logs`,
      log
    );
    dispatch({ type: "CREATE_LOG", payload: response.data });
  };

  const deleteLog = async (patientId: string, id: string) => {
    await axiosInstance.delete(`/patients/${patientId}/logs/${id}`);
    dispatch({ type: "DELETE_LOG", payload: id });
  };

  const getLogById = async (patientId: string, id: string) => {
    const response = await axiosInstance.get<PatientLog>(
      `/patients/${patientId}/logs/${id}`
    );
    return response.data;
  };

  const addPhotoToLog = async (
    patientID: string,
    logID: string,
    key: string
  ) => {
    const response = await axiosInstance.post<LogPhoto>(
      `/patients/${patientID}/logs/${logID}/photos`,
      {
        s3Keys: [key],
      },
      {
        withCredentials: true, // Ensures cookies and credentials are sent
      }
    );

    const newPhoto = response.data;

    // Update the specific log in the state
    dispatch({
      type: "UPDATE_LOG",
      payload: { logID, newPhoto },
    });
  };

  return (
    <PatientLogContext.Provider
      value={{
        logState,
        fetchLogs,
        createLog,
        deleteLog,
        getLogById,
        addPhotoToLog,
      }}
    >
      {children}
    </PatientLogContext.Provider>
  );
};
