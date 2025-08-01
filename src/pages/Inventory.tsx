import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Grid,
    InputAdornment,
    Paper,
    TextField,
    Typography,
    Tooltip,
    MenuItem,
    Card,
    CardContent,
    IconButton,
    Tabs,
    Tab,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import RefreshOutlined from '@mui/icons-material/RefreshOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InventoryIcon from '@mui/icons-material/Inventory';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { useNavigate } from 'react-router-dom';
import TabPanel from '@/features/upload-documents/components/TabPanel';
import InventoryTable from '@/features/inventory/InventoryTable';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { SortField, SortOrder } from '@/utils/types';
import { getInventoryStockItems } from '@/services/inventory';
import { WarningOutlined } from '@mui/icons-material';
import { ActionButton } from "@/common/buttons/ActionButton";
import InventoryStockCardSkeleton from '@/common/skeletons/InventoryStockCardSkeleton';
import toast from 'react-hot-toast';

// Styled Components with enhanced visuals
const StockCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[4],
    },
    borderRadius: 12,
}));


const Inventory: React.FC = () => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isStatsLoading, setIsStatsLoading] = useState(false);
    const [currentTab, setCurrentTab] = useState(0);

    const { InventoryItems, inventoryPageMeta } = useSelector((state: RootState) => state.inventory);
    const { user, current_company_id } = useSelector((state: RootState) => state.auth);
    const currentCompanyDetails = user?.company?.find((c: any) => c._id === current_company_id);
    const isInventoryFetched = useRef(false);
    const [debounceQuery, setDebounceQuery] = useState('');
    const [summaryStats, setSummaryStats] = useState({
        zeroStockCount: 0,
        lowStockCount: 0,
        positiveStockCount: 0,
        totalStockValue: 0,
        totalPurchaseValue: 0
    });
    const [data, setData] = useState({
        search: '',
        category: 'all',
        stock_status: 'all',
        page_no: 1,
        limit: 10,
        sortField: "created_at" as SortField,
        sortOrder: "asc" as SortOrder,
    });
    const { zeroStockCount, lowStockCount, positiveStockCount, totalStockValue, totalPurchaseValue } = summaryStats;
    const { search, category, stock_status, page_no, limit, sortField, sortOrder } = data;

    const handleSortRequest = (field: SortField) => {
        const isAsc = sortField === field && sortOrder === "asc";
        setData((prevState) => ({
            ...prevState,
            sortOrder: isAsc ? "desc" : "asc",
            sortField: field,
        }));
    };

    const handleResetFilters = useCallback(() => {
        setData({
            search: '',
            category: 'all',
            stock_status: 'all',
            page_no: 1,
            limit: 10,
            sortField: "created_at" as SortField,
            sortOrder: "asc" as SortOrder,
        });
        // setActiveFilters([]);

        // Show feedback for reset
        // setNotification({
        //     open: true,
        //     message: 'Filters have been reset',
        //     severity: 'info'
        // });
    }, []);

    const handleChangePage = (_: React.ChangeEvent<unknown>, newPage: number) => {
        setData((prevState) => ({
            ...prevState,
            page_no: newPage,
        }));
    };

    const handleStateChange = (field: string, value: any) => {
        if (field === 'limit') {
            setData((prevState) => ({
                ...prevState,
                page_no: 1,
                [field]: value,
            }));
        }
        setData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
        // Set appropriate filters based on tab
        let newStockStatus = '';
        if (newValue === 0) { newStockStatus = 'all'; }
        if (newValue === 1) { newStockStatus = 'zero'; }
        if (newValue === 2) { newStockStatus = 'low'; }
        if (newValue === 3) { newStockStatus = 'positive'; }

        setData(prev => ({
            ...prev,
            stock_status: newStockStatus
        }));

        fetchInventoryData(newStockStatus);
    };

    const fetchInventoryData = async (status: string) => {
        setIsLoading(true);
        try {
            await dispatch(
                getInventoryStockItems({
                    company_id: currentCompanyDetails?._id || '',
                    search: debounceQuery,
                    category: category === 'all' ? "" : category,
                    stock_status: status === 'all' ? "" : status,
                    page_no: page_no,
                    limit: limit,
                    sortField: sortField,
                    sortOrder: sortOrder,
                })
            );
        } finally {
            setIsLoading(false);
        }
    };

    const updateSummaryStats = () => {
        setSummaryStats({
            zeroStockCount: inventoryPageMeta.negative_stock || 0,
            lowStockCount: inventoryPageMeta.low_stock || 0,
            positiveStockCount: inventoryPageMeta.positive_stock || 0,
            totalStockValue: inventoryPageMeta.sale_value || 0,
            totalPurchaseValue: inventoryPageMeta.purchase_value || 0
        });
    };

    useEffect(() => {
        fetchInventoryData(stock_status);
    }, []);

    // Debounce search input to avoid excessive API calls
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceQuery(data.search);
        }, 300); // Adjust debounce time as needed

        return () => {
            clearTimeout(handler);
        };
    }, [data.search]);

    useEffect(() => {
        fetchInventoryData(stock_status);
    }, [category, currentCompanyDetails?._id, stock_status, dispatch, limit, page_no, debounceQuery, sortField, sortOrder]);

    // Reset summary stats fetch flag when company changes
    useEffect(() => {
        isInventoryFetched.current = false;
    }, [currentCompanyDetails?._id]);

    // Calculate summary stats only when company changes or on initial load
    useEffect(() => {
        if (!currentCompanyDetails?._id) return;

        // Reset the flag when company ID changes
        isInventoryFetched.current = false;

        const timeout = setTimeout(() => {
            if (!isInventoryFetched.current && inventoryPageMeta) {
                updateSummaryStats();
                isInventoryFetched.current = true;
            }
        }, 100);

        return () => { clearTimeout(timeout); setIsStatsLoading(false); };
    }, [currentCompanyDetails?._id, inventoryPageMeta]);

    return (
        <Container maxWidth={false} sx={{ mt: 3, width: '100%' }}>
            {/* Header Section with enhanced styling */}
            <Card sx={{ mb: 2, p: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="h5" component="h1" fontWeight="700" color="text.primary">
                                Inventory Management
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Track and manage your pharmacy inventory in real-time
                            </Typography>
                        </Box>

                        {/* Top Action Buttons with improved styling */}
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <ActionButton
                                variant="contained"
                                startIcon={<AddCircleOutlineIcon />}
                                color="success"
                                onClick={() => {
                                    if (!currentCompanyDetails?._id) {
                                        toast.error('Please create a company first.');
                                        return;
                                    }
                                    navigate('/invoices/create/purchase');
                                }}
                                sx={{
                                    background: theme.palette.mode === 'dark' ? '#c62828' : '#ffebee',
                                    color: theme.palette.mode === 'dark' ? '#fff' : '#c62828',
                                    '&:hover': {
                                        color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                                        background: theme.palette.mode === 'dark' ? '#ffebee' : '#c62828',
                                    },
                                }}
                            >
                                Add Purchase
                            </ActionButton>

                            <ActionButton
                                variant="contained"
                                startIcon={<RemoveCircleOutlineIcon />}
                                color="error"
                                onClick={() => {
                                    if (!currentCompanyDetails?._id) {
                                        toast.error('Please create a company first.');
                                        return;
                                    }
                                    navigate('/invoices/create/sales');
                                }}
                                sx={{
                                    background: theme.palette.mode === 'dark' ? '#2e7d32' : '#e8f5e9',
                                    color: theme.palette.mode === 'dark' ? '#fff' : '#2e7d32',
                                    '&:hover': {
                                        color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                                        background: theme.palette.mode === 'dark' ? '#e8f5e9' : '#2e7d32',
                                    },
                                }}
                            >
                                Add Sales
                            </ActionButton>


                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Tab Navigation for quick filtering */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab
                        icon={<InventoryIcon />}
                        iconPosition="start"
                        label="All Inventory"
                    />
                    <Tab
                        icon={<WarningOutlined />}
                        iconPosition="start"
                        label={`Zero Stock (${zeroStockCount})`}
                        sx={{ color: zeroStockCount > 0 ? '#f44336' : 'inherit' }}
                    />
                    <Tab
                        icon={<ErrorOutlineIcon />}
                        iconPosition="start"
                        label={`Low Stock (${lowStockCount})`}
                        sx={{ color: lowStockCount > 0 ? theme.palette.warning.main : 'inherit' }}
                    />
                    <Tab
                        icon={<CheckCircleOutlineIcon />}
                        iconPosition="start"
                        label={`Available (${positiveStockCount})`}
                        sx={{ color: positiveStockCount > 0 ? theme.palette.success.main : 'inherit' }}
                    />
                </Tabs>
            </Box>


            {/* Stock Summary Cards with enhanced visuals */}
            {(isStatsLoading || isLoading) ? (
                <Grid container spacing={1} sx={{ mb: 2 }}>
                    <InventoryStockCardSkeleton color='#ffebee' border='5px solid #c62828' />
                    <InventoryStockCardSkeleton color='hsl(45, 92%, 90%)' border='5px solid hsl(45, 90%, 40%)' />
                    <InventoryStockCardSkeleton color='#e8f5e9' border='5px solid #2e7d32' />
                    <InventoryStockCardSkeleton color='#e8f4fd' border='5px solid #1976d2' />
                    <InventoryStockCardSkeleton color='#fff8e1' border='5px solid #ff9800' />
                </Grid>
            ) : (
                <Grid container spacing={1} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <StockCard sx={{
                            bgcolor: '#ffebee',
                            borderLeft: '5px solid #c62828'
                        }}>
                            <Box>
                                <Typography variant="subtitle2" sx={{ color: theme.palette.grey[600] }} gutterBottom>
                                    Zero Stock Items
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.common.black }}>
                                    {zeroStockCount > 0 && <WarningAmberIcon color="error" />}
                                    <Typography variant="h4" component="div" fontWeight="bold">
                                        {zeroStockCount} Items
                                    </Typography>
                                </Box>
                                {zeroStockCount > 0 && (
                                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                        Some items are out of stock, please restock them
                                    </Typography>
                                )}
                            </Box>
                        </StockCard>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2.4}>
                        <StockCard sx={{
                            bgcolor: 'hsl(45, 92%, 90%)',
                            borderLeft: '5px solid hsl(45, 90%, 40%)'
                        }}>
                            <Box>
                                <Typography variant="subtitle2" sx={{ color: theme.palette.grey[600] }} gutterBottom>
                                    Low Stock Items
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.common.black }}>
                                    {lowStockCount > 0 && <WarningAmberIcon color="error" />}
                                    <Typography variant="h4" component="div" fontWeight="bold">
                                        {lowStockCount} Items
                                    </Typography>
                                </Box>
                                {lowStockCount > 0 && (
                                    <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                        Attention required! Some items need restocking
                                    </Typography>
                                )}
                            </Box>
                        </StockCard>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2.4}>
                        <StockCard sx={{
                            bgcolor: '#e8f5e9',
                            borderLeft: '5px solid #2e7d32'
                        }}>
                            <Box>
                                <Typography variant="subtitle2" sx={{ color: theme.palette.grey[600] }} gutterBottom>
                                    Well Stock
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.common.black }}>
                                    <CheckCircleOutlineIcon color="success" />
                                    <Typography variant="h4" component="div" fontWeight="bold">
                                        {positiveStockCount} Items
                                    </Typography>
                                </Box>
                                <Typography variant="caption" color="success.dark" sx={{ mt: 1, display: 'block' }}>
                                    Well stocked items ready for sale
                                </Typography>
                            </Box>
                        </StockCard>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2.4}>
                        <StockCard sx={{
                            bgcolor: '#e8f4fd',
                            borderLeft: '5px solid #1976d2'
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ color: theme.palette.grey[600] }} gutterBottom>
                                        Sales Value
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.common.black }}>
                                        <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                                            &#8377;
                                        </Typography>
                                        <Typography variant="h4" component="div" fontWeight="bold">
                                            {totalStockValue.toLocaleString('en-IN')}
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" sx={{ mt: 1, display: 'block', color: theme.palette.primary.main }}>
                                        Potential revenue at current prices
                                    </Typography>
                                </Box>
                                <Tooltip
                                    title="This value is an estimate based on current selling prices without considering discounts or taxes."
                                    arrow
                                    placement="top"
                                >
                                    <InfoOutlinedIcon fontSize="small" sx={{ cursor: 'pointer', color: theme.palette.primary.main }} />
                                </Tooltip>
                            </Box>
                        </StockCard>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2.4}>
                        <StockCard sx={{
                            bgcolor: '#fff8e1',
                            borderLeft: '5px solid #ff9800'
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ color: theme.palette.grey[600] }} gutterBottom>
                                        Purchase Value
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.common.black }}>
                                        <Typography variant="h6" sx={{ color: theme.palette.warning.main }}>
                                            &#8377;
                                        </Typography>
                                        <Typography variant="h4" component="div" fontWeight="bold">
                                            {totalPurchaseValue.toLocaleString('en-IN')}
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" color="warning.dark" sx={{ mt: 1, display: 'block' }}>
                                        Total investment in current stock
                                    </Typography>
                                </Box>
                                <Tooltip
                                    title="This value is calculated based on purchase prices without considering discounts or taxes."
                                    arrow
                                    placement="top"
                                >
                                    <InfoOutlinedIcon fontSize="small" color="warning" sx={{ cursor: 'pointer' }} />
                                </Tooltip>
                            </Box>
                        </StockCard>
                    </Grid>
                </Grid>
            )}

            {/* Search and Filter section with enhanced UX */}
            <Box sx={{ mb: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            placeholder="Search by product name, HSN, or category..."
                            variant="outlined"
                            fullWidth
                            value={search}
                            onChange={(e) => handleStateChange('search', e.target.value)}
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: search && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleStateChange('search', '')}
                                            aria-label="clear search"
                                        >
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField
                            select
                            value={category}
                            fullWidth
                            label="Category"
                            size="small"
                            onChange={(e) => handleStateChange('category', e.target.value)}
                        >
                            <MenuItem value="all">All Categories</MenuItem>
                            {inventoryPageMeta?.unique?.map((cat, index) => (
                                <MenuItem key={index} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} md={1.5}>
                        <TextField
                            select
                            value={stock_status}
                            fullWidth
                            label="Stock Status"
                            size="small"
                            onChange={(e) => handleStateChange('stock_status', e.target.value)}
                        >
                            <MenuItem value="all" sx={{ fontWeight: 600 }}>All Items</MenuItem>
                            <MenuItem value="zero"
                                sx={{ color: theme.palette.mode === 'dark' ? 'rgb(255, 0, 0)' : theme.palette.error.main, fontWeight: 600 }}>Zero Stock</MenuItem>
                            <MenuItem value="low"
                                sx={{ color: theme.palette.mode === 'dark' ? theme.palette.warning.light : theme.palette.warning.main, fontWeight: 600 }}
                            >Low Stock</MenuItem>
                            <MenuItem value="positive"
                                sx={{ color: theme.palette.mode === 'dark' ? 'rgb(0, 255, 13)' : theme.palette.success.main, fontWeight: 600 }}>Well Stock</MenuItem>

                        </TextField>
                    </Grid>

                    <Grid item xs={12} md={1}>
                        <TextField
                            select
                            label="Show"
                            fullWidth
                            value={limit}
                            onChange={(e) => handleStateChange('limit', e.target.value)}
                            size="small"
                        >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} md={1.5}>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<RefreshOutlined />}
                            onClick={handleResetFilters}
                        >
                            Reset Filters
                        </Button>
                    </Grid>
                </Grid>
            </Box>


            {/* Inventory Table with enhanced styling */}
            <TabPanel value={currentTab} index={0}>
                <InventoryTable
                    stockItems={InventoryItems as []}
                    sortRequest={handleSortRequest}
                    isLoading={isLoading}
                    stateChange={handleStateChange}
                    pageChange={handleChangePage}
                    limit={limit}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    pageMeta={inventoryPageMeta}
                />
            </TabPanel>

            {/* Inventory Table with enhanced styling */}
            <TabPanel value={currentTab} index={1}>
                <InventoryTable
                    stockItems={InventoryItems as []}
                    sortRequest={handleSortRequest}
                    isLoading={isLoading}
                    stateChange={handleStateChange}
                    pageChange={handleChangePage}
                    limit={limit}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    pageMeta={inventoryPageMeta}
                />
            </TabPanel>


            {/* Inventory Table with enhanced styling */}
            <TabPanel value={currentTab} index={2}>
                <InventoryTable
                    stockItems={InventoryItems as []}
                    sortRequest={handleSortRequest}
                    isLoading={isLoading}
                    stateChange={handleStateChange}
                    pageChange={handleChangePage}
                    limit={limit}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    pageMeta={inventoryPageMeta}
                />
            </TabPanel>

            {/* Inventory Table with enhanced styling */}
            <TabPanel value={currentTab} index={3}>
                <InventoryTable
                    stockItems={InventoryItems as []}
                    sortRequest={handleSortRequest}
                    isLoading={isLoading}
                    stateChange={handleStateChange}
                    pageChange={handleChangePage}
                    limit={limit}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    pageMeta={inventoryPageMeta}
                />
            </TabPanel>

        </Container>
    );
};

export default Inventory;