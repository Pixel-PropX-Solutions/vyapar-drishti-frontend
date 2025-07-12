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
    Fade,
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
import { SortField, SortOrder, InventoryItem } from '@/utils/types';
import { getProductStock } from '@/services/inventory';
import { WarningOutlined } from '@mui/icons-material';
import { ActionButton } from "@/common/ActionButton";

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
    const [currentTab, setCurrentTab] = useState(0);

    const { InventoryItems, pageMeta } = useSelector((state: RootState) => state.inventory);
    const { currentCompany } = useSelector((state: RootState) => state.auth);

    const [data, setData] = useState({
        search: '',
        category: 'all',
        qtyFilter: 'all',
        state: '',
        page_no: 1,
        limit: 10,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        sortField: "created_at" as SortField,
        sortOrder: "asc" as SortOrder,
    });
    // const { categories } = useSelector((state: RootState) => state.product);
    const { search, category, qtyFilter, page_no, limit, sortField, sortOrder } = data;
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

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
            qtyFilter: 'all',
            state: '',
            page_no: 1,
            limit: 10,
            startDate: new Date('2025-01-01'),
            endDate: new Date('2025-12-31'),
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
        setData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
        handleResetFilters();
        // Set appropriate filters based on tab
        let newQtyFilter = 'all';
        if (newValue === 1) newQtyFilter = 'low';
        if (newValue === 2) newQtyFilter = 'postive';

        setData(prev => ({
            ...prev,
            qtyFilter: newQtyFilter
        }));
    };

    // Bulk operations
    const handleBulkAction = (action: 'stockIn' | 'stockOut') => {
        if (action === 'stockIn') {
            navigate('/orders/create');
        } else if (action === 'stockOut') {
            navigate('/sell');
        }
    };

    useEffect(() => {
        const fetchInventoryData = async () => {
            setIsLoading(true);
            try {
                await dispatch(
                    getProductStock({
                        company_id: currentCompany?._id || '',
                        search: search,
                        category: category === 'all' ? "" : category.toLowerCase(),
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

        fetchInventoryData();
    }, [category, currentCompany?._id, dispatch, limit, page_no, search, sortField, sortOrder]);

    useEffect(() => {
        // dispatch(viewAllCategories());
    }, [dispatch]);

    // State to store summary stats that only change on initial load
    const [summaryStats, setSummaryStats] = useState({
        zeroStockCount: 0,
        zeroStockItems: [] as InventoryItem[],
        lowStockCount: 0,
        lowStockItems: [] as InventoryItem[],
        positiveStockCount: 0,
        positiveStockItems: [] as InventoryItem[],
        totalStockValue: 0,
        totalPurchaseValue: 0
    });

    // Track if initial data is loaded
    const initialDataLoaded = useRef(false);

    // Calculate summary stats only on initial data load
    useEffect(() => {
        if (InventoryItems && InventoryItems.length > 0 && !initialDataLoaded.current) {
            const zeroItems = InventoryItems.filter(item => item.current_stock <= 0);
            const lowItems = InventoryItems.filter(item => item.current_stock > 0 && item.current_stock <= (item.low_stock_alert || 10));
            const positiveItems = InventoryItems.filter(item => item.current_stock > (item.low_stock_alert || 10));

            setSummaryStats({
                zeroStockItems: zeroItems,
                zeroStockCount: zeroItems.length || 0,
                lowStockCount: lowItems.length || 0,
                lowStockItems: lowItems,
                positiveStockCount: positiveItems.length || 0,
                positiveStockItems: positiveItems,
                totalStockValue: lowItems.reduce((acc, item) => acc + (item.sales_value || 0), 0) || 0,
                totalPurchaseValue: lowItems.reduce((acc, item) => acc + (item.purchase_value || 0), 0) || 0
            });

            initialDataLoaded.current = true;
        }
    }, [pageMeta, InventoryItems]);

    // Destructure values from summaryStats for use in the component
    const { zeroStockItems, zeroStockCount, lowStockCount, lowStockItems, positiveStockCount, positiveStockItems, totalStockValue, totalPurchaseValue } = summaryStats;

    return (
        <Container maxWidth="xl" sx={{ mt: 3 }}>
            {/* Header Section with enhanced styling */}
            <Card sx={{ mb: 3, p: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
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
                                onClick={() => navigate('/invoices/create/purchase')}
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
                                onClick={() => navigate('/invoices/create/sales')}
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
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
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
            <Grid container spacing={1} sx={{ mb: 4 }}>
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

            {/* Search and Filter section with enhanced UX */}
            <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            placeholder="Search by product name, SKU, or category..."
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
                            {/* {categories?.map((cat, index) => (
                                <MenuItem key={index} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))} */}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <TextField
                            select
                            value={qtyFilter}
                            fullWidth
                            label="Stock Status"
                            size="small"
                            onChange={(e) => handleStateChange('qtyFilter', e.target.value)}
                        >
                            <MenuItem value="all" sx={{ fontWeight: 600 }}>All Items</MenuItem>
                            <MenuItem value="negative"
                                sx={{ color: theme.palette.mode === 'dark' ? 'rgb(255, 0, 0)' : theme.palette.error.main, fontWeight: 600 }}>Negative Stock</MenuItem>
                            <MenuItem value="zero"
                                sx={{ color: theme.palette.mode === 'dark' ? 'rgb(255, 255, 255)' : '', fontWeight: 600 }}>Zero Stock</MenuItem>
                            <MenuItem value="low"
                                sx={{ color: theme.palette.mode === 'dark' ? theme.palette.warning.light : theme.palette.warning.main, fontWeight: 600 }}
                            >Low Stock</MenuItem>
                            <MenuItem value="positive"
                                sx={{ color: theme.palette.mode === 'dark' ? 'rgb(0, 255, 13)' : theme.palette.success.main, fontWeight: 600 }}>Well Stock</MenuItem>

                        </TextField>
                    </Grid>

                    <Grid item xs={12} md={2}>
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
                />
            </TabPanel>

            {/* Inventory Table with enhanced styling */}
            <TabPanel value={currentTab} index={1}>
                <InventoryTable
                    stockItems={zeroStockItems}
                    sortRequest={handleSortRequest}
                    isLoading={isLoading}
                    stateChange={handleStateChange}
                    pageChange={handleChangePage}
                    limit={limit}
                    sortField={sortField}
                    sortOrder={sortOrder}
                />
            </TabPanel>
            

            {/* Inventory Table with enhanced styling */}
            <TabPanel value={currentTab} index={2}>
                <InventoryTable
                    stockItems={lowStockItems}
                    sortRequest={handleSortRequest}
                    isLoading={isLoading}
                    stateChange={handleStateChange}
                    pageChange={handleChangePage}
                    limit={limit}
                    sortField={sortField}
                    sortOrder={sortOrder}
                />
            </TabPanel>

            {/* Inventory Table with enhanced styling */}
            <TabPanel value={currentTab} index={3}>
                <InventoryTable
                    stockItems={positiveStockItems}
                    sortRequest={handleSortRequest}
                    isLoading={isLoading}
                    stateChange={handleStateChange}
                    pageChange={handleChangePage}
                    limit={limit}
                    sortField={sortField}
                    sortOrder={sortOrder}
                />
            </TabPanel>


            {/* Bulk Actions Footer */}
            {selectedRows.length > 0 && (
                <Fade in={selectedRows.length > 0}>
                    <Paper
                        elevation={3}
                        sx={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            p: 2,
                            zIndex: 1000,
                            borderRadius: '12px 12px 0 0',
                            bgcolor: '#f5f5f5',
                            boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="body1">
                            <strong>{selectedRows.length}</strong> items selected
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setSelectedRows([])}
                                sx={{ minWidth: 100 }}
                            >
                                Clear
                            </Button>

                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={() => handleBulkAction('stockIn')}
                                sx={{ minWidth: 120 }}
                            >
                                Stock In
                            </Button>

                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<RemoveCircleOutlineIcon />}
                                onClick={() => handleBulkAction('stockOut')}
                                sx={{ minWidth: 120 }}
                            >
                                Stock Out
                            </Button>
                        </Box>
                    </Paper>
                </Fade>
            )}

            {/* Side Modal for Stock In/Out actions */}
            {/* <SideModal drawer={drawer} setDrawer={setDrawer} /> */}
        </Container>
    );
};

export default Inventory;