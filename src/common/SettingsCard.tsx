import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  alpha,
  CardHeader,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Enhanced Settings Card
export const SettingsCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({
  title,
  children,
  icon
}) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        m: 0,
        p: 1,
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`,
        backdropFilter: "blur(20px)",
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
        }
      }}
    >
      <CardHeader
        avatar={
          <Box
            sx={{
              p: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: 1,
              color: theme.palette.primary.main,
            }}
          >
            {icon}
          </Box>
        }
        title={
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            {title}
          </Typography>
        }
        sx={{ pb: 1 }}
      />
      <CardContent sx={{ pt: 0 }}>
        {children}
      </CardContent>
    </Card>
  );
};