import React, { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Grid,
    InputAdornment,
    Paper,
    TextField,
    Typography,
    MenuItem,
    Card,
    IconButton,
    Chip,
    Fade,
    alpha,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import RefreshOutlined from '@mui/icons-material/RefreshOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';

import { useNavigate } from 'react-router-dom';
import { SummarySortField, SortOrder } from '@/utils/types';
import { ArrowBack, Receipt } from '@mui/icons-material';
import { ActionButton } from "@/common/buttons/ActionButton";
import InventoryStockCardSkeleton from '@/common/skeletons/InventoryStockCardSkeleton';
import toast from 'react-hot-toast';
import { getBillSummary, getHSNSummary, getPartySummary, getSummaryStats } from '@/services/inventory';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import HSNSummaryTable from '@/features/Reports/HSN/HSNSummaryTable';
import CustomerSummaryTable from '@/features/Reports/Customer/CustomerSummaryTable';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import BillSummaryTable from '@/features/Reports/Bill/BillSummaryTable';

// Enhanced Styled Components
const StockCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
    },
    borderRadius: 16,
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        opacity: 0.1,
        transition: 'all 0.3s ease',
    },
    '&:hover::before': {
        transform: 'scale(1.2)',
        opacity: 0.15,
    },
}));


const SummaryTypeButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
    borderRadius: 12,
    padding: theme.spacing(1, 2),
    textTransform: 'none',
    fontWeight: 600,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: active ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.08),
    color: active ? theme.palette.primary.contrastText : theme.palette.primary.main,
    border: `2px solid ${active ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.2)}`,
    '&:hover': {
        backgroundColor: active ? theme.palette.primary.dark : alpha(theme.palette.primary.main, 0.15),
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4],
    },
}));



// Summary type options
const summaryTypes = [
    { key: 'hsn', label: 'HSN-wise', icon: <CategoryIcon /> },
    { key: 'party', label: 'Customer-wise', icon: <PeopleIcon /> },
    { key: 'bill', label: 'Bill-wise', icon: <Receipt /> },
];

