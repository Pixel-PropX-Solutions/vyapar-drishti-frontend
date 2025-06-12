import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
// import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
// import ChemistIcon from '@mui/icons-material/Store';
// import StockistIcon from '@mui/icons-material/Warehouse';
// import UploadBillIcon from '@mui/icons-material/UploadFile';
import ProductIcon from '@mui/icons-material/LocalPharmacy';
import InventoryIcon from "@mui/icons-material/Inventory";
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
// import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { ROLE_ENUM } from '@/utils/enums';
import { People, Security } from '@mui/icons-material';

// Define menu item type
interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

const createMainListItems = (role: string): MenuItem[] => {
  const adminItems: MenuItem[] = [
    // { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon />, requiredRole: 'admin' },
    { text: "Inventory", path: "/inventory", icon: <InventoryIcon />, requiredRole: 'admin' },
    { text: "Products", path: "/products", icon: <ProductIcon />, requiredRole: 'admin' },
    // { text: "Stockists", path: "/stockists", icon: <StockistIcon />, requiredRole: 'admin' },
    // { text: "Chemists", path: "/chemists", icon: <ChemistIcon />, requiredRole: 'admin' },
  ];

  const chemistItems: MenuItem[] = [
    // { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon />, requiredRole: 'user' },
    { text: "Inventory", path: "/inventory", icon: <InventoryIcon />, requiredRole: 'user' },
    { text: "Timeline", path: "/timeline", icon: <ViewTimelineIcon />, requiredRole: 'user' },
    { text: "Products", path: "/products", icon: <ProductIcon />, requiredRole: 'user' },
    { text: "Groups & Types", path: "/groups", icon: <ProductIcon />, requiredRole: 'user' },
    { text: "Customers", path: "/customers", icon: <People />, requiredRole: 'user' },
    { text: "Invoices", path: "/invoices", icon: <LocalShippingIcon />, requiredRole: 'user' },
    // { text: "Sell Products", path: "/sell", icon: <ProductIcon />, requiredRole: 'user' },
    // { text: "Upload Bills", path: "/upload", icon: <UploadBillIcon />, requiredRole: 'user' },
    // { text: "Debitors", path: "/debitors", icon: <StockistIcon />, requiredRole: 'user' },
    // { text: "Sales", path: "/sales", icon: <LocalShippingIcon />, requiredRole: 'user' },
  ];

  if (role === ROLE_ENUM.USER)
    return chemistItems;
  else if (role === ROLE_ENUM.ADMIN)
    return adminItems;
  else {
    return [];
  }
};

const secondaryListItems: MenuItem[] = [
  // { text: "Settings", path: "/settings", icon: <SettingsRoundedIcon /> },
  { text: "Account", path: "/account", icon: <Security /> },
  { text: "About", path: "/about", icon: <InfoRoundedIcon /> },
];

export default function MenuContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useSelector((state: RootState) => state.auth);


  const mainListItems = createMainListItems(user?.user_type ?? ROLE_ENUM.NULL);

  const handleNavigation = (path: string) => {
    navigate(path);
  };


  const renderMenuList = (items: MenuItem[]) => (
    <List>
      {items.map((item, index) => (
        <Tooltip
          key={index}
          title={item.text}
          placement="right"
          arrow

        >
          <ListItem
            onClick={() => handleNavigation(item.path)}
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
              selected={location.pathname.includes(item.path)}
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
            </ListItemButton>
          </ListItem>
        </Tooltip>
      ))}
    </List>
  );

  return (
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
  );
}