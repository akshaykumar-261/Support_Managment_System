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
import { useDashboard } from "../api/apiHooks.jsx";

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
        border: "1px solid #e2e8f0",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.02)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0px 12px 24px rgba(109, 40, 217, 0.08)",
     borderColor: "#6d28d9",
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            {label}
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              my: 1.5,
            }}
          >
            {value}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={percent}
              size="small"
              icon={<TrendingUpIcon />}
              sx={{
                bgcolor: bgLight,
                fontWeight: "bold",
              }}
            />

            <Typography variant="caption">{subLabel}</Typography>
          </Stack>
        </Box>

        <Avatar
          sx={{
            bgcolor: bgLight,
            width: 56,
            height: 56,
          }}
        >
          <Icon sx={{ color: iconColor }} />
        </Avatar>
      </Stack>
    </Card>
  </Grid>
);

function DashboardAfterauth() {
  const { data: dashboardData, isLoading, error } = useDashboard();

  if (isLoading) {
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

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">{error.message}</Typography>
      </Box>
    );
  }

  const total = dashboardData?.totalTicket || 0;
  const open = dashboardData?.openTickets || 0;
  const inProgress = dashboardData?.inProgressTickets || 0;
  const closed = dashboardData?.closeTickets || 0;
  const openPercent = total > 0 ? `${Math.round((open / total) * 100)}%` : "0%";
  const progressPercent =
  total > 0 ? `${Math.round((inProgress / total) * 100)}%` : "0%";
  const closedPercent =
  total > 0 ? `${Math.round((closed / total) * 100)}%` : "0%";
  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#0f172a",
          }}>
          Overview Analytics
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#64748b",
            mt: 0.5,
          }}>
          Live operational stats and ticket metrics overview.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <StatCard
          label="Total Tickets"
          value={total}
          subLabel="Overall volume"
          icon={GroupsIcon}
          bgLight="#f3e8ff"
          iconColor="#6d28d9"
          percent="100%"/>

        <StatCard
          label="Open Tickets"
          value={open}
          subLabel="Requires review"
          icon={AssignmentTurnedInIcon}
          bgLight="#dcfce7"
          iconColor="#22c55e"
          percent={openPercent}/>

        <StatCard
          label="In Progress"
          value={inProgress}
          subLabel="Active handling"
          icon={CachedIcon}
          bgLight="#fef9c3"
          iconColor="#d97706"
          percent={progressPercent}/>

        <StatCard
          label="Closed Tickets"
          value={closed}
          subLabel="Resolved jobs"
          icon={CheckCircleIcon}
          bgLight="#f1f5f9"
          iconColor="#64748b"
          percent={closedPercent}/>
      </Grid>
    </Box>
  );
}

export default DashboardAfterauth;
