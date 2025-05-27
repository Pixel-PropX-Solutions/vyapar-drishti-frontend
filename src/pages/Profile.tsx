import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Divider,
  IconButton,
  useTheme,
  Tooltip,
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
} from "@mui/material";
import {
  useColorScheme,
} from "@mui/material/styles";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  SecurityOutlined,
  Check,
  Settings,
  Person,
  Shield,
  AccessTime,
  Share,
  Download,
  Refresh,
  ContactSupport,
  DeleteForever,
  Password,
  AddLocation,
  BusinessSharp,
  AccountBalance,
  BadgeOutlined,
  AddBusiness,
  Palette,
  Brightness4,
  Brightness7,
  NotificationsActive,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import EditUserModal from "@/features/profile/EditUserModal";
import { getCurrentUser } from "@/services/auth";
import { getCompany } from "@/services/company";
import { formatDatewithTime } from "@/utils/functions";
import CompanyEditingModal from "@/common/CompanyEditingModal";
import { InfoRow } from "@/common/InfoRow";
import { SettingsCard } from "@/common/SettingsCard";
import { ProfileHeader } from "@/common/ProfileHeader";

// Main Enhanced Component
const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { mode, setMode } = useColorScheme();

  const { user } = useSelector((state: RootState) => state.auth)
  const { company } = useSelector((state: RootState) => state.company)

  const [isUserEditing, setIsUserEditing] = useState(false);
  const [isCompanyEditing, setIsCompanyEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
  });
  const [tabValue, setTabValue] = useState(0);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  const speedDialActions = [
    { icon: <Download />, name: 'Download Profile', action: () => console.log('Download') },
    { icon: <Share />, name: 'Share Profile', action: () => console.log('Share') },
    { icon: <Refresh />, name: 'Refresh Data', action: () => console.log('Refresh') },
    { icon: <ContactSupport />, name: 'Get Help', action: () => console.log('Help') },
  ];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    if (newValue === 1) {
      dispatch(getCompany());
    }
    setTabValue(newValue);
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
            company={company}
            tabValue={tabValue}
            onEditToggle={() => {
              if (tabValue !== 1) {
                setIsUserEditing(!isUserEditing);
              } else {
                setIsCompanyEditing(!isCompanyEditing);
              }
            }}
          />

          {/* Tab Navigation */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
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
              <Tab label="Security" icon={<Shield />} iconPosition="start" />
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
                      badge={1}
                    />
                    <InfoRow
                      icon={<PhoneIcon />}
                      label="Phone Number"
                      value={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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

              {/* Account Statistics */}
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
            (!company || Object.keys(company).length === 0) ? (
              <Box sx={{ width: '100%', p: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                  No company data found.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Please create your company profile to get started.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsCompanyEditing(true)}
                >
                  Create Company Data
                </Button>
              </Box>
            ) : (
              <Grid container gap={2} sx={{ mt: 2 }}>
                <Grid item xs={12} lg={4}>
                  <SettingsCard title="Company Information" icon={<BusinessSharp />}>
                    <Stack spacing={2}>
                      <InfoRow
                        icon={<EmailIcon />}
                        label="Email Address"
                        value={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {company?.email || 'Not provided'}
                          </Box>
                        }
                      />
                      <InfoRow
                        icon={<PhoneIcon />}
                        label="Phone Number"
                        value={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {company?.phone?.code || ''} {" "}
                            {company?.phone?.number || 'Not provided'}
                          </Box>
                        }
                      />
                      <InfoRow
                        icon={<AccountBalance />}
                        label="GST Number"
                        value={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {company?.gstin || 'Not provided'}
                          </Box>
                        }
                      />
                      <InfoRow
                        icon={<BadgeOutlined />}
                        label="PAN Number"
                        value={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {company?.pan_number || 'Not provided'}
                          </Box>
                        }
                      />
                      <InfoRow
                        icon={<WebsiteIcon />}
                        label="Website"
                        value={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {company?.website || 'Not provided'}
                          </Box>
                        }
                      />
                      <InfoRow
                        icon={<AccessTime />}
                        label="Member Since"
                        value={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {formatDatewithTime(company?.created_at ?? '')}
                          </Box>
                        }
                      />
                    </Stack>
                  </SettingsCard>
                </Grid>
                <Grid item xs={12} lg={7}>
                  <SettingsCard title="Address Details" icon={<AddLocation />}>
                    <Stack spacing={3} sx={{ p: 1 }}>
                      <Box>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "4px" }}>
                          Billing Address
                        </Typography>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 1, bgcolor: mode === 'light' ? alpha(theme.palette.success.main, 0.05) : alpha(theme.palette.success.light, 0.1), border: `1px solid ${alpha(theme.palette.success.main, 0.5)}` }}>
                          {
                            company?.billing ? (
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {company.billing.address_1
                                  ? company.billing.address_1
                                  : <span style={{ color: '#aaa' }}>Address 1 not provided</span>}
                                {company.billing.address_2
                                  ? `, ${company.billing.address_2}`
                                  : ''}
                                {company.billing.city
                                  ? `, ${company.billing.city}`
                                  : ''}
                                {company.billing.state
                                  ? `, ${company.billing.state}`
                                  : ''}
                                {company.billing.country
                                  ? `, ${company.billing.country}`
                                  : ''}
                                {company.billing.pinCode
                                  ? ` - ${company.billing.pinCode}`
                                  : ''}
                                {
                                  !company.billing.address_1 &&
                                  !company.billing.address_2 &&
                                  !company.billing.city &&
                                  !company.billing.state &&
                                  !company.billing.country &&
                                  !company.billing.pinCode && (
                                    <span style={{ color: '#aaa' }}>No billing address provided</span>
                                  )
                                }
                              </Typography>
                            ) : (
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#aaa' }}>
                                No billing address provided
                              </Typography>
                            )
                          }
                          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
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
                                <AddBusiness />
                              </Box>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  Want to Change Your Billing Address?
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Update your billing address to ensure accurate invoicing.
                                </Typography>
                              </Box>
                            </Box>
                            <Box display="flex" alignItems="center" justifyContent="center" >
                              <Button
                                variant="contained"
                                color="success"
                                // onClick={onEditToggle}
                                startIcon={<AddBusiness />}
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
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "4px" }}>
                          Shipping Address
                        </Typography>
                        <Paper elevation={0} sx={{ p: 3, borderRadius: 1, bgcolor: mode === 'light' ? alpha(theme.palette.secondary.main, 0.05) : alpha(theme.palette.secondary.light, 0.1), border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}` }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            {company?.shipping?.title ? company?.shipping?.title : 'No Shipping Title Provided'}
                          </Typography>
                          {
                            company?.shipping ? (
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {company.shipping.address_1
                                  ? company.shipping.address_1
                                  : <span style={{ color: '#aaa' }}>Address 1 not provided</span>}
                                {company.shipping.address_2
                                  ? `, ${company.shipping.address_2}`
                                  : ''}
                                {company.shipping.city
                                  ? `, ${company.shipping.city}`
                                  : ''}
                                {company.shipping.state
                                  ? `, ${company.shipping.state}`
                                  : ''}
                                {company.shipping.country
                                  ? `, ${company.shipping.country}`
                                  : ''}
                                {company.shipping.pinCode
                                  ? ` - ${company.shipping.pinCode}`
                                  : ''}
                                {
                                  !company.shipping.address_1 &&
                                  !company.shipping.address_2 &&
                                  !company.shipping.city &&
                                  !company.shipping.state &&
                                  !company.shipping.country &&
                                  !company.shipping.pinCode && (
                                    <span style={{ color: '#aaa' }}>No shipping address provided</span>
                                  )
                                }
                              </Typography>
                            ) : (
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#aaa' }}>
                                No shipping address provided
                              </Typography>
                            )
                          }
                          <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
                            <Box display="flex" alignItems="center">
                              <Box
                                sx={{
                                  p: 1,
                                  borderRadius: 1,
                                  bgcolor: mode === 'light' ? alpha(theme.palette.secondary.main, 0.1) : alpha(theme.palette.secondary.light, 0.1),
                                  color: mode === 'light' ? theme.palette.secondary.main : theme.palette.secondary.light,
                                  mr: 2,
                                }}
                              >
                                <AddBusiness />
                              </Box>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  Want to Change Your Shipping Address?
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Update your shipping address to ensure timely deliveries.
                                </Typography>
                              </Box>
                            </Box>
                            <Box display="flex" alignItems="center" justifyContent="center" >
                              <Button
                                variant="contained"
                                color="secondary"
                                // onClick={onEditToggle}
                                startIcon={<AddBusiness />}
                                sx={{
                                  background: mode === 'light' ? alpha(theme.palette.secondary.main, 0.5) : alpha(theme.palette.secondary.light, 0.5),
                                  "&:hover": {
                                    background: mode === 'light' ? alpha(theme.palette.secondary.main, 1) : alpha(theme.palette.secondary.light, 1),
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
                    </Stack>
                  </SettingsCard>
                </Grid>
              </Grid>
            ))}

          {tabValue === 2 && (
            <Grid container spacing={4}>
              {/* Notification Preferences */}
              <Grid item xs={12} lg={6}>
                <SettingsCard title="Notification Preferences" icon={<NotificationsActive />}>
                  <Stack spacing={3}>
                    {Object.entries(notifications).map(([key, value]) => (
                      <Box key={key}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={value}
                              onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
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
                    ))}
                  </Stack>
                </SettingsCard>
              </Grid>

              {/* Theme Preferences */}
              <Grid item xs={12} lg={6}>
                <SettingsCard title="Appearance" icon={<Palette />}>
                  <Stack spacing={3}>
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={darkMode}
                            onChange={(e) => setDarkMode(e.target.checked)}
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

                    <Box>
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
                    </Box>
                  </Stack>
                </SettingsCard>
              </Grid>
            </Grid>
          )}

          {tabValue === 3 && (
            <Grid container spacing={4}>
              {/* Notification Preferences */}
              <Grid item xs={12} lg={6}>
                <SettingsCard title="Notification Preferences" icon={<NotificationsActive />}>
                  <Stack spacing={3}>
                    {Object.entries(notifications).map(([key, value]) => (
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
                    ))}
                  </Stack>
                </SettingsCard>
              </Grid>

              {/* Theme Preferences */}
              <Grid item xs={12} lg={6}>
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

                    <Box>
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
                    </Box>
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
    </Box>
  );
};

export default ProfilePage;

// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Avatar,
//   Grid,
//   Box,
//   useTheme,
//   Paper,
//   Chip,
//   IconButton,
//   Button,
//   Tooltip,
//   alpha,
//   Theme,
// } from "@mui/material";
// // const MAX_FILE_SIZE_MB = 5;
// // const ALLOWED_FILE_TYPES = [
// //   "image/jpeg",
// //   "image/png",
// //   "image/jpg",
// //   "image/gif",
// // ];
// import {
//   Email as EmailIcon,
//   Assignment as LicenseIcon,
//   Home as HomeIcon,
//   Phone as PhoneIcon,
//   LocationOn as LocationIcon,
//   LinkedIn as LinkedInIcon,
//   Language as WebsiteIcon,
//   Facebook as FacebookIcon,
//   Schedule as ScheduleIcon,
//   // Edit as EditIcon,
//   VerifiedUser as VerifiedIcon,
//   // Star as StarIcon,
// } from "@mui/icons-material";
// import { useDispatch, useSelector, } from "react-redux";
// import { getCurrentUser } from "@/services/auth";
// import { AppDispatch, RootState } from "@/store/store";

// const InfoRow: React.FC<{
//   theme: Theme;
//   icon: React.ReactNode;
//   label: string;
//   value: React.ReactNode;
// }> = ({ theme, icon, label, value }) => (
//   <Paper
//     elevation={0}
//     sx={{
//       p: 2,
//       mb: 1,
//       boxShadow:
//         theme.palette.mode === "light"
//           ? "0 4px 20px rgba(0,0,0,0.1)"
//           : "0 4px 20px rgba(255,255,255,0.1)",
//       backgroundColor: alpha(theme.palette.background.default, 0.6),
//       "&:hover": {
//         backgroundColor: alpha(theme.palette.background.default, 1),
//         transform: "translateX(5px)",
//         transition: "all 0.3s ease-in-out",
//       },
//     }}
//   >
//     <Box display="flex" alignItems="center">
//       <Box mr={2} color="primary.light">
//         {icon}
//       </Box>
//       <Box flexGrow={1}>
//         <Typography variant="caption" color="textSecondary" fontWeight={500}>
//           {label}
//         </Typography>
//         <Typography variant="body1" fontWeight={600}>
//           {value}
//         </Typography>
//       </Box>
//     </Box>
//   </Paper>
// );

// const UserProfile: React.FC = () => {
//   const website = "www.healthcarepharmacy.com";
//   const businessHours = "Mon-Sat: 9:00 AM - 8:00 PM";
//   const specialization = [
//     "General Medicine",
//     "Prescription Drugs",
//     "Healthcare Consultation",
//   ];
//   const theme = useTheme();
//   const dispatch = useDispatch<AppDispatch>();
//   const { user } = useSelector((state: RootState) => state.auth);
//   const getFullName = () => {
//     if (!user) return "No Name";
//     return `${user?.name.first ?? " "} ${user?.name.last ?? ""}`;
//   };

//   const getFullAddress = () => {
//     if (user) {
//       // return `${user?.UserData.address.street_address ?? ""}, ${user?.UserData.address.street_address_line_2 ? user?.UserData.address.street_address_line_2 + ', ' : ""} ${user?.UserData.address.city ?? ""}, ${user?.UserData.address.state ?? ""}, ${user?.UserData.address.zip_code ?? ""}`;
//       return "No Address";
//     } else {
//       return "No Address";
//     }
//   };

//   const [editableData, setEditableData] = useState({
//     userName: getFullName(),
//     email: user?.email ?? "No Email",
//     role: user?.user_type ?? "No Role",
//     shopName: "No Shop Name",
//     licenseNumber: "License",
//     streetAddress:  "No Address",
//     fullAddress: getFullAddress(),
//     phoneNumber: user?.phone.number ?? "No Phone Number",
//     website,
//     businessHours,
//   });


//   const [isEditing, setIsEditing] = useState(false); // New state for edit mode
//   const [selectedFile, _setSelectedFile] = useState<File | null>(null);
//   const [imageUrl, _setImageUrl] = useState<string | null>(null);
//   const [error, _setError] = useState("");



//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setEditableData((prev) => ({ ...prev, [name]: value }));
//   };

//   // useEffect(() => {
//   //   dispatch(getCurrentUser());
//   // }, [dispatch])



//   const handleSave = async () => {
//     try {
//       // toast.promise(dispatch(updateStockist(updatedStockistData)), {
//       //   loading: "Updating Stockist data ...",
//       //   success: <b>Stockist Data Updated!</b>,
//       //   error: <b>Could not update.</b>,
//       // });

//       const response = await fetch("/api/updateUserProfile", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(editableData),
//       });
//       if (!response.ok) throw new Error("Failed to update profile");
//       setIsEditing(false); // Exit edit mode after saving
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleUpload = () => {
//     if (selectedFile) {
//       const formData = new FormData();
//       formData.append("image", selectedFile);

//       console.log("Uploading file...", formData);
//     } else {
//       console.error("No file selected");
//     }
//   };

//   return (
//     <Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh', width: '100%' }}>
//       <Card
//         elevation={8}
//         sx={{
//           background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, alpha(${theme.palette.background.default}, 0.6) 100%)`,
//           borderRadius: 1,
//           overflow: "hidden",
//           width: "100%",
//           margin: 0,
//           marginTop: "2rem",
//         }}
//       >
//         <Box
//           sx={{
//             position: "relative",
//             height: "150px",
//             borderRadius: 1,
//             backgroundColor: theme.palette.primary.main,
//             backgroundImage: `linear-gradient(135deg,${theme.palette.info.dark} 0%, ${theme.palette.info.light} 100%)`,
//             "&::after": {
//               content: '""',
//               position: "absolute",
//               bottom: 0,
//               left: 0,
//               right: 0,
//               height: "40px",
//               background:
//                 "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)",
//             },
//           }}
//         />

//         <CardContent sx={{ mt: -10, position: "relative" }}>
//           <Box
//             sx={{
//               position: "absolute",
//               top: -30,
//               left: "50%",
//               transform: "translate(-50%, 0)",
//               zIndex: "100",
//             }}
//           >
//             <Typography
//               variant="h4"
//               sx={{
//                 fontWeight: 700,
//                 color:
//                   theme.palette.mode === "light"
//                     ? theme.palette.primary.dark
//                     : theme.palette.primary.main,
//               }}
//             >
//               My Profile
//             </Typography>
//           </Box>
//           <Grid container spacing={4}>
//             {/* Profile Section */}
//             <Grid item xs={12} md={4}>
//               <Box
//                 display="flex"
//                 flexDirection="column"
//                 alignItems="center"
//                 sx={{
//                   backgroundColor: alpha(theme.palette.background.default, 0.7),
//                   borderRadius: 2,
//                   p: 3,
//                   boxShadow:
//                     theme.palette.mode === "light"
//                       ? "0 4px 20px rgba(0,0,0,0.1)"
//                       : "0 4px 20px rgba(255,255,255,0.1)",
//                   height: "100%",
//                 }}
//               >
//                 <Box position="relative">
//                   <Avatar
//                     src={
//                       imageUrl ||
//                       `https://api.dicebear.com/5.x/initials/svg?seed=${editableData.userName}`
//                     }
//                     alt={editableData.userName}
//                     sx={{
//                       width: 150,
//                       height: 150,
//                       border: "5px solid white",
//                       boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
//                     }}
//                   />
//                   {error && (
//                     <Typography variant="body2" color="error" mt={2}>
//                       {error}
//                     </Typography>
//                   )}
//                   {selectedFile && (
//                     <Button
//                       variant="contained"
//                       onClick={handleUpload}
//                       component="span"
//                     >
//                       Upload Image
//                     </Button>
//                   )}

//                   <Tooltip title="Verified Professional">
//                     <VerifiedIcon
//                       sx={{
//                         position: "absolute",
//                         bottom: 5,
//                         right: 5,
//                         color: theme.palette.primary.main,
//                         backgroundColor: "white",
//                         borderRadius: "50%",
//                       }}
//                     />
//                   </Tooltip>
//                 </Box>

//                 <Typography
//                   variant="h4"
//                   gutterBottom
//                   sx={{ mt: 2, fontWeight: 700 }}
//                 >
//                   {isEditing ? (
//                     <input
//                       type="text"
//                       name="email"
//                       style={{
//                         width: "100%",
//                         margin: "auto",
//                         border: "none",
//                         textAlign: "center",
//                         fontWeight: "bold",
//                         fontSize: "1.5rem",
//                         borderBottom: `2px solid ${theme.palette.primary.main} `,
//                       }}
//                       value={editableData.userName}
//                       onChange={handleChange}
//                     />
//                   ) : (
//                     editableData.userName
//                   )}
//                 </Typography>

//                 <Box display="flex" alignItems="center" gap={1} mb={2}>
//                   <Chip
//                     label={editableData.role}
//                     color="primary"
//                     sx={{
//                       fontSize: "1rem",
//                       fontWeight: 600,
//                       backgroundColor: (theme) => theme.palette.primary.main,
//                       py: 2,
//                       px: 1,
//                     }}
//                   />

//                 </Box>


//                 <Box mt={2} width="100%">
//                   <Typography
//                     variant="subtitle1"
//                     fontWeight={600}
//                     color="primary.light"
//                   >
//                     Shop Details
//                   </Typography>
//                   <Typography variant="h6" gutterBottom fontWeight={700}>
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         name="email"
//                         style={{
//                           width: "100%",
//                           border: "none",
//                           fontWeight: "bold",
//                           fontSize: "1.15rem",
//                           borderBottom: `2px solid ${theme.palette.primary.main} `,
//                         }}
//                         value={editableData.shopName}
//                         onChange={handleChange}
//                       />
//                     ) : (
//                       editableData.shopName
//                     )}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     color="textSecondary"
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 1,
//                       mb: 2,
//                     }}
//                   >
//                     <LocationIcon fontSize="small" />
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         name="email"
//                         style={{
//                           width: "100%",
//                           border: "none",
//                           borderBottom: `2px solid ${theme.palette.primary.main} `,
//                         }}
//                         value={editableData.streetAddress}
//                         onChange={handleChange}
//                       />
//                     ) : (
//                       editableData.streetAddress
//                     )}
//                   </Typography>

//                   {/* <Typography
//                   variant="body2"
//                   sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
//                 >
//                   <ScheduleIcon fontSize="small" color="primary" />
//                   {businessHours}
//                 </Typography> */}

//                   <Box mt={2}>
//                     <Typography variant="subtitle2" fontWeight={600} gutterBottom>
//                       Specializations
//                     </Typography>
//                     <Box display="flex" flexWrap="wrap" gap={1}>
//                       {specialization.map((spec, index) => (
//                         <Chip
//                           key={index}
//                           label={spec}
//                           size="small"
//                           variant="outlined"
//                           sx={{ backgroundColor: "rgba(255,255,255,0.6)" }}
//                         />
//                       ))}
//                     </Box>
//                   </Box>
//                 </Box>

//                 <Box mt={3} display="flex" gap={1} justifyContent="center">
//                   <IconButton color="primary" size="small">
//                     <LinkedInIcon />
//                   </IconButton>
//                   <IconButton color="primary" size="small">
//                     <FacebookIcon />
//                   </IconButton>
//                   <IconButton color="primary" size="small">
//                     <WebsiteIcon />
//                   </IconButton>
//                 </Box>
//               </Box>
//             </Grid>

//             {/* Contact and Business Information */}
//             <Grid item xs={12} md={8}>
//               <Box
//                 sx={{
//                   backgroundColor: alpha(theme.palette.background.default, 0.6),
//                   borderRadius: 2,
//                   p: 3,
//                   boxShadow:
//                     theme.palette.mode === "light"
//                       ? "0 4px 20px rgba(0,0,0,0.1)"
//                       : "0 4px 20px rgba(255,255,255,0.1)",
//                 }}
//               >
//                 <Box
//                   display="flex"
//                   justifyContent="space-between"
//                   alignItems="center"
//                   mb={3}
//                 >
//                   <Typography
//                     variant="h5"
//                     sx={{
//                       fontWeight: 700,
//                       color: theme.palette.primary.main,
//                     }}
//                   >
//                     Contact Information
//                   </Typography>
//                   <Box>
//                     <Button
//                       onClick={isEditing ? handleSave : () => setIsEditing(true)}
//                       variant="outlined"
//                       size="small"
//                       sx={{ borderRadius: 2, marginRight: "10px" }}
//                     >
//                       {isEditing ? "Save Changes" : "Edit Profile"}
//                     </Button>
//                     {isEditing && (
//                       <Button
//                         onClick={() => setIsEditing(false)}
//                         variant="outlined"
//                         size="small"
//                         sx={{ borderRadius: 2 }}
//                       >
//                         Cancel
//                       </Button>
//                     )}
//                   </Box>
//                 </Box>

//                 <InfoRow
//                   theme={theme}
//                   icon={<EmailIcon />}
//                   label="Email Address"
//                   value={
//                     isEditing ? (
//                       <input
//                         type="text"
//                         name="email"
//                         style={{
//                           width: "100%",
//                           border: "none",
//                           fontWeight: "bold",
//                           borderBottom: `2px solid ${theme.palette.primary.main} `,
//                         }}
//                         value={editableData.email}
//                         onChange={handleChange}
//                       />
//                     ) : (
//                       editableData.email
//                     )
//                   }
//                 />
//                 {editableData.licenseNumber && (<InfoRow
//                   theme={theme}
//                   icon={<LicenseIcon />}
//                   label="License Number"
//                   value={
//                     isEditing ? (
//                       <input
//                         type="text"
//                         name="licenseNumber"
//                         style={{
//                           width: "100%",
//                           border: "none",
//                           fontWeight: "bold",
//                           borderBottom: `2px solid ${theme.palette.primary.main} `,
//                         }}
//                         value={editableData.licenseNumber}
//                         onChange={handleChange}
//                       />
//                     ) : (
//                       editableData.licenseNumber
//                     )
//                   }
//                 />)}
//                 <InfoRow
//                   theme={theme}
//                   icon={<HomeIcon />}
//                   label="Full Address"
//                   value={
//                     isEditing ? (
//                       <input
//                         type="text"
//                         name="fullAddress"
//                         style={{
//                           width: "100%",
//                           border: "none",
//                           fontWeight: "bold",
//                           borderBottom: `2px solid ${theme.palette.primary.main} `,
//                         }}
//                         value={editableData.fullAddress}
//                         onChange={handleChange}
//                       />
//                     ) : (
//                       editableData.fullAddress
//                     )
//                   }
//                 />
//                 <InfoRow
//                   theme={theme}
//                   icon={<PhoneIcon />}
//                   label="Contact Number"
//                   value={
//                     isEditing ? (
//                       <input
//                         type="text"
//                         name="phoneNumber"
//                         style={{
//                           width: "100%",
//                           border: "none",
//                           fontWeight: "bold",
//                           borderBottom: `2px solid ${theme.palette.primary.main} `,
//                         }}
//                         value={editableData.phoneNumber}
//                         onChange={handleChange}
//                       />
//                     ) : (
//                       editableData.phoneNumber
//                     )
//                   }
//                 />
//                 <InfoRow
//                   theme={theme}
//                   icon={<WebsiteIcon />}
//                   label="Website"
//                   value={
//                     isEditing ? (
//                       <input
//                         type="text"
//                         name="website"
//                         style={{
//                           width: "100%",
//                           border: "none",
//                           fontWeight: "bold",
//                           borderBottom: `2px solid ${theme.palette.primary.main} `,
//                         }}
//                         value={editableData.website}
//                         onChange={handleChange}
//                       />
//                     ) : (
//                       editableData.website
//                     )
//                   }
//                 />
//                 <InfoRow
//                   theme={theme}
//                   icon={<ScheduleIcon />}
//                   label="Business Hours"
//                   value={
//                     isEditing ? (
//                       <input
//                         type="text"
//                         name="businessHours"
//                         style={{
//                           width: "100%",
//                           border: "none",
//                           fontWeight: "bold",
//                           borderBottom: `2px solid ${theme.palette.primary.main} `,
//                         }}
//                         value={editableData.businessHours}
//                         onChange={handleChange}
//                       />
//                     ) : (
//                       editableData.businessHours
//                     )
//                   }
//                 />
//               </Box>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default UserProfile;
