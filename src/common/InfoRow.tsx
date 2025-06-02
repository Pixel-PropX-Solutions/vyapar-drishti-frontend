import React, { useState } from "react";
import {
    Paper,
    Typography,
    Box,
    useTheme,
    alpha,
    Badge,
} from "@mui/material";

export const InfoRow: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    // isEditing?: boolean;
    // onEdit?: () => void;
    badge?: number;
}> = ({ icon, label, value, badge }) => {
    const theme = useTheme();
    const [hovered, setHovered] = useState(false);

    return (
        <Paper
            elevation={0}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                py: 2,
                px: 1,
                mb: 1,
                borderRadius: 1,
                background: hovered
                    ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`
                    : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.4)} 100%)`,
                backdropFilter: "blur(20px)",
                border: `1px solid ${hovered ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.primary.main, 0.08)}`,
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                transform: hovered ? "translateY(-4px)" : "translateY(0)",
                boxShadow: hovered
                    ? `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`
                    : `0 2px 8px ${alpha(theme.palette.primary.main, 0.05)}`,
            }}
        >
            <Box display="flex" alignItems="center" justifyContent="start">
                <Box display="flex" alignItems="center" flex={1}>
                    <Badge badgeContent={badge} color="error" sx={{ mr: 1 }}>
                        <Box
                            sx={{
                                p: 1,
                                borderRadius: 2.5,
                                bgcolor: hovered
                                    ? alpha(theme.palette.primary.main, 0.15)
                                    : alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.3s ease",
                                transform: hovered ? 'scale(1.1)' : 'scale(1)',
                            }}
                        >
                            {icon}
                        </Box>
                    </Badge>
                    <Box flex={1}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: "text.secondary",
                                fontWeight: 500,
                                textTransform: "uppercase",
                                letterSpacing: 1,
                                fontSize: "0.5rem",
                            }}
                        >
                            {label}
                        </Typography>
                        <Typography
                            variant="body2"
                            component="span"
                            sx={{ fontWeight: 600, mt: 0.5, fontSize: '.8rem' }}
                        >
                            {value}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};
