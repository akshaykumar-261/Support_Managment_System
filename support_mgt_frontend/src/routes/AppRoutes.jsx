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
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};
const router = createBrowserRouter([
  {
    index: true,
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgotPassword",
    element: <Forgotpassword />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardAfterauth />,
      },
      {
        path: "all-tickets",
        element: <AllTicketsAfterauth />,
      },
      {
        path: "ticket/:id",
        element: <TicketDetailAfterauth />,
      },
      {
        path: "assign-panel", 
        element: <TicketAssignmentPanel />,
      },
    ],
  },
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}
export default AppRoutes;
