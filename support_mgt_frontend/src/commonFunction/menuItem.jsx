import DashboardIcon from "@mui/icons-material/Dashboard";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import { ROLES } from "./role.jsx";
export const MENU_ITEMS = [
  {
    text: "DashBoard",
    path: "/home",
    icon: <DashboardIcon sx={{ color: "white" }} />,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    text: " Tickets",
    path: "/home/all-tickets",
    icon: <ConfirmationNumberIcon sx={{ color: "white" }} />,
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT],
  },
  {
    text: "My Support Tickets",
    path: "/home/my-tickets",
    icon: <ConfirmationNumberIcon sx={{ color: "white" }} />,
    allowedRoles: [ROLES.CUSTOMER],
  },
  {
    text: "Assign Ticket To Agent",
    path: "/home/assign-panel",
    icon: <AssignmentIndIcon sx={{ color: "white" }} />,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    text: "Re-Assign Ticket",
    path: "/home/ticket-history",
    icon: <LowPriorityIcon sx={{ color: "white" }} />,
    allowedRoles: [ROLES.ADMIN, ROLES.AGENT],
  },
  {
    text: "Customer Management",
    path: "/home/customers",
    icon: <AssignmentIndIcon sx={{ color: "white" }} />,
    allowedRoles: [ROLES.ADMIN],
  },
  {
    text: "Agent Management",
    path: "/home/agent",
    icon: <AssignmentIndIcon sx={{ color: "white" }} />,
    allowedRoles: [ROLES.ADMIN],
  },
];
