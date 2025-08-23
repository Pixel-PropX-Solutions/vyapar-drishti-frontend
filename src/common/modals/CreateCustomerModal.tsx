import React, { useState } from "react";
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
    Stack,
    Fade,
    LinearProgress,
    Chip,
    Zoom,
    Avatar,
    useMediaQuery,
    Autocomplete,
    Divider,
    Card,
    CardContent,
    Slide,
    alpha,
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
    Close as CloseIcon,
    Timeline,
    Category as CategoryIcon,
    CheckCircle,
    PersonAdd,
    LocationOn,
    Business,
    Assignment,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { createCustomer } from "@/services/customers";
import countries from "@/internals/data/CountriesStates.json";
import { capitalizeInput } from "@/utils/functions";

interface CreateCustomerModalProps {
    open: boolean;
    type: string;
    onClose: () => void;
    onCreated: () => void;
}

interface CustomerFormData {
    company_id: string;
    parent: string;
    parent_id: string;
    mailing_name: string;
    mailing_pincode: string;
    mailing_country?: string;
    mailing_state: string;
    mailing_address?: string;
    alias?: string;
    name: string;
    email?: string;
    image?: string | File | null;
    code: string;
    number: string;
    bank_name?: string;
    account_number?: string;
    bank_ifsc?: string;
    bank_branch?: string;
    account_holder?: string;
    tin?: string;
}

