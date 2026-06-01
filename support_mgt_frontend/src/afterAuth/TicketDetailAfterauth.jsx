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
import TicketChat from "./TicketChat.jsx";
import {
  useGetSingleTicket,
  useUpdateTicketStatus,
  useUpdateTicketPriority,
} from "../api/apiHooks.jsx";
import {
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
} from "../commonFunction/ticketActions.jsx";
function TicketDetailAfterauth() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const headers = { Authorization: token ? `Bearer ${token}` : "" };
  const { data: ticket, isLoading, error } = useGetSingleTicket(id);
  const statusMutation = useUpdateTicketStatus();
  const priorityMutation = useUpdateTicketPriority();
  // 2. UPDATE STATUS API CONSUMPTION
  const handleStatusChange = async (newStatus) => {
    try {
      await statusMutation.mutateAsync({
        id,
        status: newStatus,
      });

      toast.success("Ticket status updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status.");
    }
  };

  // 3. UPDATE PRIORITY API CONSUMPTION
  const handlePriorityChange = async (newPriority) => {
    try {
      await priorityMutation.mutateAsync({
        id,
        priority: newPriority,
      });
      toast.success("Ticket priority updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update priority.");
    }
  };
  if (isLoading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
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
  return (
    <Box sx={{ p: 1 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ color: "#6d28d9", mb: 3, fontWeight: "bold" }}>
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
                  disabled={statusMutation.isPending}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  {STATUS_OPTIONS.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* PRIORITY DROPDOWN */}
              <FormControl fullWidth size="small">
                <InputLabel>Update Priority</InputLabel>
                <Select
                  value={ticket.priority || ""}
                  label="Update Priority"
                  disabled={priorityMutation.isPending}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                >
                  {PRIORITY_OPTIONS.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
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
