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
    Stack,
    Chip,
    InputAdornment,
    CircularProgress,
    Fade,
    Zoom,
    alpha,
    useMediaQuery,
    LinearProgress,
    Avatar,
} from "@mui/material";
import {
    Close as CloseIcon,
    Group,
    Description,
    AccountTree,
    Save,
    Close,
    Delete,
    CloudUpload,
    PhotoCamera,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { GetGroup } from "@/utils/types";
import { createCompanyBilling, updateCompanyBilling } from "@/services/company";

interface CustomerGroupEditingModalProps {
    open: boolean;
    onClose: () => void;
    onUpdated?: () => Promise<void>;
    onCreated: (group: { name: string; _id: string, user_id: string, parent: string }) => void;
    group: GetGroup | null;
}

const CustomerGroupEditingModal: React.FC<CustomerGroupEditingModalProps> = ({
    open,
    onClose,
    onUpdated,
    onCreated,
    group,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { user, currentCompany } = useSelector(
        (state: RootState) => state.auth
    );
    const dispatch = useDispatch<AppDispatch>();
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const groupImageRef = useRef<HTMLInputElement | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [focusedField, setFocusedField] = useState<string>("");

    const [data, setData] = useState<Partial<GetGroup>>({
        name: "",
        description: "",
        image: "",
        parent: "",
        // primary_group: "",
        _id: "",
        user_id: "",
        company_id: "",
        is_deleted: false,
    });

    // Validation function
    const validateForm = (formData = data) => {
        const errors: Record<string, string> = {};
        if (!formData.name?.trim()) {
            errors.name = "Group name is required";
        }
        if (!formData.parent?.trim()) {
            errors.parent = "Parent group is required";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field: keyof GetGroup, value: string) => {
        setData((prev) => {
            const newData = { ...prev, [field]: value };
            validateForm(newData);
            return newData;
        });
    };
    // Enhanced image handling with better UX
    const handleImageChange = useCallback((file: File) => {
        if (!file) return;

        const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        if (!validTypes.includes(file.type)) {
            toast.error("Only PNG, JPEG, JPG, or WebP images are allowed.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB.");
            return;
        }

        setData((prev) => ({
            ...prev,
            image: file,
        }));

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setImagePreview(result);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragActive(false);

            const file = e.dataTransfer.files?.[0];
            if (file) {
                handleImageChange(file);
            }
        },
        [handleImageChange]
    );

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
        groupImageRef.current?.click();
    };

    const removeImage = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setImagePreview(null);
        setData((prev) => ({
            ...prev,
            image: "",
        }));
        if (groupImageRef.current) {
            groupImageRef.current.value = "";
        }
    }, []);

    const resetForm = () => {
        setData({
            name: "",
            description: "",
            image: "",
            parent: "",
            // primary_group: "",
            _id: "",
            user_id: "",
            company_id: "",
            is_deleted: false,
        });
        setFormErrors({});
    };

    useEffect(() => {
        if (open && group) {
            setData({
                _id: group._id || "",
                company_id: currentCompany?._id || "",
                name: group.name || "",
                description: group.description || "",
                user_id: user?._id || "",
                image: group.image || "",
                parent: group.parent || "",
                // primary_group: group.primary_group || "",
                is_deleted: group.is_deleted || false,
            });
            setFormErrors({});
        } else if (open && !group) {
            resetForm();
        }
    }, [open, user?._id, group, currentCompany?._id]);

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("Please fix the form errors before submitting");
            return;
        }

        setIsLoading(true);
        const sanitizedData: any = {
            name: data.name?.trim(),
            user_id: user?._id,
            company_id: currentCompany?._id,
            parent: data.parent?.trim(),
        };

        if (data.description?.trim())
            sanitizedData.description = data.description.trim();
        // if (data.parent?.trim()) sanitizedData.parent = data.parent.trim();
        if (data.image && typeof data.image !== 'string') sanitizedData.image = data.image;

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

        try {
            if (group === null) {
                dispatch(createCompanyBilling({ data: formData })).unwrap().then((response) => {
                    const newGroup = {
                        name: response.inventory_group_name,
                        _id: response._id,
                        user_id: user?._id || "",
                        parent: response.parent || "",
                    };
                    onClose();
                    resetForm();
                    if (onCreated)
                        onCreated(newGroup);
                    toast.success(`Group ${group === null ? "created" : "updated"} successfully! 🎉`);
                    setIsLoading(false);
                }).catch((error) => {
                    setIsLoading(false);
                    toast.error(error || `Failed to ${group === null ? "create" : "update"} group. 🚫`);
                });
            }
            else {
                dispatch(
                    updateCompanyBilling({ data: formData, id: group._id ?? "" })
                ).unwrap()
                .then(() => {
                    setIsLoading(false);
                    resetForm();
                    onClose();
                    if (onUpdated) onUpdated();
                    toast.success(`Group ${group === null ? "created" : "updated"} successfully! 🎉`);
                })
                .catch((error) => {
                    setIsLoading(false);
                    toast.error(error || `Failed to ${group === null ? "create" : "update"} group. 🚫`);
                });
            }
        } catch {
            // Error handled by toast
        } finally {
            setIsLoading(false);
        }
    };

    const requiredFields = ["name", "parent"];
    const optionalFields = ["description", "image"];
    const filledFields = [
        ...requiredFields.filter(
            (field) => !!data[field as keyof GetGroup]?.toString().trim()
        ),
        ...optionalFields.filter(
            (field) => !!data[field as keyof GetGroup]?.toString().trim()
        ),
    ].length;
    const completionPercentage = Math.round(
        (filledFields / (requiredFields.length + optionalFields.length)) * 100
    );

    const formFields = [
        {
            key: "name",
            label: "Group Name",
            placeholder: "Enter group name",
            icon: Group,
            required: true,
            description: "Unique name for the customer group",
        },
        {
            key: "description",
            label: "Description",
            placeholder: "Describe the group",
            icon: Description,
            required: false,
            description: "Brief description of the group (optional)",
        },
        {
            key: "parent",
            label: "Parent Group",
            placeholder: "Enter parent group",
            icon: AccountTree,
            required: true,
            description: "Parent group for hierarchy",
        },
    ];

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: { xs: "100%", sm: "min(90vw, 600px)" },
                    background: `linear-gradient(135deg, ${theme.palette.background.paper
                        } 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
                },
            }}
            sx={{
                "& .MuiBackdrop-root": {
                    backgroundColor: alpha(theme.palette.common.black, 0.6),
                    backdropFilter: "blur(4px)",
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    p: { xs: 2, sm: 3 },
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                    background: `linear-gradient(90deg, ${alpha(
                        theme.palette.primary.main,
                        0.08
                    )} 0%, ${alpha(theme.palette.secondary.main, 0.06)} 100%)`,
                    position: "sticky",
                    top: 0,
                    zIndex: 1000,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Tooltip title="Close" placement="top">
                            <IconButton
                                onClick={onClose}
                                sx={{
                                    bgcolor: alpha(theme.palette.background.paper, 0.9),
                                    "&:hover": {
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        transform: "rotate(90deg)",
                                    },
                                    transition: "all 0.3s ease",
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                        <Fade in={open} timeout={600}>
                            <Typography
                                variant={isMobile ? "h6" : "h5"}
                                sx={{
                                    fontWeight: 700,
                                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                {group === null ? "Create Group" : "Edit Group"}
                            </Typography>
                        </Fade>
                    </Box>
                    <Zoom in={open} timeout={800}>
                        <Chip
                            label={
                                completionPercentage === 100
                                    ? "Ready"
                                    : `${completionPercentage}% Complete`
                            }
                            color={completionPercentage === 100 ? "success" : "primary"}
                            size="small"
                            sx={{
                                fontWeight: 500,
                                bgcolor: alpha(
                                    theme.palette[
                                        completionPercentage === 100 ? "success" : "primary"
                                    ].main,
                                    0.1
                                ),
                            }}
                        />
                    </Zoom>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={completionPercentage}
                    sx={{
                        mt: 1,
                        height: 3,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        "& .MuiLinearProgress-bar": {
                            bgcolor: theme.palette.primary.main,
                        },
                    }}
                />
            </Box>

            {/* Content */}
            <Box
                sx={{
                    p: { xs: 2, sm: 3 },
                    flex: 1,
                    overflowY: "auto",
                    "&::-webkit-scrollbar": {
                        width: 6,
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: alpha(theme.palette.primary.main, 0.4),
                        borderRadius: 3,
                    },
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, sm: 3 },
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.background.paper, 0.95),
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        transition: "transform 0.3s ease",
                        "&:hover": {
                            transform: "translateY(-2px)",
                        },
                    }}
                >
                    <Stack spacing={3}>
                        <Typography
                            variant="h6"
                            sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
                        >
                            <PhotoCamera color="primary" />
                            Group Image
                            <Chip
                                label="Optional"
                                size="small"
                                color="default"
                                variant="outlined"
                            />
                        </Typography>

                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            style={{ display: "none" }}
                            ref={groupImageRef}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageChange(file);
                            }}
                        />

                        <Box
                            onClick={handleBoxClick}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            sx={{
                                border: `2px dashed ${isDragActive
                                    ? theme.palette.primary.main
                                    : theme.palette.divider
                                    }`,
                                borderRadius: 1,
                                p: 1,
                                position: "relative",
                                textAlign: "center",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                backgroundColor: isDragActive
                                    ? theme.palette.primary.main + "10"
                                    : "transparent",
                                minHeight: 200,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                "&:hover": {
                                    borderColor: theme.palette.primary.main,
                                    backgroundColor: theme.palette.primary.main + "05",
                                    transform: "scale(1.01)",
                                },
                            }}
                        >
                            {imagePreview ? (
                                <Box sx={{ position: "relative", display: "inline-block" }}>
                                    <Avatar
                                        src={imagePreview}
                                        alt="Profile Preview"
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            border: `3px solid ${theme.palette.primary.main}`,
                                            boxShadow: theme.shadows[4],
                                            transition: "all 0.3s ease",
                                            objectFit: "contiain",
                                        }}
                                    />
                                    <Tooltip title="Remove image">
                                        <IconButton
                                            onClick={removeImage}
                                            sx={{
                                                position: "absolute",
                                                top: -8,
                                                right: -8,
                                                backgroundColor: theme.palette.error.main,
                                                color: "white",
                                                "&:hover": {
                                                    backgroundColor: theme.palette.error.dark,
                                                    transform: "scale(1.1)",
                                                },
                                                width: 32,
                                                height: 32,
                                                transition: "all 0.2s ease",
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
                                            mb: 2,
                                        }}
                                    />
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                        Upload Profile Image
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 2 }}
                                    >
                                        Drag & drop your image here, or click to browse
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Supports PNG, JPEG, JPG, WebP • Max 5MB • Recommended 1:1
                                        ratio
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                        {formFields.map((field, index) => (
                            <TextField
                                key={index}
                                fullWidth
                                label={field.label}
                                placeholder={field.placeholder}
                                value={data[field.key as keyof GetGroup] || ""}
                                onChange={(e) =>
                                    handleInputChange(
                                        field.key as keyof GetGroup,
                                        e.target.value
                                    )
                                }
                                error={!!formErrors[field.key]}
                                helperText={formErrors[field.key] || field.description}
                                required={field.required}
                                onFocus={() => setFocusedField(field.key)}
                                onBlur={() => setFocusedField("")}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <field.icon
                                                color={
                                                    formErrors[field.key]
                                                        ? "error"
                                                        : focusedField === field.key
                                                            ? "primary"
                                                            : "action"
                                                }
                                                sx={{ fontSize: 20 }}
                                            />
                                        </InputAdornment>
                                    ),
                                    endAdornment: field.required && (
                                        <InputAdornment position="end">
                                            <Chip
                                                label="Required"
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                sx={{ height: 20, fontSize: "0.7rem" }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 1,
                                        bgcolor:
                                            focusedField === field.key
                                                ? alpha(theme.palette.primary.main, 0.05)
                                                : "inherit",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            boxShadow: `0 2px 8px ${alpha(
                                                theme.palette.primary.main,
                                                0.1
                                            )}`,
                                        },
                                        "&.Mui-focused": {
                                            boxShadow: `0 4px 12px ${alpha(
                                                theme.palette.primary.main,
                                                0.2
                                            )}`,
                                        },
                                    },
                                    "& .MuiFormHelperText-root": {
                                        fontSize: "0.8rem",
                                        color: formErrors[field.key]
                                            ? "error.main"
                                            : "text.secondary",
                                    },
                                }}
                            />
                        ))}
                    </Stack>

                    <Box
                        sx={{
                            mt: 4,
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2,
                        }}
                    >
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={onClose}
                            startIcon={<Close />}
                            sx={{
                                borderRadius: 1,
                                textTransform: "none",
                                fontWeight: 500,
                                px: 3,
                                "&:hover": {
                                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                                    transform: "translateY(-1px)",
                                },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={Object.keys(formErrors).length > 0 || isLoading}
                            startIcon={
                                isLoading ? (
                                    <CircularProgress size={16} color="inherit" />
                                ) : (
                                    <Save />
                                )
                            }
                            sx={{
                                borderRadius: 1,
                                textTransform: "none",
                                fontWeight: 500,
                                px: 3,
                                bgcolor: theme.palette.primary.main,
                                "&:hover": {
                                    bgcolor: theme.palette.primary.dark,
                                    transform: "translateY(-1px)",
                                },
                                "&:disabled": {
                                    bgcolor: alpha(theme.palette.action.disabled, 0.3),
                                },
                            }}
                        >
                            {isLoading
                                ? "Saving..."
                                : group === null
                                    ? "Create Group"
                                    : "Update Group"}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Drawer>
    );
};

export default CustomerGroupEditingModal;
