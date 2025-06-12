import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Divider,
  // IconButton,
  useTheme,
  // Tooltip,
  alpha,
  Grid,
  Stack,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tabs,
  Tab,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import {
  useColorScheme,
} from "@mui/material/styles";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  // Language as WebsiteIcon,
  SecurityOutlined,
  // Check,
  Settings,
  Person,
  AccessTime,
  Share,
  Download,
  Refresh,
  ContactSupport,
  DeleteForever,
  Password,
  // AddLocation,
  BusinessSharp,
  // AccountBalance,
  // BadgeOutlined,
  // AddBusiness,
  Palette,
  Brightness4,
  Brightness7,
  NotificationsActive,
  Print,
  ShoppingBagOutlined,
  SellOutlined,
  Summarize,
  NotificationAdd,
  Colorize,
  Inventory,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import EditUserModal from "@/features/profile/EditUserModal";
import { getCurrentUser } from "@/services/auth";
import { getAllCompanies, getCompany } from "@/services/company";
import { formatDatewithTime } from "@/utils/functions";
import CompanyEditingModal from "@/common/CompanyEditingModal";
import { InfoRow } from "@/common/InfoRow";
import { SettingsCard } from "@/common/SettingsCard";
import { ProfileHeader } from "@/common/ProfileHeader";
// import BillingEditingModal from "@/common/BillingEditingModal";
// import ShippingEditingModal from "@/common/ShippingEditingModal";
// import { ENUM_ENTITY } from "@/utils/enums";
import { CompanyRow } from "@/common/CompanyRow";
import { GetCompany } from "@/utils/types";