const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({
    open,
    type,
    onClose,
    onCreated,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch<AppDispatch>();
    const { user, current_company_id } = useSelector((state: RootState) => state.auth);
    const currentCompanyId = current_company_id || localStorage.getItem("current_company_id") || user?.user_settings?.current_company_id || '';
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === currentCompanyId);
    const tax_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_tax;

    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const { customerType_id } = useSelector((state: RootState) => state.customersLedger);

    const [data, setData] = useState<Partial<CustomerFormData>>({
        company_id: currentCompanyId || '',
        name: '',
        parent: type,
        parent_id: customerType_id || '',
        mailing_country: '',
        mailing_state: '',
        tin: '',
    });

    const validateForm = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (!(data?.name || '').trim()) {
            errors.name = 'Customer name is required';
        } else if ((data?.name || '').length < 2) {
            errors.name = 'Customer name must be at least 2 characters';
        }

        if (tax_enable && !(data?.mailing_country || '').trim()) {
            errors.mailing_country = 'Country is required';
        }

        if (tax_enable && !(data?.mailing_state || '').trim()) {
            errors.mailing_state = 'State is required';
        }
        if ((tax_enable && type === 'Creditors') && !(data?.tin || '').trim()) {
            errors.tin = 'TIN is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field: keyof CustomerFormData, value: string | boolean) => {
        setData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const resetForm = () => {
        setData({
            name: '',
            parent: '',
            parent_id: '',
            mailing_country: '',
            mailing_state: '',
        });
        setFormErrors({});
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error('Please fix the form errors before submitting');
            return;
        }

        setIsLoading(true);
        const sanitizedData: Record<string, string | File | undefined> = {
            name: data.name?.trim(),
            user_id: user?._id,
            company_id: currentCompanyId,
            parent_id: customerType_id || '',
            parent: type,
        };

        if (data.email?.trim())
            sanitizedData.email = data.email.trim();
        if (data.mailing_pincode?.trim()) sanitizedData.mailing_pincode = data.mailing_pincode.trim();
        if (data.code?.trim()) sanitizedData.code = data.code.trim();
        if (data.number?.trim()) sanitizedData.number = data.number.trim();
        if (data.mailing_name?.trim()) sanitizedData.mailing_name = data.mailing_name.trim();
        if (data.mailing_address?.trim()) sanitizedData.mailing_address = data.mailing_address.trim();
        if (data.mailing_country?.trim()) sanitizedData.mailing_country = data.mailing_country.trim();
        if (data.image && typeof data.image !== 'string') sanitizedData.image = data.image;
        if (data.mailing_state?.trim()) sanitizedData.mailing_state = data.mailing_state.trim();
        if (data.bank_name?.trim()) sanitizedData.bank_name = data.bank_name.trim();
        if (data.account_number?.trim()) sanitizedData.account_number = data.account_number.trim();
        if (data.bank_ifsc?.trim()) sanitizedData.bank_ifsc = data.bank_ifsc.trim();
        if (data.bank_branch?.trim()) sanitizedData.bank_branch = data.bank_branch.trim();
        if (data.account_holder?.trim()) sanitizedData.account_holder = data.account_holder.trim();
        if (data.tin?.trim()) sanitizedData.tin = data.tin.trim();

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
        dispatch(createCustomer(formData))
            .unwrap()
            .then(() => {
                onCreated();
                toast.success("Customer successfully created! 🎉");
                setIsLoading(false);
                resetForm();
                onClose();
            })
            .catch((error) => {
                setIsLoading(false);
                console.error("Error creating customer:", error);
                toast.error(error || "An unexpected error occurred. Please try again later.");
            }).finally(() => {
                setIsLoading(false);
                resetForm();
                onClose();
            });
    };

    const isFormValid = (data.name || '').trim();
    const completedFieldsCount = tax_enable ? [
        data.name,
        data.mailing_country,
        data.mailing_state,
        data.tin
    ].filter(Boolean).length : [
        data.name,
        data.mailing_country,
        data.mailing_state,
    ].filter(Boolean).length;

    return (
        <Drawer
            anchor="right"
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 650, md: 750 },
                    backgroundColor: theme.palette.background.default,
                    backgroundImage: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                    overflow: 'hidden',
                    borderLeft: `3px solid ${theme.palette.primary.main}`,
                }
            }}
            sx={{
                '& .MuiBackdrop-root': {
                    backgroundColor: alpha(theme.palette.common.black, 0.7),
                    backdropFilter: 'blur(12px)',
                }
            }}
            open={open}
            onClose={onClose}
            transitionDuration={350}
            {...(open ? {} : { inert: '' })}
        >
            {/* Loading Progress Bar */}
            <Fade in={isLoading}>
                <LinearProgress
                    variant="indeterminate"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1300,
                        height: 4,
                        '& .MuiLinearProgress-bar': {
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                        }
                    }}
                />
            </Fade>

            {/* Enhanced Header */}
            <Box sx={{
                p: { xs: 2, sm: 3 },
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
                borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backdropFilter: 'blur(20px)',
            }}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                        <Tooltip title="Close" placement="bottom">
                            <IconButton
                                onClick={onClose}
                                sx={{
                                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                    backdropFilter: 'blur(10px)',
                                    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                        transform: 'rotate(90deg) scale(1.1)',
                                        borderColor: theme.palette.primary.main,
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>

                        <Box sx={{ flex: 1 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                                <Avatar
                                    sx={{
                                        bgcolor: theme.palette.primary.main,
                                        width: 36,
                                        height: 36,
                                        boxShadow: theme.shadows[3],
                                    }}
                                >
                                    <PersonAdd fontSize="small" />
                                </Avatar>
                                <Box>
                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                        color="text.primary"
                                        sx={{
                                            background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                        }}
                                    >
                                        Create {type} Customer
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                                        Add new customer information and details
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Stack>

                    {/* Progress Indicator */}
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                            icon={<Assignment />}
                            label={`${completedFieldsCount}/${tax_enable ? 4 : 3} fields`}
                            size="small"
                            variant="outlined"
                            color={completedFieldsCount >= 2 ? "success" : "default"}
                            sx={{
                                fontWeight: 600,
                                borderWidth: 2,
                                '& .MuiChip-icon': {
                                    fontSize: '1rem'
                                }
                            }}
                        />
                    </Stack>
                </Stack>
            </Box>

            {/* Enhanced Content Area */}
            <Box sx={{
                flex: 1,
                overflow: 'auto',
                position: 'relative',
                '&::-webkit-scrollbar': { width: 6 },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: alpha(theme.palette.background.default, 0.1),
                    borderRadius: 3
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.3),
                    borderRadius: 3,
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.5)
                    }
                }
            }}>
                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                    {/* Main Form Card */}
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`,
                            backdropFilter: 'blur(20px)',
                            overflow: 'hidden',
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 4,
                                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            }
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Stack spacing={4}>
                                {/* Tax Information Section */}
                                {tax_enable && (
                                    <Slide direction="right" in timeout={300}>
                                        <Box>
                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                                <Business color="primary" fontSize="small" />
                                                <Typography variant="h6" fontWeight={600} color="primary">
                                                    Tax Information
                                                </Typography>
                                                <Divider sx={{ flex: 1, ml: 2 }} />
                                            </Stack>

                                            <FormControl fullWidth>
                                                <TextField
                                                    fullWidth
                                                    label={`TIN Number ${(tax_enable && type === 'Creditors') ? '*' : ''}`}
                                                    placeholder="Enter tax identification number"
                                                    value={data.tin || ''}
                                                    onChange={(e) => handleInputChange('tin', e.target.value)}
                                                    error={!!formErrors.tin}
                                                    helperText={formErrors.tin || 'Tax identification number for business records'}
                                                    variant="outlined"
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 1,
                                                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
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
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Box>
                                    </Slide>
                                )}

                                {/* Customer Details Section */}
                                <Slide direction="right" in timeout={400}>
                                    <Box>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                            <CategoryIcon color="primary" fontSize="small" />
                                            <Typography variant="h6" fontWeight={600} color="primary">
                                                Customer Details
                                            </Typography>
                                            <Divider sx={{ flex: 1, ml: 2 }} />
                                        </Stack>

                                        <FormControl fullWidth>
                                            <TextField
                                                fullWidth
                                                label="Customer Name *"
                                                placeholder="Enter full customer name"
                                                value={data.name || ''}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                error={!!formErrors.name}
                                                helperText={formErrors.name || 'Full name of the customer or business'}
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1,
                                                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                                        fontSize: '1.1rem',
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
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Box>
                                </Slide>

                                {/* Location Information Section */}
                                <Slide direction="right" in timeout={500}>
                                    <Box>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                            <LocationOn color="primary" fontSize="small" />
                                            <Typography variant="h6" fontWeight={600} color="primary">
                                                Location Information
                                            </Typography>
                                            <Divider sx={{ flex: 1, ml: 2 }} />
                                        </Stack>

                                        <Stack spacing={3}>
                                            {/* Country Field */}
                                            <FormControl fullWidth>
                                                <Autocomplete
                                                    fullWidth
                                                    options={countries?.map(con => ({ label: con.name })) ?? []}
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
                                                                    padding: '12px 16px',
                                                                    fontWeight: 500,
                                                                    transition: 'all 0.2s ease',
                                                                    borderRadius: '8px',
                                                                    margin: '2px',
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
                                                            label={`Country ${tax_enable ? '*' : ''}`}
                                                            placeholder="Select or type country name"
                                                            error={!!formErrors.mailing_country}
                                                            helperText={formErrors.mailing_country || "Country for address"}
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                    borderRadius: 1,
                                                                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
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
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                    value={data.mailing_country || ''}
                                                    onChange={(_, newValue) => {
                                                        handleInputChange(
                                                            'mailing_country',
                                                            typeof newValue === 'string'
                                                                ? newValue
                                                                : (typeof newValue === 'object' && newValue !== null && 'label' in newValue)
                                                                    ? newValue.label
                                                                    : ''
                                                        );
                                                    }}
                                                    sx={{
                                                        '& .MuiAutocomplete-popupIndicator': {
                                                            color: theme.palette.primary.main,
                                                        },
                                                        '& .MuiAutocomplete-clearIndicator': {
                                                            color: theme.palette.text.secondary,
                                                        }
                                                    }}
                                                />
                                            </FormControl>

                                            {/* State Field */}
                                            <FormControl fullWidth>
                                                <Autocomplete
                                                    fullWidth
                                                    options={(() => {
                                                        const country = countries.find(con => con.name === data.mailing_country);
                                                        if (!country) return [];
                                                        return country.states.length === 0 ? ['No States'] : country.states;
                                                    })()}
                                                    freeSolo
                                                    disabled={!data.mailing_country}
                                                    renderOption={(props, option) => {
                                                        const { key, ...rest } = props;
                                                        return (
                                                            <li
                                                                key={key}
                                                                {...rest}
                                                                style={{
                                                                    padding: '12px 16px',
                                                                    fontWeight: 500,
                                                                    transition: 'all 0.2s ease',
                                                                    borderRadius: '8px',
                                                                    margin: '2px',
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
                                                            label={`State/Province ${tax_enable ? '*' : ''}`}
                                                            placeholder="Select or type state name"
                                                            disabled={!data.mailing_country}
                                                            error={!!formErrors.mailing_state}
                                                            helperText={formErrors.mailing_state || "State or province for address"}
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                    borderRadius: 1,
                                                                    backgroundColor: alpha(theme.palette.background.paper, 0.8),
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
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                    value={data.mailing_state || ''}
                                                    onChange={(_, newValue) => {
                                                        handleInputChange(
                                                            'mailing_state',
                                                            capitalizeInput((() => {
                                                                const country = countries.find(con => con.name === data.mailing_country);
                                                                if (!country || country.states.length < 1) return '';
                                                                return newValue || '';
                                                            })(), 'words')
                                                        );
                                                    }}
                                                    sx={{
                                                        '& .MuiAutocomplete-popupIndicator': {
                                                            color: theme.palette.primary.main,
                                                        },
                                                        '& .MuiAutocomplete-clearIndicator': {
                                                            color: theme.palette.text.secondary,
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Stack>
                                    </Box>
                                </Slide>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Enhanced Footer */}
            <Box sx={{
                p: { xs: 2, sm: 3 },
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
                backdropFilter: 'blur(20px)',
            }}>
                <Stack
                    direction={isMobile ? "column" : "row"}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Stack
                        direction={isMobile ? "column" : "row"}
                        spacing={2}
                        sx={{ width: isMobile ? '100%' : 'auto' }}
                    >
                        <Button
                            variant="outlined"
                            onClick={resetForm}
                            disabled={isLoading}
                            fullWidth={isMobile}
                            sx={{
                                textTransform: 'none',
                                borderRadius: 1,
                                px: 3,
                                py: 1.5,
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                borderWidth: 2,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    borderWidth: 2,
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme.shadows[6],
                                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                }
                            }}
                        >
                            Reset Form
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={isLoading ? <Timeline className="animate-spin" /> : <AddCircleOutlineIcon />}
                            onClick={handleSubmit}
                            disabled={isLoading || !isFormValid}
                            fullWidth={isMobile}
                            sx={{
                                textTransform: 'none',
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 700,
                                borderRadius: 1,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                boxShadow: theme.shadows[8],
                                minWidth: 200,
                                '&:hover': {
                                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                                    transform: 'translateY(-3px)',
                                    boxShadow: theme.shadows[16],
                                },
                                '&:disabled': {
                                    background: theme.palette.action.disabledBackground,
                                    color: theme.palette.action.disabled,
                                    transform: 'none',
                                    boxShadow: 'none'
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        >
                            {isLoading ? 'Creating Customer...' : 'Create Customer'}
                        </Button>
                    </Stack>

                    {/* Success Indicator */}
                    {!isMobile && isFormValid && (
                        <Zoom appear in timeout={400}>
                            <Chip
                                icon={<CheckCircle />}
                                label="Ready to submit"
                                color="success"
                                variant="outlined"
                                sx={{
                                    fontWeight: 600,
                                    borderWidth: 2,
                                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                                    '& .MuiChip-icon': {
                                        fontSize: '1.1rem'
                                    }
                                }}
                            />
                        </Zoom>
                    )}
                </Stack>
            </Box>
        </Drawer>
    );
};

export default CreateCustomerModal;


// import React, { useState } from "react";
// import {
//     Box,
//     TextField,
//     Button,
//     Typography,
//     IconButton,
//     Paper,
//     Drawer,
//     useTheme,
//     Tooltip,
//     FormControl,
//     Stack,
//     Fade,
//     LinearProgress,
//     Chip,
//     Zoom,
//     Avatar,
//     useMediaQuery,
//     Autocomplete,
// } from "@mui/material";
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import {
//     Close as CloseIcon,
//     Timeline,
//     Category as CategoryIcon,
//     CheckCircle,
//     Info,
// } from "@mui/icons-material";
// import toast from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/store/store";
// import { createCustomer } from "@/services/customers";
// import countries from "@/internals/data/CountriesStates.json";
// import { capitalizeInput } from "@/utils/functions";


// interface CreateCustomerModalProps {
//     open: boolean;
//     type: string;
//     onClose: () => void;
//     onCreated: () => void;
// }


// interface CustomerFormData {
//     company_id: string;
//     parent: string;
//     parent_id: string;
//     mailing_name: string;
//     mailing_pincode: string;
//     mailing_country?: string;
//     mailing_state: string;
//     mailing_address?: string;
//     alias?: string;
//     name: string;
//     email?: string;
//     image?: string | File | null;
//     code: string;
//     number: string;
//     bank_name?: string;
//     account_number?: string;
//     bank_ifsc?: string;
//     bank_branch?: string;
//     account_holder?: string;
//     tin?: string;
// }

// const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({
//     open,
//     type,
//     onClose,
//     onCreated,
// }) => {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//     const dispatch = useDispatch<AppDispatch>();
//     const { user, current_company_id } = useSelector((state: RootState) => state.auth);
//     const currentCompanyId = current_company_id || localStorage.getItem("current_company_id") || user?.user_settings?.current_company_id || '';
//     const currentCompanyDetails = user?.company?.find((c: any) => c._id === currentCompanyId);
//     const tax_enable: boolean = currentCompanyDetails?.company_settings?.features?.enable_tax;

//     const [isLoading, setIsLoading] = useState(false);
//     const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
//     const { customerType_id } = useSelector((state: RootState) => state.customersLedger);

//     const [data, setData] = useState<Partial<CustomerFormData>>({
//         company_id: currentCompanyId || '',
//         name: '',
//         parent: type,
//         parent_id: customerType_id || '',
//         mailing_country: '',
//         mailing_state: '',
//         tin: '',
//     });


//     const validateForm = (): boolean => {
//         const errors: { [key: string]: string } = {};

//         if (!(data?.name || '').trim()) {
//             errors.name = 'Customer name is required';
//         } else if ((data?.name || '').length < 2) {
//             errors.name = 'Customer name must be at least 2 characters';
//         }

//         if (tax_enable && !(data?.mailing_country || '').trim()) {
//             errors.mailing_country = 'Country is required';
//         }

//         if (tax_enable && !(data?.mailing_state || '').trim()) {
//             errors.mailing_state = 'State is required';
//         }
//         if ((tax_enable && type === 'Creditors') && !(data?.tin || '').trim()) {
//             errors.tin = 'TIN is required';
//         }

//         setFormErrors(errors);
//         return Object.keys(errors).length === 0;
//     };

//     const handleInputChange = (field: keyof CustomerFormData, value: string | boolean) => {
//         setData(prev => ({
//             ...prev,
//             [field]: value
//         }));

//         // Clear error when user starts typing
//         if (formErrors[field]) {
//             setFormErrors(prev => ({
//                 ...prev,
//                 [field]: ''
//             }));
//         }
//     };

//     const resetForm = () => {
//         setData({
//             name: '',
//             parent: '',
//             parent_id: '',
//             mailing_country: '',
//             mailing_state: '',
//         });
//         setFormErrors({});
//     };

//     const handleSubmit = async () => {
//         if (!validateForm()) {
//             toast.error('Please fix the form errors before submitting');
//             return;
//         }

//         setIsLoading(true);
//         const sanitizedData: Record<string, string | File | undefined> = {
//             name: data.name?.trim(),
//             user_id: user?._id,
//             company_id: currentCompanyId,
//             parent_id: customerType_id || '',
//             parent: type,
//         };

//         if (data.email?.trim())
//             sanitizedData.email = data.email.trim();
//         if (data.mailing_pincode?.trim()) sanitizedData.mailing_pincode = data.mailing_pincode.trim();
//         if (data.code?.trim()) sanitizedData.code = data.code.trim();
//         if (data.number?.trim()) sanitizedData.number = data.number.trim();
//         if (data.mailing_name?.trim()) sanitizedData.mailing_name = data.mailing_name.trim();
//         if (data.mailing_address?.trim()) sanitizedData.mailing_address = data.mailing_address.trim();
//         if (data.mailing_country?.trim()) sanitizedData.mailing_country = data.mailing_country.trim();
//         if (data.image && typeof data.image !== 'string') sanitizedData.image = data.image;
//         if (data.mailing_state?.trim()) sanitizedData.mailing_state = data.mailing_state.trim();
//         if (data.bank_name?.trim()) sanitizedData.bank_name = data.bank_name.trim();
//         if (data.account_number?.trim()) sanitizedData.account_number = data.account_number.trim();
//         if (data.bank_ifsc?.trim()) sanitizedData.bank_ifsc = data.bank_ifsc.trim();
//         if (data.bank_branch?.trim()) sanitizedData.bank_branch = data.bank_branch.trim();
//         if (data.account_holder?.trim()) sanitizedData.account_holder = data.account_holder.trim();
//         if (data.tin?.trim()) sanitizedData.tin = data.tin.trim();

//         const formData = new FormData();
//         Object.entries(sanitizedData).forEach(([key, value]) => {
//             if (typeof value === 'boolean') {
//                 formData.append(key, value ? 'true' : 'false');
//             } else if (value !== undefined && value !== null) {
//                 if (typeof value === 'string' || value instanceof Blob) {
//                     formData.append(key, value);
//                 }
//             }
//         });
//         dispatch(createCustomer(formData))
//             .unwrap()
//             .then(() => {
//                 onCreated();
//                 toast.success("Customer successfully created! 🎉");
//                 setIsLoading(false);
//                 resetForm();
//                 onClose();
//             })
//             .catch((error) => {
//                 setIsLoading(false);
//                 console.error("Error creating customer:", error);
//                 toast.error(error || "An unexpected error occurred. Please try again later.");
//             }).finally(() => {
//                 setIsLoading(false);
//                 resetForm();
//                 onClose();
//             });
//     };

//     return (
//         <Drawer
//             anchor="right"
//             PaperProps={{
//                 sx: {
//                     width: { xs: '100%', sm: 600, md: 700 },
//                     backgroundColor: theme.palette.background.default,
//                     backgroundImage: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
//                     overflow: 'hidden',
//                 }
//             }}
//             sx={{
//                 '& .MuiBackdrop-root': {
//                     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//                     backdropFilter: 'blur(8px)',
//                 }
//             }}
//             open={open}
//             onClose={onClose}
//             transitionDuration={300}
//             {...(open ? {} : { inert: '' })}
//         >
//             <Fade in={isLoading}>
//                 <LinearProgress
//                     sx={{
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         zIndex: 1000,
//                         height: 3
//                     }}
//                 />
//             </Fade>

//             {/* Header */}
//             <Box sx={{
//                 p: 3,
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 borderBottom: `2px solid ${theme.palette.primary.main}`,
//                 background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.primary.light}15 100%)`,
//                 backdropFilter: 'blur(20px)',
//                 position: 'sticky',
//                 top: 0,
//                 zIndex: 100,
//             }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                     <Tooltip title="Close" arrow>
//                         <IconButton
//                             onClick={onClose}
//                             sx={{
//                                 backgroundColor: theme.palette.background.paper,
//                                 boxShadow: theme.shadows[2],
//                                 '&:hover': {
//                                     backgroundColor: theme.palette.action.hover,
//                                     transform: 'scale(1.1) rotate(90deg)',
//                                     boxShadow: theme.shadows[4],
//                                 },
//                                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
//                             }}
//                         >
//                             <CloseIcon />
//                         </IconButton>
//                     </Tooltip>
//                     <Box>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <Avatar
//                                 sx={{
//                                     bgcolor: theme.palette.primary.main,
//                                     width: 32,
//                                     height: 32,
//                                 }}
//                             >
//                                 <CategoryIcon fontSize="small" />
//                             </Avatar>
//                             <Typography variant="h6" fontWeight={700}>
//                                 Create {type} Customer
//                             </Typography>
//                         </Box>
//                         <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
//                             Create a new customer to manage their information
//                         </Typography>
//                     </Box>
//                 </Box>
//                 {!isMobile && (
//                     <Chip
//                         icon={<Info />}
//                         label="Fill required fields"
//                         size="small"
//                         variant="outlined"
//                         sx={{
//                             borderColor: theme.palette.primary.main,
//                             color: theme.palette.primary.main,
//                         }}
//                     />
//                 )}
//             </Box>



