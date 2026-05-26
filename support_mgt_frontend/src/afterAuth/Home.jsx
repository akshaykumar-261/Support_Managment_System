import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { AppGridContainer } from "../Component/GridCommanComponent.jsx";
import { Link, Outlet } from "react-router-dom";
function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = (openState) => () => {
    setIsOpen(openState);
  };
  const menuItems = [
    { text: "DashBoard", path: "/home" },
    { text: "All Tickets", path: "/home/all-tickets" },
    { text: "Assign Ticket To Agent", path: "/home/assign-panel" },
  ];
  return (
    <>
      <AppGridContainer sx={{ height: "100vh" }}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{ backgroundColor: "#6d28d9" }}>
            <Toolbar>
              {/* Menu Icon par click karne se isOpen true ho jayega */}
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
                News
              </Typography>
              <Button color="inherit">Login</Button>
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
            width: "250px",
            backgroundColor: "white",
            boxSizing: "border-box",
          },
        }}
      >
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

        {/* Menu Items List */}
        <List>
          {menuItems.map(
            (
              item, // 1. Map ke andar 'menuItems' array use karein
            ) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path} // 2. Ab item.path perfect chalega
                  onClick={toggleDrawer(false)}
                  sx={{ textAlign: "center", py: 2 }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: "1.2rem",
                          color: "#6d28d9 !important",
                        }}
                      >
                        {item.text} {/* 3. Yahan item.text aayega */}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ),
          )}
        </List>
      </Drawer>
    </>
  );
}

export default Home;
