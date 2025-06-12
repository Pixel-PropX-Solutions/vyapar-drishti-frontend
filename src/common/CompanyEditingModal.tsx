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
    Grow,
    FormControl,
    Stack,
    Fade,
    Divider,
    Chip,
    InputAdornment,
    CircularProgress,
    // Alert,
    // Collapse,
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
    CheckCircle,
    Warning,
    CloudUpload,
    Close,
    Save,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { SetCompany } from "@/utils/types";
import { createCompany, updateCompany } from "@/services/company";
import CountryCodes from '../internals/data/CountryCodes.json';
import { MenuItem, Select, ListItemIcon, ListItemText, Avatar, InputLabel, FormHelperText } from '@mui/material';

interface EditUserModalProps {
    open: boolean;
    onClose: () => void;
    onUpdated?: () => Promise<void>;
    onCreated?: () => Promise<void>;
    company: any;
    onUpdated?: () => Promise<void>;
    onCreated?: () => Promise<void>;
    company: any;
}

const CompanyEditingModal: React.FC<EditUserModalProps> = ({
    open,
    onClose,
    onUpdated,
    onCreated,
    onCreated,
    company,
}) => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    // const { user } = useSelector((state: RootState) => state.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [_showValidation, setShowValidation] = useState(false);
    const companyImageInputRef = useRef<HTMLInputElement | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [data, setData] = useState<SetCompany>({
        user_id: '',
        name: '',
        mailing_name: '',
        address_1: '',
        address_2: '',
        pinCode: '',
        state: '',
        country: '',
        financial_year_start: '',
        books_begin_from: '',
        is_deleted: false,
        name: '',
        mailing_name: '',
        address_1: '',
        address_2: '',
        pinCode: '',
        state: '',
        country: '',
        financial_year_start: '',
        books_begin_from: '',
        is_deleted: false,
        number: '',
        code: '',
        email: '',
        email: '',
        image: '',
        gstin: '',
        pan_number: '',
        website: '',
        gstin: '',
        pan_number: '',
        website: '',
    });

    // Validation function
    const validateForm = (formData = data) => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) {
        if (!formData.name.trim()) {
            errors.company_name = 'Company name is required';
        }

        if (!formData.state.trim()) {
            errors.state = 'State is required';
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
    };

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

        setImageLoading(true);
        setData(prev => ({
            ...prev,
            image: file
        }));

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setImagePreview(result);
            setImageLoading(false);
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
        companyImageInputRef.current?.click();
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
            financial_year_start: '',
            books_begin_from: '',
            is_deleted: false,
            name: '',
            mailing_name: '',
            address_1: '',
            address_2: '',
            pinCode: '',
            state: '',
            country: '',
            financial_year_start: '',
            books_begin_from: '',
            is_deleted: false,
            number: '',
            code: '',
            email: '',
            email: '',
            image: '',
            gstin: '',
            pan_number: '',
            website: '',
            gstin: '',
            pan_number: '',
            website: '',
        });
        setImagePreview(null);
        setFormErrors({});
        setShowValidation(false);
        if (companyImageInputRef.current) {
            companyImageInputRef.current.value = '';
        }
    };

    useEffect(() => {
        if (open && company) {
            setData({
                pinCode: company.pinCode || '',
                state: company.state || '',
                financial_year_start: company.financial_year_start || '',
                books_begin_from: company.books_begin_from || '',
                is_deleted: false,
                pinCode: company.pinCode || '',
                state: company.state || '',
                financial_year_start: company.financial_year_start || '',
                books_begin_from: company.books_begin_from || '',
                is_deleted: false,
                user_id: company?.user_id || '',
                name: company.name || '',
                mailing_name: company.mailing_name || '',
                name: company.name || '',
                mailing_name: company.mailing_name || '',
                gstin: company?.gstin || '',
                pan_number: company?.pan || '',
                pan_number: company?.pan || '',
                website: company?.website || '',
                email: company?.email || '',
                code: company?.phone?.code || '',
                number: company?.phone?.number || '',
                address_1: company?.address_1 || '',
                address_2: company?.address_2 || '',
                address_1: company?.address_1 || '',
                address_2: company?.address_2 || '',
                image: typeof company?.image === 'string' ? company?.image : '',
                country: company?.country || ''
                country: company?.country || ''
            });

            setImagePreview(
                typeof company?.image === "string" ? company.image : null
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
        if (data.financial_year_start && data.financial_year_start !== '') sanitizedData.financial_year_start = data.financial_year_start.trim();
        if (data.books_begin_from && data.books_begin_from !== '') sanitizedData.books_begin_from = data.books_begin_from.trim();

        if (data.address_1 && data.address_1 !== '') sanitizedData.address_1 = data.address_1.trim();
        if (data.address_2 && data.address_2 !== '') sanitizedData.address_2 = data.address_2.trim();
        if (data.pinCode && data.pinCode !== '') sanitizedData.pinCode = data.pinCode.trim();
        if (data.financial_year_start && data.financial_year_start !== '') sanitizedData.financial_year_start = data.financial_year_start.trim();
        if (data.books_begin_from && data.books_begin_from !== '') sanitizedData.books_begin_from = data.books_begin_from.trim();

        if (data.website && data.website !== '') sanitizedData.website = data.website.trim();
        if (data.mailing_name && data.mailing_name !== '') sanitizedData.mailing_name = data.mailing_name.trim();
        if (data.mailing_name && data.mailing_name !== '') sanitizedData.mailing_name = data.mailing_name.trim();
        if (data.image && typeof data.image !== 'string') sanitizedData.image = data.image;

        console.log("Submitting company data:", sanitizedData);
        console.log("Submitting company data:", sanitizedData);
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

    const isFormValid = data.name.trim() && data.state.trim();
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

    const isFormValid = data.name.trim() && data.state.trim();

    return (
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
                            {company ? 'Edit Company Details' : 'Create New Company'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {company ? 'Update your company information' : 'Fill in the details to create a new company'}
                            {company ? 'Update your company information' : 'Fill in the details to create a new company'}
                        </Typography>
                    </Box>
                </Box>

                <Chip
                    icon={isFormValid ? <CheckCircle /> : <Warning />}
                    label={isFormValid ? "Ready to Save" : "Fill Required Fields"}
                    color={isFormValid ? "success" : "warning"}
                    variant="outlined"
                    sx={{
                        fontWeight: 600,
                        '& .MuiChip-icon': {
                            fontSize: '1rem'
                        }
                    }}
                />
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
                    <Grow in timeout={600}>
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
                                transition: 'all 0.3s ease',
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
                                                border: `3px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
                                                borderRadius: 1,
                                                p: 2,
                                                position: 'relative',
                                                textAlign: 'center',
                                                cursor: imageLoading ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                backgroundColor: isDragActive ? `${theme.palette.primary.main}10` : 'transparent',
                                                minHeight: 200,
                                                height: 250,
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
                                                <Fade in timeout={500}>
                                                    <Box sx={{ position: 'relative', display: 'inline-block', mx: 'auto' }}>
                                                        <img
                                                            src={imagePreview}
                                                            alt="Company Logo Preview"
                                                            style={{
                                                                maxWidth: 200,
                                                                maxHeight: 150,
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
                                                </Fade>
                                            ) : (
                                                <Fade in timeout={300}>
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
                                                        <Box sx={{
                                                            backgroundColor: `${theme.palette.primary.main}10`,
                                                            borderRadius: 1,
                                                        }}>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Supports PNG, JPEG, JPG, WebP • Max 5MB<br />
                                                                Recommended: Square aspect ratio (1:1)
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Fade>
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
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                value={data.name}
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
                                                        transition: 'all 0.3s ease',
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
                                                        transition: 'all 0.3s ease',
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
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-1px)',
                                                }
                                            }
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Mailing Name"
                                        label="Mailing Name"
                                        placeholder="e.g., Technology, Manufacturing, Retail"
                                        value={data.mailing_name}
                                        onChange={(e) => handleInputChange('mailing_name', e.target.value)}
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
                                                transition: 'all 0.3s ease',
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
                                        value={data.address_1}
                                        onChange={(e) => handleInputChange('address_1', e.target.value)}
                                        error={!!formErrors.address_1}
                                        helperText={formErrors.address_1}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email color={formErrors.address_1 ? 'error' : 'primary'} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                                transition: 'all 0.3s ease',
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
                                        value={data.address_2}
                                        onChange={(e) => handleInputChange('address_2', e.target.value)}
                                        error={!!formErrors.address_2}
                                        helperText={formErrors.address_2}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email color={formErrors.address_2 ? 'error' : 'primary'} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-1px)',
                                                }
                                            }
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="State/Province"
                                        placeholder="e.g., California, Ontario"
                                        type="text"
                                        value={data.state}
                                        onChange={(e) => handleInputChange('state', e.target.value)}
                                        error={!!formErrors.state}
                                        helperText={formErrors.state}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email color={formErrors.state ? 'error' : 'primary'} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-1px)',
                                                }
                                            }
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Country"
                                        placeholder="e.g., United States, Canada"
                                        type="text"
                                        value={data.country}
                                        onChange={(e) => handleInputChange('country', e.target.value)}
                                        error={!!formErrors.country}
                                        helperText={formErrors.country}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email color={formErrors.country ? 'error' : 'primary'} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-1px)',
                                                }
                                            }
                                        }}
                                    />


                                    <TextField
                                        fullWidth
                                        label="Postal Code"
                                        placeholder="e.g., 12345, A1B 2C3"
                                        type="text"
                                        value={data.pinCode}
                                        onChange={(e) => handleInputChange('pinCode', e.target.value)}
                                        error={!!formErrors.pinCode}
                                        helperText={formErrors.pinCode}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email color={formErrors.pinCode ? 'error' : 'primary'} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-1px)',
                                                }
                                            }
                                        }}
                                    />

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
                                                transition: 'all 0.3s ease',
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
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-1px)',
                                                }
                                            }
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Finacial Year Start"
                                        placeholder="YYYY-MM-DD"
                                        type="date"
                                        value={data.financial_year_start}
                                        onChange={(e) => handleInputChange('financial_year_start', e.target.value.toUpperCase())}
                                        error={!!formErrors.financial_year_start}
                                        helperText={formErrors.financial_year_start || " YYYY-MM-DD format"}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccountBalance color={formErrors.financial_year_start ? 'error' : 'primary'} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-1px)',
                                                }
                                            }
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Books Beginning Date"
                                        placeholder="YYYY-MM-DD"
                                        value={data.books_begin_from}
                                        onChange={(e) => handleInputChange('books_begin_from', e.target.value.toUpperCase())}
                                        error={!!formErrors.books_begin_from}
                                        helperText={formErrors.books_begin_from || " YYYY-MM-DD format"}
                                        type="date"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccountBalance color={formErrors.books_begin_from ? 'error' : 'primary'} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-1px)',
                                                }
                                            }
                                        }}
                                    />
                                    <Box sx={{ gridColumn: 'span 2', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <FormControl fullWidth error={!!formErrors.code}>
                                                <InputLabel id="alter-country-code-label">Country Code</InputLabel>
                                                <Select
                                                    labelId="alter-country-code-label"
                                                    value={data.code || ''}
                                                    label="Country Code"
                                                    onChange={(e) => handleInputChange('code', e.target.value)}
                                                    renderValue={(selected) => {
                                                        const country = CountryCodes.find(c => c.dial_code === selected);
                                                        return country ? (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Avatar
                                                                    src={`/src/assets/flags/${country.code.toLowerCase()}.png`}
                                                                    alt={country.code}
                                                                    sx={{ width: 24, height: 24 }}
                                                                    imgProps={{
                                                                        onError: (e) => {
                                                                            const target = e.target as HTMLImageElement;
                                                                            target.onerror = null;
                                                                            target.src = `https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`;
                                                                        }
                                                                    }}
                                                                />
                                                                <span>{country.dial_code}</span>
                                                            </Box>
                                                        ) : selected;
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 1,
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                transform: 'translateY(-1px)',
                                                            }
                                                        }
                                                    }}
                                                >
                                                    {CountryCodes.map((country) => (
                                                        <MenuItem key={country.code} value={country.dial_code}>
                                                            <ListItemIcon>
                                                                <Avatar
                                                                    src={`/src/assets/flags/${country.code.toLowerCase()}.png`}
                                                                    alt={country.code}
                                                                    sx={{ width: 24, height: 24 }}
                                                                    imgProps={{
                                                                        onError: (e) => {
                                                                            const target = e.target as HTMLImageElement;
                                                                            target.onerror = null;
                                                                            target.src = `https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`;
                                                                        }
                                                                    }}
                                                                />
                                                            </ListItemIcon>
                                                            <ListItemText primary={`${country.name} (${country.dial_code})`} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <FormHelperText>{formErrors.code || 'Select country code'}</FormHelperText>
                                            </FormControl>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <TextField
                                                fullWidth
                                                label="Phone Number"
                                                placeholder="+91 12345 67890"
                                                type="tel"
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
                                                        transition: 'all 0.3s ease',
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
                            </Box>

                                </Box>
                            </Box>

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
                                    {isLoading ? 'Saving...' : company ? 'Update Company' : 'Create Company'}
                                </Button>
                            </Box>
                        </Paper>
                    </Grow>
                </Box>
            </Box>
        </Drawer>
    );
}

export default CompanyEditingModal;