//             {/* Content */}
//             <Box sx={{
//                 flex: 1,
//                 overflow: 'auto',
//                 position: 'relative',
//                 '&::-webkit-scrollbar': { width: 8 },
//                 '&::-webkit-scrollbar-track': { backgroundColor: theme.palette.background.default },
//                 '&::-webkit-scrollbar-thumb': {
//                     backgroundColor: theme.palette.divider,
//                     borderRadius: 1,
//                     '&:hover': { backgroundColor: theme.palette.action.hover }
//                 }
//             }}>
//                 <Box sx={{ p: 3 }}>
//                     <Paper
//                         elevation={3}
//                         sx={{
//                             px: 3,
//                             py: 2,
//                             mb: 3,
//                             borderRadius: 1,
//                             background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover}20 100%)`,
//                             border: `1px solid ${theme.palette.divider}`,
//                             '&:hover': {
//                                 boxShadow: theme.shadows[8]
//                             }
//                         }}
//                     >
//                         {/* Form Fields */}
//                         <Stack spacing={2}>
//                             {/* TIN Number */}
//                             {tax_enable && <FormControl fullWidth>
//                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                                     <CategoryIcon color="primary" fontSize="small" />
//                                     <Typography variant="body1" fontWeight={600}>
//                                         TIN Number {(tax_enable && type === 'Creditors') ? '(Required)' : ''}
//                                     </Typography>
//                                 </Box>
//                                 <TextField
//                                     fullWidth
//                                     placeholder="Enter TIN Number"
//                                     value={data.tin}
//                                     onChange={(e) => handleInputChange('tin', e.target.value)}
//                                     error={!!formErrors.tin}
//                                     helperText={formErrors.tin}
//                                     sx={{
//                                         '& .MuiOutlinedInput-root': {
//                                             borderRadius: 1,
//                                             transition: 'all 0.3s ease',
//                                             '&:hover': {
//                                                 transform: 'translateY(-1px)',
//                                                 boxShadow: theme.shadows[2]
//                                             },
//                                             '&.Mui-focused': {
//                                                 transform: 'translateY(-2px)',
//                                                 boxShadow: theme.shadows[4]
//                                             }
//                                         }
//                                     }}
//                                 />
//                             </FormControl>}

