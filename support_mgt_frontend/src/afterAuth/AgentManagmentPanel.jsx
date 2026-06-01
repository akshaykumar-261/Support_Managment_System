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
import toast from "react-hot-toast";

// React Hook Form aur Zod Validation Imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../beforeAuth/RegisterValidation.jsx";

// Import Custom TanStack Queries Hooks
import {
  useGetAgentsManagedList,
  useCreateAgentProfile,
} from "../api/apiHooks.jsx";

function AgentManagmentPanel() {
  // Pagination States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filters Local Input States
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  // Confirmed Active Filter States (Triggers TanStack Refetch on Enter or Select Change)
  const [appliedFilters, setAppliedFilters] = useState({
    name: "",
    email: "",
    status: "all",
  });

  // Modal Control State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- TanStack Integration Hooks Engine ---
  const { data, isFetching: loading } = useGetAgentsManagedList({
    page,
    perPage: rowsPerPage,
    name: appliedFilters.name,
    email: appliedFilters.email,
    status: appliedFilters.status,
  });

  const agents = data?.rows || [];
  const totalCount = data?.count || 0;

  const createAgentMutation = useCreateAgentProfile();
  // React Hook Form Setup
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      roleId: "2",
    },
  });

  const selectedFile = watch("profile_Img");

  // Reset multi-form context structures when modal context states changes
  useEffect(() => {
    if (!isModalOpen) {
      reset();
    }
  }, [isModalOpen, reset]);

  // Handle Search on Enter Key
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

  // Handle Account Status Dropdown Changes
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

  // Submit Handler Function Block execution
  const onSubmit = async (formDataValues) => {
    if (
      !formDataValues.profile_Img ||
      formDataValues.profile_Img.length === 0
    ) {
      toast.error("Please select a profile image");
      return;
    }

    const multipartForm = new FormData();
    multipartForm.append("name", formDataValues.name);
    multipartForm.append("email", formDataValues.email);
    multipartForm.append("address", formDataValues.address);
    multipartForm.append("phoneNo", formDataValues.phoneNo);
    multipartForm.append("password", formDataValues.password);
    multipartForm.append("role_Id", "2");
    multipartForm.append("profile_Img", formDataValues.profile_Img[0]);

    createAgentMutation.mutate(multipartForm, {
      onSuccess: () => {
        toast.success("Agent Account Created Successfully");
        setIsModalOpen(false);
      },
      onError: (error) => {
        console.error("API Error context logging:", error);
        toast.error(error.response?.data?.message || "Failed to create agent");
      },
    });
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
        <br></br>

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
      <br></br>
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

      {/* Data Table View */}
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

      {/* MODAL CONFIG DIALOG VIEW */}
      <Dialog
        open={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "#6d28d9" }}>
          Add New Agent Profile
        </DialogTitle>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogContent dividers>
            <Grid container spacing={2}>
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

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  disabled
                  size="small"
                  label="Role ID"
                  value="2"
                  helperText="Locked to Agent Role (2)"
                  InputProps={{ readOnly: true }}
                />
              </Grid>

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
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting || createAgentMutation.isLoading}
              sx={{
                bgcolor: "#6d28d9",
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": { bgcolor: "#5b21b6" },
              }}
            >
              {isSubmitting || createAgentMutation.isLoading
                ? "Creating..."
                : "Create Agent"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

export default AgentManagmentPanel;
