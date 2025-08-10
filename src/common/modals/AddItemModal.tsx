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
    Grow,
    Stack,
    Chip,
    InputAdornment,
    CircularProgress,
    Slide,
    alpha,
    useMediaQuery,
    Autocomplete,
} from "@mui/material";
import {
    Close as CloseIcon,
    Business,
    Close,
    Save,
    LocationCity,
    MonetizationOn,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { viewProductsWithId } from "@/services/products";
import { units } from "@/internals/data/units";

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


interface AddItemModalProps {
    open: boolean;
    onClose: () => void;
    onCreated?: (item: InvoiceItems) => void;
    onUpdated?: (item: InvoiceItems) => void;
    item: InvoiceItems | null;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
    open,
    onClose,
    onUpdated,
    onCreated,
    item,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch<AppDispatch>();
    const [isLoading, setIsLoading] = useState(false);
    const [_showValidation, setShowValidation] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [focusedField, setFocusedField] = useState<string>('');
    const [itemsList, setItemsList] = useState<{ id: string; name: string; unit: string, gst: string, hsn_code: string }[]>([]);
    const { user, current_company_id } = useSelector((state: RootState) => state.auth);
    const currentCompanyId = current_company_id || localStorage.getItem("current_company_id") || user?.user_settings?.current_company_id || '';
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === currentCompanyId);
    const gst_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_gst;
    const [data, setData] = useState<Partial<InvoiceItems>>({
        item: '',
        item_id: '',
        quantity: 0,
        rate: 0,
        amount: 0,
        gst: 0,
        gst_amount: 0,
    });
    const [totalAmount, setTotalAmount] = useState(0);

    // Validation function
    const validateForm = (formData = data) => {
        const errors: Record<string, string> = {};

        if (!(formData?.item ?? '').trim()) {
            errors.item = 'Item is required';
        }
        if (!(formData.item_id ?? '').trim()) {
            errors.item_id = 'Item ID is required';
        }
        if ((formData?.quantity ?? 0) <= 0) {
            errors.quantity = `Quantity must be greater than 0 and should be a valid ${units.find(unit => unit.value === itemsList.find(item => item.id === formData.item_id)?.unit)?.si_representation === 'integer' ? 'whole number' : 'decimal number'}`;
        }
        if ((formData?.rate ?? 0) <= 0) {
            errors.rate = 'Rate must be greater than 0';
        }
        if ((formData?.amount ?? 0) <= 0) {
            errors.amount = 'Amount must be greater than 0';
        }
        if ((formData?.gst ?? 0) < 0) {
            errors.gst = 'GST must be 0 or greater';
        }
        if ((formData?.gst_amount ?? 0) < 0) {
            errors.gst_amount = 'GST Amount must be 0 or greater';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (
        field: keyof InvoiceItems,
        value: string
    ) => {
        setData(prev => {
            let newData = { ...prev, [field]: value };
            // Custom logic for quantity based on unit type
            if (field === 'quantity') {
                // Get selected item's unit
                const selectedItem = itemsList.find(item => item.id === newData.item_id);
                const unitType = units.find(unit => unit.value === selectedItem?.unit)?.si_representation;

                let quantity = value;
                if (unitType === 'integer') {
                    // Only allow whole numbers
                    const intVal = Math.max(0, Math.floor(Number(quantity)));
                    quantity = intVal.toString();
                } else if (unitType === 'decimal') {
                    // Allow up to two decimals
                    let floatVal = Math.max(0, parseFloat(quantity));
                    floatVal = Math.round(floatVal * 100) / 100;
                    quantity = floatVal.toFixed(2);
                }
                newData.quantity = Number(quantity);
            }
            // If rate, quantity, or gst changes, recalculate amount and gst_amount
            if (field === 'rate' || field === 'quantity' || field === 'gst') {
                const quantity = parseFloat(String(field === 'quantity' ? newData.quantity : newData.quantity)) || 0;
                const rate = parseFloat(String(field === 'rate' ? value : newData.rate)) || 0;
                const gst = parseFloat(String(field === 'gst' ? value : newData.gst)) || 0;
                const gstAmount = parseFloat(((quantity * rate * gst) / 100).toFixed(2));
                const amount = parseFloat((quantity * rate).toFixed(2));
                newData = {
                    ...newData,
                    amount,
                    gst_amount: gstAmount,
                };
                setTotalAmount(amount + gstAmount);
            }
            validateForm(newData);
            return newData;
        });
    };


    const resetForm = () => {
        setData({
            item: '',
            item_id: '',
            quantity: 0,
            rate: 0,
            amount: 0,
            gst: 0,
            gst_amount: 0,
        });
        setFormErrors({});
        setShowValidation(false);
    };

    useEffect(() => {
        if (!open) {
            resetForm();
            return;
        }
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
        });

    }, [dispatch, open, currentCompanyId]);

    useEffect(() => {
        if (open && item) {
            setData({
                item: item.item || '',
                item_id: item.item_id || '',
                quantity: item.quantity || 0,
                rate: item.rate || 0,
                amount: item.amount || 0,
                gst: item.gst || 0,
                gst_amount: item.gst_amount || 0,
            });
            setTotalAmount(item.amount + (item.gst_amount || 0));
        } else if (open && !item) {
            setData({
                item: '',
                item_id: '',
                quantity: 0,
                rate: 0,
                amount: 0,
                gst: 0,
                gst_amount: 0,
            });
            setTotalAmount(0);
        }
    }, [open, item]);


    const handleSubmit = () => {
        setShowValidation(true);

        if (!validateForm()) {
            toast.error('Please fix the form errors before submitting');
            return;
        }
        setIsLoading(true);
        if (item) {
            onUpdated?.(data as InvoiceItems);
            toast.success('Item updated successfully');
        } else {
            onCreated?.(data as InvoiceItems);
            toast.success('Item added successfully');
        }
        setIsLoading(false);
        resetForm();
        onClose();
    };


    const formFields = gst_enable ? [
        {
            key: 'quantity',
            label: 'Quantity',
            placeholder: 'Enter the quantity of the item',
            icon: Business,
            required: true,
            description: `Quantity of the item (Should be ${units.find(unit => unit.value === itemsList.find(item => item.id === data.item_id)?.unit)?.si_representation === 'integer' ? 'whole number' : 'decimal number'})`,
            disabled: false, // This field is editable
            qty: units.find(unit => unit.value === itemsList.find(item => item.id === data.item_id)?.unit)?.si_representation,
        },
        {
            key: 'rate',
            label: 'Rate',
            placeholder: 'Enter the rate of the item',
            icon: MonetizationOn,
            required: true,
            description: 'Rate of the item',
            disabled: false, // This field is editable
        },
        {
            key: 'amount',
            label: 'Amount',
            placeholder: 'Enter the amount',
            icon: MonetizationOn,
            required: true,
            description: 'Enter rate and quantity to calculate amount',
            disabled: true, // This field is auto-calculated based on rate, quantity, and GST
        },
        {
            key: 'gst',
            label: 'GST',
            placeholder: 'Enter the GST percentage',
            icon: MonetizationOn,
            required: true,
            description: 'GST percentage for the item (optional)',
            disabled: true, // This field is editable
        },
        {
            key: 'gst_amount',
            label: 'GST Amount',
            placeholder: 'Enter the GST amount',
            icon: MonetizationOn,
            required: false,
            description: 'Enter rate and quantity to calculate GST amount',
            disabled: true, // This field is auto-calculated based on rate and quantity
        },
        {
            key: 'total-amount',
            label: 'Total Amount',
            placeholder: 'Enter the total amount',
            icon: MonetizationOn,
            required: true,
            description: 'Enter rate and quantity to calculate total amount',
            disabled: true, // This field is auto-calculated based on rate, quantity, and GST
        },
    ] : [
        {
            key: 'quantity',
            label: 'Quantity',
            placeholder: 'Enter the quantity of the item',
            icon: Business,
            required: true,
            description: `Quantity of the item (should be valid ${units.find(unit => unit.value === itemsList.find(item => item.id === data.item_id)?.unit)?.si_representation === 'integer' ? 'whole number' : 'decimal number'})`,
            disabled: false, // This field is editable
            qty: units.find(unit => unit.value === itemsList.find(item => item.id === data.item_id)?.unit)?.si_representation,
        },
        {
            key: 'rate',
            label: 'Rate',
            placeholder: 'Enter the rate of the item',
            icon: MonetizationOn,
            required: true,
            description: 'Rate of the item',
            disabled: false, // This field is editable
        },
        {
            key: 'amount',
            label: 'Amount',
            placeholder: 'Enter the amount',
            icon: MonetizationOn,
            required: true,
            description: 'Enter rate and quantity to calculate amount',
            disabled: true, // This field is auto-calculated based on rate and quantity
        },
    ];

    return (
        <Drawer
            anchor="right"
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 650, md: 800 },
                    backgroundColor: theme.palette.background.default,
                    backgroundImage: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                    overflow: 'hidden',
                }
            }}
            sx={{
                '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(12px)',
                }
            }}
            open={open}
            onClose={onClose}
        >
            {/* Enhanced Header */}
            <Slide direction="down" in={open} timeout={500}>
                <Box sx={{
                    p: { xs: 2, sm: 3 },
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                    position: 'sticky',
                    top: 0,
                    zIndex: 1200,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Tooltip title="Close" arrow placement="bottom">
                            <IconButton
                                onClick={onClose}
                                sx={{
                                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.5),
                                        transform: 'rotate(90deg)',
                                    },
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>

                        <Box>
                            <Typography variant={isMobile ? "h6" : "h5"} fontWeight={700} sx={{
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}>
                                {item === null ? 'Add Item' : 'Edit Item'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {item === null ? "Set up your item details to add it to the invoice" : "Update your item information to keep it current"}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Slide>

            {/* Enhanced Content */}
            <Box sx={{
                flex: 1,
                overflow: 'auto',
                position: 'relative',
            }}>
                <Box sx={{ p: { xs: 2, sm: 3 }, pb: 6 }}>
                    {/* Main Form */}
                    <Grow in timeout={600}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 3, sm: 4 },
                                borderRadius: 3,
                                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
                                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                                position: 'relative',
                                overflow: 'hidden',
                                backdropFilter: 'blur(20px)',
                            }}
                        >
                            {/* Form Fields */}
                            <Stack spacing={3}>
                                <Autocomplete
                                    options={itemsList}
                                    getOptionLabel={(option) =>
                                        typeof option === 'string'
                                            ? option
                                            : option?.name || ''
                                    }
                                    value={
                                        itemsList.find((p) => p.id === data.item_id) ||
                                        (data.item ? { id: '', name: data.item, unit: '', gst: '', hsn_code: '' } : null)
                                    }
                                    onChange={(_, newValue) => {
                                        if (newValue && typeof newValue === 'object') {
                                            handleInputChange('item', newValue.name);
                                            handleInputChange('item_id', newValue.id);
                                            if (gst_enable)
                                                handleInputChange('gst', newValue.gst);
                                        } else {
                                            handleInputChange('item', '');
                                            handleInputChange('item_id', '');
                                        }
                                    }}
                                    filterOptions={(options, { inputValue }) => {
                                        const normalizedInput = inputValue.replace(/\s+/g, '').toLowerCase();
                                        return options.filter(option => {
                                            const label = typeof option === 'string' ? option : option?.name || '';
                                            const normalizedLabel = label.replace(/\s+/g, '').toLowerCase();
                                            return normalizedLabel.includes(normalizedInput);
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Start typing for items suggestions..."
                                            variant="outlined"
                                            fullWidth
                                            sx={{
                                                '& .MuiOutlinedInput-root': { borderRadius: 1, width: '100%' }
                                            }}
                                            error={!!formErrors.item}
                                            helperText={formErrors.item || 'Select an item from the list'}
                                            required
                                            onFocus={() => setFocusedField('item')}
                                            onBlur={() => setFocusedField('')}
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Box sx={{
                                                            p: 0.5,
                                                            borderRadius: 1,
                                                            backgroundColor: focusedField === 'item'
                                                                ? alpha(theme.palette.primary.main, 0.1)
                                                                : 'transparent',
                                                            transition: 'all 0.3s ease',
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}>
                                                            <LocationCity
                                                                color={formErrors.item ? 'error' :
                                                                    focusedField === 'item' ? 'primary' : 'action'}
                                                                sx={{ fontSize: 20 }}
                                                            />
                                                        </Box>
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
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                />
                                {formFields.map((field, index) => {
                                    // For quantity field, set type and step based on unit type
                                    let inputType = 'text';
                                    let inputStep = undefined;
                                    if (field.key === 'quantity') {
                                        const selectedItem = itemsList.find(item => item.id === data.item_id);
                                        const unitType = units.find(unit => unit.value === selectedItem?.unit)?.si_representation;
                                        inputType = 'number';
                                        inputStep = unitType === 'integer' ? '1' : '0.01';
                                    }
                                    let value = undefined;
                                    if (field.key === 'total-amount') {
                                        value = totalAmount;
                                    } else {
                                        value = data[field.key as keyof InvoiceItems] || '';
                                    }

                                    return (
                                        <TextField
                                            key={index + field.key}
                                            fullWidth
                                            label={field.label}
                                            placeholder={field.placeholder}
                                            value={value}
                                            onChange={(e) => handleInputChange(field.key as keyof InvoiceItems, e.target.value)}
                                            error={!!formErrors[field.key]}
                                            helperText={formErrors[field.key] || field.description}
                                            required={field.required}
                                            onFocus={() => setFocusedField(field.key)}
                                            onBlur={() => setFocusedField('')}
                                            disabled={isLoading || field.disabled}
                                            type={inputType}
                                            inputProps={inputStep ? { step: inputStep, min: 0 } : { min: 0 }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Box sx={{
                                                            p: 0.5,
                                                            borderRadius: 1,
                                                            backgroundColor: focusedField === field.key
                                                                ? alpha(theme.palette.primary.main, 0.1)
                                                                : 'transparent',
                                                            transition: 'all 0.3s ease',
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}>
                                                            <field.icon
                                                                color={formErrors[field.key] ? 'error' :
                                                                    focusedField === field.key ? 'primary' : 'action'}
                                                                sx={{ fontSize: 20 }}
                                                            />
                                                        </Box>
                                                    </InputAdornment>
                                                ),
                                                endAdornment: field.required && (
                                                    <InputAdornment position="end">
                                                        <Chip
                                                            label="Required"
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                            sx={{
                                                                fontSize: '0.7rem',
                                                                height: 20,
                                                                opacity: focusedField === field.key ? 1 : 0.6,
                                                                transition: 'opacity 0.3s ease'
                                                            }}
                                                        />
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 1,
                                                    backgroundColor: focusedField === field.key
                                                        ? alpha(theme.palette.primary.main, 0.02)
                                                        : alpha(theme.palette.background.paper, 0.5),
                                                },
                                                '& .MuiFormHelperText-root': {
                                                    marginLeft: 0,
                                                    marginTop: 1,
                                                    fontSize: '0.75rem',
                                                    color: formErrors[field.key]
                                                        ? theme.palette.error.main
                                                        : alpha(theme.palette.text.secondary, 0.7)
                                                }
                                            }}
                                        />
                                    );
                                })}
                            </Stack>

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 2,
                                mt: 5,
                                pt: 3,
                                borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`
                            }}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={onClose}
                                    startIcon={<Close />}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        px: 3,
                                        py: 1.5,
                                        borderColor: alpha(theme.palette.secondary.main, 0.3),
                                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.secondary.main, 0.08),
                                            borderColor: theme.palette.secondary.main,
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                    disabled={Object.keys(formErrors).length > 0 || isLoading}
                                    startIcon={isLoading ?
                                        <CircularProgress size={20} color="inherit" /> :
                                        <Save />
                                    }
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        px: 4,
                                        py: 1.5,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                                            borderColor: theme.palette.common.white,
                                        },
                                        '&:disabled': {
                                            background: alpha(theme.palette.action.disabled, 0.12),
                                            color: theme.palette.action.disabled,
                                            boxShadow: 'none',
                                            transform: 'none',
                                        }
                                    }}
                                >
                                    {isLoading ? 'Adding...' :
                                        item === null ? "Add Item" : 'Update Item'}
                                </Button>
                            </Box>
                        </Paper>
                    </Grow>
                </Box>
            </Box>
        </Drawer>
    );
}

export default AddItemModal;
