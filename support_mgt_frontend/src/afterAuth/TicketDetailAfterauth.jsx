import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Grid,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Divider,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance.jsx";

function TicketDetailAfterauth() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPriority, setUpdatingPriority] = useState(false);

  const token = localStorage.getItem("accessToken");
  const headers = { Authorization: token ? `Bearer ${token}` : "" };
  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          "/ticket/getTicketListByAdmin",
          { headers },
        );

        if (response.data?.data?.tickets) {
          const foundTicket = response.data.data.tickets.find(
            (t) => String(t.id) === String(id),
          );
          if (foundTicket) {
            setTicket(foundTicket);
          } else {
            toast.error("Ticket Not Found");
          }
        }
      } catch (err) {
        console.error("Error fetching ticket:", err);
        toast.error("Error while occur loading ticket details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      await axiosInstance.put(
        `/ticket/updateTicketStatus/${id}`,
        { status: newStatus },
        { headers },
      );
      setTicket((prev) => ({ ...prev, status: newStatus }));
      toast.success("Status successfully update !");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Status update failed.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // 3. Update Live Priority API Call
  const handlePriorityChange = async (newPriority) => {
    try {
      setUpdatingPriority(true);
      await axiosInstance.put(
        `/ticket/updateTicketPriority/${id}`,
        { priority: newPriority },
        { headers },
      );
      setTicket((prev) => ({ ...prev, priority: newPriority }));
      toast.success("Priority successfully update ho gayi!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Priority update failed.");
    } finally {
      setUpdatingPriority(false);
    }
  };

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

  if (!ticket) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Empty Ticket Data
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Back To TicketList
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ color: "#6d28d9", mb: 3, fontWeight: "bold" }}
      >
        Back to All Tickets
      </Button>

      <Grid container spacing={3}>
        {/* Left Side: Ticket Main Content */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              p: 4,
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
              borderRadius: 3,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="h5" fontWeight="bold" color="#6d28d9">
                Ticket #{ticket.ticket_number || ticket.id}
              </Typography>
              <Chip
                label={ticket.status?.toUpperCase().replace("_", " ")}
                color="primary"
                variant="outlined"
              />
            </Stack>
            <Divider sx={{ my: 2 }} />

            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 1, color: "text.secondary" }}
            >
              Description:
            </Typography>
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.6, color: "#374151", minHeight: "150px" }}
            >
              {ticket.description ||
                "Customer Does type any description in this ticket"}
            </Typography>
          </Card>
        </Grid>

        {/* Right Side: Quick Action Pannel */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
              borderRadius: 3,
              bgcolor: "#fafafa",
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Quick Ticket Actions
            </Typography>

            <Stack spacing={3}>
              {/* Live Status Control Dropdown */}
              <FormControl fullWidth size="small">
                <InputLabel>Update Status</InputLabel>
                <Select
                  value={ticket.status || ""}
                  label="Update Status"
                  disabled={updatingStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>

              {/* Live Priority Control Dropdown */}
              <FormControl fullWidth size="small">
                <InputLabel>Update Priority</InputLabel>
                <Select
                  value={ticket.priority || ""}
                  label="Update Priority"
                  disabled={updatingPriority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>

              <Divider sx={{ my: 1 }} />

              {/* Metadata Info */}
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  Customer Details:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {ticket.customer?.name || "Unknown User"}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {ticket.customer?.email || ""}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  Assigned Agent:
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color={ticket.agent?.name ? "text.primary" : "warning.main"}
                >
                  {ticket.agent?.name || "Not Assigned Yet"}
                </Typography>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TicketDetailAfterauth;
