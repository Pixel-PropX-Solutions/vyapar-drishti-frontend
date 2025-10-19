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
import { toast } from 'react-hot-toast';
import { updateProduct, createProduct } from '@/services/products';
import { viewAllCategories } from '@/services/category';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { FormCreateProduct, ProductUpdate } from '@/utils/types';

// Components
import BasicDetailsSection from './BasicDetailsSection';
import AdditionalInfoSection from './AdditionalInfoSection';
import AdvancedSettingsSection from './AdvancedSettingsSection';
import CategoryCreateModal from '../category/CategoryCreateModal';
import CreateInventoryGroupModal from '../Group/CreateInventoryGroupModal';
import { viewAllInventoryGroups } from '@/services/inventoryGroup';
import { units } from '@/internals/data/units';
import { roundToDigits } from '@/utils/functions';

interface SideModalProps {
    drawer: boolean;
    setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
    setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedProduct?: React.Dispatch<React.SetStateAction<ProductUpdate | null>>;
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
    const { setDrawer, drawer, setRefreshKey, product, setSelectedProduct } = props;
    const { user, current_company_id } = useSelector((state: RootState) => state.auth);
    const currentCompanyId = current_company_id || localStorage.getItem("current_company_id") || user?.user_settings?.current_company_id || '';
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === currentCompanyId);
    const tax_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_tax;


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
        unit_name: string;
        value: string;
        id: string;
    } | null>(null);

    const [showGstFields, setShowGstFields] = useState(false);

    // Redux selectors
    const { categoryLists } = useSelector((state: RootState) => state.category);
    const { inventoryGroupLists } = useSelector((state: RootState) => state.inventoryGroup);

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
        nature_of_goods: '',
        hsn_code: '',
        taxability: '',
        tax_rate: 0,
        low_stock_alert: 5,
    });

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Step configuration
    const steps = tax_enable ? [
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
        if (currentCompanyDetails?.company_settings?.features?.enable_tax) {
            if (!data.hsn_code.trim()) errors.hsn_code = 'HSN code is required';
            if (!data.taxability.trim()) errors.taxability = 'Taxability is required';
            if (data.taxability === 'Taxable' && data.tax_rate < 0) errors.tax_rate = 'Tax percentage is required';
        }
        setValidationErrors(errors);
        return errors;
    }, [currentCompanyDetails?.company_settings?.features?.enable_tax, data]);

    // Check step completion
    const checkStepCompletion = useCallback(() => {
        const newCompletedSteps = new Set<number>();

        if (data.stock_item_name.trim() && data.unit.trim()) {
            newCompletedSteps.add(0);
        }

        if (
            currentStep > 0 ||
            data.alias_name || data.category || data.group || data.description
        ) {
            newCompletedSteps.add(1);
        }

        if (
            steps.length > 2 &&
            (currentStep > 1 || data.hsn_code || data.taxability || data.tax_rate)
        ) {
            newCompletedSteps.add(2);
        }

        setCompletedSteps(newCompletedSteps);
    }, [data, currentStep, steps.length]);

    useEffect(() => {
        checkStepCompletion();
    }, [checkStepCompletion]);

    const handleChange = useCallback((field: keyof FormCreateProduct, value: string | boolean | number) => {
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

    // Form submission
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            const firstErrorKey = Object.keys(errors)[0];
            if (firstErrorKey) {
                toast.error(errors[firstErrorKey]);
            }
            return;
        }

        setIsLoading(true);
        try {
            // Calculate opening_value
            const openingValue = roundToDigits({ num: (Number(data.opening_balance) || 0) * (Number(data.opening_rate) || 0), digits: 2 });
            const sanitizedData: Record<string, string | File | boolean | number | undefined> = {
                stock_item_name: data.stock_item_name.trim(),
                unit: data.unit.trim(),
                unit_id: data.unit_id.trim(),
                company_id: (currentCompanyId || '').trim(),
                is_deleted: data.is_deleted === false,
            };
            if (data.hsn_code?.trim()) sanitizedData.hsn_code = data.hsn_code.trim();
            if (data.taxability?.trim()) sanitizedData.taxability = data.taxability.trim();
            if (data.nature_of_goods?.trim()) sanitizedData.nature_of_goods = data.nature_of_goods.trim();
            if (data.alias_name?.trim()) sanitizedData.alias_name = data.alias_name.trim();
            if (data.category?.trim()) sanitizedData.category = data.category.trim();
            if (data.category_id?.trim()) sanitizedData.category_id = data.category_id.trim();
            if (data.group?.trim()) sanitizedData.group = data.group.trim();
            if (data.description?.trim()) sanitizedData.description = data.description.trim();
            if (data.image && typeof data.image !== 'string') sanitizedData.image = data.image;
            if (data.opening_balance) sanitizedData.opening_balance = data.opening_balance;
            if (data.opening_rate) sanitizedData.opening_rate = data.opening_rate;
            if (openingValue) sanitizedData.opening_value = openingValue;
            if (data.low_stock_alert) sanitizedData.low_stock_alert = data.low_stock_alert ?? 5;
            if (data.tax_rate) sanitizedData.tax_rate = data.tax_rate;

            const formData = new FormData();
            Object.entries(sanitizedData).forEach(([key, value]) => {
                formData.append(key, value as any);
            });

            if (product && product._id) {
                await dispatch(updateProduct({ data: formData, id: product._id }))
                    .unwrap()
                    .then(() => {
                        setRefreshKey(prev => prev + 1);
                        setSelectedProduct?.(null);
                        toast.success("Product successfully updated! 🎉")
                    }).catch((error) => {
                        toast.error(error || "An unexpected error occurred. Please try again later.")
                    });
            } else {
                await dispatch(createProduct({ productData: formData }))
                    .unwrap()
                    .then(() => {
                        setRefreshKey(prev => prev + 1);
                        setSelectedProduct?.(null);
                        toast.success("Product successfully created! 🎉")
                    }).catch((error) => {
                        toast.error(error || "An unexpected error occurred. Please try again later.")
                    });
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error creating/updating product:', error);
            handleClose();
        } finally {
            setIsLoading(false);
            handleClose();
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
            nature_of_goods: '',
            hsn_code: '',
            taxability: '',
            low_stock_alert: 0,
            tax_rate: 0,
        });
        setImagePreview(null);
        setCurrentStep(0);
        setCompletedSteps(new Set());
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    // Handle close
    const handleClose = useCallback(() => {
        setDrawer(false);
        setIsLoading(false);
        setSelectedProduct?.(null);
        setSelectedUnitOption(null);
        setSelectedCategoryOption(null);
        setSelectedGroupOption(null);
        setImagePreview(null);
        setRefreshKey(prev => prev + 1);
        resetForm();
    }, [resetForm, setDrawer, setRefreshKey, setSelectedProduct]);

    // Load product data for editing
    useEffect(() => {
        if (product) {
            const foundUnit = units
                ?.find(option => option.value === product.unit && option.id === product.unit_id);

            setSelectedUnitOption(foundUnit || null);

            const foundGroup = inventoryGroupLists
                ?.map(grp => ({ label: grp.inventory_group_name, value: grp._id, id: grp._id }))
                .find(option => option.label === product.group && option.id === product.group_id);

            setSelectedGroupOption(foundGroup || null);

            const foundCategory = categoryLists
                ?.map(cat => ({ label: cat.category_name, value: cat._id, id: cat._id }))
                .find(option => option.label === product.category && option.id === product.category_id);

            setSelectedCategoryOption(foundCategory || null);
        }
        // Do NOT resetForm() here when product is null
    }, [categoryLists, inventoryGroupLists, product]);

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
                nature_of_goods: product.nature_of_goods || '',
                hsn_code: product.hsn_code || '',
                taxability: product.taxability || '',
                low_stock_alert: product.low_stock_alert || 0,
                tax_rate: product.tax_rate || 0,
            });
            setImagePreview(typeof product?.image === 'string' ? product.image : '');
        }
        // Do NOT resetForm() here when product is null
    }, [product]);

    // Fetch categories
    useEffect(() => {
        dispatch(viewAllCategories(currentCompanyId ?? ''));
    }, [currentCompanyId, dispatch]);

    useEffect(() => {
        dispatch(viewAllInventoryGroups(currentCompanyId ?? ''));
    }, [currentCompanyId, dispatch]);

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
    }, [categoryLists, data.category, selectedCategoryOption, data.category_id]);

    // Handle category selection
    useEffect(() => {
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
    }, [inventoryGroupLists, data.group, selectedGroupOption, data.group_id]);

    useEffect(() => {
        setShowGstFields(!!data.hsn_code);
    }, [data.hsn_code]);

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
            setSelectedCategoryOption,
            setSelectedGroupOption,
            setOpenCategoryModal,
            setOpenGroupModal,
            showGstFields,
            isHSNRequired: tax_enable,
            selectedUnitOption,
            setSelectedUnitOption,
            imagePreview,
            setImagePreview,
            handleImageChange,
            removeImage,
            isDragActive,
            setIsDragActive,
            fileInputRef,
            calculateStockValue: () => {
                return (data?.opening_balance || 0) * (data?.opening_rate || 0);
            }
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
            case 1:
                return true;
            case 2:
                if (tax_enable) {
                    if (!data.hsn_code.trim() || !data.taxability.trim()) {
                        return false;
                    }
                    if (data.taxability === 'Taxable') {
                        return data.tax_rate > 0;
                    }
                    return true;
                } else {
                    return true;
                }
            default:
                return true;
        }
    };

    const isHSNCodeEntered = tax_enable ? data.hsn_code.trim() !== '' : true;

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
                    p: 2,
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
                                            transform: 'rotate(90deg)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                            <Box>
                                <Typography variant="h6" sx={{
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
                                            width: 30,
                                            height: 30,
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
                    p: 2,
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
                                    }}
                                >
                                    Next
                                </Button>
                            )}
                        </Stack>

                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="outlined"
                                onClick={resetForm}
                                disabled={isLoading}
                            >
                                Reset
                            </Button>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<SaveIcon />}
                                onClick={handleSubmit}
                                disabled={isLoading || !isHSNCodeEntered || !canProceed()}
                                sx={{
                                    textTransform: 'none',
                                    px: 3,
                                    py: 1,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    borderRadius: 1,
                                    '&:disabled': {
                                        background: theme.palette.action.disabledBackground,
                                        color: theme.palette.action.disabled,
                                    },
                                }}
                            >
                                {isLoading
                                    ? (product ? 'Updating...' : 'Creating...')
                                    : (product ? 'Update Product' : 'Create Product')
                                }
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
                    dispatch(viewAllCategories(currentCompanyId ?? ""));
                    setSelectedCategoryOption({
                        label: newCategory.name,
                        value: newCategory.name,
                        id: newCategory._id
                    });
                    setData(prev => ({ ...prev, category_id: newCategory._id, category: newCategory.name }));
                    setOpenCategoryModal(false);
                    // Do NOT reset form or step here
                }}
            />
            <CreateInventoryGroupModal
                open={openGroupModal}
                onClose={() => setOpenGroupModal(false)}
                onCreated={async (newGroup) => {
                    dispatch(viewAllInventoryGroups(currentCompanyId ?? ""));
                    setSelectedGroupOption({
                        label: newGroup.name,
                        value: newGroup.name,
                        id: newGroup._id
                    });
                    setData(prev => ({ ...prev, group: newGroup.name, group_id: newGroup._id }));
                    setOpenGroupModal(false);
                    // Do NOT reset form or step here
                }}
            />
        </>
    );
};

export default ProductsSideModal;