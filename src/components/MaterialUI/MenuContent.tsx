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
import {
  Assessment,
  // AddCardOutlined, 
  PaymentsOutlined, People, ReceiptOutlined, Security
} from '@mui/icons-material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Collapse } from '@mui/material';
import { useState } from 'react';

// Define menu item type
interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
  children?: MenuItem[];
  requiredRole?: 'admin' | 'user';
}

const createMainListItems = (role: string): MenuItem[] => {
  const adminItems: MenuItem[] = [
    // { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon />, requiredRole: 'admin' },
    // { text: "Inventory", path: "/inventory", icon: <InventoryIcon />, requiredRole: 'admin' },
    { text: "Products", path: "/products", icon: <ProductIcon />, requiredRole: 'admin' },
    // { text: "Stockists", path: "/stockists", icon: <StockistIcon />, requiredRole: 'admin' },
    // { text: "Chemists", path: "/chemists", icon: <ChemistIcon />, requiredRole: 'admin' },
  ];


  const userItems: MenuItem[] = [
    { text: "WareHouse", path: "/warehouses", icon: <InventoryIcon />, requiredRole: 'user' },
    { text: "Timeline", path: "/timeline", icon: <ViewTimelineIcon />, requiredRole: 'user' },
    { text: "Products", path: "/products", icon: <ProductIcon />, requiredRole: 'user' },
    { text: "Customers", path: "/customers", icon: <People />, requiredRole: 'user' },
    { text: "Invoices", path: "/invoices", icon: <ReceiptOutlined />, requiredRole: 'user' },
    { text: "Transactions", path: "/transactions", icon: <PaymentsOutlined />, requiredRole: 'user' },
    { text: "Reports", path: "/reports", icon: <Assessment />, requiredRole: 'user' }
  ];

  // const userItems: MenuItem[] = [
  // { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon />, requiredRole: 'user' },
  //   { text: "Inventory", path: "/inventory", icon: <InventoryIcon />, requiredRole: 'user' },
  //   { text: "Timeline", path: "/timeline", icon: <ViewTimelineIcon />, requiredRole: 'user' },
  //   { text: "Products", path: "/products", icon: <ProductIcon />, requiredRole: 'user' },
  // { text: "Groups & Types", path: "/groups", icon: <ProductIcon />, requiredRole: 'user' },
  //   { text: "Customers", path: "/customers", icon: <People />, requiredRole: 'user' },
  //   { text: "Invoices", path: "/invoices", icon: <LocalShippingIcon />, requiredRole: 'user' },
  //   { text: "Transactions", path: "/transactions", icon: <LocalShippingIcon />, requiredRole: 'user' },
  // { text: "Sell Products", path: "/sell", icon: <ProductIcon />, requiredRole: 'user' },
  // { text: "Upload Bills", path: "/upload", icon: <UploadBillIcon />, requiredRole: 'user' },
  // { text: "Debitors", path: "/debitors", icon: <StockistIcon />, requiredRole: 'user' },
  // { text: "Sales", path: "/sales", icon: <LocalShippingIcon />, requiredRole: 'user' },
  // ];

  if (role === ROLE_ENUM.USER)
    return userItems;
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

interface SideMenuMobileProps {
  open?: boolean | undefined;
  toggleDrawer?: (newOpen: boolean) => () => void;
}

export default function MenuContent({ toggleDrawer }: SideMenuMobileProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useSelector((state: RootState) => state.auth);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const mainListItems = createMainListItems(user?.user_type ?? ROLE_ENUM.NULL);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const renderMenuList = (items: MenuItem[]) => {
    const handleToggle = (item: MenuItem) => {
      if (Array.isArray(item.children) && item.children.length > 0) {
        // Expand only this section, collapse others
        setOpenSections({ [item.text]: true });
        // Navigate to first child
        if (item.children[0] && item.children[0].path) {
          handleNavigation(item.children[0].path);
          if (toggleDrawer) toggleDrawer(false);
        }
      } else {
        // Collapse all sections
        setOpenSections({});
        // Navigate to this item's path
        if (item.path) {
          if (toggleDrawer) toggleDrawer(false);
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