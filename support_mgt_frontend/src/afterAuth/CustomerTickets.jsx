import React, { useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth.jsx";
import TicketChat from "./TicketChat.jsx";

// Import Custom TanStack Hooks
import {
  useGetCustomerTickets,
  useCreateCustomerTicket,
} from "../api/apiHooks.jsx";

function CustomerTickets() {
  const { userId } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "low",
  });

  // --- TanStack Hooks Integration ---
  const { data: tickets = [], isLoading: ticketsLoading } =
    useGetCustomerTickets(userId);
  const createTicketMutation = useCreateCustomerTicket();

  // Submit / Create New Ticket Action
  const handleCreateTicket = (e) => {
    e.preventDefault();

    createTicketMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Ticket Created Successfully!");
        setOpenModal(false);
        setFormData({ title: "", description: "", priority: "low" });
      },
      onError: (error) => {
        console.error("Create ticket error:", error);
        toast.error(error.response?.data?.message || "Failed to create ticket");
      },
    });
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
                {ticketsLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={24} sx={{ color: "#6d28d9" }} />
                    </TableCell>
                  </TableRow>
                ) : tickets.length === 0 ? (
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
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
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

        {/* RIGHT SIDE CHAT WINDOW */}
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
      <Modal
        open={openModal}
        onClose={() => !createTicketMutation.isLoading && setOpenModal(false)}
      >
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
              disabled={createTicketMutation.isLoading}
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
              disabled={createTicketMutation.isLoading}
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
              disabled={createTicketMutation.isLoading}
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
              <Button
                onClick={() => setOpenModal(false)}
                disabled={createTicketMutation.isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={createTicketMutation.isLoading}
                sx={{ bgcolor: "#6d28d9", "&:hover": { bgcolor: "#5b21b6" } }}
              >
                {createTicketMutation.isLoading
                  ? "Submitting..."
                  : "Submit Ticket"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}

export default CustomerTickets;
