import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  MenuItem,
  Grid,
  Chip,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CircleIcon from "@mui/icons-material/Circle";

// Named Imports using curly braces to avoid "provide an export named default" error
import { useGetCustomersManagedList } from "../api/apiHooks.jsx";

function UserManagementPanel() {
  // Pagination States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filters Local UI States
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  // Applied Query Filters State (Triggers Refetch only when changed)
  const [appliedFilters, setAppliedFilters] = useState({
    name: "",
    email: "",
    status: "all",
  });

  // --- TanStack Hooks Integration Engine ---
  const { data, isFetching: loading } = useGetCustomersManagedList({
    page,
    perPage: rowsPerPage,
    name: appliedFilters.name,
    email: appliedFilters.email,
    status: appliedFilters.status,
  });

  const users = data?.rows || [];
  const totalCount = data?.count || 0;

  // Handle Search Input Submission
  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      setPage(0);
      setAppliedFilters((prev) => ({
        ...prev,
        name: searchName,
        email: searchEmail,
      }));
    }
  };

  // Handle Dropdown Filter Change
  const handleStatusChange = (e) => {
    setPage(0);
    setAppliedFilters((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" color="#334155" mb={3}>
        Customer Workspace Registry
      </Typography>

      {/* Filter Options Section */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Search by Name"
              placeholder="Press Enter to search..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyDown={handleSearchSubmit}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Search by Email"
              placeholder="Press Enter to search..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyDown={handleSearchSubmit}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              size="small"
              label="Account Status"
              value={appliedFilters.status}
              onChange={handleStatusChange}
            >
              <MenuItem value="all">All Profiles</MenuItem>
              <MenuItem value="1">Active Only</MenuItem>
              <MenuItem value="0">Inactive</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Data Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f8fafc" }}>
            <TableRow>
              <TableCell>
                <b>User ID</b>
              </TableCell>
              <TableCell>
                <b>Full Name</b>
              </TableCell>
              <TableCell>
                <b>Email Address</b>
              </TableCell>
              <TableCell>
                <b>Assigned Role</b>
              </TableCell>
              <TableCell align="center">
                <b>Status</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  Fetching registry records...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  No target customers match your filters.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                if (!user) return null;
                return (
                  <TableRow key={user.id || Math.random()} hover>
                    <TableCell>#{user.id || "N/A"}</TableCell>
                    <TableCell style={{ fontWeight: 600, color: "#1e293b" }}>
                      {user.name || "N/A"}
                    </TableCell>
                    <TableCell>{user.email || "N/A"}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role?.name || user.role_name || "Customer"}
                        size="small"
                        sx={{
                          bgcolor: "#eff6ff",
                          color: "#1d4ed8",
                          fontWeight: "bold",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={0.5}
                      >
                        <CircleIcon
                          sx={{
                            fontSize: 10,
                            color:
                              user.is_active == 1 || user.is_active === true
                                ? "#10b981"
                                : "#ef4444",
                          }}
                        />
                        <Typography variant="body2">
                          {user.is_active == 1 || user.is_active === true
                            ? "Active"
                            : "Inactive"}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}

export default UserManagementPanel;
