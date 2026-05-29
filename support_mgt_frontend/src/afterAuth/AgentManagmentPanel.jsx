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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CircleIcon from "@mui/icons-material/Circle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import axiosInstance from "../api/axiosInstance.jsx";
import toast from "react-hot-toast";

// 🟢 React Hook Form aur Zod ke Import
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../beforeAuth/RegisterValidation.jsx"

function AgentManagmentPanel() {
  // API States
  const [agents, setAgents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Pagination States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filters States
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal Open State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🟢 React Hook Form Initialization
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      roleId: "2", // Hidden/Disabled field value setup
    },
  });

  // Selected file ka live name watch karne ke liye
  const selectedFile = watch("profile_Img");

  // Reset form when modal closes or opens
  useEffect(() => {
    if (!isModalOpen) {
      reset();
    }
  }, [isModalOpen, reset]);

  // Fetch Table Data
  const fetchAgents = async () => {
    setLoading(true);
    try {
      let url = `/users/getUser?page=${page + 1}&limit=${rowsPerPage}&role=Agent`;

      if (searchName) url += `&name=${searchName}`;
      if (searchEmail) url += `&email=${searchEmail}`;
      if (statusFilter !== "all") url += `&is_active=${statusFilter}`;

      const response = await axiosInstance.get(url);
      if (response && response.data) {
        let finalRows = [];
        let finalCount = 0;
        if (
          response.data?.data?.data?.rows &&
          Array.isArray(response.data.data.data.rows)
        ) {
          finalRows = response.data.data.data.rows;
          finalCount = response.data.data.data.count;
        } else if (
          response.data?.data?.rows &&
          Array.isArray(response.data.data.rows)
        ) {
          finalRows = response.data.data.rows;
          finalCount = response.data.data.count;
        } else if (response.data?.rows && Array.isArray(response.data.rows)) {
          finalRows = response.data.rows;
          finalCount = response.data.count;
        } else if (
          response.data?.data?.data &&
          Array.isArray(response.data.data.data)
        ) {
          finalRows = response.data.data.data;
          finalCount = response.data.data.data.length;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          finalRows = response.data.data;
          finalCount = response.data.data.length;
        } else if (Array.isArray(response.data)) {
          finalRows = response.data;
          finalCount = response.data.length;
        }
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
        setAgents(finalRows);
        setTotalCount(Number(finalCount) || finalRows.length);
      }
    } catch (error) {
      console.error("Error fetching agent list:", error);
      toast.error("Failed to load agent squad team");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [page, rowsPerPage, statusFilter]);

  // 🟢 ON SUBMIT METHOD (Same pattern as Practice.jsx but with role_Id = "2")
  const onSubmit = async (data) => {
    try {
      // Safety profile check (Aapke flow ke mutabik mandatory check)
      if (!data.profile_Img || data.profile_Img.length === 0) {
        toast.error("Please select a profile image");
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("address", data.address);
      formData.append("phoneNo", data.phoneNo);
      formData.append("password", data.password);
      formData.append("role_Id", "2"); // 2 is Locked for Agent profile
      formData.append("profile_Img", data.profile_Img[0]); // Zero index image pass execution

      await axiosInstance.post("users/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Agent Account Created Successfully");
      setIsModalOpen(false); // Modal band hoga
      fetchAgents(); // Table refresh ho jayegi automatic
    } catch (error) {
      console.log("API Error", error);
      toast.error(error.response?.data?.message || "Failed to create agent");
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      setPage(0);
      fetchAgents();
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold" color="#334155">
          Agent Workspace Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
          sx={{
            bgcolor: "#6d28d9",
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": { bgcolor: "#5b21b6" },
          }}
        >
          Add New Agent
        </Button>
      </Box>

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
            ) : agents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  No target agents match your filters.
                </TableCell>
              </TableRow>
            ) : (
              agents.map((agent) => {
                if (!agent) return null;
                return (
                  <TableRow key={agent.id || Math.random()} hover>
                    <TableCell>#{agent.id || "N/A"}</TableCell>
                    <TableCell style={{ fontWeight: 600, color: "#1e293b" }}>
                      {agent.name || "N/A"}
                    </TableCell>
                    <TableCell>{agent.email || "N/A"}</TableCell>
                    <TableCell>
                      <Chip
                        label={agent.role?.name || agent.role_name || "Agent"}
                        size="small"
                        sx={{
                          bgcolor: "#f5f3ff",
                          color: "#6d28d9",
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
                              agent.is_active == 1 || agent.is_active === true
                                ? "#10b981"
                                : "#ef4444",
                          }}
                        />
                        <Typography variant="body2">
                          {agent.is_active == 1 || agent.is_active === true
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

      {/* 🟢 MODAL WITH HANDLESUBMIT AND VALIDATIONS */}
      <Dialog
        open={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "#6d28d9" }}>
          Add New Agent Profile
        </DialogTitle>

        {/* Form component wrap with hook form submission */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {/* Full Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Full Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  {...register("name")}
                  inputProps={{ maxLength: 30 }}
                />
              </Grid>

              {/* Email Address */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  type="email"
                  label="Email Address"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  {...register("email")}
                />
              </Grid>

              {/* Password */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  type="password"
                  label="Password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  {...register("password")}
                  inputProps={{ maxLength: 15 }}
                />
              </Grid>

              {/* Phone Number */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Phone Number"
                  error={!!errors.phoneNo}
                  helperText={errors.phoneNo?.message}
                  {...register("phoneNo")}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>

              {/* Full Address */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  label="Address"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  {...register("address")}
                />
              </Grid>

              {/* Role ID (Pre-filled to 2 & Locked/Disabled) */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  disabled
                  size="small"
                  label="Role ID"
                  value="2"
                  helperText="Locked to Agent Role (2)"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              {/* Profile Image File Picker wrapped with hook form input */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Profile Image
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                  error={!!errors.profile_Img}
                  sx={{
                    textTransform: "none",
                    height: "40px",
                    borderColor: errors.profile_Img ? "#ef4444" : "#cbd5e1",
                    color: errors.profile_Img ? "#ef4444" : "#475569",
                  }}
                >
                  {selectedFile && selectedFile[0]
                    ? selectedFile[0].name.substring(0, 15) + "..."
                    : "Upload Avatar"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    {...register("profile_Img")}
                  />
                </Button>
                {errors.profile_Img && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    {errors.profile_Img?.message}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, gap: 1 }}>
            <Button
              onClick={() => setIsModalOpen(false)}
              color="inherit"
              disabled={isSubmitting}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              sx={{
                bgcolor: "#6d28d9",
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": { bgcolor: "#5b21b6" },
              }}
            >
              {isSubmitting ? "Creating..." : "Create Agent"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

export default AgentManagmentPanel;
