import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import React from 'react';
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { logout } from "@/services/auth";
import toast from 'react-hot-toast';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { useLocation, useNavigate } from "react-router-dom";
import { ROLE_ENUM } from '@/utils/enums';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Collapse } from '@mui/material';
import { useState } from 'react';
import SelectContent from './SelectContent';
import { MenuItem } from '@/utils/types';
import { createMainListItems, secondaryListItems } from '@/utils/functions';

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (value: React.SetStateAction<boolean>) => void;
}

export default function SideMenuMobile({ open, toggleDrawer }: SideMenuMobileProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const { user, current_company_id } = useSelector((state: RootState) => state.auth);
  const currentCompanyId = current_company_id || localStorage.getItem("current_company_id") || user?.user_settings?.current_company_id || '';
  const currentCompanyDetails = user?.company?.find((c: any) => c._id === currentCompanyId);
  const tax_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_tax;

  const mainListItems = createMainListItems(user?.user_type ?? ROLE_ENUM.NULL, tax_enable);

  const handleNavigation = (path: string) => {
    navigate(path);
  };
  const getUserInitials = () => {
    if (!user?.name) return 'TD';
    const { first, last } = user.name;
    return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();
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

  const renderMenuList = (items: MenuItem[]) => {
    const handleToggle = (item: MenuItem) => {
      if (Array.isArray(item.children) && item.children.length > 0) {
        // Expand only this section, collapse others
        setOpenSections({ [item.text]: true });
        // Navigate to first child
        if (item.children[0] && item.children[0].path) {
          handleNavigation(item.children[0].path);
          toggleDrawer(false);
        }
      } else {
        // Collapse all sections
        setOpenSections({});
        // Navigate to this item's path
        if (item.path) {
          toggleDrawer(false);
          handleNavigation(item.path);
        }
      }
    };

    return (
      <List>
        {items.map((item, index) => {
          const hasChildren = Array.isArray(item.children) && item.children.length > 0;
          const isOpen = openSections[item.text];

          return (
            <React.Fragment key={index}>
              <Tooltip title={item.text} placement="right" arrow>
                <ListItem
                  onClick={() => handleToggle(item)}
                  disablePadding
                  sx={{
                    display: "block",
                    my: 0.1,
                    transition: 'background-color 0.2s ease',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  <ListItemButton
                    selected={!!item.path && location.pathname.includes(item.path)}
                    sx={{
                      minHeight: 38,
                      justifyContent: isSmallScreen ? 'center' : 'initial',
                      px: 2.5,
                      borderRadius: 1,
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
                        fontWeight: theme.typography.fontWeightBold,
                      }
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: isSmallScreen ? 0 : 3,
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                    {hasChildren ? (isOpen ? <ExpandLess /> : <ExpandMore />) : null}
                  </ListItemButton>
                </ListItem>
              </Tooltip>

              {hasChildren && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children!.map((child, childIdx) => (
                      <ListItem
                        key={`${item.text}-${childIdx}`}
                        disablePadding
                        onClick={() => child.path && handleNavigation(child.path)}
                      >
                        <ListItemButton
                          selected={!!child.path && location.pathname.includes(child.path)}
                          sx={{
                            pl: 6,
                            minHeight: 36,
                            '&.Mui-selected': {
                              backgroundColor: theme.palette.primary.light,
                              fontWeight: theme.typography.fontWeightBold
                            }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText primary={child.text} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>
    );
  };


  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => toggleDrawer(false)}
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
          position: 'relative',
        }}
      >
        <Stack direction="row" alignItems='center' sx={{ p: 2, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1 }}
          >
            <Box
              sx={{
                display: "flex",
              }}
            >
              <SelectContent />
            </Box>
          </Stack>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <Stack
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              px: 1,
            }}
          >
            {renderMenuList(mainListItems)}

            <Divider sx={{ mb: 'auto' }} />
            <Divider sx={{ mt: 'auto' }} />
            {renderMenuList(secondaryListItems)}
          </Stack>
          <Divider />
        </Stack>
        {/* <CardAlert /> */}
        <Stack sx={{ py: 1, px: 2 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between', flexGrow: 1 }}
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
            <Typography variant="body1">
              {user?.name ?
                `${user.name.first ?? ''} ${user.name.last ?? ''}`.trim()
                : "Vyapar Drishti Team"
              }
            </Typography>
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
        </Stack>
      </Stack>
    </Drawer>
  );
}