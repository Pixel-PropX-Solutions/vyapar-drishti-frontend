import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    InputAdornment,
    MenuItem,
    Pagination,
    useMediaQuery,
    useTheme,
    Tooltip,
    alpha,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Tab,
    Tabs,
    Card,
    CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import InventoryIcon from "@mui/icons-material/Inventory";
import RefreshIcon from "@mui/icons-material/Refresh";
import { deleteProduct } from "@/services/products";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import toast from "react-hot-toast";
import { GetInventoryGroups, SortOrder, UpdateInventoryGroup, } from "@/utils/types";
import TabPanel from "@/features/upload-documents/components/TabPanel";
import { viewAllCustomerGroups } from "@/services/accountingGroup";
import InvoiceTypeCardSkeleton from "@/components/GroupsAndTypes/InvoiceTypeCardSkeleton";
import InvoiceTypesCard from "@/components/GroupsAndTypes/InvoiceTypesCard";
import { viewAllInventoryGroup } from "@/services/inventoryGroup";
import { InventoryGroupsRow } from "@/features/Group/InventoryGroupRow";
import { InventoryGroupRowSkeleton } from "@/features/Group/InventoryGroupRowSkeleton";
import CreateInventoryGroupModal from "@/features/Group/CreateInventoryGroupModal";
import { viewAllInvoiceGroups } from "@/services/invoice";