// Main Enhanced Component
const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { mode, setMode } = useColorScheme();

  const { user } = useSelector((state: RootState) => state.auth)
  const { company, companies } = useSelector((state: RootState) => state.company)

  const [isUserEditing, setIsUserEditing] = useState(false);
  const [isCompanyEditing, setIsCompanyEditing] = useState(false);
  // const [isBillingEditing, setIsBillingEditing] = useState(false);
  // const [isShippingEditing, setIsShippingEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  // const [notifications, setNotifications] = useState({
  //   email: true,
  //   push: false,
  //   sms: true,
  // });
  const [tabValue, setTabValue] = useState(0);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  const speedDialActions = [
    { icon: <Download />, name: 'Download Profile', action: () => console.log('Download') },
    { icon: <Share />, name: 'Share Profile', action: () => console.log('Share') },
    { icon: <Refresh />, name: 'Refresh Data', action: () => console.log('Refresh') },
    { icon: <ContactSupport />, name: 'Get Help', action: () => console.log('Help') },
  ];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {

    setTabValue(newValue);
  };


  const handleDelete = (company_id: string) => {
    // dispatch(
    //   deleteProduct(productId)
    // )
    //   .unwrap()
    //   .then(() => {
    //     setRefreshKey((prev) => prev + 1);
    //     setLoading(false);
    //     toast.success('Product deleted successfully')
    //   });
  };

  const handleEdit = (company: GetCompany) => {
    // setDrawer(true);
    // setSelectedProduct(product);
  };

  const handleView = (company: GetCompany) => {
    // navigate(`/products/${product._id}`);
  };


  const fetchUserData = () => {
    dispatch(getCurrentUser());
  }
  const fetchCompanyData = () => {
    dispatch(getCompany());
  }

  const fetchCompleteData = () => {
    fetchUserData();
    fetchCompanyData();
  }

  React.useEffect(() => {
    dispatch(getAllCompanies());
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.08)} 0%, ${alpha(theme.palette.secondary.light, 0.04)} 100%)`,
        overflow: "hidden",
        width: "100%",
      }}
    >
      <Container sx={{ position: "relative", width: '100%', zIndex: 1, py: 4 }}>
        <Stack spacing={2}>

          {/* Enhanced Profile Header */}
          <ProfileHeader
            user={user}
            onEditToggle={() => {
              setIsUserEditing(!isUserEditing);
            }}
          />

          {/* Tab Navigation */}
          <Paper
            elevation={0}
            sx={{
<<<<<<< HEAD
              borderRadius: 1,
=======
              borderRadius: 3,
>>>>>>> 5c5a27c4386cee0a00ece93aada65cbc238ee637
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: "blur(20px)",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": {
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1rem",
                  py: 2,
                },
              }}
            >
              <Tab label="Personal Info" icon={<Person />} iconPosition="start" />
              <Tab label="Company Info" icon={<BusinessSharp />} iconPosition="start" />
              <Tab label="Templates" icon={<Print />} iconPosition="start" />
              <Tab label="Preferences" icon={<Settings />} iconPosition="start" />
            </Tabs>
          </Paper>

          {/* Tab Content */}
          {tabValue === 0 && (
            <Grid container gap={2} sx={{ mt: 2 }}>
              {/* Contact Information */}
              <Grid item xs={12} lg={4}>
                <SettingsCard title="Contact Information" icon={<EmailIcon />}>
                  <Stack spacing={2}>
                    <InfoRow
                      icon={<EmailIcon />}
                      label="Email Address"
                      value={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {user?.email}
                        </Box>
                      }
                    // badge={1}
                    />
                    <InfoRow
                      icon={<PhoneIcon />}
                      label="Phone Number"
                      value={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {user?.phone?.code || ''} {" "}
                          {user?.phone?.number || 'Not provided'}
                        </Box>
                      }
                    />
                    <InfoRow
                      icon={<AccessTime />}
                      label="Member Since"
                      value={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {formatDatewithTime(user?.created_at ?? '')}
                        </Box>
                      }
                    />
                  </Stack>
                </SettingsCard>
              </Grid>

              {/* Password & Security */}
              <Grid item xs={12} lg={7} >
                <SettingsCard title="Password & Security" icon={<SecurityOutlined />}>
                  <Stack spacing={3} sx={{ p: 1 }}>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          fontWeight: 600,
                          textDecoration: "underline",
                          textUnderlineOffset: "4px",
                        }}
                      >
                        Change Password
                      </Typography>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 1,
                          bgcolor: mode === 'light' ? alpha(theme.palette.success.main, 0.05) : alpha(theme.palette.success.light, 0.1),
                          border: `1px solid ${alpha(theme.palette.success.main, 0.5)}`,
                        }}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center">
                            <Box
                              sx={{
                                p: 1,
                                borderRadius: 1,
                                bgcolor: mode === 'light' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.success.light, 0.1),
                                color: mode === 'light' ? theme.palette.success.main : theme.palette.success.light,
                                mr: 2,
                              }}
                            >
                              <Password />
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                Want to Change Your Password?
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Update your password to keep your account secure.
                              </Typography>
                            </Box>
                          </Box>
                          <Box display="flex" alignItems="center" justifyContent="center" >
                            <Button
                              variant="contained"
                              color="success"
                              // onClick={onEditToggle}
                              startIcon={<Password />}
                              sx={{
                                background: mode === 'light' ? alpha(theme.palette.success.main, 0.5) : alpha(theme.palette.success.light, 0.5),
                                "&:hover": {
                                  background: mode === 'light' ? alpha(theme.palette.success.main, 1) : alpha(theme.palette.success.light, 1),
                                },
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                px: 3,
                              }}
                            >
                              Change
                            </Button>
                          </Box>
                        </Box>
                      </Paper>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          fontWeight: 600,
                          color: theme.palette.error.light,
                          textDecoration: "underline",
                          textUnderlineOffset: "4px",
                        }}
                      >
                        Danger Zone
                      </Typography>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 1,
                          bgcolor: alpha(theme.palette.error.light, 0.05),
                          border: `1px solid ${alpha(theme.palette.error.light, 0.2)}`,
                        }}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center">
                            <Box
                              sx={{
                                p: 1,
                                borderRadius: 1,
                                bgcolor: alpha(theme.palette.error.light, 0.1),
                                color: theme.palette.error.light,
                                mr: 1,
                              }}
                            >
                              <DeleteForever />
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                Want to Delete Your Account Permanently?
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Your request will be processed within 5-7 business days.
                              </Typography>
                            </Box>
                          </Box>
                          <Box display="flex" alignItems="center" justifyContent="center" >
                            <Button
                              variant="contained"
                              color="error"
                              // onClick={onEditToggle}
                              startIcon={<DeleteForever />}
                              sx={{
                                background: alpha(theme.palette.error.light, 0.5),
                                "&:hover": {
                                  background: alpha(theme.palette.error.light, 1),
                                },
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                px: 3,
                              }}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Box>
                      </Paper>
                    </Box>
                  </Stack>
                </SettingsCard>
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            (companies.length < 1) ? (
              <Box sx={{ width: '100%', p: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                  No company data found.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Please create your first company profile to get started.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsCompanyEditing(true)}
                >
                  Create Company
                </Button>
              </Box>
            ) : (
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  width: '100%',
<<<<<<< HEAD
                  borderRadius: 1,
=======
                  borderRadius: 3,
>>>>>>> 5c5a27c4386cee0a00ece93aada65cbc238ee637
                  border: `1px solid ${alpha(theme.palette.divider, 1)}`,
                  boxShadow: `0 4px 20px ${alpha('#000', 0.05)}`,
                  // overflow: 'hidden',
                }}
              >
                <Table sx={{ width: '100%' }}>
                  <TableHead>
                    <TableRow
                      sx={{
                        bgcolor: alpha(theme.palette.grey[50], 0.8),
                        width: '100%',
                        '& .MuiTableCell-head': {
                          borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        }
                      }}
                    >
                      <TableCell sx={{ pl: 3, pr: 1 }}>
                        <Tooltip title="Sort by Product Name" arrow>
                          <TableSortLabel
                          // active={sortBy === "product_name"}
                          // direction={sortBy === "product_name" ? sortOrder : "asc"}
                          // onClick={() => {
                          //   setData((prevState) => ({
                          //     ...prevState,
                          //     sortBy: "product_name",
                          //     sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                          //   }));
                          // }}
                          >
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                              Product Information
                            </Typography>
                          </TableSortLabel>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center" sx={{ px: 1 }}>
                        <Tooltip title="Sort by Item Quantity" arrow>
                          <TableSortLabel
                          // active={sortBy === "opening_quantity"}
                          // direction={sortBy === "opening_quantity" ? sortOrder : "asc"}
                          // onClick={() => {
                          //   setData((prevState) => ({
                          //     ...prevState,
                          //     sortBy: "opening_quantity",
                          //     sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                          //   }));
                          // }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <Inventory fontSize="small" />
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                                Opening Stock Status
                              </Typography>
                            </Box>
                          </TableSortLabel>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right" sx={{ px: 1 }}>
                        <Tooltip title="Sort by Bar-Code" arrow>
                          <TableSortLabel
                          // active={sortBy === "barcode"}
                          // direction={sortBy === "barcode" ? sortOrder : "asc"}
                          // onClick={() => {
                          //   setData((prevState) => ({
                          //     ...prevState,
                          //     sortBy: "barcode",
                          //     sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                          //   }));
                          // }}
                          >
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                              Bar-Code
                            </Typography>
                          </TableSortLabel>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right" sx={{ px: 1 }}>
                        <Tooltip title="Sort by Selling Price" arrow>
                          <TableSortLabel
                          // active={sortBy === "selling_price"}
                          // direction={sortBy === "selling_price" ? sortOrder : "asc"}
                          // onClick={() => {
                          //   setData((prevState) => ({
                          //     ...prevState,
                          //     sortBy: "selling_price",
                          //     sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                          //   }));
                          // }}
                          >
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                              Selling Price
                            </Typography>
                          </TableSortLabel>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right" sx={{ px: 1 }}>
                        <Tooltip title="Sort by Purchase Price" arrow>
                          <TableSortLabel
                          // active={sortBy === "purchase_price"}
                          // direction={sortBy === "purchase_price" ? sortOrder : "asc"}
                          // onClick={() => {
                          //   setData((prevState) => ({
                          //     ...prevState,
                          //     sortBy: "purchase_price",
                          //     sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                          //   }));
                          // }}
                          >
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                              Purchase Price
                            </Typography>
                          </TableSortLabel>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center" >
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                          Actions
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(Array.isArray(companies) ? companies : []).map((com, index) => (
                      <CompanyRow
                        key={com._id}
                        com={com}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        onView={handleView}
                        index={index}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              // <Grid container gap={2} sx={{ mt: 2 }}>
              //   <Grid item xs={12} lg={4}>
              //     <SettingsCard title="Company Information" icon={<BusinessSharp />}>
              //       <Stack spacing={2}>
              //         <InfoRow
              //           icon={<EmailIcon />}
              //           label="Email Address"
              //           value={
              //             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              //               {company?.email || 'Not provided'}
              //             </Box>
              //           }
              //         />
              //         <InfoRow
              //           icon={<PhoneIcon />}
              //           label="Phone Number"
              //           value={
              //             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              //               {company?.phone?.code || ''} {" "}
              //               {company?.phone?.number || 'Not provided'}
              //             </Box>
              //           }
              //         />
              //         <InfoRow
              //           icon={<AccountBalance />}
              //           label="GST Number"
              //           value={
              //             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              //               {company?.gstin || 'Not provided'}
              //             </Box>
              //           }
              //         />
              //         <InfoRow
              //           icon={<BadgeOutlined />}
              //           label="PAN Number"
              //           value={
              //             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              //               {company?.pan_number || 'Not provided'}
              //             </Box>
              //           }
              //         />
              //         <InfoRow
              //           icon={<WebsiteIcon />}
              //           label="Website"
              //           value={
              //             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              //               {company?.website || 'Not provided'}
              //             </Box>
              //           }
              //         />
              //         <InfoRow
              //           icon={<AccessTime />}
              //           label="Member Since"
              //           value={
              //             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              //               {formatDatewithTime(company?.created_at ?? '')}
              //             </Box>
              //           }
              //         />
              //       </Stack>
              //     </SettingsCard>
              //   </Grid>
              //   <Grid item xs={12} lg={7}>
              //     <SettingsCard title="Address Details" icon={<AddLocation />}>
              //       <Stack spacing={3} sx={{ p: 1 }}>
              //         <Box>
              //           <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "4px" }}>
              //             Billing Address
              //           </Typography>
              //           <Paper elevation={0} sx={{ p: 3, borderRadius: 1, bgcolor: mode === 'light' ? alpha(theme.palette.success.main, 0.05) : alpha(theme.palette.success.light, 0.1), border: `1px solid ${alpha(theme.palette.success.main, 0.5)}` }}>
              //             {
              //               company?.billing ? (
              //                 <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              //                   {company.billing.address_1
              //                     ? company.billing.address_1
              //                     : <span style={{ color: '#aaa' }}>Address 1 not provided</span>}
              //                   {company.billing.address_2
              //                     ? `, ${company.billing.address_2}`
              //                     : ''}
              //                   {company.billing.city
              //                     ? `, ${company.billing.city}`
              //                     : ''}
              //                   {company.billing.state
              //                     ? `, ${company.billing.state}`
              //                     : ''}
              //                   {company.billing.country
              //                     ? `, ${company.billing.country}`
              //                     : ''}
              //                   {company.billing.pinCode
              //                     ? ` - ${company.billing.pinCode}`
              //                     : ''}
              //                   {
              //                     !company.billing.address_1 &&
              //                     !company.billing.address_2 &&
              //                     !company.billing.city &&
              //                     !company.billing.state &&
              //                     !company.billing.country &&
              //                     !company.billing.pinCode && (
              //                       <span style={{ color: '#aaa' }}>No billing address provided</span>
              //                     )
              //                   }
              //                 </Typography>
              //               ) : (
              //                 <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#aaa' }}>
              //                   No billing address provided
              //                 </Typography>
              //               )
              //             }
              //             <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
              //               <Box display="flex" alignItems="center">
              //                 <Box
              //                   sx={{
              //                     p: 1,
              //                     borderRadius: 1,
              //                     bgcolor: mode === 'light' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.success.light, 0.1),
              //                     color: mode === 'light' ? theme.palette.success.main : theme.palette.success.light,
              //                     mr: 2,
              //                   }}
              //                 >
              //                   <AddBusiness />
              //                 </Box>
              //                 <Box>
              //                   <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              //                     Want to Change Your Billing Address?
              //                   </Typography>
              //                   <Typography variant="caption" color="text.secondary">
              //                     Update your billing address to ensure accurate invoicing.
              //                   </Typography>
              //                 </Box>
              //               </Box>
              //               <Box display="flex" alignItems="center" justifyContent="center" >
              //                 <Button
              //                   variant="contained"
              //                   color="success"
              //                   onClick={() => setIsBillingEditing(true)}
              //                   startIcon={<AddBusiness />}
              //                   sx={{
              //                     background: mode === 'light' ? alpha(theme.palette.success.main, 0.5) : alpha(theme.palette.success.light, 0.5),
              //                     "&:hover": {
              //                       background: mode === 'light' ? alpha(theme.palette.success.main, 1) : alpha(theme.palette.success.light, 1),
              //                     },
              //                     fontWeight: 600,
              //                     whiteSpace: "nowrap",
              //                     px: 3,
              //                   }}
              //                 >
              //                   Change
              //                 </Button>
              //               </Box>
              //             </Box>
              //           </Paper>
              //         </Box>

              //         <Divider sx={{ my: 1 }} />

              //         <Box>
              //           <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "4px" }}>
              //             Shipping Address
              //           </Typography>
              //           <Paper elevation={0} sx={{ p: 3, borderRadius: 1, bgcolor: mode === 'light' ? alpha(theme.palette.secondary.main, 0.05) : alpha(theme.palette.secondary.light, 0.1), border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}` }}>
              //             <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              //               {company?.shipping?.title ? company?.shipping?.title : 'No Shipping Title Provided'}
              //             </Typography>
              //             {
              //               company?.shipping ? (
              //                 <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              //                   {company.shipping.address_1
              //                     ? company.shipping.address_1
              //                     : <span style={{ color: '#aaa' }}>Address 1 not provided</span>}
              //                   {company.shipping.address_2
              //                     ? `, ${company.shipping.address_2}`
              //                     : ''}
              //                   {company.shipping.city
              //                     ? `, ${company.shipping.city}`
              //                     : ''}
              //                   {company.shipping.state
              //                     ? `, ${company.shipping.state}`
              //                     : ''}
              //                   {company.shipping.country
              //                     ? `, ${company.shipping.country}`
              //                     : ''}
              //                   {company.shipping.pinCode
              //                     ? ` - ${company.shipping.pinCode}`
              //                     : ''}
              //                   {
              //                     !company.shipping.address_1 &&
              //                     !company.shipping.address_2 &&
              //                     !company.shipping.city &&
              //                     !company.shipping.state &&
              //                     !company.shipping.country &&
              //                     !company.shipping.pinCode && (
              //                       <span style={{ color: '#aaa' }}>No shipping address provided</span>
              //                     )
              //                   }
              //                 </Typography>
              //               ) : (
              //                 <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#aaa' }}>
              //                   No shipping address provided
              //                 </Typography>
              //               )
              //             }
              //             <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
              //               <Box display="flex" alignItems="center">
              //                 <Box
              //                   sx={{
              //                     p: 1,
              //                     borderRadius: 1,
              //                     bgcolor: mode === 'light' ? alpha(theme.palette.secondary.main, 0.1) : alpha(theme.palette.secondary.light, 0.1),
              //                     color: mode === 'light' ? theme.palette.secondary.main : theme.palette.secondary.light,
              //                     mr: 2,
              //                   }}
              //                 >
              //                   <AddBusiness />
              //                 </Box>
              //                 <Box>
              //                   <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              //                     Want to Change Your Shipping Address?
              //                   </Typography>
              //                   <Typography variant="caption" color="text.secondary">
              //                     Update your shipping address to ensure timely deliveries.
              //                   </Typography>
              //                 </Box>
              //               </Box>
              //               <Box display="flex" alignItems="center" justifyContent="center" >
              //                 <Button
              //                   variant="contained"
              //                   color="secondary"
              //                   onClick={() => setIsShippingEditing(true)}
              //                   startIcon={<AddBusiness />}
              //                   sx={{
              //                     background: mode === 'light' ? alpha(theme.palette.secondary.main, 0.5) : alpha(theme.palette.secondary.light, 0.5),
              //                     "&:hover": {
              //                       background: mode === 'light' ? alpha(theme.palette.secondary.main, 1) : alpha(theme.palette.secondary.light, 1),
              //                     },
              //                     fontWeight: 600,
              //                     whiteSpace: "nowrap",
              //                     px: 3,
              //                   }}
              //                 >
              //                   Change
              //                 </Button>
              //               </Box>
              //             </Box>
              //           </Paper>
              //         </Box>
              //       </Stack>
              //     </SettingsCard>
              //   </Grid>
              // </Grid>
            ))}

          {tabValue === 2 && (
            <Grid container justifyContent={'space-between'} >
              {/* Sales Template */}
              <Grid item xs={12} lg={5.8}>
                <SettingsCard title="Sales Template Information" icon={<SellOutlined />}>
                  <Stack spacing={2}>
                    <InfoRow
                      icon={<Summarize />}
                      label="Comming Soon"
                      value={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          Template features will be available soon.
                        </Box>
                      }
                    // badge={1}
                    />
                    {/* <InfoRow
                      icon={<PhoneIcon />}
                      label="Phone Number"
                      value={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {user?.phone?.code || ''} {" "}
                          {user?.phone?.number || 'Not provided'}
                        </Box>
                      }
                    />
                    <InfoRow
                      icon={<AccessTime />}
                      label="Member Since"
                      value={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {formatDatewithTime(user?.created_at ?? '')}
                        </Box>
                      }
                    /> */}
                  </Stack>
                </SettingsCard>
              </Grid>

              {/* Purchase Template */}
              <Grid item xs={12} lg={5.8}>
                <SettingsCard title="Purchase Template Information" icon={<ShoppingBagOutlined />}>
                  <Stack spacing={2}>
                    <InfoRow
                      icon={<Summarize />}
                      label="Comming Soon"
                      value={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          Template features will be available soon.
                        </Box>
                      }
                    // badge={1}
                    />
                    {/* <InfoRow
                      icon={<PhoneIcon />}
                      label="Phone Number"
                      value={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {user?.phone?.code || ''} {" "}
                          {user?.phone?.number || 'Not provided'}
                        </Box>
                      }
                    />
                    <InfoRow
                      icon={<AccessTime />}
                      label="Member Since"
                      value={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {formatDatewithTime(user?.created_at ?? '')}
                        </Box>
                      }
                    /> */}
                  </Stack>
                </SettingsCard>
              </Grid>
            </Grid>
          )}

          {tabValue === 3 && (
            <Grid container justifyContent={'space-between'}>
              {/* Notification Preferences */}
              <Grid item xs={12} lg={5.8}>
                <SettingsCard title="Notification Preferences" icon={<NotificationsActive />}>
                  <Stack spacing={3}>
                    <InfoRow
                      icon={<NotificationAdd />}
                      label="Comming Soon"
                      value={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          Notification features will be available soon.
                        </Box>
                      }
                    // badge={1}
                    />
                    {/* {Object.entries(notifications).map(([key, value]) => (
                      <Box key={key}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={value}
                              // onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                              color="primary"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                                {key} Notifications
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Receive notifications via {key}
                              </Typography>
                            </Box>
                          }
                          sx={{ width: '100%', margin: 0 }}
                        />
                        <Divider sx={{ mt: 2 }} />
                      </Box>
                    ))} */}
                  </Stack>
                </SettingsCard>
              </Grid>

              {/* Theme Preferences */}
              <Grid item xs={12} lg={5.8}>
                <SettingsCard title="Appearance" icon={<Palette />}>
                  <Stack spacing={3}>
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={darkMode}
                            onChange={(e) => {
                              setDarkMode(e.target.checked);
                              if (e.target.checked) {
                                setMode('dark');
                              }
                              else {
                                setMode('light');
                              }
                            }}
                            color="primary"
                          />
                        }
                        label={
                          <Box display="flex" alignItems="center" gap={1}>
                            {darkMode ? <Brightness4 /> : <Brightness7 />}
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                Dark Mode
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Switch between light and dark themes
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{ width: '100%', margin: 0 }}
                      />
                    </Box>

                    <Divider />

                    <InfoRow
                      icon={<Colorize />}
                      label="Comming Soon"
                      value={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          Color Themes features will be available soon.
                        </Box>
                      }
                    // badge={1}
                    />
                    {/* <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Color Themes
                      </Typography>
                      <Grid container spacing={2}>
                        {[
                          { name: 'Blue', color: '#1976d2' },
                          { name: 'Green', color: '#388e3c' },
                          { name: 'Purple', color: '#7b1fa2' },
                          { name: 'Orange', color: '#f57c00' },
                        ].map((themeColor, index) => (
                          <Grid item xs={3} key={index}>
                            <Tooltip title={themeColor.name}>
                              <IconButton
                                sx={{
                                  width: 48,
                                  height: 48,
                                  bgcolor: themeColor.color,
                                  border: index === 0 ? `3px solid ${theme.palette.primary.main}` : 'none',
                                  "&:hover": {
                                    bgcolor: themeColor.color,
                                    transform: 'scale(1.1)',
                                  }
                                }}
                              >
                                {index === 0 && <Check sx={{ color: 'white' }} />}
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        ))}
                      </Grid>
                    </Box> */}
                  </Stack>
                </SettingsCard>
              </Grid>
            </Grid>
          )}
        </Stack>

        {/* Floating Action Button */}
        <SpeedDial
          ariaLabel="Profile Actions"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          icon={<SpeedDialIcon />}
          open={speedDialOpen}
          onClose={() => setSpeedDialOpen(false)}
          onOpen={() => setSpeedDialOpen(true)}
        >
          {speedDialActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => {
                action.action();
                setSpeedDialOpen(false);
              }}
            />
          ))}
        </SpeedDial>


      </Container>
      <EditUserModal
        open={isUserEditing}
        onClose={() => {
          setIsUserEditing(false);
        }}
        user={user}
        onUpdated={async () => {
          fetchCompleteData();
        }}
      />
      <CompanyEditingModal
        open={isCompanyEditing}
        onClose={() => {
          setIsCompanyEditing(false);
        }}
        company={company}
        onUpdated={async () => {
          fetchCompleteData();
        }}
      />
      {/* <BillingEditingModal
        entity_id={company?._id || ''}
        entity_type={ENUM_ENTITY.COMPANY}
        open={isBillingEditing}
        onClose={() => {
          setIsBillingEditing(false);
        }}
        billing={company?.billing ?? null}
        onUpdated={async () => {
          fetchCompleteData();
        }}
      />
      <ShippingEditingModal
        open={isShippingEditing}
        onClose={() => {
          setIsShippingEditing(false);
        }}
        entity_type={ENUM_ENTITY.COMPANY}
        shipping={company?.shipping ?? null}
        entity_id={company?._id || ''}
        onUpdated={async () => {
          fetchCompleteData();
        }}
      /> */}
    </Box>
  );
};

export default ProfilePage;