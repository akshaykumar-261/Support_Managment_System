import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { AppGridContainer } from "../Component/GridCommanComponent.jsx";
import { Link, Outlet, useNavigate } from "react-router-dom"; // useNavigate import kiya
import { useAuth } from "../hooks/useAuth.jsx";
import toast from "react-hot-toast";

// Icons Imports
import DashboardIcon from "@mui/icons-material/Dashboard";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import LogoutIcon from "@mui/icons-material/Logout"; // Logout Icon import kiya

function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const { roleId } = useAuth();
  const navigate = useNavigate(); // Navigation ke liye hook initialize kiya

  const toggleDrawer = (openState) => () => {
    setIsOpen(openState);
  };

  // --- LOGOUT HANDLER FUNCTION ---
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      // Backend api call
      const response = await fetch("http://localhost:8088/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${token}`, // Agar backend authorize middleware headers se token leta hai
        },
      });

      if (response.ok) {
        toast.success("Logged out successfully");
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // API fail ho ya pass, user ka local session clear karke login par bhej dena best practice h
      localStorage.removeItem("accessToken");
      navigate("/", { replace: true });
    }
  };

  const menuItems = [
    {
      text: "DashBoard",
      path: "/home",
      icon: <DashboardIcon sx={{ color: "#6d28d9" }} />,
      allowedRoles: [1],
    },
    {
      text: "All Tickets",
      path: "/home/all-tickets",
      icon: <ConfirmationNumberIcon sx={{ color: "#6d28d9" }} />,
      allowedRoles: [1, 2],
    },
    {
      text: "My Support Tickets", // Naya option sirf Customer ko dikhane ke liye
      path: "/home/my-tickets",
      icon: <ConfirmationNumberIcon sx={{ color: "#6d28d9" }} />,
      allowedRoles: [3], // Only Customer (3)
    },
    {
      text: "Assign Ticket To Agent",
      path: "/home/assign-panel",
      icon: <AssignmentIndIcon sx={{ color: "#6d28d9" }} />,
      allowedRoles: [1],
    },
    {
      text: "Re-Assign Ticket",
      path: "/home/ticket-history",
      icon: <LowPriorityIcon sx={{ color: "#6d28d9" }} />,
      allowedRoles: [1, 2],
    },
  ];

  // Dynamic Header Text Logic
  const getHeaderTitle = () => {
    if (roleId === 1) return "Admin DashBoard";
    if (roleId === 2) return "Agent DashBoard";
    return "Customer Support Desk";
  };

  // Return block ke andar AppBar ka component is tarah badlein:
  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
    Welcome To {getHeaderTitle()}
  </Typography>;
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
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Welcome To {roleId === 1 ? "Admin" : "Agent"} DashBoard
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
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "280px",
            backgroundColor: "white",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column", // Flex column banaya taaki layout manage ho sake
            justifyContent: "space-between", // Isse logout automatic bottom me fix ho jayega
          },
        }}
      >
        {/* Top Content Area */}
        <Box>
          {/* Drawer Header */}
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ textDecoration: "underline", color: "#6d28d9" }}
            >
              Support Desk
            </Typography>
          </Box>

          <Divider />

          {/* Menu Items List */}
          <List sx={{ px: 1 }}>
            {filteredMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={toggleDrawer(false)}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: 2,
                    "&:hover": {
                      backgroundColor: "#f3e8ff",
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
                          color: "#334155",
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
                  setIsOpen(false);
                  handleLogout(); // Logout trigger function
                }}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  bgcolor: "#fff1f2", // Light pink/red tint background
                  "&:hover": {
                    backgroundColor: "#ffe4e6", // Smooth red hover
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LogoutIcon sx={{ color: "#f43f5e" }} />{" "}
                  {/* Rose Red Color Icon */}
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
