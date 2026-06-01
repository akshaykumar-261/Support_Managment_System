import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import toast from "react-hot-toast";
const SOCKET_SERVER_URL = "http://localhost:8088";
function TicketChat({ ticketId }) {
  const [messages, setMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null); 
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const token = localStorage.getItem("accessToken");
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  // 1. Token decode logic with Integer Conversion
  useEffect(() => {
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const decoded = JSON.parse(jsonPayload);
        
        // CHANGES HERE: Integer parse ensure kiya taaki strict datatype mismatch khatam ho sake
        if (decoded && decoded.id) {
          setCurrentUserId(parseInt(decoded.id, 10));
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);
  useEffect(() => {
    if (!ticketId || !token) return;

    socketRef.current = io(SOCKET_SERVER_URL, {
      extraHeaders: {
        token: `Bearer ${token}`,
      },
    });

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to Chat Engine Server!");
      socketRef.current.emit("join_ticket", { ticket_Id: ticketId });
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });
    socketRef.current.on("load_chat_history", (chatHistory) => {
      setMessages(chatHistory);
    });
    socketRef.current.on("receive_message", (newMessage) => {
      if (String(newMessage.ticket_Id) === String(ticketId)) {
        setMessages((prev) => {
          const exists = prev.some(
            (m) =>
              m.createdAt === newMessage.createdAt &&
              m.message === newMessage.message
          );
          if (exists) return prev;
          return [...prev, newMessage];
        });
      }
    });

    socketRef.current.on("message_error", (err) => {
      toast.error(err.message || "Message failed validation");
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket Auth Fail:", err.message);
      toast.error(`Chat Authentication Error: ${err.message}`);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [ticketId, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    if (!isConnected) {
      toast.error("Connecting... Please wait");
      return;
    }

    const messagePayload = {
      ticket_Id: parseInt(ticketId, 10),
      message: typedMessage.trim(),
    };

    socketRef.current.emit("send_message", messagePayload);
    setTypedMessage("");
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        height: "450px",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#ffffff",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        border: "1px solid #f1f5f9",
        mt: 3,
      }}
    >
      {/* Upper Status Layer */}
      <Box
        sx={{
          pb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: isConnected ? "#10b981" : "#f43f5e",
          }}
        />
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color="#1e293b"
          sx={{ flexGrow: 1 }}
        >
          Live Ticket Updates & Comments
        </Typography>
        {!isConnected && (
          <CircularProgress size={16} sx={{ color: "#6d28d9" }} />
        )}
      </Box>

      <Divider />

      {/* Messages Render Zone */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", py: 2, pr: 0.5 }}>
        {messages.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body2" color="text.disabled">
              No live updates yet. Send a message to begin!
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {messages.map((msg, index) => {
              // CHANGES HERE: Strict integer dynamic verification
              const isMe = parseInt(msg.sender_Id, 10) === parseInt(currentUserId, 10);

              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMe ? "flex-end" : "flex-start", // Left vs Right Alignment
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "75%",
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: isMe ? "#6d28d9" : "#f8fafc",
                      color: isMe ? "#ffffff" : "#334155",
                      border: isMe ? "none" : "1px solid #e2e8f0",
                    }}
                  >
                    {!isMe && (
                      <Typography
                        variant="caption"
                        fontWeight="bold"
                        color="#6d28d9"
                        display="block"
                      >
                        {msg.from || "System Agent"}
                      </Typography>
                    )}

                    <Typography
                      variant="body2"
                      sx={{ mt: 0.5, wordBreak: "break-word" }}
                    >
                      {msg.message}
                    </Typography>
                  </Box>

                  {/* Message Timestamp */}
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{
                      px: 1,
                      mt: 0.2,
                      fontSize: "0.68rem",
                      alignSelf: isMe ? "flex-end" : "flex-start",
                    }}
                  >
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Just Now"}
                  </Typography>
                </Box>
              );
            })}
            <div ref={chatEndRef} />
          </Stack>
        )}
      </Box>

      {/* Bottom Actions Form Input */}
      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{ display: "flex", gap: 1, pt: 1 }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Write a message to reply..."
          value={typedMessage}
          disabled={!isConnected}
          onChange={(e) => setTypedMessage(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "#f8fafc",
            },
          }}
        />
        <IconButton
          type="submit"
          disabled={!isConnected || !typedMessage.trim()}
          sx={{
            bgcolor: "#6d28d9",
            color: "#ffffff",
            borderRadius: 2,
            px: 2,
            "&:hover": { bgcolor: "#5b21b6" },
            "&.Mui-disabled": { bgcolor: "#f1f5f9", color: "#94a3b8" },
          }}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
}

export default TicketChat;





