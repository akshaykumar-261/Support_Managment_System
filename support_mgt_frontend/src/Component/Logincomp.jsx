import React, { forwardRef, useState } from "react";

import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";

import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

import { textFieldStyles, buttonProperties } from "../styles/authStyle.js";

export const CustomeInput = forwardRef(
  ({ label, type = "text", error, helperText, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(true);
    const handleClickShowPassword = () => {
      setShowPassword((prev) => !prev);
    };
    const isPassword = type === "password";
    return (
      <TextField
        fullWidth
        variant="outlined"
        label={label}
        type={isPassword ? (!showPassword ? "text" : "password") : type}
        size="small"
        inputRef={ref}
        error={!!error}
        helperText={helperText}
        sx={{
          ...textFieldStyles,
          "& .MuiOutlinedInput-root": {
            paddingRight: "10px",
          },
        }}
        slotProps={{
          input: {
            endAdornment: isPassword && (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        {...props}
      />
    );
  },
);

CustomeInput.displayName = "CustomeInput";

export const CustomButton = ({ children, type = "button", ...props }) => {
  return (
    <Button type={type} variant="contained" sx={buttonProperties} {...props}>
      {children}
    </Button>
  );
};
export const CustomeTypographi = ({
  children,
  variant = "body1",
  component = "p",
  ...props
}) => {
  return (
    <Typography variant={variant} component={component} {...props}>
      {children}
    </Typography>
  );
};
