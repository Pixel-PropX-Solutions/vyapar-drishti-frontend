import React from 'react';
import {
    Box,
    TextField,
    Typography,
    Stack,
    Card,
    CardContent,
    alpha,
    Autocomplete,
    Chip,
    Divider
} from '@mui/material';
import {
    Category as CategoryIcon,
    Info as InfoIcon,
    Label as LabelIcon
} from '@mui/icons-material';
import { FormCreateProduct } from '@/utils/types';

interface AdditionalInfoSectionProps {
    data: FormCreateProduct;
    handleChange: (field: keyof FormCreateProduct, value: string | boolean) => void;
    validationErrors: Record<string, string>;
    theme: any;
    categoryLists: any[];
    inventoryGroupLists: any[];
    selectedCategoryOption: { label: string; value: string } | null;
    selectedGroupOption: { label: string; value: string } | null;
    setSelectedCategoryOption: React.Dispatch<React.SetStateAction<{ label: string; value: string } | null>>;
    setSelectedGroupOption: React.Dispatch<React.SetStateAction<{ label: string; value: string } | null>>;
    setOpenCategoryModal: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenGroupModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
    data,
    handleChange,
    // validationErrors,
    theme,
    categoryLists,
    inventoryGroupLists,
    selectedCategoryOption,
    setSelectedCategoryOption,
    selectedGroupOption,
    setSelectedGroupOption,
    setOpenGroupModal,
    setOpenCategoryModal
}) => {
    const categoryOptions = categoryLists?.map(cat => ({
        id: cat._id,
        label: cat.category_name,
        value: cat.category_name
    })) || [];

    console.log("inventoryGroupLists", inventoryGroupLists);

    const inventoryGroupOptions = inventoryGroupLists?.map(invGroup => ({
        id: invGroup._id,
        label: invGroup.name,
        value: invGroup.name
    })) || [];

    const handleCategoryChange = (_: React.SyntheticEvent, newValue: { label: string; value: string } | null) => {
        if (newValue?.value === '__add_new__') {
            setOpenCategoryModal(true);
            return;
        }

        setSelectedCategoryOption(newValue);
        handleChange('category', newValue?.value || '');
        handleChange('_category', newValue?.label || '');
    };

    const handleGroupChange = (_: React.SyntheticEvent, newValue: { label: string; value: string } | null) => {
        if (newValue?.value === '__add_new__') {
            setOpenGroupModal(true);
            return;
        }

        setSelectedGroupOption(newValue);
        handleChange('group', newValue?.value || '');
        handleChange('_group', newValue?.label || '');
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
                <InfoIcon />
                Additional Information
            </Typography>

            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4 }}
            >
                Provide additional details to better organize and categorize your product. All fields in this section are optional.
            </Typography>

            <Stack spacing={4}>
                {/* Category & Group Card */}
                <Card sx={{
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CategoryIcon color="primary" />
                            Organization & Classification
                        </Typography>

                        <Stack spacing={3}>
                            <Autocomplete
                                options={[...categoryOptions, { label: '+ Add New Category', value: '__add_new__' }]}
                                value={selectedCategoryOption}
                                onChange={handleCategoryChange}
                                getOptionLabel={(option) => option.label}
                                isOptionEqualToValue={(option, value) => option.value === value.value}
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
                                        {option.label}
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Product Category"
                                        variant="outlined"
                                        fullWidth
                                        helperText="Categorize your product for better organization"
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
                            />

                            <Autocomplete
                                options={[...inventoryGroupOptions, { label: '+ Add New Group', value: '__add_new__' }]}
                                value={selectedGroupOption}
                                onChange={handleGroupChange}
                                getOptionLabel={(option) => option.label}
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
                                        {option.label}
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Product Group"
                                        variant="outlined"
                                        fullWidth
                                        helperText="Select the type/group that best describes your product"
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
                            />
                        </Stack>
                    </CardContent>
                </Card>

                {/* Product Tags & Labels */}
                <Card sx={{
                    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.action.hover, 0.3)} 100%)`,
                    backdropFilter: 'blur(10px)',
                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LabelIcon color="primary" />
                            Additional Details
                        </Typography>

                        <Stack spacing={3}>
                            <TextField
                                label="Product Code/SKU"
                                variant="outlined"
                                fullWidth
                                value={data.alias_name}
                                onChange={(e) => handleChange('alias_name', e.target.value)}
                                helperText="Unique identifier or code for your product"
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

                            <Divider sx={{ my: 2 }} />

                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    <strong>Tips for better product organization:</strong>
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    <Chip
                                        label="Use clear category names"
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            borderColor: theme.palette.primary.main,
                                            color: theme.palette.primary.main
                                        }}
                                    />
                                    <Chip
                                        label="Group similar products"
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            borderColor: theme.palette.secondary.main,
                                            color: theme.palette.secondary.main
                                        }}
                                    />
                                    <Chip
                                        label="Use meaningful SKU codes"
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            borderColor: theme.palette.success.main,
                                            color: theme.palette.success.main
                                        }}
                                    />
                                </Stack>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card sx={{
                    background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.info.light, 0.1)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            💡 <strong>Pro Tip:</strong> Organizing your products with categories and groups makes it easier to generate reports,
                            track inventory, and analyze sales patterns. You can always update these details later.
                        </Typography>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
};

export default AdditionalInfoSection;