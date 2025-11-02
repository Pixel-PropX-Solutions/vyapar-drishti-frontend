import React, { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    Paper,
    Drawer,
    useTheme,
    Tooltip,
    Stack,
    useMediaQuery,
    InputAdornment,
    Chip,
    alpha,
    Autocomplete,
    MenuItem,
    Alert,
} from "@mui/material";
import {
    Close as CloseIcon,
    AccountBalance,
    SwapHoriz,
    EventNote,
    Delete as DeleteIcon,
    Add as AddIcon,
    CheckCircle,
    Warning,
    PersonAdd,
    Payment,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { createInvoice, getInvoiceCounter } from "@/services/invoice";
import toast from "react-hot-toast";
import { viewAllCustomerWithType } from "@/services/customers";
import BackDropLoading from "../loaders/BackDropLoading";

interface ContraSideModalProps {
    open: boolean;
    onClose: () => void;
}

type LedgerEntry = {
    id: string;
    name: string;
    type: 'To' | 'From';
    amount: string;
};

interface JournalFormData {
    date: string;
    notes: string;
    transactionNumber: string;
    paymentMethod: string;
}
const paymentMethods = [
    'Cash',
    'Bank Transfer',
    'Credit Card',
    'Debit Card',
    'UPI',
];

const JournalSideModal: React.FC<ContraSideModalProps> = ({
    open,
    onClose,
}) => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const { current_company_id } = useSelector((state: RootState) => state.auth);

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [ledgers, setLedgers] = useState<{ id: string; name: string; }[]>([]);
    const [entries, setEntries] = useState<LedgerEntry[]>([
        { id: '', name: '', type: 'To', amount: '' },
        { id: '', name: '', type: 'From', amount: '' },
    ]);
    const [data, setData] = useState<JournalFormData>({
        date: new Date().toISOString(),
        notes: '',
        transactionNumber: 'Auto-Gen',
        paymentMethod: 'Cash',
    });

    const calculateTotals = () => {
        const toTotal = entries
            .filter(e => e.type === 'To')
            .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
        const fromTotal = entries
            .filter(e => e.type === 'From')
            .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
        const difference = toTotal - fromTotal;

        return { toTotal, fromTotal, difference };
    };

    const validateForm = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (entries.length < 2) {
            errors.entries = 'At least 2 entries are required';
        }

        entries.forEach((entry, index) => {
            if (!entry.name) {
                errors[`entry_${index}_name`] = 'Ledger is required';
            }
            if (!entry.amount || Number(entry.amount) <= 0) {
                errors[`entry_${index}_amount`] = 'Amount must be greater than 0';
            }
        });

        const { difference } = calculateTotals();
        if (Math.abs(difference) > 0.01) {
            errors.balance = 'Total "To" amount must equal total "From" amount';
        }

        if (!data.date) {
            errors.date = 'Date is required';
        }

        if (data.notes && data.notes.length > 500) {
            errors.notes = 'Notes must be less than 500 characters';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    function updateEntry(index: number, updates: Partial<LedgerEntry>) {
        setEntries(prev => prev.map((entry, i) => (i === index ? { ...entry, ...updates } : entry)));

        // Clear specific field errors
        if (updates.name) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[`entry_${index}_name`];
                return newErrors;
            });
        }
        if (updates.amount) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[`entry_${index}_amount`];
                delete newErrors.balance;
                return newErrors;
            });
        }
    }

    function addNewEntry() {
        const { difference } = calculateTotals();
        const newEntry: LedgerEntry = {
            id: '',
            name: '',
            type: difference <= 0 ? 'To' : 'From',
            amount: difference !== 0 ? Math.abs(difference).toFixed(2) : '',
        };
        setEntries(prev => [...prev, newEntry]);
    }

    function removeEntry(index: number) {
        if (entries.length <= 2) {
            toast.error('At least 2 entries are required');
            return;
        }
        setEntries(prev => prev.filter((_, i) => i !== index));

        // Clear errors for removed entry
        setFormErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[`entry_${index}_name`];
            delete newErrors[`entry_${index}_amount`];
            return newErrors;
        });
    }

    const handleInputChange = (
        field: keyof JournalFormData,
        value: any
    ) => {
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
            date: new Date().toISOString(),
            notes: '',
            transactionNumber: '',
            paymentMethod: '',
        });
        setEntries([
            { id: '', name: '', type: 'To', amount: '' },
            { id: '', name: '', type: 'From', amount: '' },
        ]);
        setFormErrors({});
        loadCounter();
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error('Please fix all errors before submitting');
            return;
        }

        if (!isFormValid()) {
            toast.error('Please fix all errors before submitting');
            return;
        }

        setIsLoading(true);

        const accounting = entries.map((entry, index) => ({
            vouchar_id: '',
            ledger: entry.name,
            ledger_id: entry.id,
            amount: entry.type === 'To' ? Number(entry.amount) : -Number(entry.amount),
            order_index: index
        }));

        const totalAmount = calculateTotals().toTotal;

        const payload = {
            voucher_type: 'Journal',
            voucher_type_id: 'e7fc148d-6d4d-4bf7-9429-367b51606765',
            date: data.date.slice(0, 10),
            voucher_number: data.transactionNumber,
            party_name: accounting[0]?.ledger || '',
            party_name_id: accounting[0]?.ledger_id || '',
            narration: data.notes,
            company_id: current_company_id || '',
            reference_number: "",
            reference_date: "",
            place_of_supply: "",
            mode_of_transport: "",
            vehicle_number: "",
            payment_mode: data.paymentMethod,
            due_date: "",
            paid_amount: totalAmount,
            total: totalAmount,
            discount: 0,
            total_amount: totalAmount,
            total_tax: 0,
            additional_charge: 0,
            roundoff: 0,
            grand_total: totalAmount,
            accounting,
            items: []
        };

        console.log('Journal Entry Data', payload);

        dispatch(createInvoice(payload))
            .then(() => {
                setIsLoading(false);
                resetForm();
                onClose();
                toast.success('Journal entry recorded successfully!');
            })
            .catch((error) => {
                setIsLoading(false);
                toast.error(error || "Failed to record journal entry. 🚫");
            });
    };

    const isFormValid = () => {
        const { difference } = calculateTotals();
        return entries.length >= 2 &&
            Math.abs(difference) < 0.01 &&
            entries.every(e => e.name && Number(e.amount) > 0) &&
            data.date;
    };

    const loadLedgers = async () => {
        dispatch(viewAllCustomerWithType({
            company_id: current_company_id || '',
            customerType: '',
        })).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                const ledgersWithType = response.payload;
                setLedgers(ledgersWithType.filter((part: any) => !['Sales', 'Purchases'].includes(part.ledger_name)).map((part: any) => ({
                    name: part.ledger_name,
                    id: part._id
                })));
            }
        }).catch((error) => {
            toast.error(error || "An unexpected error occurred. Please try again later.");
        });
    }

    const loadCounter = async () => {
        dispatch(getInvoiceCounter({
            company_id: current_company_id || '',
            voucher_type: 'Journal',
        })).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                handleInputChange('transactionNumber', response.payload.current_number || '');
            }
        }).catch((error) => {
            toast.error(error || "An unexpected error occurred. Please try again later.");
        });
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                await loadLedgers();
                await loadCounter();
            } catch (error) {
                console.error("Failed to load initial data:", error);
                toast.error("Failed to load data. Please refresh the page.");
            }
        };

        if (open) {
            loadData();
        }
    }, [dispatch, current_company_id, open]);

    const { toTotal, fromTotal, difference } = calculateTotals();

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Drawer
                anchor="right"
                PaperProps={{
                    sx: {
                        width: { xs: '100%', sm: 600, md: 750 },
                        backgroundColor: theme.palette.background.default,
                        backgroundImage: 'none',
                    }
                }}
                sx={{
                    '& .MuiBackdrop-root': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        backdropFilter: 'blur(4px)',
                    },
                    zIndex: 1300,
                }}
                open={open}
                onClose={onClose}
                transitionDuration={400}
            >
                {/* Header */}
                <Box sx={{
                    px: 3,
                    py: 2.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.success.main, 0.08)} 100%)`,
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    backdropFilter: 'blur(20px)',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                        }}>
                            <SwapHoriz sx={{ color: 'white', fontSize: 24 }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                                Journal Entry
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                <Chip
                                    label={data.transactionNumber}
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        color: theme.palette.primary.main,
                                    }}
                                />
                            </Typography>
                        </Box>
                    </Box>
                    <Tooltip title="Close" arrow placement="left">
                        <IconButton
                            onClick={onClose}
                            sx={{
                                backgroundColor: alpha(theme.palette.error.main, 0.1),
                                color: theme.palette.error.main,
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.error.main, 0.2),
                                    transform: 'rotate(90deg)',
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Content */}
                <Box sx={{
                    flex: 1,
                    overflow: 'auto',
                    px: 3,
                    pb: 3,
                    '&::-webkit-scrollbar': { width: 6 },
                    '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                        borderRadius: 3,
                        '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.3) }
                    }
                }}>
                    <Box>
                        {/* Journal Entries Section */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mt: 2,
                                borderRadius: 2,
                                border: `1px solid ${theme.palette.divider}`,
                                background: theme.palette.background.paper,
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
                                }
                            }}
                        >
                            {/* Header */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <AccountBalance sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
                                    <Typography variant="h6" fontWeight={700}>
                                        Journal Entries
                                    </Typography>
                                </Box>
                            </Box>

                            {formErrors.entries && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {formErrors.entries}
                                </Alert>
                            )}

                            <Stack spacing={2}>
                                {entries.map((entry, index) => (
                                    <Paper
                                        key={index}
                                        elevation={0}
                                        sx={{
                                            p: 2.5,
                                            border: `1px solid ${theme.palette.divider}`,
                                            borderRadius: 2,
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                boxShadow: 2,
                                                borderColor: entry.type === 'To'
                                                    ? theme.palette.error.main
                                                    : theme.palette.success.main,
                                            },
                                            color: entry.type === 'To'
                                                ? theme.palette.error.main
                                                : theme.palette.success.main,
                                            bgcolor: alpha(
                                                entry.type === 'To'
                                                    ? theme.palette.error.main
                                                    : theme.palette.success.main,
                                                0.05
                                            ),
                                            position: 'relative',
                                        }}
                                    >
                                        {/* Header with Entry Number and Delete */}
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mb: 2
                                        }}>
                                            <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                                Entry #{index + 1}
                                            </Typography>
                                            {entries.length > 2 && (
                                                <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                                                    <Tooltip title="Remove entry">
                                                        <IconButton
                                                            onClick={() => removeEntry(index)}
                                                            sx={{
                                                                border: `1px solid ${theme.palette.error.main}`,
                                                                color: theme.palette.error.main,
                                                                '&:hover': {
                                                                    bgcolor: alpha(theme.palette.error.main, 0.1),
                                                                }
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Main Content - Account and Type */}
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                            {/* Left Side - Account and Amount */}
                                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                <Autocomplete
                                                    options={ledgers}
                                                    getOptionLabel={(option) => option.name}
                                                    value={ledgers.find(l => l.name === entry.name) || undefined}
                                                    onChange={(_, newValue) => {
                                                        updateEntry(index, {
                                                            name: newValue?.name || '',
                                                            id: newValue?.id || ''
                                                        });
                                                    }}
                                                    popupIcon={null}
                                                    clearIcon={null}
                                                    disableClearable
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            placeholder="Select Account"
                                                            error={!!formErrors[`entry_${index}_name`]}
                                                            helperText={formErrors[`entry_${index}_name`]}
                                                            size="small"
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                endAdornment: null,
                                                                startAdornment: (
                                                                    <>
                                                                        {params.InputProps.startAdornment}
                                                                        <InputAdornment position="start">
                                                                            <PersonAdd sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                                        </InputAdornment>
                                                                    </>
                                                                ),
                                                            }}
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                    bgcolor: 'background.default',
                                                                    borderRadius: 1,
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                />

                                                <Box>
                                                    <TextField
                                                        fullWidth
                                                        label="Amount"
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={entry.amount}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (value === '' || Number(value) >= 0) {
                                                                updateEntry(index, { amount: value });
                                                            }
                                                        }}
                                                        error={!!formErrors[`entry_${index}_amount`]}
                                                        helperText={formErrors[`entry_${index}_amount`]}
                                                        size="small"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Typography variant="body1" fontWeight={700}>
                                                                        INR
                                                                    </Typography>
                                                                </InputAdornment>
                                                            ),
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <Typography variant="body1" fontWeight={700}>
                                                                        Amount
                                                                    </Typography>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                bgcolor: 'background.default',
                                                                fontWeight: 700,
                                                                borderRadius: 1,
                                                            },
                                                            '& input': {
                                                                fontWeight: 700,
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                            </Box>

                                            {/* Right Side - Type Button */}
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                height: '100%',
                                            }}>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => {
                                                        updateEntry(index, {
                                                            type: entry.type === 'To' ? 'From' : 'To'
                                                        });
                                                    }}
                                                    sx={{
                                                        minWidth: 100,
                                                        minHeight: 80,
                                                        borderRadius: 2,
                                                        borderWidth: 2,
                                                        borderColor: entry.type === 'To'
                                                            ? theme.palette.error.main
                                                            : theme.palette.success.main,
                                                        color: entry.type === 'To'
                                                            ? theme.palette.error.main
                                                            : theme.palette.success.main,
                                                        bgcolor: alpha(
                                                            entry.type === 'To'
                                                                ? theme.palette.error.main
                                                                : theme.palette.success.main,
                                                            0.05
                                                        ),
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 0.5,
                                                        textTransform: 'none',
                                                        fontWeight: 700,
                                                        fontSize: '1rem',
                                                        '&:hover': {
                                                            borderWidth: 2,
                                                            borderColor: entry.type === 'To'
                                                                ? theme.palette.error.main
                                                                : theme.palette.success.main,
                                                            bgcolor: alpha(
                                                                entry.type === 'To'
                                                                    ? theme.palette.error.main
                                                                    : theme.palette.success.main,
                                                                0.1
                                                            ),
                                                        }
                                                    }}
                                                >
                                                    <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                                                        TYPE
                                                    </Typography>
                                                    <Typography variant="h6" fontWeight={700}>
                                                        {entry.type}
                                                    </Typography>
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Paper>
                                ))}
                            </Stack>


                            {/* Balance Summary */}
                            <Box sx={{
                                mt: 3,
                                p: 2,
                                borderRadius: 2,
                                bgcolor: 'background.default',
                                border: `1px solid ${theme.palette.divider}`
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="subtitle1" fontWeight={700}>
                                        Balance Summary
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={addNewEntry}
                                        size="small"
                                        sx={{ textTransform: 'none' }}
                                    >
                                        Add Entry
                                    </Button>
                                </Box>

                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                                    gap: 3
                                }}>
                                    {/* Debit Summary */}
                                    <Box sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: alpha(theme.palette.success.main, 0.05),
                                        border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Box sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                bgcolor: theme.palette.success.main
                                            }} />
                                            <Typography variant="caption" fontWeight={600} color="text.secondary">
                                                TOTAL TO (DEBIT)
                                            </Typography>
                                        </Box>
                                        <Typography variant="h6" fontWeight={700} color="success.main">
                                            ₹ {toTotal.toFixed(2)}
                                        </Typography>
                                    </Box>

                                    {/* Credit Summary */}
                                    <Box sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: alpha(theme.palette.info.main, 0.05),
                                        border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Box sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                bgcolor: theme.palette.info.main
                                            }} />
                                            <Typography variant="caption" fontWeight={600} color="text.secondary">
                                                TOTAL FROM (CREDIT)
                                            </Typography>
                                        </Box>
                                        <Typography variant="h6" fontWeight={700} color="info.main">
                                            ₹ {fromTotal.toFixed(2)}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Difference */}
                                <Box sx={{
                                    mt: 2,
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: Math.abs(difference) < 0.01
                                        ? alpha(theme.palette.success.main, 0.1)
                                        : alpha(theme.palette.warning.main, 0.1),
                                    border: `1px solid ${Math.abs(difference) < 0.01
                                        ? theme.palette.success.main
                                        : theme.palette.warning.main
                                        }`,
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body1" fontWeight={700}>
                                            DIFFERENCE:
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography
                                                variant="h6"
                                                fontWeight={700}
                                                color={Math.abs(difference) < 0.01 ? 'success.main' : 'warning.main'}
                                            >
                                                ₹ {Math.abs(difference).toFixed(2)}
                                            </Typography>
                                            {Math.abs(difference) < 0.01 ? (
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    color: 'success.main'
                                                }}>
                                                    <CheckCircle fontSize="small" />
                                                    <Typography variant="caption" fontWeight={600}>
                                                        Balanced
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    color: 'warning.main'
                                                }}>
                                                    <Warning fontSize="small" />
                                                    <Typography variant="caption" fontWeight={600}>
                                                        Not Balanced
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>

                                    {formErrors.balance && (
                                        <Alert severity="error" sx={{ mt: 1 }}>
                                            {formErrors.balance}
                                        </Alert>
                                    )}
                                </Box>
                            </Box>
                        </Paper>


                        {/* Date and Notes Section */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                mt: 3,
                                borderRadius: 2,
                                border: `1px solid ${theme.palette.divider}`,
                                background: theme.palette.background.paper,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <EventNote sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                                <Typography variant="subtitle1" fontWeight={700}>
                                    Additional Details
                                </Typography>
                            </Box>

                            <Stack spacing={3}>
                                <Stack direction={isMobile ? "column" : "row"} spacing={2}>
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
                                                            <EventNote sx={{ color: theme.palette.primary.main }} />
                                                        </InputAdornment>
                                                    ),
                                                },
                                                sx: {
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1,
                                                        '&:hover': {
                                                            boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.08)}`,
                                                        },
                                                        '&.Mui-focused': {
                                                            boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.12)}`,
                                                        },
                                                    },
                                                    '& .MuiInputAdornment-positionEnd': {
                                                        mr: 0.5,
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        select
                                        label="Payment Method"
                                        value={data.paymentMethod}
                                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                                        error={!!formErrors.paymentMethod}
                                        helperText={formErrors.paymentMethod}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Payment sx={{ color: theme.palette.primary.main }} />
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                                '&:hover': {
                                                    boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.05)}`,
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
                                                }
                                            }
                                        }}
                                    >
                                        {paymentMethods.map((method) => (
                                            <MenuItem key={method} value={method}>
                                                {method}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Stack>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Narration / Notes"
                                    placeholder="Add description or notes for this journal entry (optional)"
                                    value={data.notes}
                                    onChange={(e) => handleInputChange('notes', e.target.value)}
                                    error={!!formErrors.notes}
                                    helperText={formErrors.notes || `${data.notes.length}/500 characters`}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            '&:hover': {
                                                boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.05)}`,
                                            },
                                            '&.Mui-focused': {
                                                boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
                                            }
                                        }
                                    }}
                                />


                            </Stack>
                        </Paper>
                    </Box>
                </Box>

                {/* Footer */}
                <Box sx={{
                    p: 3,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    background: theme.palette.background.paper,
                    position: 'sticky',
                    bottom: 0,
                    zIndex: 100,
                }}>
                    <Stack
                        direction={isMobile ? "column" : "row"}
                        spacing={2}
                        justifyContent="space-between"
                    >
                        <Button
                            variant="outlined"
                            onClick={handleSubmit}
                            disabled={isLoading || !isFormValid()}
                            fullWidth={isMobile}
                            sx={{
                                textTransform: 'none',
                                borderRadius: 1,
                                px: 4,
                                py: 1.5,
                                fontWeight: 700,
                                border: `2px solid ${theme.palette.primary.main}`,
                                background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.success.light} 100%)`,
                                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                                '&:hover': {
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
                                    boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.5)}`,
                                    transform: 'translateY(-2px)',
                                },
                                '&:disabled': {
                                    background: theme.palette.action.disabledBackground,
                                    color: theme.palette.action.disabled,
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {isLoading ? 'Recording Journal...' : 'Record Journal Entry'}
                        </Button>
                    </Stack>
                </Box>

                {/* Loading Overlay */}
                <BackDropLoading isLoading={isLoading} text="Recording Journal Entry..." />
            </Drawer>
        </LocalizationProvider>
    );
};

export default JournalSideModal;