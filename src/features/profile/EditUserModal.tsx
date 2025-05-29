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
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
    Close as CloseIcon,
    Delete,
    PhotoCamera,
    Timeline,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { GetUser } from "@/utils/types";
import { updateUser } from "@/services/user";
import CountryCode from "@/common/CountryCode";


interface EditUserModalProps {
    open: boolean;
    onClose: () => void;
    // onCreated: (user: { name: string; _id: string }) => void;
    onUpdated: () => Promise<void>;
    user: GetUser | null;
}

interface UserFormData {
    name: {
        first: string;
        last?: string;
    };
    email: string;
    phone: {
        code: string;
        number: string;
    };
    image?: File | string;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
    open,
    onClose,
    onUpdated,
    user,
}) => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const [isLoading, setIsLoading] = useState(false);
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [data, setData] = useState<UserFormData>({
        name: {
            first: '',
            last: ''
        },
        email: '',
        phone: {
            code: '',
            number: ''
        },
        image: ''
    });

    const handleInputChange = (
        field:
            | keyof UserFormData
            | 'name.first'
            | 'name.last'
            | 'email'
            | 'phone.code'
            | 'phone.number',
        value: string
    ) => {
        setData(prev => {
            if (field === 'name.first' || field === 'name.last') {
                const nameField = field.split('.')[1] as 'first' | 'last';
                return {
                    ...prev,
                    name: {
                        ...prev.name,
                        [nameField]: value
                    }
                };
            }
            if (field === 'phone.code' || field === 'phone.number') {
                const phoneField = field.split('.')[1] as 'code' | 'number';
                return {
                    ...prev,
                    phone: {
                        ...prev.phone,
                        [phoneField]: value
                    }
                };
            }
            return {
                ...prev,
                [field]: value
            };
        });
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
            setData(prev => ({
                ...prev,
                image: file
            }));
        };
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
        imageInputRef.current?.click();
    };

    const removeImage = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setImagePreview(null);
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
    }, []);

    useEffect(() => {
        if (open && user) {
            setData({
                name: {
                    first: user.name.first || '',
                    last: user.name.last || ''
                },
                email: user.email || '',
                phone: {
                    code: user.phone?.code || '',
                    number: user.phone?.number || ''
                },
                // If user.image is a string, it means it's already a URL or base64 string
                image: typeof user.image === 'string' ? user.image : '',
            });

            setImagePreview(
                typeof user?.image === "string" ? user.image : null
            );
        } else if (open && !user) {
            setData({
                name: {
                    first: '',
                    last: ''
                },
                email: '',
                phone: {
                    code: '',
                    number: ''
                },
                image: ''
            });
            setImagePreview(null);
        }
    }, [open, user]);

    const handleSubmit = async () => {
        setIsLoading(true);
        const sanitizedData: any = {
            first: data.name.first.trim(),
            last: (data?.name?.last || '').trim() || '',
        };
        if (data.email && data.email !== '') sanitizedData.email = data.email.trim();

        if (data.phone && data.phone.code) {
            sanitizedData.code = data.phone.code.trim();
        }
        if (data.phone && data.phone.number) {
            sanitizedData.phone = data.phone.number.trim();
        }
        if (data.image && typeof data.image !== 'string') sanitizedData.image = data.image;

        const formData = new FormData();
        Object.entries(sanitizedData).forEach(([key, value]) => {
            if (typeof value === 'boolean') {
                formData.append(key, value ? 'true' : 'false');
            } else if (value !== undefined && value !== null) {
                if (typeof value === 'string' || value instanceof Blob) {
                    formData.append(key, value);
                } else {
                    // Skip appending if value is not string or Blob
                }
            }
        });

        await toast.promise(
            dispatch(updateUser({
                data: formData,
                id: user?._id ?? '',
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
                loading: "Updating your user...",
                success: <b>User successfully updated! 🎉</b>,
                error: <b>Failed to update user. Please try again.</b>,
            }
        );
    };

    return (
        <Drawer
            anchor="right"
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 600, md: 700 },
                    backgroundColor: theme.palette.background.default,
                    backgroundImage: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
                }
            }}
            sx={{
                '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(4px)',
                }
            }}
            open={open}
            onClose={onClose}
        >
            <Box sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `1px solid ${theme.palette.divider}`,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.light}10 100%)`,
                backdropFilter: 'blur(10px)',
            }}>
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
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                    <Box>
                        <Typography variant="inherit" fontWeight={600}>
                            Edit Basic Details
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Update the basic details about you
                        </Typography>
                    </Box>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleSubmit}
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
                    {isLoading ? ('Updating...') : ('Update Details')}
                </Button>
            </Box>
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
                    backgroundColor: theme.palette.divider,
                    borderRadius: 4,
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    }
                }
            }}>
                <Box sx={{ mb: 1, p: 3 }}>
                    <Grow in timeout={400}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                mb: 2,
                                borderRadius: 2,
                                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                                border: `1px solid ${theme.palette.divider}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme.shadows[4]
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, alignItems: 'center', gap: 2 }}>

                                <FormControl sx={{ width: '45%' }}>
                                    <Typography variant="h6" align="center" gutterBottom >
                                        Profile Image
                                    </Typography>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        style={{ display: 'none' }}
                                        ref={imageInputRef}
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
                                            p: 2,
                                            position: 'relative',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            backgroundColor: isDragActive ? theme.palette.action.hover : 'transparent',
                                            '&:hover': {
                                                borderColor: theme.palette.primary.main,
                                                backgroundColor: theme.palette.action.hover,
                                                transform: 'scale(1.02)'
                                            },
                                        }}
                                    >
                                        {imagePreview ? (
                                            <Fade in timeout={300}>
                                                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                                    <img
                                                        src={imagePreview}
                                                        alt="Image Preview"
                                                        style={{
                                                            maxWidth: 150,
                                                            maxHeight: 150,
                                                            borderRadius: 8,
                                                            boxShadow: theme.shadows[2]
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
                                                                },
                                                                width: 24,
                                                                height: 24
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
                                                    <PhotoCamera
                                                        sx={{
                                                            fontSize: 32,
                                                            color: theme.palette.primary.main,
                                                        }}
                                                    />
                                                    <Typography variant="body2" sx={{ fontWeight: 600, }}>
                                                        Upload Profile Image
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" >
                                                        Drag & drop or click to browse.
                                                    </Typography>
                                                    <br />
                                                    <Typography variant="caption" color="text.secondary">
                                                        Supports PNG, JPEG, JPG, WebP <br /> Max 5MB • Recommended 1:1 ratio
                                                    </Typography>
                                                </Box>
                                            </Fade>
                                        )}
                                    </Box>
                                </FormControl>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center', gap: 2 }}>

                                <Box sx={{ width: '45%' }}>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                        First Name <Typography variant="caption" color="text.secondary">(Required)</Typography>
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="First Name"
                                        value={data.name.first}
                                        onChange={(e) => handleInputChange('name.first', e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                            }
                                        }}
                                    />
                                </Box>
                                <Box sx={{ width: '45%' }}>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                        Last Name
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Last Name"
                                        value={data.name.last}
                                        onChange={(e) => handleInputChange('name.last', e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                            }
                                        }}
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                    E-mail <Typography variant="caption" color="text.secondary">(Required)</Typography>
                                </Typography>
                                <TextField
                                    fullWidth
                                    required
                                    size="small"
                                    placeholder="Enter your email"
                                    value={data.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                        }
                                    }}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center', gap: 2 }}>

                                <Box sx={{ width: '20%' }}>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                        Country Code
                                    </Typography>
                                    <CountryCode
                                        fieldName="phone.code"
                                        handleInputChange={handleInputChange as (field: string, value: string) => void}
                                        value={data?.phone?.code}
                                        isLabelled={false}
                                        isHelperText={false}
                                    />
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                        Phone Number
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Enter your phone number"
                                        value={data.phone.number}
                                        onChange={(e) => handleInputChange('phone.number', e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1,
                                            }
                                        }}
                                    />
                                </Box>
                            </Box>

                        </Paper>
                    </Grow>
                </Box>
            </Box>

            <Box sx={{
                p: 3,
                borderTop: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
            }}>
                <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            // onClick={resetForm}
                            // disabled={isLoading}
                            sx={{
                                textTransform: 'none',
                                borderRadius: 2,
                                px: 3
                            }}
                        >
                            Reset Form
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={isLoading ? <Timeline className="animate-spin" /> : <AddCircleOutlineIcon />}
                            onClick={handleSubmit}
                            sx={{
                                textTransform: 'none',
                                px: 4,
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
                            {isLoading ? 'Updating Details...' : 'Update Details'}
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Drawer>
    );
};

export default EditUserModal;