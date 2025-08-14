import { useState, useCallback, useEffect } from 'react';
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
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { formatDate } from '@/utils/functions';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { ActionButton } from '@/common/buttons/ActionButton';
import toast from 'react-hot-toast';
import { viewInvoice } from '@/services/invoice';


export const ViewInvoiceInfo = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { invoice_id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const { current_company_id, user } = useSelector((state: RootState) => state.auth);
    const { invoiceData } = useSelector((state: RootState) => state.invoice);
    const currentCompanyDetails = user?.company?.find((company: any) => company._id === current_company_id);
    const gst_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_gst;

    const [isLoading, _setLoading] = useState<boolean>(false);

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

    useEffect(() => {
        dispatch(viewInvoice({ vouchar_id: invoice_id || '', company_id: current_company_id || '' }))
    }, [current_company_id, dispatch, invoice_id]);
    const handleAction = useCallback((action: string) => {
        toast.success(`${action} action initiated successfully`);
    }, []);

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {/* Enhanced Header */}
            <Fade in timeout={800}>
                <Paper
                    elevation={0}
                    sx={{
                        px: 3,
                        py: 1,
                        mb: 2,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                        borderRadius: 1
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
                            <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 40, height: 40 }}>
                                <Receipt />
                            </Avatar>
                            <Box>
                                {isLoading ? (
                                    <Skeleton width={200} height={40} />
                                ) : (
                                    <>
                                        <Typography variant="h6" fontWeight="bold">
                                            Invoice {invoiceData?.voucher_number || 'Loading...'}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CalendarToday fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                Created on {formatDate(invoiceData?.date || '')}
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
                        <Card variant="outlined" >
                            <CardContent sx={{ p: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Assessment color="primary" />
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Invoice Information
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 1 }} />

                                {isLoading ? (
                                    <Box sx={{ '& > *': { mb: 2 } }}>
                                        {[...Array(4)].map((_, index) => (
                                            <Skeleton key={index} height={60} />
                                        ))}
                                    </Box>
                                ) : (
                                    <Stack spacing={2}>
                                        {invoiceData?.status && <Box>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Invoice Status
                                            </Typography>
                                            {getStatusIcon(invoiceData?.status || '') ? (
                                                <Chip
                                                    icon={getStatusIcon(invoiceData?.status || '')}
                                                    label={invoiceData?.status.toUpperCase()}
                                                    color={getStatusColor(invoiceData?.status || '') as any}
                                                    variant="filled"
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            ) : (
                                                <Chip
                                                    label={invoiceData?.status.toUpperCase()}
                                                    color={getStatusColor(invoiceData?.status || '') as any}
                                                    variant="filled"
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            )}
                                        </Box>}

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Invoice Date
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {formatDate(invoiceData?.date || '')}
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Last Updated
                                                </Typography>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {formatDate(invoiceData?.updated_at || '')}
                                                </Typography>
                                            </Box>
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
                        <Card variant="outlined" >
                            <CardContent sx={{ p: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Person color="primary" />
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            Bill To
                                        </Typography>
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight="bold" >
                                        {invoiceData?.party_details?.ledger_name || ''}
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 1 }} />

                                {isLoading ? (
                                    <Box sx={{ '& > *': { mb: 2 } }}>
                                        {[...Array(5)].map((_, index) => (
                                            <Skeleton key={index} height={40} />
                                        ))}
                                    </Box>
                                ) : (
                                    <Stack spacing={2}>
                                        {invoiceData?.party_details?.mailing_address && <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                            <LocationOn fontSize="small" color="action" sx={{ mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    {invoiceData?.party_details?.mailing_address || ''}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {invoiceData?.party_details?.mailing_state}, {invoiceData?.party_details?.mailing_country || ''}
                                                </Typography>
                                            </Box>
                                        </Box>}

                                        {invoiceData?.party_details?.phone?.number && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Phone fontSize="small" color="action" />
                                            <Typography variant="body2">
                                                {invoiceData?.party_details?.phone?.code || ''} {invoiceData?.party_details?.phone?.number || ''}
                                            </Typography>
                                        </Box>}

                                        {invoiceData?.party_details?.email && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Email fontSize="small" color="action" />
                                            <Typography variant="body2">
                                                {invoiceData?.party_details?.email || ''}
                                            </Typography>
                                        </Box>}
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
                            }}
                        >
                            <CardContent sx={{ p: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <AttachMoney color="primary" />
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Invoice Summary
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 1 }} />

                                {isLoading ? (
                                    <Box sx={{ '& > *': { mb: 2 } }}>
                                        {[...Array(6)].map((_, index) => (
                                            <Skeleton key={index} height={40} />
                                        ))}
                                    </Box>
                                ) : (
                                    <Stack spacing={1}>
                                        {[
                                            { label: 'Sub-total', value: `₹${invoiceData?.inventory?.reduce((acc, item) => acc + item.amount, 0)}` },
                                            // { label: 'Discount', value: `₹${invoiceData.summary.discount}` },
                                            // { label: 'Total Tax', value: `₹${invoiceData.summary.totalTax}` },
                                            // { label: 'Additional Charges', value: `₹${invoiceData.summary.additionalCharges}` }
                                        ].map((item, index) => (
                                            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="inherit" color="text.secondary">
                                                    {item.label}
                                                </Typography>
                                                <Typography variant="inherit" fontWeight="medium">
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
                                                ₹{Math.abs(invoiceData?.accounting_entries.find(entry => entry.ledger === invoiceData?.party_name)?.amount || 0)}
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
                            <CardContent sx={{ p: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
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
                                            borderRadius: 1,
                                            '& .MuiTableHead-root': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.05)
                                            }
                                        }}
                                    >
                                        <Table stickyHeader size={isMobile ? "small" : "medium"}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                                                    {gst_enable && <TableCell align="center" sx={{ fontWeight: 'bold' }}>HSN/SAC</TableCell>}
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Qty</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Rate (₹)</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Price (₹)</TableCell>
                                                    {gst_enable && <TableCell align="center" sx={{ fontWeight: 'bold' }}>GST %</TableCell>}
                                                    {gst_enable && <TableCell align="right" sx={{ fontWeight: 'bold' }}>GST (₹)</TableCell>}
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total (₹)</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {invoiceData?.inventory.map((item, index) => (
                                                    <TableRow
                                                        key={item._id + index}
                                                        hover
                                                        sx={{
                                                            '&:hover': {
                                                                bgcolor: alpha(theme.palette.primary.main, 0.02)
                                                            }
                                                        }}
                                                    >
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {item.item}
                                                            </Typography>
                                                        </TableCell>
                                                        {gst_enable && <TableCell align="center">
                                                            <Chip
                                                                label={item.hsn_code}
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        </TableCell>}
                                                        <TableCell align="center">
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {item.quantity}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">₹{item.rate}</TableCell>
                                                        <TableCell align="right">₹{item.rate * item.quantity}</TableCell>
                                                        {gst_enable && <TableCell align="center">
                                                            <Chip
                                                                label={`${item.gst}%`}
                                                                size="small"
                                                                color="info"
                                                                variant="filled"
                                                            />
                                                        </TableCell>}
                                                        {gst_enable && <TableCell align="right">₹{(parseFloat(item.gst_amount ?? '') ?? 0).toFixed(2)}</TableCell>}
                                                        <TableCell align="right">
                                                            <Typography variant="body1" fontWeight="bold" color="success.main">
                                                                ₹{(item.amount ?? 0).toFixed(2)}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}

                                                {/* Total Row */}
                                                <TableRow sx={{ bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                                                    <TableCell colSpan={gst_enable ? 7 : 4} align="right" sx={{ fontWeight: 'bold', fontSize: '1.1em' }}>
                                                        Grand Total:
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.2em', color: 'success.main' }}>
                                                        ₹{Math.abs(invoiceData?.accounting_entries.find(entry => entry.ledger === invoiceData?.party_name)?.amount || 0)}
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
        </Container>
    );
};
