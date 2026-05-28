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
import TicketChat from "./TicketChat.jsx";

function TicketDetailAfterauth() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPriority, setUpdatingPriority] = useState(false);
  const token = localStorage.getItem("accessToken");
  const headers = { Authorization: token ? `Bearer ${token}` : "" };
  const fetchTicketDetails = async () => {
    try {
      const response = await axiosInstance.get("/ticket/getTicketListByAdmin", {
        headers,
        params: { page: 1, limit: 1000 },
      });

      if (response.data?.data?.tickets?.data) {
        const foundTicket = response.data.data.tickets.data.find(
          (t) => String(t.id) === String(id),
        );
        if (foundTicket) setTicket(foundTicket);
        else toast.error("Ticket Not Found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error occurred while loading ticket details.");
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  // 2. UPDATE STATUS API CONSUMPTION
  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);

      // Backend Route: /updateTicketStatus/:id
      const response = await axiosInstance.put(
        `/ticket/updateTicketStatus/${id}`,
        { status: newStatus }, // Body parameters as per schema
        { headers },
      );

      // Frontend UI update bina page refresh kiye
      setTicket((prevTicket) => ({
        ...prevTicket,
        status: newStatus,
      }));

      toast.success("Ticket status updated successfully!");
    } catch (err) {
      console.error("Status Update Error:", err);
      toast.error(err.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // 3. UPDATE PRIORITY API CONSUMPTION
  const handlePriorityChange = async (newPriority) => {
    try {
      setUpdatingPriority(true);

      // Backend Route: /updateTicketPriority/:id
      const response = await axiosInstance.put(
        `/ticket/updateTicketPriority/${id}`,
        { priority: newPriority }, // Body parameters as per schema
        { headers },
      );

      // Frontend UI update
      setTicket((prevTicket) => ({
        ...prevTicket,
        priority: newPriority,
      }));

      toast.success("Ticket priority updated successfully!");
    } catch (err) {
      console.error("Priority Update Error:", err);
      toast.error(err.response?.data?.message || "Failed to update priority.");
    } finally {
      setUpdatingPriority(false);
    }
  };
  if (!ticket) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error" variant="h6" fontWeight="bold">
          Ticket Not Found
        </Typography>
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
        {/* LEFT SIDE: MAIN DESCRIPTION */}
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
              sx={{ lineHeight: 1.6, color: "#374151", minHeight: "120px" }}
            >
              {ticket.description || "No description provided."}
            </Typography>
          </Card>
          {/* CHAT BOX */}
          <TicketChat ticketId={id} />
        </Grid>

        {/* RIGHT SIDE: QUICK ACTIONS PANEL */}
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
              {/* STATUS DROPDOWN */}
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

              {/* PRIORITY DROPDOWN */}
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
                </Select>
              </FormControl>

              <Divider />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Customer:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {ticket.customer?.name || "Unknown User"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Assigned Agent:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {ticket.agent?.name || "Not Assigned"}
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
