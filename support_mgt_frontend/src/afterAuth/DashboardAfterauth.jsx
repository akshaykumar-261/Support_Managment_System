import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Stack,
  Avatar,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Grid from "@mui/material/Grid";
import GroupsIcon from "@mui/icons-material/Groups";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CachedIcon from "@mui/icons-material/Cached";
import axiosInstance from "../api/axiosInstance.jsx";
const StatCard = ({ label, value, subLabel, icon: Icon, color }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Card
      sx={{
        p: 3,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        borderRadius: 2,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight="medium"
          >
            {label}
          </Typography>
          <Typography variant="h4" fontWeight="bold" sx={{ my: 1 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subLabel}
          </Typography>
        </Box>
        <Avatar
          sx={{
            bgcolor: `${color}.light`,
            color: `${color}.main`,
            p: 3,
            borderRadius: "12px",
          }}
        >
          <Icon fontSize="large" />
        </Avatar>
      </Stack>
    </Card>
  </Grid>
);

function DashboardAfterauth() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Consumption Logic
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");

        const response = await axiosInstance.get("/ticket/adminDashBoard", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (
          response.data &&
          response.data.data &&
          response.data.data.dashboard
        ) {
          setDashboardData(response.data.data.dashboard);
        } else {
          setError("Data is not valid formate");
        }
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Loading State UI
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress sx={{ color: "#6d28d9" }} />
      </Box>
    );
  }

  // Error State UI
  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  // Backend Response keys mapping
  const total = dashboardData?.totalTicket || 0;
  const open = dashboardData?.openTickets || 0;
  const inProgress = dashboardData?.inProgressTickets || 0;
  const closed = dashboardData?.closeTickets || 0;

  return (
    <Box>
      {/* A. Dashboard Header */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

      {/* B. TOP STAT CARDS SECTION */}
      <Grid container spacing={3}>
        <StatCard
          label="Total Tickets"
          value={total}
          subLabel="All Tickets"
          icon={GroupsIcon}
          color="primary"
        />
        <StatCard
          label="Open Tickets"
          value={open}
          subLabel="Currently Open"
          icon={AssignmentTurnedInIcon}
          color="success"
        />
        <StatCard
          label="In Progress"
          value={inProgress}
          subLabel="In Progress"
          icon={CachedIcon}
          color="warning"
        />
        <StatCard
          label="Closed Tickets"
          value={closed}
          subLabel="Closed"
          icon={CheckCircleIcon}
          color="secondary"
        />
      </Grid>
    </Box>
  );
}

export default DashboardAfterauth;
