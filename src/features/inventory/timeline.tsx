/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Stack,
    TextField,
    InputAdornment,
    MenuItem,
    Pagination,
    TableSortLabel,
    Tooltip,
    useTheme,
} from '@mui/material';
import { RefreshOutlined } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from "@mui/icons-material/FilterList";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { getStockMovement } from '@/services/inventory';
import { formatDate } from '@/utils/functions';
import { SortField, SortOrder } from '@/utils/types';

const Timeline: React.FC = () => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const { stockMovement, pageMeta } = useSelector((state: RootState) => state.inventory);
    const [data, setData] = useState({
        search: '',
        category: 'All-Categories',
        state: '',
        movement_type: 'all',
        page_no: 1,
        limit: 10,
        startDate: new Date('2025-04-01'),
        endDate: new Date('2026-03-31'),
        sortField: "created_at" as SortField,
        sortOrder: "desc" as SortOrder,
    });

    const { search, movement_type, page_no, limit, startDate, endDate, sortField, sortOrder } =
        data;

    const handleSortRequest = (field: SortField) => {
        const isAsc = sortField === field && sortOrder === "asc";
        setData((prevState) => ({
            ...prevState,
            sortOrder: isAsc ? "desc" : "asc",
            sortField: field,
        }));
    };

    // Reset filters
    const handleResetFilters = useCallback(() => {
        setData({
            search: '',
            category: '',
            state: '',
            movement_type: 'all',
            page_no: 1,
            limit: 10,
            startDate: new Date('2025-04-01'),
            endDate: new Date('2026-03-31'),
            sortField: "created_at" as SortField,
            sortOrder: "asc" as SortOrder,
        });
    }, []);

    const handleChangePage = (
        _: React.ChangeEvent<unknown>,
        newPage: number
    ) => {
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

    useEffect(() => {
        const fetchMovement = async () => {
            dispatch(
                getStockMovement({
                    search: search,
                    movement_type: movement_type == 'all' ? '' : movement_type,
                    page_no: page_no,
                    limit: limit,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    sortField: sortField,
                    sortOrder: sortOrder,
                })
            );
        };

        fetchMovement();
    }, [dispatch, endDate, limit, movement_type, page_no, search, sortField, sortOrder, startDate]);

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ width: "100%", p: 3, }}>
                <Card sx={{ mb: 3, p: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                    <CardContent>
                        <Grid item xs={12} md={12}>
                            <Typography variant="h5" component="h1" fontWeight="700" color="text.primary">
                                Inventory Timeline
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Manage your stock, orders, and inventory levels
                            </Typography>
                        </Grid>
                    </CardContent>
                </Card>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={12}>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            alignItems="center"
                        >
                            <Grid item xs={12} sm={4} md={4}>
                                <TextField
                                    fullWidth
                                    placeholder="Search by Order ID or Stockist Name"
                                    value={search}
                                    onChange={(e) => handleStateChange("search", e.target.value)}
                                    size="small"
                                    InputProps={{
                                        startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                                        sx: { borderRadius: '8px' }
                                    }}
                                />
                            </Grid>


                            <Grid item xs={12} sm={4} flexDirection={'row'} display="flex" gap={2} alignItems="center">
                                <DatePicker
                                    label="Start Date"
                                    value={startDate}
                                    format="dd/MM/yyyy"
                                    views={["year", "month", "day"]}
                                    onChange={(newValue) => handleStateChange("startDate", newValue)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            size: "small",
                                            sx: {
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px'
                                                },
                                                '& .MuiInputAdornment-root .MuiButtonBase-root': {
                                                    border: 'none',
                                                    boxShadow: 'none'
                                                }
                                            }
                                        },
                                    }}
                                />
                                <DatePicker
                                    label="End Date"
                                    value={endDate}
                                    format="dd/MM/yyyy"
                                    views={["year", "month", "day"]}
                                    onChange={(newValue) => handleStateChange("endDate", newValue)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            size: "small",
                                            sx: {
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '8px'
                                                },
                                                '& .MuiInputAdornment-root .MuiButtonBase-root': {
                                                    border: 'none',
                                                    boxShadow: 'none'
                                                }
                                            }
                                        },
                                    }}
                                />
                            </Grid>

                            {/* <Grid item xs={12} sm={2}>
                                <TextField
                                    size='small'
                                    fullWidth
                                    variant="outlined"
                                    label="Category"
                                    select
                                    value={category}
                                    onChange={(event) => {
                                        handleStateChange("category", event.target.value as string);
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FilterListIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                >
                                    <MenuItem value="All-Categories">All Categories</MenuItem>
                                    {pageMeta?.unique?.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid> */}
                            <Grid item xs={12} md={2}>
                                <TextField
                                    select
                                    value={movement_type}
                                    fullWidth
                                    label="Movement Type"
                                    size="small"
                                    onChange={(e) => handleStateChange('movement_type', e.target.value)}
                                >
                                    <MenuItem value="all" sx={{ fontWeight: 600 }}>All </MenuItem>
                                    <MenuItem value="IN">STOCK IN</MenuItem>
                                    <MenuItem value="OUT">STOCK OUT</MenuItem>
                                    {/* <MenuItem value="RETURN">STOCK RETURN</MenuItem> */}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="medium"
                                    startIcon={<RefreshOutlined />}
                                    onClick={handleResetFilters}
                                    sx={{
                                        fontWeight: '600',
                                        py: 1,
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                        borderColor: '#1976d2'
                                    }}
                                >
                                    Reset Filters
                                </Button>
                            </Grid>
                        </Stack>
                    </Grid>
                </Grid>


                <TableContainer component={Paper} elevation={0} sx={{
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'light' ? '#e0e0e0' : 'rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    mb: 3
                }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : 'rgba(25, 118, 210, 0.08)' }}>
                                <TableCell sx={{ fontWeight: '600' }}>
                                    <Tooltip title="Sort by Product Name" arrow>
                                        <TableSortLabel
                                            active={sortField === "product_name"}
                                            direction={sortField === "product_name" ? sortOrder : "asc"}
                                            onClick={() => handleSortRequest("product_name")}
                                        >
                                            Product Name
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: '600', whiteSpace: 'nowrap' }}>
                                    Purchase
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: '600', whiteSpace: 'nowrap' }}>
                                    Sales
                                </TableCell>
                                <TableCell sx={{ fontWeight: '600', whiteSpace: 'nowrap' }}>
                                    Unit Price
                                </TableCell>
                                <TableCell sx={{ fontWeight: '600' }}>
                                    Invoice No.
                                </TableCell>
                                <TableCell sx={{ fontWeight: '600', whiteSpace: 'nowrap' }}>
                                    Party Name
                                </TableCell>
                                <TableCell sx={{ fontWeight: '600' }}>
                                    <Tooltip title="Sort by Date" arrow>
                                        <TableSortLabel
                                            active={sortField === "created_at"}
                                            direction={sortField === "created_at" ? sortOrder : "asc"}
                                            onClick={() => handleSortRequest("created_at")}
                                        >
                                            Date
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                                {/*<TableCell align="center" sx={{ fontWeight: '600' }}>Actions</TableCell>*/}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stockMovement?.map((item) => (
                                <TableRow
                                    key={item?._id || `item-${Math.random()}`}
                                    sx={{
                                        '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(182, 185, 188, 0.15)' : '#f1f8ff', },
                                        backgroundColor: item?.voucher_type === "Sales" ? 'rgba(244, 67, 54, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Typography variant="body2" fontWeight="500">
                                            {(item?.item || 'Unnamed Product')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{
                                        backgroundColor: item?.voucher_type === "Purchase" ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                                        fontWeight: item?.voucher_type === "Purchase" ? '600' : 'normal'
                                    }}>
                                        {item?.voucher_type === "Purchase" && (item?.quantity || 0)}
                                    </TableCell>
                                    <TableCell align="center" sx={{
                                        backgroundColor: item?.voucher_type === "Sales" ? 'rgba(244, 67, 54, 0.1)' : 'transparent',
                                        fontWeight: item?.voucher_type === "Sales" ? '600' : 'normal'
                                    }}>
                                        {item?.voucher_type === "Sales" && (item?.quantity || 0)}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: '500' }}>₹ {item?.rate || 0}</TableCell>
                                    <TableCell>{item?.voucher_number || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="500">
                                            {item?.party_name || 'N/A'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="500">
                                            {item?.created_at ? formatDate(item.created_at) : 'N/A'}
                                        </Typography>
                                    </TableCell>
                                    {/* <TableCell>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                sx={{
                                                    bgcolor: 'rgba(83, 193, 116, 0.19)',
                                                    '&:hover': { bgcolor: 'rgba(34, 238, 41, 0.31)' }
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                sx={{
                                                    bgcolor: 'rgba(244, 67, 54, 0.1)',
                                                    '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' }
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                    }}
                >
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        {`Showing ${(pageMeta?.page - 1) * limit + 1}-${Math.min(
                            pageMeta?.page * limit,
                            pageMeta?.total
                        )} of ${pageMeta?.total} items`}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TextField
                            select
                            label="Show"
                            value={limit}
                            onChange={(e) => handleStateChange('limit', e.target.value)}
                            size="small"
                        >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                        </TextField>
                        <Pagination
                            count={Math.ceil(pageMeta?.total / limit)}
                            page={pageMeta?.page}
                            onChange={handleChangePage}
                            color="primary"
                            showFirstButton
                            showLastButton
                        />
                    </Box>

                </Box>
                {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Pagination
                        count={pageMeta?.total}
                        page={page_no}
                        onChange={handleChangePage}
                        color="primary"
                        shape="rounded"
                        siblingCount={0}
                    />
                    <FormControl size="small" sx={{ width: 80 }}>
                        <Select
                            value={limit}
                            displayEmpty
                        >
                            <MenuItem value="10">10</MenuItem>
                            <MenuItem value="25">25</MenuItem>
                            <MenuItem value="50">50</MenuItem>
                        </Select>
                    </FormControl>
                </Box> */}
            </Box>
        </LocalizationProvider>
    );
};

export default Timeline;