const Summary: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [isLoading, setLoading] = useState(false);
    const [debounceQuery, setDebounceQuery] = useState<string>('');
    const [isStatsLoading, setIsStatsLoading] = useState(false);
    const { hsnSummaryData, partySummaryData, hsnPageMeta, partyPageMeta, summaryStats, invoiceSummaryData, invoicePageMeta } = useSelector((state: RootState) => state.inventory);
    const { user, current_company_id } = useSelector((state: RootState) => state.auth);
    const currentCompanyId = current_company_id || localStorage.getItem("current_company_id") || user?.user_settings?.current_company_id || '';
    const [activeSummaryType, setActiveSummaryType] = useState('hsn');

    const [data, setData] = useState({
        search: '',
        category: 'all',
        group: 'all',
        page_no: 1,
        limit: 10,
        startDate: new Date('2025-04-01'),
        endDate: new Date('2026-03-31'),
        sortField: "date" as SummarySortField,
        sortOrder: "asc" as SortOrder,
    });
    const { search, category, page_no, startDate, endDate, limit, sortField, sortOrder } = data;

    const fetchSummary = useCallback(async () => {
        setLoading(true);
        dispatch(
            getHSNSummary({
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
            toast.error("Error fetching summary");
            console.error("Error fetching summary:", error);
        });
    }, [dispatch, debounceQuery, page_no, limit, startDate, currentCompanyId, category, endDate, sortField, sortOrder]);

    const fetchPartySummary = useCallback(async () => {
        setLoading(true);
        dispatch(
            getPartySummary({
                search: debounceQuery,
                page_no: page_no,
                company_id: currentCompanyId,
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
            toast.error("Error fetching summary");
            console.error("Error fetching summary:", error);
        });
    }, [dispatch, debounceQuery, page_no, limit, startDate, currentCompanyId, endDate, sortField, sortOrder]);

    const fetchInvoiceSummary = useCallback(async () => {
        setLoading(true);
        dispatch(
            getBillSummary({
                search: debounceQuery,
                page_no: page_no,
                company_id: currentCompanyId,
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
            toast.error("Error fetching summary");
            console.error("Error fetching summary:", error);
        });
    }, [dispatch, debounceQuery, page_no, limit, startDate, currentCompanyId, endDate, sortField, sortOrder]);

    const fetchSummaryStats = useCallback(async () => {
        setIsStatsLoading(true);
        dispatch(
            getSummaryStats({
                company_id: currentCompanyId,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            })
        ).unwrap().then(() => {
            setIsStatsLoading(false);
        }).catch((error: any) => {
            setIsStatsLoading(false);
            toast.error("Error fetching summary Stats");
            console.error("Error fetching summary Stats:", error);
        });
    }, [dispatch, startDate, currentCompanyId, endDate]);


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceQuery(search);
        }, 300);
        return () => clearTimeout(handler);
    }, [search]);

    const handleSortRequest = (field: SummarySortField) => {
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
            group: 'all',
            page_no: 1,
            limit: 10,
            startDate: new Date('2025-04-01'),
            endDate: new Date('2026-03-31'),
            sortField: "created_at" as SummarySortField,
            sortOrder: "asc" as SortOrder,
        });
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

    const handleSummaryTypeChange = (type: string) => {
        setActiveSummaryType(type);
        if (type === 'party') fetchPartySummary();
        if (type === 'bill') fetchInvoiceSummary();
    };

    // const handleExport = () => {
    //     toast.success('Export functionality will be implemented');
    // };

    useEffect(() => {
        fetchSummary();
    }, []);

    useEffect(() => {
        if (activeSummaryType === 'hsn') {
            fetchSummary();
        } else if (activeSummaryType === 'party') {
            fetchPartySummary();
        } else if (activeSummaryType === 'bill') {
            fetchInvoiceSummary();
        }
    }, [
        activeSummaryType,
        dispatch,
        endDate,
        limit,
        page_no,
        category,
        debounceQuery,
        sortField,
        currentCompanyId,
        sortOrder,
        startDate,
        fetchSummary,
        fetchPartySummary,
        fetchInvoiceSummary
    ]);



    useEffect(() => {
        fetchSummaryStats();
    }, [dispatch, endDate, currentCompanyId, startDate, fetchSummaryStats]);



    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth={false} sx={{ mt: 3, width: '100%', scrollBehavior: 'smooth' }}>
                {/* Enhanced Header Section */}
                <Card sx={{ mb: 2, p: 2, borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                        <ActionButton
                            icon={<ArrowBack fontSize="small" />}
                            title="Back"
                            color="primary"
                            onClick={() => navigate(-1)}
                        />
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AssessmentIcon color="primary" />
                                    Summary Type
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Active View:
                                    </Typography>
                                    <Chip
                                        label={summaryTypes.find(t => t.key === activeSummaryType)?.label}
                                        color="primary"
                                        size="small"
                                        icon={summaryTypes.find(t => t.key === activeSummaryType)?.icon}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {summaryTypes.map((type, index) => (
                                        <Fade in timeout={600 + index * 100} key={type.key}>
                                            <SummaryTypeButton
                                                active={activeSummaryType === type.key}
                                                onClick={() => handleSummaryTypeChange(type.key)}
                                                startIcon={type.icon}
                                            >
                                                {type.label}
                                            </SummaryTypeButton>
                                        </Fade>
                                    ))}
                                </Box>
                                {/* Enhanced Action Buttons */}
                                {/* <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<GetAppIcon />}
                                        onClick={handleExport}
                                        sx={{
                                            bgcolor: alpha('#fff', 0.2),
                                            color: 'white',
                                            border: `1px solid ${alpha('#fff', 0.3)}`,
                                            '&:hover': {
                                                bgcolor: alpha('#fff', 0.3),
                                                color: 'black',
                                                borderColor: alpha('#000', 0.5),
                                                transform: 'translateY(-2px)',
                                            },
                                            borderRadius: 1,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                        }}
                                    >
                                        Export Report
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<Print />}
                                        onClick={handleExport}
                                        sx={{
                                            bgcolor: alpha('#fff', 0.2),
                                            color: 'white',
                                            border: `1px solid ${alpha('#fff', 0.3)}`,
                                            '&:hover': {
                                                bgcolor: alpha('#fff', 0.3),
                                                color: 'black',
                                                borderColor: alpha('#000', 0.5),
                                                transform: 'translateY(-2px)',
                                            },
                                            borderRadius: 1,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                        }}
                                    >
                                        Print Report
                                    </Button>
                                </Box> */}
                            </Box>

                        </Box>
                    </Box>
                </Card>

                {/* Enhanced Stock Summary Cards */}
                {isStatsLoading ? (
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <InventoryStockCardSkeleton color='#ffebee' border='5px solid #c62828' />
                        <InventoryStockCardSkeleton color='hsl(45, 92%, 90%)' border='5px solid hsl(45, 90%, 40%)' />
                        <InventoryStockCardSkeleton color='#e8f5e9' border='5px solid #2e7d32' />
                        <InventoryStockCardSkeleton color='#e8f4fd' border='5px solid #1976d2' />
                        <InventoryStockCardSkeleton color='#fff8e1' border='5px solid #ff9800' />
                    </Grid>
                ) : (
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        {[
                            {
                                title: 'Total HSN/SAC Codes',
                                value: `${summaryStats.total_hsn} HSN/SAC Codes`,
                                desc: 'Total unique HSN/SAC Codes in your inventory',
                                color: '#ffebee',
                                borderColor: '#c62828',
                                icon: <InventoryIcon sx={{ fontSize: 40, opacity: 0.3 }} />,
                                trend: '+12%'
                            },
                            {
                                title: 'Total Invoices',
                                value: `${summaryStats.total_invoices} Invoices`,
                                desc: 'Total invoices generated from your inventory',
                                color: 'hsl(45, 92%, 90%)',
                                borderColor: 'hsl(45, 90%, 40%)',
                                icon: <AssessmentIcon sx={{ fontSize: 40, opacity: 0.3 }} />,
                                trend: '+8%'
                            },
                            {
                                title: 'Total Customers',
                                value: `${summaryStats.total_party} Customers`,
                                desc: 'Total customers who have made purchases or sales',
                                color: '#e8f5e9',
                                borderColor: '#2e7d32',
                                icon: <PeopleIcon sx={{ fontSize: 40, opacity: 0.3 }} />,
                                trend: '+5%'
                            },
                            {
                                title: 'Monthly Revenue',
                                value: `₹${summaryStats.total_revenue}`,
                                desc: 'Total revenue generated in this period',
                                color: '#e8f4fd',
                                borderColor: '#1976d2',
                                icon: <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.3 }} />,
                                trend: '+15%'
                            },
                            {
                                title: 'Tax Amount',
                                value: `₹${summaryStats.total_tax}`,
                                desc: 'Total tax amount for this period',
                                color: '#fff8e1',
                                borderColor: '#ff9800',
                                icon: <AssessmentIcon sx={{ fontSize: 40, opacity: 0.3 }} />,
                                trend: '+10%'
                            },
                        ].map((item, index) => (
                            <Grid item xs={12} sm={6} md={2.4} key={index}>
                                <Fade in timeout={800 + index * 100}>
                                    <StockCard sx={{
                                        bgcolor: item.color,
                                        borderLeft: `5px solid ${item.borderColor}`,
                                        position: 'relative',
                                    }}>
                                        <Box sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            color: item.borderColor
                                        }}>
                                            {/* <Tooltip title={`${item.trend} from last month`} arrow>
                                                <Chip
                                                    label={item.trend}
                                                    size="small"
                                                    color="success"
                                                    sx={{ fontSize: '0.7rem', height: 20 }}
                                                />
                                            </Tooltip> */}
                                        </Box>
                                        <Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Typography variant="subtitle2" sx={{ color: theme.palette.grey[600], fontWeight: 600 }}>
                                                    {item.title}
                                                </Typography>
                                                <Box sx={{
                                                    color: item.borderColor
                                                }}>

                                                    {item.icon}
                                                </Box>
                                            </Box>
                                            <Typography variant="h5" component="div" fontWeight="700" sx={{ color: item.borderColor }}>
                                                {item.value}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: theme.palette.grey[600] }}>
                                                {item.desc}
                                            </Typography>
                                        </Box>
                                    </StockCard>
                                </Fade>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Enhanced Search and Filter section */}
                <Grid container spacing={2} justifyContent={"space-between"} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            placeholder="Search by product name, HSN, or category..."
                            variant="outlined"
                            fullWidth
                            value={search}
                            onChange={(e) => handleStateChange('search', e.target.value)}
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                    }
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="primary" />
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
                    <Grid item >
                        <DatePicker
                            label="Start Date"
                            value={new Date(startDate)}
                            format="dd/MM/yyyy"
                            views={["year", "month", "day"]}
                            onChange={(newValue) => handleStateChange("startDate", newValue)}
                            slotProps={{
                                textField: {
                                    size: "small",
                                    sx: {
                                        '& .MuiOutlinedInput-root': {
                                            width: "150px",
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
                    <Grid item >
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            format="dd/MM/yyyy"
                            views={["year", "month", "day"]}
                            onChange={(newValue) => handleStateChange("endDate", newValue)}
                            slotProps={{
                                textField: {
                                    size: "small",
                                    sx: {
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                            width: "150px",
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
                            label="Show"
                            fullWidth
                            value={limit}
                            onChange={(e) => handleStateChange('limit', e.target.value)}
                            size="small"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1, } }}
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
                            sx={{
                                borderRadius: 1,
                                textTransform: 'none',
                                fontWeight: 600,
                                height: '40px',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-1px)',
                                }
                            }}
                        >
                            Reset Filters
                        </Button>
                    </Grid>
                </Grid>

                {/* Enhanced Summary Table */}
                <Box>
                    {activeSummaryType === 'hsn' && <HSNSummaryTable
                        summaryData={hsnSummaryData as []}
                        sortRequest={handleSortRequest}
                        isLoading={isLoading}
                        stateChange={handleStateChange}
                        pageChange={handleChangePage}
                        limit={limit}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        pageMeta={hsnPageMeta}
                    />}
                    {activeSummaryType === 'party' && <CustomerSummaryTable
                        summaryData={partySummaryData as []}
                        sortRequest={handleSortRequest}
                        isLoading={isLoading}
                        stateChange={handleStateChange}
                        pageChange={handleChangePage}
                        limit={limit}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        pageMeta={partyPageMeta}
                    />}
                    {activeSummaryType === 'bill' && <BillSummaryTable
                        summaryData={invoiceSummaryData as []}
                        sortRequest={handleSortRequest}
                        isLoading={isLoading}
                        stateChange={handleStateChange}
                        pageChange={handleChangePage}
                        limit={limit}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        pageMeta={invoicePageMeta}
                    />}
                </Box>
            </Container>
        </LocalizationProvider>
    );
};

export default Summary;