//                             {/* Customer Name */}
//                             <FormControl fullWidth>
//                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                                     <CategoryIcon color="primary" fontSize="small" />
//                                     <Typography variant="body1" fontWeight={600}>
//                                         Customer Name *
//                                     </Typography>
//                                 </Box>
//                                 <TextField
//                                     fullWidth
//                                     placeholder="Enter customer name"
//                                     value={data.name}
//                                     onChange={(e) => handleInputChange('name', e.target.value)}
//                                     error={!!formErrors.name}
//                                     helperText={formErrors.name}
//                                     sx={{
//                                         '& .MuiOutlinedInput-root': {
//                                             borderRadius: 1,
//                                             transition: 'all 0.3s ease',
//                                             '&:hover': {
//                                                 transform: 'translateY(-1px)',
//                                                 boxShadow: theme.shadows[2]
//                                             },
//                                             '&.Mui-focused': {
//                                                 transform: 'translateY(-2px)',
//                                                 boxShadow: theme.shadows[4]
//                                             }
//                                         }
//                                     }}
//                                 />
//                             </FormControl>

//                             {/* Mailing Country */}
//                             <FormControl fullWidth>
//                                 <Autocomplete
//                                     fullWidth
//                                     size="small"
//                                     options={[
//                                         ...(countries?.map(con => ({
//                                             label: con.name,
//                                         })) ?? []),
//                                     ]}
//                                     getOptionLabel={(option) =>
//                                         typeof option === 'string' ? option : option.label || ''
//                                     }
//                                     freeSolo
//                                     renderOption={(props, option) => {
//                                         const { key, ...rest } = props;
//                                         return (
//                                             <li
//                                                 key={key}
//                                                 {...rest}
//                                                 style={{
//                                                     fontWeight: 400,
//                                                     color: 'inherit',
//                                                     ...(props.style || {}),
//                                                 }}
//                                             >
//                                                 {option.label}
//                                             </li>
//                                         );
//                                     }}
//                                     renderInput={(params) => (
//                                         <TextField
//                                             {...params}
//                                             placeholder="Select country"
//                                             size="small"
//                                             id="mailing_country"
//                                             label={`Country ${tax_enable ? '(Required)' : ''}`}
//                                             autoComplete="off"
//                                             error={!!formErrors.mailing_country}
//                                             helperText={formErrors.mailing_country || "Country for mailing address"}
//                                         />
//                                     )}
//                                     value={data.mailing_country || ''}
//                                     onChange={(_, newValue) => {
//                                         handleInputChange(
//                                             'mailing_country',
//                                             typeof newValue === 'string'
//                                                 ? newValue
//                                                 : (typeof newValue === 'object' && newValue !== null && 'label' in newValue)
//                                                     ? newValue.label
//                                                     : ''
//                                         );
//                                     }}
//                                     sx={{
//                                         '& .MuiAutocomplete-endAdornment': { display: 'none' },
//                                         '& .MuiOutlinedInput-root': {
//                                             borderRadius: 1,
//                                         }
//                                     }}
//                                 />
//                             </FormControl>

