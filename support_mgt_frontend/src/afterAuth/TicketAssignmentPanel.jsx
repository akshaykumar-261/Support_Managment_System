import React, { useState, useEffect } from "react";
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
import axiosInstance from "../api/axiosInstance.jsx";

function TicketAssignmentPanel() {
  const [unassignedTickets, setUnassignedTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAgentId, setModalAgentId] = useState("");
  const [submittingId, setSubmittingId] = useState(false);
  const token = localStorage.getItem("accessToken");
  const headers = { Authorization: token ? `Bearer ${token}` : "" };
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);

        // A. Fetch All Open Tickets
        const ticketRes = await axiosInstance.get(
          "/ticket/getTicketListByAdmin?status=open",
          { headers },
        );

        if (
          ticketRes.data?.data?.tickets &&
          Array.isArray(ticketRes.data.data.tickets)
        ) {
          const openTickets = ticketRes.data.data.tickets.filter(
            (ticket) => ticket.status === "open" || ticket.status === "Open",
          );
          setUnassignedTickets(openTickets);
        } else if (Array.isArray(ticketRes.data?.tickets)) {
          const openTickets = ticketRes.data.tickets.filter(
            (ticket) => ticket.status === "open" || ticket.status === "Open",
          );
          setUnassignedTickets(openTickets);
        }
        const agentRes = await axiosInstance.get("/ticket/getAgentsList", {
          headers,
        });
        console.log("Full Agent API Response:", agentRes);
        let extractedAgents = [];
        if (
          agentRes.data?.data?.users &&
          Array.isArray(agentRes.data.data.users)
        ) {
          extractedAgents = agentRes.data.data.users;
        } else if (agentRes.data?.users && Array.isArray(agentRes.data.users)) {
          extractedAgents = agentRes.data.users;
        } else if (agentRes.data?.data && Array.isArray(agentRes.data.data)) {
          extractedAgents = agentRes.data.data;
        } else if (Array.isArray(agentRes.data)) {
          extractedAgents = agentRes.data;
        } else {
          console.error(
            "Backend se array nahi mila! Response structure galat hai.",
          );
        }

        setAgents(extractedAgents);
      } catch (err) {
        toast.error("We not found new ticket lists");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // 2. Action Menu Handlers (Three Dots)
  const handleMenuOpen = (event, ticketId) => {
    setAnchorEl(event.currentTarget);
    setActiveTicketId(ticketId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 3. Delete Ticket Handler
  const handleDeleteTicket = async () => {
    const ticketIdToDelete = activeTicketId;
    handleMenuClose();

    try {
      await axiosInstance.delete(`/ticket/deleteTicket/${ticketIdToDelete}`, {
        headers,
      });
      toast.success("Delete Ticket Successfully!");
      setUnassignedTickets((prev) =>
        prev.filter((t) => t.id !== ticketIdToDelete),
      );
    } catch (err) {
      console.error("Delete Error:", err);
      setUnassignedTickets((prev) =>
        prev.filter((t) => t.id !== ticketIdToDelete),
      );
      toast.success("Ticket Reomve from the List");
    }
  };

  // 4. Open Assignment Modal
  const handleOpenAssignModal = () => {
    setModalAgentId("");
    setIsModalOpen(true);
    handleMenuClose();
  };

  // 5. Submit Assignment to Backend
  const handleModalAssignSubmit = async () => {
    if (!modalAgentId) {
      toast.error("Please Select any agent");
      return;
    }

    try {
      setSubmittingId(true);

      await axiosInstance.post(
        `/ticket/assignTicket/${activeTicketId}`,
        { agent_Id: modalAgentId },
        { headers },
      );

      toast.success("Ticket Assign Successfully To Agent!");
      setUnassignedTickets((prev) =>
        prev.filter((t) => t.id !== activeTicketId),
      );
      setIsModalOpen(false);
    } catch (err) {
      console.error("Assignment Fail:", err);
      toast.error(err.response?.data?.message || "Assignment failed.");
    } finally {
      setSubmittingId(false);
    }
  };

  if (loading) {
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
          Here Show All Open And New Ticket
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
                    <TableCell fontWeight="medium">
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
                        color="error"
                        variant="filled"
                        sx={{
                          fontWeight: "bold",
                          bgcolor: "#fee2e2",
                          color: "#ef4444",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuOpen(e, row.id)}>
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
        <MenuItem
          onClick={handleDeleteTicket}
          sx={{ color: "#ef4444", gap: 1 }}
        >
          <DeleteIcon fontSize="small" /> Delete Ticket
        </MenuItem>
      </Menu>

      {/* Pop-up Modal (Dialog) */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
              onChange={(e) => setModalAgentId(e.target.value)}
            >
              {/* SAFE MAP CHECK: Agar kisi wajah se array na ho toh blank array chalega */}
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
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleModalAssignSubmit}
            disabled={submittingId}
            sx={{
              bgcolor: "#6d28d9",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#5b21b6" },
            }}
          >
            {submittingId ? "Assigning..." : "Confirm Assign"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TicketAssignmentPanel;
