import React, { useState, useMemo, useEffect } from 'react';
import {
    Box, Card, CardContent, Grid, Typography, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, Chip,
    Stack, Button, Tooltip, IconButton, Dialog, DialogTitle, DialogContent,
    useTheme
} from '@mui/material';
import {
    LineChart,
    BarChart
} from '@mui/x-charts';
import {
    Info as InfoIcon,
    TrendingUp as TrendingUpIcon,
    WarningAmber as WarningIcon
} from '@mui/icons-material';

import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminAnalytics } from '@/services/analytics';



const UserPharmacyManagement: React.FC = () => {
    const theme = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const { adminAnalyticsData } = useSelector((state: RootState) => state.analytics);
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [selectedPharmacy, setSelectedPharmacy] = useState<string>(adminAnalyticsData?.chemist_wise_total_sales[0]?.chemistId || '');
    const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);

    const selectedPharmacyData = useMemo(() =>
        adminAnalyticsData?.chemist_wise_total_sales.find(p => p.chemistId === selectedPharmacy),
        [adminAnalyticsData?.chemist_wise_total_sales, selectedPharmacy]
    );

    const calculatePerformanceMetrics = (pharmacyId: string) => {
        const selectedPharmacyData = adminAnalyticsData?.chemist_wise_total_sales.find(
            p => p.chemistId === pharmacyId
        );

        if (!selectedPharmacyData?.data) {
            return {
                growthRate: 0.0,
                stockUtilizationRate: 0.0
            };
        }

        const labels = selectedPharmacyData.data.labels ?? [];
        const data = selectedPharmacyData.data.data ?? [];

        // Build a full 12-month array (0s for missing months)
        const fullYearSales = Array(12).fill(0);
        labels.forEach((label, idx) => {
            const month = parseInt(label.split('-')[1], 10); // "2025-03" → 3
            if (!isNaN(month) && month >= 1 && month <= 12) {
                fullYearSales[month - 1] = data[idx];
            }
        });

        // Extract the last two non-zero months for growth rate
        const nonZeroSales = fullYearSales
            .map((value, idx) => ({ value, idx }))
            .filter(entry => entry.value !== 0);

        let growthRate = 0.0;
        if (nonZeroSales.length >= 2) {
            const first = nonZeroSales[nonZeroSales.length - 2].value;
            const last = nonZeroSales[nonZeroSales.length - 1].value;
            if (first !== 0) {
                growthRate = ((last - first) / first) * 100;
            }
        }

        const stockPurchased = selectedPharmacyData.stockPurchased ?? 0;
        const remainingStock = selectedPharmacyData.remainingStock ?? 0;

        const stockUtilizationRate = stockPurchased === 0
            ? 0
            : ((stockPurchased - remainingStock) / stockPurchased) * 100;

        return {
            growthRate: parseFloat(growthRate.toFixed(1)),
            stockUtilizationRate: parseFloat(stockUtilizationRate.toFixed(1))
        };
    };


    const performanceMetrics = useMemo(() =>
        calculatePerformanceMetrics(selectedPharmacy),
        [calculatePerformanceMetrics]
    );

    // Color coding for performance
    const getPerformanceColor = (value: number) => {
        if (value > 20) return 'success';
        if (value > 10) return 'warning';
        return 'error';
    };

    const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const selectedChemist = adminAnalyticsData?.chemist_wise_total_sales.find(
        (p) => p.chemistId === selectedPharmacy
    );

    const fullYearSalesData = (() => {
        if (!selectedChemist?.data?.labels || !selectedChemist?.data?.data) return Array(12).fill(0);

        const { labels, data } = selectedChemist.data;

        const labelToIndexMap = labels.reduce((acc, label, idx) => {
            const month = parseInt(label.split('-')[1], 10); // '2025-03' -> 3
            acc[month - 1] = data[idx]; // Month index: 0-based
            return acc;
        }, Array(12).fill(0));

        return labelToIndexMap;
    })();

    useEffect(() => {
        // dispatch(getAdminAnalytics({ month: currentMonth.toString(), year: currentYear.toString() }));
        dispatch(getAdminAnalytics({ month: '2', year: '2025' }));
    }, [currentMonth, currentYear, dispatch]);

    return (
        <Box sx={{ p: 3, backgroundColor: theme.palette.mode === 'light' ? '#f4f6f8' : '#121212' }}>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                    fontWeight: 600,
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}
            >
                Pharmacy Performance Dashboard
                <Tooltip title="View performance insights and key metrics">
                    <IconButton color="primary">
                        <InfoIcon />
                    </IconButton>
                </Tooltip>
            </Typography>

            {/* Performance Overview Table */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                    <Card elevation={3}>
                        <CardContent>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Pharmacy Name</TableCell>
                                            <TableCell align="right">Total Sales</TableCell>
                                            <TableCell align="right">Stock Status</TableCell>
                                            <TableCell align="right">Performance</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {adminAnalyticsData?.chemist_wise_total_sales?.map((pharmacy) => (
                                            <TableRow
                                                key={pharmacy.chemistId}
                                                hover
                                                selected={selectedPharmacy === pharmacy.chemistId}
                                                onClick={() => setSelectedPharmacy(pharmacy.chemistId)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    '&.Mui-selected': {
                                                        backgroundColor: theme.palette.mode === 'light' ? 'primary.light' : 'primary.dark',
                                                        color: 'primary.contrastText'
                                                    }
                                                }}
                                            >
                                                <TableCell>{pharmacy.name}</TableCell>
                                                <TableCell align="right">
                                                    ${pharmacy.totalSales.toLocaleString()}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Chip
                                                        color={
                                                            pharmacy.remainingStock / pharmacy.stockPurchased < 0.2
                                                                ? 'error'
                                                                : 'success'
                                                        }
                                                        size="small"
                                                        label={`${((pharmacy.remainingStock / pharmacy.stockPurchased) * 100).toFixed(0)}% Remaining`}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Chip
                                                        icon={<TrendingUpIcon />}
                                                        color={getPerformanceColor(calculatePerformanceMetrics(pharmacy.chemistId).growthRate)}
                                                        size="small"
                                                        label={`${calculatePerformanceMetrics(pharmacy.chemistId).growthRate}%`}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => setOpenDetailModal(true)}
                                                    >
                                                        Details
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Performance Charts */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Monthly Sales: {selectedPharmacyData?.name}
                            </Typography>
                            <LineChart
                                xAxis={[{
                                    scaleType: 'point',
                                    data: MONTH_LABELS,
                                }]}
                                series={[{
                                    data: fullYearSalesData,
                                    area: true,
                                    showMark: false
                                }]}
                                height={300}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card elevation={3} sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Performance Metrics
                            </Typography>
                            <Stack spacing={2}>
                                <Chip
                                    color={getPerformanceColor(performanceMetrics.growthRate)}
                                    label={`Growth Rate: ${performanceMetrics.growthRate}%`}
                                    icon={<TrendingUpIcon />}
                                />
                                <Chip
                                    color={performanceMetrics.stockUtilizationRate > 80 ? 'success' : 'warning'}
                                    label={`Stock Utilization: ${performanceMetrics.stockUtilizationRate}%`}
                                    icon={<WarningIcon />}
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Detailed Pharmacy Modal */}
            <Dialog
                open={openDetailModal}
                onClose={() => setOpenDetailModal(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Detailed Pharmacy Performance: {selectedPharmacyData?.name}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1">Key Metrics</Typography>
                            <Stack spacing={1}>
                                <Chip label={`Total Sales: $${adminAnalyticsData?.chemist_wise_total_sales.find(p => p.chemistId === selectedPharmacy)?.totalSales.toLocaleString()}`} />
                                <Chip label={`Stock Purchased: ${adminAnalyticsData?.chemist_wise_total_sales.find(p => p.chemistId === selectedPharmacy)?.stockPurchased.toLocaleString()}`} />
                                <Chip label={`Stock Remaining: ${adminAnalyticsData?.chemist_wise_total_sales.find(p => p.chemistId === selectedPharmacy)?.remainingStock.toLocaleString()}`} />
                                <Chip label={`Pending Returns: ${adminAnalyticsData?.chemist_wise_total_sales.find(p => p.chemistId === selectedPharmacy)?.pendingStockAmount.toLocaleString()}`} />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <BarChart
                                xAxis={[{
                                    scaleType: 'band',
                                    data: ['Stock Purchased', 'Stock Remaining', 'Pending Returns']
                                }]}
                                series={[{
                                    data: [
                                        adminAnalyticsData?.chemist_wise_total_sales.find(p => p.chemistId === selectedPharmacy)?.stockPurchased || 0,
                                        adminAnalyticsData?.chemist_wise_total_sales.find(p => p.chemistId === selectedPharmacy)?.remainingStock || 0,
                                        adminAnalyticsData?.chemist_wise_total_sales.find(p => p.chemistId === selectedPharmacy)?.pendingStockAmount || 0
                                    ]
                                }]}
                                height={250}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default UserPharmacyManagement;