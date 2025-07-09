import React, { useEffect, useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Paper,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Autocomplete,
    InputAdornment,
    Container,
    CircularProgress,
    Avatar,
    useTheme,
    alpha,
    Stack
} from "@mui/material";
import {
    Inventory,
    Delete,
    Add,
    Receipt,
    Save,
    AddCircleOutline,
    BusinessCenter,
    LocalOffer,
    PeopleAlt,
    Info
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { viewAllCustomerWithType } from '@/services/customers';
import { viewProductsWithId } from '@/services/products';
import { createInvoice, createInvoiceWithGST } from '@/services/invoice';
import { useNavigate, useParams } from 'react-router-dom';
import type { TableRowProps } from "@mui/material";

// Interfaces
interface InvoiceItems {
    vouchar_id: string;
    item: string;
    item_id: string;
    quantity: number;
    rate: number;
    amount: number;
    gst?: number;
    gst_amount?: number;

}

interface InvoiceAccounting {
    vouchar_id: string;
    ledger: string;
    ledger_id: string;
    amount: number;
}

// Styled Components
const StyledCard = ({
    children,
    ...props
}: React.PropsWithChildren<{ sx?: object } & React.ComponentProps<typeof Card>>) => {
    const theme = useTheme();
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 1,
                // border: `1px solid ${alpha(theme.palette.primary.dark, 1)}`,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
                backdropFilter: 'blur(10px)',
                // transition: 'all 0.3s ease-in-out',
                // '&:hover': {
                //   borderColor: alpha(theme.palette.primary.dark, 1),
                // },
                ...props.sx
            }}
            {...props}
        >
            {children}
        </Card>
    );
};

