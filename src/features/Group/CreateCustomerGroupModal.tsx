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
    Fade,
    LinearProgress,
    Chip,
    Zoom,
    Avatar,
    Divider,
    useMediaQuery,
    Autocomplete,
    alpha,
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
    Close as CloseIcon,
    Delete,
    Timeline,
    Category as CategoryIcon,
    Description as DescriptionIcon,
    CloudUpload,
    CheckCircle,
    Info,
    Palette,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { UpdateAccountingGroup } from "@/utils/types";
import { updateInventoryGroup } from "@/services/inventoryGroup";
import { createAccountingGroup, viewDefaultAccountingGroup } from "@/services/accountingGroup";

interface CreateCustomerGroupModalProps {
    open: boolean;
    onClose: () => void;
    onCreated: (accountingGroup: { name: string; _id: string }) => void;
    onUpdated?: () => Promise<void>;
    accountingGroup?: UpdateAccountingGroup | null;
}

interface InventoryGroupFormData {
    accounting_group_name: string;
    parent: string;
    description: string;
    image?: File | string;
    // nature_of_goods: string;
    // hsn_code: string;
    // taxability: string;
}

const CreateCustomerGroupModal: React.FC<CreateCustomerGroupModalProps> = ({
    open,
    onClose,
    onCreated,
    onUpdated,
    accountingGroup,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch<AppDispatch>();
    const { currentCompany } = useSelector((state: RootState) => state.auth);
    const { defaultAccountingGroup } = useSelector((state: RootState) => state.accountingGroup);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const accountingGroupfileInputRef = useRef<HTMLInputElement | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [selectedParentOption, setSelectedParentOption] = useState<{
        label: string;
        value: string;
    } | null>(null);
    const [data, setData] = useState<InventoryGroupFormData>({
        accounting_group_name: '',
        description: '',
        image: '',
        parent: 'Primary Group',
    });

    const accountingGroupOptions = defaultAccountingGroup?.map(group => ({
        label: group.accounting_group_name,
        value: group.accounting_group_name,
    })) || [];

    const validateForm = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (!data.accounting_group_name.trim()) {
            errors.accounting_group_name = 'Group name is required';
        } else if (data.accounting_group_name.length < 2) {
            errors.accounting_group_name = 'Group name must be at least 2 characters';
        }

        if (data.description && data.description.length > 500) {
            errors.description = 'Description must be less than 500 characters';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleInputChange = (field: keyof InventoryGroupFormData, value: string | boolean) => {
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

    const handleParentChange = (
        _: React.SyntheticEvent<Element, Event>,
        value: string | { label: string; value: string } | null
    ) => {
        if (typeof value === 'string') {
            setSelectedParentOption({ label: value, value });
            handleInputChange('parent', value);
        } else if (value) {
            setSelectedParentOption(value);
            handleInputChange('parent', value.value);
        } else {
            setSelectedParentOption(null);
            handleInputChange('parent', '');
        }
    };

    const simulateUploadProgress = () => {
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 100);
    };

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

        simulateUploadProgress();
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
        accountingGroupfileInputRef.current?.click();
    };

    const removeImage = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setImagePreview(null);
        setUploadProgress(0);
        setData(prev => ({ ...prev, image: '' }));
        if (accountingGroupfileInputRef.current) {
            accountingGroupfileInputRef.current.value = '';
        }
    }, []);

    const resetForm = () => {
        setData({
            accounting_group_name: '',
            description: '',
            image: '',
            parent: 'Primary Group',
        });
        setImagePreview(null);
        setUploadProgress(0);
        setFormErrors({});
        if (accountingGroupfileInputRef.current) {
            accountingGroupfileInputRef.current.value = '';
        }
    };

    useEffect(() => {
        dispatch(viewDefaultAccountingGroup());
        if (open && accountingGroup) {
            setData({
                accounting_group_name: accountingGroup.accounting_group_name || '',
                description: accountingGroup.description || '',
                image: accountingGroup.image || '',
                parent: accountingGroup.parent || '',
            });
            setImagePreview(
                typeof accountingGroup?.image === "string" ? accountingGroup.image : null
            );
        } else if (open && !accountingGroup) {
            resetForm();
        }
    }, [open, accountingGroup]);

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error('Please fix the form errors before submitting');
            return;
        }

        setIsLoading(true);
        const sanitizedData: any = {
            accounting_group_name: data.accounting_group_name.trim(),
        };
        if (data.description && data.description !== '') sanitizedData.description = data.description;
        if (data.image && typeof data.image !== 'string') sanitizedData.image = data.image;
        if (data.parent && data.parent !== '') sanitizedData.parent = data.parent.trim();

        const formData = new FormData();
        Object.entries(sanitizedData).forEach(([key, value]) => {
            if (typeof value === 'boolean') {
                formData.append(key, value ? 'true' : 'false');
            } else if (value instanceof File) {
                formData.append(key, value);
            } else if (typeof value === 'string') {
                formData.append(key, value);
            }
        });
        formData.append('company_id', currentCompany?._id || '');

        if (accountingGroup && accountingGroup._id) {
            // Edit mode
            await dispatch(updateInventoryGroup({
                id: accountingGroup._id,
                data: formData
            }))
                .unwrap()
                .then(() => {
                    setIsLoading(false);
                    onClose();
                    if (onUpdated) onUpdated();
                    toast.success('Group successfully updated! 🎉');
                })
                .catch((error) => {
                    setIsLoading(false);
                    toast.error(error || "An unexpected error occurred. Please try again later.");
                });
        } else {
            // Create mode
            await dispatch(createAccountingGroup(formData))
                .unwrap()
                .then((response) => {
                    const newGroup = {
                        name: response.accounting_group_name,
                        _id: response._id
                    };
                    onCreated(newGroup);
                    setIsLoading(false);
                    resetForm();
                    onClose();
                    toast.success('Group successfully created! 🎉');
                })
                .catch((error) => {
                    setIsLoading(false);
                    toast.error(error || 'An unexpected error occurred. Please try again later.');
                });
        }
    };

    return (
        <Drawer
            anchor="right"
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 600, md: 700 },
                    backgroundColor: theme.palette.background.default,
                    backgroundImage: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
                    overflow: 'hidden',
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
            transitionDuration={300}
        >
            <Fade in={isLoading}>
                <LinearProgress
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        height: 3
                    }}
                />
            </Fade>

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
                zIndex: 100,
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
                                    transform: 'scale(1.1) rotate(90deg)',
                                    boxShadow: theme.shadows[4],
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    width: 32,
                                    height: 32,
                                }}
                            >
                                <CategoryIcon fontSize="small" />
                            </Avatar>
                            <Typography variant="h6" fontWeight={700}>
                                {accountingGroup ? 'Edit Group' : 'Create Group'}
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {accountingGroup ? 'Update the details of your group' : 'Create a new group for your products'}
                        </Typography>
                    </Box>
                </Box>

                {!isMobile && (
                    <Chip
                        icon={<Info />}
                        label="Fill required fields"
                        size="small"
                        variant="outlined"
                        sx={{
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                        }}
                    />
                )}
            </Box>

            {/* Content */}
            <Box sx={{
                flex: 1,
                overflow: 'auto',
                position: 'relative',
                '&::-webkit-scrollbar': { width: 8 },
                '&::-webkit-scrollbar-track': { backgroundColor: theme.palette.background.default },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.divider,
                    borderRadius: 1,
                    '&:hover': { backgroundColor: theme.palette.action.hover }
                }
            }}>
                <Box sx={{ p: 3 }}>
                    <Paper
                        elevation={3}
                        sx={{
                            px: 3,
                            py: 2,
                            mb: 3,
                            borderRadius: 1,
                            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover}20 100%)`,
                            border: `1px solid ${theme.palette.divider}`,
                            '&:hover': {
                                boxShadow: theme.shadows[8]
                            }
                        }}
                    >
                        {/* Image Upload Section */}
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Palette color="primary" />
                                <Typography variant="h6" fontWeight={600}>
                                    Group Image
                                </Typography>
                            </Box>

                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                style={{ display: 'none' }}
                                ref={accountingGroupfileInputRef}
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
                                    borderRadius: 1,
                                    py: 2,
                                    position: 'relative',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: isDragActive ? `${theme.palette.primary.main}10` : 'transparent',
                                    minHeight: 200,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main,
                                        backgroundColor: `${theme.palette.primary.main}05`,
                                    },
                                }}
                            >
                                {imagePreview ? (
                                    <Box sx={{ position: 'relative' }}>
                                        <img
                                            src={imagePreview}
                                            alt="Category Preview"
                                            style={{
                                                maxWidth: 150,
                                                maxHeight: 150,
                                                borderRadius: 1,
                                                boxShadow: theme.shadows[4],
                                                objectFit: 'cover'
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
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.error.dark,
                                                        transform: 'scale(1.1)',
                                                    },
                                                    boxShadow: theme.shadows[4]
                                                }}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        {uploadProgress > 0 && uploadProgress < 100 && (
                                            <LinearProgress
                                                variant="determinate"
                                                value={uploadProgress}
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: -8,
                                                    left: 0,
                                                    right: 0,
                                                    borderRadius: 1
                                                }}
                                            />
                                        )}
                                    </Box>
                                ) : (
                                    <Box>
                                        <CloudUpload
                                            sx={{
                                                fontSize: 36,
                                                color: theme.palette.primary.main,
                                                mb: 1
                                            }}
                                        />
                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                            Upload Group Image
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Drag & drop your image here, or click to browse
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                                            <Chip label="PNG" size="small" variant="outlined" />
                                            <Chip label="JPEG" size="small" variant="outlined" />
                                            <Chip label="JPG" size="small" variant="outlined" />
                                            <Chip label="WebP" size="small" variant="outlined" />
                                        </Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                            Max 5MB • Recommended 1:1 ratio
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* Form Fields */}
                        <Stack spacing={2}>
                            {/* Group Name */}
                            <FormControl fullWidth>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <CategoryIcon color="primary" fontSize="small" />
                                    <Typography variant="body1" fontWeight={600}>
                                        Group Name *
                                    </Typography>
                                </Box>
                                <TextField
                                    fullWidth
                                    placeholder="Enter group name"
                                    value={data.accounting_group_name}
                                    onChange={(e) => handleInputChange('accounting_group_name', e.target.value)}
                                    error={!!formErrors.accounting_group_name}
                                    helperText={formErrors.accounting_group_name}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: theme.shadows[2]
                                            },
                                            '&.Mui-focused': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: theme.shadows[4]
                                            }
                                        }
                                    }}
                                />
                            </FormControl>

                            {/* Under Group */}
                            <FormControl fullWidth>
                                <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
                                    Parent Group
                                </Typography>
                                <Autocomplete
                                    options={accountingGroupOptions || []}
                                    freeSolo
                                    value={selectedParentOption}
                                    onChange={handleParentChange}
                                    getOptionLabel={(option) =>
                                        typeof option === 'string' ? option : option.label
                                    }
                                    renderOption={(props, option) => (
                                        <Box
                                            component="li"
                                            {...props}
                                            sx={{
                                                fontWeight: 400,
                                                color: 'inherit',
                                                borderTop: 'none',
                                                '&:hover': {
                                                    backgroundColor: alpha(theme.palette.action.hover, 0.1)
                                                }
                                            }}
                                        >
                                            {option.label}
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Enter parent group"
                                            variant="outlined"
                                            required
                                            fullWidth
                                            helperText={formErrors.parent || "Select a parent group if applicable"}
                                            error={!!formErrors.parent}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 1,
                                                    '&:hover fieldset': {
                                                        borderColor: theme.palette.primary.main,
                                                        borderWidth: 2
                                                    }
                                                }
                                            }}
                                        />
                                    )}
                                    sx={{ minWidth: 250 }}
                                />
                            </FormControl>

                            {/* Description */}
                            <FormControl fullWidth>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <DescriptionIcon color="primary" fontSize="small" />
                                    <Typography variant="body1" fontWeight={600}>
                                        Description
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        ({data.description.length}/500)
                                    </Typography>
                                </Box>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    placeholder="Describe your group..."
                                    value={data.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    error={!!formErrors.description}
                                    helperText={formErrors.description}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: theme.shadows[2]
                                            }
                                        }
                                    }}
                                />
                            </FormControl>


                        </Stack>
                    </Paper>
                </Box>
            </Box>

            {/* Footer */}
            <Box sx={{
                p: 3,
                borderTop: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover}20 100%)`,
                backdropFilter: 'blur(20px)',
            }}>
                <Stack
                    direction={isMobile ? "column" : "row"}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Stack direction={isMobile ? "column" : "row"} spacing={2} sx={{ width: isMobile ? '100%' : 'auto' }}>
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
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme.shadows[4]
                                }
                            }}
                        >
                            Reset Form
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={isLoading ? <Timeline className="animate-spin" /> : <AddCircleOutlineIcon />}
                            onClick={handleSubmit}
                            disabled={isLoading || !data.accounting_group_name.trim()}
                            fullWidth={isMobile}
                            sx={{
                                textTransform: 'none',
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 700,
                                borderRadius: 1,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                boxShadow: theme.shadows[6],
                                '&:hover': {
                                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                                    transform: 'translateY(-3px)',
                                    boxShadow: theme.shadows[12],
                                },
                                '&:disabled': {
                                    background: theme.palette.action.disabledBackground,
                                    color: theme.palette.action.disabled,
                                    transform: 'none',
                                    boxShadow: 'none'
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                minWidth: 200
                            }}
                        >
                            {isLoading
                                ? (accountingGroup ? 'Updating Group...' : 'Creating Group...')
                                : (accountingGroup ? 'Update Group' : 'Create Group')
                            }
                        </Button>
                    </Stack>

                    {!isMobile && data.accounting_group_name.trim() && (
                        <Zoom appear in timeout={300}>
                            <Chip
                                icon={<CheckCircle />}
                                label="Ready to submit"
                                color="success"
                                variant="outlined"
                                sx={{ fontWeight: 600 }}
                            />
                        </Zoom>
                    )}
                </Stack>
            </Box>
        </Drawer>
    );
};

export default CreateCustomerGroupModal;