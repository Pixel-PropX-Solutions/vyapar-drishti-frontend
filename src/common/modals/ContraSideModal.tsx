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
    Card,
    InputAdornment,
    Switch,
    FormControlLabel,
    Chip,
    alpha,
    Autocomplete,
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
    Close as CloseIcon,
    Timeline,
    CurrencyRupee as CurrencyIcon,
    Email as EmailIcon,
    SmsRounded,
    AccountBalance,
    SwapHoriz,
    EventNote,
    InfoOutlined,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { createInvoice, getInvoiceCounter, updateInvoice, viewInvoice } from "@/services/invoice";
import toast from "react-hot-toast";
import { viewAllCustomerWithType } from "@/services/customers";

interface ContraSideModalProps {
    open: boolean;
    onClose: () => void;
    contraId: string | null;
    setContraId?: React.Dispatch<React.SetStateAction<string | null>>;

}

interface ContraFormData {
    id: string;
    amount: number;
    date: string;
    notes: string;
    sendSms: boolean;
    sendEmail: boolean;
    fromAccount: string;
    toAccount: string;
    fromAccountId: string;
    toAccountId: string;
    fromAccountEntry: string;
    toAccountEntry: string;
    transactionNumber: string;
}

const ContraSideModal: React.FC<ContraSideModalProps> = ({
    open,
    contraId,
    onClose,
    setContraId,
}) => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const { user, current_company_id } = useSelector((state: RootState) => state.auth);
    const currentCompanyId = current_company_id || localStorage.getItem("current_company_id") || user?.user_settings?.current_company_id || '';
    const { invoiceData } = useSelector((state: RootState) => state.invoice);

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [accounts, setAccounts] = useState<{ id: string; name: string; }[]>([]);

    const [data, setData] = useState<ContraFormData>({
        id: '',
        amount: 0,
        date: new Date().toISOString(),
        notes: '',
        sendSms: false,
        sendEmail: false,
        fromAccount: '',
        fromAccountId: '',
        fromAccountEntry: '',
        toAccount: '',
        toAccountId: '',
        toAccountEntry: '',
        transactionNumber: 'Auto-Gen',
    });

    const validateForm = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (!data.fromAccount) {
            errors.fromAccount = 'From account is required';
        }

        if (!data.toAccount) {
            errors.toAccount = 'To account is required';
        }

        if (!data.amount || data.amount <= 0) {
            errors.amount = 'Amount must be greater than 0';
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

    const handleInputChange = (
        field: keyof ContraFormData,
        value: any
    ) => {

        if (field === 'amount') {
            const intVal = Math.max(0, Math.floor(Number(value)));
            setData(prev => ({
                ...prev,
                [field]: intVal
            }));
        } else {
            setData(prev => ({
                ...prev,
                [field]: value
            }));
        }

        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const resetForm = () => {
        setData({
            id: '',
            amount: 0,
            date: new Date().toISOString(),
            notes: '',
            sendSms: false,
            sendEmail: false,
            fromAccount: '',
            fromAccountId: '',
            fromAccountEntry: '',
            toAccount: '',
            toAccountId: '',
            toAccountEntry: '',
            // keep a sensible default for newly opened creation form
            transactionNumber: 'Auto-Gen',
        });
        setFormErrors({});
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);

        if (!contraId) {
            const accounting = [
                {
                    vouchar_id: '',
                    ledger: data.fromAccount,
                    ledger_id: data.fromAccountId,
                    amount: -Number(data.amount),
                    order_index: 0
                },
                {
                    vouchar_id: '',
                    ledger: data.toAccount,
                    ledger_id: data.toAccountId,
                    amount: Number(data.amount),
                    order_index: 1
                },
            ];

            const payload = {
                voucher_type: 'Contra',
                voucher_type_id: 'c9d0e664-900d-4736-adfb-495ccca2bf3e',
                date: data.date.slice(0, 10),
                voucher_number: data.transactionNumber,
                party_name: data.fromAccount,
                party_name_id: data.fromAccountId,
                narration: data.notes,
                company_id: currentCompanyId || '',
                reference_number: "",
                reference_date: "",
                place_of_supply: "",
                mode_of_transport: "",
                vehicle_number: "",
                payment_mode: "",
                due_date: "",
                paid_amount: Number(data.amount),
                total: Number(data.amount),
                discount: 0,
                total_amount: Number(data.amount),
                total_tax: 0,
                additional_charge: 0,
                roundoff: 0,
                grand_total: Number(data.amount),
                accounting,
                items: []
            };
            dispatch(createInvoice(payload)).then(() => {
                setIsLoading(false);
                resetForm();
                onClose();
                setContraId?.(null);
                toast.success(`Contra added successfully!`);
            }).catch((error) => {
                setIsLoading(false);
                toast.error(error || "Failed to add transaction. 🚫");
            });
        } else {
            const accounting = [
                {
                    entry_id: data.fromAccountEntry,
                    vouchar_id: data.id,
                    ledger: data.fromAccount,
                    ledger_id: data.fromAccountId,
                    amount: -Number(data.amount),
                    order_index: 0
                },
                {
                    entry_id: data.toAccountEntry,
                    vouchar_id: data.id,
                    ledger: data.toAccount,
                    ledger_id: data.toAccountId,
                    amount: Number(data.amount),
                    order_index: 1
                },
            ];

            const payload = {
                vouchar_id: data.id,
                user_id: user?._id,
                voucher_type: 'Contra',
                voucher_type_id: 'c9d0e664-900d-4736-adfb-495ccca2bf3e',
                date: data.date.slice(0, 10),
                voucher_number: data.transactionNumber,
                party_name: data.fromAccount,
                party_name_id: data.fromAccountId,
                narration: data.notes,
                company_id: currentCompanyId || '',
                reference_number: "",
                reference_date: "",
                place_of_supply: "",
                mode_of_transport: "",
                vehicle_number: "",
                payment_mode: "",
                due_date: "",
                paid_amount: Number(data.amount),
                total: Number(data.amount),
                discount: 0,
                total_amount: Number(data.amount),
                total_tax: 0,
                additional_charge: 0,
                roundoff: 0,
                grand_total: Number(data.amount),
                accounting,
                items: []
            };
            dispatch(updateInvoice(payload)).then(() => {
                setIsLoading(false);
                resetForm();
                onClose();
                setContraId?.(null);
                toast.success(`Contra update successfully!`);
            }).catch((error) => {
                setIsLoading(false);
                toast.error(error || "Failed to update transaction. 🚫");
            });
        }
    };

    const isFormValid = data.fromAccount && data.toAccount && data.amount > 0 && data.date;

    const loadAccounts = async () => {
        dispatch(viewAllCustomerWithType({
            company_id: currentCompanyId || '',
            customerType: 'Accounts',
        })).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                const ledgersWithType = response.payload;
                setAccounts(ledgersWithType.map((part: any) => ({ name: part.ledger_name, id: part._id })));
            }
        }).catch((error) => {
            toast.error(error || "An unexpected error occurred. Please try again later.");
        });
    }

    const loadCounter = async () => {
        dispatch(getInvoiceCounter({
            company_id: currentCompanyId || '',
            voucher_type: 'Contra',
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
                await loadAccounts();
                if (!contraId) {
                    await loadCounter();
                }
            } catch (error) {
                console.error("Failed to load initial data:", error);
                toast.error("Failed to load data. Please refresh the page.");
            }
        };

        if (open) {
            loadData();
        }
    }, [dispatch, currentCompanyId, open, contraId]);

    useEffect(() => {
        if (contraId != null) {
            dispatch(viewInvoice({
                vouchar_id: contraId,
                company_id: currentCompanyId || '',
            }));
        } else {
            resetForm();
        }
    }, [dispatch, currentCompanyId, contraId]);

    useEffect(() => {
        if (invoiceData && contraId !== null) {
            const otherEntry = (invoiceData.accounting_entries || []).find((acc: any) => acc.ledger !== invoiceData.party_name) || { _id: '', ledger: '', ledger_id: '' };
            setData({
                id: invoiceData._id,
                amount: invoiceData.grand_total || 0,
                date: invoiceData.date,
                notes: invoiceData.narration || '',
                fromAccount: invoiceData.party_name,
                fromAccountId: invoiceData.party_name_id,
                transactionNumber: invoiceData.voucher_number,
                toAccount: otherEntry.ledger || '',
                toAccountId: otherEntry.ledger_id || '',
                fromAccountEntry: (invoiceData.accounting_entries || []).find((acc: any) => acc.ledger === invoiceData.party_name)?._id || '',
                toAccountEntry: otherEntry._id || '',
                sendEmail: false,
                sendSms: false,
            });
        } else {
            resetForm();
        }
    }, [invoiceData]);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Drawer
                anchor="right"
                PaperProps={{
                    sx: {
                        width: { xs: '100%', sm: 600, md: 700 },
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
                onClose={() => {
                    onClose();
                    resetForm();
                    setContraId?.(null);
                }}
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
                                Contra Entry
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
                            onClick={() => {
                                onClose();
                                resetForm();
                                setContraId?.(null);
                            }}
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
                    {/* Info Banner */}
                    <Box sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.info.main, 0.08),
                        border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                        display: 'flex',
                        gap: 1.5,
                    }}>
                        <InfoOutlined sx={{ color: theme.palette.info.main, fontSize: 20, mt: 0.2 }} />
                        <Box>
                            <Typography variant="body2" fontWeight={600} color="info.main" sx={{ mb: 0.5 }}>
                                What is a Contra Entry?
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                                Record fund transfers between your bank and cash accounts. This transaction affects only your balance sheet.
                            </Typography>
                        </Box>
                    </Box>

                    <Box>
                        {/* Account Transfer Section */}
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <AccountBalance sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                                <Typography variant="subtitle1" fontWeight={700}>
                                    Account Transfer Details
                                </Typography>
                            </Box>

                            <Stack spacing={1}>
                                {/* From Account */}
                                <Box>
                                    <Typography variant="caption" fontWeight={600} sx={{ mb: 1, color: 'text.secondary' }}>
                                        TRANSFER FROM
                                    </Typography>
                                    <Autocomplete
                                        options={accounts}
                                        getOptionLabel={(option) => option.name}
                                        value={accounts.find(p => p.id === data.fromAccountId) || null}
                                        onChange={(_, newValue) => {
                                            handleInputChange('fromAccount', newValue?.name);
                                            handleInputChange('fromAccountId', newValue?.id);
                                            setFormErrors(prev => ({ ...prev, fromAccount: '' }));
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                placeholder="Select or enter from account"
                                                error={!!formErrors.fromAccount}
                                                helperText={formErrors.fromAccount}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Box sx={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: '8px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                bgcolor: alpha(theme.palette.error.main, 0.1),
                                                            }}>
                                                                <AccountBalance sx={{ fontSize: 16, color: theme.palette.error.main }} />
                                                            </Box>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            boxShadow: `0 0 0 4px ${alpha(theme.palette.error.main, 0.08)}`,
                                                        },
                                                        '&.Mui-focused': {
                                                            boxShadow: `0 0 0 4px ${alpha(theme.palette.error.main, 0.12)}`,
                                                        }
                                                    }
                                                }}
                                            />
                                        )}
                                        sx={{ flex: 1 }}
                                    />
                                </Box>

                                {/* Transfer Arrow */}
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Box sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
                                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                                        animation: 'pulse 2s ease-in-out infinite',
                                        '@keyframes pulse': {
                                            '0%, 100%': { transform: 'scale(1)' },
                                            '50%': { transform: 'scale(1.05)' },
                                        }
                                    }}>
                                        <SwapHoriz sx={{ color: 'white', fontSize: 28, transform: 'rotate(90deg)' }} />
                                    </Box>
                                </Box>

                                {/* To Account */}
                                <Box>
                                    <Typography variant="caption" fontWeight={600} sx={{ mb: 1, color: 'text.secondary' }}>
                                        TRANSFER TO
                                    </Typography>
                                    <Autocomplete
                                        options={accounts}
                                        getOptionLabel={(option) => option.name}
                                        value={accounts.find(p => p.id === data.toAccountId) || null}
                                        onChange={(_, newValue) => {
                                            handleInputChange('toAccount', newValue?.name);
                                            handleInputChange('toAccountId', newValue?.id);
                                            setFormErrors(prev => ({ ...prev, toAccount: '' }));
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                placeholder="Select or enter to account"
                                                error={!!formErrors.toAccount}
                                                helperText={formErrors.toAccount}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Box sx={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: '8px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                                            }}>
                                                                <AccountBalance sx={{ fontSize: 16, color: theme.palette.success.main }} />
                                                            </Box>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            boxShadow: `0 0 0 4px ${alpha(theme.palette.success.main, 0.08)}`,
                                                        },
                                                        '&.Mui-focused': {
                                                            boxShadow: `0 0 0 4px ${alpha(theme.palette.success.main, 0.12)}`,
                                                        }
                                                    }
                                                }}
                                            />
                                        )}
                                        sx={{ flex: 1 }}
                                    />
                                </Box>
                            </Stack>
                        </Paper>

                        {/* Amount and Date Section */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mt: 3,
                                borderRadius: 3,
                                border: `1px solid ${theme.palette.divider}`,
                                background: theme.palette.background.paper,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <CurrencyIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                                <Typography variant="subtitle1" fontWeight={700}>
                                    Transaction Details
                                </Typography>
                            </Box>

                            <Stack spacing={3}>
                                <Box sx={{ display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
                                    {/* Amount Field */}
                                    <TextField
                                        fullWidth
                                        type="number"
                                        placeholder="0.00"
                                        label="Amount"
                                        value={data.amount || ''}
                                        onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                                        error={!!formErrors.amount}
                                        helperText={formErrors.amount}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CurrencyIcon sx={{ color: theme.palette.success.main }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        inputProps={{ step: 1, min: 0 }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                                fontSize: '1.1rem',
                                                '&:hover': {
                                                    boxShadow: `0 0 0 4px ${alpha(theme.palette.success.main, 0.08)}`,
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: `0 0 0 4px ${alpha(theme.palette.success.main, 0.12)}`,
                                                }
                                            },
                                            '& input': {
                                                fontWeight: 700,
                                            }
                                        }}
                                    />

                                    {/* Date Field */}
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
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </Box>

                                {/* Notes Field */}
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Additional Notes"
                                    placeholder="Add notes or description for this transaction (optional)"
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

                        {/* Notification Options */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                mt: 3,
                                mb: 2,
                                borderRadius: 3,
                                border: `1px dashed ${theme.palette.divider}`,
                                background: alpha(theme.palette.warning.main, 0.03),
                            }}
                        >
                            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip label="Coming Soon" size="small" color="warning" sx={{ height: 20 }} />
                                Notification Options
                            </Typography>

                            <Stack spacing={2}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        px: 2,
                                        py: 1.5,
                                        borderRadius: 1,
                                        bgcolor: 'background.paper',
                                        opacity: 0.6,
                                        border: `1px solid ${theme.palette.divider}`,
                                    }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                disabled
                                                checked={data.sendSms}
                                                size="small"
                                            />
                                        }
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Box sx={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                }}>
                                                    <SmsRounded sx={{ color: theme.palette.primary.main, fontSize: 16 }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        SMS Notification
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Send SMS to customer
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        }
                                    />
                                </Card>

                                <Card
                                    variant="outlined"
                                    sx={{
                                        px: 2,
                                        py: 1.5,
                                        borderRadius: 1,
                                        bgcolor: 'background.paper',
                                        opacity: 0.6,
                                        border: `1px solid ${theme.palette.divider}`,
                                    }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                disabled
                                                checked={data.sendEmail}
                                                size="small"
                                            />
                                        }
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Box sx={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    bgcolor: alpha(theme.palette.error.main, 0.1),
                                                }}>
                                                    <EmailIcon sx={{ color: theme.palette.error.main, fontSize: 16 }} />
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        Email Notification
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Send email to customer
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        }
                                    />
                                </Card>
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
                            onClick={resetForm}
                            disabled={isLoading}
                            fullWidth={isMobile}
                            sx={{
                                textTransform: 'none',
                                borderRadius: 1,
                                px: 3,
                                py: 1.5,
                                fontWeight: 600,
                                borderColor: theme.palette.divider,
                                color: 'text.secondary',
                                '&:hover': {
                                    borderColor: theme.palette.primary.main,
                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                    color: theme.palette.primary.main,
                                }
                            }}
                        >
                            Reset Form
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            startIcon={isLoading ? <Timeline className="animate-spin" /> : <AddCircleOutlineIcon />}
                            disabled={isLoading || !isFormValid}
                            fullWidth={isMobile}
                            sx={{
                                textTransform: 'none',
                                borderRadius: 1,
                                px: 4,
                                py: 1.5,
                                fontWeight: 700,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.main} 100%)`,
                                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                                '&:hover': {
                                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.success.dark} 100%)`,
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
                            {isLoading ? 'Recording Contra...' : 'Record Contra Entry'}
                        </Button>
                    </Stack>
                </Box>

                {/* Loading Overlay */}
                {isLoading && (
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: alpha(theme.palette.background.default, 0.9),
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                    }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Timeline sx={{
                                fontSize: 48,
                                color: theme.palette.primary.main,
                                animation: 'spin 1s linear infinite',
                                '@keyframes spin': {
                                    '0%': { transform: 'rotate(0deg)' },
                                    '100%': { transform: 'rotate(360deg)' },
                                }
                            }} />
                            <Typography variant="body1" fontWeight={600} sx={{ mt: 2 }}>
                                Recording Contra Entry...
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Drawer>
        </LocalizationProvider>
    );
};

export default ContraSideModal;