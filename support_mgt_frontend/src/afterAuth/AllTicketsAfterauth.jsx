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
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axiosInstance from "../api/axiosInstance.jsx";
const getColor = (value) => {
  switch (value) {
    case "high":
    case "urgent":
    case "High":
    case "Urgent":
      return { bg: "#FEE2E2", text: "#DC2626" };
    case "medium":
    case "Medium":
      return { bg: "#FFEDD5", text: "#EA580C" };
    case "low":
    case "Low":
      return { bg: "#DCFCE7", text: "#16A34A" };
    case "open":
    case "Open":
      return { bg: "#EFF6FF", text: "#2563EB" };
    case "in_progress":
    case "In Progress":
      return { bg: "#FFFAF0", text: "#B45309" };
    case "closed":
    case "Closed":
      return { bg: "#F0FDF4", text: "#15803D" };
    default:
      return { bg: "#F3F4F6", text: "#6B7280" };
  }
};
function AllTicketsAfterauth() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        const params = {};
        if (statusFilter) params.status = statusFilter;
        if (priorityFilter) params.priority = priorityFilter;
        const response = await axiosInstance.get(
          "/ticket/getTicketListByAdmin",
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
            params: params,
          },
        );
        if (response.data && response.data.data && response.data.data.tickets) {
          setTickets(response.data.data.tickets);
          setError(null);
        } else {
          setError("Data is not valid formate");
        }
      } catch (err) {
        console.error("Fetch Tickets Error:", err);
        setError(
          err.response?.data?.message || "Occur error while loading tickets.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [statusFilter, priorityFilter]);
  return (
    <Box>
      {/* Header Section */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        All Tickets
      </Typography>

      {/* Filter Options Section */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }}>
        {/* Status Filter */}
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter by Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </Select>
        </FormControl>

        {/* Priority Filter */}
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Filter by Priority</InputLabel>
          <Select
            value={priorityFilter}
            label="Filter by Priority"
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <MenuItem value="">All Priorities</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="urgent">Urgent</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Card
        sx={{
          p: 3,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          borderRadius: 2,
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#6d28d9" }} />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="error" variant="h6">
              {error}
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="all tickets table">
              <TableHead>
                <TableRow>
                  {[
                    "Ticket ID",
                    "Customer Name",
                    "Assigned Agent",
                    "Priority",
                    "Status",
                    "Action",
                  ].map((head) => (
                    <TableCell
                      key={head}
                      sx={{ color: "text.secondary", fontWeight: "bold" }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.length > 0 ? (
                  tickets.map((row) => {
                    const priorityCol = getColor(row.priority);
                    const statusCol = getColor(row.status);

                    return (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        {/* Ticket ID */}
                        <TableCell
                          component="th"
                          scope="row"
                          fontWeight="medium"
                        >
                          #{row.ticket_number || row.id}
                        </TableCell>
                        {/* Customer Name (Include se aa raha hai) */}
                        <TableCell>{row.customer?.name || "N/A"}</TableCell>

                        {/* Agent Name (Include se aa raha hai) */}
                        <TableCell>
                          {row.agent?.name ? (
                            <Chip
                              label={row.agent.name}
                              size="small"
                              variant="outlined"
                            />
                          ) : (
                            <Typography variant="body2" color="text.disabled">
                              Not Assigned
                            </Typography>
                          )}
                        </TableCell>

                        {/* Priority Chip */}
                        <TableCell>
                          <Chip
                            label={
                              row.priority ? row.priority.toUpperCase() : "LOW"
                            }
                            size="small"
                            sx={{
                              bgcolor: priorityCol.bg,
                              color: priorityCol.text,
                              fontWeight: "bold",
                              borderRadius: "6px",
                            }}
                          />
                        </TableCell>

                        {/* Status Chip */}
                        <TableCell>
                          <Chip
                            label={
                              row.status
                                ? row.status.replace("_", " ").toUpperCase()
                                : "OPEN"
                            }
                            size="small"
                            sx={{
                              bgcolor: statusCol.bg,
                              color: statusCol.text,
                              fontWeight: "bold",
                              borderRadius: "6px",
                            }}
                          />
                        </TableCell>

                        {/* Action Column */}
                        <TableCell>
                          <VisibilityIcon
                            color="primary"
                            sx={{
                              cursor: "pointer",
                              "&:hover": { color: "#6d28d9" },
                            }}
                            onClick={() => navigate(`/home/ticket/${row.id}`)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        Koi tickets nahi mile.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Box>
  );
}

export default AllTicketsAfterauth;
