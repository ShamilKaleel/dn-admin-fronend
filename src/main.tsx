import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

import { AuthProvider } from "./contexts/authContext";
import { BookingProvider } from "./contexts/bookingContext";
import { DentistProvider } from "./contexts/dentistContext";
import { ScheduleProvider } from "./contexts/scheduleContext";
import { ThemeProvider } from "./components/theme-provider";
import { PatientProvider } from "./contexts/patientContext";
import { PatientLogProvider } from "./contexts/patientLogContext";
import { FeedbackProvider } from "./contexts/feedbackContext";
import { ReceptionistProvider } from "./contexts/receptionistContext";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <DentistProvider>
        <ReceptionistProvider>
          <ThemeProvider>
            <ScheduleProvider>
              <BookingProvider>
                <PatientProvider>
                  <PatientLogProvider>
                    <FeedbackProvider>
                      <App />
                    </FeedbackProvider>
                  </PatientLogProvider>
                </PatientProvider>
              </BookingProvider>
            </ScheduleProvider>
          </ThemeProvider>
        </ReceptionistProvider>
      </DentistProvider>
    </AuthProvider>
  </StrictMode>
);
