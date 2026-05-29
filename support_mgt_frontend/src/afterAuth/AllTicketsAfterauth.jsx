import { useState } from "react";
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
  IconButton,
  Menu,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useGetAllTickets } from "../api/AllAPI.jsx";
import { getColor } from "../commonFunction/Color Function.jsx";
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "../commonFunction/ticketActions.jsx";
function AllTicketsAfterauth() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  // Three-Dots Menu State
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const { data, isLoading, error } = useGetAllTickets({
    statusFilter,
    priorityFilter,
    page,
    perPage,
  });
  // Backend response pattern ke hisab se safe extraction
  const tickets = data?.data || [];
  const totalPages = data?.totalPage || 1;
  // Handle Three-Dots Menu Open
  const handleMenuOpen = (event, ticketId) => {
    setAnchorEl(event.currentTarget);
    setSelectedTicketId(ticketId);
  };
  // Handle Three-Dots Menu Close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  // Navigate to Ticket Details Page
  const handleViewDetail = () => {
    handleMenuClose();
    navigate(`/home/ticket-detail/${selectedTicketId}`);
  };

  return (
    <Box>
      {/* Header Section */}
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        All Tickets
      </Typography>

      {/* Filter Options Section */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }}>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter by Status"
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1); // Filter badalne par first page par reset karein
            }}
          >
            {STATUS_OPTIONS.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Filter by Priority</InputLabel>
          <Select
            value={priorityFilter}
            label="Filter by Priority"
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1); // Filter badalne par first page par reset karein
            }}
          >
            {PRIORITY_OPTIONS.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Main Table Card */}
      <Card
        sx={{
          p: 3,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
          borderRadius: 2,
        }}
      >
        {" "}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#6d28d9" }} />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="error" variant="h6">
              {error.response?.data?.message ||
                error.message ||
                "Failed to load tickets"}
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
                        <TableCell component="th" scope="row">
                          #{row.ticket_number || row.id}
                        </TableCell>
                        <TableCell>{row.customer?.name || "N/A"}</TableCell>
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
                        <TableCell>
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, row.id)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No Ticket Found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Pagination Controls */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{ mt: 2 }}
      >
        <Button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </Button>
        <Typography sx={{ alignSelf: "center" }}>
          Page {page} of {totalPages}
        </Typography>
        <Button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </Button>
      </Stack>

      {/* Action Options Float Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        disableScrollLock
      >
        <MenuItem onClick={handleViewDetail} sx={{ gap: 1, color: "#6d28d9" }}>
          <VisibilityIcon fontSize="small" /> View Ticket Detail
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default AllTicketsAfterauth;
