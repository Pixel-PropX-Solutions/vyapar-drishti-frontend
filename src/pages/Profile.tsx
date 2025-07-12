import React, { useCallback, useState } from "react";
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
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  useColorScheme,
} from "@mui/material/styles";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  SecurityOutlined,
  Settings,
  Person,
  AccessTime,
  DeleteForever,
  Password,
  BusinessSharp,
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
  Contacts,
  Tune,
  Delete,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import EditUserModal from "@/features/profile/EditUserModal";
import { deleteAccount, getCurrentUser } from "@/services/auth";
import { deleteCompany, getAllCompanies } from "@/services/company";
import { formatDatewithTime } from "@/utils/functions";
import CompanyEditingModal from "@/common/CompanyEditingModal";
import { InfoRow } from "@/common/InfoRow";
import { SettingsCard } from "@/common/SettingsCard";
import { ProfileHeader } from "@/common/ProfileHeader";
import { CompanyRow } from "@/common/CompanyRow";
import { GetCompany } from "@/utils/types";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Main Enhanced Component
const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { mode, setMode } = useColorScheme();

  const { user } = useSelector((state: RootState) => state.auth)
  const { companies } = useSelector((state: RootState) => state.company)

  const [isUserEditing, setIsUserEditing] = useState(false);
  const [isCompanyEditing, setIsCompanyEditing] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null as GetCompany | null);
  const [darkMode, setDarkMode] = useState(false);
  // const [notifications, setNotifications] = useState({
  //   email: true,
  //   push: false,
  //   sms: true,
  // });
  const [tabValue, setTabValue] = useState(0);


  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {

    setTabValue(newValue);
  };

  const confirmDelete = () => {
    handleDeleteAccount();
    setOpenDeleteDialog(false);
  };

  const handleDelete = (company_id: string) => {
    dispatch(
      deleteCompany(company_id)
    )
      .unwrap()
      .then(() => {
        fetchCompleteData();
        toast.success('Company deleted successfully')
      });
  };

  const handleDeleteAccount = () => {
    dispatch(
      deleteAccount()
    )
      .unwrap()
      .then(() => {
        // dispatch(getCurrentUser());
        toast.success('Account deleted successfully')
      });
  };

  const handleEdit = (company: GetCompany) => {
    setIsCompanyEditing(true);
    setEditingCompany(company);
  };

  const handleView = (company: GetCompany) => {
    navigate(`/company/${company._id}`);
  };


  const fetchUserData = () => {
    dispatch(getCurrentUser());
  }

  const fetchCompanyData = useCallback(() => {
    dispatch(getAllCompanies());
  }, [dispatch])



  const fetchCompleteData = () => {
    fetchUserData();
    fetchCompanyData();
  }

  React.useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  const currentCompanyDetails = user?.company?.find((c: any) => c._id === user.user_settings.current_company_id);

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
              borderRadius: 1,
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
              <Tab label="Preferences" icon={<Tune />} iconPosition="start" />
              <Tab label="Settings" icon={<Settings />} iconPosition="start" />
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
                              onClick={() => setOpenDeleteDialog(true)}
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
                  borderRadius: 1,
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
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                          Company Information
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ px: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <Contacts fontSize="small" />
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                            Contact Information
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ px: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                          Financial Year
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ px: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                          Legal Information
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ px: 1 }}>
                        <Tooltip title="Sort by Date Created" arrow>
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
                              Created on
                            </Typography>
                          </TableSortLabel>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center" >
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                          Company Actions
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

          {tabValue === 4 && (
            <Grid container justifyContent={'space-between'}>
              {/* Account Settings */}
              <Grid item xs={12} lg={5.8}>
                <SettingsCard title="Account Settings" icon={<Person />}>
                  <Stack spacing={3}>
                    {/* User Type */}
                    <InfoRow
                      icon={<Person />}
                      label="Account Type"
                      value={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Paper
                            elevation={0}
                            sx={{
                              px: 2,
                              // py: 0.5,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: theme.palette.primary.main,
                                textTransform: 'capitalize'
                              }}
                            >
                              {user?.user_type || 'User'}
                            </Typography>
                          </Paper>
                        </Box>
                      }

                    />

                    <Divider />

                    {/* Permissions */}
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Permissions
                      </Typography>
                      <Stack spacing={2}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={user?.user_settings?.permissions?.create_vouchers || false}
                              disabled
                              color="primary"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                Create Vouchers
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Permission to create and manage vouchers
                              </Typography>
                            </Box>
                          }
                          sx={{ width: '100%', margin: 0 }}
                        />
                      </Stack>
                    </Box>

                    <Divider />

                    {/* Last Login Information */}
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Session Information
                      </Typography>
                      <Stack spacing={1.5}>
                        <InfoRow
                          icon={<AccessTime />}
                          label="Last Login"
                          value={
                            <Typography variant="body2">
                              {user?.user_settings?.last_login
                                ? formatDatewithTime(user.user_settings.last_login.toString())
                                : 'Never'
                              }
                            </Typography>
                          }
                        />
                        <InfoRow
                          icon={<PhoneIcon />}
                          label="Device"
                          value={
                            <Typography variant="body2">
                              {user?.user_settings?.last_login_device || 'Unknown'}
                            </Typography>
                          }
                        />
                        <InfoRow
                          icon={<SecurityOutlined />}
                          label="IP Address"
                          value={
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {user?.user_settings?.last_login_ip || 'Unknown'}
                            </Typography>
                          }
                        />
                      </Stack>
                    </Box>
                  </Stack>
                </SettingsCard>
              </Grid>

              {/* Company Settings */}
              <Grid item xs={12} lg={5.8}>
                <SettingsCard title="Company Settings" icon={<BusinessSharp />}>
                  <Stack spacing={3}>
                    {/* Current Company */}
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Current Company
                      </Typography>
                      {currentCompanyDetails ? (
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2.5,
                            borderRadius: 1,
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={2}>
                            {currentCompanyDetails?.image && (
                              <Box
                                component="img"
                                src={currentCompanyDetails?.image}
                                alt="Company Logo"
                                sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: 1,
                                  objectFit: 'cover',
                                  border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                }}
                              />
                            )}
                            <Box flex={1}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {currentCompanyDetails?.company_name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {currentCompanyDetails?.state}, {currentCompanyDetails?.country}
                              </Typography>
                            </Box>
                            <Paper
                              elevation={0}
                              sx={{
                                px: 1.5,
                                py: 0.5,
                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                                borderRadius: 1,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: theme.palette.success.main,
                                  fontWeight: 600,
                                }}
                              >
                                CHANGE
                              </Typography>
                            </Paper>
                          </Box>
                        </Paper>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No company selected or Created yet.
                        </Typography>
                      )}
                    </Box>

                    <Divider />

                    {/* Company Features */}
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Features
                      </Typography>
                      <Stack spacing={2}>
                        {currentCompanyDetails?.company_settings ? (
                          <>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={currentCompanyDetails?.company_settings?.features?.enable_gst || false}
                                  disabled
                                  color="primary"
                                />
                              }
                              label={
                                <Box>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    GST Management
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Tax calculation and GST return filing
                                  </Typography>
                                </Box>
                              }
                              sx={{ width: '100%', margin: 0 }}
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={currentCompanyDetails?.company_settings?.features?.enable_inventory || false}
                                  disabled
                                  color="primary"
                                />
                              }
                              label={
                                <Box>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    Inventory Management
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Stock tracking and inventory control
                                  </Typography>
                                </Box>
                              }
                              sx={{ width: '100%', margin: 0 }}
                            />
                          </>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Please create or select a company from the list.
                          </Typography>
                        )}
                      </Stack>
                    </Box>

                    <Divider />

                    {/* Financial Info */}
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Financial Info
                      </Typography>
                      {currentCompanyDetails ? (
                        <Stack spacing={1.5}>
                          {currentCompanyDetails?.company_settings?.gst_details?.gstin && (
                            <InfoRow
                              icon={<SecurityOutlined />}
                              label="GSTIN"
                              value={
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                  {currentCompanyDetails?.company_settings?.gst_details?.gstin}
                                </Typography>
                              }
                            />
                          )}
                          {currentCompanyDetails?.company_settings?.books_start_date && (
                            <InfoRow
                              icon={<AccessTime />}
                              label="Books Start Date"
                              value={
                                <Typography variant="body2">
                                  {currentCompanyDetails?.company_settings?.books_start_date
                                    ? formatDatewithTime(currentCompanyDetails?.company_settings?.books_start_date.toString() || '')
                                    : 'Not Set'
                                  }
                                </Typography>
                              }
                            />
                          )}
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No company selected or Created yet.
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </SettingsCard>
              </Grid>

              {/* Data Management */}
              <Grid item xs={12}>
                <SettingsCard title="Data Management" icon={<Settings />}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 1,
                          bgcolor: alpha(theme.palette.info.main, 0.05),
                          border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                        }}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center">
                            <Box
                              sx={{
                                p: 1,
                                borderRadius: 1,
                                bgcolor: alpha(theme.palette.info.main, 0.1),
                                color: theme.palette.info.main,
                                mr: 2,
                              }}
                            >
                              <Print />
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                Export Data
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Download your account and company data
                              </Typography>
                            </Box>
                          </Box>
                          <Button
                            variant="contained"
                            color="info"
                            disabled
                            // startIcon={<Print />}
                            sx={{
                              background: alpha(theme.palette.info.main, 0.8),
                              cursor: 'not-allowed',
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                              px: 3,
                            }}
                          >
                            Available Soon
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 1,
                          bgcolor: alpha(theme.palette.warning.main, 0.05),
                          border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                        }}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center">
                            <Box
                              sx={{
                                p: 1,
                                borderRadius: 1,
                                bgcolor: alpha(theme.palette.warning.main, 0.1),
                                color: theme.palette.warning.main,
                                mr: 2,
                              }}
                            >
                              <Settings />
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                Reset Settings
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Reset all preferences to default values
                              </Typography>
                            </Box>
                          </Box>
                          <Button
                            variant="contained"
                            color="warning"
                            startIcon={<Settings />}
                            sx={{
                              background: alpha(theme.palette.warning.main, 0.8),
                              "&:hover": {
                                background: theme.palette.warning.main,
                              },
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                              px: 3,
                            }}
                          >
                            Reset
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </SettingsCard>
              </Grid>
            </Grid>
          )}
        </Stack>

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
        company={editingCompany}
        onUpdated={async () => {
          fetchCompleteData();
        }}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="delete-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: 1,
            boxShadow: `0 24px 50px ${alpha(theme.palette.error.main, 0.2)}`,
          }
        }}
      >
        <DialogTitle
          id="delete-dialog-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            color: theme.palette.error.main,
            fontWeight: 600,
          }}
        >
          <Delete />
          Delete Account
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. All data related to your account will be permanently deleted, including your companies, settings, and preferences.
            <br />
            Please ensure you have backed up any important information before proceeding.
          </Alert>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone.
            <br />
            <strong>Note:</strong> You will lose access to all your companies and their data.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            sx={{ borderRadius: 2 }}
            startIcon={<Delete />}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;