const AnimatedTableRow = ({ children, ...props }: React.PropsWithChildren<TableRowProps>) => (
    <TableRow
        sx={{
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
                backgroundColor: alpha('#1976d2', 0.04),
            },
            '& .MuiTableCell-root': {
                padding: '8px 8px',
            },
            ...props.sx
        }}
        {...props}
    >
        {children}
    </TableRow>
);
// Main Component
export default function SalePurchaseInvoiceCreation() {
    const { type } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [parties, setParties] = useState<{ id: string; name: string; }[]>([]);
    const [date, setDate] = useState(new Date());
    // const [counterParties, setCounterParties] = useState<{ id: string; name: string; }[]>([]);
    const [itemsList, setItemsList] = useState<{ id: string; name: string; unit: string, gst: string, hsn_code: string }[]>([]);
    const theme = useTheme();

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { currentCompany } = useSelector((state: RootState) => state.auth);
    const { user } = useSelector((state: RootState) => state.auth);
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === user.user_settings.current_company_id);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [data, setData] = useState({
        company_id: "",
        date: new Date().toISOString().split('T')[0],
        voucher_type: "",
        voucher_number: "INV-" + Date.now().toString().slice(-6),
        party_name: "",
        party_id: "",
        counter_party: "",
        counter_id: "",
        narration: "",
        reference_number: "",
        reference_date: "",
        place_of_supply: "",
        accounting: [] as InvoiceAccounting[],
        items: [] as InvoiceItems[],
    });

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!date) newErrors.date = "Date is required";
        if (!data.party_name.trim()) newErrors.partyName = "Party name is required";
        if (data.items.length <= 0) newErrors.amount = "At least one item is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddItem = () => {
        const newItem: InvoiceItems = {
            vouchar_id: '',
            item: '',
            item_id: '',
            quantity: 1,
            rate: 0.0,
            amount: 0.0
        };
        setData(prev => ({
            ...prev,
            items: [...prev.items, newItem]
        }));
    };

    const handleRemoveItem = (index: number) => {
        setData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleItemChange = (index: number, field: keyof InvoiceItems, value: string | number | undefined) => {
        setData(prev => ({
            ...prev,
            items: prev.items.map((item, i) => {
                if (i === index) {
                    const updatedItem = { ...item, [field]: value };
                    // Auto-calculate amount
                    if (field === 'quantity' || field === 'rate') {
                        updatedItem.amount = updatedItem.quantity * updatedItem.rate;
                        updatedItem.gst_amount = updatedItem.amount * (updatedItem.gst || 0) / 100;
                    }

                    return updatedItem;
                }
                return item;
            })
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const calculateTotals = () => {
        const subtotal = data.items.reduce((sum, item) => sum + (item.amount || 0), 0).toFixed(2);
        const gstTotal = data.items.reduce((sum, item) => sum + (item.gst_amount || 0), 0).toFixed(2);
        const grandTotal = (parseFloat(subtotal) + parseFloat(gstTotal)).toFixed(2);
        return { subtotal, grandTotal, gstTotal };
    };

    const { grandTotal } = calculateTotals();

    const handleSubmit = async (e: React.FormEvent) => {
        if (!validateForm()) {
            return;
        }
        e.preventDefault();
        setIsLoading(true);

        if (currentCompanyDetails?.company_settings?.features?.enable_gst) {
            const dataToSend = {
                ...data,
                date: date instanceof Date ? date.toISOString().split('T')[0] : date,
                company_id: currentCompany?._id || '',
                voucher_type_id: '',
                party_name_id: '',
                items: data.items.map(item => ({
                    ...item,
                    vouchar_id: '',
                    gst_rate: item.gst?.toString() || '0',
                    gst_amount: item.gst_amount || 0,
                    additional_amount: 0,
                    discount_amount: 0,
                    godown: '',
                    godown_id: '',
                    order_number: '',
                    order_due_date: '',
                    hsn_code: itemsList.find((p) => p.id === item.item_id)?.hsn_code || '',
                })),
                accounting: [
                    {
                        vouchar_id: '',
                        ledger: data.party_name,
                        ledger_id: data.party_id,
                        amount: type === 'sales' ? -Number(grandTotal) : Number(grandTotal),
                    },
                    {
                        vouchar_id: '',
                        ledger: data.counter_party,
                        ledger_id: data.counter_id,
                        amount: type === 'sales' ? Number(grandTotal) : -Number(grandTotal),
                    }
                ],
            }



            dispatch(createInvoiceWithGST(dataToSend)).then(() => {
                setIsLoading(false);
                navigate('/invoices', { replace: true });
            })
        }
        else {
            const dataToSend = {
                ...data,
                date: date instanceof Date ? date.toISOString().split('T')[0] : date,
                company_id: currentCompany?._id || '',
                voucher_type_id: '',
                party_name_id: '',
                items: data.items.map(item => ({
                    ...item,
                    vouchar_id: '',
                })),
                accounting: [
                    {
                        vouchar_id: '',
                        ledger: data.party_name,
                        ledger_id: data.party_id,
                        amount: type === 'sales' ? -Number(grandTotal) : Number(grandTotal),
                    },
                    {
                        vouchar_id: '',
                        ledger: data.counter_party,
                        ledger_id: data.counter_id,
                        amount: type === 'sales' ? Number(grandTotal) : -Number(grandTotal),
                    }
                ],
            }

            dispatch(createInvoice(dataToSend)).then(() => {
                setIsLoading(false);
                navigate('/invoices', { replace: true });
            })
        }

    };

    useEffect(() => {
        if (user.user_settings.current_company_id) {
            setData(prev => ({
                ...prev,
                company_id: user.user_settings.current_company_id,
                voucher_type: type ? type.charAt(0).toUpperCase() + type.slice(1) : '',
            }));
        }

        dispatch(viewAllCustomerWithType({
            company_id: user.user_settings.current_company_id || '',
            customerType: type === 'sales' ? 'Debtors' : 'Creditors',
        })).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                // console.log('viewAllCustomerWithType response', response);
                const ledgersWithType = response.payload;
                setParties(ledgersWithType.map((part: any) => ({ name: part.ledger_name, id: part._id })));
            }
        }
        ).catch((error) => {
            console.error('Error fetching customers:', error);
        });

        // dispatch(viewAllCustomerWithType({
        //     company_id: user.user_settings.current_company_id || '',
        //     customerType: type === 'sales' ? 'Sales Account' : 'Purchase Account',
        // })).then((response) => {
        //     if (response.meta.requestStatus === 'fulfilled') {
        //         // console.log('viewAllCustomerWithType response for counter parties', response);
        //         const ledgersWithType = response.payload;
        //         setCounterParties(ledgersWithType.map((part: any) => ({ name: part.ledger_name, id: part._id })));
        //     }
        // }
        // ).catch((error) => {
        //     console.error('Error fetching customers:', error);
        // });

        dispatch(viewProductsWithId(user.user_settings.current_company_id || '')).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                // console.log('viewProductsWithId response', response);
                const products = response.payload;
                setItemsList(
                    products.map((product: any) => ({
                        name: product.stock_item_name,
                        id: product._id,
                        unit: product.unit,
                        gst: product.rate,
                        hsn_code: product.hsn_code || ''
                    }))
                );
            }
            return response;
        });
    }, [dispatch, type, user.user_settings.current_company_id, user]);


    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Header Section */}
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                            sx={{
                                bgcolor: 'primary.main',
                                width: 36,
                                height: 36,
                                mr: 1
                            }}
                        >
                            <Receipt sx={{ fontSize: 24 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight="700" color="primary.main">
                                Create Invoice
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create professional invoices with ease
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Main Form */}
                <StyledCard>
                    <CardContent sx={{ p: 2 }}>
                        <Box component="form" onSubmit={handleSubmit}>
                            <Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <StyledCard>
                                            <CardContent>
                                                <Box display="flex" alignItems="center" mb={3}>
                                                    <Receipt color="primary" sx={{ mr: 1 }} />
                                                    <Typography variant="h6">Invoice Details {(type ? type.charAt(0).toUpperCase() + type.slice(1) : '')}</Typography>
                                                </Box>

                                                <Stack spacing={2}>
                                                    <TextField
                                                        label="Invoice Number"
                                                        fullWidth
                                                        value={data.voucher_number}
                                                        onChange={handleChange}
                                                        name="voucher_number"
                                                        variant="outlined"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <LocalOffer color="action" />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />

                                                    <DatePicker
                                                        label="Date"
                                                        value={date}
                                                        format="dd/MM/yyyy"
                                                        views={["year", "month", "day"]}
                                                        onChange={(value) => {
                                                            setDate(value || new Date());
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
                                                                sx: {
                                                                    '& .MuiOutlinedInput-root': {
                                                                        // borderRadius: '8px'
                                                                    },
                                                                    '& .MuiInputAdornment-root .MuiButtonBase-root': {
                                                                        border: 'none',
                                                                        boxShadow: 'none'
                                                                    }
                                                                },
                                                                onFocus: () => {
                                                                    setErrors(prev => {
                                                                        const newErrors = { ...prev };
                                                                        delete newErrors.date;
                                                                        return newErrors;
                                                                    });
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </Stack>
                                            </CardContent>
                                        </StyledCard>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <StyledCard>
                                            <CardContent>
                                                <Box display="flex" alignItems="center" mb={3}>
                                                    <PeopleAlt color="primary" sx={{ mr: 1 }} />
                                                    <Typography variant="h6">{type === 'sales' ? "Customer" : "Supplier"} Information</Typography>
                                                </Box>

                                                <Stack spacing={2}>
                                                    <Autocomplete
                                                        options={parties}
                                                        getOptionLabel={(option) => option.name}
                                                        value={parties.find(p => p.id === data.party_id) || null}
                                                        onChange={(_, newValue) =>
                                                            setData(prev => ({
                                                                ...prev,
                                                                party_name: newValue ? newValue.name : '',
                                                                party_id: newValue ? newValue.id : ''
                                                            }))
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label={type === 'sales' ? "Select Customer" : "Select Supplier"}
                                                                placeholder={type === 'sales' ? "Start typing for customer suggestions..." : "Start typing for supplier suggestions..."}
                                                                variant="outlined"
                                                                fullWidth
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <BusinessCenter color="primary" />
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                            />
                                                        )}
                                                        sx={{
                                                            '& .MuiAutocomplete-endAdornment': {
                                                                display: 'none'
                                                            }
                                                        }}
                                                    />
                                                    {/* <Autocomplete
                                                    options={counterParties}
                                                    getOptionLabel={(option) => option.name}
                                                    value={counterParties.find(p => p.id === data.counter_id) || null}
                                                    onChange={(_, newValue) =>
                                                        setData(prev => ({
                                                            ...prev,
                                                            counter_party: newValue ? newValue.name : '',
                                                            counter_id: newValue ? newValue.id : ''
                                                        }))
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label={type === 'sales' ? "Select Sales Account" : "Select Purchase Account"}
                                                            placeholder={type === 'sales' ? "Start typing for sales account suggestions..." : "Start typing for purchase account suggestions..."}
                                                            variant="outlined"
                                                            fullWidth
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <BusinessCenter color="primary" />
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                            sx={{
                                                                '& .MuiAutocomplete-endAdornment': {
                                                                    display: 'none'
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                /> */}
                                                </Stack>
                                            </CardContent>
                                        </StyledCard>
                                    </Grid>
                                </Grid>
                            </Box>

                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
                                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Inventory sx={{ mr: 2, color: 'primary.main' }} />
                                        Invoice Items
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddCircleOutline />}
                                        onClick={handleAddItem}
                                        sx={{ borderRadius: 1 }}
                                    >
                                        Add Item Row
                                    </Button>
                                </Box>

                                <TableContainer
                                    component={Paper}
                                    sx={{
                                        borderRadius: 1,
                                        overflow: "hidden",
                                        boxShadow: theme.shadows[4],
                                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                                    }}
                                >
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', width: '30%' }}>Product Name</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>QTY</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Rate (&#8377;)</TableCell>
                                                {currentCompanyDetails?.company_settings?.features?.enable_gst && (
                                                    <>
                                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>GST (%)</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>GST (&#8377;)</TableCell>
                                                    </>
                                                )}
                                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Amount (&#8377;)</TableCell>
                                                {currentCompanyDetails?.company_settings?.features?.enable_gst && (
                                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Total (&#8377;)</TableCell>
                                                )}
                                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.items.map((item, index) => (
                                                <AnimatedTableRow key={index}>
                                                    <TableCell>
                                                        <Autocomplete
                                                            options={itemsList}
                                                            getOptionLabel={(option) =>
                                                                typeof option === 'string'
                                                                    ? option
                                                                    : option?.name || ''
                                                            }
                                                            value={
                                                                itemsList.find((p) => p.id === item.item_id) ||
                                                                (item.item ? { id: '', name: item.item, unit: '', gst: '', hsn_code: '' } : null)
                                                            }
                                                            onChange={(_, newValue) => {
                                                                if (newValue && typeof newValue === 'object') {
                                                                    handleItemChange(index, 'item', newValue.name);
                                                                    handleItemChange(index, 'item_id', newValue.id);
                                                                    if (currentCompanyDetails?.company_settings?.features?.enable_gst)
                                                                        handleItemChange(index, 'gst', newValue.gst);
                                                                } else {
                                                                    handleItemChange(index, 'item', '');
                                                                    handleItemChange(index, 'item_id', '');
                                                                }
                                                            }}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    placeholder="Start typing for items suggestions..."
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    size="small"
                                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1, width: '100%' } }}
                                                                />
                                                            )}
                                                            sx={{
                                                                '& .MuiAutocomplete-endAdornment': {
                                                                    display: 'none'
                                                                }
                                                            }}
                                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                            variant="outlined"
                                                            size="small"
                                                            fullWidth
                                                            inputProps={{
                                                                min: 0,
                                                                step: 1,
                                                                style: {
                                                                    MozAppearance: 'textfield',
                                                                },
                                                            }}
                                                            InputProps={{
                                                                startAdornment: null,
                                                                endAdornment: null,
                                                                inputProps: {
                                                                    min: 0,
                                                                    step: 1,
                                                                    style: {
                                                                        MozAppearance: 'textfield',
                                                                    },
                                                                },
                                                            }}
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': { borderRadius: 1, maxWidth: 70 },
                                                                '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                                                    WebkitAppearance: 'none',
                                                                    margin: 0,
                                                                },
                                                                '& input[type=number]': {
                                                                    MozAppearance: 'textfield',
                                                                },
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            type="number"
                                                            value={item.rate}
                                                            onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                                                            variant="outlined"
                                                            size="small"
                                                            fullWidth
                                                            inputProps={{
                                                                min: 0,
                                                                step: 0.01,
                                                                style: {
                                                                    MozAppearance: 'textfield',
                                                                },
                                                            }}
                                                            InputProps={{
                                                                startAdornment: <InputAdornment position="start">&#8377;</InputAdornment>,
                                                                endAdornment: null,
                                                                inputProps: {
                                                                    min: 0,
                                                                    step: 0.01,
                                                                    style: {
                                                                        MozAppearance: 'textfield',
                                                                    },
                                                                },
                                                            }}
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': { borderRadius: 1, maxWidth: 70 },
                                                                '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                                                    WebkitAppearance: 'none',
                                                                    margin: 0,
                                                                },
                                                                '& input[type=number]': {
                                                                    MozAppearance: 'textfield',
                                                                },
                                                            }}
                                                        />
                                                    </TableCell>
                                                    {currentCompanyDetails?.company_settings?.features?.enable_gst && (
                                                        <>
                                                            <TableCell>
                                                                <Box
                                                                    sx={{
                                                                        py: 1,
                                                                        // bgcolor: alpha(theme.palette.success.main, 0.1),
                                                                        borderRadius: 1,
                                                                        border: `1px solid ${alpha(theme.palette.success.main, 0.5)}`,
                                                                        textAlign: 'center',
                                                                        fontWeight: 'bold',
                                                                        color: 'success.main',
                                                                        maxWidth: 70
                                                                    }}
                                                                >
                                                                    {itemsList.find((p) => p.id === item.item_id)?.gst || 0} %
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box
                                                                    sx={{
                                                                        py: 1,
                                                                        bgcolor: alpha(theme.palette.success.main, 0.1),
                                                                        borderRadius: 1,
                                                                        border: `1px solid ${alpha(theme.palette.success.main, 0.5)}`,
                                                                        textAlign: 'center',
                                                                        fontWeight: 'bold',
                                                                        color: 'success.main',
                                                                        // maxWidth: 100
                                                                    }}
                                                                >
                                                                    &#8377; {(item.gst_amount ?? 0).toFixed(2)}
                                                                </Box>
                                                            </TableCell>
                                                        </>
                                                    )}

                                                    <TableCell>
                                                        <Box
                                                            sx={{
                                                                py: 1,
                                                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                                                borderRadius: 1,
                                                                border: `1px solid ${alpha(theme.palette.success.main, 0.5)}`,
                                                                textAlign: 'center',
                                                                fontWeight: 'bold',
                                                                color: 'success.main',
                                                                // maxWidth: 100
                                                            }}
                                                        >
                                                            &#8377; {item.amount.toFixed(2)}
                                                        </Box>
                                                    </TableCell>
                                                    {currentCompanyDetails?.company_settings?.features?.enable_gst && (
                                                        <TableCell>
                                                            <Box
                                                                sx={{
                                                                    py: 1,
                                                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                                                    borderRadius: 1,
                                                                    border: `1px solid ${alpha(theme.palette.success.main, 0.5)}`,
                                                                    textAlign: 'center',
                                                                    fontWeight: 'bold',
                                                                    color: 'success.main',
                                                                    // maxWidth: 100
                                                                }}
                                                            >
                                                                &#8377; {(Number(item.amount) + Number(item.gst_amount ?? 0)).toFixed(2)}
                                                            </Box>
                                                        </TableCell>
                                                    )}
                                                    <TableCell align="center">
                                                        <Tooltip title="Remove Item">
                                                            <IconButton
                                                                color="error"
                                                                onClick={() => handleRemoveItem(index)}
                                                                sx={{
                                                                    '&:hover': {
                                                                        backgroundColor: alpha(theme.palette.error.main, 0.1)
                                                                    }
                                                                }}
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </AnimatedTableRow>
                                            ))}

                                            {data.items.length > 0 && (
                                                <TableRow sx={{
                                                    fontWeight: 'bold',
                                                    borderTop: `2px solid ${theme.palette.primary.main}`,
                                                    '& .MuiTableCell-root': {
                                                        padding: '8px 8px',
                                                    },
                                                }}>
                                                    <TableCell align="left">
                                                        <Typography variant="h6" color="text.secondary" gutterBottom marginLeft={1}>
                                                            Sub-Totals
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {data.items.reduce((total, item) => total + (item.quantity || 0), 0)} items
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        &#8377; {data.items.reduce((total, item) => total + (item.rate || 0), 0).toFixed(2)}
                                                    </TableCell>
                                                    {currentCompanyDetails?.company_settings?.features?.enable_gst && (
                                                        <>
                                                            <TableCell align="center"></TableCell>
                                                            <TableCell align="center">
                                                                &#8377; {data.items.reduce((total, item) => total + (item.gst_amount || 0), 0).toFixed(2)}
                                                            </TableCell>
                                                        </>
                                                    )}
                                                    <TableCell align="center">
                                                        &#8377; {data.items.reduce((total, item) => total + (item.amount || 0), 0).toFixed(2)}
                                                    </TableCell>
                                                    {currentCompanyDetails?.company_settings?.features?.enable_gst && (
                                                        <TableCell align="center">
                                                            <Box
                                                                sx={{
                                                                    py: 1,
                                                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                                                    borderRadius: 1,
                                                                    border: `1px solid ${alpha(theme.palette.success.main, 0.5)}`,
                                                                    textAlign: 'center',
                                                                    fontWeight: 'bold',
                                                                    color: 'success.main',
                                                                }}
                                                            >
                                                                &#8377; {(data.items.reduce((total, item) => total + (item.amount || 0), 0) + data.items.reduce((total, item) => total + (item.gst_amount || 0), 0)).toFixed(2)}
                                                            </Box>
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            )}
                                            {data.items.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={currentCompanyDetails?.company_settings?.features?.enable_gst ? 8 : 5} align="center">
                                                        <Box py={1} textAlign="center">
                                                            <Inventory sx={{ fontSize: 56, color: 'text.disabled', mb: 1 }} />
                                                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                                                No items added yet
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary" mb={2}>
                                                                Click "Add Item Row" to start building your invoice
                                                            </Typography>
                                                            <Button
                                                                variant="contained"
                                                                startIcon={<Add />}
                                                                onClick={handleAddItem}
                                                                sx={{ borderRadius: 1 }}
                                                            >
                                                                Add First Item
                                                            </Button>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between' }}>
                                    <TextField
                                        label="Remarks"
                                        fullWidth
                                        size='small'
                                        value={data.narration}
                                        onChange={handleChange}
                                        name="narration"
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Info color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ my: 2, width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isLoading}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 1,
                                    }}
                                    startIcon={isLoading ? <CircularProgress size={20} /> : <Save />}
                                >
                                    {isLoading ? 'Creating Invoice...' : 'Create Invoice'}
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </StyledCard>
            </Container>
        </LocalizationProvider>
    );
}