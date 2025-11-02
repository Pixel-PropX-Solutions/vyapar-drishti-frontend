import React from "react";
import RegistrationForm from "@/features/auth/components/RegisterForm";
import { Box, Grid, } from "@mui/material";
import ParticleBackground from "@/common/background/ParticleBackground";
import ScaleAnimationView from "@/common/background/ScaleAnimation";
import Icons from "@/internals/data/icons";

const SignUpPage: React.FC = () => {

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

      {/* Sign Up Form */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <RegistrationForm />
      </Box>
    </Grid>
  );
};

export default SignUpPage;

