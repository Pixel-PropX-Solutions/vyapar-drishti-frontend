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
    InputLabel,
    Select,
    InputAdornment,
    Alert,
    Stack,
} from "@mui/material";
import {
    Receipt as ReceiptIcon,
    Payment as PaymentIcon,
    Save as SaveIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    Notes as NotesIcon
} from "@mui/icons-material";
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { viewAllCustomers } from "@/services/customers";
import { createInvoice } from "@/services/invoice";
import { useNavigate } from "react-router-dom";

const transactionTypes = ["Payment", "Receipt"];

interface SingleEntry {
    customer: string;
    amount: number;
}

const PaymentReceiptInvoice: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { currentCompany } = useSelector((state: RootState) => state.auth)
    const { customersList } = useSelector((state: RootState) => state.customersLedger)
    const [transactionType, setTransactionType] = useState("Payment");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [transactionNumber, setTransactionNumber] = useState<string>(transactionType.toUpperCase().slice(0, 3) + "-" + Date.now().toString().slice(-6));
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
                    ledger: singleEntry.customer,
                    ledger_id: customersList.find(c => c.name === singleEntry.customer)?._id || '',
                    amount: transactionType === "Payment" ? -singleEntry.amount : singleEntry.amount,
                },
                {
                    vouchar_id: '',
                    ledger: partyName,
                    ledger_id: customersList.find(c => c.name === partyName)?._id || '',
                    amount: transactionType === "Payment" ? singleEntry.amount : -singleEntry.amount,
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
                date,
                voucher_number: transactionNumber,
                party_name: partyName,
                narration: notes,
                company_id: currentCompany?._id || '',
                reference_number: "",
                reference_date: "",
                place_of_supply: "",
                accounting,
                items: []
            };

            console.log("Submitting transaction:", payload);

            // Simulate API call
            dispatch(createInvoice(payload)).then(() => {
                setIsSubmitting(false);
                navigate('/invoices', { replace: true });
            });

            toast.success(`${transactionType} voucher created successfully!`);

            // Reset form
            setTransactionNumber("");
            setPartyName("");
            setNotes("");
            setSingleEntry({ customer: "", amount: 0 });
            setErrors({});

        } catch {
            toast.error("Failed to create voucher. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        dispatch(viewAllCustomers(currentCompany?._id || ''))
    }, [dispatch, currentCompany?._id, currentCompany]);

    return (
        <Box sx={{ p: 3, width: '100%', mx: 'auto'}}>
            {/* Header */}
            <Paper elevation={2} sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    {transactionType === "Payment" ?
                        <PaymentIcon sx={{ fontSize: 32, color: 'white' }} /> :
                        <ReceiptIcon sx={{ fontSize: 32, color: 'white' }} />
                    }
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
                        {transactionType} Transaction Entry
                    </Typography>
                </Stack>
            </Paper>

            {/* Main Form */}
            <Card elevation={3} sx={{ mb: 2 }}>
                <CardContent sx={{ px: 4, py: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'primary.main', fontWeight: 600 }}>
                        Transaction Details
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth error={!!errors.transactionType}>
                                <InputLabel>Transaction Type</InputLabel>
                                <Select
                                    value={transactionType}
                                    label="Transaction Type"
                                    onChange={(e) => setTransactionType(e.target.value)}
                                    // startAdornment={
                                    //     <InputAdornment position="start">
                                    //         {transactionType === "Payment" ?
                                    //             <PaymentIcon color="primary" /> :
                                    //             <ReceiptIcon color="primary" />
                                    //         }
                                    //     </InputAdornment>
                                    // }
                                >
                                    {transactionTypes.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                {type === "Payment" ? <PaymentIcon /> : <ReceiptIcon />}
                                                <span>{type}</span>
                                            </Stack>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date"
                                InputLabelProps={{ shrink: true }}
                                value={date}
                                onChange={(e) => {
                                    setDate(e.target.value);
                                    if (errors.date) {
                                        setErrors(prev => {
                                            const newErrors = { ...prev };
                                            delete newErrors.date;
                                            return newErrors;
                                        });
                                    }
                                }}
                                error={!!errors.date}
                                helperText={errors.date}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
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
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth error={!!errors.customer}>
                                <TextField
                                    select
                                    value={partyName}
                                    label={transactionType === "Payment" ? "Receiver" : "Sender"}
                                    placeholder={`Select ${transactionType === "Payment" ? "receiver" : "sender"} name`}
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
                                >
                                    <MenuItem selected value="">
                                        <em>{transactionType === "Payment" ? "Select Sender" : "Select Receiver"}</em>
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
                            <FormControl fullWidth error={!!errors.customer}>
                                <TextField
                                    select
                                    value={singleEntry.customer}
                                    label={transactionType === "Payment" ? "Sender" : "Receiver"}
                                    placeholder={`Select ${transactionType === "Payment" ? "receiver" : "sender"} name`}
                                    onChange={(e) => handleEntryChange("customer", e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                >
                                    <MenuItem selected value="">
                                        <em>{transactionType === "Payment" ? "Select Sender" : "Select Receiver"}</em>
                                    </MenuItem>
                                    {customersList?.map((customer) => (
                                        <MenuItem key={customer._id} value={customer.ledger_name}>
                                            {customer.ledger_name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                {errors.customer && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                                        {errors.customer}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>

                    {/* Single Entry Fields */}
                    <Grid container spacing={2} alignItems="center" sx={{ my: 2 }}>
                        <Grid item xs={12} sm={6}>
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
                                            ₹
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Optional transaction notes"
                                multiline
                                maxRows={2}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <NotesIcon color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>


            {/* Summary and Submit */}
            <Card elevation={3}>
                <CardContent sx={{ px: 4, py: 1, display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>

                    <Stack
                        direction="column"
                        spacing={2}
                        alignItems={'flex-start'}
                        justifyContent={'flex-start'}
                        sx={{ width: '100%', mb: 1 }}
                    >
                        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                            {transactionType} Summary
                        </Typography>

                        {total > 0 && (
                            <Alert severity="info" >
                                This {transactionType.toLowerCase()} will be recorded with a total amount of ₹ {total.toFixed(2)}
                            </Alert>
                        )}
                    </Stack>

                    <Stack
                        direction="column"
                        spacing={2}
                        alignItems={'center'}
                        justifyContent={'flex-end'}
                        sx={{ mb: 1 }}
                    >
                        <Chip
                            label={`Total: ₹ ${total.toFixed(2)}`}
                            color="primary"
                            variant="outlined"
                            sx={{ fontSize: '1.1rem', width: 'fit-content', mx: 'auto', fontWeight: 600, px: 2, py: 1 }}
                        />
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
                                whiteSpace: 'nowrap',
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #1976D2 30%, #1565C0 90%)',
                                }
                            }}
                        >
                            {isSubmitting ? "Processing..." : `Submit ${transactionType}`}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default PaymentReceiptInvoice;

