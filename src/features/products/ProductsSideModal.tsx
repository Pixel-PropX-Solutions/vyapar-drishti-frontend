import { useState, useRef } from 'react';
import {
    Box,
    Button,
    InputAdornment,
    TextField,
    Typography,
    FormControl,
    Drawer,
    IconButton,
    Autocomplete,
    useTheme,
    Tab,
    Tabs,
    Switch,
    FormControlLabel,
    Chip,
    Paper,
} from '@mui/material';

// Icons
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import { ProductData } from '@/utils/types';
import { units } from '@/internals/data/units';
import {
    ChevronRight,
    CurrencyRupee,
    Upload,
    Add,
    Lock,
    Info
} from '@mui/icons-material';

interface SideModalProps {
    drawer: boolean;
    setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductsSideModal = (props: SideModalProps) => {
    const theme = useTheme();
    const { setDrawer, drawer } = props;
    const [isMoreDetails, setIsMoreDetails] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [productType, setProductType] = useState('product'); // 'product' or 'service'

    const [data, setData] = useState<ProductData>({
        // Required fields
        product_name: '',
        selling_price: 0,
        user_id: '',
        is_deleted: false,

        // Optional fields
        unit: '',
        hsn_code: '',
        puchase_price: 0,
        barcode: '',
        category: '',
        image: '',
        description: '',
        opening_quantity: 0,
        opening_purchase_price: 0,
        opening_stock_value: 0,

        // Additional Optional fields
        low_stock_alert: 0,
        show_active_stock: true,

        state: '',
        storage_requirement: '',
        expiry_date: new Date(),
    });

    // Additional state for new features
    const [showInOnlineStore, setShowInOnlineStore] = useState(true);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleChange = (field: keyof ProductData, value: string) => {
        setData({
            ...data,
            [field]: value
        });
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleImageChange = (file: File) => {
        if (!file) return;
        if (!['image/png', 'image/jpeg'].includes(file.type)) {
            alert('Only PNG or JPEG images are allowed.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
            setData({ ...data, image: e.target?.result as string });
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file) handleImageChange(file);
    };

    const handleBoxClick = () => {
        fileInputRef.current?.click();
    };

    const renderBasicDetails = () => (
        <Box sx={{ p: 3, }}>
            {/* Basic Details Section */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Basic Details
            </Typography>

            <Paper sx={{ p: 2, mb: 3, border: '1px solid black', backgroundColor: theme.palette.background.default }}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: '#f44336' }}>*</span>Product Name
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Enter Item Name"
                        value={data.product_name}
                        onChange={(e) => handleChange('product_name', e.target.value)}
                    />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        Selling Price
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        type="number"
                        placeholder="Enter Selling Price"
                        value={data.selling_price}
                        onChange={(e) => handleChange('selling_price', e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CurrencyRupee fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        Inclusive of Taxes
                    </Typography>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Primary Unit
                    </Typography>
                    <Autocomplete
                        fullWidth
                        size="small"
                        options={units}
                        getOptionLabel={(option) => option.label || ''}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Select Unit"
                                size="small"
                            />
                        )}
                        value={units.find(unit => unit.value === data.unit) || null}
                        onChange={(_, newValue) => {
                            handleChange('unit', newValue ? newValue.value : '');
                        }}
                        popupIcon={null}
                        sx={{
                            '& .MuiAutocomplete-endAdornment': { display: 'none' },
                        }}
                    />
                </FormControl>
            </Paper>

            {/* Additional Information */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Additional Information
                <Typography component="span" variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                    OPTIONAL
                </Typography>
            </Typography>

            <Paper sx={{ p: 2, mb: 3, border: '1px solid black', backgroundColor: theme.palette.background.default }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <FormControl fullWidth>
                        <Typography variant="subtitle2" gutterBottom>
                            HSN/SAC
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="HSN/SAC"
                            value={data.hsn_code}
                            onChange={(e) => handleChange('hsn_code', e.target.value)}
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <Typography variant="subtitle2" gutterBottom>
                            Purchase Price
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            value={data.puchase_price}
                            onChange={(e) => handleChange('puchase_price', e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Typography variant="caption">with Tax</Typography>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormControl>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <FormControl fullWidth>
                        <Typography variant="subtitle2" gutterBottom>
                            Barcode
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="2273546838467"
                            value={data.barcode}
                            onChange={(e) => handleChange('barcode', e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Button size="small" sx={{ textTransform: 'none' }}>
                                            Auto Generate
                                        </Button>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <Typography variant="subtitle2" gutterBottom>
                            Category
                        </Typography>
                        <Autocomplete
                            fullWidth
                            size="small"
                            options={[]}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Select Category"
                                    size="small"
                                />
                            )}
                        />
                    </FormControl>
                </Box>

                {/* Product Image */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Product Image
                    </Typography>
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) handleImageChange(file);
                        }}
                    />
                    <Box
                        onClick={handleBoxClick}
                        onDrop={handleDrop}
                        onDragOver={e => e.preventDefault()}
                        sx={{
                            border: '2px dashed #e0e0e0',
                            borderRadius: 1,
                            p: 3,
                            position: 'relative',
                            textAlign: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                                borderColor: 'primary.main',
                                backgroundColor: 'action.hover',
                            },
                        }}
                    >
                        {imagePreview ? (
                            <>
                                <img
                                    src={imagePreview}
                                    alt="Product Preview"
                                    style={{ maxWidth: 120, maxHeight: 120, margin: '0 auto', display: 'block', borderRadius: 8 }}
                                />
                                <CloseIcon
                                    onClick={(e) => { setImagePreview(null); e.stopPropagation(); }}
                                    sx={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        cursor: 'pointer',
                                        color: theme.palette.error.main,
                                    }} />
                            </>
                        ) : (
                            <>
                                <Upload sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    Upload
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Drag & drop or click to upload
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Product image must be PNG or JPEG, recommended 1024 px by 1024 px or 1:1 aspect ratio.
                                </Typography>
                            </>
                        )}
                    </Box>
                </FormControl>

                {/* Description */}
                <FormControl fullWidth>
                    <Typography variant="subtitle2" gutterBottom>
                        Description
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Add product description here..."
                        value={data.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                    />
                </FormControl>
            </Paper>

            {/* Opening Stock */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Opening Stock
                <Typography component="span" variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                    OPTIONAL
                </Typography>
            </Typography>

            <Paper sx={{ p: 2, mb: 3, border: '1px solid black', backgroundColor: theme.palette.background.default }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <FormControl fullWidth>
                        <Typography variant="subtitle2" gutterBottom>
                            Opening Quantity
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            placeholder="0"
                            value={data.opening_quantity}
                            onChange={(e) => handleChange('opening_quantity', e.target.value)}
                        />
                        <Typography variant="caption" color="text.secondary">
                            *Quantity of the product available in your existing inventory
                        </Typography>
                    </FormControl>

                    <FormControl fullWidth>
                        <Typography variant="subtitle2" gutterBottom>
                            Opening Purchase Price (with tax)
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            placeholder="0"
                            value={data.opening_purchase_price}
                            onChange={(e) => handleChange('opening_purchase_price', e.target.value)}
                        />
                    </FormControl>
                </Box>

                <FormControl fullWidth>
                    <Typography variant="subtitle2" gutterBottom>
                        Opening Stock Value (with tax)
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        type="number"
                        placeholder="0"
                        value={data.opening_stock_value}
                        disabled
                    />
                </FormControl>
            </Paper>

            {/* More Details Expandable Section */}
            <Paper
                sx={{
                    p: 2,
                    mb: 3,
                    backgroundColor: '#fdf0e6',
                    width: '100%',
                    boxSizing: 'border-box',
                    position: 'static',
                    borderRadius: 1,
                    border: '1px solid black',
                }}
            >
                <Box
                    onClick={() => setIsMoreDetails(!isMoreDetails)}
                    sx={{ cursor: 'pointer', mb: isMoreDetails ? 3 : 0 }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ChevronRight
                            sx={{
                                transform: isMoreDetails ? 'rotate(90deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease-in-out'
                            }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            More Details?
                        </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        Cess, Show OnlineDiscount, Inventory tracking, Low stock alerts etc..
                    </Typography>
                </Box>

                {isMoreDetails && (
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <FormControl fullWidth>
                            <Typography variant="subtitle2" gutterBottom>
                                Low Stock Alert at
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                placeholder="0"
                                value={data.low_stock_alert}
                                onChange={(e) => handleChange('low_stock_alert', e.target.value)}
                            />
                            <Typography variant="caption" color="text.secondary">
                                You will be notified once the stock reaches the minimum stock qty.
                            </Typography>
                        </FormControl>
                        <FormControl fullWidth>
                            <Typography variant="subtitle2" gutterBottom>
                                Show in Online Store
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={showInOnlineStore}
                                        onChange={(e) => setShowInOnlineStore(e.target.checked)}
                                        color="success"
                                    />
                                }
                                label=""
                            />
                            <Typography variant="caption" color="text.secondary">
                                Show or hide the product in catalogue/ online store
                            </Typography>
                        </FormControl>
                    </Box>
                )}
            </Paper>
        </Box>
    );

    return (
        <Drawer
            anchor="right"
            open={drawer}
            onClose={() => setDrawer(false)}
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 800 },
                    backgroundColor: theme.palette.background.paper,
                }
            }}
        >
            {/* Header */}
            <Box sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #ffffff',
                backgroundColor: theme.palette.background.default,
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => setDrawer(false)}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" component="div">
                        Add Item
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => setDrawer(false)}
                    sx={{ textTransform: 'none' }}
                >
                    Add Item
                </Button>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: '1px solid #e0e0e0', backgroundColor: theme.palette.background.paper, }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{ px: 2 }}
                >
                    <Tab label="Details" sx={{ textTransform: 'none' }} />
                </Tabs>
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, overflow: 'auto', position: 'relative' }}>
                {activeTab === 0 && renderBasicDetails()}
            </Box>

            {/* Footer */}
            <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', backgroundColor: theme.palette.background.paper }}>
                <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => setDrawer(false)}
                    sx={{ textTransform: 'none' }}
                >
                    Add Item
                </Button>
            </Box>
        </Drawer>
    );
};

export default ProductsSideModal;