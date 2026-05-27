import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  MenuItem,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth.jsx";
import axiosInstance from "../api/axiosInstance.jsx";

function CustomerTickets() {
  const { userId } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "low",
  });

  // 1. FETCH TICKETS USING AXIOS
  const fetchCustomerTickets = async () => {
    try {
      // FIX: Path ko backend router ke explicit names se match kiya
      const response = await axiosInstance.get(
        `/ticket/getTicketByCustomer/${userId}`,
      );

      if (response.data && response.data.data) {
        const ticketData = response.data.data.ticket;
        setTickets(
          Array.isArray(ticketData)
            ? ticketData
            : ticketData
              ? [ticketData]
              : [],
        );
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to load tickets");
    }
  };

  useEffect(() => {
    if (userId) fetchCustomerTickets();
  }, [userId]);

  // 2. SUBMIT / CREATE NEW TICKET
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        "/ticket/createTicket",
        formData,
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Ticket Created Successfully!");
        setOpenModal(false);
        setFormData({ title: "", description: "", priority: "low" });
        fetchCustomerTickets();
      }
    } catch (error) {
      console.error("Create ticket error:", error);
      toast.error(error.response?.data?.message || "Failed to create ticket");
    }
  };

  // 3. CLOSE AN ACTIVE TICKET
  const handleCloseTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to close this ticket?")) return;
    try {
      const response = await axiosInstance.post("/ticket/closeTicket", {
        id: ticketId,
      });

      if (response.status === 200) {
        toast.success("Ticket Closed Successfully");
        fetchCustomerTickets();
      }
    } catch (error) {
      console.error("Close ticket error:", error);
      toast.error(error.response?.data?.message || "Action denied or failed");
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="#334155">
          My Raised Support Tickets
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "#6d28d9",
            "&:hover": { backgroundColor: "#5b21b6" },
          }}
          onClick={() => setOpenModal(true)}
        >
          Raise New Ticket
        </Button>
      </Box>

      {/* TICKETS DISPLAY TABLE */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f8fafc" }}>
            <TableRow>
              <TableCell>
                <b>Ticket No.</b>
              </TableCell>
              <TableCell>
                <b>Title</b>
              </TableCell>
              <TableCell>
                <b>Priority</b>
              </TableCell>
              <TableCell>
                <b>Status</b>
              </TableCell>
              <TableCell align="center">
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No tickets raised yet.
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow key={ticket.id} hover>
                  <TableCell>
                    {ticket.ticket_number || `#${ticket.id}`}
                  </TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        ticket.priority ? ticket.priority.toUpperCase() : "LOW"
                      }
                      size="small"
                      color={
                        ticket.priority === "high"
                          ? "error"
                          : ticket.priority === "medium"
                            ? "warning"
                            : "default"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={ticket.status}
                      size="small"
                      variant="outlined"
                      color={
                        ticket.status === "closed" ? "success" : "secondary"
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    {ticket.status !== "closed" ? (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleCloseTicket(ticket.id)}
                      >
                        Close Ticket
                      </Button>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Resolved
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* CREATE TICKET MODAL POPUP */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 450,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2} color="#6d28d9">
            Create Support Request
          </Typography>
          <form onSubmit={handleCreateTicket}>
            <TextField
              fullWidth
              label="Issue Title"
              required
              size="small"
              sx={{ mb: 2 }}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Describe your problem"
              required
              multiline
              rows={4}
              size="small"
              sx={{ mb: 2 }}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <TextField
              fullWidth
              select
              label="Priority Level"
              size="small"
              sx={{ mb: 3 }}
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </TextField>
            <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
              <Button onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ bgcolor: "#6d28d9", "&:hover": { bgcolor: "#5b21b6" } }}
              >
                Submit Ticket
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}

export default CustomerTickets;
