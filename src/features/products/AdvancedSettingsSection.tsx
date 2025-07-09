import React from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Typography,
    Stack,
    InputAdornment,
    MenuItem,
    Alert,
    alpha,
    useTheme,
    Theme,
} from '@mui/material';
import {
    Settings as SettingsIcon,
    Receipt as ReceiptIcon,
    AccountBalance as TaxIcon,
    LocalOffer as TagIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { FormCreateProduct } from '@/utils/types';

interface AdvancedSettingsSectionProps {
    data: FormCreateProduct;
    handleChange: (field: keyof FormCreateProduct, value: string | boolean) => void;
    validationErrors: Record<string, string>;
    theme: Theme;
    showGstFields: boolean;
    isHSNRequired?: boolean;
}

const AdvancedSettingsSection: React.FC<AdvancedSettingsSectionProps> = ({
    data,
    handleChange,
    validationErrors,
    showGstFields,
    isHSNRequired = false,
}) => {
    const theme = useTheme();

    // GST Nature of Goods options
    const gstNatureOptions = [
        { value: 'Goods', label: 'Goods' },
        { value: 'Services', label: 'Services' },
        { value: 'Composite Supply', label: 'Composite Supply' },
        { value: 'Mixed Supply', label: 'Mixed Supply' }
    ];

    // GST Taxability options
    const gstTaxabilityOptions = [
        { value: 'Taxable', label: 'Taxable' },
        { value: 'Exempt', label: 'Exempt' },
        { value: 'Zero Rated', label: 'Zero Rated' },
        { value: 'Nil Rated', label: 'Nil Rated' }
    ];

    const handleSelectChange = (field: keyof FormCreateProduct) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        handleChange(field, event.target.value);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Stack spacing={1}>
                {/* Section Header */}
                <Box>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                        <SettingsIcon />
                        <Box>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                Advanced Settings
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Configure GST details and other advanced product settings
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                {/* GST Settings Card */}
                <Card sx={{
                    borderRadius: 1,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
                    border: `1px solid ${theme.palette.divider}`,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.action.hover, 0.2)} 100%)`,
                    backdropFilter: 'blur(10px)'
                }}>
                    <CardContent sx={{ p: 0 }}>
                        {/* GST Header */}
                        <Box
                            sx={{
                                p: 1,
                                borderBottom: `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Box sx={{
                                        p: 1,
                                        borderRadius: 1.5,
                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                        color: theme.palette.primary.main
                                    }}>
                                        <TaxIcon fontSize="small" />
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            GST Configuration
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Configure GST details for tax compliance
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Box>

                        {/* GST Content */}
                        <Box sx={{ p: 1 }}>
                            <Stack spacing={2}>
                                {/* HSN Code */}
                                <TextField
                                    fullWidth
                                    label="HSN/SAC Code"
                                    placeholder="Enter HSN or SAC code"
                                    value={data.gst_hsn_code || ''}
                                    onChange={(e) => handleChange('gst_hsn_code', e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ReceiptIcon color="action" fontSize="small" />
                                            </InputAdornment>
                                        )
                                    }}
                                    required={isHSNRequired}
                                    error={!!validationErrors.gst_hsn_code}
                                    helperText={validationErrors.gst_hsn_code || 'Harmonized System of Nomenclature code for goods/services'}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                        }
                                    }}
                                />

                                {showGstFields && (
                                    <>
                                        {/* Nature of Goods */}
                                        <TextField
                                            fullWidth
                                            select
                                            label="Nature of Goods/Services"
                                            value={data.gst_nature_of_goods}
                                            onChange={handleSelectChange('gst_nature_of_goods')}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 1,
                                                },
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <TagIcon color="action" fontSize="small" />
                                                    </InputAdornment>
                                                )
                                            }}
                                        >
                                            {gstNatureOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        {/* GST Taxability */}
                                        <TextField
                                            fullWidth
                                            select
                                            label="GST Taxability"
                                            value={data.gst_taxability}
                                            onChange={handleSelectChange('gst_taxability')}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 1,
                                                },
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <TaxIcon color="action" fontSize="small" />
                                                    </InputAdornment>
                                                )
                                            }}
                                        >
                                            {gstTaxabilityOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        {data.gst_taxability === "Taxable" && (
                                            <TextField
                                                fullWidth
                                                label="GST Tax Rate"
                                                placeholder="Enter GST tax rate"
                                                value={data.gst_percentage || ''}
                                                onChange={(e) => handleChange('gst_percentage', e.target.value)}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <ReceiptIcon color="action" fontSize="small" />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Typography variant="body2" color="text.secondary">
                                                                %
                                                            </Typography>
                                                        </InputAdornment>
                                                    )
                                                }}
                                                error={!!validationErrors.gst_percentage}
                                                helperText={validationErrors.gst_percentage || 'GST tax rate in percentage'}
                                                type="number"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 1,
                                                    }
                                                }}
                                            />)}
                                    </>
                                )}

                                {/* GST Info */}
                                <Alert
                                    severity="info"
                                    icon={<InfoIcon fontSize="small" />}
                                    sx={{
                                        borderRadius: 1,
                                        backgroundColor: alpha(theme.palette.info.main, 0.05),
                                        border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
                                    }}
                                >
                                    <Typography variant="body2">
                                        <strong>HSN/SAC Code:</strong> Enter the 4-8 digit code for your product.
                                        Additional GST fields will appear after entering the HSN code.
                                    </Typography>
                                </Alert>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
};

export default AdvancedSettingsSection;