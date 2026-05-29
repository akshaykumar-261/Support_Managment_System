import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Home from "../afterAuth/Home.jsx";
import Login from "../beforeAuth/Login.jsx";
import Register from "../beforeAuth/Register.jsx";
import Forgotpassword from "../beforeAuth/Forgotpassword.jsx";
import DashboardAfterauth from "../afterAuth/DashboardAfterauth.jsx";
import AllTicketsAfterauth from "../afterAuth/AllTicketsAfterauth.jsx";
import TicketDetailAfterauth from "../afterAuth/TicketDetailAfterauth.jsx";
import TicketAssignmentPanel from "../afterAuth/TicketAssignmentPanel.jsx";
import TicketHistoryPanel from "../afterAuth/TicketHistoryPanel.jsx";
import CustomerTickets from "../afterAuth/CustomerTickets.jsx"; // Naya component jo hum banyenge
import UserManagementPanel from "../afterAuth/UserManagementPanel.jsx";
import AgentManagmentPanel from "../afterAuth/AgentManagmentPanel.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

const RoleGuard = ({ children, allowedRoles }) => {
  const { isAuthenticated, roleId } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(roleId)) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

const ROLES = {
  ADMIN: 1,
  AGENT: 2,
  CUSTOMER: 3, // Customer ke liye roleId 3 setup kiya
};

const CommonLandingRedirect = () => {
  const { roleId } = useAuth();

  if (roleId === ROLES.ADMIN) {
    return <DashboardAfterauth />;
  } else if (roleId === ROLES.AGENT) {
    return <Navigate to="all-tickets" replace />;
  } else if (roleId === ROLES.CUSTOMER) {
    return <Navigate to="my-tickets" replace />; // Customer login hote hi yahan jayega
  } else {
    return <Navigate to="/" replace />;
  }
};

const router = createBrowserRouter([
  { index: true, element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgotPassword", element: <Forgotpassword /> },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <CommonLandingRedirect /> },
      // Admin & Agent Routes
      {
        path: "all-tickets",
        element: (
          <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.AGENT]}>
            <AllTicketsAfterauth />
          </RoleGuard>
        ),
      },
      {
        path: "ticket-detail/:id",
        element: (
          <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.AGENT]}>
            <TicketDetailAfterauth />
          </RoleGuard>
        ),
      },
      {
        path: "assign-panel",
        element: (
          <RoleGuard allowedRoles={[ROLES.ADMIN]}>
            <TicketAssignmentPanel />
          </RoleGuard>
        ),
      },
      {
        path: "ticket-history",
        element: (
          <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.AGENT]}>
            <TicketHistoryPanel />
          </RoleGuard>
        ),
      },
      {
        path: "customers",
        element: (
          <RoleGuard allowedRoles={[ROLES.ADMIN]}>
            <UserManagementPanel initialTab={0} />
          </RoleGuard>
        ),
      },
      {
        path: "agent",
        element: (
          <RoleGuard allowedRoles={[ROLES.ADMIN]}>
            <AgentManagmentPanel initialTab={0} />
          </RoleGuard>
        ),
      },
      {
        path: "my-tickets",
        element: (
          <RoleGuard allowedRoles={[ROLES.CUSTOMER]}>
            <CustomerTickets />
          </RoleGuard>
        ),
      },
    ],
  },
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}
export default AppRoutes;
