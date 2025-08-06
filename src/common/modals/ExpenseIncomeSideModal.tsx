import React, { useState } from "react";
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
    Fade,
    LinearProgress,
    Chip,
    Avatar,
    useMediaQuery,
    Card,
    CardContent,
    Divider,
    Alert,
    InputAdornment,
    Switch,
    FormControlLabel,
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
    Close as CloseIcon,
    Timeline,
    Person as PersonIcon,
    AccountBalance as BalanceIcon,
    CurrencyRupee as CurrencyIcon,
    Email as EmailIcon,
    Info,
    CheckCircle,
    Warning,
    SmsRounded,
    Check,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ActionButton } from "../buttons/ActionButton";

interface CreateInventoryGroupModalProps {
    open: boolean;
    onClose: () => void;
    type: 'expense' | 'income' | null;
    customerName: string;
    customerId: string;
    closingBalance: number;
}

interface InventoryGroupFormData {
    amount: number;
    date: string;
    notes: string;
    sendSms: boolean;
    sendEmail: boolean;
    accounts: string;
}

const ExpenseIncomeSideModal: React.FC<CreateInventoryGroupModalProps> = ({
    open,
    onClose,
    type,
    customerName,
    customerId,
    closingBalance,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { customerTypes } = useSelector((state: RootState) => state.customersLedger)
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [data, setData] = useState<InventoryGroupFormData>({
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        notes: '',
        sendSms: false,
        sendEmail: false,
        accounts: 'Cash',
    });

    const isIncome = type === 'income';

    const validateForm = (): boolean => {
        const errors: { [key: string]: string } = {};

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

    const handleInputChange = (field: keyof InventoryGroupFormData, value: any) => {
        setData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const resetForm = () => {
        setData({
            amount: 0,
            date: new Date().toISOString().split('T')[0],
            notes: '',
            sendSms: false,
            sendEmail: false,
            accounts: 'Cash',
        });
        setFormErrors({});
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error('Please fix the form errors before submitting');
            return;
        }

        setIsLoading(true);

        try {
            const sanitizedData: any = {
                amount: data.amount,
                notes: data.notes.trim(),
                date: data.date,
                customer_id: customerId,
                send_sms: data.sendSms,
                send_email: data.sendEmail,
                type: type,
            };

            const formData = new FormData();
            Object.entries(sanitizedData).forEach(([key, value]) => {
                if (typeof value === 'boolean') {
                    formData.append(key, value ? 'true' : 'false');
                } else if (value !== null && value !== undefined) {
                    formData.append(key, value.toString());
                }
            });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast.success(`Payment ${isIncome ? 'received' : 'given'} successfully!`);
            resetForm();
            onClose();
        } catch (error) {
            toast.error('Failed to process payment');
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
        if (balance > 0) return theme.palette.success.main;
        if (balance < 0) return theme.palette.error.main;
        return theme.palette.text.secondary;
    };

    const getBalanceIcon = (balance: number) => {
        if (balance > 0) return <CheckCircle fontSize="small" />;
        if (balance < 0) return <Warning fontSize="small" />;
        return <BalanceIcon fontSize="small" />;
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Drawer
                anchor="right"
                PaperProps={{
                    sx: {
                        width: { xs: '100%', sm: 650, md: 750 },
                        backgroundColor: theme.palette.background.default,
                        backgroundImage: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
                        overflow: 'hidden',
                    }
                }}
                sx={{
                    '& .MuiBackdrop-root': {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(8px)',
                    }
                }}
                open={open}
                onClose={onClose}
                transitionDuration={300}
            >
                <Fade in={isLoading}>
                    <LinearProgress
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                            height: 3
                        }}
                    />
                </Fade>

                {/* Header */}
                <Box sx={{
                    px: 3,
                    py: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: `2px solid ${isIncome ? theme.palette.success.main : theme.palette.error.main}`,
                    background: `linear-gradient(135deg, ${isIncome ? theme.palette.success.main : theme.palette.error.main}20 0%, ${isIncome ? theme.palette.success.light : theme.palette.error.light}15 100%)`,
                    backdropFilter: 'blur(20px)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Tooltip title="Close" arrow>
                            <IconButton
                                onClick={onClose}
                                sx={{
                                    backgroundColor: theme.palette.background.paper,
                                    boxShadow: theme.shadows[2],
                                    '&:hover': {
                                        backgroundColor: theme.palette.action.hover,
                                        transform: 'scale(1.1) rotate(90deg)',
                                        boxShadow: theme.shadows[4],
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h6" fontWeight={700}>
                                    {isIncome ? 'Payment Received Cash' : 'Payment Given Cash'}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {!isMobile && (
                        <Chip
                            icon={<Info />}
                            label="Fill required fields"
                            size="small"
                            variant="outlined"
                            sx={{
                                borderColor: isIncome ? theme.palette.success.main : theme.palette.error.main,
                                color: isIncome ? theme.palette.success.main : theme.palette.error.main,
                            }}
                        />
                    )}
                </Box>

                {/* Content */}
                <Box sx={{
                    flex: 1,
                    overflow: 'auto',
                    position: 'relative',
                    '&::-webkit-scrollbar': { width: 8 },
                    '&::-webkit-scrollbar-track': { backgroundColor: theme.palette.background.default },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.divider,
                        borderRadius: 1,
                        '&:hover': { backgroundColor: theme.palette.action.hover }
                    }
                }}>
                    <Box sx={{ p: 3 }}>
                        {/* Customer Information Card */}
                        <Card
                            elevation={0}
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover}10 100%)`,
                                border: `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            <CardContent sx={{ p: 0 }}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between', }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: theme.palette.primary.main,
                                                width: 48,
                                                height: 48,
                                            }}
                                        >
                                            <PersonIcon />
                                        </Avatar>
                                        <Typography variant="h6" fontWeight={600} color="primary">
                                            {customerName}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body1" fontWeight={600}>
                                                Current Balance:
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            fontWeight={700}
                                            sx={{ color: getBalanceColor(closingBalance) }}
                                        >
                                            {getBalanceIcon(closingBalance)}{" "}
                                            {formatCurrency(closingBalance)}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 1 }} />


                                {closingBalance !== 0 && (
                                    <Alert
                                        severity={closingBalance > 0 ? "success" : "error"}
                                        sx={{ mt: 1 }}
                                    >
                                        {closingBalance > 0
                                            ? `Customer has a credit balance of ${formatCurrency(Math.abs(closingBalance))}`
                                            : `Customer has a pending balance of ${formatCurrency(Math.abs(closingBalance))}`
                                        }
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>

                        {/* Payment Form */}
                        <Paper
                            elevation={1}
                            sx={{
                                px: 3,
                                py: 3,
                                mb: 3,
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover}20 100%)`,
                                border: `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            <Stack spacing={3}>
                                {/* Amount Field */}
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        placeholder="Enter amount"
                                        label="Amount"
                                        value={data.amount || ''}
                                        onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                                        error={!!formErrors.amount}
                                        helperText={formErrors.amount}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CurrencyIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                            }
                                        }}
                                    />

                                    {/* Date Field */}
                                    <DatePicker
                                        value={new Date(data.date)}
                                        format="dd-MM-yyyy"
                                        onChange={(newValue) => handleInputChange('date', newValue)}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                label: "Select Date",
                                                error: !!formErrors.date,
                                                helperText: formErrors.date,
                                                sx: {
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1,
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </Box>

                                <Stack direction="row" spacing={1} sx={{ height: '100%', alignItems: 'center' }}>
                                    {customerTypes.map((type) => (
                                        <Tooltip key={type._id} title={`Select ${type.ledger_name}`}>
                                            <Button
                                                variant={data.accounts === type.ledger_name ? "contained" : "outlined"}
                                                onClick={() => { handleInputChange('accounts', type.ledger_name) }}
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
                                                endIcon={data.accounts === type.ledger_name ? <Check /> : null}
                                            >
                                                {type.ledger_name}
                                            </Button>
                                        </Tooltip>
                                    ))}
                                </Stack>

                                {/* Notes Field */}
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Additional Notes (optional)"
                                    placeholder="Enter any additional notes (optional)"
                                    value={data.notes}
                                    onChange={(e) => handleInputChange('notes', e.target.value)}
                                    error={!!formErrors.notes}
                                    helperText={formErrors.notes || `${data.notes.length}/500 characters`}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            transition: 'all 0.3s ease',
                                        }
                                    }}
                                />

                                {/* Communication Options */}
                                <Box>
                                    <Typography variant="body1" fontWeight={600} sx={{ mb: 2 }}>
                                        Notification Options Coming Soon
                                    </Typography>
                                    <Stack spacing={2} direction={'row'}>
                                        <Card variant="outlined" sx={{ px: 2, py: 1, borderRadius: 1, width: '50%' }}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        disabled
                                                        checked={data.sendSms}
                                                        onChange={(e) => handleInputChange('sendSms', e.target.checked)}
                                                        color="primary"
                                                    />
                                                }
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <SmsRounded color="primary" fontSize="small" />
                                                        <Typography variant="body1" fontWeight={500}>
                                                            Send SMS to Customer
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </Card>

                                        <Card variant="outlined" sx={{ px: 2, py: 1, borderRadius: 1, width: '50%' }}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        disabled
                                                        checked={data.sendEmail}
                                                        onChange={(e) => handleInputChange('sendEmail', e.target.checked)}
                                                        color="primary"
                                                    />
                                                }
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <EmailIcon color="primary" fontSize="small" />
                                                        <Typography variant="body1" fontWeight={500}>
                                                            Send Email to Customer
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </Card>
                                    </Stack>
                                </Box>
                            </Stack>
                        </Paper>
                    </Box>
                </Box>

                {/* Footer */}
                <Box sx={{
                    p: 3,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover}20 100%)`,
                    backdropFilter: 'blur(20px)',
                }}>
                    <Stack
                        direction={isMobile ? "column" : "row"}
                        spacing={2}
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Stack direction={isMobile ? "column" : "row"} spacing={2} sx={{ width: isMobile ? '100%' : 'auto' }}>
                            <Button
                                variant="outlined"
                                onClick={resetForm}
                                disabled={isLoading}
                                fullWidth={isMobile}
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.5,
                                    fontWeight: 600,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: theme.shadows[4]
                                    }
                                }}
                            >
                                Reset Form
                            </Button>

                            {isIncome ? (
                                <ActionButton
                                    variant="contained"
                                    startIcon={isLoading ? <Timeline className="animate-spin" /> : <AddCircleOutlineIcon />}
                                    color="success"
                                    fullWidth={isMobile}
                                    disabled={isLoading || !data.amount || data.amount <= 0 || !data.date}
                                    onClick={handleSubmit}
                                    sx={{
                                        background: theme.palette.mode === 'dark' ? '#2e7d32' : '#e8f5e9',
                                        color: theme.palette.mode === 'dark' ? '#fff' : '#2e7d32',
                                        border: `1px solid ${theme.palette.mode === 'dark' ? '#fff' : '#2e7d32'}`,
                                        '&:hover': {
                                            color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                                            background: theme.palette.mode === 'dark' ? '#e8f5e9' : '#2e7d32',
                                        },
                                    }}
                                >
                                    {isLoading
                                        ? 'Recording Receipt...'
                                        : 'Record  Receipt'
                                    }
                                </ActionButton>
                            ) : (
                                <ActionButton
                                    variant="contained"
                                    startIcon={isLoading ? <Timeline className="animate-spin" /> : <AddCircleOutlineIcon />}
                                    color="error"
                                    fullWidth={isMobile}
                                    disabled={isLoading || !data.amount || data.amount <= 0 || !data.date}
                                    onClick={handleSubmit}
                                    sx={{
                                        background: theme.palette.mode === 'dark' ? '#c62828' : '#ffebee',
                                        color: theme.palette.mode === 'dark' ? '#fff' : '#c62828',
                                        border: `1px solid ${theme.palette.mode === 'dark' ? '#fff' : '#c62828'}`,
                                        '&:hover': {
                                            color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                                            background: theme.palette.mode === 'dark' ? '#ffebee' : '#c62828',
                                        },
                                    }}
                                >
                                    {isLoading
                                        ? `Recording Payment...`
                                        : `Record Payment`
                                    }
                                </ActionButton>
                            )}
                        </Stack>
                    </Stack>
                </Box>
            </Drawer>
        </LocalizationProvider>
    );
};

export default ExpenseIncomeSideModal;
