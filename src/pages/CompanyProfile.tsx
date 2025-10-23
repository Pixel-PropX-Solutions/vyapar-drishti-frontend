import React, { useCallback, useEffect, useState } from "react";
import {
    Container,
    Paper,
    Box,
    useTheme,
    alpha,
    Stack,
    Tabs,
    Tab,
    Grid,
    Typography,
    Button,
    Divider,
    Switch,
    FormControlLabel,
} from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import {
    Settings,
    BusinessSharp,
    Print,
    LocationOn,
    EmailOutlined,
    PhoneAndroid,
    AccessTime,
    SecurityOutlined,
    AccountBalanceOutlined,
    SellOutlined,
    Summarize,
    ShoppingBagOutlined,
    Person,
    Phone,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getAllCompanies, getCompanyDetails } from "@/services/company";
import CompanyEditingModal from "@/common/modals/CompanyEditingModal";
import { GetCompany } from "@/utils/types";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { SettingsCard } from "@/common/SettingsCard";
import { InfoRow } from "@/common/InfoRow";
import { formatDatewithTime } from "@/utils/functions";
import { CompanyProfileHeader } from "@/common/CompanyProfileHeader";
import { getCurrentCompany } from "@/services/auth";
import AccountModal from "@/common/modals/CreateAccountModal";

