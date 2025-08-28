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
    MenuItem,
    TableSortLabel,
    useTheme,
    Skeleton,
    alpha,
} from '@mui/material';
import {
    RefreshOutlined,
    Search as SearchIcon,
    Inventory as InventoryIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { getStockMovement } from '@/services/inventory';
import { SortField, SortOrder } from '@/utils/types';
import { BottomPagination } from '@/common/modals/BottomPagination';

const Timeline: React.FC = () => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const { stockMovement, timelinePageMeta } = useSelector((state: RootState) => state.inventory);
    const [debounceQuery, setDebounceQuery] = useState<string>('');
    const { user, current_company_id } = useSelector((state: RootState) => state.auth);
    const currentCompanyId = current_company_id || localStorage.getItem("current_company_id") || user?.user_settings?.current_company_id || '';
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState({
        search: '',
        category: 'all',
        page_no: 1,
        limit: 30,
        startDate: new Date('2025-04-01'),
        endDate: new Date('2026-03-31'),
        sortField: "item" as SortField,
        sortOrder: "desc" as SortOrder,
    });

    const { search, page_no, limit, startDate, endDate, category, sortField, sortOrder } = data;

    const handleSortRequest = (field: SortField) => {
        const isAsc = sortField === field && sortOrder === "asc";
        setData((prevState) => ({
            ...prevState,
            sortOrder: isAsc ? "desc" : "asc",
            sortField: field,
        }));
    };

    const fetchMovement = useCallback(async () => {
        setLoading(true);
        dispatch(
            getStockMovement({
                search: debounceQuery,
                page_no: page_no,
                company_id: currentCompanyId,
                category: category === 'all' ? '' : category,
                limit: limit,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                sortField: sortField,
                sortOrder: sortOrder,
            })
        ).unwrap().then(() => {
            setLoading(false);
        }).catch((error: any) => {
            setLoading(false);
            console.error("Error fetching stock movement:", error);
        });
    }, [dispatch, debounceQuery, page_no, limit, startDate, currentCompanyId, category, endDate, sortField, sortOrder]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceQuery(search);
        }, 300);
        return () => clearTimeout(handler);
    }, [search]);

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

    const clearFilters = () => {
        setData({
            search: '',
            category: 'all',
            startDate: new Date('2025-04-01'),
            endDate: new Date('2026-03-31'),
            page_no: 1,
            sortField: "item",
            sortOrder: "desc",
            limit: 30,
        });
    };

    useEffect(() => {
        fetchMovement();
    }, []);

    useEffect(() => {
        fetchMovement();
    }, [dispatch, endDate, limit, page_no, category, debounceQuery, sortField,currentCompanyId, sortOrder, startDate, fetchMovement]);

    const formatNumber = (num: number, decimals: number = 2) => {
        if (num === null || num === undefined) return '0.00';
        return Number(num).toLocaleString('en-IN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    };

    const formatCurrency = (num: number) => {
        if (num === null || num === undefined) return '₹ 0.00';
        return `₹ ${formatNumber(num)}`;
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ width: "100%", p: { xs: 2, md: 3 } }}>
                {/* Header Card */}
                <Card sx={{ mb: 3, p: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                    <CardContent>
                        <Grid item xs={12} md={12}>
                            <Typography variant="h5" component="h1" fontWeight="700" color="text.primary">
                                Inventory Timeline
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Track all stock movements, analyze trends, and monitor inventory performance
                            </Typography>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Filters Section */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={12}>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            alignItems="center"
                        >
                            <Grid item xs={12} sm={5} md={5}>
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

                            <Grid item xs={12} md={1.5}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Show"
                                    value={limit}
                                    onChange={(e) => handleStateChange('limit', e.target.value)}
                                    size="small"
                                >
                                    <MenuItem value={30}>30</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                    <MenuItem value={500}>500</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={1.5}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="medium"
                                    startIcon={<RefreshOutlined />}
                                    onClick={() => clearFilters()}
                                    sx={{
                                        fontWeight: '600',
                                        py: 1,
                                        width: '100%',
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

                {/* Data Table */}
                <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                    <TableContainer sx={{}}>
                        <Table stickyHeader sx={{ minWidth: 1400 }}>
                            <TableHead>
                                {/* Main Header */}
                                <TableRow sx={{
                                    "& .MuiTableCell-root": {
                                        padding: '8px 16px',
                                    },
                                }}>
                                    <TableCell
                                        rowSpan={2}
                                        sx={{
                                            fontWeight: 700,
                                            backgroundColor: 'primary.main',
                                            color: 'primary.contrastText',
                                            borderRight: '1px solid rgba(255,255,255,0.2)',
                                            zIndex: 3
                                        }}
                                    >
                                        Sr. No.
                                    </TableCell>
                                    <TableCell
                                        rowSpan={2}
                                        sx={{
                                            fontWeight: 700,
                                            backgroundColor: 'primary.main',
                                            color: 'primary.contrastText',
                                            borderRight: '1px solid rgba(255,255,255,0.2)',
                                            minWidth: 200,
                                            position: 'sticky',
                                            left: 0,
                                            zIndex: 3
                                        }}
                                    >
                                        <TableSortLabel
                                            sx={{
                                                '&.MuiTableSortLabel-root': { color: 'inherit' },
                                                '&.MuiTableSortLabel-root:hover': { color: 'inherit' },
                                                '& .MuiTableSortLabel-icon': { color: 'inherit !important' }
                                            }}
                                            onClick={() => handleSortRequest('item')}
                                        >
                                            Item Details (Unit)
                                        </TableSortLabel>
                                    </TableCell>

                                    {[
                                        { title: 'Opening Balance', color: 'info.main' },
                                        { title: 'Purchases', color: 'success.main' },
                                        { title: 'Sales', color: 'error.main' },
                                        { title: 'Gross Profit', color: 'warning.main' },
                                        { title: 'Current Stock', color: 'primary.main' }
                                    ].map((section, index) => (
                                        <TableCell
                                            key={section.title}
                                            align="center"
                                            colSpan={section.title === 'Gross Profit' ? 2 : 3}
                                            sx={{
                                                fontWeight: 700,
                                                backgroundColor: section.color,
                                                color: 'white',
                                                borderRight: index < 4 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                                                borderBottom: '1px solid rgba(255,255,255,0.2)'
                                            }}
                                        >
                                            {section.title}
                                        </TableCell>
                                    ))}
                                </TableRow>

                                {/* Sub Headers */}
                                <TableRow sx={{
                                    "& .MuiTableCell-root": {
                                        padding: '8px 16px',
                                    },
                                }}>
                                    {/* Opening Balance sub-headers */}
                                    {['QTY', 'Rate', 'Value'].map((header) => (
                                        <TableCell
                                            key={`opening-${header}`}
                                            align="center"
                                            sx={{
                                                fontWeight: 600,
                                                backgroundColor: 'info.light',
                                                color: 'info.contrastText',
                                                borderRight: '1px solid rgba(255,255,255,0.3)',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {header}
                                        </TableCell>
                                    ))}

                                    {/* Inwards sub-headers */}
                                    {['QTY', 'Rate', 'Value'].map((header) => (
                                        <TableCell
                                            key={`inwards-${header}`}
                                            align="center"
                                            sx={{
                                                fontWeight: 600,
                                                backgroundColor: 'success.light',
                                                color: 'success.contrastText',
                                                borderRight: '1px solid rgba(255,255,255,0.3)',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {header}
                                        </TableCell>
                                    ))}

                                    {/* Outwards sub-headers */}
                                    {['QTY', 'Rate', 'Value'].map((header) => (
                                        <TableCell
                                            key={`outwards-${header}`}
                                            align="center"
                                            sx={{
                                                fontWeight: 600,
                                                backgroundColor: 'error.light',
                                                color: 'error.contrastText',
                                                borderRight: '1px solid rgba(255,255,255,0.3)',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {header}
                                        </TableCell>
                                    ))}

                                    {/* Gross Profit sub-headers */}
                                    {['Value', 'Margin %'].map((header) => (
                                        <TableCell
                                            key={`profit-${header}`}
                                            align="center"
                                            sx={{
                                                fontWeight: 600,
                                                backgroundColor: 'warning.light',
                                                color: 'warning.contrastText',
                                                borderRight: '1px solid rgba(255,255,255,0.3)',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {header}
                                        </TableCell>
                                    ))}

                                    {/* Closing Balance sub-headers */}
                                    {['QTY', 'Rate', 'Value'].map((header, index) => (
                                        <TableCell
                                            key={`closing-${header}`}
                                            align="center"
                                            sx={{
                                                fontWeight: 600,
                                                backgroundColor: 'primary.light',
                                                color: 'primary.contrastText',
                                                borderRight: index < 2 ? '1px solid rgba(255,255,255,0.3)' : 'none',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <TableRow key={index} sx={{
                                            "& .MuiTableCell-root": {
                                                padding: '8px 16px',
                                            },
                                        }}>
                                            <TableCell >
                                                <Skeleton variant="text" width="60px" />
                                            </TableCell>
                                            <TableCell sx={{ position: 'sticky', left: 0, backgroundColor: 'background.paper', zIndex: 1, minWidth: 200, }}>
                                                <Skeleton variant="text" width="100%" />
                                            </TableCell>
                                            {Array.from({ length: 14 }).map((_, cellIndex) => (
                                                <TableCell key={cellIndex}>
                                                    <Skeleton variant="text" width="60px" />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (stockMovement?.length ?? 0) > 0 ? (
                                    stockMovement?.map((item, index) => {
                                        return (
                                            <TableRow
                                                key={item._id}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: 'action.hover',
                                                    },
                                                    backgroundColor: index % 2 === 0 ? 'white' : alpha("hsl(220, 20%, 88%)", .5),
                                                    "& .MuiTableCell-root": {
                                                        padding: '8px 16px',
                                                    },
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {/* Serial Number - Sticky */}
                                                <TableCell
                                                    sx={{
                                                        backgroundColor: index % 2 === 0 ? 'white' : "hsl(220, 20%, 88%)",
                                                        zIndex: 3,
                                                        textAlign: 'center',
                                                        borderRight: '1px solid',
                                                        borderRightColor: 'divider'
                                                    }}
                                                >
                                                    {index + 1 + ((timelinePageMeta.page - 1) * limit)}
                                                </TableCell>
                                                <TableCell
                                                    className="sticky-cell"
                                                    sx={{
                                                        position: 'sticky',
                                                        left: 0,
                                                        backgroundColor: index % 2 === 0 ? 'white' : "hsl(220, 20%, 88%)",
                                                        zIndex: 3,
                                                        minWidth: 200,
                                                        borderRight: '1px solid',
                                                        borderRightColor: 'divider'
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 0.5 }}>
                                                        <Typography fontWeight={600} sx={{ fontSize: '0.8rem' }} noWrap>
                                                            {item.item.length > 35 ? item.item.slice(0, 35) + '...' : item.item || 'Unnamed Product'}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" fontWeight={500} noWrap>
                                                            {item.unit || 'PCS'}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>

                                                {/* Opening Balance */}
                                                <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                                                    {formatNumber(item.opening_qty)}
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontSize: '0.75rem' }}>
                                                    {formatNumber(item.opening_rate)}
                                                </TableCell>
                                                <TableCell align="right" sx={{
                                                    fontSize: '0.8rem', fontWeight: 600, borderRight: '1px solid',
                                                    borderRightColor: 'divider'
                                                }}>
                                                    {formatCurrency(item.opening_val)}
                                                </TableCell>

                                                {/* Inwards */}
                                                <TableCell align="right" sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>
                                                    {item.inwards_qty > 0 ? formatNumber(item.inwards_qty) : '—'}
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>
                                                    {item.inwards_qty > 0 ? formatNumber(item.inwards_rate) : '—'}
                                                </TableCell>
                                                <TableCell align="right" sx={{
                                                    fontSize: '0.8rem', fontWeight: 600, color: 'text.primary', borderRight: '1px solid',
                                                    borderRightColor: 'divider'
                                                }}>
                                                    {item.inwards_val > 0 ? formatCurrency(item.inwards_val) : '—'}
                                                </TableCell>

                                                {/* Outwards */}
                                                <TableCell align="right" sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>
                                                    {item.outwards_qty > 0 ? formatNumber(item.outwards_qty) : '—'}
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>
                                                    {item.outwards_qty > 0 ? formatNumber(item.outwards_rate) : '—'}
                                                </TableCell>
                                                <TableCell align="right" sx={{
                                                    fontSize: '0.8rem', fontWeight: 600, color: 'text.primary', borderRight: '1px solid',
                                                    borderRightColor: 'divider'
                                                }}>
                                                    {item.outwards_val > 0 ? formatCurrency(item.outwards_val) : '—'}
                                                </TableCell>

                                                {/* Gross Profit */}
                                                <TableCell align="right" sx={{ fontSize: '0.8rem', fontWeight: 700, color: item.gross_profit >= 0 ? 'success.main' : 'error.main' }}>
                                                    {formatCurrency(item.gross_profit)}
                                                </TableCell>
                                                <TableCell align="right" sx={{
                                                    fontSize: '0.8rem', fontWeight: 600, color: item.profit_percent >= 0 ? 'success.main' : 'error.main', borderRight: '1px solid',
                                                    borderRightColor: 'divider'
                                                }}>
                                                    {formatNumber(item.profit_percent)}%
                                                </TableCell>

                                                {/* Closing Balance */}
                                                <TableCell align="right" sx={{ fontSize: '0.75rem', color: item.closing_qty < 0 ? 'error.main' : 'text.primary' }}>
                                                    {formatNumber(item.closing_qty)}
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontSize: '0.75rem', color: item.closing_rate < 0 ? 'error.main' : 'text.primary' }}>
                                                    {formatNumber(item.closing_rate)}
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontSize: '0.8rem', fontWeight: 600, color: item.closing_val < 0 ? 'error.main' : 'success.main' }}>
                                                    {formatCurrency(item.closing_val)}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })

                                ) : (
                                    <TableRow sx={{
                                        "& .MuiTableCell-root": {
                                            padding: '8px 16px',
                                        },
                                    }}>
                                        <TableCell colSpan={16} align="center">
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, my: 8 }}>
                                                <InventoryIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                                                <Typography variant="h6" color="text.secondary" fontWeight={600}>
                                                    No Records Found
                                                </Typography>
                                                <Typography variant="body2" color="text.disabled" sx={{ maxWidth: 400, textAlign: 'center' }}>
                                                    Try adjusting your filters or date range, or add some inventory transactions to see data here.
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {loading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <TableRow key={index} sx={{
                                            "& .MuiTableCell-root": {
                                                padding: '8px 16px',
                                            },
                                        }}>
                                            <TableCell >
                                                <Skeleton variant="text" width="60px" />
                                            </TableCell>
                                            <TableCell sx={{ position: 'sticky', left: 0, backgroundColor: 'background.paper', zIndex: 1, minWidth: 200, }}>
                                                <Skeleton variant="text" width="100%" />
                                            </TableCell>
                                            {Array.from({ length: 14 }).map((_, cellIndex) => (
                                                <TableCell key={cellIndex}>
                                                    <Skeleton variant="text" width="60px" />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (stockMovement?.length ?? 0) > 0 && (
                                    <>
                                        <TableRow
                                            sx={{
                                                "& .MuiTableCell-root": {
                                                    padding: '8px 16px',
                                                    bgcolor: alpha(theme.palette.primary.light, 0.3),
                                                },
                                            }}
                                        >
                                            <TableCell colSpan={16}>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: 'action.hover',
                                                },
                                                backgroundColor: alpha("hsl(220, 20%, 88%)", .5),
                                                "& .MuiTableCell-root": {
                                                    padding: '8px 16px',
                                                },
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            <TableCell
                                                className="sticky-cell"
                                                sx={{
                                                    backgroundColor: "hsl(220, 20%, 88%)",
                                                    zIndex: 3,
                                                    textAlign: 'center',
                                                    // borderRight: '1px solid',
                                                    // borderRightColor: 'divider'
                                                }}
                                            >

                                            </TableCell>
                                            <TableCell
                                                className="sticky-cell"
                                                sx={{
                                                    position: 'sticky',
                                                    left: 0,
                                                    backgroundColor: "hsl(220, 20%, 88%)",
                                                    zIndex: 1,
                                                    minWidth: 200,
                                                    borderRight: '1px solid',
                                                    borderRightColor: 'divider'
                                                }}
                                            >
                                                <Box>
                                                    <Typography fontWeight={700} sx={{ fontSize: '1rem' }} noWrap>
                                                        Totals
                                                    </Typography>
                                                </Box>
                                            </TableCell>

                                            {/* Opening Balance */}
                                            <TableCell align="right" sx={{ fontSize: '0.75rem' }}>

                                            </TableCell>
                                            <TableCell align="right" sx={{ fontSize: '0.75rem' }}>

                                            </TableCell>
                                            <TableCell align="right" sx={{
                                                fontSize: '1.2rem', fontWeight: 600, borderRight: '1px solid',
                                                borderRightColor: 'divider'
                                            }}>
                                                {formatCurrency(timelinePageMeta.opening_val)}
                                            </TableCell>

                                            {/* Inwards */}
                                            <TableCell align="right" sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>

                                            </TableCell>
                                            <TableCell align="right" sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>

                                            </TableCell>
                                            <TableCell align="right" sx={{
                                                fontSize: '1.2rem', fontWeight: 600, color: 'text.primary', borderRight: '1px solid',
                                                borderRightColor: 'divider'
                                            }}>
                                                {formatCurrency(timelinePageMeta.inwards_val)}
                                            </TableCell>

                                            {/* Outwards */}
                                            <TableCell align="right" sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>

                                            </TableCell>
                                            <TableCell align="right" sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>

                                            </TableCell>
                                            <TableCell align="right" sx={{
                                                fontSize: '1.2rem', fontWeight: 600, color: 'text.primary', borderRight: '1px solid',
                                                borderRightColor: 'divider'
                                            }}>
                                                {formatCurrency(timelinePageMeta.outwards_val)}
                                            </TableCell>

                                            {/* Gross Profit */}
                                            <TableCell align="right" sx={{ fontSize: '1rem', fontWeight: 700, color: timelinePageMeta.gross_profit >= 0 ? 'success.main' : 'error.main' }}>
                                                {formatCurrency(timelinePageMeta.gross_profit)}
                                            </TableCell>
                                            <TableCell align="right" sx={{
                                                fontSize: '1.2rem', fontWeight: 600, color: timelinePageMeta.profit_percent >= 0 ? 'success.main' : 'error.main', borderRight: '1px solid',
                                                borderRightColor: 'divider'
                                            }}>
                                                {formatCurrency(timelinePageMeta.profit_percent)}%
                                            </TableCell>

                                            {/* Closing Balance */}
                                            <TableCell align="right" sx={{ fontSize: '0.75rem', color: 'text.primary' }}>

                                            </TableCell>
                                            <TableCell align="right" sx={{ fontSize: '0.75rem', color: 'text.primary' }}>

                                            </TableCell>
                                            <TableCell align="right" sx={{ fontSize: '1.2rem', fontWeight: 600, color: timelinePageMeta.closing_val < 0 ? 'error.main' : 'success.main' }}>
                                                {formatCurrency(timelinePageMeta.closing_val)}
                                            </TableCell>
                                        </TableRow>
                                    </>

                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* Pagination */}
                <Box sx={{ mt: 2 }}>
                    <BottomPagination
                        total={timelinePageMeta.total}
                        item="items"
                        page={timelinePageMeta?.page}
                        metaPage={timelinePageMeta.page}
                        rowsPerPage={limit}
                        onChange={handleChangePage}
                    />
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default Timeline;