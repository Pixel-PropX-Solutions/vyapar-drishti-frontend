import React, { useEffect, useState } from "react";
import {
    Box,
    TextField,
    MenuItem,
    Typography,
    Button,
    Grid,
    Paper,
    Card,
    CardContent,
    Chip,
    FormControl,
    InputAdornment,
    Alert,
    Stack,
    useTheme,
    Fade,
    Grow,
    Divider,
    Tooltip,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    Receipt as ReceiptIcon,
    Payment as PaymentIcon,
    Save as SaveIcon,
    Person as PersonIcon,
    AccountBalance as BankIcon,
    Info as InfoIcon,
    Check as CheckIcon,
} from "@mui/icons-material";
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { viewAllCustomers, viewAllCustomerWithTypes } from "@/services/customers";
import { createInvoice, getInvoiceCounter, viewInvoice } from "@/services/invoice";
import { useNavigate, useParams } from "react-router-dom";

const transactionTypes = ["Payment", "Receipt"];

interface SingleEntry {
    customer: string;
    amount: number;
}

const UpdatePaymentReceipt: React.FC = () => {
    const { type, voucher_id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const theme = useTheme();
    const navigate = useNavigate();
    const { currentCompany } = useSelector((state: RootState) => state.auth)
    const { invoiceData, invoiceType_id } = useSelector((state: RootState) => state.invoice);
    const { customersList, customerTypes } = useSelector((state: RootState) => state.customersLedger)
    const transactionType = (type ? type.charAt(0).toUpperCase() + type.slice(1) : "Payment") as 'Payment' | 'Receipt';
    const [date, setDate] = useState(new Date());
    const [transactionNumber, setTransactionNumber] = useState<string>('');
    const [partyName, setPartyName] = useState("");
    const [notes, setNotes] = useState("");
    const [singleEntry, setSingleEntry] = useState<SingleEntry>({ customer: "", amount: 0 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!date) newErrors.date = "Date is required";
        if (!transactionNumber.trim()) newErrors.transactionNumber = "Transaction number is required";
        if (!partyName.trim()) newErrors.partyName = "Account name is required";
        if (!singleEntry.customer) newErrors.customer = "Customer is required";
        if (singleEntry.amount <= 0) newErrors.amount = "Amount must be greater than 0";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEntryChange = (
        field: "customer" | "amount",
        value: string | number
    ) => {
        setSingleEntry(prev => ({
            ...prev,
            [field]: field === "amount" ? parseFloat(value as string) || 0 : value
        }));

        // Clear errors for this field
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const total = singleEntry.amount || 0;

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("Please fix the errors before submitting");
            return;
        }
        setIsSubmitting(true);
        try {
            const accounting = [
                {
                    vouchar_id: '',
                    ledger: partyName,
                    ledger_id: customersList.find(c => c.ledger_name === partyName)?._id || '',
                    amount: transactionType === "Payment" ? singleEntry.amount : -singleEntry.amount,
                    order_index: 0
                },
                {
                    vouchar_id: '',
                    ledger: singleEntry.customer,
                    ledger_id: customerTypes.find(c => c.ledger_name === singleEntry.customer)?._id || '',
                    amount: transactionType === "Payment" ? -singleEntry.amount : singleEntry.amount,
                    order_index: 1
                },
            ];

            const doubleEntryTotal = accounting.reduce((acc, e) => acc + e.amount, 0);
            if (Math.abs(doubleEntryTotal) > 0.01) {
                toast.error("Voucher is not balanced. Debit ≠ Credit");
                setIsSubmitting(false);
                return;
            }

            const payload = {
                voucher_type: transactionType,
                voucher_type_id: invoiceType_id || '',
                date: date.toISOString().slice(0, 10),
                voucher_number: transactionNumber,
                party_name: partyName,
                party_name_id: customersList.find(c => c.ledger_name === partyName)?._id ?? '',
                narration: notes,
                company_id: currentCompany?._id || '',
                reference_number: "",
                reference_date: "",
                place_of_supply: "",
                mode_of_transport: "",
                vehicle_number: "",
                payment_mode: "",
                due_date: "",
                paid_amount: 0,
                total_amount: total,
                total: total,
                discount: 0,
                additional_charge: 0,
                total_tax: 0,
                roundoff: 0,
                grand_total: total,
                accounting,
                items: []
            };

            dispatch(createInvoice(payload)).then(() => {
                setIsSubmitting(false);
                setTransactionNumber("");
                setPartyName("");
                setNotes("");
                setSingleEntry({ customer: "", amount: 0 });
                setErrors({});
                navigate('/transactions', { replace: true });
                toast.success(`${transactionType} added successfully!`);
            }).catch((error) => {
                setIsSubmitting(false);
                toast.error(error || "Failed to add transaction. 🚫");
            });

        } catch {
            toast.error("Failed to add transaction. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        dispatch(viewAllCustomers(currentCompany?._id || ''))
        dispatch(viewAllCustomerWithTypes({ company_id: currentCompany?._id || '', customerTypes: ["Bank Accounts", "Cash-in-Hand"] }))
        dispatch(getInvoiceCounter({
            company_id: currentCompany?._id || '',
            voucher_type: transactionType,
        })).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                setTransactionNumber(response.payload.current_number || '');
            }
        }).catch((error) => {
            toast.error(error || "An unexpected error occurred. Please try again later.");
        });
    }, [dispatch, currentCompany?._id, currentCompany, transactionType]);

    useEffect(() => {
        dispatch(viewInvoice({
            vouchar_id: voucher_id || '',
            company_id: currentCompany?._id || '',
        }));
    }, [dispatch, currentCompany?._id, voucher_id]);


    useEffect(() => {
        if (invoiceData) {
            setDate(new Date(invoiceData.date));
            setTransactionNumber(invoiceData.voucher_number || '');
            setPartyName(invoiceData.party_name || '');
            setNotes(invoiceData.narration || '');
            setSingleEntry({
                customer: invoiceData.accounting_entries.find(entry => entry.ledger_id !== invoiceData.party_name_id)?.ledger || '',
                amount: Math.abs(invoiceData.accounting_entries.find(entry => entry.ledger_id !== invoiceData.party_name_id)?.amount || 0) || 0,
            });
        }
    }, [invoiceData]);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 3, maxWidth: '100%', mx: 'auto' }}>
                {/* Enhanced Header */}
                <Fade in timeout={800}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            background: transactionType === "Payment"
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                : 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                            borderRadius: 1,
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                zIndex: 0,
                            }
                        }}
                    >
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ position: 'relative', zIndex: 1 }}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: 1,
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    backdropFilter: 'blur(10px)',
                                }}>
                                    {transactionType === "Payment" ?
                                        <PaymentIcon sx={{ fontSize: 32, color: 'white' }} /> :
                                        <ReceiptIcon sx={{ fontSize: 32, color: 'white' }} />
                                    }
                                </Box>
                                <Box>
                                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                                        {transactionType} Entry
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                        Create a new {transactionType.toLowerCase()} transaction
                                    </Typography>
                                </Box>
                            </Stack>
                            <Chip
                                label={`#${transactionNumber}`}
                                sx={{
                                    background: 'rgba(255, 255, 255, 0.5)',
                                    color: '#000',
                                    fontWeight: 600,
                                    py: 2,
                                    px: 4,
                                    borderRadius: 1,
                                    borderColor: 'rgba(255, 255, 255, 1)',
                                    borderWidth: 2,
                                }}
                            />
                        </Stack>
                    </Paper>
                </Fade>

                {/* Enhanced Main Form */}
                <Grow in timeout={1000}>
                    <Card
                        elevation={0}
                        sx={{
                            mb: 3,
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            background: theme.palette.background.paper,
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                                <BankIcon color="primary" />
                                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                    Transaction Details
                                </Typography>
                            </Stack>

                            <Grid container spacing={3}>
                                {/* Transaction Type - Enhanced */}
                                <Grid item xs={12} sm={2}>
                                    <FormControl
                                        fullWidth
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                height: '56px',
                                                borderRadius: 1,
                                            },
                                        }}
                                    >
                                        <TextField
                                            select
                                            value={transactionType}
                                            label="Type"
                                            disabled
                                            sx={{
                                                '& .MuiInputBase-root': {
                                                    background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                                },
                                            }}
                                        >
                                            {transactionTypes.map((type) => (
                                                <MenuItem key={type} value={type}>
                                                    <Stack direction="row" alignItems="center" gap={1}>
                                                        {type === "Payment" ? <PaymentIcon /> : <ReceiptIcon />}
                                                        <span>{type}</span>
                                                    </Stack>
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </FormControl>
                                </Grid>

                                {/* Date - Enhanced */}
                                <Grid item xs={12} sm={2.5}>
                                    <DatePicker
                                        label="Transaction Date"
                                        value={date}
                                        format="dd/MM/yyyy"
                                        views={["year", "month", "day"]}
                                        maxDate={new Date()}
                                        onChange={(value) => {
                                            if (value) {
                                                setDate(value);
                                            } else {
                                                setDate(new Date());
                                            }
                                            if (errors.date) {
                                                setErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.date;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.date,
                                                helperText: errors.date,
                                                sx: {
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1,
                                                    }
                                                }
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Transaction Number - Enhanced */}
                                <Grid item xs={12} sm={2.5}>
                                    <TextField
                                        fullWidth
                                        label="Transaction Number"
                                        value={transactionNumber}
                                        onChange={(e) => {
                                            setTransactionNumber(e.target.value);
                                            if (errors.transactionNumber) {
                                                setErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.transactionNumber;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                        error={!!errors.transactionNumber}
                                        helperText={errors.transactionNumber}
                                        placeholder="e.g., TXN-001"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                            }
                                        }}
                                    />
                                </Grid>

                                {/* Amount - Enhanced */}
                                <Grid item xs={12} sm={2}>
                                    <TextField
                                        fullWidth
                                        label="Amount"
                                        type="number"
                                        value={singleEntry.amount || ''}
                                        onChange={(e) => handleEntryChange("amount", e.target.value)}
                                        error={!!errors.amount}
                                        helperText={errors.amount}
                                        placeholder="0.00"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Typography variant="h6" color="primary">
                                                        &#8377;
                                                    </Typography>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                },
                                            },
                                            '& .MuiOutlinedInput-input': {
                                                fontWeight: 500,
                                            }
                                        }}
                                    />
                                </Grid>

                                {/* Account Type Buttons - Enhanced */}
                                <Grid item xs={12} sm={3}>
                                    <Stack direction="row" spacing={1} sx={{ height: '100%', alignItems: 'center' }}>
                                        {customerTypes.map((type) => (
                                            <Tooltip key={type._id} title={`Select ${type.ledger_name}`}>
                                                <Button
                                                    variant={singleEntry.customer === type.ledger_name ? "contained" : "outlined"}
                                                    onClick={() => { handleEntryChange('customer', type.ledger_name) }}
                                                    sx={{
                                                        borderRadius: 1,
                                                        px: 2,
                                                        py: 3,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        minWidth: 'auto',
                                                        flex: 1,
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-1px)',
                                                            boxShadow: theme.shadows[4],
                                                        },
                                                    }}
                                                    endIcon={singleEntry.customer === type.ledger_name ? <CheckIcon /> : null}
                                                >
                                                    {type.ledger_name}
                                                </Button>
                                            </Tooltip>
                                        ))}
                                    </Stack>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 3 }} />

                            {/* Party Selection - Enhanced */}
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth error={!!errors.customer}>
                                        <TextField
                                            select
                                            value={partyName}
                                            label={transactionType === "Payment" ? "Pay To" : "Receive From"}
                                            placeholder={`Select ${transactionType === "Payment" ? "receiver" : "sender"}`}
                                            onChange={(e) => {
                                                setPartyName(e.target.value);
                                                if (errors.partyName) {
                                                    setErrors(prev => {
                                                        const newErrors = { ...prev };
                                                        delete newErrors.partyName;
                                                        return newErrors;
                                                    });
                                                }
                                            }}
                                            error={!!errors.partyName}
                                            helperText={errors.partyName}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon color="primary" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 1,
                                                }
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>{transactionType === "Payment" ? "Select Receiver" : "Select Sender"}</em>
                                            </MenuItem>
                                            {customersList?.map((party) => (
                                                <MenuItem key={party._id} value={party.ledger_name}>
                                                    {party.ledger_name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Notes (Optional)"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Add transaction notes..."
                                        multiline
                                        rows={2}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grow>

                {/* Enhanced Summary and Submit */}
                <Grow in timeout={1200}>
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            background: theme.palette.background.paper,
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Grid container spacing={3} alignItems="center">
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={2}>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <InfoIcon color="primary" />
                                            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                                Transaction Summary
                                            </Typography>
                                        </Stack>

                                        {total > 0 && (
                                            <Alert
                                                severity="info"
                                                sx={{
                                                    borderRadius: 1,
                                                    '& .MuiAlert-icon': {
                                                        alignItems: 'center',
                                                    }
                                                }}
                                            >
                                                This {transactionType.toLowerCase()} will be recorded for <strong>₹{total.toLocaleString()}</strong>
                                            </Alert>
                                        )}
                                    </Stack>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Stack spacing={2} direction={'row'} alignItems="center" justifyContent="flex-end">
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                px: 2,
                                                py: 1,
                                                background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                                borderRadius: 1,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                display: 'flex',
                                                gap: 2,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Total Amount
                                            </Typography>
                                            <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                                                ₹ {total.toLocaleString()}
                                            </Typography>
                                        </Paper>

                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<SaveIcon />}
                                            onClick={handleSubmit}
                                            disabled={isSubmitting || total === 0}
                                            sx={{
                                                px: 4,
                                                py: 1.5,
                                                borderRadius: 1,
                                                background: transactionType === "Payment"
                                                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                    : 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                minWidth: 200,
                                                boxShadow: theme.shadows[4],
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: theme.shadows[8],
                                                },
                                                '&:disabled': {
                                                    background: theme.palette.action.disabledBackground,
                                                    transform: 'none',
                                                    boxShadow: 'none',
                                                }
                                            }}
                                        >
                                            {isSubmitting ? "Processing..." : `Submit ${transactionType}`}
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grow>
            </Box>
        </LocalizationProvider>
    );
};

export default UpdatePaymentReceipt;