//                             {/* Mailing State */}
//                             <FormControl fullWidth>
//                                 <Autocomplete
//                                     fullWidth
//                                     size="small"
//                                     options={(() => {
//                                         const country = countries.find(con => con.name === data.mailing_country);
//                                         if (!country) return [];
//                                         return country.states.length === 0 ? ['No States'] : country.states;
//                                     })()}
//                                     freeSolo
//                                     renderOption={(props, option) => {
//                                         const { key, ...rest } = props;
//                                         return (
//                                             <li
//                                                 key={key}
//                                                 {...rest}
//                                                 style={{
//                                                     fontWeight: 400,
//                                                     color: 'inherit',
//                                                     ...(props.style || {}),
//                                                 }}
//                                             >
//                                                 {option}
//                                             </li>
//                                         );
//                                     }}
//                                     renderInput={(params) => (
//                                         <TextField
//                                             {...params}
//                                             placeholder="Select state"
//                                             disabled={!data.mailing_country}
//                                             size="small"
//                                             label={`State ${tax_enable ? '(Required)' : ''}`}
//                                             autoComplete="off"
//                                             error={!!formErrors.mailing_state}
//                                             helperText={formErrors.mailing_state || "State for address"}
//                                         />
//                                     )}
//                                     value={data.mailing_state || ''}
//                                     onChange={(_, newValue) => {
//                                         handleInputChange(
//                                             'mailing_state',
//                                             capitalizeInput((() => {
//                                                 const country = countries.find(con => con.name === data.mailing_country);
//                                                 if (!country || country.states.length < 1) return '';
//                                                 return newValue || '';
//                                             })(), 'words')
//                                         );
//                                     }}
//                                     sx={{
//                                         '& .MuiAutocomplete-endAdornment': { display: 'none' },
//                                         '& .MuiOutlinedInput-root': {
//                                             borderRadius: 1,
//                                         }
//                                     }}
//                                 />
//                             </FormControl>
//                         </Stack>
//                     </Paper>
//                 </Box>
//             </Box>

