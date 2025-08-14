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
    AddCircleOutline,
    LocalOffer,
    PeopleAlt,
    Info,
    LocationOn,
    Commute,
    LocalShipping,
    AddCard,
    Edit,
    Cancel,
    Timeline
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { viewAllCustomerWithType } from '@/services/customers';
import { viewProductsWithId } from '@/services/products';
import { updateGSTInvoice, updateInvoice, viewInvoice } from '@/services/invoice';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { capitalizeInput } from '@/utils/functions';
import AddItemModal from '@/common/modals/AddItemModal';
import ActionButtonSuccess from '@/common/buttons/ActionButtonSuccess';
import ActionButtonCancel from '@/common/buttons/ActionButtonCancel';

// Interfaces
interface InvoiceItems {
    entry_id?: string;
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
    entry_id?: string;
    vouchar_id: string;
    ledger: string;
    ledger_id: string;
    amount: number;
}

// Mode of Transport Options
const modeOfTransportOptions = [
    { label: 'By Road', value: 'By Road' },
    { label: 'By Rail', value: 'By Rail' },
    { label: 'By Air', value: 'By Air' },
    { label: 'By Sea', value: 'By Sea' },
];

const paymentStatusOptions = [
    { label: 'Paid', value: 'Paid' },
    { label: 'Unpaid', value: 'Unpaid' },
    { label: 'Partially Paid', value: 'Partially Paid' },
];

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

