import { useState, useRef, useCallback, useEffect } from 'react';
import {
    Box,
    Button,
    Drawer,
    IconButton,
    useTheme,
    LinearProgress,
    Tooltip,
    Stack,
    Typography,
    Stepper,
    Step,
    StepLabel,
    StepConnector,
    stepConnectorClasses,
    styled,
    alpha
} from '@mui/material';
import {
    Close as CloseIcon,
    Save as SaveIcon,
    Edit as EditIcon,
    Add as AddIcon,
    CheckCircle as CheckCircleIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { updateProduct, createProduct } from '@/services/products';
import { viewAllCategories } from '@/services/category';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { FormCreateProduct, ProductUpdate } from '@/utils/types';
import { useNavigate } from 'react-router-dom';

// Components
import BasicDetailsSection from './BasicDetailsSection';
import AdditionalInfoSection from './AdditionalInfoSection';
// import OpeningStockSection from './OpeningStockSection';
import AdvancedSettingsSection from './AdvancedSettingsSection';
import CategoryCreateModal from '../category/CategoryCreateModal';
import CreateInventoryGroupModal from '../Group/CreateInventoryGroupModal';
import { viewAllInventoryGroups } from '@/services/inventoryGroup';
import { units } from '@/internals/data/units';

interface SideModalProps {
    drawer: boolean;
    setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
    setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedProduct: React.Dispatch<React.SetStateAction<ProductUpdate | null>>;
    product?: ProductUpdate | null;
}

// Custom Stepper Connector
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: `linear-gradient(95deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: `linear-gradient(95deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor: theme.palette.divider,
        borderRadius: 1,
    },
}));

