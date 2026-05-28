import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Stack,
  Avatar,
  CircularProgress,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import GroupsIcon from "@mui/icons-material/Groups";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CachedIcon from "@mui/icons-material/Cached";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import axiosInstance from "../api/axiosInstance.jsx";

// --- HOVER ANIMATED PREMIUM STAT CARD ---
const StatCard = ({
  label,
  value,
  subLabel,
  icon: Icon,
  bgLight,
  iconColor,
  percent,
}) => (
  <Grid item xs={12} sm={6} md={3}>
    <Card
      sx={{
        p: 3,
        borderRadius: 3,
        background: "white",
        border: "1px solid #e2e8f0", // Light sleek border
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.02)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-5px)", // Smooth lifting effect
          boxShadow: "0px 12px 24px rgba(109, 40, 217, 0.08)", // Premium purple glow glow
          borderColor: "#6d28d9",
        },
      }}
    >
      {/* Dynamic Upper Top Bar Glow on Hover */}
      <Box
        className="top-glow"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "4px",
          backgroundColor: iconColor,
          opacity: 0.7,
        }}
      />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              fontWeight: 600,
              textTransform: "uppercase",
              fontSize: "0.75rem",
              letterSpacing: "0.5px",
            }}
          >
            {label}
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              my: 1.5,
              color: "#0f172a",
              letterSpacing: "-0.5px",
            }}
          >
            {value}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
            <Chip
              label={percent}
              size="small"
              icon={
                <TrendingUpIcon
                  style={{ color: iconColor, fontSize: "14px" }}
                />
              }
              sx={{
                bgcolor: bgLight,
                color: "#1e293b",
                fontWeight: "bold",
                fontSize: "0.7rem",
                height: "20px",
                "& .MuiChip-icon": { marginLeft: "4px" },
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: "#94a3b8", fontWeight: 500 }}
            >
              {subLabel}
            </Typography>
          </Stack>
        </Box>

        {/* Modern Icon Container */}
        <Avatar
          sx={{
            bgcolor: bgLight,
            width: 56,
            height: 56,
            borderRadius: "14px",
            boxShadow: `0px 4px 10px ${bgLight}`,
          }}
        >
          <Icon sx={{ fontSize: "1.8rem", color: iconColor }} />
        </Avatar>
      </Stack>
    </Card>
  </Grid>
);

function DashboardAfterauth() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setError("Data is not valid format");
        }
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to fetch server data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
        <CircularProgress thickness={4.5} sx={{ color: "#6d28d9" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error" variant="h6" fontWeight="bold">
          {error}
        </Typography>
      </Box>
    );
  }

  const total = dashboardData?.totalTicket || 0;
  const open = dashboardData?.openTickets || 0;
  const inProgress = dashboardData?.inProgressTickets || 0;
  const closed = dashboardData?.closeTickets || 0;

  // Percentage calculations for professional sub-context
  const openPercent = total > 0 ? `${Math.round((open / total) * 100)}%` : "0%";
  const progressPercent =
    total > 0 ? `${Math.round((inProgress / total) * 100)}%` : "0%";
  const closedPercent =
    total > 0 ? `${Math.round((closed / total) * 100)}%` : "0%";

  return (
    <Box sx={{ p: 1 }}>
      {/* Dynamic Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a" }}>
          Overview Analytics
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#64748b", mt: 0.5, fontSize: "0.95rem" }}
        >
          Live operational stats and ticket metrics overview.
        </Typography>
      </Box>

      {/* TOP STAT CARDS SECTION */}
      <Grid container spacing={3}>
        <StatCard
          label="Total Tickets"
          value={total}
          subLabel="Overall volume"
          icon={GroupsIcon}
          bgLight="#f3e8ff" // Smooth Purple
          iconColor="#6d28d9"
          percent="100%"
        />
        <StatCard
          label="Open Tickets"
          value={open}
          subLabel="Requires review"
          icon={AssignmentTurnedInIcon}
          bgLight="#dcfce7" // Smooth Green
          iconColor="#22c55e"
          percent={openPercent}
        />
        <StatCard
          label="In Progress"
          value={inProgress}
          subLabel="Active handling"
          icon={CachedIcon}
          bgLight="#fef9c3" // Smooth Yellow
          iconColor="#d97706"
          percent={progressPercent}
        />
        <StatCard
          label="Closed Tickets"
          value={closed}
          subLabel="Resolved jobs"
          icon={CheckCircleIcon}
          bgLight="#f1f5f9" // Smooth Slate Grey
          iconColor="#64748b"
          percent={closedPercent}
        />
      </Grid>
    </Box>
  );
}

export default DashboardAfterauth;
