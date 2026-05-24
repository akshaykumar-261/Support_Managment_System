import React, { useState } from "react";
import {
  centerFlex,
  boxProperites,
  rightPannel,
  imageProperites,
  textFieldStyles,
  buttonProperties,
} from "../styles/authStyle.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./PracticeValidation.jsx";
import supportImage from "../assets/image copy 5.png";
import { useForm } from "react-hook-form";
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
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });
  const onSubmit = async (data) => {
    try {
      console.log("data", data);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (error) {}
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
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              ...boxProperites,
            }}
          >
            <Stack spacing={3}>
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
              <CustomeInput
                label="Email"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email")}
                type="email"
              />
              <CustomeInput
                label="Password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password")}
                type="password"
                inputProps={{ maxLength: 8 }}
              />

              <Button
                variant="contained"
                type="submit "
                disabled={isSubmitting}
                sx={{ ...buttonProperties }}
              >
                {isSubmitting ? "Loading..." : "Login"}
              </Button>
              <Link
                underline="none"
                href="#"
                sx={{ color: "#6d28d9" }}
                component="button"
                variant="body2"
                onClick={() => {
                  console.info("I'm a button.");
                }}
              >
                Forgot Password?
              </Link>
              <Link
                underline="none"
                sx={{ color: "#6d28d9" }}
                component="button"
                href="#"
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
