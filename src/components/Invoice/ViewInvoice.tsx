import { useState, useCallback } from 'react';
import {
    Box,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Container,
    Skeleton,
    Divider,
    Card,
    CardContent,
    IconButton,
    Tooltip,
    useTheme,
    useMediaQuery,
    alpha,
    Chip,
    Paper,
    Stack,
    Fade,
    Zoom,
    Avatar,
    LinearProgress,
    Snackbar,
    Alert
} from '@mui/material';
import {
    Print,
    Download,
    Share,
    Delete,
    Edit,
    Receipt,
    Person,
    CalendarToday,
    AttachMoney,
    Business,
    Phone,
    Email,
    LocationOn,
    Assessment,
    CheckCircle,
    Warning,
    ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/store/store';
import { formatDate } from '@/utils/functions';

interface InvoiceItem {
    id: string;
    name: string;
    hsn: string;
    quantity: number;
    rate: number;
    gstRate: number;
    gstAmount: number;
    totalAmount: number;
}

interface InvoiceData {
    id: string;
    invoiceNumber: string;
    date: string;
    status: 'paid' | 'pending' | 'overdue' | 'cancelled';
    customer: {
        name: string;
        type: string;
        address: string;
        city: string;
        state: string;
        phone: string;
        email: string;
    };
    summary: {
        subtotal: number;
        discount: number;
        totalTax: number;
        additionalCharges: number;
        grandTotal: number;
    };
    items: InvoiceItem[];
}

export const ViewInvoiceInfo = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    // const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
    // const { orderId } = useParams();
    // const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    // const { user } = useSelector((state: RootState) => state.auth);

    const [isLoading, _setLoading] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'warning' | 'info'
    });

    // Mock data - replace with actual data fetching
    const invoiceData: InvoiceData = {
        id: 'PUR-0001',
        invoiceNumber: 'PUR-0001',
        date: '2025-03-02',
        status: 'paid',
        customer: {
            name: 'Tohid Khan',
            type: 'Creditors',
            address: 'Near JNV Rajsamand',
            city: 'Rajsamand',
            state: 'Rajasthan',
            phone: '+91 1234567890',
            email: 'tohid.khan@example.com'
        },
        summary: {
            subtotal: 1200,
            discount: 0,
            totalTax: 120,
            additionalCharges: 0,
            grandTotal: 1320
        },
        items: [
            {
                id: '1',
                name: 'HLV HF DLX',
                hsn: '123212',
                quantity: 10,
                rate: 120,
                gstRate: 10,
                gstAmount: 120,
                totalAmount: 1320
            }
        ]
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid': return 'success';
            case 'pending': return 'warning';
            case 'overdue': return 'error';
            case 'cancelled': return 'default';
            default: return 'default';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid': return <CheckCircle fontSize="small" />;
            case 'pending': return <Warning fontSize="small" />;
        }
    };

    const handleAction = useCallback((action: string) => {
        setSnackbar({
            open: true,
            message: `${action} action initiated successfully`,
            severity: 'info'
        });
    }, []);

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    type PaletteColor = 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';

    const ActionButton = ({
        icon,
        title,
        color,
        onClick
    }: {
        icon: React.ReactNode;
        title: string;
        color: PaletteColor;
        onClick: () => void;
    }) => (
        <Tooltip title={title} arrow placement="top">
            <IconButton
                size={isMobile ? "small" : "medium"}
                onClick={onClick}
                sx={{
                    bgcolor: alpha(theme.palette[color].main, 0.1),
                    color: theme.palette[color].main,
                    border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        bgcolor: alpha(theme.palette[color].main, 0.15),
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 12px ${alpha(theme.palette[color].main, 0.3)}`,
                    },
                }}
            >
                {icon}
            </IconButton>
        </Tooltip>
    );

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* Enhanced Header */}
            <Fade in timeout={800}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 3,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        borderRadius: 2
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        justifyContent: 'space-between',
                        alignItems: isMobile ? 'flex-start' : 'center',
                        gap: 2
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton
                                onClick={() => navigate(-1)}
                                sx={{
                                    bgcolor: alpha(theme.palette.grey[500], 0.1),
                                    '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.2) }
                                }}
                            >
                                <ArrowBack />
                            </IconButton>
                            <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 48, height: 48 }}>
                                <Receipt />
                            </Avatar>
                            <Box>
                                {isLoading ? (
                                    <Skeleton width={200} height={40} />
                                ) : (
                                    <>
                                        <Typography variant="h4" component="h1" fontWeight="bold">
                                            Invoice {invoiceData.invoiceNumber}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                            <CalendarToday fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                Created on {formatDate(invoiceData.date)}
                                            </Typography>
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </Box>

                        {/* Action Buttons */}
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            <ActionButton
                                icon={<Edit fontSize="small" />}
                                title="Edit Invoice"
                                color="primary"
                                onClick={() => handleAction('Edit')}
                            />
                            <ActionButton
                                icon={<Download fontSize="small" />}
                                title="Download Invoice"
                                color="info"
                                onClick={() => handleAction('Download')}
                            />
                            <ActionButton
                                icon={<Share fontSize="small" />}
                                title="Share Invoice"
                                color="warning"
                                onClick={() => handleAction('Share')}
                            />
                            <ActionButton
                                icon={<Print fontSize="small" />}
                                title="Print Invoice"
                                color="success"
                                onClick={() => handleAction('Print')}
                            />
                            <ActionButton
                                icon={<Delete fontSize="small" />}
                                title="Delete Invoice"
                                color="error"
                                onClick={() => handleAction('Delete')}
                            />
                        </Stack>
                    </Box>
                </Paper>
            </Fade>

            {/* Main Content Grid */}
            <Grid container spacing={3}>
                {/* Invoice Information */}
                <Grid item xs={12} lg={4}>
                    <Zoom in timeout={600}>
                        <Card
                            variant="outlined"
                            sx={{
                                height: '100%',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: theme.shadows[4],
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Assessment color="primary" />
                                    <Typography variant="h6" fontWeight="bold">
                                        Invoice Information
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 3 }} />

                                {isLoading ? (
                                    <Box sx={{ '& > *': { mb: 2 } }}>
                                        {[...Array(4)].map((_, index) => (
                                            <Skeleton key={index} height={60} />
                                        ))}
                                    </Box>
                                ) : (
                                    <Stack spacing={3}>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Invoice Status
                                            </Typography>
                                            {getStatusIcon(invoiceData.status) ? (
                                                <Chip
                                                    icon={getStatusIcon(invoiceData.status)}
                                                    label={invoiceData.status.toUpperCase()}
                                                    color={getStatusColor(invoiceData.status) as any}
                                                    variant="filled"
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            ) : (
                                                <Chip
                                                    label={invoiceData.status.toUpperCase()}
                                                    color={getStatusColor(invoiceData.status) as any}
                                                    variant="filled"
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            )}
                                        </Box>

                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Invoice Date
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {formatDate(invoiceData.date)}
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Last Updated
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {formatDate(invoiceData.date)}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                )}
                            </CardContent>
                        </Card>
                    </Zoom>
                </Grid>

                {/* Customer Information */}
                <Grid item xs={12} lg={4}>
                    <Zoom in timeout={800}>
                        <Card
                            variant="outlined"
                            sx={{
                                height: '100%',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: theme.shadows[4],
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Person color="primary" />
                                    <Typography variant="h6" fontWeight="bold">
                                        Bill To
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 3 }} />

                                {isLoading ? (
                                    <Box sx={{ '& > *': { mb: 2 } }}>
                                        {[...Array(5)].map((_, index) => (
                                            <Skeleton key={index} height={40} />
                                        ))}
                                    </Box>
                                ) : (
                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                {invoiceData.customer.name}
                                            </Typography>
                                            <Chip
                                                label={invoiceData.customer.type}
                                                size="small"
                                                color="secondary"
                                                variant="outlined"
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                            <LocationOn fontSize="small" color="action" sx={{ mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    {invoiceData.customer.address}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {invoiceData.customer.city}, {invoiceData.customer.state}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Phone fontSize="small" color="action" />
                                            <Typography variant="body2">
                                                {invoiceData.customer.phone}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Email fontSize="small" color="action" />
                                            <Typography variant="body2">
                                                {invoiceData.customer.email}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                )}
                            </CardContent>
                        </Card>
                    </Zoom>
                </Grid>

                {/* Invoice Summary */}
                <Grid item xs={12} lg={4}>
                    <Zoom in timeout={1000}>
                        <Card
                            variant="outlined"
                            sx={{
                                height: '100%',
                                background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: theme.shadows[4],
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <AttachMoney color="primary" />
                                    <Typography variant="h6" fontWeight="bold">
                                        Invoice Summary
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 3 }} />

                                {isLoading ? (
                                    <Box sx={{ '& > *': { mb: 2 } }}>
                                        {[...Array(6)].map((_, index) => (
                                            <Skeleton key={index} height={40} />
                                        ))}
                                    </Box>
                                ) : (
                                    <Stack spacing={2}>
                                        {[
                                            { label: 'Sub-total', value: `₹${invoiceData.summary.subtotal}` },
                                            { label: 'Discount', value: `₹${invoiceData.summary.discount}` },
                                            { label: 'Total Tax', value: `₹${invoiceData.summary.totalTax}` },
                                            { label: 'Additional Charges', value: `₹${invoiceData.summary.additionalCharges}` }
                                        ].map((item, index) => (
                                            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.label}
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {item.value}
                                                </Typography>
                                            </Box>
                                        ))}

                                        <Divider />

                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            p: 2,
                                            bgcolor: alpha(theme.palette.success.main, 0.1),
                                            borderRadius: 1
                                        }}>
                                            <Typography variant="h6" fontWeight="bold">
                                                Grand Total
                                            </Typography>
                                            <Typography variant="h6" fontWeight="bold" color="success.main">
                                                ₹{invoiceData.summary.grandTotal}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                )}
                            </CardContent>
                        </Card>
                    </Zoom>
                </Grid>

                {/* Products Table */}
                <Grid item xs={12}>
                    <Fade in timeout={1200}>
                        <Card variant="outlined">
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                    <Business color="primary" />
                                    <Typography variant="h6" fontWeight="bold">
                                        Invoice Items
                                    </Typography>
                                </Box>

                                {isLoading ? (
                                    <>
                                        <LinearProgress sx={{ mb: 2 }} />
                                        <Box sx={{ '& > *': { mb: 2 } }}>
                                            {[...Array(3)].map((_, index) => (
                                                <Skeleton key={index} height={60} />
                                            ))}
                                        </Box>
                                    </>
                                ) : (
                                    <TableContainer
                                        component={Paper}
                                        variant="outlined"
                                        sx={{
                                            maxHeight: 600,
                                            borderRadius: 2,
                                            '& .MuiTableHead-root': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.05)
                                            }
                                        }}
                                    >
                                        <Table stickyHeader size={isMobile ? "small" : "medium"}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>HSN/SAC</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Qty</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Rate (₹)</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Price (₹)</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>GST %</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>GST (₹)</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total (₹)</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {invoiceData.items.map((item, index) => (
                                                    <TableRow
                                                        key={item.id + index}
                                                        hover
                                                        sx={{
                                                            '&:hover': {
                                                                bgcolor: alpha(theme.palette.primary.main, 0.02)
                                                            }
                                                        }}
                                                    >
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {item.name}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Chip
                                                                label={item.hsn}
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {item.quantity}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">₹{item.rate}</TableCell>
                                                        <TableCell align="right">₹{item.rate * item.quantity}</TableCell>
                                                        <TableCell align="center">
                                                            <Chip
                                                                label={`${item.gstRate}%`}
                                                                size="small"
                                                                color="info"
                                                                variant="filled"
                                                            />
                                                        </TableCell>
                                                        <TableCell align="right">₹{item.gstAmount}</TableCell>
                                                        <TableCell align="right">
                                                            <Typography variant="body1" fontWeight="bold" color="success.main">
                                                                ₹{item.totalAmount}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}

                                                {/* Total Row */}
                                                <TableRow sx={{ bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                                                    <TableCell colSpan={7} align="right" sx={{ fontWeight: 'bold', fontSize: '1.1em' }}>
                                                        Grand Total:
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.2em', color: 'success.main' }}>
                                                        ₹{invoiceData.summary.grandTotal}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </CardContent>
                        </Card>
                    </Fade>
                </Grid>
            </Grid>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};
