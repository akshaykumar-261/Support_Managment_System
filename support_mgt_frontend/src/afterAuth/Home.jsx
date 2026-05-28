import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen"; // Naya icon band karne ke liye
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { AppGridContainer } from "../Component/GridCommanComponent.jsx";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance.jsx";
// Icons Imports
import DashboardIcon from "@mui/icons-material/Dashboard";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import LogoutIcon from "@mui/icons-material/Logout";

function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const { roleId } = useAuth();
  const navigate = useNavigate();

  // Toggle behavior function jo toggle karega state ko
  const handleDrawerToggle = () => {
    setIsOpen(!isOpen);
  };

  // --- LOGOUT HANDLER FUNCTION ---
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/logout");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      navigate("/", { replace: true });
    }
  };

  const menuItems = [
    {
      text: "DashBoard",
      path: "/home",
      icon: <DashboardIcon sx={{ color: "white" }} />,
      allowedRoles: [1],
    },
    {
      text: " Tickets",
      path: "/home/all-tickets",
      icon: <ConfirmationNumberIcon sx={{ color: "white" }} />,
      allowedRoles: [1, 2],
    },
    {
      text: "My Support Tickets",
      path: "/home/my-tickets",
      icon: <ConfirmationNumberIcon sx={{ color: "white" }} />,
      allowedRoles: [3],
    },
    {
      text: "Assign Ticket To Agent",
      path: "/home/assign-panel",
      icon: <AssignmentIndIcon sx={{ color: "white" }} />,
      allowedRoles: [1],
    },
    {
      text: "Re-Assign Ticket",
      path: "/home/ticket-history",
      icon: <LowPriorityIcon sx={{ color: "white" }} />,
      allowedRoles: [1, 2],
    },
    {
      text: "Customer Management",
      path: "/home/customers",
      icon: <AssignmentIndIcon sx={{ color: "white" }} />,
      allowedRoles: [1], // Only Admin
    },
    {
      text: "Agent Management",
      path: "/home/agent",
      icon: <AssignmentIndIcon sx={{ color: "white" }} />,
      allowedRoles: [1], // Only Admin
    },
  ];

  const getHeaderTitle = () => {
    if (roleId === 1) return "Admin DashBoard";
    if (roleId === 2) return "Agent DashBoard";
    if (roleId === 3) return "Customer Support Desk";
    return "Support Desk";
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.allowedRoles.includes(roleId),
  );

  return (
    <>
      <AppGridContainer sx={{ height: "100vh" }}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{ backgroundColor: "#6d28d9" }}>
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>

              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Welcome To {getHeaderTitle()}
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <Box sx={{ p: 4, flexGrow: 1, bgcolor: "#f5f5f5" }}>
          <Outlet />
        </Box>
      </AppGridContainer>

      <Drawer
        anchor="left"
        open={isOpen}
        // FIX 1: Jab tak backdrop ya escape key dabayein, tab tak band na ho
        disableEscapeKeyDown
        onClose={(event, reason) => {
          // Agar reason 'backdropClick' hai, toh return kar jao (kuch mat karo)
          if (reason === "backdropClick") return;
          handleDrawerToggle();
        }}
        // FIX 2: Backdrop (kala parda) click ko block karne ke liye pointer events control karna
        ModalProps={{
          enforceFocus: false,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: "280px",
            backgroundColor: "#9075BD",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        {/* Top Content Area */}
        <Box>
          {/* Drawer Header with MenuIcon to CLOSE */}
          <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
            {/* Sirf is Icon par click karne se hi ab navbar band hoga */}
            <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
              <MenuOpenIcon />
            </IconButton>
           
          </Box>

          <Divider />

          {/* Menu Items List */}
          <List sx={{ px: 1 }}>
            {filteredMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    "&:hover": {
                      backgroundColor: "#6d28d9",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: "1.1rem",
                          fontWeight: 500,
                          color: "white",
                        }}
                      >
                        {item.text}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* --- BOTTOM LOGOUT SECTION --- */}
        <Box sx={{ p: 2 }}>
          <Divider sx={{ mb: 2 }} />
          <List disablePadding>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setIsOpen(false); // Logout par close ho jaye
                  handleLogout();
                }}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  bgcolor: "#fff1f2",
                  "&:hover": {
                    backgroundColor: "#ffe4e6",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LogoutIcon sx={{ color: "#f43f5e" }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        color: "#e11d48",
                      }}
                    >
                      Logout
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Home;
