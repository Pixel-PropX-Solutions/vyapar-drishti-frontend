import React from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Typography,
    Stack,
    InputAdornment,
    Divider,
    Alert,
    alpha,
    useTheme
} from '@mui/material';
import {
    Inventory as InventoryIcon,
    AttachMoney as MoneyIcon,
    Calculate as CalculateIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { FormCreateProduct } from '@/utils/types';

interface OpeningStockSectionProps {
    data: FormCreateProduct;
    handleChange: (field: keyof FormCreateProduct, value: string | boolean) => void;
    validationErrors: Record<string, string>;
    theme: any;
    calculateStockValue: () => number;
}

const OpeningStockSection: React.FC<OpeningStockSectionProps> = ({
    data,
    handleChange,
    validationErrors,
    calculateStockValue
}) => {
    const theme = useTheme();

    const handleNumberChange = (field: keyof FormCreateProduct) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        // Allow empty string or valid numbers (including decimals)
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            handleChange(field, value === '' ? '' : (parseFloat(value).toString() || '0'));
        }
    };

    const stockValue = calculateStockValue();

    return (
        <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
                {/* Section Header */}
                <Box>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                        <Box sx={{
                            p: 1.5,
                            borderRadius: 1,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <InventoryIcon />
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                Opening Stock & Pricing
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Set initial inventory levels and pricing information
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                {/* Info Alert */}
                <Alert
                    severity="info"
                    sx={{
                        borderRadius: 1,
                        backgroundColor: alpha(theme.palette.info.main, 0.1),
                        border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                    }}
                >
                    <Typography variant="body2">
                        Opening stock details are optional but help in better inventory management.
                        The opening value will be automatically calculated based on quantity and rate.
                    </Typography>
                </Alert>

                {/* Stock Details Card */}
                <Card sx={{
                    borderRadius: 1,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
                    border: `1px solid ${theme.palette.divider}`,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.action.hover, 0.2)} 100%)`,
                    backdropFilter: 'blur(10px)'
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Stack spacing={3}>
                            {/* Opening Stock Quantity */}
                            <Box>
                                <Typography variant="subtitle1" sx={{
                                    fontWeight: 600,
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <InventoryIcon fontSize="small" color="primary" />
                                    Opening Stock Quantity
                                </Typography>

                                <TextField
                                    fullWidth
                                    label="Opening Balance"
                                    placeholder="Enter opening stock quantity"
                                    value={data.opening_balance || ''}
                                    onChange={handleNumberChange('opening_balance')}
                                    type="text"
                                    inputMode="decimal"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <InventoryIcon color="action" fontSize="small" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: data.unit && (
                                            <InputAdornment position="end">
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                    {data._unit || data.unit}
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
                            </Box>

                            {/* Opening Stock Rate */}
                            <Box>
                                <Typography variant="subtitle1" sx={{
                                    fontWeight: 600,
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <MoneyIcon fontSize="small" color="primary" />
                                    Opening Stock Rate
                                </Typography>

                                <TextField
                                    fullWidth
                                    label="Opening Rate"
                                    placeholder="Enter cost per unit"
                                    value={data.opening_rate || ''}
                                    onChange={handleNumberChange('opening_rate')}
                                    type="text"
                                    inputMode="decimal"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MoneyIcon color="action" fontSize="small" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                    per {data._unit || data.unit || 'unit'}
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
                            </Box>

                            {/* Calculated Value Display */}
                            {((data?.opening_balance ?? 0) > 0 || (data?.opening_rate ?? 0) > 0) && (
                                <>
                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{
                                        p: 3,
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
                                                    <CalculateIcon fontSize="small" />
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                        Opening Stock Value
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Quantity × Rate = Total Value
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="h5" sx={{
                                                    fontWeight: 700,
                                                    color: theme.palette.success.main,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5
                                                }}>
                                                    <TrendingUpIcon fontSize="small" />
                                                    ₹{stockValue.toLocaleString('en-IN', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {data.opening_balance || 0} × ₹{data.opening_rate || 0}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </>
                            )}

                            {/* Low Stock Alert */}
                            <Box>
                                <Typography variant="subtitle1" sx={{
                                    fontWeight: 600,
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <TrendingUpIcon fontSize="small" color="warning" />
                                    Low Stock Alert Level
                                </Typography>

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
                                                <TrendingUpIcon color="action" fontSize="small" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: data.unit && (
                                            <InputAdornment position="end">
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                    {data._unit || data.unit}
                                                </Typography>
                                            </InputAdornment>
                                        )
                                    }}
                                    error={!!validationErrors.low_stock_alert}
                                    helperText={validationErrors.low_stock_alert || 'Get notified when stock falls below this level'}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                            backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                            '&:hover': {
                                                backgroundColor: theme.palette.background.paper,
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: theme.palette.background.paper,
                                                boxShadow: `0 0 0 3px ${alpha(theme.palette.warning.main, 0.1)}`
                                            }
                                        }
                                    }}
                                />
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
};

export default OpeningStockSection;