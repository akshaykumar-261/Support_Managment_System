import React, { useState } from "react";
import {
  centerFlex,
  boxProperites,
  rightPannel,
  imageProperites,
  textFieldStyles,
  buttonProperties,
} from "../styles/authStyle.js";
import supportImage from "../assets/image copy 5.png";
import { CustomeInput, CustomeTypographi } from "../Component/Logincomp.jsx";
import {
  Box,
  TextField,
  Grid,
  Stack,
  Button,
  InputLabel,
  Typography,
  Link,
} from "@mui/material";
// import { logos } from "../assets/logo1.svg";
import SupportLogo from "../assets/icons/logo.js";
function Practice() {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <>
      <Grid container style={{ height: "100vh" }}>
        {/* Left Pannel */}
        <Grid
          container
          size={{ xs: 12, md: 6 }}
          sx={{
            ...centerFlex,
          }}
        >
          <Box
            sx={{
              ...boxProperites,
            }}
          >
            <Stack spacing={5}>
              <Box>
                <SupportLogo />

                <CustomeTypographi
                  variant="h5"
                  sx={{
                    color: "#6d28d9",
                    mt: 1,
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  MUJA Support
                </CustomeTypographi>

                <CustomeTypographi
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.1,
                  }}
                >
                  Management System
                </CustomeTypographi>
              </Box>
              <CustomeInput label="Email" type="email" />
              <CustomeInput label="Password" type="password" />
              <Button variant="contained" sx={{ ...buttonProperties }}>
                Login
              </Button>
              <Link
                sx={{ color: "#6d28d9" }}
                component="button"
                variant="body2"
                onClick={() => {
                  console.info("I'm a button.");
                }}
              >
                Register Here
              </Link>
            </Stack>
          </Box>
        </Grid>
        {/* Right Pannel */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ ...rightPannel }}>
          <img
            src={supportImage}
            alt="support"
            style={{
              ...imageProperites,
            }}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default Practice;
