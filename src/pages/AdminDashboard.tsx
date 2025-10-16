import React, { useState, useMemo, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    Avatar,
    Grid,
    Paper,
    Tabs,
    Tab,
    LinearProgress,
    InputAdornment,
    alpha,
    useTheme,
    Button,
    IconButton,
    Tooltip,
    Badge,
    Fade,
    Zoom,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from '@mui/material';
import {
    Search,
    CheckCircle,
    Cancel,
    Business,
    People,
    Phone,
    Email,
    TrendingUp,
    VerifiedUser,
    PeopleAlt,
    FilterList,
    Download,
    Refresh,
    MoreVert,
    Visibility,
    Edit,
    Delete,
    LocationOn,
    AccessTime,
    Computer,
    AccountBalance,
    ArrowUpward,
    ArrowDownward,
    Dashboard,
} from '@mui/icons-material';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { getUsers } from '@/services/admin';



// Mock utility function
const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};



const UserAdminDashboard: React.FC = () => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0);
    const [loading, _SetLoading] = useState(false);
    const [debounce, setDebounce] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [_selcteduser, setSelectedUser] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { usersList } = useSelector((state: RootState) => state.admin);
    const [state, setState] = useState({
        search: "",
        page: 1,
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(),
        rowsPerPage: 1000,
        sortField: "created_at",
        sortOrder: "desc",
    });

    const { search, page, rowsPerPage, startDate, endDate, sortField, sortOrder } = state;

    const stats = useMemo(() => {
        const total = usersList.length;
        const verified = usersList.filter(u => u.is_verified).length;
        const withCompanies = usersList.filter(u => u.companies.length > 0).length;
        const admins = usersList.filter(u => u.user_type === 'admin').length;
        const totalCompanies = usersList.reduce((sum, u) => sum + u.companies.length, 0);

        const stateDistribution = usersList.reduce((acc, user) => {
            user.companies.forEach(company => {
                acc[company.state] = (acc[company.state] || 0) + 1;
            });
            return acc;
        }, {} as Record<string, number>);

        const deviceTypes = usersList.reduce((acc, user) => {
            const device = user.user_settings.last_login_device.split('|')[0].trim();
            acc[device] = (acc[device] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return { total, verified, withCompanies, admins, totalCompanies, stateDistribution, deviceTypes };
    }, [usersList]);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, userId: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(userId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedUser(null);
    };

    const handleStateChange = (field: string, value: any) => {
        setState((prevState) => ({
            ...prevState,
            [field]: value
        }))
    }

    // const handleChangePage = (
    //     _: React.ChangeEvent<unknown>,
    //     newPage: number
    // ) => {
    //     setState((prevState) => ({
    //         ...prevState,
    //         page: newPage
    //     }))
    // };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounce(search);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    useEffect(() => {
        dispatch(
            getUsers({
                search: debounce,
                pageNumber: page,
                limit: rowsPerPage,
                sortField: sortField,
                sortOrder: sortOrder,
            })
        );
    }, [dispatch, endDate, page, rowsPerPage, debounce, sortField, sortOrder, startDate])


    const StatCard = ({ title, value, subtitle, icon, color, trend }: any) => (
        <Zoom in timeout={300}>
            <Card
                elevation={0}
                sx={{
                    height: '100%',
                    background: `linear-gradient(135deg, ${alpha(color, 0.05)} 0%, ${alpha(color, 0.02)} 100%)`,
                    border: `1px solid ${alpha(color, 0.1)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 24px ${alpha(color, 0.15)}`,
                        border: `1px solid ${alpha(color, 0.2)}`,
                    }
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box flex={1}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    fontWeight: 500,
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase',
                                    fontSize: '0.75rem',
                                    mb: 1
                                }}
                            >
                                {title}
                            </Typography>
                            <Typography
                                variant="h3"
                                fontWeight="700"
                                sx={{
                                    color: color,
                                    mb: 0.5,
                                    fontSize: { xs: '1.75rem', sm: '2.25rem' }
                                }}
                            >
                                {value}
                            </Typography>
                            {subtitle && (
                                <Box display="flex" alignItems="center" gap={0.5}>
                                    {trend && (
                                        trend > 0 ?
                                            <ArrowUpward sx={{ fontSize: 14, color: 'success.main' }} /> :
                                            <ArrowDownward sx={{ fontSize: 14, color: 'error.main' }} />
                                    )}
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: trend > 0 ? 'success.main' : 'text.secondary',
                                            fontWeight: 500
                                        }}
                                    >
                                        {subtitle}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                        <Avatar
                            sx={{
                                bgcolor: alpha(color, 0.1),
                                width: 56,
                                height: 56,
                            }}
                        >
                            {icon}
                        </Avatar>
                    </Box>
                </CardContent>
            </Card>
        </Zoom>
    );

    return (
        <Box sx={{ minHeight: '100vh', width: '100%', bgcolor: '#fafbfc', p: { xs: 2, md: 3 } }}>
            <Box sx={{ mx: 'auto' }}>
                {/* Header */}
                <Box mb={4}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    width: 48,
                                    height: 48,
                                }}
                            >
                                <Dashboard />
                            </Avatar>
                            <Box>
                                <Typography
                                    variant="h4"
                                    fontWeight="700"
                                    sx={{
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 0.5
                                    }}
                                >
                                    User Management
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Monitor and manage all user accounts
                                </Typography>
                            </Box>
                        </Box>
                        <Box display="flex" gap={1}>
                            <Tooltip title="Refresh Data">
                                <IconButton
                                    color="primary"
                                    sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                                    }}
                                >
                                    <Refresh />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Export Data">
                                <IconButton
                                    color="primary"
                                    sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                                    }}
                                >
                                    <Download />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </Box>

                {/* Statistics Cards */}
                <Grid container spacing={3} mb={4}>
                    <Grid item xs={12} sm={6} lg={3}>
                        <StatCard
                            title="Total Users"
                            value={stats.total}
                            subtitle="Active accounts"
                            icon={<People sx={{ color: '#1976d2', fontSize: 28 }} />}
                            color="#1976d2"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <StatCard
                            title="Verified Users"
                            value={stats.verified}
                            subtitle={`${((stats.verified / stats.total) * 100).toFixed(1)}% verified`}
                            icon={<VerifiedUser sx={{ color: '#4caf50', fontSize: 28 }} />}
                            color="#4caf50"
                            trend={5}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <StatCard
                            title="Total Companies"
                            value={stats.totalCompanies}
                            subtitle={`${stats.withCompanies} users with companies`}
                            icon={<Business sx={{ color: '#ff9800', fontSize: 28 }} />}
                            color="#ff9800"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                        <StatCard
                            title="Admin Users"
                            value={stats.admins}
                            subtitle={`${((stats.admins / stats.total) * 100).toFixed(1)}% of total`}
                            icon={<TrendingUp sx={{ color: '#9c27b0', fontSize: 28 }} />}
                            color="#9c27b0"
                        />
                    </Grid>
                </Grid>

                {/* Search and Filters */}
                <Fade in timeout={500}>
                    <Paper
                        elevation={0}
                        sx={{
                            mb: 3,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            borderRadius: 2,
                            overflow: 'hidden'
                        }}
                    >
                        <Box p={3}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={8}>
                                    <TextField
                                        fullWidth
                                        placeholder="Search by name, email, or phone..."
                                        value={search}
                                        onChange={(e) => handleStateChange('search', e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Search color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.02),
                                                '&:hover': {
                                                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                                                },
                                                '&.Mui-focused': {
                                                    bgcolor: 'background.paper',
                                                }
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box display="flex" gap={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<FilterList />}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 600
                                            }}
                                        >
                                            Filters
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        <Tabs
                            value={activeTab}
                            onChange={(_, newValue) => setActiveTab(newValue)}
                            sx={{
                                px: 3,
                                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    minHeight: 56,
                                }
                            }}
                        >
                            <Tab label="User Overview" />
                            <Tab label="Detailed View" />
                            <Tab label="Analytics" />
                        </Tabs>
                    </Paper>
                </Fade>

                {/* Loading Indicator */}
                {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

                {/* Tab Content */}
                {activeTab === 0 && (
                    <Fade in timeout={500}>
                        <TableContainer
                            component={Paper}
                            elevation={0}
                            sx={{
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                borderRadius: 2
                            }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                                        '& .MuiTableCell-head': {
                                            borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                            fontWeight: 700,
                                            color: theme.palette.text.primary,
                                            py: 2
                                        }
                                    }}>
                                        <TableCell>User</TableCell>
                                        <TableCell>Contact</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Companies</TableCell>
                                        <TableCell>Joined</TableCell>
                                        <TableCell>Last Active</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {usersList.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                                <PeopleAlt sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                                    No users found
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Try adjusting your search or filter criteria
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        usersList.map((user) => (
                                            <TableRow
                                                key={user._id}
                                                hover
                                                sx={{
                                                    '&:hover': {
                                                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                                                    },
                                                    transition: 'background-color 0.2s'
                                                }}
                                            >
                                                <TableCell>
                                                    <Box display="flex" alignItems="center">
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: theme.palette.primary.main,
                                                                mr: 2,
                                                                fontWeight: 700
                                                            }}
                                                        >
                                                            {getInitials(`${user.name.first} ${user.name.last}`)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight="600">
                                                                {user.name.first} {user.name.last}
                                                            </Typography>
                                                            <Chip
                                                                label={user.user_type}
                                                                size="small"
                                                                color={user.user_type === 'admin' ? 'secondary' : 'default'}
                                                                sx={{
                                                                    mt: 0.5,
                                                                    height: 20,
                                                                    fontSize: '0.7rem',
                                                                    fontWeight: 600
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box display="flex" flexDirection="column" gap={0.5}>
                                                        <Box display="flex" alignItems="center">
                                                            <Email sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                                                            <Typography variant="body2" fontSize="0.85rem">
                                                                {user.email}
                                                            </Typography>
                                                        </Box>
                                                        <Box display="flex" alignItems="center">
                                                            <Phone sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                                                            <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
                                                                {user.phone.code} {user.phone.number}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    {user.is_verified ? (
                                                        <Chip
                                                            icon={<CheckCircle sx={{ fontSize: 16 }} />}
                                                            label="Verified"
                                                            color="success"
                                                            size="small"
                                                            sx={{ fontWeight: 600 }}
                                                        />
                                                    ) : (
                                                        <Chip
                                                            icon={<Cancel sx={{ fontSize: 16 }} />}
                                                            label="Unverified"
                                                            size="small"
                                                            sx={{ fontWeight: 600 }}
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center">
                                                        <Badge
                                                            badgeContent={user.companies.length}
                                                            color="primary"
                                                            sx={{
                                                                '& .MuiBadge-badge': {
                                                                    fontWeight: 700
                                                                }
                                                            }}
                                                        >
                                                            <Business color="action" />
                                                        </Badge>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontSize="0.85rem">
                                                        {formatDate(user.created_at)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontSize="0.85rem" fontWeight="500">
                                                        {user.latest_invoice_created_at ? formatDate(user.latest_invoice_created_at) : '-'}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {user.companies.length > 0 ? `${user.total_invoices_created} invoices` : 'No activity'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => handleMenuOpen(e, user._id)}
                                                    >
                                                        <MoreVert />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Fade>
                )}

                {activeTab === 1 && (
                    <Grid container spacing={3}>
                        {usersList.map((user) => (
                            <Grid item xs={12} md={6} lg={4} key={user._id}>
                                <Zoom in timeout={300}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            height: '100%',
                                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.1)}`,
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Box display="flex" alignItems="center" mb={3}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: theme.palette.primary.main,
                                                        width: 56,
                                                        height: 56,
                                                        mr: 2,
                                                        fontWeight: 700,
                                                        fontSize: '1.25rem'
                                                    }}
                                                >
                                                    {getInitials(`${user.name.first} ${user.name.last}`)}
                                                </Avatar>
                                                <Box flex={1}>
                                                    <Typography variant="h6" fontWeight="700" mb={0.5}>
                                                        {user.name.first} {user.name.last}
                                                    </Typography>
                                                    <Chip
                                                        label={user.user_type}
                                                        color={user.user_type === 'admin' ? 'secondary' : 'primary'}
                                                        size="small"
                                                        sx={{ fontWeight: 600 }}
                                                    />
                                                </Box>
                                                <IconButton size="small">
                                                    <MoreVert />
                                                </IconButton>
                                            </Box>

                                            <Divider sx={{ mb: 2 }} />

                                            <Box sx={{ '& > *:not(:last-child)': { mb: 2 } }}>
                                                <Box display="flex" alignItems="center">
                                                    <Email sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2" fontSize="0.85rem">
                                                        {user.email}
                                                    </Typography>
                                                </Box>

                                                <Box display="flex" alignItems="center">
                                                    <Phone sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2" fontSize="0.85rem">
                                                        {user.phone.code} {user.phone.number}
                                                    </Typography>
                                                </Box>

                                                <Box display="flex" alignItems="center">
                                                    <Computer sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2" fontSize="0.85rem">
                                                        {user.user_settings.last_login_device}
                                                    </Typography>
                                                </Box>

                                                <Box display="flex" alignItems="center">
                                                    <AccessTime sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2" fontSize="0.85rem">
                                                        {formatDate(user.user_settings.last_login)}
                                                    </Typography>
                                                </Box>

                                                {user.companies.length > 0 && (
                                                    <>
                                                        <Divider sx={{ my: 2 }} />
                                                        <Typography variant="body2" fontWeight="700" mb={1.5} display="flex" alignItems="center">
                                                            <Business sx={{ fontSize: 18, mr: 0.5 }} />
                                                            Companies ({user.companies.length})
                                                        </Typography>
                                                        {user.companies.map((company) => (
                                                            <Paper
                                                                key={company._id}
                                                                sx={{
                                                                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                                                                    p: 1.5,
                                                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                                                    borderRadius: 1
                                                                }}
                                                            >
                                                                <Typography variant="body2" fontWeight="600" mb={0.5}>
                                                                    {company.company_name}
                                                                </Typography>
                                                                <Box display="flex" alignItems="center" mb={0.5}>
                                                                    <LocationOn sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {company.state}, {company.country}
                                                                    </Typography>
                                                                </Box>
                                                                {company.bank_details.account_number && (
                                                                    <Box display="flex" alignItems="center">
                                                                        <AccountBalance sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            {company.bank_details.bank_name}
                                                                        </Typography>
                                                                    </Box>
                                                                )}
                                                            </Paper>
                                                        ))}
                                                    </>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Zoom>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {activeTab === 2 && (
                    <Fade in timeout={500}>
                        <Box>
                            {/* State Distribution */}
                            <Card
                                elevation={0}
                                sx={{
                                    mb: 3,
                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    borderRadius: 2
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box display="flex" alignItems="center" mb={3}>
                                        <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="h6" fontWeight="700">
                                            Companies by State
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={2}>
                                        {Object.entries(stats.stateDistribution)
                                            .sort(([, a], [, b]) => b - a)
                                            .map(([state, count]) => (
                                                <Grid item xs={12} sm={6} md={4} key={state}>
                                                    <Paper
                                                        sx={{
                                                            p: 2.5,
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            bgcolor: alpha(theme.palette.primary.main, 0.02),
                                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                                            transition: 'all 0.2s',
                                                            '&:hover': {
                                                                bgcolor: alpha(theme.palette.primary.main, 0.04),
                                                                transform: 'translateY(-2px)',
                                                            }
                                                        }}
                                                    >
                                                        <Box>
                                                            <Typography variant="body2" fontWeight="700" mb={0.5}>
                                                                {state}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {((count / stats.totalCompanies) * 100).toFixed(1)}% of total
                                                            </Typography>
                                                        </Box>
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: theme.palette.primary.main,
                                                                width: 48,
                                                                height: 48,
                                                                fontWeight: 700,
                                                                fontSize: '1.1rem'
                                                            }}
                                                        >
                                                            {count}
                                                        </Avatar>
                                                    </Paper>
                                                </Grid>
                                            ))}
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* Device Distribution */}
                            <Card
                                elevation={0}
                                sx={{
                                    mb: 3,
                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    borderRadius: 2
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box display="flex" alignItems="center" mb={3}>
                                        <Computer sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="h6" fontWeight="700">
                                            Device Distribution
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={3}>
                                        {Object.entries(stats.deviceTypes)
                                            .sort(([, a], [, b]) => b - a)
                                            .map(([device, count]) => (
                                                <Grid item xs={12} sm={6} md={4} key={device}>
                                                    <Paper
                                                        sx={{
                                                            p: 3,
                                                            bgcolor: alpha(theme.palette.secondary.main, 0.02),
                                                            border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                                                            transition: 'all 0.2s',
                                                            '&:hover': {
                                                                bgcolor: alpha(theme.palette.secondary.main, 0.04),
                                                            }
                                                        }}
                                                    >
                                                        <Typography variant="h4" fontWeight="700" color="secondary.main" mb={1}>
                                                            {count}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" mb={2} fontWeight="500">
                                                            {device}
                                                        </Typography>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={(count / stats.total) * 100}
                                                            sx={{
                                                                height: 8,
                                                                borderRadius: 4,
                                                                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                                                '& .MuiLinearProgress-bar': {
                                                                    borderRadius: 4,
                                                                    bgcolor: theme.palette.secondary.main
                                                                }
                                                            }}
                                                        />
                                                        <Typography variant="caption" color="text.secondary" mt={1} display="block">
                                                            {((count / stats.total) * 100).toFixed(1)}% of users
                                                        </Typography>
                                                    </Paper>
                                                </Grid>
                                            ))}
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* User Activity Summary */}
                            <Card
                                elevation={0}
                                sx={{
                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                    borderRadius: 2,
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.02)} 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box display="flex" alignItems="center" mb={3}>
                                        <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="h6" fontWeight="700">
                                            User Activity Summary
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Paper
                                                sx={{
                                                    p: 2.5,
                                                    bgcolor: 'background.paper',
                                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                                }}
                                            >
                                                <Typography variant="body2" color="text.secondary" mb={1}>
                                                    Average Companies per User
                                                </Typography>
                                                <Typography variant="h4" fontWeight="700" color="primary.main">
                                                    {(stats.totalCompanies / stats.total).toFixed(2)}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Paper
                                                sx={{
                                                    p: 2.5,
                                                    bgcolor: 'background.paper',
                                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                                }}
                                            >
                                                <Typography variant="body2" color="text.secondary" mb={1}>
                                                    Verification Rate
                                                </Typography>
                                                <Typography variant="h4" fontWeight="700" color="success.main">
                                                    {((stats.verified / stats.total) * 100).toFixed(1)}%
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Paper
                                                sx={{
                                                    p: 2.5,
                                                    bgcolor: 'background.paper',
                                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                                }}
                                            >
                                                <Typography variant="body2" color="text.secondary" mb={1}>
                                                    Users with Companies
                                                </Typography>
                                                <Typography variant="h4" fontWeight="700" color="info.main">
                                                    {stats.withCompanies} / {stats.total}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Paper
                                                sx={{
                                                    p: 2.5,
                                                    bgcolor: 'background.paper',
                                                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                                }}
                                            >
                                                <Typography variant="body2" color="text.secondary" mb={1}>
                                                    Admin to User Ratio
                                                </Typography>
                                                <Typography variant="h4" fontWeight="700" color="secondary.main">
                                                    1:{((stats.total - stats.admins) / stats.admins).toFixed(1)}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Box>
                    </Fade>
                )}
            </Box>

            {/* Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        minWidth: 180,
                        borderRadius: 2,
                        mt: 1
                    }
                }}
            >
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <Visibility fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>View Details</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                        <Edit fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit User</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <Delete fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete User</ListItemText>
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default UserAdminDashboard;