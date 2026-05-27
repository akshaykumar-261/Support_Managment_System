import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  CircularProgress,
  Divider,
  Chip,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SendIcon from "@mui/icons-material/Send";
import TimelineIcon from "@mui/icons-material/Timeline";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance.jsx";

function TicketHistoryPanel() {
  // Global Tables and Dropdowns States
  const [globalLogs, setGlobalLogs] = useState([]);
  const [agents, setAgents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [loading, setLoading] = useState(true);

  // Reassign Form State (Strictly matching updated system flows)
  const [reassignForm, setReassignForm] = useState({
    ticket_Id: "",
    assign_From: "",
    assign_To: "",
    assign_By: "1", // Super Admin logged-in ID
    action: "reassigned",
    old_Status: "open",
    new_Status: "open",
    old_Priority: "low",
    new_Priority: "high",
    from_Department: "",
    to_Department: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Specific Ticket Timeline State (Supports alphanumeric text tracking)
  const [searchTicketId, setSearchTicketId] = useState("");
  const [specificTimeline, setSpecificTimeline] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);

  const token = localStorage.getItem("accessToken");
  const headers = { Authorization: token ? `Bearer ${token}` : "" };

  // Helper: Format raw database action logs to readable strings
  const renderActionText = (log) => {
    if (!log) return "Internal operational change logged.";
    const byUser = log.assignBy?.name || `User #${log.assign_By || "Admin"}`;
    const toUser =
      log.assignTo?.name || `Agent #${log.assign_To || "Unassigned"}`;
    const fromUser =
      log.assignFrom?.name || `Agent #${log.assign_From || "N/A"}`;
    const fromDept =
      log.fromDepartment?.name || `Dept #${log.from_Department || "N/A"}`;
    const toDept =
      log.toDepartment?.name || `Dept #${log.to_department || "N/A"}`;

    switch (log.action || log.type) {
      case "created":
        return `Ticket initialized in system by ${byUser}.`;
      case "assigned":
        return `Assigned directly to ${toUser} by ${byUser}.`;
      case "reassigned":
        return `Routed from ${fromUser} ➜ ${toUser} (Dept: ${fromDept} ➜ ${toDept}) by ${byUser}.`;
      case "status_changed":
        return `Status state shifted from [${log.old_Status || "N/A"}] ➜ [${log.new_Status || "N/A"}].`;
      case "priority_changed":
        return `Priority scale calibrated from [${log.old_Priority || "low"}] ➜ [${log.new_Priority || "high"}].`;
      case "resolved":
        return `Ticket resolution completed.`;
      case "closed":
        return `Ticket archived & closed by ${byUser}.`;
      default:
        return `Action [${log.action || "Update"}] committed on record data.`;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case "created":
        return { bg: "#e0f2fe", text: "#0369a1" };
      case "assigned":
        return { bg: "#e0e7ff", text: "#4338ca" };
      case "reassigned":
        return { bg: "#fef3c7", text: "#b45309" };
      case "status_changed":
        return { bg: "#f3e8ff", text: "#6b21a8" };
      case "resolved":
        return { bg: "#dcfce7", text: "#15803d" };
      case "closed":
        return { bg: "#fee2e2", text: "#991b1b" };
      default:
        return { bg: "#f1f5f9", text: "#475569" };
    }
  };

  // 1. Core Fetcher Engine
  const fetchLogsLedger = async () => {
    try {
      const historyRes = await axiosInstance.get(
        "/ticketHistory/getTicketList",
        { headers },
      );
      if (historyRes.data?.data?.history) {
        setGlobalLogs(historyRes.data.data.history);
      }
    } catch (err) {
      console.error("Error loading master logs ledger:", err);
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setLoading(true);
        await fetchLogsLedger();

        // Fetch dropdown agents data
        const agentRes = await axiosInstance
          .get("/ticket/getAgentsList", { headers })
          .catch(() =>
            axiosInstance.get("/ticketHistory/getAgentsList", { headers }),
          );
        if (agentRes.data?.data?.users) setAgents(agentRes.data.data.users);

        // Fetch departments listing
        const deptRes = await axiosInstance
          .get("/department/getDepartmentList", { headers })
          .catch(() => null);
        if (deptRes?.data?.data?.departments) {
          setDepartments(deptRes.data.data.departments);
        } else {
          // MODIFIED: Updated fallback parameters as requested
          setDepartments([
            { id: 1, name: "Billing" },
            { id: 2, name: "Technical Support" },
            { id: 3, name: "Sales" },
          ]);
        }
      } catch (err) {
        console.error("Initialization anomaly detected:", err);
      } finally {
        setLoading(false);
      }
    };
    initializeDashboard();
  }, []);

  // // 2. Filter Action: Agent Logs Stream Lookups
  const handleAgentFilterChange = async (agentId) => {
    setSelectedAgent(agentId);
    if (!agentId) {
      setLoading(true);
      await fetchLogsLedger();
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/ticketHistory/getAgentHistory/${agentId}`,
        { headers },
      );
      setGlobalLogs(res.data?.data?.history || []);
    } catch (err) {
      toast.error("Could not trace targeted agent logs stream.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Search Action: Live Timeline Component Pull
  const handleFetchTimeline = async () => {
    if (!searchTicketId.trim()) {
      toast.error("Enter a valid target Ticket ID reference.");
      return;
    }
    try {
      setTimelineLoading(true);
      const res = await axiosInstance.get(
        `/ticketHistory/getTicketHistoryList/${searchTicketId}`,
        { headers },
      );
      setSpecificTimeline(res.data?.data?.ticketId || []);
      toast.success("Lifecycle milestones synced.");
    } catch (err) {
      toast.error("Target lifecycle data extraction failure.");
    } finally {
      setTimelineLoading(false);
    }
  };

  // 4. Form Action: Execute Ticket Reassignment
  const handleReassignSubmit = async (e) => {
    e.preventDefault();
    if (
      !reassignForm.ticket_Id ||
      !reassignForm.assign_From ||
      !reassignForm.assign_To ||
      !reassignForm.from_Department ||
      !reassignForm.to_Department
    ) {
      toast.error("Missing critical configuration parameters.");
      return;
    }

    try {
      setFormSubmitting(true);
      const res = await axiosInstance.post(
        "/ticketHistory/reAssignTicket",
        reassignForm,
        { headers },
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Ticket reassigned & ledger stream updated!");
        await fetchLogsLedger();
        setReassignForm({
          ticket_Id: "",
          assign_From: "",
          assign_To: "",
          assign_By: "1",
          action: "reassigned",
          old_Status: "open",
          new_Status: "open",
          old_Priority: "low",
          new_Priority: "high",
          from_Department: "",
          to_Department: "",
        });
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Reassignment rejection received from backend API layers.",
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // 5. Delete Action: Purge Specific Record
  const handlePurgeRecord = async (logId) => {
    if (
      !window.confirm(
        "Purge this operational history entry from active databases permanently?",
      )
    )
      return;
    try {
      await axiosInstance.delete(`/ticketHistory/deleteHistory/${logId}`, {
        headers,
      });
      toast.success("Ledger entry wiped.");
      setGlobalLogs((prev) => prev.filter((item) => item.id !== logId));
    } catch (err) {
      toast.error("Purge operations execution roadblock.");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress sx={{ color: "#6d28d9" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {/* LEFT COMPONENT COLUMN: CONTROLS & REASSIGN ENGINE */}
        <Grid item xs={12} lg={5}>
          <Stack spacing={3}>
            {/* CARD A: REASSIGNMENT EXECUTION POST FORM */}
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
                borderTop: "4px solid #6d28d9",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                color="#6d28d9"
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <AssignmentIndIcon /> Reassign Ticket Stream
              </Typography>

              <form onSubmit={handleReassignSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Ticket ID (String/No.)"
                      size="small"
                      required
                      value={reassignForm.ticket_Id}
                      onChange={(e) =>
                        setReassignForm({
                          ...reassignForm,
                          ticket_Id: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Assign By (Admin)"
                      size="small"
                      type="number"
                      required
                      value={reassignForm.assign_By}
                      onChange={(e) =>
                        setReassignForm({
                          ...reassignForm,
                          assign_By: e.target.value,
                        })
                      }
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl fullWidth size="small" required>
                      <InputLabel>Assign From Agent</InputLabel>
                      <Select
                        value={reassignForm.assign_From}
                        label="Assign From Agent"
                        onChange={(e) =>
                          setReassignForm({
                            ...reassignForm,
                            assign_From: e.target.value,
                          })
                        }
                      >
                        {agents.map((a) => (
                          <MenuItem key={a.id} value={a.id}>
                            {a.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth size="small" required>
                      <InputLabel>Assign To Agent</InputLabel>
                      <Select
                        value={reassignForm.assign_To}
                        label="Assign To Agent"
                        onChange={(e) =>
                          setReassignForm({
                            ...reassignForm,
                            assign_To: e.target.value,
                          })
                        }
                      >
                        {agents.map((a) => (
                          <MenuItem key={a.id} value={a.id}>
                            {a.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl fullWidth size="small" required>
                      <InputLabel>From Department</InputLabel>
                      <Select
                        value={reassignForm.from_Department}
                        label="From Department"
                        onChange={(e) =>
                          setReassignForm({
                            ...reassignForm,
                            from_Department: e.target.value,
                          })
                        }
                      >
                        {departments.map((d) => (
                          <MenuItem key={d.id} value={d.id}>
                            {d.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth size="small" required>
                      <InputLabel>To Department</InputLabel>
                      <Select
                        value={reassignForm.to_Department}
                        label="To Department"
                        onChange={(e) =>
                          setReassignForm({
                            ...reassignForm,
                            to_Department: e.target.value,
                          })
                        }
                      >
                        {departments.map((d) => (
                          <MenuItem key={d.id} value={d.id}>
                            {d.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Old Status</InputLabel>
                      <Select
                        value={reassignForm.old_Status}
                        label="Old Status"
                        onChange={(e) =>
                          setReassignForm({
                            ...reassignForm,
                            old_Status: e.target.value,
                          })
                        }
                      >
                        {/* MODIFIED: Updated values status schema map array */}
                        {["open", "in_progress", "closed"].map((s) => (
                          <MenuItem key={s} value={s}>
                            {s.replace("_", " ").toUpperCase()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>New Status</InputLabel>
                      <Select
                        value={reassignForm.new_Status}
                        label="New Status"
                        onChange={(e) =>
                          setReassignForm({
                            ...reassignForm,
                            new_Status: e.target.value,
                          })
                        }
                      >
                        {/* MODIFIED: Updated values status schema map array */}
                        {["open", "in_progress", "closed"].map((s) => (
                          <MenuItem key={s} value={s}>
                            {s.replace("_", " ").toUpperCase()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Old Priority</InputLabel>
                      <Select
                        value={reassignForm.old_Priority}
                        label="Old Priority"
                        onChange={(e) =>
                          setReassignForm({
                            ...reassignForm,
                            old_Priority: e.target.value,
                          })
                        }
                      >
                        {/* MODIFIED: Stripped out critical from option configurations */}
                        {["low", "medium", "high"].map((p) => (
                          <MenuItem key={p} value={p}>
                            {p.toUpperCase()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>New Priority</InputLabel>
                      <Select
                        value={reassignForm.new_Priority}
                        label="New Priority"
                        onChange={(e) =>
                          setReassignForm({
                            ...reassignForm,
                            new_Priority: e.target.value,
                          })
                        }
                      >
                        {/* MODIFIED: Stripped out critical from option configurations */}
                        {["low", "medium", "high"].map((p) => (
                          <MenuItem key={p} value={p}>
                            {p.toUpperCase()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={formSubmitting}
                  endIcon={<SendIcon />}
                  sx={{
                    mt: 2,
                    bgcolor: "#6d28d9",
                    fontWeight: "bold",
                    textTransform: "none",
                    "&:hover": { bgcolor: "#5b21b6" },
                  }}
                >
                  {formSubmitting
                    ? "Processing Route Allocation..."
                    : "Execute Reassignment"}
                </Button>
              </form>
            </Card>

            {/* CARD B: AUDIT LOOKUP FILTERS & TARGET TIMELINE LINE */}
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <Divider sx={{ my: 2 }}>OR TRACK SYSTEM TIMELINE</Divider>

              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <input
                  type="text"
                  placeholder="Enter Target Ticket ID (e.g. TKT-102)"
                  value={searchTicketId}
                  onChange={(e) => setSearchTicketId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8.5px 14px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                  }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleFetchTimeline}
                  sx={{ bgcolor: "#475569", textTransform: "none" }}
                >
                  Track
                </Button>
              </Stack>

              {/* TIMELINE RENDER LOGIC */}
              {specificTimeline.length > 0 && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: "#f8fafc",
                    borderRadius: 2,
                    borderLeft: "4px solid #475569",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <TimelineIcon fontSize="small" /> Ticket #{searchTicketId}{" "}
                    Milestones Trace:
                  </Typography>
                  {timelineLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Stack spacing={2}>
                      {specificTimeline.map((item, idx) => {
                        const style = getActionColor(item.type);
                        return (
                          <Box key={idx}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              sx={{ mb: 0.5 }}
                            >
                              <Chip
                                label={item.type?.toUpperCase()}
                                size="small"
                                sx={{
                                  bgcolor: style.bg,
                                  color: style.text,
                                  fontWeight: "bold",
                                  fontSize: "9px",
                                }}
                              />
                              <Typography
                                variant="caption"
                                color="text.disabled"
                              >
                                {item.at
                                  ? new Date(item.at).toLocaleString()
                                  : ""}
                              </Typography>
                            </Stack>
                            <Typography variant="body2" color="#334155">
                              {renderActionText(item)}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Stack>
                  )}
                </Box>
              )}
            </Card>
          </Stack>
        </Grid>

        {/* RIGHT COMPONENT COLUMN: MASTER AUDIT LEDGER LOGS TABLE */}
        <Grid item xs={12} lg={7}>
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
              height: "100%",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
            >
              <HistoryIcon sx={{ color: "#6d28d9" }} /> Master Operational
              System Ledger
            </Typography>

            <TableContainer sx={{ maxHeight: 680 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {[
                      "Log ID",
                      "Ticket Ref",
                      "State",
                      "System Modification Audit Logs",
                      "Timestamp",
                      "Purge",
                    ].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          bgcolor: "#f1f5f9",
                          fontWeight: "bold",
                          color: "#475569",
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {globalLogs.length > 0 ? (
                    globalLogs.map((log) => {
                      const badge = getActionColor(log.action);
                      return (
                        <TableRow key={log.id} hover>
                          <TableCell>#{log.id}</TableCell>
                          <TableCell fontWeight="bold">
                            #T-{log.ticket_Id || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={log.action || "update"}
                              size="small"
                              sx={{
                                bgcolor: badge.bg,
                                color: badge.text,
                                fontWeight: "bold",
                                textTransform: "capitalize",
                                fontSize: "11px",
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ maxWidth: 280, fontSize: "12.5px" }}>
                            {renderActionText(log)}
                          </TableCell>
                          <TableCell
                            sx={{ fontSize: "11px", color: "text.secondary" }}
                          >
                            {log.createdAt
                              ? new Date(log.createdAt).toLocaleString()
                              : "Just Now"}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handlePurgeRecord(log.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">
                          No transactional logs present in active databases.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TicketHistoryPanel;
