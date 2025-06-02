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
    Fade,
    Zoom,
    Slide,
    Card,
    CardContent,
    alpha,
    useMediaQuery,
} from "@mui/material";
import {
    Close as CloseIcon,
    Business,
    CheckCircle,
    Warning,
    Close,
    Save,
    LocationOn,
    Home,
    Edit,
    Add,
    LocationCity,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { GetGroup } from "@/utils/types";
import { createCompanyBilling, updateCompanyBilling } from "@/services/company";

interface GroupEditingModalProps {
    open: boolean;
    onClose: () => void;
    onCreated?: (group: { name: string; _id: string }) => void;
    onUpdated?: () => Promise<void>;
    group: GetGroup | null;
}

const GroupEditingModal: React.FC<GroupEditingModalProps> = ({
    open,
    onClose,
    onUpdated,
    onCreated,
    group,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user } = useSelector((state: RootState) => state.auth);
    const { currentCompany } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const [isLoading, setIsLoading] = useState(false);
    const [_showValidation, setShowValidation] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [focusedField, setFocusedField] = useState<string>('');

    const [data, setData] = useState<Partial<GetGroup>>({
        name: '',
        description: '',
        image: '',
        parent: '',
        primary_group: '',
        // is_revenue: boolean,
        // is_deemedpositive: boolean,
        // is_reserved: boolean,
        // affects_gross_profit: boolean,
        // sort_position: 0,
        _id: '',
        user_id: '',
        company_id: '',
        is_deleted: false,
    });

    // Validation function
    const validateForm = (formData = data) => {
        const errors: Record<string, string> = {};

        if (!(formData?.name ?? '').trim()) {
            errors.address_1 = 'Name of group is required';
        }
        if (!(formData.primary_group ?? '').trim()) {
            errors.state = 'Primary Group is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (
        field: keyof GetGroup,
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
            name: '',
            description: '',
            image: '',
            parent: '',
            primary_group: '',
            // is_revenue: boolean,
            // is_deemedpositive: boolean,
            // is_reserved: boolean,
            // affects_gross_profit: boolean,
            // sort_position: 0,
            _id: '',
            user_id: '',
            company_id: '',
            is_deleted: false,
        });
        setFormErrors({});
        setShowValidation(false);
    };

    useEffect(() => {
        if (open && group) {
            setData({
                _id: group._id || '',
                company_id: currentCompany?._id || '',
                name: group?.name || '',
                description: group.description || '',
                user_id: user?._id || '',
                image: group.image || '',
                parent: group?.parent || '',
                primary_group: group?.primary_group || '',
                is_deleted: group?.is_deleted || false,
            });
            setFormErrors({});
        } else if (open && !group) {
            setData({
                name: '',
                description: '',
                image: '',
                parent: '',
                primary_group: '',
                // is_revenue: boolean,
                // is_deemedpositive: boolean,
                // is_reserved: boolean,
                // affects_gross_profit: boolean,
                // sort_position: 0,
                _id: '',
                user_id: '',
                company_id: '',
                is_deleted: false,
            });
            resetForm();
        }
    }, [open, user?._id, group, currentCompany?._id]);

    const handleSubmit = async () => {
        setShowValidation(true);

        if (!validateForm()) {
            toast.error('Please fix the form errors before submitting');
            return;
        }

        setIsLoading(true);
        const sanitizedData: any = {
            state: (data?.name ?? '').trim(),
            user_id: user?._id,
            company_id: currentCompany?._id,
        };

        if (data.description && data.description !== '') sanitizedData.description = data.description.trim();
        if (data.parent && data.parent !== '') sanitizedData.parent = data.parent.trim();
        if (data.primary_group && data.primary_group !== '') sanitizedData.primary_group = data.primary_group.trim();
        if (data.image && data.image !== '') {
            if (typeof data.image === 'string') {
                sanitizedData.image = data.image.trim();
            } else {
                sanitizedData.image = data.image;
            }
        }


        const formData = new FormData();
        Object.entries(sanitizedData).forEach(([key, value]) => {
            if (typeof value === 'boolean') {
                formData.append(key, value ? 'true' : 'false');
            } else if (typeof value === 'string' || value instanceof Blob) {
                formData.append(key, value);
            }
        });
        if (group === null) {
            await toast.promise(
                dispatch(createCompanyBilling({
                    data: formData,
                }))
                    .unwrap()
                    .then(() => {
                        setIsLoading(false);
                        onClose();
                        if (onUpdated) onUpdated();
                    })
                    .catch(() => {
                        setIsLoading(false);
                    }),
                {
                    loading: <b>Creating your group Address... ⏳</b>,
                    success: <b>Billing Details successfully created! 🎉</b>,
                    error: <b>Failed to create group. 🚫</b>,
                }
            );
        } else {
            await toast.promise(
                dispatch(updateCompanyBilling({
                    data: formData,
                    id: group?._id ?? '',
                }))
                    .unwrap()
                    .then(() => {
                        setIsLoading(false);
                        onClose();
                        if (onUpdated) onUpdated();
                    })
                    .catch(() => {
                        setIsLoading(false);
                    }),
                {
                    loading: <b>Updating your group... ⏳</b>,
                    success: <b>Company Details successfully updated! 🎉</b>,
                    error: <b>Failed to update group. 🚫</b>,
                }
            );
        }

    };

    const isFormValid = (data.name ?? '').trim() && (data.primary_group ?? '').trim();


    const requiredFields = ['name', 'primary_group'];
    const optionalFields = ['parent', 'image', 'description'];
    const totalFields = requiredFields.length + optionalFields.length;

    const filledFields = [
        ...requiredFields.filter(field => !!data[field as keyof GetGroup]?.toString().trim()),
        ...optionalFields.filter(field => !!data[field as keyof GetGroup]?.toString().trim())
    ].length;

    const completionPercentage = Math.round((filledFields / totalFields) * 100);

    const formFields = [
        {
            key: 'name',
            label: 'Group Name',
            placeholder: 'Enter the name of the group',
            icon: Home,
            required: true,
            description: 'Name of the group',
        },
        {
            key: 'description',
            label: 'Description',
            placeholder: 'Enter a brief description of the group',
            icon: Business,
            required: false,
            description: 'Brief description of the group',
        },
        {
            key: 'parent',
            label: 'Parent Group',
            placeholder: 'Enter the parent group (if any)',
            icon: LocationCity,
            required: false,
            description: 'Parent group for this group (optional)',
        },
        {
            key: 'primary_group',
            label: 'Primary Group',
            placeholder: 'Enter the primary group',
            icon: LocationOn,
            required: true,
            description: 'Primary group for this group',
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
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                    backdropFilter: 'blur(20px)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1200,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Zoom in={open} timeout={600}>
                            <Tooltip title="Close" arrow placement="bottom">
                                <IconButton
                                    onClick={onClose}
                                    sx={{
                                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                                        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                            transform: 'scale(1.1) rotate(90deg)',
                                            boxShadow: `0 6px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                                        },
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                        </Zoom>

                        <Fade in={open} timeout={800}>
                            <Box>
                                <Typography variant={isMobile ? "h6" : "h5"} fontWeight={700} sx={{
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}>
                                    {group === null ? <Add sx={{ color: theme.palette.primary.main }} /> : <Edit sx={{ color: theme.palette.primary.main }} />}
                                    {group === null ? 'Create Billing Address' : 'Edit Billing Address'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {group === null ? "Set up your group details" : "Update your group information"}
                                </Typography>
                            </Box>
                        </Fade>
                    </Box>

                    <Fade in={open} timeout={1000}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {/* Progress Indicator */}
                            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    {completionPercentage}% Complete
                                </Typography>
                                <Box sx={{
                                    width: 60,
                                    height: 4,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    borderRadius: 2,
                                    overflow: 'hidden'
                                }}>
                                    <Box sx={{
                                        width: `${completionPercentage}%`,
                                        height: '100%',
                                        backgroundColor: theme.palette.primary.main,
                                        borderRadius: 2,
                                        transition: 'width 0.3s ease'
                                    }} />
                                </Box>
                            </Box>

                            <Chip
                                icon={isFormValid ? <CheckCircle /> : <Warning />}
                                label={isFormValid ? "Ready to Save" : "Fill Required Fields"}
                                color={isFormValid ? "success" : "warning"}
                                variant="outlined"
                                sx={{
                                    fontWeight: 600,
                                    backgroundColor: alpha(isFormValid ? theme.palette.success.main : theme.palette.warning.main, 0.1),
                                    borderColor: alpha(isFormValid ? theme.palette.success.main : theme.palette.warning.main, 0.3),
                                    '& .MuiChip-icon': {
                                        fontSize: '1rem'
                                    },
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    }
                                }}
                            />
                        </Box>
                    </Fade>
                </Box>
            </Slide>

            {/* Enhanced Content */}
            <Box sx={{
                flex: 1,
                overflow: 'auto',
                position: 'relative',
                '&::-webkit-scrollbar': {
                    width: 8,
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: alpha(theme.palette.background.default, 0.1),
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.3),
                    borderRadius: 4,
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.5),
                    }
                }
            }}>
                <Box sx={{ p: { xs: 2, sm: 3 }, pb: 6 }}>
                    {/* Header Card */}
                    <Grow in timeout={400}>
                        <Card sx={{
                            mb: 3,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            borderRadius: 3,
                            overflow: 'hidden',
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 4,
                                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            }
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Box sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <LocationOn sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" fontWeight={600} color="primary">
                                            Billing Address Information
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            This address will be used for all group and invoicing purposes
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grow>

                    {/* Main Form */}
                    <Grow in timeout={600}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 3, sm: 4 },
                                borderRadius: 3,
                                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                position: 'relative',
                                overflow: 'hidden',
                                backdropFilter: 'blur(20px)',
                                boxShadow: `0 20px 60px ${alpha(theme.palette.primary.main, 0.08)}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 25px 70px ${alpha(theme.palette.primary.main, 0.12)}`
                                }
                            }}
                        >
                            {/* Form Fields */}
                            <Stack spacing={4}>
                                {formFields.map((field, index) => (
                                    <Slide key={field.key} direction="up" in timeout={800 + index * 100}>
                                        <Box>
                                            <TextField
                                                fullWidth
                                                label={field.label}
                                                placeholder={field.placeholder}
                                                value={data[field.key as keyof GetGroup] || ''}
                                                onChange={(e) => handleInputChange(field.key as keyof GetGroup, e.target.value)}
                                                error={!!formErrors[field.key]}
                                                helperText={formErrors[field.key] || field.description}
                                                required={field.required}
                                                onFocus={() => setFocusedField(field.key)}
                                                onBlur={() => setFocusedField('')}
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
                                                        borderRadius: 2,
                                                        backgroundColor: focusedField === field.key
                                                            ? alpha(theme.palette.primary.main, 0.02)
                                                            : alpha(theme.palette.background.paper, 0.5),
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        '&:hover': {
                                                            transform: 'translateY(-1px)',
                                                            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
                                                        },
                                                        '&.Mui-focused': {
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.15)}`,
                                                        }
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
                                        </Box>
                                    </Slide>
                                ))}
                            </Stack>

                            {/* Enhanced Action Buttons */}
                            <Fade in timeout={1500}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 2,
                                    mt: 5,
                                    pt: 3,
                                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
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
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 8px 25px ${alpha(theme.palette.secondary.main, 0.2)}`,
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
                                                transform: 'translateY(-3px)',
                                                boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.4)}`,
                                            },
                                            '&:disabled': {
                                                background: alpha(theme.palette.action.disabled, 0.12),
                                                color: theme.palette.action.disabled,
                                                boxShadow: 'none',
                                                transform: 'none',
                                            }
                                        }}
                                    >
                                        {isLoading ? 'Saving...' :
                                            group === null ? "Create Billing Address" : 'Update Address'}
                                    </Button>
                                </Box>
                            </Fade>
                        </Paper>
                    </Grow>

                    {/* Help Section */}
                    <Grow in timeout={1000}>
                        <Card sx={{
                            mt: 3,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.info.light, 0.03)} 100%)`,
                            border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                            borderRadius: 2,
                        }}>
                            <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    <Box sx={{
                                        p: 1,
                                        borderRadius: 1,
                                        backgroundColor: alpha(theme.palette.info.main, 0.1),
                                    }}>
                                        <Warning sx={{ color: theme.palette.info.main, fontSize: 20 }} />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" fontWeight={600} color="info.main" gutterBottom>
                                            Important Information
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                            This group address will be used for all invoices and tax calculations.
                                            Please ensure the information is accurate and matches your business registration details.
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grow>
                </Box>
            </Box>
        </Drawer>
    );
}

export default GroupEditingModal;