const GroupAndTypes: React.FC = () => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { customerGroups, accountingGroupPageMeta, } = useSelector((state: RootState) => state.accountingGroup);
    const { inventoryGroups, inventoryGroupPageMeta } = useSelector((state: RootState) => state.inventoryGroup);
    const { invoiceGroups, invoiceGroupPageMeta } = useSelector((state: RootState) => state.invoice);
    const [openInventoryGroupModal, setOpenInventoryGroupModal] = useState<boolean>(false);
    const [selectedInventoryGroup, setSelectedInventoryGroup] = useState<UpdateInventoryGroup | null>(null);
    // const [openCustomerGroupModal, setOpenCustomerGroupModal] = useState<boolean>(false);
    // const [selectedCustomerGroup, setSelectedCustomerGroup] = useState<UpdateAccountingGroup | null>(null);

    const [data, setData] = useState({
        searchTerm: '',
        type: 'All',
        page: 1,
        rowsPerPage: 10,
        is_deleted: false,
        sortBy: "created_at",
        sortOrder: "asc" as SortOrder,

        // Category Filters
        searchQuery: '',
        pageNumber: 1,
        limit: 10,
        sortField: 'created_at',
        categorySortOrder: 'asc' as SortOrder,
    });
    const { searchTerm, type, is_deleted, page, rowsPerPage, sortBy, sortOrder } = data;
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const { currentCompany } = useSelector((state: RootState) => state.auth);
    const [selectedTab, setSelectedTab] = useState(0);

    const handlePageChange = (_: unknown, value: number) => {
        setData((prevState) => ({
            ...prevState,
            page: value,
        }));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleRefresh = () => {
        setLoading(true);
        setRefreshKey((prev) => prev + 1);
        setData((prevState) => ({
            ...prevState,
            page: 1,
        }));
        toast.success('Data refreshed successfully');
    };

    const handleDelete = (productId: string) => {
        dispatch(
            deleteProduct({ id: productId, company_id: currentCompany?._id || '' })
        )
            .unwrap()
            .then(() => {
                setRefreshKey((prev) => prev + 1);
                setLoading(false);
                toast.success('Product deleted successfully')
            }).catch((error)=>{
                toast.error(error || 'An unexpected error occurred. Please try again later.');
            });
    };

    // const handleCustomerGroupEdit = (cusGroup: GetAllAccountingGroups) => {
    //     setOpenCustomerGroupModal(true);
    //     setSelectedCustomerGroup(cusGroup);
    // };
    // const handleCustomerGroupView = (cusGroup: GetAllAccountingGroups) => {
    //     setOpenCustomerGroupModal(true);
    //     setSelectedCustomerGroup(cusGroup);
    // };

    const handleInventoryGroupEdit = (inventoryGroup: GetInventoryGroups) => {
        setOpenInventoryGroupModal(true);
        setSelectedInventoryGroup(inventoryGroup);
    };
    const handleInventoryGroupView = (inventoryGroup: GetInventoryGroups) => {
        setOpenInventoryGroupModal(true);
        setSelectedInventoryGroup(inventoryGroup);
    };

    const fetchCustomerGroups = useCallback(async () => {
        setLoading(true);
        dispatch(
            viewAllCustomerGroups({
                company_id: currentCompany?._id || '',
                searchQuery: searchTerm,
                type: type,
                pageNumber: page,
                limit: rowsPerPage,
                sortField: sortBy,
                sortOrder: sortOrder,
                is_deleted: is_deleted,
            })
        )
            .unwrap()
            .then(() => {
                setLoading(false);
            });
    }, [dispatch, currentCompany?._id, searchTerm, type, page, rowsPerPage, sortBy, sortOrder, is_deleted]);

    const fetchInventoryGroups = useCallback(async () => {
        setLoading(true);
        dispatch(
            viewAllInventoryGroup({
                company_id: currentCompany?._id || '',
                searchQuery: searchTerm,
                parent: type,
                pageNumber: page,
                limit: rowsPerPage,
                sortField: sortBy,
                sortOrder: sortOrder,
            })
        )
            .unwrap()
            .then(() => {
                setLoading(false);
            });
    }, [dispatch, currentCompany?._id, searchTerm, type, page, rowsPerPage, sortBy, sortOrder]);

    const fetchInvoiceGroups = useCallback(async () => {
        setLoading(true);
        dispatch(
            viewAllInvoiceGroups({
                company_id: currentCompany?._id || '',
                searchQuery: searchTerm,
                pageNumber: page,
                limit: rowsPerPage,
                sortField: sortBy,
                sortOrder: sortOrder,
                is_deleted: is_deleted,
            })
        )
            .unwrap()
            .then(() => {
                setLoading(false);
            });
    }, [dispatch, currentCompany?._id, searchTerm, page, rowsPerPage, sortBy, sortOrder, is_deleted]);

    useEffect(() => {
        fetchCustomerGroups();
    }, [page, searchTerm, rowsPerPage, sortOrder, sortBy, refreshKey, dispatch, fetchCustomerGroups]);


    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        if (newValue === 0) {
            fetchCustomerGroups();
            // setData((prevState) => ({ ...prevState, is_deleted: false }));
        } else if (newValue === 1) {
            fetchInvoiceGroups();
        } else if (newValue === 2) {
            fetchInventoryGroups()
        } else if (newValue === 3) {
            // fetchItemCategory();
        }
        setSelectedTab(newValue);
    };


    return (
        <Box sx={{ p: 3, minHeight: '100vh', width: '100%' }}>
            <Card sx={{ mb: 3, p: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <Box>
                                <Typography variant="h5" component="h1" fontWeight="700" color="text.primary">
                                    Groups & Types Overview
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Manage your groups and types effectively.
                                </Typography>
                            </Box>
                            <Tabs
                                value={selectedTab}
                                onChange={handleTabChange}
                                aria-label="dashboard tabs"
                                sx={{ mt: 1 }}
                            >
                                <Tab label="Customer Groups" />
                                <Tab label="Invoice Groups" />
                                <Tab label="Items Groups" />
                            </Tabs>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            {selectedTab !== 1 && <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddCircleIcon fontSize="large" />}
                                onClick={() => {
                                    // if (selectedTab === 0) {
                                    //     setOpenCustomerGroupModal(true);
                                    //     setSelectedCustomerGroup(null);
                                    // }
                                    // else if (selectedTab === 1) {
                                    //     // do nothing
                                    // }
                                    // else
                                     if (selectedTab === 2) {
                                        setOpenInventoryGroupModal(true);
                                        setSelectedInventoryGroup(null);
                                    }
                                }}
                                sx={{
                                    width: "max-content",
                                }}
                            >
                                {selectedTab === 0 && "Add New Customer Group"}
                                {selectedTab === 1 && "Add New Invoice Group"}
                                {selectedTab === 2 && "Add New Items Group"}
                            </Button>}
                        </Grid>
                    </Grid>


                </CardContent>
            </Card>
            {/* Enhanced Search and Filters */}
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={7}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search products, category, description, barcode..."
                        value={searchTerm}
                        onChange={(e) => setData((prevState) => ({
                            ...prevState,
                            searchTerm: e.target.value,
                        }))}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: theme.palette.primary.main }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1,
                                bgcolor: alpha(theme.palette.primary.main, 0.02),
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                                },
                                '&.Mui-focused': {
                                    bgcolor: 'white',
                                    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
                                },
                            },
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={2}>
                    <TextField
                        fullWidth
                        select
                        size="small"
                        label="Sort By"
                        value={sortBy}
                        onChange={(e) => setData((prevState) => ({
                            ...prevState,
                            sortBy: e.target.value,
                        }))}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1,
                            },
                        }}
                    >
                        <MenuItem value="created_at">Date Created</MenuItem>
                        <MenuItem value="name">Name</MenuItem>
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={1}>
                    <TextField
                        fullWidth
                        select
                        size="small"
                        label="Per Page"
                        value={rowsPerPage.toString()}
                        onChange={(e) => setData((prevState) => ({
                            ...prevState,
                            rowsPerPage: Number(e.target.value),
                            page: 1
                        }))}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1,
                            },
                        }}
                    >
                        {[10, 25, 50].map((option) => (
                            <MenuItem key={option} value={option.toString()}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={2}>
                    <Tooltip title="Refresh Data" arrow sx={{ display: 'flex', width: '100%' }}>
                        <Button
                            variant="outlined"
                            onClick={handleRefresh}
                            startIcon={<RefreshIcon />}
                            sx={{
                                whiteSpace: 'nowrap',
                                width: '100%',
                            }}
                        >
                            Refresh Items
                        </Button>
                    </Tooltip>
                </Grid>
            </Grid>

{/* 
            <TabPanel value={selectedTab} index={0}>
                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        width: '100%',
                        borderRadius: 1,
                        border: `1px solid ${alpha(theme.palette.divider, 1)}`,
                        boxShadow: `0 4px 20px ${alpha('#000', 0.05)}`,
                    }}
                >
                    <Table sx={{ width: '100%' }}>
                        <TableHead>
                            <TableRow
                                sx={{
                                    bgcolor: alpha(theme.palette.grey[50], 0.8),
                                    width: '100%',
                                    '& .MuiTableCell-head': {
                                        borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                    },
                                    "& .MuiTableCell-root": {
                                        padding: '8px 16px',
                                    },
                                }}
                            >
                                <TableCell sx={{ pl: 3, pr: 1 }}>
                                    <Tooltip title="Sort by Product Name" arrow>
                                        <TableSortLabel
                                            active={sortBy === "product_name"}
                                            direction={sortBy === "product_name" ? sortOrder : "asc"}
                                            onClick={() => {
                                                setData((prevState) => ({
                                                    ...prevState,
                                                    sortBy: "product_name",
                                                    sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                                                }));
                                            }}
                                        >
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                                Group Information
                                            </Typography>
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="center" sx={{ px: 1 }}>
                                    <Tooltip title="Sort by Item Quantity" arrow>
                                        <TableSortLabel
                                            active={sortBy === "opening_quantity"}
                                            direction={sortBy === "opening_quantity" ? sortOrder : "asc"}
                                            onClick={() => {
                                                setData((prevState) => ({
                                                    ...prevState,
                                                    sortBy: "opening_quantity",
                                                    sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                                                }));
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                                    Under Group
                                                </Typography>
                                            </Box>
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="right" >
                                    <Tooltip title="Sort by Purchase Price" arrow>
                                        <TableSortLabel
                                            active={sortBy === "purchase_price"}
                                            direction={sortBy === "purchase_price" ? sortOrder : "asc"}
                                            onClick={() => {
                                                setData((prevState) => ({
                                                    ...prevState,
                                                    sortBy: "purchase_price",
                                                    sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                                                }));
                                            }}
                                        >
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                                Created on
                                            </Typography>
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="center" >
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                        Actions
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                Array([1, 2, 3, 4, 5])
                                    .map((_, index) => <CustomerGroupRowSkeleton key={`skeleton-${index}`} />)
                            ) : customerGroups.length > 0 ? (
                                customerGroups.map((cusGroup, index) => (
                                    <CustomerGroupsRow
                                        key={cusGroup._id}
                                        cusGroup={cusGroup}
                                        onDelete={handleDelete}
                                        onEdit={handleCustomerGroupEdit}
                                        onView={handleCustomerGroupView}
                                        index={index}
                                    />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 8 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                            <InventoryIcon sx={{ fontSize: '4rem', color: theme.palette.text.disabled }} />
                                            <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                No products found
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Try adjusting your search or filter criteria, or add your first product
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                onClick={() => {
                                                }}
                                                startIcon={<AddCircleIcon />}
                                                sx={{
                                                    mt: 2,
                                                    borderRadius: 1,
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Add Your First Product
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel> */}

            <TabPanel value={selectedTab} index={1}>
                <Grid container spacing={3}>
                    {loading ? (
                        // Show skeletons while loading
                        Array([1, 2, 3, 4, 5])
                            .map((_, index) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                    key={`skeleton-${index}`}
                                >
                                    <InvoiceTypeCardSkeleton />
                                </Grid>
                            ))
                    ) : invoiceGroups?.length > 0 ? (
                        // Show products grid
                        invoiceGroups.map((invGroup, index) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                key={invGroup._id}
                                onClick={() => { }}
                            >
                                <InvoiceTypesCard
                                    invGroup={invGroup}
                                    onDelete={() => {
                                    }}

                                    onEdit={() => {
                                    }}
                                    index={index}
                                />
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Paper sx={{ p: 3, textAlign: "center" }}>
                                <Typography variant="h6">No products found</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Try adjusting your search or filter criteria
                                </Typography>
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            </TabPanel>

            <TabPanel value={selectedTab} index={2}>
                <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                        width: '100%',
                        borderRadius: 1,
                        border: `1px solid ${alpha(theme.palette.divider, 1)}`,
                        boxShadow: `0 4px 20px ${alpha('#000', 0.05)}`,
                        // overflow: 'hidden',
                    }}
                >
                    <Table sx={{ width: '100%' }}>
                        <TableHead>
                            <TableRow
                                sx={{
                                    bgcolor: alpha(theme.palette.grey[50], 0.8),
                                    width: '100%',
                                    '& .MuiTableCell-head': {
                                        borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                    },
                                    "& .MuiTableCell-root": {
                                        padding: '8px 16px',
                                    },
                                }}
                            >
                                <TableCell sx={{ pl: 3, pr: 1 }}>
                                    <Tooltip title="Sort by Product Name" arrow>
                                        <TableSortLabel
                                            active={sortBy === "product_name"}
                                            direction={sortBy === "product_name" ? sortOrder : "asc"}
                                            onClick={() => {
                                                setData((prevState) => ({
                                                    ...prevState,
                                                    sortBy: "product_name",
                                                    sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                                                }));
                                            }}
                                        >
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                                Group Information
                                            </Typography>
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="center" sx={{ px: 1 }}>
                                    <Tooltip title="Sort by Item Quantity" arrow>
                                        <TableSortLabel
                                            active={sortBy === "opening_quantity"}
                                            direction={sortBy === "opening_quantity" ? sortOrder : "asc"}
                                            onClick={() => {
                                                setData((prevState) => ({
                                                    ...prevState,
                                                    sortBy: "opening_quantity",
                                                    sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                                                }));
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                {/* <InventoryIcon fontSize="small" /> */}
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                                    Under Group
                                                </Typography>
                                            </Box>
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                                {/* <TableCell align="right" sx={{ px: 1 }}>
                                    <Tooltip title="Sort by Bar-Code" arrow>
                                        <TableSortLabel
                                            active={sortBy === "barcode"}
                                            direction={sortBy === "barcode" ? sortOrder : "asc"}
                                            onClick={() => {
                                                setData((prevState) => ({
                                                    ...prevState,
                                                    sortBy: "barcode",
                                                    sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                                                }));
                                            }}
                                        >
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                                                Group HSN/SAC Code
                                            </Typography>
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell> */}
                                {/* <TableCell align="right" sx={{ px: 1 }}>
                                    <Tooltip title="Sort by Selling Price" arrow>
                                        <TableSortLabel
                                            active={sortBy === "selling_price"}
                                            direction={sortBy === "selling_price" ? sortOrder : "asc"}
                                            onClick={() => {
                                                setData((prevState) => ({
                                                    ...prevState,
                                                    sortBy: "selling_price",
                                                    sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                                                }));
                                            }}
                                        >
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, fontSize: '0.85rem' }}>
                                                TAX Info
                                            </Typography>
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell> */}
                                <TableCell align="right" sx={{ px: 1 }}>
                                    <Tooltip title="Sort by Purchase Price" arrow>
                                        <TableSortLabel
                                            active={sortBy === "purchase_price"}
                                            direction={sortBy === "purchase_price" ? sortOrder : "asc"}
                                            onClick={() => {
                                                setData((prevState) => ({
                                                    ...prevState,
                                                    sortBy: "purchase_price",
                                                    sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
                                                }));
                                            }}
                                        >
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                                Created on
                                            </Typography>
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="center" >
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                                        Actions
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                Array([1, 2, 3, 4, 5])
                                    .map((_, index) => <InventoryGroupRowSkeleton key={`skeleton-${index}`} />)
                            ) : inventoryGroups.length > 0 ? (
                                inventoryGroups.map((inventoryGroup, index) => (
                                    <InventoryGroupsRow
                                        key={inventoryGroup._id}
                                        inventoryGroup={inventoryGroup}
                                        onDelete={handleDelete}
                                        onEdit={handleInventoryGroupEdit}
                                        onView={handleInventoryGroupView}
                                        index={index}
                                    />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ textAlign: "center", py: 8 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                            <InventoryIcon sx={{ fontSize: '4rem', color: theme.palette.text.disabled }} />
                                            <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                No inventory groups found
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Try adjusting your search or filter criteria, or create your first inventory group
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                onClick={() => {
                                                }}
                                                startIcon={<AddCircleIcon />}
                                                sx={{
                                                    mt: 2,
                                                    borderRadius: 1,
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Create Your First Inventory Group
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>




            {/* Enhanced Pagination Section */}
            <Paper
                elevation={0}
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1,
                    mt: 1,
                    borderRadius: 1,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    boxShadow: `0 4px 20px ${alpha('#000', 0.05)}`,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                    {selectedTab === 0 &&
                        (<Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Showing {(page - 1) * rowsPerPage + 1} - {Math.min(page * rowsPerPage, (page - 1) * rowsPerPage + customerGroups.length)} of {accountingGroupPageMeta.total} Customer Groups
                        </Typography>)}
                    {selectedTab === 1 && (<Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Showing {(page - 1) * rowsPerPage + 1} - {Math.min(page * rowsPerPage, (page - 1) * rowsPerPage + invoiceGroups.length)} of {invoiceGroupPageMeta.total} Invoice Groups
                    </Typography>)}
                    {selectedTab === 2 && (<Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Showing {(page - 1) * rowsPerPage + 1} - {Math.min(page * rowsPerPage, (page - 1) * rowsPerPage + inventoryGroups.length)} of {inventoryGroupPageMeta.total} Item Groups
                    </Typography>)}
                </Box>

                {accountingGroupPageMeta.total > rowsPerPage && selectedTab === 0 && (
                    <Pagination
                        count={Math.ceil(accountingGroupPageMeta.total / rowsPerPage)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size={isMobile ? "small" : "medium"}
                        showFirstButton
                        showLastButton
                        sx={{
                            "& .MuiPaginationItem-root": {
                                mx: { xs: 0.25, sm: 0.5 },
                                borderRadius: 1,
                                fontWeight: 600,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                                },
                                '&.Mui-selected': {
                                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                                },
                            },
                        }}
                    />
                )}

                {invoiceGroupPageMeta.total > rowsPerPage && selectedTab === 1 && (
                    <Pagination
                        count={Math.ceil(invoiceGroupPageMeta.total / rowsPerPage)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size={isMobile ? "small" : "medium"}
                        showFirstButton
                        showLastButton
                        sx={{
                            "& .MuiPaginationItem-root": {
                                mx: { xs: 0.25, sm: 0.5 },
                                borderRadius: 1,
                                fontWeight: 600,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                                },
                                '&.Mui-selected': {
                                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                                },
                            },
                        }}
                    />
                )}

                {inventoryGroupPageMeta.total > rowsPerPage && selectedTab === 1 && (
                    <Pagination
                        count={Math.ceil(inventoryGroupPageMeta.total / rowsPerPage)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size={isMobile ? "small" : "medium"}
                        showFirstButton
                        showLastButton
                        sx={{
                            "& .MuiPaginationItem-root": {
                                mx: { xs: 0.25, sm: 0.5 },
                                borderRadius: 1,
                                fontWeight: 600,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                                },
                                '&.Mui-selected': {
                                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                                },
                            },
                        }}
                    />
                )}

            </Paper>

            <CreateInventoryGroupModal
                open={openInventoryGroupModal}
                onClose={() => {
                    setOpenInventoryGroupModal(false);
                    fetchInventoryGroups()
                }}
                onUpdated={() => fetchInventoryGroups()}
                inventoryGroup={selectedInventoryGroup}
                onCreated={function (inventoryGroup: { name: string; _id: string; }): void { console.log("Inventory group created:", inventoryGroup.name); }} />

            {/* <CreateCustomerGroupModal
                open={openCustomerGroupModal}
                onClose={() => {
                    setOpenCustomerGroupModal(false);
                    fetchCustomerGroups()
                }}
                onUpdated={() => fetchCustomerGroups()}
                accountingGroup={selectedCustomerGroup}
                onCreated={function (accountingGroup: { name: string; _id: string; }): void {
                    console.log("Customer group created:", accountingGroup.name);
                    setOpenCustomerGroupModal(false);
                }} /> */}
        </Box>
    );
};

export default GroupAndTypes;