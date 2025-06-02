import * as React from "react";
import { styled } from "@mui/material/styles";
import { dividerClasses } from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MuiMenuItem from "@mui/material/MenuItem";
import { paperClasses } from "@mui/material/Paper";
import { listClasses } from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon, { listItemIconClasses } from "@mui/material/ListItemIcon";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import MenuButton from "./MenuButton";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { logout } from "@/services/auth";

const MenuItem = styled(MuiMenuItem)({
  margin: "0px 4px",
});

export default function OptionsMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <MenuButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: "transparent" }}
      >
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: "4px 8px",
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: "4px 4px",
          },
        }}
      >
        {/* <MenuItem
          onClick={() => {
            handleClose();
            navigate("/profile");
          }}
        >
          Profile
        </MenuItem>
        <Divider /> */}
        {/* <MenuItem
          onClick={() => {
            handleClose();
            navigate("/profile/edit");
          }}
        >
          Edit Profile
        </MenuItem>
        <Divider /> */}
        <MenuItem
          onClick={() => {
            handleClose();
            dispatch(logout());
            navigate("/");
          }}
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: "auto",
              minWidth: 0,
            },
          }}
        >
          <ListItemText>Logout </ListItemText>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" sx={{ marginLeft: "5px" }} />
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
