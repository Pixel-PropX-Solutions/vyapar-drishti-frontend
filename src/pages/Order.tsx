import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Box,
    Button,
    Container,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
    Chip,
    Tooltip,
    CircularProgress,
    Snackbar,
    Alert,
    Card,
    CardContent,
    Stack,
} from '@mui/material';
import { Add, Visibility, Search, RefreshOutlined } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { viewOrders } from '@/services/order';
import { Order, OrderStatus } from '@/utils/types';
import { formatDate } from '@/utils/functions';

const OrdersPage: React.FC = () => {
    // Redux
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { orderData } = useSelector((state: RootState) => state.order);

    // State
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [dateFilter, setDateFilter] = useState<Date | null>(null);
    const [snackbar, setSnackbar] = useState<{
        open: boolean,
        message: string,
        severity: 'success' | 'error' | 'info' | 'warning'
    }>({
        open: false,
        message: '',
        severity: 'info'
    });

    const navigate = useNavigate();
    const userId = user?.UserData?._id ?? "";

    // Fetch orders data
    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(viewOrders(userId));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setSnackbar({
                    open: true,
                    message: 'Failed to load orders data',
                    severity: 'error'
                });
                setLoading(false);
            }
        };

        if (userId) {
            fetchData();
        }
    }, [userId, dispatch]);

    // Update orders when orderData changes
    useEffect(() => {
        if (orderData) {
            setOrders(orderData);
        }
    }, [orderData]);

    // Memoized filtered orders to prevent unnecessary re-computation
    const filteredOrders = useMemo(() => {
        let filtered = orders;

        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(order =>
                order._id.includes(searchTerm) ||
                order.Stockist.name.first_name.toLowerCase().includes(lowerCaseSearch) ||
                order.Stockist.name.middle_name?.toLowerCase().includes(lowerCaseSearch) ||
                order.Stockist.name.last_name?.toLowerCase().includes(lowerCaseSearch)
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        if (dateFilter) {
            filtered = filtered.filter(order => {
                const orderDate = new Date(order.order_date);
                return orderDate.toDateString() === dateFilter.toDateString();
            });
        }

        return filtered;
    }, [searchTerm, statusFilter, dateFilter, orders]);

    // Handle pagination
    const handleChangePage = useCallback((_: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    // Reset filters
    const handleResetFilters = useCallback(() => {
        setSearchTerm('');
        setStatusFilter('');
        setDateFilter(null);
    }, []);

    // Handle close snackbar
    const handleCloseSnackbar = useCallback(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
    }, []);

    // Navigate to create order page
    const handleCreateOrder = useCallback(() => {
        navigate("/orders/create");
    }, [navigate]);

    // Navigate to order details page
    const handleViewOrder = useCallback((orderId: string) => {
        navigate(`/orders/${orderId}`);
    }, [navigate]);

    // Status chip color mapping
    const getStatusColor = useCallback((status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING:
                return 'warning';
            case OrderStatus.SHIPPED:
                return 'success';
            case OrderStatus.CANCELLED:
                return 'error';
            default:
                return 'default';
        }
    }, []);

    // Get full name helper function
    const getFullName = useCallback((nameObj: {
        first_name: string,
        middle_name?: string,
        last_name?: string
    }) => {
        return `${nameObj.first_name} ${nameObj.middle_name || ''} ${nameObj.last_name || ''}`.trim();
    }, []);

    return (
        <Container maxWidth="xl">
            <Box sx={{ my: 4 }}>
                {/* Header */}
                <Card sx={{ mb: 3, p: 2, }}>
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h4" component="h1">
                                Orders Management
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Add />}
                                onClick={handleCreateOrder}
                                sx={{ fontWeight: 'bold' }}
                            >
                                New Order
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Search Bar and Filter Toggle */}
                <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center" justifyContent={'space-between'}>
                        <Grid item xs={12} sm={4} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Search by Order ID or Stockist Name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: <Search color="action" sx={{ mr: 1 }} />
                                }}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                select
                                size="small"
                                onChange={(e) => setStatusFilter(e.target.value)}
                                name="status"
                                id="status"
                                label="Status"
                                value={statusFilter}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value={OrderStatus.PENDING}>{OrderStatus.PENDING}</MenuItem>
                                <MenuItem value={OrderStatus.SHIPPED}>{OrderStatus.SHIPPED}</MenuItem>
                                <MenuItem value={OrderStatus.CANCELLED}>{OrderStatus.CANCELLED}</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Filter by Date"
                                    value={dateFilter}
                                    format="dd/MM/yyyy"
                                    views={["year", "month", "day"]}
                                    onChange={(newValue) => setDateFilter(newValue)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            size: 'small',
                                            sx: {
                                                '& .MuiInputAdornment-root .MuiButtonBase-root': {
                                                    border: 'none',
                                                    boxShadow: 'none'
                                                }
                                            }
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="outlined"
                                color="primary"
                                size='small'
                                startIcon={<RefreshOutlined />}
                                onClick={handleResetFilters}
                                sx={{ fontWeight: 'bold', py: 1.5 }}
                            >
                                Reset Filters
                            </Button>
                        </Grid>
                    </Grid>

                </Paper>

                {/* Orders Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ border: '2px solid', borderColor: 'success.light', }}>
                            <CardContent>
                                <Grid container justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6" color="text.secondary">Total Orders  </Typography>
                                    <Typography variant="h4">{orders.length}</Typography>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ border: '2px solid', borderColor: 'warning.light', }}>
                            <CardContent>
                                <Grid container justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6" color="text.secondary">Pending Orders</Typography>
                                    <Typography variant="h4">
                                        {orders.filter(order => order.status === OrderStatus.PENDING).length}
                                    </Typography>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ border: '2px solid', borderColor: 'info.light' }}>
                            <CardContent>
                                <Grid container justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6" color="text.secondary">Shipped Orders</Typography>
                                    <Typography variant="h4">
                                        {orders.filter(order => order.status === OrderStatus.SHIPPED).length}
                                    </Typography>
                                </Grid>

                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Orders Table */}
                <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 6 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <TableContainer sx={{ maxHeight: 850 }}>
                                <Table stickyHeader aria-label="orders table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Sr. No.</TableCell>
                                            <TableCell>Order ID</TableCell>
                                            <TableCell>Stockist</TableCell>
                                            <TableCell>Chemist</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="right">Total Amount(₹)</TableCell>
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredOrders.length > 0 ? (
                                            filteredOrders
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((order, index) => (
                                                    <TableRow
                                                        key={order._id}
                                                        hover
                                                        sx={{
                                                            cursor: 'pointer',
                                                            '&:hover': { bgcolor: 'action.hover' }
                                                        }}
                                                        onClick={() => handleViewOrder(order._id)}
                                                    >
                                                        <TableCell>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{ whiteSpace: "nowrap", display: "flex", justifyContent: "center" }}
                                                            >
                                                                {page * rowsPerPage + index + 1}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {order._id}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            {getFullName(order?.Stockist?.name)}
                                                        </TableCell>
                                                        <TableCell>
                                                            {user?.UserData ? getFullName(user.UserData.name) : 'N/A'}
                                                        </TableCell>
                                                        <TableCell>{formatDate(order.order_date)}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={order.status}
                                                                color={getStatusColor(order.status) as "warning" | "success" | "error" | "default"}
                                                                size="medium"
                                                                sx={{ fontWeight: 'medium' }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography fontWeight="medium">
                                                                ₹ {order.total_amount.toFixed(2)}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Tooltip title="View Details">
                                                                <IconButton
                                                                    aria-label="view"
                                                                    color="primary"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleViewOrder(order._id);
                                                                    }}
                                                                    size="small"
                                                                >
                                                                    <Visibility />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center" sx={{ py: 2 }}>
                                                    <Paper sx={{ p: 0, mt: 0, textAlign: 'center' }}>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                            <Box sx={{
                                                                bgcolor: 'primary.light',
                                                                borderRadius: '50%',
                                                                p: 2,
                                                                mb: 2
                                                            }}>
                                                                <Add sx={{ fontSize: 40, color: 'primary.main' }} />
                                                            </Box>
                                                            <Typography variant="h5" gutterBottom>
                                                                No Orders Yet
                                                            </Typography>
                                                            <Typography variant="body1" color="text.secondary" paragraph>
                                                                You haven't created any orders yet. Start by creating your first order.
                                                            </Typography>
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                startIcon={<Add />}
                                                                onClick={handleCreateOrder}
                                                                sx={{ mt: 2 }}
                                                            >
                                                                Create First Order
                                                            </Button>
                                                        </Box>
                                                    </Paper>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                component="div"
                                count={filteredOrders.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelDisplayedRows={({ from, to, count }) =>
                                    `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
                                }
                                sx={{ borderTop: 1, borderColor: 'divider' }}
                            />
                        </>
                    )}
                </Paper>
            </Box>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container >
    );
};

export default OrdersPage;