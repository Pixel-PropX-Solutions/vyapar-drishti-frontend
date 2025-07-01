import React, { useCallback, useEffect, useRef, useState } from "react";
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
    FormControl,
    Stack,
    // Fade,
    Divider,
    // Chip,
    InputAdornment,
    CircularProgress,
    Autocomplete,
} from "@mui/material";
import {
    Close as CloseIcon,
    Delete,
    PhotoCamera,
    Business,
    Email,
    Phone,
    Language,
    CreditCard,
    AccountBalance,
    // CheckCircle,
    // Warning,
    CloudUpload,
    Close,
    Save,
    // LocationOn,
    // Label,
    Pin,
    Apartment,
    Signpost,
    Flag,
    Place,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { SetCompany } from "@/utils/types";
import { createCompany, updateCompany } from "@/services/company";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import countries from "@/internals/data/CountriesStates.json";


interface EditUserModalProps {
    open: boolean;
    onClose: () => void;
    onUpdated?: () => Promise<void>;
    onCreated?: () => Promise<void>;
    company: any;
}

const CompanyEditingModal: React.FC<EditUserModalProps> = ({
    open,
    onClose,
    onUpdated,
    onCreated,
    company,
}) => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    // const { user } = useSelector((state: RootState) => state.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [_showValidation, setShowValidation] = useState(false);
    const companyImageInputRef = useRef<HTMLInputElement | null>(null);
    const companyQRInputRef = useRef<HTMLInputElement | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [isQRDragActive, setIsQRDragActive] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [qrPreview, setQrPreview] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [qrLoading, setQrLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Helper to get 1st April of current year
    const getDefaultAprilFirst = () => {
        const now = new Date();
        const year = now.getFullYear();
        return new Date(year, 3, 1); // Month is 0-indexed, so 3 = April
    };

    const [data, setData] = useState<SetCompany>({
        user_id: '',
        name: '',
        mailing_name: '',
        address_1: '',
        address_2: '',
        pinCode: '',
        state: '',
        country: '',
        financial_year_start: getDefaultAprilFirst(),
        books_begin_from: getDefaultAprilFirst(),
        is_deleted: false,
        number: '',
        code: '',
        email: '',
        image: '',
        gstin: '',
        pan_number: '',
        website: '',
        account_number: '',
        account_holder: '',
        bank_ifsc: '',
        bank_name: '',
        bank_branch: '',
        qr_code_url: '',
    });
    // Validation function
    const validateForm = (formData = data) => {
        const errors: Record<string, string> = {};
        if (!formData.name.trim()) {
            errors.company_name = 'Company name is required';
        }

        if (!formData.country.trim()) {
            errors.country = 'Country is required';
        }
        if (!formData.state.trim()) {
            errors.state = 'State is required';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
            errors.website = 'Please enter a valid URL (starting with http:// or https://)';
        }

        if (formData.number && !/^\d{10}$/.test(formData.number)) {
            errors.number = 'Phone number should be 10 digits long';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleInputChange = (
        field: keyof SetCompany,
        value: string
    ) => {
        setData(prev => {
            const newData = { ...prev, [field]: value };
            validateForm(newData);
            return newData;
        });
    };

    const handleImageChange = useCallback((file: File, field: string) => {
        if (!file) return;

        if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
            toast.error('Only PNG, JPEG, JPG, or WebP images are allowed.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB.');
            return;
        }
        if (field === 'image') {
            setImageLoading(true);
        } else if (field === 'qr_code_url') {
            setQrLoading(true);
        }
        setData(prev => ({
            ...prev,
            [field]: file
        }));

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            if (field === 'image') {
                setImagePreview(result);
                setImageLoading(false);
            } else if (field === 'qr_code_url') {
                setQrPreview(result);
                setQrLoading(false);
            }
        };
        reader.readAsDataURL(file);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleImageChange(file, 'image');
        }
    }, [handleImageChange]);

    const handleQRDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsQRDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleImageChange(file, 'qr_code_url');
        }
    }, [handleImageChange]);

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    }, []);

    const handleQRDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsQRDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    }, []);

    const handleQRDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsQRDragActive(false);
    }, []);

    const handleBoxClick = () => {
        companyImageInputRef.current?.click();
    };

    const handleQRBoxClick = () => {
        companyQRInputRef.current?.click();
    };

    const removeImage = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setImagePreview(null);
        setData(prev => ({
            ...prev,
            image: ''
        }));
        if (companyImageInputRef.current) {
            companyImageInputRef.current.value = '';
        }
    }, []);

    const removeQR = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setQrPreview(null);
        setData(prev => ({
            ...prev,
            qr_code: ''
        }));
        if (companyQRInputRef.current) {
            companyQRInputRef.current.value = '';
        }
    }, []);

    const resetForm = () => {
        setData({
            user_id: '',
            name: '',
            mailing_name: '',
            address_1: '',
            address_2: '',
            pinCode: '',
            state: '',
            country: '',
            financial_year_start: getDefaultAprilFirst(), // Use default April 1st
            books_begin_from: getDefaultAprilFirst(),     // Use default April 1st
            is_deleted: false,
            number: '',
            code: '',
            email: '',
            image: '',
            gstin: '',
            pan_number: '',
            website: '',
            account_number: '',
            account_holder: '',
            bank_ifsc: '',
            bank_name: '',
            bank_branch: '',
            qr_code_url: '',
        });
        setImagePreview(null);
        setQrPreview(null);
        setFormErrors({});
        setShowValidation(false);
        if (companyImageInputRef.current) {
            companyImageInputRef.current.value = '';
        }
        if (companyQRInputRef.current) {
            companyQRInputRef.current.value = '';
        }
    };

    useEffect(() => {
        if (open && company) {
            console.log("Company Fetch Details", company)
            setData({
                pinCode: company.pinCode || '',
                state: company.state || '',
                financial_year_start: company.financial_year_start || getDefaultAprilFirst(),
                books_begin_from: company.books_begin_from || getDefaultAprilFirst(),
                is_deleted: false,
                user_id: company?.user_id || '',
                name: company.name || '',
                mailing_name: company.mailing_name || '',
                gstin: company?.gstin || '',
                pan_number: company?.pan || '',
                website: company?.website || '',
                email: company?.email || '',
                code: company?.phone?.code || '',
                number: company?.phone?.number || '',
                address_1: company?.address_1 || '',
                address_2: company?.address_2 || '',
                image: typeof company?.image === 'string' ? company?.image : '',
                country: company?.country || '',
                account_holder: company?.account_holder || '',
                account_number: company?.account_number || '',
                bank_ifsc: company?.bank_ifsc || '',
                bank_name: company?.bank_name || '',
                bank_branch: company?.bank_branch || '',
                qr_code_url: typeof company?.qr_code_url === 'string' ? company?.qr_code_url : '',

            });

            setImagePreview(
                typeof company?.image === "string" ? company.image : null
            );
            setQrPreview(
                typeof company?.qr_code_url === "string" ? company.qr_code_url : null
            );
        } else if (open && !company) {
            resetForm();
        }
    }, [open, company]);

    const handleSubmit = async () => {
        setShowValidation(true);

        if (!validateForm()) {
            toast.error('Please fix the form errors before submitting');
            return;
        }

        setIsLoading(true);
        const sanitizedData: Partial<SetCompany> = {
            name: data.name.trim(),
            state: data.state.trim(),
            country: data.country.trim(),
        };

        if (data.email && data.email !== '') sanitizedData.email = data.email.trim();
        if (data.gstin && data.gstin !== '') sanitizedData.gstin = data.gstin.trim();
        if (data.pan_number && data.pan_number !== '') sanitizedData.pan_number = data.pan_number.trim();
        if (data.number && data.number !== '') sanitizedData.number = data.number.trim();
        if (data.code && data.code !== '') sanitizedData.code = data.code.trim();
        if (data.address_1 && data.address_1 !== '') sanitizedData.address_1 = data.address_1.trim();
        if (data.address_2 && data.address_2 !== '') sanitizedData.address_2 = data.address_2.trim();
        if (data.pinCode && data.pinCode !== '') sanitizedData.pinCode = data.pinCode.trim();
        if (data.financial_year_start && data.financial_year_start !== '') sanitizedData.financial_year_start = String(data.financial_year_start).trim();
        if (data.books_begin_from && data.books_begin_from !== '') sanitizedData.books_begin_from = String(data.books_begin_from).trim();
        if (data.website && data.website !== '') sanitizedData.website = data.website.trim();
        if (data.mailing_name && data.mailing_name !== '') sanitizedData.mailing_name = data.mailing_name.trim();
        if (data.image && typeof data.image !== 'string') sanitizedData.image = data.image;
        if (data.account_holder && data.account_holder !== '') sanitizedData.account_holder = data.account_holder.trim();
        if (data.account_number && data.account_number !== '') sanitizedData.account_number = data.account_number.trim();
        if (data.bank_ifsc && data.bank_ifsc !== '') sanitizedData.bank_ifsc = data.bank_ifsc.trim();
        if (data.bank_name && data.bank_name !== '') sanitizedData.bank_name = data.bank_name.trim();
        if (data.bank_branch && data.bank_branch !== '') sanitizedData.bank_branch = data.bank_branch.trim();
        if (data.qr_code_url && typeof data.qr_code_url !== 'string') sanitizedData.qr_code_url = data.qr_code_url;

        // console.log("Submitting company data:", sanitizedData);
        // console.log("Submitting company data:", sanitizedData);
        const formData = new FormData();
        Object.entries(sanitizedData).forEach(([key, value]) => {
            if (typeof value === 'boolean') {
                formData.append(key, value ? 'true' : 'false');
            } else if (typeof value === 'string' || value instanceof Blob) {
                formData.append(key, value);
            }
        });

        if (company) {
            await toast.promise(
                dispatch(updateCompany({ data: formData, id: company._id }))
                    .unwrap()
                    .then(() => {
                        setIsLoading(false);
                        onClose();
                        if (onUpdated)
                            onUpdated();
                    })
                    .catch(() => {
                        setIsLoading(false);
                    }),
                {
                    loading: <b>Updating your company... ⏳</b>,
                    success: <b>Company Details successfully updated! 🎉</b>,
                    error: <b>Failed to update company. 🚫</b>,
                }
            );
        }
        else {
            await toast.promise(
                dispatch(createCompany(formData))
                    .unwrap()
                    .then(() => {
                        setIsLoading(false);
                        onClose();
                        if (onCreated)
                            onCreated();
                        if (onUpdated)
                            onUpdated();
                    })
                    .catch(() => {
                        setIsLoading(false);
                    }),
                {
                    loading: <b>Creating your company... ⏳</b>,
                    success: <b>Company Details successfully created! 🎉</b>,
                    error: <b>Failed to create company. 🚫</b>,
                }
            );
        }

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
                {...(open ? {} : { inert: '' })}
            >
                {/* Header */}
                <Box sx={{
                    p: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.primary.light}15 100%)`,
                    backdropFilter: 'blur(20px)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
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
                                        transform: 'scale(1.05) rotate(90deg)'
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                        <Box>
                            <Typography variant="h5" fontWeight={700} sx={{
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                {company ? 'Edit Company Details' : 'Create New Company'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {company ? 'Update your company information' : 'Fill in the details to create a new company'}
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={Object.keys(formErrors).length > 0}
                        startIcon={isLoading ? <CircularProgress size={20} /> : <Save />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                                backgroundColor: theme.palette.primary.dark,
                            }
                        }}
                    >
                        {isLoading ? 'Saving...' : company ? 'Update Company' : 'Create Company'}
                    </Button>
                </Box>

                {/* Content */}
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
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: 4,
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                        }
                    }
                }}>
                    <Box sx={{ p: 3 }}>

                        {/* Main Form */}
                        <Paper
                            elevation={8}
                            sx={{
                                p: 4,
                                borderRadius: 1,
                                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover}30 100%)`,
                                border: `1px solid ${theme.palette.divider}`,
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: 4,
                                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                },
                                transition: 'all 0.1s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: theme.shadows[12]
                                }
                            }}
                        >
                            {/* Company Logo Section */}
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" gutterBottom sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    fontWeight: 600,
                                    color: theme.palette.primary.main
                                }}>
                                    <PhotoCamera />
                                    Company Branding
                                </Typography>
                                <Divider sx={{ mb: 3 }} />

                                <Box sx={{ display: 'flex', gap: 4, alignItems: 'start', flexWrap: 'wrap' }}>
                                    {/* Image Upload */}
                                    <FormControl sx={{ width: '45%' }}>
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg, image/webp"
                                            style={{ display: 'none' }}
                                            ref={companyImageInputRef}
                                            onChange={e => {
                                                const file = e.target.files?.[0];
                                                if (file) handleImageChange(file, 'image');
                                            }}
                                        />
                                        <Box
                                            onClick={handleBoxClick}
                                            onDrop={handleDrop}
                                            onDragOver={e => e.preventDefault()}
                                            onDragEnter={handleDragEnter}
                                            onDragLeave={handleDragLeave}
                                            sx={{
                                                border: `3px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
                                                borderRadius: 1,
                                                p: 2,
                                                position: 'relative',
                                                textAlign: 'center',
                                                cursor: imageLoading ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                backgroundColor: isDragActive ? `${theme.palette.primary.main}10` : 'transparent',
                                                minHeight: 100,
                                                height: 150,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                '&:hover': {
                                                    borderColor: theme.palette.primary.main,
                                                    backgroundColor: `${theme.palette.primary.main}05`,
                                                    transform: 'scale(1.02)'
                                                },
                                            }}
                                        >
                                            {imageLoading ? (
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                                    <CircularProgress size={40} />
                                                    <Typography variant="body2" color="text.secondary">
                                                        Processing image...
                                                    </Typography>
                                                </Box>
                                            ) : imagePreview ? (
                                                <Box sx={{ position: 'relative', display: 'inline-block', mx: 'auto' }}>
                                                    <img
                                                        src={imagePreview}
                                                        alt="Company Logo Preview"
                                                        style={{
                                                            maxWidth: 200,
                                                            maxHeight: 120,
                                                            borderRadius: 12,
                                                            boxShadow: theme.shadows[4]
                                                        }}
                                                    />
                                                    <Tooltip title="Remove image" arrow>
                                                        <IconButton
                                                            onClick={removeImage}
                                                            sx={{
                                                                position: 'absolute',
                                                                top: -12,
                                                                right: -12,
                                                                backgroundColor: theme.palette.error.main,
                                                                color: 'white',
                                                                width: 32,
                                                                height: 32,
                                                                boxShadow: theme.shadows[4],
                                                                '&:hover': {
                                                                    backgroundColor: theme.palette.error.dark,
                                                                    transform: 'scale(1.1)'
                                                                },
                                                            }}
                                                        >
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            ) : (
                                                <Box>
                                                    <CloudUpload
                                                        sx={{
                                                            fontSize: 48,
                                                            color: theme.palette.primary.main,
                                                            mb: 1
                                                        }}
                                                    />
                                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                                        Upload Company Logo
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                        Drag & drop your logo here, or click to browse
                                                    </Typography>
                                                    {/* <Box sx={{
                                                        backgroundColor: `${theme.palette.primary.main}10`,
                                                        borderRadius: 1,
                                                    }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Supports PNG, JPEG, JPG, WebP • Max 5MB<br />
                                                            Recommended: Square aspect ratio (1:1)
                                                        </Typography>
                                                    </Box> */}
                                                </Box>
                                            )}
                                        </Box>
                                    </FormControl>

                                    {/* Basic Info */}
                                    <Box sx={{ flex: 1, width: '45%' }}>
                                        <Typography variant="h6" gutterBottom sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            mb: 2,
                                            fontWeight: 600,
                                            color: theme.palette.primary.main
                                        }}>
                                            <Business />
                                            Company Details
                                        </Typography>
                                        <Stack spacing={3}>
                                            <TextField
                                                fullWidth
                                                label="Company Name"
                                                placeholder="Enter your company name"
                                                value={data.name}
                                                size="small"
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                error={!!formErrors.company_name}
                                                helperText={formErrors.company_name}
                                                required
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Business color={formErrors.company_name ? 'error' : 'primary'} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1,
                                                        transition: 'all 0.1s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-1px)',
                                                        }
                                                    }
                                                }}
                                            />

                                            <TextField
                                                fullWidth
                                                label="Website URL"
                                                placeholder="https://www.yourcompany.com"
                                                type="url"
                                                size="small"
                                                value={data.website}
                                                onChange={(e) => handleInputChange('website', e.target.value)}
                                                error={!!formErrors.website}
                                                helperText={formErrors.website}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Language color={formErrors.website ? 'error' : 'primary'} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1,
                                                        transition: 'all 0.1s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-1px)',
                                                        }
                                                    }
                                                }}
                                            />
                                        </Stack>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Contact Information */}
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" gutterBottom sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    fontWeight: 600,
                                    color: theme.palette.primary.main
                                }}>
                                    <Email />
                                    Contact Information
                                </Typography>
                                <Divider sx={{ mb: 3 }} />

                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                                    <TextField
                                        fullWidth
                                        label="Company Email"
                                        placeholder="contact@yourcompany.com"
                                        type="email"
                                        size="small"
                                        value={data.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        error={!!formErrors.email}
                                        helperText={formErrors.email}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email color={formErrors.email ? 'error' : 'primary'} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                                transition: 'all 0.1s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-1px)',
                                                }
                                            }
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Mailing Name"
                                        placeholder="Your Company Name"
                                        type="text"
                                        size="small"
                                        value={data.mailing_name}
                                        onChange={(e) => handleInputChange('mailing_name', e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Business color="primary" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                                transition: 'all 0.1s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-1px)',
                                                }
                                            }
                                        }}
                                    />
                                </Box>

                                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <TextField
                                        fullWidth
                                        label="Street Address 1"
                                        placeholder="123 Main St, Suite 456"
                                        type="text"
                                        size="small"
                                        value={data.address_1}
                                        onChange={(e) => handleInputChange('address_1', e.target.value)}
                                        error={!!formErrors.address_1}
                                        helperText={formErrors.address_1}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Signpost color={formErrors.address_1 ? 'error' : 'primary'} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                                transition: 'all 0.1s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-1px)',
                                                }
                                            }
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Street Address 2"
                                        placeholder="Apt, Suite, or Building"
                                        type="text"
                                        size="small"
                                        value={data.address_2}
                                        onChange={(e) => handleInputChange('address_2', e.target.value)}
                                        error={!!formErrors.address_2}
                                        helperText={formErrors.address_2}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Apartment color={formErrors.address_2 ? 'error' : 'primary'} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                                transition: 'all 0.1s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-1px)',
                                                }
                                            }
                                        }}
                                    />

                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                                        <Autocomplete
                                            fullWidth
                                            size="small"
                                            aria-label="Select country"
                                            options={[
                                                ...(countries?.map(con => ({
                                                    label: con.name,
                                                })) ?? []),
                                            ]}
                                            getOptionLabel={(option) =>
                                                typeof option === 'string' ? option : option.label || ''
                                            }
                                            freeSolo
                                            renderOption={(props, option) => {
                                                const { key, ...rest } = props;
                                                return (
                                                    <li
                                                        key={key}
                                                        {...rest}
                                                        style={{
                                                            fontWeight: 400,
                                                            color: 'inherit',
                                                            ...(props.style || {}),
                                                        }}
                                                    >
                                                        {option.label}
                                                    </li>
                                                );
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Country"
                                                    type="text"
                                                    size="small"
                                                    autoComplete="country"
                                                    placeholder="e.g., India, Russia"
                                                    error={!!formErrors.country}
                                                    helperText={formErrors.country || "Select the country in which company is located"}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Flag color={formErrors.country ? 'error' : 'primary'} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                            value={data.country || ''}
                                            onChange={(_, newValue) => {
                                                handleInputChange(
                                                    'country',
                                                    typeof newValue === 'string'
                                                        ? newValue
                                                        : (typeof newValue === 'object' && newValue !== null && 'label' in newValue)
                                                            ? newValue.label
                                                            : ''
                                                );
                                                // Reset state when country changes
                                                handleInputChange('state', '');
                                            }}
                                            componentsProps={{
                                                paper: {
                                                    sx: {
                                                        border: '2px solid #000', // Black border
                                                        borderRadius: 1,
                                                    },
                                                },
                                            }}
                                            sx={{
                                                '& .MuiAutocomplete-endAdornment': {
                                                    display: 'none',
                                                    border: '1px solid #000',
                                                    backgroundColor: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)'
                                                },
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 1,
                                                    transition: 'all 0.1s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-1px)',
                                                    }
                                                }
                                            }}
                                        />
                                        <Autocomplete
                                            fullWidth
                                            size="small"
                                            options={
                                                !data.country
                                                    ? ['Select Country First']
                                                    : countries.find(con => con.name === data.country)?.states.length
                                                        ? countries.find(con => con.name === data.country)?.states ?? []
                                                        : ['No States']
                                            }
                                            freeSolo
                                            disabled={!data.country}
                                            renderOption={(props, option) => {
                                                const { key, ...rest } = props;
                                                return (
                                                    <li
                                                        key={key}
                                                        {...rest}
                                                        style={{
                                                            fontWeight: 400,
                                                            color: 'inherit',
                                                            ...(props.style || {}),
                                                        }}
                                                    >
                                                        {option}
                                                    </li>
                                                );
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="State/Province"
                                                    placeholder={!data.country ? "Select country first" : "e.g., Rajasthan, Ontario"}
                                                    size="small"
                                                    error={!!formErrors.state}
                                                    helperText={
                                                        !data.country
                                                            ? "Please select a country first"
                                                            : formErrors.state || "Select the state in which company is located"
                                                    }
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Place color={formErrors.country ? 'error' : 'primary'} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            )}
                                            value={data.state || ''}
                                            onChange={(_, newValue) => {
                                                if (!data.country) {
                                                    // Do nothing if country is not selected
                                                    return;
                                                }
                                                const selectedCountry = countries.find(con => con.name === data.country);
                                                if (selectedCountry && selectedCountry.states.length < 1) {
                                                    handleInputChange('state', '');
                                                } else {
                                                    handleInputChange('state', newValue || '');
                                                }
                                            }}
                                            componentsProps={{
                                                paper: {
                                                    sx: {
                                                        border: '2px solid #000', // Black border
                                                        borderRadius: 1,
                                                    },
                                                },
                                            }}
                                            sx={{
                                                '& .MuiAutocomplete-endAdornment': { display: 'none' },
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 1,
                                                    transition: 'all 0.1s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-1px)',
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                        <Box sx={{ width: '35%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            <TextField
                                                fullWidth
                                                label="Postal Code"
                                                placeholder="e.g., 12345, A1B 2C3"
                                                type="text"
                                                size="small"
                                                value={data.pinCode}
                                                onChange={(e) => handleInputChange('pinCode', e.target.value)}
                                                error={!!formErrors.pinCode}
                                                helperText={formErrors.pinCode || "Postal code or ZIP code"}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Pin color={formErrors.pinCode ? 'error' : 'primary'} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1,
                                                        transition: 'all 0.1s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-1px)',
                                                        }
                                                    }
                                                }}
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 1, width: '60%', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Box sx={{ width: '150px' }}>
                                                <TextField
                                                    fullWidth
                                                    label="Country Code"
                                                    placeholder="+91"
                                                    size="small"
                                                    value={data.code}
                                                    onChange={(e) => handleInputChange('code', e.target.value)}
                                                    error={!!formErrors.code}
                                                    helperText={formErrors.code || "Country code"}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Phone color={formErrors.code ? 'error' : 'primary'} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 1,
                                                            transition: 'all 0.1s ease',
                                                            '&:hover': {
                                                                transform: 'translateY(-1px)',
                                                            }
                                                        }
                                                    }}
                                                />
                                            </Box>

                                            <TextField
                                                fullWidth
                                                label="Phone Number"
                                                placeholder="***** 67890"
                                                type="tel"
                                                size="small"
                                                value={data.number}
                                                onChange={(e) => handleInputChange('number', e.target.value)}
                                                error={!!formErrors.number}
                                                helperText={formErrors.number || "10 digits"}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Phone color={formErrors.number ? 'error' : 'primary'} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1,
                                                        width: '100%',
                                                        transition: 'all 0.1s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-1px)',
                                                        }
                                                    }
                                                }}
                                            />

                                        </Box>
                                    </Box>
                                </Box>



                            </Box>

                            {/* Legal Information */}
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" gutterBottom sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    fontWeight: 600,
                                    color: theme.palette.primary.main
                                }}>
                                    <AccountBalance />
                                    Legal Information
                                </Typography>
                                <Divider sx={{ mb: 3 }} />

                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                                    <TextField
                                        fullWidth
                                        label="GSTIN Number"
                                        placeholder="15-digit GSTIN"
                                        value={data.gstin}
                                        size="small"
                                        onChange={(e) => handleInputChange('gstin', e.target.value.toUpperCase())}
                                        error={!!formErrors.gstin}
                                        helperText={formErrors.gstin || "15 characters including state code"}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CreditCard color={formErrors.gstin ? 'error' : 'primary'} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                                transition: 'all 0.1s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-1px)',
                                                }
                                            }
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="PAN Number"
                                        placeholder="ABCDE1234F"
                                        value={data.pan_number}
                                        size="small"
                                        onChange={(e) => handleInputChange('pan_number', e.target.value.toUpperCase())}
                                        error={!!formErrors.pan_number}
                                        helperText={formErrors.pan_number || "10 characters including state code"}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccountBalance color={formErrors.pan_number ? 'error' : 'primary'} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                                transition: 'all 0.1s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-1px)',
                                                }
                                            }
                                        }}
                                    />

                                    <DatePicker
                                        label="Financial Year Start"
                                        value={typeof data.financial_year_start === "string" ? new Date(data.financial_year_start) : data.financial_year_start}
                                        format="dd/MM/yyyy"
                                        minDate={new Date("2000-01-01")}
                                        maxDate={new Date("2100-12-31")}
                                        views={["year", "month", "day"]}
                                        onChange={(value) => {
                                            if (value) {
                                                setData((prev) => ({
                                                    ...prev,
                                                    financial_year_start: String(value).trim()
                                                }));
                                            } else {
                                                setData((prev) => ({
                                                    ...prev,
                                                    financial_year_start: new Date()
                                                }));
                                            }
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                size: 'small',
                                                InputProps: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <AccountBalance color={formErrors.financial_year_start ? 'error' : 'primary'} />
                                                        </InputAdornment>
                                                    ),
                                                },
                                                sx: {
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1,
                                                        transition: 'all 0.1s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-1px)',
                                                        }
                                                    },
                                                    '& .MuiInputAdornment-root .MuiButtonBase-root': {
                                                        border: 'none',
                                                        boxShadow: 'none'
                                                    }
                                                }
                                            },
                                        }}
                                    />
                                    <DatePicker
                                        label="Books Beginning Date"
                                        value={typeof data.books_begin_from === "string" ? new Date(data.books_begin_from) : data.books_begin_from}
                                        format="dd/MM/yyyy"
                                        minDate={new Date("2000-01-01")}
                                        maxDate={new Date("2100-12-31")}
                                        views={["year", "month", "day"]}
                                        onChange={(value) => {
                                            if (value) {
                                                setData((prev) => ({
                                                    ...prev,
                                                    books_begin_from: String(value).trim()
                                                }));
                                            } else {
                                                setData((prev) => ({
                                                    ...prev,
                                                    books_begin_from: new Date()
                                                }));
                                            }
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                size: "small",
                                                InputProps: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <AccountBalance color={formErrors.books_begin_from ? 'error' : 'primary'} />
                                                        </InputAdornment>
                                                    ),
                                                },
                                                sx: {
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1,
                                                        transition: 'all 0.1s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-1px)',
                                                        }
                                                    },
                                                    '& .MuiInputAdornment-root .MuiButtonBase-root': {
                                                        border: 'none',
                                                        boxShadow: 'none'
                                                    }
                                                }
                                            },
                                        }}
                                    />


                                </Box>

                            </Box>

                            {/* Bank Details */}
                            {data.gstin &&
                                (<Box sx={{ mb: 4 }}>
                                    <Typography variant="h6" gutterBottom sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        fontWeight: 600,
                                        color: theme.palette.primary.main
                                    }}>
                                        <AccountBalance />
                                        Bank Information
                                    </Typography>
                                    <Divider sx={{ mb: 3 }} />

                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                                        <TextField
                                            fullWidth
                                            label="Account Holder Name"
                                            placeholder="e.g., John Doe"
                                            value={data.account_holder}
                                            size="small"
                                            onChange={(e) => handleInputChange('account_holder', e.target.value)}
                                            error={!!formErrors.account_holder}
                                            helperText={formErrors.account_holder || "Enter the account holder's name"}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CreditCard color={formErrors.account_holder ? 'error' : 'primary'} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 1,
                                                    transition: 'all 0.1s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-1px)',
                                                    }
                                                }
                                            }}
                                        />

                                        <TextField
                                            fullWidth
                                            label="Account Number"
                                            placeholder="123456789012"
                                            value={data.account_number}
                                            size="small"
                                            onChange={(e) => handleInputChange('account_number', e.target.value)}
                                            error={!!formErrors.account_number}
                                            helperText={formErrors.account_number || "Enter the account number"}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <AccountBalance color={formErrors.account_number ? 'error' : 'primary'} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 1,
                                                    transition: 'all 0.1s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-1px)',
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                        <FormControl sx={{ width: '45%', }}>
                                            <input
                                                type="file"
                                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                                style={{ display: 'none' }}
                                                ref={companyQRInputRef}
                                                onChange={e => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleImageChange(file, 'qr_code_url');
                                                }}
                                            />
                                            <Box
                                                onClick={handleQRBoxClick}
                                                onDrop={handleQRDrop}
                                                onDragOver={e => e.preventDefault()}
                                                onDragEnter={handleQRDragEnter}
                                                onDragLeave={handleQRDragLeave}
                                                sx={{
                                                    border: `3px dashed ${isQRDragActive ? theme.palette.primary.main : theme.palette.divider}`,
                                                    borderRadius: 1,
                                                    p: 2,
                                                    position: 'relative',
                                                    textAlign: 'center',
                                                    cursor: qrLoading ? 'not-allowed' : 'pointer',
                                                    transition: 'all 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    backgroundColor: isQRDragActive ? `${theme.palette.primary.main}10` : 'transparent',
                                                    minHeight: 150,
                                                    height: 200,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    '&:hover': {
                                                        borderColor: theme.palette.primary.main,
                                                        backgroundColor: `${theme.palette.primary.main}05`,
                                                        transform: 'scale(1.02)'
                                                    },
                                                }}
                                            >
                                                {qrLoading ? (
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                                        <CircularProgress size={40} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            Processing QR code...
                                                        </Typography>
                                                    </Box>
                                                ) : qrPreview ? (
                                                    <Box sx={{ position: 'relative', display: 'inline-block', mx: 'auto' }}>
                                                        <img
                                                            src={qrPreview}
                                                            alt="Company QR Code Preview"
                                                            style={{
                                                                maxWidth: 200,
                                                                maxHeight: 150,
                                                                borderRadius: 1,
                                                                boxShadow: theme.shadows[4]
                                                            }}
                                                        />
                                                        <Tooltip title="Remove image" arrow>
                                                            <IconButton
                                                                onClick={removeQR}
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: -12,
                                                                    right: -12,
                                                                    backgroundColor: theme.palette.error.main,
                                                                    color: 'white',
                                                                    width: 32,
                                                                    height: 32,
                                                                    boxShadow: theme.shadows[4],
                                                                    '&:hover': {
                                                                        backgroundColor: theme.palette.error.dark,
                                                                        transform: 'scale(1.1)'
                                                                    },
                                                                }}
                                                            >
                                                                <Delete fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                ) : (
                                                    <Box>
                                                        <CloudUpload
                                                            sx={{
                                                                fontSize: 48,
                                                                color: theme.palette.primary.main,
                                                                mb: 1
                                                            }}
                                                        />
                                                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                                                            Upload Company QR Code
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                            Drag & drop your QR code here, or click to browse
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </FormControl>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '50%' }}>
                                            <TextField
                                                fullWidth
                                                label="Bank Name"
                                                value={data.bank_name}
                                                placeholder="e.g., ABC Bank"
                                                size="small"
                                                onChange={(e) => handleInputChange('bank_name', e.target.value)}
                                                error={!!formErrors.bank_name}
                                                helperText={formErrors.bank_name || "Enter the bank name"}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <CreditCard color={formErrors.bank_name ? 'error' : 'primary'} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1,
                                                        transition: 'all 0.1s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-1px)',
                                                        }
                                                    }
                                                }}
                                            />

                                            <TextField
                                                fullWidth
                                                label="Bank Branch"
                                                placeholder="e.g., Main Branch"
                                                value={data.bank_branch}
                                                size="small"
                                                onChange={(e) => handleInputChange('bank_branch', e.target.value)}
                                                error={!!formErrors.bank_branch}
                                                helperText={formErrors.bank_branch || "Enter the bank branch"}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <AccountBalance color={formErrors.bank_branch ? 'error' : 'primary'} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1,
                                                        transition: 'all 0.1s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-1px)',
                                                        }
                                                    }
                                                }}
                                            />

                                            <TextField
                                                fullWidth
                                                label="IFSC Code"
                                                value={data.bank_ifsc}
                                                placeholder="e.g., ABCD0123456"
                                                size="small"
                                                onChange={(e) => handleInputChange('bank_ifsc', e.target.value)}
                                                error={!!formErrors.bank_ifsc}
                                                helperText={formErrors.bank_ifsc || "Enter the IFSC code"}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <CreditCard color={formErrors.bank_ifsc ? 'error' : 'primary'} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1,
                                                        transition: 'all 0.1s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-1px)',
                                                        }
                                                    }
                                                }}
                                            />
                                        </Box>

                                    </Box>


                                </Box>)}

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={onClose}
                                    startIcon={<Close />}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover,
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                    disabled={Object.keys(formErrors).length > 0}
                                    startIcon={isLoading ? <CircularProgress size={20} /> : <Save />}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.dark,
                                        }
                                    }}
                                >
                                    {isLoading ? 'Saving...' : company ? 'Update Company' : 'Create Company'}
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Drawer>
        </LocalizationProvider>
    );
}

export default CompanyEditingModal;