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
import { registerSchema } from "./RegisterValidation.jsx";
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
import { maxLength } from "zod";
import { da } from "zod/v4/locales";
function Practice() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });
  const onSubmit = async (data) => {
    try {
      console.log("FULL DATA =>", data);
      console.log("IMAGE =>", data.profile_Img);

      // safety check
      if (!data.profile_Img || data.profile_Img.length === 0) {
        console.log("No file selected");
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("address", data.address);
      formData.append("phoneNo", data.phoneNo);
      formData.append("password", data.password);
      formData.append("role_Id", "3");
      formData.append("profile_Img", data.profile_Img[0]);
      const response = await axiosInstance.post("users/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Register Successfully");
      setTimeout(() => {
        navigate("/");
      },3000)
    } catch (error) {
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
            <Stack spacing={2}>
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
                label="Name"
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register("name")}
                type="name"
                inputProps={{ maxLength: 30 }}
              />
              <CustomeInput
                label="Email"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email")}
                type="email"
              />
              <CustomeInput
                label="Address"
                error={!!errors.address}
                helperText={errors.address?.message}
                {...register("address")}
                type="address"
              />
              <CustomeInput
                label="PhoneNo"
                error={!!errors.phoneNo}
                helperText={errors.phoneNo?.message}
                {...register("phoneNo")}
                type="phoneNo"
                inputProps={{ maxLength: 10 }}
              />

              <CustomeInput
                label="Password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password")}
                type="password"
                inputProps={{ maxLength: 15 }}
              />
              <TextField
                type="file"
                fullWidth
                inputProps={{ accept: "image/*" }}
                {...register("profile_Img")}
              />
              <Button
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                sx={{ ...buttonProperties }}
              >
                {isSubmitting ? "Loading..." : "Register"}
              </Button>
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
