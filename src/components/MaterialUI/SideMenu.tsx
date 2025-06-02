import React from 'react';
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import SelectContent from "./SelectContent";
import MenuContent from "./MenuContent";
import { IconButton, Tooltip } from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { logout } from "@/services/auth";

const drawerWidth = 280; // Slightly wider for more breathing room

const AnimatedDrawer = styled(MuiDrawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  transition: theme.transitions.create(['width', 'transform'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
    overflow: 'hidden',
    borderRight: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[1],
  },
}));

export default function SideMenu() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const theme = useTheme();

  const getUserInitials = () => {
    if (!user?.name) return 'TD';
    const { first, last } = user.name;
    return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(logout());
    navigate("/");
  };

  return (
    <AnimatedDrawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
          p: 1,
        }}
      >
        <SelectContent />
      </Box>
      <Divider sx={{ my: 0 }} />
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MenuContent />
      </Box>
      <Stack
        direction="row"
        className="group"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: `1px solid ${theme.palette.divider}`,
          transition: 'background-color 0.2s ease',
        }}

      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            transition: 'transform 0.2s ease',
            ':hover': {
              transform: 'scale(1.1)',
            }
          }}
        >
          {getUserInitials()}
        </Avatar>
        <Box
          sx={{
            mr: "auto",
            opacity: 0.8,
            transition: 'opacity 0.2s ease',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              lineHeight: "16px",
              color: theme.palette.text.primary,
            }}
          >
            {user ?
              `${user.name.first ?? ''} ${user.name.last ?? ''}`.trim()
              : "DristiDocs Team"
            }
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 180,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user?.email.substring(0, 25) ?? "team@dristidocs.com"}
          </Typography>
        </Box>
        <Tooltip
          title="Logout"
          placement="top"
          arrow
        >
          <IconButton
            size="small"
            onClick={handleLogout}
            sx={{
              color: theme.palette.text.secondary,
              transition: 'color 0.2s ease',
            }}
          >
            <LogoutRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </AnimatedDrawer>
  );
}
