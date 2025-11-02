import React from "react";
import { Box, Grid } from "@mui/material";
import LoginForm from "@/features/auth/components/LoginForm";
import ParticleBackground from "@/common/background/ParticleBackground";
import ScaleAnimationView from "@/common/background/ScaleAnimation";
import Icons from "@/internals/data/icons";


const LoginPage: React.FC = () => {


  return (
    <Grid container sx={{ height: "100vh", zIndex: 1, position: "relative" }}>
      <ParticleBackground
        maxSize={110}
        children={Icons().map((icon, index) => (
          <ScaleAnimationView key={index} useRandomDelay={true} duration={1000}>
            {icon}
          </ScaleAnimationView>
        ))}
      />

      {/* Right Section */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <LoginForm />
      </Box>
    </Grid>
  );
};

export default LoginPage;

