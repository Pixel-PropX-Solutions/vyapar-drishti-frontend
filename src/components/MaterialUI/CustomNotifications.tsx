import * as React from "react";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import { Badge, Menu, MenuItem, Typography, Box } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import MenuButton from "./MenuButton";

// Dummy notification interface
interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'success' | 'error' | 'info';
}

// Dummy notifications data
const dummyNotifications: Notification[] = [
  {
    id: 1,
    title: "Project Update",
    description: "Your project 'Dashboard Redesign' has been approved.",
    time: "5 mins ago",
    type: 'success'
  },
  {
    id: 2,
    description: "Monthly team meeting scheduled for next Monday.",
    title: "Meeting Reminder",
    time: "2 hours ago",
    type: 'info'
  },
  {
    id: 3,
    title: "Resource Alert",
    description: "Low storage space on your project repository.",
    time: "Yesterday",
    type: 'error'
  }
];

export default function CustomNotification() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Function to get icon based on notification type
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircleOutlineIcon color="success" />;
      case 'error':
        return <ErrorOutlineIcon color="error" />;
      default:
        return <AccessTimeIcon color="info" />;
    }
  };

  return (
    <React.Fragment>
      <Badge
        badgeContent={dummyNotifications.length}
        color="primary"
        overlap="circular"
      >
        <MenuButton
          data-screenshot="toggle-mode"
          onClick={handleClick}
          disableRipple
          size="small"
          aria-label="Open notifications"
          aria-controls={open ? "notifications-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <NotificationsRoundedIcon />
        </MenuButton>
      </Badge>
      <Menu
        anchorEl={anchorEl}
        id="notifications-menu"
        open={open}
        onClose={handleClose}
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        slotProps={{
          paper: {
            variant: "outlined",
            elevation: 0,
            sx: {
              my: "4px",
              width: "350px",
              maxHeight: "400px",
              overflowY: "auto"
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Typography
          variant="h6"
          sx={{
            px: 2,
            py: 1,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          Notifications
        </Typography>
        {dummyNotifications.map((notification) => (
          <MenuItem
            key={notification.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              py: 1.5
            }}
          >
            {getNotificationIcon(notification.type)}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {notification.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'wrap' }}>
                {notification.description}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {notification.time}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        {dummyNotifications.length === 0 && (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </MenuItem>
        )}
      </Menu>
    </React.Fragment>
  );
}
