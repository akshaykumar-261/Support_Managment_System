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
  Grid,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChatIcon from "@mui/icons-material/Chat";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth.jsx";
import axiosInstance from "../api/axiosInstance.jsx";
import TicketChat from "./TicketChat.jsx";

function CustomerTickets() {
  const { userId } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "low",
  });

  // 1. FETCH TICKETS USING AXIOS
  const fetchCustomerTickets = async () => {
    try {
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

        // FIX: Auto-selection logic yahan se hata diya hai taaki load hote hi chat open na ho.
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

      {/* GRID LAYOUT: Left Side Tickets Table, Right Side Chat Engine */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={selectedTicketId ? 7 : 12}>
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, boxShadow: 2 }}
          >
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
                    <b>Status</b>
                  </TableCell>
                  <TableCell align="center">
                    <b>Chat</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No tickets raised yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((ticket) => {
                    const isSelected =
                      String(ticket.id) === String(selectedTicketId);
                    return (
                      <TableRow
                        key={ticket.id}
                        hover
                        // FIX: Row level onClick hata diya, ab row par click karne se chat open nahi hogi
                        sx={{
                          backgroundColor: isSelected ? "#f3e8ff" : "inherit",
                          "&:hover": {
                            backgroundColor: isSelected ? "#e9d5ff" : "#f8fafc",
                          },
                        }}
                      >
                        <TableCell>
                          {ticket.ticket_number || `#${ticket.id}`}
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight={isSelected ? "bold" : "normal"}
                          >
                            {ticket.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ticket.status}
                            size="small"
                            variant="outlined"
                            color={
                              ticket.status === "closed"
                                ? "success"
                                : "secondary"
                            }
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              justifyContent: "center",
                            }}
                          >
                            {/* FIX: Sirf is IconButton par click karne se chat set hogi */}
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Agar pehle se wahi open hai, toh toggle off kar do, nahi toh open karo
                                setSelectedTicketId(
                                  isSelected ? null : ticket.id,
                                );
                              }}
                              sx={{
                                backgroundColor: isSelected
                                  ? "#6d28d9"
                                  : "transparent",
                                color: isSelected ? "#ffffff" : "#6d28d9",
                                "&:hover": {
                                  backgroundColor: isSelected
                                    ? "#5b21b6"
                                    : "#f3e8ff",
                                },
                              }}
                            >
                              <ChatIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* RIGHT SIDE CHAT WINDOW (SIRF CHAT WINDOW DIKHAYEGA TICKET SELECT HONE PAR) */}
        {selectedTicketId && (
          <Grid item xs={12} md={5}>
            <Box sx={{ mt: -3 }}>
              <Paper
                sx={{
                  p: 1.5,
                  bgcolor: "#6d28d9",
                  color: "white",
                  borderRadius: "12px 12px 0 0",
                  mb: -3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{ ml: 1 }}
                >
                  Active Chat: Ticket #
                  {tickets.find((t) => t.id === selectedTicketId)
                    ?.ticket_number || selectedTicketId}
                </Typography>
                {/* Ek close button chat window ko band karne ke liye */}
                <Button
                  size="small"
                  onClick={() => setSelectedTicketId(null)}
                  sx={{ color: "white", minWidth: "auto", fontWeight: "bold" }}
                >
                  <CancelRoundedIcon />
                </Button>
              </Paper>

              <TicketChat ticketId={selectedTicketId} />
            </Box>
          </Grid>
        )}
      </Grid>

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
