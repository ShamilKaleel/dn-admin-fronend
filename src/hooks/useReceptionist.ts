import { useContext } from "react";
import { ReceptionistContext } from "@/contexts/receptionistContext";

export const useReceptionist = () => {
  const context = useContext(ReceptionistContext);
  if (!context) {
    throw new Error(
      "useReceptionist must be used within a Receptionist Provider"
    );
  }
  return context;
};
