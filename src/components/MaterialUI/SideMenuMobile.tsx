import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuContent from './MenuContent';
import React from 'react';
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { logout } from "@/services/auth";
import CustomNotification from './CustomNotifications';
import toast from 'react-hot-toast';


interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile({ open, toggleDrawer }: SideMenuMobileProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const theme = useTheme();

  const getUserInitials = () => {
    if (!user?.name) return 'TD';
    const { first, last } = user.name;
    return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(logout()).unwrap().then(() => {
      toast.success("Logged out successfully!");
      navigate("/");
    }).catch((error) => {
      toast.error(error || "An unexpected error occurred. Please try again later.");
    });
  };


  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: '70dvw',
          height: '100%',
        }}
      >
        <Stack direction="row" alignItems='center' sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}
            onClick={handleProfileClick}
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
            <Typography component="p" variant="h6">
              {user?.name ?
                `${user.name.first ?? ''} ${user.name.last ?? ''}`.trim()
                : "DristiDocs Team"
              }
            </Typography>
          </Stack>
          <CustomNotification />
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent />
          <Divider />
        </Stack>
        {/* <CardAlert /> */}
        <Stack sx={{ p: 2 }}>
          <Button variant="outlined" fullWidth startIcon={<LogoutRoundedIcon />}
            onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}
