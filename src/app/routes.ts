import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { FacultyDashboard } from "./pages/FacultyDashboard";
import { StudentDashboard } from "./pages/StudentDashboard";
import { UploadMarks } from "./pages/UploadMarks";
import { Analytics } from "./pages/Analytics";
import { ReportCards } from "./pages/ReportCards";
import { SGPAPredictor } from "./pages/SGPAPredictor";
import { Grievances } from "./pages/Grievances";
import { AcademicCalendar } from "./pages/AcademicCalendar";
import { NotFound } from "./pages/NotFound";
import { StudentAnalytics } from "./pages/StudentAnalytics";
import { StudentReports } from "./pages/StudentReports";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/faculty",
    Component: FacultyDashboard,
  },
  {
    path: "/student",
    Component: StudentDashboard,
  },
  {
    path: "/upload-marks",
    Component: UploadMarks,
  },
  {
    path: "/analytics",
    Component: Analytics,
  },
  {
    path: "/reports",
    Component: ReportCards,
  },
  {
    path: "/student-analytics",
    Component: StudentAnalytics,
  },
  {
    path: "/student-reports",
    Component: StudentReports,
  },
  {
    path: "/sgpa-predictor",
    Component: SGPAPredictor,
  },
  {
    path: "/grievances",
    Component: Grievances,
  },
  {
    path: "/calendar",
    Component: AcademicCalendar,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
