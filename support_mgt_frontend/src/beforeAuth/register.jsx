import React from "react";
import { Box, TextField, Button, Typography, Paper, Grid } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import supportImage from "../assets/image1.png";
import bgImage from "../assets/image copy.png";
function register() {
  return (
    <>
      <Grid container>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              color: "#ad3891",
              position: "absolute",
              top: "120px",
              left: "150px",
            }}
          >
            <h1>Log In to your Account</h1>
          </Box>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                right: 0,
                width: "100%",
                height: "100%",
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.12,
                objectFit: "cover",
              },
            }}
          >
            <Box
              component="form"
              sx={{
                width: "100%",
                maxWidth: 400,
                borderRadius: 3,
                border: "2px solid #ad3891",
                boxShadow: 10,
                p: 4,
                position: "relative",
                zIndex: 2,
              }}
            >
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#ad3891 !important",
                    },

                    // Focus Border
                    "&.Mui-focused fieldset": {
                      borderColor: "#ad3891",
                    },
                  },

                  // Label Focus
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#ad3891",
                  },
                }}
              />
              <br />

              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#ad3891 !important",
                    },
                    // Focus Border
                    "&.Mui-focused fieldset": {
                      borderColor: "#ad3891",
                    },
                  },
                  // Label Focus
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#ad3891",
                  },
                }}
              />
              <br />
              <br />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  width: "200px",
                  alignItems: "center",
                  py: 1.2,
                  borderRadius: 2,
                  backgroundColor: "#ad3891",

                  "&:hover": {
                    backgroundColor: "#922f79",
                  },
                }}
              >
                Login
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            height: "100vh",
          }}
        >
          <img
            src={supportImage}
            alt="support"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default register;
