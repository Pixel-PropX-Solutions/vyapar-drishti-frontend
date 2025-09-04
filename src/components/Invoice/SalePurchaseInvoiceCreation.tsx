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
    Stack,
    Fade,
    Slide,
    Chip,
    Divider,
    IconButton,
    LinearProgress,
    Backdrop,
    CircularProgress,
    Collapse,
} from "@mui/material";
import {
    Inventory,
    Delete,
    Add,
    Receipt,
    AddCircleOutline,
    LocalOffer,
    Info,
    Commute,
    Edit,
    Timeline,
    Cancel,
    Save,
    Preview,
    Business,
    Today,
    Description,
    Calculate,
    TrendingUp,
    Assignment,
    ExpandLess,
    ExpandMore,
    CurrencyRupee,
    AccountBalance,
    PeopleAltOutlined,
    DateRange,
    Payments,
    ArrowBack,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { viewAllCustomerWithType } from '@/services/customers';
import { createInvoice, createInvoiceWithTAX, getInvoiceCounter } from '@/services/invoice';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AddItemModal from '@/common/modals/AddItemModal';
import { capitalizeInput, formatLocalDate, getInitials } from '@/utils/functions';
import ActionButtonSuccess from '@/common/buttons/ActionButtonSuccess';
import ActionButtonCancel from '@/common/buttons/ActionButtonCancel';
import CreateCustomerModal from '@/common/modals/CreateCustomerModal';
import { setCustomerTypeId } from '@/store/reducers/customersReducer';
import { viewAllAccountingGroups } from '@/services/accountingGroup';
import { ActionButton } from '@/common/buttons/ActionButton';

// Interfaces
interface InvoiceItems {
    vouchar_id: string;
    item: string;
    item_id: string;
    unit: string;
    hsn_code?: string;
    quantity: number;
    rate: number;
    amount: number;
    discount_amount: number;
    tax_rate?: number;
    tax_amount?: number;
    total_amount: number;
}

interface InvoiceAccounting {
    vouchar_id: string;
    ledger: string;
    ledger_id: string;
    amount: number;
}

// Enhanced Styled Components
type GradientType = 'primary' | 'secondary' | 'success' | 'warning' | 'glass' | 'error' | 'info';

interface GradientCardProps {
    children: React.ReactNode;
    gradient?: GradientType;
    sx?: object;
    [key: string]: any;
}

const GradientCard = ({ children, gradient = 'primary', ...props }: GradientCardProps) => {
    const theme = useTheme();

    const gradients: Record<GradientType, string> = {
        primary: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.35)} 100%)`,
        secondary: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.main, 0.35)} 100%)`,
        success: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.2)} 0%, ${alpha(theme.palette.success.main, 0.35)} 100%)`,
        warning: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.2)} 0%, ${alpha(theme.palette.warning.main, 0.35)} 100%)`,
        error: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.15)} 0%, ${alpha(theme.palette.error.main, 0.3)} 100%)`,
        info: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.15)} 0%, ${alpha(theme.palette.info.main, 0.3)} 100%)`,
        glass: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`
    };

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 1,
                background: gradients[gradient],
                backdropFilter: 'blur(20px)',
                ...props.sx
            }}
            {...props}
        >
            {children}
        </Card>
    );
};


const AnimatedTextField = ({ ...props }: any) => {

    return (
        <TextField
            {...props}
            sx={{
                '& .MuiOutlinedInput-root': {
                    borderRadius: '4px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                            borderWidth: 2,
                        },
                    },
                    '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                            borderWidth: 2,
                        },
                    },
                },
                '& .MuiInputLabel-root': {
                    fontWeight: 500,
                },
                ...props.sx
            }}
        />
    );
};

const StatusChip = ({ payment_mode, ...props }: any) => {
    const getStatusConfig = (payment_mode: string) => {
        switch (payment_mode?.toLowerCase()) {
            case 'paid':
                return { color: 'success', icon: '✓' };
            case 'unpaid':
                return { color: 'error', icon: '⏳' };
            case 'partially paid':
                return { color: 'warning', icon: '⏱' };
            default:
                return { color: 'default', icon: '❓' };
        }
    };

    const config = getStatusConfig(payment_mode);

    return (
        <Chip
            label={`${config.icon} ${payment_mode}`}
            color={config.color as any}
            variant="outlined"
            size="small"
            sx={{
                fontWeight: 600,
                '& .MuiChip-label': {
                    px: 1.5,
                },
            }}
            {...props}
        />
    );
};

// Mode of Transport Options with enhanced visuals
const modeOfTransportOptions = [
    { label: '🚗 By Road', value: 'By Road', icon: '🚗' },
    { label: '🚂 By Rail', value: 'By Rail', icon: '🚂' },
    { label: '✈️ By Air', value: 'By Air', icon: '✈️' },
    { label: '🚢 By Sea', value: 'By Sea', icon: '🚢' },
];

const paymentModeOptions = [
    { label: '💵 Cash', value: 'Cash', color: 'success' },
    { label: '💳 Card', value: 'Card', color: 'error' },
    { label: '🏦 Net Banking', value: 'Net Banking', color: 'warning' },
    { label: '🏧 NEFT', value: 'NEFT', color: 'warning' },
    { label: '📄 Cheque', value: 'Cheque', color: 'warning' },
];

// Main Component
export default function SalePurchaseInvoiceCreation() {
    const theme = useTheme();
    const { type } = useParams();
    // const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { currentCompany, user, current_company_id } = useSelector((state: RootState) => state.auth);
    const currentCompanyId = current_company_id || localStorage.getItem("current_company_id") || user?.user_settings?.current_company_id || '';
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === currentCompanyId);
    const tax_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_tax;

    const { invoiceType_id } = useSelector((state: RootState) => state.invoice);
    const { accountingGroups } = useSelector((state: RootState) => state.accountingGroup);

    const invoiceType = type !== undefined ? type.charAt(0).toUpperCase() + type.slice(1) : "";
    const [date, setDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [expandedTotals, setExpandedTotals] = useState(true);
    const [expandedNotes, setExpandedNotes] = useState(false);

    const [item, setItem] = useState<InvoiceItems | null>(null);
    const [isAddItemModalOpen, setAddItemModalOpen] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
    const [parties, setParties] = useState<{ id: string; name: string; }[]>([]);
    const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

    const [data, setData] = useState({
        company_id: "",
        date: new Date().toISOString().split('T')[0],
        voucher_type: "",
        voucher_number: '',
        party_name: "",
        party_id: "",
        counter_party: "",
        counter_id: "",
        narration: "",
        reference_number: "",
        reference_date: "",
        place_of_supply: "",
        mode_of_transport: "",
        vehicle_number: "",
        due_date: "",
        payment_mode: "",
        paid_amount: 0,
        total: 0,
        discount: 0,
        total_amount: 0,
        total_tax: 0,
        additional_charge: 0,
        roundoff: 0,
        grand_total: 0,
        accounting: [] as InvoiceAccounting[],
        items: [] as InvoiceItems[],
    });

    // Enhanced validation with better UX
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!date) newErrors.date = "Please select a valid date";
        if (!data.party_name.trim()) newErrors.partyName = `Please select a ${type === 'sales' ? 'customer' : 'supplier'}`;
        if (data.items.length <= 0) newErrors.items = "Please add at least one item to continue";

        setErrors(newErrors);

        // Smooth scroll to first error
        if (Object.keys(newErrors).length > 0) {
            const firstErrorElement = document.querySelector(`[name="${Object.keys(newErrors)[0]}"]`);
            if (firstErrorElement) {
                firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        return Object.keys(newErrors).length === 0;
    };

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

        // Clear errors when user starts typing
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Calculate totals for display only (do not update state here)
    const totals = React.useMemo(() => {
        const total = data.items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
        const discount = data.items.reduce((sum, item) => sum + Number(item.discount_amount || 0), 0);
        const total_amount = Number(total) - Number(discount);
        const total_tax = data.items.reduce((sum, item) => sum + Number(item.tax_amount || 0), 0);
        const additional_charge = Number(data.additional_charge || 0);
        const subtotal1 = data.items.reduce((sum, item) => sum + Number(item.total_amount || 0), 0);
        // const subtotal2 = (total_amount + total_tax);
        // if (subtotal1 !== subtotal2) {
        //     toast.error(`Subtotal mismatch: ${subtotal1} !== ${subtotal2}`);
        //     console.warn(`Subtotal mismatch: ${subtotal1} !== ${subtotal2}`);
        // }
        const subtotal = subtotal1 + additional_charge;
        const roundoff = Math.round(subtotal) - subtotal;
        const grandTotal = (total_amount + total_tax + additional_charge + roundoff);
        return {
            total: Number(total).toFixed(2),
            discount: Number(discount).toFixed(2),
            total_amount: Number(total_amount).toFixed(2),
            total_tax: Number(total_tax).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
            additional_charge: Number(additional_charge).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
            roundoff: Number(roundoff).toFixed(2),
            grandTotal: Number(grandTotal).toFixed(2)
        };
    }, [data]);

    // Destructure for use in JSX
    const { total, discount, total_amount, total_tax, additional_charge, roundoff, grandTotal } = totals;

    // Enhanced submit handler with better loading states
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            if (tax_enable) {
                const dataToSend = {
                    ...data,
                    date: date.toISOString().split('T')[0],
                    company_id: currentCompany?._id || '',
                    voucher_type_id: invoiceType_id || '',
                    party_name_id: data.party_id,
                    mode_of_transport: data.mode_of_transport,
                    vehicle_number: data.vehicle_number,
                    place_of_supply: data.place_of_supply,
                    payment_mode: data.payment_mode,
                    paid_amount: data.paid_amount,
                    due_date: dueDate instanceof Date ? dueDate.toISOString().split('T')[0] : dueDate,
                    additional_charge: Number(additional_charge),
                    discount: Number(discount),
                    total: Number(total),
                    total_amount: Number(total_amount),
                    total_tax: Number(total_tax),
                    roundoff: Number(roundoff),
                    grand_total: Number(grandTotal),
                    items: data.items.map(item => ({
                        ...item,
                        vouchar_id: '',
                        tax_rate: item.tax_rate || 0,
                        tax_amount: Number(item.tax_amount?.toFixed(2)) || 0,
                        additional_amount: 0,
                        discount_amount: item.discount_amount,
                        godown: '',
                        godown_id: '',
                        order_number: '',
                        order_due_date: '',
                        hsn_code: item?.hsn_code || '',
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
                };

                await dispatch(createInvoiceWithTAX(dataToSend));
                toast.success("🎉 Invoice created successfully!");
                navigate('/invoices', { replace: true });
            } else {
                const dataToSend = {
                    ...data,
                    date: date instanceof Date ? date.toISOString().split('T')[0] : date,
                    company_id: currentCompany?._id || '',
                    voucher_type_id: invoiceType_id || '',
                    party_name_id: data.party_id,
                    mode_of_transport: data.mode_of_transport,
                    vehicle_number: data.vehicle_number,
                    place_of_supply: data.place_of_supply,
                    payment_mode: data.payment_mode,
                    paid_amount: data.paid_amount,
                    due_date: dueDate instanceof Date ? dueDate.toISOString().split('T')[0] : dueDate,
                    additional_charge: Number(additional_charge),
                    discount: Number(discount),
                    total: Number(total),
                    total_amount: Number(total_amount),
                    total_tax: Number(total_tax),
                    roundoff: Number(roundoff),
                    grand_total: Number(grandTotal),
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
                };

                await dispatch(createInvoice(dataToSend));
                toast.success("🎉 Invoice created successfully!");
                navigate('/invoices', { replace: true });
            }
        } catch (error) {
            toast.error("❌ Failed to create invoice. Please try again.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadCustomers = async () => {
        const customerResponse = await dispatch(viewAllCustomerWithType({
            company_id: currentCompanyId || '',
            customerType: invoiceType === 'Sales' ? 'Debtors' : 'Creditors',
        }));

        if (customerResponse.meta.requestStatus === 'fulfilled') {
            const ledgersWithType = customerResponse.payload;
            setParties(ledgersWithType.map((part: any) => ({ name: part.ledger_name, id: part._id })));
        }
    }
    const loadCounter = async () => {
        const counterResponse = await dispatch(getInvoiceCounter({
            company_id: currentCompanyId || '',
            voucher_type: invoiceType,
        }));

        if (counterResponse.meta.requestStatus === 'fulfilled') {
            setData(prev => ({
                ...prev,
                voucher_number: counterResponse.payload.current_number,
            }));
        }
    }

    // Load initial data with enhanced loading states
    useEffect(() => {
        if (currentCompanyId) {
            setData(prev => ({
                ...prev,
                company_id: currentCompanyId,
                voucher_type: invoiceType,
            }));
        }

        const loadData = async () => {
            try {
                await loadCustomers();
                await loadCounter();

            } catch (error) {
                console.error("Failed to load initial data:", error);
                toast.error("Failed to load data. Please refresh the page.");
            }
        };

        loadData();
    }, [dispatch, currentCompanyId, user, invoiceType]);

    useEffect(() => {
        dispatch(viewAllAccountingGroups(currentCompanyId || ""));
    }, [currentCompanyId, dispatch])

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} >
            {/* Loading Backdrop */}
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backdropFilter: 'blur(8px)',
                }}
                open={isLoading}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <CircularProgress color="inherit" size={60} thickness={4} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Creating your invoice...
                    </Typography>
                    <LinearProgress
                        sx={{
                            width: 300,
                            height: 8,
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                            }
                        }}
                    />
                </Box>
            </Backdrop>

            <Container maxWidth={false} sx={{ py: 4, minHeight: '100vh' }}>
                {/* Enhanced Header Section */}
                <Slide direction="down" in={true} timeout={800}>
                    <Box sx={{ mb: 4, }}>
                        <GradientCard gradient="glass" sx={{ mb: 3 }}>
                            <CardContent sx={{ p: 0 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <ActionButton
                                            icon={<ArrowBack fontSize="small" />}
                                            title="Back"
                                            color="primary"
                                            onClick={() => navigate(-1)}
                                        />
                                        <Avatar
                                            sx={{
                                                bgcolor: 'primary.main',
                                                width: 48,
                                                height: 48,
                                                mx: 2,
                                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                                boxShadow: theme.shadows[8],
                                            }}
                                        >
                                            <Receipt sx={{ fontSize: 28 }} />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h5" component="h1" fontWeight="800" color="primary.main" sx={{ mb: 1 }}>
                                                Create {invoiceType}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                <Chip icon={<Business />} label={currentCompany?.name || 'Company'} size="small" />
                                                <Chip icon={<Today />} label={formatLocalDate(date).split('T')[0].split('-').reverse().join('-')} size="small" />
                                                {tax_enable && <Chip icon={<Assignment />} label="TAX Enabled" color="success" size="small" />}
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Preview />}
                                            onClick={() => setShowSummary(!showSummary)}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                px: 3
                                            }}
                                        >
                                            {showSummary ? 'Hide' : 'Show'} Summary
                                        </Button>
                                        <ActionButtonCancel
                                            onClick={() => navigate(-1)}
                                            startIcon={<Cancel />}
                                            disabled={isLoading}
                                        />
                                        <ActionButtonSuccess
                                            onClick={handleSubmit}
                                            disabled={isLoading || data.items.length === 0}
                                            startIcon={isLoading ? <Timeline className="animate-spin" /> : <Save />}
                                            text={isLoading ? `Creating...` : `Create Invoice`}
                                        />
                                    </Box>
                                </Box>
                            </CardContent>
                        </GradientCard>
                    </Box>
                </Slide>

                {/* Quick Summary Sidebar */}
                <Slide direction="left" in={showSummary} timeout={400}>
                    <Box sx={{
                        position: 'fixed',
                        right: showSummary ? 24 : -400,
                        top: 120,
                        width: 350,
                        zIndex: 1200,
                        transition: 'right 0.3s ease',
                        maxHeight: 'calc(100vh - 140px)',
                        overflowY: 'auto',
                        boxShadow: theme.shadows[4],
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,

                    }}>
                        <GradientCard gradient="warning" sx={{ backdropFilter: 'blur(20px)' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Calculate color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="h6" fontWeight="700">
                                        Invoice Summary
                                    </Typography>
                                    <IconButton size="small" onClick={() => setShowSummary(false)} sx={{ ml: 'auto' }}>
                                        <Cancel fontSize="small" />
                                    </IconButton>
                                </Box>
                                <Divider sx={{ mb: 2 }} />

                                <Stack spacing={2}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">Items:</Typography>
                                        <Typography variant="body2" fontWeight="600">{data.items.length}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                                        <Typography variant="body2" fontWeight="600">₹ {total}</Typography>
                                    </Box>
                                    {tax_enable && (
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" color="text.secondary">Tax Total:</Typography>
                                            <Typography variant="body2" fontWeight="600">₹ {total_tax}</Typography>
                                        </Box>
                                    )}
                                    <Divider />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="h6" fontWeight="700">Grand Total:</Typography>
                                        <Typography variant="h6" fontWeight="700" color="primary.main">₹ {grandTotal}</Typography>
                                    </Box>

                                    {data.party_name && (
                                        <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2 }}>
                                            <Typography variant="body2" color="text.secondary">Customer:</Typography>
                                            <Typography variant="body1" fontWeight="600">{data.party_name}</Typography>
                                        </Box>
                                    )}

                                    {data.payment_mode && (
                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <StatusChip payment_mode={data.payment_mode} />
                                        </Box>
                                    )}
                                </Stack>
                            </CardContent>
                        </GradientCard>
                    </Box>
                </Slide>

                {/* Main Form Content */}
                <Box>
                    {/* Invoice Details Section */}
                    <GradientCard gradient="primary" sx={{ mb: 4, border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` }}>
                        <CardContent sx={{ p: 0 }}>
                            {/* Section Header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 40, height: 40 }}>
                                        <Receipt />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                                            Invoice Details
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Basic Invoice details
                                        </Typography>
                                    </Box>
                                </Box>

                                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2}>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddCircleOutline />}
                                        onClick={() => {
                                            dispatch(setCustomerTypeId(accountingGroups.find((group) => group.name.includes(invoiceType === 'Sales' ? 'Debtors' : 'Creditors'))?._id || ''))
                                            setCustomerModalOpen(true)
                                        }}
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            px: 3,
                                            py: 1,
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                            boxShadow: theme.shadows[4],
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: theme.shadows[8],
                                            }
                                        }}
                                    >
                                        Create New Customer
                                    </Button>
                                </Stack>
                            </Box>

                            <Grid container spacing={4}>
                                {/* Left Column - Invoice Details */}
                                <Grid item xs={12} lg={6}>
                                    <GradientCard gradient="glass">
                                        <CardContent sx={{ p: 0 }}>
                                            <Stack spacing={0}>

                                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                                    <AnimatedTextField
                                                        label="Invoice Number"
                                                        fullWidth
                                                        value={data.voucher_number}
                                                        onChange={invoiceType === "Sales" ? undefined : (e: React.ChangeEvent<HTMLInputElement>) => handleChange('voucher_number', e.target.value)}
                                                        name="voucher_number"
                                                        disabled={invoiceType === "Sales"}
                                                        variant="outlined"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Receipt color="primary" />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        sx={{ flex: 1 }}
                                                    />
                                                    <Box sx={{ flex: 1 }}>
                                                        <DatePicker
                                                            label="Invoice Date"
                                                            value={date}
                                                            format="dd/MM/yyyy"
                                                            maxDate={new Date()}
                                                            minDate={new Date(new Date().getFullYear(), 3, 1)}
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
                                                                    InputProps: {
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <DateRange color="primary" />
                                                                            </InputAdornment>
                                                                        ),
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
                                                    </Box>

                                                </Stack>
                                                {tax_enable && <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
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

                                                    <AnimatedTextField
                                                        label={data.mode_of_transport === 'By Road' ? "Vehicle Number" : data.mode_of_transport === 'By Rail' ? "Train Number" : data.mode_of_transport === 'By Air' ? "Flight Number" : data.mode_of_transport === 'By Sea' ? "Container Number" : 'Vehicle Number'}
                                                        value={data.vehicle_number}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('vehicle_number', capitalizeInput(e.target.value, 'characters'))}
                                                        name="vehicle_number"
                                                        variant="outlined"
                                                        fullWidth
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Commute color="primary" />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Stack>}

                                            </Stack>
                                        </CardContent>
                                    </GradientCard>
                                </Grid>
                                {/* Right Column - Additional Details */}
                                <Grid item xs={12} lg={6}>
                                    <GradientCard gradient="glass">
                                        <CardContent>
                                            <Stack >
                                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                                    <Autocomplete
                                                        options={parties}
                                                        getOptionLabel={(option) => option.name}
                                                        value={parties.find(p => p.id === data.party_id) || null}
                                                        onChange={(_, newValue) => {
                                                            handleChange('party_name', newValue?.name || '');
                                                            handleChange('party_id', newValue?.id || '');
                                                            setErrors(prev => ({ ...prev, partyName: '' })); // Clear error
                                                        }}
                                                        renderInput={(params) => (
                                                            <AnimatedTextField
                                                                {...params}
                                                                label="Customer"
                                                                variant="outlined"
                                                                fullWidth
                                                                error={!!errors.partyName}
                                                                helperText={errors.partyName}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <PeopleAltOutlined color="primary" />
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                            />
                                                        )}
                                                        sx={{ flex: 1 }}
                                                    />
                                                </Stack>
                                                {tax_enable && <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                                                    <Box sx={{ width: '50%' }}>
                                                        <DatePicker
                                                            label="Due Date"
                                                            value={dueDate}
                                                            format="dd/MM/yyyy"
                                                            minDate={new Date()}
                                                            views={["year", "month", "day"]}
                                                            onChange={(value) => {
                                                                setDueDate(value || new Date());
                                                            }}
                                                            slotProps={{
                                                                textField: {
                                                                    fullWidth: true,
                                                                    InputProps: {
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <DateRange color="primary" />
                                                                            </InputAdornment>
                                                                        ),
                                                                    },
                                                                    sx: {
                                                                        '& .MuiOutlinedInput-root': {
                                                                            flex: 1
                                                                        },
                                                                        '& .MuiInputAdornment-root .MuiButtonBase-root': {
                                                                            border: 'none',
                                                                            boxShadow: 'none'
                                                                        }
                                                                    },
                                                                },
                                                            }}
                                                        />
                                                    </Box>
                                                    <Autocomplete
                                                        options={paymentModeOptions}
                                                        getOptionLabel={(option) => option.label}
                                                        value={paymentModeOptions.find(option => option.value === data.payment_mode) || null}
                                                        onChange={(_, newValue) =>
                                                            setData(prev => ({
                                                                ...prev,
                                                                payment_mode: newValue ? newValue.value : ''
                                                            }))
                                                        }
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Payment Mode"
                                                                variant="outlined"
                                                                fullWidth
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <Payments color="primary" />
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                            />
                                                        )}
                                                        sx={{ width: '50%', }}
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
                                            </Stack>
                                        </CardContent>
                                    </GradientCard>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </GradientCard>

                    {/* Invoice Items Section */}
                    <GradientCard gradient="secondary" sx={{ mb: 4 }}>
                        <CardContent sx={{ p: 0 }}>
                            {/* Section Header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 2, width: 40, height: 40 }}>
                                        <Inventory />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h5" fontWeight="700" color="secondary.main">
                                            Invoice Items
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {data.items.length === 0
                                                ? 'No items added yet - click "Add Items" to get started'
                                                : `${data.items.length} item${data.items.length > 1 ? 's' : ''} • Total: ₹${grandTotal}`
                                            }
                                        </Typography>
                                    </Box>
                                </Box>

                                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2}>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddCircleOutline />}
                                        onClick={handleAddItem}
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            px: 3,
                                            py: 1,
                                            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                                            boxShadow: theme.shadows[4],
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: theme.shadows[8],
                                            }
                                        }}
                                    >
                                        Add Items
                                    </Button>

                                    {data.items.length > 0 && (
                                        <Chip
                                            icon={<TrendingUp fontSize='large' />}
                                            label={`₹${grandTotal} Total`}
                                            color="success"
                                            variant="filled"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: '2rem',
                                                height: 50,
                                                px: 2,
                                                py: 2.5,
                                                border: `2px solid ${alpha(theme.palette.success.main, 0.7)}`,
                                            }}
                                        />
                                    )}
                                </Stack>
                            </Box>

                            {/* Enhanced Items Table */}
                            <GradientCard gradient="glass">
                                <TableContainer
                                    sx={{
                                        borderRadius: 1,
                                        overflow: "hidden",
                                        border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                                        '& .MuiTableCell-root': {
                                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                                        }
                                    }}
                                >
                                    <Table sx={{ minWidth: 800 }}>
                                        <TableHead>
                                            <TableRow
                                                sx={{
                                                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                                                    '& .MuiTableCell-root': {
                                                        fontWeight: 700,
                                                        fontSize: '0.95rem',
                                                        color: theme.palette.primary.main,
                                                        border: 'none',
                                                        py: 2,
                                                    }
                                                }}
                                            >
                                                <TableCell align="left" sx={{ minWidth: 200 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Inventory fontSize="small" />
                                                        Item Details
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center" sx={{ minWidth: 100 }}>
                                                    Quantity
                                                </TableCell>
                                                <TableCell align="center" sx={{ minWidth: 120 }}>
                                                    Rate (₹)
                                                </TableCell>
                                                <TableCell align="center" sx={{ minWidth: 120 }}>
                                                    Price (₹)
                                                </TableCell>
                                                <TableCell align="center" sx={{ minWidth: 120 }}>
                                                    Discount (₹)
                                                </TableCell>
                                                {tax_enable && (
                                                    <>
                                                        <TableCell align="center" sx={{ minWidth: 100 }}>
                                                            Tax (%)
                                                        </TableCell>
                                                        <TableCell align="center" sx={{ minWidth: 120 }}>
                                                            Tax Amount (₹)
                                                        </TableCell>
                                                    </>
                                                )}
                                                <TableCell align="center" sx={{ minWidth: 140 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                        <TrendingUp fontSize="small" />
                                                        Total (₹)
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center" sx={{ minWidth: 120 }}>
                                                    Actions
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {data.items.map((item, index) => (
                                                <Fade key={index} in={true} timeout={300 + (index * 100)}>
                                                    <TableRow
                                                        sx={{
                                                            '&:hover': {
                                                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                                transform: 'scale(1.01)',
                                                            },
                                                            transition: 'all 0.2s ease',
                                                            '& .MuiTableCell-root': {
                                                                py: 2,
                                                            },
                                                        }}
                                                    >
                                                        <TableCell align="left">
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                <Avatar
                                                                    sx={{
                                                                        width: 36,
                                                                        height: 36,
                                                                        bgcolor: 'primary.main',
                                                                        fontSize: '0.8rem',
                                                                        fontWeight: 600
                                                                    }}
                                                                >
                                                                    {getInitials(item.item).toUpperCase()}
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography variant="body1" fontWeight="600" color="text.primary">
                                                                        {item.item}
                                                                    </Typography>
                                                                    {tax_enable && <Typography variant="caption" color="text.secondary">
                                                                        HSN: {item.hsn_code}
                                                                    </Typography>}
                                                                    {!tax_enable && <Typography variant="caption" color="text.secondary">
                                                                        Unit: {item.unit || 'PCS'}
                                                                    </Typography>}
                                                                </Box>
                                                            </Box>
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <Chip
                                                                label={`${item.quantity} ` + `${tax_enable ? (item.unit ?? 'PCS') : ''}`}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: alpha(theme.palette.info.main, 0.1),
                                                                    color: 'info.main',
                                                                    fontWeight: 600,
                                                                    minWidth: 60,
                                                                    py: 1.5,
                                                                    px: 1,
                                                                }}
                                                            />
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <Typography variant="body1" fontWeight="600" color="text.primary">
                                                                ₹{Number(item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <Typography variant="body1" fontWeight="600" color="text.primary">
                                                                ₹{Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell align="center">
                                                            <Typography variant="body1" fontWeight="600" color="text.primary">
                                                                ₹{Number(item.discount_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                            </Typography>
                                                        </TableCell>

                                                        {tax_enable && (
                                                            <>
                                                                <TableCell align="center">
                                                                    <Chip
                                                                        label={`${item?.tax_rate || 0}%`}
                                                                        size="small"
                                                                        color="warning"
                                                                        sx={{ fontWeight: 600, minWidth: 60, py: 1.5, px: 1 }}
                                                                    />
                                                                </TableCell>

                                                                <TableCell align="center">
                                                                    <Typography variant="body1" fontWeight="600" color="warning.main">
                                                                        ₹{Number(item.tax_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                                    </Typography>
                                                                </TableCell>
                                                            </>
                                                        )}

                                                        <TableCell align="center">
                                                            <Box
                                                                sx={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    px: 2,
                                                                    py: 1,
                                                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                                                    borderRadius: 2,
                                                                    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                                                                }}
                                                            >
                                                                <Typography variant="body1" fontWeight="700" color="success.main">
                                                                    ₹{Number(item.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                                <Tooltip title="Edit Item" arrow>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => {
                                                                            setItem(item);
                                                                            setAddItemModalOpen(true);
                                                                        }}
                                                                        sx={{
                                                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                            color: 'primary.main',
                                                                            '&:hover': {
                                                                                bgcolor: alpha(theme.palette.primary.main, 0.2),
                                                                                transform: 'scale(1.1)',
                                                                            },
                                                                            transition: 'all 0.2s ease'
                                                                        }}
                                                                    >
                                                                        <Edit fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>

                                                                <Tooltip title="Remove Item" arrow>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleRemoveItem(index)}
                                                                        sx={{
                                                                            bgcolor: alpha(theme.palette.error.main, 0.1),
                                                                            color: 'error.main',
                                                                            '&:hover': {
                                                                                bgcolor: alpha(theme.palette.error.main, 0.2),
                                                                                transform: 'scale(1.1)',
                                                                            },
                                                                            transition: 'all 0.2s ease'
                                                                        }}
                                                                    >
                                                                        <Delete fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                </Fade>
                                            ))}

                                            {/* Totals Row */}
                                            {data.items.length > 0 && (
                                                <TableRow
                                                    sx={{
                                                        borderTop: `3px solid ${theme.palette.primary.main}`,
                                                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                                                        '& .MuiTableCell-root': {
                                                            border: 'none',
                                                        },
                                                    }}
                                                >
                                                    <TableCell align="left">
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Calculate color="primary" />
                                                            <Typography variant="h6" fontWeight="700" color="primary.main">
                                                                Subtotals
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <Typography variant="h6" fontWeight="700" color="success.main">
                                                            {Number(data.items.reduce((total, item) => total + (Number(item.quantity) || 0), 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })} Units
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <Typography color="text.secondary">—</Typography>
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <Typography variant="h6" fontWeight="700" color="text.primary">
                                                            ₹ {Number(data.items.reduce((total, item) => total + (item.amount || 0), 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <Typography variant="h6" fontWeight="700" color="text.primary">
                                                            ₹ {Number(data.items.reduce((total, item) => total + Number(item.discount_amount || 0), 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                        </Typography>
                                                    </TableCell>

                                                    {tax_enable && (
                                                        <>
                                                            <TableCell align="center">
                                                                <Typography color="text.secondary">—</Typography>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Typography variant="h6" fontWeight="700" color="warning.main">
                                                                    ₹ {Number(data.items.reduce((total, item) => total + Number(item.tax_amount || 0), 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                                </Typography>
                                                            </TableCell>
                                                        </>
                                                    )}

                                                    <TableCell align="center">
                                                        <Box
                                                            sx={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                px: 2,
                                                                py: .5,
                                                                bgcolor: alpha(theme.palette.success.main, 0.15),
                                                                borderRadius: 2,
                                                                border: `2px solid ${alpha(theme.palette.success.main, 0.5)}`,
                                                            }}
                                                        >
                                                            <Typography variant="h6" fontWeight="700" color="success.main">
                                                                ₹ {Number(data.items.reduce((total, item) => total + Number(item.total_amount || 0), 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <Button
                                                            variant="contained"
                                                            startIcon={<AddCircleOutline />}
                                                            onClick={handleAddItem}
                                                            size="small"
                                                            sx={{
                                                                borderRadius: 1,
                                                                textTransform: 'none',
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            Add More
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )}

                                            {/* Empty State */}
                                            {data.items.length === 0 && (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={tax_enable ? 9 : 7}
                                                        align="center"
                                                        sx={{ py: 4, border: 'none' }}
                                                    >
                                                        <Box sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            gap: 3,
                                                        }}>
                                                            <Avatar
                                                                sx={{
                                                                    width: 80,
                                                                    height: 80,
                                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                    color: 'primary.main'
                                                                }}
                                                            >
                                                                <Inventory sx={{ fontSize: 40 }} />
                                                            </Avatar>

                                                            <Box sx={{ textAlign: 'center' }}>
                                                                <Typography variant="h6" color="text.secondary" gutterBottom fontWeight="600">
                                                                    No items added yet
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, maxWidth: 400 }}>
                                                                    Start building your invoice by adding products or services.
                                                                    You can add quantities, rates, and tax information.
                                                                </Typography>
                                                            </Box>

                                                            <Button
                                                                variant="contained"
                                                                size="large"
                                                                startIcon={<Add />}
                                                                onClick={handleAddItem}
                                                                sx={{
                                                                    borderRadius: 2,
                                                                    textTransform: 'none',
                                                                    fontWeight: 700,
                                                                    px: 4,
                                                                    py: 1.5,
                                                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                                                    boxShadow: theme.shadows[8],
                                                                    '&:hover': {
                                                                        transform: 'translateY(-2px)',
                                                                        boxShadow: theme.shadows[12],
                                                                    }
                                                                }}
                                                            >
                                                                Add Your First Item
                                                            </Button>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </GradientCard>

                            {/* Error Message for Items */}
                            {errors.items && (
                                <Fade in={true}>
                                    <Box sx={{
                                        mt: 2,
                                        p: 2,
                                        bgcolor: alpha(theme.palette.error.main, 0.1),
                                        borderRadius: 2,
                                        border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <Info color="error" />
                                        <Typography variant="body2" color="error.main" fontWeight="600">
                                            {errors.items}
                                        </Typography>
                                    </Box>
                                </Fade>
                            )}
                        </CardContent>
                    </GradientCard>

                    {/* Enhanced Remarks Section */}
                    <GradientCard gradient="warning" sx={{
                        mb: 4, cursor: 'pointer',
                        transition: 'hover 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
                        ':hover': { bgcolor: alpha(theme.palette.warning.main, 0.1) }
                    }}>
                        <CardContent sx={{ p: 0 }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedNotes(!expandedNotes);
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}>
                                    <Avatar sx={{ bgcolor: 'warning.main', mr: 2, width: 40, height: 40 }}>
                                        <Description />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h5" fontWeight="700" color="warning.main">
                                            Additional Information
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Add any extra details or notes for this invoice
                                        </Typography>
                                    </Box>
                                </Box>
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedNotes(!expandedNotes);
                                    }}
                                    sx={{
                                        bgcolor: alpha(theme.palette.success.main, 0.1),
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.success.main, 0.2),
                                            transform: 'scale(1.1)',
                                        },
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {expandedNotes ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                            </Box>
                            <Collapse in={expandedNotes}>
                                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        placeholder="Enter additional information..."
                                        sx={{ mt: 2 }}
                                    />
                                </Box>
                            </Collapse>
                        </CardContent>
                    </GradientCard>

                    {/* Enhanced Totals Section */}
                    <GradientCard gradient="success" sx={{ mb: 4, overflow: 'visible' }}>
                        <CardContent sx={{ p: 0 }}>
                            {/* Header */}
                            <Box
                                sx={{
                                    p: 0,
                                    background: `linear-gradient(135deg, ${theme.palette.success.main}15 0%, ${theme.palette.success.main}25 100%)`,
                                    borderRadius: '12px 12px 0 0',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', zIndex: 1 }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: 'success.main',
                                                mr: 2,
                                                width: 52,
                                                height: 52,
                                                boxShadow: `0 8px 24px ${alpha(theme.palette.success.main, 0.3)}`,
                                                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                                            }}
                                        >
                                            <Calculate sx={{ fontSize: 24 }} />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h5" fontWeight="800" color="success.main" sx={{ mb: 0.5 }}>
                                                Financial Summary
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Invoice calculations and adjustments
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Stack direction="row" spacing={1} alignItems="center">
                                        {!expandedTotals && <ActionButtonSuccess
                                            onClick={handleSubmit}
                                            disabled={isLoading || data.items.length === 0}
                                            startIcon={isLoading ? <Timeline className="animate-spin" /> : <Save />}
                                            text={isLoading ? `Creating...` : `Create Invoice`}
                                        />}
                                        <IconButton
                                            onClick={() => setExpandedTotals(!expandedTotals)}
                                            sx={{
                                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                                '&:hover': {
                                                    bgcolor: alpha(theme.palette.success.main, 0.2),
                                                    transform: 'scale(1.1)',
                                                },
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            {expandedTotals ? <ExpandLess /> : <ExpandMore />}
                                        </IconButton>
                                    </Stack>
                                </Box>

                                {/* Quick Stats */}
                                <Grid container spacing={2}>
                                    {!tax_enable && <Grid item xs={6} sm={3}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                textAlign: 'center',
                                                bgcolor: alpha('#fff', 0.7),
                                                borderRadius: 2,
                                                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                                            }}
                                        >
                                            <Typography variant="caption" color="text.secondary">Sub-Totals</Typography>
                                            <Typography variant="h6" fontWeight="700" color="info.main" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                <CurrencyRupee sx={{ fontSize: '1em' }} />
                                                {total}
                                            </Typography>
                                        </Paper>
                                    </Grid>}
                                    <Grid item xs={6} sm={3}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                textAlign: 'center',
                                                bgcolor: alpha('#fff', 0.7),
                                                borderRadius: 2,
                                                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                                            }}
                                        >
                                            <Typography variant="caption" color="text.secondary">Total Discount amount</Typography>
                                            <Typography variant="h6" fontWeight="700" color="warning.main" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                <CurrencyRupee sx={{ fontSize: '1em' }} />
                                                {discount}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                    {tax_enable && <Grid item xs={6} sm={3}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                textAlign: 'center',
                                                bgcolor: alpha('#fff', 0.7),
                                                borderRadius: 2,
                                                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                                            }}
                                        >
                                            <Typography variant="caption" color="text.secondary">Total Tax Amount</Typography>
                                            <Typography variant="h6" fontWeight="700" color="info.main" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                <CurrencyRupee sx={{ fontSize: '1em' }} />
                                                {total_tax}
                                            </Typography>
                                        </Paper>
                                    </Grid>}
                                    <Grid item xs={12} sm={6}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 1.5,
                                                textAlign: 'center',
                                                bgcolor: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.2)} 100%)`,
                                                borderRadius: 2,
                                                border: `2px solid ${alpha(theme.palette.success.main, 0.3)}`,
                                            }}
                                        >
                                            <Typography variant="caption" color="text.secondary">GRAND TOTAL</Typography>
                                            <Typography variant="h4" fontWeight="900" color="success.main" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                <CurrencyRupee sx={{ fontSize: '0.8em' }} />
                                                {Number(grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Expandable Content */}
                            <Collapse in={expandedTotals}>
                                <Box sx={{ p: 1, pt: 2 }}>
                                    <Grid container spacing={3} justifyContent={'flex-end'}>
                                        {/* Row 1 */}
                                        <Grid item xs={12} sm={6} md={tax_enable ? 2 : 2.4}>
                                            <Box sx={{ position: 'relative' }}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 1,
                                                        background: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.light} 100%)`,
                                                        textAlign: 'center',
                                                        height: 40,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: .5,
                                                    }}
                                                >
                                                    <Typography variant="caption" display="block">
                                                        Sub Total :-
                                                    </Typography>
                                                    <CurrencyRupee sx={{ fontSize: 12 }} />
                                                    <Typography variant="caption" fontWeight="600" color="success.main">
                                                        {total}
                                                    </Typography>
                                                </Paper>
                                                <Tooltip title="Base amount before any adjustments" arrow>
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            position: 'absolute',
                                                            top: -8,
                                                            right: -8,
                                                            bgcolor: 'success.main',
                                                            color: 'white',
                                                            width: 20,
                                                            height: 20,
                                                            '&:hover': { bgcolor: 'success.dark' }
                                                        }}
                                                    >
                                                        <Info sx={{ fontSize: 12 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={tax_enable ? 2 : 2.4}>
                                            <Box >
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 1,
                                                        background: `linear-gradient(135deg, ${theme.palette.warning.light} 0%, ${theme.palette.warning.light} 100%)`,
                                                        textAlign: 'center',
                                                        height: 40,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'flex-start',
                                                        gap: .5,
                                                    }}
                                                >
                                                    <LocalOffer color="warning" />
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'flex-start',
                                                        gap: 1,
                                                    }}>
                                                        <Typography variant="caption" display="block">
                                                            Discount :-{' '}
                                                        </Typography>
                                                        <CurrencyRupee sx={{ fontSize: 12 }} />
                                                        <Typography variant="caption" fontWeight="600" color="success.main">
                                                            {discount}
                                                        </Typography>
                                                    </Box>
                                                </Paper>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={tax_enable ? 2 : 2.4}>
                                            <Box sx={{ position: 'relative' }}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 1,
                                                        background: `linear-gradient(135deg, ${theme.palette.info.light} 0%, ${theme.palette.info.light} 100%)`,
                                                        textAlign: 'center',
                                                        height: 40,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'flex-start',
                                                        gap: 1,
                                                    }}
                                                >
                                                    <AccountBalance color="info" />
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: 1,
                                                    }}>
                                                        <Typography variant="caption" display="block">
                                                            Total Amount :-{' '}
                                                        </Typography>
                                                        <CurrencyRupee sx={{ fontSize: 12 }} />
                                                        <Typography variant="caption" fontWeight="600" color="success.main">
                                                            {total_amount}
                                                        </Typography>
                                                    </Box>
                                                </Paper>
                                                <Tooltip title="Total amount after deducting discount from the sub-totals" arrow>
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            position: 'absolute',
                                                            top: -8,
                                                            right: -8,
                                                            bgcolor: 'success.main',
                                                            color: 'white',
                                                            width: 20,
                                                            height: 20,
                                                            '&:hover': { bgcolor: 'success.dark' }
                                                        }}
                                                    >
                                                        <Info sx={{ fontSize: 12 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Grid>

                                        {tax_enable && <Grid item xs={12} sm={6} md={2}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 1,
                                                    background: `linear-gradient(135deg, ${theme.palette.info.light} 0%, ${theme.palette.info.light} 100%)`,
                                                    textAlign: 'center',
                                                    height: 40,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-start',
                                                    gap: .5,
                                                }}
                                            >
                                                <Receipt color="warning" />
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 1,
                                                }}>
                                                    <Typography variant="caption" display="block">
                                                        Total Tax :-{' '}
                                                    </Typography>
                                                    <CurrencyRupee sx={{ fontSize: 12 }} />
                                                    <Typography variant="caption" fontWeight="600" color="success.main">
                                                        {total_tax}
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        </Grid>}

                                        {/* Row 2 */}
                                        <Grid item xs={12} sm={6} md={tax_enable ? 2 : 2.4}>
                                            <AnimatedTextField
                                                label="Additional Charges"
                                                fullWidth
                                                size="small"
                                                value={data.additional_charge || ''}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('additional_charge', Number(e.target.value))}
                                                name="additional_charge"
                                                variant="outlined"
                                                type="number"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Add color="secondary" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={tax_enable ? 2 : 2.4}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 1,
                                                    background: `linear-gradient(135deg, ${theme.palette.info.light} 0%, ${theme.palette.info.light} 100%)`,
                                                    textAlign: 'center',
                                                    height: 40,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-start',
                                                    gap: 1,
                                                }}
                                            >
                                                <TrendingUp color="info" />
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 1,
                                                }}>
                                                    <Typography variant="caption" display="block">
                                                        Round Off :-{' '}
                                                    </Typography>
                                                    <CurrencyRupee sx={{ fontSize: 12 }} />
                                                    <Typography variant="caption" fontWeight="600" color="success.main">
                                                        {roundoff}
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={3}>
                                            <Paper
                                                elevation={3}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 1,
                                                    background: `linear-gradient(135deg, ${theme.palette.success.main}10 0%, ${theme.palette.success.main}25 100%)`,
                                                    border: `2px solid ${alpha(theme.palette.success.main, 0.4)}`,
                                                    textAlign: 'center',
                                                    height: 56,
                                                    display: 'flex',
                                                    alignItems: 'baseline',
                                                    justifyContent: 'center',
                                                    gap: 1,
                                                }}
                                            >
                                                <Typography variant="subtitle2" color="text.secondary" fontWeight="600" >
                                                    GRAND TOTAL
                                                </Typography>
                                                <CurrencyRupee sx={{ color: 'success.main', fontSize: 16, fontWeight: 'bold' }} />
                                                <Typography variant="h5" fontWeight="900" color="success.main" >
                                                    {Number(grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={2}>
                                            <AnimatedTextField
                                                label="Paid Amount"
                                                type="number"
                                                fullWidth
                                                value={data.paid_amount}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('paid_amount', e.target.value)}
                                                name="paid_amount"
                                                variant="outlined"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <CurrencyRupee color='primary' />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{ flex: 1 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={2}>
                                            <Paper
                                                elevation={3}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 1,
                                                    background: `linear-gradient(135deg, ${theme.palette.success.main}10 0%, ${theme.palette.success.main}25 100%)`,
                                                    border: `2px solid ${alpha(theme.palette.success.main, 0.4)}`,
                                                    textAlign: 'center',
                                                    height: 56,
                                                    display: 'flex',
                                                    alignItems: 'baseline',
                                                    justifyContent: 'center',
                                                    cursor: (isLoading || data.items.length === 0) ? 'not-allowed' : 'pointer',
                                                    ":hover": {
                                                        boxShadow: (isLoading || data.items.length === 0) ? 'none' : `0 4px 20px ${alpha(theme.palette.success.main, 0.3)}`,
                                                        transform: (isLoading || data.items.length === 0) ? 'none' : 'translateY(-2px)',
                                                        color: (isLoading || data.items.length === 0) ? 'text.disabled' : `#ffffff`,
                                                        background: (isLoading || data.items.length === 0) ? alpha(theme.palette.success.main, 0.1) : `${theme.palette.success.main}`,
                                                    },
                                                    gap: 1,
                                                }}
                                                onClick={handleSubmit}
                                            >
                                                <Typography variant="subtitle2" fontWeight="600" >
                                                    {isLoading ? `Creating...` : `Create Invoice`}
                                                </Typography>
                                            </Paper>

                                        </Grid>
                                    </Grid>
                                </Box>
                            </Collapse>
                        </CardContent>
                    </GradientCard>

                </Box>

            </Container>

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

            <CreateCustomerModal
                open={isCustomerModalOpen}
                type={invoiceType === 'Sales' ? 'Debtors' : 'Creditors'}
                onClose={() => setCustomerModalOpen(false)}
                onCreated={async () => {
                    const customerResponse = await dispatch(viewAllCustomerWithType({
                        company_id: currentCompanyId || '',
                        customerType: invoiceType === 'Sales' ? 'Debtors' : 'Creditors',
                    }));
                    console.log('Customer Response:', customerResponse);

                    if (customerResponse.meta.requestStatus === 'fulfilled') {
                        const ledgersWithType = customerResponse.payload;
                        setParties(ledgersWithType.map((part: any) => ({ name: part.ledger_name, id: part._id })));
                    }
                    setCustomerModalOpen(false);
                }}
            />
        </LocalizationProvider>
    );
}