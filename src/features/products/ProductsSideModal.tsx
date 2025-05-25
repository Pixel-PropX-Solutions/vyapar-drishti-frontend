import { useState, useRef, useCallback, useEffect } from 'react';
import {
    Box,
    Button,
    InputAdornment,
    TextField,
    Typography,
    FormControl,
    Drawer,
    IconButton,
    Autocomplete,
    useTheme,
    Switch,
    FormControlLabel,
    Paper,
    Fade,
    Grow,
    Collapse,
    Chip,
    Alert,
    LinearProgress,
    Tooltip,
    Stack,
    Divider
} from '@mui/material';

// Icons
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { units } from '@/internals/data/units';
import {
    ChevronRight,
    CurrencyRupee,
    PhotoCamera,
    Delete,
    Info,
    Error,
    Inventory,
    LocalOffer,
    Timeline,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { updateProduct, createProduct } from '@/services/products';
import { viewAllCategories } from '@/services/category';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { FormCreateProduct, GetProduct, ProductCreate } from '@/utils/types';
import { useNavigate } from 'react-router-dom';
import CategoryCreateModal from '../category/CategoryCreateModal';

interface SideModalProps {
    drawer: boolean;
    setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
    setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
    selectedProduct?: GetProduct | null;
    setSelectedProduct: React.Dispatch<React.SetStateAction<GetProduct | null>>;
}

const ProductsSideModal = (props: SideModalProps) => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { setDrawer, drawer, setRefreshKey, selectedProduct, setSelectedProduct } = props;
    const [isMoreDetails, setIsMoreDetails] = useState(false);
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { categoryLists } = useSelector((state: RootState) => state.category);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [isDragActive, setIsDragActive] = useState(false);
    const [data, setData] = useState<FormCreateProduct>({
        // Required fields
        product_name: '',
        selling_price: 0,
        is_deleted: false,

        // Optional fields
        unit: '',
        hsn_code: '',
        purchase_price: 0,
        barcode: '',
        category: '',
        image: '',
        description: '',
        opening_quantity: 0,
        opening_purchase_price: 0,
        opening_stock_value: 0,

        // Additional Optional fields
        low_stock_alert: 0,
        show_active_stock: true,
    });

    // Additional state for new features
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedCategoryOption, setSelectedCategoryOption] = useState<{
        label: string;
        value: string;
    } | null>(null);


    // Validation function
    const validateForm = useCallback(() => {
        const errors: Record<string, string> = {};

        if (!data.product_name.trim()) {
            errors.product_name = 'Product name is required';
        }

        if (data.selling_price <= 0) {
            errors.selling_price = 'Selling price must be greater than 0';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }, [data]);

    const handleChange = useCallback((field: keyof ProductCreate, value: string | boolean) => {
        setData((prevState: FormCreateProduct) => ({
            ...prevState,
            [field]:
                field === 'show_active_stock'
                    ? value === true ? true : false
                    : value
        }));

        // Clear validation error when user starts typing
        if (validationErrors[field]) {
            setValidationErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    }, [validationErrors]);

    const handleImageChange = useCallback((file: File) => {
        if (!file) return;

        if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
            toast.error('Only PNG, JPEG, JPG, or WebP images are allowed.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error('Image size should be less than 5MB.');
            return;
        }

        setData((prev: FormCreateProduct) => ({ ...prev, image: file }));
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setImagePreview(result);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleImageChange(file);
            setData((prev: FormCreateProduct) => ({ ...prev, image: file }));
        }
    }, [handleImageChange]);

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    }, []);

    const handleBoxClick = () => {
        fileInputRef.current?.click();
    };

    const removeImage = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setImagePreview(null);
        setData((prev: FormCreateProduct) => ({ ...prev, image: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        // toast.success('Image removed successfully!');
    }, []);

    // Calculate opening stock value automatically
    const calculateStockValue = useCallback(() => {
        const quantity = parseFloat(data.opening_quantity?.toString() || '0');
        const price = parseFloat(data.opening_purchase_price?.toString() || '0');
        return quantity * price;
    }, [data.opening_quantity, data.opening_purchase_price]);

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error('Please fix the validation errors before submitting.');
            return;
        }
        setIsLoading(true);
        try {
            const sanitizedData: any = {
                product_name: data.product_name.trim(),
                selling_price: isNaN(parseFloat(data.selling_price.toString())) ? 1 : parseFloat(data.selling_price.toString()),
                show_active_stock: data.show_active_stock === true,
                is_deleted: data.is_deleted === false,
            };
            if (data.unit && data.unit !== '') sanitizedData.unit = data.unit;
            if (data.hsn_code && data.hsn_code !== '') sanitizedData.hsn_code = data.hsn_code;
            if (data.barcode && data.barcode !== '') sanitizedData.barcode = data.barcode;
            if (data.category && data.category !== '') sanitizedData.category = data.category;
            if (data.description && data.description !== '') sanitizedData.description = data.description;
            if (!isNaN(Number(data.purchase_price)) && data.purchase_price !== undefined && data.purchase_price !== null && data.purchase_price !== 0) sanitizedData.purchase_price = parseFloat(data.purchase_price.toString());
            if (!isNaN(Number(data.opening_quantity)) && data.opening_quantity !== undefined && data.opening_quantity !== null && data.opening_quantity !== 0) sanitizedData.opening_quantity = parseInt(data.opening_quantity.toString(), 10);
            if (!isNaN(Number(data.opening_purchase_price)) && data.opening_purchase_price !== undefined && data.opening_purchase_price !== null && data.opening_purchase_price !== 0) sanitizedData.opening_purchase_price = parseFloat(data.opening_purchase_price.toString());
            if (sanitizedData.opening_quantity && sanitizedData.opening_purchase_price) {
                sanitizedData.opening_stock_value = sanitizedData.opening_quantity * sanitizedData.opening_purchase_price;
            }
            if (!isNaN(Number(data.low_stock_alert)) && data.low_stock_alert !== undefined && data.low_stock_alert !== null && data.low_stock_alert !== 0) sanitizedData.low_stock_alert = parseInt(data.low_stock_alert.toString(), 10);
            if (data.image && typeof data.image !== 'string') sanitizedData.image = data.image;
            const formData = new FormData();
            Object.entries(sanitizedData).forEach(([key, value]) => {
                if (typeof value === 'boolean') {
                    formData.append(key, value ? 'true' : 'false');
                } else if (value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });

            if (selectedProduct && selectedProduct._id) {
                await toast.promise(
                    dispatch(updateProduct({ data: formData, id: selectedProduct._id }))
                        .unwrap()
                        .then(() => {
                            navigate(`/products`);
                            setRefreshKey(prev => prev + 1);
                        }),
                    {
                        loading: "Updating your product...",
                        success: <b>Product successfully updated! 🎉</b>,
                        error: <b>Failed to update product. Please try again.</b>,
                    }
                );
            } else {
                await toast.promise(
                    dispatch(createProduct({ productData: formData }))
                        .unwrap()
                        .then(() => {
                            navigate(`/products`);
                            setRefreshKey(prev => prev + 1);
                        }),
                    {
                        loading: "Creating your product...",
                        success: <b>Product successfully created! 🎉</b>,
                        error: <b>Failed to create product. Please try again.</b>,
                    }
                );
            }
            resetForm();
            setDrawer(false);
            setSelectedProduct(null); // Reset selectedProduct to null after creation/updation
        } catch (error) {
            console.error('Error creating/updating product:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = useCallback(() => {
        setData({
            product_name: '',
            selling_price: 0,
            is_deleted: false,
            unit: '',
            hsn_code: '',
            purchase_price: 0,
            barcode: '',
            category: '',
            image: '',
            description: '',
            opening_quantity: 0,
            opening_purchase_price: 0,
            opening_stock_value: 0,
            low_stock_alert: 0,
            show_active_stock: true,
        });
        setImagePreview(null);
        setIsMoreDetails(false);
        setValidationErrors({});
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    const handleClose = useCallback(() => {
        if (data.product_name || data.selling_price > 0 || imagePreview) {
            if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
                resetForm();
                setDrawer(false);
                setSelectedProduct(null);
            }
        } else {
            setDrawer(false);
            setSelectedProduct(null);
        }
    }, [data.product_name, data.selling_price, imagePreview, resetForm, setDrawer, setSelectedProduct]);


    // Prefill form if editing
    useEffect(() => {
        if (selectedProduct) {
            setData({
                product_name: selectedProduct.product_name || '',
                selling_price: selectedProduct.selling_price || 0,
                is_deleted: selectedProduct.is_deleted || false,
                unit: selectedProduct.unit || '',
                hsn_code: selectedProduct.hsn_code || '',
                purchase_price: selectedProduct.purchase_price || 0,
                barcode: selectedProduct.barcode || '',
                category: selectedProduct.category || '',
                image: selectedProduct.image || '',
                description: selectedProduct.description || '',
                opening_quantity: selectedProduct.opening_quantity || 0,
                opening_purchase_price: selectedProduct.opening_purchase_price || 0,
                opening_stock_value: selectedProduct.opening_stock_value || 0,
                low_stock_alert: selectedProduct.low_stock_alert || 0,
                show_active_stock: selectedProduct.show_active_stock !== false,
            });
            setImagePreview(selectedProduct.image || null);
        } else {
            resetForm();
        }
    }, [selectedProduct, resetForm]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                await dispatch(viewAllCategories()).unwrap();
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, [dispatch, CategoryCreateModal]);

    // Update selectedCategoryOption when data.category or categoryLists change
    useEffect(() => {
        if (categoryLists && data.category) {
            // If selectedCategoryOption already matches, do nothing
            if (selectedCategoryOption && selectedCategoryOption.value === data.category) {
                return;
            }
            const found = categoryLists.map(cat => ({
                label: cat.category_name,
                value: cat._id
            })).find(option => option.value === data.category);
            if (found) {
                setSelectedCategoryOption(found);
            } else if (data.category && data.category !== '__add_new__') {
                // Only set to _id if not already set to a label
                setSelectedCategoryOption({ label: data.category, value: data.category });
            } else {
                setSelectedCategoryOption(null);
            }
        }
    }, [categoryLists, data.category]);

    const renderBasicDetails = () => (
        <Fade in timeout={300}>
            <Box sx={{ p: 3 }}>
                {/* Progress Indicator */}
                {isLoading && (
                    <LinearProgress
                        sx={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 1201
                        }}
                    />
                )}

                {/* Basic Details Section */}
                <Box sx={{ mb: 4 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                        <LocalOffer color="primary" />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                            Basic Details
                        </Typography>
                        <Chip
                            label="Required"
                            size="small"
                            color="error"
                            variant="outlined"
                        />
                    </Stack>

                    <Grow in timeout={400}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                mb: 4,
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                                border: `1px solid ${theme.palette.divider}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme.shadows[4]
                                }
                            }}
                        >
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <Typography
                                    variant="subtitle1"
                                    gutterBottom
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontWeight: 600,
                                        color: theme.palette.text.primary
                                    }}
                                >
                                    <span style={{ color: theme.palette.error.main, marginRight: 4 }}>*</span>
                                    Product Name
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Enter a descriptive product name"
                                    value={data.product_name}
                                    onChange={(e) => handleChange('product_name', e.target.value)}
                                    error={!!validationErrors.product_name}
                                    helperText={validationErrors.product_name}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                '& > fieldset': {
                                                    borderColor: theme.palette.primary.main,
                                                }
                                            }
                                        }
                                    }}
                                />
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <Typography
                                    variant="subtitle1"
                                    gutterBottom
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontWeight: 600,
                                        color: theme.palette.text.primary
                                    }}
                                >
                                    <span style={{ color: theme.palette.error.main, marginRight: 4 }}>*</span>
                                    Selling Price
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    placeholder="0.00"
                                    value={data.selling_price}
                                    onChange={(e) => handleChange('selling_price', e.target.value)}
                                    error={!!validationErrors.selling_price}
                                    helperText={validationErrors.selling_price || 'Inclusive of all taxes'}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CurrencyRupee fontSize="small" color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                '& > fieldset': {
                                                    borderColor: theme.palette.primary.main,
                                                }
                                            }
                                        }
                                    }}
                                />
                            </FormControl>

                            <FormControl fullWidth>
                                <Typography
                                    variant="subtitle1"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 600,
                                        color: theme.palette.text.primary
                                    }}
                                >
                                    Primary Unit
                                </Typography>
                                <Autocomplete
                                    fullWidth
                                    size="small"
                                    options={units}
                                    getOptionLabel={(option) =>
                                        typeof option === 'string'
                                            ? option
                                            : option.label || ''
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Select or type unit (e.g., kg, pcs, litre)"
                                            size="small"
                                        />
                                    )}
                                    value={units.find(unit => unit.value === data.unit) || null}
                                    onChange={(_, newValue) => {
                                        handleChange('unit', newValue && typeof newValue === 'object' && 'value' in newValue ? String(newValue.value) : '');
                                    }}
                                    sx={{
                                        '& .MuiAutocomplete-endAdornment': { display: 'none' },
                                        '& .MuiOutlinedInput-root': {
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                '& > fieldset': {
                                                    borderColor: theme.palette.primary.main,
                                                }
                                            }
                                        }
                                    }}
                                />
                            </FormControl>
                        </Paper>
                    </Grow>
                </Box>

                {/* Additional Information */}
                <Box sx={{ mb: 4 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                        <Info color="action" />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                            Additional Information
                        </Typography>
                        <Chip
                            label="Optional"
                            size="small"
                            color="info"
                            variant="outlined"
                        />
                    </Stack>

                    <Grow in timeout={600}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                mb: 4,
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                                border: `1px solid ${theme.palette.divider}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme.shadows[4]
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                <FormControl fullWidth>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                        HSN/SAC Code
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Enter HSN/SAC code"
                                        value={data.hsn_code}
                                        onChange={(e) => handleChange('hsn_code', e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    '& > fieldset': {
                                                        borderColor: theme.palette.primary.main,
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </FormControl>

                                <FormControl fullWidth>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                        Purchase Price
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="number"
                                        placeholder="0.00"
                                        value={data.purchase_price}
                                        onChange={(e) => handleChange('purchase_price', e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CurrencyRupee fontSize="small" color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Typography variant="caption" color="text.secondary">
                                                        with Tax
                                                    </Typography>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    '& > fieldset': {
                                                        borderColor: theme.palette.primary.main,
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </FormControl>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                <FormControl fullWidth>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                        Barcode
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Scan or enter barcode"
                                        value={data.barcode}
                                        onChange={(e) => handleChange('barcode', e.target.value)}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Button
                                                        size="small"
                                                        sx={{
                                                            textTransform: 'none',
                                                            fontSize: '0.75rem'
                                                        }}
                                                        onClick={() => {
                                                            const randomBarcode = Math.random().toString().substr(2, 12);
                                                            handleChange('barcode', randomBarcode);
                                                            toast.success('Barcode generated!');
                                                        }}
                                                    >
                                                        Auto Generate
                                                    </Button>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    '& > fieldset': {
                                                        borderColor: theme.palette.primary.main,
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </FormControl>

                                <FormControl fullWidth>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                        Category
                                    </Typography>
                                    <Autocomplete
                                        fullWidth
                                        size="small"
                                        options={[
                                            ...(categoryLists?.map(cat => ({
                                                label: cat.category_name,
                                                value: cat._id
                                            })) ?? []),
                                            { label: '+ Add a new category', value: '__add_new__' }
                                        ]}
                                        getOptionLabel={(option) =>
                                            typeof option === 'string'
                                                ? option
                                                : option.label || ''
                                        }
                                        freeSolo
                                        renderOption={(props, option) => (
                                            <li
                                                {...props}
                                                style={{
                                                    fontWeight:
                                                        option.value === '__add_new__'
                                                            ? 700
                                                            : 400,
                                                    color:
                                                        option.value === '__add_new__'
                                                            ? theme.palette.primary.main
                                                            : 'inherit',
                                                    ...(props.style || {}),
                                                }}
                                            >
                                                {option.label}
                                            </li>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Select or create category"
                                                size="small"
                                            />
                                        )}
                                        value={selectedCategoryOption}
                                        onChange={(_, newValue) => {
                                            if (
                                                newValue &&
                                                typeof newValue === 'object' &&
                                                'value' in newValue &&
                                                newValue.value === '__add_new__'
                                            ) {
                                                setOpenCategoryModal(true);
                                            } else {
                                                setSelectedCategoryOption(newValue && typeof newValue === 'object' && 'value' in newValue
                                                    ? { label: newValue.label, value: newValue.value }
                                                    : typeof newValue === 'string'
                                                        ? { label: newValue, value: newValue }
                                                        : null);
                                                handleChange(
                                                    'category',
                                                    newValue && typeof newValue === 'object' && 'value' in newValue
                                                        ? String(newValue.value)
                                                        : typeof newValue === 'string'
                                                            ? newValue
                                                            : ''
                                                );
                                            }
                                        }}
                                        sx={{
                                            '& .MuiAutocomplete-endAdornment': { display: 'none' },
                                            '& .MuiOutlinedInput-root': {
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    '& > fieldset': {
                                                        borderColor: theme.palette.primary.main,
                                                    }
                                                }
                                            }
                                        }}

                                    />
                                    {/* Category Modal */}
                                    <CategoryCreateModal
                                        open={openCategoryModal}
                                        onClose={() => {
                                            setOpenCategoryModal(false);
                                        }}
                                        onCreated={async newCategory => {
                                            // Set Autocomplete to new category and update data.category to newCategory._id
                                            setSelectedCategoryOption({ label: newCategory.name, value: newCategory._id });
                                            setData(prev => ({
                                                ...prev,
                                                category: newCategory._id,
                                            }));
                                            setOpenCategoryModal(false);
                                            // Optionally refresh categories so the new one appears in the list
                                            try {
                                                await dispatch(viewAllCategories()).unwrap();
                                            } catch (error) {
                                                // ignore error
                                                console.error('Failed to refresh categories:', error);
                                                toast.error('Failed to refresh categories after creating new category.');
                                            }
                                        }}
                                    />
                                </FormControl>
                            </Box>

                            {/* Enhanced Product Image Upload */}
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                    Product Image
                                </Typography>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg, image/webp"
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                    onChange={e => {
                                        const file = e.target.files?.[0];
                                        if (file) handleImageChange(file);
                                    }}
                                />
                                <Box
                                    onClick={handleBoxClick}
                                    onDrop={handleDrop}
                                    onDragOver={e => e.preventDefault()}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    sx={{
                                        border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
                                        borderRadius: 2,
                                        p: 3,
                                        position: 'relative',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        backgroundColor: isDragActive ? theme.palette.action.hover : 'transparent',
                                        '&:hover': {
                                            borderColor: theme.palette.primary.main,
                                            backgroundColor: theme.palette.action.hover,
                                            transform: 'scale(1.02)'
                                        },
                                    }}
                                >
                                    {imagePreview ? (
                                        <Fade in timeout={300}>
                                            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                                <img
                                                    src={imagePreview}
                                                    alt="Product Preview"
                                                    style={{
                                                        maxWidth: 150,
                                                        maxHeight: 150,
                                                        borderRadius: 8,
                                                        boxShadow: theme.shadows[2]
                                                    }}
                                                />
                                                <Tooltip title="Remove image">
                                                    <IconButton
                                                        onClick={removeImage}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: -8,
                                                            right: -8,
                                                            backgroundColor: theme.palette.error.main,
                                                            color: 'white',
                                                            '&:hover': {
                                                                backgroundColor: theme.palette.error.dark,
                                                            },
                                                            width: 24,
                                                            height: 24
                                                        }}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Fade>
                                    ) : (
                                        <Fade in timeout={300}>
                                            <Box>
                                                <PhotoCamera
                                                    sx={{
                                                        fontSize: 48,
                                                        color: theme.palette.primary.main,
                                                        mb: 1
                                                    }}
                                                />
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                                    Upload Product Image
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    Drag & drop or click to browse
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Supports PNG, JPEG, JPG, WebP • Max 5MB • Recommended 1:1 ratio
                                                </Typography>
                                            </Box>
                                        </Fade>
                                    )}
                                </Box>
                            </FormControl>

                            {/* Description */}
                            <FormControl fullWidth>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                    Product Description
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    placeholder="Describe your product features, benefits, and specifications..."
                                    value={data.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                '& > fieldset': {
                                                    borderColor: theme.palette.primary.main,
                                                }
                                            }
                                        }
                                    }}
                                />
                            </FormControl>
                        </Paper>
                    </Grow>
                </Box>

                {/* Opening Stock */}
                <Box sx={{ mb: 4 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                        <Inventory color="action" />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                            Opening Stock
                        </Typography>
                        <Chip
                            label="Optional"
                            size="small"
                            color="info"
                            variant="outlined"
                        />
                    </Stack>

                    <Grow in timeout={800}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                mb: 4,
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                                border: `1px solid ${theme.palette.divider}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme.shadows[4]
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                <FormControl fullWidth>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                        Opening Quantity
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="number"
                                        placeholder="0"
                                        value={data.opening_quantity}
                                        onChange={(e) => handleChange('opening_quantity', e.target.value)}
                                        helperText="Current stock quantity in your inventory"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    '& > fieldset': {
                                                        borderColor: theme.palette.primary.main,
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </FormControl>

                                <FormControl fullWidth>
                                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                        Opening Purchase Price
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="number"
                                        placeholder="0.00"
                                        value={data.opening_purchase_price}
                                        onChange={(e) => handleChange('opening_purchase_price', e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CurrencyRupee fontSize="small" color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        helperText="Price per unit (inclusive of tax)"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    '& > fieldset': {
                                                        borderColor: theme.palette.primary.main,
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </FormControl>
                            </Box>

                            <FormControl fullWidth>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                    Opening Stock Value
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    value={calculateStockValue()}
                                    disabled
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CurrencyRupee fontSize="small" color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    helperText="Automatically calculated (Quantity × Purchase Price)"
                                    sx={{
                                        '& .MuiInputBase-input.Mui-disabled': {
                                            WebkitTextFillColor: theme.palette.text.primary,
                                            backgroundColor: theme.palette.action.selected
                                        },
                                    }}
                                />
                            </FormControl>
                        </Paper>
                    </Grow>
                </Box>

                {/* Enhanced More Details Expandable Section */}
                <Grow in timeout={1000}>
                    <Paper
                        elevation={2}
                        sx={{
                            borderRadius: 2,
                            overflow: 'hidden',
                            background: `linear-gradient(135deg, ${theme.palette.warning.light}15 0%, ${theme.palette.warning.main}10 100%)`,
                            border: `1px solid ${theme.palette.warning.light}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: theme.shadows[4]
                            }
                        }}
                    >
                        <Box
                            onClick={() => setIsMoreDetails(!isMoreDetails)}
                            sx={{
                                cursor: 'pointer',
                                p: 3,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover
                                }
                            }}
                        >
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <ChevronRight
                                    sx={{
                                        transform: isMoreDetails ? 'rotate(90deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.3s ease-in-out',
                                        color: theme.palette.primary.main
                                    }}
                                />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        Advanced Settings
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Stock alerts, online store visibility, and more options
                                    </Typography>
                                </Box>
                                <Chip
                                    label={isMoreDetails ? "Collapse" : "Expand"}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            </Stack>
                        </Box>

                        <Collapse in={isMoreDetails} timeout={400}>
                            <Divider />
                            <Box sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                    <FormControl fullWidth>
                                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                            Low Stock Alert
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="number"
                                            placeholder="0"
                                            value={data.low_stock_alert}
                                            onChange={(e) => handleChange('low_stock_alert', e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Error fontSize="small" color="warning" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            helperText="Get notified when stock reaches this minimum quantity"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        '& > fieldset': {
                                                            borderColor: theme.palette.primary.main,
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </FormControl>

                                    <FormControl fullWidth>
                                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                            Online Store Visibility
                                        </Typography>
                                        <Box sx={{
                                            border: `1px solid ${theme.palette.divider}`,
                                            borderRadius: 1,
                                            p: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            backgroundColor: theme.palette.background.paper
                                        }}>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    Show in Online Store
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Customer visibility in catalog
                                                </Typography>
                                            </Box>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={data.show_active_stock}
                                                        onChange={(e) => handleChange('show_active_stock', e.target.checked)}
                                                        color="success"
                                                    />
                                                }
                                                label=""
                                            />
                                        </Box>
                                    </FormControl>
                                </Box>

                                <Alert
                                    severity="info"
                                    sx={{
                                        borderRadius: 2,
                                        '& .MuiAlert-icon': {
                                            color: theme.palette.info.main
                                        }
                                    }}
                                >
                                    <Typography variant="body2">
                                        <strong>Pro Tip:</strong> Set low stock alerts to prevent stockouts and maintain customer satisfaction.
                                        Online store visibility can be toggled anytime to control product availability.
                                    </Typography>
                                </Alert>
                            </Box>
                        </Collapse>
                    </Paper>
                </Grow>
            </Box>
        </Fade>
    );


    return (
        <Drawer
            anchor="right"
            open={drawer}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 700, md: 800 },
                    backgroundColor: theme.palette.background.default,
                    backgroundImage: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
                }
            }}
            sx={{
                '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(4px)',
                }
            }}
        >
            {/* Enhanced Header */}
            <Box sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `1px solid ${theme.palette.divider}`,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.light}10 100%)`,
                backdropFilter: 'blur(10px)',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Tooltip title="Close">
                        <IconButton
                            onClick={handleClose}
                            sx={{
                                backgroundColor: theme.palette.background.paper,
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                    transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                    <Box>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                            {selectedProduct ? 'Edit Product' : 'Add New Product'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {selectedProduct ? 'Update product details' : 'Create a new product for your inventory'}
                        </Typography>
                    </Box>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleSubmit}
                    disabled={isLoading || !data.product_name.trim() || data.selling_price <= 0}
                    sx={{
                        textTransform: 'none',
                        px: 3,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        boxShadow: theme.shadows[4],
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: theme.shadows[8],
                        },
                        '&:disabled': {
                            background: theme.palette.action.disabledBackground,
                            color: theme.palette.action.disabled,
                        },
                        transition: 'all 0.3s ease'
                    }}
                >
                    {isLoading ? (selectedProduct ? 'Updating...' : 'Creating...') : (selectedProduct ? 'Update Product' : 'Create Product')}
                </Button>
            </Box>


            {/* Content with improved scrolling */}
            <Box sx={{
                flex: 1,
                overflow: 'auto',
                position: 'relative',
                '&::-webkit-scrollbar': {
                    width: 8,
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: theme.palette.background.default,
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.divider,
                    borderRadius: 4,
                }
            }}>
                {renderBasicDetails()}
            </Box>

            {/* Enhanced Footer */}
            <Box sx={{
                p: 3,
                borderTop: `2px solid ${theme.palette.common.black}`,
                backgroundColor: theme.palette.background.paper,
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
            }}>
                <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            {data.product_name ? `Product: ${data.product_name}` : 'Fill in the required fields to continue'}
                        </Typography>
                        {data.selling_price > 0 && (
                            <Typography variant="caption" color="text.secondary">
                                Selling Price: ₹{data.selling_price}
                            </Typography>
                        )}
                    </Box>

                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            onClick={resetForm}
                            disabled={isLoading}
                            sx={{
                                textTransform: 'none',
                                borderRadius: 2,
                                px: 3
                            }}
                        >
                            Reset Form
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={isLoading ? <Timeline className="animate-spin" /> : <AddCircleOutlineIcon />}
                            onClick={handleSubmit}
                            disabled={isLoading || !data.product_name.trim() || data.selling_price <= 0}
                            sx={{
                                textTransform: 'none',
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600,
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                boxShadow: theme.shadows[4],
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme.shadows[8],
                                },
                                '&:disabled': {
                                    background: theme.palette.action.disabledBackground,
                                    color: theme.palette.action.disabled,
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {isLoading ? (selectedProduct ? 'Updating Product...' : 'Creating Product...') : (selectedProduct ? 'Update Product' : 'Create Product')}
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Drawer>
    );
};

export default ProductsSideModal;