import { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen"; // Naya icon band karne ke liye
import { AppGridContainer } from "../Component/GridCommanComponent.jsx";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance.jsx";
import LogoutIcon from "@mui/icons-material/Logout";
import { ROLES, ROLE_TITELS } from "../commonFunction/role.jsx";
import { MENU_ITEMS } from "../commonFunction/menuItem.jsx";
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
  const headerTitle = ROLE_TITELS[roleId] || "Support Desk";
  const filteredMenuItems = MENU_ITEMS.filter((item) =>
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
                Welcome To {headerTitle}
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