const ProductsSideModal = (props: SideModalProps) => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { setDrawer, drawer, setRefreshKey, product, setSelectedProduct } = props;
    const { user } = useSelector((state: RootState) => state.auth);
    const currentCompanyDetails = user?.company?.find((c :any) => c._id === user.user_settings.current_company_id);

    // State management
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const [openGroupModal, setOpenGroupModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [isDragActive, setIsDragActive] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedCategoryOption, setSelectedCategoryOption] = useState<{
        label: string;
        value: string;
        id: string;
    } | null>(null);
    const [selectedGroupOption, setSelectedGroupOption] = useState<{
        label: string;
        value: string;
        id: string;
    } | null>(null);

    const [selectedUnitOption, setSelectedUnitOption] = useState<{
        label: string;
        value: string;
        id: string;
    } | null>(null);

    const [showGstFields, setShowGstFields] = useState(false);

    // Redux selectors
    const { categoryLists } = useSelector((state: RootState) => state.category);
    const { inventoryGroupLists } = useSelector((state: RootState) => state.inventoryGroup);
    const { currentCompany } = useSelector((state: RootState) => state.auth);

    // Form data
    const [data, setData] = useState<FormCreateProduct>({
        stock_item_name: '',
        company_id: '',
        unit: '',
        unit_id: '',
        is_deleted: false,
        alias_name: '',
        category: '',
        category_id: '',
        group: '',
        group_id: '',
        image: '',
        description: '',
        opening_balance: 0,
        opening_rate: 0,
        opening_value: 0,
        gst_nature_of_goods: '',
        gst_hsn_code: '',
        gst_taxability: '',
        gst_percentage: '',
        low_stock_alert: 0,
    });

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Step configuration
    const steps = currentCompanyDetails?.company_settings?.features?.enable_gst ? [
        { label: 'Basic Details', icon: EditIcon },
        { label: 'Additional Info', icon: AddIcon },
        { label: 'Advanced Settings', icon: CheckCircleIcon }
    ] :
        [
            { label: 'Basic Details', icon: EditIcon },
            { label: 'Additional Info', icon: AddIcon },
        ];

    // Validation
    const validateForm = useCallback(() => {
        const errors: Record<string, string> = {};
        if (!data.stock_item_name.trim()) errors.product_name = 'Product name is required';
        if (!data.unit.trim()) errors.selling_price = 'Product must have a measuring unit';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }, [data]);

    // Check step completion
    const checkStepCompletion = useCallback(() => {
        const newCompletedSteps = new Set<number>();

        // Step 0: Basic Details
        if (data.stock_item_name.trim() && data.unit.trim()) {
            newCompletedSteps.add(0);
        }

        // Step 1: Additional Info (always optional)
        newCompletedSteps.add(1);

        // Step 2: Stock & Pricing (optional but complete if any data exists)
        if (data.opening_balance || data.opening_rate) {
            newCompletedSteps.add(2);
        } else {
            newCompletedSteps.add(2); // Consider optional steps as complete
        }

        // Step 3: Advanced Settings (optional)
        newCompletedSteps.add(3);

        setCompletedSteps(newCompletedSteps);
    }, [data]);

    useEffect(() => {
        checkStepCompletion();
    }, [checkStepCompletion]);

    // Handle form changes
    const handleChange = useCallback((field: keyof FormCreateProduct, value: string | boolean) => {
        setData((prevState: FormCreateProduct) => ({
            ...prevState,
            [field]: value
        }));

        if (validationErrors[field]) {
            setValidationErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [validationErrors]);

    // Image handling
    const handleImageChange = useCallback((file: File) => {
        if (!file) return;

        if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
            toast.error('Only PNG, JPEG, JPG, or WebP images are allowed.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
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

    const removeImage = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setImagePreview(null);
        setData((prev: FormCreateProduct) => ({ ...prev, image: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    // Calculate opening stock value
    const calculateStockValue = useCallback(() => {
        const quantity = parseFloat(data.opening_balance?.toString() || '0');
        const price = parseFloat(data.opening_rate?.toString() || '0');
        return quantity * price;
    }, [data.opening_balance, data.opening_rate]);

    // Form submission
    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error('Please fix the validation errors before submitting.');
            return;
        }

        setIsLoading(true);
        try {
            const sanitizedData: FormCreateProduct = {
                stock_item_name: data.stock_item_name.trim(),
                unit: data.unit.trim(),
                unit_id: data.unit_id.trim(),
                company_id: (currentCompany?._id || '').trim(),
                is_deleted: data.is_deleted === false,
            };

            // Add optional fields
            Object.entries(data).forEach(([key, value]) => {
                if (key !== 'stock_item_name' && key !== 'unit' && key !== 'unit_id' && key !== 'company_id' && key !== 'is_deleted') {
                    if (value && value !== '' && value !== 0) {
                        (sanitizedData as any)[key] = value;
                    }
                }
            });

            const formData = new FormData();
            Object.entries(sanitizedData).forEach(([key, value]) => {
                if (typeof value === 'boolean') {
                    formData.append(key, value ? 'true' : 'false');
                } else if (value instanceof Blob) {
                    formData.append(key, value);
                } else if (typeof value === 'string' || typeof value === 'number') {
                    formData.append(key, value.toString());
                }
            });

            console.log('Submitting Sanitized Data:', sanitizedData);
            console.log('Form Data Entries:', Array.from(formData.entries()));
            console.log('Submitting Form Data:', Object.fromEntries(formData.entries()));
            if (product && product._id) {
                await toast.promise(
                    dispatch(updateProduct({ data: formData, id: product._id }))
                        .unwrap()
                        .then(() => {
                            navigate(`/products`);
                            setRefreshKey(prev => prev + 1);
                            setSelectedProduct(null);
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
                            setSelectedProduct(null);
                        }),
                    {
                        loading: "Creating your product...",
                        success: <b>Product successfully created! 🎉</b>,
                        error: <b>Failed to create product. Please try again.</b>,
                    }
                );
            }

            setIsLoading(false);
            setValidationErrors({});
            setImagePreview(null);
            setSelectedProduct(null);
            resetForm();
            setDrawer(false);
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error('Error creating/updating product:', error);
        } finally {
            setIsLoading(false);
            setValidationErrors({});
            setImagePreview(null);
            setSelectedProduct(null);
            resetForm();
            setDrawer(false);
            setRefreshKey(prev => prev + 1);
        }
    };

    // Reset form
    const resetForm = useCallback(() => {
        setData({
            stock_item_name: '',
            company_id: '',
            unit: '',
            unit_id: '',
            is_deleted: false,
            alias_name: '',
            category: '',
            category_id: '',
            group: '',
            group_id: '',
            image: '',
            description: '',
            opening_balance: 0,
            opening_rate: 0,
            opening_value: 0,
            gst_nature_of_goods: '',
            gst_hsn_code: '',
            gst_taxability: '',
            low_stock_alert: 0,
        });
        setImagePreview(null);
        setValidationErrors({});
        setCurrentStep(0);
        setCompletedSteps(new Set());
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    // Handle close
    const handleClose = useCallback(() => {
        if (data.stock_item_name || data.unit || imagePreview) {
            if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
                resetForm();
                setDrawer(false);
                setSelectedProduct(null);
                setSelectedUnitOption(null);
                setSelectedCategoryOption(null);
                setSelectedGroupOption(null);
                setImagePreview(null);
            }
        } else {
            setDrawer(false);
            setSelectedProduct(null);
            setSelectedUnitOption(null);
            setSelectedCategoryOption(null);
            setSelectedGroupOption(null);
            setImagePreview(null);
        }
    }, [data.stock_item_name, data.unit, imagePreview, resetForm, setDrawer, setSelectedProduct]);

    // Load product data for editing
    useEffect(() => {
        if (product) {
            setData({
                stock_item_name: product.stock_item_name || '',
                company_id: product.company_id || '',
                unit: product.unit || '',
                unit_id: product.unit_id || '',
                is_deleted: product.is_deleted || false,
                alias_name: product.alias_name || '',
                category: product.category || '',
                category_id: product.category_id || '',
                group: product.group || '',
                group_id: product.group_id || '',
                image: product.image || '',
                description: product.description || '',
                opening_balance: product.opening_balance || 0,
                opening_rate: product.opening_rate || 0,
                opening_value: product.opening_value || 0,
                gst_nature_of_goods: product.gst_nature_of_goods || '',
                gst_hsn_code: product.gst_hsn_code || '',
                gst_taxability: product.gst_taxability || '',
                low_stock_alert: product.low_stock_alert || 0,
            });
            const foundUnit = units
                ?.find(option => option.value === product.unit && option.id === product.unit_id);
            setSelectedUnitOption(
                foundUnit
                    ? { label: foundUnit.label, value: foundUnit.value, id: foundUnit.id }
                    : null
            );

            const foundGroup = inventoryGroupLists
                ?.map(grp => ({ label: grp.inventory_group_name, value: grp._id, id: grp._id }))
                .find(option => option.label === product.group && option.id === product.group_id);

            setSelectedGroupOption(foundGroup || null);

            const foundCategory = categoryLists
                ?.map(cat => ({ label: cat.category_name, value: cat._id, id: cat._id }))
                .find(option => option.label === product.category && option.id === product.category_id);

            setSelectedCategoryOption(foundCategory || null);
            setImagePreview(typeof product?.image === 'string' ? product.image : '');
        } else {
            resetForm();
        }
    }, [categoryLists, inventoryGroupLists, product, resetForm]);

    // Fetch categories
    useEffect(() => {
        dispatch(viewAllCategories(currentCompany?._id ?? ''));
        dispatch(viewAllInventoryGroups(currentCompany?._id ?? ''));
    }, [currentCompany?._id, dispatch]);

    // Handle category selection
    useEffect(() => {
        if (categoryLists && data.category) {
            if (selectedCategoryOption && selectedCategoryOption.value === data.category) {
                return;
            }
            const found = categoryLists.map(cat => ({
                label: cat.category_name,
                value: cat._id,
                id: cat._id
            })).find(option => option.value === data.category);

            if (found) {
                setSelectedCategoryOption(found);
            } else if (data.category && data.category !== '__add_new__') {
                setSelectedCategoryOption({ label: data.category, value: data.category, id: data.category_id || '' });
            } else {
                setSelectedCategoryOption(null);
            }
        }
        if (inventoryGroupLists && data.group) {
            if (selectedGroupOption && selectedGroupOption.value === data.group) {
                return;
            }
            const found = inventoryGroupLists.map(cat => ({
                label: cat.inventory_group_name,
                value: cat._id,
                id: cat._id
            })).find(option => option.value === data.group);

            if (found) {
                setSelectedGroupOption(found);
            } else if (data.group && data.group !== '__add_new__') {
                setSelectedGroupOption({ label: data.group, value: data.group, id: data.group_id || '' });
            } else {
                setSelectedGroupOption(null);
            }
        }
    }, [categoryLists, inventoryGroupLists, data.category, selectedCategoryOption, data.group, selectedGroupOption, data.category_id, data.group_id]);

    useEffect(() => {
        setShowGstFields(!!data.gst_hsn_code);
    }, [data.gst_hsn_code]);

    // Step renderer
    const renderStepContent = () => {
        const commonProps = {
            data,
            handleChange,
            validationErrors,
            theme,
            categoryLists: categoryLists || [],
            inventoryGroupLists: inventoryGroupLists || [],
            selectedCategoryOption,
            selectedGroupOption,
            setSelectedGroupOption,
            setSelectedCategoryOption,
            selectedUnitOption,
            setSelectedUnitOption,
            setOpenCategoryModal,
            setOpenGroupModal,
            imagePreview,
            setImagePreview,
            handleImageChange,
            removeImage,
            isDragActive,
            setIsDragActive,
            fileInputRef,
            calculateStockValue,
            showGstFields
        };

        switch (currentStep) {
            case 0:
                return <BasicDetailsSection {...commonProps} />;
            case 1:
                return <AdditionalInfoSection {...commonProps} />;
            case 2:
                return <AdvancedSettingsSection {...commonProps} />;
            default:
                return <BasicDetailsSection {...commonProps} />;
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 0:
                return data.stock_item_name.trim() && data.unit.trim();
            default:
                return true;
        }
    };

    return (
        <>
            <Drawer
                anchor="right"
                open={drawer}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: { xs: '100%', sm: 700, md: 900 },
                        backgroundColor: theme.palette.background.default,
                        backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
                    }
                }}
                sx={{
                    '& .MuiBackdrop-root': {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(8px)',
                    }
                }}
                {...(drawer ? {} : { inert: '' })}
            >
                {/* Progress Indicator */}
                {isLoading && (
                    <LinearProgress
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 1201,
                            height: 4
                        }}
                    />
                )}

                {/* Enhanced Header */}
                <Box sx={{
                    p: 3,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
                    backdropFilter: 'blur(20px)',
                }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Tooltip title="Close">
                                <IconButton
                                    onClick={handleClose}
                                    sx={{
                                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                        backdropFilter: 'blur(10px)',
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover,
                                            transform: 'scale(1.1) rotate(90deg)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                            <Box>
                                <Typography variant="h4" sx={{
                                    fontWeight: 800,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>
                                    {product ? 'Edit Product' : 'Create Product'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {product ? 'Update your product details' : 'Add a new product to your inventory'}
                                </Typography>
                            </Box>
                        </Stack>

                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<SaveIcon />}
                            onClick={handleSubmit}
                            disabled={isLoading || !canProceed()}
                            sx={{
                                textTransform: 'none',
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                borderRadius: 1,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.6)}`,
                                },
                                '&:disabled': {
                                    background: theme.palette.action.disabledBackground,
                                    color: theme.palette.action.disabled,
                                    transform: 'none',
                                    boxShadow: 'none'
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            {isLoading
                                ? (product ? 'Updating...' : 'Creating...')
                                : (product ? 'Update Product' : 'Create Product')
                            }
                        </Button>
                    </Stack>
                </Box>

                {/* Step Navigation */}
                <Box sx={{
                    px: 3,
                    py: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    backgroundColor: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: 'blur(10px)'
                }}>
                    <Stepper
                        activeStep={currentStep}
                        connector={<ColorlibConnector />}
                        sx={{
                            '& .MuiStepLabel-root': {
                                cursor: 'pointer'
                            }
                        }}
                    >
                        {steps.map((step, index) => (
                            <Step
                                key={step.label}
                                completed={completedSteps.has(index)}
                                onClick={() => { if (canProceed()) setCurrentStep(index) }}
                            >
                                <StepLabel
                                    StepIconComponent={({ active, completed }) => (
                                        <Box sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: completed
                                                ? theme.palette.success.main
                                                : active
                                                    ? theme.palette.primary.main
                                                    : theme.palette.grey[300],
                                            color: 'white',
                                            boxShadow: active || completed
                                                ? `0 4px 20px ${alpha(
                                                    completed ? theme.palette.success.main : theme.palette.primary.main,
                                                    0.4
                                                )}`
                                                : 'none',
                                            transition: 'all 0.3s ease',
                                            transform: active ? 'scale(1.1)' : 'scale(1)',
                                        }}>
                                            {completed ? (
                                                <CheckCircleIcon fontSize="small" />
                                            ) : active ? (
                                                <step.icon fontSize="small" />
                                            ) : (
                                                <RadioButtonUncheckedIcon fontSize="small" />
                                            )}
                                        </Box>
                                    )}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: currentStep === index ? 700 : 500,
                                            color: currentStep === index
                                                ? theme.palette.primary.main
                                                : theme.palette.text.secondary
                                        }}
                                    >
                                        {step.label}
                                    </Typography>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                {/* Content */}
                <Box sx={{
                    flex: 1,
                    overflow: 'auto',
                    '&::-webkit-scrollbar': { width: 8 },
                    '&::-webkit-scrollbar-track': { backgroundColor: theme.palette.background.default },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.divider,
                        borderRadius: 4,
                        '&:hover': { backgroundColor: theme.palette.text.secondary }
                    }
                }}>
                    <Box>
                        {renderStepContent()}
                    </Box>
                </Box>

                {/* Enhanced Footer */}
                <Box sx={{
                    p: 3,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.action.hover, 0.5)} 100%)`,
                    backdropFilter: 'blur(20px)',
                }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="outlined"
                                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                disabled={currentStep === 0}
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: 1,
                                    borderWidth: 2,
                                    '&:hover': { borderWidth: 2 }
                                }}
                            >
                                Previous
                            </Button>

                            {currentStep < steps.length - 1 && (
                                <Button
                                    variant="contained"
                                    onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                                    disabled={!canProceed()}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: 1,
                                        background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                                    }}
                                >
                                    Next
                                </Button>
                            )}
                        </Stack>

                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="text"
                                onClick={resetForm}
                                disabled={isLoading}
                                sx={{ textTransform: 'none' }}
                            >
                                Reset
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Drawer>

            {/* Category Modal */}
            <CategoryCreateModal
                open={openCategoryModal}
                onClose={() => setOpenCategoryModal(false)}
                onCreated={async (newCategory) => {
                    // console.log("New Category Created:", newCategory);
                    dispatch(viewAllCategories(currentCompany?._id ?? ""));
                    setSelectedCategoryOption({
                        label: newCategory.name,
                        value: newCategory.name,
                        id: newCategory._id
                    });
                    setOpenCategoryModal(false);
                    setSelectedCategoryOption({ label: newCategory.name, value: newCategory.name, id: newCategory._id });
                    setData(prev => ({ ...prev, category_id: newCategory._id }));
                    setData(prev => ({ ...prev, category: newCategory.name }));
                    setOpenCategoryModal(false);

                }}
            />
            <CreateInventoryGroupModal
                open={openGroupModal}
                onClose={() => setOpenGroupModal(false)}
                onCreated={async (newGroup) => {
                    // console.log("New Group Created:", newGroup);
                    dispatch(viewAllInventoryGroups(currentCompany?._id ?? ""));
                    setSelectedGroupOption({
                        label: newGroup.name,
                        value: newGroup.name,
                        id: newGroup._id
                    });
                    setOpenGroupModal(false);
                    setSelectedGroupOption({ label: newGroup.name, value: newGroup.name, id: newGroup._id });
                    setData(prev => ({ ...prev, _cgroup: newGroup._id }));
                    setData(prev => ({ ...prev, group: newGroup.name }));
                    setOpenGroupModal(false);

                }}
            />
        </>
    );
};

export default ProductsSideModal;