import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    Drawer,
    useTheme,
    Tooltip,
    FormControl,
    Chip,
    InputAdornment,
    Alert,
    Collapse,
    LinearProgress,
    Avatar,
    Card,
    CardContent,
    Autocomplete,
} from "@mui/material";
import {
    Close as CloseIcon,
    Delete,
    PhotoCamera,
    Timeline,
    Person,
    Email,
    Phone,
    Business,
    LocationOn,
    CreditCard,
    CheckCircle,
    CloudUpload,
    Save,
    Label,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { GetCreditors } from "@/utils/types";
import CountryCode from "@/common/CountryCode";
import { updateCreditor } from "@/services/creditors";
import { viewAllBillings } from "@/services/billing";
import BillingEditingModal from "@/common/BillingEditingModal";
import { ENUM_ENTITY } from "@/utils/enums";
import ShippingEditingModal from "@/common/ShippingEditingModal";
import { viewAllShippings } from "@/services/shipping";

interface EditUserModalProps {
    open: boolean;
    onClose: () => void;
    onUpdated: () => Promise<void>;
    cred: GetCreditors | null;
}

interface CreditorFormData {
    name: string,
    email?: string,
    gstin?: string,
    company_name?: string,
    billing: string,
    shipping?: string,
    image?: string | File | null,
    pan_number?: string,
    tags?: string,
    code: string;
    number: string;
}

interface ValidationErrors {
    [key: string]: string;
}

const EditCreditorModal: React.FC<EditUserModalProps> = ({
    open,
    onClose,
    onUpdated,
    cred,
}) => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const [isLoading, setIsLoading] = useState(false);
    // const [currentStep, setCurrentStep] = useState(0);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [isFormValid, setIsFormValid] = useState(false);
    const creditorImageRef = useRef<HTMLInputElement | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const { billings } = useSelector((state: RootState) => state.billing);
    const { shippings } = useSelector((state: RootState) => state.shipping);
    const [openBillingModal, setOpenBillingModal] = useState(false);
    const [openShippingModal, setOpenShippingModal] = useState(false);
    const [selectedBillingOption, setSelectedBillingOption] = useState<{
        label: string;
        value: string;
    } | null>(null);
    const [selectedShippingOption, setSelectedShippingOption] = useState<{
        label: string;
        value: string;
    } | null>(null);
    const [data, setData] = useState<CreditorFormData>({
        name: '',
        email: '',
        code: '',
        number: '',
        image: '',
        gstin: '',
        company_name: '',
        billing: '',
        shipping: '',
        pan_number: '',
        tags: '',
    });

    // Enhanced form validation
    const validateField = (field: keyof CreditorFormData, value: string): string => {
        switch (field) {
            case 'name':
                if (!value.trim()) return 'Name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                return '';
            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
                return '';
            case 'gstin':
                if (value && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value)) {
                    return 'Invalid GSTIN format';
                }
                return '';
            case 'pan_number':
                if (value && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
                    return 'Invalid PAN format';
                }
                return '';
            case 'number':
                if (value && !/^\d{10}$/.test(value)) return 'Invalid phone number';
                return '';
            default:
                return '';
        }
    };

    const validateForm = useCallback((): boolean => {
        const errors: ValidationErrors = {};
        Object.keys(data).forEach(key => {
            const field = key as keyof CreditorFormData;
            const error = validateField(field, String(data[field] || ''));
            if (error) errors[field] = error;
        });

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }, [data]);

    const handleInputChange = (
        field: keyof CreditorFormData,
        value: string
    ) => {
        setData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear validation error for this field
        if (validationErrors[field]) {
            setValidationErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }

        // Real-time validation
        const error = validateField(field, value);
        if (error) {
            setValidationErrors(prev => ({
                ...prev,
                [field]: error
            }));
        }
    };

    // Enhanced image handling with better UX
    const handleImageChange = useCallback((file: File) => {
        if (!file) return;

        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error('Only PNG, JPEG, JPG, or WebP images are allowed.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB.');
            return;
        }

        setData(prev => ({
            ...prev,
            image: file
        }));

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
        creditorImageRef.current?.click();
    };

    const removeImage = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setImagePreview(null);
        setData(prev => ({
            ...prev,
            image: ''
        }));
        if (creditorImageRef.current) {
            creditorImageRef.current.value = '';
        }
    }, []);

    const resetForm = () => {
        setData({
            name: '',
            email: '',
            code: '',
            number: '',
            image: '',
            gstin: '',
            company_name: '',
            billing: '',
            shipping: '',
            pan_number: '',
            tags: '',
        });
        setImagePreview(null);
        setValidationErrors({});
        // setCurrentStep(0);
        if (creditorImageRef.current) {
            creditorImageRef.current.value = '';
        }
    };

    // Form completion percentage
    const getFormCompletionPercentage = (): number => {
        const requiredFields = ['name', 'billing'];
        const optionalFields = ['email', 'shipping', 'company_name', 'gstin', 'pan_number', 'code', 'number', 'tags'];

        const requiredCompleted = requiredFields.filter(field =>
            data[field as keyof CreditorFormData] && String(data[field as keyof CreditorFormData]).trim()
        ).length;

        const optionalCompleted = optionalFields.filter(field =>
            data[field as keyof CreditorFormData] && String(data[field as keyof CreditorFormData]).trim()
        ).length;

        const totalFields = requiredFields.length + optionalFields.length;
        const completedFields = requiredCompleted + optionalCompleted;

        return Math.round((completedFields / totalFields) * 100);
    };

    useEffect(() => {
        if (open && cred) {
            setData({
                name: cred.name || '',
                gstin: cred.gstin || '',
                company_name: cred.company_name || '',
                billing: cred.billing._id || '',
                shipping: cred.shipping?._id || '',
                pan_number: cred.pan_number || '',
                tags: cred.tags || '',
                email: cred.email || '',
                code: cred.phone?.code || '',
                number: cred.phone?.number || '',
                image: typeof cred.image === 'string' ? cred.image : '',
            });

            setImagePreview(
                typeof cred?.image === "string" ? cred.image : null
            );

            // Set selected billing option
            if (cred.billing) {
                setSelectedBillingOption({
                    label: `${cred.billing.address_1}, ${cred.billing.city}, ${cred.billing.state} - ${cred.billing.pinCode} (${cred.billing.country})`,
                    value: cred.billing._id
                });
            }
            if (cred.shipping) {
                setSelectedShippingOption({
                    label: `${cred.shipping.address_1}, ${cred.shipping.city}, ${cred.shipping.state} - ${cred.shipping.pinCode} (${cred.shipping.country})`,
                    value: cred.shipping._id ?? '',
                });
            }
        } else if (open && !cred) {
            resetForm();
        }
    }, [open, cred]);

    useEffect(() => {
        dispatch(viewAllBillings());
        dispatch(viewAllShippings());
    }, []);

    useEffect(() => {
        setIsFormValid(validateForm());
    }, [data, validateForm]);

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error('Please fix the validation errors before submitting.');
            return;
        }

        setIsLoading(true);
        const sanitizedData: any = {
            name: data.name.trim(),
        };

        if (data.email && data.email !== '') sanitizedData.email = data.email.trim();
        if (data.number && data.number) sanitizedData.number = data.number.trim();
        if (data.code && data.code) sanitizedData.code = data.code.trim();
        if (data.image && typeof data.image !== 'string') sanitizedData.image = data.image;
        if (data.gstin && data.gstin !== '') sanitizedData.gstin = data.gstin.trim();
        if (data.company_name && data.company_name !== '') sanitizedData.company_name = data.company_name.trim();
        if (data.billing && data.billing !== '') sanitizedData.billing = data.billing.trim();
        if (data.shipping && data.shipping !== '') sanitizedData.shipping = data.shipping.trim();
        if (data.pan_number && data.pan_number !== '') sanitizedData.pan_number = data.pan_number.trim();
        if (data.tags && data.tags !== '') sanitizedData.tags = data.tags.trim();

        const formData = new FormData();
        Object.entries(sanitizedData).forEach(([key, value]) => {
            if (typeof value === 'boolean') {
                formData.append(key, value ? 'true' : 'false');
            } else if (value !== undefined && value !== null) {
                if (typeof value === 'string' || value instanceof Blob) {
                    formData.append(key, value);
                }
            }
        });

        await toast.promise(
            dispatch(updateCreditor({
                data: formData,
                id: cred?._id ?? '',
            }))
                .unwrap()
                .then(() => {
                    setIsLoading(false);
                    setShowSuccessAlert(true);
                    setTimeout(() => {
                        onClose();
                        onUpdated();
                        resetForm();
                        setShowSuccessAlert(false);
                    }, 2000);
                })
                .catch(() => {
                    setIsLoading(false);
                }),
            {
                loading: "Updating creditor details...",
                success: <b>Creditor successfully updated! 🎉</b>,
                error: <b>Failed to update creditor. Please try again.</b>,
            }
        );
    };

    // Enhanced Image Upload Component
    const ImageUploadSection = () => (
        <Card
            elevation={0}
            sx={{
                mb: 3,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                overflow: 'hidden'
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhotoCamera color="primary" />
                    Profile Image
                    <Chip label="Optional" size="small" color="default" variant="outlined" />
                </Typography>

                <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    style={{ display: 'none' }}
                    ref={creditorImageRef}
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
                        p: 1,
                        position: 'relative',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backgroundColor: isDragActive ? theme.palette.primary.main + '10' : 'transparent',
                        minHeight: 200,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                            borderColor: theme.palette.primary.main,
                            backgroundColor: theme.palette.primary.main + '05',
                            transform: 'scale(1.01)'
                        },
                    }}
                >
                    {imagePreview ? (
                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                            <Avatar
                                src={imagePreview}
                                alt="Profile Preview"
                                sx={{
                                    width: 120,
                                    height: 120,
                                    border: `3px solid ${theme.palette.primary.main}`,
                                    boxShadow: theme.shadows[4],
                                    transition: 'all 0.3s ease',
                                    objectFit: 'contiain',
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
                                            transform: 'scale(1.1)'
                                        },
                                        width: 32,
                                        height: 32,
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <Delete fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Typography variant="body2" sx={{ mt: 2, fontWeight: 600 }}>
                                Click to change image
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            <CloudUpload
                                sx={{
                                    fontSize: 48,
                                    color: theme.palette.primary.main,
                                    mb: 2
                                }}
                            />
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                Upload Profile Image
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Drag & drop your image here, or click to browse
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Supports PNG, JPEG, JPG, WebP • Max 5MB • Recommended 1:1 ratio
                            </Typography>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Drawer
            anchor="right"
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 600, md: 750 },
                    backgroundColor: theme.palette.background.default,
                    backgroundImage: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
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
        >
            {/* Enhanced Header with Progress */}
            <Box sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.light}10 100%)`,
                backdropFilter: 'blur(10px)',
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Tooltip title="Close">
                            <IconButton
                                onClick={onClose}
                                sx={{
                                    backgroundColor: theme.palette.background.paper,
                                    '&:hover': {
                                        backgroundColor: theme.palette.action.hover,
                                        transform: 'scale(1.1)'
                                    },
                                    transition: 'all 0.2s ease',
                                    boxShadow: theme.shadows[2]
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                        <Box>
                            <Typography variant="h5" fontWeight={600}>
                                Edit Creditor Details
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Update creditor information and preferences
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={isLoading ? <Timeline className="animate-spin" /> : <Save />}
                        onClick={handleSubmit}
                        disabled={isLoading || !isFormValid}
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
                        {isLoading ? 'Updating...' : 'Update Details'}
                    </Button>
                </Box>

                {/* Form Progress Bar */}
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            Form Completion
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {getFormCompletionPercentage()}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={getFormCompletionPercentage()}
                        sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: theme.palette.action.hover,
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                            }
                        }}
                    />
                </Box>

                {/* Success Alert */}
                <Collapse in={showSuccessAlert}>
                    <Alert
                        severity="success"
                        icon={<CheckCircle />}
                        sx={{
                            borderRadius: 2,
                            '& .MuiAlert-icon': {
                                fontSize: 24
                            }
                        }}
                    >
                        Creditor details updated successfully! Redirecting...
                    </Alert>
                </Collapse>
            </Box>

            {/* Enhanced Form Content */}
            <Box
                sx={{
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
                        '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                        }
                    }
                }}>

                <Box sx={{ p: 3 }}>
                    {/* Image Upload Section */}
                    <ImageUploadSection />

                    {/* Personal Information Section */}
                    <Card elevation={0} sx={{ mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Person color="primary" />
                                Personal Information
                            </Typography>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Person fontSize="small" />
                                    Full Name
                                    <Chip label="Required" size="small" color="primary" variant="outlined" />
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Enter full name"
                                    value={data.name || ''}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    error={!!validationErrors.name}
                                    helperText={validationErrors.name}
                                    InputProps={{
                                        startAdornment: (<InputAdornment position="start">
                                            <Person fontSize="small" />
                                        </InputAdornment>),
                                        endAdornment: !validationErrors.name && (
                                            <InputAdornment position="end">
                                                <CheckCircle color="success" fontSize="small" />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                '& > fieldset': {
                                                    borderColor: theme.palette.primary.main,
                                                }
                                            },
                                            '&.Mui-focused': {
                                                '& > fieldset': {
                                                    borderWidth: 2,
                                                }
                                            }
                                        }
                                    }}
                                />
                            </FormControl>


                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Email fontSize="small" />
                                    Email
                                    <Chip label="Optional" size="small" color="default" variant="outlined" />
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Enter Email"
                                    value={data.email || ''}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    error={!!validationErrors.email}
                                    helperText={validationErrors.email}
                                    InputProps={{
                                        startAdornment: (<InputAdornment position="start">
                                            <Email fontSize="small" />
                                        </InputAdornment>),
                                        endAdornment: !validationErrors.email && (
                                            <InputAdornment position="end">
                                                <CheckCircle color="success" fontSize="small" />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                '& > fieldset': {
                                                    borderColor: theme.palette.primary.main,
                                                }
                                            },
                                            '&.Mui-focused': {
                                                '& > fieldset': {
                                                    borderWidth: 2,
                                                }
                                            }
                                        }
                                    }}
                                />
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Business fontSize="small" />
                                    Company Name
                                    <Chip label="Optional" size="small" color="default" variant="outlined" />
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Enter company name"
                                    value={data.company_name || ''}
                                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                                    error={!!validationErrors.company_name}
                                    helperText={validationErrors.company_name}
                                    InputProps={{
                                        startAdornment: (<InputAdornment position="start">
                                            <Business fontSize="small" />
                                        </InputAdornment>),
                                        endAdornment: !validationErrors.company_name && (
                                            <InputAdornment position="end">
                                                <CheckCircle color="success" fontSize="small" />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                '& > fieldset': {
                                                    borderColor: theme.palette.primary.main,
                                                }
                                            },
                                            '&.Mui-focused': {
                                                '& > fieldset': {
                                                    borderWidth: 2,
                                                }
                                            }
                                        }
                                    }}
                                />
                            </FormControl>

                            {/* Phone Number Section */}
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Phone fontSize="small" />
                                    Phone Number
                                    <Chip label="Optional" size="small" color="default" variant="outlined" />
                                </Typography>
                                <Box sx={{ display: 'flex', columnGap: 2, mt: 2, itemAlign: 'flex-end' }}>
                                    <Box sx={{ width: '30%' }}>
                                        <CountryCode
                                            fieldName="code"
                                            handleInputChange={handleInputChange as (field: string, value: string) => void}
                                            value={data?.code}
                                            isLabelled={false}
                                            isHelperText={false}
                                        />
                                    </Box>
                                    <Box sx={{ width: '70%' }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Enter phone number"
                                            value={data.number}
                                            onChange={(e) => handleInputChange('number', e.target.value)}
                                            error={!!validationErrors.number}
                                            helperText={validationErrors.number}
                                            InputProps={{
                                                endAdornment: data.number && !validationErrors.number && (
                                                    <InputAdornment position="end">
                                                        <CheckCircle color="success" fontSize="small" />
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 1,
                                                    padding: '3px 0',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        '& > fieldset': {
                                                            borderColor: theme.palette.primary.main,
                                                        }
                                                    },
                                                    '&.Mui-focused': {
                                                        '& > fieldset': {
                                                            borderWidth: 2,
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Business Information Section */}
                    <Card elevation={0} sx={{ mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CreditCard color="primary" />
                                Business Information
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <Box sx={{ width: '50%' }}>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CreditCard fontSize="small" />
                                            GSTIN
                                            <Chip label="Optional" size="small" color="default" variant="outlined" />
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Enter GSTIN"
                                            value={data.gstin || ''}
                                            onChange={(e) => handleInputChange('gstin', e.target.value)}
                                            error={!!validationErrors.pan_number}
                                            helperText={validationErrors.gstin}
                                            InputProps={{
                                                startAdornment: (<InputAdornment position="start">
                                                    <CreditCard fontSize="small" />
                                                </InputAdornment>),
                                                endAdornment: !validationErrors.gstin && (
                                                    <InputAdornment position="end">
                                                        <CheckCircle color="success" fontSize="small" />
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 1,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        '& > fieldset': {
                                                            borderColor: theme.palette.primary.main,
                                                        }
                                                    },
                                                    '&.Mui-focused': {
                                                        '& > fieldset': {
                                                            borderWidth: 2,
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Box>
                                <Box sx={{ width: '50%' }}>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CreditCard fontSize="small" />
                                            PAN Number
                                            <Chip label="Optional" size="small" color="default" variant="outlined" />
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Enter PAN Number"
                                            value={data.pan_number || ''}
                                            onChange={(e) => handleInputChange('pan_number', e.target.value)}
                                            error={!!validationErrors.pan_number}
                                            helperText={validationErrors.pan_number}
                                            InputProps={{
                                                startAdornment: (<InputAdornment position="start">
                                                    <CreditCard fontSize="small" />
                                                </InputAdornment>),
                                                endAdornment: !validationErrors.pan_number && (
                                                    <InputAdornment position="end">
                                                        <CheckCircle color="success" fontSize="small" />
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 1,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        '& > fieldset': {
                                                            borderColor: theme.palette.primary.main,
                                                        }
                                                    },
                                                    '&.Mui-focused': {
                                                        '& > fieldset': {
                                                            borderWidth: 2,
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Box>
                            </Box>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LocationOn fontSize="small" />
                                    Billing Address
                                    <Chip label="Required" size="small" color="primary" variant="outlined" />
                                </Typography>
                                <Autocomplete
                                    fullWidth
                                    size="small"
                                    options={[
                                        ...(billings?.map(cat => ({
                                            label: `${cat.address_1}, ${cat.city}, ${cat.state} - ${cat.pinCode} (${cat.country})`,
                                            value: cat._id
                                        })) ?? []),
                                        { label: '+ Add a new Billing Address', value: '__add_new__' }
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
                                    value={selectedBillingOption}
                                    onChange={(_, newValue) => {
                                        if (
                                            newValue &&
                                            typeof newValue === 'object' &&
                                            'value' in newValue &&
                                            newValue.value === '__add_new__'
                                        ) {
                                            setOpenBillingModal(true);
                                        } else {
                                            setSelectedBillingOption(newValue && typeof newValue === 'object' && 'value' in newValue
                                                ? { label: newValue.label, value: newValue.value }
                                                : typeof newValue === 'string'
                                                    ? { label: newValue, value: newValue }
                                                    : null);
                                            handleInputChange(
                                                'billing',
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
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LocationOn fontSize="small" />
                                    Shipping Address
                                    <Chip label="Optional" size="small" color="default" variant="outlined" />
                                </Typography>
                                <Autocomplete
                                    fullWidth
                                    size="small"
                                    options={[
                                        ...(shippings?.map(cat => ({
                                            label: `${cat.address_1}, ${cat.city}, ${cat.state} - ${cat.pinCode} (${cat.country})`,
                                            value: cat._id
                                        })) ?? []),
                                        { label: '+ Add a new Shipping Address', value: '__add_new__' }
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
                                    value={selectedShippingOption}
                                    onChange={(_, newValue) => {
                                        if (
                                            newValue &&
                                            typeof newValue === 'object' &&
                                            'value' in newValue &&
                                            newValue.value === '__add_new__'
                                        ) {
                                            setOpenShippingModal(true);
                                        } else {
                                            setSelectedShippingOption(newValue && typeof newValue === 'object' && 'value' in newValue
                                                ? { label: newValue.label, value: newValue.value }
                                                : typeof newValue === 'string'
                                                    ? { label: newValue, value: newValue }
                                                    : null);
                                            handleInputChange(
                                                'shipping',
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
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Label fontSize="small" />
                                    Tags
                                    <Chip label="Optional" size="small" color="default" variant="outlined" />
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Enter tags (comma separated)"
                                    value={data.tags || ''}
                                    onChange={(e) => handleInputChange('tags', e.target.value)}
                                    error={!!validationErrors.tags}
                                    helperText={'Use commas to separate multiple tags'}
                                    InputProps={{
                                        startAdornment: (<InputAdornment position="start">
                                            <Label fontSize="small" />
                                        </InputAdornment>),
                                        endAdornment: !validationErrors.tags && (
                                            <InputAdornment position="end">
                                                <CheckCircle color="success" fontSize="small" />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                '& > fieldset': {
                                                    borderColor: theme.palette.primary.main,
                                                }
                                            },
                                            '&.Mui-focused': {
                                                '& > fieldset': {
                                                    borderWidth: 2,
                                                }
                                            }
                                        }
                                    }}
                                />
                            </FormControl>

                        </CardContent>
                    </Card>

                    {/* Billing Editing Modal */}
                    <BillingEditingModal
                        open={openBillingModal}
                        onClose={() => {
                            setOpenBillingModal(false);
                        }}
                        billing={null}
                        entity_type={ENUM_ENTITY.CREDITOR}
                        entity_id={cred?._id ?? ''}
                        onCreated={async (nBill) => {
                            setSelectedBillingOption({
                                label: nBill.name, value: nBill._id
                            });
                            setData(prev => ({
                                ...prev,
                                category: nBill._id,
                            }));
                            setOpenBillingModal(false);
                            try {
                                await dispatch(viewAllBillings()).unwrap();
                            } catch (error) {
                                console.error('Failed to refresh categories:', error);
                                toast.error('Failed to refresh categories after creating new category.');
                            }
                        }}
                    />
                    <ShippingEditingModal
                        open={openShippingModal}
                        onClose={() => {
                            setOpenShippingModal(false);
                        }}
                        shipping={null}
                        entity_type={ENUM_ENTITY.CREDITOR}
                        entity_id={cred?._id ?? ''}
                        onCreated={async (nBill) => {
                            setSelectedShippingOption({
                                label: nBill.name, value: nBill._id
                            });
                            setData(prev => ({
                                ...prev,
                                category: nBill._id,
                            }));
                            setOpenShippingModal(false);
                            try {
                                await dispatch(viewAllBillings()).unwrap();
                            } catch (error) {
                                console.error('Failed to refresh categories:', error);
                                toast.error('Failed to refresh categories after creating new category.');
                            }
                        }}
                    />
                </Box>
            </Box>
            {/* Footer with Action Buttons */}
            <Box sx={{
                p: 3,
                borderTop: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: theme.palette.background.paper,
            }}>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={onClose}
                    sx={{
                        textTransform: 'none',
                        px: 3,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                            transform: 'translateY(-2px)',
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={isLoading ? <Timeline className="animate-spin" /> : <Save />}
                    onClick={handleSubmit}
                    disabled={isLoading || !isFormValid}
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
                    {isLoading ? 'Updating...' : 'Update Details'}
                </Button>
            </Box>
        </Drawer>
    );
};

export default EditCreditorModal;