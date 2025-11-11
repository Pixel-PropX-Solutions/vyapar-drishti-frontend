import React, { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    Paper,
    Autocomplete,
    Chip,
    Fade,
    Zoom,
    CircularProgress,
    useTheme,
    Drawer,
    Stack,
    Avatar,
    Card,
    CardContent,
    InputAdornment,
    Switch,
    FormControlLabel,
} from "@mui/material";
import {
    Close as CloseIcon,
    TrendingUp,
    Person as PersonIcon,
    AccountBalance,
    TrendingDown,
    CurrencyRupee as CurrencyIcon,
    Email as EmailIcon,
    Info,
    CalendarToday,
    Search as SearchIcon,
    SmsRounded,
    Check,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { viewAllCustomerWithType } from "@/services/customers";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { createInvoice, getInvoiceCounter } from "@/services/invoice";
import toast from "react-hot-toast";
import BackDropLoading from "../loaders/BackDropLoading";

interface Customer {
    _id: string;
    name: string;
    closingBalance: number;
}

interface BankPaymentModalProps {
    open: boolean;
    onClose: () => void;
    entity: 'Accounts' | 'Customers' | null;
    type: 'payment' | 'receipt' | null;
    bankAccount: { _id: string; ledger_name: string; balance: number };
}

interface FormData {
    accountSource: string;
    accountSourceId: string;
    date: string;
    notes: string;
    sendSms: boolean;
    sendEmail: boolean;
    transactionNumber: string;
    cusId: string;
    cusName: string;
    amount: number;
}


export const PaymentReceiptSideModal: React.FC<BankPaymentModalProps> = ({
    open,
    onClose,
    entity,
    type,
    bankAccount,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const theme = useTheme();
    const [data, setData] = useState<FormData>({
        accountSource: bankAccount.ledger_name || 'Cash',
        accountSourceId: bankAccount._id || '',
        date: new Date().toISOString(),
        notes: '',
        sendSms: false,
        sendEmail: false,
        transactionNumber: 'Auto-Gen',
        cusId: '',
        cusName: '',
        amount: 0,
    });
    const dispatch = useDispatch<AppDispatch>();
    const { current_company_id } = useSelector((state: RootState) => state.auth);
    const { invoiceType_id } = useSelector((state: RootState) => state.invoice);

    console.log("Entity", entity);
    const isReceipt = type === 'receipt';

    const validateForm = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (data.cusName === '') {
            errors.cusName = 'Please select a customer';
        }

        if (!data.date) {
            errors.date = 'Date is required';
        }

        if (data.notes && data.notes.length > 500) {
            errors.notes = 'Notes must be less than 500 characters';
        }

        if (!data.amount) {
            errors.notes = 'Amount is required.';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field: keyof FormData, value: any) => {
        setData(prev => ({
            ...prev,
            [field]: value
        }));

        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const resetForm = () => {
        setData({
            accountSource: bankAccount.ledger_name || 'Cash',
            accountSourceId: bankAccount._id || '',
            date: new Date().toISOString(),
            notes: '',
            sendSms: false,
            sendEmail: false,
            transactionNumber: 'RCP-2025-0123',
            cusId: '',
            cusName: '',
            amount: 0,
        });
        setSelectedCustomer(null);
        setFormErrors({});
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const accounting = [
                {
                    vouchar_id: '',
                    ledger: bankAccount.ledger_name ?? '',
                    ledger_id: bankAccount._id ?? '',
                    amount: isReceipt ? data.amount : -data.amount,
                    order_index: 0
                },
                {
                    vouchar_id: '',
                    ledger: selectedCustomer?.name ?? '',
                    ledger_id: selectedCustomer?._id ?? '',
                    amount: isReceipt ? -data.amount : data.amount,
                    order_index: 1
                },
            ];

            const payload = {
                voucher_type: isReceipt ? 'Receipt' : 'Payment',
                voucher_type_id: invoiceType_id || '',
                date: data.date.slice(0, 10),
                voucher_number: data.transactionNumber,
                party_name: bankAccount.ledger_name,
                party_name_id: bankAccount._id ?? '',
                narration: data.notes,
                company_id: current_company_id || '',
                reference_number: "",
                reference_date: "",
                place_of_supply: "",
                mode_of_transport: "",
                vehicle_number: "",
                payment_mode: "",
                due_date: "",
                paid_amount: 0,
                total: data.amount,
                discount: 0,
                total_amount: data.amount,
                total_tax: 0,
                additional_charge: 0,
                roundoff: 0,
                grand_total: data.amount,
                accounting,
                items: []
            };

            dispatch(createInvoice(payload)).then(() => {
                setIsLoading(false);
                resetForm();
                setFormErrors({});
                toast.success(`${isReceipt ? 'Receipt' : 'Payment'} added successfully!`);
            }).catch((error) => {
                setIsLoading(false);
                toast.error(error || "Failed to add transaction. 🚫");
            });
        } catch {
            toast.error("Failed to add transaction. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const getBalanceColor = (balance: number) => {
        if (balance > 0) return '#10b981';
        if (balance < 0) return '#ef4444';
        return '#6b7280';
    };

    const getBalanceIcon = (balance: number) => {
        if (balance > 0) return <TrendingUp sx={{ fontSize: 16 }} />;
        if (balance < 0) return <TrendingDown sx={{ fontSize: 16 }} />;
        return <></>;
    };

    const primaryColor = isReceipt ? '#10b981' : '#ef4444';
    const lightColor = isReceipt ? '#d1fae5' : '#fee2e2';



    useEffect(() => {
        if (open && entity !== null) {
            dispatch(viewAllCustomerWithType({ company_id: current_company_id || '', customerType: entity === 'Accounts' ? 'Customers' : 'Accounts' })).then((response) => {
                if (response.meta.requestStatus === 'fulfilled') {
                    const ledgers = response.payload;
                    setCustomers(
                        ledgers.map((cus: any) => ({
                            id: cus._id,
                            name: cus.ledger_name,
                            closingBalance: cus.total_amount,
                        }))
                    );
                }
            }).catch((error) => {
                toast.error(error || "An unexpected error occurred. Please try again later.");
            });
        }
        if (type) {
            dispatch(getInvoiceCounter({
                company_id: current_company_id || '',
                voucher_type: isReceipt ? 'Receipt' : 'Payment',
            })).then((response) => {
                if (response.meta.requestStatus === 'fulfilled') {
                    setData({
                        ...data,
                        transactionNumber: response.payload.current_number || '',
                    });
                }
            }).catch((error) => {
                toast.error(error || "An unexpected error occurred. Please try again later.");
            });
        }
    }, [dispatch, current_company_id, entity, isReceipt, type, open]);



    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Drawer
                anchor="right"
                PaperProps={{
                    sx: {
                        width: { xs: '100%', sm: 650, md: 750 },
                        backgroundColor: '#fafafa',
                    }
                }}
                open={open}
                onClose={() => {
                    onClose();
                    resetForm();
                    setSelectedCustomer(null);
                    setCustomers([]);
                    setFormErrors({});
                }}
            >
                {/* Enhanced Header */}
                <Box sx={{
                    px: 3,
                    py: 2.5,
                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
                    color: 'white',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton
                                onClick={() => onClose()}
                                sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <Box>
                                <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                                    {isReceipt ? 'Receipt Entry' : 'Payment Entry'}
                                </Typography>
                                <Chip
                                    label={`#${data.transactionNumber}`}
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        fontWeight: 600,
                                    }}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                Total Amount
                            </Typography>
                            <Typography variant="h5" fontWeight={700}>
                                {formatCurrency(data.amount)}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                {/* Content */}
                <Box sx={{
                    flex: 1,
                    overflow: 'auto',
                    p: 3,
                }}>
                    {/* Bank Account Section */}
                    <Fade in timeout={300}>
                        <Card
                            elevation={0}
                            sx={{
                                mb: 3,
                                borderRadius: 1,
                                border: '1px solid #e5e7eb',
                                overflow: 'hidden',
                            }}
                        >
                            <Box sx={{
                                background: `linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}08 100%)`,
                                p: 2.5,
                            }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{
                                        bgcolor: primaryColor,
                                        width: 48,
                                        height: 48,
                                    }}>
                                        {entity === 'Accounts' ? <AccountBalance /> : <PersonIcon />}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                            {entity === 'Accounts' ? (isReceipt ? 'Receiving in' : 'Payment From') : (isReceipt ? 'Receiving from' : 'Payment to')}
                                        </Typography>
                                        <Typography variant="h6" fontWeight={700}>
                                            {bankAccount.ledger_name}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                            Available Balance
                                        </Typography>
                                        <Typography variant="h6" fontWeight={700} color="primary">
                                            {formatCurrency(Math.abs(bankAccount.balance))}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>

                            <CardContent>
                                <DatePicker
                                    value={new Date(data.date)}
                                    format="dd-MM-yyyy"
                                    onChange={(newValue) => handleInputChange('date', newValue?.toISOString() || '')}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            label: "Transaction Date",
                                            error: !!formErrors.date,
                                            helperText: formErrors.date,
                                            InputProps: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CalendarToday fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                            }
                                        }
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </Fade>

                    {/* Add Payment Entry Section */}
                    <Fade in timeout={400}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mb: 3,
                                borderRadius: 1,
                                border: `2px solid #e5e7eb`,
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
                                <Typography variant="h6" fontWeight={700}>
                                    {entity === 'Accounts' ? isReceipt ? 'Receive From' : 'Pay To' : isReceipt ? 'Receiving in' : 'Payment from'}
                                </Typography>
                            </Stack>

                            <Stack spacing={2.5}>
                                <Autocomplete
                                    options={customers}
                                    getOptionLabel={(option) => option.name}
                                    value={selectedCustomer}
                                    onChange={(_, newValue) => {
                                        setSelectedCustomer(newValue);
                                        if (formErrors.customer) {
                                            setFormErrors(prev => ({ ...prev, customer: '' }));
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={`Select ${entity}`}
                                            placeholder={`Search and select ${entity}...`}
                                            error={!!formErrors.customer}
                                            helperText={formErrors.customer}
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <>
                                                        <InputAdornment position="start">
                                                            <SearchIcon color="action" />
                                                        </InputAdornment>
                                                        {params.InputProps.startAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props}>
                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                width="100%"
                                                spacing={1}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#3b82f6' }}>
                                                        {entity === 'Customers' ? <AccountBalance /> : <PersonIcon />}
                                                    </Avatar>
                                                    <Typography fontWeight={500}>{option.name}</Typography>
                                                </Box>
                                                <Chip
                                                    label={formatCurrency(Math.abs(option.closingBalance))}
                                                    size="small"
                                                    icon={getBalanceIcon(option.closingBalance) ?? <></>}
                                                    sx={{
                                                        bgcolor: `${getBalanceColor(option.closingBalance)}15`,
                                                        color: getBalanceColor(option.closingBalance),
                                                        fontWeight: 600,
                                                    }}
                                                />
                                            </Stack>
                                        </li>
                                    )}
                                />

                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Amount"
                                    placeholder="0.00"
                                    value={data.amount}
                                    onChange={(e) => {
                                        setData({
                                            ...data,
                                            amount: Number(e.target.value),
                                        });
                                        if (formErrors.amount) {
                                            setFormErrors(prev => ({ ...prev, amount: '' }));
                                        }
                                    }}
                                    error={!!formErrors.amount}
                                    helperText={formErrors.amount}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CurrencyIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Stack>
                        </Paper>
                    </Fade>

                    {/* Payments Table */}
                    <Zoom in timeout={500}>
                        <Paper
                            elevation={0}
                            sx={{
                                mb: 3,
                                borderRadius: 1,
                                border: '1px solid #e5e7eb',
                                overflow: 'hidden',
                            }}
                        >
                            <Box sx={{
                                p: 3,
                                borderTop: '2px solid #e5e7eb',
                                background: `linear-gradient(135deg, ${lightColor} 0%, white 100%)`,
                            }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Total Amount
                                        </Typography>
                                        <Typography variant="h4" fontWeight={800} color={primaryColor}>
                                            {formatCurrency(data.amount ?? 0)}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={isReceipt ? "Money In" : "Money Out"}
                                        color={isReceipt ? "success" : "error"}
                                        sx={{ fontWeight: 700, px: 2, py: 2.5 }}
                                    />
                                </Stack>
                            </Box>
                        </Paper>
                    </Zoom>
                    {/* Notes */}
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Additional Notes"
                        placeholder="Enter any additional notes or remarks..."
                        value={data.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        error={!!formErrors.notes}
                        helperText={formErrors.notes || `${data.notes.length}/500 characters`}
                        sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                bgcolor: 'white',
                            }
                        }}
                    />

                    {/* Communication Options */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            border: '1px solid #e5e7eb',
                            borderRadius: 1,
                            bgcolor: '#fafafa',
                        }}
                    >
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                            <Info fontSize="small" color="action" />
                            <Typography variant="body2" fontWeight={600} color="text.secondary">
                                Notification Options (Coming Soon)
                            </Typography>
                        </Stack>
                        <Stack spacing={1.5}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        disabled
                                        checked={data.sendSms}
                                        onChange={(e) => handleInputChange('sendSms', e.target.checked)}
                                    />
                                }
                                label={
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <SmsRounded fontSize="small" color="action" />
                                        <Typography variant="body2">Send SMS notifications</Typography>
                                    </Stack>
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        disabled
                                        checked={data.sendEmail}
                                        onChange={(e) => handleInputChange('sendEmail', e.target.checked)}
                                    />
                                }
                                label={
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <EmailIcon fontSize="small" color="action" />
                                        <Typography variant="body2">Send email receipts</Typography>
                                    </Stack>
                                }
                            />
                        </Stack>
                    </Paper>
                </Box>

                {/* Enhanced Footer */}
                <Box sx={{
                    p: 3,
                    borderTop: '2px solid #e5e7eb',
                    backgroundColor: 'white',
                    boxShadow: '0 -4px 12px rgba(0,0,0,0.05)',
                }}>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            onClick={resetForm}
                            disabled={isLoading}
                            size="large"
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 1,
                            }}
                        >
                            Reset
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={isLoading || data.cusName === ''}
                            size="large"
                            startIcon={isLoading ? <CircularProgress className="animate-spin" /> : <Check />}
                            sx={{
                                px: 4,
                                py: .5,
                                borderRadius: 1,
                                background: !isReceipt
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
                            {isLoading
                                ? 'Recording...'
                                : `Record ${isReceipt ? 'Receipt' : 'Payment'}`
                            }
                        </Button>
                    </Stack>
                </Box>
                <BackDropLoading
                    isLoading={isLoading}
                    text="Recording..."
                />
            </Drawer>
        </LocalizationProvider>
    );
}
