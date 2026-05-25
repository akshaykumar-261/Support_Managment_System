import React, { useState } from "react";
import {
  centerFlex,
  boxProperites,
  rightPannel,
  imageProperites,
  textFieldStyles,
  buttonProperties,
} from "../styles/authStyle.js";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.jsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./LoginValidation.jsx";
import supportImage from "../assets/image copy 5.png";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CustomeInput, CustomeTypographi } from "../Component/Commoncomp.jsx";
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
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });
  const onSubmit = async (data) => {
    try {
      console.log("FormData", data);
      const response = await axiosInstance.post("/users/login", data);
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      console.log("Token Saved");
      toast.success("Login Successfully");
      setTimeout(() => {
        navigate("/home");
      }, 3000);
      // await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.log("API Error", error);

      console.log(error.response?.data?.message);
    }
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
                  VERTEX SUPPORT
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
                inputProps={{ maxLength: 10 }}
              />

              <Button
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                sx={{ ...buttonProperties }}>
                {isSubmitting ? "Loading..." : "Login"}
              </Button>
              <Link
                underline="none"
                component={RouterLink}
                to="/forgotPassword"
                sx={{
                  color: "#6d28d9",
                  textAlign: "center",
                }}
                variant="body2"
              >
                Forgot Password?
              </Link>
              <Link
                underline="none"
                sx={{
                  color: "#6d28d9",
                  textAlign: "center",
                }}
                component={RouterLink}
                to="/register"
                variant="body2"
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
