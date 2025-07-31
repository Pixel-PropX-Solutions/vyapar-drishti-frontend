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
    InputAdornment,
    Theme,
    Divider
} from '@mui/material';
import {
    Calculate,
    Category as CategoryIcon,
    Info as InfoIcon,
    Inventory,
    Label as LabelIcon,
    Money,
    ProductionQuantityLimitsOutlined,
} from '@mui/icons-material';
import { CategoryLists, FormCreateProduct, InventoryGroupList } from '@/utils/types';
import { units } from '@/internals/data/units';

interface AdditionalInfoSectionProps {
    data: FormCreateProduct;
    handleChange: (field: keyof FormCreateProduct, value: string | boolean | number) => void;
    validationErrors: Record<string, string>;
    theme: Theme;
    categoryLists: CategoryLists[];
    inventoryGroupLists: InventoryGroupList[];
    selectedCategoryOption: { label: string; value: string; id: string; } | null;
    selectedGroupOption: { label: string; value: string; id: string; } | null;
    setSelectedCategoryOption: React.Dispatch<React.SetStateAction<{ label: string; value: string; id: string; } | null>>;
    setSelectedGroupOption: React.Dispatch<React.SetStateAction<{ label: string; value: string; id: string; } | null>>;
    setOpenCategoryModal: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenGroupModal: React.Dispatch<React.SetStateAction<boolean>>;
    calculateStockValue: () => number;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
    data,
    handleChange,
    validationErrors,
    theme,
    categoryLists,
    inventoryGroupLists,
    selectedCategoryOption,
    setSelectedCategoryOption,
    selectedGroupOption,
    setSelectedGroupOption,
    setOpenGroupModal,
    setOpenCategoryModal,
    calculateStockValue
}) => {
    const categoryOptions = categoryLists?.map(cat => ({
        id: cat._id,
        label: cat.category_name,
        value: cat.category_name
    })) || [];


    const inventoryGroupOptions = inventoryGroupLists?.map(invGroup => ({
        id: invGroup._id,
        label: invGroup.inventory_group_name,
        value: invGroup.inventory_group_name
    })) || [];

    const handleCategoryChange = (_: React.SyntheticEvent, newValue: { label: string; value: string; id: string; } | null) => {
        if (newValue?.value === '__add_new__') {
            setOpenCategoryModal(true);
            return;
        }

        setSelectedCategoryOption(newValue);
        handleChange('category', newValue?.value || '');
        handleChange('category_id', newValue?.id || '');
    };


    const handleNumberChange = (field: keyof FormCreateProduct) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        const unitType = units.find(unit => unit.value === data?.unit)?.si_representation;

        let quantity = value;
        if (unitType === 'integer') {
            // Only allow whole numbers
            const intVal = Math.max(0, Math.floor(Number(quantity)));
            quantity = intVal.toString();
        } else if (unitType === 'decimal') {
            // Allow up to two decimals
            let floatVal = Math.max(0, parseFloat(quantity));
            floatVal = Math.round(floatVal * 100) / 100;
            quantity = floatVal.toFixed(2);
        }
        handleChange(field, Number(quantity));
    };


    const handleGroupChange = (_: React.SyntheticEvent, newValue: { label: string; value: string; id: string; } | null) => {
        if (newValue?.value === '__add_new__') {
            setOpenGroupModal(true);
            return;
        }

        setSelectedGroupOption(newValue);
        handleChange('group', newValue?.value || '');
        handleChange('group_id', newValue?.id || '');
    };

    const stockValue = calculateStockValue();

    return (
        <Box sx={{ px: 4, py: 4 }}>
            <Typography
                variant="h6"
                sx={{
                    mb: 1,
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
                sx={{ mb: 2 }}
            >
                Provide additional details to better organize and categorize your product. All fields in this section are optional.
            </Typography>

            <Stack>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                    {/* Category & Group Card */}
                    <Card sx={{
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                        width: '50%',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                        boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`
                    }}>
                        <CardContent sx={{ p: 1 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CategoryIcon color="primary" />
                                Organization & Classification
                            </Typography>

                            <Stack spacing={1}>
                                <Autocomplete
                                    options={[...categoryOptions, { label: '+ Add New Category', value: '__add_new__', id: '__add_new__' }]}
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
                                                }
                                            }}
                                        />
                                    )}
                                />

                                <Autocomplete
                                    options={[...inventoryGroupOptions, { label: '+ Add New Group', value: '__add_new__', id: '__add_new__' }]}
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
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                        width: '50%',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                        boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`
                    }}>
                        <CardContent sx={{ p: 1 }}>
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LabelIcon color="primary" />
                                Additional Details
                            </Typography>


                            <TextField
                                label="Alternate Name"
                                placeholder="e.g. PROD-1234"
                                variant="outlined"
                                fullWidth
                                value={data.alias_name}
                                onChange={(e) => handleChange('alias_name', e.target.value)}
                                helperText="Optional alias for the product, useful for internal references"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1,
                                    }
                                }}
                            />
                            <Box sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Low Stock Alert"
                                    placeholder="Enter minimum stock level"
                                    value={data.low_stock_alert || ''}
                                    onChange={handleNumberChange('low_stock_alert')}
                                    type="text"
                                    inputMode="decimal"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ProductionQuantityLimitsOutlined color="action" fontSize="small" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: data.unit && (
                                            <InputAdornment position="end">
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                    {data.unit}
                                                </Typography>
                                            </InputAdornment>
                                        )
                                    }}
                                    error={!!validationErrors.low_stock_alert}
                                    helperText={validationErrors.low_stock_alert || 'Get notified when stock falls below this level'}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                        }
                                    }}
                                />
                            </Box>

                        </CardContent>
                    </Card>
                </Box>

                {/* Stock Details Card */}
                <Card sx={{
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
                    mt: 2
                }}>
                    <CardContent sx={{ p: 1 }}>
                        <Stack spacing={1}>
                            <Box sx={{ mb: 2 }}>
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                                    <Inventory />
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                            Opening Stock & Pricing
                                        </Typography>
                                        {/* <Typography variant="body2" color="text.secondary">
                                            Set initial inventory levels and pricing information
                                        </Typography> */}
                                    </Box>
                                </Stack>
                            </Box>

                            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                {/* Opening Stock Quantity */}
                                <TextField
                                    fullWidth
                                    label=" Opening Stock Quantity"
                                    placeholder="Enter opening stock quantity"
                                    value={data.opening_balance || ''}
                                    onChange={handleNumberChange('opening_balance')}
                                    type="text"
                                    inputMode="decimal"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Inventory color="action" fontSize="small" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: data.unit && (
                                            <InputAdornment position="end">
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                    {data.unit}
                                                </Typography>
                                            </InputAdornment>
                                        )
                                    }}
                                    error={!!validationErrors.opening_balance}
                                    helperText={validationErrors.opening_balance || 'Current stock quantity in your inventory'}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                            '&:hover': {
                                                backgroundColor: theme.palette.background.paper,
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: theme.palette.background.paper,
                                                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`
                                            }
                                        }
                                    }}
                                />

                                {/* Opening Stock Rate */}
                                <TextField
                                    fullWidth
                                    label="Opening Rate"
                                    placeholder="Enter cost per unit"
                                    value={data.opening_rate || ''}
                                    onChange={handleNumberChange('opening_rate')}
                                    type="number"
                                    inputProps={{
                                        step: units.find(unit => unit.value === data.unit)?.si_representation === 'integer' ? 1 : 0.01,
                                        min: 0
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Money color="action" fontSize="small" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                    per {data.unit || 'unit'}
                                                </Typography>
                                            </InputAdornment>
                                        )
                                    }}
                                    error={!!validationErrors.opening_rate}
                                    helperText={validationErrors.opening_rate || 'Cost price per unit of this product'}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                            '&:hover': {
                                                backgroundColor: theme.palette.background.paper,
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: theme.palette.background.paper,
                                                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`
                                            }
                                        }
                                    }}
                                />
                            </Stack>


                            {/* Calculated Value Display */}
                            {((data?.opening_balance ?? 0) > 0 || (data?.opening_rate ?? 0) > 0) && (
                                <>
                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{
                                        p: 1,
                                        borderRadius: 1,
                                        background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.light, 0.05)} 100%)`,
                                        border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                                    }}>
                                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                <Box sx={{
                                                    p: 1,
                                                    borderRadius: 1.5,
                                                    backgroundColor: alpha(theme.palette.success.main, 0.2),
                                                    color: theme.palette.success.main
                                                }}>
                                                    <Calculate fontSize="small" />
                                                </Box>
                                                <Box>
                                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                        Opening Stock Value
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Quantity × Rate = Total Value
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="subtitle2" sx={{
                                                    fontWeight: 700,
                                                    color: theme.palette.success.main,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5
                                                }}>
                                                    &#8377; {stockValue.toLocaleString('en-IN', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {data.opening_balance || 0} × &#8377; {data.opening_rate || 0}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </>
                            )}

                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
};

export default AdditionalInfoSection;