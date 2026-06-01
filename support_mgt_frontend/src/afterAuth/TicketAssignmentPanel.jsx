import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Chip,
  IconButton,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import toast from "react-hot-toast";
import {
  useOpenTickets,
  useAgents,
  useDeleteTicket,
  useAssignTicket,
} from "../api/apiHooks.jsx";

  function TicketAssignmentPanel() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAgentId, setModalAgentId] = useState("");

  // TanStack Queries
  const { data: unassignedTickets = [], isLoading, error } = useOpenTickets();
  const { data: agents = [] } = useAgents();

  // TanStack Mutations
  const deleteMutation = useDeleteTicket();
  const assignMutation = useAssignTicket();

  // Action Menu Handlers (Three Dots)
  const handleMenuOpen = (event, ticketId) => {
    setAnchorEl(event.currentTarget);
    setActiveTicketId(ticketId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Open Assignment Modal
  const handleOpenAssignModal = () => {
    setModalAgentId("");
    setIsModalOpen(true);
    handleMenuClose();
  };
  const handleModalAssignSubmit = async () => {
    if (!modalAgentId) {
      toast.error("Please Select any agent");
      return;
    }

    try {
      // Mutate call with payload structure required by assignTicket fn
      await assignMutation.mutateAsync({
        ticketId: activeTicketId,
        agentId: modalAgentId,
      });

      toast.success("Ticket Assigned Successfully!");
      setIsModalOpen(false); // Success par modal band karein
    } catch (err) {
      console.error("Assignment Error:", err);
      toast.error(err.response?.data?.message || "Assignment failed.");
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress sx={{ color: "#6d28d9" }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="#6d28d9">
          New Ticket Assignment Desk
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Here Show All Open And New Tickets
        </Typography>
      </Box>

      {/* Main Table Card */}
      <Card
        sx={{
          p: 3,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          borderRadius: 2,
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                {["Ticket ID", "Title", "Customer", "Status", "Options"].map(
                  (head) => (
                    <TableCell
                      key={head}
                      sx={{ color: "text.secondary", fontWeight: "bold" }}
                    >
                      {head}
                    </TableCell>
                  ),
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {unassignedTickets.length > 0 ? (
                unassignedTickets.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ fontWeight: "medium" }}>
                      #{row.ticket_number || row.id}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 250, fontWeight: "500" }}>
                      {row.title || "No Title"}
                    </TableCell>
                    <TableCell>{row.customer?.name || "Unknown"}</TableCell>
                    <TableCell>
                      <Chip
                        label="OPEN"
                        size="small"
                        variant="filled"
                        sx={{
                          fontWeight: "bold",
                          bgcolor: "#fee2e2",
                          color: "#ef4444",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {/* Kisi bhi mutation running ke dauran buttons ko disable/loading look de sakte hain */}
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, row.id)}
                        disabled={
                          deleteMutation.isPending || assignMutation.isPending
                        }
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary" variant="h6">
                      Assign Tickets Not Found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Popover Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        disableScrollLock
      >
        <MenuItem
          onClick={handleOpenAssignModal}
          sx={{ color: "#6d28d9", gap: 1 }}
        >
          <AssignmentIndIcon fontSize="small" /> Assign Ticket to Agent
        </MenuItem>
      </Menu>

      {/* Pop-up Modal (Dialog) */}
      <Dialog
        open={isModalOpen}
        onClose={() => !assignMutation.isPending && setIsModalOpen(false)} // assignment ke dauran close na ho
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "#6d28d9" }}>
          Assign Ticket
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please Select The Agent From Dropdown List
          </Typography>

          <FormControl fullWidth size="small">
            <InputLabel>Choose Agent</InputLabel>
            <Select
              value={modalAgentId}
              label="Choose Agent"
              disabled={assignMutation.isPending}
              onChange={(e) => setModalAgentId(e.target.value)}
            >
              {(Array.isArray(agents) ? agents : []).map((agent) => (
                <MenuItem key={agent.id} value={agent.id}>
                  {agent.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setIsModalOpen(false)}
            color="inherit"
            disabled={assignMutation.isPending}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleModalAssignSubmit}
            disabled={assignMutation.isPending}
            sx={{
              bgcolor: "#6d28d9",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#5b21b6" },
            }}
          >
            {assignMutation.isPending ? "Assigning..." : "Confirm Assign"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TicketAssignmentPanel;