// Main Component
export default function UpdateSalePurchase() {
    const { type, voucher_id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [parties, setParties] = useState<{ id: string; name: string; }[]>([]);
    const [date, setDate] = useState(new Date());
    const [itemsList, setItemsList] = useState<{ id: string; name: string; unit: string, gst: string, hsn_code: string }[]>([]);
    const theme = useTheme();

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { currentCompany } = useSelector((state: RootState) => state.auth);
    const { invoiceData, invoiceType_id } = useSelector((state: RootState) => state.invoice);

    const { user, current_company_id } = useSelector((state: RootState) => state.auth);
    const currentCompanyId = current_company_id || localStorage.getItem("current_company_id") || user?.user_settings?.current_company_id || '';

    const currentCompanyDetails = user?.company?.find((c: any) => c._id === currentCompanyId);
    const gst_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_gst;
    const [isAddItemModalOpen, setAddItemModalOpen] = useState(false);
    const [item, setItem] = useState<InvoiceItems | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [data, setData] = useState({
        _id: '',
        company_id: "",
        date: '',
        voucher_type: "",
        voucher_type_id: "",
        voucher_number: "",
        party_name: "",
        party_name_id: "",
        narration: "",
        reference_number: "",
        reference_date: "",
        place_of_supply: "",
        mode_of_transport: "",
        vehicle_number: "",
        status: "",
        due_date: "",
        accounting: [] as InvoiceAccounting[],
        items: [] as InvoiceItems[],
    });


    const handleAddItem = () => {
        setItem(null);
        setAddItemModalOpen(true);
    };

    const handleRemoveItem = (index: number) => {
        setData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleChange = (field: string, value: any) => {
        setData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const calculateTotals = React.useCallback(() => {
        const subtotal = data.items.reduce((sum, item) => sum + (item.amount || 0), 0).toFixed(2);
        const gstTotal = data.items.reduce((sum, item) => sum + (item.gst_amount || 0), 0).toFixed(2);
        const grandTotal = (parseFloat(subtotal) + parseFloat(gstTotal)).toFixed(2);
        return { subtotal, grandTotal, gstTotal };
    }, [data.items]);

    const { grandTotal } = calculateTotals();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (currentCompanyDetails?.company_settings?.features?.enable_gst) {
            const dataToSend = {
                ...data,
                vouchar_id: data._id || '',
                user_id: user._id,
                company_id: currentCompany?._id || '',
                date: data.date,
                voucher_type: data.voucher_type,
                voucher_type_id: invoiceType_id || '',
                voucher_number: data.voucher_number,
                party_name: data.party_name,
                party_name_id: data.party_name_id,
                narration: data.narration || '',
                reference_number: data.reference_number || '',
                reference_date: data.reference_date || '',
                place_of_supply: data.place_of_supply || '',
                mode_of_transport: data.mode_of_transport || '',
                vehicle_number: data.vehicle_number || '',
                status: data.status || '',
                due_date: data.due_date || '',
                items: data.items.map(item => ({
                    ...item,
                    entry_id: item.entry_id || '',
                    vouchar_id: data._id,
                    item: item.item,
                    item_id: item.item_id,
                    quantity: item.quantity,
                    rate: item.rate,
                    amount: item.amount,
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
                accounting:
                    data.accounting.map(acc => {
                        let amount = 0;
                        if (type?.toLowerCase() === 'purchase') {
                            amount = acc.ledger === data.party_name ? Number(grandTotal) : -Number(grandTotal);
                        } else if (type?.toLowerCase() === 'sales') {
                            amount = acc.ledger === data.party_name ? -Number(grandTotal) : Number(grandTotal);
                        }
                        return {
                            entry_id: acc.entry_id || '',
                            vouchar_id: data._id,
                            ledger: acc.ledger,
                            ledger_id: acc.ledger_id,
                            amount,
                        };
                    }),
            }



            dispatch(updateGSTInvoice(dataToSend)).then(() => {
                toast.success("Invoice updated successfully!");
                setIsLoading(false);
                navigate('/invoices', { replace: true });
            }).catch((error) => {
                setIsLoading(false);
                toast.error(error || "An unexpected error occurred. Please try again later.");
            });
        }
        else {
            const dataToSend = {
                vouchar_id: data._id || '',
                user_id: user._id,
                company_id: currentCompany?._id || '',
                date: date.toISOString().split('T')[0],
                voucher_type: data.voucher_type,
                voucher_type_id: invoiceType_id || '',
                voucher_number: data.voucher_number,
                party_name: data.party_name,
                party_name_id: data.party_name_id,
                narration: data.narration || '',
                reference_number: data.reference_number || '',
                reference_date: data.reference_date || '',
                place_of_supply: data.place_of_supply || '',
                mode_of_transport: data.mode_of_transport || '',
                vehicle_number: data.vehicle_number || '',
                status: data.status || '',
                due_date: data.due_date || '',
                accounting:
                    data.accounting.map(acc => {
                        let amount = 0;
                        if (type?.toLowerCase() === 'purchase') {
                            amount = acc.ledger === data.party_name ? Number(grandTotal) : -Number(grandTotal);
                        } else if (type?.toLowerCase() === 'sales') {
                            amount = acc.ledger === data.party_name ? -Number(grandTotal) : Number(grandTotal);
                        }
                        return {
                            entry_id: acc.entry_id || '',
                            vouchar_id: data._id,
                            ledger: acc.ledger,
                            ledger_id: acc.ledger_id,
                            amount,
                        };
                    }),
                items: data.items.map(item => ({
                    entry_id: item.entry_id || '',
                    vouchar_id: data._id,
                    item: item.item,
                    item_id: item.item_id,
                    quantity: item.quantity,
                    rate: item.rate,
                    amount: item.amount,
                    additional_amount: 0,
                    discount_amount: 0,
                    godown: '',
                    godown_id: '',
                    order_number: '',
                    order_due_date: '',
                })),
            }


            dispatch(updateInvoice(dataToSend)).then(() => {
                setIsLoading(false);
                toast.success("Invoice updated successfully!");
                navigate('/invoices', { replace: true });
            }).catch((error) => {
                setIsLoading(false);
                toast.error(error || "An unexpected error occurred. Please try again later.");
            });
        }

    };

    useEffect(() => {
        if (currentCompanyId) {
            setData(prev => ({
                ...prev,
                company_id: currentCompanyId,
                voucher_type: type ? type.charAt(0).toUpperCase() + type.slice(1) : '',
            }));
        }

        dispatch(viewAllCustomerWithType({
            company_id: currentCompanyId || '',
            customerType: type === 'sales' ? 'Debtors' : 'Creditors',
        })).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                const ledgersWithType = response.payload;
                setParties(ledgersWithType.map((part: any) => ({ name: part.ledger_name, id: part._id })));
            }
        }
        ).catch((error) => {
            setIsLoading(false);
            toast.error(error || "An unexpected error occurred. Please try again later.");
        });

        dispatch(viewProductsWithId(currentCompanyId || '')).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
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
        }).catch((error) => {
            toast.error(error || "An unexpected error occurred. Please try again later.");
            setIsLoading(false);
        });
    }, [dispatch, type, currentCompanyId, user]);

    useEffect(() => {
        dispatch(viewInvoice({
            vouchar_id: voucher_id || '',
            company_id: currentCompany?._id || '',
        }));
    }, [dispatch, currentCompany?._id, voucher_id, gst_enable]);

    useEffect(() => {
        if (invoiceData) {
            setData({
                _id: invoiceData._id,
                company_id: invoiceData.company_id,
                date: invoiceData.date,
                voucher_type: invoiceData.voucher_type,
                voucher_type_id: invoiceData.voucher_type_id,
                voucher_number: invoiceData.voucher_number,
                party_name: invoiceData.party_name,
                party_name_id: invoiceData.party_name_id,
                narration: invoiceData.narration || '',
                reference_number: invoiceData.reference_number || '',
                reference_date: invoiceData.reference_date || '',
                place_of_supply: invoiceData.place_of_supply || '',
                mode_of_transport: invoiceData.mode_of_transport || '',
                vehicle_number: invoiceData.vehicle_number || '',
                status: invoiceData.status || '',
                due_date: invoiceData.due_date || '',
                accounting: invoiceData.accounting_entries.map((acc) => ({
                    entry_id: acc._id || '',
                    vouchar_id: acc.vouchar_id || '',
                    ledger: acc.ledger || '',
                    ledger_id: acc.ledger_id || '',
                    amount: acc.amount || 0,
                })),
                items: invoiceData.inventory.map((item) => ({
                    entry_id: item._id || '',
                    vouchar_id: item.vouchar_id || '',
                    item: item.item || '',
                    item_id: item.item_id || '',
                    quantity: item.quantity || 1,
                    rate: item.rate || 0.0,
                    gst: parseInt(item?.gst ?? '') || 0,
                    gst_amount: parseFloat(item?.gst_amount ?? '') || 0.0,
                    amount: item.amount || 0.0,
                })),
            });
            setDate(new Date(invoiceData.date));
        }
    }, [invoiceData]);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Header Section */}
                <Box sx={{ mb: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
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
                    <Grid
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <ActionButtonCancel
                            onClick={() => {
                                navigate(-1);
                            }}
                            disabled={isLoading}
                            startIcon={<Cancel />}
                        />
                        <ActionButtonSuccess
                            onClick={handleSubmit}
                            disabled={isLoading}
                            startIcon={isLoading ? <Timeline className="animate-spin" /> : <AddCircleOutline />}
                            text={isLoading ? `Updating...` : `Update Invoice ${(type ? type.charAt(0).toUpperCase() + type.slice(1) : '')}`}
                        />
                    </Grid>
                </Box>

                {/* Main Form */}
                <StyledCard>
                    <CardContent sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center" mb={3}>
                            <Receipt color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">Invoice Details {(type ? type.charAt(0).toUpperCase() + type.slice(1) : '')}</Typography>
                        </Box>
                        <Box component="form" onSubmit={handleSubmit}>
                            <Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <StyledCard>
                                            <CardContent>


                                                <Stack direction={'row'} spacing={2}>
                                                    <TextField
                                                        label="Invoice Number"
                                                        fullWidth
                                                        value={data.voucher_number}
                                                        onChange={(e) => handleChange('voucher_number', e.target.value)}
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
                                                        maxDate={new Date()}
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

                                                {gst_enable && <Stack direction={'row'} spacing={2} sx={{ mt: 2 }}>
                                                    <TextField
                                                        label="Place of Supply"
                                                        fullWidth
                                                        value={data.place_of_supply}
                                                        onChange={(e) => handleChange('place_of_supply', capitalizeInput(e.target.value, 'words'))}
                                                        name="place_of_supply"
                                                        variant="outlined"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <LocationOn color="action" />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        sx={{ maxWidth: '50%' }}
                                                    />

                                                    <Autocomplete
                                                        options={modeOfTransportOptions}
                                                        getOptionLabel={(option) => option.label}
                                                        value={modeOfTransportOptions.find(option => option.value === data.mode_of_transport) || null}
                                                        onChange={(_, newValue) =>
                                                            setData(prev => ({
                                                                ...prev,
                                                                mode_of_transport: newValue ? newValue.value : ''
                                                            }))
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Mode of Transport"
                                                                variant="outlined"
                                                                fullWidth
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <Commute color="primary" />
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                            />
                                                        )}
                                                        sx={{ width: '100%', }}
                                                        componentsProps={{
                                                            paper: {
                                                                sx: {
                                                                    border: '1px solid #000',
                                                                    borderRadius: 1,
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </Stack>}
                                            </CardContent>
                                        </StyledCard>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <StyledCard>
                                            <CardContent>
                                                <Stack spacing={2}>
                                                    <Autocomplete
                                                        options={parties}
                                                        disabled
                                                        getOptionLabel={(option) => option.name}
                                                        value={parties.find(p => p.id === data.party_name_id) || null}
                                                        onChange={(_, newValue) =>
                                                            setData(prev => ({
                                                                ...prev,
                                                                party_name: newValue ? newValue.name : '',
                                                                party_name_id: newValue ? newValue.id : ''
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
                                                                            <PeopleAlt color="primary" />
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
                                                </Stack>

                                                {gst_enable && <Stack direction={'row'} spacing={2} sx={{ mt: 2 }}>
                                                    <TextField
                                                        label={data.mode_of_transport === 'By Road' ? "Vehicle Number" : data.mode_of_transport === 'By Rail' ? "Train Number" : data.mode_of_transport === 'By Air' ? "Flight Number" : data.mode_of_transport === 'By Sea' ? "Container Number" : 'Vehicle Number'}
                                                        fullWidth
                                                        value={data.vehicle_number}
                                                        onChange={(e) => handleChange('vehicle_number', capitalizeInput(e.target.value, 'characters'))}
                                                        name="vehicle_number"
                                                        variant="outlined"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <LocalShipping color="action" />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />

                                                    <Autocomplete
                                                        options={paymentStatusOptions}
                                                        getOptionLabel={(option) => option.label}
                                                        value={paymentStatusOptions.find(option => option.value === data.status) || null}
                                                        onChange={(_, newValue) =>
                                                            setData(prev => ({
                                                                ...prev,
                                                                status: newValue ? newValue.value : ''
                                                            }))
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Payment Status"
                                                                variant="outlined"
                                                                fullWidth
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <AddCard color="action" />
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                            />
                                                        )}
                                                        sx={{ width: '100%' }}
                                                        componentsProps={{
                                                            paper: {
                                                                sx: {
                                                                    border: '1px solid #000',
                                                                    borderRadius: 1,
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </Stack>}
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
                                        Add Items
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
                                                <TableCell align="left" >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Inventory />
                                                        <Typography variant="body1" fontWeight="bold">
                                                            Item
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                                    <Typography variant="body1" fontWeight="bold">
                                                        Quantity
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                                    <Typography variant="body1" fontWeight="bold">
                                                        Rate (&#8377;)
                                                    </Typography>
                                                </TableCell>
                                                {currentCompanyDetails?.company_settings?.features?.enable_gst && (
                                                    <>
                                                        <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                                            <Typography variant="body1" fontWeight="bold">
                                                                GST (%)
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                                            <Typography variant="body1" fontWeight="bold">
                                                                GST (&#8377;)
                                                            </Typography>
                                                        </TableCell>
                                                    </>
                                                )}
                                                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                                    <Typography variant="body1" fontWeight="bold">
                                                        Amount (&#8377;)
                                                    </Typography>
                                                </TableCell>
                                                {currentCompanyDetails?.company_settings?.features?.enable_gst && (
                                                    <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                                        <Typography variant="body1" fontWeight="bold">
                                                            Total (&#8377;)
                                                        </Typography>
                                                    </TableCell>
                                                )}
                                                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                                    <Typography variant="body1" fontWeight="bold">
                                                        Actions
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.items.map((item, index) => (
                                                <TableRow sx={{
                                                    "& .MuiTableCell-root": {
                                                        padding: '8px 16px',
                                                    },
                                                }} key={index}>
                                                    <TableCell align="left">
                                                        <Typography variant="body2" color="text.primary" gutterBottom>
                                                            {itemsList.find((p) => p.id === item.item_id)?.name || item.item}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography variant="body2" color="text.primary" gutterBottom>
                                                            {item.quantity}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography variant="body2" color="text.primary" gutterBottom>
                                                            {item.rate}
                                                        </Typography>
                                                    </TableCell>
                                                    {currentCompanyDetails?.company_settings?.features?.enable_gst && (
                                                        <>
                                                            <TableCell align="center">
                                                                <Typography variant="body2" color="text.primary" gutterBottom>
                                                                    {itemsList.find((p) => p.id === item.item_id)?.gst || 0} %
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Typography variant="body2" color="text.primary" gutterBottom>
                                                                    &#8377; {item.gst_amount?.toFixed(2) || '0.00'}
                                                                </Typography>
                                                            </TableCell>
                                                        </>
                                                    )}

                                                    <TableCell align="center">
                                                        <Typography variant="body2" color="text.primary" gutterBottom>
                                                            &#8377; {item.amount?.toFixed(2) || '0.00'}
                                                        </Typography>
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
                                                                <Typography variant="body2" color="text.primary" gutterBottom>
                                                                    &#8377; {(Number(item.amount) + Number(item.gst_amount ?? 0)).toFixed(2)}
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>
                                                    )}
                                                    <TableCell align="right">
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                                            <Tooltip title="Edit Item">
                                                                <ActionButtonSuccess
                                                                    onClick={() => {
                                                                        setItem(item);
                                                                        setAddItemModalOpen(true);
                                                                    }}
                                                                    text={<Edit />}
                                                                />
                                                            </Tooltip>

                                                            <Tooltip title="Remove Item">
                                                                <ActionButtonCancel
                                                                    onClick={() => handleRemoveItem(index)}
                                                                    text={<Delete />}
                                                                />
                                                            </Tooltip>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}

                                            {data.items.length > 0 && (
                                                <>
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
                                                        <TableCell align="center">
                                                            {data.items.reduce((total, item) => total + (Number(item.quantity) || 0), 0)} units
                                                        </TableCell>
                                                        <TableCell align="center">

                                                        </TableCell>
                                                        {currentCompanyDetails?.company_settings?.features?.enable_gst && (
                                                            <>
                                                                <TableCell align="center"></TableCell>
                                                                <TableCell align="center">
                                                                    &#8377; {Number(data.items.reduce((total, item) => total + (item.gst_amount || 0), 0)).toFixed(2)}
                                                                </TableCell>
                                                            </>
                                                        )}
                                                        <TableCell align="center">
                                                            &#8377; {Number(data.items.reduce((total, item) => total + (item.amount || 0), 0)).toFixed(2)}
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
                                                        <TableCell align="right">
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                                                <Tooltip title="Add Item">
                                                                    <Button
                                                                        variant="contained"
                                                                        startIcon={<AddCircleOutline />}
                                                                        onClick={handleAddItem}
                                                                        sx={{ borderRadius: 1 }}
                                                                    >
                                                                        Add more Items
                                                                    </Button>
                                                                </Tooltip>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                </>
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
                                                                Click "Add Items" to start building your invoice
                                                            </Typography>
                                                            <Button
                                                                variant="contained"
                                                                startIcon={<Add />}
                                                                onClick={handleAddItem}
                                                                sx={{ borderRadius: 1 }}
                                                            >
                                                                Add Items to the invoice
                                                            </Button>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                {/* <Box sx={{ my: 2, display: 'flex', justifyContent: 'space-between' }}>
                                          <TextField
                                              label="Additional Charges"
                                              fullWidth
                                              size='small'
                                              // value={data.additional_charges}
                                              // onChange={(e) => handleChange('additional_charges', e.target.value)}
                                              name="additional_charges"
                                              variant="outlined"
                                              type="number"
                                              InputProps={{
                                                  startAdornment: (
                                                      <InputAdornment position="start">
                                                          <AttachMoney color="action" />
                                                      </InputAdornment>
                                                  ),
                                              }}
                                              sx={{ maxWidth: '200px' }}
                                          />
                                          <TextField
                                              label="Discount"
                                              fullWidth
                                              size='small'
                                              // value={data.discount}
                                              // onChange={(e) => handleChange('discount', e.target.value)}
                                              name="discount"
                                              variant="outlined"
                                              type="number"
                                              InputProps={{
                                                  startAdornment: (
                                                      <InputAdornment position="start">
                                                          <AttachMoney color="action" />
                                                      </InputAdornment>
                                                  ),
                                              }}
                                              sx={{ maxWidth: '200px' }}
                                          />
      
                                          <TextField
                                              label="Round Off"
                                              fullWidth
                                              size='small'
                                              // value={data.round_off}
                                              // onChange={(e) => handleChange('round_off', e.target.value)}
                                              name="round_off"
                                              variant="outlined"
                                              type="number"
                                              InputProps={{
                                                  startAdornment: (
                                                      <InputAdornment position="start">
                                                          <AttachMoney color="action" />
                                                      </InputAdornment>
                                                  ),
                                              }}
                                              sx={{ maxWidth: '200px' }}
                                          />
      
                                          <TextField
                                              label="Amount Paid"
                                              fullWidth
                                              size='small'
                                              // value={data.amount_paid}
                                              // onChange={(e) => handleChange('amount_paid', e.target.value)}
                                              name="amount_paid"
                                              variant="outlined"
                                              type="number"
                                              InputProps={{
                                                  startAdornment: (
                                                      <InputAdornment position="start">
                                                          <AttachMoney color="action" />
                                                      </InputAdornment>
                                                  ),
                                              }}
                                              sx={{ maxWidth: '200px' }}
                                          />
      
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                              <Typography variant="h6" sx={{ mr: 1 }}>
                                                  Total GST
                                              </Typography>
                                              <Box sx={{
                                                  py: 1,
                                                  px: 2,
                                                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                                                  borderRadius: 1,
                                                  border: `1px solid ${alpha(theme.palette.warning.main, 0.5)}`,
                                                  textAlign: 'center',
                                                  fontWeight: 'bold',
                                                  color: 'warning.main',
                                              }}>
                                                  &#8377; {data.items.reduce((total, item) => total + (item.gst_amount || 0), 0).toFixed(2)}
                                              </Box>
                                          </Box>
      
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                              <Typography variant="h6" sx={{ mr: 1 }}>
                                                  Total Invoice Amount
                                              </Typography>
                                              <Box sx={{
                                                  py: 1,
                                                  px: 2,
                                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                  borderRadius: 1,
                                                  border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                                                  textAlign: 'center',
                                                  fontWeight: 'bold',
                                                  color: 'primary.main',
                                              }}>
                                                  &#8377; {(data.items.reduce((total, item) => total + (item.amount || 0), 0) + data.items.reduce((total, item) => total + (item.gst_amount || 0), 0)).toFixed(2)}
                                              </Box>
                                          </Box>
      
                                      </Box> */}
                                <TextField
                                    label="Remarks"
                                    fullWidth
                                    size='small'
                                    value={data.narration}
                                    onChange={(e) => handleChange('narration', e.target.value)}
                                    name="narration"
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Info color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ my: 2, }}
                                />
                            </Box>

                            <Box sx={{ my: 1, width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <ActionButtonCancel
                                    onClick={() => {
                                        navigate(-1);
                                    }}
                                    disabled={isLoading}
                                    startIcon={<Cancel />}
                                />
                                <ActionButtonSuccess
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    startIcon={isLoading ? <Timeline className="animate-spin" /> : <AddCircleOutline />}
                                    text={isLoading ? `Updating...` : `Update Invoice ${(type ? type.charAt(0).toUpperCase() + type.slice(1) : '')}`}
                                />
                            </Box>
                        </Box>
                    </CardContent>
                </StyledCard>

                <AddItemModal
                    open={isAddItemModalOpen}
                    onClose={() => setAddItemModalOpen(false)}
                    onCreated={(item) => {
                        setData(prev => ({
                            ...prev,
                            items: [...prev.items, item]
                        }));
                        setAddItemModalOpen(false);
                    }}
                    onUpdated={(updatedItem) => {
                        setData(prev => ({
                            ...prev,
                            items: prev.items.map(item => item.item_id === updatedItem.item_id ? updatedItem : item)
                        }));
                        setAddItemModalOpen(false);
                    }}
                    item={item}
                />
            </Container>
        </LocalizationProvider>
    );
}