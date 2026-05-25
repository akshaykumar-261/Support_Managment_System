import React from "react";
import { Box, Button, Grid } from "@mui/material";
import { CustomeTypographi, CustomeInput } from "../Component/Commoncomp.jsx";
import BackImage from "../assets/icons/image56.png";
function Forgotpassword() {
  return (
    <>
      <Grid
        container
        sx={{
          height: "100vh",
          width: "100%",
          backgroundImage: `url(${BackImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            height: "300px",
            width: "400px",
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "20px",
            boxShadow: "10px",
            display: "flex",
            flexDirection: "column", // <-- Isse elements ek ke niche ek aayenge
            justifyContent: "center",
            justifyContent: "space-evenly", // <-- Isse text upar chala jayega aur beech mein space banegi
            alignItems: "center",
            gap: "20px", // <-- Heading aur Input ke beech gap dene ke liye
            padding: "50px", // <-- Box ke andar thoda space rakhne ke liye
          }}
        >
          <CustomeTypographi
            variant="h4"
            sx={{ textAlign: "center", pt: "7px" }}
          >
            Verify Your Email
          </CustomeTypographi>
          <CustomeInput
            label="Email"
            type="email"
            sx={{
              width: "80%",
            }}
          />
          <Button variant="contained">Verify</Button>
        </Box>
      </Grid>
    </>
  );
}

export default Forgotpassword;