//             {/* Footer */}
//             <Box sx={{
//                 p: 3,
//                 borderTop: `1px solid ${theme.palette.divider}`,
//                 backgroundColor: theme.palette.background.paper,
//                 background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover}20 100%)`,
//                 backdropFilter: 'blur(20px)',
//             }}>
//                 <Stack
//                     direction={isMobile ? "column" : "row"}
//                     spacing={2}
//                     justifyContent="space-between"
//                     alignItems="center"
//                 >
//                     <Stack direction={isMobile ? "column" : "row"} spacing={2} sx={{ width: isMobile ? '100%' : 'auto' }}>
//                         <Button
//                             variant="outlined"
//                             onClick={resetForm}
//                             disabled={isLoading}
//                             fullWidth={isMobile}
//                             sx={{
//                                 textTransform: 'none',
//                                 borderRadius: 1,
//                                 px: 3,
//                                 py: 1.5,
//                                 fontWeight: 600,
//                                 transition: 'all 0.3s ease',
//                                 '&:hover': {
//                                     transform: 'translateY(-2px)',
//                                     boxShadow: theme.shadows[4]
//                                 }
//                             }}
//                         >
//                             Reset Form
//                         </Button>

//                         <Button
//                             variant="contained"
//                             startIcon={isLoading ? <Timeline className="animate-spin" /> : <AddCircleOutlineIcon />}
//                             onClick={handleSubmit}
//                             disabled={isLoading || !(data.name || '').trim()}
//                             fullWidth={isMobile}
//                             sx={{
//                                 textTransform: 'none',
//                                 px: 4,
//                                 py: 1.5,
//                                 fontSize: '1rem',
//                                 fontWeight: 700,
//                                 borderRadius: 1,
//                                 background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
//                                 boxShadow: theme.shadows[6],
//                                 '&:hover': {
//                                     background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
//                                     transform: 'translateY(-3px)',
//                                     boxShadow: theme.shadows[12],
//                                 },
//                                 '&:disabled': {
//                                     background: theme.palette.action.disabledBackground,
//                                     color: theme.palette.action.disabled,
//                                     transform: 'none',
//                                     boxShadow: 'none'
//                                 },
//                                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                                 minWidth: 200
//                             }}
//                         >
//                             {isLoading
//                                 ? ('Creating Customer...')
//                                 : ('Create Customer')
//                             }
//                         </Button>
//                     </Stack>

//                     {!isMobile && (data.name || '').trim() && (
//                         <Zoom appear in timeout={300}>
//                             <Chip
//                                 icon={<CheckCircle />}
//                                 label="Ready to submit"
//                                 color="success"
//                                 variant="outlined"
//                                 sx={{ fontWeight: 600 }}
//                             />
//                         </Zoom>
//                     )}
//                 </Stack>
//             </Box>
//         </Drawer >
//     );
// };

// export default CreateCustomerModal;