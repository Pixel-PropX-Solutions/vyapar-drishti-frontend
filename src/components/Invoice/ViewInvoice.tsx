import { useState, useEffect, useMemo } from 'react';
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
    ArrowBack,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDate } from '@/utils/functions';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { ActionButton } from '@/common/buttons/ActionButton';
import toast from 'react-hot-toast';
import { deleteInvoice, deleteTAXInvoice, getInvoicesPDF, getPaymentPdf, getRecieptPdf, getTaxInvoicesPDF, viewInvoice } from '@/services/invoice';
import usePDFHandler from '@/common/hooks/usePDFHandler';
import BackDropLoading from '@/common/loaders/BackDropLoading';


export const ViewInvoiceInfo = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { invoice_id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const [visible, setVisible] = useState<boolean>(false);
    const { current_company_id, user } = useSelector((state: RootState) => state.auth);
    const { invoiceData, isInvoiceFecthing } = useSelector((state: RootState) => state.invoice);
    const currentCompanyDetails = user?.company?.find((company: any) => company._id === current_company_id);
    const tax_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_tax;

    const { init, setLoading, PDFViewModal, handleShare, handleDownload, handlePrint, isLoading } = usePDFHandler();


    async function handleInvoice(invoice: any, callback: () => void) {

        try {
            setLoading(true);
            const res = await dispatch(
                (invoice.voucher_type === 'Payment' ? getPaymentPdf :
                    invoice.voucher_type === 'Receipt' ? getRecieptPdf :
                        tax_enable ? getTaxInvoicesPDF : getInvoicesPDF)({
                            vouchar_id: invoice._id,
                            company_id: current_company_id || '',
                        }));

            if (res.meta.requestStatus === 'fulfilled') {
                const { pdfUrl } = res.payload as { pdfUrl: string };

                // ✅ Rebuild File from URL when needed
                const blob = await fetch(pdfUrl).then((r) => r.blob());
                const file1 = new File([blob], `${invoice._id}.pdf`, {
                    type: "application/pdf",
                });

                init({ file: file1, entityNumber: invoice.voucher_number, title: invoice.party_name, fileName: `${invoice.voucher_number}-vyapar-drishti` }, callback);
            } else {
                console.error('Failed to print invoice:', res.payload);
                return;
            }

        } catch (e) {
            console.error('Error printing invoice:', e);
        } finally {
            setLoading(false);
        }
    }


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

    const handleAction = (invoiceId: string, voucher_type: string) => {
        if (voucher_type === 'Purchase' || voucher_type !== "Sales") {
            navigate(`/invoices/update/${voucher_type.toLowerCase()}/${invoiceId}`);
        }
    };

    const handleDeleteInvoice = (invoiceId: string) => {
        if (tax_enable) {
            dispatch(deleteTAXInvoice({ vouchar_id: invoiceId, company_id: currentCompanyDetails?._id ?? '' })).unwrap().then(() => {
                navigate("/invoices")
                toast.success("Invoice deleted successfully!");
            }).catch((error) => {
                toast.error(error || 'An unexpected error occurred. Please try again later.');
            })
        } else {
            dispatch(deleteInvoice({ vouchar_id: invoiceId, company_id: currentCompanyDetails?._id ?? '' })).unwrap().then(() => {
                toast.success("Invoice deleted successfully!");
                navigate("/invoices")
            }).catch((error) => {
                toast.error(error || 'An unexpected error occurred. Please try again later.');
            })
        }
    };

    const sortedInventory = useMemo(
        () => [...(invoiceData?.inventory ?? [])].sort((a, b) => a.order_index - b.order_index),
        [invoiceData]
    );

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
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <ActionButton
                                    icon={<ArrowBack fontSize="small" />}
                                    title="Back"
                                    color="primary"
                                    onClick={() => navigate(-1)}
                                />
                                <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 40, height: 40 }}>
                                    <Receipt />
                                </Avatar>
                            </Box>
                            <Box>
                                {isInvoiceFecthing ? (
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
                                onClick={() => handleAction(invoiceData?._id ?? '', invoiceData?.voucher_type ?? '')}
                            />
                            <ActionButton
                                icon={<Download fontSize="small" />}
                                title="Download Invoice"
                                color="info"
                                onClick={() => { handleInvoice(invoiceData, () => { handleDownload(); }) }}
                            />
                            <ActionButton
                                icon={<Share fontSize="small" />}
                                title="Share Invoice"
                                color="warning"
                                onClick={() => { handleInvoice(invoiceData, () => { handleShare(); }) }}
                            />
                            <ActionButton
                                icon={<Print fontSize="small" />}
                                title="Print Invoice"
                                color="success"
                                onClick={() => { handleInvoice(invoiceData, () => { handlePrint(); }) }}
                            />
                            <ActionButton
                                icon={<Delete fontSize="small" />}
                                title="Delete Invoice"
                                color="error"
                                onClick={() => handleDeleteInvoice(invoiceData?._id ?? '')}
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

                                {isInvoiceFecthing ? (
                                    <Box sx={{ '& > *': { mb: 2 } }}>
                                        {[...Array(4)].map((_, index) => (
                                            <Skeleton key={index} height={60} />
                                        ))}
                                    </Box>
                                ) : (
                                    <Stack spacing={2}>
                                        {invoiceData?.payment_mode && <Box>
                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                Invoice Status
                                            </Typography>
                                            {getStatusIcon(invoiceData?.payment_mode || '') ? (
                                                <Chip
                                                    icon={getStatusIcon(invoiceData?.payment_mode || '')}
                                                    label={invoiceData?.payment_mode.toUpperCase()}
                                                    color={getStatusColor(invoiceData?.payment_mode || '') as any}
                                                    variant="filled"
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            ) : (
                                                <Chip
                                                    label={invoiceData?.payment_mode.toUpperCase()}
                                                    color={getStatusColor(invoiceData?.payment_mode || '') as any}
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

                                {isInvoiceFecthing ? (
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

                                {isInvoiceFecthing ? (
                                    <Box sx={{ '& > *': { mb: 2 } }}>
                                        {[...Array(6)].map((_, index) => (
                                            <Skeleton key={index} height={40} />
                                        ))}
                                    </Box>
                                ) : (
                                    <Stack spacing={1}>
                                        {[
                                            // { label: 'Sub-total', value: `₹ ${invoiceData?.total_amount}` },
                                            // { label: 'Discount', value: `₹ ${invoiceData?.discount}` },
                                            { label: 'Total Amount', value: `₹ ${invoiceData?.total}` },
                                            { label: 'Total Tax', value: `₹ ${invoiceData?.total_tax}` },
                                            // { label: 'Additional Charges', value: `₹ ${invoiceData?.additional_charge}` }
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
                                                ₹{Math.abs(invoiceData?.grand_total ?? 0)}
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

                                {isInvoiceFecthing ? (
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
                                                    {tax_enable && <TableCell align="center" sx={{ fontWeight: 'bold' }}>HSN/SAC</TableCell>}
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Qty</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Rate (₹)</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Price (₹)</TableCell>
                                                    {tax_enable && <TableCell align="center" sx={{ fontWeight: 'bold' }}>TAX %</TableCell>}
                                                    {tax_enable && <TableCell align="right" sx={{ fontWeight: 'bold' }}>TAX (₹)</TableCell>}
                                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total (₹)</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {sortedInventory.map((item, index) => (
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
                                                        {tax_enable && <TableCell align="center">
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
                                                        {tax_enable && <TableCell align="center">
                                                            <Chip
                                                                label={`${item.tax_rate}%`}
                                                                size="small"
                                                                color="info"
                                                                variant="filled"
                                                            />
                                                        </TableCell>}
                                                        {tax_enable && <TableCell align="right">₹{(item.tax_amount ?? 0).toFixed(2)}</TableCell>}
                                                        <TableCell align="right">
                                                            <Typography variant="body1" fontWeight="bold" color="success.main">
                                                                ₹{(item.amount ?? 0).toFixed(2)}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}

                                                <TableRow sx={{
                                                    "& .MuiTableCell-root": {
                                                        padding: '8px 16px',
                                                    },
                                                }}>
                                                    <TableCell colSpan={tax_enable ? 7 : 4} align="right">
                                                    </TableCell>
                                                    <TableCell align="right" >
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow sx={{
                                                    bgcolor: alpha(theme.palette.success.light, 0.05),
                                                    "& .MuiTableCell-root": {
                                                        padding: '8px 16px',
                                                    },
                                                }}>
                                                    <TableCell colSpan={tax_enable ? 7 : 4} align="right">
                                                        Sub-Total:
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ color: 'success.main' }}>
                                                        ₹{Math.abs(invoiceData?.total_amount || 0)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow sx={{
                                                    bgcolor: alpha(theme.palette.success.light, 0.05),
                                                    "& .MuiTableCell-root": {
                                                        padding: '8px 16px',
                                                    },
                                                }}>
                                                    <TableCell colSpan={tax_enable ? 7 : 4} align="right">
                                                        Discount Total:
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ color: 'success.main' }}>
                                                        ₹{Math.abs(invoiceData?.discount || 0)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow sx={{
                                                    bgcolor: alpha(theme.palette.success.light, 0.05),
                                                    "& .MuiTableCell-root": {
                                                        padding: '8px 16px',
                                                    },
                                                }}>
                                                    <TableCell colSpan={tax_enable ? 7 : 4} align="right">
                                                        Total :
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ color: 'success.main' }}>
                                                        ₹{Math.abs(invoiceData?.total || 0)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow sx={{
                                                    bgcolor: alpha(theme.palette.success.light, 0.05),
                                                    "& .MuiTableCell-root": {
                                                        padding: '8px 16px',
                                                    },
                                                }}>
                                                    <TableCell colSpan={tax_enable ? 7 : 4} align="right" >
                                                        Total Tax:
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ color: 'success.main' }}>
                                                        ₹{Math.abs(invoiceData?.total_tax || 0)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow sx={{
                                                    bgcolor: alpha(theme.palette.success.light, 0.05),
                                                    "& .MuiTableCell-root": {
                                                        padding: '8px 16px',
                                                    },
                                                }}>
                                                    <TableCell colSpan={tax_enable ? 7 : 4} align="right">
                                                        Additional Charges:
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ color: 'success.main' }}>
                                                        ₹{Math.abs(invoiceData?.additional_charge || 0)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow sx={{ bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                                                    <TableCell colSpan={tax_enable ? 7 : 4} align="right" sx={{ fontWeight: 'bold', fontSize: '1.1em' }}>
                                                        Grand Total:
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.2em', color: 'success.main' }}>
                                                        ₹{Math.abs(invoiceData?.grand_total || 0)}
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

            {visible && <PDFViewModal visible={visible} setVisible={setVisible} />}
            <BackDropLoading isLoading={isLoading} text='Generating and fetching pdf from server...' />
        </Container>
    );
};
