import React, { useCallback, useRef, useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Switch,
    FormControlLabel,
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
import { createCategory } from "@/services/category";
import { AppDispatch } from "@/store/store";

interface CategoryCreateModalProps {
    open: boolean;
    onClose: () => void;
    onCreated?: (category: { name: string; _id?: string }) => void; // Added callback for created category
}

interface CategoryFormData {
    name: string;
    description: string;
    image: File | string;
}

const CategoryCreateModal: React.FC<CategoryCreateModalProps> = ({
    open,
    onClose,
    onCreated
}) => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const [isLoading, setIsLoading] = useState(false);
    const categoryfileInputRef = useRef<HTMLInputElement | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [data, setData] = useState<CategoryFormData>({
        name: '',
        description: '',
        image: '',
    });

    const handleInputChange = (field: keyof CategoryFormData, value: string | boolean) => {
        setData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setData(prev => ({
                ...prev,
                image: file
            }));
        }
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
        categoryfileInputRef.current?.click();
    };

    const removeImage = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setImagePreview(null);
        if (categoryfileInputRef.current) {
            categoryfileInputRef.current.value = '';
        }
    }, []);
    const handleSubmit = async () => {
        setIsLoading(true);

        const formData = new FormData;
        formData.append('category_name', data.name);
        formData.append('image', data.image);
        formData.append('description', data.description);
        await toast.promise(
            dispatch(createCategory({ categoryData: formData }))
                .unwrap()
                .then((response) => {
                    const newCategory = {
                        name: response.category_name,
                        _id: response._id
                    };
                    if (onCreated) {
                        onCreated(newCategory);
                    }
                    setData({
                        name: '',
                        description: '',
                        image: ''
                    });
                    setIsLoading(false);
                    onClose();
                }),
            {
                loading: "Creating your product...",
                success: <b>Product successfully created! 🎉</b>,
                error: <b>Failed to create product. Please try again.</b>,
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
                            Create Category
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Create a new category for your products
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
                    {isLoading ? 'Creating...' : 'Create Category'}
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center', gap: 2 }}>

                                <FormControl sx={{ width: '45%' }}>
                                    <Typography variant="body2" gutterBottom >
                                        Category Image
                                    </Typography>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        style={{ display: 'none' }}
                                        ref={categoryfileInputRef}
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
                                                        alt="Product Preview"
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
                                                        Upload Product Image
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

                                <Box sx={{ width: '45%' }}>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                        Description
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        size="small"
                                        rows={7}
                                        placeholder="Item Description"
                                        value={data.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                            }
                                        }}
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                    *Category
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Category"
                                    value={data.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        }
                                    }}
                                />
                            </Box>


                            {/* <FormControl fullWidth>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                    Show in Online Store
                                </Typography>
                                <Box sx={{
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: 1,
                                    p: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    backgroundColor: theme.palette.background.paper
                                }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            Show in Online Store
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                            Show or hide the category in catalogue/ online store
                                        </Typography>
                                    </Box>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={data.showInOnlineStore}
                                                onChange={(e) => handleInputChange('showInOnlineStore', e.target.checked)}
                                                color="error"
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                        color: '#f44336',
                                                    },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                        backgroundColor: '#f44336',
                                                    },
                                                }}
                                            />
                                        }
                                        label=""
                                        sx={{ ml: 0 }}
                                    />
                                </Box>
                            </FormControl> */}
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
                            {isLoading ? 'Creating Category...' : 'Create Category'}
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Drawer>
    );
};

export default CategoryCreateModal;