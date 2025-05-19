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
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ChemistIcon from '@mui/icons-material/Store';
import StockistIcon from '@mui/icons-material/Warehouse';
import UploadBillIcon from '@mui/icons-material/UploadFile';
import ProductIcon from '@mui/icons-material/LocalPharmacy';
import InventoryIcon from "@mui/icons-material/Inventory";
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { ROLE_ENUM } from '@/utils/enums';

// Define menu item type
interface MenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
  requiredRole?: 'admin' | 'chemist';
}

const createMainListItems = (role: string): MenuItem[] => {
  const adminItems: MenuItem[] = [
    { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon />, requiredRole: 'admin' },
    { text: "Inventory", path: "/inventory", icon: <InventoryIcon />, requiredRole: 'admin' },
    { text: "Products", path: "/products", icon: <ProductIcon />, requiredRole: 'admin' },
    { text: "Stockists", path: "/stockists", icon: <StockistIcon />, requiredRole: 'admin' },
    { text: "Chemists", path: "/chemists", icon: <ChemistIcon />, requiredRole: 'admin' },
  ];

  const chemistItems: MenuItem[] = [
    { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon />, requiredRole: 'chemist' },
    { text: "Inventory", path: "/inventory", icon: <InventoryIcon />, requiredRole: 'chemist' },
    { text: "Timeline", path: "/timeline", icon: <ViewTimelineIcon />, requiredRole: 'chemist' },
    { text: "Products", path: "/products", icon: <ProductIcon />, requiredRole: 'chemist' },
    { text: "Sell Products", path: "/sell", icon: <ProductIcon />, requiredRole: 'chemist' },
    { text: "Upload Bills", path: "/upload", icon: <UploadBillIcon />, requiredRole: 'chemist' },
    { text: "Stockists", path: "/stockists", icon: <StockistIcon />, requiredRole: 'chemist' },
    { text: "Orders", path: "/orders", icon: <LocalShippingIcon />, requiredRole: 'chemist' },
  ];

  if (role === ROLE_ENUM.CHEMIST)
    return chemistItems;
  else if (role === ROLE_ENUM.ADMIN)
    return adminItems;
  else {
    return [];
  }
};

const secondaryListItems: MenuItem[] = [
  { text: "Settings", path: "/settings", icon: <SettingsRoundedIcon /> },
  { text: "About", path: "/about", icon: <InfoRoundedIcon /> },
];

export default function MenuContent() {
  const location = useLocation();
  const navigate = useNavigate();
  // const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useSelector((state: RootState) => state.auth);

  // const port = window.location.port;
  // Simulated user role - replace with actual authentication context
  // const [userRole, setUserRole] = useState<'admin' | 'chemist'>('admin');

  // const safePort: '3000' | '3001' = port === '3001' ? '3001' : '3000';
  const mainListItems = createMainListItems(user?.role ?? ROLE_ENUM.NULL);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // const handleLogout = () => {
  //   dispatch(logout());
  //   navigate('/');
  // };

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
                borderRadius: 2,
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

      {/* Logout */}
      {/* <List dense sx={{
        display: "flex",
        mt: 'auto',
        mb: 0
      }}>
        <Tooltip title="Logout" placement="right" arrow>
          <ListItem
            onClick={handleLogout}
            disablePadding
            sx={{
              display: "flex",
              mx: 1,
              mb: 0,
              mt: 'auto',
              transition: 'background-color 0.2s ease',
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            <ListItemButton
              sx={{
                minHeight: 38,
                justifyContent: isSmallScreen ? 'center' : 'initial',
                px: 2.5,
                borderRadius: 2,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isSmallScreen ? 0 : 3,
                  justifyContent: 'center',
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              {!isSmallScreen && <ListItemText primary="Logout" />}
            </ListItemButton>
          </ListItem>
        </Tooltip>
      </List> */}

    </Stack>
  );
}



// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import Stack from "@mui/material/Stack";
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import LocalShippingIcon from '@mui/icons-material/LocalShipping';
// import ChemistIcon from '@mui/icons-material/Store';
// import StockistIcon from '@mui/icons-material/Warehouse';
// import UploadBillIcon from '@mui/icons-material/UploadFile';
// import ProductIcon from '@mui/icons-material/LocalPharmacy';
// import InventoryIcon from "@mui/icons-material/Inventory";
// import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
// import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
// import { useLocation, useNavigate } from "react-router-dom";

// const mainListItems = [
//   { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
//   { text: "Inventory", path: "/inventory", icon: <InventoryIcon /> },
//   { text: "Products", path: "/products", icon: <ProductIcon /> },
//   { text: "Stockists", path: "/stockists", icon: <StockistIcon /> },
//   { text: "Chemists", path: "/chemists", icon: <ChemistIcon /> },
// ];

// const mainListItemsChemist = [
//   { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
//   { text: "Inventory", path: "/inventory", icon: <InventoryIcon /> },
//   { text: "Products", path: "/products", icon: <ProductIcon /> },
//   { text: "Upload Bills", path: "/upload", icon: <UploadBillIcon /> },
//   { text: "Stockists", path: "/stockists", icon: <StockistIcon /> },
//   { text: "Orders", path: "/orders", icon: <LocalShippingIcon /> },
// ]

// const secondaryListItems = [
//   { text: "Settings", path: "/settings", icon: <SettingsRoundedIcon /> },
//   { text: "About", path: "/about", icon: <InfoRoundedIcon /> },
// ];

// export default function MenuContent() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const port = window.location.port;

//   const listItems =port === '3000' ? mainListItems : mainListItemsChemist

//   return (
//     <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
//       <List dense>
//         {listItems.map((item, index) => (
//           <ListItem
//             key={index}
//             onClick={() => {
//               navigate(item.path);
//             }}
//             disablePadding
//             sx={{ display: "block" }}
//           >
//             <ListItemButton selected={location.pathname.includes(item.path)}>
//               <ListItemIcon>{item.icon}</ListItemIcon>
//               <ListItemText primary={item.text} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//       <List dense>
//         {secondaryListItems.map((item, index) => (
//           <ListItem
//             key={index}
//             onClick={() => {
//               navigate(item.path);
//             }}
//             disablePadding
//             sx={{ display: "block" }}
//           >
//             <ListItemButton>
//               <ListItemIcon>{item.icon}</ListItemIcon>
//               <ListItemText primary={item.text} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//     </Stack>
//   );
// }
