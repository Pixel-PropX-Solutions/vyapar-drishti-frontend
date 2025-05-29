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
    FormControl,
    Stack,
    Divider,
    Chip,
    InputAdornment,
    CircularProgress,
} from "@mui/material";
import {
    Close as CloseIcon,
    PhotoCamera,
    Business,
    Language,
    CheckCircle,
    Warning,
    Close,
    Save,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { GetCompany, ShippingAddress } from "@/utils/types";
import { createCompanyShipping, updateCompanyShipping } from "@/services/company";
import CountryCodes from '../internals/data/CountryCodes.json';
import { MenuItem, Select, ListItemIcon, ListItemText, Avatar, InputLabel, FormHelperText } from '@mui/material';

interface EditShippingModalProps {
    open: boolean;
    onClose: () => void;
    onUpdated: () => Promise<void>;
    company: GetCompany | null;
}

const ShippingEditingModal: React.FC<EditShippingModalProps> = ({
    open,
    onClose,
    onUpdated,
    company,
}) => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const [isLoading, setIsLoading] = useState(false);
    const [showValidation, setShowValidation] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [data, setData] = useState<ShippingAddress>({
        _id: '',
        user_id: '',
        // company_id: '',
        is_deleted: false,
        address_1: '',
        address_2: '',
        pinCode: '',
        city: '',
        state: '',
        country: '',
        notes: '',
        title: '',
    });

    // Validation function
    const validateForm = (formData = data) => {
        const errors: Record<string, string> = {};

        if (!formData.address_1.trim()) {
            errors.address_1 = 'Street Address line 1 is required';
        }
        if (!formData.state.trim()) {
            errors.state = 'State is required';
        }

        if (formData.pinCode && !/^\d{6}$/.test(formData.pinCode)) {
            errors.pinCode = 'Pin Code number should be 6 digits long';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (
        field: keyof ShippingAddress,
        value: string
    ) => {
        setData(prev => {
            const newData = { ...prev, [field]: value };
            validateForm(newData);
            return newData;
        });
    };

    const resetForm = () => {
        setData({
            _id: '',
            user_id: '',
            company_id: '',
            is_deleted: false,
            address_1: '',
            address_2: '',
            pinCode: '',
            city: '',
            state: '',
            country: '',
            notes: '',
            title: '',
        });
        setFormErrors({});
        setShowValidation(false);
    };

    useEffect(() => {
        if (open && company?.shipping) {
            setData({
                _id: company?.shipping._id || '',
                // company_id: company?._id || '',
                state: company?.shipping?.state || '',
                address_1: company.shipping.address_1 || '',
                user_id: company.shipping?.user_id || '',
                address_2: company.shipping.address_2 || '',
                city: company.shipping?.city || '',
                country: company.shipping?.country || '',
                pinCode: company.shipping?.pinCode || '',
                is_deleted: company.shipping?.is_deleted || false,
                notes: company.shipping?.notes || '',
                title: company.shipping?.title || '',
            });
            setFormErrors({});
        } else if (open && !company?.shipping) {
            setData({
                _id: '',
                user_id: company?.user_id || '',
                // company_id: company?._id || '',
                is_deleted: false,
                address_1: '',
                address_2: '',
                pinCode: '',
                city: '',
                state: '',
                country: '',
                notes: '',
                title: '',
            });
            resetForm();
        }
    }, [open, company?.shipping, company?._id, company?.user_id]);

    const handleSubmit = async () => {
        setShowValidation(true);

        if (!validateForm()) {
            toast.error('Please fix the form errors before submitting');
            return;
        }

        setIsLoading(true);
        const sanitizedData: any = {
            company_id: company?._id,
            state: data.state.trim(),
            address_1: data.address_1.trim(),
            user_id: company?.user_id,
        };

        if (data.address_2 && data.address_2 !== '') sanitizedData.address_2 = data.address_2.trim();
        if (data.city && data.city !== '') sanitizedData.city = data.city.trim();
        if (data.country && data.country !== '') sanitizedData.country = data.country.trim();
        if (data.pinCode && data.pinCode !== '') sanitizedData.pinCode = data.pinCode.trim();
        if (data.notes && data.notes !== '') sanitizedData.notes = data.notes.trim();
        if (data.title && data.title !== '') sanitizedData.title = data.title.trim();
        console.log('Sanitized Data:', sanitizedData);
        const formData = new FormData();
        Object.entries(sanitizedData).forEach(([key, value]) => {
            if (typeof value === 'boolean') {
                formData.append(key, value ? 'true' : 'false');
            } else if (typeof value === 'string') {
                formData.append(key, value);
            }
        });

        if (!company?.shipping) {
            await toast.promise(
                dispatch(createCompanyShipping({
                    data: formData,
                }))
                    .unwrap()
                    .then(() => {
                        setIsLoading(false);
                        onClose();
                        onUpdated();
                    })
                    .catch(() => {
                        setIsLoading(false);
                    }),
                {
                    loading: <b>Creating your shipping Address... ⏳</b>,
                    success: <b>Shipping Details successfully created! 🎉</b>,
                    error: <b>Failed to create shipping. 🚫</b>,
                }
            );
        } else {
            await toast.promise(
                dispatch(updateCompanyShipping({
                    data: formData,
                    id: company?.shipping?._id ?? '',
                }))
                    .unwrap()
                    .then(() => {
                        setIsLoading(false);
                        onClose();
                        onUpdated();
                    })
                    .catch(() => {
                        setIsLoading(false);
                    }),
                {
                    loading: <b>Updating your shipping... ⏳</b>,
                    success: <b>Company Details successfully updated! 🎉</b>,
                    error: <b>Failed to update shipping. 🚫</b>,
                }
            );
        }

    };

    const isFormValid = data.state.trim() && data.address_1.trim();

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
                            {!company?.shipping ? 'Create Shipping Address' : 'Edit Shipping Address'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {!company?.shipping ? "Create Shipping details below" : "Update your shipping details below"}
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
                                borderRadius: 3,
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
                                            Address Details
                                        </Typography>
                                        <Stack spacing={3}>
                                            <TextField
                                                fullWidth
                                                label="Street Address 1"
                                                placeholder="Enter your street address"
                                                value={data.address_1}
                                                onChange={(e) => handleInputChange('address_1', e.target.value)}
                                                error={!!formErrors.address_1}
                                                helperText={formErrors.address_1}
                                                required
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Business color={formErrors.address_1 ? 'error' : 'primary'} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
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
                                                placeholder="Enter your street address line 2"
                                                value={data.address_2}
                                                onChange={(e) => handleInputChange('address_2', e.target.value)}
                                                error={!!formErrors.address_2}
                                                helperText={formErrors.address_2}
                                                required
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Business color={formErrors.address_2 ? 'error' : 'primary'} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-1px)',
                                                        }
                                                    }
                                                }}
                                            />

                                            <TextField
                                                fullWidth
                                                label="City"
                                                placeholder="Enter your city"
                                                value={data.city}
                                                onChange={(e) => handleInputChange('city', e.target.value)}
                                                error={!!formErrors.city}
                                                helperText={formErrors.city}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Language color={formErrors.city ? 'error' : 'primary'} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-1px)',
                                                        }
                                                    }
                                                }}
                                            />
                                            <TextField
                                                fullWidth
                                                label="State"
                                                placeholder="Enter your state"
                                                value={data.state}
                                                onChange={(e) => handleInputChange('state', e.target.value)}
                                                error={!!formErrors.state}
                                                helperText={formErrors.state}
                                                required
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Business color={formErrors.state ? 'error' : 'primary'} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-1px)',
                                                        }
                                                    }
                                                }}
                                            />
                                            <TextField
                                                fullWidth
                                                label="Pin Code"
                                                placeholder="Enter your pin code"
                                                value={data.pinCode}
                                                onChange={(e) => handleInputChange('pinCode', e.target.value)}
                                                error={!!formErrors.pinCode}
                                                helperText={formErrors.pinCode}
                                                required
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Business color={formErrors.pinCode ? 'error' : 'primary'} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-1px)',
                                                        }
                                                    }
                                                }}
                                            />

                                             <TextField
                                                fullWidth
                                                label="Shipping Title"
                                                placeholder="Enter a title for this shipping address"
                                                value={data.title}
                                                onChange={(e) => handleInputChange('title', e.target.value)}
                                                error={!!formErrors.title}
                                                helperText={formErrors.title}
                                                required
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Business color={formErrors.title ? 'error' : 'primary'} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-1px)',
                                                        }
                                                    }
                                                }}
                                            />

                                             <TextField
                                                fullWidth
                                                label="Notes"
                                                placeholder="Enter any additional notes"
                                                value={data.notes}
                                                onChange={(e) => handleInputChange('notes', e.target.value)}
                                                error={!!formErrors.notes}
                                                helperText={formErrors.notes}
                                                required
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Business color={formErrors.notes ? 'error' : 'primary'} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'translateY(-1px)',
                                                        }
                                                    }
                                                }}
                                            />

                                            <FormControl fullWidth error={!!formErrors.country}>
                                                <InputLabel id="alter-country-label">Country</InputLabel>
                                                <Select
                                                    labelId="alter-country-label"
                                                    value={data.country || ''}
                                                    label="Country"
                                                    onChange={(e) => handleInputChange('country', e.target.value)}
                                                    renderValue={(selected) => {
                                                        const country = CountryCodes.find(c => c.name === selected);
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
                                                                <span>{country.name}</span>
                                                            </Box>
                                                        ) : selected;
                                                    }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2,
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                transform: 'translateY(-1px)',
                                                            }
                                                        }
                                                    }}
                                                >
                                                    {CountryCodes.map((country) => (
                                                        <MenuItem key={country.code} value={country.name}>
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
                                                            <ListItemText primary={`${country.name}`} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <FormHelperText>{formErrors.country || 'Select country'}</FormHelperText>
                                            </FormControl>
                                        </Stack>
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
                                    {isLoading ? 'Saving...' : !company?.shipping ? "Create Shipping Address" : 'Save Address'}
                                </Button>
                            </Box>
                        </Paper>
                    </Grow>
                </Box>
            </Box>
        </Drawer>
    );
}

export default ShippingEditingModal;