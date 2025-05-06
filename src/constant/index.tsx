import {
  Home,
  Shield,
  User,
  Settings,
  Calendar,
  ClipboardList,
  Stethoscope,
  NotebookPen,
  BookUser,
  UserCircle,
} from "lucide-react";

const navLinks = [
  {
    title: "Dashboard",
    path: "/",
    icon: <Home size={20} />, // Icon with size
  },
  {
    title: "Admin",
    path: "/admin",
    icon: <Shield size={20} />,
  },
  {
    title: "Dentist",
    path: "/dentist",
    icon: <Stethoscope size={20} />,
  },
  {
    title: "Patient",
    path: "/patient",
    icon: <User size={20} />,
  },
  {
    title: "Receptionist",
    path: "/receptionist",
    icon: <Settings size={20} />,
  },
  {
    title: "Schedule",
    path: "/schedule",
    icon: <Calendar size={20} />,
  },
  {
    title: "Appointment List",
    path: "/appointment-list",
    icon: <ClipboardList size={20} />,
  },
  {
    title: "Feedback",
    path: "/feedback",
    icon: <NotebookPen size={20} />,
  },
  {
    title: "Contact Us",
    path: "/contact-us",
    icon: <BookUser size={20} />,
  },
  {
    title: "My Profile",
    path: "/profile",
    icon: <UserCircle size={20} />,
  },
];

const columnHeadersBooking = [
  "Reference Id",
  "Appointment Number",
  "Name",
  "NIC",
  "Contact Number",
  "Email",
  "Address",
  "ScheduleId",
  "scheduleDate",
  "scheduleDayOfWeek",
  "scheduleStatus",
  "scheduleStartTime",
  "doctorName",
  "Status",
  "Date",
  "Day Of Week",
  "Created At",
];

const columnHeadersDoctor = [
  "Id",
  "User Name",
  "Email",
  "Gender",
  "First Name",
  "Specialization",
  "License Number",
  "Phone Number",
  "Nic",
  "Roles",
];

const columnHeadersReceptionist = [
  "Id",
  "User Name",
  "Email",
  "Gender",
  "First Name",
  "Phone Number",
  "Nic",
  "Roles",
];

const columnHeadersPatient = ["Id", "Name", "Email", "NIC", "Contact Number"];

const columnHeadersSchedule = [
  "Id",
  "Date",
  "Day Of Week",
  "Status",
  "Number Of Bookings",
  "Bookings",
  "Start Time",
  "End Time",
  "Duration",
  "Dentist Id",
  "Capacity",
  "Available Slots",
  "Created At",
];
export {
  navLinks,
  columnHeadersBooking,
  columnHeadersDoctor,
  columnHeadersSchedule,
  columnHeadersReceptionist,
  columnHeadersPatient,
};
