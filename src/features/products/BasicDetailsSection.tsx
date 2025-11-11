import React from 'react';
import {
    Box,
    TextField,
    Typography,
    Stack,
    Card,
    CardContent,
    IconButton,
    Avatar,
    Tooltip,
    Zoom,
    alpha,
    Autocomplete,
    Chip,
    Theme
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon,
    Delete as DeleteIcon,
    Image as ImageIcon,
    PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import { FormCreateProduct } from '@/utils/types';
import { units } from '@/data/units';

interface BasicDetailsSectionProps {
    data: FormCreateProduct;
    handleChange: (field: keyof FormCreateProduct, value: string | boolean | number) => void;
    validationErrors: Record<string, string>;
    theme: Theme;
    selectedUnitOption: { unit_name: string; value: string; id: string; } | null;
    setSelectedUnitOption: React.Dispatch<React.SetStateAction<{ unit_name: string; value: string; id: string; } | null>>;
    imagePreview: string | null;
    setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
    handleImageChange: (file: File) => void;
    removeImage: (e: React.MouseEvent) => void;
    isDragActive: boolean;
    setIsDragActive: React.Dispatch<React.SetStateAction<boolean>>;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

const BasicDetailsSection: React.FC<BasicDetailsSectionProps> = ({
    data,
    handleChange,
    validationErrors,
    theme,
    selectedUnitOption,
    setSelectedUnitOption,
    imagePreview,
    handleImageChange,
    removeImage,
    isDragActive,
    setIsDragActive,
    fileInputRef
}) => {


    const handleUnitChange = (_: React.SyntheticEvent, newValue: { unit_name: string; value: string; id: string; } | null) => {
        if (newValue?.value === '__add_new__') {
            return;
        }

        setSelectedUnitOption(newValue);
        handleChange('unit', newValue?.value || '');
        handleChange('unit_id', newValue?.id || '');
        handleChange('low_stock_alert', '');
        handleChange('opening_balance', '');
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleImageChange(files[0]);
        }
    };

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageChange(file);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography
                variant="h5"
                sx={{
                    mb: 3,
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <PhotoCameraIcon />
                Basic Product Details
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
                {/* Product Image Upload */}
                <Card
                    sx={{
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                        border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
                        width: '50%',
                        alignSelf: 'center',
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                            Product Image
                        </Typography>

                        <Box
                            onClick={handleFileSelect}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            sx={{
                                position: 'relative',
                                minHeight: 200,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                borderRadius: 1,
                                p: 2,
                                backgroundColor: isDragActive
                                    ? alpha(theme.palette.primary.main, 0.1)
                                    : alpha(theme.palette.background.paper, 0.5),
                                border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
                            }}
                        >
                            {imagePreview ? (
                                <Box sx={{ position: 'relative', width: '100%', height: 200, p: 2 }}>
                                    <img
                                        src={imagePreview}
                                        alt="Product preview"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            borderRadius: 8
                                        }}
                                    />
                                    <Tooltip title="Remove Image" TransitionComponent={Zoom}>
                                        <IconButton
                                            onClick={removeImage}
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                backgroundColor: alpha(theme.palette.error.main, 0.9),
                                                color: 'white',
                                            }}
                                            size="small"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            ) : (
                                <Stack alignItems="center" spacing={2}>
                                    <Avatar
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            backgroundColor: theme.palette.primary.main,
                                            mb: 1
                                        }}
                                    >
                                        <CloudUploadIcon fontSize="large" />
                                    </Avatar>
                                    <Typography variant="h6" textAlign="center" sx={{ fontWeight: 600 }}>
                                        {isDragActive ? 'Drop image here' : 'Upload Product Image'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" textAlign="center">
                                        Click to browse or drag and drop your image here
                                        <br />
                                    </Typography>
                                    <Chip
                                        label="PNG, JPEG, JPG, WebP (Max 5MB)"
                                        size="small"
                                        variant="outlined"
                                        sx={{ mt: 1 }}
                                    />
                                </Stack>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </Box>
                    </CardContent>
                </Card>

                {/* Product Information */}
                <Card sx={{
                    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.action.hover, 0.3)} 100%)`,
                    width: '50%',
                    backdropFilter: 'blur(10px)',
                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`
                }}>
                    <CardContent sx={{ p: 1 }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ImageIcon color="primary" />
                            Product Information
                        </Typography>

                        <Stack spacing={3}>
                            <TextField
                                label="Product Name"
                                variant="outlined"
                                fullWidth
                                required
                                value={data.stock_item_name}
                                onChange={(e) => handleChange('stock_item_name', e.target.value)}
                                error={!!validationErrors.product_name}
                                helperText={validationErrors.product_name}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1,
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.primary.main,
                                            borderWidth: 2
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderWidth: 2
                                        }
                                    }
                                }}
                            />
                            <Autocomplete
                                options={units}
                                value={selectedUnitOption}
                                onChange={handleUnitChange}
                                getOptionLabel={(option) => option.unit_name}
                                renderOption={(props, option) => (
                                    <Box
                                        component="li"
                                        {...props}
                                        sx={{
                                            fontWeight: option.value === '__add_new__' ? 600 : 400,
                                            color: option.value === '__add_new__' ? theme.palette.primary.main : 'inherit',
                                            borderTop: option.value === '__add_new__' ? `1px solid ${theme.palette.divider}` : 'none',
                                            '&:hover': {
                                                backgroundColor: option.value === '__add_new__'
                                                    ? alpha(theme.palette.primary.main, 0.1)
                                                    : alpha(theme.palette.action.hover, 0.1)
                                            }
                                        }}
                                    >
                                        {option.unit_name}
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Unit of Measurement"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        helperText={validationErrors.selling_price || "e.g., kg, pieces, liters"}
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
                            <TextField
                                label="Description (Optional)"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={3}
                                value={data.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                helperText="Brief description of your product"
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
                        </Stack>
                    </CardContent>
                </Card>
            </Box>

        </Box>
    );
};

export default BasicDetailsSection;