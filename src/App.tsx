import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "@/pages/Auth/LoginPage";
import SignupPage from "@/pages/Auth/SignupPage";
import NotFoundPage from "@/pages/Auth/NotFoundPage";
import { useAuth } from "@/hooks/useAuth";
import DashboardPage from "@/pages/Dashboard/DashboardPage";
import AdminPage from "@/pages/Admin/AdminPage";
import DentistPage from "@/pages/Dentist/DentistPage";
import PatientPage from "@/pages/Patient/PatientPage";
import ReceptionistPage from "@/pages/Receptionist/ReceptionistPage";
import SchedulePage from "@/pages/Schedule/SchedulePage";
import AppointmentListPage from "@/pages/AppointmentList/AppointmentList";
import ForgetPasswordPage from "./pages/Auth/ForgetPasswordPage";
import { Toaster } from "@/components/ui/toaster";
import ResetPasswordPage from "@/pages/Auth/ResetPasswordPage";
import Layout from "./Layout";
import FeedbackPage from "@/pages/Feedback/FeedbackPage";
import ContactUsPage from "@/pages/ContactUs/ContactUsPage";
import PatientLogPage from "./pages/PatientLog/PatientLogBookPage";
import PatientLogDetails from "./pages/PatientLog/PatientLogPage";
import RoleRoute from "./components/RoleRoute";
import ProfilePage from "@/pages/Profile/ProfilePage";

//test git
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { authState, isLording } = useAuth();

  if (!authState && !isLording) {
    console.log("ProtectedRoute: User is not authenticated");
    // Redirect to login if the user is not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  const { authState } = useAuth();
  return (
    <Router basename="/admin">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={!authState ? <LoginPage /> : <Navigate to="/" replace />}
        />
        {/* Signup Not working*/}
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          {/* <Route
            path="/admin"
            element={<RoleRoute element={<AdminPage />} path="/admin" />}
          /> */}
          <Route
            path="/dentist"
            element={<RoleRoute element={<DentistPage />} path="/dentist" />}
          />
          <Route
            path="/patient"
            element={<RoleRoute element={<PatientPage />} path="/patient" />}
          />
          <Route
            path="/patient/:id"
            element={<RoleRoute element={<PatientLogPage />} path="/patient" />}
          />
          <Route
            path="/patient/:id/log/:logID"
            element={
              <RoleRoute element={<PatientLogDetails />} path="/patient" />
            }
          />
          <Route
            path="/receptionist"
            element={
              <RoleRoute element={<ReceptionistPage />} path="/receptionist" />
            }
          />
          <Route
            path="/schedule"
            element={<RoleRoute element={<SchedulePage />} path="/schedule" />}
          />
          <Route
            path="/appointment-list"
            element={
              <RoleRoute
                element={<AppointmentListPage />}
                path="/appointment-list"
              />
            }
          />
          <Route
            path="/feedback"
            element={<RoleRoute element={<FeedbackPage />} path="/feedback" />}
          />
          <Route
            path="/contact-us"
            element={
              <RoleRoute element={<ContactUsPage />} path="/contact-us" />
            }
          />
          {/* Profile Page - Accessible to all authenticated users without role restrictions */}
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route
          path="/forget-password"
          element={
            !authState ? <ForgetPasswordPage /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/reset-password"
          element={
            !authState ? <ResetPasswordPage /> : <Navigate to="/" replace />
          }
        />
        {/* Error Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}
