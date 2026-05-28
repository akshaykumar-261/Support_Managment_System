import React, { useState, useEffect } from "react";
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
import axiosInstance from "../api/axiosInstance.jsx";
import toast from "react-hot-toast";

function UserManagementPanel() {
  // API States
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Pagination States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filters States
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      let url = `/users/getUser?page=${page + 1}&limit=${rowsPerPage}&role=Customer`;

      if (searchName) url += `&name=${searchName}`;
      if (searchEmail) url += `&email=${searchEmail}`;
      if (statusFilter !== "all") url += `&is_active=${statusFilter}`;

      const response = await axiosInstance.get(url);

      // API Debugging Logs (Aapko console mein dikhega exact structure)
      console.log("1. AXIOS RAW RESPONSE:", response);
      console.log("2. RESPONSE.DATA LEVEL:", response?.data);

      if (response && response.data) {
        let finalRows = [];
        let finalCount = 0;

        // --- DEEP NESTING EXTRACTION LOGIC (Foolproof) ---

        // Case A: Deep envelope -> response.data.data.data.rows
        if (
          response.data?.data?.data?.rows &&
          Array.isArray(response.data.data.data.rows)
        ) {
          finalRows = response.data.data.data.rows;
          finalCount = response.data.data.data.count;
        }
        // Case B: Medium envelope -> response.data.data.rows
        else if (
          response.data?.data?.rows &&
          Array.isArray(response.data.data.rows)
        ) {
          finalRows = response.data.data.rows;
          finalCount = response.data.data.count;
        }
        // Case C: Standard envelope -> response.data.rows
        else if (response.data?.rows && Array.isArray(response.data.rows)) {
          finalRows = response.data.rows;
          finalCount = response.data.count;
        }
        // Case D: Double Nested Array -> response.data.data.data = [...]
        else if (
          response.data?.data?.data &&
          Array.isArray(response.data.data.data)
        ) {
          finalRows = response.data.data.data;
          finalCount = response.data.data.data.length;
        }
        // Case E: Single Nested Array -> response.data.data = [...]
        else if (response.data?.data && Array.isArray(response.data.data)) {
          finalRows = response.data.data;
          finalCount = response.data.data.length;
        }
        // Case F: Naked Array -> response.data = [...]
        else if (Array.isArray(response.data)) {
          finalRows = response.data;
          finalCount = response.data.length;
        }

        // --- ULTRA BLACK-BOX FALLBACK ---
        // Agar upar ka koi pattern match nahi hua, toh pure object tree ko auto-scan karo array dhoondne ke liye
        if (finalRows.length === 0) {
          const l1 = response.data;
          const l2 = response.data?.data;
          const l3 = response.data?.data?.data;

          const scanForArray = (obj) => {
            if (!obj || typeof obj !== "object") return null;
            return Object.values(obj).find((val) => Array.isArray(val));
          };

          const foundArray =
            scanForArray(l3) || scanForArray(l2) || scanForArray(l1);
          const foundCount = l3?.count || l2?.count || l1?.count;

          if (foundArray) {
            finalRows = foundArray;
            finalCount = foundCount || foundArray.length;
          }
        }

        setUsers(finalRows);
        setTotalCount(Number(finalCount) || finalRows.length);
      }
    } catch (error) {
      console.error("Error fetching customer list:", error);
      toast.error("Failed to load customer registry records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, rowsPerPage, statusFilter]);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      setPage(0);
      fetchCustomers();
    }
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
              value={statusFilter}
              onChange={(e) => {
                setPage(0);
                setStatusFilter(e.target.value);
              }}
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
            ) : !users || users.length === 0 ? (
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
