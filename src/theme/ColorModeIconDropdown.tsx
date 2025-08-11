import * as React from "react";
import DarkModeIcon from "@mui/icons-material/DarkModeRounded";
import LightModeIcon from "@mui/icons-material/LightModeRounded";
import ComputerIcon from "@mui/icons-material/ComputerRounded";
import Box from "@mui/material/Box";
import IconButton, { IconButtonOwnProps } from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import {
  useColorScheme,
  Experimental_CssVarsProvider as CssVarsProvider,
} from "@mui/material/styles";

export default function ColorModeIconDropdownWrapper(
  props: IconButtonOwnProps
) {
  return (
    <CssVarsProvider>
      <ColorModeIconDropdown {...props} />
    </CssVarsProvider>
  );
}

function ColorModeIconDropdown(props: IconButtonOwnProps) {
  const { mode, systemMode, setMode } = useColorScheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMode = (targetMode: "system" | "light" | "dark") => () => {
    setMode(targetMode);
    handleClose();
  };

  // If mode is not yet resolved, show a placeholder
  if (!mode) {
    return (
      <Box
        data-screenshot="toggle-mode"
        sx={(theme) => ({
          verticalAlign: "bottom",
          display: "inline-flex",
          width: "2.25rem",
          height: "2.25rem",
          borderRadius: theme.shape.borderRadius,
          border: "1px solid",
          borderColor: theme.palette.divider,
        })}
      />
    );
  }

  // Determine the current resolved mode
  const resolvedMode = (systemMode || mode) as "light" | "dark";
  
  // Icon mapping with improved accessibility
  const modeIcons = {
    light: <LightModeIcon aria-label="Light mode" />,
    dark: <DarkModeIcon aria-label="Dark mode" />,
    system: <ComputerIcon aria-label="System mode" />
  };

  return (
    <React.Fragment>
      <Tooltip title="Change color mode">
        <IconButton
          data-screenshot="toggle-mode"
          onClick={handleClick}
          aria-controls={open ? "color-scheme-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          color="inherit"
          size="small"
          {...props}
        >
          {modeIcons[resolvedMode]}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="color-scheme-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 2,
            sx: {
              minWidth: '200px',
              borderRadius: 1,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem 
          selected={mode === "system"} 
          onClick={handleMode("system")}
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2,
          }}
        >
          <ListItemIcon>
            <ComputerIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="System" secondary="Follow device settings" />
        </MenuItem>
        <MenuItem 
          selected={mode === "light"} 
          onClick={handleMode("light")}
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2,
          }}
        >
          <ListItemIcon>
            <LightModeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Light" secondary="Always use light theme" />
        </MenuItem>
        <MenuItem 
          selected={mode === "dark"} 
          onClick={handleMode("dark")}
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2,
          }}
        >
          <ListItemIcon>
            <DarkModeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Dark" secondary="Always use dark theme" />
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}