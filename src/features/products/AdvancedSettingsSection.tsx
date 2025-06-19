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
    FormControl,
    InputLabel,
    Select,
    Switch,
    FormControlLabel,
    Alert,
    alpha,
    useTheme,
    Chip,
    Divider,
    Collapse
} from '@mui/material';
import {
    Settings as SettingsIcon,
    Receipt as ReceiptIcon,
    AccountBalance as TaxIcon,
    LocalOffer as TagIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { FormCreateProduct } from '@/utils/types';

interface AdvancedSettingsSectionProps {
    data: FormCreateProduct;
    handleChange: (field: keyof FormCreateProduct, value: string | boolean) => void;
    validationErrors: Record<string, string>;
    theme: any;
    showGstFields: boolean;
}

const AdvancedSettingsSection: React.FC<AdvancedSettingsSectionProps> = ({
    data,
    handleChange,
    validationErrors,
    showGstFields
}) => {
    const theme = useTheme();
    const [expandedSections, setExpandedSections] = React.useState({
        gst: true,
        other: false
    });

    const toggleSection = (section: 'gst' | 'other') => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

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
        event: any
    ) => {
        handleChange(field, event.target.value);
    };

    // const handleSwitchChange = (field: keyof FormCreateProduct) => (
    //     event: React.ChangeEvent<HTMLInputElement>
    // ) => {
    //     handleChange(field, event.target.checked);
    // };

    return (
        <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
                {/* Section Header */}
                <Box>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                        <Box sx={{
                            p: 1.5,
                            borderRadius: 1,
                            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <SettingsIcon />
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                Advanced Settings
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Configure GST details and other advanced product settings
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
                        All settings in this section are optional. Configure them based on your business requirements
                        and compliance needs.
                    </Typography>
                </Alert>

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
                            onClick={() => toggleSection('gst')}
                            sx={{
                                p: 3,
                                cursor: 'pointer',
                                borderBottom: expandedSections.gst ? `1px solid ${theme.palette.divider}` : 'none',
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.action.hover, 0.5)
                                },
                                transition: 'background-color 0.2s ease'
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
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            GST Configuration
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Configure GST details for tax compliance
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    {data.gst_hsn_code && (
                                        <Chip
                                            label="HSN Configured"
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    )}
                                    {expandedSections.gst ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </Stack>
                            </Stack>
                        </Box>

                        {/* GST Content */}
                        <Collapse in={expandedSections.gst}>
                            <Box sx={{ p: 3 }}>
                                <Stack spacing={3}>
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
                                        error={!!validationErrors.gst_hsn_code}
                                        helperText={validationErrors.gst_hsn_code || 'Harmonized System of Nomenclature code for goods/services'}
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

                                    {showGstFields && (
                                        <>
                                            {/* Nature of Goods */}
                                            <FormControl fullWidth>
                                                <InputLabel>Nature of Goods/Services</InputLabel>
                                                <Select
                                                    value={data.gst_nature_of_goods || ''}
                                                    onChange={handleSelectChange('gst_nature_of_goods')}
                                                    label="Nature of Goods/Services"
                                                    startAdornment={
                                                        <InputAdornment position="start">
                                                            <TagIcon color="action" fontSize="small" />
                                                        </InputAdornment>
                                                    }
                                                    sx={{
                                                        borderRadius: 1,
                                                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                                        '&:hover': {
                                                            backgroundColor: theme.palette.background.paper,
                                                        },
                                                        '&.Mui-focused': {
                                                            backgroundColor: theme.palette.background.paper,
                                                            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`
                                                        }
                                                    }}
                                                >
                                                    {gstNatureOptions.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            {/* GST Taxability */}
                                            <FormControl fullWidth>
                                                <InputLabel>GST Taxability</InputLabel>
                                                <Select
                                                    value={data.gst_taxability || ''}
                                                    onChange={handleSelectChange('gst_taxability')}
                                                    label="GST Taxability"
                                                    startAdornment={
                                                        <InputAdornment position="start">
                                                            <TaxIcon color="action" fontSize="small" />
                                                        </InputAdornment>
                                                    }
                                                    sx={{
                                                        borderRadius: 1,
                                                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                                        '&:hover': {
                                                            backgroundColor: theme.palette.background.paper,
                                                        },
                                                        '&.Mui-focused': {
                                                            backgroundColor: theme.palette.background.paper,
                                                            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`
                                                        }
                                                    }}
                                                >
                                                    {gstTaxabilityOptions.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            {data.gst_taxability === "Taxable" && (<TextField
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
                        </Collapse>
                    </CardContent>
                </Card>

                {/* Other Settings Card */}
                <Card sx={{
                    borderRadius: 1,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
                    border: `1px solid ${theme.palette.divider}`,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.action.hover, 0.2)} 100%)`,
                    backdropFilter: 'blur(10px)'
                }}>
                    <CardContent sx={{ p: 0 }}>
                        {/* Other Settings Header */}
                        <Box
                            onClick={() => toggleSection('other')}
                            sx={{
                                p: 3,
                                cursor: 'pointer',
                                borderBottom: expandedSections.other ? `1px solid ${theme.palette.divider}` : 'none',
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.action.hover, 0.5)
                                },
                                transition: 'background-color 0.2s ease'
                            }}
                        >
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Box sx={{
                                        p: 1,
                                        borderRadius: 1.5,
                                        backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                                        color: theme.palette.secondary.main
                                    }}>
                                        <SettingsIcon fontSize="small" />
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            Other Settings
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Additional product configuration options
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    {!data.is_deleted && (
                                        <Chip
                                            label="Active"
                                            size="small"
                                            color="success"
                                            variant="outlined"
                                        />
                                    )}
                                    {expandedSections.other ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </Stack>
                            </Stack>
                        </Box>

                        {/* Other Settings Content */}
                        <Collapse in={expandedSections.other}>
                            <Box sx={{ p: 3 }}>
                                <Stack spacing={3}>
                                    {/* Product Status */}
                                    <Box sx={{
                                        p: 2,
                                        borderRadius: 1,
                                        backgroundColor: alpha(theme.palette.background.paper, 0.5),
                                        border: `1px solid ${theme.palette.divider}`
                                    }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={!data.is_deleted}
                                                    onChange={(e) => handleChange('is_deleted', !e.target.checked)}
                                                    color="success"
                                                />
                                            }
                                            label={
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                        Product Status
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {data.is_deleted ? 'Product is currently inactive' : 'Product is active and available'}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </Box>

                                    {data.is_deleted && (
                                        <Alert
                                            severity="warning"
                                            sx={{
                                                borderRadius: 1,
                                                backgroundColor: alpha(theme.palette.warning.main, 0.1),
                                                border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
                                            }}
                                        >
                                            <Typography variant="body2">
                                                <strong>Inactive Product:</strong> This product will not appear in active listings
                                                and cannot be used in new transactions.
                                            </Typography>
                                        </Alert>
                                    )}

                                    <Divider />

                                    {/* Future Settings Placeholder */}
                                    <Box sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        color: theme.palette.text.secondary
                                    }}>
                                        <SettingsIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                                        <Typography variant="body2">
                                            Additional settings and configurations will be available here in future updates.
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        </Collapse>
                    </CardContent>
                </Card>

                {/* Summary Card */}
                <Card sx={{
                    borderRadius: 1,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.success.light, 0.02)} 100%)`,
                    backdropFilter: 'blur(10px)'
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                            <Box sx={{
                                p: 1,
                                borderRadius: 1.5,
                                backgroundColor: alpha(theme.palette.success.main, 0.2),
                                color: theme.palette.success.main
                            }}>
                                <InfoIcon fontSize="small" />
                            </Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                Configuration Summary
                            </Typography>
                        </Stack>

                        <Stack spacing={2}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2" color="text.secondary">
                                    GST Configuration:
                                </Typography>
                                <Chip
                                    label={data.gst_hsn_code ? `HSN: ${data.gst_hsn_code}` : 'Not Configured'}
                                    size="small"
                                    color={data.gst_hsn_code ? 'success' : 'default'}
                                    variant="outlined"
                                />
                            </Stack>

                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2" color="text.secondary">
                                    Product Status:
                                </Typography>
                                <Chip
                                    label={data.is_deleted ? 'Inactive' : 'Active'}
                                    size="small"
                                    color={data.is_deleted ? 'error' : 'success'}
                                    variant="outlined"
                                />
                            </Stack>

                            {data.gst_nature_of_goods && (
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2" color="text.secondary">
                                        Nature of Goods:
                                    </Typography>
                                    <Chip
                                        label={gstNatureOptions.find(opt => opt.value === data.gst_nature_of_goods)?.label || data.gst_nature_of_goods}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                </Stack>
                            )}

                            {data.gst_taxability && (
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2" color="text.secondary">
                                        GST Taxability:
                                    </Typography>
                                    <Chip
                                        label={gstTaxabilityOptions.find(opt => opt.value === data.gst_taxability)?.label || data.gst_taxability}
                                        size="small"
                                        color="info"
                                        variant="outlined"
                                    />
                                </Stack>
                            )}
                            {data.gst_taxability === 'taxable' && (
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2" color="text.secondary">
                                        GST Tax Rate:
                                    </Typography>
                                    <Chip
                                        label={`${data.gst_percentage} %`}
                                        size="small"
                                        color="info"
                                        variant="outlined"
                                    />
                                </Stack>
                            )}
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
};

export default AdvancedSettingsSection;