const CompanyProfile: React.FC = () => {
    const theme = useTheme();
    const { company_id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { mode, setMode } = useColorScheme();
    const { user, current_company_id } = useSelector((state: RootState) => state.auth);
    const currentCompanyId = current_company_id || localStorage.getItem("current_company_id") || user?.user_settings?.current_company_id || '';
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === currentCompanyId);
    const { company } = useSelector((state: RootState) => state.company);
    const [isCompanyEditing, setIsCompanyEditing] = useState(false);
    const [bankModal, setBankModal] = useState(false);
    const [editingCompany, setEditingCompany] = useState<GetCompany | null>(null);
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const fetchCompanyData = useCallback(() => {
        dispatch(getAllCompanies());
    }, [dispatch]);

    React.useEffect(() => {
        fetchCompanyData();
    }, [fetchCompanyData]);

    const handleEditToggle = () => {
        setEditingCompany(currentCompanyDetails);
        setIsCompanyEditing(true);
    };

    const handleBankChange = () => {
        if (!company) {
            toast.error("Company data is not available.");
            return;
        }
        setBankModal(true);

    }

    useEffect(() => {
        dispatch(getCompanyDetails(company_id ?? ''));
    }, [company_id]);

    return (
        <Box sx={{ minHeight: "100vh", width: "100%" }}>
            <Container maxWidth={false} sx={{ position: "relative", width: '100%', maxWidth: '100%', zIndex: 1, py: 4 }}>
                <Stack spacing={3}>
                    <CompanyProfileHeader
                        company={company}
                        onEditToggle={handleEditToggle}
                    />

                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.background.paper, 0.8),
                            backdropFilter: "blur(20px)",
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
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
                                    transition: 'all 0.3s ease',
                                },
                                "& .Mui-selected": {
                                    color: theme.palette.primary.main,
                                }
                            }}
                        >
                            <Tab label="Overview" icon={<BusinessSharp />} iconPosition="start" />
                            <Tab label="Address Details" icon={<LocationOn />} iconPosition="start" />
                            <Tab label="Templates" icon={<Print />} iconPosition="start" />
                            <Tab label="Settings" icon={<Settings />} iconPosition="start" />
                        </Tabs>
                    </Paper>

                    {tabValue === 0 && (
                        <Grid container gap={2} sx={{ mt: 2 }}>
                            {/* Contact Information */}
                            <Grid item xs={12} lg={4}>
                                <SettingsCard title="Company Information" icon={<EmailOutlined />}>
                                    <Stack spacing={2}>
                                        <InfoRow
                                            icon={<EmailOutlined />}
                                            label="Email Address"
                                            value={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {company?.email || 'Not provided'}
                                                </Box>
                                            }
                                        />
                                        <InfoRow
                                            icon={<PhoneAndroid />}
                                            label="Phone Number"
                                            value={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {company?.phone?.code || ''} {" "}
                                                    {company?.phone?.number || 'Not provided'}
                                                </Box>
                                            }
                                        />
                                        <InfoRow
                                            icon={<EmailOutlined />}
                                            label="Web Site"
                                            value={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {company?.website || 'Not provided'}
                                                </Box>
                                            }
                                        />
                                    </Stack>
                                </SettingsCard>
                            </Grid>

                            {/* Default Bank */}
                            <Grid item xs={12} lg={7} >
                                <SettingsCard title="Default Bank" icon={<AccountBalanceOutlined />}>
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
                                                {company?.bank_name || 'No Default Bank'}
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
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                                Account Number: {company?.account_number || 'N/A'}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                IFSC Code: {company?.bank_ifsc || 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box display="flex" alignItems="center" justifyContent="center" >
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            startIcon={<AccountBalanceOutlined />}
                                                            sx={{
                                                                background: mode === 'light' ? alpha(theme.palette.success.main, 0.5) : alpha(theme.palette.success.light, 0.5),
                                                                "&:hover": {
                                                                    background: mode === 'light' ? alpha(theme.palette.success.main, 1) : alpha(theme.palette.success.light, 1),
                                                                },
                                                                fontWeight: 600,
                                                                whiteSpace: "nowrap",
                                                                px: 3,
                                                            }}
                                                            onClick={handleBankChange}
                                                        >
                                                            {company?.bank_name ? 'Change' : 'Add'}
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
                        <Grid container gap={2} sx={{ mt: 2 }}>
                            {/* Address Information */}
                            <Grid item xs={12} lg={4}>
                                <SettingsCard title="Address Information" icon={<LocationOn />}>
                                    <Stack spacing={2}>
                                        <InfoRow
                                            icon={<EmailOutlined />}
                                            label="Address Line 1"
                                            value={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {company?.address_1 || 'Not provided'}
                                                </Box>
                                            }
                                        />
                                        {company?.address_2 && <InfoRow
                                            icon={<EmailOutlined />}
                                            label="Address Line 2"
                                            value={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {company?.address_2}
                                                </Box>
                                            }
                                        />}
                                        <InfoRow
                                            icon={<EmailOutlined />}
                                            label="State, Country - Pin Code"
                                            value={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {`${company?.state || ''}, ${company?.country || ''} - ${company?.pinCode || ''}`}
                                                </Box>
                                            }
                                        />
                                        {/* <InfoRow
                                            icon={<EmailOutlined />}
                                            label="GSTIN/TIN Number"
                                            value={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {company?.tin || 'Not provided'}
                                                </Box>
                                            }
                                        /> */}
                                    </Stack>
                                </SettingsCard>
                            </Grid>

                            {/* Taxation Information */}
                            <Grid item xs={12} lg={7} >
                                <SettingsCard title="Tax Information" icon={<AccountBalanceOutlined />}>
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
                                                {company?.tin ? 'Tax Information' : 'No Tax Information Added'}
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
                                                        <Box>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                                GSTIN/TIN Number
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                                                {company?.tin || 'N/A'}
                                                            </Typography>

                                                        </Box>
                                                    </Box>
                                                    <Box display="flex" flexDirection="column" alignItems="flex-end" justifyContent="center" >
                                                        <Typography variant="caption" color="text.secondary">
                                                            Registration Type: {company?.bank_ifsc || 'N/A'}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Registered State: {company?.state || 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        </Box>
                                    </Stack>
                                </SettingsCard>
                            </Grid>
                        </Grid>
                    )}

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
                                    </Stack>
                                </SettingsCard>
                            </Grid>
                        </Grid>
                    )}

                    {tabValue === 3 && (
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
                                                    icon={<Phone />}
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
                                            <Stack direction={'row'} spacing={2}>
                                                {currentCompanyDetails?.company_settings ? (
                                                    <>
                                                        <FormControlLabel
                                                            control={
                                                                <Switch
                                                                    checked={currentCompanyDetails?.company_settings?.features?.enable_tax || false}
                                                                    disabled
                                                                    color="primary"
                                                                />
                                                            }
                                                            label={
                                                                <Box>
                                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                                        TAX Management
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        Tax calculation and TAX return filing
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
                                                    {currentCompanyDetails?.company_settings?.tax_details?.tin && (
                                                        <InfoRow
                                                            icon={<SecurityOutlined />}
                                                            label="TIN"
                                                            value={
                                                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                                    {currentCompanyDetails?.company_settings?.tax_details?.tin}
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
                            <Grid item xs={12} sx={{ mt: 3 }}>
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

            <CompanyEditingModal
                open={isCompanyEditing}
                onClose={() => {
                    setIsCompanyEditing(false);
                }}
                company={editingCompany}
                onUpdated={async () => {
                    fetchCompanyData();
                }}
            />
            <AccountModal open={bankModal} onClose={() => setBankModal(false)} />
        </Box>
    );
};

export default CompanyProfile;